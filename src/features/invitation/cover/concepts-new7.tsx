"use client";

import { animate } from "motion/react";
import { useRef, useState, type PointerEvent } from "react";
import type { WeddingEvent } from "@/lib/domain/types";
import { hostNames, hostsOf } from "@/lib/event-kind";
import { formatLongDate, isoDay } from "@/lib/format";
import { haptic, playPaper, playTick } from "../effects/sound";
import {
  Arrive,
  dateParts,
  FRAUNCES,
  OpenHint,
  PLAYFAIR,
  SANS,
  type ConceptProps,
} from "./concept-kit";

/*
 * Portadas de concepto de la octava tanda (ronda 38): un diploma enrollado que se desenrolla, un
 * sobre de cromos que se rasga y una caja de bombones con un dato del día en cada uno.
 */

const names = (event: WeddingEvent, joiner = " y ") => hostNames(hostsOf(event), joiner);
const stop = (e: PointerEvent) => e.stopPropagation();
const BLACKLETTER = "var(--font-display), 'Bodoni Moda', Georgia, serif";

/* ─────────────── Diploma: se desenrolla tirando hacia abajo ─────────────── */

function DiplomaCover({ event, onOpen, reduce }: ConceptProps) {
  const [unrolled, setUnrolled] = useState(0);
  const drag = useRef<{ y: number; start: number } | null>(null);
  const open = unrolled >= 0.98;

  const roll = (value: number) =>
    setUnrolled((current) => {
      const next = Math.max(0, Math.min(1, value));
      if (next >= 0.98 && current < 0.98) {
        haptic([10, 30, 20]);
        playPaper(0.5);
      }
      return next;
    });
  const unroll = () => {
    if (reduce) return roll(1);
    animate(unrolled, 1, { duration: 0.9, ease: [0.22, 1, 0.36, 1], onUpdate: roll });
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="paper-grain absolute inset-0 opacity-60" />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-5 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">Diploma de</p>
        <h1
          id="cover-title"
          tabIndex={-1}
          translate="no"
          className="mt-1 mb-4 text-[clamp(1.9rem,8.8vw,2.5rem)] leading-[1.05] italic outline-none"
          style={{ fontFamily: PLAYFAIR }}
        >
          {names(event)}
        </h1>
        <Arrive reduce={reduce} tilt={0} className="w-full">
          <div
            data-diploma={open ? "abierto" : "enrollado"}
            onPointerDown={(e) => {
              stop(e);
              drag.current = { y: e.clientY, start: unrolled };
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (!drag.current) return;
              e.stopPropagation();
              roll(drag.current.start + (e.clientY - drag.current.y) / 260);
            }}
            onPointerUp={() => {
              if (drag.current && Math.abs(unrolled - drag.current.start) < 0.03) unroll();
              drag.current = null;
            }}
            className="relative w-full cursor-ns-resize"
            style={{ touchAction: "none" }}
          >
            {/* El rodillo de arriba, con su lazo granate. */}
            <div className="relative z-10 h-7 rounded-full bg-[linear-gradient(180deg,#efe2c2,#d8c597_55%,#b9a26f)] shadow-md">
              <span className="absolute top-1/2 left-1/2 h-9 w-6 -translate-1/2 rounded-[3px] bg-[#7d1f2e] shadow" />
            </div>
            {/* El pergamino: se ve más cuanto más se desenrolla. */}
            <div
              className="relative -mt-3 overflow-hidden bg-[#f7efda] px-5 shadow-[0_20px_36px_-18px_rgb(60_40_20/0.55)]"
              style={{ height: `${2.5 + unrolled * 22}rem` }}
            >
              <div className="pt-6 pb-4">
                <p className="text-[0.625rem] tracking-[0.24em] uppercase">Universidad del Amor</p>
                <p className="mt-2 text-[0.8125rem] italic">Por cuanto han superado con éxito</p>
                <p className="text-[0.8125rem] italic">todos los años de convivencia,</p>
                <p
                  aria-hidden
                  className="mt-3 text-[clamp(1.9rem,8.8vw,2.5rem)] leading-[1.05]"
                  style={{ fontFamily: PLAYFAIR, fontStyle: "italic" }}
                >
                  {names(event)}
                </p>
                <p className="mt-3 text-[0.8125rem]">reciben el título de</p>
                <p
                  className="text-[1.375rem] leading-tight font-bold"
                  style={{ fontFamily: BLACKLETTER }}
                >
                  Licenciados en quererse
                </p>
                <p className="mt-1 text-[0.8125rem] italic">con matrícula de honor</p>
                <p className="mt-3 text-[0.875rem]">
                  Acto de graduación:{" "}
                  <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>, en{" "}
                  {event.city}.
                </p>
                {/* El sello de oro con la cinta. */}
                <span
                  aria-hidden
                  className="mx-auto mt-3 grid size-14 place-items-center rounded-full bg-[radial-gradient(circle,#f3d27a,#b8892e)] text-[0.625rem] font-bold tracking-[0.1em] text-[#5a3d0e] shadow"
                >
                  {dateParts(event.date).yy}
                </span>
              </div>
            </div>
            <div className="relative z-10 -mt-3 h-7 rounded-full bg-[linear-gradient(180deg,#efe2c2,#d8c597_55%,#b9a26f)] shadow-md" />
          </div>
        </Arrive>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={unroll}
            disabled={open}
            className="mt-3 rounded-full bg-[#7d1f2e] px-6 py-2.5 text-[0.9375rem] font-medium text-[#f7efda] disabled:opacity-70"
          >
            {open ? "¡Graduados!" : "Desenrollar el diploma"}
          </button>
          <p className="short-hide mt-1.5 text-[0.8125rem] italic">
            O tira del rodillo hacia abajo.
          </p>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Sobre de cromos: se rasga y salen los cromos ─────────────── */

function StickerPackCover({ event, onOpen, reduce }: ConceptProps) {
  const [torn, setTorn] = useState(0);
  const drag = useRef<{ x: number; start: number } | null>(null);
  const open = torn >= 0.98;
  const hosts = hostsOf(event);
  const { dd, mm, yy } = dateParts(event.date);
  const stickers = [
    { n: 1, title: hosts.first, role: "Delantera" },
    { n: 2, title: hosts.second ?? "", role: "Delantero" },
    { n: Number(dd), title: event.city, role: `${dd}·${mm}·${yy}` },
  ].filter((s) => s.title);

  const tear = (value: number) =>
    setTorn((current) => {
      const next = Math.max(0, Math.min(1, value));
      if (Math.floor(next * 6) !== Math.floor(current * 6)) playTick();
      if (next >= 0.98 && current < 0.98) {
        haptic([8, 16, 8, 16, 24]);
        playPaper(0.35);
      }
      return next;
    });
  const rip = () => {
    if (reduce) return tear(1);
    animate(torn, 1, { duration: 0.6, ease: "easeOut", onUpdate: tear });
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="paper-grain absolute inset-0 opacity-50" />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-5 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">
          Colección oficial · Boda {`20${yy}`}
        </p>
        <h1
          id="cover-title"
          tabIndex={-1}
          translate="no"
          className="mt-1 text-[clamp(2rem,9vw,2.6rem)] leading-[1.02] font-black tracking-tight uppercase outline-none"
        >
          {names(event)}
        </h1>
        <div className="relative mt-4 h-[min(46svh,21rem)] w-full max-w-[17rem]">
          {/* Los cromos, que salen en abanico al abrir el sobre. */}
          <div
            data-pack={open ? "abierto" : "cerrado"}
            className="absolute inset-x-0 top-6 bottom-0"
          >
            {stickers.map((s, i) => (
              <div
                key={s.n + s.title}
                className="absolute top-0 left-1/2 w-[62%] rounded-[8px] border-[5px] border-white bg-[linear-gradient(160deg,#ffd23f,#ff8a3d)] p-2 text-left text-[#1d1f2b] shadow-lg transition-transform duration-500"
                style={{
                  transform: open
                    ? `translate(${-50 + (i - 1) * 36}%, ${-18 + Math.abs(i - 1) * 6}%) rotate(${(i - 1) * 12}deg)`
                    : "translate(-50%, 40%) rotate(0deg)",
                  zIndex: i === 1 ? 3 : 2,
                }}
              >
                <span className="block text-[0.6875rem] font-black">N.º {s.n}</span>
                <span
                  className="mt-6 block truncate text-[1.25rem] font-black uppercase"
                  style={{ fontFamily: FRAUNCES }}
                >
                  {s.title}
                </span>
                <span className="block text-[0.75rem] font-bold">{s.role}</span>
              </div>
            ))}
          </div>
          {/* El sobre: la tira de arriba se rasga al deslizar el dedo. */}
          <div
            onPointerDown={(e) => {
              stop(e);
              drag.current = { x: e.clientX, start: torn };
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (!drag.current) return;
              e.stopPropagation();
              tear(drag.current.start + Math.abs(e.clientX - drag.current.x) / 180);
            }}
            onPointerUp={() => {
              if (drag.current && Math.abs(torn - drag.current.start) < 0.03) rip();
              drag.current = null;
            }}
            className="absolute inset-x-0 bottom-0 h-[62%] cursor-ew-resize transition-[transform,opacity] duration-500"
            style={{
              touchAction: "none",
              transform: open ? "translateY(28%)" : "none",
              zIndex: 5,
            }}
          >
            <div
              className="absolute inset-x-0 top-0 h-6 bg-[repeating-linear-gradient(90deg,#c21b2a_0_10px,#e23545_10px_20px)]"
              style={{ clipPath: `inset(0 0 0 ${torn * 100}%)` }}
            />
            <div className="absolute inset-x-0 top-5 bottom-0 grid place-items-center rounded-b-[6px] bg-[linear-gradient(160deg,#e23545,#a3121f)] text-[#fff6d8] shadow-[0_20px_30px_-16px_rgb(80_10_10/0.6)]">
              <div>
                <p className="text-[0.75rem] font-bold tracking-[0.2em] uppercase">
                  Sobre de cromos
                </p>
                <p className="text-[2rem] leading-none font-black">3</p>
                <p className="text-[0.75rem]">cromos · uno es la fecha</p>
                <p className="mt-2 text-[0.8125rem]">
                  <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={rip}
            disabled={open}
            className="mt-3 rounded-full bg-[#c21b2a] px-6 py-2.5 text-[0.9375rem] font-medium text-white disabled:opacity-70"
          >
            {open ? "¡Los tengo todos!" : "Rasgar el sobre"}
          </button>
          <p className="short-hide mt-1.5 text-[0.8125rem] italic">O rasga la tira con el dedo.</p>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Caja de bombones: cada bombón esconde un dato del día ─────────────── */

function ChocolateBoxCover({ event, onOpen, reduce }: ConceptProps) {
  const ceremony = event.program[0];
  const party = event.program.find((act) => /fiesta|baile|barra/i.test(act.title));
  const fillings: [string, string][] = [
    ["Relleno de fecha", formatLongDate(event.date)],
    ["Relleno de lugar", event.city],
    ["Relleno de hora", ceremony ? `${ceremony.title}, ${ceremony.time}` : "Por la tarde"],
    ["Relleno de fiesta", party ? `Baile desde las ${party.time}` : "Hasta tarde"],
    ["Trufa de la casa", "Vosotros"],
    ["Praliné", "Un sí, quiero"],
  ];
  const [eaten, setEaten] = useState<number | null>(null);
  const [all, setAll] = useState(false);
  const taste = (i: number) => {
    setEaten(i);
    playTick();
    haptic(10);
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="paper-grain absolute inset-0 opacity-50" />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-5 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center">
        <p className="text-[0.75rem] tracking-[0.22em] uppercase">
          Bombonería · Selección especial
        </p>
        <h1
          id="cover-title"
          tabIndex={-1}
          translate="no"
          className="mt-1 text-[clamp(2rem,9vw,2.6rem)] leading-[1.02] italic outline-none"
          style={{ fontFamily: PLAYFAIR }}
        >
          {names(event)}
        </h1>
        <Arrive reduce={reduce} tilt={0} className="mt-4 w-full max-w-[19rem]">
          {/* La caja abierta, con su papel dorado y seis bombones. */}
          <div
            data-box={all ? "probada" : eaten === null ? "llena" : "empezada"}
            className="rounded-[10px] bg-[#3b1f17] p-3 shadow-[0_22px_40px_-18px_rgb(40_15_10/0.7)]"
          >
            <div className="grid grid-cols-3 gap-2 rounded-[6px] bg-[linear-gradient(135deg,#d9b25e,#a8813a)] p-2">
              {fillings.map(([kind], i) => (
                <button
                  key={kind}
                  type="button"
                  tabIndex={-1}
                  aria-hidden
                  onPointerDown={stop}
                  onClick={() => taste(i)}
                  className="grid aspect-square place-items-center rounded-full bg-[#5a2e1d]/40"
                >
                  <span
                    className="block size-[78%] rounded-full shadow-[inset_0_-4px_6px_rgb(0_0_0/0.35),0_2px_4px_rgb(0_0_0/0.3)] transition-transform duration-300"
                    style={{
                      background: [
                        "radial-gradient(circle at 35% 30%, #8a5236, #3b1f17)",
                        "radial-gradient(circle at 35% 30%, #f3e6d0, #c9b08a)",
                        "radial-gradient(circle at 35% 30%, #7a3b2a, #2b120b)",
                        "radial-gradient(circle at 35% 30%, #a0663f, #4a2617)",
                        "radial-gradient(circle at 35% 30%, #5a2e1d, #1f0d08)",
                        "radial-gradient(circle at 35% 30%, #c98a5a, #6b3a22)",
                      ][i],
                      transform: eaten === i ? "scale(0.6)" : "none",
                      opacity: eaten === i ? 0.4 : 1,
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
          {/* La guía de la caja: qué lleva el bombón que se ha probado. */}
          <p className="mt-3 min-h-[3rem] text-[0.9375rem]">
            {eaten === null ? (
              <>
                Toca un bombón para saber de qué es.
                <span className="block text-[0.8125rem]">
                  <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time> ·{" "}
                  {event.city}
                </span>
              </>
            ) : (
              <>
                <span className="block text-[0.75rem] tracking-[0.16em] uppercase">
                  {fillings[eaten]![0]}
                </span>
                <span className="text-[1.125rem] font-semibold" style={{ fontFamily: FRAUNCES }}>
                  {fillings[eaten]![1]}
                </span>
              </>
            )}
          </p>
        </Arrive>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={() => {
              setAll(true);
              taste(0);
            }}
            disabled={all}
            className="mt-3 rounded-full bg-[#3b1f17] px-6 py-2.5 text-[0.9375rem] font-medium text-[#f3e6d0] disabled:opacity-70"
          >
            {all ? "Caja probada" : "Probar un bombón"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

export const SEVENTH_NEW_COVERS = {
  diploma: DiplomaCover,
  cromos: StickerPackCover,
  bombones: ChocolateBoxCover,
};
