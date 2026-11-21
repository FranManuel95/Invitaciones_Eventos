"use client";

import { animate } from "motion/react";
import { useRef, useState, type PointerEvent } from "react";
import type { WeddingEvent } from "@/lib/domain/types";
import { hostNames, hostsOf } from "@/lib/event-kind";
import { formatLongDate, isoDay } from "@/lib/format";
import { haptic, isMuted, playNotes, playTick } from "../effects/sound";
import {
  After,
  Arrive,
  dateParts,
  FRAUNCES,
  OpenHint,
  PLAYFAIR,
  SANS,
  type ConceptProps,
} from "./concept-kit";

/*
 * Portadas de concepto de la quinta tanda (ronda 38): la llave de la habitación de un hotel
 * antiguo, una partitura que suena al tocar sus notas y una brújula que señala el lugar de la boda.
 */

const names = (event: WeddingEvent, joiner = " y ") => hostNames(hostsOf(event), joiner);
const stop = (e: PointerEvent) => e.stopPropagation();

/* ─────────────── Llave de hotel: se gira en la cerradura ─────────────── */

function HotelKeyCover({ event, onOpen, reduce }: ConceptProps) {
  const [turn, setTurn] = useState(0);
  const drag = useRef<{ x: number; start: number } | null>(null);
  const open = turn >= 0.98;
  const { dd, mm } = dateParts(event.date);

  const twist = (value: number) =>
    setTurn((current) => {
      const next = Math.max(0, Math.min(1, value));
      if (next >= 0.98 && current < 0.98) {
        haptic([10, 20, 30]);
        playTick();
      }
      return next;
    });
  const unlock = () => {
    if (reduce) return twist(1);
    animate(turn, 1, { duration: 0.7, ease: [0.3, 1.3, 0.5, 1], onUpdate: twist });
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="paper-grain absolute inset-0 opacity-60" />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Gran Hotel {event.city}</p>
        <Arrive
          reduce={reduce}
          tilt={0}
          className="relative mt-4 flex w-full flex-col items-center"
        >
          <div
            data-lock={open ? "abierta" : "cerrada"}
            onPointerDown={(e) => {
              stop(e);
              drag.current = { x: e.clientX, start: turn };
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (!drag.current) return;
              e.stopPropagation();
              twist(drag.current.start + (e.clientX - drag.current.x) / 140);
            }}
            onPointerUp={() => {
              if (drag.current && Math.abs(turn - drag.current.start) < 0.03) unlock();
              drag.current = null;
            }}
            className="relative flex cursor-ew-resize flex-col items-center"
            style={{ touchAction: "none" }}
          >
            {/* La llave de latón: gira un cuarto de vuelta en la cerradura. */}
            <svg
              viewBox="0 0 120 200"
              aria-hidden
              className="h-40 w-24 drop-shadow-[0_8px_10px_rgb(60_40_10/0.4)]"
              style={{ transform: `rotate(${turn * 90}deg)`, transformOrigin: "50% 85%" }}
            >
              <defs>
                <linearGradient id="laton" x1="0" x2="1">
                  <stop offset="0" stopColor="#8a6524" />
                  <stop offset="0.45" stopColor="#e6c26b" />
                  <stop offset="1" stopColor="#9c7430" />
                </linearGradient>
              </defs>
              <circle cx="60" cy="38" r="30" fill="none" stroke="url(#laton)" strokeWidth="12" />
              <circle cx="60" cy="38" r="9" fill="url(#laton)" />
              <rect x="54" y="66" width="12" height="118" rx="3" fill="url(#laton)" />
              <path d="M66 150h18v10h-10v8h10v12H66z" fill="url(#laton)" />
            </svg>
            {/* La cerradura con su escudo. */}
            <div className="-mt-6 grid size-16 place-items-center rounded-full bg-[radial-gradient(circle,#e6c26b,#9c7430)] shadow-inner">
              <span className="block h-6 w-2 rounded-full bg-[#2a1d0c]" />
            </div>
            <p className="mt-1 text-[0.75rem] tracking-[0.18em] uppercase">
              {open ? "Abierta" : "Gira la llave"}
            </p>
          </div>
          {/* La placa de la llave, colgando: número de habitación y huéspedes. */}
          <div className="mt-4 w-[min(78vw,17rem)] rounded-[1.5rem_1.5rem_2.5rem_2.5rem] border-[3px] border-[#9c7430] bg-[#6e1f2c] px-5 pt-4 pb-5 text-[#f6e7c6] shadow-[0_18px_30px_-16px_rgb(40_10_10/0.6)]">
            <p className="text-[0.625rem] tracking-[0.24em] uppercase">Habitación</p>
            <p
              className="text-[2.4rem] leading-none font-semibold"
              style={{ fontFamily: FRAUNCES }}
            >
              {dd}
              {mm}
            </p>
            <h1
              id="cover-title"
              tabIndex={-1}
              translate="no"
              className="mt-2 text-[clamp(1.6rem,7.4vw,2.1rem)] leading-tight italic outline-none"
              style={{ fontFamily: PLAYFAIR }}
            >
              {names(event)}
            </h1>
            <p className="mt-1 text-[0.8125rem]">
              Entrada: <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>
            </p>
            <p className="text-[0.75rem] opacity-90">Salida: nunca</p>
          </div>
        </Arrive>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={unlock}
            disabled={open}
            className="mt-3 rounded-full bg-[#6e1f2c] px-6 py-2.5 text-[0.9375rem] font-medium text-[#f6e7c6] disabled:opacity-70"
          >
            {open ? "Puerta abierta" : "Girar la llave"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Partitura: las notas suenan al tocarlas ─────────────── */

// Una melodía corta y alegre (Do mayor): altura en el pentagrama y frecuencia de cada nota.
const MELODY: [step: number, hz: number][] = [
  [0, 523.25],
  [2, 659.25],
  [4, 783.99],
  [5, 880],
  [4, 783.99],
  [2, 659.25],
  [3, 698.46],
  [7, 1046.5],
];

function ScoreCover({ event, onOpen, reduce }: ConceptProps) {
  const [played, setPlayed] = useState<boolean[]>(() => MELODY.map(() => false));
  const all = played.every(Boolean);
  const hosts = hostsOf(event);
  // La letra bajo las notas: vuestros nombres.
  const lyric = [hosts.first, hosts.second].filter(Boolean).join(" y ");

  const play = (i: number) => {
    playNotes([MELODY[i]![1]], "sine", 0.2);
    setPlayed((current) => {
      const next = current.map((v, k) => v || k === i);
      if (next.every(Boolean) && !current.every(Boolean)) haptic([8, 20, 8, 20, 16]);
      return next;
    });
  };
  const playAll = () =>
    MELODY.forEach((_, i) => window.setTimeout(() => play(i), reduce ? 0 : i * 260));

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="paper-grain absolute inset-0 opacity-70" />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-5 pt-[max(4.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center">
        <Arrive
          reduce={reduce}
          tilt={-1}
          className="w-full bg-[#fbf7ec] px-4 pt-4 pb-5 shadow-[0_22px_40px_-20px_rgb(40_30_20/0.5)]"
        >
          <p className="text-[0.6875rem] tracking-[0.2em] uppercase">Op. 1 · Allegro con amore</p>
          <h1
            id="cover-title"
            tabIndex={-1}
            translate="no"
            className="mt-1 text-[clamp(1.9rem,8.8vw,2.5rem)] leading-tight italic outline-none"
            style={{ fontFamily: PLAYFAIR }}
          >
            Marcha nupcial de {names(event)}
          </h1>
          {/* El pentagrama con la clave de sol y las notas, que suenan al tocarlas. */}
          <div data-score={all ? "tocada" : "sin-tocar"} className="relative mt-3">
            <svg viewBox="0 0 320 100" className="w-full" aria-hidden>
              {[0, 1, 2, 3, 4].map((l) => (
                <line
                  key={l}
                  x1="4"
                  x2="316"
                  y1={20 + l * 12}
                  y2={20 + l * 12}
                  stroke="#2b2620"
                  strokeWidth="1"
                />
              ))}
              <text x="6" y="72" fontSize="64" fill="#2b2620" style={{ fontFamily: "serif" }}>
                𝄞
              </text>
              <line x1="316" x2="316" y1="20" y2="68" stroke="#2b2620" strokeWidth="3" />
              {MELODY.map(([step], i) => {
                // Do central (paso 0) bajo el pentagrama; cada paso, media línea más arriba.
                const y = 80 - step * 6;
                const x = 78 + i * 30;
                const color = played[i] ? "#a3402a" : "#2b2620";
                return (
                  <g
                    key={i}
                    onPointerDown={stop}
                    onClick={() => play(i)}
                    className="cursor-pointer"
                    data-note={played[i] ? "sonada" : "muda"}
                  >
                    <rect x={x - 13} y="8" width="26" height="90" fill="transparent" />
                    {step === 0 ? (
                      <line x1={x - 11} x2={x + 11} y1="80" y2="80" stroke="#2b2620" />
                    ) : null}
                    <ellipse
                      cx={x}
                      cy={y}
                      rx="7.5"
                      ry="5.5"
                      fill={color}
                      transform={`rotate(-20 ${x} ${y})`}
                    />
                    <line
                      x1={x + 6.8}
                      x2={x + 6.8}
                      y1={y}
                      y2={y - 34}
                      stroke={color}
                      strokeWidth="1.8"
                    />
                  </g>
                );
              })}
            </svg>
          </div>
          {/* La letra de la canción, bajo el pentagrama. */}
          <p aria-hidden className="mt-0.5 pl-[19%] text-[0.875rem] italic">
            ♪ {lyric} ♪
          </p>
          <p className="mt-3 text-[0.9375rem]">
            Estreno: <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>, en{" "}
            {event.city}
          </p>
        </Arrive>
        <After reduce={reduce} className="short-hide mt-4 text-[0.875rem]">
          Toca las notas para escucharla.
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={playAll}
            disabled={all}
            className="mt-3 rounded-full bg-[#2b2620] px-6 py-2.5 text-[0.9375rem] font-medium text-[#fbf7ec] disabled:opacity-70"
          >
            {all ? "¡Bravo!" : "Tocar la melodía"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Brújula: la aguja busca el lugar de la boda ─────────────── */

/** Coordenadas en grados y minutos («40° 08′ N»), si el tiempo se calculó con ellas. */
function coordinate(value: number, positive: string, negative: string) {
  const abs = Math.abs(value);
  const deg = Math.floor(abs);
  const min = Math.round((abs - deg) * 60);
  return `${deg}° ${String(min).padStart(2, "0")}′ ${value >= 0 ? positive : negative}`;
}

function CompassCover({ event, onOpen, reduce }: ConceptProps) {
  const [angle, setAngle] = useState(-128);
  const drag = useRef<{ a: number; start: number } | null>(null);
  const found = Math.abs(angle) < 4;
  const place = event.climate;
  const coords =
    place?.lat != null && place.lon != null
      ? `${coordinate(place.lat, "N", "S")} · ${coordinate(place.lon, "E", "O")}`
      : null;

  const point = (value: number) =>
    setAngle((current) => {
      if (Math.abs(value) < 4 && Math.abs(current) >= 4) haptic([12, 30, 12]);
      if (Math.floor(value / 15) !== Math.floor(current / 15)) playTick();
      return value;
    });
  const seek = () => {
    if (reduce) return point(0);
    animate(angle, 0, { type: "spring", stiffness: 60, damping: 7, onUpdate: point });
  };
  const angleAt = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return (
      (Math.atan2(e.clientX - (r.left + r.width / 2), -(e.clientY - (r.top + r.height / 2))) *
        180) /
      Math.PI
    );
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="paper-grain absolute inset-0 opacity-70" />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Rumbo a la boda de</p>
        <h1
          id="cover-title"
          tabIndex={-1}
          translate="no"
          className="mt-1 text-[clamp(2.1rem,9.6vw,2.8rem)] leading-[1.02] outline-none"
          style={{ fontFamily: FRAUNCES }}
        >
          {names(event)}
        </h1>
        <Arrive reduce={reduce} tilt={0} className="relative mt-5 w-[min(72vw,16.5rem)]">
          <div
            data-compass={found ? "encontrado" : "buscando"}
            onPointerDown={(e) => {
              stop(e);
              drag.current = { a: angleAt(e), start: angle };
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (!drag.current) return;
              e.stopPropagation();
              let next = drag.current.start + angleAt(e) - drag.current.a;
              next = ((((next + 180) % 360) + 360) % 360) - 180;
              point(next);
            }}
            onPointerUp={() => {
              if (drag.current && Math.abs(angle - drag.current.start) < 2) seek();
              drag.current = null;
            }}
            className="relative aspect-square w-full cursor-grab rounded-full border-[10px] border-[#9c7430] bg-[radial-gradient(circle,#fbf4e2,#eadcbd)] shadow-[0_20px_34px_-14px_rgb(40_30_10/0.6),inset_0_0_0_2px_#e6c26b]"
            style={{ touchAction: "none" }}
          >
            <svg viewBox="0 0 200 200" aria-hidden className="absolute inset-0">
              {Array.from({ length: 36 }, (_, i) => (
                <line
                  key={i}
                  x1="100"
                  y1="10"
                  x2="100"
                  y2={i % 9 === 0 ? 24 : 17}
                  stroke="#3b2e1c"
                  strokeWidth={i % 9 === 0 ? 2 : 1}
                  transform={`rotate(${i * 10} 100 100)`}
                />
              ))}
              {[
                ["N", 0],
                ["E", 90],
                ["S", 180],
                ["O", 270],
              ].map(([l, a]) => (
                <text
                  key={l}
                  x="100"
                  y="40"
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="700"
                  fill={l === "N" ? "#9b1d2c" : "#3b2e1c"}
                  transform={`rotate(${a} 100 100)`}
                >
                  {l}
                </text>
              ))}
              {/* La aguja: roja hacia el lugar, la otra punta en negro. */}
              <g transform={`rotate(${angle} 100 100)`}>
                <path d="M100 46L110 100H90z" fill="#9b1d2c" />
                <path d="M100 154L110 100H90z" fill="#3b2e1c" />
                <circle cx="100" cy="100" r="6" fill="#e6c26b" stroke="#3b2e1c" />
              </g>
            </svg>
          </div>
          {/* El destino, grabado bajo el norte. */}
          <p className="mt-3 text-[1.0625rem] font-semibold">{event.city}</p>
          {coords ? <p className="text-[0.8125rem] tabular-nums">{coords}</p> : null}
        </Arrive>
        <After reduce={reduce} className="mt-3 text-[0.9375rem]">
          <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={seek}
            disabled={found}
            className="mt-3 rounded-full bg-[#9b1d2c] px-6 py-2.5 text-[0.9375rem] font-medium text-[#fbf4e2] disabled:opacity-70"
          >
            {found ? "Rumbo encontrado" : "Buscar el rumbo"}
          </button>
          <p className="short-hide mt-1.5 text-[0.8125rem] italic">O gira la aguja con el dedo.</p>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Lacre: el sello de latón se estampa en la cera (vídeo) ─────────────── */

function WaxSealCover({ event, onOpen, reduce }: ConceptProps) {
  const video = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<"listo" | "sellando" | "sellado">("listo");
  const hosts = hostsOf(event);
  const initials = [hosts.first[0], hosts.second?.[0]].filter(Boolean).join(" & ");

  const seal = async () => {
    if (state !== "listo") return;
    const el = video.current;
    if (reduce || !el) {
      setState("sellado");
      haptic(20);
      return;
    }
    setState("sellando");
    el.muted = isMuted();
    try {
      await el.play();
    } catch {
      el.muted = true;
      await el.play().catch(() => setState("sellado"));
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="paper-grain absolute inset-0 opacity-60" />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Sellado a mano para</p>
        <h1
          id="cover-title"
          tabIndex={-1}
          translate="no"
          className="mt-1 text-[clamp(2rem,9vw,2.6rem)] leading-[1.02] italic outline-none"
          style={{ fontFamily: PLAYFAIR }}
        >
          {names(event)}
        </h1>
        <Arrive reduce={reduce} tilt={0} className="relative mt-4 w-[min(64vw,14.5rem)]">
          <div
            data-stamp={state}
            onPointerDown={(e) => {
              stop(e);
              void seal();
            }}
            className="relative aspect-[9/14] w-full cursor-pointer overflow-hidden rounded-[4px] shadow-[0_22px_40px_-18px_rgb(60_20_20/0.6)]"
          >
            {/* El vídeo real: el sello baja, presiona la cera y se levanta. Al acabar queda
                el lacre estampado; con movimiento reducido se ve ya sellado. */}
            {reduce && state === "sellado" ? (
              // eslint-disable-next-line @next/next/no-img-element -- fotograma fijo, ya optimizado
              <img
                src="/portadas/lacre-final.webp"
                alt=""
                className="absolute inset-0 size-full object-cover"
              />
            ) : (
              <video
                ref={video}
                poster="/portadas/lacre.webp"
                playsInline
                preload="auto"
                aria-hidden
                onEnded={() => {
                  setState("sellado");
                  haptic([30, 20, 10]);
                }}
                className="absolute inset-0 size-full object-cover object-[50%_70%]"
              >
                <source src="/portadas/lacre.mp4" type="video/mp4" />
                <source src="/portadas/lacre.webm" type="video/webm" />
              </video>
            )}
            {state === "sellado" ? (
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-[18%] text-center text-[1.35rem] text-[#f3d9a8] italic drop-shadow-[0_1px_2px_rgb(0_0_0/0.7)]"
                style={{ fontFamily: PLAYFAIR }}
              >
                {initials}
              </span>
            ) : null}
          </div>
        </Arrive>
        <After reduce={reduce} className="mt-4 text-[0.9375rem]">
          <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time> · {event.city}
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={() => void seal()}
            disabled={state !== "listo"}
            className="mt-3 rounded-full bg-[#6b1e2a] px-6 py-2.5 text-[0.9375rem] font-medium text-[#f6efe4] disabled:opacity-70"
          >
            {state === "sellado"
              ? "Carta sellada"
              : state === "sellando"
                ? "Sellando…"
                : "Estampar el sello"}
          </button>
          <p className="short-hide mt-1.5 text-[0.8125rem] italic">O toca la cera.</p>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

export const FOURTH_NEW_COVERS = {
  llave: HotelKeyCover,
  partitura: ScoreCover,
  brujula: CompassCover,
  lacre: WaxSealCover,
};
