-- Álbum sin revisión: la pareja puede elegir que las fotos de los invitados se publiquen al
-- momento, sin aprobarlas una a una. Por defecto, apagado: cada foto espera a que la aprueben.
-- Con la opción encendida pueden seguir ocultándolas o borrándolas desde el panel.
-- La columna la cambian los miembros del evento con la política «miembros editan su evento».

alter table public.events add column album_auto_approve boolean not null default false;

-- Datos del álbum: también si las fotos se publican al momento (para el texto del invitado).
create or replace function public.album_info(p_token text) returns jsonb
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
    'autoApprove', v_event.album_auto_approve,
    'photos', coalesce((
      select jsonb_agg(jsonb_build_object('path', p.path, 'createdAt', p.created_at)
        order by p.created_at desc)
      from public.guest_photos p
      where p.event_id = v_event.id and p.status = 'approved'
    ), '[]'::jsonb)
  );
end;
$$;

-- Confirma una subida: pendiente de moderación o, si la pareja lo ha elegido, ya aprobada.
create or replace function public.album_confirm(p_token text, p_path text) returns void
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
  insert into public.guest_photos (event_id, path, status)
  values (
    v_event.id,
    p_path,
    case when v_event.album_auto_approve then 'approved' else 'pending' end
  )
  on conflict (path) do nothing;
  update private.photo_slots set used_at = now() where path = p_path;
end;
$$;

comment on function public.album_confirm(text, text) is
  'Público por diseño: registra una foto subida a su hueco, pendiente o aprobada según el evento.';
