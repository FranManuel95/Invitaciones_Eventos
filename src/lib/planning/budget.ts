import { z } from "zod";

/*
 * Presupuesto (tabla «budget_items»): partidas con lo estimado, lo pagado y la fecha del pago
 * pendiente. Importes en euros con dos decimales.
 */

export const BUDGET_CATEGORIES = [
  "Lugar y banquete",
  "Ceremonia",
  "Fotografía y vídeo",
  "Música",
  "Vestuario",
  "Flores y decoración",
  "Transporte",
  "Invitaciones y detalles",
  "Otros",
] as const;

export interface BudgetItem {
  id: string;
  concept: string;
  category: string;
  estimated: number;
  paid: number;
  /** Fecha del siguiente pago (AAAA-MM-DD) o null. */
  dueDate: string | null;
  notes: string;
}

const money = z
  .number()
  .min(0, "No puede ser negativo.")
  .max(10_000_000)
  .transform((v) => Math.round(v * 100) / 100);

export const budgetInputSchema = z.object({
  id: z.uuid().optional(),
  concept: z.string().trim().min(1, "Escribe el concepto.").max(200),
  category: z.string().trim().min(1).max(60),
  estimated: money,
  paid: money,
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha no válida.")
    .nullable(),
  notes: z.string().trim().max(1000),
});

export type BudgetInput = z.infer<typeof budgetInputSchema>;

const euros = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export const formatEuros = (value: number) => euros.format(value);

export interface BudgetSummary {
  estimated: number;
  paid: number;
  pending: number;
  byCategory: { category: string; estimated: number; paid: number }[];
  /** Pagos pendientes con fecha, del más próximo al más lejano. */
  upcoming: (BudgetItem & { due: number })[];
  /** Coste estimado por invitado confirmado (null sin confirmados). */
  perGuest: number | null;
}

export function summarizeBudget(items: BudgetItem[], confirmedGuests: number): BudgetSummary {
  const estimated = items.reduce((n, i) => n + i.estimated, 0);
  const paid = items.reduce((n, i) => n + i.paid, 0);
  const categories = new Map<string, { estimated: number; paid: number }>();
  for (const item of items) {
    const c = categories.get(item.category) ?? { estimated: 0, paid: 0 };
    c.estimated += item.estimated;
    c.paid += item.paid;
    categories.set(item.category, c);
  }
  return {
    estimated,
    paid,
    pending: Math.max(0, estimated - paid),
    byCategory: [...categories]
      .map(([category, c]) => ({ category, ...c }))
      .sort((a, b) => b.estimated - a.estimated),
    upcoming: items
      .map((i) => ({ ...i, due: Math.max(0, i.estimated - i.paid) }))
      .filter((i) => i.due > 0 && i.dueDate)
      .sort((a, b) => a.dueDate!.localeCompare(b.dueDate!)),
    perGuest: confirmedGuests > 0 ? estimated / confirmedGuests : null,
  };
}
