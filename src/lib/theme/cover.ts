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
  "paniculata",
  "toile",
  "silvestres",
  "selva",
  "gaceta",
  "embarque",
  "premio",
  "telegrama",
  "postal",
  "vinilo",
  "pasaporte",
  "carta",
  "mapa",
  "constelacion",
  "comic",
  "cosecha",
  "tarot",
  "arcade",
  "semillas",
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
  paniculata: {
    label: "Paniculata",
    description: "Ramas de paniculata y eucalipto en acuarela sobre salvia pálido.",
  },
  toile: {
    label: "Toile azul",
    description: "Papel pintado de pajarillos azules y una tarjeta marfil en el centro.",
  },
  silvestres: {
    label: "Flores silvestres",
    description: "Florecillas rosa y salvia alrededor de una tarjeta lisa.",
  },
  selva: {
    label: "Selva",
    description: "Hojas tropicales verdes y una tarjeta esmeralda con filete de oro.",
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
  telegrama: {
    label: "Telegrama",
    description: "Un telegrama urgente que se teclea solo, con sus tiras de papel y sus STOP.",
  },
  postal: {
    label: "Postal",
    description:
      "Una postal con vuestra foto; al girarla, el mensaje a mano, el sello y el matasellos.",
  },
  vinilo: {
    label: "Vinilo",
    description:
      "La funda de un sencillo con el disco asomando: se saca el disco y empieza a sonar.",
  },
  pasaporte: {
    label: "Pasaporte",
    description: "Un pasaporte que se abre por la hoja de datos, a nombre del invitado.",
  },
  carta: {
    label: "Carta de restaurante",
    description:
      "La carta de un restaurante: el programa son los platos y la fecha espera bajo la campana.",
  },
  mapa: {
    label: "Mapa del tesoro",
    description: "Un mapa a mano con la ruta hasta la boda: se sigue con el dedo hasta la X.",
  },
  constelacion: {
    label: "Constelación",
    description: "La carta celeste de esa noche: se unen las estrellas y la figura se enciende.",
  },
  comic: {
    label: "Cómic",
    description: "La portada de un tebeo con sus viñetas; la última trae la fecha.",
  },
  cosecha: {
    label: "Cosecha",
    description: "Una botella con vuestra etiqueta y vuestra añada: se descorcha para abrir.",
  },
  tarot: {
    label: "Tarot",
    description:
      "Una carta boca abajo que, al girarla, es la de los enamorados con vuestros nombres.",
  },
  arcade: {
    label: "Arcade",
    description: "La pantalla de inicio de una recreativa: jugador 1, jugador 2 y un botón rojo.",
  },
  semillas: {
    label: "Sobre de semillas",
    description:
      "Un sobre de semillas con vuestra variedad: se siembra y brotan flores alrededor de la fecha.",
  },
};

/**
 * Portadas de concepto: no son un fondo con los nombres encima, sino un objeto entero (un
 * periódico, un billete, un décimo) con su propia composición. `paper` e `ink` son los colores
 * de la hoja; casi todas son claras, y las oscuras lo dicen con `tone`.
 */
