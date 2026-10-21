"use client";

import { useRef, type PointerEvent } from "react";

/**
 * Detecta un deslizamiento vertical hacia arriba con eventos de puntero nativos.
 * Sustituye al gesto `pan` de Motion, que obligaría a cargar su paquete completo (domMax).
 * Siempre hay un botón equivalente: el gesto es un atajo, no la única forma de avanzar.
 */
export function useSwipeUp(onSwipe: () => void, threshold = 60) {
  const start = useRef<{ y: number; t: number } | null>(null);

  return {
    onPointerDown: (e: PointerEvent) => {
      start.current = { y: e.clientY, t: e.timeStamp };
    },
    onPointerUp: (e: PointerEvent) => {
      const from = start.current;
      start.current = null;
      if (!from) return;
      const dy = e.clientY - from.y;
      const velocity = dy / Math.max(1, e.timeStamp - from.t);
      if (dy < -threshold || velocity < -0.6) onSwipe();
    },
    onPointerCancel: () => {
      start.current = null;
    },
  };
}
