import type { BudgetItem } from "@/lib/planning/budget";
import { suggestedTasks, type PlanTask } from "@/lib/planning/tasks";
import { demoEvent } from "./event";
import { DEMO_REFERENCE_DATE } from "./guests";

/** Tareas y presupuesto ficticios de la boda de ejemplo (deterministas). */

export const demoTasks: PlanTask[] = [
  ...suggestedTasks(demoEvent.date).map((t, i) => ({
    ...t,
    id: `tarea-${i}`,
    assignee: i % 2 ? "Daniel" : "María",
    // Lo que vencía antes de la fecha de referencia está hecho, salvo una tarea olvidada.
    done: Boolean(t.dueDate && t.dueDate < DEMO_REFERENCE_DATE) && i !== 4,
  })),
  {
    id: "tarea-extra",
    title: "Probar el peinado y el maquillaje",
    dueDate: null,
    assignee: "María",
    done: false,
  },
];

export const demoBudget: BudgetItem[] = [
  ["Finca Los Almendros (cóctel y banquete)", "Lugar y banquete", 16500, 6000, "2027-03-01"],
  ["Iglesia de San Juan", "Ceremonia", 400, 400, null],
  ["Fotografía y vídeo", "Fotografía y vídeo", 3200, 800, "2027-05-01"],
  ["Música en directo y DJ", "Música", 1800, 500, "2027-04-15"],
  ["Vestido y traje", "Vestuario", 2900, 1500, "2027-02-10"],
  ["Flores y decoración", "Flores y decoración", 2100, 0, "2027-04-30"],
  ["Autobuses (tres rutas)", "Transporte", 1650, 0, "2027-05-10"],
  ["Invitaciones digitales y detalles", "Invitaciones y detalles", 600, 600, null],
].map(([concept, category, estimated, paid, dueDate], i) => ({
  id: `partida-${i}`,
  concept: concept as string,
  category: category as string,
  estimated: estimated as number,
  paid: paid as number,
  dueDate: dueDate as string | null,
  notes: "",
}));
