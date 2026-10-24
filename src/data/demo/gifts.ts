import type { GiftClaim, GiftStatus } from "@/lib/gifts";

/** Reservas ficticias de la lista de regalos de la demo (las ven el panel y las invitaciones). */
export const demoGiftClaims: GiftClaim[] = [
  { itemId: "viaje", groupName: "Familia García", createdAt: "2027-02-03T10:12:00Z" },
  { itemId: "viaje", groupName: "Carlos", createdAt: "2027-02-11T19:40:00Z" },
  { itemId: "olivo", groupName: "Elena y Pablo", createdAt: "2027-02-14T09:05:00Z" },
];

/** Lo que ve una invitación de la demo: las reservas de otros, ninguna suya todavía. */
export function demoGiftStatus(): GiftStatus {
  const counts: Record<string, number> = {};
  for (const c of demoGiftClaims) counts[c.itemId] = (counts[c.itemId] ?? 0) + 1;
  return { counts, mine: [] };
}
