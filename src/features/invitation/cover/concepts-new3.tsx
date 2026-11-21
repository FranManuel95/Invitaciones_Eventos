"use client";

import { animate } from "motion/react";
import { useState, type PointerEvent } from "react";
import type { WeddingEvent } from "@/lib/domain/types";
import { hostNames, hostsOf } from "@/lib/event-kind";
import { formatLongDate, isoDay } from "@/lib/format";
import { haptic, playNotes, playPaper, playTick } from "../effects/sound";
import {
  After,
  Arrive,
  COURIER,
  dateParts,
  FRAUNCES,
  OpenHint,
  PLAYFAIR,
  SANS,
  type ConceptProps,
} from "./concept-kit";

/*
 * Portadas de concepto de la cuarta tanda (ronda 38): una entrada de concierto que se escanea, un
 * cartel de feria con farolillos que se encienden y la ficha de préstamo de una biblioteca que se
 * sella con la fecha.
 */

const names = (event: WeddingEvent, joiner = " y ") => hostNames(hostsOf(event), joiner);
const stop = (e: PointerEvent) => e.stopPropagation();

/** Barras de un código de barras a partir de un texto (siempre las mismas para el mismo texto). */
function bars(seed: string, count = 46) {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return Array.from({ length: count }, (_, i) => {
    h = Math.imul(h ^ i, 16777619);
    return 1 + ((h >>> 8) % 3);
  });
}

/* ─────────────── Entrada de concierto: se escanea el código ─────────────── */

