-- Teléfono opcional de cada invitación: el enlace de WhatsApp abre directamente ese chat.
alter table public.guest_groups
  add column phone text check (phone is null or (length(phone) <= 30 and phone ~ '^[+0-9 ().-]*$'));
