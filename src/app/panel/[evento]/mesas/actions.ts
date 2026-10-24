"use server";

import { revalidatePath } from "next/cache";
import { tableInputSchema } from "@/lib/seating";
import { createSessionClient } from "@/lib/supabase/server";

/*
 * Plano de mesas de un evento real: crear, mover, cambiar y borrar mesas, y sentar invitaciones.
 * RLS solo deja tocar los eventos propios y un trigger impide usar una mesa de otro evento.
 */

export type TableActionResult = { ok: true; id?: string } | { ok: false; error: string };

const isUuid = (v: unknown): v is string => typeof v === "string" && /^[0-9a-f-]{36}$/.test(v);

async function client() {
  const supabase = await createSessionClient();
  if (!supabase) throw new Error("Supabase no está configurado.");
  return supabase;
}

function done(eventId: string, id?: string): TableActionResult {
  revalidatePath(`/panel/${eventId}`, "layout");
  return { ok: true, id };
}

/** Crea o actualiza una mesa (nombre, forma, plazas y posición). */
export async function saveTable(eventId: string, input: unknown): Promise<TableActionResult> {
  if (!isUuid(eventId)) return { ok: false, error: "No encontramos el evento." };
  const parsed = tableInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Revisa los datos de la mesa." };
  const { id, ...row } = parsed.data;
  const supabase = await client();
  if (id) {
    const { data, error } = await supabase
      .from("tables")
      .update(row)
      .eq("id", id)
      .eq("event_id", eventId)
      .select("id");
    if (error || !data?.length) return { ok: false, error: "No hemos podido guardar la mesa." };
    return done(eventId, id);
  }
  const { data, error } = await supabase
    .from("tables")
    .insert({ ...row, event_id: eventId })
    .select("id")
    .single();
  if (error || !data) return { ok: false, error: "No hemos podido crear la mesa." };
  return done(eventId, data.id);
}

/** Borra una mesa; sus invitaciones se quedan sin mesa. */
export async function deleteTable(eventId: string, tableId: string): Promise<TableActionResult> {
  if (!isUuid(eventId) || !isUuid(tableId)) return { ok: false, error: "No la encontramos." };
  const supabase = await client();
  const { data, error } = await supabase
    .from("tables")
    .delete()
    .eq("id", tableId)
    .eq("event_id", eventId)
    .select("id");
  if (error || !data?.length) return { ok: false, error: "No hemos podido borrar la mesa." };
  return done(eventId);
}

/** Sienta una invitación en una mesa (o la levanta con null). */
export async function assignTable(
  eventId: string,
  groupId: string,
  tableId: string | null,
): Promise<TableActionResult> {
  if (!isUuid(eventId) || !isUuid(groupId) || (tableId !== null && !isUuid(tableId))) {
    return { ok: false, error: "No la encontramos." };
  }
  const supabase = await client();
  const { data, error } = await supabase
    .from("guest_groups")
    .update({ table_id: tableId })
    .eq("id", groupId)
    .eq("event_id", eventId)
    .select("id");
  if (error || !data?.length) return { ok: false, error: "No hemos podido cambiar la mesa." };
  return done(eventId);
}
