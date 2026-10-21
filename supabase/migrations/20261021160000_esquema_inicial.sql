-- Esquema inicial: eventos, miembros, invitados, respuestas, mesas, tareas y presupuesto.
-- Seguridad: RLS en todas las tablas. Los miembros de un evento gestionan sus datos; los
-- invitados nunca leen tablas: usan get_invitation() y submit_rsvp() con su token.

create extension if not exists pgcrypto with schema extensions;

create type public.event_status as enum ('draft', 'published');
create type public.member_role as enum ('owner', 'editor');

-- Utilidades -----------------------------------------------------------------------------------

create function public.set_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Token de invitación: 22 caracteres aleatorios aptos para URL (128 bits).
create function public.new_token() returns text
language sql volatile set search_path = '' as $$
  select translate(rtrim(encode(extensions.gen_random_bytes(16), 'base64'), '='), '+/', '-_');
$$;

-- Eventos --------------------------------------------------------------------------------------

create table public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) between 3 and 60),
  status public.event_status not null default 'draft',
  -- Borrador que se edita y versión publicada que ven los invitados.
  content jsonb not null,
  theme jsonb not null default '{}'::jsonb,
  published_content jsonb,
  published_theme jsonb,
  published_at timestamptz,
  created_by uuid default auth.uid() references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (pg_column_size(content) < 200000 and pg_column_size(theme) < 20000)
);

create trigger events_updated_at before update on public.events
for each row execute function public.set_updated_at();

create table public.event_members (
  event_id uuid not null references public.events (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.member_role not null default 'editor',
  created_at timestamptz not null default now(),
  primary key (event_id, user_id)
);
create index event_members_user_idx on public.event_members (user_id);

-- Comprobaciones de pertenencia (security definer para evitar recursión en las políticas).
create function public.is_event_member(e uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.event_members m where m.event_id = e and m.user_id = auth.uid()
  );
$$;

create function public.is_event_owner(e uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.event_members m
    where m.event_id = e and m.user_id = auth.uid() and m.role = 'owner'
  );
$$;

-- Quien crea un evento queda como propietario.
create function public.add_event_owner() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is not null then
    insert into public.event_members (event_id, user_id, role) values (new.id, auth.uid(), 'owner');
  end if;
  return new;
end;
$$;

create trigger events_add_owner after insert on public.events
for each row execute function public.add_event_owner();

-- Mesas, invitados y respuestas -----------------------------------------------------------------

create table public.tables (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  name text not null check (length(name) between 1 and 60),
  shape text not null default 'round' check (shape in ('round', 'rect')),
  seats int not null default 10 check (seats between 1 and 40),
  x numeric not null default 0,
  y numeric not null default 0
);
create index tables_event_idx on public.tables (event_id);

create table public.guest_groups (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  token text not null unique default public.new_token(),
  display_name text not null check (length(display_name) between 1 and 120),
  category text not null default 'Familia' check (length(category) <= 60),
  max_attendees int not null default 1 check (max_attendees between 1 and 20),
  notes text check (length(notes) <= 1000),
  sort int not null default 0,
  created_at timestamptz not null default now()
);
create index guest_groups_event_idx on public.guest_groups (event_id);

create table public.guests (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.guest_groups (id) on delete cascade,
  event_id uuid not null references public.events (id) on delete cascade,
  first_name text not null check (length(first_name) between 1 and 80),
  last_name text not null default '' check (length(last_name) <= 120),
  is_primary boolean not null default false,
  is_child boolean not null default false,
  sort int not null default 0
);
create index guests_group_idx on public.guests (group_id);
create index guests_event_idx on public.guests (event_id);

create table public.seats (
  guest_id uuid primary key references public.guests (id) on delete cascade,
  table_id uuid not null references public.tables (id) on delete cascade,
  event_id uuid not null references public.events (id) on delete cascade
);
create index seats_table_idx on public.seats (table_id);
create index seats_event_idx on public.seats (event_id);

create table public.rsvp_responses (
  group_id uuid primary key references public.guest_groups (id) on delete cascade,
  event_id uuid not null references public.events (id) on delete cascade,
  status text not null check (status in ('attending', 'declined')),
  payload jsonb not null check (pg_column_size(payload) < 20000),
  updated_at timestamptz not null default now()
);
create index rsvp_responses_event_idx on public.rsvp_responses (event_id);

-- Organización ------------------------------------------------------------------------------------

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  title text not null check (length(title) between 1 and 200),
  due_date date,
  assignee text check (length(assignee) <= 80),
  done boolean not null default false,
  created_at timestamptz not null default now()
);
create index tasks_event_idx on public.tasks (event_id);

