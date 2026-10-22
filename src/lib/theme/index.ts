import type { CSSProperties } from "react";
import type { z } from "zod";
import type { themeSchema } from "./schema";
import { linerBackground, TEXTURES, WEIGHTS } from "./envelope";

export * from "./cover";
export * from "./envelope";
export * from "./letter";
export * from "./music";

/*
 * Tema de una invitación (events.theme). Es una lista cerrada de opciones, no colores libres:
 * cada combinación de estilo, sobre, lacre y calendario está revisada para que el texto se lea
 * (ver tests/unit/theme.test.ts). Se aplica sobrescribiendo las variables CSS de globals.css en
 * la raíz de la invitación.
 */

export const STYLE_IDS = [
  "mediterraneo",
  "clasico",
  "noche",
  "botanico",
  "terracota",
  "empolvado",
  "pizarra",
  "esmeralda",
  "cine",
] as const;
export const ENVELOPE_IDS = [
  "olivo",
  "lino",
  "kraft",
  "algodon",
  "piedra",
  "salvia",
  "rosa",
  "medianoche",
] as const;
export const WAX_IDS = [
  "burdeos",
  "salvia",
  "azul",
  "oro",
  "rosa",
  "teja",
  "lavanda",
  "negro",
] as const;
export const CALENDAR_IDS = ["taco", "minimal", "mano", "corazon", "semana", "poster"] as const;
export const FONT_IDS = [
  "editorial",
  "clasica",
  "romantica",
  "caligrafica",
  "moderna",
  "deco",
  "organica",
  "minimal",
] as const;

export type StyleId = (typeof STYLE_IDS)[number];
export type EnvelopeId = (typeof ENVELOPE_IDS)[number];
export type WaxId = (typeof WAX_IDS)[number];
export type CalendarId = (typeof CALENDAR_IDS)[number];
export type FontId = (typeof FONT_IDS)[number];

/** Secciones de la invitación que se pueden ocultar (la confirmación siempre se ve). */
export const SECTION_IDS = [
  "fecha",
  "programa",
  "lugares",
  "transporte",
  "info",
  "historia",
  "regalo",
] as const;
export type SectionId = (typeof SECTION_IDS)[number];

export const SECTIONS: Record<SectionId, string> = {
  fecha: "Guarda la fecha",
  programa: "El día (programa)",
  lugares: "Dónde (lugares)",
  transporte: "Cómo llegar",
  info: "Antes de venir",
  historia: "Nuestra historia",
  regalo: "Regalo",
};

/**
 * Orden de las secciones: los ids válidos en el orden dado, sin repetir, y al final los que
 * falten (así una sección nueva aparece aunque el orden se guardara antes de existir).
 */
export function normalizeOrder(order: readonly string[]): SectionId[] {
  const valid = order.filter((id): id is SectionId =>
    (SECTION_IDS as readonly string[]).includes(id),
  );
  const unique = [...new Set(valid)];
  return [...unique, ...SECTION_IDS.filter((id) => !unique.includes(id))];
}

// Los esquemas de Zod (validar el tema que llega del editor o de la base de datos) viven en
// ./schema: así la invitación, que solo necesita paletas y valores por defecto, no carga Zod.
export type Theme = z.infer<typeof themeSchema>;

export const DEFAULT_THEME: Theme = {
  style: "mediterraneo",
  envelope: "olivo",
  wax: "burdeos",
  waxColor: null,
  font: "editorial",
  flap: "pico",
  weight: "medio",
  texture: "liso",
  liner: "propio",
  sealShape: "cera",
  sealMark: "monograma",
  opening: "mesa",
  cover: "foto",
  layout: "clasica",
  edge: "barba",
  ornament: "almendro",
  calendar: "taco",
  hidden: [],
  order: [...SECTION_IDS],
  music: true,
  musicStyle: "piano",
};

export interface Palette {
  paper: string;
  ivory: string;
  cream: string;
  sand: string;
  taupe: string;
  stone: string;
  ink: string;
  inkSoft: string;
  muted: string;
  line: string;
  gold: string;
  goldSoft: string;
  success: string;
  danger: string;
  warning: string;
}

