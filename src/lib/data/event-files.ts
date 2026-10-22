/**
 * Archivos de un evento en el almacenamiento: fotos, vídeo y música del editor («event-media») y
 * fotos del álbum de los invitados («guest-photos»). Todos van en la carpeta `<event_id>/`.
 */

export const EVENT_BUCKETS = ["event-media", "guest-photos"] as const;

/** Lo mínimo del cliente de almacenamiento de Supabase que hace falta (y que se puede simular). */
export type StorageLike = {
  from(bucket: string): {
    list(
      folder: string,
      options: { limit: number; offset: number },
    ): Promise<{ data: { name: string }[] | null; error: unknown }>;
    remove(paths: string[]): Promise<{ data: unknown; error: unknown }>;
  };
};

const PAGE = 100;

/**
 * Borra todos los archivos del evento en los dos buckets. Lista y borra de cien en cien (el
 * almacenamiento devuelve como mucho una página por llamada) hasta que la carpeta queda vacía.
 * Devuelve cuántos archivos ha borrado o un error si alguna llamada falla.
 */
export async function removeEventFiles(
  storage: StorageLike,
  eventId: string,
): Promise<{ ok: true; removed: number } | { ok: false }> {
  let removed = 0;
  for (const bucket of EVENT_BUCKETS) {
    const files = storage.from(bucket);
    // Siempre se lee la primera página: lo borrado desaparece y lo siguiente ocupa su lugar.
    for (;;) {
      const { data, error } = await files.list(eventId, { limit: PAGE, offset: 0 });
      if (error || !data) return { ok: false };
      const paths = data.map((f) => `${eventId}/${f.name}`);
      if (!paths.length) break;
      const result = await files.remove(paths);
      if (result.error) return { ok: false };
      // Si no se ha borrado nada (sin permiso), parar en vez de repetir sin fin.
      if (Array.isArray(result.data) && result.data.length === 0) return { ok: false };
      removed += paths.length;
      if (paths.length < PAGE) break;
    }
  }
  return { ok: true, removed };
}
