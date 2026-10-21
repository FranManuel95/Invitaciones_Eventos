"use client";

import { clsx } from "clsx";
import { AlertTriangle, GripVertical, Pencil, Plus, Printer, Trash2 } from "lucide-react";
import {
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { assignTable, deleteTable, saveTable } from "@/app/panel/[evento]/mesas/actions";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { TextInput } from "@/components/ui/fields";
import type { GuestGroup, RsvpResponse } from "@/lib/domain/types";
import { plural } from "@/lib/guests/share";
import {
  headcount,
  nextTable,
  summarizeTables,
  tableInputSchema,
  unseatedGroups,
  type SeatingTable,
  type TableSummary,
} from "@/lib/seating";

type Assignment = Record<string, string | null>;

const clamp = (v: number) => Math.min(95, Math.max(5, Math.round(v * 10) / 10));

/**
 * Plano de mesas: las mesas se arrastran por el plano y las invitaciones sin mesa se arrastran
 * hasta una mesa. Todo tiene alternativa con teclado: las flechas mueven la mesa enfocada y cada
 * invitación tiene un desplegable para elegir mesa. En la demo los cambios no se guardan.
 */
export function SeatingPlanner({
  eventId,
  tables: initialTables,
  groups,
  responses,
}: {
  eventId: string | null;
  tables: SeatingTable[];
  groups: GuestGroup[];
  responses: RsvpResponse[];
}) {
  const [tables, setTables] = useState(initialTables);
  const [assignment, setAssignment] = useState<Assignment>(() =>
    Object.fromEntries(groups.map((g) => [g.id, g.tableId ?? null])),
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [editing, setEditing] = useState<SeatingTable | "new" | null>(null);
  const [removing, setRemoving] = useState<SeatingTable | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [ghost, setGhost] = useState<{ group: GuestGroup; x: number; y: number } | null>(null);
  const plan = useRef<HTMLDivElement>(null);

  const responseOf = useMemo(() => new Map(responses.map((r) => [r.groupId, r])), [responses]);
  const summaries = useMemo(
    () => summarizeTables(tables, groups, responses, assignment),
    [tables, groups, responses, assignment],
  );
  const unseated = unseatedGroups(groups, responses, assignment);
  const seatedPeople = summaries.reduce((n, s) => n + s.people, 0);
  const unseatedPeople = unseated.reduce(
    (n, g) => n + headcount(g, responseOf.get(g.id)).people,
    0,
  );

  /** Ejecuta una acción del servidor (eventos reales) y avisa si falla. */
  async function persist(action: () => Promise<{ ok: boolean; error?: string }>) {
    if (!eventId) return;
    const result = await action();
    setMessage(result.ok ? null : (result.error ?? "No se ha podido guardar."));
  }

  function seat(groupId: string, tableId: string | null) {
    setAssignment((a) => ({ ...a, [groupId]: tableId }));
    const group = groups.find((g) => g.id === groupId);
    const table = tables.find((t) => t.id === tableId);
    setMessage(
      group
        ? table
          ? `${group.displayName}: ${table.name}.`
          : `${group.displayName}: sin mesa.`
        : null,
    );
    void persist(() => assignTable(eventId!, groupId, tableId));
  }

  function moveTable(id: string, x: number, y: number, save: boolean) {
    setTables((ts) => ts.map((t) => (t.id === id ? { ...t, x: clamp(x), y: clamp(y) } : t)));
    if (save) {
      const table = tables.find((t) => t.id === id);
      if (table) void persist(() => saveTable(eventId!, { ...table, x: clamp(x), y: clamp(y) }));
    }
  }

  // Arrastre de una mesa por el plano (ratón, dedo o lápiz).
  function dragTable(e: ReactPointerEvent<HTMLButtonElement>, table: SeatingTable) {
    const rect = plan.current?.getBoundingClientRect();
    if (!rect) return;
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);
    const start = { x: e.clientX, y: e.clientY };
    let moved = false;
    let last = { x: table.x, y: table.y };
    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - start.x;
      const dy = ev.clientY - start.y;
      if (!moved && Math.hypot(dx, dy) < 4) return;
      moved = true;
      last = { x: table.x + (dx / rect.width) * 100, y: table.y + (dy / rect.height) * 100 };
      moveTable(table.id, last.x, last.y, false);
    };
    const onUp = () => {
      target.removeEventListener("pointermove", onMove);
      target.removeEventListener("pointerup", onUp);
      target.removeEventListener("pointercancel", onUp);
      if (moved) moveTable(table.id, last.x, last.y, true);
      else setSelected(table.id);
    };
    target.addEventListener("pointermove", onMove);
    target.addEventListener("pointerup", onUp);
    target.addEventListener("pointercancel", onUp);
  }

  function nudgeTable(e: KeyboardEvent<HTMLButtonElement>, table: SeatingTable) {
    const step = e.shiftKey ? 8 : 2;
    const delta: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const d = delta[e.key];
    if (!d) return;
    e.preventDefault();
    moveTable(table.id, table.x + d[0], table.y + d[1], true);
  }

  // Arrastre de una invitación sin mesa hasta una mesa del plano.
  function dragGroup(e: ReactPointerEvent<HTMLButtonElement>, group: GuestGroup) {
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);
    setGhost({ group, x: e.clientX, y: e.clientY });
    const onMove = (ev: PointerEvent) => setGhost({ group, x: ev.clientX, y: ev.clientY });
    const onUp = (ev: PointerEvent) => {
      target.removeEventListener("pointermove", onMove);
      target.removeEventListener("pointerup", onUp);
      target.removeEventListener("pointercancel", onUp);
      setGhost(null);
      const drop = document
        .elementFromPoint(ev.clientX, ev.clientY)
        ?.closest<HTMLElement>("[data-table-id]");
      if (drop?.dataset.tableId) seat(group.id, drop.dataset.tableId);
    };
    target.addEventListener("pointermove", onMove);
    target.addEventListener("pointerup", onUp);
    target.addEventListener("pointercancel", onUp);
  }

  const tableOptions = (
    <>
      <option value="">Sin mesa</option>
      {tables.map((t) => (
        <option key={t.id} value={t.id}>
          {t.name}
        </option>
      ))}
    </>
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <p className="text-[0.9375rem] text-muted">
          {plural(seatedPeople, "persona sentada", "personas sentadas")} ·{" "}
          {plural(unseatedPeople, "persona sin mesa", "personas sin mesa")} ·{" "}
          {plural(tables.length, "mesa", "mesas")}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => window.print()}>
            <Printer aria-hidden className="size-4" />
            Imprimir
          </Button>
          <Button onClick={() => setEditing("new")}>
            <Plus aria-hidden className="size-4" />
            Añadir mesa
          </Button>
        </div>
      </div>
      {eventId ? null : (
        <p className="mt-2 text-[0.8125rem] text-muted print:hidden">
          Demo: puedes mover mesas y sentar invitados, pero los cambios no se guardan.
        </p>
      )}
      <p
        role="status"
        aria-live="polite"
        className="mt-2 min-h-5 text-[0.875rem] text-ink-soft print:hidden"
      >
        {message}
      </p>

      <div className="mt-2 grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] print:hidden">
        {/* Plano */}
        <div
          ref={plan}
          className="relative aspect-[4/3] w-full touch-none overflow-hidden rounded-md border border-line bg-paper bg-[radial-gradient(var(--color-line)_1px,transparent_1px)] [background-size:24px_24px]"
          aria-label="Plano del salón"
          role="group"
        >
          {summaries.map((s) => (
            <TableNode
              key={s.table.id}
              summary={s}
              selected={selected === s.table.id}
              onPointerDown={(e) => dragTable(e, s.table)}
              onKeyDown={(e) => nudgeTable(e, s.table)}
            />
          ))}
          {tables.length === 0 ? (
            <p className="absolute inset-0 grid place-items-center p-6 text-center text-[0.9375rem] text-muted">
              Añade la primera mesa para empezar el plano.
            </p>
          ) : null}
        </div>

        {/* Invitaciones sin mesa */}
        <section aria-labelledby="sin-mesa" className="min-w-0">
          <h2 id="sin-mesa" className="font-display text-[1.375rem] text-ink">
            Sin mesa
          </h2>
          <p className="mt-1 text-[0.8125rem] text-muted">
            Arrástralas al plano o elige su mesa en la lista.
          </p>
          <ul className="mt-3 max-h-[32rem] space-y-2 overflow-y-auto pr-1">
            {unseated.map((g) => {
              const count = headcount(g, responseOf.get(g.id));
              return (
                <li
                  key={g.id}
                  className="flex items-center gap-2 rounded-md border border-line bg-paper p-2"
                >
                  <button
                    type="button"
                    aria-label={`Arrastrar ${g.displayName} a una mesa`}
                    onPointerDown={(e) => dragGroup(e, g)}
                    className="grid size-8 shrink-0 cursor-grab touch-none place-items-center rounded text-stone hover:bg-ink/5 hover:text-ink active:cursor-grabbing"
                  >
                    <GripVertical aria-hidden className="size-4" />
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.875rem] font-medium text-ink">{g.displayName}</p>
                    <p className="text-[0.75rem] text-muted">
                      {count.confirmed
                        ? plural(count.people, "persona", "personas")
                        : `hasta ${plural(count.people, "persona", "personas")} · sin responder`}
                    </p>
                  </div>
                  <label className="sr-only" htmlFor={`mesa-${g.id}`}>
                    Mesa de {g.displayName}
                  </label>
                  <select
                    id={`mesa-${g.id}`}
                    value=""
                    onChange={(e) => e.target.value && seat(g.id, e.target.value)}
                    className="h-8 w-24 shrink-0 rounded border border-line bg-paper px-1 text-[0.75rem] text-ink"
                  >
                    {tableOptions}
                  </select>
                </li>
              );
            })}
            {unseated.length === 0 ? (
              <li className="rounded-md border border-dashed border-line p-4 text-center text-[0.875rem] text-muted">
                Todo el mundo tiene mesa.
              </li>
            ) : null}
          </ul>
        </section>
      </div>

      {/* Detalle de cada mesa (también es la versión para imprimir) */}
      <section aria-labelledby="detalle-mesas" className="mt-10">
        <h2 id="detalle-mesas" className="font-display text-[1.75rem] text-ink">
          Mesas
        </h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 print:grid-cols-2">
          {summaries.map((s) => (
            <li
              key={s.table.id}
              id={`detalle-${s.table.id}`}
              className={clsx(
                "break-inside-avoid rounded-md border bg-paper p-4",
                selected === s.table.id ? "border-ink" : "border-line",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-display text-[1.375rem] leading-tight text-ink">
                    {s.table.name}
                  </h3>
                  <p
                    className={clsx(
                      "text-[0.8125rem]",
                      s.over ? "font-medium text-danger" : "text-muted",
                    )}
                  >
                    {s.people} de {s.table.seats} sitios
                    {s.children ? ` · ${plural(s.children, "niño", "niños")}` : ""}
                    {s.pending ? ` · ${s.pending} sin confirmar` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 print:hidden">
                  <button
                    type="button"
                    aria-label={`Editar ${s.table.name}`}
                    onClick={() => setEditing(s.table)}
                    className="grid size-9 place-items-center rounded-md text-ink-soft hover:bg-ink/5 hover:text-ink"
                  >
                    <Pencil aria-hidden className="size-4" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Borrar ${s.table.name}`}
                    onClick={() => setRemoving(s.table)}
                    className="grid size-9 place-items-center rounded-md text-ink-soft hover:bg-danger/10 hover:text-danger"
                  >
                    <Trash2 aria-hidden className="size-4" />
                  </button>
                </div>
              </div>
              {s.over ? (
                <p className="mt-2 flex items-center gap-1.5 text-[0.8125rem] font-medium text-danger">
                  <AlertTriangle aria-hidden className="size-3.5" />
                  {plural(-s.free, "persona de más", "personas de más")}
                </p>
              ) : null}
              {s.allergies.length ? (
                <p className="mt-2 text-[0.8125rem] text-warning">
                  <span className="font-medium">Alergias:</span> {s.allergies.join(" · ")}
                </p>
              ) : null}
              <ul className="mt-3 space-y-1.5">
                {s.groups.map((g) => (
                  <li
                    key={g.id}
                    className="flex items-center justify-between gap-2 text-[0.875rem]"
                  >
                    <span className="min-w-0 truncate text-ink">
                      {g.displayName}{" "}
                      <span className="text-muted">
                        ({headcount(g, responseOf.get(g.id)).people})
                      </span>
                    </span>
                    <label className="sr-only" htmlFor={`cambiar-${g.id}`}>
                      Cambiar la mesa de {g.displayName}
                    </label>
                    <select
                      id={`cambiar-${g.id}`}
                      value={s.table.id}
                      onChange={(e) => seat(g.id, e.target.value || null)}
                      className="h-8 w-28 shrink-0 rounded border border-line bg-paper px-1 text-[0.75rem] text-ink print:hidden"
                    >
                      {tableOptions}
                    </select>
                  </li>
                ))}
                {s.groups.length === 0 ? (
                  <li className="text-[0.8125rem] text-muted">Vacía.</li>
                ) : null}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      {ghost ? (
        <div
          aria-hidden
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink px-3 py-1.5 text-[0.8125rem] text-paper shadow-lg"
          style={{ left: ghost.x, top: ghost.y }}
        >
          {ghost.group.displayName}
        </div>
      ) : null}

      {editing ? (
        <TableDialog
          key={editing === "new" ? "nueva" : editing.id}
          table={editing === "new" ? null : editing}
          defaults={nextTable(tables)}
          onClose={() => setEditing(null)}
          onSave={async (input) => {
            setEditing(null);
            if (input.id) {
              setTables((ts) =>
                ts.map((t) => (t.id === input.id ? { ...t, ...input, id: t.id } : t)),
              );
              await persist(() => saveTable(eventId!, input));
              return;
            }
            // En eventos reales el id lo da la base de datos; en la demo, uno local.
            const result = eventId
              ? await saveTable(eventId, input)
              : { ok: true as const, id: `local-${Date.now()}` };
            if (!result.ok || !result.id) {
              setMessage(result.ok ? "No se ha podido crear la mesa." : result.error);
              return;
            }
            const id = result.id;
            setTables((ts) => [...ts, { ...input, id }]);
            setMessage(`${input.name} añadida al plano.`);
          }}
        />
      ) : null}

      <Dialog
        open={removing !== null}
        onClose={() => setRemoving(null)}
        title={`¿Borrar ${removing?.name ?? "la mesa"}?`}
        description="Sus invitaciones quedarán sin mesa, listas para sentarlas en otra."
      >
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setRemoving(null)}>
            Cancelar
          </Button>
          <Button
            className="bg-danger hover:bg-danger/90"
            onClick={() => {
              const table = removing;
              setRemoving(null);
              if (!table) return;
              setTables((ts) => ts.filter((t) => t.id !== table.id));
              setAssignment((a) =>
                Object.fromEntries(
                  Object.entries(a).map(([g, t]) => [g, t === table.id ? null : t]),
                ),
              );
              void persist(() => deleteTable(eventId!, table.id));
            }}
          >
            Borrar
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

function TableNode({
  summary: s,
  selected,
  onPointerDown,
  onKeyDown,
}: {
  summary: TableSummary;
  selected: boolean;
  onPointerDown: (e: ReactPointerEvent<HTMLButtonElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => void;
}) {
  const size = 3.6 + Math.min(s.table.seats, 20) * 0.12; // rem
  const ratio = s.people / s.table.seats;
  return (
    <button
      type="button"
      data-table-id={s.table.id}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      className={clsx(
        "absolute grid -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none place-items-center border-2 bg-cream text-center leading-tight shadow-sm transition-[box-shadow,border-color] select-none active:cursor-grabbing",
        s.table.shape === "round" ? "rounded-full" : "rounded-md",
        s.over ? "border-danger" : ratio >= 1 ? "border-success" : "border-ink/25",
        selected && "ring-2 ring-ink ring-offset-2 ring-offset-paper",
      )}
      style={{
        left: `${s.table.x}%`,
        top: `${s.table.y}%`,
        width: s.table.shape === "rect" ? `${size * 1.8}rem` : `${size}rem`,
        height: `${size}rem`,
      }}
    >
      <span className="pointer-events-none px-1">
        <span className="block text-[0.6875rem] font-medium text-ink">{s.table.name}</span>
        <span
          className={clsx(
            "block text-[0.6875rem]",
            s.over ? "font-semibold text-danger" : "text-muted",
          )}
        >
          {s.people}/{s.table.seats}
        </span>
        {/* El nombre accesible empieza por el texto visible y añade cómo usarla. */}
        <span className="sr-only">
          {" "}
          sitios ocupados{s.over ? ", llena de más" : ""}. Arrástrala o usa las flechas para
          moverla.
        </span>
      </span>
    </button>
  );
}

function TableDialog({
  table,
  defaults,
  onClose,
  onSave,
}: {
  table: SeatingTable | null;
  defaults: Omit<SeatingTable, "id">;
  onClose: () => void;
  onSave: (input: Omit<SeatingTable, "id"> & { id?: string }) => void;
}) {
  const base = table ?? defaults;
  const [name, setName] = useState(base.name);
  const [shape, setShape] = useState(base.shape);
  const [seats, setSeats] = useState(String(base.seats));
  const [error, setError] = useState<string | null>(null);
  return (
    <Dialog open onClose={onClose} title={table ? `Editar ${table.name}` : "Nueva mesa"}>
      <form
        noValidate
        className="grid gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          const input = { ...base, id: table?.id, name, shape, seats: Number(seats) };
          const parsed = tableInputSchema.safeParse(input);
          if (!parsed.success) {
            setError(
              parsed.error.issues[0]?.path[0] === "seats"
                ? "Entre 1 y 40 sitios."
                : "Ponle un nombre a la mesa.",
            );
            return;
          }
          onSave(input);
        }}
      >
        <div>
          <label
            htmlFor="mesa-nombre"
            className="mb-1.5 block text-[0.875rem] font-medium text-ink"
          >
            Nombre
          </label>
          <TextInput
            id="mesa-nombre"
            value={name}
            maxLength={60}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="mesa-forma"
              className="mb-1.5 block text-[0.875rem] font-medium text-ink"
            >
              Forma
            </label>
            <select
              id="mesa-forma"
              value={shape}
              onChange={(e) => setShape(e.target.value === "rect" ? "rect" : "round")}
              className="h-11 w-full rounded-md border border-line bg-paper px-3 text-[0.9375rem] text-ink"
            >
              <option value="round">Redonda</option>
              <option value="rect">Rectangular</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="mesa-sitios"
              className="mb-1.5 block text-[0.875rem] font-medium text-ink"
            >
              Sitios
            </label>
            <TextInput
              id="mesa-sitios"
              type="number"
              inputMode="numeric"
              min={1}
              max={40}
              value={seats}
              onChange={(e) => setSeats(e.target.value)}
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
          <Button type="submit">{table ? "Guardar" : "Añadir mesa"}</Button>
        </div>
      </form>
    </Dialog>
  );
}
