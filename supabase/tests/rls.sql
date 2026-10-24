-- Pruebas de RLS y de las funciones de los invitados. Se ejecuta en una transacción que se
-- deshace: no deja datos. Uso: pegar en el editor SQL de Supabase (o execute_sql) y revisar
-- que cada fila tiene el valor esperado (comentado a la derecha).
begin;
insert into auth.users (id, email, aud, role) values
  ('00000000-0000-0000-0000-0000000000a1', 'ana@prueba.invalid', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-0000000000b2', 'beto@prueba.invalid', 'authenticated', 'authenticated');
create temp table resultados (prueba text, valor text) on commit drop;
grant all on resultados to authenticated, anon;

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a1","role":"authenticated"}', true);
insert into public.events (id, slug, content) values
  ('00000000-0000-0000-0000-00000000e001', 'boda-de-prueba', '{"rsvpDeadline":"2099-01-01","couple":{"first":"Ana"}}');
insert into public.guest_groups (id, event_id, display_name) values
  ('00000000-0000-0000-0000-00000000f001', '00000000-0000-0000-0000-00000000e001', 'Familia Prueba');
insert into resultados select 'ana ve su evento', count(*)::text from public.events;            -- 1
insert into resultados select 'ana es propietaria', role::text from public.event_members;       -- owner
insert into resultados select 'token de 22', length(token)::text from public.guest_groups;      -- 22

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000b2","role":"authenticated"}', true);
insert into resultados select 'beto ve eventos', count(*)::text from public.events;             -- 0
insert into resultados select 'beto ve grupos', count(*)::text from public.guest_groups;        -- 0
do $$ begin
  insert into public.guest_groups (event_id, display_name) values ('00000000-0000-0000-0000-00000000e001', 'Intruso');
  insert into resultados values ('beto inserta grupo', 'PERMITIDO');
exception when others then
  insert into resultados values ('beto inserta grupo', 'bloqueado');                            -- bloqueado
end $$;

set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);
insert into resultados select 'anon lee grupos', count(*)::text from public.guest_groups;       -- 0
reset role;
create temp table tok as select token from public.guest_groups where id = '00000000-0000-0000-0000-00000000f001';
grant select on tok to anon;
set local role anon;
insert into resultados select 'sin publicar', coalesce(public.get_invitation((select token from tok))::text, 'null'); -- null
reset role;

update public.events set status = 'published', published_content = content where id = '00000000-0000-0000-0000-00000000e001';
set local role anon;
insert into resultados select 'publicada', public.get_invitation((select token from tok)) -> 'group' ->> 'displayName'; -- Familia Prueba
insert into resultados select 'token falso', coalesce(public.get_invitation('falso')::text, 'null');                 -- null
insert into resultados select 'responde', public.submit_rsvp((select token from tok), '{"status":"attending"}') ->> 'status'; -- attending
do $$ begin
  perform public.submit_rsvp((select token from tok), '{"status":"tal vez"}');
  insert into resultados values ('respuesta inválida', 'ACEPTADA');
exception when others then
  insert into resultados values ('respuesta inválida', 'rechazada');                            -- rechazada
end $$;
do $$ begin
  perform private.is_event_member('00000000-0000-0000-0000-00000000e001');
  insert into resultados values ('anon llama a private', 'PERMITIDO');
exception when others then
  insert into resultados values ('anon llama a private', 'bloqueado');                          -- bloqueado
end $$;
reset role;
select * from resultados;
rollback;