interface StyleDef {
  label: string;
  description: string;
  dark: boolean;
  palette: Palette;
  /** Fondo de las escenas del sobre y de la carta, de claro a oscuro. */
  scene: [string, string, string, string];
}

export const STYLES: Record<StyleId, StyleDef> = {
  mediterraneo: {
    label: "Mediterráneo",
    description: "Marfil de algodón, tinta de olivo y oro viejo.",
    dark: false,
    palette: {
      paper: "#faf8f3",
      ivory: "#efebe1",
      cream: "#e6e0d2",
      sand: "#d9cfbb",
      taupe: "#b3a68c",
      stone: "#8a8371",
      ink: "#23271e",
      inkSoft: "#42463b",
      muted: "#5c5e53",
      line: "#d9d2c2",
      gold: "#a3874e",
      goldSoft: "#d3c08f",
      success: "#3c6645",
      danger: "#9a3328",
      warning: "#7a5312",
    },
    scene: ["#f3e9dd", "#e3d6c2", "#cdbca4", "#b6a387"],
  },
  clasico: {
    label: "Clásico",
    description: "Blanco roto, negro y una garalda elegante.",
    dark: false,
    palette: {
      paper: "#fdfcfa",
      ivory: "#f3f1ed",
      cream: "#e8e5df",
      sand: "#d9d5cc",
      taupe: "#aaa497",
      stone: "#7f7b72",
      ink: "#1b1b1e",
      inkSoft: "#3a3a40",
      muted: "#5a5a61",
      line: "#dcd8d0",
      gold: "#94773d",
      goldSoft: "#d6c49a",
      success: "#3c6645",
      danger: "#9a3328",
      warning: "#7a5312",
    },
    scene: ["#f4f2ee", "#e6e3dd", "#d2cec6", "#bab5ab"],
  },
  noche: {
    label: "Noche",
    description: "Azul de medianoche con letras en oro.",
    dark: true,
    palette: {
      paper: "#1a1e29",
      ivory: "#12151d",
      cream: "#252a37",
      sand: "#323848",
      taupe: "#5b6172",
      stone: "#8d92a2",
      ink: "#f1ebdf",
      inkSoft: "#d9d3c6",
      muted: "#b5b1a7",
      line: "#353b4b",
      gold: "#c9a65d",
      goldSoft: "#8a713f",
      success: "#8cc79a",
      danger: "#f0938a",
      warning: "#e5bb6c",
    },
    scene: ["#2a3042", "#1f2433", "#171b27", "#0f121a"],
  },
  botanico: {
    label: "Botánico",
    description: "Verde salvia, papel claro y tinta de hoja.",
    dark: false,
    palette: {
      paper: "#f6f7f1",
      ivory: "#e9ece2",
      cream: "#dfe3d6",
      sand: "#cdd3c2",
      taupe: "#9fa891",
      stone: "#7a8370",
      ink: "#1f2a1f",
      inkSoft: "#3a4637",
      muted: "#525c4e",
      line: "#d3d8c8",
      gold: "#8c7a45",
      goldSoft: "#cfc28f",
      success: "#3c6645",
      danger: "#9a3328",
      warning: "#7a5312",
    },
    scene: ["#eef0e6", "#dde2d2", "#c7cfb9", "#adb89c"],
  },
  terracota: {
    label: "Terracota",
    description: "Arcilla cálida, crema y tinta tostada.",
    dark: false,
    palette: {
      paper: "#fbf6f1",
      ivory: "#f2e8de",
      cream: "#e9dbcd",
      sand: "#dcc6b2",
      taupe: "#b8987c",
      stone: "#8d7562",
      ink: "#2d1f18",
      inkSoft: "#4c372c",
      muted: "#634f46",
      line: "#e0d0c2",
      gold: "#a3784a",
      goldSoft: "#d9b98f",
      success: "#3c6645",
      danger: "#9a3328",
      warning: "#7a5312",
    },
    scene: ["#f4e6da", "#e8d2c0", "#d6b9a1", "#c09d82"],
  },
  empolvado: {
    label: "Rosa empolvado",
    description: "Rosa muy suave, gris cálido y oro rosado.",
    dark: false,
    palette: {
      paper: "#fcf8f7",
      ivory: "#f4eae8",
      cream: "#ecdedb",
      sand: "#e0cbc7",
      taupe: "#bfa29c",
      stone: "#927a76",
      ink: "#2b2023",
      inkSoft: "#4a3a3e",
      muted: "#645558",
      line: "#e6d6d3",
      gold: "#a67f5c",
      goldSoft: "#dcc0a5",
      success: "#3c6645",
      danger: "#9a3328",
      warning: "#7a5312",
    },
    scene: ["#f5e8e5", "#ead6d2", "#d9bcb6", "#c3a19a"],
  },
  pizarra: {
    label: "Costa",
    description: "Gris azulado de mar en invierno y tinta pizarra.",
    dark: false,
    palette: {
      paper: "#f7f8f9",
      ivory: "#eceff2",
      cream: "#e1e5ea",
      sand: "#ced5dc",
      taupe: "#9aa5b1",
      stone: "#737e8a",
      ink: "#1c232b",
      inkSoft: "#36404b",
      muted: "#515b66",
      line: "#d6dce2",
      gold: "#8b7a52",
      goldSoft: "#cdbf98",
      success: "#3c6645",
      danger: "#9a3328",
      warning: "#7a5312",
    },
    scene: ["#e9edf1", "#d8dee5", "#c1cad4", "#a6b1bd"],
  },
  esmeralda: {
    label: "Esmeralda",
    description: "Verde botella profundo con letras en oro.",
    dark: true,
    palette: {
      paper: "#16231d",
      ivory: "#0f1915",
      cream: "#1f2f27",
      sand: "#2a3d33",
      taupe: "#50665a",
      stone: "#8ba395",
      ink: "#eef0e6",
      inkSoft: "#d3dacd",
      muted: "#aeb8aa",
      line: "#2c4036",
      gold: "#c9a65d",
      goldSoft: "#7f6a3c",
      success: "#8cc79a",
      danger: "#f0938a",
      warning: "#e5bb6c",
    },
    scene: ["#24382e", "#1a2a22", "#13201a", "#0c1511"],
  },
  cine: {
    label: "Cine",
    description: "Casi negro, letras marfil y oro champán: como los créditos de una película.",
    dark: true,
    palette: {
      paper: "#17140f",
      ivory: "#0f0d0a",
      cream: "#221e18",
      sand: "#2f2a22",
      taupe: "#5e564b",
      stone: "#948a7b",
      ink: "#f3ece0",
      inkSoft: "#ddd4c5",
      muted: "#b9b0a1",
      line: "#302a22",
      gold: "#d4b177",
      goldSoft: "#8f7546",
      success: "#8cc79a",
      danger: "#f0938a",
      warning: "#e5bb6c",
    },
    scene: ["#2a241d", "#1c1813", "#13100c", "#0a0806"],
  },
};

