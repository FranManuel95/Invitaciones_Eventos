"use server";

import { revalidatePath } from "next/cache";
import { validateGroup, type GroupInput } from "@/lib/guests/group-input";
import { createSessionClient } from "@/lib/supabase/server";

/*
 * Alta, cambios, borrado e importación de invitaciones de un evento real. Todo se valida aquí
 * otra vez y las políticas RLS solo dejan tocar los eventos de los que se es miembro.
 */

export type GroupActionResult = { ok: true } | { ok: false; error: string };

const isUuid = (v: string) => /^[0-9a-f-]{36}$/.test(v);

async function client() {
  const supabase = await createSessionClient();
  if (!supabase) throw new Error("Supabase no está configurado.");
  return supabase;
}

function done(eventId: string): GroupActionResult {
  revalidatePath(`/panel/${eventId}`, "layout");
  return { ok: true };
}

const groupRow = (eventId: string, g: GroupInput) => ({
  event_id: eventId,
  display_name: g.displayName,
  category: g.category || "Familia",
  max_attendees: g.maxAttendees,
  phone: g.phone || null,
});

const memberRows = (eventId: string, groupId: string, g: GroupInput) =>
  g.members.map((m, i) => ({
    ...(m.id ? { id: m.id } : {}),
    group_id: groupId,
    event_id: eventId,
    first_name: m.firstName,
    last_name: m.lastName,
    is_primary: i === 0,
    is_child: m.isChild,
    sort: i,
  }));

/** Crea o actualiza una invitación. Las personas se actualizan por id para no perder respuestas. */
export async function saveGroup(eventId: string, input: unknown): Promise<GroupActionResult> {
  if (!isUuid(eventId)) return { ok: false, error: "No encontramos el evento." };
  const check = validateGroup(input);
  if (!check.ok) return { ok: false, error: "Revisa los campos marcados." };
  const g = check.group;
  const supabase = await client();

  let groupId: string;
  if (g.id) {
    const { data, error } = await supabase
      .from("guest_groups")
      .update(groupRow(eventId, g))
      .eq("id", g.id)
      .eq("event_id", eventId)
      .select("id");
    if (error || !data?.length) return { ok: false, error: "No hemos podido guardar los cambios." };
    groupId = g.id;
  } else {
    const { data, error } = await supabase
      .from("guest_groups")
      .insert(groupRow(eventId, g))
      .select("id")
      .single();
    if (error || !data) return { ok: false, error: "No hemos podido crear la invitación." };
    groupId = data.id;
  }

  // Personas: solo cuentan como existentes los ids que ya son de esta invitación; se borran las
  // quitadas y se actualizan o añaden las demás.
  const { data: current } = await supabase.from("guests").select("id").eq("group_id", groupId);
  const owned = new Set((current ?? []).map((r) => r.id));
  const members = g.members.map((m) => (m.id && owned.has(m.id) ? m : { ...m, id: undefined }));
  const keep = members.flatMap((m) => (m.id ? [m.id] : []));
  const removed = [...owned].filter((id) => !keep.includes(id));
  if (removed.length) {
    const { error } = await supabase.from("guests").delete().in("id", removed);
    if (error) return { ok: false, error: "No hemos podido guardar las personas." };
  }
  const rows = memberRows(eventId, groupId, { ...g, members });
  const existing = rows.filter((r) => "id" in r);
  const added = rows.filter((r) => !("id" in r));
  if (existing.length) {
    const { error } = await supabase.from("guests").upsert(existing);
    if (error) return { ok: false, error: "No hemos podido guardar las personas." };
  }
  if (added.length) {
    const { error } = await supabase.from("guests").insert(added);
    if (error) return { ok: false, error: "No hemos podido guardar las personas." };
  }
  return done(eventId);
}

/** Borra una invitación con sus personas y su respuesta. */
export async function deleteGroup(eventId: string, groupId: string): Promise<GroupActionResult> {
  if (!isUuid(eventId) || !isUuid(groupId)) return { ok: false, error: "No la encontramos." };
  const supabase = await client();
  const { data, error } = await supabase
    .from("guest_groups")
    .delete()
    .eq("id", groupId)
    .eq("event_id", eventId)
    .select("id");
  if (error || !data?.length) return { ok: false, error: "No hemos podido borrarla." };
  return done(eventId);
}

/** Importa invitaciones nuevas (del CSV ya revisado en la vista previa). */
export async function importGroups(
  eventId: string,
  input: unknown[],
): Promise<GroupActionResult & { created?: number }> {
  if (!isUuid(eventId)) return { ok: false, error: "No encontramos el evento." };
  if (!Array.isArray(input) || input.length === 0 || input.length > 500) {
    return { ok: false, error: "No hay invitaciones que importar." };
  }
  const groups: GroupInput[] = [];
  for (const item of input) {
    const check = validateGroup(item);
    if (!check.ok) return { ok: false, error: "El archivo tiene datos por revisar." };
    groups.push({ ...check.group, id: undefined });
  }
  const supabase = await client();
  const { count } = await supabase
    .from("guest_groups")
    .select("id", { count: "exact", head: true })
    .eq("event_id", eventId);
  const { data: created, error } = await supabase
    .from("guest_groups")
    .insert(groups.map((g, i) => ({ ...groupRow(eventId, g), sort: (count ?? 0) + i })))
    .select("id");
  if (error || !created || created.length !== groups.length) {
    return { ok: false, error: "No hemos podido importar las invitaciones." };
  }
  const { error: guestsError } = await supabase.from("guests").insert(
    groups.flatMap((g, i) =>
      memberRows(eventId, created[i]!.id, {
        ...g,
        members: g.members.map((m) => ({ ...m, id: undefined })),
      }),
    ),
  );
  if (guestsError)
    return { ok: false, error: "Se crearon las invitaciones, pero no sus personas." };
  return { ...done(eventId), created: groups.length };
}
