"use client";

import { animate } from "motion/react";
import { useRef, useState, type PointerEvent } from "react";
import type { WeddingEvent } from "@/lib/domain/types";
import { hostNames, hostsOf } from "@/lib/event-kind";
import { formatLongDate, isoDay } from "@/lib/format";
import { haptic, playNotes, playTick } from "../effects/sound";
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
 * Portadas de concepto de la novena tanda (ronda 38): un teléfono de disco en el que se marca la
 * fecha, una radio antigua que se sintoniza en la emisora de la boda y una máquina de escribir
 * que teclea los nombres.
 */

const names = (event: WeddingEvent, joiner = " y ") => hostNames(hostsOf(event), joiner);
const stop = (e: PointerEvent) => e.stopPropagation();

/* ─────────────── Teléfono de disco: se marca la fecha ─────────────── */

function RotaryPhoneCover({ event, onOpen, reduce }: ConceptProps) {
  const { dd, mm, yy } = dateParts(event.date);
  const number = `${dd}${mm}${yy}`;
  const [dialed, setDialed] = useState("");
  const [spin, setSpin] = useState(0);
  const done = dialed.length >= number.length;

  const dial = (digit: string) => {
    if (done) return;
    const turns = (digit === "0" ? 10 : Number(digit)) * 28 + 30;
    const finish = () =>
      setDialed((current) => {
        const next = current + digit;
        if (next.length >= number.length) {
          haptic([10, 40, 10, 40, 30]);
          playNotes([440, 480], "sine", 0.4);
        }
        return next;
      });
    playTick();
    if (reduce) return finish();
    animate(0, turns, {
      duration: 0.35,
      onUpdate: setSpin,
      onComplete: () => {
        animate(turns, 0, { duration: 0.45, onUpdate: setSpin, onComplete: finish });
      },
    });
  };
  const dialAll = () => {
    if (reduce) {
      setDialed(number);
      haptic(20);
      return;
    }
    [...number.slice(dialed.length)].forEach((d, i) => window.setTimeout(() => dial(d), i * 900));
  };
  const next = number[dialed.length] ?? "";

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="paper-grain absolute inset-0 opacity-50" />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Llamada a cobro revertido de</p>
        <h1
          id="cover-title"
          tabIndex={-1}
          translate="no"
          className="mt-1 text-[clamp(2rem,9vw,2.6rem)] leading-[1.02] italic outline-none"
          style={{ fontFamily: FRAUNCES }}
        >
          {names(event)}
        </h1>
        <Arrive reduce={reduce} tilt={0} className="relative mt-5 w-[min(70vw,16rem)]">
          {/* El disco: los números fijos debajo y la rueda con agujeros que gira al marcar. */}
          <div
            data-phone={done ? "llamando" : "marcando"}
            className="relative aspect-square w-full rounded-full bg-[#7a1f2a] p-3 shadow-[0_20px_34px_-14px_rgb(60_10_10/0.6)]"
          >
            <div className="relative size-full rounded-full bg-[#f3ead8]">
              {Array.from({ length: 10 }, (_, i) => {
                const digit = String((i + 1) % 10);
                const angle = -60 - i * 28;
                const r = 38;
                const x = 50 + r * Math.cos((angle * Math.PI) / 180);
                const y = 50 + r * Math.sin((angle * Math.PI) / 180);
                return (
                  <button
                    key={digit}
                    type="button"
                    tabIndex={-1}
                    aria-hidden
                    onPointerDown={stop}
                    onClick={() => dial(digit)}
                    className={`absolute grid size-[17%] -translate-1/2 place-items-center rounded-full text-[1rem] font-bold ${digit === next ? "bg-[#c9a14a]/40" : ""}`}
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    {digit}
                  </button>
                );
              })}
              {/* La rueda transparente con sus agujeros, que gira. */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-[4%] rounded-full border-[3px] border-[#1f1a17]/70"
                style={{ transform: `rotate(${spin}deg)` }}
              >
                <span className="absolute top-1/2 left-1/2 size-[36%] -translate-1/2 rounded-full bg-[#7a1f2a] shadow-inner" />
              </span>
              {/* El tope de metal. */}
              <span
                aria-hidden
                className="absolute right-[6%] bottom-[22%] h-[4%] w-[16%] rotate-[30deg] rounded-full bg-[#b9b2a4]"
              />
            </div>
          </div>
          {/* La tira de papel con el número marcado. */}
          <p className="mt-4 text-[0.6875rem] tracking-[0.18em] uppercase">Marca la fecha</p>
          <p className="text-[1.9rem] leading-none tabular-nums" style={{ fontFamily: COURIER }}>
            {[...number].map((d, i) => (
              <span key={i} className={i < dialed.length ? "" : "opacity-25"}>
                {d}
                {i === 1 || i === 3 ? " " : ""}
              </span>
            ))}
          </p>
          <p className="mt-2 text-[0.875rem]">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time> · {event.city}
          </p>
        </Arrive>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={dialAll}
            disabled={done}
            className="mt-3 rounded-full bg-[#7a1f2a] px-6 py-2.5 text-[0.9375rem] font-medium text-[#f3ead8] disabled:opacity-70"
          >
            {done ? "¡Al habla los novios!" : "Marcar la fecha"}
          </button>
          <p className="short-hide mt-1.5 text-[0.8125rem] italic">O marca tú los números.</p>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Radio antigua: se sintoniza la emisora de la boda ─────────────── */

function RadioCover({ event, onOpen, reduce }: ConceptProps) {
  const { dd, mm } = dateParts(event.date);
  const station = 90 + ((Number(dd) * 31 + Number(mm) * 7) % 160) / 10;
  const [freq, setFreq] = useState(88);
  const drag = useRef<{ x: number; start: number } | null>(null);
  const tuned = Math.abs(freq - station) < 0.25;

  const tune = (value: number) =>
    setFreq((current) => {
      const next = Math.max(88, Math.min(108, value));
      if (Math.abs(next - station) < 0.25 && Math.abs(current - station) >= 0.25) {
        haptic([10, 30, 10]);
        playNotes([523, 659, 784], "sine", 0.12);
      } else if (Math.floor(next) !== Math.floor(current)) playTick();
      return next;
    });
  const seek = () => {
    if (reduce) return tune(station);
    animate(freq, station, { duration: 1.1, ease: "easeInOut", onUpdate: tune });
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="paper-grain absolute inset-0 opacity-50" />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-5 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center">
        <Arrive
          reduce={reduce}
          tilt={0}
          className="w-full rounded-[20px_20px_10px_10px] bg-[linear-gradient(180deg,#8a5a2c,#5f3b1c)] p-3 shadow-[0_24px_40px_-18px_rgb(50_25_10/0.7)]"
        >
          {/* La rejilla del altavoz, de tela. */}
          <div className="rounded-[14px_14px_4px_4px] bg-[repeating-linear-gradient(90deg,#d9c39a_0_3px,#c4ab7d_3px_6px)] px-4 pt-4 pb-3 text-[#2c1a0c]">
            <p className="text-[0.625rem] tracking-[0.22em] uppercase">
              Radio Amor · Emitiendo para
            </p>
            <h1
              id="cover-title"
              tabIndex={-1}
              translate="no"
              className="mt-1 text-[clamp(1.7rem,7.8vw,2.2rem)] leading-tight font-bold outline-none"
              style={{ fontFamily: FRAUNCES }}
            >
              {names(event)}
            </h1>
            <p className="mt-1 text-[0.875rem]">
              <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time> · {event.city}
            </p>
          </div>
          {/* El dial de sintonía: se arrastra la aguja hasta la emisora de la boda. */}
          <div
            data-radio={tuned ? "sintonizada" : "buscando"}
            onPointerDown={(e) => {
              stop(e);
              drag.current = { x: e.clientX, start: freq };
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (!drag.current) return;
              e.stopPropagation();
              tune(drag.current.start + (e.clientX - drag.current.x) / 14);
            }}
            onPointerUp={() => {
              if (drag.current && Math.abs(freq - drag.current.start) < 0.1) seek();
              drag.current = null;
            }}
            className="relative mt-3 h-16 cursor-ew-resize rounded-[6px] bg-[#f6e7c0] px-3 text-[#2c1a0c] shadow-inner"
            style={{ touchAction: "none" }}
          >
            <div
              aria-hidden
              className="absolute inset-x-3 top-2 flex justify-between text-[0.625rem] tabular-nums"
            >
              {[88, 92, 96, 100, 104, 108].map((f) => (
                <span key={f}>{f}</span>
              ))}
            </div>
            <div
              aria-hidden
              className="absolute inset-x-3 top-7 h-3 bg-[repeating-linear-gradient(90deg,#2c1a0c_0_1px,transparent_1px_8px)] opacity-60"
            />
            <span
              aria-hidden
              className="absolute top-1 bottom-1 w-[3px] rounded-full bg-[#c21b2a]"
              style={{
                left: `calc(0.75rem + ${((freq - 88) / 20) * 100}% - ${((freq - 88) / 20) * 1.5}rem)`,
              }}
            />
            <p className="absolute right-3 bottom-1.5 text-[0.75rem] font-bold tabular-nums">
              {freq.toFixed(1)} FM
            </p>
          </div>
          <div className="mt-3 rounded-[6px] bg-[#2c1a0c] px-3 py-2 text-left text-[0.8125rem] text-[#f6e7c0]">
            {tuned ? (
              <p>
                ♪ En antena: la boda de {names(event)}. Os esperamos en {event.city}.
              </p>
            ) : (
              <p>
                Sintoniza el {station.toFixed(1)} FM.{" "}
                <span className="opacity-80">Solo se oye ruido…</span>
              </p>
            )}
          </div>
        </Arrive>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={seek}
            disabled={tuned}
            className="mt-3 rounded-full bg-[#5f3b1c] px-6 py-2.5 text-[0.9375rem] font-medium text-[#f6e7c0] disabled:opacity-70"
          >
            {tuned ? "Sintonizada" : `Sintonizar ${station.toFixed(1)} FM`}
          </button>
          <p className="short-hide mt-1.5 text-[0.8125rem] italic">O mueve la aguja con el dedo.</p>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Máquina de escribir: se teclean los nombres ─────────────── */

function TypewriterCover({ event, onOpen, reduce }: ConceptProps) {
  const full = names(event);
  const [typed, setTyped] = useState(0);
  const done = typed >= full.length;

  const key = () => {
    if (done) return;
    playTick();
    setTyped((n) => {
      const next = Math.min(full.length, n + 1);
      if (next >= full.length) haptic([10, 20, 30]);
      return next;
    });
  };
  const typeAll = () => {
    if (reduce) {
      setTyped(full.length);
      return;
    }
    for (let i = typed; i < full.length; i++) window.setTimeout(key, (i - typed) * 70);
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="paper-grain absolute inset-0 opacity-50" />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-5 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center">
        <Arrive reduce={reduce} tilt={0} className="w-full">
          {/* La hoja en el rodillo: lo tecleado aparece letra a letra. */}
          <div
            className="mx-auto w-[86%] bg-[#fbf8f0] px-4 pt-4 pb-6 text-left text-[#1f1f1f] shadow-[0_10px_20px_-12px_rgb(0_0_0/0.4)]"
            style={{ fontFamily: COURIER }}
          >
            <p className="text-[0.75rem]">
              {event.city}, a{" "}
              <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>
            </p>
            <p className="mt-3 text-[0.8125rem]">Querida familia, queridos amigos:</p>
            <p className="mt-2 text-[0.8125rem]">Por la presente os comunicamos que se casan</p>
            <h1
              id="cover-title"
              tabIndex={-1}
              translate="no"
              data-typed={done ? "si" : "no"}
              className="mt-2 min-h-[2.4em] text-[clamp(1.4rem,6.6vw,1.9rem)] leading-tight font-bold outline-none"
            >
              <span>{full.slice(0, typed)}</span>
              <span className="sr-only">{full.slice(typed)}</span>
              {done ? null : (
                <span aria-hidden className="animate-pulse">
                  ▌
                </span>
              )}
            </h1>
          </div>
          {/* La máquina: el carro y el teclado redondo. */}
          <div className="relative -mt-2 rounded-[18px_18px_8px_8px] bg-[linear-gradient(180deg,#2f4f4a,#1e3531)] px-4 pt-5 pb-4 shadow-[0_24px_40px_-18px_rgb(10_30_25/0.7)]">
            <div className="grid grid-cols-8 gap-1.5">
              {"QWERTYUIASDFGHJK".split("").map((k) => (
                <button
                  key={k}
                  type="button"
                  tabIndex={-1}
                  aria-hidden
                  onPointerDown={stop}
                  onClick={key}
                  className="grid aspect-square place-items-center rounded-full border-2 border-[#c9c2b0] bg-[#1a1a1a] text-[0.6875rem] font-bold text-[#f3eee2] active:translate-y-[1px]"
                >
                  {k}
                </button>
              ))}
            </div>
            <button
              type="button"
              tabIndex={-1}
              aria-hidden
              onPointerDown={stop}
              onClick={key}
              className="mx-auto mt-2 block h-4 w-2/3 rounded-full bg-[#1a1a1a]"
            />
          </div>
        </Arrive>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={typeAll}
            disabled={done}
            className="mt-3 rounded-full bg-[#1e3531] px-6 py-2.5 text-[0.9375rem] font-medium text-[#f3eee2] disabled:opacity-70"
          >
            {done ? "Carta escrita" : "Escribir los nombres"}
          </button>
          <p className="short-hide mt-1.5 text-[0.8125rem] italic">O pulsa las teclas.</p>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

export const EIGHTH_NEW_COVERS = {
  telefono: RotaryPhoneCover,
  radio: RadioCover,
  maquina: TypewriterCover,
};
