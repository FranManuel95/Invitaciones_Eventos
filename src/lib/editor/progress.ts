import type { EventContent } from "@/lib/domain/event-schema";
import { themeChanged } from "@/lib/events/first-steps";
import type { Theme } from "@/lib/theme";

/*
 * Qué está hecho en cada pestaña del editor. Se compara el borrador con el contenido con el que
 * nace el evento (la plantilla de ejemplo con sus nombres y su fecha, `baseline`): lo que sigue
 * igual que la plantilla aún no es «vuestro». Las pestañas de autobuses y de preguntas son
 * opcionales: no todos los eventos las necesitan. Funciones puras, sin React.
 */

export type EditorTabId =
  "estilo" | "datos" | "historia" | "textos" | "programa" | "transporte" | "extras";

export interface TabProgress {
  done: boolean;
  /** No hace falta para enviar la invitación. */
  optional: boolean;
  /** Qué falta, en pocas palabras (solo si no está hecho). */
  todo?: string;
}

const photosOf = (c: EventContent) => [
  c.coverPhoto,
  c.story.couplePhoto,
  c.banquetPhoto,
  ...c.story.moments.map((m) => m.photo),
];

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

export function editorProgress(
  content: EventContent,
  theme: Theme,
  baseline: EventContent,
): Record<EditorTabId, TabProgress> {
  const filled = (v: string | undefined | null) => Boolean(v?.trim());
  const style = themeChanged(theme);
  const basics = filled(content.couple.first) && filled(content.city) && filled(content.date);
  const photos = !same(photosOf(content), photosOf(baseline));
  const texts =
    content.cardMessage !== baseline.cardMessage ||
    content.welcomeMessage !== baseline.welcomeMessage;
  const program =
    !same(content.program, baseline.program) || !same(content.venues, baseline.venues);
  return {
    estilo: { done: style, optional: false, todo: style ? undefined : "Elegid una plantilla" },
    datos: {
      done: basics,
      optional: false,
      todo: basics ? undefined : "Faltan nombres, fecha o lugar",
    },
    historia: { done: photos, optional: false, todo: photos ? undefined : "Poned vuestras fotos" },
    textos: { done: texts, optional: false, todo: texts ? undefined : "Escribid vuestra carta" },
    programa: {
      done: program,
      optional: false,
      todo: program ? undefined : "Revisad las horas y los lugares",
    },
    transporte: { done: false, optional: true },
    extras: { done: false, optional: true },
  };
}

/** Cuántas pestañas imprescindibles están hechas, de cuántas. */
export function progressCount(progress: Record<EditorTabId, TabProgress>) {
  const required = Object.values(progress).filter((p) => !p.optional);
  return { done: required.filter((p) => p.done).length, total: required.length };
}
