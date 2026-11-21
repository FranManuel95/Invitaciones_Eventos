import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  COVER_EFFECT_IDS,
  COVER_IDS,
  FILM_IDS,
  isPaintedCover,
  LINER_IDS,
  linerBackground,
  MOTIF_IDS,
  MOTIFS,
  TEMPLATES,
} from "@/lib/theme";

/** Cada opción del tema que tira de un archivo tiene ese archivo en `public/`. */
const has = (path: string) => existsSync(`public${path}`);

describe("recursos de las opciones del tema", () => {
  it.each(FILM_IDS)("el vídeo de apertura %s tiene MP4, WebM e imagen", (id) => {
    const cut = id === "blanco" ? "vertical" : id;
    for (const ext of ["mp4", "webm", "webp"]) {
      expect(has(`/aperturas/sobre-dorado/${cut}.${ext}`)).toBe(true);
    }
  });

  it.each(LINER_IDS)("el forro %s, si es pintado, tiene su imagen", (id) => {
    const bg = linerBackground(id, { inside: "#fff", gold: "#c9a65d", own: "#eee" });
    const url = /url\("(\/forros\/[^"]+)"\)/.exec(bg)?.[1];
    if (url) expect(has(url)).toBe(true);
  });

  it.each(MOTIF_IDS.filter((id) => MOTIFS[id].kind === "acuarela"))(
    "el motivo %s tiene su rama y su lacre",
    (id) => {
      expect(has(`/acuarelas/${id}.webp`)).toBe(true);
      expect(has(`/acuarelas/${id}-lacre.webp`)).toBe(true);
    },
  );

  it.each(COVER_IDS.filter(isPaintedCover))("la portada pintada %s tiene su imagen", (id) => {
    expect(has(`/portadas/${id}.webp`)).toBe(true);
  });

  it.each(COVER_EFFECT_IDS.filter((id) => id !== "ninguno"))(
    "el efecto %s tiene sus vídeos",
    (id) => {
      expect(has(`/portadas/efectos/${id}.mp4`)).toBe(true);
      expect(has(`/portadas/efectos/${id}.webm`)).toBe(true);
    },
  );

  it("las plantillas con motivo de acuarela y portada pintada tienen la pintura sin lacre", () => {
    for (const [id, { look }] of Object.entries(TEMPLATES)) {
      if (!look.motif || !look.cover || MOTIFS[look.motif].kind !== "acuarela") continue;
      if (!isPaintedCover(look.cover)) continue;
      expect(has(`/portadas/${look.cover}-fondo.webp`), id).toBe(true);
    }
  });
});
