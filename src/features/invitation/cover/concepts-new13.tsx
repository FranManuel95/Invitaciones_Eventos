"use client";

import { animate } from "motion/react";
import Image from "next/image";
import { useState, type PointerEvent } from "react";
import type { WeddingEvent } from "@/lib/domain/types";
import { hostNames, hostsOf } from "@/lib/event-kind";
import { formatLongDate, isoDay } from "@/lib/format";
import { haptic, playNotes, playPaper } from "../effects/sound";
import { After, FRAUNCES, OpenHint, PLAYFAIR, SANS, type ConceptProps } from "./concept-kit";

/*
 * Portadas de concepto de la decimocuarta tanda (ronda 38): un cuaderno con una rama de olivo
 * prensada, un fajo de cartas atadas con cinta y el ramo de novia que se lanza.
 */

const names = (event: WeddingEvent, joiner = " y ") => hostNames(hostsOf(event), joiner);
const stop = (e: PointerEvent) => e.stopPropagation();

/* ─────────────── Herbario: se abre el cuaderno y aparece la rama prensada ─────────────── */

function HerbariumCover({ event, onOpen, reduce }: ConceptProps) {
  const [open, setOpen] = useState(false);
  const turn = () => {
    if (open) return;
    setOpen(true);
    playPaper(0.5);
    haptic(12);
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="paper-grain absolute inset-0 opacity-60" />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Del herbario de</p>
        <h1
          id="cover-title"
          tabIndex={-1}
          translate="no"
          className="mt-1 text-[clamp(2.1rem,9.4vw,2.8rem)] leading-[1.02] italic outline-none"
          style={{ fontFamily: PLAYFAIR }}
        >
          {names(event)}
        </h1>
        {/* El cuaderno: la tapa de tela gira y deja ver la hoja con la rama y su etiqueta. */}
        <div
          data-prensado={open ? "abierto" : "cerrado"}
          onPointerDown={(e) => {
            stop(e);
            turn();
          }}
          className="relative mt-6 aspect-[4/5] w-[min(17rem,72vw)] cursor-pointer [perspective:1200px]"
        >
          <div className="absolute inset-0 flex flex-col items-center rounded-[4px] bg-[#fbf8ef] px-4 pt-3 pb-3 shadow-[0_18px_30px_-18px_rgb(40_50_30/0.5)]">
            <Image
              src="/acuarelas/olivo-herbario.webp"
              alt=""
              width={464}
              height={520}
              className="h-[62%] w-auto"
            />
            {/* La etiqueta del pliego, como en los herbarios de verdad. */}
            <dl className="mt-auto w-full border border-[#6b5a3c] px-2 py-1.5 text-left text-[0.6875rem] leading-snug text-[#3a3020]">
              <div className="flex gap-1">
                <dt className="font-semibold">Especie:</dt>
                <dd className="italic">Olea europaea, la del sí</dd>
              </div>
              <div className="flex gap-1">
                <dt className="font-semibold">Recogida:</dt>
                <dd>
                  <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>
                </dd>
              </div>
              <div className="flex gap-1">
                <dt className="font-semibold">Lugar:</dt>
                <dd>{event.city}</dd>
              </div>
            </dl>
          </div>
          <div
            aria-hidden
            className="absolute inset-0 flex origin-left flex-col items-center justify-center rounded-[4px] border-2 border-[#c9b98a] bg-[linear-gradient(135deg,#4f6145,#3a4a33)] text-[#f1e8cf] shadow-[0_18px_30px_-18px_rgb(40_50_30/0.6)] transition-transform duration-[900ms] [backface-visibility:hidden]"
            style={{
              transform: open ? "rotateY(-170deg)" : "none",
              transitionDuration: reduce ? "0ms" : undefined,
            }}
          >
            <span
              className="border-y border-[#c9b98a] px-4 py-2 text-[1.25rem] tracking-[0.18em] uppercase"
              style={{ fontFamily: FRAUNCES }}
            >
              Herbario
            </span>
            <span className="mt-3 text-[0.75rem] tracking-[0.16em] uppercase">
              N.º 1 · Para siempre
            </span>
          </div>
        </div>
        <After reduce={reduce} className="mt-4 text-[0.9375rem]">
          {open
            ? "Guardada para siempre, entre estas dos hojas."
            : "Abre el cuaderno para ver qué guardamos."}
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={turn}
            disabled={open}
            className="mt-3 rounded-full bg-[#3a4a33] px-6 py-2.5 text-[0.9375rem] font-medium text-[#f1e8cf] disabled:opacity-70"
          >
            {open ? "Herbario abierto" : "Pasar la tapa"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Cartas atadas: se tira del lazo y se abren en abanico ─────────────── */

function LettersCover({ event, onOpen, reduce }: ConceptProps) {
  const [loose, setLoose] = useState(false);
  const untie = () => {
    if (loose) return;
    setLoose(true);
    playPaper(0.6);
    haptic([10, 30, 10]);
  };
  const ceremony = event.program[0];
  const letters = [
    { kicker: "Primera carta", text: `Nos casamos el ${formatLongDate(event.date)}.` },
    {
      kicker: "Segunda carta",
      text: ceremony
        ? `A las ${ceremony.time}, en ${event.venues[0]?.name ?? event.city}.`
        : `En ${event.city}.`,
    },
    { kicker: "Tercera carta", text: "Y queremos que estés. ¿Vienes?" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,#efe6d6,#e3d5bd)]" />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Cartas de amor de</p>
        <h1
          id="cover-title"
          tabIndex={-1}
          translate="no"
          className="mt-1 text-[clamp(2.1rem,9.4vw,2.8rem)] leading-[1.02] outline-none"
          style={{ fontFamily: FRAUNCES }}
        >
          {names(event)}
        </h1>
        <p className="mt-1 text-[0.9375rem]">
          <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>
        </p>
        <div
          data-cartas={loose ? "sueltas" : "atadas"}
          onPointerDown={(e) => {
            stop(e);
            untie();
          }}
          className="relative mt-4 h-80 w-full cursor-pointer"
        >
          {letters.map((letter, i) => {
            // Atadas, en un montón; sueltas, caen escalonadas y cada una asoma su texto.
            const angle = loose ? (i - 1) * 3 : (i - 1) * 2;
            const y = loose ? i * 80 : i * -4;
            const x = loose ? (i - 1) * 10 : 0;
            return (
              <div
                key={letter.kicker}
                className="absolute top-2 left-1/2 flex h-40 w-56 flex-col justify-start rounded-[3px] pt-3 border border-[#d6c6a8] bg-[#fbf7ee] px-4 text-left text-[#3a2a1c] shadow-[0_10px_20px_-12px_rgb(60_40_20/0.5)] transition-transform duration-700"
                style={{
                  transform: `translateX(calc(-50% + ${x}px)) translateY(${y}px) rotate(${angle}deg)`,
                  zIndex: loose ? i + 1 : 3 - i,
                  transitionDuration: reduce ? "0ms" : undefined,
                }}
              >
                <span className="text-[0.625rem] tracking-[0.16em] uppercase">{letter.kicker}</span>
                <span
                  className="mt-1 text-[0.9375rem] leading-snug"
                  style={{ fontFamily: PLAYFAIR }}
                >
                  {letter.text}
                </span>
              </div>
            );
          })}
          {/* La cinta burdeos con su lazo, que se suelta y cae. */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-2 left-1/2 z-10 h-40 w-56 -translate-x-1/2 transition-[opacity,transform] duration-500"
            style={{
              opacity: loose ? 0 : 1,
              transform: loose ? "translate(-50%, 40px)" : undefined,
              transitionDuration: reduce ? "0ms" : undefined,
            }}
          >
            <span className="absolute inset-y-0 left-1/2 w-3 -translate-x-1/2 bg-[#7a1f2a]" />
            <span className="absolute inset-x-0 top-1/2 h-3 -translate-y-1/2 bg-[#7a1f2a]" />
            <svg
              viewBox="0 0 60 30"
              className="absolute top-1/2 left-1/2 w-16 -translate-x-1/2 -translate-y-1/2"
            >
              <path
                d="M30 15C20 2 6 4 8 15 6 26 20 28 30 15ZM30 15C40 2 54 4 52 15 54 26 40 28 30 15Z"
                fill="#8e2a36"
              />
              <circle cx="30" cy="15" r="4" fill="#5e141d" />
            </svg>
          </div>
        </div>
        <After reduce={reduce} className="mt-6 text-[0.9375rem]">
          {loose ? "Léelas en orden: son para ti." : "Tira del lazo para leerlas."}
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={untie}
            disabled={loose}
            className="mt-3 rounded-full bg-[#7a1f2a] px-6 py-2.5 text-[0.9375rem] font-medium text-white disabled:opacity-70"
          >
            {loose ? "Cartas sueltas" : "Tirar del lazo"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Ramo de novia: se lanza y lo coges tú ─────────────── */

function BouquetCover({ event, onOpen, reduce }: ConceptProps) {
  const [flight, setFlight] = useState(0);
  const thrown = flight > 0;
  const caught = flight >= 0.98;
  const toss = () => {
    if (thrown) return;
    playPaper(0.3);
    const done = () => {
      haptic([10, 30, 10, 30]);
      playNotes([784, 988, 1175], "sine", 0.12);
    };
    if (reduce) {
      setFlight(1);
      done();
      return;
    }
    animate(0.01, 1, { duration: 1.6, ease: "easeInOut", onUpdate: setFlight, onComplete: done });
  };
  // Un arco: sube un poco, gira y baja hasta las manos.
  const top = 8 + flight * 62 - Math.sin(flight * Math.PI) * 22;

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,#fff8f2,#f3e3dc_70%)]"
      />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">El ramo de</p>
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
          data-ramo={caught ? "cogido" : thrown ? "en-el-aire" : "en-las-manos"}
          onPointerDown={(e) => {
            stop(e);
            toss();
          }}
          className="relative mt-2 h-[min(46svh,21rem)] w-full cursor-pointer"
        >
          <svg
            viewBox="0 0 100 110"
            aria-hidden
            className="absolute left-1/2 w-28 drop-shadow-[0_10px_12px_rgb(80_40_40/0.25)]"
            style={{
              top: `${top}%`,
              transform: `translateX(-50%) rotate(${flight * 340}deg)`,
            }}
          >
            {/* Tallos atados con cinta y una cúpula de flores. */}
            <path
              d="M44 62l-6 44M50 62v46M56 62l6 44"
              stroke="#6b8a5a"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <rect x="40" y="70" width="20" height="8" rx="2" fill="#f2c9cf" />
            {[
              [50, 30, 14, "#fbf3ee"],
              [32, 40, 12, "#f2c9cf"],
              [68, 40, 12, "#f2c9cf"],
              [40, 22, 10, "#e8a7b3"],
              [60, 22, 10, "#fbf3ee"],
              [50, 50, 11, "#e8a7b3"],
              [26, 54, 8, "#a9c09a"],
              [74, 54, 8, "#a9c09a"],
            ].map(([cx, cy, r, fill], i) => (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={r}
                fill={fill as string}
                stroke="#d49aa5"
                strokeWidth="0.8"
              />
            ))}
          </svg>
          {/* Tus manos, abajo, esperando. */}
          <svg
            viewBox="0 0 120 40"
            aria-hidden
            className="absolute bottom-0 left-1/2 w-40 -translate-x-1/2"
          >
            <path
              d="M10 38C14 20 30 12 46 18L58 26 70 18C86 12 102 20 110 38Z"
              fill="#e9c6ad"
              stroke="#b98d70"
              strokeWidth="1.2"
            />
          </svg>
        </div>
        <After reduce={reduce} className="mt-2 text-[0.9375rem]">
          {caught ? "¡Lo has cogido! Ya sabes lo que significa…" : "Lánzalo y a ver quién lo coge."}
          <span className="block text-[1.0625rem] font-semibold">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>, en {event.city}
          </span>
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={toss}
            disabled={thrown}
            className="mt-3 rounded-full bg-[#9c3a4c] px-6 py-2.5 text-[0.9375rem] font-medium text-white disabled:opacity-70"
          >
            {caught ? "¡Cogido!" : thrown ? "En el aire…" : "Lanzar el ramo"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

export const THIRTEENTH_NEW_COVERS = {
  prensado: HerbariumCover,
  cartas: LettersCover,
  ramo: BouquetCover,
};
