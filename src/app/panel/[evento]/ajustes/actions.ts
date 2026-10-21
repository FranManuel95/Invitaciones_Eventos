"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/server";

/*
 * Ajustes del evento: invitar a otra persona con un enlace, quitar miembros y borrar el evento.
 * Solo los propietarios pueden hacerlo (políticas RLS de event_invites, event_members y events).
 */

export type SettingsResult = { ok: true; token?: string } | { ok: false; error: string };

const isUuid = (v: unknown): v is string => typeof v === "string" && /^[0-9a-f-]{36}$/.test(v);

async function client() {
  const supabase = await createSessionClient();
  if (!supabase) throw new Error("Supabase no está configurado.");
  return supabase;
}

/** Crea un enlace de un solo uso (7 días) para unirse al evento. */
export async function createInvite(
  eventId: string,
  role: "owner" | "editor",
): Promise<SettingsResult> {
  if (!isUuid(eventId) || !["owner", "editor"].includes(role)) {
    return { ok: false, error: "No encontramos el evento." };
  }
  const supabase = await client();
  const { data, error } = await supabase
    .from("event_invites")
    .insert({ event_id: eventId, role })
    .select("token")
    .single();
  if (error || !data) return { ok: false, error: "Solo quien creó el evento puede invitar." };
  revalidatePath(`/panel/${eventId}/ajustes`);
  return { ok: true, token: data.token };
}

export async function deleteInvite(eventId: string, inviteId: string): Promise<SettingsResult> {
  if (!isUuid(eventId) || !isUuid(inviteId)) return { ok: false, error: "No la encontramos." };
  const supabase = await client();
  const { error } = await supabase
    .from("event_invites")
    .delete()
    .eq("id", inviteId)
    .eq("event_id", eventId);
  if (error) return { ok: false, error: "No hemos podido anularla." };
  revalidatePath(`/panel/${eventId}/ajustes`);
  return { ok: true };
}

/** Quita a una persona del evento (los propietarios no se pueden quitar desde aquí). */
export async function removeMember(eventId: string, userId: string): Promise<SettingsResult> {
  if (!isUuid(eventId) || !isUuid(userId)) return { ok: false, error: "No la encontramos." };
  const supabase = await client();
  const { data, error } = await supabase
    .from("event_members")
    .delete()
    .eq("event_id", eventId)
    .eq("user_id", userId)
    .eq("role", "editor")
    .select("user_id");
  if (error || !data?.length) return { ok: false, error: "No hemos podido quitar a esa persona." };
  revalidatePath(`/panel/${eventId}/ajustes`);
  return { ok: true };
}

/** Borra el evento con todo lo que cuelga de él. Pide escribir los nombres de la pareja. */
export async function deleteEvent(
  eventId: string,
  confirmation: string,
  expected: string,
): Promise<SettingsResult> {
  if (!isUuid(eventId)) return { ok: false, error: "No encontramos el evento." };
  if (confirmation.trim().toLowerCase() !== expected.trim().toLowerCase()) {
    return { ok: false, error: "El texto no coincide." };
  }
  const supabase = await client();
  const { data, error } = await supabase.from("events").delete().eq("id", eventId).select("id");
  if (error || !data?.length) {
    return { ok: false, error: "Solo quien creó el evento puede borrarlo." };
  }
  redirect("/panel");
}
