"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteBudgetItem, saveBudgetItem } from "@/app/panel/[evento]/planificacion-actions";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { TextArea, TextInput } from "@/components/ui/fields";
import { KpiStrip, Meter } from "@/features/dashboard/ui";
import {
  BUDGET_CATEGORIES,
  budgetInputSchema,
  formatEuros,
  summarizeBudget,
  type BudgetItem,
} from "@/lib/planning/budget";

const dayFmt = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});
const formatDay = (iso: string) => dayFmt.format(new Date(`${iso}T12:00:00Z`));

// Ids provisionales en la demo (en eventos reales los da la base de datos).
let localCount = 0;

/**
 * Presupuesto: totales, reparto por categoría, próximos pagos y las partidas. En la demo los
 * cambios no se guardan.
 */
export function BudgetBoard({
  eventId,
  items: initial,
  confirmedGuests,
}: {
  eventId: string | null;
  items: BudgetItem[];
  confirmedGuests: number;
}) {
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<BudgetItem | "new" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const summary = summarizeBudget(items, confirmedGuests);

  async function save(item: Omit<BudgetItem, "id"> & { id?: string }) {
    if (item.id) {
      setItems((xs) => xs.map((x) => (x.id === item.id ? { ...x, ...item, id: x.id } : x)));
      if (eventId) {
        const r = await saveBudgetItem(eventId, item);
        if (!r.ok) setMessage(r.error);
      }
      return;
    }
    let id = `local-${++localCount}`;
    if (eventId) {
      const r = await saveBudgetItem(eventId, item);
      if (!r.ok || !r.id) {
        setMessage(r.ok ? "No se ha podido crear la partida." : r.error);
        return;
      }
      id = r.id;
    }
    setItems((xs) => [...xs, { ...item, id }]);
    setMessage(`Partida añadida: ${item.concept}.`);
  }

  return (
    <div>
      <KpiStrip
        items={[
          { label: "Estimado", value: formatEuros(summary.estimated) },
          { label: "Pagado", value: formatEuros(summary.paid) },
          { label: "Pendiente", value: formatEuros(summary.pending) },
          {
            label: "Por invitado",
            value: summary.perGuest === null ? "—" : formatEuros(summary.perGuest),
            detail: `${confirmedGuests} confirmados`,
          },
        ]}
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section aria-labelledby="por-categoria">
          <h2 id="por-categoria" className="font-display text-[1.5rem] text-ink">
            Por categoría
          </h2>
          <ul className="mt-4 space-y-4">
            {summary.byCategory.map((c) => (
              <li key={c.category}>
                <div className="mb-1.5 flex justify-between gap-3 text-[0.875rem]">
                  <span className="text-ink">{c.category}</span>
                  <span className="text-muted tabular-nums">
                    {formatEuros(c.paid)} de {formatEuros(c.estimated)}
                  </span>
                </div>
                <Meter
                  value={c.paid}
                  max={c.estimated}
                  label={`${c.category}: pagado ${formatEuros(c.paid)} de ${formatEuros(c.estimated)}`}
                />
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="proximos-pagos">
          <h2 id="proximos-pagos" className="font-display text-[1.5rem] text-ink">
            Próximos pagos
          </h2>
          <ul className="mt-4 divide-y divide-line">
            {summary.upcoming.slice(0, 6).map((p) => (
              <li key={p.id} className="flex justify-between gap-3 py-2.5 text-[0.9375rem]">
                <span className="min-w-0">
                  <span className="block truncate text-ink">{p.concept}</span>
                  <span className="text-[0.8125rem] text-muted">{formatDay(p.dueDate!)}</span>
                </span>
                <span className="shrink-0 text-ink tabular-nums">{formatEuros(p.due)}</span>
              </li>
            ))}
            {summary.upcoming.length === 0 ? (
              <li className="py-3 text-[0.9375rem] text-muted">
                No hay pagos pendientes con fecha.
              </li>
            ) : null}
          </ul>
        </section>
      </div>

      <section aria-labelledby="partidas" className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="partidas" className="font-display text-[1.75rem] text-ink">
            Partidas
          </h2>
          <Button onClick={() => setEditing("new")}>
            <Plus aria-hidden className="size-4" />
            Nueva partida
          </Button>
        </div>
        <p role="status" className="mt-2 min-h-5 text-[0.875rem] text-ink-soft">
          {message ?? (eventId ? "" : "Demo: los cambios no se guardan.")}
        </p>
        <ul className="mt-2 divide-y divide-line rounded-md border border-line bg-paper">
          {items.map((i) => (
            <li key={i.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-[0.9375rem] text-ink">{i.concept}</p>
                <p className="text-[0.8125rem] text-muted">
                  {i.category}
                  {i.dueDate ? ` · próximo pago el ${formatDay(i.dueDate)}` : ""}
                </p>
              </div>
              <p className="text-right text-[0.875rem] tabular-nums">
                <span className="block text-ink">{formatEuros(i.estimated)}</span>
                <span className="block text-muted">pagado {formatEuros(i.paid)}</span>
              </p>
              <div className="flex">
                <button
                  type="button"
                  aria-label={`Editar «${i.concept}»`}
                  onClick={() => setEditing(i)}
                  className="grid size-9 place-items-center rounded-md text-ink-soft hover:bg-ink/5 hover:text-ink"
                >
                  <Pencil aria-hidden className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label={`Borrar «${i.concept}»`}
                  onClick={async () => {
                    setItems((xs) => xs.filter((x) => x.id !== i.id));
                    if (eventId) {
                      const r = await deleteBudgetItem(eventId, i.id);
                      if (!r.ok) setMessage(r.error);
                    }
                  }}
                  className="grid size-9 place-items-center rounded-md text-ink-soft hover:bg-danger/10 hover:text-danger"
                >
                  <Trash2 aria-hidden className="size-4" />
                </button>
              </div>
            </li>
          ))}
          {items.length === 0 ? (
            <li className="px-4 py-8 text-center text-[0.9375rem] text-muted">
              Añade la primera partida: la finca, el catering, la fotografía…
            </li>
          ) : null}
        </ul>
      </section>

      {editing ? (
        <BudgetDialog
          key={editing === "new" ? "nueva" : editing.id}
          item={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSave={(item) => {
            setEditing(null);
            void save(item);
          }}
        />
      ) : null}
    </div>
  );
}

function BudgetDialog({
  item,
  onClose,
  onSave,
}: {
  item: BudgetItem | null;
  onClose: () => void;
  onSave: (item: Omit<BudgetItem, "id"> & { id?: string }) => void;
}) {
  const [concept, setConcept] = useState(item?.concept ?? "");
  const [category, setCategory] = useState(item?.category ?? BUDGET_CATEGORIES[0]);
  const [estimated, setEstimated] = useState(item ? String(item.estimated) : "");
  const [paid, setPaid] = useState(item ? String(item.paid) : "0");
  const [dueDate, setDueDate] = useState(item?.dueDate ?? "");
  const [notes, setNotes] = useState(item?.notes ?? "");
  const [error, setError] = useState<string | null>(null);
  const number = (v: string) => Number(v.replace(",", ".")) || 0;
  const label = "mb-1.5 block text-[0.875rem] font-medium text-ink";
  return (
    <Dialog open onClose={onClose} title={item ? "Editar partida" : "Nueva partida"}>
      <form
        noValidate
        className="grid gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          const input = {
            concept,
            category,
            estimated: number(estimated),
            paid: number(paid),
            dueDate: dueDate || null,
            notes,
          };
          const parsed = budgetInputSchema.safeParse(input);
          if (!parsed.success) {
            setError(parsed.error.issues[0]?.message ?? "Revisa la partida.");
            return;
          }
          onSave({ ...parsed.data, id: item?.id });
        }}
      >
        <div>
          <label htmlFor="partida-concepto" className={label}>
            Concepto
          </label>
          <TextInput
            id="partida-concepto"
            value={concept}
            maxLength={200}
            onChange={(e) => setConcept(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="partida-categoria" className={label}>
            Categoría
          </label>
          <select
            id="partida-categoria"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-11 w-full rounded-md border border-line bg-paper px-3 text-[0.9375rem] text-ink"
          >
            {[...new Set([...BUDGET_CATEGORIES, category])].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="partida-estimado" className={label}>
              Estimado (€)
            </label>
            <TextInput
              id="partida-estimado"
              inputMode="decimal"
              value={estimated}
              onChange={(e) => setEstimated(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="partida-pagado" className={label}>
              Pagado (€)
            </label>
            <TextInput
              id="partida-pagado"
              inputMode="decimal"
              value={paid}
              onChange={(e) => setPaid(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="partida-fecha" className={label}>
              Próximo pago
            </label>
            <TextInput
              id="partida-fecha"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label htmlFor="partida-notas" className={label}>
            Notas
          </label>
          <TextArea
            id="partida-notas"
            value={notes}
            maxLength={1000}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <p role="status" className="min-h-5 text-[0.875rem] font-medium text-danger">
          {error}
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">{item ? "Guardar" : "Añadir partida"}</Button>
        </div>
      </form>
    </Dialog>
  );
}
