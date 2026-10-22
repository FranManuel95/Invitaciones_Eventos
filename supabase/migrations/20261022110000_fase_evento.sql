-- Fase del evento: primero se puede publicar un «save the date» (nombres, fecha y cuenta atrás)
-- y más adelante la invitación completa, con el mismo enlace. Mientras dura el save the date no
-- se aceptan respuestas.
alter table public.events
  add column phase text not null default 'invitacion'
  check (phase in ('save_the_date', 'invitacion'));

create or replace function public.get_invitation(p_token text) returns jsonb
language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'event', e.published_content || jsonb_build_object('id', e.id, 'slug', e.slug),
    'theme', coalesce(e.published_theme, '{}'::jsonb),
    'phase', e.phase,
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

create or replace function public.submit_rsvp(p_token text, p_payload jsonb) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  v_group public.guest_groups;
  v_event public.events;
  v_deadline date;
  v_status text := p_payload ->> 'status';
begin
  if v_status is null or v_status not in ('attending', 'declined') then
    raise exception 'Respuesta no válida' using errcode = '22023';
  end if;
  if pg_column_size(p_payload) >= 20000 then
    raise exception 'Respuesta demasiado grande' using errcode = '22023';
  end if;

  select * into v_group from public.guest_groups where token = p_token;
  if not found then
    raise exception 'Invitación no encontrada' using errcode = 'P0002';
  end if;
  select * into v_event from public.events where id = v_group.event_id and status = 'published';
  if not found then
    raise exception 'Invitación no encontrada' using errcode = 'P0002';
  end if;
  if v_event.phase = 'save_the_date' then
    raise exception 'Aún no se puede confirmar asistencia' using errcode = '22023';
  end if;

  v_deadline := nullif(v_event.published_content ->> 'rsvpDeadline', '')::date;
  if v_deadline is not null and current_date > v_deadline then
    raise exception 'El plazo para responder ha terminado' using errcode = '22023';
  end if;

  insert into public.rsvp_responses (group_id, event_id, status, payload, updated_at)
  values (v_group.id, v_group.event_id, v_status, p_payload, now())
  on conflict (group_id) do update
    set status = excluded.status, payload = excluded.payload, updated_at = now();
  return p_payload;
end;
$$;
