"use client";

import { useState, type PointerEvent } from "react";
import type { WeddingEvent } from "@/lib/domain/types";
import { hostNames, hostsOf } from "@/lib/event-kind";
import { formatLongDate, isoDay } from "@/lib/format";
import { haptic, playNotes, playPaper } from "../effects/sound";
import { After, FRAUNCES, OpenHint, PLAYFAIR, SANS, type ConceptProps } from "./concept-kit";

/*
 * Portadas de concepto de la decimoséptima tanda (ronda 38): una piñata que se rompe a golpes,
 * un cucurucho de arroz que se lanza sobre los nombres y una vela que se sopla.
 */

const names = (event: WeddingEvent, joiner = " y ") => hostNames(hostsOf(event), joiner);
const stop = (e: PointerEvent) => e.stopPropagation();

/* ─────────────── Piñata: tres golpes y caen los caramelos ─────────────── */

const CANDIES = Array.from({ length: 14 }, (_, i) => ({
  x: 8 + ((i * 53) % 84),
  y: 52 + ((i * 29) % 22),
  r: (i * 47) % 360,
  c: ["#ff5d8f", "#ffc93c", "#4cc9f0", "#7bd389", "#b388ff"][i % 5],
}));

function PinataCover({ event, onOpen, reduce }: ConceptProps) {
  const [hits, setHits] = useState(0);
  const broken = hits >= 3;
  const hit = () => {
    if (broken) return;
    const next = hits + 1;
    setHits(next);
    haptic(next >= 3 ? [20, 30, 20, 30] : 15);
    if (next >= 3) playNotes([523, 659, 784, 1047], "square", 0.09);
    else playPaper(0.12);
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,#fff3d6,#ffe1c2)]" />
      {broken
        ? CANDIES.map((c, i) => (
            <span
              key={i}
              aria-hidden
              className={`absolute block h-3 w-5 rounded-full ${reduce ? "" : "animate-[candy-fall_0.9s_ease-in_both]"}`}
              style={{
                left: `${c.x}%`,
                top: `${c.y}%`,
                background: c.c,
                transform: `rotate(${c.r}deg)`,
                animationDelay: `${(i % 5) * 0.06}s`,
              }}
            />
          ))
        : null}
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#3a1f2c]">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">¡Fiesta! Se casan</p>
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
          data-pinata={broken ? "rota" : `golpes-${hits}`}
          onPointerDown={(e) => {
            stop(e);
            hit();
          }}
          className="relative mt-2 flex cursor-pointer flex-col items-center"
        >
          <span aria-hidden className="h-10 w-0.5 bg-[#8a6a4a]" />
          {/* La estrella de siete puntas, de papel de seda, que se abre por la mitad. */}
          <div className="relative size-40">
            {(["l", "r"] as const).map((side) => (
              <svg
                key={side}
                viewBox="0 0 100 100"
                aria-hidden
                className="absolute inset-0 size-full transition-transform duration-500"
                style={{
                  clipPath: side === "l" ? "inset(0 50% 0 0)" : "inset(0 0 0 50%)",
                  transform: broken
                    ? `translate(${side === "l" ? -30 : 30}px, 24px) rotate(${side === "l" ? -24 : 24}deg)`
                    : `rotate(${hits % 2 ? 6 : -4}deg)`,
                  transitionDuration: reduce ? "0ms" : undefined,
                }}
              >
                <polygon
                  points="50,4 61,34 94,30 70,52 86,84 54,68 30,94 32,62 6,52 36,38"
                  fill="#ff5d8f"
                  stroke="#b8336a"
                  strokeWidth="2"
                />
                <circle cx="50" cy="52" r="16" fill="#ffc93c" />
                <path d="M34 52h32M50 36v32" stroke="#4cc9f0" strokeWidth="4" />
              </svg>
            ))}
          </div>
        </div>
        <After reduce={reduce} className="mt-6 text-[0.9375rem]">
          {broken ? "¡Rota! Recoge tu caramelo:" : "Dale tres golpes para romperla."}
          <span className="block text-[1.0625rem] font-semibold">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>, en {event.city}
          </span>
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={hit}
            disabled={broken}
            className="mt-3 rounded-full bg-[#b8336a] px-6 py-2.5 text-[0.9375rem] font-medium text-white disabled:opacity-70"
          >
            {broken ? "¡Piñata rota!" : `Golpear la piñata (${hits}/3)`}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Lluvia de arroz: se lanza y cae sobre los nombres ─────────────── */

const GRAINS = Array.from({ length: 60 }, (_, i) => ({
  x: (i * 37) % 100,
  delay: ((i * 13) % 20) / 10,
  dur: 1.6 + ((i * 7) % 10) / 10,
  r: (i * 61) % 180,
}));

function RiceCover({ event, onOpen, reduce }: ConceptProps) {
  const [thrown, setThrown] = useState(false);
  const toss = () => {
    if (thrown) return;
    setThrown(true);
    playPaper(0.9);
    haptic([6, 10, 6, 10, 6]);
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,#f3f0e8,#e6e0d2)]" />
      {thrown
        ? GRAINS.map((g, i) => (
            <span
              key={i}
              aria-hidden
              className={`absolute top-0 block h-2 w-[3px] rounded-full bg-white shadow-[0_0_1px_rgb(120_110_90/0.8)] ${reduce ? "hidden" : "animate-[rice-fall_linear_infinite]"}`}
              style={{
                left: `${g.x}%`,
                animationDuration: `${g.dur}s`,
                animationDelay: `${g.delay}s`,
                rotate: `${g.r}deg`,
              }}
            />
          ))
        : null}
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#2f2a22]">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">¡Vivan los novios!</p>
        <h1
          id="cover-title"
          tabIndex={-1}
          translate="no"
          className="mt-1 text-[clamp(2.1rem,9.4vw,2.8rem)] leading-[1.02] italic outline-none"
          style={{ fontFamily: PLAYFAIR }}
        >
          {names(event)}
        </h1>
        <p className="mt-2 text-[0.9375rem]">
          <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time> · {event.city}
        </p>
        {/* El cucurucho de papel con el arroz, que se vuelca al lanzarlo. */}
        <div
          data-arroz={thrown ? "lanzado" : "en-el-cucurucho"}
          onPointerDown={(e) => {
            stop(e);
            toss();
          }}
          className="relative mt-auto mb-4 flex h-48 w-full cursor-pointer items-end justify-center"
        >
          <svg
            viewBox="0 0 80 110"
            aria-hidden
            className="w-24 origin-bottom transition-transform duration-500"
            style={{
              transform: thrown ? "translate(-24px, -40px) rotate(-38deg)" : "rotate(-8deg)",
              transitionDuration: reduce ? "0ms" : undefined,
            }}
          >
            <path d="M6 10h68L40 106z" fill="#fbf7ee" stroke="#b9ad92" strokeWidth="2" />
            <path d="M6 10h68" stroke="#c9a65d" strokeWidth="4" />
            {thrown ? null : (
              <ellipse cx="40" cy="12" rx="30" ry="6" fill="#ffffff" stroke="#d8d0bd" />
            )}
            <path d="M22 40q18 10 36 0" fill="none" stroke="#c9a65d" strokeWidth="1.5" />
          </svg>
        </div>
        <After reduce={reduce} className="text-[0.9375rem]">
          {thrown ? "¡Arroz para los novios! Que haya suerte." : "Lanza el arroz cuando salgan."}
        </After>
        <div className="flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={toss}
            disabled={thrown}
            className="mt-3 rounded-full bg-[#6b5a3c] px-6 py-2.5 text-[0.9375rem] font-medium text-white disabled:opacity-70"
          >
            {thrown ? "¡Lanzado!" : "Lanzar el arroz"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Vela: se sopla y el humo deja la fecha ─────────────── */

function CandleCover({ event, onOpen, reduce }: ConceptProps) {
  const [out, setOut] = useState(false);
  const blow = () => {
    if (out) return;
    setOut(true);
    playPaper(0.5);
    haptic(25);
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div
        aria-hidden
        className="absolute inset-0 transition-[background] duration-700"
        style={{
          background: out
            ? "radial-gradient(circle at 50% 45%, #2a2230, #120e16 70%)"
            : "radial-gradient(circle at 50% 45%, #6a4a2a, #1e140c 70%)",
        }}
      />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#f6ead8]">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Pide un deseo con</p>
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
          data-vela={out ? "apagada" : "encendida"}
          onPointerDown={(e) => {
            stop(e);
            blow();
          }}
          className="relative mt-8 flex h-64 cursor-pointer flex-col items-center justify-end"
        >
          {out ? (
            <span
              aria-hidden
              className={`absolute bottom-[11.5rem] h-16 w-6 rounded-full bg-[radial-gradient(ellipse,rgb(220_220_230/0.35),transparent_70%)] blur-[3px] ${reduce ? "" : "animate-[smoke-rise_2.4s_ease-out_infinite]"}`}
            />
          ) : (
            <span
              aria-hidden
              className={`absolute bottom-[10.5rem] block h-10 w-5 rounded-[50%_50%_45%_45%] bg-[radial-gradient(ellipse_at_50%_75%,#fffbe0,#ffc24a_45%,#ff7a1a_80%)] shadow-[0_0_40px_14px_rgb(255_180_80/0.45)] ${reduce ? "" : "animate-[flame-flicker_1.4s_ease-in-out_infinite]"}`}
            />
          )}
          <span aria-hidden className="mb-0.5 h-3 w-0.5 bg-[#2a2018]" />
          <span className="flex h-40 w-14 items-end justify-center rounded-t-[6px] bg-[linear-gradient(90deg,#efe4cf,#fffaf0_45%,#e2d4ba)] pb-3 text-[0.625rem] font-semibold tracking-[0.14em] text-[#5a3a20] uppercase [writing-mode:vertical-rl]">
            Para siempre
          </span>
          <span aria-hidden className="h-3 w-24 rounded-[50%] bg-[#c9a65d]" />
        </div>
        <After reduce={reduce} className="mt-5 text-[0.9375rem]">
          {out ? "Deseo pedido. Se cumple el" : "Sopla la vela y pide un deseo."}
          <span className="block text-[1.0625rem] font-semibold">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>, en {event.city}
          </span>
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={blow}
            disabled={out}
            className="mt-3 rounded-full bg-[#f6ead8] px-6 py-2.5 text-[0.9375rem] font-medium text-[#2a1a10] disabled:opacity-70"
          >
            {out ? "Vela apagada" : "Soplar la vela"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

export const SIXTEENTH_NEW_COVERS = {
  pinata: PinataCover,
  arroz: RiceCover,
  vela: CandleCover,
};
