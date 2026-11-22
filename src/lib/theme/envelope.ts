/*
 * Sobre a medida: forma de la solapa, gramaje, textura del papel, forro y lacre. Son funciones
 * puras (sin React) para poder probarlas: devuelven recortes `clip-path` y fondos CSS.
 */

export const FLAP_IDS = ["pico", "recta", "redonda", "festoneada"] as const;
export const WEIGHT_IDS = ["ligero", "medio", "grueso"] as const;
export const TEXTURE_IDS = ["liso", "verjurado", "lino", "acanalado"] as const;
export const LINER_IDS = [
  "propio",
  "rayas",
  "flores",
  "lunares",
  "marmol",
  "liso",
  "olivo",
  "silvestres",
  "toile",
  "estrellas",
  "tropical",
  "diplomatica",
] as const;
/** Forros pintados (imagen en `public/forros/<id>.webp`), en vez de dibujados con CSS. */
const PAINTED_LINERS = ["olivo", "silvestres", "toile", "estrellas", "tropical", "diplomatica"];
export const SEAL_SHAPE_IDS = ["cera", "goteo", "redondo", "flor"] as const;
export const OPENING_IDS = [
  "mesa",
  "pantalla",
  "diptico",
  "caja",
  "pelicula",
  "sobre3d",
  "ventana",
  "concepto",
] as const;
/** Las que se enseñan en la venta y los ejemplos: la de concepto va con su plantilla. */
export const SHOWN_OPENING_IDS = OPENING_IDS.filter((id) => id !== "concepto");
export const SEAL_MARK_IDS = [
  "monograma",
  "almendro",
  "corazon",
  "estrella",
  "concha",
  "sol",
  "estrella-marino",
  "corazon-rosa",
] as const;

export type FlapId = (typeof FLAP_IDS)[number];
export type WeightId = (typeof WEIGHT_IDS)[number];
export type TextureId = (typeof TEXTURE_IDS)[number];
export type LinerId = (typeof LINER_IDS)[number];
export type SealShapeId = (typeof SEAL_SHAPE_IDS)[number];
export type SealMarkId = (typeof SEAL_MARK_IDS)[number];
export type OpeningId = (typeof OPENING_IDS)[number];

/**
 * Qué se abre en la apertura «película»: cada opción es un vídeo distinto (un sobre de un color,
 * una caja con lazo o un díptico). `action` es lo que se le pide al invitado y `name`, el nombre
 * accesible del botón.
 */