function ConcertTicketCover({ event, onOpen, reduce }: ConceptProps) {
  const [scan, setScan] = useState(0);
  const valid = scan >= 1;
  const party = event.program.find((act) => /fiesta|baile|barra/i.test(act.title));
  const venue = event.venues.find((v) => v.id === party?.venueId) ?? event.venues.at(-1);
  const { dd, mm, yy } = dateParts(event.date);
  const code = bars(`${event.couple.first}${event.couple.second}${event.date}`);

  const check = () => {
    if (valid) return;
    const done = () => {
      haptic([12, 40, 12]);
      playNotes([880, 1320], "sine", 0.09);
    };
    if (reduce) {
      setScan(1);
      done();
      return;
    }
    animate(0, 1, { duration: 1.1, ease: "easeInOut", onUpdate: setScan, onComplete: done });
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      {/* Luces de escenario de fondo. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(60%_40%_at_20%_0%,rgb(255_70_140/0.35),transparent),radial-gradient(60%_40%_at_80%_0%,rgb(70_180_255/0.3),transparent)]"
      />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-5 pt-[max(4.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <Arrive reduce={reduce} tilt={-3} className="relative w-full max-w-[20.5rem]">
          <div className="flex overflow-hidden rounded-[10px] bg-[#f4f1ea] text-[#16121f] shadow-[0_26px_44px_-18px_rgb(0_0_0/0.75)]">
            <div className="min-w-0 flex-1 px-4 pt-3 pb-4">
              <p className="text-[0.625rem] tracking-[0.22em] uppercase">
                Gira «Sí, quiero» · 2027
              </p>
              <h1
                id="cover-title"
                tabIndex={-1}
                translate="no"
                className="mt-1 text-[clamp(1.7rem,8vw,2.3rem)] leading-[0.98] font-black tracking-tight uppercase outline-none"
                style={{ fontFamily: SANS }}
              >
                {names(event, " & ")}
              </h1>
              <p className="mt-1 text-[0.8125rem] font-medium">En directo · única fecha</p>
              <dl className="mt-3 grid grid-cols-3 gap-2 text-[0.75rem]">
                {[
                  [
                    "Fecha",
                    <time key="f" dateTime={isoDay(event.date)}>{`${dd}.${mm}.${yy}`}</time>,
                  ],
                  ["Puertas", event.program[0]?.time ?? "—"],
                  ["Zona", "Pista"],
                ].map(([label, value]) => (
                  <div key={String(label)}>
                    <dt className="text-[0.5625rem] tracking-[0.16em] uppercase opacity-80">
                      {label}
                    </dt>
                    <dd className="font-bold">{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-2 text-[0.75rem]">
                {venue ? `${venue.name}, ` : ""}
                {event.city}
              </p>
            </div>
            {/* La matriz, con el código de barras en vertical. */}
            <div className="relative w-16 shrink-0 border-l-2 border-dashed border-[#16121f]/40 bg-[#e8e3d8] py-3">
              <div
                data-scan={valid ? "valida" : "sin-validar"}
                className="relative mx-auto h-full w-9"
              >
                <div className="flex h-full flex-col gap-[2px]">
                  {code.map((w, i) => (
                    <span
                      key={i}
                      className="block w-full bg-[#16121f]"
                      style={{ height: w * 1.4 }}
                    />
                  ))}
                </div>
                {/* La línea roja del lector. */}
                {scan > 0 && !valid ? (
                  <span
                    aria-hidden
                    className="absolute inset-x-[-0.4rem] h-[3px] bg-[#ff3355] shadow-[0_0_10px_#ff3355]"
                    style={{ top: `${scan * 100}%` }}
                  />
                ) : null}
              </div>
              {valid ? (
                <span className="absolute inset-0 grid place-items-center bg-[#2ecc71]/85 text-[0.75rem] font-bold tracking-[0.14em] text-[#0b2a16] uppercase [writing-mode:vertical-rl]">
                  Válida
                </span>
              ) : null}
            </div>
          </div>
        </Arrive>
        <After reduce={reduce} className="short-hide mt-5 text-center text-[0.875rem]">
          {party
            ? `Empieza el concierto a las ${party.time}.`
            : "Empieza el concierto al caer la noche."}
          <span className="mt-0.5 block text-[0.8125rem] opacity-90">
            {formatLongDate(event.date)}
          </span>
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={check}
            disabled={valid}
            className="mt-3 rounded-full bg-[#cf1a40] px-6 py-2.5 text-[0.9375rem] font-medium text-white disabled:bg-[#2ecc71] disabled:text-[#0b2a16]"
          >
            {valid ? "Entrada válida" : "Escanear la entrada"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Cartel de feria: los farolillos se encienden al tocarlos ─────────────── */

const LANTERNS = ["#c8312b", "#f2c230", "#2f8f5b", "#e46a1f", "#3a6fb0", "#c8312b", "#f2c230"];

function FairPosterCover({ event, onOpen, reduce }: ConceptProps) {
  const [lit, setLit] = useState<boolean[]>(() => LANTERNS.map(() => false));
  const all = lit.every(Boolean);

  const light = (i: number) => {
    if (lit[i]) return;
    playTick();
    setLit((current) => {
      const next = current.map((v, k) => v || k === i);
      if (next.every(Boolean)) {
        haptic([10, 30, 10, 30, 10, 30, 20]);
        playNotes([523, 659, 784, 1047], "triangle", 0.12);
      }
      return next;
    });
  };
  const lightAll = () =>
    LANTERNS.forEach((_, i) => window.setTimeout(() => light(i), reduce ? 0 : i * 140));

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="paper-grain absolute inset-0 opacity-70" />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-5 pt-[max(4.25rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <Arrive
          reduce={reduce}
          tilt={0}
          className="relative w-full overflow-hidden border-[6px] border-double border-[#9b1d2c] bg-[#fbf1dc] px-4 pt-2 pb-4 text-center text-[#3a1418] shadow-[0_20px_40px_-20px_rgb(60_20_20/0.6)]"
        >
          {/* La guirnalda de farolillos: se encienden al tocarlos. */}
          <div data-lit={all ? "todos" : "apagados"} className="relative h-16">
            <svg viewBox="0 0 320 60" aria-hidden className="absolute inset-x-0 top-0 h-6 w-full">
              <path d="M0 4Q160 40 320 4" fill="none" stroke="#3a1418" strokeWidth="1.5" />
            </svg>
            <div className="absolute inset-x-1 top-1 flex justify-between">
              {LANTERNS.map((color, i) => {
                const y = 3 + Math.sin((Math.PI * (i + 0.5)) / LANTERNS.length) * 14;
                return (
                  <button
                    key={i}
                    type="button"
                    tabIndex={-1}
                    aria-hidden
                    onPointerDown={stop}
                    onClick={() => light(i)}
                    className="relative h-11 w-7 transition-[filter] duration-300"
                    style={{
                      marginTop: y,
                      filter: lit[i]
                        ? `drop-shadow(0 0 10px ${color})`
                        : "saturate(0.35) brightness(0.8)",
                    }}
                  >
                    <span className="absolute top-0 left-1/2 h-2 w-3 -translate-x-1/2 bg-[#3a1418]" />
                    <span
                      className="absolute inset-x-0 top-1.5 bottom-1 rounded-[45%] border border-black/20"
                      style={{
                        background: lit[i]
                          ? `radial-gradient(circle at 50% 45%, #fff6cf, ${color} 60%)`
                          : color,
                      }}
                    />
                    <span className="absolute bottom-0 left-1/2 h-1.5 w-3 -translate-x-1/2 bg-[#3a1418]" />
                  </button>
                );
              })}
            </div>
          </div>
          <p className="mt-1 text-[0.6875rem] tracking-[0.24em] uppercase">Gran fiesta de</p>
          <h1
            id="cover-title"
            tabIndex={-1}
            translate="no"
            className="mt-1 text-[clamp(2.3rem,11vw,3.2rem)] leading-[0.95] italic outline-none"
            style={{ fontFamily: PLAYFAIR }}
          >
            {names(event)}
          </h1>
          <p
            className="mt-3 inline-block border-y-2 border-[#9b1d2c] px-3 py-1 text-[1.125rem] font-semibold"
            style={{ fontFamily: FRAUNCES }}
          >
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>
          </p>
          <p className="mt-2 text-[0.875rem] tracking-[0.14em] uppercase">{event.city}</p>
          <ul className="mt-3 grid gap-0.5 text-[0.8125rem]">
            {event.program.slice(0, 4).map((act) => (
              <li key={act.id}>
                <span className="font-semibold">{act.time}</span> · {act.title}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[0.6875rem] tracking-[0.18em] text-[#9b1d2c] uppercase">
            Con caseta propia y baile hasta el amanecer
          </p>
        </Arrive>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={lightAll}
            disabled={all}
            className="mt-3 rounded-full bg-[#9b1d2c] px-6 py-2.5 text-[0.9375rem] font-medium text-[#fbf1dc] disabled:opacity-70"
          >
            {all ? "¡Que empiece la feria!" : "Encender los farolillos"}
          </button>
          <p className="short-hide mt-1.5 text-[0.8125rem] italic">O tócalos uno a uno.</p>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Ficha de biblioteca: se sella la fecha de devolución ─────────────── */

function LibraryCardCover({ event, onOpen, reduce }: ConceptProps) {
  const [stamped, setStamped] = useState(false);
  const { dd, mm, yy } = dateParts(event.date);
  const stamp = () => {
    if (stamped) return;
    setStamped(true);
    haptic([30]);
    playPaper(0.15);
  };
  const loans: [string, string][] = [
    ["Primera cita", "Hace años"],
    ["Mudanza juntos", "Ya devuelto"],
    ["La pedida", "Renovado"],
  ];

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      <div aria-hidden className="paper-grain absolute inset-0 opacity-70" />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-5 pt-[max(4.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <Arrive reduce={reduce} tilt={2} className="relative w-full max-w-[20rem]">
          {/* El bolsillo de cartón pegado al libro y la ficha asomando. */}
          <div
            onPointerDown={(e) => {
              stop(e);
              stamp();
            }}
            className="relative cursor-pointer bg-[#f3ead2] px-4 pt-3 pb-4 text-[#2a2622] shadow-[0_22px_40px_-20px_rgb(40_30_20/0.6)]"
            style={{ fontFamily: COURIER }}
          >
            <p className="border-b-2 border-[#2a2622] pb-1 text-center text-[0.6875rem] tracking-[0.2em] uppercase">
              Biblioteca municipal de {event.city}
            </p>
            <p className="mt-2 text-[0.6875rem] tracking-[0.14em] uppercase">Título</p>
            <h1
              id="cover-title"
              tabIndex={-1}
              translate="no"
              className="text-[clamp(1.6rem,7.4vw,2.1rem)] leading-tight font-bold outline-none"
              style={{ fontFamily: FRAUNCES }}
            >
              Historia de {names(event)}
            </h1>
            <p className="text-[0.75rem]">
              Signatura: AMOR {dd}·{mm}·{yy}
            </p>
            <table className="mt-3 w-full border-collapse text-[0.75rem]">
              <thead>
                <tr className="border-y border-[#2a2622]">
                  <th scope="col" className="py-1 text-left font-bold">
                    Capítulo
                  </th>
                  <th scope="col" className="py-1 text-right font-bold">
                    Devolución
                  </th>
                </tr>
              </thead>
              <tbody>
                {loans.map(([chapter, when]) => (
                  <tr key={chapter} className="border-b border-dashed border-[#2a2622]/40">
                    <td className="py-1">{chapter}</td>
                    <td className="py-1 text-right">{when}</td>
                  </tr>
                ))}
                <tr data-stamped={stamped ? "si" : "no"}>
                  <td className="py-2">La boda</td>
                  <td className="relative py-2 text-right">
                    <time
                      dateTime={isoDay(event.date)}
                      className={`inline-block -rotate-6 border-2 border-[#7d1f3a] px-1.5 py-0.5 font-bold text-[#7d1f3a] uppercase transition-[opacity,transform] duration-300 ${stamped ? "scale-100 opacity-100" : "scale-125 opacity-0"}`}
                    >
                      {formatLongDate(event.date)}
                    </time>
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="mt-2 text-[0.6875rem] italic">
              Préstamo para toda la vida. No se admiten devoluciones.
            </p>
          </div>
        </Arrive>
        <After reduce={reduce} className="short-hide mt-4 text-center text-[0.875rem]">
          Toca la ficha para sellar la fecha.
        </After>
        <div className="mt-auto flex w-full flex-col items-center">
          <button
            type="button"
            onPointerDown={stop}
            onClick={stamp}
            disabled={stamped}
            className="mt-3 rounded-full bg-[#7d1f3a] px-6 py-2.5 text-[0.9375rem] font-medium text-[#f3ead2] disabled:opacity-70"
          >
            {stamped ? "Fecha sellada" : "Sellar el préstamo"}
          </button>
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

export const THIRD_NEW_COVERS = {
  concierto: ConcertTicketCover,
  feria: FairPosterCover,
  biblioteca: LibraryCardCover,
};
