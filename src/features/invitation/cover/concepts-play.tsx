"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useMemo, useRef, useState, type PointerEvent } from "react";
import type { WeddingEvent } from "@/lib/domain/types";
import { hostNames, hostsOf } from "@/lib/event-kind";
import { formatLongDate, isoDay } from "@/lib/format";
import { seeded } from "@/lib/theme";
import { haptic, playNotes, playPaper } from "../effects/sound";
import {
  ActionButton,
  dateParts,
  FRAUNCES,
  madrid,
  OpenHint,
  SANS,
  SCRIPT,
  type ConceptProps,
} from "./concept-kit";

/*
 * Portadas de concepto que piden jugar un poco: seguir la ruta del mapa, unir las estrellas,
 * pasar viñetas, pulsar el botón de la recreativa y sembrar. Todas tienen su botón alternativo.
 */

const names = (event: WeddingEvent, joiner = " y ") => hostNames(hostsOf(event), joiner);
const PIXEL = "var(--font-pixel), 'Press Start 2P', ui-monospace, monospace";
const COMIC = "var(--font-bangers), Bangers, Impact, 'Arial Narrow Bold', sans-serif";

/* ───────────────── Mapa del tesoro: se sigue la ruta con el dedo hasta la X ───────────────── */

const ROUTE = "M52 452C96 404 60 350 118 322S214 356 232 290 160 210 214 170 300 190 306 112";
// Puntos de la ruta (coordenadas del dibujo), para saber por dónde va el dedo.
const ROUTE_POINTS: [number, number][] = [
  [52, 452],
  [73, 426],
  [83, 398],
  [86, 370],
  [96, 344],
  [118, 322],
  [146, 316],
  [174, 322],
  [200, 322],
  [222, 308],
  [232, 290],
  [226, 262],
  [208, 236],
  [198, 208],
  [200, 186],
  [214, 170],
  [240, 164],
  [268, 164],
  [290, 150],
  [302, 132],
  [306, 112],
];

