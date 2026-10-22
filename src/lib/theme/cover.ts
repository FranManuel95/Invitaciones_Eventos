/*
 * Portada: la foto con efecto 3D de siempre, tres escenas animadas dibujadas en SVG y CSS, la
 * foto como en una película o un vídeo corto subido por la pareja.
 */

export const COVER_IDS = ["foto", "luces", "acuarela", "estrellas", "cine", "video"] as const;
export type CoverId = (typeof COVER_IDS)[number];

export const COVERS: Record<CoverId, { label: string; description: string }> = {
  foto: {
    label: "Foto en 3D",
    description: "Vuestra foto con profundidad que se mueve con el móvil.",
  },
  luces: {
    label: "Luces y mariposas",
    description: "Guirnalda de luces, destellos y mariposas que revolotean.",
  },
  acuarela: {
    label: "Acuarela floral",
    description: "Flores pintadas que se abren y pétalos que caen.",
  },
  estrellas: {
    label: "Cielo estrellado",
    description: "Estrellas que titilan y alguna estrella fugaz.",
  },
  cine: {
    label: "Película",
    description: "Vuestra foto a cámara lenta, con bandas de cine y los nombres que se enfocan.",
  },
  video: { label: "Vuestro vídeo", description: "Un vídeo corto de fondo, sin sonido y en bucle." },
};

/** Generador pseudoaleatorio con semilla (mulberry32): las escenas son iguales en cada carga. */
export function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
