-- Álbum de los invitados: suben fotos desde un QR (o el enlace de la invitación) y la pareja las
-- modera antes de que se vean en el álbum. El álbum tiene su propio token por evento (el QR se
-- imprime para las mesas, así que no puede llevar el token de cada invitación).

alter table public.events add column album_token text not null unique default private.new_token();

create table public.guest_photos (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  path text not null unique,
  status text not null default 'pending' check (status in ('pending', 'approved', 'hidden')),
  created_at timestamptz not null default now()
);
create index guest_photos_event_status on public.guest_photos (event_id, status, created_at desc);

alter table public.guest_photos enable row level security;
-- Solo los miembros del evento ven y moderan; los invitados pasan por las funciones de abajo.
create policy "miembros ven fotos del álbum" on public.guest_photos
  for select to authenticated using ((select private.is_event_member(event_id)));
create policy "miembros moderan fotos del álbum" on public.guest_photos
  for update to authenticated
  using ((select private.is_event_member(event_id)))
  with check ((select private.is_event_member(event_id)));
create policy "miembros borran fotos del álbum" on public.guest_photos
  for delete to authenticated using ((select private.is_event_member(event_id)));

-- Huecos de subida: una ruta concreta, válida 10 minutos y de un solo uso (used_at). Sin hueco no
-- se puede subir nada. No se borran: sirven de registro y para el límite diario.
create table private.photo_slots (
  path text primary key,
  event_id uuid not null references public.events (id) on delete cascade,
  expires_at timestamptz not null,
  used_at timestamptz
);
revoke all on private.photo_slots from public, anon, authenticated;

-- ¿Hay un hueco vigente para esta ruta? La usa la política de subida del almacenamiento.
create function private.photo_slot_open(p_name text) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from private.photo_slots s
    where s.path = p_name and s.used_at is null and s.expires_at > now()
  );
$$;
grant usage on schema private to anon;
revoke execute on function private.photo_slot_open(text) from public;
grant execute on function private.photo_slot_open(text) to anon, authenticated;

-- Evento publicado del token del álbum (o nada).
create function private.album_event(p_token text) returns public.events
language sql stable security definer set search_path = '' as $$
  select e.* from public.events e
  where e.album_token = p_token and e.status = 'published' and e.published_content is not null;
$$;
revoke execute on function private.album_event(text) from public, anon, authenticated;

-- Datos del álbum: nombres, fecha, tema y fotos aprobadas.
create function public.album_info(p_token text) returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare
  v_event public.events;
begin
  v_event := private.album_event(p_token);
  if v_event.id is null then
    return null;
  end if;
  return jsonb_build_object(
    'eventId', v_event.id,
    'couple', v_event.published_content -> 'couple',
    'date', v_event.published_content -> 'date',
    'theme', coalesce(v_event.published_theme, '{}'::jsonb),
    'photos', coalesce((
      select jsonb_agg(jsonb_build_object('path', p.path, 'createdAt', p.created_at)
        order by p.created_at desc)
      from public.guest_photos p
      where p.event_id = v_event.id and p.status = 'approved'
    ), '[]'::jsonb)
  );
end;
$$;

-- Pide un hueco para subir una foto. Límite: 300 huecos por día y evento.
create function public.album_upload_slot(p_token text) returns text
language plpgsql security definer set search_path = '' as $$
declare
  v_event public.events;
  v_path text;
  v_recent int;
begin
  v_event := private.album_event(p_token);
  if v_event.id is null then
    raise exception 'Álbum no encontrado' using errcode = 'P0002';
  end if;
  select count(*) into v_recent from private.photo_slots
  where event_id = v_event.id and expires_at > now() - interval '1 day';
  if v_recent >= 300 then
    raise exception 'Hoy ya se han subido muchas fotos. Prueba mañana.' using errcode = '22023';
  end if;
  v_path := v_event.id::text || '/' || gen_random_uuid()::text || '.webp';
  insert into private.photo_slots (path, event_id, expires_at)
  values (v_path, v_event.id, now() + interval '10 minutes');
  return v_path;
end;
$$;

-- Confirma una subida: la foto existe en su hueco y queda pendiente de moderación.
create function public.album_confirm(p_token text, p_path text) returns void
language plpgsql security definer set search_path = '' as $$
declare
  v_event public.events;
begin
  v_event := private.album_event(p_token);
  if v_event.id is null then
    raise exception 'Álbum no encontrado' using errcode = 'P0002';
  end if;
  if not exists (
    select 1 from private.photo_slots s
    where s.path = p_path and s.event_id = v_event.id and s.used_at is null
  ) or not exists (
    select 1 from storage.objects o where o.bucket_id = 'guest-photos' and o.name = p_path
  ) then
    raise exception 'Foto no encontrada' using errcode = 'P0002';
  end if;
  insert into public.guest_photos (event_id, path) values (v_event.id, p_path)
  on conflict (path) do nothing;
  update private.photo_slots set used_at = now() where path = p_path;
end;
$$;

revoke execute on function public.album_info(text) from public;
revoke execute on function public.album_upload_slot(text) from public;
revoke execute on function public.album_confirm(text, text) from public;
grant execute on function public.album_info(text) to anon, authenticated;
grant execute on function public.album_upload_slot(text) to anon, authenticated;
grant execute on function public.album_confirm(text, text) to anon, authenticated;
comment on function public.album_info(text) is
  'Público por diseño: devuelve solo las fotos aprobadas del álbum cuyo token se conoce.';
comment on function public.album_upload_slot(text) is
  'Público por diseño: concede un hueco de subida de 10 minutos en el álbum del token.';
comment on function public.album_confirm(text, text) is
  'Público por diseño: registra como pendiente una foto subida a su hueco.';

-- La invitación enlaza al álbum: get_invitation devuelve también su token.
create or replace function public.get_invitation(p_token text) returns jsonb
language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'event', e.published_content || jsonb_build_object('id', e.id, 'slug', e.slug),
    'theme', coalesce(e.published_theme, '{}'::jsonb),
    'phase', e.phase,
    'albumToken', e.album_token,
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

-- Almacenamiento: fotos públicas por URL (rutas imposibles de adivinar; el álbum solo lista las
-- aprobadas). Subir solo a un hueco vigente; los miembros del evento pueden borrar.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('guest-photos', 'guest-photos', true, 8388608, array['image/webp', 'image/jpeg']);

create policy "invitados suben a su hueco" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'guest-photos' and (select private.photo_slot_open(name)));
create policy "miembros borran fotos de invitados" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'guest-photos'
    and (select private.is_event_member(((storage.foldername(name))[1])::uuid))
  );
