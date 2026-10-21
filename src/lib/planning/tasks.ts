import { z } from "zod";

/*
 * Tareas de la organización (tabla «tasks»). Las sugeridas son la lista clásica de una boda,
 * con fechas calculadas hacia atrás desde el día del evento.
 */

export interface PlanTask {
  id: string;
  title: string;
  /** AAAA-MM-DD o null. */
  dueDate: string | null;
  assignee: string;
  done: boolean;
}

export const taskInputSchema = z.object({
  id: z.uuid().optional(),
  title: z.string().trim().min(1, "Escribe la tarea.").max(200),
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha no válida.")
    .nullable(),
  assignee: z.string().trim().max(80),
  done: z.boolean(),
});

export type TaskInput = z.infer<typeof taskInputSchema>;

/** [título, meses antes de la boda] */
const SUGGESTED: [string, number][] = [
  ["Fijar el presupuesto y la lista de invitados", 12],
  ["Reservar la finca o el lugar del banquete", 11],
  ["Reservar la ceremonia", 11],
  ["Contratar fotografía y vídeo", 10],
  ["Elegir el catering y hacer la prueba de menú", 8],
  ["Contratar música o DJ", 8],
  ["Comprar o encargar el vestido y el traje", 7],
  ["Reservar alojamiento para los invitados", 6],
  ["Enviar las invitaciones", 4],
  ["Contratar los autobuses", 4],
  ["Encargar las flores y la decoración", 3],
  ["Comprar los anillos", 3],
  ["Cerrar el plano de mesas", 1],
  ["Confirmar horarios con todos los proveedores", 0.5],
];

const shiftMonths = (iso: string, months: number) => {
  const d = new Date(`${iso.slice(0, 10)}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - Math.round(months * 30.4));
  return d.toISOString().slice(0, 10);
};

/** Lista de tareas típicas con su fecha límite, a partir de la fecha de la boda. */
export function suggestedTasks(weddingIso: string): Omit<PlanTask, "id">[] {
  return SUGGESTED.map(([title, months]) => ({
    title,
    dueDate: shiftMonths(weddingIso, months),
    assignee: "",
    done: false,
  }));
}

export type TaskState = "done" | "overdue" | "soon" | "later" | "undated";

/** Estado de una tarea respecto a hoy: «pronto» es en los próximos 30 días. */
export function taskState(task: PlanTask, todayIso: string): TaskState {
  if (task.done) return "done";
  if (!task.dueDate) return "undated";
  const today = todayIso.slice(0, 10);
  if (task.dueDate < today) return "overdue";
  return task.dueDate <= shiftMonths(today, -1) ? "soon" : "later";
}

/** Pendientes primero (por fecha, las vencidas arriba) y las hechas al final. */
export function sortTasks(tasks: PlanTask[]): PlanTask[] {
  return [...tasks].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    return (
      (a.dueDate ?? "9999").localeCompare(b.dueDate ?? "9999") || a.title.localeCompare(b.title)
    );
  });
}
