"use client";

import type { GuestGroup, RsvpResponse } from "@/lib/domain/types";
import { submitRsvp } from "@/app/actions/rsvp";
import { rsvpResponseSchema } from "@/lib/rsvp/draft";
import { notifyResponses, responseCache as cache } from "./rsvp-cache";

export { primeResponse, subscribeResponses } from "./rsvp-cache";

/**
 * Respuesta del invitado, compartida por la cabecera, el RSVP y el pase.
 * - Invitaciones reales (group.persisted): se envía al servidor (submitRsvp) y se recuerda
 *   también en el navegador.
 * - Demostración: solo en el navegador (localStorage), con latencia simulada y, para la
 *   invitación "prueba-error", un primer fallo.
 */

const keyFor = (token: string) => `invitacion:${token}:rsvp`;
const failedOnce = new Set<string>();
export function getSavedResponse(token: string): RsvpResponse | null {
  if (!cache.has(token)) cache.set(token, loadResponse(token));
  return cache.get(token) ?? null;
}

export function loadResponse(token: string): RsvpResponse | null {
  try {
    const raw = window.localStorage.getItem(keyFor(token));
    if (!raw) return null;
    const parsed = rsvpResponseSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export async function saveResponse(
  token: string,
  group: GuestGroup,
  response: RsvpResponse,
): Promise<RsvpResponse> {
  if (group.persisted) {
    const saved = await submitRsvp(token, rsvpResponseSchema.parse(response));
    remember(token, saved);
    return saved;
  }
  await new Promise((resolve) => setTimeout(resolve, 900));
  if (group.demo?.failFirstSave && !failedOnce.has(token)) {
    failedOnce.add(token);
    throw new Error(
      "No hemos podido guardar tu respuesta. Comprueba tu conexión e inténtalo de nuevo.",
    );
  }
  const valid = rsvpResponseSchema.parse(response);
  remember(token, valid);
  return valid;
}

function remember(token: string, response: RsvpResponse) {
  try {
    window.localStorage.setItem(keyFor(token), JSON.stringify(response));
  } catch {
    // Sin almacenamiento (modo privado): la confirmación se muestra igualmente en esta sesión.
  }
  cache.set(token, response);
  notifyResponses();
}

export function clearResponse(token: string) {
  try {
    window.localStorage.removeItem(keyFor(token));
  } catch {
    // Nada que limpiar.
  }
  cache.set(token, null);
  notifyResponses();
}
