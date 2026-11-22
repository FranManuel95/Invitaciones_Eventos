"use client";

import { animate } from "motion/react";
import { useRef, useState, type PointerEvent } from "react";
import type { WeddingEvent } from "@/lib/domain/types";
import { hostNames, hostsOf } from "@/lib/event-kind";
import { formatLongDate, formatNumericDate, isoDay } from "@/lib/format";
import { haptic, playNotes, playPaper } from "../effects/sound";
import { After, FRAUNCES, OpenHint, PLAYFAIR, SANS, type ConceptProps } from "./concept-kit";

/*
 * Portadas de concepto de la vigesimonovena tanda (ronda 38): una cámara de carrete que dispara
 * y saca el negativo, un buzón rojo de correos y un termómetro del amor que se frota.
 */

const names = (event: WeddingEvent, joiner = " y ") => hostNames(hostsOf(event), joiner);
const stop = (e: PointerEvent) => e.stopPropagation();

/* ─────────────── Cámara de carrete: se dispara y sale el negativo ─────────────── */

function FilmCameraCover({ event, onOpen, reduce }: ConceptProps) {
  const [shot, setShot] = useState(false);
  const hosts = hostsOf(event);
  const shoot = () => {
    if (shot) return;
    setShot(true);
    haptic([4, 40, 4]);
    playNotes([2093, 1046], "square", 0.04);
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,#f3ede2,#e6dccb)]" />
      {shot && !reduce ? (
        <span
          aria-hidden
          className="absolute inset-0 animate-[flash_0.5s_ease-out_both] bg-white"
        />
      ) : null}
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#1e1a16]">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Sonreíd, que se casan</p>
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
          data-carrete={shot ? "revelado" : "sin-disparar"}
          onPointerDown={(e) => {
            stop(e);
            shoot();
          }}
          className="relative mt-6 flex cursor-pointer flex-col items-center"
        >
          {/* La cámara: cuerpo negro, objetivo y botón de disparo. */}
          <svg viewBox="0 0 160 100" aria-hidden className="w-56">
            <rect x="4" y="22" width="152" height="74" rx="10" fill="#1e1e1e" />
            <rect x="4" y="30" width="152" height="16" fill="#3a3a3a" />
            <rect x="20" y="10" width="30" height="14" rx="3" fill="#2a2a2a" />
            <rect
              x="112"
              y="12"
              width="18"
              height="10"
              rx="2"
              fill={shot ? "#e4572e" : "#9a9a9a"}
            />
            <circle cx="80" cy="62" r="28" fill="#2f2f2f" stroke="#9a9a9a" strokeWidth="3" />
            <circle cx="80" cy="62" r="17" fill="#0d1a24" />
            <circle cx="74" cy="56" r="5" fill="#fff" opacity="0.25" />
          </svg>
          {/* La tira de negativo que sale por un lado, con los fotogramas. */}
          <div
            className="mt-4 flex gap-1 overflow-hidden rounded-[2px] bg-[#3a2a1a] px-2 py-3 transition-[max-width] duration-700"
            style={{
              maxWidth: shot ? "18rem" : "0rem",
              paddingInline: shot ? undefined : 0,
              visibility: shot ? "visible" : "hidden",
              transitionDuration: reduce ? "0ms" : undefined,
            }}
          >
            {[hosts.first, "♥", hosts.second ?? "", formatNumericDate(event.date)].map((t, i) => (
              <span
                key={i}
                className="flex h-12 min-w-14 items-center justify-center rounded-[2px] bg-[#f2c28a] px-1 text-[0.6875rem] font-semibold text-[#3a2a1a]"
                translate="no"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <After reduce={reduce} className="mt-4 text-[0.9375rem]">
          {shot ? "Revelado y listo para el álbum:" : "Dispara la foto."}
          <span className="block text-[1.0625rem] font-semibold">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>, en {event.city}
          </span>
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={shoot}
            disabled={shot}
            className="mt-3 rounded-full bg-[#1e1e1e] px-6 py-2.5 text-[0.9375rem] font-medium text-[#f3ede2] disabled:opacity-70"
          >
            {shot ? "Foto hecha" : "Disparar"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Buzón rojo: se echa la carta y vuelve con la respuesta ─────────────── */

/** Dónde está la carta al empezar, respecto al centro del buzón, y dónde está la ranura. */
const LETTER_HOME = { x: -96, y: 6, tilt: -9 };
const SLOT_TOP = 166;
const LETTER_H = 64;

function MailboxCover({ event, onOpen, reduce }: ConceptProps) {
  const [step, setStep] = useState<"en-la-mano" | "echada" | "respuesta">("en-la-mano");
  // Dónde está la carta mientras se arrastra (respecto a su sitio) y cuánto se ha hundido.
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [sink, setSink] = useState(0);
  const drag = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const [dragging, setDragging] = useState(false);
  const answer = () => {
    setStep("respuesta");
    playNotes([659, 880], "sine", 0.15);
    haptic([10, 30, 10]);
    if (reduce) return setSink(0);
    // La respuesta asoma por la misma ranura.
    animate(1, 0, { duration: 0.8, ease: "easeOut", onUpdate: setSink });
  };
  const post = () => {
    if (step !== "en-la-mano") return;
    setStep("echada");
    // La carta se coloca sobre la ranura y se cuela dentro.
    setPos({ x: -LETTER_HOME.x, y: SLOT_TOP - LETTER_H - LETTER_HOME.y });
    playPaper(0.4);
    haptic(10);
    if (reduce) {
      setSink(1);
      answer();
      return;
    }
    animate(0, 1, {
      duration: 0.7,
      delay: 0.35,
      ease: [0.5, 0, 0.8, 0.6],
      onUpdate: setSink,
      onComplete: () => window.setTimeout(answer, 700),
    });
  };
  const atSlot = (p: { x: number; y: number }) =>
    Math.abs(LETTER_HOME.x + p.x) < 60 && Math.abs(LETTER_HOME.y + p.y + LETTER_H - SLOT_TOP) < 56;
  const goHome = () => {
    if (reduce) return setPos({ x: 0, y: 0 });
    const from = pos;
    animate(1, 0, {
      duration: 0.35,
      ease: "easeOut",
      onUpdate: (t) => setPos({ x: from.x * t, y: from.y * t }),
    });
  };
  const moving = step !== "en-la-mano" || dragging;
  const x = LETTER_HOME.x + pos.x;
  const y = step === "respuesta" ? SLOT_TOP - LETTER_H : LETTER_HOME.y + pos.y;
  const tilt = step === "en-la-mano" && !dragging ? LETTER_HOME.tilt : 0;

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,#eef0f2,#dfe3e6)]" />
      {/* La acera: unas baldosas en perspectiva bajo el buzón. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[38%] bg-[repeating-linear-gradient(90deg,#cfd4d8_0_46px,#c3c9ce_46px_48px)] [mask-image:linear-gradient(180deg,transparent,#000_30%)]"
      />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#1f2328]">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Por correo ordinario</p>
        <h1
          id="cover-title"
          tabIndex={-1}
          translate="no"
          className="mt-1 text-[clamp(2.1rem,9.4vw,2.8rem)] leading-[1.02] italic outline-none"
          style={{ fontFamily: PLAYFAIR }}
        >
          {names(event)}
        </h1>
        <div data-buzon={step} className="relative mt-4 h-[22rem] w-full">
          {/* El buzón de columna: sombrerete, ranura con su visera, placa y puerta de recogida. */}
          <div className="absolute bottom-0 left-1/2 flex w-36 -translate-x-1/2 flex-col items-center">
            <span
              aria-hidden
              className="block h-9 w-40 rounded-t-[50%] bg-[radial-gradient(ellipse_at_40%_20%,#d43a3a,#8f1818_70%)]"
            />
            <span aria-hidden className="block h-2 w-38 bg-[#7a1414]" />
            <div className="relative flex h-48 w-36 flex-col items-center bg-[linear-gradient(90deg,#9e1c1c,#d33434_35%,#c62828_60%,#8f1818)] pt-3 text-[#ffe9a8]">
              <span aria-hidden className="block h-1.5 w-24 rounded-[2px] bg-[#7a1414]" />
              <span aria-hidden className="block h-2.5 w-20 rounded-b-[3px] bg-[#1d0606]" />
              {/* La trompa de correos, dibujada a mano, sin marcas reales. */}
              <svg viewBox="0 0 40 24" aria-hidden className="mt-3 w-10">
                <g fill="none" stroke="#ffe9a8" strokeWidth="2" strokeLinejoin="round">
                  <circle cx="14" cy="12" r="6" />
                  <path d="M20 12h5l10-8v16l-10-8M8 12H2" />
                </g>
              </svg>
              <span className="mt-1 text-[0.6875rem] font-semibold tracking-[0.16em] uppercase">
                Cartas
              </span>
              <span className="mt-2 rounded-[2px] bg-[#fff7df] px-2 py-0.5 text-[0.625rem] text-[#5a1010]">
                Recogida: {formatNumericDate(event.date)}
              </span>
              <span
                aria-hidden
                className="absolute inset-x-5 bottom-4 block h-12 rounded-[3px] border-2 border-[#8f1818]"
              >
                <span className="absolute top-1/2 right-2 block size-2 rounded-full bg-[#e8c66a]" />
              </span>
            </div>
            <span aria-hidden className="block h-3 w-40 rounded-[2px] bg-[#5a0e0e]" />
          </div>
          {/* La carta: se arrastra hasta la ranura, se cuela y vuelve como respuesta. */}
          <div
            onPointerDown={(e) => {
              stop(e);
              if (step !== "en-la-mano") return;
              drag.current = { x: e.clientX - pos.x, y: e.clientY - pos.y, moved: false };
              setDragging(true);
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              const d = drag.current;
              if (!d) return;
              e.stopPropagation();
              const next = { x: e.clientX - d.x, y: e.clientY - d.y };
              if (Math.hypot(next.x - pos.x, next.y - pos.y) > 2) d.moved = true;
              setPos(next);
            }}
            onPointerUp={() => {
              const d = drag.current;
              drag.current = null;
              setDragging(false);
              if (!d) return;
              // Un toque sin arrastrar también la echa.
              if (!d.moved || atSlot(pos)) return post();
              goHome();
            }}
            className={`absolute left-1/2 z-10 h-16 w-32 touch-none ${step === "en-la-mano" ? "cursor-grab active:cursor-grabbing" : ""}`}
            style={{
              top: y,
              transform: `translateX(calc(-50% + ${x}px)) translateY(${sink * LETTER_H}px) rotate(${tilt}deg)`,
              clipPath: `inset(0 -20px ${sink * 100}% -20px)`,
              transition: moving || reduce ? "none" : "transform 0.3s ease",
            }}
          >
            <div className="relative flex size-full flex-col items-start justify-end rounded-[3px] border border-[#c9b89a] bg-[#fffaf0] py-2 pr-10 pl-2.5 text-left text-[0.6875rem] text-[#3a2a1c] shadow-[0_6px_12px_-6px_rgb(0_0_0/0.3)]">
              {/* El sello y el matasellos con la fecha. */}
              <span
                aria-hidden
                className="absolute top-1.5 right-1.5 flex h-7 w-6 items-center justify-center bg-[#ff5d8f] text-[0.625rem] text-white outline-1 outline-offset-1 outline-[#ff5d8f] outline-dashed"
              >
                ♥
              </span>
              {step === "respuesta" ? (
                <span className="font-semibold">Respuesta: ¡Sí, quiero!</span>
              ) : (
                <>
                  <span>Para: los novios</span>
                  <span className="text-[0.625rem]">{event.city}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <After reduce={reduce} className="mt-3 text-[0.9375rem]">
          {step === "respuesta"
            ? "Ha llegado la respuesta. Nos vemos el"
            : "Lleva la carta hasta la ranura del buzón."}
          <span className="block text-[1.0625rem] font-semibold">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>, en {event.city}
          </span>
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={post}
            disabled={step !== "en-la-mano"}
            className="mt-3 rounded-full bg-[#a11d1d] px-6 py-2.5 text-[0.9375rem] font-medium text-white disabled:opacity-70"
          >
            {step === "respuesta"
              ? "Carta recibida"
              : step === "echada"
                ? "En camino…"
                : "Echar la carta"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Termómetro del amor: se frota y sube hasta «boda» ─────────────── */

const LEVELS = ["Tibio", "Cariño", "Amor", "¡Boda!"];

function LoveMeterCover({ event, onOpen, reduce }: ConceptProps) {
  const [heat, setHeat] = useState(0);
  const full = heat >= 0.99;
  const rub = () => {
    if (heat > 0) return;
    playNotes([392, 523, 659, 784], "sine", 0.15);
    const done = () => haptic([10, 30, 10, 30]);
    if (reduce) {
      setHeat(1);
      done();
      return;
    }
    animate(0.01, 1, { duration: 2, ease: "easeIn", onUpdate: setHeat, onComplete: done });
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,#fbe3e6,#f3cdd3_75%)]"
      />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#3a1620]">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Termómetro del amor de</p>
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
          data-termometro={full ? "boda" : heat > 0 ? "subiendo" : "frio"}
          onPointerDown={(e) => {
            stop(e);
            rub();
          }}
          className="relative mt-6 flex h-72 cursor-pointer items-end gap-4"
        >
          {/* El tubo con la escala y el bulbo con forma de corazón. */}
          <div className="relative flex h-full flex-col items-center">
            <div className="relative h-56 w-8 overflow-hidden rounded-t-full border-4 border-[#fff7f8] bg-[#fff7f8]">
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 block bg-[linear-gradient(0deg,#c8102e,#ff6b81)]"
                style={{ height: `${heat * 100}%` }}
              />
            </div>
            <svg viewBox="0 0 40 36" aria-hidden className="-mt-2 w-16">
              <path
                d="M20 34C6 24 0 16 4 9 8 2 17 3 20 10 23 3 32 2 36 9 40 16 34 24 20 34Z"
                fill="#c8102e"
              />
            </svg>
          </div>
          <ol className="mb-14 flex h-56 flex-col-reverse justify-between text-left text-[0.8125rem] font-semibold">
            {LEVELS.map((l, i) => (
              <li
                key={l}
                className={
                  heat >= (i + 1) / LEVELS.length - 0.01 ? "text-[#a80d27]" : "text-[#7a5a62]"
                }
              >
                — {l}
              </li>
            ))}
          </ol>
        </div>
        <After reduce={reduce} className="mt-2 text-[0.9375rem]">
          {full ? "Temperatura máxima. Hay boda el" : "Frota el termómetro a ver cuánto amor hay."}
          <span className="block text-[1.0625rem] font-semibold">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>, en {event.city}
          </span>
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={rub}
            disabled={heat > 0}
            className="mt-3 rounded-full bg-[#a80d27] px-6 py-2.5 text-[0.9375rem] font-medium text-white disabled:opacity-70"
          >
            {full ? "¡Al máximo!" : heat > 0 ? "Subiendo…" : "Frotar el termómetro"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

export const TWENTYEIGHTH_NEW_COVERS = {
  carrete: FilmCameraCover,
  buzon: MailboxCover,
  termometro: LoveMeterCover,
};
