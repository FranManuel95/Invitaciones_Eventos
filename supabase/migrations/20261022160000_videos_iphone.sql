-- Vídeos de portada grabados con el iPhone: el almacenamiento del evento admite también .mov
-- (video/quicktime). El resto de formatos y el límite de 30 MB no cambian.
update storage.buckets
set allowed_mime_types = array[
      'image/jpeg', 'image/webp', 'image/png',
      'video/mp4', 'video/webm', 'video/quicktime',
      'audio/mpeg', 'audio/mp4', 'audio/x-m4a', 'audio/aac'
    ]
where id = 'event-media';
