"use client";

import { useEffect, useSyncExternalStore } from "react";
import { visitBaseline } from "@/lib/guests/news";

/*
 * La última visita al panel, guardada en el navegador (sin cuentas ni correo). En localStorage va
 * la fecha de la última visita; en sessionStorage, desde cuándo se cuentan las novedades en esta
 * visita, para que no desaparezcan al cambiar de página. Si el navegador no deja guardar (modo
 * privado, almacenamiento bloqueado), no hay novedades y el panel funciona igual.
 */

const CHANGE = "efele:panel-visita";
const lastKey = (event: string) => `efele:panel:ultima-visita:${event}`;
const sinceKey = (event: string) => `efele:panel:novedades-desde:${event}`;

function read(store: () => Storage, key: string): string | null {
  try {
    return store().getItem(key);
  } catch {
    return null;
  }
}

function write(store: () => Storage, key: string, value: string) {
  try {
    store().setItem(key, value);
  } catch {
    // Sin almacenamiento: no se recuerda la visita.
  }
}

const local = () => window.localStorage;
const session = () => window.sessionStorage;

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export interface VisitClock {
  /** «Ahora» (en la demo, su fecha ficticia); sin él, la hora del navegador. */
  now?: string;
  /** Desde cuándo contar la primera vez; sin él, la primera visita no tiene novedades. */
  firstVisit?: string;
}

/**
 * Empieza la visita (una vez por sesión del navegador): fija desde cuándo hay novedades y
 * guarda «ahora» como última visita para la próxima vez.
 */
function startVisit(event: string, clock: VisitClock) {
  if (read(session, sinceKey(event))) return;
  const since = visitBaseline(null, read(local, lastKey(event)), clock.firstVisit ?? null);
  const now = clock.now ?? new Date().toISOString();
  // Sin fecha anterior, la visita empieza ahora: nada es nuevo.
  write(session, sinceKey(event), since ?? now);
  write(local, lastKey(event), now);
  window.dispatchEvent(new Event(CHANGE));
}

/** Desde cuándo hay novedades en esta visita (null hasta que se monta en el navegador). */
export function useNewsSince(event: string, clock: VisitClock = {}): string | null {
  const { now, firstVisit } = clock;
  useEffect(() => {
    startVisit(event, { now, firstVisit });
  }, [event, now, firstVisit]);
  return useSyncExternalStore(
    subscribe,
    () => read(session, sinceKey(event)),
    () => null,
  );
}

/** «Marcar como visto»: lo de hasta ahora deja de ser nuevo. */
export function markNewsSeen(event: string, clock: VisitClock = {}) {
  const now = clock.now ?? new Date().toISOString();
  write(session, sinceKey(event), now);
  write(local, lastKey(event), now);
  window.dispatchEvent(new Event(CHANGE));
}
