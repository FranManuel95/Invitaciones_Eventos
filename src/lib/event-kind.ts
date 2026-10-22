/*
 * Tipos de evento. La invitación nació para bodas; con el tipo cambian las frases («se casan»,
 * «se bautiza»…) y puede haber un solo nombre (el bautizo o el cumpleaños de una persona).
 * Los eventos guardados antes no tienen tipo: son bodas.
 */

export const EVENT_KINDS = ["boda", "bautizo", "comunion", "cumpleanos", "aniversario"] as const;
export type EventKind = (typeof EVENT_KINDS)[number];

interface KindWords {
  label: string;
  /** Con artículo: «la boda», «el bautizo». */
  noun: string;
  /** Qué pasa ese día, para una o dos personas: «se casan el», «se bautiza el». */
  verb: [one: string, two: string];
  /** ¿Hacen falta dos nombres? */
  pair: boolean;
}

export const KIND_WORDS: Record<EventKind, KindWords> = {
  boda: {
    label: "Boda",
    noun: "la boda",
    verb: ["se casa el", "se casan el"],
    pair: true,
  },
  bautizo: {
    label: "Bautizo",
    noun: "el bautizo",
    verb: ["se bautiza el", "se bautizan el"],
    pair: false,
  },
  comunion: {
    label: "Primera comunión",
    noun: "la primera comunión",
    verb: ["hace su primera comunión el", "hacen su primera comunión el"],
    pair: false,
  },
  cumpleanos: {
    label: "Cumpleaños",
    noun: "el cumpleaños",
    verb: ["celebra su cumpleaños el", "celebran su cumpleaños el"],
    pair: false,
  },
  aniversario: {
    label: "Aniversario",
    noun: "el aniversario",
    verb: ["celebra su aniversario el", "celebran su aniversario el"],
    pair: true,
  },
};

export interface Hosts {
  first: string;
  second: string;
  kind?: EventKind;
}

export const kindOf = (hosts: { kind?: EventKind }): EventKind => hosts.kind ?? "boda";
const two = (hosts: Hosts) => hosts.second.trim() !== "";

/** «María & Daniel» o, con un solo nombre, «Lucía». */
export function hostNames(hosts: Hosts, joiner = " & "): string {
  return two(hosts) ? `${hosts.first}${joiner}${hosts.second}` : hosts.first;
}

/** «Boda de María y Daniel», «Bautizo de Lucía». */
export function eventTitle(hosts: Hosts): string {
  return `${KIND_WORDS[kindOf(hosts)].label} de ${hostNames(hosts, " y ")}`;
}

/** «la boda», «el bautizo»… */
export const eventNoun = (hosts: { kind?: EventKind }) => KIND_WORDS[kindOf(hosts)].noun;

/** «de la boda», «del bautizo». */
export function ofEvent(hosts: { kind?: EventKind }): string {
  const noun = eventNoun(hosts);
  return noun.startsWith("el ") ? `del ${noun.slice(3)}` : `de ${noun}`;
}

/** «a la boda», «al bautizo». */
export function toEvent(hosts: { kind?: EventKind }): string {
  const noun = eventNoun(hosts);
  return noun.startsWith("el ") ? `al ${noun.slice(3)}` : `a ${noun}`;
}

/** Frase de la portada antes de la fecha: «se casan el». */
export const coverVerb = (hosts: Hosts) => KIND_WORDS[kindOf(hosts)].verb[two(hosts) ? 1 : 0];

/** Para el mensaje de WhatsApp: «María y Daniel nos casamos», «Celebramos el bautizo de Lucía». */
export function announcement(hosts: Hosts): string {
  if (kindOf(hosts) === "boda") {
    return `${hostNames(hosts, " y ")} ${two(hosts) ? "nos casamos" : "me caso"}`;
  }
  return `Celebramos ${eventNoun(hosts)} de ${hostNames(hosts, " y ")}`;
}

/** Los anfitriones de un evento, con su tipo, para las funciones de arriba. */
export const hostsOf = (event: {
  couple: { first: string; second: string };
  kind?: EventKind;
}) => ({
  first: event.couple.first,
  second: event.couple.second,
  kind: event.kind,
});
