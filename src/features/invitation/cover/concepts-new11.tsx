"use client";

import { animate } from "motion/react";
import { useState, type PointerEvent } from "react";
import type { WeddingEvent } from "@/lib/domain/types";
import { hostNames, hostsOf } from "@/lib/event-kind";
import { formatLongDate, isoDay } from "@/lib/format";
import { haptic, playNotes, playPaper } from "../effects/sound";
import { After, FRAUNCES, OpenHint, PLAYFAIR, SANS, type ConceptProps } from "./concept-kit";

/*
 * Portadas de concepto de la duodécima tanda (ronda 38): una cometa que sube al tirar del hilo,
 * un reloj de arena que se voltea y un faro que se enciende y barre la costa.
 */

const names = (event: WeddingEvent, joiner = " y ") => hostNames(hostsOf(event), joiner);
const stop = (e: PointerEvent) => e.stopPropagation();

/* ─────────────── Cometa: sube al tirar del hilo ─────────────── */

function KiteCover({ event, onOpen, reduce }: ConceptProps) {
  const [height, setHeight] = useState(0);
  const flying = height >= 0.98;
  const hosts = hostsOf(event);
  const pull = () => {
    if (flying) return;
    playPaper(0.4);
    const done = () => haptic([10, 30, 10]);
    if (reduce) {
      setHeight(1);
      done();
      return;
    }
    animate(height, 1, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: setHeight,
      onComplete: done,
    });
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,#9cc9e6,#d8ecf3_52%,#e6d6aa_52%,#f3ead2)]"
      />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Día de viento para</p>
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
          data-kite={flying ? "volando" : "en-el-suelo"}
          className="relative mt-2 h-[min(44svh,20rem)] w-full"
        >
          {/* El hilo, desde la mano (abajo a la izquierda) hasta la cometa. */}
          <svg
            aria-hidden
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 size-full"
          >
            <path
              d={`M22 100 Q${40 + height * 6} ${96 - height * 30} ${50 + height * 6} ${72 - height * 46}`}
              fill="none"
              stroke="#5b4a3a"
              strokeWidth="0.6"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          {/* La cometa y su cola de lazos con los nombres. */}
          <div
            className="absolute left-1/2 flex flex-col items-center"
            style={{
              bottom: `${10 + height * 46}%`,
              transform: `translateX(${-50 + height * 18}%) rotate(${-8 + height * 14}deg)`,
            }}
          >
            <svg
              viewBox="0 0 80 100"
              aria-hidden
              className="w-20 drop-shadow-[0_8px_10px_rgb(40_60_80/0.25)]"
            >
              <path d="M40 2L76 40 40 98 4 40z" fill="#e0533d" />
              <path d="M40 2L76 40H4z" fill="#f2c230" />
              <path d="M40 2v96M4 40h72" stroke="#7a2e1f" strokeWidth="1.5" />
            </svg>
            <div aria-hidden className="flex flex-col items-center gap-1">
              {[hosts.first, "♥", hosts.second ?? ""].filter(Boolean).map((t, i) => (
                <span
                  key={i}
                  className="rounded-[3px] bg-white/85 px-1.5 text-[0.6875rem] font-semibold text-[#7a2e1f]"
                  style={{ transform: `rotate(${(i % 2 ? 1 : -1) * 10}deg)` }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
        <After reduce={reduce} className="mt-2 text-[0.9375rem]">
          <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time> · {event.city}
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={pull}
            disabled={flying}
            className="mt-3 rounded-full bg-[#b03a28] px-6 py-2.5 text-[0.9375rem] font-medium text-white disabled:opacity-70"
          >
            {flying ? "¡Vuela!" : "Tirar del hilo"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Reloj de arena: se voltea y cae la arena ─────────────── */

function HourglassCover({ event, onOpen, reduce }: ConceptProps) {
  const [flipped, setFlipped] = useState(false);
  const [sand, setSand] = useState(0);
  const done = sand >= 0.98;

  const flip = () => {
    if (flipped) return;
    setFlipped(true);
    playPaper(0.2);
    if (reduce) {
      setSand(1);
      haptic(20);
      return;
    }
    animate(0, 1, {
      duration: 3,
      delay: 0.5,
      ease: "linear",
      onUpdate: setSand,
      onComplete: () => {
        haptic([10, 30, 10]);
        playNotes([880, 1175], "sine", 0.18);
      },
    });
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="paper-grain absolute inset-0 opacity-60" />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Cuenta atrás para</p>
        <h1
          id="cover-title"
          tabIndex={-1}
          translate="no"
          className="mt-1 text-[clamp(2.1rem,9.4vw,2.8rem)] leading-[1.02] outline-none"
          style={{ fontFamily: FRAUNCES }}
        >
          {names(event)}
        </h1>
        {/* El reloj: dos ampollas de cristal con arena entre dos maderas. */}
        <div
          data-hourglass={done ? "vacio" : flipped ? "cayendo" : "quieto"}
          onPointerDown={(e) => {
            stop(e);
            flip();
          }}
          className="mt-5 flex cursor-pointer flex-col items-center transition-transform duration-500"
          style={{ transform: flipped ? "rotate(180deg)" : "none" }}
        >
          <span className="h-3 w-32 rounded-[3px] bg-[#7a4a2c]" />
          <svg viewBox="0 0 100 160" aria-hidden className="h-44 w-28">
            <defs>
              <clipPath id="ampolla-arriba">
                <path d="M14 4h72c0 30-30 50-34 76h-4C44 54 14 34 14 4z" />
              </clipPath>
              <clipPath id="ampolla-abajo">
                <path d="M48 80h4c4 26 34 46 34 76H14c0-30 30-50 34-76z" />
              </clipPath>
            </defs>
            <path
              d="M14 4h72c0 30-30 50-34 76 4 26 34 46 34 76H14c0-30 30-50 34-76C44 54 14 34 14 4z"
              fill="rgb(220 236 240 / 0.6)"
              stroke="#9cb3bb"
              strokeWidth="1.5"
            />
            {/* Antes de voltear, la arena está abajo; al voltear (girado), cae de nuevo. */}
            <rect
              clipPath="url(#ampolla-abajo)"
              x="0"
              y={flipped ? 80 : 106}
              width="100"
              height={flipped ? 50 * (1 - sand) : 50}
              fill="#d9a441"
            />
            <rect
              clipPath="url(#ampolla-arriba)"
              x="0"
              y="4"
              width="100"
              height={flipped ? 50 * sand : 0}
              fill="#d9a441"
            />
            {flipped && !done ? <path d="M50 80V20" stroke="#d9a441" strokeWidth="1.5" /> : null}
          </svg>
          <span className="h-3 w-32 rounded-[3px] bg-[#7a4a2c]" />
        </div>
        <After reduce={reduce} className="mt-4 text-[0.9375rem]">
          {done ? "¡Se acabó la espera!" : "Cuando caiga el último grano:"}
          <span className="block text-[1.0625rem] font-semibold">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>, en {event.city}
          </span>
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={flip}
            disabled={flipped}
            className="mt-3 rounded-full bg-[#7a4a2c] px-6 py-2.5 text-[0.9375rem] font-medium text-[#f6ead0] disabled:opacity-70"
          >
            {done ? "Ya es la hora" : flipped ? "Cayendo…" : "Dar la vuelta al reloj"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Faro: se enciende y el haz barre la costa ─────────────── */

function LighthouseCover({ event, onOpen, reduce }: ConceptProps) {
  const [on, setOn] = useState(false);
  const light = () => {
    if (on) return;
    setOn(true);
    haptic([10, 40, 10]);
    playNotes([392, 523], "sine", 0.3);
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      {/* La noche en la costa: cielo, mar y estrellas. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,#0f1a33,#1c2f52_55%,#0c1a2e)]"
      />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Faro de guía para</p>
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
          data-lighthouse={on ? "encendido" : "apagado"}
          onPointerDown={(e) => {
            stop(e);
            light();
          }}
          className="relative mt-4 h-[min(42svh,19rem)] w-full cursor-pointer"
        >
          {/* El haz de luz, que gira lento cuando está encendido. */}
          {/* La torre a rayas, la linterna y la roca. */}
          <div className="absolute bottom-[14%] left-1/2 flex -translate-x-1/2 flex-col items-center">
            {on ? (
              <span
                aria-hidden
                className={`absolute top-3.5 left-1/2 size-0 ${reduce ? "" : "animate-[faro-sweep_6s_ease-in-out_infinite]"}`}
              >
                <span className="absolute top-[-2.5rem] left-0 h-20 w-[30rem] bg-[linear-gradient(90deg,rgb(255_236_170/0.6),transparent)] [clip-path:polygon(0_45%,100%_0,100%_100%,0_55%)]" />
                <span className="absolute top-[-2.5rem] right-0 h-20 w-[30rem] bg-[linear-gradient(270deg,rgb(255_236_170/0.6),transparent)] [clip-path:polygon(100%_45%,0_0,0_100%,100%_55%)]" />
              </span>
            ) : null}
            <span
              className={`relative size-7 rounded-t-full ${on ? "bg-[#ffe9a8] shadow-[0_0_30px_10px_rgb(255_230_150/0.7)]" : "bg-[#3a4660]"}`}
            />
            <span className="h-2 w-10 bg-[#1b2236]" />
            <span className="h-36 w-14 bg-[repeating-linear-gradient(180deg,#f4efe6_0_1.5rem,#c8312b_1.5rem_3rem)] [clip-path:polygon(18%_0,82%_0,100%_100%,0_100%)]" />
          </div>
          <span
            aria-hidden
            className="absolute inset-x-[-1.5rem] bottom-0 h-[16%] rounded-t-[40%] bg-[#141c2e]"
          />
        </div>
        <After reduce={reduce} className="mt-3 text-[0.9375rem] text-[#e9eef6]">
          {on ? `Rumbo a ${event.city}:` : "Enciende el faro para encontrar el camino."}
          <span className="block font-semibold">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>
          </span>
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={light}
            disabled={on}
            className="mt-3 rounded-full bg-[#ffe9a8] px-6 py-2.5 text-[0.9375rem] font-medium text-[#0f1a33] disabled:opacity-70"
          >
            {on ? "Faro encendido" : "Encender el faro"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

export const ELEVENTH_NEW_COVERS = {
  cometa: KiteCover,
  reloj: HourglassCover,
  faro: LighthouseCover,
};
