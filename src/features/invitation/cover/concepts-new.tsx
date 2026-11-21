"use client";

import { animate } from "motion/react";
import Image from "next/image";
import { useRef, useState, type PointerEvent } from "react";
import type { WeddingEvent } from "@/lib/domain/types";
import { hostNames, hostsOf } from "@/lib/event-kind";
import { formatLongDate, isoDay } from "@/lib/format";
import { haptic, playPaper, playTick } from "../effects/sound";
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
 * Portadas de concepto de la ronda 38: una foto instantánea que se revela frotándola, un abanico
 * que se despliega con el dedo y una caja de cerillas que se abre empujando el cajón. Las tres
 * tienen su botón alternativo y, con movimiento reducido, ninguna se anima sola.
 */

const names = (event: WeddingEvent, joiner = " y ") => hostNames(hostsOf(event), joiner);
const HAND = "var(--font-great-vibes), 'Great Vibes', 'Snell Roundhand', cursive";
const stop = (e: PointerEvent) => e.stopPropagation();

/* ─────────────── Instantánea: la foto sale en blanco y se revela al frotarla ─────────────── */

function InstantCover({ event, onOpen, reduce }: ConceptProps) {
  const photo = event.coverPhoto ?? event.story.couplePhoto;
  const [level, setLevel] = useState(0);
  const last = useRef<{ x: number; y: number } | null>(null);
  const done = level >= 1;
  const { dd, mm, yy } = dateParts(event.date);
  const ceremony = event.program[0];

  const develop = (amount: number) =>
    setLevel((current) => {
      const next = Math.min(1, current + amount);
      if (next >= 1 && current < 1) {
        haptic([8, 40, 14]);
        playPaper(0.4);
      }
      return next;
    });

  const rub = (e: PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (e.buttons === 0 && e.pointerType === "mouse") return;
    const point = { x: e.clientX, y: e.clientY };
    if (last.current) {
      const distance = Math.hypot(point.x - last.current.x, point.y - last.current.y);
      develop(distance / 1400);
    }
    last.current = point;
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      {/* La mesa: corcho con grano y una luz cálida de lado. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(120%_80%_at_20%_10%,rgb(255_244_222/0.55),transparent_60%)]"
      />
      <div aria-hidden className="paper-grain absolute inset-0 opacity-70" />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <Arrive reduce={reduce} tilt={-3} className="relative w-[min(82vw,20rem)]">
          {/* Cinta adhesiva que la sujeta a la mesa. */}
          <span
            aria-hidden
            className="absolute -top-3 left-1/2 z-10 h-7 w-24 -translate-x-1/2 rotate-[4deg] bg-[#efe6cf]/80 shadow-sm"
          />
          <div className="bg-[#fbfaf6] p-3.5 pb-0 shadow-[0_26px_50px_-18px_rgb(40_28_18/0.6)]">
            <div
              data-developed={done ? "si" : "no"}
              onPointerDown={(e) => {
                stop(e);
                last.current = { x: e.clientX, y: e.clientY };
              }}
              onPointerMove={rub}
              onPointerUp={() => {
                last.current = null;
              }}
              className="relative aspect-square w-full cursor-grab overflow-hidden bg-[#2e241c]"
              style={{ touchAction: "none" }}
            >
              {photo ? (
                <Image
                  src={photo}
                  alt=""
                  fill
                  priority
                  sizes="20rem"
                  className="object-cover object-[50%_30%]"
                  style={{
                    filter: `sepia(${0.7 * (1 - level)}) saturate(${0.2 + 0.8 * level}) brightness(${0.45 + 0.55 * level}) contrast(${0.7 + 0.3 * level})`,
                  }}
                />
              ) : (
                <div className="absolute inset-0 bg-[linear-gradient(160deg,#f2c9a0,#c98a6b_45%,#5b6f8a)]" />
              )}
              {/* La química sin revelar: un velo pardo que se va aclarando. */}
              <div
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(170deg,#4a3a2e,#2b231d)] mix-blend-multiply"
                style={{ opacity: 0.92 * (1 - level) }}
              />
              {done ? null : (
                <p
                  aria-hidden
                  className="absolute inset-x-0 bottom-3 text-center text-[0.8125rem] tracking-[0.12em] text-[#efe6d6] uppercase"
                >
                  Frota para revelar
                </p>
              )}
            </div>
            {/* El margen blanco de abajo, escrito a mano con rotulador. */}
            <div className="flex min-h-[6.5rem] flex-col items-center justify-center px-2 pt-2 pb-3 text-center">
              <h1
                id="cover-title"
                tabIndex={-1}
                translate="no"
                className="text-[clamp(1.9rem,9vw,2.6rem)] leading-[1.05] outline-none"
                style={{ fontFamily: HAND }}
              >
                {names(event, " & ")}
              </h1>
              <p className="mt-1 text-[1.35rem] leading-none" style={{ fontFamily: HAND }}>
                <time dateTime={isoDay(event.date)}>
                  {dd}·{mm}·{yy}
                </time>{" "}
                · {event.city}
              </p>
            </div>
          </div>
        </Arrive>
        <After reduce={reduce} className="short-hide mt-5 flex flex-col items-center text-center">
          {ceremony ? (
            <p
              className="w-44 rotate-[3deg] bg-[#f6e7a6] px-3 py-2.5 text-[1.35rem] leading-[1.1] text-[#3a2e12] shadow-[0_10px_18px_-10px_rgb(40_28_18/0.6)]"
              style={{ fontFamily: HAND }}
            >
              {ceremony.title} a las {ceremony.time}
              <span className="block text-[1.05rem]">{ceremony.place}</span>
            </p>
          ) : null}
          <p className="mt-4 text-[0.75rem] tracking-[0.16em] uppercase">
            Foto 1 de muchas · Guárdala en el álbum
          </p>
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={() => develop(1)}
            disabled={done}
            className="mt-4 rounded-full bg-current/90 px-6 py-2.5 text-[0.9375rem] font-medium disabled:opacity-60"
          >
            <span className="text-[#f4ede2]">{done ? "Revelada" : "Revelar la foto"}</span>
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Abanico: se despliega deslizando; en el país, la fecha pintada ─────────────── */

const FAN = { cx: 180, cy: 292, inner: 118, outer: 256 } as const;
const CLOSED = 26;
const OPEN = 172;
const RIBS = 15;

/** Punto a un radio y un ángulo (grados desde la vertical, a la derecha positivo). */
function polar(radius: number, degrees: number) {
  const a = ((degrees - 90) * Math.PI) / 180;
  return [FAN.cx + radius * Math.cos(a), FAN.cy + radius * Math.sin(a)] as const;
}

function arc(radius: number, from: number, to: number) {
  const [x1, y1] = polar(radius, from);
  const [x2, y2] = polar(radius, to);
  return `M${x1.toFixed(1)} ${y1.toFixed(1)}A${radius} ${radius} 0 ${to - from > 180 ? 1 : 0} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

function FanCover({ event, onOpen, reduce }: ConceptProps) {
  const [angle, setAngle] = useState(CLOSED);
  const drag = useRef<{ x: number; start: number } | null>(null);
  const opened = angle >= OPEN - 6;
  const half = angle / 2;
  const leaf = `${arc(FAN.outer, -half, half)}L${polar(FAN.inner, half).join(" ")}A${FAN.inner} ${FAN.inner} 0 0 0 ${polar(FAN.inner, -half).join(" ")}Z`;

  const settle = (value: number) => {
    const clamped = Math.max(CLOSED, Math.min(OPEN, value));
    setAngle((current) => {
      if (clamped >= OPEN - 6 && current < OPEN - 6) {
        haptic([10, 30, 10]);
        playPaper(0.5);
      } else if (Math.floor(clamped / 24) !== Math.floor(current / 24)) {
        playTick();
      }
      return clamped;
    });
  };

  const unfold = () => {
    if (reduce) return settle(OPEN);
    animate(angle, OPEN, { duration: 0.9, ease: [0.22, 1, 0.36, 1], onUpdate: settle });
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="paper-grain absolute inset-0 opacity-60" />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center">
        <p className="text-[0.75rem] tracking-[0.2em] uppercase">Os invitamos a la boda de</p>
        <h1
          id="cover-title"
          tabIndex={-1}
          translate="no"
          className="mt-2 text-[clamp(2.2rem,10vw,3rem)] leading-[1.02] italic outline-none"
          style={{ fontFamily: PLAYFAIR }}
        >
          {names(event)}
        </h1>
        {/* El abanico: varillas de madera, país de seda roja con encaje y la borla. */}
        <div
          data-fan={opened ? "abierto" : "cerrado"}
          onPointerDown={(e) => {
            stop(e);
            drag.current = { x: e.clientX, start: angle };
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (!drag.current) return;
            e.stopPropagation();
            settle(drag.current.start + Math.abs(e.clientX - drag.current.x) * 0.9);
          }}
          onPointerUp={() => {
            if (drag.current && Math.abs(angle - drag.current.start) < 4) unfold();
            drag.current = null;
          }}
          className="relative mt-4 w-full max-w-[22rem] cursor-ew-resize"
          style={{ touchAction: "none" }}
        >
          <svg
            viewBox="0 0 360 312"
            className="w-full drop-shadow-[0_18px_22px_rgb(60_10_20/0.35)]"
          >
            <defs>
              <pattern id="fan-lace" width="14" height="14" patternUnits="userSpaceOnUse">
                <circle cx="7" cy="7" r="2.2" fill="none" stroke="#f3e3c8" strokeWidth="0.9" />
                <circle cx="0" cy="0" r="1" fill="#f3e3c8" />
                <circle cx="14" cy="14" r="1" fill="#f3e3c8" />
              </pattern>
              <clipPath id="fan-leaf">
                <path d={leaf} />
              </clipPath>
              <path id="fan-name" d={arc(222, -78, 78)} />
              <path id="fan-date" d={arc(176, -70, 70)} />
            </defs>
            {/* Varillas por debajo del país (asoman entre el país y el clavillo). */}
            {Array.from({ length: RIBS }, (_, i) => {
              const a = -half + (angle * i) / (RIBS - 1);
              const [x, y] = polar(FAN.outer - 6, a);
              return (
                <line
                  key={i}
                  x1={FAN.cx}
                  y1={FAN.cy}
                  x2={x}
                  y2={y}
                  stroke={i === 0 || i === RIBS - 1 ? "#4a2a1a" : "#7a4a2c"}
                  strokeWidth={i === 0 || i === RIBS - 1 ? 7 : 4}
                  strokeLinecap="round"
                />
              );
            })}
            <g clipPath="url(#fan-leaf)">
              <rect width="360" height="312" fill="#9b1d2c" />
              <rect width="360" height="312" fill="url(#fan-lace)" opacity="0.55" />
              {/* Pliegues: sombras alternas entre varilla y varilla. */}
              {Array.from({ length: RIBS - 1 }, (_, i) => {
                const a1 = -half + (angle * i) / (RIBS - 1);
                const a2 = -half + (angle * (i + 1)) / (RIBS - 1);
                const [x1, y1] = polar(FAN.outer + 4, a1);
                const [x2, y2] = polar(FAN.outer + 4, a2);
                return i % 2 ? (
                  <path
                    key={i}
                    d={`M${FAN.cx} ${FAN.cy}L${x1} ${y1}L${x2} ${y2}Z`}
                    fill="#000"
                    opacity="0.14"
                  />
                ) : null;
              })}
              <path
                d={arc(FAN.outer - 9, -half, half)}
                fill="none"
                stroke="#e7c873"
                strokeWidth="2"
              />
              <path
                d={arc(FAN.inner + 9, -half, half)}
                fill="none"
                stroke="#e7c873"
                strokeWidth="1.5"
              />
              <text
                aria-hidden
                fill="#fbf1de"
                fontSize="22"
                style={{ fontFamily: PLAYFAIR, fontStyle: "italic" }}
              >
                <textPath href="#fan-name" startOffset="50%" textAnchor="middle">
                  {names(event, " & ")}
                </textPath>
              </text>
              <text aria-hidden fill="#e7c873" fontSize="13" letterSpacing="2">
                <textPath href="#fan-date" startOffset="50%" textAnchor="middle">
                  {`${formatLongDate(event.date).toUpperCase()} · ${event.city.toUpperCase()}`}
                </textPath>
              </text>
            </g>
            {/* Clavillo y borla. */}
            <circle cx={FAN.cx} cy={FAN.cy} r="8" fill="#e7c873" stroke="#4a2a1a" strokeWidth="2" />
            <path d={`M${FAN.cx} ${FAN.cy + 6}v12`} stroke="#9b1d2c" strokeWidth="2.5" />
            <path
              d={`M${FAN.cx - 5} ${FAN.cy + 17}h10l3 14h-16z`}
              fill="#9b1d2c"
              stroke="#6d1420"
              strokeWidth="1"
            />
          </svg>
        </div>
        <p className="mt-2 text-[1.0625rem]">
          <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time> · {event.city}
        </p>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={unfold}
            disabled={opened}
            className="mt-3 rounded-full border border-current px-6 py-2.5 text-[0.9375rem] font-medium disabled:opacity-60"
          >
            {opened ? "Abanico abierto" : "Desplegar el abanico"}
          </button>
          <p className="short-hide mt-1.5 text-[0.8125rem] italic">
            O deslízalo con el dedo, como en la feria.
          </p>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Cerillas: se empuja el cajón y una cerilla se enciende ─────────────── */

function MatchboxCover({ event, onOpen, reduce }: ConceptProps) {
  const [slide, setSlide] = useState(0);
  const drag = useRef<{ x: number; start: number; width: number } | null>(null);
  const open = slide >= 0.98;
  const party = event.program.find((act) => /fiesta|baile|barra/i.test(act.title));
  const { dd, mm, yy } = dateParts(event.date);

  const push = (value: number) =>
    setSlide((current) => {
      const next = Math.max(0, Math.min(1, value));
      if (next >= 0.98 && current < 0.98) {
        haptic([6, 24, 6, 24, 16]);
        playPaper(0.3);
      }
      return next;
    });

  const openBox = () => {
    if (reduce) return push(1);
    animate(slide, 1, { duration: 0.7, ease: [0.22, 1, 0.36, 1], onUpdate: push });
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="paper-grain absolute inset-0 opacity-70" />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-5 pt-[max(4.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center">
        <p className="text-[0.75rem] tracking-[0.2em] uppercase">Para encender la fiesta</p>
        <Arrive reduce={reduce} tilt={-4} className="relative mt-5 w-full max-w-[17rem]">
          <div
            data-box={open ? "abierta" : "cerrada"}
            onPointerDown={(e) => {
              stop(e);
              drag.current = {
                x: e.clientX,
                start: slide,
                width: e.currentTarget.getBoundingClientRect().width,
              };
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (!drag.current) return;
              e.stopPropagation();
              push(drag.current.start + (e.clientX - drag.current.x) / (drag.current.width * 0.55));
            }}
            onPointerUp={() => {
              if (drag.current && Math.abs(slide - drag.current.start) < 0.03) openBox();
              drag.current = null;
            }}
            className="relative aspect-[1.4] w-full cursor-ew-resize"
            // La caja se corre a la izquierda mientras el cajón sale por la derecha.
            style={{ touchAction: "none", transform: `translateX(${-slide * 16}%)` }}
          >
            {/* El cajón, con las cerillas: asoma por la derecha al empujarlo. */}
            <div
              aria-hidden
              className="absolute inset-y-[7%] left-[4%] w-[92%] rounded-[4px] bg-[#e9dcc0] shadow-inner"
              style={{ transform: `translateX(${slide * 40}%)` }}
            >
              <div className="absolute inset-y-[10%] right-[3%] flex w-[48%] flex-col justify-between">
                {Array.from({ length: 7 }, (_, i) => (
                  <span key={i} className="relative block h-[9%] rounded-full bg-[#d8b787]">
                    <span className="absolute top-1/2 right-0 block aspect-[1.4] h-[150%] -translate-y-1/2 rounded-full bg-[#b0301f]" />
                    {i === 3 && open ? (
                      <span
                        data-lit
                        className={`match-flame absolute right-[-0.15rem] bottom-[60%] block h-[2.6rem] w-[1.25rem] ${reduce ? "" : "is-alive"}`}
                      />
                    ) : null}
                  </span>
                ))}
              </div>
            </div>
            {/* La funda con su etiqueta y el raspador en los cantos. */}
            <div className="absolute inset-0 overflow-hidden rounded-[6px] bg-[#1f2433] shadow-[0_24px_44px_-16px_rgb(20_16_10/0.7)]">
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-[9%] bg-[repeating-linear-gradient(90deg,#6b4a2e_0_2px,#8a6440_2px_4px)]"
              />
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-[9%] bg-[repeating-linear-gradient(90deg,#6b4a2e_0_2px,#8a6440_2px_4px)]"
              />
              <div className="absolute inset-[12%_4%] flex flex-col items-center justify-center rounded-[3px] border-2 border-[#b0301f] bg-[#f6efe1] px-2 text-[#1f2433]">
                <span
                  aria-hidden
                  className="absolute inset-0 bg-[repeating-conic-gradient(from_0deg_at_50%_120%,rgb(176_48_31/0.08)_0_6deg,transparent_6deg_12deg)]"
                />
                <p className="relative text-[0.5625rem] tracking-[0.2em] uppercase">
                  Fósforos de seguridad
                </p>
                <h1
                  id="cover-title"
                  tabIndex={-1}
                  translate="no"
                  className="relative mt-1 text-[clamp(1.45rem,6.6vw,1.9rem)] leading-[1] font-semibold outline-none"
                  style={{ fontFamily: FRAUNCES }}
                >
                  {names(event, " & ")}
                </h1>
                <p className="relative mt-1.5 text-[0.5625rem] tracking-[0.12em] uppercase">
                  Dos almas · Lote {dd}
                  {mm}
                  {yy}
                </p>
                <p className="relative text-[0.5625rem] tracking-[0.12em] uppercase">
                  Fábrica de {event.city}
                </p>
              </div>
            </div>
          </div>
        </Arrive>
        <After reduce={reduce} className="mt-6">
          <p className="text-[1.0625rem]">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>
          </p>
          {party ? (
            <p className="short-hide mt-1 text-[0.875rem]">
              Se enciende a las {party.time}: {party.title.toLowerCase()}.
            </p>
          ) : null}
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={openBox}
            disabled={open}
            className="mt-3 rounded-full bg-[#b0301f] px-6 py-2.5 text-[0.9375rem] font-medium text-[#f6efe1] disabled:opacity-70"
          >
            {open ? "Cerilla encendida" : "Sacar una cerilla"}
          </button>
          <p className="short-hide mt-1.5 text-[0.8125rem] italic">
            O empuja el cajón con el dedo.
          </p>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

export const NEW_COVERS = {
  instantanea: InstantCover,
  abanico: FanCover,
  cerillas: MatchboxCover,
};
