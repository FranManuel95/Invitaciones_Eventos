import type { CSSProperties } from "react";
import { z } from "zod";

/*
 * Tema de una invitación (events.theme). Es una lista cerrada de opciones, no colores libres:
 * cada combinación de estilo, sobre, lacre y calendario está revisada para que el texto se lea
 * (ver tests/unit/theme.test.ts). Se aplica sobrescribiendo las variables CSS de globals.css en
 * la raíz de la invitación.
 */

export const STYLE_IDS = ["mediterraneo", "clasico", "noche"] as const;
export const ENVELOPE_IDS = ["olivo", "lino", "kraft"] as const;
export const WAX_IDS = ["burdeos", "salvia", "azul", "oro"] as const;
export const CALENDAR_IDS = ["taco", "minimal"] as const;

export type StyleId = (typeof STYLE_IDS)[number];
export type EnvelopeId = (typeof ENVELOPE_IDS)[number];
export type WaxId = (typeof WAX_IDS)[number];
export type CalendarId = (typeof CALENDAR_IDS)[number];

/** Tema que envía el editor: estricto, sin corregir valores desconocidos. */
export const themeInputSchema = z.strictObject({
  style: z.enum(STYLE_IDS),
  envelope: z.enum(ENVELOPE_IDS),
  wax: z.enum(WAX_IDS),
  calendar: z.enum(CALENDAR_IDS),
});

/** Tema leído de la base de datos: lo que falte o no se reconozca vuelve al valor por defecto. */
export const themeSchema = z.object({
  style: z.enum(STYLE_IDS).catch("mediterraneo"),
  envelope: z.enum(ENVELOPE_IDS).catch("olivo"),
  wax: z.enum(WAX_IDS).catch("burdeos"),
  calendar: z.enum(CALENDAR_IDS).catch("taco"),
});

export type Theme = z.infer<typeof themeSchema>;

export const DEFAULT_THEME: Theme = {
  style: "mediterraneo",
  envelope: "olivo",
  wax: "burdeos",
  calendar: "taco",
};

/** Lee un tema guardado: lo que falte o no se reconozca vuelve al valor por defecto. */
export function parseTheme(raw: unknown): Theme {
  const result = themeSchema.safeParse(raw && typeof raw === "object" ? raw : {});
  return result.success ? result.data : DEFAULT_THEME;
}

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
  /** Tipografía de titulares (variable de next/font definida en el layout raíz). */
  display?: string;
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
    display: "var(--font-cormorant), 'Cormorant Garamond', Garamond, Georgia, serif",
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
};

/** Color de la cera. En los estilos oscuros el acento del texto se aclara para que se lea. */
export const WAXES: Record<WaxId, { label: string; hex: string }> = {
  burdeos: { label: "Burdeos", hex: "#6b1e2a" },
  salvia: { label: "Salvia", hex: "#4a5a3f" },
  azul: { label: "Azul noche", hex: "#24365a" },
  oro: { label: "Oro viejo", hex: "#7d5f22" },
};

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
};

export const CALENDARS: Record<CalendarId, { label: string; description: string }> = {
  taco: { label: "Taco de hojas", description: "Las hojas caen hasta el mes de la boda." },
  minimal: { label: "Minimal", description: "Una hoja limpia con el día marcado." },
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

/** Acento para texto (el día marcado, las alertas del programa…): la cera, legible sobre el papel. */
export function accentFor(theme: Theme): string {
  const wax = WAXES[theme.wax].hex;
  return STYLES[theme.style].dark ? mix(wax, "#f6e9dc", 0.62) : wax;
}

/** Variables CSS del tema, para el atributo style de la raíz de la invitación. */
export function themeVars(theme: Theme): CSSProperties {
  const style = STYLES[theme.style];
  const p = style.palette;
  const envelope = ENVELOPES[theme.envelope];
  const wax = WAXES[theme.wax].hex;
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
    "--env-liner": envelope.liner,
  };
  if (style.display) vars["--font-display"] = style.display;
  return vars as CSSProperties;
}