/** Color de la cera. En los estilos oscuros el acento del texto se aclara para que se lea. */
export const WAXES: Record<WaxId, { label: string; hex: string }> = {
  burdeos: { label: "Burdeos", hex: "#6b1e2a" },
  salvia: { label: "Salvia", hex: "#4a5a3f" },
  azul: { label: "Azul noche", hex: "#24365a" },
  oro: { label: "Oro viejo", hex: "#7d5f22" },
  rosa: { label: "Rosa antiguo", hex: "#8e4757" },
  teja: { label: "Teja", hex: "#8a3f25" },
  lavanda: { label: "Lavanda", hex: "#5d4f7a" },
  negro: { label: "Negro", hex: "#262626" },
};

/** Color de la cera: el propio del cliente o el del lacre elegido. */
export function waxHex(theme: Theme): string {
  return theme.waxColor ?? WAXES[theme.wax].hex;
}

interface EnvelopeDef {
  label: string;
  description: string;
  /** Papel exterior: degradado de luz a sombra. */
  paper: [string, string];
  /** Fondo interior y forro (visibles al abrir). */
  inside: string;
  liner: string;
  /** Rama de almendro dibujada en la solapa. */
  ornament: boolean;
}

export const ENVELOPES: Record<EnvelopeId, EnvelopeDef> = {
  olivo: {
    label: "Algodón con forro de olivo",
    description: "Papel marfil, forro rayado en oro y rama de almendro.",
    paper: ["#f3ebde", "#e7dcc9"],
    inside: "#2c3125",
    liner:
      "repeating-linear-gradient(135deg, #2c3125 0 9px, #a3874e 9px 9.6px, #2c3125 9.6px 18px)",
    ornament: true,
  },
  lino: {
    label: "Lino con forro azul",
    description: "Papel blanco de lino y forro azul con lunares.",
    paper: ["#fbfaf7", "#ece9e1"],
    inside: "#3f5574",
    liner:
      "radial-gradient(circle at 50% 50%, rgb(255 255 255 / 0.4) 0 1.4px, transparent 1.8px) 0 0 / 12px 12px, #4d6687",
    ornament: false,
  },
  kraft: {
    label: "Kraft con forro crema",
    description: "Papel kraft natural y forro de rayas crema.",
    paper: ["#c9a77c", "#b48f62"],
    inside: "#7d5f3f",
    liner: "repeating-linear-gradient(90deg, #efe6d6 0 10px, #e2d3ba 10px 20px)",
    ornament: false,
  },
  algodon: {
    label: "Algodón blanco",
    description: "Blanco puro de algodón y forro marfil liso.",
    paper: ["#fdfdfb", "#efeee9"],
    inside: "#e9e3d6",
    liner: "#e9e3d6",
    ornament: false,
  },
  piedra: {
    label: "Gris piedra",
    description: "Papel gris cálido y forro de rayas blancas.",
    paper: ["#d9d6cf", "#c2beb5"],
    inside: "#5d5a54",
    liner: "repeating-linear-gradient(90deg, #6a665f 0 8px, #f2efe9 8px 9px)",
    ornament: false,
  },
  salvia: {
    label: "Verde salvia",
    description: "Papel verde suave con rama de almendro.",
    paper: ["#c9d1bd", "#b3bda5"],
    inside: "#3f4a37",
    liner:
      "repeating-linear-gradient(135deg, #3f4a37 0 9px, #c9b583 9px 9.6px, #3f4a37 9.6px 18px)",
    ornament: true,
  },
  rosa: {
    label: "Rosa empolvado",
    description: "Rosa muy pálido con forro granate.",
    paper: ["#f1e1dc", "#e3cbc4"],
    inside: "#6e3341",
    liner:
      "radial-gradient(circle at 50% 50%, rgb(255 230 225 / 0.45) 0 1.4px, transparent 1.8px) 0 0 / 12px 12px, #6e3341",
    ornament: false,
  },
  medianoche: {
    label: "Azul medianoche",
    description: "Papel azul profundo y forro dorado.",
    paper: ["#2b3550", "#1e263b"],
    inside: "#b8955a",
    liner:
      "repeating-linear-gradient(135deg, #b8955a 0 9px, #e6cf9a 9px 9.6px, #b8955a 9.6px 18px)",
    ornament: false,
  },
};

