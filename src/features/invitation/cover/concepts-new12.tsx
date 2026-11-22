"use client";

import { animate } from "motion/react";
import { useState, type PointerEvent } from "react";
import type { WeddingEvent } from "@/lib/domain/types";
import { hostNames, hostsOf } from "@/lib/event-kind";
import { formatLongDate, isoDay } from "@/lib/format";
import { haptic, playNotes, playPaper } from "../effects/sound";
import { After, FRAUNCES, OpenHint, PLAYFAIR, SANS, type ConceptProps } from "./concept-kit";

/*
 * Portadas de concepto de la decimotercera tanda (ronda 38): una caja de música a la que se da
 * cuerda, un farolillo de papel que sube al cielo y un barco de papel que navega hasta la boda.
 */

const names = (event: WeddingEvent, joiner = " y ") => hostNames(hostsOf(event), joiner);
const stop = (e: PointerEvent) => e.stopPropagation();

/** Las primeras notas de una nana sencilla, para la caja de música. */
const LULLABY = [659, 587, 523, 587, 659, 659, 659, 587, 587, 587, 659, 784, 784];

/* ─────────────── Caja de música: se le da cuerda y gira la bailarina ─────────────── */

function MusicBoxCover({ event, onOpen, reduce }: ConceptProps) {
  const [turns, setTurns] = useState(0);
  const playing = turns >= 3;
  const wind = () => {
    if (playing) return;
    const next = turns + 1;
    setTurns(next);
    haptic(8);
    if (next >= 3) {
      haptic([10, 30, 10]);
      playNotes(LULLABY, "triangle", 0.28);
    } else {
      playPaper(0.08);
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#f7e7ea,#e6c9cf_70%)]"
      />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Suena la canción de</p>
        <h1
          id="cover-title"
          tabIndex={-1}
          translate="no"
          className="mt-1 text-[clamp(2.1rem,9.4vw,2.8rem)] leading-[1.02] italic outline-none"
          style={{ fontFamily: PLAYFAIR }}
        >
          {names(event)}
        </h1>
        {/* La caja: tapa con espejo que se abre, bailarina en el centro y la llave a un lado. */}
        <div
          data-musicbox={playing ? "sonando" : "cerrada"}
          onPointerDown={(e) => {
            stop(e);
            wind();
          }}
          className="relative mt-8 h-56 w-64 cursor-pointer [perspective:700px]"
        >
          <div
            className="absolute inset-x-0 bottom-28 h-28 origin-bottom rounded-t-[10px] border-[3px] border-[#c9a65d] bg-[linear-gradient(160deg,#fdf2f4,#d9b8c0)] transition-transform duration-700"
            style={{ transform: playing ? "rotateX(-58deg)" : "rotateX(-84deg)" }}
          >
            <span className="absolute inset-3 rounded-[6px] bg-[linear-gradient(135deg,#ffffff,#d8dde3)] opacity-80" />
          </div>
          {playing ? (
            <svg
              viewBox="0 0 40 70"
              aria-hidden
              className={`absolute bottom-28 left-1/2 h-20 -translate-x-1/2 ${reduce ? "" : "animate-[musicbox-spin_2.4s_linear_infinite]"}`}
            >
              <circle cx="20" cy="8" r="5" fill="#5a3a40" />
              <path d="M20 13v22" stroke="#5a3a40" strokeWidth="3" strokeLinecap="round" />
              <path
                d="M20 18l-12-8M20 18l12-8"
                stroke="#5a3a40"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path d="M6 44q14-14 28 0z" fill="#f2b8c6" />
              <path
                d="M20 44l-4 22M20 44l6 20"
                stroke="#5a3a40"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          ) : null}
          <div className="absolute inset-x-0 bottom-0 flex h-28 flex-col items-center justify-center rounded-b-[10px] border-[3px] border-[#c9a65d] bg-[linear-gradient(180deg,#f3d9df,#d9b0ba)] shadow-[0_18px_30px_-16px_rgb(90_40_50/0.5)]">
            <span className="text-[0.6875rem] tracking-[0.2em] text-[#5a2a33] uppercase">
              Para siempre
            </span>
            <span className="mt-1 text-[1rem] font-semibold text-[#5a2a33]">
              <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>
            </span>
          </div>
          {/* La llave: gira un cuarto de vuelta con cada toque. */}
          <span
            aria-hidden
            className="absolute right-[-1.6rem] bottom-10 block size-7 rounded-full border-[3px] border-[#c9a65d] transition-transform duration-300"
            style={{ transform: `rotate(${turns * 90}deg)` }}
          >
            <span className="absolute top-1/2 left-[-0.9rem] h-1 w-4 -translate-y-1/2 bg-[#c9a65d]" />
          </span>
        </div>
        <After reduce={reduce} className="mt-5 text-[0.9375rem]">
          {playing ? `En ${event.city}, a bailar.` : "Dale cuerda tres veces para que suene."}
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={wind}
            disabled={playing}
            className="mt-3 rounded-full bg-[#7a2e3e] px-6 py-2.5 text-[0.9375rem] font-medium text-white disabled:opacity-70"
          >
            {playing ? "Sonando…" : `Dar cuerda (${turns}/3)`}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Farolillo de papel: se enciende y sube ─────────────── */

function LanternCover({ event, onOpen, reduce }: ConceptProps) {
  const [rise, setRise] = useState(0);
  const lit = rise > 0;
  const up = rise >= 0.98;
  const light = () => {
    if (lit) return;
    haptic([10, 40, 10]);
    playNotes([523, 659, 784], "sine", 0.22);
    if (reduce) {
      setRise(1);
      return;
    }
    animate(0.01, 1, { duration: 2.6, ease: [0.25, 1, 0.5, 1], onUpdate: setRise });
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,#160f2e,#2b1d4a_60%,#4a2c4f)]"
      />
      {/* Otros farolillos, lejos, ya en el cielo. */}
      {[
        [14, 18, 0.5],
        [78, 12, 0.4],
        [64, 30, 0.6],
        [24, 40, 0.35],
      ].map(([x, y, s], i) => (
        <span
          key={i}
          aria-hidden
          className="absolute block h-4 w-3 rounded-[40%] bg-[#ffb35c] shadow-[0_0_14px_4px_rgb(255_170_80/0.55)]"
          style={{ left: `${x}%`, top: `${y}%`, transform: `scale(${s})` }}
        />
      ))}
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#f6ead8]">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Un deseo para</p>
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
          data-lantern={up ? "en-el-cielo" : lit ? "subiendo" : "apagado"}
          onPointerDown={(e) => {
            stop(e);
            light();
          }}
          className="relative mt-2 h-[min(42svh,19rem)] w-full cursor-pointer"
        >
          <div
            className="absolute left-1/2 flex -translate-x-1/2 flex-col items-center"
            style={{ bottom: `${4 + rise * 34}%` }}
          >
            <div
              className={`relative flex h-32 w-24 flex-col items-center justify-center rounded-t-[45%] rounded-b-[18%] px-2 text-[#5a2a10] ${lit ? "bg-[radial-gradient(circle_at_50%_70%,#fff1c9,#ffb35c_70%)] shadow-[0_0_40px_14px_rgb(255_170_80/0.45)]" : "bg-[#e8d6bd]"}`}
            >
              <span className="text-[0.625rem] tracking-[0.16em] uppercase">Pedid un deseo</span>
              <span className="mt-1 text-[0.8125rem] leading-tight font-semibold" translate="no">
                {hostsOf(event).first}
                <br />♥<br />
                {hostsOf(event).second}
              </span>
            </div>
            <span className="h-2 w-14 rounded-b-[4px] bg-[#7a4a2c]" />
            {lit ? (
              <span className="mt-[-2px] block size-3 rounded-full bg-[#ffdd8a] shadow-[0_0_12px_4px_rgb(255_200_100/0.8)]" />
            ) : null}
          </div>
        </div>
        <After reduce={reduce} className="mt-2 text-[0.9375rem]">
          {up ? "Que se cumpla el" : "Enciende la mecha y suéltalo."}
          <span className="block text-[1.0625rem] font-semibold">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>, en {event.city}
          </span>
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={light}
            disabled={lit}
            className="mt-3 rounded-full bg-[#ffb35c] px-6 py-2.5 text-[0.9375rem] font-medium text-[#2b1407] disabled:opacity-70"
          >
            {up ? "Deseo pedido" : lit ? "Subiendo…" : "Encender el farolillo"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Barco de papel: se suelta y navega hasta el lugar ─────────────── */

function PaperBoatCover({ event, onOpen, reduce }: ConceptProps) {
  const [sail, setSail] = useState(0);
  const sailing = sail > 0;
  const arrived = sail >= 0.98;
  const venue = event.venues.at(-1)?.name ?? event.city;
  const launch = () => {
    if (sailing) return;
    playPaper(0.5);
    const done = () => haptic([10, 30, 10]);
    if (reduce) {
      setSail(1);
      done();
      return;
    }
    animate(0.01, 1, { duration: 2.8, ease: "easeInOut", onUpdate: setSail, onComplete: done });
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,#f4efe4,#e9e1d0_50%,#b9d3d6_50%,#8fb7bd)]"
      />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Rumbo a la boda de</p>
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
          <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>
        </p>
        <div
          data-boat={arrived ? "en-puerto" : sailing ? "navegando" : "en-la-orilla"}
          onPointerDown={(e) => {
            stop(e);
            launch();
          }}
          className="relative mt-auto mb-2 h-40 w-full cursor-pointer"
        >
          {/* El muelle de destino, con el nombre del lugar. */}
          <div className="absolute top-2 right-0 flex flex-col items-end">
            <span className="rounded-[3px] bg-[#1f3b44] px-2 py-1 text-[0.75rem] font-semibold text-[#f4efe4]">
              {venue}
            </span>
            <span className="mr-3 h-10 w-1.5 bg-[#5b4a3a]" />
          </div>
          <svg
            viewBox="0 0 120 70"
            aria-hidden
            className={`absolute bottom-6 w-28 ${sailing && !arrived && !reduce ? "animate-[boat-bob_1.2s_ease-in-out_infinite]" : ""}`}
            style={{ left: `calc(${sail * 62}% )` }}
          >
            <path d="M8 40h104L94 64H26z" fill="#fbfaf6" stroke="#8a8170" strokeWidth="1.2" />
            <path d="M60 4L60 40H24z" fill="#efe9dc" stroke="#8a8170" strokeWidth="1.2" />
            <path d="M60 4l30 36H60z" fill="#fbfaf6" stroke="#8a8170" strokeWidth="1.2" />
            <path d="M40 40l20-12 20 12" fill="none" stroke="#8a8170" strokeWidth="1" />
          </svg>
          <span
            aria-hidden
            className="absolute inset-x-[-1.5rem] bottom-0 h-8 bg-[repeating-radial-gradient(circle_at_50%_-60%,transparent_0_14px,rgb(255_255_255/0.35)_15px_16px)]"
          />
        </div>
        <After reduce={reduce} className="text-[0.9375rem]">
          {arrived
            ? `Ha llegado a ${event.city}. Te esperamos en el muelle.`
            : "Suelta el barco y mira dónde atraca."}
        </After>
        <div className="flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={launch}
            disabled={sailing}
            className="mt-3 rounded-full bg-[#1f3b44] px-6 py-2.5 text-[0.9375rem] font-medium text-[#f4efe4] disabled:opacity-70"
          >
            {arrived ? "En puerto" : sailing ? "Navegando…" : "Soltar el barco"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

export const TWELFTH_NEW_COVERS = {
  musica: MusicBoxCover,
  farolillo: LanternCover,
  barco: PaperBoatCover,
};
