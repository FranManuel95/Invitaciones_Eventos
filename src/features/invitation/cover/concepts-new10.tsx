"use client";

import { animate } from "motion/react";
import { useState, type PointerEvent } from "react";
import type { WeddingEvent } from "@/lib/domain/types";
import { hostNames, hostsOf } from "@/lib/event-kind";
import { formatLongDate, isoDay } from "@/lib/format";
import { seeded } from "@/lib/theme";
import { haptic, playNotes, playPaper } from "../effects/sound";
import { After, FRAUNCES, OpenHint, PLAYFAIR, SANS, type ConceptProps } from "./concept-kit";

/*
 * Portadas de concepto de la undécima tanda (ronda 38): un globo aerostático que sube al soltar
 * el lastre, una bola de nieve que se agita y dos copas que brindan.
 */

const names = (event: WeddingEvent, joiner = " y ") => hostNames(hostsOf(event), joiner);
const stop = (e: PointerEvent) => e.stopPropagation();

/* ─────────────── Globo aerostático: se suelta el lastre y sube ─────────────── */

function BalloonCover({ event, onOpen, reduce }: ConceptProps) {
  const [lift, setLift] = useState(0);
  const up = lift >= 0.98;
  const release = () => {
    if (up) return;
    playPaper(0.3);
    const done = () => haptic([10, 40, 10]);
    if (reduce) {
      setLift(1);
      done();
      return;
    }
    animate(0, 1, { duration: 1.6, ease: [0.3, 0, 0.2, 1], onUpdate: setLift, onComplete: done });
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      {/* El cielo del amanecer y unas nubes. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,#8fb7d8,#cfe0ea_55%,#f6e3cf)]"
      />
      <span
        aria-hidden
        className="absolute top-[22%] left-[6%] h-6 w-24 rounded-full bg-white/70 blur-[2px]"
      />
      <span
        aria-hidden
        className="absolute top-[34%] right-[8%] h-5 w-20 rounded-full bg-white/60 blur-[2px]"
      />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Vuelo especial de</p>
        <h1
          id="cover-title"
          tabIndex={-1}
          translate="no"
          className="mt-1 text-[clamp(2.1rem,9.4vw,2.8rem)] leading-[1.02] italic outline-none"
          style={{ fontFamily: PLAYFAIR }}
        >
          {names(event)}
        </h1>
        <div className="relative mt-2 h-[min(46svh,21rem)] w-full">
          {/* El globo: sube al soltar el lastre. */}
          <div
            data-balloon={up ? "volando" : "en-tierra"}
            className="absolute left-1/2 flex w-40 -translate-x-1/2 flex-col items-center"
            style={{ bottom: `${8 + lift * 16}%` }}
          >
            <svg
              viewBox="0 0 120 140"
              aria-hidden
              className="w-full drop-shadow-[0_10px_14px_rgb(40_40_60/0.25)]"
            >
              <path
                d="M60 4C28 4 8 28 8 56c0 30 30 52 40 70h24c10-18 40-40 40-70C112 28 92 4 60 4z"
                fill="#c8312b"
              />
              <path
                d="M60 4c-14 0-22 24-22 52 0 30 8 52 10 70h24c2-18 10-40 10-70 0-28-8-52-22-52z"
                fill="#f2c230"
              />
              <path
                d="M60 4c-4 0-6 24-6 52 0 30 2 52 2 70h8c0-18 2-40 2-70 0-28-2-52-6-52z"
                fill="#c8312b"
              />
              <path d="M48 126l2 8M72 126l-2 8" stroke="#5a3a1e" strokeWidth="1.5" />
            </svg>
            {/* La cesta, con la fecha. */}
            <div className="-mt-1 w-16 rounded-[3px] border-2 border-[#5a3a1e] bg-[repeating-linear-gradient(90deg,#b98a56_0_4px,#a4763f_4px_8px)] px-1 py-1 text-[0.5625rem] leading-tight font-bold text-[#2c1a0c]">
              <time dateTime={isoDay(event.date)}>
                {formatLongDate(event.date).replace(/ de \d{4}$/, "")}
              </time>
            </div>
            {/* El saco de lastre, colgando hasta que se suelta. */}
            {up ? null : (
              <span aria-hidden className="mt-1 h-6 w-5 rounded-[40%] bg-[#c9b48a] shadow" />
            )}
          </div>
          {/* La pradera y la carpa de la boda. */}
          <div
            aria-hidden
            className="absolute inset-x-[-1.5rem] bottom-0 h-[16%] rounded-t-[50%] bg-[#7ea05a]"
          />
        </div>
        <After reduce={reduce} className="mt-2 text-[0.9375rem]">
          Despegue: <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>, desde{" "}
          {event.city}
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={release}
            disabled={up}
            className="mt-3 rounded-full bg-[#c8312b] px-6 py-2.5 text-[0.9375rem] font-medium text-white disabled:opacity-70"
          >
            {up ? "¡En el aire!" : "Soltar el lastre"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Bola de nieve: se agita y aparece la fecha ─────────────── */

const FLAKES = (() => {
  const random = seeded(2027);
  return Array.from({ length: 34 }, () => [random() * 100, random() * 100, 2 + random() * 3]);
})();

function SnowGlobeCover({ event, onOpen, reduce }: ConceptProps) {
  const [shaking, setShaking] = useState(false);
  const [shaken, setShaken] = useState(false);
  const shake = () => {
    if (shaking) return;
    setShaking(true);
    haptic([20, 30, 20, 30, 20]);
    playNotes([1318, 1568, 1760], "sine", 0.08);
    window.setTimeout(
      () => {
        setShaking(false);
        setShaken(true);
      },
      reduce ? 0 : 1800,
    );
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="paper-grain absolute inset-0 opacity-50" />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Recuerdo de la boda de</p>
        <h1
          id="cover-title"
          tabIndex={-1}
          translate="no"
          className="mt-1 text-[clamp(2.1rem,9.4vw,2.8rem)] leading-[1.02] outline-none"
          style={{ fontFamily: FRAUNCES }}
        >
          {names(event)}
        </h1>
        {/* La bola de cristal: al agitarla nieva; cuando se posa, aparece la fecha. */}
        <div
          data-globe={shaking ? "nevando" : shaken ? "posada" : "quieta"}
          onPointerDown={(e) => {
            stop(e);
            shake();
          }}
          className={`relative mt-5 w-[min(68vw,15rem)] cursor-pointer ${shaking && !reduce ? "animate-[globe-shake_0.3s_ease-in-out_4]" : ""}`}
        >
          <div className="relative aspect-square w-full overflow-hidden rounded-full bg-[radial-gradient(circle_at_35%_30%,rgb(255_255_255/0.85),rgb(200_225_240/0.55)_45%,rgb(120_160_190/0.55))] shadow-[inset_0_-10px_30px_rgb(255_255_255/0.4),0_16px_30px_-14px_rgb(30_50_70/0.6)]">
            {/* La escena: una casita nevada con la fecha en la puerta. */}
            <div className="absolute inset-x-[18%] bottom-[14%] h-[42%]">
              <span className="absolute inset-x-[10%] bottom-0 h-[62%] rounded-[3px] bg-[#c8312b]" />
              <span className="absolute inset-x-0 bottom-[60%] h-[40%] bg-[#fefefe] [clip-path:polygon(50%_0,100%_100%,0_100%)]" />
              <span
                aria-hidden
                className={`absolute inset-x-[16%] bottom-[8%] rounded-[2px] bg-[#fff7e6] px-1 py-0.5 text-[0.625rem] leading-tight font-bold text-[#7a1f2a] transition-opacity duration-700 ${shaken && !shaking ? "opacity-100" : "opacity-0"}`}
              >
                {formatLongDate(event.date)}
              </span>
            </div>
            <span className="absolute inset-x-0 bottom-0 h-[16%] bg-white" />
            {FLAKES.map(([x, y, size], i) => (
              <span
                key={i}
                aria-hidden
                className="absolute rounded-full bg-white transition-[top] ease-out"
                style={{
                  left: `${x}%`,
                  top: shaking ? `${(y! + 30) % 100}%` : `${84 + (y! % 10)}%`,
                  width: size,
                  height: size,
                  transitionDuration: shaking ? "0.2s" : `${1.2 + (i % 5) * 0.3}s`,
                }}
              />
            ))}
          </div>
          <div className="mx-auto -mt-2 h-10 w-[70%] rounded-t-[0.3rem] rounded-b-[1rem] bg-[linear-gradient(180deg,#7a4a2c,#4e2e1a)] shadow">
            <p className="pt-3 text-[0.625rem] tracking-[0.2em] text-[#f3dfc0] uppercase">
              {event.city}
            </p>
          </div>
          <p className="mt-3 text-[0.9375rem]">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>
          </p>
        </div>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={shake}
            disabled={shaking}
            className="mt-3 rounded-full bg-[#2f4a5e] px-6 py-2.5 text-[0.9375rem] font-medium text-white disabled:opacity-70"
          >
            {shaken ? "Agitar otra vez" : "Agitar la bola"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Brindis: las dos copas chocan ─────────────── */

function ToastCover({ event, onOpen, reduce }: ConceptProps) {
  const [gap, setGap] = useState(1);
  const hosts = hostsOf(event);
  const clinked = gap <= 0.02;
  const party = event.program.find((act) => /fiesta|baile|barra/i.test(act.title));

  const toast = () => {
    if (clinked) return;
    const done = () => {
      haptic([30, 20, 10]);
      playNotes([2093, 2637], "sine", 0.25);
    };
    if (reduce) {
      setGap(0);
      done();
      return;
    }
    animate(gap, 0, { duration: 0.6, ease: [0.5, 0, 0.75, 0], onUpdate: setGap, onComplete: done });
  };

  const glass = (side: -1 | 1, label: string) => (
    <div
      className="flex flex-col items-center"
      style={{
        transform: `translateX(${side * gap * 22}%) rotate(${-side * (4 + (1 - gap) * 10)}deg)`,
        transformOrigin: "50% 100%",
      }}
    >
      <svg viewBox="0 0 60 150" aria-hidden className="h-44 w-[4.5rem]">
        <path
          d="M10 4h40l-6 62c-2 10-8 14-14 14s-12-4-14-14z"
          fill="rgb(255 255 255 / 0.55)"
          stroke="#c9a14a"
          strokeWidth="1.5"
        />
        <path d="M13 24h34l-4 42c-2 8-7 11-13 11s-11-3-13-11z" fill="#f3d27a" opacity="0.85" />
        {[18, 30, 40, 50].map((y, i) => (
          <circle key={y} cx={22 + (i % 2) * 14} cy={y + 10} r="1.5" fill="#fff" opacity="0.9" />
        ))}
        <path d="M30 80v54M16 140h28" stroke="#c9a14a" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <p className="mt-1 text-[0.875rem] italic" style={{ fontFamily: PLAYFAIR }}>
        {label}
      </p>
    </div>
  );

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_40%,#2a2440,#141024_75%)]"
      />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Brindad con</p>
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
          data-toast={clinked ? "chin-chin" : "esperando"}
          onPointerDown={(e) => {
            stop(e);
            toast();
          }}
          className="relative mt-6 flex cursor-pointer items-end justify-center gap-0"
        >
          {glass(-1, hosts.first)}
          {clinked ? (
            <span
              aria-hidden
              className="absolute top-2 left-1/2 -translate-x-1/2 text-[1.4rem] text-[#f3d27a]"
            >
              ✦
            </span>
          ) : null}
          {glass(1, hosts.second ?? "")}
        </div>
        <After reduce={reduce} className="mt-5 text-[0.9375rem]">
          <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time> · {event.city}
          {party ? (
            <span className="block text-[0.8125rem]">Se brinda a las {party.time}.</span>
          ) : null}
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={toast}
            disabled={clinked}
            className="mt-3 rounded-full bg-[#f3d27a] px-6 py-2.5 text-[0.9375rem] font-medium text-[#141024] disabled:opacity-70"
          >
            {clinked ? "¡Chin, chin!" : "Brindar"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

export const TENTH_NEW_COVERS = {
  globo: BalloonCover,
  nieve: SnowGlobeCover,
  brindis: ToastCover,
};
