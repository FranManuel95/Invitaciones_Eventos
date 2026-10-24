-- Mesas por invitación: cada grupo (familia, pareja…) se sienta junto, y así cuentan también
-- los acompañantes que añade el invitado al responder (no tienen fila en «guests»).
alter table public.guest_groups
  add column table_id uuid references public.tables (id) on delete set null;
create index guest_groups_table_idx on public.guest_groups (table_id);

-- La mesa asignada debe ser del mismo evento que la invitación.
create function private.check_group_table() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.table_id is not null and not exists (
    select 1 from public.tables t where t.id = new.table_id and t.event_id = new.event_id
  ) then
    raise exception 'La mesa no es de este evento' using errcode = '23514';
  end if;
  return new;
end;
$$;

create trigger guest_groups_check_table before insert or update of table_id, event_id
on public.guest_groups for each row execute function private.check_group_table();

-- El pase del invitado muestra la mesa de su invitación.
create or replace function public.get_invitation(p_token text) returns jsonb
language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'event', e.published_content || jsonb_build_object('id', e.id, 'slug', e.slug),
    'theme', coalesce(e.published_theme, '{}'::jsonb),
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
