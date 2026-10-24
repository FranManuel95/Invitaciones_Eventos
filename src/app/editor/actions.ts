"use server";

import { revalidatePath } from "next/cache";
import { validateDraft } from "@/lib/editor/draft";
import { createSessionClient } from "@/lib/supabase/server";

export type SaveResult = { ok: true } | { ok: false; error: string };

/**
 * Guarda el borrador (contenido y tema) de un evento. Se vuelve a validar aquí: el navegador no
 * es de fiar. Las políticas RLS solo dejan escribir a los miembros del evento.
 */
export async function saveDraft(
  eventId: string,
  input: { content: unknown; theme: unknown },
): Promise<SaveResult> {
  if (!/^[0-9a-f-]{36}$/.test(eventId)) return { ok: false, error: "No encontramos el evento." };
  const check = validateDraft(input);
  if (!check.ok) return { ok: false, error: "Hay campos por revisar." };
  const supabase = await createSessionClient();
  if (!supabase) return { ok: false, error: "El guardado no está disponible." };
  const { data, error } = await supabase
    .from("events")
    .update({ content: check.draft.content, theme: check.draft.theme })
    .eq("id", eventId)
    .select("id");
  if (error) return { ok: false, error: "No hemos podido guardar. Revisa tu conexión." };
  if (!data?.length) return { ok: false, error: "No tienes permiso para editar este evento." };
  revalidatePath(`/panel/${eventId}`, "layout");
  return { ok: true };
}
