"use client";

import { clsx } from "clsx";
import { ListPlus, Pencil, Plus, Trash2 } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { deleteTask, saveTasks } from "@/app/panel/[evento]/planificacion-actions";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { TextInput } from "@/components/ui/fields";
import { plural } from "@/lib/guests/share";
import {
  sortTasks,
  suggestedTasks,
  taskInputSchema,
  taskState,
  type PlanTask,
  type TaskState,
} from "@/lib/planning/tasks";

type Filter = "pending" | "done" | "all";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "pending", label: "Pendientes" },
  { value: "done", label: "Hechas" },
  { value: "all", label: "Todas" },
];

const STATE_TEXT: Record<TaskState, string> = {
  done: "Hecha",
  overdue: "Vencida",
  soon: "Este mes",
  later: "",
  undated: "Sin fecha",
};

const dayFmt = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});
const formatDay = (iso: string) => dayFmt.format(new Date(`${iso}T12:00:00Z`));

const noopSubscribe = () => () => {};

// Ids provisionales para pintar lo nuevo hasta que llegan los de la base de datos.
let localCount = 0;
const localId = () => `local-${++localCount}`;

/**
 * Tareas de la boda: lista con filtros, alta y edición, marcar como hecha y añadir de golpe la
 * lista sugerida. En la demo los cambios no se guardan.
 */
