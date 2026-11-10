"use client";

import { useEffect, useRef } from "react";

/**
 * Avance del desplazamiento por un elemento, escrito en su variable CSS `--p` (0 a 1): los estilos
 * mueven lo que haga falta a partir de ella, así que no hay renders de React mientras se baja.
 *
 * - `pin`: el elemento es más alto que la pantalla y lleva dentro una escena fija; `--p` recorre
 *   el tramo en que la escena está fijada.
 * - `leave`: `--p` va de 0 (el elemento arriba del todo) a 1 (ha salido por arriba).
 *
 * Con `enabled` en falso no hace nada (movimiento reducido): `--p` se queda sin definir y los
 * estilos usan su valor de reposo.
 */
export function useScrollProgress<T extends HTMLElement>(mode: "pin" | "leave", enabled = true) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    let frame = 0;
    let last = "";
    const update = () => {
      frame = 0;
      const box = el.getBoundingClientRect();
      const travel = mode === "pin" ? box.height - window.innerHeight : box.height;
      const p = travel > 0 ? Math.min(1, Math.max(0, -box.top / travel)) : 0;
      const value = p.toFixed(4);
      if (value !== last) el.style.setProperty("--p", (last = value));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      el.style.removeProperty("--p");
    };
  }, [mode, enabled]);
  return ref;
}
