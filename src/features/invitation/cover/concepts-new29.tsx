"use client";

import { useState, type PointerEvent } from "react";
import type { WeddingEvent } from "@/lib/domain/types";
import { hostNames, hostsOf } from "@/lib/event-kind";
import { formatLongDate, isoDay } from "@/lib/format";
import { haptic, playNotes, playPaper } from "../effects/sound";
import { After, FRAUNCES, OpenHint, PLAYFAIR, SANS, type ConceptProps } from "./concept-kit";

/*
 * Portadas de concepto de la trigésima tanda (ronda 38): un tendedero con fotos colgadas que se
 * descuelgan, una máquina de chicles y una diana de dardos.
 */

const names = (event: WeddingEvent, joiner = " y ") => hostNames(hostsOf(event), joiner);
const stop = (e: PointerEvent) => e.stopPropagation();

/* ─────────────── Tendedero: se quitan las pinzas y se leen las fotos ─────────────── */

function ClotheslineCover({ event, onOpen, reduce }: ConceptProps) {
  const [taken, setTaken] = useState(0);
  const done = taken >= 3;
  const ceremony = event.program[0];
  const cards = [
    { title: "Cuándo", text: formatLongDate(event.date), rot: -6 },
    { title: "Dónde", text: event.city, rot: 4 },
    { title: "A qué hora", text: ceremony ? `A las ${ceremony.time}` : "Por la tarde", rot: -3 },
  ];
  const take = () => {
    if (done) return;
    setTaken(taken + 1);
    playPaper(0.12);
    haptic(8);
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,#dcefff,#f6f3ea_70%)]"
      />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#1f2a33]">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Tendido al sol</p>
        <h1
          id="cover-title"
          tabIndex={-1}
          translate="no"
          className="mt-1 text-[clamp(2.1rem,9.4vw,2.8rem)] leading-[1.02] italic outline-none"
          style={{ fontFamily: PLAYFAIR }}
        >
          {names(event)}
        </h1>
        <p className="mt-1 text-[0.9375rem]">
          <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>
        </p>
        <div
          data-tendedero={done ? "recogido" : `fotos-${taken}`}
          onPointerDown={(e) => {
            stop(e);
            take();
          }}
          className="relative mt-6 h-64 w-full cursor-pointer"
        >
          {/* La cuerda, combada, de lado a lado. */}
          <svg
            viewBox="0 0 100 20"
            preserveAspectRatio="none"
            aria-hidden
            className="absolute inset-x-[-1.5rem] top-2 h-10 w-[calc(100%+3rem)]"
          >
            <path d="M0 2Q50 18 100 2" stroke="#8a7a5a" strokeWidth="0.6" fill="none" />
          </svg>
          <div className="absolute inset-x-0 top-6 flex justify-center gap-3">
            {cards.map((c, i) => {
              const down = i < taken;
              return (
                <div key={c.title} className="flex flex-col items-center">
                  <span
                    aria-hidden
                    className="mb-[-6px] block h-4 w-2 rounded-[2px] bg-[#c9a24f]"
                  />
                  <div
                    className="flex h-28 w-24 flex-col items-center justify-center rounded-[3px] bg-[#fffaf0] p-2 shadow-[0_6px_12px_-6px_rgb(0_0_0/0.3)] ring-4 ring-white transition-transform duration-500"
                    style={{
                      transform: down
                        ? `translateY(56px) rotate(${c.rot * 2}deg)`
                        : `rotate(${c.rot}deg)`,
                      transitionDuration: reduce ? "0ms" : undefined,
                    }}
                  >
                    <span className="text-[0.625rem] tracking-[0.14em] uppercase">{c.title}</span>
                    <span
                      className="mt-1 text-[0.8125rem] leading-tight font-semibold"
                      style={{ fontFamily: PLAYFAIR }}
                    >
                      {c.text}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <After reduce={reduce} className="text-[0.9375rem]">
          {done
            ? "Todo recogido: ya sabes cuándo, dónde y a qué hora."
            : "Quita las pinzas y recoge las fotos."}
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={take}
            disabled={done}
            className="mt-3 rounded-full bg-[#2f5a78] px-6 py-2.5 text-[0.9375rem] font-medium text-white disabled:opacity-70"
          >
            {done ? "Todo recogido" : `Quitar una pinza (${taken}/3)`}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Máquina de chicles: se gira la manivela y sale la bola ─────────────── */

const GUMS = Array.from({ length: 22 }, (_, i) => ({
  x: 18 + ((i * 37) % 64),
  y: 20 + ((i * 23) % 60),
  c: ["#ff5d8f", "#ffc93c", "#4cc9f0", "#7bd389", "#b388ff", "#ff8a3d"][i % 6],
}));

function GumballCover({ event, onOpen, reduce }: ConceptProps) {
  const [out, setOut] = useState(false);
  const crank = () => {
    if (out) return;
    setOut(true);
    playNotes([330, 392, 494, 659], "square", 0.08);
    haptic([20, 10, 20]);
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div
        aria-hidden
        className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#fbe9ee_0_20px,#f8dde4_20px_40px)]"
      />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#3a1624]">
        <p className="rounded-full bg-[#fff4f6] px-3 text-[0.75rem] tracking-[0.22em] uppercase">
          Una moneda por
        </p>
        <h1
          id="cover-title"
          tabIndex={-1}
          translate="no"
          className="mt-1 rounded-[6px] bg-[#fff4f6] px-2 text-[clamp(2.1rem,9.4vw,2.8rem)] leading-[1.02] outline-none"
          style={{ fontFamily: FRAUNCES }}
        >
          {names(event)}
        </h1>
        <div
          data-chicles={out ? "bola-fuera" : "llena"}
          onPointerDown={(e) => {
            stop(e);
            crank();
          }}
          className="relative mt-4 flex cursor-pointer flex-col items-center"
        >
          {/* El globo de cristal lleno de bolas. */}
          <div className="relative size-48 overflow-hidden rounded-full border-4 border-white bg-[rgb(255_255_255/0.4)] shadow-[inset_0_0_20px_rgb(255_255_255/0.8)]">
            {GUMS.map((g, i) => (
              <span
                key={i}
                aria-hidden
                className="absolute block size-6 rounded-full"
                style={{ left: `${g.x}%`, top: `${g.y}%`, background: g.c }}
              />
            ))}
          </div>
          {/* El cuerpo rojo con la manivela y la boca de salida. */}
          <div className="relative -mt-2 flex h-24 w-36 flex-col items-center justify-start rounded-t-[4px] rounded-b-[12px] bg-[#c62848] pt-3">
            <span
              aria-hidden
              className="block size-9 rounded-full border-4 border-[#f4f4f4] bg-[#9aa0a8] transition-transform duration-500"
              style={{
                transform: out ? "rotate(360deg)" : "none",
                transitionDuration: reduce ? "0ms" : undefined,
              }}
            >
              <span className="mx-auto mt-0.5 block h-6 w-1.5 rounded-full bg-[#f4f4f4]" />
            </span>
            <span aria-hidden className="mt-2 block h-6 w-10 rounded-t-[8px] bg-[#7a1428]" />
          </div>
          {out ? (
            <span className="mt-2 flex size-16 items-center justify-center rounded-full bg-[#ff5d8f] text-[0.6875rem] leading-tight font-semibold text-[#3a0a1a] shadow-[inset_-4px_-4px_0_rgb(0_0_0/0.1)]">
              ¡Sí!
            </span>
          ) : null}
        </div>
        <After
          reduce={reduce}
          className="mt-3 rounded-[6px] bg-[#fff4f6] px-2 py-1 text-[0.9375rem]"
        >
          {out ? "Ha salido la bola buena:" : "Gira la manivela."}
          <span className="block text-[1.0625rem] font-semibold">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>, en {event.city}
          </span>
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={crank}
            disabled={out}
            className="mt-3 rounded-full bg-[#a81e3c] px-6 py-2.5 text-[0.9375rem] font-medium text-white disabled:opacity-70"
          >
            {out ? "¡Bola fuera!" : "Girar la manivela"}
          </button>
          <div className="rounded-full bg-[#fff4f6]">
            <OpenHint onOpen={onOpen} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Diana: se lanza el dardo y da en el centro ─────────────── */

function DartboardCover({ event, onOpen, reduce }: ConceptProps) {
  const [hit, setHit] = useState(false);
  const throwDart = () => {
    if (hit) return;
    setHit(true);
    haptic([4, 4, 30]);
    playNotes([1046, 1568], "triangle", 0.08);
  };
  const rings = ["#1e1e1e", "#f3ead2", "#c62828", "#f3ead2", "#2f7a4f", "#c62828"];

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#3a2a1e,#1a120c_75%)]"
      />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#f6eedc]">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Han dado en el blanco</p>
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
          data-diana={hit ? "en-el-centro" : "sin-tirar"}
          onPointerDown={(e) => {
            stop(e);
            throwDart();
          }}
          className="relative mt-6 size-64 cursor-pointer"
        >
          <svg viewBox="-50 -50 100 100" aria-hidden className="size-full">
            {rings.map((c, i) => (
              <circle key={i} r={46 - i * 7.6} fill={c} />
            ))}
            <circle r="3.2" fill="#1e1e1e" />
            {Array.from({ length: 20 }, (_, i) => (
              <path
                key={i}
                d="M0 0V-46"
                stroke="#b9a37a"
                strokeWidth="0.4"
                transform={`rotate(${i * 18})`}
              />
            ))}
          </svg>
          {/* El dardo: llega desde abajo a la derecha y se clava en el centro. */}
          <svg
            viewBox="0 0 80 16"
            aria-hidden
            className="absolute top-1/2 left-1/2 w-28 origin-left transition-transform duration-500"
            style={{
              transform: hit
                ? "rotate(-30deg) translate(0, -50%)"
                : "translate(96px, 70px) rotate(-30deg)",
              transitionDuration: reduce ? "0ms" : undefined,
            }}
          >
            <path d="M0 8L14 6V10Z" fill="#9aa0a8" />
            <rect x="14" y="6" width="40" height="4" rx="2" fill="#d4af37" />
            <path d="M54 8L80 0V16Z" fill="#c62828" />
          </svg>
        </div>
        <After reduce={reduce} className="mt-4 text-[0.9375rem]">
          {hit ? "¡Diana! Justo en el centro del" : "Lanza el dardo."}
          <span className="block text-[1.0625rem] font-semibold">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>, en {event.city}
          </span>
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={throwDart}
            disabled={hit}
            className="mt-3 rounded-full bg-[#d4af37] px-6 py-2.5 text-[0.9375rem] font-medium text-[#1a120c] disabled:opacity-70"
          >
            {hit ? "¡Diana!" : "Lanzar el dardo"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

export const TWENTYNINTH_NEW_COVERS = {
  tendedero: ClotheslineCover,
  chicles: GumballCover,
  dardos: DartboardCover,
};
