"use client";

import { useState, type PointerEvent } from "react";
import type { WeddingEvent } from "@/lib/domain/types";
import { hostNames, hostsOf } from "@/lib/event-kind";
import { formatLongDate, isoDay } from "@/lib/format";
import { haptic, playNotes, playPaper } from "../effects/sound";
import { After, FRAUNCES, OpenHint, PLAYFAIR, SANS, type ConceptProps } from "./concept-kit";

/*
 * Portadas de concepto de la vigesimosegunda tanda (ronda 38): pompas de jabón que llevan los
 * datos de la boda, una herradura de la suerte y una grulla de papel que se dobla.
 */

const names = (event: WeddingEvent, joiner = " y ") => hostNames(hostsOf(event), joiner);
const stop = (e: PointerEvent) => e.stopPropagation();

/* ─────────────── Pompas de jabón: cada pompa lleva un dato ─────────────── */

function BubblesCover({ event, onOpen, reduce }: ConceptProps) {
  const [blown, setBlown] = useState(false);
  const blow = () => {
    if (blown) return;
    setBlown(true);
    playNotes([880, 1046, 1318], "sine", 0.1);
    haptic([6, 12, 6]);
  };
  const bubbles = [
    { text: formatLongDate(event.date), x: 12, y: 6, size: 9 },
    { text: event.city, x: 56, y: 26, size: 7.5 },
    { text: "¡Sí, quiero!", x: 18, y: 46, size: 7 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,#e9f4fb,#f8eef6)]" />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#263040]">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Pompas para</p>
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
          data-pompas={blown ? "en-el-aire" : "en-el-aro"}
          onPointerDown={(e) => {
            stop(e);
            blow();
          }}
          className="relative mt-4 h-80 w-full cursor-pointer"
        >
          {bubbles.map((b, i) => (
            <span
              key={i}
              className={`absolute flex items-center justify-center rounded-full border border-white/80 bg-[radial-gradient(circle_at_30%_25%,rgb(255_255_255/0.95),rgb(200_225_250/0.55)_45%,rgb(240_200_235/0.5))] p-2 text-[0.8125rem] leading-tight font-semibold text-[#263040] shadow-[inset_0_0_12px_rgb(255_255_255/0.8)] transition-[top,left,transform] duration-[1200ms] ${blown && !reduce ? "animate-[bubble-float_3s_ease-in-out_infinite]" : ""}`}
              style={{
                width: `${b.size}rem`,
                height: `${b.size}rem`,
                left: blown ? `${b.x}%` : "60%",
                top: blown ? `${b.y}%` : "78%",
                transform: blown ? "scale(1)" : "scale(0.15)",
                transitionDuration: reduce ? "0ms" : undefined,
                animationDelay: `${i * 0.4}s`,
              }}
            >
              {i === 0 ? <time dateTime={isoDay(event.date)}>{b.text}</time> : b.text}
            </span>
          ))}
          {/* El aro de soplar, con su palito. */}
          <svg viewBox="0 0 60 120" aria-hidden className="absolute right-[18%] bottom-0 h-28">
            <circle cx="30" cy="22" r="18" fill="none" stroke="#e879a6" strokeWidth="5" />
            <path d="M30 40v80" stroke="#e879a6" strokeWidth="5" strokeLinecap="round" />
          </svg>
        </div>
        <After reduce={reduce} className="text-[0.9375rem]">
          {blown ? "Cada pompa lleva un dato. ¡No las explotes!" : "Sopla por el aro."}
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={blow}
            disabled={blown}
            className="mt-3 rounded-full bg-[#b3306a] px-6 py-2.5 text-[0.9375rem] font-medium text-white disabled:opacity-70"
          >
            {blown ? "Pompas en el aire" : "Soplar pompas"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Herradura: se cuelga y llueven tréboles ─────────────── */

const CLOVERS = Array.from({ length: 12 }, (_, i) => ({
  x: 6 + ((i * 41) % 88),
  y: 63 + ((i * 23) % 17),
  r: (i * 53) % 360,
}));

function HorseshoeCover({ event, onOpen, reduce }: ConceptProps) {
  const [hung, setHung] = useState(false);
  const hang = () => {
    if (hung) return;
    setHung(true);
    haptic([25, 30, 10]);
    playNotes([659, 784, 988], "triangle", 0.1);
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,#f3efe2,#e4ddc6)]" />
      {hung
        ? CLOVERS.map((c, i) => (
            <svg
              key={i}
              viewBox="0 0 20 20"
              aria-hidden
              className={`absolute w-5 ${reduce ? "" : "animate-[candy-fall_1s_ease-in_both]"}`}
              style={{
                left: `${c.x}%`,
                top: `${c.y}%`,
                rotate: `${c.r}deg`,
                animationDelay: `${(i % 4) * 0.08}s`,
              }}
            >
              {[0, 90, 180, 270].map((a) => (
                <circle
                  key={a}
                  cx="10"
                  cy="5.5"
                  r="4.5"
                  fill="#3f8a4a"
                  transform={`rotate(${a} 10 10)`}
                />
              ))}
            </svg>
          ))
        : null}
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#2a2618]">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Buena suerte a</p>
        <h1
          id="cover-title"
          tabIndex={-1}
          translate="no"
          className="mt-1 text-[clamp(2.1rem,9.4vw,2.8rem)] leading-[1.02] outline-none"
          style={{ fontFamily: FRAUNCES }}
        >
          {names(event)}
        </h1>
        {/* El dintel de la puerta y la herradura, que sube a su clavo. */}
        <div
          data-herradura={hung ? "colgada" : "en-la-mano"}
          onPointerDown={(e) => {
            stop(e);
            hang();
          }}
          className="relative mt-5 mb-4 flex h-56 w-full cursor-pointer flex-col items-center"
        >
          <span aria-hidden className="block h-4 w-[90%] rounded-[3px] bg-[#6b4a2a]" />
          <span aria-hidden className="mt-1 block size-2 rounded-full bg-[#3a3a3a]" />
          <svg
            viewBox="0 0 100 100"
            aria-hidden
            className="w-32 transition-transform duration-700"
            style={{
              transform: hung ? "translateY(-6px) rotate(180deg)" : "translateY(30px) rotate(-25deg)",
              transitionDuration: reduce ? "0ms" : undefined,
            }}
          >
            <path
              d="M22 92V48a28 28 0 0 1 56 0v44"
              fill="none"
              stroke="#9aa0a8"
              strokeWidth="16"
              strokeLinecap="round"
            />
            {[30, 40, 52, 62, 70].map((y, i) => (
              <circle key={y} cx={i % 2 ? 78 : 22} cy={y + 12} r="2.2" fill="#4a4f57" />
            ))}
          </svg>
        </div>
        <After reduce={reduce} className="text-[0.9375rem]">
          {hung
            ? "Colgada y con las puntas hacia arriba: la suerte no se escapa."
            : "Cuélgala sobre la puerta."}
          <span className="block text-[1.0625rem] font-semibold">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>, en {event.city}
          </span>
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={hang}
            disabled={hung}
            className="mt-3 rounded-full bg-[#2f6b3a] px-6 py-2.5 text-[0.9375rem] font-medium text-white disabled:opacity-70"
          >
            {hung ? "¡Suerte!" : "Colgar la herradura"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Grulla de papel: se dobla en tres pliegues ─────────────── */

const FOLDS = ["Papel", "Primer pliegue", "Segundo pliegue", "Grulla"] as const;

function CraneCover({ event, onOpen, reduce }: ConceptProps) {
  const [fold, setFold] = useState(0);
  const done = fold >= 3;
  const next = () => {
    if (done) return;
    setFold(fold + 1);
    playPaper(0.2);
    haptic(8);
  };
  // Cada pliegue acerca el cuadrado a la silueta de la grulla.
  const shapes = [
    "M10 10H110V110H10Z",
    "M60 10L110 60L60 110L10 60Z",
    "M60 10L95 60L60 110L25 60Z",
    "M4 30L14 33L40 62L60 14L72 60L116 50L76 72L60 104L46 72Z",
  ];

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,#f7f2ea,#efe4d6)]" />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#2c2420]">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Mil grullas para</p>
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
          data-grulla={done ? "doblada" : `pliegue-${fold}`}
          onPointerDown={(e) => {
            stop(e);
            next();
          }}
          className="mt-8 flex cursor-pointer flex-col items-center"
        >
          <svg
            viewBox="0 0 120 120"
            aria-hidden
            className="w-52 drop-shadow-[0_10px_14px_rgb(80_40_30/0.2)]"
          >
            <path
              d={shapes[fold]}
              fill="#d94f4f"
              stroke="#a33434"
              strokeWidth="1.5"
              strokeLinejoin="round"
              className="transition-[d] duration-500"
              style={{ transitionDuration: reduce ? "0ms" : undefined }}
            />
            {fold > 0 ? (
              <path d="M60 10V110" stroke="#a33434" strokeWidth="0.8" opacity="0.6" />
            ) : null}
          </svg>
          <span className="mt-3 text-[0.75rem] tracking-[0.16em] uppercase">{FOLDS[fold]}</span>
        </div>
        <After reduce={reduce} className="mt-4 text-[0.9375rem]">
          {done
            ? "Dicen que mil grullas cumplen un deseo. Esta lleva el nuestro:"
            : "Dobla el papel hasta que vuele."}
          <span className="block text-[1.0625rem] font-semibold">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>, en {event.city}
          </span>
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={next}
            disabled={done}
            className="mt-3 rounded-full bg-[#a33434] px-6 py-2.5 text-[0.9375rem] font-medium text-white disabled:opacity-70"
          >
            {done ? "Grulla lista" : `Doblar (${fold}/3)`}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

export const TWENTYFIRST_NEW_COVERS = {
  pompas: BubblesCover,
  herradura: HorseshoeCover,
  grulla: CraneCover,
};
