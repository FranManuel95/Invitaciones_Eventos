"use client";

import { useState, type PointerEvent } from "react";
import type { WeddingEvent } from "@/lib/domain/types";
import { hostNames, hostsOf } from "@/lib/event-kind";
import { formatLongDate, isoDay } from "@/lib/format";
import { haptic, playNotes, playPaper } from "../effects/sound";
import { After, FRAUNCES, OpenHint, PLAYFAIR, SANS, type ConceptProps } from "./concept-kit";

/*
 * Portadas de concepto de la decimonovena tanda (ronda 38): un cascanueces que abre la nuez con
 * la fecha, una hamaca entre palmeras que se mece y una cesta de pícnic con el menú dentro.
 */

const names = (event: WeddingEvent, joiner = " y ") => hostNames(hostsOf(event), joiner);
const stop = (e: PointerEvent) => e.stopPropagation();

/* ─────────────── Cascanueces: se baja la palanca y la nuez se abre ─────────────── */

function NutcrackerCover({ event, onOpen, reduce }: ConceptProps) {
  const [cracked, setCracked] = useState(false);
  const crack = () => {
    if (cracked) return;
    setCracked(true);
    haptic([30, 20, 10]);
    playNotes([784, 659, 523, 659, 784], "triangle", 0.1);
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,#2c4a3a,#122319_75%)]"
      />
      {/* Copos de nieve quietos, como en un escaparate de Navidad. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle,rgb(255_255_255/0.5)_0_1.5px,transparent_2px)] bg-[length:46px_46px] opacity-40"
      />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#f4ead6]">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Cuento de invierno de</p>
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
          data-cascanueces={cracked ? "abierta" : "entera"}
          onPointerDown={(e) => {
            stop(e);
            crack();
          }}
          className="relative mt-6 flex h-60 w-full cursor-pointer items-end justify-center gap-6"
        >
          {/* El soldadito: gorro alto, chaqueta roja y la mandíbula que baja. */}
          <svg viewBox="0 0 60 150" aria-hidden className="h-56">
            <rect x="18" y="0" width="24" height="34" rx="3" fill="#1a1a1a" />
            <rect x="16" y="30" width="28" height="5" fill="#d4af37" />
            <rect x="19" y="35" width="22" height="22" rx="4" fill="#f2d2b6" />
            <circle cx="25" cy="44" r="1.8" fill="#1a1a1a" />
            <circle cx="35" cy="44" r="1.8" fill="#1a1a1a" />
            <rect x="21" y="50" width="18" height="4" fill="#fff" />
            <g
              className="transition-transform duration-300"
              style={{
                transform: cracked ? "translateY(6px)" : "none",
                transitionDuration: reduce ? "0ms" : undefined,
              }}
            >
              <rect x="21" y="55" width="18" height="6" fill="#f2d2b6" />
              <rect x="20" y="59" width="20" height="4" fill="#fff" />
            </g>
            <rect x="14" y="62" width="32" height="40" rx="4" fill="#b8232f" />
            <path d="M30 62v40" stroke="#d4af37" strokeWidth="2" />
            <rect x="14" y="98" width="32" height="5" fill="#1a1a1a" />
            <rect x="17" y="103" width="11" height="40" fill="#1f3a6b" />
            <rect x="32" y="103" width="11" height="40" fill="#1f3a6b" />
            <rect x="12" y="140" width="36" height="8" rx="2" fill="#1a1a1a" />
          </svg>
          {/* La nuez: entera, o partida con la fecha dentro. */}
          <div className="mb-2 flex flex-col items-center">
            {cracked ? (
              <div className="flex items-end gap-1">
                <span
                  aria-hidden
                  className="block h-10 w-8 -rotate-12 rounded-l-full bg-[#8a5a2c]"
                />
                <span className="rounded-[4px] bg-[#f4ead6] px-2 py-1 text-[0.6875rem] font-semibold text-[#3a2416]">
                  ¡Sí!
                </span>
                <span
                  aria-hidden
                  className="block h-10 w-8 rotate-12 rounded-r-full bg-[#8a5a2c]"
                />
              </div>
            ) : (
              <span
                aria-hidden
                className="block h-12 w-14 rounded-[45%] bg-[radial-gradient(circle_at_35%_30%,#b07a42,#6b4320)]"
              />
            )}
          </div>
        </div>
        <After reduce={reduce} className="mt-4 text-[0.9375rem]">
          {cracked
            ? "Dentro de la nuez venía la fecha:"
            : "Dale al cascanueces para abrir la nuez."}
          <span className="block text-[1.0625rem] font-semibold">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>, en {event.city}
          </span>
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={crack}
            disabled={cracked}
            className="mt-3 rounded-full bg-[#d4af37] px-6 py-2.5 text-[0.9375rem] font-medium text-[#1a1408] disabled:opacity-70"
          >
            {cracked ? "Nuez abierta" : "Partir la nuez"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Hamaca: se mece entre dos palmeras ─────────────── */

function HammockCover({ event, onOpen, reduce }: ConceptProps) {
  const [rocking, setRocking] = useState(false);
  const rock = () => {
    if (rocking) return;
    setRocking(true);
    playPaper(0.6);
    haptic([8, 40, 8]);
  };
  const hosts = hostsOf(event);
  const palm = (flip: boolean) => (
    <svg viewBox="0 0 60 200" aria-hidden className={`h-64 ${flip ? "-scale-x-100" : ""}`}>
      <path d="M30 200C26 150 34 90 26 40" stroke="#6b4a2a" strokeWidth="6" fill="none" />
      <path
        d="M26 40C10 30-4 40-6 52M26 40C40 26 58 30 66 44M26 40C20 22 26 8 40 2M26 40C12 22 0 18-6 22"
        stroke="#2f6b3f"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,#ffd7a8,#ffb38a_40%,#f6e3c4_70%,#e9d3a6)]"
      />
      <span
        aria-hidden
        className="absolute top-[24%] left-1/2 block size-24 -translate-x-1/2 rounded-full bg-[#ffef9f] opacity-80"
      />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#3a2416]">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Sin prisa, se casan</p>
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
          data-hamaca={rocking ? "meciendose" : "quieta"}
          onPointerDown={(e) => {
            stop(e);
            rock();
          }}
          className="relative mt-2 flex w-full cursor-pointer items-end justify-between"
        >
          {palm(false)}
          {/* La hamaca: una curva de tela con los nombres bordados. */}
          <div
            className={`absolute top-[28%] left-1/2 w-[58%] origin-top -translate-x-1/2 ${rocking && !reduce ? "animate-[hammock-rock_2.8s_ease-in-out_infinite]" : ""}`}
          >
            <svg viewBox="0 0 200 60" aria-hidden className="w-full">
              <path d="M0 4Q100 70 200 4" stroke="#8a6a4a" strokeWidth="2" fill="none" />
              <path d="M12 10Q100 66 188 10L182 18Q100 74 18 18Z" fill="#e4572e" />
              <path d="M30 22Q100 60 170 22" stroke="#ffd166" strokeWidth="3" fill="none" />
            </svg>
            <span
              className="absolute inset-x-0 top-[62%] text-[0.75rem] font-semibold text-[#3a2416]"
              translate="no"
            >
              {hosts.first} &amp; {hosts.second}
            </span>
          </div>
          {palm(true)}
        </div>
        <After reduce={reduce} className="mt-2 text-[0.9375rem]">
          {rocking ? "Así, tranquilos, hasta el" : "Mece la hamaca y desconecta."}
          <span className="block text-[1.0625rem] font-semibold">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>, en {event.city}
          </span>
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={rock}
            disabled={rocking}
            className="mt-3 rounded-full bg-[#b5401f] px-6 py-2.5 text-[0.9375rem] font-medium text-white disabled:opacity-70"
          >
            {rocking ? "Meciéndose…" : "Mecer la hamaca"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Cesta de pícnic: se levanta la tapa y dentro está el menú ─────────────── */

function PicnicCover({ event, onOpen, reduce }: ConceptProps) {
  const [open, setOpen] = useState(false);
  const lift = () => {
    if (open) return;
    setOpen(true);
    playPaper(0.3);
    haptic(14);
  };
  const dishes = event.menu
    .filter((m) => !m.childrenOnly)
    .slice(0, 3)
    .map((m) => m.description);

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      {/* El mantel de cuadros sobre la hierba. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(0deg, rgb(200 50 50 / 0.16) 0 24px, transparent 24px 48px), repeating-linear-gradient(90deg, rgb(200 50 50 / 0.16) 0 24px, transparent 24px 48px), #fbf5ea",
        }}
      />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#3a2416]">
        <p className="rounded-full bg-[#fbf5ea] px-3 text-[0.75rem] tracking-[0.22em] uppercase">
          Pícnic de boda de
        </p>
        <h1
          id="cover-title"
          tabIndex={-1}
          translate="no"
          className="mt-1 rounded-[6px] bg-[#fbf5ea] px-3 text-[clamp(2.1rem,9.4vw,2.8rem)] leading-[1.02] outline-none"
          style={{ fontFamily: FRAUNCES }}
        >
          {names(event)}
        </h1>
        <div
          data-picnic={open ? "abierta" : "cerrada"}
          onPointerDown={(e) => {
            stop(e);
            lift();
          }}
          className="relative mt-8 h-56 w-64 cursor-pointer [perspective:800px]"
        >
          {/* El asa y la tapa de mimbre, que se levanta hacia atrás. */}
          <div
            className="absolute inset-x-2 top-10 h-16 origin-top rounded-t-[10px] bg-[repeating-linear-gradient(90deg,#c99a5b_0_6px,#b3854a_6px_12px)] ring-2 ring-[#7a5228] transition-transform duration-700"
            style={{
              transform: open ? "rotateX(-120deg) translateY(-6px)" : "none",
              transitionDuration: reduce ? "0ms" : undefined,
            }}
          >
            <span
              aria-hidden
              className="absolute -top-8 left-1/2 h-10 w-24 -translate-x-1/2 rounded-t-full border-[5px] border-b-0 border-[#7a5228]"
            />
          </div>
          <div className="absolute inset-x-0 bottom-0 flex h-36 flex-col items-center justify-center rounded-b-[12px] bg-[repeating-linear-gradient(0deg,#c99a5b_0_6px,#b3854a_6px_12px)] ring-2 ring-[#7a5228]">
            {open ? (
              <div className="w-[85%] rounded-[4px] bg-[#fffaf0] px-3 py-2 text-left shadow-[0_4px_10px_rgb(0_0_0/0.2)]">
                <p className="text-[0.625rem] tracking-[0.16em] uppercase">Dentro de la cesta</p>
                <ul className="mt-1 list-disc pl-4 text-[0.75rem] leading-snug">
                  {dishes.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <span className="rounded-[3px] bg-[#fffaf0] px-2 py-1 text-[0.75rem] font-semibold">
                <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>
              </span>
            )}
          </div>
        </div>
        <After
          reduce={reduce}
          className="mt-5 rounded-[6px] bg-[#fbf5ea] px-3 py-1 text-[0.9375rem]"
        >
          {open ? `El menú del día, en ${event.city}.` : "Levanta la tapa: hemos traído comida."}
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={lift}
            disabled={open}
            className="mt-3 rounded-full bg-[#a8243a] px-6 py-2.5 text-[0.9375rem] font-medium text-white disabled:opacity-70"
          >
            {open ? "Cesta abierta" : "Levantar la tapa"}
          </button>
          <div className="rounded-full bg-[#fbf5ea]">
            <OpenHint onOpen={onOpen} />
          </div>
        </div>
      </div>
    </div>
  );
}

export const EIGHTEENTH_NEW_COVERS = {
  cascanueces: NutcrackerCover,
  hamaca: HammockCover,
  picnic: PicnicCover,
};
