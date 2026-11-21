"use client";

import { animate } from "motion/react";
import Image from "next/image";
import { useRef, useState, type PointerEvent } from "react";
import type { WeddingEvent } from "@/lib/domain/types";
import { hostNames, hostsOf } from "@/lib/event-kind";
import { formatLongDate, isoDay } from "@/lib/format";
import { haptic, playPaper, playTick } from "../effects/sound";
import {
  Arrive,
  COURIER,
  dateParts,
  FRAUNCES,
  OpenHint,
  PLAYFAIR,
  SANS,
  type ConceptProps,
} from "./concept-kit";

/*
 * Portadas de concepto de la décima tanda (ronda 38): un puzle con vuestra foto que se completa
 * girando las piezas, una tarta nupcial de la que se corta una porción y una entrada de cine con
 * su matriz.
 */

const names = (event: WeddingEvent, joiner = " y ") => hostNames(hostsOf(event), joiner);
const stop = (e: PointerEvent) => e.stopPropagation();

/* ─────────────── Puzle: cada pieza se gira hasta encajar ─────────────── */

// Giro inicial de cada pieza (en cuartos de vuelta): siempre el mismo, para que sea justo.
const START_TURNS = [1, 0, 3, 2, 1, 3, 0, 2, 1];

function PuzzleCover({ event, onOpen, reduce }: ConceptProps) {
  const photo = event.coverPhoto ?? event.story.couplePhoto;
  const [turns, setTurns] = useState(START_TURNS);
  const solved = turns.every((t) => t % 4 === 0);

  const rotate = (i: number) => {
    if (turns[i]! % 4 === 0) return;
    playTick();
    setTurns((current) => {
      const next = current.map((t, k) => (k === i ? t + 1 : t));
      if (next.every((t) => t % 4 === 0)) {
        haptic([10, 30, 10, 30, 20]);
        playPaper(0.3);
      }
      return next;
    });
  };
  const solve = () => {
    setTurns((current) => current.map((t) => Math.ceil(t / 4) * 4 || 0));
    haptic([10, 30, 10, 30, 20]);
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="paper-grain absolute inset-0 opacity-50" />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-5 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Puzle de 9 piezas · La boda de</p>
        <h1
          id="cover-title"
          tabIndex={-1}
          translate="no"
          className="mt-1 text-[clamp(2rem,9vw,2.6rem)] leading-[1.02] font-semibold outline-none"
          style={{ fontFamily: FRAUNCES }}
        >
          {names(event)}
        </h1>
        <Arrive reduce={reduce} tilt={0} className="mt-4 w-[min(80vw,18rem)]">
          <div
            data-puzzle={solved ? "completo" : "revuelto"}
            className={`grid aspect-square grid-cols-3 rounded-[6px] bg-[#2d2a26] shadow-[0_20px_34px_-14px_rgb(20_20_20/0.6)] ${solved ? "gap-0 p-0" : "gap-1 p-1"}`}
          >
            {turns.map((t, i) => (
              <button
                key={i}
                type="button"
                tabIndex={-1}
                aria-hidden
                onPointerDown={stop}
                onClick={() => rotate(i)}
                className="relative overflow-hidden transition-transform duration-300"
                style={{ transform: `rotate(${t * 90}deg)` }}
              >
                {photo ? (
                  <span className="absolute inset-0 overflow-hidden">
                    <Image
                      src={photo}
                      alt=""
                      width={600}
                      height={600}
                      className="absolute max-w-none object-cover"
                      style={{
                        width: "300%",
                        height: "300%",
                        left: `${-(i % 3) * 100}%`,
                        top: `${-Math.floor(i / 3) * 100}%`,
                      }}
                    />
                  </span>
                ) : (
                  <span className="absolute inset-0 bg-[linear-gradient(135deg,#f2c9a0,#5b6f8a)]" />
                )}
              </button>
            ))}
          </div>
          <p className="mt-3 text-[0.9375rem]">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time> · {event.city}
          </p>
        </Arrive>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={solve}
            disabled={solved}
            className="mt-3 rounded-full bg-[#2d2a26] px-6 py-2.5 text-[0.9375rem] font-medium text-[#f4efe6] disabled:opacity-70"
          >
            {solved ? "¡Encaja!" : "Encajar las piezas"}
          </button>
          <p className="short-hide mt-1.5 text-[0.8125rem] italic">
            O toca cada pieza para girarla.
          </p>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Tarta nupcial: se corta una porción ─────────────── */

function CakeCover({ event, onOpen, reduce }: ConceptProps) {
  const [cut, setCut] = useState(0);
  const drag = useRef<{ y: number; start: number } | null>(null);
  const served = cut >= 0.98;
  const ceremony = event.program[0];
  const party = event.program.find((act) => /fiesta|baile|barra/i.test(act.title));
  const layers = [
    ["Piso de arriba", formatLongDate(event.date)],
    ["Piso del medio", event.city],
    ["Piso de abajo", ceremony ? `${ceremony.title}, ${ceremony.time}` : "Por la tarde"],
  ];

  const slice = (value: number) =>
    setCut((current) => {
      const next = Math.max(0, Math.min(1, value));
      if (next >= 0.98 && current < 0.98) {
        haptic([14, 30, 14]);
        playPaper(0.2);
      }
      return next;
    });
  const serve = () => {
    if (reduce) return slice(1);
    animate(cut, 1, { duration: 0.8, ease: [0.22, 1, 0.36, 1], onUpdate: slice });
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="paper-grain absolute inset-0 opacity-50" />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-5 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Pastelería del Sí · Encargo de</p>
        <h1
          id="cover-title"
          tabIndex={-1}
          translate="no"
          className="mt-1 text-[clamp(2rem,9vw,2.6rem)] leading-[1.02] italic outline-none"
          style={{ fontFamily: PLAYFAIR }}
        >
          {names(event)}
        </h1>
        {/* La tarta de tres pisos: la porción sale hacia la derecha al cortar. */}
        <div
          data-cake={served ? "servida" : "entera"}
          onPointerDown={(e) => {
            stop(e);
            drag.current = { y: e.clientY, start: cut };
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (!drag.current) return;
            e.stopPropagation();
            slice(drag.current.start + (e.clientY - drag.current.y) / 200);
          }}
          onPointerUp={() => {
            if (drag.current && Math.abs(cut - drag.current.start) < 0.03) serve();
            drag.current = null;
          }}
          className="relative mt-6 flex w-full cursor-ns-resize flex-col items-center"
          style={{ touchAction: "none" }}
        >
          {[0.42, 0.62, 0.82].map((w, i) => (
            <div
              key={w}
              className="relative h-14 rounded-[6px] border-b-4 border-[#e7d2c2] bg-[linear-gradient(180deg,#fffaf4,#f4e6da)] shadow-[0_4px_8px_-4px_rgb(0_0_0/0.2)]"
              style={{ width: `${w * 100}%` }}
            >
              {/* Festón de nata y una flor. */}
              <span className="absolute inset-x-0 top-0 h-2 bg-[radial-gradient(circle_at_50%_0,#fff_0_0.35rem,transparent_0.37rem)] bg-[length:0.7rem_0.5rem]" />
              {i === 0 ? (
                <span className="absolute -top-4 left-1/2 size-5 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,#f3c6cf_0_40%,#d98aa0)]" />
              ) : null}
              {/* La porción: un trozo del piso que se desplaza y deja ver el bizcocho. */}
              <span
                className="absolute top-0 right-[10%] h-full w-[18%] overflow-hidden rounded-[2px] bg-[repeating-linear-gradient(180deg,#f6e3c4_0_0.55rem,#e9c7a0_0.55rem_0.7rem,#fff6ea_0.7rem_0.95rem)] shadow"
                style={{
                  transform: `translate(${cut * 140}%, ${cut * 10}%) rotate(${cut * 8}deg)`,
                }}
              />
            </div>
          ))}
          <div className="mt-1 h-3 w-[92%] rounded-full bg-[#d9cbb8]" />
        </div>
        {/* El relleno de cada piso, que se lee al cortar. */}
        <dl className="mt-4 grid w-full max-w-[19rem] gap-1 text-[0.875rem]">
          {layers.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-3 border-b border-current/20 pb-1">
              <dt className="text-[0.75rem] tracking-[0.12em] uppercase">{label}</dt>
              <dd
                className={`font-semibold transition-opacity duration-500 ${served ? "" : "blur-[3px] select-none"}`}
              >
                {label === "Piso de arriba" ? (
                  <time dateTime={isoDay(event.date)}>{value}</time>
                ) : (
                  value
                )}
              </dd>
            </div>
          ))}
        </dl>
        {party ? (
          <p className="text-[0.8125rem] italic">Se sirve a las {party.time}, con baile.</p>
        ) : null}
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={serve}
            disabled={served}
            className="mt-3 rounded-full bg-[#b4566b] px-6 py-2.5 text-[0.9375rem] font-medium text-white disabled:opacity-70"
          >
            {served ? "Porción servida" : "Cortar la tarta"}
          </button>
          <p className="short-hide mt-1.5 text-[0.8125rem] italic">
            O desliza el cuchillo hacia abajo.
          </p>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Entrada de cine: se arranca la matriz ─────────────── */

function CinemaTicketCover({ event, onOpen, reduce }: ConceptProps) {
  const [torn, setTorn] = useState(false);
  const { dd, mm, yy } = dateParts(event.date);
  const ceremony = event.program[0];
  const tear = () => {
    if (torn) return;
    setTorn(true);
    haptic([20, 30, 10]);
    playPaper(0.3);
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_0%,rgb(255_220_150/0.25),transparent),linear-gradient(180deg,#3a0f16,#1d070b)]"
      />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-5 pt-[max(4.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center">
        <p className="text-[0.75rem] tracking-[0.22em] text-[#f3dfc0] uppercase">
          Estreno · Sesión única
        </p>
        <Arrive reduce={reduce} tilt={-2} className="mt-4 w-full max-w-[20rem]">
          <div
            data-ticket={torn ? "arrancada" : "entera"}
            onPointerDown={(e) => {
              stop(e);
              tear();
            }}
            className="flex cursor-pointer text-left text-[#3a0f16]"
            style={{ fontFamily: COURIER }}
          >
            <div className="flex-1 rounded-l-[8px] bg-[#f3dfc0] px-4 pt-3 pb-4">
              <p className="text-[0.625rem] font-bold tracking-[0.2em] uppercase">Cine Amor</p>
              <h1
                id="cover-title"
                tabIndex={-1}
                translate="no"
                className="mt-1 text-[clamp(1.5rem,7vw,1.95rem)] leading-tight font-bold outline-none"
                style={{ fontFamily: FRAUNCES }}
              >
                {names(event)}
              </h1>
              <p className="text-[0.75rem] italic">en «Felices para siempre»</p>
              <dl className="mt-3 grid grid-cols-3 gap-2 text-[0.75rem]">
                {[
                  ["Sesión", ceremony?.time ?? "—"],
                  ["Sala", event.city],
                  ["Fila", "La de la familia"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-[0.5625rem] tracking-[0.14em] uppercase">{label}</dt>
                    <dd className="leading-tight font-bold">{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-2 text-[0.75rem]">
                <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>
              </p>
            </div>
            {/* La matriz, con su borde troquelado: se arranca al tocarla. */}
            <div
              className="relative w-20 shrink-0 rounded-r-[8px] border-l-2 border-dashed border-[#3a0f16]/50 bg-[#ead2ad] px-2 py-3 text-center transition-transform duration-500"
              style={{
                transform: torn ? "translate(30%, 18%) rotate(14deg)" : "none",
                opacity: torn ? 0.85 : 1,
              }}
            >
              <p className="text-[0.5625rem] font-bold tracking-[0.14em] uppercase">Admite uno</p>
              <p className="mt-2 text-[1.25rem] leading-none font-bold">
                {dd}
                <span className="block text-[0.875rem]">
                  {mm}·{yy}
                </span>
              </p>
              <p className="mt-2 text-[0.5625rem] uppercase">Butaca de honor</p>
            </div>
          </div>
        </Arrive>
        <p className="short-hide mt-5 text-[0.875rem] text-[#f3dfc0]">
          Palomitas y abrazos incluidos. No se admiten devoluciones.
        </p>
        <div className="mt-auto flex w-full flex-col items-center text-[#f3dfc0]">
          <button
            type="button"
            onPointerDown={stop}
            onClick={tear}
            disabled={torn}
            className="mt-3 rounded-full bg-[#f3dfc0] px-6 py-2.5 text-[0.9375rem] font-medium text-[#3a0f16] disabled:opacity-70"
          >
            {torn ? "Adelante, la película empieza" : "Arrancar la entrada"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

export const NINTH_NEW_COVERS = {
  puzle: PuzzleCover,
  tarta: CakeCover,
  taquilla: CinemaTicketCover,
};
