import { z } from "zod";
import {
  CALENDAR_IDS,
  COVER_IDS,
  DEFAULT_THEME,
  EDGE_IDS,
  ENVELOPE_IDS,
  FLAP_IDS,
  FONT_IDS,
  LAYOUT_IDS,
  LINER_IDS,
  MUSIC_IDS,
  normalizeOrder,
  OPENING_IDS,
  ORNAMENT_IDS,
  SEAL_MARK_IDS,
  SEAL_SHAPE_IDS,
  SECTION_IDS,
  STYLE_IDS,
  TEXTURE_IDS,
  WAX_IDS,
  WEIGHT_IDS,
  type Theme,
} from "./index";

/*
 * Validación del tema con Zod: lo que envía el editor (estricto) y lo que se lee de la base de
 * datos (tolerante). Aparte de ./index para que la invitación no cargue Zod.
 */

/** Color libre elegido por el cliente (#rrggbb). */
const hexColor = z.string().regex(/^#[0-9a-f]{6}$/i, "Elige un color válido.");

/** Tema que envía el editor: estricto, sin corregir valores desconocidos. */
export const themeInputSchema = z.strictObject({
  style: z.enum(STYLE_IDS),
  envelope: z.enum(ENVELOPE_IDS),
  wax: z.enum(WAX_IDS),
  /** Si hay color propio, sustituye al lacre elegido (y al acento que sale de él). */
  waxColor: hexColor.nullable(),
  font: z.enum(FONT_IDS),
  flap: z.enum(FLAP_IDS),
  weight: z.enum(WEIGHT_IDS),
  texture: z.enum(TEXTURE_IDS),
  liner: z.enum(LINER_IDS),
  sealShape: z.enum(SEAL_SHAPE_IDS),
  sealMark: z.enum(SEAL_MARK_IDS),
  opening: z.enum(OPENING_IDS),
  cover: z.enum(COVER_IDS),
  layout: z.enum(LAYOUT_IDS),
  edge: z.enum(EDGE_IDS),
  ornament: z.enum(ORNAMENT_IDS),
  calendar: z.enum(CALENDAR_IDS),
  hidden: z.array(z.enum(SECTION_IDS)).max(SECTION_IDS.length),
  order: z
    .array(z.enum(SECTION_IDS))
    .length(SECTION_IDS.length)
    .refine((o) => new Set(o).size === o.length, "Cada sección solo puede aparecer una vez."),
  music: z.boolean(),
  musicStyle: z.enum(MUSIC_IDS),
});

/** Tema leído de la base de datos: lo que falte o no se reconozca vuelve al valor por defecto. */
export const themeSchema = z.object({
  style: z.enum(STYLE_IDS).catch("mediterraneo"),
  envelope: z.enum(ENVELOPE_IDS).catch("olivo"),
  wax: z.enum(WAX_IDS).catch("burdeos"),
  waxColor: hexColor.nullable().catch(null),
  font: z.enum(FONT_IDS).catch("editorial"),
  flap: z.enum(FLAP_IDS).catch("pico"),
  weight: z.enum(WEIGHT_IDS).catch("medio"),
  texture: z.enum(TEXTURE_IDS).catch("liso"),
  liner: z.enum(LINER_IDS).catch("propio"),
  sealShape: z.enum(SEAL_SHAPE_IDS).catch("cera"),
  sealMark: z.enum(SEAL_MARK_IDS).catch("monograma"),
  opening: z.enum(OPENING_IDS).catch("mesa"),
  cover: z.enum(COVER_IDS).catch("foto"),
  layout: z.enum(LAYOUT_IDS).catch("clasica"),
  edge: z.enum(EDGE_IDS).catch("barba"),
  ornament: z.enum(ORNAMENT_IDS).catch("almendro"),
  calendar: z.enum(CALENDAR_IDS).catch("taco"),
  hidden: z.array(z.enum(SECTION_IDS)).max(SECTION_IDS.length).catch([]),
  order: z.array(z.string()).catch([]).transform(normalizeOrder),
  music: z.boolean().catch(true),
  musicStyle: z.enum(MUSIC_IDS).catch("piano"),
});

/** Lee un tema guardado: lo que falte o no se reconozca vuelve al valor por defecto. */
export function parseTheme(raw: unknown): Theme {
  const input = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const result = themeSchema.safeParse(input);
  if (!result.success) return DEFAULT_THEME;
  // Antes de elegir tipografía, el estilo Clásico llevaba su garalda: se respeta.
  if (input.font === undefined && result.data.style === "clasico") {
    return { ...result.data, font: "clasica" };
  }
  return result.data;
}
