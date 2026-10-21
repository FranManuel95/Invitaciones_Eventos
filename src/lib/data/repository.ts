import { demoEvent } from "@/data/demo/event";
import { demoGroups, demoResponses, showcaseGroups } from "@/data/demo/guests";
import type { GuestGroup, RsvpResponse, WeddingEvent } from "@/lib/domain/types";

/**
 * Punto único de acceso a datos. Hoy devuelve datos ficticios en memoria;
 * en una fase posterior estas funciones consultarán la base de datos (p. ej. Supabase)
 * sin que cambien los componentes que las usan.
 */

export interface Invitation {
  event: WeddingEvent;
  group: GuestGroup;
}

export async function getEvent(): Promise<WeddingEvent> {
  return demoEvent;
}

export async function getInvitation(token: string): Promise<Invitation | null> {
  const group = demoGroups.find((g) => g.token === token);
  return group ? { event: demoEvent, group } : null;
}

/** Tokens que se generan estáticamente: las invitaciones de ejemplo. */
export async function listShowcaseInvitations(): Promise<GuestGroup[]> {
  return showcaseGroups;
}

export async function listAllTokens(): Promise<string[]> {
  return demoGroups.map((g) => g.token);
}

export interface OrganizerData {
  event: WeddingEvent;
  groups: GuestGroup[];
  responses: RsvpResponse[];
}

export async function getOrganizerData(): Promise<OrganizerData> {
  return { event: demoEvent, groups: demoGroups, responses: demoResponses };
}
