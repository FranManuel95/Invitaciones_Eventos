-- Lista de regalos: la pareja apunta regalos en el contenido del evento (gift.items) y cada
-- invitación puede reservar uno («lo regalo yo»). Los regalos compartidos (gift.items[].shared,
-- por ejemplo el viaje) admiten a varias invitaciones a la vez. Los invitados solo ven cuántas
-- reservas hay; quién ha reservado qué solo lo ven los miembros del evento.

create table public.gift_claims (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  group_id uuid not null references public.guest_groups (id) on delete cascade,
  item_id text not null check (length(item_id) between 1 and 40),
  created_at timestamptz not null default now(),
  -- Deshacer una reserva no borra la fila: queda como registro (y no hace falta borrar nada).
  released_at timestamptz
);
-- Una reserva vigente por invitación y regalo.
create unique index gift_claims_active on public.gift_claims (event_id, item_id, group_id)
  where released_at is null;
create index gift_claims_group on public.gift_claims (group_id) where released_at is null;

alter table public.gift_claims enable row level security;
-- Los miembros del evento ven las reservas; los invitados pasan por las funciones de abajo.
create policy "miembros ven las reservas de regalos" on public.gift_claims
  for select to authenticated using ((select private.is_event_member(event_id)));

-- Estado de la lista para una invitación: reservas vigentes por regalo y las suyas.
create function private.gift_status(p_event uuid, p_group uuid) returns jsonb
language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'counts', coalesce((
      select jsonb_object_agg(c.item_id, c.n)
      from (
        select item_id, count(*) as n from public.gift_claims
        where event_id = p_event and released_at is null group by item_id
      ) c
    ), '{}'::jsonb),
    'mine', coalesce((
      select jsonb_agg(item_id order by created_at) from public.gift_claims
      where group_id = p_group and released_at is null
    ), '[]'::jsonb)
  );
$$;
revoke execute on function private.gift_status(uuid, uuid) from public, anon, authenticated;

-- Reservar (p_claim = true) o deshacer la reserva de un regalo con el token de la invitación.
create function public.gift_claim(p_token text, p_item text, p_claim boolean) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  v_group public.guest_groups;
  v_event public.events;
  v_item jsonb;
begin
  select * into v_group from public.guest_groups where token = p_token;
  if not found then
    raise exception 'Invitación no encontrada' using errcode = 'P0002';
  end if;
  select * into v_event from public.events
  where id = v_group.event_id and status = 'published' and published_content is not null;
  if not found then
    raise exception 'Invitación no encontrada' using errcode = 'P0002';
  end if;
  if v_event.phase = 'save_the_date' then
    raise exception 'La lista de regalos aún no está abierta' using errcode = '22023';
  end if;

  select i into v_item
  from jsonb_array_elements(coalesce(v_event.published_content -> 'gift' -> 'items', '[]'::jsonb)) i
  where i ->> 'id' = p_item;
  if v_item is null then
    raise exception 'Ese regalo ya no está en la lista' using errcode = 'P0002';
  end if;

  if p_claim then
    -- Un regalo no compartido es de una sola invitación: se bloquea mientras se comprueba.
    perform pg_advisory_xact_lock(hashtext(v_event.id::text || '/' || p_item));
    if not coalesce((v_item ->> 'shared')::boolean, false) and exists (
      select 1 from public.gift_claims
      where event_id = v_event.id and item_id = p_item and released_at is null
        and group_id <> v_group.id
    ) then
      raise exception 'Ese regalo ya lo ha reservado otra persona' using errcode = '23505';
    end if;
    if (select count(*) from public.gift_claims
        where group_id = v_group.id and released_at is null) >= 10 then
      raise exception 'Demasiadas reservas' using errcode = '22023';
    end if;
    insert into public.gift_claims (event_id, group_id, item_id)
    values (v_event.id, v_group.id, p_item)
    on conflict do nothing;
  else
    update public.gift_claims set released_at = now()
    where group_id = v_group.id and item_id = p_item and released_at is null;
  end if;

  return private.gift_status(v_event.id, v_group.id);
end;
$$;
revoke execute on function public.gift_claim(text, text, boolean) from public;
grant execute on function public.gift_claim(text, text, boolean) to anon, authenticated;
comment on function public.gift_claim(text, text, boolean) is
  'Público por diseño: reserva o libera un regalo de la lista con el token de la invitación.';

-- La invitación lleva también el estado de la lista de regalos.
create or replace function public.get_invitation(p_token text) returns jsonb
language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'event', e.published_content || jsonb_build_object('id', e.id, 'slug', e.slug),
    'theme', coalesce(e.published_theme, '{}'::jsonb),
    'phase', e.phase,
    'albumToken', e.album_token,
    'gifts', private.gift_status(e.id, g.id),
    'group', jsonb_build_object(
      'id', g.id,
      'token', g.token,
      'displayName', g.display_name,
      'category', g.category,
      'maxAttendees', g.max_attendees,
      'members', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', p.id, 'firstName', p.first_name, 'lastName', p.last_name,
          'isPrimary', p.is_primary, 'isChild', p.is_child
        ) order by p.sort, p.first_name)
        from public.guests p where p.group_id = g.id
      ), '[]'::jsonb),
      'table', (select t.name from public.tables t where t.id = g.table_id)
    ),
    'response', (select r.payload from public.rsvp_responses r where r.group_id = g.id)
  )
  from public.guest_groups g
  join public.events e on e.id = g.event_id
  where g.token = p_token and e.status = 'published' and e.published_content is not null;
$$;