function TreasureCover({ event, onOpen, reduce }: ConceptProps) {
  // Hasta qué punto de la ruta ha llegado el dedo.
  const [reached, setReached] = useState(0);
  const tracing = useRef(false);
  const done = reached >= ROUTE_POINTS.length - 1;
  const stops = event.venues.slice(0, 3);
  const finish = () => {
    if (reached < ROUTE_POINTS.length - 1) setReached(ROUTE_POINTS.length - 1);
    haptic([10, 30, 20]);
    playPaper(0.35);
    window.setTimeout(onOpen, reduce ? 0 : 700);
  };
  const follow = (e: PointerEvent<SVGSVGElement>) => {
    if (!tracing.current || done) return;
    const box = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - box.left) / box.width) * 360;
    const y = ((e.clientY - box.top) / box.height) * 500;
    // Solo cuentan los puntos siguientes y cercanos: se perdona el pulso, no los atajos.
    let next = reached;
    for (let i = reached + 1; i <= Math.min(ROUTE_POINTS.length - 1, reached + 3); i += 1) {
      const [px, py] = ROUTE_POINTS[i]!;
      if (Math.hypot(px - x, py - y) < 40) next = i;
    }
    if (next === reached) return;
    setReached(next);
    haptic(4);
    if (next >= ROUTE_POINTS.length - 1) finish();
  };
  const [bx, by] = ROUTE_POINTS[reached]!;
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: FRAUNCES }}>
      <div aria-hidden className="paper-grain absolute inset-0 opacity-60" />
      <div className="relative mx-auto flex h-full w-full max-w-[26rem] flex-col px-5 pt-[max(4.25rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {/* La cartela del mapa. */}
        <div className="border-y-2 border-double border-current py-2 text-center">
          <p className="text-[0.6875rem] tracking-[0.18em] uppercase" style={{ fontFamily: SANS }}>
            Mapa de la isla de {event.city}
          </p>
          <h1
            id="cover-title"
            tabIndex={-1}
            translate="no"
            className="mt-1 text-[clamp(2.1rem,10.5vw,3rem)] leading-none outline-none"
            style={{ fontFamily: SCRIPT }}
          >
            {names(event)}
          </h1>
          <p className="mt-1 text-[0.9375rem] italic">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>
          </p>
        </div>

        <svg
          viewBox="0 0 360 500"
          className="mt-2 min-h-0 w-full flex-1 touch-none"
          data-route={done ? "hecha" : "pendiente"}
          onPointerDown={(e) => {
            e.stopPropagation();
            e.currentTarget.setPointerCapture(e.pointerId);
            tracing.current = true;
            follow(e);
          }}
          onPointerMove={(e) => {
            e.stopPropagation();
            follow(e);
          }}
          onPointerUp={(e) => {
            e.stopPropagation();
            tracing.current = false;
          }}
          onPointerCancel={() => {
            tracing.current = false;
          }}
        >
          <g aria-hidden>
            {/* El mar, la costa y unas olas. */}
            <rect width="360" height="500" rx="6" fill="#9fb7b5" opacity="0.55" />
            <path
              d="M30 470C8 400 30 330 70 290 40 230 80 150 150 140 190 70 300 50 330 110c24 50-6 100-30 130 30 50 20 120-30 160-40 34-90 20-120 50-40 36-100 40-120 20z"
              fill="#efe2c4"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            {[
              [20, 120],
              [300, 300],
              [26, 250],
              [300, 440],
            ].map(([x, y]) => (
              <path
                key={`${x}-${y}`}
                d={`M${x} ${y}q6-6 12 0t12 0`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.6"
              />
            ))}
            {/* Colinas verdes y la rosa de los vientos. */}
            {[
              [150, 250],
              [112, 392],
              [262, 232],
            ].map(([x, y]) => (
              <path
                key={`${x}-${y}`}
                d={`M${x! - 16} ${y}q8-18 16 0q8-14 16 0z`}
                fill="#6f7d4f"
                opacity="0.75"
              />
            ))}
            <g transform="translate(64 96)" stroke="currentColor" fill="none" strokeWidth="1.2">
              <circle r="22" />
              <path
                d="M0-30L5 0 0 30-5 0zM-30 0L0-5 30 0 0 5z"
                fill="currentColor"
                opacity="0.85"
              />
            </g>
            <text x="64" y="58" textAnchor="middle" fontSize="11" fill="currentColor">
              N
            </text>
            {/* La ruta de puntos y, encima, el tramo ya recorrido. */}
            <path
              d={ROUTE}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeDasharray="2 9"
              strokeLinecap="round"
            />
            <path
              d={ROUTE}
              pathLength={1}
              fill="none"
              stroke="#9b2c1f"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray="1"
              strokeDashoffset={1 - reached / (ROUTE_POINTS.length - 1)}
              style={{ transition: "stroke-dashoffset 0.2s linear" }}
            />
            {/* La X del tesoro. */}
            <g
              transform="translate(306 112)"
              stroke="#9b2c1f"
              strokeWidth={done ? 7 : 5}
              strokeLinecap="round"
            >
              <path d="M-11-11L11 11M11-11L-11 11" />
            </g>
            {/* Por dónde va el dedo. */}
            <circle cx={bx} cy={by} r="9" fill="#9b2c1f" stroke="#efe2c4" strokeWidth="2.5" />
          </g>
          {/* Las paradas: los lugares de la boda, en su orden. */}
          {stops.map((venue, i) => {
            const [x, y] = ROUTE_POINTS[[5, 10, 15][i]!]!;
            return (
              <text
                key={venue.id}
                x={x + (i === 1 ? -14 : 14)}
                y={y + 22}
                textAnchor={i === 1 ? "end" : "start"}
                fontSize="13"
                fontStyle="italic"
                fill="currentColor"
              >
                {i + 1}. {venue.name}
              </text>
            );
          })}
          <text x="52" y="478" textAnchor="middle" fontSize="12" fill="currentColor">
            Estás aquí
          </text>
        </svg>

        <p className="text-center text-[0.8125rem] italic">
          Sigue la ruta con el dedo. El tesoro no se entierra: se celebra.
        </p>
        <ActionButton label="Ir a la X" onClick={finish} />
      </div>
    </div>
  );
}

/* ───────────── Constelación: la carta celeste de esa noche; se unen las estrellas ───────────── */

// Dónde cae cada estrella principal en la carta (hasta seis actos).
const STARS: [number, number][] = [
  [92, 214],
  [140, 132],
  [206, 168],
  [250, 96],
  [262, 226],
  [176, 262],
];

