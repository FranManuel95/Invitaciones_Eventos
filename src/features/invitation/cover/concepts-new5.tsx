"use client";

import { useState, type PointerEvent } from "react";
import type { WeddingEvent } from "@/lib/domain/types";
import { hostNames, hostsOf } from "@/lib/event-kind";
import { formatLongDate, isoDay } from "@/lib/format";
import { seeded } from "@/lib/theme";
import { zodiacOf } from "@/lib/zodiac";
import { haptic, playPaper, playTick } from "../effects/sound";
import {
  After,
  Arrive,
  dateParts,
  FRAUNCES,
  madrid,
  OpenHint,
  PLAYFAIR,
  SANS,
  type ConceptProps,
} from "./concept-kit";

/*
 * Portadas de concepto de la sexta tanda (ronda 38): una mano de póker con escalera de color, el
 * calendario de puertas del mes de la boda y el horóscopo del periódico con el signo de ese día.
 */

const names = (event: WeddingEvent, joiner = " y ") => hostNames(hostsOf(event), joiner);
const stop = (e: PointerEvent) => e.stopPropagation();

/* ─────────────── Póker: se destapan las cartas y sale escalera de color ─────────────── */

function PokerCover({ event, onOpen, reduce }: ConceptProps) {
  const hosts = hostsOf(event);
  const { dd } = dateParts(event.date);
  // Escalera de color de corazones; la J y la Q llevan vuestras iniciales y el As, el día.
  const cards: { rank: string; note: string }[] = [
    { rank: "10", note: "" },
    { rank: "J", note: hosts.second?.[0] ?? "" },
    { rank: "Q", note: hosts.first[0] ?? "" },
    { rank: "K", note: "" },
    { rank: "A", note: dd },
  ];
  const [shown, setShown] = useState<boolean[]>(() => cards.map(() => false));
  const all = shown.every(Boolean);

  const flip = (i: number) => {
    if (shown[i]) return;
    playPaper(0.12);
    setShown((current) => {
      const next = current.map((v, k) => v || k === i);
      if (next.every(Boolean)) haptic([10, 30, 10, 30, 30]);
      return next;
    });
  };
  const flipAll = () =>
    cards.forEach((_, i) => window.setTimeout(() => flip(i), reduce ? 0 : i * 160));

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      {/* El tapete verde con su brillo de lámpara. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_35%,#1f6b46,#0f3a26_75%)]"
      />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-5 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Mano ganadora</p>
        <h1
          id="cover-title"
          tabIndex={-1}
          translate="no"
          className="mt-1 text-[clamp(2.1rem,9.6vw,2.8rem)] leading-[1.02] italic outline-none"
          style={{ fontFamily: PLAYFAIR }}
        >
          {names(event)}
        </h1>
        <Arrive reduce={reduce} tilt={0} className="mt-6 w-full">
          <div data-hand={all ? "escalera" : "boca-abajo"} className="flex justify-center">
            {cards.map((card, i) => (
              <button
                key={card.rank}
                type="button"
                tabIndex={-1}
                aria-hidden
                onPointerDown={stop}
                onClick={() => flip(i)}
                className="relative -mx-2 aspect-[5/7] w-[19%] max-w-[4.8rem] [perspective:600px]"
                style={{ rotate: `${(i - 2) * 6}deg`, translate: `0 ${Math.abs(i - 2) * 6}px` }}
              >
                <span
                  className="absolute inset-0 transition-transform duration-500 [transform-style:preserve-3d]"
                  style={{ transform: shown[i] ? "rotateY(180deg)" : "none" }}
                >
                  {/* Reverso: el dibujo rojo de la baraja. */}
                  <span className="absolute inset-0 rounded-[6px] border-[3px] border-white bg-[repeating-linear-gradient(45deg,#9b1d2c_0_4px,#c0394a_4px_8px)] shadow-md [backface-visibility:hidden]" />
                  {/* Anverso: palo de corazones, el número y la inicial o el día. */}
                  <span className="absolute inset-0 flex [transform:rotateY(180deg)] flex-col justify-between rounded-[6px] bg-white p-1 text-left text-[#b3192c] shadow-md [backface-visibility:hidden]">
                    <span
                      className="text-[0.95rem] leading-none font-bold"
                      style={{ fontFamily: FRAUNCES }}
                    >
                      {card.rank}
                      <span className="block text-[0.75rem]">♥</span>
                    </span>
                    <span
                      className="self-center text-[1.1rem] font-bold"
                      style={{ fontFamily: PLAYFAIR }}
                    >
                      {card.note || "♥"}
                    </span>
                  </span>
                </span>
              </button>
            ))}
          </div>
        </Arrive>
        <After reduce={reduce} className="mt-6">
          <p className="text-[1.0625rem]">
            Apuesta fuerte: <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>
          </p>
          <p className="text-[0.875rem]">Mesa de juego: {event.city}</p>
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={flipAll}
            disabled={all}
            className="mt-3 rounded-full bg-[#f2e6c9] px-6 py-2.5 text-[0.9375rem] font-medium text-[#0f3a26] disabled:opacity-70"
          >
            {all ? "¡Escalera de color!" : "Destapar las cartas"}
          </button>
          <p className="short-hide mt-1.5 text-[0.8125rem] italic">O tócalas una a una.</p>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Calendario de puertas: se abre la ventanita del día ─────────────── */

