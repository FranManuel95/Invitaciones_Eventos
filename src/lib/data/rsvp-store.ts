"use client";

import type { GuestGroup, RsvpResponse } from "@/lib/domain/types";
import { rsvpResponseSchema } from "@/lib/rsvp/draft";

/**
 * Persistencia de demostración: guarda la respuesta en el navegador (localStorage).
 * Simula latencia de red y, para la invitación "prueba-error", un primer fallo.
 * Sustituir por una llamada al servidor cuando exista backend.
 */

const keyFor = (token: string) => `invitacion:${token}:rsvp`;
const failedOnce = new Set<string>();

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
  await new Promise((resolve) => setTimeout(resolve, 900));
  if (group.demo?.failFirstSave && !failedOnce.has(token)) {
    failedOnce.add(token);
    throw new Error(
      "No hemos podido guardar tu respuesta. Comprueba tu conexión e inténtalo de nuevo.",
    );
  }
  const valid = rsvpResponseSchema.parse(response);
  try {
    window.localStorage.setItem(keyFor(token), JSON.stringify(valid));
  } catch {
    // Sin almacenamiento (modo privado): la confirmación se muestra igualmente en esta sesión.
  }
  return valid;
}

export function clearResponse(token: string) {
  try {
    window.localStorage.removeItem(keyFor(token));
  } catch {
    // Nada que limpiar.
  }
}
