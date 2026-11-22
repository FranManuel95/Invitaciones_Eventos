"use client";

import { animate } from "motion/react";
import { useState, type PointerEvent } from "react";
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

function MailboxCover({ event, onOpen, reduce }: ConceptProps) {
  const [step, setStep] = useState<"en-la-mano" | "echada" | "respuesta">("en-la-mano");
  const post = () => {
    if (step !== "en-la-mano") return;
    setStep("echada");
    playPaper(0.4);
    haptic(10);
    window.setTimeout(
      () => {
        setStep("respuesta");
        playNotes([659, 880], "sine", 0.15);
      },
      reduce ? 0 : 1400,
    );
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,#eef0f2,#dfe3e6)]" />
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
        <div
          data-buzon={step}
          onPointerDown={(e) => {
            stop(e);
            post();
          }}
          className="relative mt-6 h-72 w-full cursor-pointer"
        >
          {/* El buzón de columna, rojo, con la ranura. */}
          <div className="absolute bottom-0 left-1/2 flex w-32 -translate-x-1/2 flex-col items-center">
            <span aria-hidden className="block h-8 w-36 rounded-t-[50%] bg-[#a11d1d]" />
            <div className="flex h-44 w-32 flex-col items-center bg-[#c62828] pt-3 text-[#ffe9a8]">
              <span aria-hidden className="block h-2 w-20 rounded-full bg-[#3a0a0a]" />
              <span className="mt-3 text-[0.6875rem] font-semibold tracking-[0.16em] uppercase">
                Correos
              </span>
              <span className="mt-1 text-[0.625rem]">
                Recogida: {formatNumericDate(event.date)}
              </span>
            </div>
            <span aria-hidden className="block h-3 w-36 bg-[#7a1414]" />
          </div>
          {/* La carta: entra por la ranura y vuelve como respuesta. */}
          <div
            className="absolute left-1/2 flex h-16 w-28 -translate-x-1/2 items-center justify-center rounded-[3px] border border-[#c9b89a] bg-[#fffaf0] text-[0.6875rem] text-[#3a2a1c] shadow-[0_6px_12px_-6px_rgb(0_0_0/0.3)] transition-[top] duration-700"
            style={{
              top: step === "echada" ? "28%" : step === "respuesta" ? "0%" : "6%",
              visibility: step === "echada" ? "hidden" : "visible",
              transitionDuration: reduce ? "0ms" : undefined,
            }}
          >
            {step === "respuesta" ? "Respuesta: ¡Sí, quiero!" : "Para: los novios"}
          </div>
        </div>
        <After reduce={reduce} className="mt-3 text-[0.9375rem]">
          {step === "respuesta"
            ? "Ha llegado la respuesta. Nos vemos el"
            : "Echa la carta al buzón."}
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
