-- Libro de firmas: los invitados dejan un mensaje que ven los demás invitados del evento. Solo
-- existe si la pareja lo activa en el contenido publicado (guestbook = true). La pareja modera
-- desde el panel ocultando mensajes (hidden_at); no se borra nada.
-- También se enseñan a los invitados las canciones pedidas al confirmar, sin decir quién las pidió.

create table public.guestbook_messages (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  group_id uuid not null references public.guest_groups (id) on delete cascade,
  body text not null check (length(body) between 1 and 400),
  created_at timestamptz not null default now(),
  -- Ocultar un mensaje no borra la fila: deja de verse en las invitaciones.
  hidden_at timestamptz
);
create index guestbook_messages_event on public.guestbook_messages (event_id, created_at desc);
create index guestbook_messages_group on public.guestbook_messages (group_id);

alter table public.guestbook_messages enable row level security;
-- Los miembros del evento ven y moderan; los invitados pasan por las funciones de abajo.
create policy "miembros ven el libro de firmas" on public.guestbook_messages
  for select to authenticated using ((select private.is_event_member(event_id)));
create policy "miembros moderan el libro de firmas" on public.guestbook_messages
  for update to authenticated
  using ((select private.is_event_member(event_id)))
  with check ((select private.is_event_member(event_id)));
-- Moderar es solo ocultar o volver a mostrar: no se puede cambiar el texto ni el autor.
revoke update on public.guestbook_messages from authenticated;
grant update (hidden_at) on public.guestbook_messages to authenticated;

-- Lo que ve una invitación: mensajes visibles (los últimos 80) y canciones pedidas.
create function private.guestbook(p_event uuid, p_group uuid, p_enabled boolean) returns jsonb
language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'messages', case when p_enabled then coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', m.id, 'name', m.display_name, 'body', m.body,
        'createdAt', m.created_at, 'mine', m.group_id = p_group
      ) order by m.created_at desc)
      from (
        select gm.id, gm.body, gm.created_at, gm.group_id, g.display_name
        from public.guestbook_messages gm
        join public.guest_groups g on g.id = gm.group_id
        where gm.event_id = p_event and gm.hidden_at is null
        order by gm.created_at desc
        limit 80
      ) m
    ), '[]'::jsonb) else '[]'::jsonb end,
    'songs', coalesce((
      select jsonb_agg(s.song order by s.updated_at desc)
      from (
        select distinct on (lower(btrim(r.payload ->> 'song')))
          btrim(r.payload ->> 'song') as song, r.updated_at
        from public.rsvp_responses r
        where r.event_id = p_event and r.status = 'attending'
          and btrim(coalesce(r.payload ->> 'song', '')) <> ''
        order by lower(btrim(r.payload ->> 'song')), r.updated_at desc
        limit 120
      ) s
    ), '[]'::jsonb)
  );
$$;
revoke execute on function private.guestbook(uuid, uuid, boolean) from public, anon, authenticated;

-- Firmar el libro con el token de la invitación.
create function public.guestbook_sign(p_token text, p_body text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  v_group public.guest_groups;
  v_event public.events;
  v_body text := btrim(regexp_replace(coalesce(p_body, ''), '\s+', ' ', 'g'));
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
  if v_event.phase = 'save_the_date'
     or not coalesce((v_event.published_content ->> 'guestbook')::boolean, false) then
    raise exception 'El libro de firmas no está abierto' using errcode = '22023';
  end if;
  if length(v_body) < 1 or length(v_body) > 400 then
    raise exception 'Mensaje no válido' using errcode = '22023';
  end if;
  -- Como mucho tres mensajes por invitación (cuentan también los ocultos).
  perform pg_advisory_xact_lock(hashtext('libro/' || v_group.id::text));
  if (select count(*) from public.guestbook_messages where group_id = v_group.id) >= 3 then
    raise exception 'Demasiados mensajes' using errcode = '22023';
  end if;
  insert into public.guestbook_messages (event_id, group_id, body)
  values (v_event.id, v_group.id, v_body);
  return private.guestbook(v_event.id, v_group.id, true);
end;
$$;
revoke execute on function public.guestbook_sign(text, text) from public;
grant execute on function public.guestbook_sign(text, text) to anon, authenticated;
comment on function public.guestbook_sign(text, text) is
  'Público por diseño: firma el libro de firmas con el token de la invitación.';

-- La invitación lleva también el libro de firmas y las canciones pedidas.
create or replace function public.get_invitation(p_token text) returns jsonb
language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'event', e.published_content || jsonb_build_object('id', e.id, 'slug', e.slug),
    'theme', coalesce(e.published_theme, '{}'::jsonb),
    'phase', e.phase,
    'albumToken', e.album_token,
    'gifts', private.gift_status(e.id, g.id),
    'guestbook', private.guestbook(
      e.id, g.id, coalesce((e.published_content ->> 'guestbook')::boolean, false)
    ),
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
