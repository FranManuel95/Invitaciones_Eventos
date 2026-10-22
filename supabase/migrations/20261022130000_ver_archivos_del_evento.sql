-- El almacenamiento solo borra los archivos que quien borra puede ver (pide permiso de lectura
-- además del de borrado). Sin estas políticas, borrar una foto del álbum o un evento dejaba los
-- archivos guardados. Los miembros ven solo la carpeta de su evento; el público sigue leyendo por
-- URL (buckets públicos) pero no puede listar.

create policy "miembros ven sus fotos" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'event-media'
    and (select private.is_event_member(((storage.foldername(name))[1])::uuid))
  );

create policy "miembros ven fotos de invitados" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'guest-photos'
    and (select private.is_event_member(((storage.foldername(name))[1])::uuid))
  );
