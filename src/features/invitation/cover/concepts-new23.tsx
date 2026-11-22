"use client";

import { animate } from "motion/react";
import { useState, type PointerEvent } from "react";
import type { WeddingEvent } from "@/lib/domain/types";
import { hostNames, hostsOf } from "@/lib/event-kind";
import { formatLongDate, formatNumericDate, isoDay } from "@/lib/format";
import { haptic, playNotes, playPaper } from "../effects/sound";
import { After, FRAUNCES, OpenHint, PLAYFAIR, SANS, type ConceptProps } from "./concept-kit";

/*
 * Portadas de concepto de la vigesimocuarta tanda (ronda 38): una persiana que se sube y deja ver
 * el amanecer, un reloj de cuco que canta la hora y una pizarra escrita con tiza.
 */

const names = (event: WeddingEvent, joiner = " y ") => hostNames(hostsOf(event), joiner);
const stop = (e: PointerEvent) => e.stopPropagation();

/* ─────────────── Persiana: se sube y amanece ─────────────── */

function ShutterCover({ event, onOpen, reduce }: ConceptProps) {
  const [up, setUp] = useState(0);
  const raised = up >= 0.98;
  const raise = () => {
    if (up > 0) return;
    playPaper(0.9);
    const done = () => haptic([10, 30, 10]);
    if (reduce) {
      setUp(1);
      done();
      return;
    }
    animate(0.01, 1, {
      duration: 1.8,
      ease: [0.3, 0.8, 0.4, 1],
      onUpdate: setUp,
      onComplete: done,
    });
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="absolute inset-0 bg-[#f4ece0]" />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#2e2418]">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Buenos días, se casan</p>
        <h1
          id="cover-title"
          tabIndex={-1}
          translate="no"
          className="mt-1 text-[clamp(2.1rem,9.4vw,2.8rem)] leading-[1.02] italic outline-none"
          style={{ fontFamily: PLAYFAIR }}
        >
          {names(event)}
        </h1>
        {/* La ventana: detrás, el amanecer sobre el lugar; delante, la persiana de lamas. */}
        <div
          data-persiana={raised ? "subida" : up > 0 ? "subiendo" : "bajada"}
          onPointerDown={(e) => {
            stop(e);
            raise();
          }}
          className="relative mt-5 h-72 w-64 cursor-pointer overflow-hidden rounded-t-[8px] border-[10px] border-[#f9f6f0] shadow-[0_0_0_2px_#c9b89a,0_18px_30px_-16px_rgb(60_40_20/0.5)]"
        >
          <div className="absolute inset-0 flex flex-col items-center justify-end bg-[linear-gradient(180deg,#ffb88a,#ffd9a0_45%,#f6ecd0_60%,#a9c38a_60%,#7fa36a)] pb-6">
            <span
              aria-hidden
              className="absolute top-[38%] left-1/2 block size-16 -translate-x-1/2 rounded-full bg-[#fff1b8] shadow-[0_0_40px_14px_rgb(255_220_150/0.7)]"
            />
            <span className="relative rounded-[4px] bg-[#fffaf0] px-2 py-1 text-[0.8125rem] font-semibold">
              {event.venues.at(-1)?.name ?? event.city}
            </span>
          </div>
          <div
            className="absolute inset-x-0 top-0 bg-[repeating-linear-gradient(180deg,#e8dcc4_0_14px,#cdbd9e_14px_16px)]"
            style={{ height: `${(1 - up) * 100}%` }}
          >
            <span
              aria-hidden
              className="absolute bottom-0 left-1/2 block h-3 w-8 -translate-x-1/2 rounded-t-[3px] bg-[#8a7656]"
            />
          </div>
        </div>
        <After reduce={reduce} className="mt-4 text-[0.9375rem]">
          {raised ? "Amanece el día de nuestra boda:" : "Sube la persiana: ya es de día."}
          <span className="block text-[1.0625rem] font-semibold">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>, en {event.city}
          </span>
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={raise}
            disabled={up > 0}
            className="mt-3 rounded-full bg-[#8a5a2c] px-6 py-2.5 text-[0.9375rem] font-medium text-white disabled:opacity-70"
          >
            {raised ? "¡Buenos días!" : up > 0 ? "Subiendo…" : "Subir la persiana"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Reloj de cuco: se tira de la pesa y canta ─────────────── */

function CuckooCover({ event, onOpen, reduce }: ConceptProps) {
  const [sang, setSang] = useState(false);
  const pull = () => {
    if (sang) return;
    setSang(true);
    haptic([20, 40, 20]);
    playNotes([988, 784, 988, 784], "sine", 0.25);
  };
  const ceremony = event.program[0]?.time ?? "12:00";
  const [hh = 12, mm = 0] = ceremony.split(":").map(Number);
  const hourAngle = ((hh % 12) + mm / 60) * 30;
  const minuteAngle = mm * 6;

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div
        aria-hidden
        className="absolute inset-0 bg-[repeating-linear-gradient(90deg,#efe3cc_0_38px,#e8dac0_38px_40px)]"
      />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#2f1f12]">
        <p className="rounded-full bg-[#efe3cc] px-3 text-[0.75rem] tracking-[0.22em] uppercase">
          Ya es la hora de
        </p>
        <h1
          id="cover-title"
          tabIndex={-1}
          translate="no"
          className="mt-1 rounded-[6px] bg-[#efe3cc] px-2 text-[clamp(2.1rem,9.4vw,2.8rem)] leading-[1.02] outline-none"
          style={{ fontFamily: FRAUNCES }}
        >
          {names(event)}
        </h1>
        <div
          data-cuco={sang ? "cantando" : "dormido"}
          onPointerDown={(e) => {
            stop(e);
            pull();
          }}
          className="relative mt-4 flex cursor-pointer flex-col items-center"
        >
          {/* La casita de madera con su tejado, la puertecita del cuco y la esfera. */}
          <svg viewBox="0 0 140 170" aria-hidden className="w-48">
            <path d="M4 56L70 6l66 50z" fill="#5a3a20" />
            <path d="M18 54h104v96H18z" fill="#8a5a2c" />
            <rect
              x="58"
              y="58"
              width="24"
              height="22"
              fill="#2f1f12"
              className="transition-transform duration-300"
              style={{ transformOrigin: "58px 58px", transform: sang ? "scaleX(0.15)" : "none" }}
            />
            {sang ? (
              <g className={reduce ? "" : "animate-[cuckoo-out_0.6s_ease-out_both]"}>
                <ellipse cx="70" cy="68" rx="11" ry="8" fill="#e9b949" />
                <path d="M80 66l9-2-8 5z" fill="#d9572b" />
                <circle cx="74" cy="65" r="1.4" fill="#1a1a1a" />
              </g>
            ) : null}
            <circle cx="70" cy="112" r="26" fill="#f6ecd8" stroke="#3a2614" strokeWidth="3" />
            {Array.from({ length: 12 }, (_, i) => (
              <circle
                key={i}
                cx={70 + Math.sin((i * Math.PI) / 6) * 21}
                cy={112 - Math.cos((i * Math.PI) / 6) * 21}
                r="1.3"
                fill="#3a2614"
              />
            ))}
            <path
              d="M70 112V98"
              stroke="#2f1f12"
              strokeWidth="3"
              strokeLinecap="round"
              transform={`rotate(${hourAngle} 70 112)`}
            />
            <path
              d="M70 112V92"
              stroke="#2f1f12"
              strokeWidth="2"
              strokeLinecap="round"
              transform={`rotate(${minuteAngle} 70 112)`}
            />
            <path d="M40 150v20M100 150v14" stroke="#3a2614" strokeWidth="2" />
          </svg>
          {/* Las pesas en forma de piña. */}
          <div className="-mt-1 flex w-28 justify-between">
            <span aria-hidden className="block h-8 w-4 rounded-b-full bg-[#5a3a20]" />
            <span
              aria-hidden
              className="block h-8 w-4 rounded-b-full bg-[#5a3a20] transition-transform duration-300"
              style={{ transform: sang ? "translateY(10px)" : "none" }}
            />
          </div>
        </div>
        <After reduce={reduce} className="mt-4 rounded-[6px] bg-[#efe3cc] px-2 text-[0.9375rem]">
          {sang ? `¡Cucú! A las ${ceremony} del` : "Tira de la pesa y escucha qué hora es."}
          <span className="block text-[1.0625rem] font-semibold">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>, en {event.city}
          </span>
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={pull}
            disabled={sang}
            className="mt-3 rounded-full bg-[#5a3a20] px-6 py-2.5 text-[0.9375rem] font-medium text-[#f6ecd8] disabled:opacity-70"
          >
            {sang ? "¡Cucú!" : "Tirar de la pesa"}
          </button>
          <div className="rounded-full bg-[#efe3cc]">
            <OpenHint onOpen={onOpen} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Pizarra: se escribe con tiza ─────────────── */

function ChalkboardCover({ event, onOpen, reduce }: ConceptProps) {
  const [written, setWritten] = useState(false);
  const write = () => {
    if (written) return;
    setWritten(true);
    playPaper(1.2);
    haptic([4, 8, 4, 8, 4]);
  };
  const lines = [
    `Fecha: ${formatNumericDate(event.date)}`,
    `Lugar: ${event.city}`,
    "Deberes: venir y bailar",
  ];

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#2f4a3c,#1a2b22_80%)]"
      />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#f2efe6]">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Lección de hoy</p>
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
          data-pizarra={written ? "escrita" : "en-blanco"}
          onPointerDown={(e) => {
            stop(e);
            write();
          }}
          className="relative mt-6 w-full max-w-[20rem] cursor-pointer rounded-[6px] border-[10px] border-[#8a5a2c] bg-[#22382c] px-5 py-6 text-left shadow-[0_18px_30px_-16px_rgb(0_0_0/0.6)]"
        >
          <p className="text-[0.75rem] tracking-[0.16em] text-[#c9d6cc] uppercase">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>
          </p>
          <ol className="mt-3 space-y-2 text-[1.0625rem]" style={{ fontFamily: PLAYFAIR }}>
            {lines.map((l, i) => (
              <li
                key={l}
                className="transition-[clip-path] duration-700 ease-linear"
                style={{
                  clipPath: written ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
                  transitionDelay: reduce ? "0ms" : `${i * 600}ms`,
                  transitionDuration: reduce ? "0ms" : undefined,
                }}
              >
                {l}
              </li>
            ))}
          </ol>
          <span
            aria-hidden
            className="absolute right-6 -bottom-6 block h-2 w-10 rounded-[2px] bg-[#f6f3ea]"
          />
        </div>
        <After reduce={reduce} className="mt-8 text-[0.9375rem]">
          {written
            ? "Lección aprendida. Nos vemos en clase."
            : "Coge la tiza y escribe la lección."}
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={write}
            disabled={written}
            className="mt-3 rounded-full bg-[#f2efe6] px-6 py-2.5 text-[0.9375rem] font-medium text-[#1a2b22] disabled:opacity-70"
          >
            {written ? "Lección escrita" : "Escribir con tiza"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

export const TWENTYTHIRD_NEW_COVERS = {
  persiana: ShutterCover,
  cuco: CuckooCover,
  tiza: ChalkboardCover,
};
