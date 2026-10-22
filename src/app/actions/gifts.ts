"use server";

import { parseGiftStatus, type GiftStatus } from "@/lib/gifts";
import { createAnonClient } from "@/lib/supabase/server";

export type GiftClaimResult = { ok: true; status: GiftStatus } | { ok: false; error: string };

/**
 * Reserva un regalo de la lista (o deshace la reserva) con el token de la invitación. La función
 * gift_claim comprueba el token, la publicación, que el regalo exista y que siga libre.
 */
export async function claimGift(
  token: string,
  itemId: string,
  claim: boolean,
): Promise<GiftClaimResult> {
  if (!/^[\w-]{10,64}$/.test(token) || !/^[\w-]{1,40}$/.test(itemId)) {
    return { ok: false, error: "No encontramos ese regalo." };
  }
  const supabase = createAnonClient();
  if (!supabase) return { ok: false, error: "El servicio no está disponible ahora mismo." };
  const { data, error } = await supabase.rpc("gift_claim", {
    p_token: token,
    p_item: itemId,
    p_claim: claim === true,
  });
  if (error) {
    const known = [
      "Ese regalo ya lo ha reservado otra persona",
      "Ese regalo ya no está en la lista",
      "La lista de regalos aún no está abierta",
    ].find((m) => error.message.includes(m));
    if (known) return { ok: false, error: `${known}.` };
    if (error.message.includes("Demasiadas")) {
      return { ok: false, error: "Ya tenéis diez regalos reservados." };
    }
    return { ok: false, error: "No hemos podido guardarlo. Comprueba tu conexión." };
  }
  return { ok: true, status: parseGiftStatus(data) };
}