export const FILM_IDS = [
  "blanco",
  "salvia",
  "burdeos",
  "azul",
  "kraft",
  "ventana",
  "cielo",
  "granate",
  "caja",
  "esmeralda",
  "diptico",
  "eucalipto",
  "noche",
  "ramita-azul",
  "ramita-rosa",
  "ramita-salvia",
  "ventana-salvia",
  "kraft-salvia",
  "caja-noche",
  "caja-rosa",
  "diptico-azul",
  "diptico-burdeos",
] as const;
export type FilmId = (typeof FILM_IDS)[number];
export const FILMS: Record<FilmId, { label: string; hex: string; action: string; name: string }> = {
  blanco: {
    label: "Sobre blanco con lacre dorado",
    hex: "#efe9df",
    action: "Toca el lacre para abrir el sobre",
    name: "Abrir el sobre",
  },
  salvia: {
    label: "Sobre verde salvia",
    hex: "#a9b79c",
    action: "Toca el lacre para abrir el sobre",
    name: "Abrir el sobre",
  },
  burdeos: {
    label: "Sobre burdeos",
    hex: "#7a2230",
    action: "Toca el lacre para abrir el sobre",
    name: "Abrir el sobre",
  },
  azul: {
    label: "Sobre azul empolvado con lacre plateado",
    hex: "#a9bfd6",
    action: "Toca el lacre para abrir el sobre",
    name: "Abrir el sobre",
  },
  kraft: {
    label: "Sobre kraft con lazo burdeos",
    hex: "linear-gradient(90deg, #c9a77c 0 44%, #6e1f2c 44% 56%, #c9a77c 56%)",
    action: "Toca el lazo para abrir el sobre",
    name: "Abrir el sobre",
  },
  ventana: {
    label: "Sobre marfil junto a la ventana",
    hex: "linear-gradient(135deg, #efe9df 0 70%, #7a2230 70%)",
    action: "Toca el lacre para abrir el sobre",
    name: "Abrir el sobre",
  },
  cielo: {
    label: "Sobre azul junto a la ventana",
    hex: "linear-gradient(135deg, #a9bfd6 0 70%, #c9ccd1 70%)",
    action: "Toca el lacre para abrir el sobre",
    name: "Abrir el sobre",
  },
  granate: {
    label: "Sobre burdeos a pantalla completa",
    hex: "radial-gradient(circle, #c9a14a 0 28%, #7a2230 30%)",
    action: "Toca el lacre para abrir el sobre",
    name: "Abrir el sobre",
  },
  caja: {
    label: "Caja con lazo burdeos",
    hex: "linear-gradient(90deg, #efe9df 0 40%, #6e1f2c 40% 60%, #efe9df 60%)",
    action: "Toca el lazo para abrir la caja",
    name: "Abrir la caja",
  },
  esmeralda: {
    label: "Caja esmeralda con lazo dorado",
    hex: "linear-gradient(90deg, #1f4a3a 0 40%, #c9a14a 40% 60%, #1f4a3a 60%)",
    action: "Toca el lazo para abrir la caja",
    name: "Abrir la caja",
  },
  diptico: {
    label: "Díptico con lacre dorado",
    hex: "linear-gradient(90deg, #efe9df 0 48%, #b98a3c 48% 52%, #efe9df 52%)",
    action: "Toca el lacre para abrir la invitación",
    name: "Abrir la invitación",
  },
  eucalipto: {
    label: "Díptico verde salvia con lacre dorado",
    hex: "linear-gradient(90deg, #a9b79c 0 48%, #b98a3c 48% 52%, #a9b79c 52%)",
    action: "Toca el lacre para abrir la invitación",
    name: "Abrir la invitación",
  },
  noche: {
    label: "Sobre azul noche a pantalla completa",
    hex: "radial-gradient(circle, #c9a14a 0 28%, #1f2a4a 30%)",
    action: "Toca el lacre para abrir el sobre",
    name: "Abrir el sobre",
  },
  "ramita-azul": {
    label: "Sobre azul con ramita de olivo",
    hex: "radial-gradient(circle at 50% 45%, #c7c9cc 0 14%, #a9bfd6 16%)",
    action: "Toca el lacre para abrir el sobre",
    name: "Abrir el sobre",
  },
  "ramita-rosa": {
    label: "Sobre rosa empolvado con ramita de olivo",
    hex: "radial-gradient(circle at 50% 45%, #c9a14a 0 14%, #dcb8b0 16%)",
    action: "Toca el lacre para abrir el sobre",
    name: "Abrir el sobre",
  },
  "ramita-salvia": {
    label: "Sobre salvia con ramita de olivo",
    hex: "radial-gradient(circle at 50% 45%, #c9a14a 0 14%, #a9b79c 16%)",
    action: "Toca el lacre para abrir el sobre",
    name: "Abrir el sobre",
  },
  "ventana-salvia": {
    label: "Sobre salvia junto a la ventana",
    hex: "linear-gradient(135deg, #a9b79c 0 70%, #e4e0d8 70%)",
    action: "Toca el lacre para abrir el sobre",
    name: "Abrir el sobre",
  },
  "kraft-salvia": {
    label: "Sobre kraft con lazo salvia",
    hex: "linear-gradient(90deg, #c9a77c 0 44%, #8fa18a 44% 56%, #c9a77c 56%)",
    action: "Toca el lazo para abrir el sobre",
    name: "Abrir el sobre",
  },
  "caja-noche": {
    label: "Caja azul noche con lazo dorado",
    hex: "linear-gradient(90deg, #1f2a4a 0 40%, #c9a14a 40% 60%, #1f2a4a 60%)",
    action: "Toca el lazo para abrir la caja",
    name: "Abrir la caja",
  },
  "caja-rosa": {
    label: "Caja rosa empolvado con lazo marfil",
    hex: "linear-gradient(90deg, #d9b3ad 0 40%, #f3ede2 40% 60%, #d9b3ad 60%)",
    action: "Toca el lazo para abrir la caja",
    name: "Abrir la caja",
  },
  "diptico-azul": {
    label: "Díptico azul empolvado con lacre plateado",
    hex: "linear-gradient(90deg, #a9bfd6 0 48%, #c7c9cc 48% 52%, #a9bfd6 52%)",
    action: "Toca el lacre para abrir la invitación",
    name: "Abrir la invitación",
  },
  "diptico-burdeos": {
    label: "Díptico burdeos con lacre dorado",
    hex: "linear-gradient(90deg, #6e1f2c 0 48%, #c9a14a 48% 52%, #6e1f2c 52%)",
    action: "Toca el lacre para abrir la invitación",
    name: "Abrir la invitación",
  },
};

