-- Vídeo de portada y canción propia: el almacenamiento del evento admite también MP4/WebM y
-- MP3/M4A, hasta 30 MB. Las fotos se siguen reduciendo en el navegador antes de subirlas, y la
-- escritura sigue limitada a los miembros del evento (políticas de la migración inicial).
update storage.buckets
set file_size_limit = 31457280,
    allowed_mime_types = array[
      'image/jpeg', 'image/webp', 'image/png',
      'video/mp4', 'video/webm',
      'audio/mpeg', 'audio/mp4', 'audio/x-m4a', 'audio/aac'
    ]
where id = 'event-media';
