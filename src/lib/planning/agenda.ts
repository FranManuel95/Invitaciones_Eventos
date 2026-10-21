import type { BudgetItem } from "./budget";
import type { PlanTask } from "./tasks";

/*
 * Agenda: todo lo que tiene fecha en un solo calendario (tareas, pagos, el plazo de respuesta y
 * el día de la boda).
 */

export type AgendaKind = "wedding" | "deadline" | "task" | "payment";

export interface AgendaEntry {
  /** AAAA-MM-DD */
  date: string;
  kind: AgendaKind;
  label: string;
  done?: boolean;
  /** Ruta del panel donde se gestiona, relativa a la raíz del evento. */
  path: string;
}

export function agendaEntries(
  event: { date: string; rsvpDeadline: string },
  tasks: PlanTask[],
  budget: BudgetItem[],
): AgendaEntry[] {
  const entries: AgendaEntry[] = [
    { date: event.date.slice(0, 10), kind: "wedding", label: "Día de la boda", path: "" },
    {
      date: event.rsvpDeadline.slice(0, 10),
      kind: "deadline",
      label: "Último día para confirmar",
      path: "/invitaciones",
    },
    ...tasks.flatMap((t) =>
      t.dueDate
        ? [
            {
              date: t.dueDate,
              kind: "task" as const,
              label: t.title,
              done: t.done,
              path: "/tareas",
            },
          ]
        : [],
    ),
    ...budget.flatMap((b) =>
      b.dueDate && b.estimated > b.paid
        ? [
            {
              date: b.dueDate,
              kind: "payment" as const,
              label: `Pago: ${b.concept}`,
              path: "/presupuesto",
            },
          ]
        : [],
    ),
  ];
  return entries.sort((a, b) => a.date.localeCompare(b.date));
}

/** Entradas agrupadas por día (para pintar el calendario). */
export function byDay(entries: AgendaEntry[]): Map<string, AgendaEntry[]> {
  const map = new Map<string, AgendaEntry[]>();
  for (const e of entries) map.set(e.date, [...(map.get(e.date) ?? []), e]);
  return map;
}

/** Mes siguiente o anterior a «AAAA-MM» (delta en meses). */
export function shiftMonth(month: string, delta: number): string {
  const [y, m] = month.split("-").map(Number) as [number, number];
  const i = y * 12 + (m - 1) + delta;
  return `${Math.floor(i / 12)}-${String((i % 12) + 1).padStart(2, "0")}`;
}
