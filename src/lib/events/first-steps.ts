import type { EventContent } from "@/lib/domain/event-schema";
import type { GuestGroup } from "@/lib/domain/types";
import { DEFAULT_THEME, type Theme } from "@/lib/theme";
import { buildNewEventContent } from "./new-event";

/*
 * Primeros pasos de un evento recién creado: elegir plantilla, poner fotos y textos, añadir
 * invitaciones y publicar. Cada paso se da por hecho mirando el propio evento (no se guarda
 * nada aparte), así que la guía se apaga sola cuando ya está todo. Funciones puras, sin React.
 */

export type FirstStepId = "plantilla" | "fotos-textos" | "invitaciones" | "publicar";

export interface FirstStep {
  id: FirstStepId;
  title: string;
  detail: string;
  done: boolean;
  /** Dónde se hace: "editor" (la invitación), "/invitaciones" (dentro del panel) o "#publicacion". */
  target: "editor" | "/invitaciones" | "#publicacion";
  action: string;
}

export interface FirstStepsInput {
  content: EventContent;
  theme: Theme;
  groups: Pick<GuestGroup, "displayName">[];
  published: boolean;
  /** Nombres de las invitaciones de ejemplo que se pueden añadir al crear el evento. */
  sampleNames: readonly string[];
}

/** ¿Se ha cambiado algo del aspecto que trae un evento nuevo? */
export function themeChanged(theme: Theme, base: Theme = DEFAULT_THEME) {
  return (Object.keys(base) as (keyof Theme)[]).some(
    (key) => JSON.stringify(theme[key]) !== JSON.stringify(base[key]),
  );
}

/** El contenido con el que nace este evento: el de la plantilla con sus nombres y su fecha. */
function startingContent(content: EventContent) {
  return buildNewEventContent({
    first: content.couple.first,
    second: content.couple.second,
    date: content.date.slice(0, 10),
    kind: content.kind,
  });
}

const photosOf = (c: EventContent) => [
  c.coverPhoto,
  c.story.couplePhoto,
  c.banquetPhoto,
  ...c.story.moments.map((m) => m.photo),
];

const textsOf = (c: EventContent) => [
  c.cardMessage,
  c.welcomeMessage,
  c.story.intro,
  ...c.story.moments.map((m) => `${m.title}\n${m.text}`),
];

const changed = (now: (string | null)[], before: (string | null)[]) =>
  now.length !== before.length || now.some((value, i) => value !== before[i]);

/** Qué se ha personalizado ya: alguna foto propia y algún texto propio. */
export function personalization(content: EventContent) {
  const start = startingContent(content);
  return {
    photos: changed(photosOf(content), photosOf(start)),
    texts: changed(textsOf(content), textsOf(start)),
  };
}

export function firstSteps(input: FirstStepsInput): FirstStep[] {
  const { photos, texts } = personalization(input.content);
  const samples = new Set(input.sampleNames);
  const ownGroups = input.groups.filter((g) => !samples.has(g.displayName)).length;
  const onlySamples = input.groups.length > 0 && ownGroups === 0;

  return [
    {
      id: "plantilla",
      title: "Elegid la plantilla",
      detail: "El papel, los colores y la apertura del sobre. Se puede cambiar cuando queráis.",
      // Si ya está publicada, el aspecto que tiene es el que han elegido.
      done: input.published || themeChanged(input.theme),
      target: "editor",
      action: "Ver las plantillas",
    },
    {
      id: "fotos-textos",
      title: "Poned vuestras fotos y textos",
      detail:
        photos && !texts
          ? "Las fotos ya son vuestras. Falta contar vuestra historia con vuestras palabras."
          : texts && !photos
            ? "Los textos ya son vuestros. Faltan las fotos: la portada y la de vosotros."
            : "La foto de portada, vuestra historia y el mensaje de bienvenida.",
      done: photos && texts,
      target: "editor",
      action: "Editar la invitación",
    },
    {
      id: "invitaciones",
      title: "Añadid las invitaciones",
      detail: onlySamples
        ? "Ahora solo están las de ejemplo. Añadid las vuestras: una por familia, pareja o persona."
        : "Una por familia, pareja o persona. También podéis importar vuestra lista.",
      done: ownGroups > 0,
      target: "/invitaciones",
      action: "Añadir invitaciones",
    },
    {
      id: "publicar",
      title: "Publicad la invitación",
      detail:
        "Hasta entonces, los enlaces de los invitados no se abren. Podéis empezar por un save the date.",
      done: input.published,
      target: "#publicacion",
      action: "Publicar",
    },
  ];
}

/** La guía se enseña mientras quede algún paso por hacer. */
export const showFirstSteps = (steps: FirstStep[]) => steps.some((s) => !s.done);
