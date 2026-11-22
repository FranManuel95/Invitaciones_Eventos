"use client";

import { animate } from "motion/react";
import { useState, type PointerEvent } from "react";
import type { WeddingEvent } from "@/lib/domain/types";
import { hostNames, hostsOf } from "@/lib/event-kind";
import { formatLongDate, isoDay } from "@/lib/format";
import { haptic, playNotes, playPaper } from "../effects/sound";
import { After, FRAUNCES, OpenHint, PLAYFAIR, SANS, type ConceptProps } from "./concept-kit";

/*
 * Portadas de concepto de la vigesimotercera tanda (ronda 38): dos campanas que repican, el hilo
 * rojo del destino que une dos meñiques y una pajarera de la que salen dos pájaros.
 */

const names = (event: WeddingEvent, joiner = " y ") => hostNames(hostsOf(event), joiner);
const stop = (e: PointerEvent) => e.stopPropagation();

/* ─────────────── Campanas: se tira de la cuerda y repican ─────────────── */

function BellsCover({ event, onOpen, reduce }: ConceptProps) {
  const [ringing, setRinging] = useState(false);
  const hosts = hostsOf(event);
  const ring = () => {
    if (ringing) return;
    setRinging(true);
    haptic([30, 60, 30, 60]);
    playNotes([784, 659, 784, 659, 523, 659], "sine", 0.22);
  };
  const bell = (name: string, side: "l" | "r") => (
    <div
      className={`flex flex-col items-center ${ringing && !reduce ? (side === "l" ? "animate-[bell-left_1.2s_ease-in-out_infinite]" : "animate-[bell-right_1.2s_ease-in-out_infinite]") : ""} origin-top`}
    >
      <svg viewBox="0 0 80 90" aria-hidden className="w-28">
        <path
          d="M40 4c-4 0-6 3-6 6v4C18 18 12 34 12 52c0 10-4 16-8 20h72c-4-4-8-10-8-20 0-18-6-34-22-38v-4c0-3-2-6-6-6z"
          fill="#d4a536"
          stroke="#8a6416"
          strokeWidth="2"
        />
        <circle cx="40" cy="80" r="7" fill="#8a6416" />
      </svg>
      <span className="-mt-14 mb-10 text-[0.75rem] font-semibold text-[#3a2a08]" translate="no">
        {name}
      </span>
    </div>
  );

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,#e9eef4,#f6f1e4)]" />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#2a2618]">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Tocan a boda por</p>
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
          data-campanas={ringing ? "repicando" : "quietas"}
          onPointerDown={(e) => {
            stop(e);
            ring();
          }}
          className="relative mt-4 flex w-full cursor-pointer flex-col items-center"
        >
          {/* La espadaña: un arco de piedra con las dos campanas. */}
          <div className="flex w-72 items-start justify-center gap-6 rounded-t-[120px] border-[10px] border-b-0 border-[#c9bda4] px-4 pt-6">
            {bell(hosts.first, "l")}
            {bell(hosts.second ?? hosts.first, "r")}
          </div>
          <span aria-hidden className="block h-24 w-1 bg-[#8a6a4a]" />
          <span aria-hidden className="block size-3 rounded-full bg-[#b3243a]" />
        </div>
        <After reduce={reduce} className="mt-3 text-[0.9375rem]">
          {ringing ? "¡Din, don! Repican por la boda del" : "Tira de la cuerda para que repiquen."}
          <span className="block text-[1.0625rem] font-semibold">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>, en {event.city}
          </span>
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={ring}
            disabled={ringing}
            className="mt-3 rounded-full bg-[#8a6416] px-6 py-2.5 text-[0.9375rem] font-medium text-white disabled:opacity-70"
          >
            {ringing ? "Repicando…" : "Tirar de la cuerda"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Hilo rojo: une dos meñiques ─────────────── */

function RedThreadCover({ event, onOpen, reduce }: ConceptProps) {
  const [tied, setTied] = useState(0);
  const joined = tied >= 0.99;
  const hosts = hostsOf(event);
  const tie = () => {
    if (tied > 0) return;
    playPaper(0.3);
    const done = () => {
      haptic([10, 30, 10]);
      playNotes([523, 784], "sine", 0.2);
    };
    if (reduce) {
      setTied(1);
      done();
      return;
    }
    animate(0.01, 1, { duration: 1.8, ease: "easeInOut", onUpdate: setTied, onComplete: done });
  };
  // El hilo se dibuja desde un meñique hasta el otro, con una curva que se tensa.
  const length = 400;

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,#fbf3ee,#f3e2da)]" />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#3a1a1e]">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Unidos por el hilo rojo</p>
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
          data-hilo={joined ? "unido" : tied > 0 ? "atando" : "suelto"}
          onPointerDown={(e) => {
            stop(e);
            tie();
          }}
          className="relative mt-6 h-64 w-full cursor-pointer"
        >
          <svg viewBox="0 0 300 200" aria-hidden className="absolute inset-0 size-full">
            {/* Dos manos con el meñique extendido, una a cada lado. */}
            <g fill="#f0c9b4" stroke="#b98a74" strokeWidth="1.5">
              <path d="M0 120h40c8 0 12-6 12-12s-4-10-10-10H30l-4-14c-2-6-10-6-10 2l2 14H0z" />
              <path d="M300 120h-40c-8 0-12-6-12-12s4-10 10-10h12l4-14c2-6 10-6 10 2l-2 14h18z" />
            </g>
            <path
              d="M46 100C90 20 130 180 150 100S210 20 254 100"
              fill="none"
              stroke="#c8102e"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={length}
              strokeDashoffset={length * (1 - tied)}
            />
          </svg>
          <div
            className="absolute inset-x-0 bottom-2 flex justify-between px-2 text-[0.8125rem] font-semibold"
            translate="no"
          >
            <span>{hosts.first}</span>
            <span>{hosts.second}</span>
          </div>
        </div>
        <After reduce={reduce} className="text-[0.9375rem]">
          {joined
            ? "Dicen que un hilo rojo une a quienes están destinados. El nuestro se ata el"
            : "Ata el hilo de un meñique al otro."}
          <span className="block text-[1.0625rem] font-semibold">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>, en {event.city}
          </span>
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={tie}
            disabled={tied > 0}
            className="mt-3 rounded-full bg-[#a80d27] px-6 py-2.5 text-[0.9375rem] font-medium text-white disabled:opacity-70"
          >
            {joined ? "Unidos" : tied > 0 ? "Atando…" : "Atar el hilo"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Pajarera: se abre la puerta y salen dos pájaros ─────────────── */

function BirdcageCover({ event, onOpen, reduce }: ConceptProps) {
  const [open, setOpen] = useState(false);
  const release = () => {
    if (open) return;
    setOpen(true);
    playNotes([1318, 1568, 1318, 1760], "sine", 0.09);
    haptic([8, 16, 8]);
  };
  const bird = (dx: number, dy: number, flip: boolean, key: string) => (
    <svg
      key={key}
      viewBox="0 0 40 24"
      aria-hidden
      className="absolute top-[46%] left-1/2 w-10 transition-transform duration-[1400ms]"
      style={{
        transform: `translate(calc(-50% + ${open ? dx : 0}px), ${open ? dy : 0}px)${flip ? " scaleX(-1)" : ""}`,
        transitionDuration: reduce ? "0ms" : undefined,
      }}
    >
      <path
        d="M2 14c6-2 10-6 14-6 3 0 5 2 7 4l8-6-2 8 9 2-10 2c-4 4-10 6-16 4-4-1-7-4-10-8z"
        fill="#5a8fb0"
      />
      <circle cx="24" cy="11" r="1.4" fill="#1a1a1a" />
    </svg>
  );

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,#eef5f0,#f8f3e8)]" />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#1f2d26]">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Volamos juntos</p>
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
          data-pajarera={open ? "abierta" : "cerrada"}
          onPointerDown={(e) => {
            stop(e);
            release();
          }}
          className="relative mt-4 h-72 w-full cursor-pointer"
        >
          {/* La jaula de alambre dorado, con su puertecita. */}
          <svg
            viewBox="0 0 120 160"
            aria-hidden
            className="absolute top-6 left-1/2 h-60 -translate-x-1/2"
          >
            <path d="M60 4v10" stroke="#a8863a" strokeWidth="3" />
            <circle cx="60" cy="4" r="4" fill="none" stroke="#a8863a" strokeWidth="2" />
            <path
              d="M14 70C14 30 106 30 106 70V150H14Z"
              fill="none"
              stroke="#a8863a"
              strokeWidth="2.5"
            />
            {[26, 38, 50, 70, 82, 94].map((x) => (
              <path
                key={x}
                d={`M${x} ${x < 60 ? 46 + (60 - x) / 4 : 46 + (x - 60) / 4}V150`}
                stroke="#c9a65d"
                strokeWidth="1.4"
              />
            ))}
            <path d="M10 150h100" stroke="#a8863a" strokeWidth="5" />
            {/* La puerta: un rectángulo que gira hacia fuera. */}
            <rect
              x="50"
              y="96"
              width="20"
              height="30"
              fill="rgb(201 166 93 / 0.25)"
              stroke="#a8863a"
              strokeWidth="1.6"
              className="transition-transform duration-500"
              style={{
                transformOrigin: "50px 96px",
                transform: open ? "skewY(-35deg) scaleX(0.4)" : "none",
                transitionDuration: reduce ? "0ms" : undefined,
              }}
            />
          </svg>
          {bird(-110, -150, false, "a")}
          {bird(70, -130, true, "b")}
        </div>
        <After reduce={reduce} className="text-[0.9375rem]">
          {open ? "Libres y juntos, desde el" : "Abre la puerta de la pajarera."}
          <span className="block text-[1.0625rem] font-semibold">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>, en {event.city}
          </span>
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={release}
            disabled={open}
            className="mt-3 rounded-full bg-[#3a6a54] px-6 py-2.5 text-[0.9375rem] font-medium text-white disabled:opacity-70"
          >
            {open ? "¡Han volado!" : "Abrir la pajarera"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

export const TWENTYSECOND_NEW_COVERS = {
  campanas: BellsCover,
  hilo: RedThreadCover,
  pajarera: BirdcageCover,
};
