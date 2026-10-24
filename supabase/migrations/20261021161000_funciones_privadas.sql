-- Las funciones auxiliares de RLS no deben poder llamarse desde la API (/rest/v1/rpc).
-- Se mueven a un esquema no expuesto; las políticas las referencian por OID y siguen igual.
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

alter function public.is_event_member(uuid) set schema private;
alter function public.is_event_owner(uuid) set schema private;
alter function public.new_token() set schema private;
alter function public.add_event_owner() set schema private;
alter function public.set_updated_at() set schema private;

-- Las funciones de los invitados son públicas a propósito: solo devuelven o guardan los datos
-- de la invitación cuyo token (128 bits aleatorios) se conoce.
comment on function public.get_invitation(text) is
  'Público por diseño: devuelve solo la invitación publicada del token indicado.';
comment on function public.submit_rsvp(text, jsonb) is
  'Público por diseño: guarda la respuesta del token indicado si el evento está publicado y en plazo.';

-- El valor por defecto del token se evalúa con los privilegios de quien inserta.
grant execute on function private.new_token() to authenticated;
