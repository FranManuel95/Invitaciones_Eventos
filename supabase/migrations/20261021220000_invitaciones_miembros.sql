-- Invitar a la pareja o a otra organizadora a un evento con un enlace de un solo uso (7 días).
-- Solo los propietarios crean y ven las invitaciones; quien abre el enlace con sesión iniciada
-- se une al evento con accept_event_invite().

create table public.event_invites (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  token text not null unique default private.new_token(),
  role public.member_role not null default 'editor',
  created_by uuid default auth.uid() references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '7 days',
  used_at timestamptz,
  used_by uuid references auth.users (id) on delete set null
);
create index event_invites_event_idx on public.event_invites (event_id);

alter table public.event_invites enable row level security;

create policy "propietarios ven invitaciones" on public.event_invites
  for select to authenticated using ((select private.is_event_owner(event_id)));
create policy "propietarios crean invitaciones" on public.event_invites
  for insert to authenticated with check ((select private.is_event_owner(event_id)));
create policy "propietarios borran invitaciones" on public.event_invites
  for delete to authenticated using ((select private.is_event_owner(event_id)));

-- Aceptar una invitación: comprueba que no ha caducado ni se ha usado y añade al usuario.
create function public.accept_event_invite(p_token text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  v_invite public.event_invites;
  v_user uuid := auth.uid();
begin
  if v_user is null then
    raise exception 'Inicia sesión para aceptar la invitación' using errcode = '42501';
  end if;
  select * into v_invite from public.event_invites where token = p_token for update;
  if not found or v_invite.used_at is not null or v_invite.expires_at < now() then
    raise exception 'La invitación no es válida o ha caducado' using errcode = 'P0002';
  end if;
  insert into public.event_members (event_id, user_id, role)
  values (v_invite.event_id, v_user, v_invite.role)
  on conflict (event_id, user_id) do nothing;
  update public.event_invites set used_at = now(), used_by = v_user where id = v_invite.id;
  return v_invite.event_id;
end;
$$;

-- Miembros de un evento con su email, solo para quien ya es miembro de ese evento.
create function public.event_member_list(p_event uuid)
returns table (user_id uuid, role public.member_role, email text, is_me boolean)
language sql stable security definer set search_path = '' as $$
  select m.user_id, m.role, u.email::text, m.user_id = auth.uid()
  from public.event_members m
  join auth.users u on u.id = m.user_id
  where m.event_id = p_event and private.is_event_member(p_event)
  order by m.role, m.created_at;
$$;

comment on function public.accept_event_invite(text) is
  'Pública a propósito para usuarios con sesión: valida el token de un solo uso.';
comment on function public.event_member_list(uuid) is
  'Pública a propósito para usuarios con sesión: solo devuelve filas a los miembros del evento.';

revoke execute on function public.accept_event_invite(text) from public, anon;
revoke execute on function public.event_member_list(uuid) from public, anon;
grant execute on function public.accept_event_invite(text) to authenticated;
grant execute on function public.event_member_list(uuid) to authenticated;
