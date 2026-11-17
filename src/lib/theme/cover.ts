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
  "terciopelo",
  "lavanda",
  "cortijo",
  "lino",
  "granada",
  "eucalipto",
  "gaceta",
  "embarque",
  "premio",
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
  terciopelo: {
    label: "Terciopelo",
    description: "Terciopelo verde con hojas en penumbra y un marco dorado art déco.",
  },
  lavanda: {
    label: "Lavanda",
    description: "Tallos de lavanda en acuarela sobre papel lila.",
  },
  cortijo: {
    label: "Pampa",
    description: "Plumeros de la pampa sobre papel color trigo, con un lacre de sol.",
  },
  lino: {
    label: "Paniculata",
    description: "Paniculata muy fina sobre blanco de lino, con un filete doble.",
  },
  granada: {
    label: "Olivo en oro",
    description: "Vino oscuro con ramas de olivo doradas y un lacre de almendro.",
  },
  eucalipto: {
    label: "Eucalipto",
    description: "Ramas de eucalipto sobre verde gris, con un lacre de hoja.",
  },
  gaceta: {
    label: "Gaceta",
    description:
      "La portada de un periódico: cabecera, titular con vuestros nombres y foto en trama.",
  },
  embarque: {
    label: "Tarjeta de embarque",
    description: "Un billete a nombre del invitado que se abre arrancando el resguardo.",
  },
  premio: {
    label: "Décimo premiado",
    description: "Un décimo de lotería con la fecha bajo una capa dorada que se rasca.",
  },
};

/**
 * Portadas de concepto: no son un fondo con los nombres encima, sino un objeto entero (un
 * periódico, un billete, un décimo) con su propia composición. `paper` e `ink` son los colores
 * de la hoja; todas son claras.
 */
export const CONCEPT_COVERS = {
  gaceta: { ink: "#161513", paper: "#f4f1e8" },
  embarque: { ink: "#14233f", paper: "#dfe8f1" },
  premio: { ink: "#1b3527", paper: "#f5f2e4" },
} as const satisfies Partial<Record<CoverId, { ink: string; paper: string }>>;
export type ConceptCoverId = keyof typeof CONCEPT_COVERS;
export function isConceptCover(id: CoverId): id is ConceptCoverId {
  return id in CONCEPT_COVERS;
}
/** Si los botones que van encima de la portada deben ir en tinta (portada clara) o en blanco. */
export function isLightCover(id: CoverId) {
  return isConceptCover(id) || (isPaintedCover(id) && PAINTED_COVERS[id].tone === "claro");
}

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
  terciopelo: { tone: "oscuro", ink: "#ffffff", paper: "#0e3327" },
  lavanda: { tone: "claro", ink: "#3a2f63", paper: "#f6f3fa" },
  cortijo: { tone: "claro", ink: "#4a2c18", paper: "#f3e6cf" },
  lino: { tone: "claro", ink: "#3a332c", paper: "#f8f4ec" },
  granada: { tone: "oscuro", ink: "#ffffff", paper: "#3a121b" },
  eucalipto: { tone: "claro", ink: "#22382f", paper: "#e7efe9" },
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

/**
 * Motivo de acuarela que acompaña toda la invitación (no solo la portada): la cabecera y el
 * cierre siguen pintados, cada sección lleva su ramita, y la carta, una esquina pintada y un
 * lacre de verdad. Las imágenes están en `public/acuarelas/<id>.webp` y `<id>-lacre.webp`.
 */
export const MOTIF_IDS = [
  "ninguno",
  "lavanda",
  "pampa",
  "olivo",
  "gaceta",
  "embarque",
  "premio",
] as const;
export type MotifId = (typeof MOTIF_IDS)[number];
/**
 * `kind`: «acuarela» lleva ramas y lacre recortados; «concepto» viste la invitación con el
 * objeto de su portada (páginas de periódico, matasellos, número de serie).
 */
export const MOTIFS: Record<MotifId, { label: string; kind: "acuarela" | "concepto" | null }> = {
  ninguno: { label: "Sin motivo", kind: null },
  lavanda: { label: "Lavanda en acuarela", kind: "acuarela" },
  pampa: { label: "Plumeros de la pampa", kind: "acuarela" },
  olivo: { label: "Olivo en oro", kind: "acuarela" },
  gaceta: { label: "Periódico", kind: "concepto" },
  embarque: { label: "Correo aéreo", kind: "concepto" },
  premio: { label: "Décimo de lotería", kind: "concepto" },
};
