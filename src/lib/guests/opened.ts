import type { GuestGroup } from "@/lib/domain/types";

/** En qué punto está cada invitación: respondida, abierta sin responder o sin abrir. */
export type OpenState = "respondida" | "abierta" | "sin-abrir";

export function openState(group: GuestGroup, answered: ReadonlySet<string>): OpenState {
  if (answered.has(group.id)) return "respondida";
  return group.openedAt ? "abierta" : "sin-abrir";
}

/** Cuántas invitaciones hay en cada punto. */
export function openSummary(groups: GuestGroup[], answered: ReadonlySet<string>) {
  const counts: Record<OpenState, number> = { respondida: 0, abierta: 0, "sin-abrir": 0 };
  for (const g of groups) counts[openState(g, answered)] += 1;
  return counts;
}

/** Sin respuesta: primero las que nadie ha abierto (son las que más necesitan un mensaje). */
export function byNeedOfReminder(groups: GuestGroup[]) {
  return [...groups].sort((a, b) => Number(Boolean(a.openedAt)) - Number(Boolean(b.openedAt)));
}
