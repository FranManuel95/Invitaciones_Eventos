"use client";

import { useReducedMotion } from "motion/react";
import {
  type ReactNode,
  type Ref,
  type RefObject,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

/*
 * Dirección de cine común a las aperturas: una cámara que se acerca a un punto, acusa el golpe y
 * vuelve a abrir el plano; un foco que oscurece los bordes; la luz que sale del sobre al abrirlo;
 * un fogonazo de exposición y motas de polvo que se encienden al cruzar esa luz.
 *
 * La cámara mueve el elemento `stage` (escala y desplazamiento) con GSAP, que se descarga mientras
 * el invitado mira la portada. Si aún no ha llegado, las órdenes no hacen nada y la apertura sigue
 * con su coreografía de siempre. Con movimiento reducido no monta nada.
 */

type Gsap = typeof import("gsap").gsap;

export interface CinemaHandle {
  /** Los bordes se oscurecen y empiezan a verse las motas. */
  dim(duration?: number): void;
  /** La cámara se acerca a `target`, que no se mueve del sitio mientras el plano se cierra. */
  pushIn(target: Element | null, options: { scale: number; duration: number }): void;
  /** La cámara abre el plano hasta su encuadre final. */
  settle(options: { scale: number; y?: number; duration: number }): void;
  /** Sacudida corta de la cámara, como un golpe. */
  impact(strength?: number): void;
  /** Fogonazo de luz en toda la pantalla. */
  flash(strength?: number): void;
  /** Luz que sale de `target`; `at` es la altura dentro de él (0 arriba, 1 abajo). */
  glow(target: Element | null, options?: { at?: number; size?: number }): void;
  /** La luz, el polvo y el foco se apagan. */
  fade(duration?: number): void;
}

interface Mote {
  x: number;
  y: number;
  z: number;
  phase: number;
}

const MOTES = 44;

/** Una mota desenfocada, dibujada una sola vez. */
function moteSprite() {
  const sprite = document.createElement("canvas");
  sprite.width = sprite.height = 32;
  const ctx = sprite.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, "rgb(255 244 222 / 0.95)");
    gradient.addColorStop(0.35, "rgb(255 236 204 / 0.35)");
    gradient.addColorStop(1, "rgb(255 236 204 / 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
  }
  return sprite;
}

