import type { GuestGroup, RsvpResponse } from "@/lib/domain/types";
import { openSummary } from "@/lib/guests/opened";

/**
 * «Qué toca ahora» en el inicio del panel: lo que los organizadores pueden hacer hoy para que
 * la lista avance, ordenado por urgencia. Funciones puras, sin React.
 */

export interface NextStep {
  id: "sin-invitaciones" | "plazo" | "sin-abrir" | "sin-responder" | "sin-mesa" | "al-dia";
  title: string;
  detail: string;
  /** Ruta dentro del panel (se añade a la raíz del evento); null si no hay nada que abrir. */
  path: string | null;
  action: string | null;
}

const n = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`;

/** Días naturales que faltan hasta una fecha (negativo si ya pasó). */
export function daysUntil(dateIso: string, todayIso: string) {
  const day = (iso: string) => Date.parse(`${iso.slice(0, 10)}T00:00:00Z`);
  return Math.round((day(dateIso) - day(todayIso)) / 86_400_000);
}

export function nextSteps(
  groups: GuestGroup[],
  responses: RsvpResponse[],
  rsvpDeadline: string,
  todayIso: string,
): NextStep[] {
  if (groups.length === 0) {
    return [
      {
        id: "sin-invitaciones",
        title: "Cread las primeras invitaciones",
        detail: "Una por familia, pareja o persona. También podéis importar vuestra lista.",
        path: "/invitaciones",
        action: "Añadir invitaciones",
      },
    ];
  }

  const steps: NextStep[] = [];
  const answered = new Set(responses.map((r) => r.groupId));
  const opened = openSummary(groups, answered);
  const waiting = opened.abierta + opened["sin-abrir"];
  const left = daysUntil(rsvpDeadline, todayIso);

  if (waiting > 0 && left <= 14) {
    steps.push({
      id: "plazo",
      title:
        left < 0
          ? "El plazo de respuesta ha terminado"
          : left === 0
            ? "El plazo de respuesta termina hoy"
            : `Quedan ${n(left, "día", "días")} para responder`,
      detail: `${n(waiting, "invitación sigue", "invitaciones siguen")} sin respuesta.`,
      path: "/comunicaciones",
      action: "Enviar recordatorios",
    });
  }
  if (opened["sin-abrir"] > 0) {
    steps.push({
      id: "sin-abrir",
      title: `${n(opened["sin-abrir"], "invitación", "invitaciones")} sin abrir`,
      detail: "Puede que no les haya llegado el enlace. Volved a enviárselo.",
      path: "/comunicaciones",
      action: "Reenviar el enlace",
    });
  }
  if (opened.abierta > 0) {
    steps.push({
      id: "sin-responder",
      title: `${n(opened.abierta, "invitación abierta", "invitaciones abiertas")} sin responder`,
      detail: "La han visto, pero aún no han contestado. Un recordatorio suele bastar.",
      path: "/comunicaciones",
      action: "Recordárselo",
    });
  }

  const attending = new Set(
    responses.filter((r) => r.status === "attending").map((r) => r.groupId),
  );
  const unseated = groups.filter((g) => attending.has(g.id) && !g.tableId).length;
  if (unseated > 0) {
    steps.push({
      id: "sin-mesa",
      title: `${n(unseated, "invitación confirmada", "invitaciones confirmadas")} sin mesa`,
      detail: "Ya sabéis que vienen: sentadlas en el plano.",
      path: "/mesas",
      action: "Sentar invitados",
    });
  }

  if (steps.length === 0) {
    steps.push({
      id: "al-dia",
      title: "Todo al día",
      detail: "Han respondido todas las invitaciones y los confirmados tienen mesa.",
      path: null,
      action: null,
    });
  }
  return steps;
}

/** Canciones pedidas, agrupadas sin distinguir mayúsculas ni acentos, de más a menos pedida. */
export function songTally(songs: { song: string; groupName: string }[]) {
  const key = (text: string) =>
    text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
  const tally = new Map<string, { song: string; count: number; askedBy: string[] }>();
  for (const s of songs) {
    const k = key(s.song);
    if (!k) continue;
    const entry = tally.get(k) ?? { song: s.song.trim(), count: 0, askedBy: [] };
    entry.count += 1;
    entry.askedBy.push(s.groupName);
    tally.set(k, entry);
  }
  return [...tally.values()].sort(
    (a, b) => b.count - a.count || a.song.localeCompare(b.song, "es"),
  );
}
