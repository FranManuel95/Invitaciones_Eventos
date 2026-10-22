"use server";

import { revalidatePath } from "next/cache";
import { createSessionClient } from "@/lib/supabase/server";

/*
 * Moderación del álbum: aprobar u ocultar una foto, o borrarla del todo (fila y archivo). Solo los
 * miembros del evento pueden hacerlo (RLS de guest_photos y política de borrado del almacenamiento).
 */

export type AlbumResult = { ok: true } | { ok: false; error: string };

const isUuid = (v: unknown): v is string => typeof v === "string" && /^[0-9a-f-]{36}$/.test(v);

export async function setPhotoStatus(
  eventId: string,
  photoId: string,
  status: "approved" | "hidden",
): Promise<AlbumResult> {
  if (!isUuid(eventId) || !isUuid(photoId) || !["approved", "hidden"].includes(status)) {
    return { ok: false, error: "No encontramos la foto." };
  }
  const supabase = await createSessionClient();
  if (!supabase) return { ok: false, error: "Supabase no está configurado." };
  const { error } = await supabase
    .from("guest_photos")
    .update({ status })
    .eq("id", photoId)
    .eq("event_id", eventId);
  if (error) return { ok: false, error: "No hemos podido guardar el cambio." };
  revalidatePath(`/panel/${eventId}/album`);
  return { ok: true };
}

export async function deletePhoto(eventId: string, photoId: string): Promise<AlbumResult> {
  if (!isUuid(eventId) || !isUuid(photoId)) return { ok: false, error: "No encontramos la foto." };
  const supabase = await createSessionClient();
  if (!supabase) return { ok: false, error: "Supabase no está configurado." };
  const { data } = await supabase
    .from("guest_photos")
    .select("path")
    .eq("id", photoId)
    .eq("event_id", eventId)
    .maybeSingle();
  if (!data) return { ok: false, error: "No encontramos la foto." };
  const removed = await supabase.storage.from("guest-photos").remove([data.path as string]);
  if (removed.error) return { ok: false, error: "No hemos podido borrar el archivo." };
  const { error } = await supabase.from("guest_photos").delete().eq("id", photoId);
  if (error) return { ok: false, error: "No hemos podido borrar la foto." };
  revalidatePath(`/panel/${eventId}/album`);
  return { ok: true };
}