/*
 * Tipografías: titulares y, si se indica, otra para los nombres de la pareja (las caligráficas
 * solo se usan ahí, donde se leen bien). Las variables vienen de next/font en el layout raíz.
 */
const BODONI = "var(--font-bodoni), 'Bodoni Moda', Didot, Georgia, serif";
const CORMORANT = "var(--font-cormorant), 'Cormorant Garamond', Garamond, Georgia, serif";

export const FONTS: Record<
  FontId,
  { label: string; description: string; display: string; names?: string }
> = {
  editorial: {
    label: "Editorial",
    description: "Didona de alto contraste, como una revista de moda.",
    display: BODONI,
  },
  clasica: {
    label: "Clásica",
    description: "Garalda fina y serena de papelería tradicional.",
    display: CORMORANT,
  },
  romantica: {
    label: "Romántica",
    description: "Garalda en los textos y nombres a pluma.",
    display: CORMORANT,
    names: "var(--font-pinyon), 'Pinyon Script', cursive",
  },
  caligrafica: {
    label: "Caligráfica",
    description: "Nombres en caligrafía fluida y titulares con mucho carácter.",
    display: "var(--font-playfair), 'Playfair Display', Georgia, serif",
    names: "var(--font-great-vibes), 'Great Vibes', cursive",
  },
  moderna: {
    label: "Moderna",
    description: "Letra alta y delgada, limpia y muy elegante.",
    display: "var(--font-italiana), Italiana, Didot, serif",
  },
  deco: {
    label: "Art déco",
    description: "Geométrica de los años veinte, ideal con oro.",
    display: "var(--font-poiret), 'Poiret One', Futura, sans-serif",
  },
  organica: {
    label: "Orgánica",
    description: "Serifa suave y cálida, con curvas redondeadas.",
    display: "var(--font-fraunces), Fraunces, Georgia, serif",
  },
  minimal: {
    label: "Minimal",
    description: "Sin serifa geométrica: sobria y contemporánea.",
    display: "var(--font-jost), Jost, Futura, sans-serif",
  },
};