function ConstellationCover({ event, onOpen, reduce }: ConceptProps) {
  const acts = event.program.slice(0, STARS.length);
  const [joined, setJoined] = useState(1);
  const done = joined >= acts.length;
  const sky = useMemo(() => {
    const random = seeded(1811);
    return Array.from({ length: 90 }, () => {
      const angle = random() * Math.PI * 2;
      const radius = Math.sqrt(random()) * 148;
      return [170 + Math.cos(angle) * radius, 170 + Math.sin(angle) * radius, 0.5 + random()];
    });
  }, []);
  const time = madrid({ hour: "2-digit", minute: "2-digit" }).format(new Date(event.date));
  const join = (all = false) => {
    if (done) return;
    const next = all ? acts.length : joined + 1;
    setJoined(next);
    haptic(8);
    playNotes([520 + next * 90], "sine");
    if (next >= acts.length) {
      playNotes([660, 880, 1320], "sine", 0.14);
      window.setTimeout(onOpen, reduce ? 0 : 900);
    }
  };
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,#1b2a5c_0%,#0d1530_62%)]"
      />
      <div className="relative mx-auto flex h-full w-full max-w-[26rem] flex-col items-center px-5 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <p className="text-center text-[0.75rem] tracking-[0.16em] uppercase">
          El cielo sobre {event.city}
        </p>
        <p className="mt-1 text-center text-[0.875rem] text-[#d8b96a]">
          <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>, {time}
        </p>
        <h1
          id="cover-title"
          tabIndex={-1}
          translate="no"
          className="mt-3 text-center font-names text-[clamp(2.1rem,10.5vw,3rem)] leading-none outline-none"
        >
          {names(event, " & ")}
        </h1>
        <svg
          viewBox="0 0 340 340"
          data-stars={done ? "unidas" : "sueltas"}
          className="mt-2 min-h-0 w-full flex-1 touch-none"
          onPointerDown={(e) => {
            e.stopPropagation();
            join();
          }}
        >
          <g aria-hidden>
            {/* La retícula del mapa: círculos y radios. */}
            <g fill="none" stroke="#6f8cc4" strokeWidth="0.7" opacity="0.6">
              {[150, 110, 70, 30].map((r) => (
                <circle key={r} cx="170" cy="170" r={r} />
              ))}
              {Array.from({ length: 12 }, (_, i) => (
                <path key={i} d="M170 20V320" transform={`rotate(${i * 15} 170 170)`} />
              ))}
            </g>
            <circle cx="170" cy="170" r="150" fill="none" stroke="#d8b96a" strokeWidth="1.5" />
            {sky.map(([x, y, r], i) => (
              <circle key={i} cx={x} cy={y} r={r! * 0.9} fill="#f2ecdb" opacity={0.35 + r! * 0.3} />
            ))}
            {/* Las líneas que ya unen las estrellas. */}
            <polyline
              points={STARS.slice(0, joined)
                .map(([x, y]) => `${x},${y}`)
                .join(" ")}
              fill="none"
              stroke="#d8b96a"
              strokeWidth={done ? 2.4 : 1.6}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </g>
          {acts.map((act, i) => {
            const [x, y] = STARS[i]!;
            const lit = i < joined;
            return (
              <g key={act.id}>
                <circle cx={x} cy={y} r={i === joined ? 11 : 0} fill="none" stroke="#d8b96a" />
                <path
                  d={`M${x} ${y - 8}l2.4 5.6 5.6 2.4-5.6 2.4-2.4 5.6-2.4-5.6-5.6-2.4 5.6-2.4z`}
                  fill={lit ? "#d8b96a" : "#f2ecdb"}
                />
                <text
                  x={x}
                  y={y + 24}
                  textAnchor="middle"
                  fontSize="11.5"
                  fill="#f2ecdb"
                  style={{ fontFamily: SANS }}
                >
                  {act.title}
                </text>
              </g>
            );
          })}
        </svg>
        <p className="mt-2 text-center text-[0.8125rem] italic">
          Toca el cielo para unir las estrellas. Visible desde la pista de baile.
        </p>
        <ActionButton label="Unir las estrellas" onClick={() => join(true)} />
      </div>
    </div>
  );
}

/* ───────────────── Cómic: la portada de un tebeo y tres viñetas que se pasan ───────────────── */

