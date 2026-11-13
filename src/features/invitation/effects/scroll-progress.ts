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
 * Con `steps` y `onStep` avisa al cambiar de paso (para un toque de vibración o de sonido).
 *
 * Con `enabled` en falso no hace nada (movimiento reducido): `--p` se queda sin definir y los
 * estilos usan su valor de reposo.
 */
export function useScrollProgress<T extends HTMLElement>(
  mode: "pin" | "leave",
  enabled = true,
  /** Número de pasos de la escena: al pasar de uno a otro se llama a `onStep`. */
  steps = 0,
  onStep?: (step: number, first: boolean) => void,
) {
  const ref = useRef<T>(null);
  const stepRef = useRef(onStep);
  useEffect(() => {
    stepRef.current = onStep;
  });
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    let frame = 0;
    let last = "";
    let step = -1;
    const update = () => {
      frame = 0;
      const box = el.getBoundingClientRect();
      const travel = mode === "pin" ? box.height - window.innerHeight : box.height;
      const p = travel > 0 ? Math.min(1, Math.max(0, -box.top / travel)) : 0;
      const value = p.toFixed(4);
      if (value !== last) el.style.setProperty("--p", (last = value));
      if (steps > 1) {
        const now = Math.round(p * (steps - 1));
        // El primer aviso solo dice dónde estaba la página al cargar (`first`).
        if (now !== step) stepRef.current?.(now, step === -1);
        step = now;
      }
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
  }, [mode, enabled, steps]);
  return ref;
}

const VIEW_TARGETS = "[data-view], .reveal-photo, .reveal-title, .parallax-slow";

/**
 * Para todo lo que se descubre al llegar a ello dentro de `root` (fotos, titulares, tarjetas…):
 * escribe en cada elemento `--v`, cuánto ha entrado (0 al asomar por abajo, 1 al llegar a media
 * pantalla), y `--c`, por dónde va de su paso por la pantalla (0 al asomar, 1 al salir por
 * arriba). Un solo escuchador para todos; los estilos hacen el resto.
 */
export function useViewProgress<T extends HTMLElement>(enabled = true) {
  const root = useRef<T>(null);
  useEffect(() => {
    const el = root.current;
    if (!el || !enabled) return;
    let targets = [...el.querySelectorAll<HTMLElement>(VIEW_TARGETS)];
    let frame = 0;
    const update = () => {
      frame = 0;
      const height = window.innerHeight;
      for (const target of targets) {
        const box = target.getBoundingClientRect();
        // Lejos de la pantalla no hay nada que mover.
        if (box.bottom < -height || box.top > height * 2) continue;
        const v = Math.min(1, Math.max(0, (height * 0.96 - box.top) / (height * 0.42)));
        const c = Math.min(1, Math.max(0, (height - box.top) / (height + box.height)));
        target.style.setProperty("--v", v.toFixed(3));
        target.style.setProperty("--c", c.toFixed(3));
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    // Las secciones cambian (se confirma, se reserva un regalo): se vuelve a buscar.
    const observer = new MutationObserver(() => {
      targets = [...el.querySelectorAll<HTMLElement>(VIEW_TARGETS)];
      schedule();
    });
    observer.observe(el, { childList: true, subtree: true });
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      for (const target of targets) {
        target.style.removeProperty("--v");
        target.style.removeProperty("--c");
      }
    };
  }, [enabled]);
  return root;
}
