/*
 * Sobre a medida: forma de la solapa, gramaje, textura del papel, forro y lacre. Son funciones
 * puras (sin React) para poder probarlas: devuelven recortes `clip-path` y fondos CSS.
 */

export const FLAP_IDS = ["pico", "recta", "redonda", "festoneada"] as const;
export const WEIGHT_IDS = ["ligero", "medio", "grueso"] as const;
export const TEXTURE_IDS = ["liso", "verjurado", "lino", "acanalado"] as const;
export const LINER_IDS = ["propio", "rayas", "flores", "lunares", "marmol", "liso"] as const;
export const SEAL_SHAPE_IDS = ["cera", "goteo", "redondo", "flor"] as const;
export const OPENING_IDS = [
  "mesa",
  "pantalla",
  "diptico",
  "caja",
  "pelicula",
  "sobre3d",
  "ventana",
] as const;
export const SEAL_MARK_IDS = ["monograma", "almendro", "corazon", "estrella"] as const;

export type FlapId = (typeof FLAP_IDS)[number];
export type WeightId = (typeof WEIGHT_IDS)[number];
export type TextureId = (typeof TEXTURE_IDS)[number];
export type LinerId = (typeof LINER_IDS)[number];
export type SealShapeId = (typeof SEAL_SHAPE_IDS)[number];
export type SealMarkId = (typeof SEAL_MARK_IDS)[number];
export type OpeningId = (typeof OPENING_IDS)[number];

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
};

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
    case "liso":
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