/** Familia de cada vídeo, para agruparlos en el editor. */
export function filmFamily(id: FilmId): "sobres" | "cajas" | "dipticos" {
  if (id === "caja" || id === "esmeralda" || id.startsWith("caja-")) return "cajas";
  if (id === "diptico" || id === "eucalipto" || id.startsWith("diptico-")) return "dipticos";
  return "sobres";
}

/** Cómo se abre la invitación antes de la carta. `premium`: se ofrece como opción de pago superior. */
export const OPENINGS: Record<
  OpeningId,
  { label: string; description: string; premium?: boolean }
> = {
  mesa: {
    label: "Sobre en la mesa",
    description: "El sobre flota sobre la mesa y se abre al tocarlo.",
  },
  pantalla: {
    label: "Sobre a pantalla completa",
    description: "El sobre ocupa todo el móvil; se rompe el lacre y se levanta la solapa.",
  },
  diptico: { label: "Díptico", description: "Una tarjeta de dos hojas que se abren como puertas." },
  caja: {
    label: "Caja con lazo",
    description: "Una caja de papel con un lazo de seda que se desata.",
  },
  pelicula: {
    label: "Sobre de película",
    premium: true,
    description:
      "Un sobre real en vídeo, con lacre dorado y luz de ventana: el lacre salta, la solapa se abre y del destello sale la carta.",
  },
  sobre3d: {
    label: "Sobre en 3D",
    description:
      "Vuestro sobre con luz y sombras reales: el papel se dobla, la cera brilla al mover el móvil.",
  },
  ventana: {
    label: "Sobre junto a la ventana",
    description:
      "Un sobre de verdad sobre un mantel de lino, con luz de ventana. Se abre con el dedo: rompes el lacre, levantas la solapa y sacas la tarjeta.",
  },
  concepto: {
    label: "La del concepto",
    description:
      "La carta llega dentro del objeto de la plantilla: el periódico, el sobre de correo aéreo, la funda del disco…",
  },
};

export const FLAPS: Record<FlapId, { label: string; description: string }> = {
  pico: { label: "Pico", description: "La solapa clásica en punta." },
  recta: { label: "Recta", description: "Corta y horizontal, de sobre americano." },
  redonda: { label: "Redonda", description: "Curva suave, muy de papelería fina." },
  festoneada: { label: "Festoneada", description: "Borde ondulado, como un encaje." },
};

/** Gramaje: grosor visible del canto, sombra y peso de la apertura. */
export const WEIGHTS: Record<
  WeightId,
  { label: string; description: string; edge: number; shadow: number; pace: number }
> = {
  ligero: { label: "120 g", description: "Ligero y flexible.", edge: 0.6, shadow: 0.16, pace: 0.9 },
  medio: {
    label: "250 g",
    description: "Cartulina de invitación.",
    edge: 1.2,
    shadow: 0.24,
    pace: 1,
  },
  grueso: {
    label: "400 g",
    description: "Algodón grueso, con canto marcado.",
    edge: 2.2,
    shadow: 0.34,
    pace: 1.15,
  },
};

export const TEXTURES: Record<TextureId, { label: string; description: string; image: string }> = {
  liso: { label: "Liso", description: "Solo el grano natural del papel.", image: "none" },
  verjurado: {
    label: "Verjurado",
    description: "Líneas finas al trasluz, de papel hecho a mano.",
    image:
      "repeating-linear-gradient(0deg, rgb(0 0 0 / 0.045) 0 1px, transparent 1px 4px), repeating-linear-gradient(90deg, rgb(0 0 0 / 0.05) 0 1px, transparent 1px 26px)",
  },
  lino: {
    label: "Lino",
    description: "Trama cruzada de tela.",
    image:
      "repeating-linear-gradient(0deg, rgb(0 0 0 / 0.04) 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, rgb(255 255 255 / 0.09) 0 1px, transparent 1px 3px)",
  },
  acanalado: {
    label: "Acanalado",
    description: "Estrías verticales con relieve.",
    image:
      "repeating-linear-gradient(90deg, rgb(0 0 0 / 0.05) 0 1.5px, rgb(255 255 255 / 0.08) 1.5px 3px, transparent 3px 5px)",
  },
};

