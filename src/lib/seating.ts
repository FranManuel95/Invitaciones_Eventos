import { z } from "zod";
import { allergyLabel } from "@/lib/domain/catalog";
import type { GuestGroup, RsvpResponse } from "@/lib/domain/types";

/*
 * Plano de mesas. Cada invitación (familia, pareja…) se sienta junta en una mesa: así cuentan
 * también los acompañantes que el invitado añade al responder. Las posiciones del plano van en
 * porcentaje (0–100) para que se vea igual en cualquier pantalla.
 */

export type TableShape = "round" | "rect";

export interface SeatingTable {
  id: string;
  name: string;
  shape: TableShape;
  seats: number;
  /** Centro de la mesa en el plano, en % del ancho y del alto. */
  x: number;
  y: number;
}

export const tableInputSchema = z.object({
  id: z.uuid().optional(),
  name: z.string().trim().min(1, "Ponle un nombre a la mesa.").max(60),
  shape: z.enum(["round", "rect"]),
  seats: z.number().int().min(1).max(40),
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
});

export type TableInput = z.infer<typeof tableInputSchema>;

export interface Headcount {
  /** Personas que ocupan sitio: las confirmadas o, si aún no ha respondido, sus plazas. */
  people: number;
  children: number;
  /** Ya ha confirmado (si no, es una estimación). */
  confirmed: boolean;
  /** «Lucía: sin gluten», para avisar al catering de cada mesa. */
  allergies: string[];
}

/** Cuántas personas de una invitación se sientan. Las que no vienen no ocupan sitio. */
export function headcount(group: GuestGroup, response?: RsvpResponse): Headcount {
  if (response?.status === "declined") {
    return { people: 0, children: 0, confirmed: true, allergies: [] };
  }
  if (response?.status === "attending") {
    return {
      people: response.attendees.length,
      children: response.attendees.filter((a) => a.isChild).length,
      confirmed: true,
      allergies: response.attendees.flatMap((a) =>
        a.allergies.length || a.allergyNotes
          ? [
              `${a.name.split(" ")[0]}: ${[...a.allergies.map(allergyLabel), a.allergyNotes]
                .filter(Boolean)
                .join(", ")
                .toLowerCase()}`,
            ]
          : [],
      ),
    };
  }
  return {
    people: group.maxAttendees,
    children: group.members.filter((m) => m.isChild).length,
    confirmed: false,
    allergies: [],
  };
}

export interface TableSummary {
  table: SeatingTable;
  groups: GuestGroup[];
  people: number;
  /** Plazas de invitaciones que aún no han respondido (estimadas). */
  pending: number;
  children: number;
  allergies: string[];
  free: number;
  over: boolean;
}

/** Ocupación de cada mesa con los avisos de aforo, niños y alergias. */
export function summarizeTables(
  tables: SeatingTable[],
  groups: GuestGroup[],
  responses: RsvpResponse[],
  assignment: Record<string, string | null>,
): TableSummary[] {
  const byGroup = new Map(responses.map((r) => [r.groupId, r]));
  return tables.map((table) => {
    const seated = groups.filter((g) => assignment[g.id] === table.id);
    let people = 0;
    let pending = 0;
    let children = 0;
    const allergies: string[] = [];
    for (const g of seated) {
      const count = headcount(g, byGroup.get(g.id));
      people += count.people;
      if (!count.confirmed) pending += count.people;
      children += count.children;
      allergies.push(...count.allergies);
    }
    return {
      table,
      groups: seated,
      people,
      pending,
      children,
      allergies,
      free: table.seats - people,
      over: people > table.seats,
    };
  });
}

/** Invitaciones sin mesa que sí ocupan sitio (las que no vienen no hacen falta). */
export function unseatedGroups(
  groups: GuestGroup[],
  responses: RsvpResponse[],
  assignment: Record<string, string | null>,
) {
  const declined = new Set(responses.filter((r) => r.status === "declined").map((r) => r.groupId));
  return groups.filter((g) => !assignment[g.id] && !declined.has(g.id));
}

/** Siguiente nombre libre («Mesa 7») y una posición que no tape a las demás. */
export function nextTable(tables: SeatingTable[]): Omit<SeatingTable, "id"> {
  // Sigue a la «Mesa N» más alta (la presidencial u otras con nombre propio no cuentan).
  const n = Math.max(0, ...tables.map((t) => Number(/^Mesa (\d+)$/.exec(t.name)?.[1] ?? 0))) + 1;
  const i = tables.length;
  return {
    name: `Mesa ${n}`,
    shape: "round",
    seats: 10,
    x: 12 + (i % 5) * 19,
    y: 18 + (Math.floor(i / 5) % 4) * 22,
  };
}