export function Cinema({
  ref,
  stage,
  children,
}: {
  ref: Ref<CinemaHandle>;
  /** Lo que encuadra la cámara: se escala y se desplaza. */
  stage: RefObject<HTMLElement | null>;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  const gsap = useRef<Gsap | null>(null);
  const vignette = useRef<HTMLDivElement>(null);
  const light = useRef<HTMLDivElement>(null);
  const rays = useRef<HTMLDivElement>(null);
  const flashLayer = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  // Nivel del polvo (0–1), nivel de la luz y dónde está, para encender las motas cercanas.
  const dust = useRef({ level: 0, light: 0, x: 0.5, y: 0.45, running: false });

  useEffect(() => {
    if (reduce) return;
    let cancelled = false;
    void import("gsap").then((mod) => {
      if (!cancelled) gsap.current = mod.gsap;
    });
    const state = dust.current;
    const nodes = [
      stage.current,
      vignette.current,
      light.current,
      rays.current,
      flashLayer.current,
    ];
    return () => {
      cancelled = true;
      state.running = false;
      gsap.current?.killTweensOf([...nodes.filter(Boolean), state]);
    };
  }, [stage, reduce]);

  /** Las motas flotan despacio hacia arriba; solo se dibujan mientras dura la apertura. */
  function startDust() {
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    const state = dust.current;
    if (!el || !ctx || state.running) return;
    state.running = true;
    const width = (el.width = el.offsetWidth);
    const height = (el.height = el.offsetHeight);
    const sprite = moteSprite();
    // Reparto fijo (no aleatorio): la apertura se ve igual cada vez.
    const motes: Mote[] = Array.from({ length: MOTES }, (_, i) => ({
      x: (i * 0.6180339887) % 1,
      y: (i * 0.3819660113 + 0.13) % 1,
      z: 0.3 + ((i * 0.7548776662) % 1) * 0.7,
      phase: i * 1.7,
    }));
    let last = performance.now();
    const frame = (now: number) => {
      if (!state.running) return;
      const dt = Math.min(now - last, 50) / 1000;
      last = now;
      ctx.clearRect(0, 0, width, height);
      if (state.level > 0.01) {
        ctx.globalCompositeOperation = "lighter";
        for (const mote of motes) {
          mote.y -= dt * 0.018 * mote.z;
          if (mote.y < -0.05) mote.y += 1.1;
          const x = mote.x + Math.sin(now / 2600 + mote.phase) * 0.018 * mote.z;
          // Cerca de la luz del sobre, la mota se enciende.
          const distance = Math.hypot(x - state.x, (mote.y - state.y) * (height / width));
          const lit = state.light * Math.max(0, 1 - distance / 0.55);
          const size = (5 + mote.z * 13) * (1 + lit * 0.5);
          ctx.globalAlpha = Math.min(1, state.level * mote.z * (0.16 + lit * 0.75));
          ctx.drawImage(sprite, x * width - size / 2, mote.y * height - size / 2, size, size);
        }
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  useImperativeHandle(ref, () => ({
    dim(duration = 2.2) {
      const g = gsap.current;
      if (!g) return;
      startDust();
      g.to(vignette.current, { opacity: 1, duration, ease: "sine.inOut" });
      g.to(dust.current, { level: 1, duration, ease: "sine.inOut" });
    },
    pushIn(target, { scale, duration }) {
      const g = gsap.current;
      const el = stage.current;
      if (!g || !el || !target) return;
      const frame = el.getBoundingClientRect();
      const point = target.getBoundingClientRect();
      // Al escalar desde el centro, el punto se alejaría de él: se compensa desplazando.
      const dx = point.left + point.width / 2 - (frame.left + frame.width / 2);
      const dy = point.top + point.height / 2 - (frame.top + frame.height / 2);
      g.to(el, {
        scale,
        x: -dx * (scale - 1),
        y: -dy * (scale - 1),
        duration,
        ease: "power2.out",
        overwrite: "auto",
      });
    },
    settle({ scale, y = 0, duration }) {
      const g = gsap.current;
      if (!g || !stage.current) return;
      g.to(stage.current, { scale, x: 0, y, duration, ease: "power2.inOut", overwrite: "auto" });
    },
    impact(strength = 1) {
      const g = gsap.current;
      if (!g || !stage.current) return;
      // En porcentaje y giro: no pisa el desplazamiento de la cámara.
      g.to(stage.current, {
        keyframes: {
          xPercent: [0, -0.7, 0.55, -0.3, 0.12, 0].map((v) => v * strength),
          yPercent: [0, 0.6, -0.4, 0.2, -0.08, 0].map((v) => v * strength),
          rotation: [0, -0.4, 0.28, -0.12, 0.05, 0].map((v) => v * strength),
        },
        duration: 0.46,
        ease: "none",
      });
    },
    flash(strength = 0.16) {
      const g = gsap.current;
      if (!g) return;
      g.fromTo(
        flashLayer.current,
        { opacity: strength },
        { opacity: 0, duration: 0.55, ease: "power2.out" },
      );
    },
    glow(target, { at = 0, size = 1.7 } = {}) {
      const g = gsap.current;
      const el = light.current;
      const parent = el?.parentElement;
      if (!g || !el || !parent || !target) return;
      const frame = parent.getBoundingClientRect();
      const box = target.getBoundingClientRect();
      const x = box.left + box.width / 2 - frame.left;
      const y = box.top + box.height * at - frame.top;
      const state = dust.current;
      state.x = x / frame.width;
      state.y = y / frame.height;
      g.set(el, { left: x, top: y, width: box.width * size, height: box.width * size });
      // Se enciende de golpe y se asienta en una luz suave que acompaña a la carta.
      g.timeline()
        .fromTo(
          el,
          { opacity: 0, scale: 0.35 },
          { opacity: 1, scale: 1, duration: 0.55, ease: "power2.out" },
        )
        .to(el, { opacity: 0.42, scale: 1.12, duration: 1.6, ease: "sine.inOut" });
      g.timeline()
        .fromTo(state, { light: 0 }, { light: 1, duration: 0.55, ease: "power2.out" })
        .to(state, { light: 0.6, duration: 1.6, ease: "sine.inOut" });
      g.fromTo(
        rays.current,
        { rotation: -8, opacity: 0 },
        { rotation: 10, opacity: 1, duration: 2.4, ease: "sine.out" },
      );
    },
    fade(duration = 0.8) {
      const g = gsap.current;
      if (!g) return;
      g.to([light.current, vignette.current], { opacity: 0, duration, ease: "sine.in" });
      g.to(dust.current, { level: 0, light: 0, duration, ease: "sine.in", overwrite: true });
    },
  }));

  // Con movimiento reducido no hay cámara ni luces: ni se descargan ni se montan.
  if (reduce) return children;

  return (
    <>
      {/* Foco: detrás de la escena, para que el sobre siga iluminado. */}
      <div
        ref={vignette}
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_48%,transparent_30%,rgb(24_17_10/0.62)_100%)] opacity-0"
      />
      {children}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
        <div
          ref={light}
          className="absolute -translate-x-1/2 -translate-y-1/2 opacity-0 mix-blend-screen"
        >
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(closest-side,rgb(255_240_208/0.85),rgb(255_226_170/0.32)_38%,transparent_72%)] [mask-image:linear-gradient(180deg,black_48%,rgb(0_0_0/0.3)_62%)]" />
          {/* Rayos: solo hacia arriba, por donde se abre el sobre. */}
          <div
            ref={rays}
            className="absolute inset-[-25%] [mask-image:linear-gradient(180deg,black_20%,transparent_52%)]"
          >
            <div className="absolute inset-0 bg-[repeating-conic-gradient(from_-40deg_at_50%_50%,transparent_0deg,rgb(255_238_200/0.26)_5deg,transparent_11deg_23deg)] [mask-image:radial-gradient(closest-side,black_10%,transparent_78%)] blur-[5px]" />
          </div>
        </div>
        <canvas ref={canvas} className="absolute inset-0 size-full" />
        <div ref={flashLayer} className="absolute inset-0 bg-[rgb(255_244_224)] opacity-0" />
      </div>
    </>
  );
}
