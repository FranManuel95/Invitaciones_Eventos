import { demoEvent } from "@/data/demo/event";
import { eventContentSchema, type EventContent } from "@/lib/domain/event-schema";
import { EVENT_KINDS, KIND_WORDS, eventNoun, hostNames, type EventKind } from "@/lib/event-kind";

/*
 * Un evento nuevo parte de la plantilla de ejemplo (textos, programa, menús…) con los nombres
 * y la fecha de la pareja. Después se cambia todo desde el editor.
 */

export interface NewEventInput {
  first: string;
  second: string;
  /** AAAA-MM-DD */
  date: string;
  /** Sin tipo, boda. */
  kind?: EventKind;
}

/** Textos de partida para lo que no es una boda (la plantilla de ejemplo es de boda). */
function startingTexts(input: NewEventInput) {
  const kind = input.kind ?? "boda";
  if (kind === "boda") return {};
  const names = hostNames({ ...input, kind }, " y ");
  const noun = eventNoun({ kind });
  return {
    cardMessage: `Queremos celebrar ${noun} de ${names} con las personas que más queremos, y tú eres una de ellas.`,
    welcomeMessage: `Nos hace mucha ilusión que vengas a ${noun} de ${names}. Aquí tienes todo lo que necesitas saber: el programa, cómo llegar y dónde confirmar.`,
    thankYouMessage: `Gracias por acompañarnos en ${noun} de ${names}. Aquí están las fotos de un día precioso.`,
  };
}

/** «maría-y-daniel-2027-x7k2»: legible y sin colisiones gracias al sufijo aleatorio. */
export function slugFor({ first, second, date }: NewEventInput, suffix: string) {
  const clean = (s: string) =>
    s
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  const names = second.trim() ? [clean(first), "y", clean(second)] : [clean(first)];
  return [...names, date.slice(0, 4), suffix].filter(Boolean).join("-");
}

export function buildNewEventContent(input: NewEventInput): EventContent {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- se descarta el id de la demo
  const { id, ...template } = demoEvent;
  const time = template.date.slice(10); // «T16:30:00+02:00»
  const day = new Date(`${input.date}T12:00:00Z`);
  // El plazo para responder: cinco semanas antes.
  const deadline = new Date(day.getTime() - 35 * 86_400_000).toISOString().slice(0, 10);
  return eventContentSchema.parse({
    ...template,
    ...startingTexts(input),
    kind: input.kind ?? "boda",
    couple: {
      first: input.first,
      second: input.second,
      monogram: `${input.first[0] ?? ""}${input.second[0] ?? ""}`.toUpperCase(),
    },
    date: `${input.date}${time}`,
    rsvpDeadline: `${deadline}T23:59:00+02:00`,
    hashtag: `#${input.second.trim() ? `${input.first}Y${input.second}` : input.first}`.replace(
      /\s+/g,
      "",
    ),
  });
}

/** Valida el formulario de alta. Devuelve un mensaje de error o null. */
export function validateNewEvent(input: NewEventInput, today = new Date()): string | null {
  if (input.kind !== undefined && !EVENT_KINDS.includes(input.kind))
    return "Elige el tipo de evento.";
  if (KIND_WORDS[input.kind ?? "boda"].pair && (!input.first.trim() || !input.second.trim())) {
    return "Escribe los dos nombres.";
  }
  if (!input.first.trim()) return "Escribe el nombre.";
  if (input.first.length > 40 || input.second.length > 40)
    return "Los nombres son demasiado largos.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) return "Elige la fecha del evento.";
  if (input.date <= today.toISOString().slice(0, 10)) return "La fecha tiene que ser futura.";
  return null;
}
