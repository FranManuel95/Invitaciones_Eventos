import { DEMO_REFERENCE_DATE } from "@/data/demo/guests";
import type { VisitClock } from "@/features/dashboard/last-visit";

/**
 * En la demo el tiempo es ficticio: «ahora» es su fecha de referencia y, la primera vez, la
 * última visita fue cinco días antes, para que se vea cómo llegan las respuestas nuevas.
 */
const now = `${DEMO_REFERENCE_DATE}T20:00:00.000Z`;
export const demoClock: VisitClock = {
  now,
  firstVisit: new Date(Date.parse(now) - 5 * 86_400_000).toISOString(),
};
