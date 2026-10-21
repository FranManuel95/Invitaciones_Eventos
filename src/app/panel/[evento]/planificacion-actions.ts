"use server";

import { revalidatePath } from "next/cache";
import { budgetInputSchema } from "@/lib/planning/budget";
import { taskInputSchema } from "@/lib/planning/tasks";
import { createSessionClient } from "@/lib/supabase/server";

/*
 * Tareas y presupuesto de un evento real. Se valida aquí y RLS solo deja tocar eventos propios.
 */

export type PlanningResult = { ok: true; id?: string } | { ok: false; error: string };

const isUuid = (v: unknown): v is string => typeof v === "string" && /^[0-9a-f-]{36}$/.test(v);

async function client() {
  const supabase = await createSessionClient();
  if (!supabase) throw new Error("Supabase no está configurado.");
  return supabase;
}

function done(eventId: string, id?: string): PlanningResult {
  revalidatePath(`/panel/${eventId}`, "layout");
  return { ok: true, id };
}

/** Crea o actualiza tareas (una o varias: las sugeridas se añaden de golpe). */
export async function saveTasks(eventId: string, input: unknown[]): Promise<PlanningResult> {
  if (!isUuid(eventId) || !Array.isArray(input) || input.length === 0 || input.length > 50) {
    return { ok: false, error: "No hay tareas que guardar." };
  }
  const rows = [];
  for (const item of input) {
    const parsed = taskInputSchema.safeParse(item);
    if (!parsed.success) return { ok: false, error: "Revisa los datos de la tarea." };
    const t = parsed.data;
    rows.push({
      ...(t.id ? { id: t.id } : {}),
      event_id: eventId,
      title: t.title,
      due_date: t.dueDate,
      assignee: t.assignee || null,
      done: t.done,
    });
  }
  const supabase = await client();
  const existing = rows.filter((r) => "id" in r);
  const added = rows.filter((r) => !("id" in r));
  for (const row of existing) {
    const { id, ...values } = row as typeof row & { id: string };
    const { data, error } = await supabase
      .from("tasks")
      .update(values)
      .eq("id", id)
      .eq("event_id", eventId)
      .select("id");
    if (error || !data?.length) return { ok: false, error: "No hemos podido guardar la tarea." };
  }
  if (added.length) {
    const { data, error } = await supabase.from("tasks").insert(added).select("id");
    if (error || !data) return { ok: false, error: "No hemos podido crear la tarea." };
    return done(eventId, data.length === 1 ? data[0]!.id : undefined);
  }
  return done(eventId);
}

export async function deleteTask(eventId: string, taskId: string): Promise<PlanningResult> {
  if (!isUuid(eventId) || !isUuid(taskId)) return { ok: false, error: "No la encontramos." };
  const supabase = await client();
  const { data, error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId)
    .eq("event_id", eventId)
    .select("id");
  if (error || !data?.length) return { ok: false, error: "No hemos podido borrar la tarea." };
  return done(eventId);
}

export async function saveBudgetItem(eventId: string, input: unknown): Promise<PlanningResult> {
  if (!isUuid(eventId)) return { ok: false, error: "No encontramos el evento." };
  const parsed = budgetInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Revisa los datos de la partida." };
  const { id, dueDate, notes, ...rest } = parsed.data;
  const values = { ...rest, due_date: dueDate, notes: notes || null };
  const supabase = await client();
  if (id) {
    const { data, error } = await supabase
      .from("budget_items")
      .update(values)
      .eq("id", id)
      .eq("event_id", eventId)
      .select("id");
    if (error || !data?.length) return { ok: false, error: "No hemos podido guardar la partida." };
    return done(eventId, id);
  }
  const { data, error } = await supabase
    .from("budget_items")
    .insert({ ...values, event_id: eventId })
    .select("id")
    .single();
  if (error || !data) return { ok: false, error: "No hemos podido crear la partida." };
  return done(eventId, data.id);
}

export async function deleteBudgetItem(eventId: string, itemId: string): Promise<PlanningResult> {
  if (!isUuid(eventId) || !isUuid(itemId)) return { ok: false, error: "No la encontramos." };
  const supabase = await client();
  const { data, error } = await supabase
    .from("budget_items")
    .delete()
    .eq("id", itemId)
    .eq("event_id", eventId)
    .select("id");
  if (error || !data?.length) return { ok: false, error: "No hemos podido borrar la partida." };
  return done(eventId);
}
