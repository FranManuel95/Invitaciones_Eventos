"use client";

import { useState, type PointerEvent } from "react";
import type { WeddingEvent } from "@/lib/domain/types";
import { hostNames, hostsOf } from "@/lib/event-kind";
import { formatLongDate, formatNumericDate, isoDay } from "@/lib/format";
import { haptic, playNotes, playPaper } from "../effects/sound";
import { After, FRAUNCES, OpenHint, PLAYFAIR, SANS, type ConceptProps } from "./concept-kit";

/*
 * Portadas de concepto de la decimosexta tanda (ronda 38): un pliego de sellos con vuestras
 * iniciales, una bola de discoteca que se enciende y un cuaderno de viaje que se hojea.
 */

const names = (event: WeddingEvent, joiner = " y ") => hostNames(hostsOf(event), joiner);
const stop = (e: PointerEvent) => e.stopPropagation();

/* ─────────────── Sellos: se arranca uno del pliego y lleva el matasellos ─────────────── */

function StampsCover({ event, onOpen, reduce }: ConceptProps) {
  const [torn, setTorn] = useState(false);
  const hosts = hostsOf(event);
  const initials = `${hosts.first.charAt(0)}${hosts.second ? `·${hosts.second.charAt(0)}` : ""}`;
  const tear = () => {
    if (torn) return;
    setTorn(true);
    playPaper(0.35);
    haptic([8, 20, 8]);
  };
  // Borde troquelado: círculos del color del fondo alrededor de cada sello.
  const perforated =
    "radial-gradient(circle, #efe7d8 0 3px, transparent 3.5px) -5px -5px / 10px 10px";

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="absolute inset-0 bg-[#efe7d8]" />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#22303f]">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Emisión especial de</p>
        <h1
          id="cover-title"
          tabIndex={-1}
          translate="no"
          className="mt-1 text-[clamp(2.1rem,9.4vw,2.8rem)] leading-[1.02] outline-none"
          style={{ fontFamily: FRAUNCES }}
        >
          {names(event)}
        </h1>
        {/* El pliego de cuatro sellos; el de abajo a la derecha se arranca. */}
        <div
          data-sellos={torn ? "arrancado" : "pliego"}
          onPointerDown={(e) => {
            stop(e);
            tear();
          }}
          className="relative mt-6 grid cursor-pointer grid-cols-2 gap-0 p-2"
        >
          {[0, 1, 2, 3].map((i) => {
            const loose = i === 3 && torn;
            return (
              <div
                key={i}
                className="relative size-32 p-2 transition-transform duration-700"
                style={{
                  background: perforated,
                  transform: loose ? "translate(34px, 16px) rotate(10deg)" : undefined,
                  transitionDuration: reduce ? "0ms" : undefined,
                  zIndex: loose ? 2 : 1,
                }}
              >
                <div className="flex size-full flex-col items-center justify-between bg-[#f7efe0] p-2 ring-1 ring-[#22303f]/30">
                  <span className="self-start text-[0.625rem] font-semibold tracking-[0.1em]">
                    ESPAÑA
                  </span>
                  <span
                    className={`text-[1.6rem] leading-none italic ${i % 2 ? "text-[#b23a2e]" : "text-[#2c5a7a]"}`}
                    style={{ fontFamily: PLAYFAIR }}
                    translate="no"
                  >
                    {initials}
                  </span>
                  <span className="self-end text-[0.6875rem] font-semibold">1 sí</span>
                </div>
                {loose ? (
                  <span
                    aria-hidden
                    className="absolute top-3 right-1 flex size-16 items-center justify-center rounded-full border-2 border-[#22303f]/70 text-[0.5625rem] leading-tight font-semibold text-[#22303f]/80"
                    style={{ transform: "rotate(-14deg)" }}
                  >
                    {event.city.slice(0, 12).toUpperCase()}
                    <br />
                    {formatNumericDate(event.date)}
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
        <After reduce={reduce} className="mt-10 text-[0.9375rem]">
          {torn ? "Matasellado en " + event.city + ":" : "Sello de boda, tirada limitada."}
          <span className="block text-[1.0625rem] font-semibold">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>
          </span>
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={tear}
            disabled={torn}
            className="mt-3 rounded-full bg-[#2c5a7a] px-6 py-2.5 text-[0.9375rem] font-medium text-white disabled:opacity-70"
          >
            {torn ? "Sello arrancado" : "Arrancar un sello"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Bola de discoteca: se enciende y los reflejos bailan ─────────────── */

const SPARKS = Array.from({ length: 22 }, (_, i) => {
  const a = (i * 137.5 * Math.PI) / 180;
  const r = 28 + ((i * 37) % 60);
  return { x: 50 + Math.cos(a) * r * 0.55, y: 40 + Math.sin(a) * r * 0.5, s: 4 + (i % 4) * 2 };
});

function DiscoCover({ event, onOpen, reduce }: ConceptProps) {
  const [on, setOn] = useState(false);
  const light = () => {
    if (on) return;
    setOn(true);
    haptic([10, 20, 10, 20, 10]);
    playNotes([392, 494, 587, 784, 587, 784], "square", 0.12);
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,#2a1a44,#0d0818_70%)]"
      />
      {on
        ? SPARKS.map((p, i) => (
            <span
              key={i}
              aria-hidden
              className={`absolute block rounded-full ${i % 3 === 0 ? "bg-[#ff7ad9]" : i % 3 === 1 ? "bg-[#7ae0ff]" : "bg-[#fff2a8]"} ${reduce ? "" : "animate-[disco-twinkle_1.6s_ease-in-out_infinite]"}`}
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.s,
                height: p.s,
                animationDelay: `${(i % 7) * 0.2}s`,
                boxShadow: "0 0 10px 2px currentColor",
              }}
            />
          ))
        : null}
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#f7eefc]">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Esta noche bailan</p>
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
          data-disco={on ? "encendida" : "apagada"}
          onPointerDown={(e) => {
            stop(e);
            light();
          }}
          className="relative mt-2 flex cursor-pointer flex-col items-center"
        >
          <span aria-hidden className="h-10 w-0.5 bg-[#8a8aa0]" />
          <span
            aria-hidden
            className={`block size-36 rounded-full border border-[#cfd2dc] ${on ? "shadow-[0_0_50px_10px_rgb(200_160_255/0.35)]" : ""} ${on && !reduce ? "animate-[disco-spin_4s_linear_infinite]" : ""}`}
            style={{
              background:
                "linear-gradient(90deg, rgb(255 255 255 / 0.25) 1px, transparent 1px) 0 0 / 12px 12px, linear-gradient(rgb(255 255 255 / 0.25) 1px, transparent 1px) 0 0 / 12px 12px, radial-gradient(circle at 35% 30%, #ffffff, #b9bdc9 35%, #5d6070 80%)",
            }}
          />
        </div>
        <After reduce={reduce} className="mt-6 text-[0.9375rem]">
          {on ? "¡A la pista!" : "Enciende la bola y empieza la fiesta."}
          <span className="mt-1 block text-[1.25rem] font-semibold text-[#ffd1f3] [text-shadow:0_0_12px_rgb(255_122_217/0.8)]">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>
          </span>
          <span className="block">{event.city}</span>
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={light}
            disabled={on}
            className="mt-3 rounded-full bg-[#ff7ad9] px-6 py-2.5 text-[0.9375rem] font-medium text-[#2a0a24] disabled:opacity-70"
          >
            {on ? "Bola encendida" : "Encender la bola"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Cuaderno de viaje: se pasan las páginas hasta el destino ─────────────── */

function TravelJournalCover({ event, onOpen, reduce }: ConceptProps) {
  const [page, setPage] = useState(0);
  const pages = [
    { kicker: "Día 1", title: "Así empezó", text: event.story.intro },
    {
      kicker: "Día 2",
      title: "El billete",
      text:
        event.region === event.city
          ? `Destino: ${event.city}.`
          : `Destino: ${event.city}, ${event.region}.`,
    },
    { kicker: "Día 3", title: "La fecha", text: formatLongDate(event.date) },
    { kicker: "Último día", title: "Te esperamos", text: "Falta tu firma en este cuaderno." },
  ];
  const last = page === pages.length - 1;
  const next = () => {
    if (last) return;
    setPage(page + 1);
    playPaper(0.3);
    haptic(8);
  };
  const current = pages[Math.min(page, pages.length - 1)] ?? { kicker: "", title: "", text: "" };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(160deg,#e8dcc6,#d8c6a4)]" />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#2f2418]">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Cuaderno de viaje de</p>
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
        {/* El cuaderno abierto: a la izquierda, lo pegado; a la derecha, lo escrito. */}
        <div
          data-cuaderno={last ? "llegada" : `pagina-${page + 1}`}
          onPointerDown={(e) => {
            stop(e);
            next();
          }}
          className="relative mt-6 flex h-56 w-full max-w-[20rem] cursor-pointer rounded-[6px] bg-[#7a4a2c] p-2 shadow-[0_18px_30px_-16px_rgb(60_40_20/0.6)]"
        >
          <div className="relative flex-1 rounded-l-[3px] bg-[#fbf6ea] p-3">
            {/* Recuerdos pegados con cinta: un billete, un mapa y una foto. */}
            <span
              aria-hidden
              className="absolute top-4 left-3 h-10 w-20 rotate-[-6deg] rounded-[2px] border border-dashed border-[#b23a2e] bg-[#f5d9c8]"
            />
            <span
              aria-hidden
              className="absolute top-16 left-8 h-16 w-16 rotate-[5deg] bg-[repeating-linear-gradient(45deg,#cfe0d6_0_6px,#e6efe9_6px_12px)] ring-1 ring-[#7a8a80]"
            />
            <span
              aria-hidden
              className="absolute bottom-4 left-4 h-12 w-14 rotate-[-3deg] bg-[#c9b48c] ring-4 ring-white"
            />
            <span
              aria-hidden
              className="absolute top-3 left-8 h-3 w-8 rotate-[-6deg] bg-[#f2e08a]/80"
            />
          </div>
          <span aria-hidden className="w-1 bg-[#d9ccb2]" />
          <div
            key={page}
            className={`flex flex-1 flex-col rounded-r-[3px] bg-[#fbf6ea] p-3 text-left ${reduce ? "" : "animate-[journal-turn_0.5s_ease-out]"}`}
          >
            <span className="text-[0.625rem] tracking-[0.16em] uppercase">{current.kicker}</span>
            <span className="mt-1 text-[1rem] font-semibold" style={{ fontFamily: PLAYFAIR }}>
              {current.title}
            </span>
            <span className="mt-1 text-[0.8125rem] leading-snug">{current.text}</span>
            <span className="mt-auto self-end text-[0.6875rem]">
              {page + 1}/{pages.length}
            </span>
          </div>
        </div>
        <After reduce={reduce} className="mt-5 text-[0.9375rem]">
          {last ? "Fin del viaje. Nos vemos allí." : "Pasa las páginas hasta el destino."}
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={next}
            disabled={last}
            className="mt-3 rounded-full bg-[#7a4a2c] px-6 py-2.5 text-[0.9375rem] font-medium text-[#fbf6ea] disabled:opacity-70"
          >
            {last ? "Has llegado" : `Pasar página (${page + 1}/${pages.length})`}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

export const FIFTEENTH_NEW_COVERS = {
  sellos: StampsCover,
  disco: DiscoCover,
  cuaderno: TravelJournalCover,
};
