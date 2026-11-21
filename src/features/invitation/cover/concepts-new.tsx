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

/* ─────────────── Galleta de la suerte: se parte y sale la fortuna con la fecha ─────────────── */

function CookieCover({ event, onOpen, reduce }: ConceptProps) {
  const [split, setSplit] = useState(0);
  const drag = useRef<{ x: number; start: number } | null>(null);
  const broken = split >= 0.98;
  const { dd, mm, yy } = dateParts(event.date);

  const pull = (value: number) =>
    setSplit((current) => {
      const next = Math.max(0, Math.min(1, value));
      if (next >= 0.98 && current < 0.98) {
        haptic([14, 20, 8]);
        playPaper(0.25);
      }
      return next;
    });

  const crack = () => {
    if (reduce) return pull(1);
    animate(split, 1, { duration: 0.6, ease: [0.3, 1.4, 0.5, 1], onUpdate: pull });
  };

  const half = (side: -1 | 1) => (
    <svg
      viewBox="0 0 120 110"
      aria-hidden
      className="absolute top-0 h-full w-1/2"
      style={{
        [side < 0 ? "left" : "right"]: 0,
        transform: `translateX(${side * split * 38}%) rotate(${side * split * 14}deg)`,
        transformOrigin: side < 0 ? "100% 70%" : "0% 70%",
      }}
    >
      <g transform={side > 0 ? "translate(120 0) scale(-1 1)" : undefined}>
        {/* Un ala de la galleta: borde ondulado arriba y el pliegue tostado hacia el centro. */}
        <path
          d="M120 26C96 8 52 6 22 30 4 46 2 72 14 88 40 84 78 92 120 104Z"
          fill="url(#cookie)"
          stroke="#a8692a"
          strokeWidth="1.5"
        />
        <path d="M120 58C98 52 66 60 46 86 74 90 100 96 120 104Z" fill="#b8752f" opacity="0.55" />
        <path
          d="M120 58C102 56 80 62 64 76"
          fill="none"
          stroke="#8a5220"
          strokeWidth="2"
          opacity="0.6"
        />
        <path
          d="M112 22C84 10 50 14 30 32"
          fill="none"
          stroke="#fbe2ae"
          strokeWidth="3"
          opacity="0.55"
        />
      </g>
    </svg>
  );

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="paper-grain absolute inset-0 opacity-60" />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center">
        <p className="text-[0.75rem] tracking-[0.2em] uppercase">La fortuna de</p>
        <h1
          id="cover-title"
          tabIndex={-1}
          translate="no"
          className="mt-2 text-[clamp(2.2rem,10vw,3rem)] leading-[1.02] outline-none"
          style={{ fontFamily: FRAUNCES }}
        >
          {names(event)}
        </h1>
        {/* El plato, la galleta encima y, al partirla, el papelito con la fortuna. */}
        <Arrive reduce={reduce} tilt={0} className="relative mt-24 w-full max-w-[20rem]">
          <svg aria-hidden width="0" height="0" className="absolute">
            <defs>
              <radialGradient id="cookie" cx="40%" cy="35%" r="75%">
                <stop offset="0" stopColor="#f6cf86" />
                <stop offset="0.6" stopColor="#e0a65a" />
                <stop offset="1" stopColor="#b8752f" />
              </radialGradient>
            </defs>
          </svg>
          <div
            aria-hidden
            className="mx-auto aspect-[2.2] w-full rounded-[50%] bg-[radial-gradient(ellipse_at_50%_40%,#fff_0_55%,#ece6dc_70%,#d8d0c2)] shadow-[0_18px_30px_-16px_rgb(40_20_10/0.5)]"
          />
          <div
            data-cookie={broken ? "partida" : "entera"}
            onPointerDown={(e) => {
              stop(e);
              drag.current = { x: e.clientX, start: split };
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (!drag.current) return;
              e.stopPropagation();
              pull(drag.current.start + Math.abs(e.clientX - drag.current.x) / 140);
            }}
            onPointerUp={() => {
              if (drag.current && Math.abs(split - drag.current.start) < 0.03) crack();
              drag.current = null;
            }}
            className="absolute inset-x-[6%] -top-[46%] aspect-[2] cursor-ew-resize"
            style={{ touchAction: "none" }}
          >
            {/* El papelito: asoma entre las dos mitades al partirlas. */}
            <p
              className="absolute top-[38%] left-1/2 z-10 w-[min(17rem,80vw)] -translate-x-1/2 border border-[#e7dccb] bg-[#fffdf8] px-3 py-1.5 text-[0.8125rem] leading-snug text-[#3b2a20] shadow-sm transition-[clip-path] duration-500"
              style={{ clipPath: `inset(0 ${50 - split * 50}% 0 ${50 - split * 50}%)` }}
            >
              Os casáis el <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>{" "}
              en {event.city}.
              <span className="mt-0.5 block text-[0.6875rem] tracking-[0.12em] text-[#b3261e] uppercase">
                Números de la suerte: {dd} · {mm} · {yy}
              </span>
            </p>
            {half(-1)}
            {half(1)}
          </div>
        </Arrive>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={crack}
            disabled={broken}
            className="mt-3 rounded-full bg-[#b3261e] px-6 py-2.5 text-[0.9375rem] font-medium text-[#fbf3e6] disabled:opacity-70"
          >
            {broken ? "Galleta partida" : "Partir la galleta"}
          </button>
          <p className="short-hide mt-1.5 text-[0.8125rem] italic">
            O sepárala con el dedo. La fortuna no falla.
          </p>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Casete: se rebobina y la lista de canciones es el programa ─────────────── */

function TapeCover({ event, onOpen, reduce }: ConceptProps) {
  const [wound, setWound] = useState(0);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const done = wound >= 1;
  const { dd, mm, yy } = dateParts(event.date);

  const wind = (amount: number) =>
    setWound((current) => {
      const next = Math.min(1, current + amount);
      if (Math.floor(next * 8) !== Math.floor(current * 8)) playTick();
      if (next >= 1 && current < 1) haptic([10, 30, 10, 30, 10]);
      return next;
    });

  const rewind = () => {
    if (reduce) return setWound(1);
    animate(wound, 1, {
      duration: 1.2,
      ease: "easeInOut",
      onUpdate: (v) => setWound((current) => Math.max(current, v)),
      onComplete: () => haptic([10, 30, 10, 30, 10]),
    });
  };

  const spin = wound * 1440;
  const reel = (cx: number, size: number) => (
    <g transform={`rotate(${spin} ${cx} 60)`}>
      <circle cx={cx} cy="60" r={size} fill="#3a2a22" />
      <circle cx={cx} cy="60" r="11" fill="#f3ede2" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <rect
          key={a}
          x={cx - 1.5}
          y="49"
          width="3"
          height="7"
          fill="#1d1f2b"
          transform={`rotate(${a} ${cx} 60)`}
        />
      ))}
    </g>
  );

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="paper-grain absolute inset-0 opacity-50" />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-5 pt-[max(4.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <Arrive reduce={reduce} tilt={-2} className="w-full max-w-[21rem]">
          <div
            data-tape={done ? "rebobinada" : "a-medias"}
            onPointerDown={(e) => {
              stop(e);
              drag.current = { x: e.clientX, y: e.clientY };
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (!drag.current) return;
              e.stopPropagation();
              const d = Math.hypot(e.clientX - drag.current.x, e.clientY - drag.current.y);
              drag.current = { x: e.clientX, y: e.clientY };
              wind(d / 900);
            }}
            onPointerUp={() => {
              drag.current = null;
            }}
            className="relative cursor-grab rounded-[10px] bg-[#1d1f2b] p-3 shadow-[0_24px_44px_-18px_rgb(10_10_20/0.7)]"
            style={{ touchAction: "none" }}
          >
            {/* La etiqueta, escrita a mano: cara A, vuestros nombres y la fecha de grabación. */}
            <div className="rounded-[4px] bg-[#f3ede2] px-3 pt-2 pb-1 text-[#1d1f2b]">
              <div className="flex items-baseline justify-between text-[0.6875rem] tracking-[0.18em] uppercase">
                <span>Cara A</span>
                <span>
                  {dd}·{mm}·{yy}
                </span>
              </div>
              <h1
                id="cover-title"
                tabIndex={-1}
                translate="no"
                className="border-b border-[#c4572a] pb-1 text-[clamp(1.7rem,7.6vw,2.2rem)] leading-tight outline-none"
                style={{ fontFamily: HAND }}
              >
                {names(event, " & ")}
              </h1>
              <svg viewBox="0 0 240 120" aria-hidden className="mt-1.5 w-full">
                <rect x="40" y="34" width="160" height="52" rx="26" fill="#2b2d3a" />
                {reel(80, 26 - wound * 12)}
                {reel(160, 14 + wound * 12)}
                <rect x="108" y="44" width="24" height="32" fill="#5a4a3e" opacity="0.6" />
                <path d="M30 112h180" stroke="#c4572a" strokeWidth="6" />
                <path d="M30 104h180" stroke="#e0a63a" strokeWidth="6" />
              </svg>
            </div>
            <p className="mt-2 text-center text-[0.6875rem] tracking-[0.2em] text-[#f3ede2] uppercase">
              Grabado en {event.city} · 90 min
            </p>
          </div>
        </Arrive>
        {/* La lista de canciones: el programa del día. */}
        <After reduce={reduce} className="short-hide mt-5 w-full max-w-[19rem]">
          <ol className="text-[0.875rem]">
            {event.program.slice(0, 4).map((act, i) => (
              <li key={act.id} className="flex justify-between border-b border-current/25 py-1">
                <span>
                  {i + 1}. {act.title}
                </span>
                <span className="tabular-nums">{act.time}</span>
              </li>
            ))}
          </ol>
          <p className="mt-2 text-center text-[0.875rem]">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>
          </p>
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={rewind}
            disabled={done}
            className="mt-3 rounded-full border border-current px-6 py-2.5 text-[0.9375rem] font-medium disabled:opacity-60"
          >
            {done ? "Lista para sonar" : "Rebobinar la cinta"}
          </button>
          <p className="short-hide mt-1.5 text-[0.8125rem] italic">
            O gira las bobinas con el dedo.
          </p>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Botella: se tira del corcho y sale el mensaje enrollado ─────────────── */

function BottleCover({ event, onOpen, reduce }: ConceptProps) {
  const [pulled, setPulled] = useState(0);
  const drag = useRef<{ y: number; start: number } | null>(null);
  const open = pulled >= 0.98;

  const tug = (value: number) =>
    setPulled((current) => {
      const next = Math.max(0, Math.min(1, value));
      if (next >= 0.98 && current < 0.98) {
        haptic([20, 40, 10]);
        playPaper(0.35);
      }
      return next;
    });

  const uncork = () => {
    if (reduce) return tug(1);
    animate(pulled, 1, { duration: 0.8, ease: [0.22, 1, 0.36, 1], onUpdate: tug });
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      {/* La arena mojada y la espuma de la orilla. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[22%] bg-[linear-gradient(180deg,#8fc0c9,#b9dad8_70%,#e9e1cf)]"
      />
      <div aria-hidden className="paper-grain absolute inset-0 opacity-50" />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center">
        <p className="text-[0.75rem] tracking-[0.2em] uppercase">Mensaje encontrado en la orilla</p>
        <div
          data-bottle={open ? "abierta" : "cerrada"}
          onPointerDown={(e) => {
            stop(e);
            drag.current = { y: e.clientY, start: pulled };
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (!drag.current) return;
            e.stopPropagation();
            tug(drag.current.start + Math.abs(e.clientY - drag.current.y) / 160);
          }}
          onPointerUp={() => {
            if (drag.current && Math.abs(pulled - drag.current.start) < 0.03) uncork();
            drag.current = null;
          }}
          className="relative mt-4 h-[min(52svh,25rem)] w-full cursor-ns-resize"
          style={{ touchAction: "none" }}
        >
          <Arrive reduce={reduce} tilt={-8} className="relative mx-auto h-full w-[8.5rem]">
            {/* El corcho, que sube al tirar. */}
            <span
              aria-hidden
              className="absolute top-0 left-1/2 z-20 h-12 w-9 -translate-x-1/2 rounded-[4px] bg-[repeating-linear-gradient(0deg,#b98a56_0_3px,#a4763f_3px_5px)] shadow"
              style={{ transform: `translate(-50%, ${-pulled * 150}%) rotate(${pulled * 30}deg)` }}
            />
            {/* El vidrio: cuello y cuerpo, con reflejos. */}
            <span
              aria-hidden
              className="absolute top-7 left-1/2 h-16 w-11 -translate-x-1/2 rounded-t-[8px] bg-[linear-gradient(90deg,rgb(120_170_150/0.55),rgb(220_240_232/0.65)_40%,rgb(120_170_150/0.55))]"
            />
            <span
              aria-hidden
              className="absolute inset-x-0 top-20 bottom-0 rounded-[2.5rem_2.5rem_1.5rem_1.5rem] bg-[linear-gradient(90deg,rgb(90_150_130/0.55),rgb(225_245_238/0.7)_35%,rgb(90_150_130/0.5))] shadow-[0_20px_30px_-16px_rgb(30_60_50/0.6)]"
            />
            {/* El mensaje enrollado dentro, que sale al destapar. */}
            <span
              aria-hidden
              className="absolute top-28 left-1/2 z-10 h-36 w-12 -translate-x-1/2 rounded-[6px] bg-[linear-gradient(90deg,#d9c7a0,#f6ecd2_45%,#d9c7a0)] shadow"
              style={{ transform: `translate(-50%, ${-pulled * 120}%)`, opacity: 1 - pulled * 0.6 }}
            >
              <span className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 bg-[#a3402a]" />
            </span>
            {/* La etiqueta atada al cuello: los nombres y la fecha, a la vista desde el principio. */}
            <span
              aria-hidden
              className="absolute top-14 left-[78%] z-20 w-28 rotate-[14deg] rounded-[3px] border border-[#cdb98c] bg-[#fbf4e2] px-2 py-1.5 text-left text-[0.75rem] leading-tight text-[#3b2a20] shadow"
            >
              <span className="block text-[1.05rem] leading-none" style={{ fontFamily: HAND }}>
                {names(event, " & ")}
              </span>
              {formatLongDate(event.date)}
            </span>
          </Arrive>
          {/* La carta desenrollada, con los nombres. */}
          <div
            className="absolute inset-x-2 top-[8%] z-30 rounded-[3px] border border-[#d9c7a0] bg-[#fbf4e2] px-5 py-6 shadow-[0_20px_40px_-18px_rgb(60_40_20/0.6)] transition-[opacity,transform] duration-500"
            style={{
              opacity: open ? 1 : 0,
              transform: `translateY(${open ? 0 : 12}px) scale(${open ? 1 : 0.96})`,
            }}
          >
            <p className="text-[0.75rem] tracking-[0.16em] uppercase">
              A quien encuentre esta botella:
            </p>
            <h1
              id="cover-title"
              tabIndex={-1}
              translate="no"
              className="mt-2 text-[clamp(2rem,9vw,2.6rem)] leading-[1.05] outline-none"
              style={{ fontFamily: HAND }}
            >
              {names(event)}
            </h1>
            <p className="mt-2 text-[1rem]">
              nos casamos el <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>{" "}
              en {event.city}. Ven.
            </p>
          </div>
        </div>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={uncork}
            disabled={open}
            className="mt-3 rounded-full bg-[#2f5f5a] px-6 py-2.5 text-[0.9375rem] font-medium text-[#f6efe1] disabled:opacity-70"
          >
            {open ? "Mensaje leído" : "Quitar el corcho"}
          </button>
          <p className="short-hide mt-1.5 text-[0.8125rem] italic">
            O tira del corcho hacia arriba.
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
  galleta: CookieCover,
  casete: TapeCover,
  botella: BottleCover,
};
