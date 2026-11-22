"use client";

import { useState, type PointerEvent } from "react";
import type { WeddingEvent } from "@/lib/domain/types";
import { hostNames, hostsOf } from "@/lib/event-kind";
import { formatLongDate, isoDay } from "@/lib/format";
import { haptic, playNotes, playPaper } from "../effects/sound";
import { After, FRAUNCES, OpenHint, PLAYFAIR, SANS, type ConceptProps } from "./concept-kit";

/*
 * Portadas de concepto de la decimoctava tanda (ronda 38): un columpio que se empuja, un semáforo
 * que pasa de rojo a verde y un paraguas que se abre y deja de llover.
 */

const names = (event: WeddingEvent, joiner = " y ") => hostNames(hostsOf(event), joiner);
const stop = (e: PointerEvent) => e.stopPropagation();

/* ─────────────── Columpio: se empuja y, en lo más alto, se ve la fecha ─────────────── */

function SwingCover({ event, onOpen, reduce }: ConceptProps) {
  const [swinging, setSwinging] = useState(false);
  const push = () => {
    if (swinging) return;
    setSwinging(true);
    playPaper(0.3);
    haptic([10, 40, 10]);
  };
  const hosts = hostsOf(event);

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,#e4f0f4,#f4f1e4_70%,#c9d9a8)]"
      />
      {/* La rama del árbol, de la que cuelga el columpio. */}
      <span
        aria-hidden
        className="absolute top-[30%] left-[-10%] h-4 w-[120%] rotate-[-3deg] rounded-full bg-[#6b4f35]"
      />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#26331f]">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Columpiándose hacia el sí</p>
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
          data-columpio={swinging ? "en-marcha" : "quieto"}
          onPointerDown={(e) => {
            stop(e);
            push();
          }}
          className="relative mt-10 h-56 w-full cursor-pointer"
        >
          <div
            className={`absolute top-0 left-1/2 flex h-52 origin-top -translate-x-1/2 flex-col items-center ${swinging && !reduce ? "animate-[swing-arc_2.6s_ease-in-out_infinite]" : ""}`}
            style={swinging && reduce ? { transform: "rotate(18deg)" } : undefined}
          >
            <div className="flex w-36 flex-1 justify-between">
              <span aria-hidden className="w-0.5 bg-[#8a7a5a]" />
              <span aria-hidden className="w-0.5 bg-[#8a7a5a]" />
            </div>
            <div className="flex h-9 w-40 items-center justify-center rounded-[4px] bg-[#a8764a] text-[0.8125rem] font-semibold text-[#fff8ea] shadow-[0_8px_14px_-8px_rgb(60_40_20/0.6)]">
              <span translate="no">
                {hosts.first} ♥ {hosts.second}
              </span>
            </div>
          </div>
        </div>
        <After reduce={reduce} className="mt-4 text-[0.9375rem]">
          {swinging
            ? "¡Más alto! Nos vemos en lo más alto:"
            : "Empújalo y verás hasta dónde llega."}
          <span className="block text-[1.0625rem] font-semibold">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>, en {event.city}
          </span>
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={push}
            disabled={swinging}
            className="mt-3 rounded-full bg-[#4f6a35] px-6 py-2.5 text-[0.9375rem] font-medium text-white disabled:opacity-70"
          >
            {swinging ? "¡Columpiándose!" : "Empujar el columpio"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Semáforo: rojo, ámbar y verde ─────────────── */

const LIGHTS = [
  { id: "rojo", on: "#ff4b3e", label: "Guarda la fecha" },
  { id: "ambar", on: "#ffb627", label: "Confirma que vienes" },
  { id: "verde", on: "#3ddc84", label: "¡A la fiesta!" },
] as const;

function TrafficLightCover({ event, onOpen, reduce }: ConceptProps) {
  const [step, setStep] = useState(0);
  const go = step >= 2;
  const next = () => {
    if (go) return;
    const n = step + 1;
    setStep(n);
    haptic(12);
    playNotes(n >= 2 ? [660, 880] : [440], "sine", 0.12);
  };
  const current = LIGHTS[Math.min(step, 2)] ?? LIGHTS[0];

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,#2b2f38,#1a1d24)]" />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#f1f2f4]">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Vía libre para</p>
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
          data-semaforo={current.id}
          onPointerDown={(e) => {
            stop(e);
            next();
          }}
          className="mt-6 flex cursor-pointer flex-col items-center"
        >
          <div className="flex flex-col gap-3 rounded-[18px] bg-[#111317] p-4 ring-4 ring-[#3a3f4a]">
            {LIGHTS.map((light, i) => (
              <span
                key={light.id}
                aria-hidden
                className="block size-16 rounded-full transition-[background,box-shadow] duration-300"
                style={{
                  background: i === step ? light.on : "#2a2d34",
                  boxShadow:
                    i === step ? `0 0 30px 6px ${light.on}88` : "inset 0 2px 6px rgb(0 0 0 / 0.6)",
                  transitionDuration: reduce ? "0ms" : undefined,
                }}
              />
            ))}
          </div>
          <span aria-hidden className="h-16 w-3 bg-[#3a3f4a]" />
        </div>
        <After reduce={reduce} className="mt-4 text-[0.9375rem]">
          <span className="block text-[1.125rem] font-semibold">{current.label}</span>
          <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time> · {event.city}
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={next}
            disabled={go}
            className="mt-3 rounded-full bg-[#3ddc84] px-6 py-2.5 text-[0.9375rem] font-medium text-[#0d2a18] disabled:opacity-70"
          >
            {go ? "Vía libre" : "Cambiar de color"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Paraguas: se abre y deja de llover ─────────────── */

const DROPS = Array.from({ length: 40 }, (_, i) => ({
  x: (i * 41) % 100,
  delay: ((i * 17) % 12) / 10,
  dur: 0.7 + ((i * 7) % 6) / 10,
}));

function UmbrellaCover({ event, onOpen, reduce }: ConceptProps) {
  const [open, setOpen] = useState(false);
  const unfurl = () => {
    if (open) return;
    setOpen(true);
    playPaper(0.4);
    haptic([12, 30, 12]);
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div
        aria-hidden
        className="absolute inset-0 transition-[background] duration-700"
        style={{
          background: open
            ? "linear-gradient(180deg,#cfe6f2,#f6efe0)"
            : "linear-gradient(180deg,#8d9aa6,#c3cbd2)",
        }}
      />
      {!open && !reduce
        ? DROPS.map((d, i) => (
            <span
              key={i}
              aria-hidden
              className="absolute top-0 block h-5 w-px animate-[rain-fall_linear_infinite] bg-white/70"
              style={{
                left: `${d.x}%`,
                animationDuration: `${d.dur}s`,
                animationDelay: `${d.delay}s`,
              }}
            />
          ))
        : null}
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#1f2a33]">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Llueva o haga sol, se casan</p>
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
          data-paraguas={open ? "abierto" : "cerrado"}
          onPointerDown={(e) => {
            stop(e);
            unfurl();
          }}
          className="relative mt-8 flex h-60 w-full cursor-pointer flex-col items-center"
        >
          {/* La tela: plegada en un huso o abierta en cúpula. */}
          <svg
            viewBox="0 0 200 100"
            aria-hidden
            className="w-56 origin-bottom transition-transform duration-500"
            style={{
              transform: open ? "none" : "scaleX(0.14)",
              transitionDuration: reduce ? "0ms" : undefined,
            }}
          >
            <path
              d="M4 96C10 40 60 6 100 6s90 34 96 90c-14-10-30-10-40 0-12-10-30-10-40 0-12-10-28-10-40 0-12-10-30-10-40 0z"
              fill="#c8312b"
            />
            <path
              d="M100 6c-20 20-30 50-36 90M100 6c20 20 30 50 36 90M100 6v90"
              stroke="#8a1f1a"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
          <svg viewBox="0 0 20 120" aria-hidden className="h-32 w-5">
            <path
              d="M10 0v100c0 14-12 14-12 4"
              stroke="#3a2a1c"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <After reduce={reduce} className="mt-2 text-[0.9375rem]">
          {open ? "¡Ya no llueve! Nos vemos el" : "Llueve. Abre el paraguas."}
          <span className="block text-[1.0625rem] font-semibold">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>, en {event.city}
          </span>
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={unfurl}
            disabled={open}
            className="mt-3 rounded-full bg-[#c8312b] px-6 py-2.5 text-[0.9375rem] font-medium text-white disabled:opacity-70"
          >
            {open ? "Paraguas abierto" : "Abrir el paraguas"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

export const SEVENTEENTH_NEW_COVERS = {
  columpio: SwingCover,
  semaforo: TrafficLightCover,
  paraguas: UmbrellaCover,
};