create table public.budget_items (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  concept text not null check (length(concept) between 1 and 200),
  category text not null default 'Otros' check (length(category) <= 60),
  estimated numeric(10, 2) not null default 0 check (estimated >= 0),
  paid numeric(10, 2) not null default 0 check (paid >= 0),
  due_date date,
  notes text check (length(notes) <= 1000)
);
create index budget_items_event_idx on public.budget_items (event_id);

-- RLS --------------------------------------------------------------------------------------------

alter table public.events enable row level security;
alter table public.event_members enable row level security;
alter table public.tables enable row level security;
alter table public.guest_groups enable row level security;
alter table public.guests enable row level security;
alter table public.seats enable row level security;
alter table public.rsvp_responses enable row level security;
alter table public.tasks enable row level security;
alter table public.budget_items enable row level security;

create policy "miembros leen su evento" on public.events
  for select to authenticated using ((select public.is_event_member(id)));
create policy "usuarios crean eventos" on public.events
  for insert to authenticated with check (created_by = (select auth.uid()));
create policy "miembros editan su evento" on public.events
  for update to authenticated using ((select public.is_event_member(id)))
  with check ((select public.is_event_member(id)));
create policy "propietarios borran su evento" on public.events
  for delete to authenticated using ((select public.is_event_owner(id)));

create policy "miembros ven a los miembros" on public.event_members
  for select to authenticated using ((select public.is_event_member(event_id)));
create policy "propietarios añaden miembros" on public.event_members
  for insert to authenticated with check ((select public.is_event_owner(event_id)));
create policy "propietarios quitan miembros" on public.event_members
  for delete to authenticated using ((select public.is_event_owner(event_id)));

-- Mismo patrón para todas las tablas que cuelgan de un evento.
do $$
declare t text;
begin
  foreach t in array array['tables', 'guest_groups', 'guests', 'seats', 'rsvp_responses', 'tasks', 'budget_items']
  loop
    execute format(
      'create policy "miembros gestionan %1$s" on public.%1$I for all to authenticated
         using ((select public.is_event_member(event_id)))
         with check ((select public.is_event_member(event_id)))', t);
  end loop;
end;
$$;

-- Acceso de los invitados (solo con su token) ------------------------------------------------------

create function public.get_invitation(p_token text) returns jsonb
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
      'table', (
        select t.name from public.seats s join public.tables t on t.id = s.table_id
        join public.guests p on p.id = s.guest_id
        where p.group_id = g.id limit 1
      )
    ),
    'response', (select r.payload from public.rsvp_responses r where r.group_id = g.id)
  )
  from public.guest_groups g
  join public.events e on e.id = g.event_id
  where g.token = p_token and e.status = 'published' and e.published_content is not null;
$$;

create function public.submit_rsvp(p_token text, p_payload jsonb) returns jsonb
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

-- Las funciones auxiliares no se exponen; solo las dos de los invitados.
revoke execute on function public.get_invitation(text) from public;
revoke execute on function public.submit_rsvp(text, jsonb) from public;
grant execute on function public.get_invitation(text) to anon, authenticated;
grant execute on function public.submit_rsvp(text, jsonb) to anon, authenticated;
revoke execute on function public.is_event_member(uuid) from public, anon;
revoke execute on function public.is_event_owner(uuid) from public, anon;
grant execute on function public.is_event_member(uuid) to authenticated;
grant execute on function public.is_event_owner(uuid) to authenticated;
revoke execute on function public.add_event_owner() from public, anon, authenticated;
revoke execute on function public.new_token() from public, anon;

-- Fotos ----------------------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('event-media', 'event-media', true, 8388608, array['image/jpeg', 'image/webp', 'image/png']);

-- Rutas: <event_id>/<archivo>. Lectura pública por URL (bucket público); escritura solo miembros.
create policy "miembros suben fotos" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'event-media'
    and (select public.is_event_member(((storage.foldername(name))[1])::uuid))
  );
create policy "miembros cambian fotos" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'event-media'
    and (select public.is_event_member(((storage.foldername(name))[1])::uuid))
  );
create policy "miembros borran fotos" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'event-media'
    and (select public.is_event_member(((storage.foldername(name))[1])::uuid))
  );
