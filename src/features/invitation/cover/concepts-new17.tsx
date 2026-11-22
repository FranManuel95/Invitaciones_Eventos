"use client";

import { animate } from "motion/react";
import { useRef, useState, type PointerEvent } from "react";
import type { WeddingEvent } from "@/lib/domain/types";
import { hostNames, hostsOf } from "@/lib/event-kind";
import { formatLongDate, isoDay } from "@/lib/format";
import { haptic, playNotes, playPaper } from "../effects/sound";
import { After, FRAUNCES, OpenHint, PLAYFAIR, SANS, type ConceptProps } from "./concept-kit";

/*
 * Portadas de concepto de la decimoctava tanda (ronda 38): un columpio que se empuja, un semáforo
 * que pasa de rojo a verde y un paraguas que se abre y deja de llover.
 */

const names = (event: WeddingEvent, joiner = " y ") => hostNames(hostsOf(event), joiner);
const stop = (e: PointerEvent) => e.stopPropagation();

/* ─────────────── Columpio: se empuja y, en lo más alto, se ve la fecha ─────────────── */

function SwingCover({ event, onOpen, reduce }: ConceptProps) {
  const [swinging, setSwinging] = useState(false);
  const push = () => {
    if (swinging) return;
    setSwinging(true);
    playPaper(0.3);
    haptic([10, 40, 10]);
  };
  const hosts = hostsOf(event);

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,#e4f0f4,#f4f1e4_70%,#c9d9a8)]"
      />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#26331f]">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Columpiándose hacia el sí</p>
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
          data-columpio={swinging ? "en-marcha" : "quieto"}
          onPointerDown={(e) => {
            stop(e);
            push();
          }}
          className="relative mt-10 h-56 w-full cursor-pointer"
        >
          {/* La rama del árbol, de la que cuelga el columpio. */}
          <span
            aria-hidden
            className="absolute -top-2 left-[-30%] h-4 w-[160%] rotate-[-3deg] rounded-full bg-[#6b4f35]"
          />
          <div
            className={`absolute top-0 left-1/2 flex h-52 origin-top -translate-x-1/2 flex-col items-center ${swinging && !reduce ? "animate-[swing-arc_2.6s_ease-in-out_infinite]" : ""}`}
            style={swinging && reduce ? { transform: "rotate(18deg)" } : undefined}
          >
            <div className="flex w-36 flex-1 justify-between">
              <span aria-hidden className="w-0.5 bg-[#8a7a5a]" />
              <span aria-hidden className="w-0.5 bg-[#8a7a5a]" />
            </div>
            <div className="flex h-9 w-40 items-center justify-center rounded-[4px] bg-[#7a4f2c] text-[0.8125rem] font-semibold text-[#fff8ea] shadow-[0_8px_14px_-8px_rgb(60_40_20/0.6)]">
              <span translate="no">
                {hosts.first} ♥ {hosts.second}
              </span>
            </div>
          </div>
        </div>
        <After reduce={reduce} className="mt-4 text-[0.9375rem]">
          {swinging
            ? "¡Más alto! Nos vemos en lo más alto:"
            : "Empújalo y verás hasta dónde llega."}
          <span className="block text-[1.0625rem] font-semibold">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>, en {event.city}
          </span>
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={push}
            disabled={swinging}
            className="mt-3 rounded-full bg-[#4f6a35] px-6 py-2.5 text-[0.9375rem] font-medium text-white disabled:opacity-70"
          >
            {swinging ? "¡Columpiándose!" : "Empujar el columpio"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Semáforo: rojo, ámbar y verde ─────────────── */

const LIGHTS = [
  { id: "rojo", on: "#ff4b3e", label: "Guarda la fecha" },
  { id: "ambar", on: "#ffb627", label: "Confirma que vienes" },
  { id: "verde", on: "#3ddc84", label: "¡A la fiesta!" },
] as const;

function TrafficLightCover({ event, onOpen, reduce }: ConceptProps) {
  const [step, setStep] = useState(0);
  const go = step >= 2;
  const next = () => {
    if (go) return;
    const n = step + 1;
    setStep(n);
    haptic(12);
    playNotes(n >= 2 ? [660, 880] : [440], "sine", 0.12);
  };
  const current = LIGHTS[Math.min(step, 2)] ?? LIGHTS[0];

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,#2b2f38,#1a1d24)]" />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#f1f2f4]">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Vía libre para</p>
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
          data-semaforo={current.id}
          onPointerDown={(e) => {
            stop(e);
            next();
          }}
          className="mt-6 flex cursor-pointer flex-col items-center"
        >
          <div className="flex flex-col gap-3 rounded-[18px] bg-[#111317] p-4 ring-4 ring-[#3a3f4a]">
            {LIGHTS.map((light, i) => (
              <span
                key={light.id}
                aria-hidden
                className="block size-16 rounded-full transition-[background,box-shadow] duration-300"
                style={{
                  background: i === step ? light.on : "#2a2d34",
                  boxShadow:
                    i === step ? `0 0 30px 6px ${light.on}88` : "inset 0 2px 6px rgb(0 0 0 / 0.6)",
                  transitionDuration: reduce ? "0ms" : undefined,
                }}
              />
            ))}
          </div>
          <span aria-hidden className="h-16 w-3 bg-[#3a3f4a]" />
        </div>
        <After reduce={reduce} className="mt-4 text-[0.9375rem]">
          <span className="block text-[1.125rem] font-semibold">{current.label}</span>
          <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time> · {event.city}
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={next}
            disabled={go}
            className="mt-3 rounded-full bg-[#3ddc84] px-6 py-2.5 text-[0.9375rem] font-medium text-[#0d2a18] disabled:opacity-70"
          >
            {go ? "Vía libre" : "Cambiar de color"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Paraguas: se abre y deja de llover ─────────────── */

const DROPS = Array.from({ length: 40 }, (_, i) => ({
  x: (i * 41) % 100,
  delay: ((i * 17) % 12) / 10,
  dur: 0.7 + ((i * 7) % 6) / 10,
}));

/** Lo que hay que subir el dedo (en píxeles) para abrir el paraguas entero. */
const UMBRELLA_PUSH = 130;
/** Las varillas que se ven de lado: el ángulo de cada una alrededor del mástil. */
const RIBS = [180, 135, 90, 45, 0];

function UmbrellaCover({ event, onOpen, reduce }: ConceptProps) {
  // `o` va de 0 (plegado) a 1 (abierto); el corredor sube por el mástil al abrirlo.
  const [o, setO] = useState(0);
  const [open, setOpen] = useState(false);
  const drag = useRef<{ y: number; start: number; moved: boolean } | null>(null);
  const click = () => {
    setOpen(true);
    playPaper(0.4);
    haptic([12, 30, 12]);
  };
  const unfurl = (from = o) => {
    if (open) return;
    if (reduce) {
      setO(1);
      click();
      return;
    }
    animate(from, 1, {
      duration: 0.5 * (1 - from) + 0.15,
      ease: "easeOut",
      onUpdate: setO,
      onComplete: click,
    });
  };
  const letGo = (from: number) => {
    if (from >= 0.7) return unfurl(from);
    if (reduce) return setO(0);
    animate(from, 0, { duration: 0.35, ease: "easeIn", onUpdate: setO });
  };
  // Cada varilla va del pico a su punta: plegada, pegada al mástil; abierta, en cúpula.
  const tip = { x: 100, y: 16 };
  const ends = RIBS.map((deg) => {
    const c = Math.cos((deg * Math.PI) / 180);
    const depth = Math.sin((deg * Math.PI) / 180);
    const spread = { x: 100 + 94 * c, y: 96 + 10 * depth };
    const shut = { x: 100 + 5 * c, y: 128 };
    return { x: shut.x + (spread.x - shut.x) * o, y: shut.y + (spread.y - shut.y) * o };
  });
  const runnerY = 176 - o * 64;
  // El punto de control de cada varilla: plegada, casi recta; abierta, hacia fuera, en cúpula.
  const ctrl = (a: { x: number; y: number }) => ({
    x: tip.x + (a.x - tip.x) * (0.2 + 0.75 * o),
    y: tip.y + (a.y - tip.y) * (0.55 - 0.45 * o),
  });
  const panel = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    // El borde de cada gajo se combea hacia arriba entre varilla y varilla.
    const ca = ctrl(a);
    const cb = ctrl(b);
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2 - 9 * o;
    return `M${tip.x} ${tip.y}Q${ca.x} ${ca.y} ${a.x} ${a.y}Q${mx} ${my} ${b.x} ${b.y}Q${cb.x} ${cb.y} ${tip.x} ${tip.y}Z`;
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div
        aria-hidden
        className="absolute inset-0 transition-[background] duration-700"
        style={{
          background: open
            ? "linear-gradient(180deg,#cfe6f2,#f6efe0)"
            : "linear-gradient(180deg,#8d9aa6,#c3cbd2)",
        }}
      />
      {!open && !reduce
        ? DROPS.map((d, n) => (
            <span
              key={n}
              aria-hidden
              className="absolute top-0 block h-5 w-px animate-[rain-fall_linear_infinite] bg-white/70"
              style={{
                left: `${d.x}%`,
                animationDuration: `${d.dur}s`,
                animationDelay: `${d.delay}s`,
              }}
            />
          ))
        : null}
      {/* El charco del suelo: con lluvia tiene ondas; con sol, refleja el cielo. */}
      <svg aria-hidden viewBox="0 0 390 60" className="absolute inset-x-0 bottom-[18%] w-full">
        <ellipse cx="195" cy="30" rx="150" ry="18" fill={open ? "#b9d9ea" : "#7f8c97"} />
        {!open ? (
          <>
            <ellipse cx="140" cy="30" rx="18" ry="5" fill="none" stroke="#c3cbd2" />
            <ellipse cx="250" cy="34" rx="12" ry="3.5" fill="none" stroke="#c3cbd2" />
          </>
        ) : null}
      </svg>
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#1f2a33]">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Llueva o haga sol, se casan</p>
        <h1
          id="cover-title"
          tabIndex={-1}
          translate="no"
          className="mt-1 text-[clamp(2.1rem,9.4vw,2.8rem)] leading-[1.02] italic outline-none"
          style={{ fontFamily: PLAYFAIR }}
        >
          {names(event)}
        </h1>
        {/* El paraguas: se empuja el corredor hacia arriba por el mástil y se abre. */}
        <div
          data-paraguas={open ? "abierto" : "cerrado"}
          onPointerDown={(e) => {
            stop(e);
            if (open) return;
            drag.current = { y: e.clientY, start: o, moved: false };
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            const d = drag.current;
            if (!d) return;
            e.stopPropagation();
            const dy = d.y - e.clientY;
            if (Math.abs(dy) > 4) d.moved = true;
            setO(Math.min(1, Math.max(0, d.start + dy / UMBRELLA_PUSH)));
          }}
          onPointerUp={() => {
            const d = drag.current;
            drag.current = null;
            if (!d) return;
            if (!d.moved) return unfurl();
            letGo(o);
          }}
          onPointerCancel={() => {
            if (drag.current) letGo(o);
            drag.current = null;
          }}
          className="relative mt-6 w-60 cursor-grab touch-none active:cursor-grabbing"
        >
          <svg viewBox="0 0 200 260" aria-hidden className="w-full overflow-visible">
            {/* Los gajos, alternando rojo y crudo, y las varillas por encima. */}
            {ends.slice(0, -1).map((a, n) => (
              <path
                key={n}
                d={panel(a, ends[n + 1]!)}
                fill={n % 2 ? "#f3e7d3" : "#c8312b"}
                stroke="#8a1f1a"
                strokeWidth="1"
                strokeLinejoin="round"
              />
            ))}
            {/* Las varillas del armazón y los tirantes que las empujan desde el corredor. */}
            {ends.map((e, n) => (
              <g key={n} stroke="#5a4a3a" strokeWidth="1.2" fill="none">
                <path
                  d={`M100 ${runnerY}L${0.25 * tip.x + 0.5 * ctrl(e).x + 0.25 * e.x} ${0.25 * tip.y + 0.5 * ctrl(e).y + 0.25 * e.y}`}
                />
                <circle cx={e.x} cy={e.y} r="1.8" fill="#5a4a3a" stroke="none" />
              </g>
            ))}
            <path d="M100 6v12" stroke="#3a2a1c" strokeWidth="3" strokeLinecap="round" />
            <path
              d="M100 16v196c0 22-26 22-26 4"
              stroke="#3a2a1c"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            {/* El corredor: la pieza que se empuja con el dedo. */}
            <rect
              x="94"
              y={runnerY - 7}
              width="12"
              height="14"
              rx="3"
              fill="#e8c66a"
              stroke="#8a6d32"
            />
            {!open ? (
              <path
                d={`M114 ${runnerY + 26}v-18m-5 5 5-5 5 5`}
                stroke="#1f2a33"
                strokeWidth="1.6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={1 - o}
              />
            ) : null}
          </svg>
        </div>
        <After reduce={reduce} className="mt-2 text-[0.9375rem]">
          {open ? "¡Ya no llueve! Nos vemos el" : "Llueve. Empuja el corredor y abre el paraguas."}
          <span className="block text-[1.0625rem] font-semibold">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>, en {event.city}
          </span>
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={() => unfurl()}
            disabled={open}
            className="mt-3 rounded-full bg-[#c8312b] px-6 py-2.5 text-[0.9375rem] font-medium text-white disabled:opacity-70"
          >
            {open ? "Paraguas abierto" : "Abrir el paraguas"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

export const SEVENTEENTH_NEW_COVERS = {
  columpio: SwingCover,
  semaforo: TrafficLightCover,
  paraguas: UmbrellaCover,
};
