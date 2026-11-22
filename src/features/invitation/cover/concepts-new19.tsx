"use client";

import { useState, type PointerEvent } from "react";
import type { WeddingEvent } from "@/lib/domain/types";
import { hostNames, hostsOf } from "@/lib/event-kind";
import { formatLongDate, isoDay } from "@/lib/format";
import { haptic, playNotes, playPaper } from "../effects/sound";
import { After, FRAUNCES, OpenHint, PLAYFAIR, SANS, type ConceptProps } from "./concept-kit";

/*
 * Portadas de concepto de la vigésima tanda (ronda 38): un molinillo de viento que se sopla, el
 * candado del amor que se cierra en un puente y una gramola que pone vuestra canción.
 */

const names = (event: WeddingEvent, joiner = " y ") => hostNames(hostsOf(event), joiner);
const stop = (e: PointerEvent) => e.stopPropagation();

/* ─────────────── Molinillo: se sopla y gira ─────────────── */

function PinwheelCover({ event, onOpen, reduce }: ConceptProps) {
  const [spinning, setSpinning] = useState(false);
  const blow = () => {
    if (spinning) return;
    setSpinning(true);
    playPaper(0.8);
    haptic([6, 12, 6, 12, 6]);
  };
  const colors = ["#ff6b6b", "#ffd166", "#06d6a0", "#118ab2"];

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,#dff3f7,#fdf8ec_60%,#d9ecc4)]"
      />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#1f2d33]">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Sopla fuerte, que se casan</p>
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
          data-molinillo={spinning ? "girando" : "quieto"}
          onPointerDown={(e) => {
            stop(e);
            blow();
          }}
          className="relative mt-6 flex cursor-pointer flex-col items-center"
        >
          <svg
            viewBox="0 0 100 100"
            aria-hidden
            className={`size-44 ${spinning && !reduce ? "animate-[pinwheel-spin_0.9s_linear_infinite]" : ""}`}
            style={spinning && reduce ? { transform: "rotate(45deg)" } : undefined}
          >
            {colors.map((c, i) => (
              <path
                key={c}
                d="M50 50L50 4Q74 8 74 30Z"
                fill={c}
                transform={`rotate(${i * 90} 50 50)`}
                stroke="#fff"
                strokeWidth="1"
              />
            ))}
            <circle cx="50" cy="50" r="5" fill="#fff" stroke="#1f2d33" strokeWidth="1.5" />
          </svg>
          <span aria-hidden className="h-36 w-1.5 rounded-full bg-[#8a6a4a]" />
        </div>
        <After reduce={reduce} className="mt-4 text-[0.9375rem]">
          {spinning ? "¡Ya gira! Y el viento trae la fecha:" : "Sopla (o toca) para que gire."}
          <span className="block text-[1.0625rem] font-semibold">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>, en {event.city}
          </span>
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={blow}
            disabled={spinning}
            className="mt-3 rounded-full bg-[#118ab2] px-6 py-2.5 text-[0.9375rem] font-medium text-white disabled:opacity-70"
          >
            {spinning ? "Girando…" : "Soplar el molinillo"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Candado del amor: se cierra en el puente ─────────────── */

function LovelockCover({ event, onOpen, reduce }: ConceptProps) {
  const [locked, setLocked] = useState(false);
  const hosts = hostsOf(event);
  const lock = () => {
    if (locked) return;
    setLocked(true);
    haptic([20, 40, 10]);
    playNotes([330, 247], "square", 0.08);
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,#f6d7c3,#e9b9a4_45%,#5f7d95_45%,#3f5a70)]"
      />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#2c1c1c]">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Un candado para siempre</p>
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
          data-candado={locked ? "cerrado" : "abierto"}
          onPointerDown={(e) => {
            stop(e);
            lock();
          }}
          className="relative mt-4 flex h-64 w-full cursor-pointer flex-col items-center"
        >
          {/* La barandilla del puente, de la que cuelga el candado. */}
          <span aria-hidden className="absolute inset-x-[-1.5rem] top-6 h-2 bg-[#2b2b2b]" />
          <span aria-hidden className="absolute inset-x-[-1.5rem] top-14 h-1 bg-[#2b2b2b]" />
          <svg viewBox="0 0 80 110" aria-hidden className="relative z-10 mt-2 w-28">
            <path
              d="M22 48V28a18 18 0 0 1 36 0v20"
              stroke="#b8b8c0"
              strokeWidth="8"
              fill="none"
              className="transition-transform duration-500"
              style={{
                transform: locked ? "none" : "translateY(-14px)",
                transitionDuration: reduce ? "0ms" : undefined,
              }}
            />
            <rect x="8" y="46" width="64" height="58" rx="10" fill="#d23b52" />
            <path d="M40 62c-6-6-14-1-10 6l10 10 10-10c4-7-4-12-10-6z" fill="#f6d7c3" />
          </svg>
          <span
            className="z-10 mt-1 rounded-[3px] bg-[#fff6ef] px-2 py-0.5 text-[0.75rem] font-semibold"
            translate="no"
          >
            {hosts.first.charAt(0)} + {hosts.second?.charAt(0) ?? ""}
          </span>
          {/* La llave, que cae al río al cerrar el candado. */}
          <svg
            viewBox="0 0 40 16"
            aria-hidden
            className="absolute right-[18%] w-12 transition-[top,transform] duration-700"
            style={{
              top: locked ? "92%" : "38%",
              transform: locked ? "rotate(80deg)" : "rotate(-20deg)",
              transitionDuration: reduce ? "0ms" : undefined,
            }}
          >
            <circle cx="7" cy="8" r="6" fill="none" stroke="#d4af37" strokeWidth="3" />
            <path d="M13 8h24M30 8v5M35 8v4" stroke="#d4af37" strokeWidth="3" />
          </svg>
        </div>
        <After reduce={reduce} className="mt-2 text-[0.9375rem] text-[#fbf3ee]">
          {locked
            ? "Cerrado y la llave, al río. Para siempre desde el"
            : "Cierra el candado y tira la llave."}
          <span className="block text-[1.0625rem] font-semibold">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>, en {event.city}
          </span>
        </After>
        <div className="mt-auto flex w-full flex-col items-center text-[#fbf3ee]">
          <button
            type="button"
            onPointerDown={stop}
            onClick={lock}
            disabled={locked}
            className="mt-3 rounded-full bg-[#fbf3ee] px-6 py-2.5 text-[0.9375rem] font-medium text-[#8a1f30] disabled:opacity-70"
          >
            {locked ? "Candado cerrado" : "Cerrar el candado"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Gramola: se elige la canción y suena ─────────────── */

function JukeboxCover({ event, onOpen, reduce }: ConceptProps) {
  const [playing, setPlaying] = useState(false);
  // La gramola no sabe qué canciones pediréis: lleva tres huecos con nombre propio.
  const songs = ["El primer baile", "La de los novios", "La que pidas tú"];
  const song = songs[0];
  const play = () => {
    if (playing) return;
    setPlaying(true);
    haptic(10);
    playNotes([523, 587, 659, 784, 659, 587, 523], "triangle", 0.14);
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#3a1a2c,#14080f_75%)]"
      />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#fbeee6]">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Pon una moneda por</p>
        <h1
          id="cover-title"
          tabIndex={-1}
          translate="no"
          className="mt-1 text-[clamp(2.1rem,9.4vw,2.8rem)] leading-[1.02] italic outline-none"
          style={{ fontFamily: PLAYFAIR }}
        >
          {names(event)}
        </h1>
        {/* La gramola: arco de neón, ventana con el disco y la lista de canciones. */}
        <div
          data-gramola={playing ? "sonando" : "en-silencio"}
          onPointerDown={(e) => {
            stop(e);
            play();
          }}
          className={`relative mt-5 flex w-56 cursor-pointer flex-col items-center rounded-t-[110px] border-[6px] px-4 pt-6 pb-4 transition-[border-color,box-shadow] duration-500 ${playing ? "border-[#ff9e3d] shadow-[0_0_40px_6px_rgb(255_158_61/0.45)]" : "border-[#7a4a2c]"} bg-[linear-gradient(180deg,#5a2a1c,#2a120c)]`}
        >
          <span
            aria-hidden
            className={`block size-24 rounded-full border-4 border-[#1a1a1a] bg-[repeating-radial-gradient(circle,#1a1a1a_0_3px,#2a2a2a_3px_5px)] ${playing && !reduce ? "animate-[spin_2s_linear_infinite]" : ""}`}
          >
            <span className="mx-auto mt-[2.1rem] block size-5 rounded-full bg-[#ff9e3d]" />
          </span>
          <ol className="mt-4 w-full space-y-1 text-left text-[0.75rem]">
            {songs.map((s, i) => (
              <li
                key={s}
                className={`flex justify-between rounded-[3px] px-2 py-0.5 ${i === 0 && playing ? "bg-[#ff9e3d] text-[#2a120c]" : "bg-[#fbeee6] text-[#2a120c]"}`}
              >
                <span>
                  A{i + 1} · {s}
                </span>
                {i === 0 && playing ? <span aria-hidden>♪</span> : null}
              </li>
            ))}
          </ol>
        </div>
        <After reduce={reduce} className="mt-4 text-[0.9375rem]">
          {playing ? `Suena «${song}». A bailar el` : "Elige la primera canción de la noche."}
          <span className="block text-[1.0625rem] font-semibold">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>, en {event.city}
          </span>
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={play}
            disabled={playing}
            className="mt-3 rounded-full bg-[#ff9e3d] px-6 py-2.5 text-[0.9375rem] font-medium text-[#2a120c] disabled:opacity-70"
          >
            {playing ? "Sonando" : "Echar una moneda"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

export const NINETEENTH_NEW_COVERS = {
  molinillo: PinwheelCover,
  candado: LovelockCover,
  gramola: JukeboxCover,
};