function ComicCover({ event, onOpen }: ConceptProps) {
  const [panel, setPanel] = useState(0);
  const photo = event.story.couplePhoto ?? event.coverPhoto;
  const { dd, mm, yy } = dateParts(event.date);
  const first = event.program[0];
  const go = (to: number) => {
    setPanel(Math.max(0, Math.min(2, to)));
    haptic(6);
    playPaper(0.2);
  };
  const caption =
    "absolute top-2 left-2 max-w-[80%] border-2 border-[#141414] bg-[#f5c518] px-2 py-1 text-left text-[0.8125rem] leading-tight font-semibold";
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#f5c518]" style={{ fontFamily: SANS }}>
      {/* Trama de puntos de imprenta. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(#d92b2b_1.3px,transparent_1.6px)] [background-size:9px_9px] opacity-25"
      />
      <div className="relative mx-auto flex h-full w-full max-w-[26rem] flex-col px-5 pt-[max(4.25rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between border-2 border-[#141414] bg-[#fbf3df] px-2.5 py-1 text-[0.75rem] font-semibold">
          <span>N.º 1</span>
          <span>
            <time dateTime={isoDay(event.date)}>
              {dd}/{mm}/{yy}
            </time>
          </span>
          <span>Precio: un abrazo</span>
        </div>
        <h1
          id="cover-title"
          tabIndex={-1}
          translate="no"
          className="mt-3 -rotate-2 text-center text-[clamp(2.75rem,14vw,4rem)] leading-[0.92] tracking-[0.02em] text-[#d92b2b] outline-none [text-shadow:3px_3px_0_#141414]"
          style={{ fontFamily: COMIC }}
        >
          {names(event)}
        </h1>

        {/* Las viñetas: se ve una cada vez. */}
        <div className="relative mt-4 min-h-0 flex-1 border-[3px] border-[#141414] bg-[#fbf3df] shadow-[6px_6px_0_#141414]">
          <p className="sr-only" aria-live="polite">
            Viñeta {panel + 1} de 3
          </p>
          <div className={panel === 0 ? "absolute inset-0" : "hidden"}>
            {photo ? (
              <>
                <Image
                  src={photo}
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 420px) 380px, 90vw"
                  className="object-cover object-[50%_25%] contrast-[1.25] saturate-[1.4]"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 bg-[radial-gradient(#141414_1px,transparent_1.4px)] [background-size:5px_5px] opacity-30 mix-blend-multiply"
                />
              </>
            ) : null}
            <p
              className="absolute right-3 bottom-4 max-w-[70%] rounded-[50%] border-[3px] border-[#141414] bg-white px-5 py-3 text-center text-[1.75rem] leading-none text-[#141414]"
              style={{ fontFamily: COMIC }}
            >
              ¡Estáis invitados!
            </p>
          </div>
          <div
            className={
              panel === 1 ? "absolute inset-0 grid place-items-center bg-[#2563c9] p-5" : "hidden"
            }
          >
            <p className={caption}>Mientras tanto, en {event.city}…</p>
            <div className="text-center text-white">
              <p
                className="text-[4rem] leading-none text-[#f5c518] [text-shadow:3px_3px_0_#141414]"
                style={{ fontFamily: COMIC }}
              >
                ¡Clinc!
              </p>
              {first ? (
                <p className="mt-3 text-[1.125rem] font-semibold">
                  {first.title}, a las {first.time}
                </p>
              ) : null}
            </div>
          </div>
          <div
            className={
              panel === 2 ? "absolute inset-0 grid place-items-center bg-[#d92b2b] p-5" : "hidden"
            }
          >
            <p className={caption}>Y por fin llegó el día…</p>
            <div className="text-center text-white">
              <p
                className="text-[clamp(2rem,10vw,2.75rem)] leading-[1] [text-shadow:3px_3px_0_#141414]"
                style={{ fontFamily: COMIC }}
              >
                {formatLongDate(event.date)}
              </p>
              <p className="mt-2 text-[1.125rem] font-semibold">en {event.city}</p>
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => go(panel - 1)}
            disabled={panel === 0}
            className="flex items-center gap-1 border-2 border-[#141414] bg-[#fbf3df] px-3 py-2 text-[0.875rem] font-semibold disabled:opacity-50"
          >
            <ChevronLeft aria-hidden className="size-4" /> Viñeta anterior
          </button>
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => go(panel + 1)}
            disabled={panel === 2}
            className="flex items-center gap-1 border-2 border-[#141414] bg-[#fbf3df] px-3 py-2 text-[0.875rem] font-semibold disabled:opacity-50"
          >
            Viñeta siguiente <ChevronRight aria-hidden className="size-4" />
          </button>
        </div>
        <div className="mt-1">
          <OpenHint onOpen={onOpen}>
            <span className="text-[0.8125rem] font-semibold">Apto para todos los públicos</span>
          </OpenHint>
        </div>
      </div>
    </div>
  );
}

