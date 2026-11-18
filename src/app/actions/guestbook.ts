"use server";

import { revalidatePath } from "next/cache";
import {
  cleanMessage,
  GUESTBOOK_MAX_LENGTH,
  parseGuestbook,
  type GuestbookState,
} from "@/lib/guestbook";
import { createAnonClient, createSessionClient } from "@/lib/supabase/server";

export type GuestbookSignResult =
  { ok: true; state: GuestbookState } | { ok: false; error: string };

/**
 * Firma el libro con el token de la invitación. La función guestbook_sign comprueba el token, la
 * publicación, que la pareja haya activado el libro y el tope de mensajes por invitación.
 */
export async function signGuestbook(token: string, text: string): Promise<GuestbookSignResult> {
  const body = typeof text === "string" ? cleanMessage(text) : "";
  if (!/^[\w-]{10,64}$/.test(token) || !body || body.length > GUESTBOOK_MAX_LENGTH) {
    return { ok: false, error: "No hemos podido guardar el mensaje." };
  }
  const supabase = createAnonClient();
  if (!supabase) return { ok: false, error: "El servicio no está disponible ahora mismo." };
  const { data, error } = await supabase.rpc("guestbook_sign", { p_token: token, p_body: body });
  if (error) {
    if (error.message.includes("Demasiados")) {
      return { ok: false, error: "Ya habéis dejado todos vuestros mensajes." };
    }
    if (error.message.includes("no está abierto")) {
      return { ok: false, error: "El libro de firmas no está abierto." };
    }
    return { ok: false, error: "No hemos podido guardarlo. Comprueba tu conexión." };
  }
  return { ok: true, state: parseGuestbook(data) };
}

export type GuestbookModerationResult = { ok: true } | { ok: false; error: string };

const isUuid = (v: unknown): v is string => typeof v === "string" && /^[0-9a-f-]{36}$/.test(v);

/** La pareja oculta un mensaje o lo vuelve a mostrar (RLS: solo miembros del evento). */
export async function setMessageHidden(
  eventId: string,
  messageId: string,
  hidden: boolean,
): Promise<GuestbookModerationResult> {
  if (!isUuid(eventId) || !isUuid(messageId)) {
    return { ok: false, error: "No encontramos el mensaje." };
  }
  const supabase = await createSessionClient();
  if (!supabase) return { ok: false, error: "Supabase no está configurado." };
  const { error } = await supabase
    .from("guestbook_messages")
    .update({ hidden_at: hidden === true ? new Date().toISOString() : null })
    .eq("id", messageId)
    .eq("event_id", eventId);
  if (error) return { ok: false, error: "No hemos podido guardar el cambio." };
  revalidatePath(`/panel/${eventId}/mensajes`);
  return { ok: true };
}
