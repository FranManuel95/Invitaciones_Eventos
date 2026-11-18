import type { GuestGroup, RsvpResponse } from "@/lib/domain/types";

/*
 * «Desde vuestra última visita»: las respuestas que han llegado después de una fecha, sin correo.
 * La fecha de la última visita la guarda el navegador; aquí solo se calcula. Funciones puras.
 */

export interface NewReply {
  groupId: string;
  name: string;
  status: RsvpResponse["status"];
  /** Personas que vienen (0 si no vienen). */
  people: number;
  at: string;
}

const time = (iso: string | null | undefined) => {
  const t = iso ? Date.parse(iso) : NaN;
  return Number.isNaN(t) ? null : t;
};

/** Respuestas posteriores a `since`, de la más reciente a la más antigua. Sin fecha, ninguna. */
export function repliesSince(
  groups: Pick<GuestGroup, "id" | "displayName">[],
  responses: RsvpResponse[],
  since: string | null,
): NewReply[] {
  const from = time(since);
  if (from === null) return [];
  const names = new Map(groups.map((g) => [g.id, g.displayName]));
  return responses
    .filter((r) => {
      const at = time(r.updatedAt);
      return at !== null && at > from && names.has(r.groupId);
    })
    .map((r) => ({
      groupId: r.groupId,
      name: names.get(r.groupId)!,
      status: r.status,
      people: r.status === "attending" ? r.attendees.length : 0,
      at: r.updatedAt,
    }))
    .sort((a, b) => Date.parse(b.at) - Date.parse(a.at));
}

/** La respuesta más reciente (para el punto de la navegación), o null si no hay ninguna. */
export function latestReplyAt(responses: Pick<RsvpResponse, "updatedAt">[]): string | null {
  let best: string | null = null;
  for (const r of responses) {
    const t = time(r.updatedAt);
    if (t !== null && (best === null || t > Date.parse(best))) best = r.updatedAt;
  }
  return best;
}

/** ¿Hay algo nuevo desde `since`? */
export function hasNewSince(latest: string | null, since: string | null) {
  const a = time(latest);
  const b = time(since);
  return a !== null && b !== null && a > b;
}

/**
 * Desde cuándo se cuentan las novedades en esta visita. Dentro de una misma visita (la sesión
 * del navegador) se mantiene la fecha con la que empezó, para que no desaparezcan al cambiar
 * de página; al empezar una visita nueva, es la última guardada. La primera vez, `firstVisit`
 * (null: nada es nuevo).
 */
export function visitBaseline(
  sessionStart: string | null,
  storedLastVisit: string | null,
  firstVisit: string | null = null,
): string | null {
  if (time(sessionStart) !== null) return sessionStart;
  if (time(storedLastVisit) !== null) return storedLastVisit;
  return time(firstVisit) !== null ? firstVisit : null;
}

/** Resumen corto: «3 respuestas nuevas: 2 confirman y 1 no podrá venir». */
export function repliesSummary(replies: NewReply[]) {
  const total = replies.length;
  if (!total) return "";
  const yes = replies.filter((r) => r.status === "attending").length;
  const no = total - yes;
  const head = `${total} ${total === 1 ? "respuesta nueva" : "respuestas nuevas"}`;
  const parts = [
    yes
      ? `${yes === total && total > 1 ? "todas" : yes} ${yes === 1 ? "confirma" : "confirman"}`
      : "",
    no
      ? `${no === total && total > 1 ? "todas" : no} no ${no === 1 ? "podrá" : "podrán"} venir`
      : "",
  ].filter(Boolean);
  if (total === 1) return `${head}: ${yes ? "confirma" : "no podrá venir"}`;
  return `${head}: ${parts.join(" y ")}`;
}

/** Qué ha dicho cada una: «Confirma: vienen 3» o «No podrá venir». */
export function replyLabel(reply: NewReply) {
  if (reply.status === "declined") return "No podrá venir";
  if (reply.people === 1) return "Confirma: viene 1 persona";
  return `Confirma: vienen ${reply.people} personas`;
}
