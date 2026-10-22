-- Solicitudes de la página de venta: parejas que piden su invitación. Nadie las lee desde la API
-- (sin políticas de lectura): se consultan desde el panel de Supabase. Solo se pueden crear con
-- la función de abajo, que valida y limita los envíos.

create table public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  names text not null check (length(names) between 1 and 120),
  email text not null check (length(email) between 3 and 200 and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  wedding_date date,
  message text not null default '' check (length(message) <= 2000),
  created_at timestamptz not null default now()
);
create index contact_requests_created on public.contact_requests (created_at desc);
create index contact_requests_email on public.contact_requests (lower(email), created_at desc);

alter table public.contact_requests enable row level security;
revoke all on public.contact_requests from anon, authenticated;

create function public.request_contact(
  p_names text, p_email text, p_wedding_date date, p_message text
) returns void
language plpgsql security definer set search_path = '' as $$
begin
  -- Límites contra envíos en masa: 3 por correo al día y 200 en total al día.
  if (select count(*) from public.contact_requests
      where lower(email) = lower(trim(p_email)) and created_at > now() - interval '1 day') >= 3
    or (select count(*) from public.contact_requests
      where created_at > now() - interval '1 day') >= 200 then
    raise exception 'Demasiadas solicitudes' using errcode = '22023';
  end if;
  insert into public.contact_requests (names, email, wedding_date, message)
  values (trim(p_names), trim(p_email), p_wedding_date, coalesce(trim(p_message), ''));
end;
$$;
revoke execute on function public.request_contact(text, text, date, text) from public;
grant execute on function public.request_contact(text, text, date, text) to anon, authenticated;
comment on function public.request_contact(text, text, date, text) is
  'Público por diseño: guarda una solicitud de la página de venta, con límites diarios.';
