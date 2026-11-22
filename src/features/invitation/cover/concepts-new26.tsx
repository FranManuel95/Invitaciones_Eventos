"use client";

import { animate } from "motion/react";
import { useState, type PointerEvent } from "react";
import type { WeddingEvent } from "@/lib/domain/types";
import { hostNames, hostsOf } from "@/lib/event-kind";
import { formatLongDate, isoDay } from "@/lib/format";
import { haptic, playNotes, playPaper } from "../effects/sound";
import { After, FRAUNCES, OpenHint, PLAYFAIR, SANS, type ConceptProps } from "./concept-kit";

/*
 * Portadas de concepto de la vigesimoséptima tanda (ronda 38): un tren de juguete que da la vuelta
 * al circuito, un tarro de luciérnagas que se abre y un caleidoscopio que se gira.
 */

const names = (event: WeddingEvent, joiner = " y ") => hostNames(hostsOf(event), joiner);
const stop = (e: PointerEvent) => e.stopPropagation();

/* ─────────────── Trenecito: da la vuelta al circuito ─────────────── */

function ToyTrainCover({ event, onOpen, reduce }: ConceptProps) {
  const [lap, setLap] = useState(0);
  const done = lap >= 0.99;
  const hosts = hostsOf(event);
  const go = () => {
    if (lap > 0) return;
    playNotes([523, 523, 659, 784], "square", 0.15);
    const end = () => haptic([10, 30, 10]);
    if (reduce) {
      setLap(1);
      end();
      return;
    }
    animate(0.001, 1, { duration: 3, ease: "easeInOut", onUpdate: setLap, onComplete: end });
  };
  // El circuito es una elipse; el tren la recorre entera y se para donde empezó.
  const angle = lap * Math.PI * 2 + Math.PI / 2;
  const x = 50 + Math.cos(angle) * 40;
  const y = 50 + Math.sin(angle) * 36;
  const heading = (angle * 180) / Math.PI + 90;

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,#eef4f8,#f6efe2)]" />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#1f2a36]">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">¡Viajeros al tren!</p>
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
          data-trenecito={done ? "en-la-estacion" : lap > 0 ? "en-marcha" : "parado"}
          onPointerDown={(e) => {
            stop(e);
            go();
          }}
          className="relative mt-4 h-64 w-full cursor-pointer"
        >
          {/* Las vías: dos elipses con traviesas. */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
            className="absolute inset-0 size-full"
          >
            <ellipse
              cx="50"
              cy="50"
              rx="40"
              ry="36"
              fill="#cfe3c4"
              stroke="#8a6a46"
              strokeWidth="1.6"
              strokeDasharray="1.5 2"
            />
            <ellipse
              cx="50"
              cy="50"
              rx="40"
              ry="36"
              fill="none"
              stroke="#6b6b6b"
              strokeWidth="0.5"
            />
          </svg>
          {/* La estación en el centro, con la fecha en el cartel. */}
          <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
            <span
              aria-hidden
              className="block h-4 w-24 bg-[#b3243a] [clip-path:polygon(10%_0,90%_0,100%_100%,0_100%)]"
            />
            <span className="block w-20 bg-[#fbf3e6] py-1 text-[0.625rem] leading-tight font-semibold">
              ESTACIÓN
              <br />
              {event.city.toUpperCase()}
            </span>
          </div>
          {/* La locomotora con un vagón: los nombres van en los costados. */}
          <div
            className="absolute flex items-center gap-0.5"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: `translate(-50%, -50%) rotate(${heading}deg)`,
            }}
          >
            <span
              className="flex h-6 w-12 items-center justify-center rounded-[4px] bg-[#1f4a7a] text-[0.5625rem] font-semibold text-white"
              translate="no"
            >
              {hosts.first}
            </span>
            <span
              className="flex h-6 w-12 items-center justify-center rounded-[4px] bg-[#e4572e] text-[0.5625rem] font-semibold text-white"
              translate="no"
            >
              {hosts.second}
            </span>
          </div>
        </div>
        <After reduce={reduce} className="mt-3 text-[0.9375rem]">
          {done ? "Vuelta completa. Próxima parada:" : "Pon el tren en marcha."}
          <span className="block text-[1.0625rem] font-semibold">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>, en {event.city}
          </span>
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={go}
            disabled={lap > 0}
            className="mt-3 rounded-full bg-[#1f4a7a] px-6 py-2.5 text-[0.9375rem] font-medium text-white disabled:opacity-70"
          >
            {done ? "En la estación" : lap > 0 ? "Chu, chu…" : "Poner en marcha"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Tarro de luciérnagas: se abre y escriben en la noche ─────────────── */

const FLIES = Array.from({ length: 14 }, (_, i) => ({
  x: 12 + ((i * 47) % 76),
  y: 6 + ((i * 31) % 40),
  d: (i % 5) * 0.3,
}));

function FireflyJarCover({ event, onOpen, reduce }: ConceptProps) {
  const [open, setOpen] = useState(false);
  const release = () => {
    if (open) return;
    setOpen(true);
    playNotes([1046, 1318, 1568, 2093], "sine", 0.1);
    haptic([6, 20, 6]);
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,#0d1a24,#1c3038_70%,#24402c)]"
      />
      {FLIES.map((f, i) => (
        <span
          key={i}
          aria-hidden
          className={`absolute block size-1.5 rounded-full bg-[#f6f08a] shadow-[0_0_10px_4px_rgb(246_240_138/0.6)] transition-[left,top] duration-[1600ms] ease-out ${reduce ? "" : "animate-[firefly-blink_2s_ease-in-out_infinite]"}`}
          style={{
            left: open ? `${f.x}%` : "50%",
            top: open ? `${f.y + 20}%` : "62%",
            animationDelay: `${f.d}s`,
            transitionDuration: reduce ? "0ms" : undefined,
          }}
        />
      ))}
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#f4f1df]">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Una noche de verano con</p>
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
          data-tarro={open ? "abierto" : "cerrado"}
          onPointerDown={(e) => {
            stop(e);
            release();
          }}
          className="relative mt-auto mb-4 flex h-56 w-full cursor-pointer flex-col items-center justify-end"
        >
          {/* La tapa, que se levanta y se ladea. */}
          <span
            aria-hidden
            className="mb-1 block h-4 w-24 rounded-[4px] bg-[#9aa0a8] transition-transform duration-500"
            style={{
              transform: open ? "translate(40px, -30px) rotate(28deg)" : "none",
              transitionDuration: reduce ? "0ms" : undefined,
            }}
          />
          <div className="flex h-36 w-28 items-center justify-center rounded-t-[10px] rounded-b-[24px] border-2 border-[#cfe0e6]/70 bg-[rgb(207_224_230/0.15)]">
            {!open ? (
              <span
                aria-hidden
                className="block size-10 rounded-full bg-[radial-gradient(circle,rgb(246_240_138/0.7),transparent_70%)]"
              />
            ) : null}
          </div>
        </div>
        <After reduce={reduce} className="text-[0.9375rem]">
          {open ? "Salen y escriben la fecha en la noche:" : "Abre el tarro con cuidado."}
          <span className="block text-[1.0625rem] font-semibold text-[#f6f08a]">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>, en {event.city}
          </span>
        </After>
        <div className="flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={release}
            disabled={open}
            className="mt-3 rounded-full bg-[#f6f08a] px-6 py-2.5 text-[0.9375rem] font-medium text-[#0d1a24] disabled:opacity-70"
          >
            {open ? "Luciérnagas libres" : "Abrir el tarro"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Caleidoscopio: se gira y aparece el dibujo ─────────────── */

function KaleidoscopeCover({ event, onOpen, reduce }: ConceptProps) {
  const [turns, setTurns] = useState(0);
  const done = turns >= 3;
  const twist = () => {
    if (done) return;
    setTurns(turns + 1);
    playPaper(0.15);
    haptic(8);
    if (turns + 1 >= 3) playNotes([659, 880, 1046], "sine", 0.12);
  };
  const palette = ["#e4572e", "#ffc93c", "#4cc9f0", "#b388ff", "#7bd389", "#ff5d8f"];

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#2a1f3a,#120c1c_75%)]"
      />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#f6effc]">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Mira por el caleidoscopio</p>
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
          data-caleidoscopio={done ? "flor" : `giro-${turns}`}
          onPointerDown={(e) => {
            stop(e);
            twist();
          }}
          className="relative mt-6 size-64 cursor-pointer rounded-full border-[10px] border-[#3a2c52] shadow-[0_0_0_3px_#c9a65d]"
        >
          {/* Seis espejos: cada giro reordena los cristales; al tercero forman una flor. */}
          <svg
            viewBox="-50 -50 100 100"
            aria-hidden
            className="size-full rounded-full transition-transform duration-500"
            style={{
              transform: `rotate(${turns * 40}deg)`,
              transitionDuration: reduce ? "0ms" : undefined,
            }}
          >
            {Array.from({ length: 6 }, (_, i) => (
              <g key={i} transform={`rotate(${i * 60})`}>
                <path
                  d={done ? "M0 0L-10 -40Q0 -48 10 -40Z" : "M0 0L-18 -44L18 -44Z"}
                  fill={palette[(i + turns) % palette.length]}
                  opacity="0.85"
                />
                <circle
                  cx={done ? 0 : 8}
                  cy={done ? -22 : -30}
                  r={done ? 4 : 6}
                  fill={palette[(i + turns + 2) % palette.length]}
                />
              </g>
            ))}
            <circle r={done ? 9 : 5} fill="#ffd97a" />
          </svg>
        </div>
        <After reduce={reduce} className="mt-5 text-[0.9375rem]">
          {done
            ? "Todas las piezas encajan. Nos vemos el"
            : "Gíralo tres veces hasta que salga la flor."}
          <span className="block text-[1.0625rem] font-semibold">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>, en {event.city}
          </span>
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={twist}
            disabled={done}
            className="mt-3 rounded-full bg-[#ffd97a] px-6 py-2.5 text-[0.9375rem] font-medium text-[#120c1c] disabled:opacity-70"
          >
            {done ? "¡Qué bonito!" : `Girar (${turns}/3)`}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

export const TWENTYSIXTH_NEW_COVERS = {
  trenecito: ToyTrainCover,
  tarro: FireflyJarCover,
  caleidoscopio: KaleidoscopeCover,
};
