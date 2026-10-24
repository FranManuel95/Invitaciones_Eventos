import { z } from "zod";
import type { GiftItem } from "./domain/types";

/*
 * Lista de regalos. Los regalos van en el contenido del evento (gift.items); las reservas, en la
 * tabla gift_claims. El invitado solo sabe cuántas reservas tiene cada regalo y cuáles son suyas.
 */

/** Estado de la lista para una invitación: reservas vigentes por regalo y las de esa invitación. */
export interface GiftStatus {
  counts: Record<string, number>;
  mine: string[];
}

export const EMPTY_GIFT_STATUS: GiftStatus = { counts: {}, mine: [] };

export const giftStatusSchema = z.object({
  counts: z.record(z.string(), z.number().int().min(0)),
  mine: z.array(z.string()),
});

/** Lee el estado que devuelve la base de datos; si no cuadra, lista sin reservas. */
export function parseGiftStatus(raw: unknown): GiftStatus {
  const parsed = giftStatusSchema.safeParse(raw);
  return parsed.success ? parsed.data : EMPTY_GIFT_STATUS;
}

/** Libre, reservado por esta invitación o reservado por otra (solo los no compartidos). */
export type GiftState = "free" | "mine" | "taken";

export function giftState(item: GiftItem, status: GiftStatus): GiftState {
  if (status.mine.includes(item.id)) return "mine";
  if (!item.shared && (status.counts[item.id] ?? 0) > 0) return "taken";
  return "free";
}

/** Cuántas invitaciones, aparte de esta, se han apuntado a un regalo compartido. */
export function othersOnShared(item: GiftItem, status: GiftStatus) {
  const total = status.counts[item.id] ?? 0;
  return Math.max(0, total - (status.mine.includes(item.id) ? 1 : 0));
}

/** Aplica una reserva o su anulación en local (demo y respuesta optimista). */
export function applyClaim(status: GiftStatus, id: string, claim: boolean): GiftStatus {
  const had = status.mine.includes(id);
  if (claim === had) return status;
  const count = (status.counts[id] ?? 0) + (claim ? 1 : -1);
  return {
    counts: { ...status.counts, [id]: Math.max(0, count) },
    mine: claim ? [...status.mine, id] : status.mine.filter((m) => m !== id),
  };
}

/** Reserva vigente vista desde el panel: qué invitación ha reservado qué regalo. */
export interface GiftClaim {
  itemId: string;
  groupName: string;
  createdAt: string;
}

export interface GiftRow {
  item: GiftItem;
  claims: GiftClaim[];
}

/**
 * Resumen del panel: cada regalo con sus reservas (las más antiguas primero) y los totales.
 * Las reservas de regalos que ya no están en la lista se cuentan aparte.
 */
export function summarizeGifts(items: GiftItem[], claims: GiftClaim[]) {
  const byItem = new Map<string, GiftClaim[]>();
  for (const c of [...claims].sort((a, b) => a.createdAt.localeCompare(b.createdAt))) {
    byItem.set(c.itemId, [...(byItem.get(c.itemId) ?? []), c]);
  }
  const rows: GiftRow[] = items.map((item) => ({ item, claims: byItem.get(item.id) ?? [] }));
  const ids = new Set(items.map((i) => i.id));
  return {
    rows,
    reserved: rows.filter((r) => r.claims.length > 0).length,
    free: rows.filter((r) => r.claims.length === 0).length,
    orphaned: claims.filter((c) => !ids.has(c.itemId)),
  };
}
