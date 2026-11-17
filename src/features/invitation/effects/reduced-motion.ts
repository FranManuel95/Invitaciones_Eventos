"use client";

import { useReducedMotion } from "motion/react";
import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/** false en el servidor y al hidratar; true en cuanto la página ya es del cliente. */
export function useHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/**
 * Movimiento reducido para decidir qué se pinta. El servidor no lo sabe y pinta la versión con
 * movimiento; si el primer render del cliente quitara o pusiera elementos, React no podría
 * hidratar y montaría la página entera de nuevo. Por eso vale false hasta terminar de hidratar
 * y, justo después, lo que pida el sistema.
 *
 * Para lo que no cambia el HTML (`initial`, efectos) basta `useReducedMotion`, que ya acierta en
 * el primer render.
 */
export function useReducedMotionForMarkup() {
  const reduce = useReducedMotion();
  return useHydrated() && Boolean(reduce);
}