function DoorsCalendarCover({ event, onOpen, reduce }: ConceptProps) {
  const date = new Date(event.date);
  const day = Number(madrid({ day: "numeric" }).format(date));
  const month = madrid({ month: "long" }).format(date);
  const year = Number(madrid({ year: "numeric" }).format(date));
  const monthIndex = Number(madrid({ month: "numeric" }).format(date)) - 1;
  const days = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  // Las puertas, desordenadas como en los calendarios de verdad (siempre igual para el mismo mes).
  const random = seeded(year * 12 + monthIndex);
  const order = Array.from({ length: days }, (_, i) => i + 1);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [order[i], order[j]] = [order[j]!, order[i]!];
  }
  const [open, setOpen] = useState<Set<number>>(() => new Set());
  const found = open.has(day);

  const knock = (n: number) => {
    if (open.has(n)) return;
    playTick();
    if (n === day) haptic([12, 30, 12, 30, 24]);
    setOpen((current) => new Set(current).add(n));
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="paper-grain absolute inset-0 opacity-60" />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-4 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center">
        <Arrive
          reduce={reduce}
          tilt={0}
          className="w-full rounded-[8px] bg-[#1f3b5c] px-3 pt-3 pb-3 text-[#f6ecd6] shadow-[0_22px_40px_-18px_rgb(10_20_40/0.6)]"
        >
          <p className="text-[0.6875rem] tracking-[0.22em] uppercase">Cuenta atrás de {month}</p>
          <h1
            id="cover-title"
            tabIndex={-1}
            translate="no"
            className="mt-0.5 text-[clamp(1.7rem,7.8vw,2.2rem)] leading-tight italic outline-none"
            style={{ fontFamily: PLAYFAIR }}
          >
            {names(event)}
          </h1>
          <div data-door={found ? "abierta" : "cerrada"} className="mt-2 grid grid-cols-6 gap-1.5">
            {order.map((n) => {
              const isDay = n === day;
              const isOpen = open.has(n);
              return (
                <button
                  key={n}
                  type="button"
                  tabIndex={-1}
                  aria-hidden
                  onPointerDown={stop}
                  onClick={() => knock(n)}
                  className={`relative aspect-square rounded-[4px] text-[0.8125rem] font-semibold transition-colors ${isOpen ? (isDay ? "bg-[#c9a14a] text-[#1f3b5c]" : "bg-[#f6ecd6]/90 text-[#1f3b5c]") : "border border-[#f6ecd6]/50 bg-[#2a4d75] text-[#f6ecd6]"}`}
                  style={{ fontFamily: FRAUNCES }}
                >
                  {isOpen ? (isDay ? "♥" : "·") : n}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-[0.875rem]">
            Abre el {day}: <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>,
            en {event.city}
          </p>
        </Arrive>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={() => knock(day)}
            disabled={found}
            className="mt-3 rounded-full bg-[#1f3b5c] px-6 py-2.5 text-[0.9375rem] font-medium text-[#f6ecd6] disabled:opacity-70"
          >
            {found ? "¡Ese es el día!" : `Abrir la puerta del ${day}`}
          </button>
          <p className="short-hide mt-1.5 text-[0.8125rem] italic">O busca tú la puerta.</p>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Horóscopo: el signo del día de la boda y su predicción ─────────────── */

function HoroscopeCover({ event, onOpen, reduce }: ConceptProps) {
  const sign = zodiacOf(event.date);
  const [read, setRead] = useState(false);
  const party = event.program.find((act) => /fiesta|baile|barra/i.test(act.title));
  const reveal = () => {
    if (read) return;
    setRead(true);
    haptic([10, 30, 10]);
    playPaper(0.2);
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="paper-grain absolute inset-0 opacity-70" />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-5 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <Arrive
          reduce={reduce}
          tilt={-1}
          className="w-full bg-[#f4f0e6] px-4 pt-3 pb-4 shadow-[0_22px_40px_-20px_rgb(20_20_20/0.5)]"
        >
          <div className="flex items-baseline justify-between border-b-2 border-current pb-1 text-[0.6875rem] tracking-[0.18em] uppercase">
            <span>Horóscopo</span>
            <span>Por Madame Amor</span>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <span
              aria-hidden
              className="grid size-16 shrink-0 place-items-center rounded-full border-2 border-current text-[2.2rem]"
            >
              {sign.symbol}
            </span>
            <div className="text-left">
              <p className="text-[0.75rem] tracking-[0.16em] uppercase">{sign.name}</p>
              <h1
                id="cover-title"
                tabIndex={-1}
                translate="no"
                className="text-[clamp(1.6rem,7.4vw,2.1rem)] leading-tight font-semibold outline-none"
                style={{ fontFamily: FRAUNCES }}
              >
                {names(event)}
              </h1>
            </div>
          </div>
          <dl
            data-read={read ? "si" : "no"}
            onPointerDown={(e) => {
              stop(e);
              reveal();
            }}
            className="mt-3 grid cursor-pointer gap-1.5 text-[0.875rem] leading-snug"
          >
            {[
              [
                "Amor",
                <>
                  Los astros lo tienen claro: el{" "}
                  <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time> os casáis
                  en {event.city}.
                </>,
              ],
              ["Salud", "Calzado cómodo: se baila hasta tarde."],
              ["Dinero", "Gastos imprevistos en confeti. Merece la pena."],
              [
                "Número de la suerte",
                party ? `Las ${party.time}, cuando empieza la fiesta.` : "El de tu mesa.",
              ],
            ].map(([label, text], i) => (
              <div key={String(label)} className={i > 0 && !read ? "blur-[3px] select-none" : ""}>
                <dt className="inline font-bold">{label}: </dt>
                <dd className="inline">{text}</dd>
              </div>
            ))}
          </dl>
        </Arrive>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={reveal}
            disabled={read}
            className="mt-3 rounded-full bg-current px-6 py-2.5 text-[0.9375rem] font-medium disabled:opacity-60"
          >
            <span className="text-[#f4f0e6]">
              {read ? "Predicción leída" : "Leer la predicción"}
            </span>
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

export const FIFTH_NEW_COVERS = {
  poker: PokerCover,
  adviento: DoorsCalendarCover,
  horoscopo: HoroscopeCover,
};