export function TasksBoard({
  eventId,
  tasks: initial,
  weddingDate,
  referenceDate,
}: {
  eventId: string | null;
  tasks: PlanTask[];
  weddingDate: string;
  /** Fecha de hoy (en la demo, una fija para que los datos tengan sentido). */
  referenceDate?: string;
}) {
  const [tasks, setTasks] = useState(initial);
  const [filter, setFilter] = useState<Filter>("pending");
  const [editing, setEditing] = useState<PlanTask | "new" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const today = useSyncExternalStore(
    noopSubscribe,
    () => referenceDate ?? new Date().toISOString().slice(0, 10),
    () => referenceDate ?? "",
  );

  const visible = sortTasks(tasks).filter((t) =>
    filter === "all" ? true : filter === "done" ? t.done : !t.done,
  );
  const pending = tasks.filter((t) => !t.done).length;
  const overdue = tasks.filter((t) => today && taskState(t, today) === "overdue").length;

  async function persist(action: () => Promise<{ ok: boolean; error?: string; id?: string }>) {
    if (!eventId) return { ok: true as const };
    const result = await action();
    if (!result.ok) setMessage(result.error ?? "No se ha podido guardar.");
    return result;
  }

  async function save(task: Omit<PlanTask, "id"> & { id?: string }) {
    if (task.id) {
      setTasks((ts) => ts.map((t) => (t.id === task.id ? { ...t, ...task, id: t.id } : t)));
      await persist(() => saveTasks(eventId!, [task]));
      return;
    }
    const result = await persist(() => saveTasks(eventId!, [task]));
    if (!result.ok) return;
    const id = (result as { id?: string }).id ?? localId();
    setTasks((ts) => [...ts, { ...task, id }]);
    setMessage(`Tarea añadida: ${task.title}.`);
  }

  async function addSuggested() {
    const existing = new Set(tasks.map((t) => t.title));
    const fresh = suggestedTasks(weddingDate).filter((t) => !existing.has(t.title));
    if (!fresh.length) {
      setMessage("Ya tienes todas las tareas sugeridas.");
      return;
    }
    const result = await persist(() => saveTasks(eventId!, fresh));
    if (!result.ok) return;
    // En eventos reales los ids llegan al recargar; mientras, ids locales para pintarlas.
    setTasks((ts) => [...ts, ...fresh.map((t) => ({ ...t, id: localId() }))]);
    setMessage(`${plural(fresh.length, "tarea sugerida añadida", "tareas sugeridas añadidas")}.`);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="radiogroup"
          aria-label="Mostrar"
          className="flex gap-1 rounded-full bg-ink/5 p-1"
        >
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              role="radio"
              aria-checked={filter === f.value}
              onClick={() => setFilter(f.value)}
              className={clsx(
                "rounded-full px-3.5 py-1.5 text-[0.8125rem] transition-colors",
                filter === f.value ? "bg-paper text-ink shadow-sm" : "text-ink-soft hover:text-ink",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => void addSuggested()}>
            <ListPlus aria-hidden className="size-4" />
            Añadir tareas sugeridas
          </Button>
          <Button onClick={() => setEditing("new")}>
            <Plus aria-hidden className="size-4" />
            Nueva tarea
          </Button>
        </div>
      </div>
      <p aria-live="polite" className="mt-4 text-[0.875rem] text-muted">
        {plural(pending, "pendiente", "pendientes")}
        {overdue ? ` · ${plural(overdue, "vencida", "vencidas")}` : ""}
        {eventId ? "" : " · Demo: los cambios no se guardan."}
      </p>
      <p role="status" className="mt-1 min-h-5 text-[0.875rem] text-ink-soft">
        {message}
      </p>

      <ul className="mt-2 divide-y divide-line rounded-md border border-line bg-paper">
        {visible.map((t) => {
          const state = today ? taskState(t, today) : "later";
          return (
            <li key={t.id} className="flex items-center gap-3 px-4 py-3">
              <input
                type="checkbox"
                id={`tarea-${t.id}`}
                checked={t.done}
                onChange={(e) => void save({ ...t, done: e.target.checked })}
                className="size-5 shrink-0 accent-[var(--color-ink)]"
              />
              <label htmlFor={`tarea-${t.id}`} className="min-w-0 flex-1 cursor-pointer">
                <span
                  className={clsx(
                    "block text-[0.9375rem]",
                    t.done ? "text-muted line-through" : "text-ink",
                  )}
                >
                  {t.title}
                </span>
                <span className="mt-0.5 block text-[0.8125rem] text-muted">
                  {t.dueDate ? formatDay(t.dueDate) : "Sin fecha"}
                  {t.assignee ? ` · ${t.assignee}` : ""}
                  {STATE_TEXT[state] && state !== "done" && state !== "undated" ? (
                    <span
                      className={clsx(
                        "ml-2 rounded-full px-2 py-0.5 text-[0.75rem] font-medium",
                        state === "overdue"
                          ? "bg-danger/10 text-danger"
                          : "bg-warning/10 text-warning",
                      )}
                    >
                      {STATE_TEXT[state]}
                    </span>
                  ) : null}
                </span>
              </label>
              <button
                type="button"
                aria-label={`Editar «${t.title}»`}
                onClick={() => setEditing(t)}
                className="grid size-9 shrink-0 place-items-center rounded-md text-ink-soft hover:bg-ink/5 hover:text-ink"
              >
                <Pencil aria-hidden className="size-4" />
              </button>
              <button
                type="button"
                aria-label={`Borrar «${t.title}»`}
                onClick={() => {
                  setTasks((ts) => ts.filter((x) => x.id !== t.id));
                  void persist(() => deleteTask(eventId!, t.id));
                }}
                className="grid size-9 shrink-0 place-items-center rounded-md text-ink-soft hover:bg-danger/10 hover:text-danger"
              >
                <Trash2 aria-hidden className="size-4" />
              </button>
            </li>
          );
        })}
        {visible.length === 0 ? (
          <li className="px-4 py-8 text-center text-[0.9375rem] text-muted">
            {filter === "done" ? "Aún no hay tareas hechas." : "No hay tareas pendientes."}
          </li>
        ) : null}
      </ul>

      {editing ? (
        <TaskDialog
          key={editing === "new" ? "nueva" : editing.id}
          task={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSave={(task) => {
            setEditing(null);
            void save(task);
          }}
        />
      ) : null}
    </div>
  );
}

function TaskDialog({
  task,
  onClose,
  onSave,
}: {
  task: PlanTask | null;
  onClose: () => void;
  onSave: (task: Omit<PlanTask, "id"> & { id?: string }) => void;
}) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [dueDate, setDueDate] = useState(task?.dueDate ?? "");
  const [assignee, setAssignee] = useState(task?.assignee ?? "");
  const [error, setError] = useState<string | null>(null);
  return (
    <Dialog open onClose={onClose} title={task ? "Editar tarea" : "Nueva tarea"}>
      <form
        noValidate
        className="grid gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          const input = {
            id: task?.id,
            title,
            dueDate: dueDate || null,
            assignee,
            done: task?.done ?? false,
          };
          // El id no se comprueba aquí (en la demo no es un uuid); el servidor lo valida.
          const parsed = taskInputSchema.safeParse({ ...input, id: undefined });
          if (!parsed.success) {
            setError(parsed.error.issues[0]?.message ?? "Revisa la tarea.");
            return;
          }
          onSave(input);
        }}
      >
        <div>
          <label
            htmlFor="tarea-titulo"
            className="mb-1.5 block text-[0.875rem] font-medium text-ink"
          >
            Tarea
          </label>
          <TextInput
            id="tarea-titulo"
            value={title}
            maxLength={200}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="tarea-fecha"
              className="mb-1.5 block text-[0.875rem] font-medium text-ink"
            >
              Fecha límite
            </label>
            <TextInput
              id="tarea-fecha"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="tarea-responsable"
              className="mb-1.5 block text-[0.875rem] font-medium text-ink"
            >
              Responsable
            </label>
            <TextInput
              id="tarea-responsable"
              value={assignee}
              maxLength={80}
              onChange={(e) => setAssignee(e.target.value)}
            />
          </div>
        </div>
        <p role="status" className="min-h-5 text-[0.875rem] font-medium text-danger">
          {error}
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">{task ? "Guardar" : "Añadir tarea"}</Button>
        </div>
      </form>
    </Dialog>
  );
}
