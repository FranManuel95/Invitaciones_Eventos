"use client";

import { animate } from "motion/react";
import { useRef, useState, type PointerEvent } from "react";
import type { WeddingEvent } from "@/lib/domain/types";
import { hostNames, hostsOf } from "@/lib/event-kind";
import { formatLongDate, isoDay } from "@/lib/format";
import { haptic, playNotes, playPaper } from "../effects/sound";
import { After, FRAUNCES, OpenHint, PLAYFAIR, SANS, type ConceptProps } from "./concept-kit";

/*
 * Portadas de concepto de la vigesimoquinta tanda (ronda 38): una noria de feria que gira hasta
 * dejar arriba vuestra cabina, un sombrero de mago con conejo y un postre que se flambea.
 */

const names = (event: WeddingEvent, joiner = " y ") => hostNames(hostsOf(event), joiner);
const stop = (e: PointerEvent) => e.stopPropagation();

/* ─────────────── Noria: gira hasta que vuestra cabina queda arriba ─────────────── */

const CABINS = 8;
const BULBS = 32;

/** Ángulo (en grados) del puntero alrededor del centro de la rueda. */
function pointerAngle(e: PointerEvent, el: Element) {
  const r = el.getBoundingClientRect();
  return (
    (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) /
    Math.PI
  );
}

