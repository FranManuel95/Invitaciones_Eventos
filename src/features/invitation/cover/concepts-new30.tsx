"use client";

import { useState, type PointerEvent } from "react";
import type { WeddingEvent } from "@/lib/domain/types";
import { hostNames, hostsOf } from "@/lib/event-kind";
import { formatLongDate, isoDay } from "@/lib/format";
import { haptic, playNotes, playPaper } from "../effects/sound";
import { After, FRAUNCES, OpenHint, PLAYFAIR, SANS, type ConceptProps } from "./concept-kit";

/*
 * Portadas de concepto de la trigesimoprimera tanda (ronda 38): una linterna que descubre la fecha
 * en una habitación a oscuras, una caja fuerte de combinación y unos patines que llegan a la pista.
 */

const names = (event: WeddingEvent, joiner = " y ") => hostNames(hostsOf(event), joiner);
const stop = (e: PointerEvent) => e.stopPropagation();

/* ─────────────── Linterna: se enciende y el haz descubre la fecha ─────────────── */

function FlashlightCover({ event, onOpen, reduce }: ConceptProps) {
  const [on, setOn] = useState(false);
  const toggle = () => {
    if (on) return;
    setOn(true);
    haptic(15);
    playNotes([1318], "square", 0.05);
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="absolute inset-0 bg-[#0b0d12]" />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#eef1f6]">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Buscad bien, se casan</p>
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
          data-linterna={on ? "encendida" : "apagada"}
          onPointerDown={(e) => {
            stop(e);
            toggle();
          }}
          className="relative mt-4 h-80 w-full cursor-pointer"
        >
          {/* La pared: con la luz apagada solo se adivina; el haz la ilumina en círculo. */}
          <div
            className="absolute inset-x-0 top-0 flex h-48 flex-col items-center justify-center rounded-[8px] transition-[background] duration-500"
            style={{
              background: on
                ? "radial-gradient(circle at 50% 50%, #fff3c4 0 30%, #b9a26a 55%, #0b0d12 75%)"
                : "#12151c",
              transitionDuration: reduce ? "0ms" : undefined,
            }}
          >
            <span
              aria-hidden
              className="text-[1.25rem] font-semibold text-[#2a1f0c]"
              style={{ fontFamily: PLAYFAIR, visibility: on ? "visible" : "hidden" }}
            >
              ¡Sí, quiero!
            </span>
            <span
              aria-hidden
              className="text-[0.875rem] text-[#2a1f0c]"
              style={{ visibility: on ? "visible" : "hidden" }}
            >
              {event.city}
            </span>
          </div>
          {/* La linterna, abajo, apuntando a la pared. */}
          <svg
            viewBox="0 0 120 60"
            aria-hidden
            className="absolute bottom-14 left-1/2 w-28 -translate-x-1/2 -rotate-90"
          >
            <rect x="0" y="20" width="70" height="20" rx="4" fill="#3a4152" />
            <path d="M70 14h24l10 -8v48l-10 -8H70z" fill="#5a6272" />
            <circle cx="104" cy="30" r="10" fill={on ? "#fff3c4" : "#2a2e38"} />
            <rect x="24" y="16" width="12" height="6" rx="2" fill={on ? "#e4572e" : "#7a2a1a"} />
          </svg>
        </div>
        <After reduce={reduce} className="text-[0.9375rem] text-[#c9ced8]">
          {on
            ? "¡Ahí está lo que buscabas! Nos vemos el"
            : "Está todo a oscuras. Enciende la linterna."}
          <span className="block text-[1.0625rem] font-semibold text-[#eef1f6]">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>, en {event.city}
          </span>
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={toggle}
            disabled={on}
            className="mt-3 rounded-full bg-[#fff3c4] px-6 py-2.5 text-[0.9375rem] font-medium text-[#0b0d12] disabled:opacity-70"
          >
            {on ? "Linterna encendida" : "Encender la linterna"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Caja fuerte: la combinación es la fecha ─────────────── */

function SafeCover({ event, onOpen, reduce }: ConceptProps) {
  const [dial, setDial] = useState(0);
  const open = dial >= 3;
  const [dd = "00", mm = "00", yy = "00"] = new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    timeZone: "Europe/Madrid",
  })
    .format(new Date(event.date))
    .split("/");
  const code = [dd, mm, yy];
  const turn = () => {
    if (open) return;
    setDial(dial + 1);
    playNotes([660], "square", 0.03);
    haptic(6);
    if (dial + 1 >= 3) {
      haptic([20, 30, 20]);
      playNotes([523, 659, 784], "sine", 0.1);
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,#2a2f38,#171a20)]" />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#eef1f6]">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Alto secreto: se casan</p>
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
          data-cajafuerte={open ? "abierta" : `ruedas-${dial}`}
          onPointerDown={(e) => {
            stop(e);
            turn();
          }}
          className="relative mt-6 flex h-64 w-64 cursor-pointer flex-col items-center justify-center rounded-[14px] border-4 border-[#5a6272] bg-[linear-gradient(160deg,#5a6272,#3a4152)] shadow-[0_18px_30px_-16px_rgb(0_0_0/0.7)]"
        >
          {open ? (
            <div className="flex size-48 flex-col items-center justify-center rounded-[8px] bg-[#1a1d24] text-[#ffd97a]">
              <span className="text-[0.6875rem] tracking-[0.16em] uppercase">Dentro había</span>
              <span
                className="mt-2 text-[1.0625rem] font-semibold"
                style={{ fontFamily: PLAYFAIR }}
              >
                Una invitación
              </span>
              <span className="mt-1 text-[0.8125rem]">y dos anillos</span>
            </div>
          ) : (
            <>
              {/* Las tres ruedas de la combinación: día, mes y año. */}
              <div className="flex gap-2">
                {code.map((n, i) => (
                  <span
                    key={i}
                    className="flex h-14 w-12 items-center justify-center rounded-[6px] bg-[#f4f0e6] text-[1.375rem] font-semibold text-[#1a1d24]"
                    translate="no"
                  >
                    {i < dial ? n : "··"}
                  </span>
                ))}
              </div>
              <span
                aria-hidden
                className="mt-5 block size-16 rounded-full border-4 border-[#c9ced8] bg-[#2a2f38] transition-transform duration-300"
                style={{
                  transform: `rotate(${dial * 120}deg)`,
                  transitionDuration: reduce ? "0ms" : undefined,
                }}
              >
                <span className="mx-auto mt-1 block h-5 w-1 rounded-full bg-[#ffd97a]" />
              </span>
            </>
          )}
        </div>
        <After reduce={reduce} className="mt-5 text-[0.9375rem]">
          {open ? "La combinación era la fecha:" : "Gira la rueda tres veces para abrirla."}
          <span className="block text-[1.0625rem] font-semibold">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>, en {event.city}
          </span>
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={turn}
            disabled={open}
            className="mt-3 rounded-full bg-[#ffd97a] px-6 py-2.5 text-[0.9375rem] font-medium text-[#171a20] disabled:opacity-70"
          >
            {open ? "Caja abierta" : `Girar la rueda (${dial}/3)`}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Patines: tres impulsos y se llega a la pista ─────────────── */

function SkatesCover({ event, onOpen, reduce }: ConceptProps) {
  const [push, setPush] = useState(0);
  const arrived = push >= 3;
  const hosts = hostsOf(event);
  const go = () => {
    if (arrived) return;
    setPush(push + 1);
    playPaper(0.2);
    haptic(10);
    if (push + 1 >= 3) playNotes([784, 988, 1175], "sine", 0.1);
  };
  const skate = (color: string, name: string) => (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 60 50" aria-hidden className="w-14">
        <path d="M10 4h22l2 26h18c4 0 6 4 4 8H8z" fill={color} />
        <rect x="6" y="38" width="48" height="4" rx="2" fill="#5a5a5a" />
        <circle cx="14" cy="46" r="4" fill="#f4c542" />
        <circle cx="46" cy="46" r="4" fill="#f4c542" />
      </svg>
      <span className="text-[0.6875rem] font-semibold" translate="no">
        {name}
      </span>
    </div>
  );

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,#ffe3ef,#ffd1e3_60%,#d9c6f2)]"
      />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#2e1838]">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Sobre ruedas hacia el sí</p>
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
          data-patines={arrived ? "en-la-pista" : `impulsos-${push}`}
          onPointerDown={(e) => {
            stop(e);
            go();
          }}
          className="relative mt-8 h-56 w-full cursor-pointer"
        >
          {/* La pista con su bola de luces al fondo; los patines avanzan de izquierda a derecha. */}
          <div className="absolute right-0 bottom-0 flex h-28 w-24 flex-col items-center justify-end rounded-t-[12px] bg-[#7a4aa8] pb-2 text-[0.6875rem] font-semibold text-white">
            <span
              aria-hidden
              className="mt-2 mb-auto block size-6 rounded-full bg-[radial-gradient(circle,#fff,#c9ced8)]"
            />
            PISTA
          </div>
          <div
            className="absolute bottom-0 flex gap-1 transition-[left] duration-500"
            style={{ left: `${push * 12}%`, transitionDuration: reduce ? "0ms" : undefined }}
          >
            {skate("#e4578a", hosts.first)}
            {skate("#5a8fd6", hosts.second ?? "")}
          </div>
          <span
            aria-hidden
            className="absolute inset-x-[-1.5rem] bottom-[-4px] block h-1 bg-[#b48ad6]"
          />
        </div>
        <After reduce={reduce} className="mt-4 text-[0.9375rem]">
          {arrived ? "¡A la pista! Nos vemos el" : "Dales tres impulsos hasta la pista."}
          <span className="block text-[1.0625rem] font-semibold">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>, en {event.city}
          </span>
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={go}
            disabled={arrived}
            className="mt-3 rounded-full bg-[#7a2a8a] px-6 py-2.5 text-[0.9375rem] font-medium text-white disabled:opacity-70"
          >
            {arrived ? "¡En la pista!" : `Dar impulso (${push}/3)`}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

export const THIRTIETH_NEW_COVERS = {
  linterna: FlashlightCover,
  cajafuerte: SafeCover,
  patines: SkatesCover,
};
