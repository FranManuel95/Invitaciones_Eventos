"use client";

import { animate } from "motion/react";
import { useState, type PointerEvent } from "react";
import type { WeddingEvent } from "@/lib/domain/types";
import { hostNames, hostsOf } from "@/lib/event-kind";
import { formatLongDate, isoDay } from "@/lib/format";
import { haptic, playNotes, playPaper } from "../effects/sound";
import { After, FRAUNCES, OpenHint, PLAYFAIR, SANS, type ConceptProps } from "./concept-kit";

/*
 * Portadas de concepto de la vigesimosexta tanda (ronda 38): una pecera donde los peces suben a
 * por la comida, un huerto que se riega y brota y el telefonillo del portal de los novios.
 */

const names = (event: WeddingEvent, joiner = " y ") => hostNames(hostsOf(event), joiner);
const stop = (e: PointerEvent) => e.stopPropagation();

/* ─────────────── Acuario: se echa comida y suben los peces ─────────────── */

function AquariumCover({ event, onOpen, reduce }: ConceptProps) {
  const [fed, setFed] = useState(false);
  const hosts = hostsOf(event);
  const feed = () => {
    if (fed) return;
    setFed(true);
    playNotes([784, 988], "sine", 0.1);
    haptic([6, 12, 6]);
  };
  const fish = (color: string, name: string, x: number, y: number, flip: boolean) => (
    <div
      className="absolute flex flex-col items-center transition-[top,left] duration-[1200ms] ease-out"
      style={{ left: `${x}%`, top: `${y}%`, transitionDuration: reduce ? "0ms" : undefined }}
    >
      <svg viewBox="0 0 50 30" aria-hidden className={`w-14 ${flip ? "-scale-x-100" : ""}`}>
        <path d="M6 15C14 2 34 2 40 15 34 28 14 28 6 15Z" fill={color} />
        <path d="M38 15l10-9v18z" fill={color} />
        <circle cx="14" cy="13" r="2" fill="#1a1a1a" />
      </svg>
      <span className="text-[0.6875rem] font-semibold text-[#0d2a3a]" translate="no">
        {name}
      </span>
    </div>
  );

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="absolute inset-0 bg-[#f1ece2]" />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#14303c]">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Como pez en el agua</p>
        <h1
          id="cover-title"
          tabIndex={-1}
          translate="no"
          className="mt-1 text-[clamp(2.1rem,9.4vw,2.8rem)] leading-[1.02] italic outline-none"
          style={{ fontFamily: PLAYFAIR }}
        >
          {names(event)}
        </h1>
        {/* La pecera: agua, arena, una planta y dos peces con nombre. */}
        <div
          data-acuario={fed ? "comiendo" : "nadando"}
          onPointerDown={(e) => {
            stop(e);
            feed();
          }}
          className="relative mt-5 h-64 w-72 cursor-pointer overflow-hidden rounded-[24px] border-4 border-[#b8d4dc] bg-[linear-gradient(180deg,#d9f0f5_0_12%,#7cc4d6_12%,#3c8fae)]"
        >
          <span aria-hidden className="absolute inset-x-0 bottom-0 h-8 bg-[#e9d6a8]" />
          <svg viewBox="0 0 30 80" aria-hidden className="absolute bottom-4 left-4 h-24">
            <path
              d="M15 80C5 60 25 50 10 30S20 10 15 0"
              stroke="#2f7a4f"
              strokeWidth="5"
              fill="none"
            />
          </svg>
          {fed
            ? [30, 46, 58, 70].map((x, i) => (
                <span
                  key={x}
                  aria-hidden
                  className="absolute top-[14%] block size-1.5 rounded-full bg-[#b8743a]"
                  style={{ left: `${x}%`, transform: `translateY(${i * 6}px)` }}
                />
              ))
            : null}
          {fish("#ff8a3d", hosts.first, fed ? 34 : 14, fed ? 20 : 56, false)}
          {fish("#ffd166", hosts.second ?? "", fed ? 54 : 64, fed ? 22 : 40, true)}
        </div>
        <After reduce={reduce} className="mt-4 text-[0.9375rem]">
          {fed
            ? "Suben juntos a la superficie. Nos vemos el"
            : "Echa un poco de comida a la pecera."}
          <span className="block text-[1.0625rem] font-semibold">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>, en {event.city}
          </span>
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={feed}
            disabled={fed}
            className="mt-3 rounded-full bg-[#1f6a85] px-6 py-2.5 text-[0.9375rem] font-medium text-white disabled:opacity-70"
          >
            {fed ? "Peces contentos" : "Dar de comer"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Huerto: se riega y brotan las letras ─────────────── */

function GardenCover({ event, onOpen, reduce }: ConceptProps) {
  const [grow, setGrow] = useState(0);
  const grown = grow >= 0.98;
  const hosts = hostsOf(event);
  const letters = `${hosts.first.charAt(0)}♥${(hosts.second ?? "").charAt(0)}`.split("");
  const water = () => {
    if (grow > 0) return;
    playPaper(0.9);
    const done = () => haptic([10, 30, 10]);
    if (reduce) {
      setGrow(1);
      done();
      return;
    }
    animate(0.01, 1, { duration: 2, ease: "easeOut", onUpdate: setGrow, onComplete: done });
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,#eaf3e0,#f6f1e2_60%,#8a6a46_60%,#6b5034)]"
      />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#22301c]">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Cultivado con cariño por</p>
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
          data-huerto={grown ? "brotado" : grow > 0 ? "creciendo" : "sembrado"}
          onPointerDown={(e) => {
            stop(e);
            water();
          }}
          className="relative mt-auto mb-2 h-56 w-full cursor-pointer"
        >
          {/* La regadera, que se inclina y deja caer el agua. */}
          <svg
            viewBox="0 0 90 60"
            aria-hidden
            className="absolute top-0 right-2 w-24 origin-bottom-left transition-transform duration-500"
            style={{
              transform: grow > 0 ? "rotate(-24deg)" : "none",
              transitionDuration: reduce ? "0ms" : undefined,
            }}
          >
            <path d="M24 20h40v34H24z" fill="#4a7a9a" />
            <path d="M24 26L2 10" stroke="#4a7a9a" strokeWidth="5" />
            <path d="M64 24c14 0 14 26 0 26" stroke="#4a7a9a" strokeWidth="4" fill="none" />
          </svg>
          {/* Tres brotes en fila que crecen y abren sus hojas con una letra. */}
          <div className="absolute inset-x-0 bottom-[34%] flex justify-center gap-10">
            {letters.map((l, i) => (
              <div key={i} className="flex flex-col items-center">
                <span
                  className="mb-1 flex size-9 items-center justify-center rounded-full bg-[#fbe6a8] text-[1rem] font-semibold text-[#3a2a10]"
                  style={{ transform: `scale(${grow})` }}
                  aria-hidden
                >
                  {l}
                </span>
                <span
                  aria-hidden
                  className="block w-1 rounded-full bg-[#4f8a3a]"
                  style={{ height: `${10 + grow * 50}px` }}
                />
              </div>
            ))}
          </div>
        </div>
        <After reduce={reduce} className="text-[0.9375rem] text-[#fbf3e6]">
          {grown ? `La cosecha será en ${event.city}.` : "Riega el huerto y mira qué brota."}
        </After>
        <div className="flex w-full flex-col items-center text-[#fbf3e6]">
          <button
            type="button"
            onPointerDown={stop}
            onClick={water}
            disabled={grow > 0}
            className="mt-3 rounded-full bg-[#fbf3e6] px-6 py-2.5 text-[0.9375rem] font-medium text-[#2f5a24] disabled:opacity-70"
          >
            {grown ? "¡Ha brotado!" : grow > 0 ? "Regando…" : "Regar el huerto"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Telefonillo: se llama al piso de los novios y contestan ─────────────── */

function IntercomCover({ event, onOpen, reduce }: ConceptProps) {
  const [rang, setRang] = useState(false);
  const hosts = hostsOf(event);
  const call = () => {
    if (rang) return;
    setRang(true);
    haptic([40, 60, 40]);
    playNotes([440, 440, 523], "square", 0.2);
  };
  const flats = [
    { label: "1.º A", name: "Familia Pérez" },
    { label: "1.º B", name: `${hosts.first} y ${hosts.second ?? ""}`, ours: true },
    { label: "2.º A", name: "Sr. Romero" },
    { label: "2.º B", name: "Lola y Marga" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div
        aria-hidden
        className="absolute inset-0 bg-[repeating-linear-gradient(0deg,#d9cdb8_0_22px,#cbbda4_22px_24px)]"
      />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#1f1a14]">
        <p className="rounded-full bg-[#f3ece0] px-3 text-[0.75rem] tracking-[0.22em] uppercase">
          ¿Quién es? Somos
        </p>
        <h1
          id="cover-title"
          tabIndex={-1}
          translate="no"
          className="mt-1 rounded-[6px] bg-[#f3ece0] px-2 text-[clamp(2.1rem,9.4vw,2.8rem)] leading-[1.02] italic outline-none"
          style={{ fontFamily: PLAYFAIR }}
        >
          {names(event)}
        </h1>
        {/* El panel de latón con la rejilla del altavoz y los botones de cada piso. */}
        <div
          data-telefonillo={rang ? "contestado" : "en-silencio"}
          className="mt-5 w-64 rounded-[10px] border-2 border-[#8a6a2a] bg-[linear-gradient(160deg,#e9cf8a,#c9a24f)] p-4 shadow-[0_18px_30px_-16px_rgb(60_40_10/0.6)]"
        >
          <div aria-hidden className="mx-auto mb-3 grid w-24 grid-cols-6 gap-1">
            {Array.from({ length: 18 }, (_, i) => (
              <span key={i} className="block size-2 rounded-full bg-[#5a4418]" />
            ))}
          </div>
          <ul className="space-y-1.5 text-left text-[0.8125rem]">
            {flats.map((f) => (
              <li
                key={f.label}
                className="flex items-center justify-between rounded-[4px] bg-[#fbf7ec] px-2 py-1"
              >
                <span translate="no">
                  <b>{f.label}</b> · {f.name}
                </span>
                <span
                  aria-hidden
                  className={`block size-4 rounded-full border-2 border-[#5a4418] ${f.ours && rang ? "bg-[#3ddc84]" : "bg-[#d9c48a]"}`}
                />
              </li>
            ))}
          </ul>
        </div>
        <After
          reduce={reduce}
          className="mt-4 rounded-[6px] bg-[#f3ece0] px-2 py-1 text-[0.9375rem]"
        >
          {rang
            ? "«¡Sube, sube! Bueno, mejor ven a la boda»:"
            : "Llama al 1.º B, a ver quién contesta."}
          <span className="block text-[1.0625rem] font-semibold">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>, en {event.city}
          </span>
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={call}
            disabled={rang}
            className="mt-3 rounded-full bg-[#5a4418] px-6 py-2.5 text-[0.9375rem] font-medium text-[#fbf7ec] disabled:opacity-70"
          >
            {rang ? "Han contestado" : "Llamar al 1.º B"}
          </button>
          <div className="rounded-full bg-[#f3ece0]">
            <OpenHint onOpen={onOpen} />
          </div>
        </div>
      </div>
    </div>
  );
}

export const TWENTYFIFTH_NEW_COVERS = {
  acuario: AquariumCover,
  huerto: GardenCover,
  portero: IntercomCover,
};
