import { describe, expect, it } from "vitest";
import { removeEventFiles, type StorageLike } from "@/lib/data/event-files";

const EVENT = "11111111-1111-1111-1111-111111111111";

/** Almacenamiento simulado: carpetas por bucket y, si se pide, borrados que no borran nada. */
function fakeStorage(files: Record<string, string[]>, opts: { denyRemove?: boolean } = {}) {
  const store = Object.fromEntries(Object.entries(files).map(([b, f]) => [b, [...f]]));
  const calls: string[] = [];
  const storage: StorageLike = {
    from(bucket) {
      const list = (store[bucket] ??= []);
      return {
        async list(folder, { limit, offset }) {
          calls.push(`list ${bucket}`);
          const names = list.filter((p) => p.startsWith(`${folder}/`));
          return {
            data: names
              .slice(offset, offset + limit)
              .map((p) => ({ name: p.slice(folder.length + 1) })),
            error: null,
          };
        },
        async remove(paths) {
          calls.push(`remove ${bucket} ${paths.length}`);
          if (opts.denyRemove) return { data: [], error: null };
          for (const p of paths) list.splice(list.indexOf(p), 1);
          return { data: paths.map((name) => ({ name })), error: null };
        },
      };
    },
  };
  return { storage, store, calls };
}

const many = (n: number) => Array.from({ length: n }, (_, i) => `${EVENT}/foto-${i}.webp`);

describe("borrado de los archivos de un evento", () => {
  it("borra las fotos del editor y las del álbum, y solo las de ese evento", async () => {
    const other = "22222222-2222-2222-2222-222222222222/portada.webp";
    const { storage, store } = fakeStorage({
      "event-media": [`${EVENT}/portada.webp`, `${EVENT}/cancion.mp3`, other],
      "guest-photos": [`${EVENT}/a.webp`],
    });
    expect(await removeEventFiles(storage, EVENT)).toEqual({ ok: true, removed: 3 });
    expect(store["event-media"]).toEqual([other]);
    expect(store["guest-photos"]).toEqual([]);
  });

  it("recorre carpetas de más de cien archivos", async () => {
    const { storage, store, calls } = fakeStorage({ "event-media": many(250) });
    expect(await removeEventFiles(storage, EVENT)).toEqual({ ok: true, removed: 250 });
    expect(store["event-media"]).toEqual([]);
    expect(calls.filter((c) => c.startsWith("remove event-media"))).toEqual([
      "remove event-media 100",
      "remove event-media 100",
      "remove event-media 50",
    ]);
  });

  it("con una carpeta de justo cien, comprueba que queda vacía y para", async () => {
    const { storage } = fakeStorage({ "event-media": many(100) });
    expect(await removeEventFiles(storage, EVENT)).toEqual({ ok: true, removed: 100 });
  });

  it("si el almacenamiento no deja borrar, avisa en vez de quedarse en bucle", async () => {
    const { storage } = fakeStorage({ "event-media": many(3) }, { denyRemove: true });
    expect(await removeEventFiles(storage, EVENT)).toEqual({ ok: false });
  });

  it("un evento sin archivos se da por limpio", async () => {
    const { storage } = fakeStorage({});
    expect(await removeEventFiles(storage, EVENT)).toEqual({ ok: true, removed: 0 });
  });
});
