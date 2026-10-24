"use server";

import type { RsvpResponse } from "@/lib/domain/types";
import { rsvpResponseSchema } from "@/lib/rsvp/draft";
import { createAnonClient } from "@/lib/supabase/server";

/**
 * Guarda la respuesta de un invitado en la base de datos. Se valida aquí con Zod (frontera
 * de confianza) y la función submit_rsvp comprueba el token, la publicación y el plazo.
 */
export async function submitRsvp(token: string, response: RsvpResponse): Promise<RsvpResponse> {
  const parsed = rsvpResponseSchema.safeParse(response);
  if (!parsed.success || !/^[\w-]{10,64}$/.test(token)) {
    throw new Error("La respuesta no es válida. Revísala e inténtalo de nuevo.");
  }
  const supabase = createAnonClient();
  if (!supabase) throw new Error("El servicio no está disponible ahora mismo.");
  const { error } = await supabase.rpc("submit_rsvp", { p_token: token, p_payload: parsed.data });
  if (error) {
    throw new Error(
      error.message.includes("plazo")
        ? "El plazo para responder ha terminado."
        : "No hemos podido guardar tu respuesta. Comprueba tu conexión e inténtalo de nuevo.",
    );
  }
  return parsed.data;
}