export const LINERS: Record<LinerId, { label: string; description: string }> = {
  propio: { label: "El del papel", description: "El forro que trae el papel elegido." },
  rayas: { label: "Rayas", description: "Diagonales finas en oro." },
  flores: { label: "Flores", description: "Florecillas repetidas en oro." },
  lunares: { label: "Lunares", description: "Puntos pequeños, alegres." },
  marmol: { label: "Mármol", description: "Vetas suaves de luz." },
  liso: { label: "Liso", description: "Un solo color, sin dibujo." },
  olivo: { label: "Hojas de olivo", description: "Acuarela de hojas verdes sobre marfil." },
  silvestres: { label: "Flores silvestres", description: "Florecillas rosa y salvia, muy finas." },
  toile: { label: "Toile azul", description: "Ramas y pajarillos azules, de los clásicos." },
  estrellas: { label: "Constelaciones", description: "Estrellas doradas sobre azul noche." },
  tropical: { label: "Selva", description: "Hojas tropicales verdes sobre fondo oscuro." },
  diplomatica: { label: "Raya diplomática", description: "Rayas doradas finas sobre blanco roto." },
};

export const SEAL_SHAPES: Record<SealShapeId, { label: string; description: string }> = {
  cera: { label: "Cera derramada", description: "Borde irregular, como recién sellado." },
  goteo: { label: "Cera con goteo", description: "Cera abundante que gotea por los bordes." },
  redondo: { label: "Redondo", description: "Círculo limpio, de sello moderno." },
  flor: { label: "Flor", description: "Ocho pétalos redondeados." },
};

export const SEAL_MARKS: Record<SealMarkId, { label: string }> = {
  monograma: { label: "Iniciales" },
  almendro: { label: "Rama" },
  corazon: { label: "Corazón" },
  estrella: { label: "Estrella" },
  concha: { label: "Concha de plata" },
  sol: { label: "Sol de terracota" },
  "estrella-marino": { label: "Estrella azul marino" },
  "corazon-rosa": { label: "Corazón rosa" },
};

/**
 * Lacres de verdad: fotografías de lacres (Higgsfield) recortadas en `public/lacres/<id>.webp`.
 * Ya traen su color y su forma, así que no usan ni la cera ni el contorno elegidos. Donde el lacre
 * se pinta en un lienzo (el sobre en 3D), se dibuja el grabado más parecido.
 */
export const PHOTO_SEAL_MARKS = {
  concha: "monograma",
  sol: "estrella",
  "estrella-marino": "estrella",
  "corazon-rosa": "corazon",
} as const satisfies Partial<Record<SealMarkId, SealMarkId>>;
export type PhotoSealMarkId = keyof typeof PHOTO_SEAL_MARKS;
export function isPhotoSealMark(mark: SealMarkId): mark is PhotoSealMarkId {
  return mark in PHOTO_SEAL_MARKS;
}
/** El grabado que se dibuja: el propio o, si es un lacre de verdad, el más parecido. */
export function drawnSealMark(mark: SealMarkId) {
  return isPhotoSealMark(mark) ? PHOTO_SEAL_MARKS[mark] : mark;
}

const pct = (n: number) => `${Number(n.toFixed(2))}%`;
const polygon = (points: [number, number][]) =>
  `polygon(${points.map(([x, y]) => `${pct(x)} ${pct(y)}`).join(", ")})`;

/**
 * Geometría de la solapa: `depth` es el % de la altura del sobre que ocupa, y `clip` el recorte
 * dentro de su propia caja (0–100 en los dos ejes). El lacre va siempre en el centro del borde
 * inferior, a `depth` %.
 */
export function flapGeometry(shape: FlapId): { depth: number; clip: string } {
  switch (shape) {
    case "pico":
      return {
        depth: 56,
        clip: polygon([
          [0, 0],
          [100, 0],
          [50, 100],
        ]),
      };
    case "recta":
      return {
        depth: 36,
        clip: polygon([
          [0, 0],
          [100, 0],
          [100, 82],
          [97, 100],
          [3, 100],
          [0, 82],
        ]),
      };
    case "redonda": {
      // Arco: baja desde las esquinas hasta el centro siguiendo un seno suavizado.
      const points: [number, number][] = [
        [0, 0],
        [100, 0],
      ];
      for (let i = 0; i <= 24; i++) {
        const x = 100 - (i / 24) * 100;
        points.push([x, 30 + 70 * Math.sin((Math.PI * x) / 100) ** 0.75]);
      }
      return { depth: 48, clip: polygon(points) };
    }
    case "festoneada": {
      // Borde recto con 9 ondas (semicírculos aproximados con 6 puntos cada uno).
      const waves = 9;
      const points: [number, number][] = [
        [0, 0],
        [100, 0],
        [100, 78],
      ];
      for (let w = 0; w < waves; w++) {
        const start = 100 - (w / waves) * 100;
        const width = 100 / waves;
        for (let k = 1; k <= 6; k++) {
          const t = k / 6;
          points.push([start - width * t, 78 + 22 * Math.sin(Math.PI * t)]);
        }
      }
      return { depth: 40, clip: polygon(points) };
    }
  }
}

