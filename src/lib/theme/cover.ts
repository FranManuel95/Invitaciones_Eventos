/*
 * Portada: la foto con efecto 3D de siempre, cuatro escenas animadas dibujadas en SVG y CSS, la
 * foto como en una película, un vídeo corto subido por la pareja o un fondo pintado (acuarelas y
 * papeles con el centro despejado para los nombres). Encima puede ir un efecto que se mueve.
 */

export const COVER_IDS = [
  "foto",
  "luces",
  "acuarela",
  "estrellas",
  "herbario",
  "cine",
  "video",
  "ramas",
  "buganvilla",
  "medianoche",
  "arcilla",
  "orilla",
] as const;
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
  herbario: {
    label: "Herbario",
    description: "Ramas de olivo y eucalipto en oro que se dibujan solas, con un marco fino.",
  },
  cine: {
    label: "Película",
    description: "Vuestra foto a cámara lenta, con bandas de cine y los nombres que se enfocan.",
  },
  video: { label: "Vuestro vídeo", description: "Un vídeo corto de fondo, sin sonido y en bucle." },
  ramas: {
    label: "Ramas de olivo",
    description: "Acuarela de olivo y eucalipto sobre papel de algodón, con toques de oro.",
  },
  buganvilla: {
    label: "Buganvilla",
    description: "Pared encalada con buganvilla y la luz de la tarde entre las hojas.",
  },
  medianoche: {
    label: "Medianoche",
    description: "Azul profundo con flores y estrellas doradas.",
  },
  arcilla: {
    label: "Arcilla",
    description: "Papel artesanal color teja con rosas secas y hierba de la pampa.",
  },
  orilla: {
    label: "Orilla",
    description: "Acuarela de mar en calma, arena clara y conchas.",
  },
};

/**
 * Fondos pintados: una imagen en `public/portadas/<id>.webp`. Los claros llevan los nombres en
 * tinta (`ink`) y un halo del color del papel (`paper`) detrás; los oscuros, en blanco.
 */
export const PAINTED_COVERS = {
  ramas: { tone: "claro", ink: "#34432f", paper: "#fbf9f1" },
  buganvilla: { tone: "claro", ink: "#5c1f3d", paper: "#fdf6ee" },
  medianoche: { tone: "oscuro", ink: "#ffffff", paper: "#16224f" },
  arcilla: { tone: "oscuro", ink: "#ffffff", paper: "#b7705a" },
  orilla: { tone: "claro", ink: "#24465c", paper: "#f6fafb" },
} as const satisfies Partial<
  Record<CoverId, { tone: "claro" | "oscuro"; ink: string; paper: string }>
>;
export type PaintedCoverId = keyof typeof PAINTED_COVERS;
export function isPaintedCover(id: CoverId): id is PaintedCoverId {
  return id in PAINTED_COVERS;
}

/** Efecto sobre la portada: un vídeo corto en bucle que solo suma luz (se ve en fondos oscuros). */
export const COVER_EFFECT_IDS = ["ninguno", "petalos", "oro"] as const;
export type CoverEffectId = (typeof COVER_EFFECT_IDS)[number];

export const COVER_EFFECTS: Record<CoverEffectId, { label: string; description: string }> = {
  ninguno: { label: "Sin efecto", description: "La portada tal cual." },
  petalos: { label: "Pétalos", description: "Pétalos blancos que caen despacio." },
  oro: { label: "Polvo de oro", description: "Motas doradas que flotan y brillan." },
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
