"use client";

import { useState, type PointerEvent } from "react";
import type { WeddingEvent } from "@/lib/domain/types";
import { crossWords, crosswordLetters } from "@/lib/crossword";
import { hostNames, hostsOf } from "@/lib/event-kind";
import { formatLongDate, isoDay } from "@/lib/format";
import { haptic, playPaper, playTick } from "../effects/sound";
import {
  After,
  Arrive,
  COURIER,
  dateParts,
  FRAUNCES,
  OpenHint,
  SANS,
  type ConceptProps,
} from "./concept-kit";

/*
 * Portadas de concepto de la tercera tanda (ronda 38): un crucigrama con los nombres cruzados, un
 * billete de tren que se pica y la ficha de receta de la abuela, con los ingredientes que se tachan.
 */

const names = (event: WeddingEvent, joiner = " y ") => hostNames(hostsOf(event), joiner);
const HAND = "var(--font-great-vibes), 'Great Vibes', 'Snell Roundhand', cursive";
const stop = (e: PointerEvent) => e.stopPropagation();

/* ─────────────── Crucigrama: los nombres son la solución ─────────────── */

function CrosswordCover({ event, onOpen, reduce }: ConceptProps) {
  const hosts = hostsOf(event);
  // El cruce es barato: se calcula en cada render (React Compiler lo memoriza si hace falta).
  const first = crosswordLetters(hosts.first);
  const second = crosswordLetters(hosts.second ?? "");
  const grid = crossWords(first, second);
  const keys = [...grid.cells.keys()];
  const [shown, setShown] = useState<Set<string>>(() => new Set());
  const solved = shown.size >= keys.length;

  const reveal = (key: string) => {
    if (shown.has(key)) return;
    playTick();
    setShown((current) => {
      const next = new Set(current).add(key);
      if (next.size >= keys.length) haptic([10, 30, 10, 30, 18]);
      return next;
    });
  };
  const solve = () => {
    if (reduce) {
      setShown(new Set(keys));
      haptic(14);
      return;
    }
    keys.forEach((key, i) => window.setTimeout(() => reveal(key), i * 70));
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="paper-grain absolute inset-0 opacity-70" />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-5 pt-[max(4.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <Arrive
          reduce={reduce}
          tilt={-1.5}
          className="w-full bg-[#fbfaf5] px-4 pt-3 pb-4 shadow-[0_22px_40px_-20px_rgb(20_20_20/0.5)]"
        >
          <div className="flex items-baseline justify-between border-b-2 border-current pb-1 text-[0.6875rem] tracking-[0.18em] uppercase">
            <span>Pasatiempos</span>
            <span>Edición especial</span>
          </div>
          <p
            className="mt-2 text-[1.375rem] leading-tight font-semibold"
            style={{ fontFamily: FRAUNCES }}
          >
            El crucigrama de la boda
          </p>
          {/* La cuadrícula: toca una casilla para escribir su letra. */}
          <div
            data-solved={solved ? "si" : "no"}
            aria-hidden
            className="mx-auto mt-3 grid w-fit gap-[2px] bg-current p-[2px]"
            style={{ gridTemplateColumns: `repeat(${grid.cols}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: grid.rows * grid.cols }, (_, n) => {
              const key = `${Math.floor(n / grid.cols)},${n % grid.cols}`;
              const letter = grid.cells.get(key);
              return letter ? (
                <button
                  key={key}
                  type="button"
                  tabIndex={-1}
                  onPointerDown={stop}
                  onClick={() => reveal(key)}
                  className="grid size-[clamp(1.6rem,7.4vw,2.1rem)] place-items-center bg-[#fbfaf5] text-[clamp(0.95rem,4.6vw,1.25rem)] font-semibold"
                  style={{ fontFamily: FRAUNCES }}
                >
                  {shown.has(key) ? letter : ""}
                </button>
              ) : (
                <span key={key} className="size-[clamp(1.6rem,7.4vw,2.1rem)] bg-current" />
              );
            })}
          </div>
          <dl className="mt-3 grid gap-1 text-[0.8125rem] leading-snug">
            <div className="flex gap-1.5">
              <dt className="font-semibold">Horizontal:</dt>
              <dd>
                se casa el <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time> (
                {first.length}).
              </dd>
            </div>
            {second.length ? (
              <div className="flex gap-1.5">
                <dt className="font-semibold">{grid.crossed ? "Vertical:" : "Debajo:"}</dt>
                <dd>
                  le dice «sí, quiero» en {event.city} ({second.length}).
                </dd>
              </div>
            ) : null}
          </dl>
          <h1
            id="cover-title"
            tabIndex={-1}
            translate="no"
            className={`mt-3 border-t border-current/40 pt-2 text-center text-[1.5rem] leading-tight outline-none ${solved ? "" : "sr-only"}`}
            style={{ fontFamily: HAND }}
          >
            {names(event)}
          </h1>
        </Arrive>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={solve}
            disabled={solved}
            className="mt-3 rounded-full bg-current px-6 py-2.5 text-[0.9375rem] font-medium disabled:opacity-60"
          >
            <span className="text-[#fbfaf5]">{solved ? "Resuelto" : "Resolver el crucigrama"}</span>
          </button>
          <p className="short-hide mt-1.5 text-[0.8125rem] italic">
            O toca las casillas una a una.
          </p>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Billete de tren: se pica con la máquina del revisor ─────────────── */

const PUNCHES = 3;

function TrainTicketCover({ event, onOpen, reduce }: ConceptProps) {
  const [holes, setHoles] = useState<[number, number][]>([]);
  const punched = holes.length >= PUNCHES;
  const ceremony = event.program[0];
  const { dd, mm, yy } = dateParts(event.date);

  const punch = (x: number, y: number) => {
    if (punched) return;
    playTick();
    haptic(18);
    setHoles((current) => {
      const next = [...current, [x, y] as [number, number]];
      if (next.length >= PUNCHES) playPaper(0.2);
      return next;
    });
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="paper-grain absolute inset-0 opacity-60" />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-5 pt-[max(4.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <p className="text-[0.75rem] tracking-[0.2em] uppercase">Viajeros al tren</p>
        <Arrive reduce={reduce} tilt={3} className="relative mt-4 w-full max-w-[20rem]">
          <div
            data-punched={holes.length}
            onPointerDown={(e) => {
              stop(e);
              const r = e.currentTarget.getBoundingClientRect();
              punch(((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100);
            }}
            className="relative cursor-pointer overflow-hidden rounded-[6px] bg-[#cfe0c3] px-4 pt-3 pb-4 text-[#1f2b1d] shadow-[0_24px_40px_-18px_rgb(20_30_15/0.6)]"
            style={{
              fontFamily: COURIER,
              backgroundImage:
                "repeating-linear-gradient(45deg, rgb(255 255 255 / 0.18) 0 2px, transparent 2px 7px)",
            }}
          >
            <div className="flex items-baseline justify-between border-b-2 border-dashed border-current pb-1 text-[0.6875rem] tracking-[0.14em] uppercase">
              <span>Ferrocarril de la boda</span>
              <span>Ida</span>
            </div>
            <h1
              id="cover-title"
              tabIndex={-1}
              translate="no"
              className="mt-2 text-[clamp(1.6rem,7.6vw,2.1rem)] leading-tight font-bold outline-none"
              style={{ fontFamily: FRAUNCES }}
            >
              {names(event)}
            </h1>
            <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[0.8125rem]">
              {[
                ["Origen", "Vuestra casa"],
                ["Destino", event.city],
                ["Fecha", <time key="f" dateTime={isoDay(event.date)}>{`${dd}/${mm}/${yy}`}</time>],
                ["Salida", ceremony ? ceremony.time : "—"],
                ["Coche", "Invitados"],
                ["Clase", "Primera"],
              ].map(([label, value]) => (
                <div key={String(label)}>
                  <dt className="text-[0.625rem] tracking-[0.16em] uppercase opacity-80">
                    {label}
                  </dt>
                  <dd className="font-bold">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-2 border-t-2 border-dashed border-current pt-1.5 text-[0.75rem]">
              Precio: un abrazo. Válido solo el {formatLongDate(event.date)}.
            </p>
            {/* Los agujeros del picado. */}
            {holes.map(([x, y], i) => (
              <span
                key={i}
                aria-hidden
                className="absolute size-4 -translate-1/2 rounded-full bg-[#2f2a22] shadow-[inset_0_2px_3px_rgb(0_0_0/0.6)]"
                style={{ left: `${x}%`, top: `${y}%` }}
              />
            ))}
          </div>
        </Arrive>
        <After reduce={reduce} className="short-hide mt-5 text-center text-[0.875rem]">
          Toca el billete para picarlo: {Math.min(holes.length, PUNCHES)} de {PUNCHES}.
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={() => {
              const spots: [number, number][] = [
                [82, 22],
                [86, 48],
                [80, 74],
              ];
              spots
                .slice(holes.length)
                .forEach(([x, y], i) => window.setTimeout(() => punch(x, y), reduce ? 0 : i * 180));
            }}
            disabled={punched}
            className="mt-3 rounded-full bg-[#2f4a2b] px-6 py-2.5 text-[0.9375rem] font-medium text-[#eef3e6] disabled:opacity-70"
          >
            {punched ? "Billete picado" : "Picar el billete"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Receta de la abuela: los ingredientes se tachan ─────────────── */

function RecipeCover({ event, onOpen, reduce }: ConceptProps) {
  const party = event.program.find((act) => /fiesta|baile|barra/i.test(act.title));
  const items = [
    `Dos novios: ${names(event)}`,
    `Un pueblo bonito: ${event.city}`,
    `Un ${formatLongDate(event.date).replace(/ de \d{4}$/, "")} bien templado`,
    "Familia y amigos, al gusto",
    party ? `Baile a partir de las ${party.time}` : "Baile hasta que se acabe la noche",
  ];
  const [done, setDone] = useState<boolean[]>(() => items.map(() => false));
  const all = done.every(Boolean);

  const tick = (i: number) => {
    playTick();
    setDone((current) => {
      const next = current.map((v, k) => (k === i ? !v : v));
      if (next.every(Boolean) && !current.every(Boolean)) haptic([8, 30, 8, 30, 14]);
      return next;
    });
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="paper-grain absolute inset-0 opacity-70" />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-5 pt-[max(4.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <Arrive
          reduce={reduce}
          tilt={-2}
          className="relative w-full bg-[#fffaf0] px-5 pt-4 pb-5 shadow-[0_22px_40px_-20px_rgb(60_40_20/0.55)]"
        >
          {/* La ficha: renglones, margen rojo y una mancha de aceite. */}
          <span
            aria-hidden
            className="absolute inset-0 bg-[repeating-linear-gradient(180deg,transparent_0_1.7rem,rgb(110_150_190/0.35)_1.7rem_calc(1.7rem+1px))] bg-[length:100%_1.75rem]"
          />
          <span aria-hidden className="absolute inset-y-0 left-7 w-px bg-[#d46a5a]/70" />
          <span
            aria-hidden
            className="absolute top-10 right-6 size-16 rounded-full bg-[radial-gradient(circle,rgb(214_170_90/0.28),rgb(214_170_90/0.12)_60%,transparent_70%)]"
          />
          <p className="relative pl-4 text-[0.6875rem] tracking-[0.18em] uppercase">
            Recetas de la abuela · n.º 1
          </p>
          <h1
            id="cover-title"
            tabIndex={-1}
            translate="no"
            className="relative mt-1 pl-4 text-[clamp(1.9rem,8.6vw,2.5rem)] leading-[1.05] outline-none"
            style={{ fontFamily: HAND }}
          >
            Boda de {names(event)}
          </h1>
          <p className="relative mt-2 pl-4 text-[0.75rem] tracking-[0.14em] uppercase">
            Ingredientes (para toda la vida)
          </p>
          <ul data-recipe={all ? "lista" : "a-medias"} className="relative mt-1 pl-4">
            {items.map((item, i) => (
              <li key={item}>
                <label
                  onPointerDown={stop}
                  className="flex min-h-[1.75rem] cursor-pointer items-center gap-2 text-[0.9375rem] leading-tight italic"
                  style={{ fontFamily: FRAUNCES }}
                >
                  <input
                    type="checkbox"
                    checked={done[i]}
                    onChange={() => tick(i)}
                    className="size-4 shrink-0 accent-[#a3402a]"
                  />
                  <span className={done[i] ? "line-through decoration-[#a3402a] decoration-2" : ""}>
                    {item}
                  </span>
                </label>
              </li>
            ))}
          </ul>
          <p className="relative mt-2 pl-4 text-[0.875rem]">
            Se sirve el <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>.
          </p>
        </Arrive>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={() => {
              setDone(items.map(() => true));
              haptic([8, 30, 8, 30, 14]);
            }}
            disabled={all}
            className="mt-3 rounded-full bg-[#a3402a] px-6 py-2.5 text-[0.9375rem] font-medium text-[#fffaf0] disabled:opacity-70"
          >
            {all ? "¡Listo para servir!" : "Tenerlo todo"}
          </button>
          <p className="short-hide mt-1.5 text-[0.8125rem] italic">
            O tacha los ingredientes uno a uno.
          </p>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

export const MORE_NEW_COVERS = {
  crucigrama: CrosswordCover,
  tren: TrainTicketCover,
  receta: RecipeCover,
};