/* ───────────────── Arcade: la pantalla de inicio de una recreativa ───────────────── */

function ArcadeCover({ event, onOpen, reduce }: ConceptProps) {
  const [started, setStarted] = useState(false);
  const { dd, mm, yy } = dateParts(event.date);
  const start = () => {
    if (started) return;
    setStarted(true);
    haptic([12, 40, 12, 40, 20]);
    playNotes([523, 659, 784, 1047], "square", 0.1);
    window.setTimeout(onOpen, reduce ? 0 : 650);
  };
  const players = [event.couple.first, event.couple.second].filter(Boolean);
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: PIXEL }}>
      {/* Las líneas de la pantalla de tubo. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[repeating-linear-gradient(180deg,transparent_0_3px,rgb(255_255_255/0.045)_3px_4px)]"
      />
      <div className="relative mx-auto flex h-full w-full max-w-[26rem] flex-col items-center px-5 pt-[max(4.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center">
        <div className="flex w-full justify-between text-[0.625rem] leading-relaxed">
          <p className="text-left text-[#37d5d6]">
            1UP
            <br />
            <span className="text-[#f4f4f0]">000000</span>
          </p>
          <p className="text-[#ff3d81]">
            RÉCORD
            <br />
            <span className="text-[#f4f4f0]">
              {dd}
              {mm}
              {yy}
            </span>
          </p>
          <p className="text-right text-[#37d5d6]">
            2UP
            <br />
            <span className="text-[#f4f4f0]">000000</span>
          </p>
        </div>

        <h1
          id="cover-title"
          tabIndex={-1}
          translate="no"
          className="mt-[7svh] text-[clamp(1.25rem,6.4vw,1.75rem)] leading-[1.5] text-[#ffd23f] outline-none [text-shadow:3px_3px_0_#ff3d81]"
        >
          {players.map((player, i) => (
            <span key={player} className="block">
              {i ? <span className="text-[#f4f4f0]">+ </span> : null}
              {player}
            </span>
          ))}
        </h1>
        <dl className="mt-[5svh] grid w-full grid-cols-2 gap-3 text-[0.625rem] leading-relaxed">
          {players.map((player, i) => (
            <div key={player} className="border-2 border-[#37d5d6] px-2 py-2">
              <dt className="text-[#37d5d6]">JUGADOR {i + 1}</dt>
              <dd className="mt-1 truncate text-[0.75rem]">{player}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-[4svh] text-[0.625rem] leading-relaxed text-[#ff3d81]">FASE</p>
        <p className="mt-1 text-[0.8125rem] leading-relaxed">{event.city}</p>
        <p className="mt-3 text-[0.9375rem] leading-relaxed" style={{ fontFamily: SANS }}>
          <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>
        </p>
        <p className="mt-2 text-[0.5625rem] leading-relaxed text-[#ffd23f]">
          VIDAS: TODAS LAS QUE HAGAN FALTA
        </p>

        {/* El botón rojo de la máquina. */}
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={start}
          className="mt-auto flex flex-col items-center gap-3"
        >
          <span
            aria-hidden
            className={`block size-20 rounded-full border-4 border-[#7a0f2e] bg-[radial-gradient(circle_at_35%_30%,#ff8fb3,#ff3d81_45%,#b3134a)] shadow-[0_8px_0_#7a0f2e] transition-transform ${started ? "translate-y-1.5 shadow-[0_2px_0_#7a0f2e]" : ""}`}
          />
          <span
            className={`text-[0.6875rem] leading-relaxed ${started || reduce ? "" : "arcade-blink"}`}
          >
            PULSA PARA EMPEZAR
          </span>
          <span className="text-[0.8125rem]" style={{ fontFamily: SANS }}>
            Desliza o toca para abrir
          </span>
        </button>
      </div>
    </div>
  );
}