function FerrisWheelCover({ event, onOpen, reduce }: ConceptProps) {
  // `rot` es lo que ha girado la rueda: vuestra cabina empieza abajo (180°) y sube a 0°.
  const [rot, setRot] = useState(0);
  const [top, setTop] = useState(false);
  const [busy, setBusy] = useState(false);
  const drag = useRef<{ a: number; start: number; moved: number } | null>(null);
  const done = () => {
    setTop(true);
    setBusy(false);
    haptic([10, 30, 10]);
    playNotes([523, 659, 784, 1046], "triangle", 0.16);
  };
  /** Lleva la rueda hasta `to` grados y, al llegar, la cabina queda arriba. */
  const settle = (from: number, to: number, duration: number) => {
    setBusy(true);
    if (reduce) {
      setRot(to);
      done();
      return;
    }
    animate(from, to, { duration, ease: "easeInOut", onUpdate: setRot, onComplete: done });
  };
  const spin = () => {
    if (busy || top) return;
    playNotes([523, 659, 784, 659, 523], "triangle", 0.18);
    settle(rot, rot + 540 - (((rot % 360) + 360) % 360), 2.6);
  };
  // Lo que le falta a vuestra cabina para estar arriba, entre -180° y 180°.
  const offTop = ((((180 + rot) % 360) + 540) % 360) - 180;
  const lit = top ? BULBS : Math.round((1 - Math.abs(offTop) / 180) * BULBS);
  const colors = ["#e4572e", "#ffc93c", "#4cc9f0", "#7bd389"];

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,#22183f,#5a3266_55%,#e48f73)]"
      />
      {/* Estrellas y una guirnalda de bombillas de feria cruzando el cielo. */}
      <svg aria-hidden viewBox="0 0 390 300" className="absolute inset-x-0 top-0 w-full">
        {[
          [30, 40],
          [80, 120],
          [140, 30],
          [250, 50],
          [330, 110],
          [360, 30],
          [200, 140],
          [60, 200],
          [345, 210],
        ].map(([x, y], k) => (
          <circle key={k} cx={x} cy={y} r={k % 3 ? 1 : 1.6} fill="#fff4ea" opacity={0.7} />
        ))}
      </svg>
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#fff4ea]">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">En lo más alto</p>
        <h1
          id="cover-title"
          tabIndex={-1}
          translate="no"
          className="mt-1 text-[clamp(2.1rem,9.4vw,2.8rem)] leading-[1.02] italic outline-none"
          style={{ fontFamily: PLAYFAIR }}
        >
          {names(event)}
        </h1>
        <div
          data-noria={top ? "arriba" : busy || rot !== 0 ? "girando" : "parada"}
          onPointerDown={(e) => {
            stop(e);
            if (busy || top) return;
            drag.current = { a: pointerAngle(e, e.currentTarget), start: rot, moved: 0 };
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            const d = drag.current;
            if (!d) return;
            e.stopPropagation();
            const a = pointerAngle(e, e.currentTarget);
            let delta = a - d.a;
            if (delta > 180) delta -= 360;
            if (delta < -180) delta += 360;
            d.a = a;
            d.moved += Math.abs(delta);
            setRot((r) => r + delta);
          }}
          onPointerUp={() => {
            const d = drag.current;
            drag.current = null;
            if (!d) return;
            // Un toque sin arrastrar hace girar la noria sola.
            if (d.moved < 6) return spin();
            // Si vuestra cabina ha quedado cerca de arriba, la rueda se asienta allí.
            if (Math.abs(offTop) < 25) settle(rot, rot - offTop, 0.5);
          }}
          className="relative mt-8 size-64 cursor-grab touch-none active:cursor-grabbing"
        >
          {/* Las patas, detrás de la rueda, para que no tapen ninguna cabina. */}
          <svg
            viewBox="0 0 200 200"
            aria-hidden
            className="absolute inset-0 size-full overflow-visible"
          >
            <path
              d="M100 100 52 232M100 100l48 132M70 182h60"
              stroke="#c9a6c9"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </svg>
          {/* La rueda gira; cada cabina se contrarresta para quedar siempre derecha. */}
          <div className="absolute inset-0" style={{ transform: `rotate(${rot}deg)` }}>
            <svg viewBox="0 0 200 200" aria-hidden className="absolute inset-0 size-full">
              <circle cx="100" cy="100" r="86" fill="none" stroke="#fff4ea" strokeWidth="3" />
              <circle cx="100" cy="100" r="80" fill="none" stroke="#fff4ea" strokeWidth="1" />
              {Array.from({ length: CABINS }, (_, k) => (
                <g key={k} transform={`rotate(${(k * 360) / CABINS} 100 100)`}>
                  <path d="M97 100 98.5 14M103 100l-1.5-86" stroke="#fff4ea" strokeWidth="1" />
                  <path d="M98 70h4M98.5 42h3" stroke="#fff4ea" strokeWidth="1" />
                </g>
              ))}
              {Array.from({ length: BULBS }, (_, k) => {
                const a = (k * 2 * Math.PI) / BULBS;
                return (
                  <circle
                    key={k}
                    cx={100 + 86 * Math.sin(a)}
                    cy={100 - 86 * Math.cos(a)}
                    r="2.2"
                    fill={k < lit ? "#ffe08a" : "#7a5a7e"}
                  />
                );
              })}
              <circle cx="100" cy="100" r="10" fill="#ffc93c" stroke="#fff4ea" strokeWidth="2" />
            </svg>
            {Array.from({ length: CABINS }, (_, k) => {
              const angle = 180 + (k * 360) / CABINS;
              const ours = k === 0;
              return (
                <span
                  key={k}
                  className="absolute top-1/2 left-1/2 block"
                  style={{
                    transform: `rotate(${angle}deg) translateY(-110px) rotate(${-angle - rot}deg)`,
                  }}
                >
                  {/* La cabina cuelga de su eje: un gancho, el techo y la cesta. */}
                  <svg
                    viewBox="0 0 40 36"
                    aria-hidden
                    className="-mt-1 -ml-[1.125rem] block w-9 overflow-visible"
                  >
                    <path d="M20 0v6" stroke="#fff4ea" strokeWidth="2" />
                    <path
                      d="M6 10q14-8 28 0z"
                      fill={ours ? "#ff5d8f" : colors[k % colors.length]}
                      stroke="#fff4ea"
                      strokeWidth="1.5"
                    />
                    <path d="M9 10v8M31 10v8" stroke="#fff4ea" strokeWidth="1.5" />
                    <path
                      d="M5 18h30v6q0 8-8 8H13q-8 0-8-8z"
                      fill={ours ? "#ff5d8f" : colors[k % colors.length]}
                      stroke="#fff4ea"
                      strokeWidth="1.5"
                    />
                    {ours ? (
                      <path
                        d="M20 29c-4-3-6-5-6-7a3 3 0 0 1 6-1 3 3 0 0 1 6 1c0 2-2 4-6 7z"
                        fill="#fff4ea"
                      />
                    ) : null}
                  </svg>
                  {ours && top ? (
                    <span className="absolute -top-2 left-1/2 block size-16 -translate-x-1/2 -translate-y-1/3 rounded-full bg-[radial-gradient(circle,rgb(255_93_143/0.5),transparent_70%)]" />
                  ) : null}
                </span>
              );
            })}
          </div>
        </div>
        <After reduce={reduce} className="mt-12 text-[0.9375rem]">
          {top
            ? "Nuestra cabina, la rosa, ya está arriba. Desde aquí se ve el"
            : "Gira la rueda con el dedo hasta subir la cabina rosa."}
          <span className="block text-[1.0625rem] font-semibold">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>, en {event.city}
          </span>
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={spin}
            disabled={busy || top}
            className="mt-3 rounded-full bg-[#ff5d8f] px-6 py-2.5 text-[0.9375rem] font-medium text-[#2a0a18] disabled:opacity-70"
          >
            {top ? "¡Arriba!" : busy ? "Girando…" : "Girar la noria"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Sombrero de mago: un toque de varita y sale el conejo ─────────────── */

function MagicHatCover({ event, onOpen, reduce }: ConceptProps) {
  const [done, setDone] = useState(false);
  const tap = () => {
    if (done) return;
    setDone(true);
    haptic([8, 20, 40]);
    playNotes([1318, 1568, 2093], "sine", 0.08);
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#5a1a2e,#1e0a14_75%)]"
      />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#fbefe4]">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Y para el último truco…</p>
        <h1
          id="cover-title"
          tabIndex={-1}
          translate="no"
          className="mt-1 text-[clamp(2.1rem,9.4vw,2.8rem)] leading-[1.02] outline-none"
          style={{ fontFamily: FRAUNCES }}
        >
          {names(event)}
        </h1>
        <div
          data-mago={done ? "conejo" : "sombrero"}
          onPointerDown={(e) => {
            stop(e);
            tap();
          }}
          className="relative mt-6 h-72 w-full cursor-pointer"
        >
          {/* El conejo sube del sombrero con un cartel en las patas. */}
          <div
            className="absolute left-1/2 flex -translate-x-1/2 flex-col items-center transition-[bottom] duration-700"
            style={{
              bottom: done ? "46%" : "8%",
              visibility: done ? "visible" : "hidden",
              transitionDuration: reduce ? "0ms" : undefined,
            }}
          >
            <svg viewBox="0 0 60 70" aria-hidden className="w-16">
              <ellipse cx="22" cy="18" rx="6" ry="18" fill="#fbf7f2" />
              <ellipse cx="38" cy="18" rx="6" ry="18" fill="#fbf7f2" />
              <ellipse cx="22" cy="18" rx="2.5" ry="12" fill="#f2b8c6" />
              <ellipse cx="38" cy="18" rx="2.5" ry="12" fill="#f2b8c6" />
              <circle cx="30" cy="46" r="18" fill="#fbf7f2" />
              <circle cx="24" cy="44" r="2" fill="#1e0a14" />
              <circle cx="36" cy="44" r="2" fill="#1e0a14" />
              <circle cx="30" cy="50" r="2.4" fill="#f2b8c6" />
            </svg>
            <span className="-mt-1 rounded-[3px] bg-[#fbf7f2] px-2 py-0.5 text-[0.75rem] font-semibold text-[#1e0a14]">
              ¡Sí, quiero!
            </span>
          </div>
          {/* El sombrero de copa, por delante del conejo. */}
          <svg
            viewBox="0 0 120 90"
            aria-hidden
            className="absolute bottom-0 left-1/2 w-44 -translate-x-1/2"
          >
            <ellipse cx="60" cy="16" rx="56" ry="12" fill="#111" />
            <path d="M22 16h76v66c0 4-17 8-38 8s-38-4-38-8z" fill="#1a1a1a" />
            <rect x="22" y="58" width="76" height="10" fill="#8a1f3a" />
            <ellipse cx="60" cy="16" rx="38" ry="7" fill="#000" />
          </svg>
          {/* La varita, que se inclina al dar el toque. */}
          <svg
            viewBox="0 0 80 12"
            aria-hidden
            className="absolute right-[6%] bottom-[30%] w-24 origin-right transition-transform duration-300"
            style={{ transform: done ? "rotate(-28deg)" : "rotate(-8deg)" }}
          >
            <rect x="0" y="3" width="68" height="6" rx="2" fill="#111" />
            <rect x="0" y="3" width="10" height="6" rx="2" fill="#fbf7f2" />
            <rect x="58" y="3" width="10" height="6" rx="2" fill="#fbf7f2" />
          </svg>
          {done ? (
            <span
              aria-hidden
              className={`absolute right-[30%] bottom-[44%] text-[1.5rem] text-[#ffd97a] ${reduce ? "" : "animate-pulse"}`}
            >
              ✦
            </span>
          ) : null}
        </div>
        <After reduce={reduce} className="mt-2 text-[0.9375rem]">
          {done
            ? `¡Tachán! Y el gran final será en ${event.city}.`
            : "Toca el sombrero con la varita."}
          <span className="block text-[1.0625rem] font-semibold">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>
          </span>
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={tap}
            disabled={done}
            className="mt-3 rounded-full bg-[#ffd97a] px-6 py-2.5 text-[0.9375rem] font-medium text-[#1e0a14] disabled:opacity-70"
          >
            {done ? "¡Tachán!" : "Agitar la varita"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Flambeado: se enciende y, al apagarse, queda el postre ─────────────── */

function FlambeCover({ event, onOpen, reduce }: ConceptProps) {
  const [stage, setStage] = useState<"servido" | "llamas" | "listo">("servido");
  const light = () => {
    if (stage !== "servido") return;
    setStage("llamas");
    haptic([20, 20, 20]);
    playPaper(0.8);
    window.setTimeout(
      () => {
        setStage("listo");
        playNotes([659, 784, 1046], "sine", 0.12);
      },
      reduce ? 0 : 1800,
    );
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,#3a2418,#140c08_75%)]"
      />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#fbefe0]">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">El postre de</p>
        <h1
          id="cover-title"
          tabIndex={-1}
          translate="no"
          className="mt-1 text-[clamp(2.1rem,9.4vw,2.8rem)] leading-[1.02] italic outline-none"
          style={{ fontFamily: PLAYFAIR }}
        >
          {names(event)}
        </h1>
        <div
          data-flambeado={stage}
          onPointerDown={(e) => {
            stop(e);
            light();
          }}
          className="relative mt-8 flex h-64 w-full cursor-pointer flex-col items-center justify-end"
        >
          {stage === "llamas" ? (
            <div aria-hidden className="absolute bottom-24 flex gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className={`block w-5 rounded-[50%_50%_45%_45%] bg-[radial-gradient(ellipse_at_50%_80%,#fff3b0,#ff9a3c_45%,#3a6bff_95%)] ${reduce ? "" : "animate-[flame-flicker_0.8s_ease-in-out_infinite]"}`}
                  style={{ height: `${36 + (i % 3) * 14}px`, animationDelay: `${i * 0.12}s` }}
                />
              ))}
            </div>
          ) : null}
          {/* La crêpe doblada en el plato, con una bola de helado al lado. */}
          <div className="relative mb-6 flex items-end gap-2">
            <span
              aria-hidden
              className="block h-10 w-28 rounded-t-[50%] bg-[linear-gradient(180deg,#e9b66a,#c98a3a)]"
            />
            <span aria-hidden className="block size-9 rounded-full bg-[#fff6e8]" />
          </div>
          <span
            aria-hidden
            className="block h-4 w-56 rounded-[50%] bg-[#f6efe4] shadow-[0_8px_16px_rgb(0_0_0/0.5)]"
          />
          {stage === "listo" ? (
            <span className="absolute top-2 rounded-[4px] bg-[#fbefe0] px-3 py-1 text-[0.8125rem] font-semibold text-[#2a160c]">
              Listo para el brindis
            </span>
          ) : null}
        </div>
        <After reduce={reduce} className="mt-4 text-[0.9375rem]">
          {stage === "listo"
            ? `Y después del postre, la fiesta en ${event.city}.`
            : "Enciende el postre y espera a que se apague la llama."}
          <span className="block text-[1.0625rem] font-semibold">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>
          </span>
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={light}
            disabled={stage !== "servido"}
            className="mt-3 rounded-full bg-[#ff9a3c] px-6 py-2.5 text-[0.9375rem] font-medium text-[#2a160c] disabled:opacity-70"
          >
            {stage === "listo"
              ? "¡Que aproveche!"
              : stage === "llamas"
                ? "Flambeando…"
                : "Flambear el postre"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

export const TWENTYFOURTH_NEW_COVERS = {
  noria: FerrisWheelCover,
  mago: MagicHatCover,
  flambeado: FlambeCover,
};
