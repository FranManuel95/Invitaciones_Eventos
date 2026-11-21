"use client";

import { animate } from "motion/react";
import { useState, type PointerEvent } from "react";
import type { WeddingEvent } from "@/lib/domain/types";
import { hostNames, hostsOf } from "@/lib/event-kind";
import { formatLongDate, isoDay } from "@/lib/format";
import { haptic, playNotes, playPaper, playTick } from "../effects/sound";
import {
  Arrive,
  COURIER,
  dateParts,
  FRAUNCES,
  OpenHint,
  SANS,
  type ConceptProps,
} from "./concept-kit";

/*
 * Portadas de concepto de la séptima tanda (ronda 38): el plano de una línea de metro cuyas
 * paradas son el programa, la etiqueta de equipaje que se da la vuelta y la tarjeta de fidelidad
 * a la que le falta un sello para la «boda gratis».
 */

const names = (event: WeddingEvent, joiner = " y ") => hostNames(hostsOf(event), joiner);
const stop = (e: PointerEvent) => e.stopPropagation();

/* ─────────────── Metro: el tren recorre las paradas del programa ─────────────── */

function MetroCover({ event, onOpen, reduce }: ConceptProps) {
  const stops = [
    { time: "", title: "Vuestra casa" },
    ...event.program.slice(0, 4).map((act) => ({ time: act.time, title: act.title })),
  ];
  const [at, setAt] = useState(0);
  const arrived = at >= stops.length - 1;
  const spacing = 100 / (stops.length - 1);

  const ride = () => {
    if (arrived) return;
    playNotes([659.25, 523.25], "sine", 0.18);
    if (reduce) {
      setAt(stops.length - 1);
      haptic([10, 30, 10]);
      return;
    }
    animate(at, stops.length - 1, {
      duration: 0.6 * (stops.length - 1 - at),
      ease: "easeInOut",
      onUpdate: (v) =>
        setAt((current) => {
          if (Math.floor(v) !== Math.floor(current)) playTick();
          return v;
        }),
      onComplete: () => haptic([10, 30, 10]),
    });
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="paper-grain absolute inset-0 opacity-50" />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-5 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <Arrive
          reduce={reduce}
          tilt={0}
          className="w-full rounded-[6px] bg-white px-4 pt-3 pb-4 shadow-[0_22px_40px_-20px_rgb(20_20_40/0.45)]"
        >
          <div className="flex items-center gap-2">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#d4202f] text-[1.1rem] font-bold text-white">
              {hostsOf(event).first[0]}
            </span>
            <div className="min-w-0">
              <p className="text-[0.625rem] tracking-[0.18em] uppercase">Línea</p>
              <h1
                id="cover-title"
                tabIndex={-1}
                translate="no"
                className="truncate text-[clamp(1.35rem,6.4vw,1.8rem)] leading-tight font-bold outline-none"
              >
                {names(event)}
              </h1>
            </div>
          </div>
          {/* El plano: la línea roja de arriba abajo con sus paradas y el tren que avanza. */}
          <ol
            data-metro={arrived ? "llegada" : "en-ruta"}
            className="relative mt-4 ml-3 h-[min(40svh,17rem)]"
          >
            <span
              aria-hidden
              className="absolute top-0 bottom-0 left-[0.45rem] w-2 rounded-full bg-[#d4202f]"
            />
            {stops.map((s, i) => (
              <li
                key={s.title + i}
                className="absolute left-0 flex -translate-y-1/2 items-center gap-3"
                style={{ top: `${i * spacing}%` }}
              >
                <span
                  aria-hidden
                  className={`relative z-10 size-[1.4rem] rounded-full border-[4px] border-[#d4202f] ${i <= at ? "bg-[#d4202f]" : "bg-white"}`}
                />
                <span className="text-[0.9375rem] leading-tight">
                  <span className="font-semibold">{s.title}</span>
                  {s.time ? (
                    <span className="ml-2 text-[0.8125rem] tabular-nums">{s.time}</span>
                  ) : null}
                </span>
              </li>
            ))}
            {/* El tren. */}
            <span
              aria-hidden
              className="absolute left-[-0.55rem] z-20 grid h-6 w-[2.6rem] -translate-y-1/2 place-items-center rounded-[6px] bg-[#1f2433] text-[0.625rem] font-bold text-white shadow"
              style={{ top: `${at * spacing}%`, rotate: "90deg" }}
            >
              ▶
            </span>
          </ol>
          <p className="mt-3 border-t border-[#1f2433]/20 pt-2 text-[0.8125rem]">
            Servicio especial:{" "}
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>, {event.city}
          </p>
        </Arrive>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={ride}
            disabled={arrived}
            className="mt-3 rounded-full bg-[#d4202f] px-6 py-2.5 text-[0.9375rem] font-medium text-white disabled:opacity-70"
          >
            {arrived ? "Fin de trayecto: ¡a bailar!" : "Subir al tren"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Etiqueta de equipaje: se le da la vuelta ─────────────── */

function LuggageTagCover({ event, onOpen, reduce }: ConceptProps) {
  const [back, setBack] = useState(false);
  const { dd, mm, yy } = dateParts(event.date);
  const turn = () => {
    setBack((v) => !v);
    playPaper(0.2);
    haptic(12);
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="paper-grain absolute inset-0 opacity-60" />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center">
        {/* El asa de la maleta de cuero y el cordel. */}
        <span
          aria-hidden
          className="h-10 w-28 rounded-t-[2rem] border-[8px] border-b-0 border-[#6b4226]"
        />
        <span aria-hidden className="h-8 w-[2px] bg-[#9c7a4a]" />
        <Arrive reduce={reduce} tilt={-4} className="w-[min(78vw,17.5rem)]">
          <div
            data-tag={back ? "detras" : "delante"}
            onPointerDown={(e) => {
              stop(e);
              turn();
            }}
            className="relative aspect-[1/1.55] w-full cursor-pointer [perspective:900px]"
          >
            <div
              className="absolute inset-0 transition-transform duration-700 [transform-style:preserve-3d]"
              style={{ transform: back ? "rotateY(180deg)" : "none" }}
            >
              {/* Delante: la etiqueta de cartón con sus datos. */}
              <div
                className="absolute inset-0 rounded-[14px_14px_8px_8px] bg-[#e9d7b0] px-4 pt-8 pb-4 text-left text-[#2c2418] shadow-[0_22px_36px_-16px_rgb(40_30_10/0.6)] [backface-visibility:hidden]"
                style={{ fontFamily: COURIER }}
              >
                <span
                  aria-hidden
                  className="absolute top-3 left-1/2 size-4 -translate-x-1/2 rounded-full border-2 border-[#9c7a4a] bg-[#f6ead0]"
                />
                <p className="border-b-2 border-[#2c2418] pb-1 text-[0.75rem] font-bold tracking-[0.18em] uppercase">
                  Equipaje de mano
                </p>
                <p className="mt-3 text-[0.625rem] tracking-[0.16em] uppercase">Pasajeros</p>
                <h1
                  id="cover-title"
                  tabIndex={-1}
                  translate="no"
                  className="text-[clamp(1.5rem,7vw,1.95rem)] leading-tight font-bold outline-none"
                  style={{ fontFamily: FRAUNCES }}
                >
                  {names(event)}
                </h1>
                <p className="mt-3 text-[0.625rem] tracking-[0.16em] uppercase">Destino</p>
                <p className="text-[1.25rem] font-bold uppercase">{event.city}</p>
                <p className="mt-3 text-[0.625rem] tracking-[0.16em] uppercase">Contenido</p>
                <p className="text-[0.875rem]">Amor. Frágil, no doblar.</p>
                <p className="absolute right-4 bottom-4 text-[0.75rem]">Dale la vuelta ↻</p>
              </div>
              {/* Detrás: la fecha, escrita a mano en grande. */}
              <div className="absolute inset-0 grid [transform:rotateY(180deg)] place-items-center rounded-[14px_14px_8px_8px] bg-[#d9c39a] px-4 text-[#2c2418] shadow-[0_22px_36px_-16px_rgb(40_30_10/0.6)] [backface-visibility:hidden]">
                <div>
                  <p
                    className="text-[0.6875rem] tracking-[0.18em] uppercase"
                    style={{ fontFamily: COURIER }}
                  >
                    Salida
                  </p>
                  <p
                    className="text-[3rem] leading-none font-bold"
                    style={{ fontFamily: FRAUNCES }}
                  >
                    {dd}·{mm}·{yy}
                  </p>
                  <p className="mt-2 text-[0.9375rem]">
                    <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>
                  </p>
                  <p className="mt-1 text-[0.8125rem]">
                    Hora de embarque: {event.program[0]?.time ?? "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Arrive>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={turn}
            className="mt-3 rounded-full bg-[#6b4226] px-6 py-2.5 text-[0.9375rem] font-medium text-[#f6ead0]"
          >
            {back ? "Ver los pasajeros" : "Dar la vuelta a la etiqueta"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Tarjeta de fidelidad: falta un sello para la boda gratis ─────────────── */

const STAMPS = 10;

function LoyaltyCardCover({ event, onOpen, reduce }: ConceptProps) {
  const [full, setFull] = useState(false);
  const stamp = () => {
    if (full) return;
    setFull(true);
    haptic([24, 30, 12]);
    playPaper(0.15);
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="paper-grain absolute inset-0 opacity-60" />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-5 pt-[max(4.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center">
        <Arrive
          reduce={reduce}
          tilt={-3}
          className="w-full rounded-[12px] bg-[#f6efe2] px-4 pt-3 pb-4 text-[#3a2416] shadow-[0_22px_40px_-18px_rgb(50_30_15/0.55)] ring-2 ring-[#3a2416]/80 ring-inset"
        >
          <p className="text-[0.625rem] tracking-[0.22em] uppercase">
            Tarjeta de cliente · Café del Amor
          </p>
          <h1
            id="cover-title"
            tabIndex={-1}
            translate="no"
            className="mt-1 text-[clamp(1.7rem,8vw,2.2rem)] leading-tight font-semibold outline-none"
            style={{ fontFamily: FRAUNCES }}
          >
            {names(event)}
          </h1>
          <p className="text-[0.8125rem]">Al décimo sello, la boda va por cuenta de la casa.</p>
          <div data-card={full ? "completa" : "falta-uno"} className="mt-3 grid grid-cols-5 gap-2">
            {Array.from({ length: STAMPS }, (_, i) => {
              const last = i === STAMPS - 1;
              const done = !last || full;
              return (
                <button
                  key={i}
                  type="button"
                  tabIndex={-1}
                  aria-hidden
                  onPointerDown={stop}
                  onClick={last ? stamp : undefined}
                  className={`grid aspect-square place-items-center rounded-full border-2 border-dashed border-[#3a2416]/50 text-[1.1rem] ${last ? "cursor-pointer" : "cursor-default"}`}
                >
                  {done ? (
                    <span
                      className={`grid size-[86%] place-items-center rounded-full border-2 border-[#a3402a] text-[#a3402a] ${last ? "-rotate-12 font-bold" : "rotate-[8deg]"} transition-[opacity,transform] duration-300`}
                    >
                      {last ? "♥" : "☕"}
                    </span>
                  ) : (
                    <span className="text-[0.625rem] font-bold tracking-[0.1em] uppercase">
                      Boda
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-[0.875rem]">
            Canjeable el <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time> en{" "}
            {event.city}.
          </p>
        </Arrive>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={stamp}
            disabled={full}
            className="mt-3 rounded-full bg-[#a3402a] px-6 py-2.5 text-[0.9375rem] font-medium text-[#f6efe2] disabled:opacity-70"
          >
            {full ? "¡Boda gratis!" : "Poner el último sello"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

export const SIXTH_NEW_COVERS = {
  metro: MetroCover,
  equipaje: LuggageTagCover,
  fidelidad: LoyaltyCardCover,
};