export const CALENDARS: Record<CalendarId, { label: string; description: string }> = {
  taco: { label: "Taco de hojas", description: "Las hojas caen hasta el mes de la boda." },
  minimal: { label: "Minimal", description: "Una hoja limpia con el día marcado." },
  mano: { label: "A pluma", description: "La hoja del mes con el día rodeado a mano." },
  corazon: { label: "Corazón", description: "El día rodeado con un corazón a mano alzada." },
  semana: { label: "Semana", description: "Solo la semana de la boda, con el día en grande." },
  poster: { label: "Cartel", description: "El número del día enorme, como un cartel." },
};

/** Mezcla dos colores #rrggbb en sRGB (t = 0 → a, t = 1 → b). */
export function mix(a: string, b: string, t: number): string {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  const channel = (x: number, y: number) =>
    Math.round(x + (y - x) * t)
      .toString(16)
      .padStart(2, "0");
  return `#${channel(ar, br)}${channel(ag, bg)}${channel(ab, bb)}`;
}

export function hexToRgb(hex: string): [number, number, number] {
  const n = Number.parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Contraste WCAG 2 entre dos colores #rrggbb. */
export function contrast(a: string, b: string): number {
  const linear = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const lum = (hex: string) => {
    const [r, g, bl] = hexToRgb(hex);
    return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(bl);
  };
  const la = lum(a);
  const lb = lum(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/**
 * Acerca un color a `toward` lo justo para que se lea sobre `bg` (contraste ≥ `target`).
 * Así un color libre del cliente nunca deja un texto ilegible.
 */
export function readableOn(color: string, bg: string, toward: string, target = 4.5): string {
  for (let t = 0; t <= 1; t += 0.05) {
    const candidate = mix(color, toward, t);
    if (contrast(candidate, bg) >= target) return candidate;
  }
  return toward;
}

/** Acento para texto (el día marcado, las alertas del programa…): la cera, legible sobre el papel. */
export function accentFor(theme: Theme): string {
  const style = STYLES[theme.style];
  const wax = waxHex(theme);
  const start = style.dark ? mix(wax, "#f6e9dc", 0.62) : wax;
  return readableOn(start, style.palette.paper, style.dark ? "#ffffff" : style.palette.ink, 4.6);
}

/** Variables CSS del tema, para el atributo style de la raíz de la invitación. */
export function themeVars(theme: Theme): CSSProperties {
  const style = STYLES[theme.style];
  const p = style.palette;
  const envelope = ENVELOPES[theme.envelope];
  const weight = WEIGHTS[theme.weight];
  const wax = waxHex(theme);
  const vars: Record<string, string> = {
    "--color-paper": p.paper,
    "--color-ivory": p.ivory,
    "--color-cream": p.cream,
    "--color-sand": p.sand,
    "--color-taupe": p.taupe,
    "--color-stone": p.stone,
    "--color-ink": p.ink,
    "--color-ink-soft": p.inkSoft,
    "--color-muted": p.muted,
    "--color-line": p.line,
    "--color-gold": p.gold,
    "--color-gold-soft": p.goldSoft,
    "--color-success": p.success,
    "--color-danger": p.danger,
    "--color-warning": p.warning,
    "--color-wax": accentFor(theme),
    "--color-wax-dark": mix(wax, "#000000", 0.38),
    "--seal": wax,
    "--scene-1": style.scene[0],
    "--scene-2": style.scene[1],
    "--scene-3": style.scene[2],
    "--scene-4": style.scene[3],
    "--env-paper-a": envelope.paper[0],
    "--env-paper-b": envelope.paper[1],
    "--env-inside": envelope.inside,
    "--env-liner": linerBackground(theme.liner, {
      inside: envelope.inside,
      gold: p.gold,
      own: envelope.liner,
    }),
    "--env-texture": TEXTURES[theme.texture].image,
    "--env-edge": mix(envelope.paper[1], "#000000", 0.22),
    "--env-shadow": String(weight.shadow),
  };
  const font = FONTS[theme.font];
  vars["--font-display"] = font.display;
  vars["--font-names"] = font.names ?? font.display;
  return vars as CSSProperties;
}

/*
 * Plantillas: combinaciones completas ya diseñadas. El cliente parte de una y después cambia cada
 * detalle por separado. Aplicar una plantilla cambia el aspecto, pero no las secciones ni la música.
 */
export const TEMPLATE_IDS = [
  "almendro",
  "atelier",
  "medianoche",
  "jardin",
  "terracota",
  "empolvado",
  "costa",
  "esmeralda",
  "luciernagas",
  "acuarela",
  "gala",
  "cine",
] as const;
export type TemplateId = (typeof TEMPLATE_IDS)[number];

type Look = Omit<Theme, "hidden" | "order" | "music">;

export const TEMPLATES: Record<
  TemplateId,
  { label: string; description: string; look: Partial<Look> }
> = {
  almendro: {
    label: "Almendro",
    description: "Mediterránea, con forro de olivo y lacre burdeos.",
    look: {
      style: "mediterraneo",
      envelope: "olivo",
      wax: "burdeos",
      calendar: "taco",
      font: "editorial",
    },
  },
  atelier: {
    label: "Atelier",
    description: "Algodón blanco, solapa recta y garalda: papelería clásica.",
    look: {
      style: "clasico",
      envelope: "algodon",
      wax: "azul",
      calendar: "mano",
      font: "clasica",
      flap: "recta",
      texture: "verjurado",
      liner: "lunares",
      sealShape: "redondo",
      layout: "marco",
      edge: "recto",
      ornament: "ninguno",
    },
  },
  medianoche: {
    label: "Medianoche",
    description: "Azul noche, solapa redonda y lacre con estrella dorada.",
    look: {
      style: "noche",
      envelope: "medianoche",
      wax: "oro",
      calendar: "poster",
      font: "moderna",
      flap: "redonda",
      liner: "propio",
      sealShape: "redondo",
      sealMark: "estrella",
      layout: "minimal",
      edge: "recto",
      ornament: "geometrico",
    },
  },
  jardin: {
    label: "Jardín",
    description: "Verde salvia, solapa festoneada y forro de flores.",
    look: {
      style: "botanico",
      envelope: "salvia",
      wax: "salvia",
      calendar: "taco",
      font: "romantica",
      flap: "festoneada",
      liner: "flores",
      sealMark: "almendro",
      layout: "foto",
      ornament: "eucalipto",
    },
  },
  terracota: {
    label: "Terracota",
    description: "Kraft, arcilla y lacre teja: rústico y cálido.",
    look: {
      style: "terracota",
      envelope: "kraft",
      wax: "teja",
      calendar: "taco",
      font: "organica",
      texture: "lino",
      weight: "grueso",
      liner: "rayas",
      layout: "editorial",
      ornament: "olivo",
    },
  },
  empolvado: {
    label: "Rosa empolvado",
    description: "Romántica, con lacre en flor y un corazón grabado.",
    look: {
      style: "empolvado",
      envelope: "rosa",
      wax: "rosa",
      calendar: "corazon",
      font: "caligrafica",
      flap: "redonda",
      liner: "flores",
      sealShape: "flor",
      sealMark: "corazon",
      edge: "redondeado",
    },
  },
  costa: {
    label: "Costa",
    description: "Gris azulado y lacre azul para bodas junto al mar.",
    look: {
      style: "pizarra",
      envelope: "piedra",
      wax: "azul",
      calendar: "semana",
      font: "minimal",
      flap: "recta",
      texture: "verjurado",
      liner: "rayas",
      sealShape: "redondo",
      layout: "minimal",
      edge: "recto",
      ornament: "ninguno",
    },
  },
  esmeralda: {
    label: "Esmeralda",
    description: "Verde botella, forro de mármol y papel grueso.",
    look: {
      style: "esmeralda",
      envelope: "kraft",
      wax: "oro",
      calendar: "minimal",
      font: "deco",
      weight: "grueso",
      liner: "marmol",
      sealMark: "estrella",
      layout: "marco",
      edge: "recto",
      ornament: "geometrico",
    },
  },
  luciernagas: {
    label: "Luciérnagas",
    description: "Sobre a pantalla completa, noche azul con luces y mariposas.",
    look: {
      style: "noche",
      envelope: "medianoche",
      wax: "azul",
      calendar: "poster",
      font: "caligrafica",
      opening: "pantalla",
      cover: "luces",
      sealShape: "goteo",
      liner: "propio",
      layout: "minimal",
      edge: "recto",
      ornament: "ninguno",
      musicStyle: "cajita",
    },
  },
  acuarela: {
    label: "Acuarela",
    description: "Díptico rosa, flores pintadas y caja de música.",
    look: {
      style: "empolvado",
      envelope: "rosa",
      wax: "rosa",
      calendar: "corazon",
      font: "romantica",
      opening: "diptico",
      cover: "acuarela",
      sealShape: "flor",
      sealMark: "corazon",
      liner: "flores",
      edge: "barba",
      ornament: "almendro",
      musicStyle: "piano",
    },
  },
  gala: {
    label: "Gala",
    description: "Caja con lazo, cielo estrellado y cuerdas: una noche de etiqueta.",
    look: {
      style: "esmeralda",
      envelope: "kraft",
      wax: "oro",
      calendar: "poster",
      font: "deco",
      opening: "caja",
      cover: "estrellas",
      weight: "grueso",
      liner: "marmol",
      sealMark: "estrella",
      layout: "marco",
      edge: "recto",
      ornament: "geometrico",
      musicStyle: "cuerdas",
    },
  },
  cine: {
    label: "Cine",
    description:
      "Fundido desde negro, vuestra foto a cámara lenta y los nombres como en los créditos.",
    look: {
      style: "cine",
      envelope: "medianoche",
      wax: "oro",
      calendar: "poster",
      font: "editorial",
      opening: "pantalla",
      cover: "cine",
      weight: "grueso",
      liner: "propio",
      sealMark: "monograma",
      layout: "editorial",
      edge: "recto",
      ornament: "ninguno",
      musicStyle: "cuerdas",
    },
  },
};

/** Aplica una plantilla sobre el tema actual: conserva las secciones, su orden y la música. */
export function applyTemplate(current: Theme, id: TemplateId): Theme {
  const { hidden, order, music } = current;
  return { ...DEFAULT_THEME, ...TEMPLATES[id].look, hidden, order, music };
}

/** La plantilla de la que sale el tema, si no se ha cambiado nada después. */
export function templateOf(theme: Theme): TemplateId | null {
  return (
    TEMPLATE_IDS.find((id) => {
      const look = applyTemplate(theme, id);
      return (Object.keys(look) as (keyof Theme)[]).every((k) => look[k] === theme[k]);
    }) ?? null
  );
}
