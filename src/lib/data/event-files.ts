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
    ): Promise<{ data: { name: string; created_at?: string | null }[] | null; error: unknown }>;
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

/** Una hora: lo recién subido puede no estar guardado aún en el borrador. */
export const UNUSED_MIN_AGE_MS = 60 * 60 * 1000;

/**
 * Archivos del editor que ya no usa el evento: ni el borrador ni lo publicado los nombran
 * (p. ej. una foto sustituida). Solo cuentan los que tienen más de `minAgeMs`.
 */
export function unusedFiles(
  files: { name: string; created_at?: string | null }[],
  eventId: string,
  referenced: string,
  now: number,
  minAgeMs = UNUSED_MIN_AGE_MS,
): string[] {
  return files
    .filter((f) => {
      if (referenced.includes(`${eventId}/${f.name}`)) return false;
      const created = f.created_at ? Date.parse(f.created_at) : NaN;
      // Sin fecha (o una carpeta) no se toca: mejor dejar un archivo que borrar uno en uso.
      return Number.isFinite(created) && now - created >= minAgeMs;
    })
    .map((f) => `${eventId}/${f.name}`);
}

/**
 * Borra del almacenamiento del editor los archivos que el evento ya no usa. `referenced` es el
 * texto (JSON) del borrador y de lo publicado. Devuelve cuántos ha borrado.
 */
export async function removeUnusedEventFiles(
  storage: StorageLike,
  eventId: string,
  referenced: string,
  now = Date.now(),
): Promise<{ ok: true; removed: number } | { ok: false }> {
  const files = storage.from("event-media");
  const all: { name: string; created_at?: string | null }[] = [];
  for (let offset = 0; ; offset += PAGE) {
    const { data, error } = await files.list(eventId, { limit: PAGE, offset });
    if (error || !data) return { ok: false };
    all.push(...data);
    if (data.length < PAGE) break;
  }
  const paths = unusedFiles(all, eventId, referenced, now);
  for (let i = 0; i < paths.length; i += PAGE) {
    const { error } = await files.remove(paths.slice(i, i + PAGE));
    if (error) return { ok: false };
  }
  return { ok: true, removed: paths.length };
}