/* ───────────── Sobre de semillas: se siembra y brotan flores alrededor de la fecha ───────────── */

const BLOOMS: [number, number, number][] = [
  [8, 30, 0],
  [86, 22, 1],
  [16, 78, 2],
  [80, 74, 0],
  [48, 6, 1],
  [50, 92, 2],
];

function SeedsCover({ event, onOpen, reduce }: ConceptProps) {
  const [sown, setSown] = useState(false);
  const toast = event.program.find((act) => /banquete|cena|comida|c[oó]ctel/i.test(act.title));
  const sow = () => {
    if (sown) return;
    setSown(true);
    haptic([6, 30, 6, 30, 10]);
    playPaper(0.5);
  };
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="paper-grain absolute inset-0 opacity-60" />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {/* El sobre de semillas. */}
        <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-[6px] border border-current/40 bg-[#fbf6e7] shadow-[0_24px_50px_-20px_rgb(43_58_35/0.55)]">
          <div className="bg-[#5d7a3a] px-5 py-3 text-[#fbf6e7]">
            <p className="text-[0.6875rem] tracking-[0.18em] uppercase">Semillas de temporada</p>
            <p className="text-[0.8125rem] italic" style={{ fontFamily: FRAUNCES }}>
              Variedad
            </p>
            <h1
              id="cover-title"
              tabIndex={-1}
              translate="no"
              className="text-[clamp(1.9rem,9.5vw,2.6rem)] leading-[1.02] outline-none"
              style={{ fontFamily: FRAUNCES }}
            >
              Amor de {names(event)}
            </h1>
          </div>
          {/* La ilustración botánica; al sembrar, brotan flores alrededor de la fecha. */}
          <div
            data-sown={sown ? "si" : "no"}
            className="relative min-h-0 flex-1 bg-[linear-gradient(180deg,#fbf6e7,#f1e8cf)]"
          >
            <Image
              src="/acuarelas/olivo.webp"
              alt=""
              fill
              sizes="320px"
              className="object-contain object-center p-4 opacity-90"
            />
            {BLOOMS.map(([x, y, kind], i) => (
              <span
                key={i}
                aria-hidden
                className={`seed-bloom absolute size-9 ${sown ? "is-sown" : ""}`}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  color: ["#c8452c", "#d9a441", "#b0527a"][kind],
                  transitionDelay: reduce ? "0s" : `${0.25 + i * 0.14}s`,
                }}
              />
            ))}
            <p className="absolute inset-x-6 top-1/2 -translate-y-1/2 border-y border-[#2b3a23] bg-[#fbf6e7]/92 py-2 text-center">
              <span className="block text-[0.5625rem] tracking-[0.16em] uppercase">
                Época de siembra
              </span>
              <span
                className="block text-[1.25rem] leading-tight font-semibold"
                style={{ fontFamily: FRAUNCES }}
              >
                <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>
              </span>
            </p>
          </div>
          <dl className="grid grid-cols-3 border-t border-current/40 text-center">
            {[
              ["Lugar", event.city],
              ["Riego", toast ? `Con cava, ${toast.time}` : "Con cava"],
              ["Germina", "En buena compañía"],
            ].map(([label, value], i) => (
              <div key={label} className={`px-1.5 py-2 ${i ? "border-l border-current/40" : ""}`}>
                <dt className="text-[0.5625rem] tracking-[0.14em] uppercase">{label}</dt>
                <dd className="mt-0.5 text-[0.75rem] leading-tight font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={sow}
          disabled={sown}
          className="mt-3 rounded-full bg-[#2b3a23] px-6 py-2.5 text-[0.9375rem] font-medium text-[#fbf6e7] disabled:opacity-60"
        >
          {sown ? "Sembrado" : "Sembrar"}
        </button>
        <p className="mt-1.5 text-center text-[0.8125rem] italic">Florece cada aniversario.</p>
        <OpenHint onOpen={onOpen} />
      </div>
    </div>
  );
}

export const MAP_COVERS = {
  mapa: TreasureCover,
  constelacion: ConstellationCover,
  comic: ComicCover,
  arcade: ArcadeCover,
  semillas: SeedsCover,
};
