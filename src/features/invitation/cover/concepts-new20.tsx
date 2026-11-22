"use client";

import { animate } from "motion/react";
import { useState, type PointerEvent } from "react";
import type { WeddingEvent } from "@/lib/domain/types";
import { hostNames, hostsOf } from "@/lib/event-kind";
import { formatLongDate, isoDay } from "@/lib/format";
import { haptic, playNotes, playPaper } from "../effects/sound";
import { After, FRAUNCES, OpenHint, PLAYFAIR, SANS, type ConceptProps } from "./concept-kit";

/*
 * Portadas de concepto de la vigesimoprimera tanda (ronda 38): dos pares de huellas que caminan
 * por la arena, una nevera con la tarta de boda dentro y una tetera que sirve el té.
 */

const names = (event: WeddingEvent, joiner = " y ") => hostNames(hostsOf(event), joiner);
const stop = (e: PointerEvent) => e.stopPropagation();

/* ─────────────── Huellas: dos pares de pasos que avanzan juntos ─────────────── */

const STEPS = 7;

function FootprintsCover({ event, onOpen, reduce }: ConceptProps) {
  const [walked, setWalked] = useState(0);
  const arrived = walked >= STEPS;
  const walk = () => {
    if (walked > 0) return;
    playPaper(0.4);
    const done = () => haptic([10, 30, 10]);
    if (reduce) {
      setWalked(STEPS);
      done();
      return;
    }
    animate(0, STEPS, {
      duration: 2.4,
      ease: "linear",
      onUpdate: (v) => setWalked(Math.floor(v)),
      onComplete: () => {
        setWalked(STEPS);
        done();
      },
    });
  };
  const foot = (x: number, y: number, rot: number, key: string) => (
    <svg
      key={key}
      viewBox="0 0 20 34"
      aria-hidden
      className="absolute w-4"
      style={{ left: `${x}%`, top: `${y}%`, transform: `rotate(${rot}deg)` }}
    >
      <ellipse cx="10" cy="20" rx="6" ry="11" fill="#c2a477" />
      {[3, 7, 11, 15].map((cx, i) => (
        <circle key={cx} cx={cx + 1} cy={6 - (i % 2)} r="2" fill="#c2a477" />
      ))}
    </svg>
  );

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,#bfe3ea,#e9dcc0_22%,#f2e6cc)]"
      />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#3a2c1c]">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Caminando juntos</p>
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
          data-huellas={arrived ? "en-la-orilla" : walked > 0 ? "caminando" : "quietas"}
          onPointerDown={(e) => {
            stop(e);
            walk();
          }}
          className="relative mt-4 h-72 w-full cursor-pointer"
        >
          {/* Dos caminos que empiezan separados y terminan juntos, de abajo hacia arriba. */}
          {Array.from({ length: walked }, (_, i) => {
            const t = i / (STEPS - 1);
            const y = 88 - t * 70;
            const left = 22 + t * 18;
            const right = 70 - t * 18;
            return [
              foot(left + (i % 2 ? 4 : 0), y, 8, `a${i}`),
              foot(right + (i % 2 ? 0 : 4), y + 4, -8, `b${i}`),
            ];
          })}
          {/* La fecha escrita con el dedo en la orilla. */}
          <p
            className="absolute inset-x-0 top-0 text-[1.25rem] font-semibold text-[#6b4a2a] transition-[filter] duration-700"
            style={{
              fontFamily: PLAYFAIR,
              filter: arrived ? "none" : "blur(6px)",
              transitionDuration: reduce ? "0ms" : undefined,
            }}
          >
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>
          </p>
        </div>
        <After reduce={reduce} className="text-[0.9375rem]">
          {arrived ? `Hasta la orilla de ${event.city}.` : "Camina con nosotros hasta la orilla."}
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={walk}
            disabled={walked > 0}
            className="mt-3 rounded-full bg-[#6b4a2a] px-6 py-2.5 text-[0.9375rem] font-medium text-[#fbf3e6] disabled:opacity-70"
          >
            {arrived ? "En la orilla" : walked > 0 ? "Caminando…" : "Echar a andar"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Nevera: se abre la puerta y dentro está la tarta ─────────────── */

function FridgeCover({ event, onOpen, reduce }: ConceptProps) {
  const [open, setOpen] = useState(false);
  const hosts = hostsOf(event);
  const pull = () => {
    if (open) return;
    setOpen(true);
    playNotes([1046, 1318], "sine", 0.08);
    haptic(12);
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,#e7f1ee,#d5e6e0)]" />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#1f2e2a]">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Nota en la nevera de</p>
        <h1
          id="cover-title"
          tabIndex={-1}
          translate="no"
          className="mt-1 text-[clamp(2.1rem,9.4vw,2.8rem)] leading-[1.02] outline-none"
          style={{ fontFamily: FRAUNCES }}
        >
          {names(event)}
        </h1>
        {/* La nevera retro: dentro, la tarta de boda con la fecha; fuera, la nota con imán. */}
        <div
          data-nevera={open ? "abierta" : "cerrada"}
          onPointerDown={(e) => {
            stop(e);
            pull();
          }}
          className="relative mt-5 h-72 w-48 cursor-pointer [perspective:1000px]"
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-[24px] bg-[#f4fbfa] p-4 ring-4 ring-[#8fc1b5]">
            <span aria-hidden className="block h-0.5 w-full bg-[#cfe3dd]" />
            {/* La tarta de dos pisos. */}
            <div className="flex flex-col items-center">
              <span aria-hidden className="block h-3 w-3 rounded-full bg-[#e8a7b3]" />
              <span
                aria-hidden
                className="block h-8 w-16 rounded-t-[6px] bg-[#fff6ef] ring-1 ring-[#e8cfc4]"
              />
              <span
                aria-hidden
                className="block h-10 w-24 rounded-t-[6px] bg-[#fff6ef] ring-1 ring-[#e8cfc4]"
              />
            </div>
            <span className="rounded-[3px] bg-[#e8a7b3] px-2 py-0.5 text-[0.75rem] font-semibold text-[#3a1a24]">
              <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>
            </span>
            <span aria-hidden className="block h-0.5 w-full bg-[#cfe3dd]" />
            <span className="text-[0.6875rem]">«No tocar hasta el día de la boda»</span>
          </div>
          <div
            className="absolute inset-0 flex origin-left flex-col items-center rounded-[24px] bg-[linear-gradient(90deg,#9fd3c7,#b8e2d8)] pt-8 shadow-[0_18px_30px_-16px_rgb(30_60_50/0.5)] transition-transform duration-700 [backface-visibility:hidden]"
            style={{
              transform: open ? "rotateY(-105deg)" : "none",
              transitionDuration: reduce ? "0ms" : undefined,
            }}
          >
            <span
              aria-hidden
              className="absolute top-20 right-3 h-16 w-2 rounded-full bg-[#e9efe9]"
            />
            <span
              className="rotate-[-4deg] bg-[#fff7a8] px-3 py-2 text-left text-[0.75rem] leading-snug text-[#3a2c1c] shadow-[0_4px_8px_rgb(0_0_0/0.15)]"
              translate="no"
            >
              Compra:
              <br />— Anillos ✓
              <br />— Traje ✓
              <br />— Tarta ✓ ({hosts.first} y {hosts.second})
            </span>
            <span
              aria-hidden
              className="mt-4 block size-5 rounded-full bg-[#e4572e] shadow-[0_2px_4px_rgb(0_0_0/0.3)]"
            />
          </div>
        </div>
        <After reduce={reduce} className="mt-4 text-[0.9375rem]">
          {open
            ? `La tarta ya está lista. Nos vemos en ${event.city}.`
            : "Abre la nevera: hay algo para ti."}
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={pull}
            disabled={open}
            className="mt-3 rounded-full bg-[#2f6b5e] px-6 py-2.5 text-[0.9375rem] font-medium text-white disabled:opacity-70"
          >
            {open ? "Nevera abierta" : "Abrir la nevera"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Tetera: se sirve el té y aparecen los posos ─────────────── */

function TeapotCover({ event, onOpen, reduce }: ConceptProps) {
  const [poured, setPoured] = useState(false);
  const pour = () => {
    if (poured) return;
    setPoured(true);
    playPaper(0.7);
    haptic([8, 20, 8]);
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#fbf1e6,#efdcc6_75%)]"
      />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#3a2416]">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">A la hora del té</p>
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
          data-tetera={poured ? "servida" : "llena"}
          onPointerDown={(e) => {
            stop(e);
            pour();
          }}
          className="relative mt-6 h-64 w-full cursor-pointer"
        >
          {/* La tetera de porcelana con flores, que se inclina para servir. */}
          <svg
            viewBox="0 0 140 100"
            aria-hidden
            className="absolute top-0 left-[8%] w-44 origin-[70%_60%] transition-transform duration-700"
            style={{
              transform: poured ? "rotate(28deg)" : "none",
              transitionDuration: reduce ? "0ms" : undefined,
            }}
          >
            <path d="M30 40Q30 90 70 90T110 40Z" fill="#fdfbf6" stroke="#5a7aa6" strokeWidth="2" />
            <path
              d="M108 50Q130 40 136 22"
              stroke="#5a7aa6"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
            <path d="M32 50Q10 50 14 66Q18 78 34 72" stroke="#5a7aa6" strokeWidth="4" fill="none" />
            <ellipse
              cx="70"
              cy="40"
              rx="40"
              ry="6"
              fill="#e6eef8"
              stroke="#5a7aa6"
              strokeWidth="2"
            />
            <circle cx="70" cy="30" r="5" fill="#5a7aa6" />
            {[50, 70, 90].map((cx) => (
              <circle key={cx} cx={cx} cy="64" r="5" fill="#e8a7b3" />
            ))}
          </svg>
          {poured ? (
            <span
              aria-hidden
              className="absolute top-[30%] left-[62%] block h-24 w-1.5 rounded-full bg-[#b5652a]/80"
            />
          ) : null}
          {/* La taza: al servir, en el fondo se leen los posos. */}
          <div className="absolute right-[10%] bottom-4 flex flex-col items-center">
            <div className="flex h-20 w-28 items-center justify-center rounded-b-[48px] border-2 border-[#5a7aa6] bg-[#fdfbf6]">
              <span
                className="rounded-[4px] px-1 text-[0.6875rem] leading-tight font-semibold"
                style={{
                  background: poured ? "#c98a4f" : "transparent",
                  color: poured ? "#2a1608" : "transparent",
                }}
                aria-hidden={!poured}
              >
                Los posos dicen:
                <br />
                boda
              </span>
            </div>
            <span aria-hidden className="mt-1 block h-2 w-36 rounded-full bg-[#5a7aa6]" />
          </div>
        </div>
        <After reduce={reduce} className="mt-2 text-[0.9375rem]">
          {poured ? "Los posos no mienten: hay boda el" : "Sirve el té y lee los posos."}
          <span className="block text-[1.0625rem] font-semibold">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>, en {event.city}
          </span>
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={pour}
            disabled={poured}
            className="mt-3 rounded-full bg-[#3f5f8a] px-6 py-2.5 text-[0.9375rem] font-medium text-white disabled:opacity-70"
          >
            {poured ? "Té servido" : "Servir el té"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

export const TWENTIETH_NEW_COVERS = {
  huellas: FootprintsCover,
  nevera: FridgeCover,
  tetera: TeapotCover,
};
