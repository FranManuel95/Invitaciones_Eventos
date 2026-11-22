"use client";

import { animate } from "motion/react";
import { useState, type PointerEvent } from "react";
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

function FerrisWheelCover({ event, onOpen, reduce }: ConceptProps) {
  const [turn, setTurn] = useState(0);
  const top = turn >= 0.99;
  const spin = () => {
    if (turn > 0) return;
    playNotes([523, 659, 784, 659, 523], "triangle", 0.18);
    const done = () => haptic([10, 30, 10]);
    if (reduce) {
      setTurn(1);
      done();
      return;
    }
    animate(0.001, 1, { duration: 2.6, ease: "easeInOut", onUpdate: setTurn, onComplete: done });
  };
  // La cabina de los novios empieza abajo (180°) y acaba arriba (0°): media vuelta más una entera.
  const rotation = turn * 540;
  const colors = ["#e4572e", "#ffc93c", "#4cc9f0", "#7bd389"];

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,#2a1e4a,#6a3a6e_55%,#f29e7a)]"
      />
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
          data-noria={top ? "arriba" : turn > 0 ? "girando" : "parada"}
          onPointerDown={(e) => {
            stop(e);
            spin();
          }}
          className="relative mt-4 size-64 cursor-pointer"
        >
          {/* La rueda gira; cada cabina se contrarresta para quedar siempre derecha. */}
          <div className="absolute inset-0" style={{ transform: `rotate(${rotation}deg)` }}>
            <svg viewBox="0 0 200 200" aria-hidden className="absolute inset-0 size-full">
              <circle cx="100" cy="100" r="86" fill="none" stroke="#fff4ea" strokeWidth="3" />
              <circle
                cx="100"
                cy="100"
                r="60"
                fill="none"
                stroke="#fff4ea"
                strokeWidth="1.5"
                opacity="0.6"
              />
              {Array.from({ length: CABINS }, (_, i) => (
                <path
                  key={i}
                  d="M100 100V14"
                  stroke="#fff4ea"
                  strokeWidth="1.5"
                  transform={`rotate(${(i * 360) / CABINS} 100 100)`}
                />
              ))}
              <circle cx="100" cy="100" r="8" fill="#ffc93c" />
            </svg>
            {Array.from({ length: CABINS }, (_, i) => {
              const angle = 180 + (i * 360) / CABINS;
              const ours = i === 0;
              return (
                <span
                  key={i}
                  className="absolute top-1/2 left-1/2 block"
                  style={{
                    transform: `rotate(${angle}deg) translateY(-118px) rotate(${-angle - rotation}deg)`,
                  }}
                >
                  <span
                    aria-hidden
                    className={`-mt-3 -ml-4 block h-6 w-8 rounded-b-[10px] border-2 border-[#fff4ea] ${ours ? "bg-[#ff5d8f] shadow-[0_0_14px_4px_rgb(255_93_143/0.6)]" : ""}`}
                    style={ours ? undefined : { background: colors[i % colors.length] }}
                  />
                </span>
              );
            })}
          </div>
          <span
            aria-hidden
            className="absolute bottom-[-2rem] left-1/2 block h-20 w-36 -translate-x-1/2 bg-[#2a1e4a] [clip-path:polygon(45%_0,55%_0,100%_100%,0_100%)]"
          />
        </div>
        <After reduce={reduce} className="mt-10 text-[0.9375rem]">
          {top
            ? "Nuestra cabina, la rosa, ya está arriba. Desde aquí se ve el"
            : "Da vueltas a la noria hasta subir la cabina rosa."}
          <span className="block text-[1.0625rem] font-semibold">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>, en {event.city}
          </span>
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={spin}
            disabled={turn > 0}
            className="mt-3 rounded-full bg-[#ff5d8f] px-6 py-2.5 text-[0.9375rem] font-medium text-[#2a0a18] disabled:opacity-70"
          >
            {top ? "¡Arriba!" : turn > 0 ? "Girando…" : "Girar la noria"}
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
            style={{ bottom: done ? "38%" : "8%", transitionDuration: reduce ? "0ms" : undefined }}
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
              <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>
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
