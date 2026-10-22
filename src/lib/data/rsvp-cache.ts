"use client";

import type { RsvpResponse } from "@/lib/domain/types";

/*
 * Caché compartida de la respuesta del invitado, sin validación: la portada solo necesita dejar
 * preparada la respuesta que trae el servidor, y así no carga Zod (lo carga rsvp-store después).
 */

// useSyncExternalStore necesita devolver el mismo objeto si nada cambió.
export const responseCache = new Map<string, RsvpResponse | null>();
const listeners = new Set<() => void>();

/** Suscripción para que la cabecera, el RSVP y el pase muestren siempre la misma respuesta. */
export function subscribeResponses(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export const notifyResponses = () => listeners.forEach((l) => l());

/** La respuesta que ya tiene el servidor manda sobre la del navegador. */
export function primeResponse(token: string, response: RsvpResponse | null) {
  responseCache.set(token, response);
}