/** Florecilla de cinco pétalos en SVG, repetida como dibujo del forro. */
function flowerTile(color: string) {
  const petals = Array.from({ length: 5 }, (_, i) => {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    return `<circle cx='${(11 + Math.cos(a) * 3.2).toFixed(2)}' cy='${(11 + Math.sin(a) * 3.2).toFixed(2)}' r='2.3'/>`;
  }).join("");
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='22' height='22'><g fill='${color}' fill-opacity='.55'>${petals}</g><circle cx='11' cy='11' r='1.3' fill='${color}'/><circle cx='0' cy='0' r='1' fill='${color}' fill-opacity='.5'/><circle cx='22' cy='22' r='1' fill='${color}' fill-opacity='.5'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/** Fondo CSS del forro (propiedad `background`), con el interior del sobre y el oro del tema. */
export function linerBackground(
  liner: LinerId,
  { inside, gold, own }: { inside: string; gold: string; own: string },
): string {
  if (PAINTED_LINERS.includes(liner)) {
    return `url("/forros/${liner}.webp") center / cover no-repeat, ${inside}`;
  }
  switch (liner) {
    case "propio":
      return own;
    case "rayas":
      return `repeating-linear-gradient(135deg, ${inside} 0 9px, ${gold} 9px 9.6px, ${inside} 9.6px 18px)`;
    case "flores":
      return `${flowerTile(gold)} 0 0 / 22px 22px, ${inside}`;
    case "lunares":
      return `radial-gradient(circle at 50% 50%, ${gold} 0 1.4px, transparent 1.8px) 0 0 / 12px 12px, ${inside}`;
    case "marmol":
      return `radial-gradient(120% 70% at 15% 20%, rgb(255 255 255 / 0.16), transparent 60%), linear-gradient(118deg, transparent 38%, rgb(255 255 255 / 0.22) 40%, transparent 42.5%, transparent 66%, rgb(255 255 255 / 0.14) 67.5%, transparent 69.5%), linear-gradient(32deg, transparent 55%, ${gold}55 56.5%, transparent 58%), ${inside}`;
    default:
      return inside;
  }
}

/** Contorno del lacre en un lienzo de 100 × 100, como atributo `points` de un polígono SVG. */
export function sealOutline(shape: SealShapeId): string {
  const n = shape === "flor" || shape === "goteo" ? 96 : 36;
  return Array.from({ length: n }, (_, i) => {
    const angle = (i / n) * Math.PI * 2;
    let r: number;
    if (shape === "cera") r = i % 2 ? 46 : 48.5 + ((i * 7) % 5) * 0.4;
    else if (shape === "goteo") r = 40 + dripBulge(angle) + ((i * 13) % 7) * 0.25;
    else if (shape === "redondo") r = 47.5;
    else r = 42 + 6 * Math.abs(Math.cos(angle * 4));
    return `${(50 + Math.cos(angle) * r).toFixed(1)},${(50 + Math.sin(angle) * r).toFixed(1)}`;
  }).join(" ");
}

/** Ángulos (radianes) donde la cera rebosa y forma una gota. */
const DRIPS = [0.35, 1.45, 2.3, 3.55, 4.5, 5.6];

/** Abultamiento del borde en cada gota: una campana estrecha alrededor de su ángulo. */
function dripBulge(angle: number) {
  return DRIPS.reduce((sum, a, i) => {
    const d = Math.atan2(Math.sin(angle - a), Math.cos(angle - a));
    return sum + (6 + (i % 3) * 1.5) * Math.exp(-((d / 0.13) ** 2));
  }, 0);
}

/** Gotitas sueltas junto a las gotas grandes del lacre con goteo: [x, y, radio]. */
export function sealDroplets(): [number, number, number][] {
  return DRIPS.map((a, i) => {
    const r = 49.5 - (i % 2) * 1.5;
    return [
      Number((50 + Math.cos(a + 0.05) * r).toFixed(1)),
      Number((50 + Math.sin(a + 0.05) * r).toFixed(1)),
      i % 2 ? 1 : 1.4,
    ];
  });
}
