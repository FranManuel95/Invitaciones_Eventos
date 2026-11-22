"use client";

import { animate } from "motion/react";
import { useRef, useState, type PointerEvent } from "react";
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

const SLATS = 15;
/** Lo que hay que tirar del cordón (en píxeles) para subir la persiana entera. */
const CORD_PULL = 180;

function ShutterCover({ event, onOpen, reduce }: ConceptProps) {
  // `pull` va de 0 a 1: el primer tramo abre las lamas y el resto sube la persiana.
  const [pull, setPull] = useState(0);
  const drag = useRef<{ y: number; start: number; moved: boolean } | null>(null);
  const tilt = Math.min(1, pull / 0.15);
  const up = Math.max(0, (pull - 0.15) / 0.85);
  const raised = pull >= 0.98;
  const finish = (from: number) => {
    playPaper(0.9);
    const done = () => haptic([10, 30, 10]);
    if (reduce) {
      setPull(1);
      done();
      return;
    }
    animate(from, 1, {
      duration: 1.8 * (1 - from) + 0.2,
      ease: [0.3, 0.8, 0.4, 1],
      onUpdate: setPull,
      onComplete: done,
    });
  };
  const raise = () => {
    if (pull > 0) return;
    finish(0.01);
  };
  const letGo = (from: number) => {
    if (from >= 0.55) return finish(from);
    // No ha subido bastante: la persiana vuelve a caer con su traqueteo.
    if (reduce) return setPull(0);
    animate(from, 0, { duration: 0.5, ease: [0.5, 0, 0.9, 0.6], onUpdate: setPull });
  };
  const sunY = 70 - up * 46;

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      {/* La pared de la habitación, con la luz que entra por la ventana. */}
      <div aria-hidden className="absolute inset-0 bg-[#efe5d4]" />
      <div
        aria-hidden
        className="absolute inset-x-0 top-[38%] bottom-0 bg-[linear-gradient(180deg,rgb(255_196_140/0.55),transparent_70%)] [clip-path:polygon(28%_0,72%_0,96%_100%,4%_100%)]"
        style={{ opacity: up }}
      />
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
        <div className="relative mt-5 flex items-start">
          {/* La ventana: detrás, el amanecer sobre el lugar; delante, la persiana de lamas. */}
          <div
            data-persiana={raised ? "subida" : pull > 0 ? "subiendo" : "bajada"}
            onPointerDown={(e) => {
              stop(e);
              raise();
            }}
            className="relative h-72 w-60 cursor-pointer overflow-hidden rounded-t-[6px] border-[10px] border-[#fbf8f2] bg-[#fbf8f2] shadow-[0_0_0_1px_#c9b89a,0_18px_30px_-16px_rgb(60_40_20/0.5)]"
          >
            <div className="absolute inset-0 flex flex-col items-center justify-end overflow-hidden bg-[linear-gradient(180deg,#f7a27a,#ffcf98_42%,#fbe7c2_62%)] pb-5">
              <span
                aria-hidden
                className="absolute left-1/2 block size-16 -translate-x-1/2 rounded-full bg-[#fff3c4] shadow-[0_0_44px_16px_rgb(255_220_150/0.75)]"
                style={{ top: `${sunY}%` }}
              />
              {/* Los tejados del pueblo y los cipreses, a contraluz. */}
              <svg
                viewBox="0 0 220 90"
                aria-hidden
                preserveAspectRatio="none"
                className="absolute inset-x-0 bottom-0 h-[34%] w-full"
              >
                <path
                  d="M0 52 30 44 52 50 80 38 108 46 132 34 160 44 190 36 220 46V90H0z"
                  fill="#c98f6a"
                />
                <path
                  d="M0 70h18V58l10-8 10 8v12h14V54h24v16h10V60l14-10 14 10v10h16V56h22v14h12V62l9-7 9 7v8h18V90H0z"
                  fill="#8f5a3f"
                />
                <path d="M150 70c-4-14-2-30 3-38 5 8 7 24 3 38z" fill="#5f6b3a" />
                <path d="M164 70c-3-10-2-22 2-28 4 6 5 18 2 28z" fill="#5f6b3a" />
              </svg>

            {/* El parteluz de la ventana, detrás del cartel del lugar. */}
            <span
              aria-hidden
              className="absolute inset-y-0 left-1/2 w-[6px] -translate-x-1/2 bg-[#fbf8f2]"
            />
              <span className="relative rounded-[4px] bg-[#fffaf0] px-2 py-1 text-[0.8125rem] font-semibold">
                {event.venues.at(-1)?.name ?? event.city}
              </span>
            </div>
            {/* La persiana: lamas que se abren con el primer tirón y luego se recogen arriba. */}
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 flex flex-col overflow-hidden"
              style={{ height: `${(1 - up) * 100}%` }}
            >
              {Array.from({ length: SLATS }, (_, k) => (
                <span
                  key={k}
                  className="block shrink-0 origin-top bg-[linear-gradient(180deg,#f1e6cf,#e2d2b0_70%,#c4ad84)]"
                  style={{
                    height: `${268 / SLATS}px`,
                    transform: `scaleY(${1 - tilt * 0.42})`,
                  }}
                />
              ))}
              <span className="absolute inset-x-0 bottom-0 block h-2.5 bg-[#9a8460]" />
            </div>
            <span aria-hidden className="absolute inset-x-0 top-0 h-3 bg-[#d8c7a6]" />
          </div>
          {/* El cordón: se tira hacia abajo y la persiana sube. */}
          <div
            aria-hidden
            className="relative -ml-1 w-8 shrink-0 cursor-grab touch-none active:cursor-grabbing"
            style={{ height: 300 }}
            onPointerDown={(e) => {
              stop(e);
              if (raised) return;
              drag.current = { y: e.clientY, start: pull, moved: false };
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (!drag.current) return;
              e.stopPropagation();
              const dy = e.clientY - drag.current.y;
              if (Math.abs(dy) > 4) drag.current.moved = true;
              setPull(Math.min(1, Math.max(0, drag.current.start + dy / CORD_PULL)));
            }}
            onPointerUp={() => {
              const d = drag.current;
              drag.current = null;
              if (!d) return;
              if (!d.moved) return raise();
              letGo(pull);
            }}
            onPointerCancel={() => {
              if (drag.current) letGo(pull);
              drag.current = null;
            }}
          >
            <span
              className="absolute top-3 left-1/2 block w-[3px] -translate-x-1/2 rounded-full bg-[repeating-linear-gradient(180deg,#f6efe2_0_3px,#d6c6a6_3px_5px)]"
              style={{ height: 150 + pull * CORD_PULL * 0.6 }}
            />
            <span
              className="absolute left-1/2 block h-7 w-4 -translate-x-1/2 rounded-[45%_45%_50%_50%/35%_35%_65%_65%] bg-[radial-gradient(circle_at_35%_30%,#b98048,#7a4a22)] shadow-[0_3px_6px_rgb(60_30_10/0.4)]"
              style={{ top: 3 + 150 + pull * CORD_PULL * 0.6 }}
            />
          </div>
        </div>
        {/* El alféizar con su maceta de geranios. */}
        <div
          aria-hidden
          className="relative -mt-0.5 h-3 w-72 rounded-[2px] bg-[#e4d6bc] shadow-[0_6px_10px_-6px_rgb(60_40_20/0.5)]"
        >
          <svg viewBox="0 0 40 34" className="absolute bottom-full left-6 w-10">
            <circle cx="12" cy="10" r="6" fill="#d8343e" />
            <circle cx="24" cy="7" r="6" fill="#e2474f" />
            <circle cx="30" cy="15" r="5" fill="#c92a36" />
            <path d="M8 18c6-4 18-4 26 0" stroke="#4f6b2f" strokeWidth="5" fill="none" />
            <path d="M9 20h24l-3 14H12z" fill="#b8643c" />
          </svg>
        </div>
        <After reduce={reduce} className="mt-4 text-[0.9375rem]">
          {raised ? "Amanece el día de nuestra boda:" : "Tira del cordón: ya es de día."}
          <span className="block text-[1.0625rem] font-semibold">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>, en {event.city}
          </span>
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={raise}
            disabled={pull > 0}
            className="mt-3 rounded-full bg-[#8a5a2c] px-6 py-2.5 text-[0.9375rem] font-medium text-white disabled:opacity-70"
          >
            {raised ? "¡Buenos días!" : pull > 0 ? "Subiendo…" : "Subir la persiana"}
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