export const CONCEPT_COVERS = {
  gaceta: { ink: "#161513", paper: "#f4f1e8" },
  embarque: { ink: "#14233f", paper: "#dfe8f1" },
  premio: { ink: "#1b3527", paper: "#f5f2e4" },
  telegrama: { ink: "#1f2f4d", paper: "#f0e6cb" },
  postal: { ink: "#1e3a6e", paper: "#efe5d0" },
  vinilo: { ink: "#1c1917", paper: "#f3ead8" },
  pasaporte: { ink: "#1e1b2e", paper: "#e9e2d2" },
  carta: { ink: "#22201c", paper: "#fbf8f1" },
  mapa: { ink: "#3b2a1a", paper: "#efe2c4" },
  constelacion: { ink: "#f2ecdb", paper: "#0d1530", tone: "oscuro" },
  comic: { ink: "#141414", paper: "#fbf3df" },
  cosecha: { ink: "#2a1a1f", paper: "#f4efe2" },
  tarot: { ink: "#f1e7d0", paper: "#1c1630", tone: "oscuro" },
  arcade: { ink: "#f4f4f0", paper: "#12122b", tone: "oscuro" },
  semillas: { ink: "#2b3a23", paper: "#ece0c5" },
} as const satisfies Partial<Record<CoverId, { ink: string; paper: string; tone?: "oscuro" }>>;
export type ConceptCoverId = keyof typeof CONCEPT_COVERS;
export function isConceptCover(id: CoverId): id is ConceptCoverId {
  return id in CONCEPT_COVERS;
}
/** Portadas de concepto de fondo oscuro (cielo, tarot, recreativa): los botones van en blanco. */
export function isDarkConcept(id: ConceptCoverId) {
  return "tone" in CONCEPT_COVERS[id];
}
/** Si los botones que van encima de la portada deben ir en tinta (portada clara) o en blanco. */
export function isLightCover(id: CoverId) {
  if (isConceptCover(id)) return !isDarkConcept(id);
  return isPaintedCover(id) && PAINTED_COVERS[id].tone === "claro";
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
  paniculata: { tone: "claro", ink: "#2c3d2f", paper: "#eef1e7" },
  toile: { tone: "claro", ink: "#24406e", paper: "#f7f3ea" },
  silvestres: { tone: "claro", ink: "#5e2f3c", paper: "#fbf4f0" },
  selva: { tone: "oscuro", ink: "#ffffff", paper: "#123326" },
} as const satisfies Partial<
  Record<CoverId, { tone: "claro" | "oscuro"; ink: string; paper: string }>
>;
export type PaintedCoverId = keyof typeof PAINTED_COVERS;
export function isPaintedCover(id: CoverId): id is PaintedCoverId {
  return id in PAINTED_COVERS;
}

/** Efecto sobre la portada: un vídeo corto en bucle que solo suma luz (se ve en fondos oscuros). */
export const COVER_EFFECT_IDS = ["ninguno", "petalos", "oro", "luciernagas"] as const;
export type CoverEffectId = (typeof COVER_EFFECT_IDS)[number];

export const COVER_EFFECTS: Record<CoverEffectId, { label: string; description: string }> = {
  ninguno: { label: "Sin efecto", description: "La portada tal cual." },
  petalos: { label: "Pétalos", description: "Pétalos blancos que caen despacio." },
  oro: { label: "Polvo de oro", description: "Motas doradas que flotan y brillan." },
  luciernagas: {
    label: "Luciérnagas",
    description: "Puntos de luz cálida que se encienden y se apagan.",
  },
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
  "buganvilla",
  "paniculata",
  "eucalipto",
  "gaceta",
  "embarque",
  "premio",
  "telegrama",
  "postal",
  "vinilo",
  "pasaporte",
  "carta",
  "mapa",
  "constelacion",
  "comic",
  "cosecha",
  "tarot",
  "arcade",
  "semillas",
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
  buganvilla: { label: "Buganvilla y lacre de corazón", kind: "acuarela" },
  paniculata: { label: "Paniculata y lacre de almendro", kind: "acuarela" },
  eucalipto: { label: "Eucalipto y lacre de hoja", kind: "acuarela" },
  gaceta: { label: "Periódico", kind: "concepto" },
  embarque: { label: "Correo aéreo", kind: "concepto" },
  premio: { label: "Décimo de lotería", kind: "concepto" },
  telegrama: { label: "Telégrafos", kind: "concepto" },
  postal: { label: "Sellos y matasellos", kind: "concepto" },
  vinilo: { label: "Disco de vinilo", kind: "concepto" },
  pasaporte: { label: "Visados y sellos", kind: "concepto" },
  carta: { label: "Carta de restaurante", kind: "concepto" },
  mapa: { label: "Mapa del tesoro", kind: "concepto" },
  constelacion: { label: "Carta celeste", kind: "concepto" },
  comic: { label: "Tebeo", kind: "concepto" },
  cosecha: { label: "Bodega", kind: "concepto" },
  tarot: { label: "Arcanos", kind: "concepto" },
  arcade: { label: "Recreativa", kind: "concepto" },
  semillas: { label: "Vivero", kind: "concepto" },
};
