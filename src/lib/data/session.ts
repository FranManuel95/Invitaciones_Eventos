"use client";

/**
 * Recuerda en la sesión si el invitado ya abrió el sobre. Va aparte del almacén de respuestas
 * para que la portada no cargue Zod ni la lógica del RSVP.
 */
const seenKey = (token: string) => `invitacion:${token}:abierta`;

export function hasOpenedEnvelope(token: string) {
  try {
    return window.sessionStorage.getItem(seenKey(token)) === "1";
  } catch {
    return false;
  }
}

export function markEnvelopeOpened(token: string) {
  try {
    window.sessionStorage.setItem(seenKey(token), "1");
  } catch {
    // No es imprescindible recordar la apertura.
  }
}
