"use client";

import { animate } from "motion/react";
import { useState, type PointerEvent } from "react";
import type { WeddingEvent } from "@/lib/domain/types";
import { hostNames, hostsOf } from "@/lib/event-kind";
import { formatLongDate, isoDay } from "@/lib/format";
import { haptic, playNotes, playPaper } from "../effects/sound";
import { After, FRAUNCES, OpenHint, PLAYFAIR, SANS, type ConceptProps } from "./concept-kit";

/*
 * Portadas de concepto de la vigesimoctava tanda (ronda 38): un ramo de globos del que se suelta
 * uno, una peonza que se lanza y un castillo de arena que se construye con el cubo.
 */

const names = (event: WeddingEvent, joiner = " y ") => hostNames(hostsOf(event), joiner);
const stop = (e: PointerEvent) => e.stopPropagation();

/* ─────────────── Ramo de globos: se suelta el rojo y sube con la fecha ─────────────── */

function BalloonsCover({ event, onOpen, reduce }: ConceptProps) {
  const [rise, setRise] = useState(0);
  const flown = rise >= 0.98;
  const let_go = () => {
    if (rise > 0) return;
    playPaper(0.3);
    const done = () => haptic([10, 30, 10]);
    if (reduce) {
      setRise(1);
      done();
      return;
    }
    animate(0.01, 1, {
      duration: 2.2,
      ease: [0.3, 0.7, 0.4, 1],
      onUpdate: setRise,
      onComplete: done,
    });
  };
  const others = [
    { x: 32, y: 40, c: "#ffc93c" },
    { x: 58, y: 34, c: "#4cc9f0" },
    { x: 44, y: 48, c: "#b388ff" },
    { x: 66, y: 50, c: "#7bd389" },
  ];
  const balloon = (c: string) => (
    <svg viewBox="0 0 40 60" aria-hidden className="w-12">
      <ellipse cx="20" cy="20" rx="16" ry="19" fill={c} />
      <path d="M17 39l3 4 3-4z" fill={c} />
      <ellipse cx="13" cy="13" rx="4" ry="6" fill="#fff" opacity="0.35" />
    </svg>
  );

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,#bfe3f5,#eaf5fb_70%,#fdf6ea)]"
      />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#1e2a38]">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">¡Que suba la fiesta de</p>
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
          data-globos={flown ? "en-el-cielo" : rise > 0 ? "subiendo" : "en-el-ramo"}
          onPointerDown={(e) => {
            stop(e);
            let_go();
          }}
          className="relative mt-2 h-80 w-full cursor-pointer"
        >
          {/* Los cordeles se juntan en un nudo abajo. */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
            className="absolute inset-0 size-full"
          >
            {others.map((o) => (
              <path
                key={o.c}
                d={`M${o.x + 4} ${o.y + 14}L50 92`}
                stroke="#8a8a8a"
                strokeWidth="0.4"
                fill="none"
              />
            ))}
          </svg>
          {others.map((o) => (
            <span
              key={o.c}
              className="absolute"
              style={{ left: `${o.x - 4}%`, top: `${o.y - 6}%` }}
            >
              {balloon(o.c)}
            </span>
          ))}
          {/* El rojo, con la fecha atada al cordel, que se escapa hacia arriba. */}
          <div
            className="absolute flex flex-col items-center"
            style={{ left: `${44 + rise * 10}%`, top: `${26 - rise * 22}%` }}
          >
            {balloon("#e4572e")}
            <span aria-hidden className="block h-10 w-px bg-[#8a8a8a]" />
            <span className="rounded-[3px] bg-[#fffaf0] px-1.5 py-0.5 text-[0.6875rem] font-semibold shadow-[0_2px_6px_rgb(0_0_0/0.15)]">
              ¡Sí!
            </span>
          </div>
          <span
            aria-hidden
            className="absolute bottom-[6%] left-1/2 block size-2 -translate-x-1/2 rounded-full bg-[#8a8a8a]"
          />
        </div>
        <After reduce={reduce} className="text-[0.9375rem]">
          {flown ? "Allá va, rumbo a la boda:" : "Suelta el globo rojo."}
          <span className="block text-[1.0625rem] font-semibold">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>, en {event.city}
          </span>
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={let_go}
            disabled={rise > 0}
            className="mt-3 rounded-full bg-[#b3361a] px-6 py-2.5 text-[0.9375rem] font-medium text-white disabled:opacity-70"
          >
            {flown ? "¡Ha volado!" : rise > 0 ? "Subiendo…" : "Soltar el globo"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Peonza: se lanza, baila y se para ─────────────── */

function SpinningTopCover({ event, onOpen, reduce }: ConceptProps) {
  const [state, setState] = useState<"en-la-mano" | "bailando" | "parada">("en-la-mano");
  const spin = () => {
    if (state !== "en-la-mano") return;
    setState("bailando");
    playPaper(0.4);
    haptic([6, 10, 6, 10, 6]);
    window.setTimeout(
      () => {
        setState("parada");
        playNotes([523, 659, 784], "triangle", 0.12);
      },
      reduce ? 0 : 2400,
    );
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div
        aria-hidden
        className="absolute inset-0 bg-[repeating-linear-gradient(90deg,#e8d9bd_0_60px,#e2d1b2_60px_62px)]"
      />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#2a1e12]">
        <p className="rounded-full bg-[#f3ead8] px-3 text-[0.75rem] tracking-[0.22em] uppercase">
          Que no pare de bailar
        </p>
        <h1
          id="cover-title"
          tabIndex={-1}
          translate="no"
          className="mt-1 rounded-[6px] bg-[#f3ead8] px-2 text-[clamp(2.1rem,9.4vw,2.8rem)] leading-[1.02] outline-none"
          style={{ fontFamily: FRAUNCES }}
        >
          {names(event)}
        </h1>
        <div
          data-peonza={state}
          onPointerDown={(e) => {
            stop(e);
            spin();
          }}
          className="relative mt-8 flex h-64 w-full cursor-pointer flex-col items-center justify-end"
        >
          <svg
            viewBox="0 0 100 120"
            aria-hidden
            className={`w-36 origin-bottom ${state === "bailando" && !reduce ? "animate-[top-wobble_0.25s_linear_infinite]" : ""}`}
            style={{ transform: state === "parada" ? "rotate(14deg)" : "none" }}
          >
            <path d="M50 118L10 50Q50 20 90 50Z" fill="#e4572e" />
            <path d="M18 56Q50 34 82 56L74 64Q50 46 26 64Z" fill="#ffc93c" />
            <path d="M30 76Q50 62 70 76L64 84Q50 72 36 84Z" fill="#4cc9f0" />
            <rect x="46" y="22" width="8" height="20" rx="3" fill="#6b4a2a" />
          </svg>
          <span aria-hidden className="mt-1 block h-2 w-24 rounded-[50%] bg-[rgb(60_40_20/0.2)]" />
        </div>
        <After reduce={reduce} className="mt-4 rounded-[6px] bg-[#f3ead8] px-2 text-[0.9375rem]">
          {state === "parada" ? "Ha caído del lado bueno:" : "Lánzala a ver cuánto baila."}
          <span className="block text-[1.0625rem] font-semibold">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>, en {event.city}
          </span>
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={spin}
            disabled={state !== "en-la-mano"}
            className="mt-3 rounded-full bg-[#2a1e12] px-6 py-2.5 text-[0.9375rem] font-medium text-[#f3ead8] disabled:opacity-70"
          >
            {state === "parada"
              ? "¡Bien lanzada!"
              : state === "bailando"
                ? "Bailando…"
                : "Lanzar la peonza"}
          </button>
          <div className="rounded-full bg-[#f3ead8]">
            <OpenHint onOpen={onOpen} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Castillo de arena: tres cubos y la bandera ─────────────── */

function SandcastleCover({ event, onOpen, reduce }: ConceptProps) {
  const [buckets, setBuckets] = useState(0);
  const built = buckets >= 3;
  const hosts = hostsOf(event);
  const pour = () => {
    if (built) return;
    setBuckets(buckets + 1);
    playPaper(0.2);
    haptic(10);
    if (buckets + 1 >= 3) playNotes([784, 988, 1175], "sine", 0.12);
  };
  const tower = (show: boolean, h: string, key: string) => (
    <span
      key={key}
      aria-hidden
      className="block w-14 rounded-t-[4px] bg-[linear-gradient(180deg,#e9cf98,#d6b47a)] transition-transform duration-300 [clip-path:polygon(0_12%,20%_12%,20%_0,40%_0,40%_12%,60%_12%,60%_0,80%_0,80%_12%,100%_12%,100%_100%,0_100%)]"
      style={{
        height: h,
        transform: show ? "scaleY(1)" : "scaleY(0)",
        transformOrigin: "bottom",
        transitionDuration: reduce ? "0ms" : undefined,
      }}
    />
  );

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,#a8dcef,#d9f0f6_40%,#f2e2bd_40%,#e9d3a2)]"
      />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[#2a2214]">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Construyendo juntos</p>
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
          data-castillo={built ? "construido" : `cubos-${buckets}`}
          onPointerDown={(e) => {
            stop(e);
            pour();
          }}
          className="relative mt-auto mb-2 flex h-60 w-full cursor-pointer items-end justify-center"
        >
          {tower(buckets >= 1, "5rem", "a")}
          <div className="flex flex-col items-center">
            {built ? (
              <div className="mb-[-2px] flex flex-col items-start">
                <span
                  className="mb-0.5 rounded-[2px] bg-[#e4572e] px-1 text-[0.625rem] font-semibold text-white"
                  translate="no"
                >
                  {hosts.first.charAt(0)}♥{(hosts.second ?? "").charAt(0)}
                </span>
                <span aria-hidden className="ml-0 block h-8 w-0.5 bg-[#6b4a2a]" />
              </div>
            ) : null}
            {tower(buckets >= 3, "8rem", "b")}
          </div>
          {tower(buckets >= 2, "5rem", "c")}
          {/* El cubo y la pala, a un lado. */}
          <svg viewBox="0 0 40 40" aria-hidden className="absolute right-[6%] bottom-0 w-12">
            <path d="M6 10h28l-4 28H10z" fill="#4cc9f0" />
            <path d="M8 10C8 0 32 0 32 10" stroke="#1f6a85" strokeWidth="2" fill="none" />
          </svg>
        </div>
        <After reduce={reduce} className="text-[0.9375rem]">
          {built ? "Castillo terminado. La fiesta es el" : "Vuelca el cubo tres veces."}
          <span className="block text-[1.0625rem] font-semibold">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>, en {event.city}
          </span>
        </After>
        <div className="flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={pour}
            disabled={built}
            className="mt-3 rounded-full bg-[#1f6a85] px-6 py-2.5 text-[0.9375rem] font-medium text-white disabled:opacity-70"
          >
            {built ? "¡Castillo hecho!" : `Volcar el cubo (${buckets}/3)`}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

export const TWENTYSEVENTH_NEW_COVERS = {
  globos: BalloonsCover,
  peonza: SpinningTopCover,
  castillo: SandcastleCover,
};
