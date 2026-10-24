import { headcount, type SeatingTable } from "@/lib/seating";
import { demoGroups, demoResponses } from "./guests";

/**
 * Plano de mesas de la demo: diez mesas y una presidencial. Las invitaciones se sientan en
 * orden hasta llenar cada mesa; el resto queda sin mesa para probar el plano. Determinista.
 */

const LAYOUT: Omit<SeatingTable, "id">[] = [
  { name: "Presidencial", shape: "rect", seats: 8, x: 50, y: 10 },
  ...Array.from({ length: 10 }, (_, i) => ({
    name: `Mesa ${i + 1}`,
    shape: "round" as const,
    seats: 10,
    x: 12 + (i % 5) * 19,
    y: 38 + Math.floor(i / 5) * 34,
  })),
];

export const demoTables: SeatingTable[] = LAYOUT.map((t, i) => ({ ...t, id: `mesa-${i}` }));

function seat(): Record<string, string | null> {
  const byGroup = new Map(demoResponses.map((r) => [r.groupId, r]));
  const assignment: Record<string, string | null> = {};
  // La presidencial queda libre; se llenan las ocho primeras mesas redondas.
  const tables = demoTables.slice(1, 9);
  let t = 0;
  let used = 0;
  for (const group of demoGroups) {
    const table = tables[t];
    if (!table) break;
    const { people } = headcount(group, byGroup.get(group.id));
    if (people === 0) continue;
    if (used + people > table.seats) {
      t++;
      used = 0;
      if (!tables[t]) break;
    }
    assignment[group.id] = tables[t]!.id;
    used += people;
  }
  return assignment;
}

export const demoAssignment = seat();
