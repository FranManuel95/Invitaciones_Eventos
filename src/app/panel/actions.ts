"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { showcaseGroups } from "@/data/demo/guests";
import { buildNewEventContent, slugFor, validateNewEvent } from "@/lib/events/new-event";
import { createSessionClient } from "@/lib/supabase/server";

export interface ActionState {
  error: string | null;
}

async function requireUser() {
  const supabase = await createSessionClient();
  if (!supabase) throw new Error("Supabase no está configurado.");
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/entrar");
  return supabase;
}

/** Crea un evento a partir de la plantilla y, si se pide, con invitados de ejemplo. */
export async function createEvent(_prev: ActionState, form: FormData): Promise<ActionState> {
  const input = {
    first: String(form.get("first") ?? "").trim(),
    second: String(form.get("second") ?? "").trim(),
    date: String(form.get("date") ?? ""),
  };
  const invalid = validateNewEvent(input);
  if (invalid) return { error: invalid };

  const supabase = await requireUser();
  const { data: event, error } = await supabase
    .from("events")
    .insert({
      slug: slugFor(input, randomBytes(3).toString("hex")),
      content: buildNewEventContent(input),
    })
    .select("id")
    .single();
  if (error || !event) return { error: "No hemos podido crear el evento. Inténtalo de nuevo." };

  if (form.get("sample") === "on") {
    // Grupos de ejemplo (con tokens nuevos y aleatorios generados por la base de datos).
    for (const [index, group] of showcaseGroups.entries()) {
      const { data: created } = await supabase
        .from("guest_groups")
        .insert({
          event_id: event.id,
          display_name: group.displayName,
          category: group.category,
          max_attendees: group.maxAttendees,
          sort: index,
        })
        .select("id")
        .single();
      if (!created) continue;
      await supabase.from("guests").insert(
        group.members.map((m, i) => ({
          group_id: created.id,
          event_id: event.id,
          first_name: m.firstName,
          last_name: m.lastName,
          is_primary: m.isPrimary,
          is_child: Boolean(m.isChild),
          sort: i,
        })),
      );
    }
  }
  // Lo siguiente es darle vuestro toque: textos, fotos y estilo.
  redirect(`/editor/${event.id}`);
}

/**
 * Publica el borrador: a partir de ahora los invitados ven esta versión. Con `save_the_date` ven
 * solo el aviso de la fecha (sin confirmación); con `invitacion`, la invitación completa. Sin
 * fase (el botón del editor) se mantiene la que ya hubiera.
 */
export async function publishEvent(
  eventId: string,
  phase?: "save_the_date" | "invitacion",
): Promise<ActionState> {
  if (phase !== undefined && phase !== "save_the_date" && phase !== "invitacion") {
    return { error: "Fase no válida." };
  }
  const supabase = await requireUser();
  const { data: current } = await supabase
    .from("events")
    .select("content, theme")
    .eq("id", eventId)
    .maybeSingle();
  if (!current) return { error: "No encontramos el evento." };
  const { error } = await supabase
    .from("events")
    .update({
      status: "published",
      ...(phase ? { phase } : {}),
      published_content: current.content,
      published_theme: current.theme,
      published_at: new Date().toISOString(),
    })
    .eq("id", eventId);
  if (error) return { error: "No hemos podido publicar. Inténtalo de nuevo." };
  revalidatePath(`/panel/${eventId}`, "layout");
  return { error: null };
}

export async function signOut() {
  const supabase = await createSessionClient();
  await supabase?.auth.signOut();
  redirect("/entrar");
}
