"use server";

import { createAnonClient } from "@/lib/supabase/server";

/**
 * Apunta que el invitado ha abierto su invitación. Lo llama su navegador (no el servidor al
 * pintar la página), para que las vistas previas de WhatsApp no cuenten. Si falla, no pasa nada.
 */
export async function markOpened(token: string): Promise<void> {
  if (!/^[\w-]{10,64}$/.test(token)) return;
  const supabase = createAnonClient();
  if (!supabase) return;
  await supabase.rpc("mark_invitation_opened", { p_token: token });
}
