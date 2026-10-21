"use client";

import type { GuestGroup, RsvpResponse } from "@/lib/domain/types";
import { submitRsvp } from "@/app/actions/rsvp";
import { rsvpResponseSchema } from "@/lib/rsvp/draft";

/**
 * Respuesta del invitado, compartida por la cabecera, el RSVP y el pase.
 * - Invitaciones reales (group.persisted): se envía al servidor (submitRsvp) y se recuerda
 *   también en el navegador.
 * - Demostración: solo en el navegador (localStorage), con latencia simulada y, para la
 *   invitación "prueba-error", un primer fallo.
 */

const keyFor = (token: string) => `invitacion:${token}:rsvp`;
const failedOnce = new Set<string>();
// Caché en memoria: useSyncExternalStore necesita devolver el mismo objeto si nada cambió.
const cache = new Map<string, RsvpResponse | null>();
const listeners = new Set<() => void>();

/** Suscripción para que la cabecera, el RSVP y el pase muestren siempre la misma respuesta. */
export function subscribeResponses(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** La respuesta que ya tiene el servidor manda sobre la del navegador. */
export function primeResponse(token: string, response: RsvpResponse | null) {
  cache.set(token, response);
}

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
  listeners.forEach((l) => l());
}

export function clearResponse(token: string) {
  try {
    window.localStorage.removeItem(keyFor(token));
  } catch {
    // Nada que limpiar.
  }
  cache.set(token, null);
  listeners.forEach((l) => l());
}
