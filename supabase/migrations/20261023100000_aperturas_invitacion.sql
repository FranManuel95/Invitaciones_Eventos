-- Quién ha abierto su invitación. Lo apunta el navegador del invitado al cargarla (no el
-- servidor), para que las vistas previas de los enlaces en WhatsApp no cuenten como apertura.
-- Solo los miembros del evento lo ven (las políticas de guest_groups no cambian).

alter table public.guest_groups
  add column opened_at timestamptz,
  add column last_opened_at timestamptz;

create function public.mark_invitation_opened(p_token text) returns void
language sql security definer set search_path = '' as $$
  update public.guest_groups g
  set opened_at = coalesce(g.opened_at, now()),
      last_opened_at = now()
  from public.events e
  where g.token = p_token
    and e.id = g.event_id
    and e.status = 'published'
    -- Como mucho una vez por minuto y token: evita escrituras en bucle.
    and (g.last_opened_at is null or g.last_opened_at < now() - interval '1 minute');
$$;
revoke execute on function public.mark_invitation_opened(text) from public;
grant execute on function public.mark_invitation_opened(text) to anon, authenticated;
comment on function public.mark_invitation_opened(text) is
  'Público por diseño: apunta que se abrió la invitación del token indicado.';
