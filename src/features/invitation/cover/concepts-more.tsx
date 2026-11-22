"use client";

import { RefreshCw } from "lucide-react";
import { m, useAnimate } from "motion/react";
import { useRef, useState, type PointerEvent, type ReactNode } from "react";
import type { WeddingEvent } from "@/lib/domain/types";
import { hostNames, hostsOf } from "@/lib/event-kind";
import { formatLongDate, isoDay } from "@/lib/format";
import { haptic, playPaper, playPop } from "../effects/sound";
import {
  ActionButton,
  After,
  Arrive,
  dateParts,
  madrid,
  MONO,
  OpenHint,
  PLAYFAIR,
  roman,
  SANS,
  SCRIPT,
  yearOf,
  type ConceptProps,
} from "./concept-kit";
import { NEW_COVERS } from "./concepts-new";
import { MORE_NEW_COVERS } from "./concepts-new2";
import { THIRD_NEW_COVERS } from "./concepts-new3";
import { FOURTH_NEW_COVERS } from "./concepts-new4";
import { FIFTH_NEW_COVERS } from "./concepts-new5";
import { SIXTH_NEW_COVERS } from "./concepts-new6";
import { SEVENTH_NEW_COVERS } from "./concepts-new7";
import { EIGHTH_NEW_COVERS } from "./concepts-new8";
import { NINTH_NEW_COVERS } from "./concepts-new9";
import { TENTH_NEW_COVERS } from "./concepts-new10";
import { ELEVENTH_NEW_COVERS } from "./concepts-new11";
import { TWELFTH_NEW_COVERS } from "./concepts-new12";
import { THIRTEENTH_NEW_COVERS } from "./concepts-new13";
import { FOURTEENTH_NEW_COVERS } from "./concepts-new14";
import { FIFTEENTH_NEW_COVERS } from "./concepts-new15";
import { SIXTEENTH_NEW_COVERS } from "./concepts-new16";
import { SEVENTEENTH_NEW_COVERS } from "./concepts-new17";
import { EIGHTEENTH_NEW_COVERS } from "./concepts-new18";
import { NINETEENTH_NEW_COVERS } from "./concepts-new19";
import { TWENTIETH_NEW_COVERS } from "./concepts-new20";
import { TWENTYFIRST_NEW_COVERS } from "./concepts-new21";
import { TWENTYSECOND_NEW_COVERS } from "./concepts-new22";
import { TWENTYTHIRD_NEW_COVERS } from "./concepts-new23";
import { TWENTYFOURTH_NEW_COVERS } from "./concepts-new24";
import { TWENTYFIFTH_NEW_COVERS } from "./concepts-new25";
import { TWENTYSIXTH_NEW_COVERS } from "./concepts-new26";
import { TWENTYSEVENTH_NEW_COVERS } from "./concepts-new27";
import { TWENTYEIGHTH_NEW_COVERS } from "./concepts-new28";
import { TWENTYNINTH_NEW_COVERS } from "./concepts-new29";
import { MAP_COVERS } from "./concepts-play";

/*
 * Segunda tanda de portadas de concepto (ronda 20): vinilo, pasaporte, carta de restaurante,
 * cosecha y tarot. Las que piden seguir un trazo o pulsar (mapa, constelación, cómic, arcade y
 * semillas) están en `concepts-play.tsx`.
 */

const names = (event: WeddingEvent, joiner = " y ") => hostNames(hostsOf(event), joiner);

/**
 * Tirar de algo con el dedo en una dirección (sacar el disco, levantar la campana, descorchar).
 * `offset` va de 0 a `distance`; al soltar más allá de la mitad se da por hecho.
 */
function usePull(axis: "x" | "y", distance: number, onDone: () => void) {
  const [offset, setOffset] = useState(0);
  const start = useRef<number | null>(null);
  const finished = useRef(false);
  const value = (e: PointerEvent) => (axis === "x" ? e.clientX : -e.clientY);
  return {
    offset,
    finish: () => {
      if (finished.current) return;
      finished.current = true;
      setOffset(distance);
      onDone();
    },
    handlers: {
      onPointerDown: (e: PointerEvent<HTMLElement>) => {
        e.stopPropagation();
        if (finished.current) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        start.current = value(e);
      },
      onPointerMove: (e: PointerEvent<HTMLElement>) => {
        e.stopPropagation();
        if (start.current === null || finished.current) return;
        setOffset(Math.max(0, Math.min(distance, value(e) - start.current)));
      },
      onPointerUp: (e: PointerEvent<HTMLElement>) => {
        e.stopPropagation();
        if (start.current === null || finished.current) return;
        const moved = value(e) - start.current;
        start.current = null;
        if (moved > distance * 0.5) {
          finished.current = true;
          setOffset(distance);
          onDone();
        } else setOffset(0);
      },
      onPointerCancel: () => {
        start.current = null;
        if (!finished.current) setOffset(0);
      },
    },
  };
}

/* ───────────────────── Vinilo: un sencillo con el disco asomando de la funda ───────────────────── */

function VinylCover({ event, guestName, onOpen, reduce }: ConceptProps) {
  const [playing, setPlaying] = useState(false);
  const pull = usePull("x", 110, () => {
    setPlaying(true);
    haptic([10, 30, 16]);
    playPaper(0.35);
    window.setTimeout(onOpen, reduce ? 0 : 900);
  });
  const half = Math.ceil(event.program.length / 2);
  const sides = [event.program.slice(0, half), event.program.slice(half)];
  const year = yearOf(event.date);
  return (
    <div
      className="absolute inset-0 overflow-hidden bg-[radial-gradient(120%_70%_at_30%_25%,#fbf5e8_0%,#efe3c8_60%,#e2d1ad_100%)]"
      style={{ fontFamily: SANS }}
    >
      <div aria-hidden className="paper-grain absolute inset-0 opacity-50" />
      <div className="relative mx-auto flex h-full w-full max-w-[26rem] flex-col px-6 pt-[max(4.25rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <Arrive
          reduce={reduce}
          tilt={-2.5}
          className="relative aspect-square w-[min(80%,36svh)] shrink-0"
        >
          {/* El disco: asoma por la derecha y se saca tirando de él. */}
          <div
            {...pull.handlers}
            aria-hidden
            className="absolute inset-y-[3%] left-[22%] aspect-square cursor-grab touch-none active:cursor-grabbing"
            style={{
              transform: `translateX(${pull.offset}px)`,
              transition: pull.offset === 0 || playing ? "transform 0.45s ease-out" : undefined,
            }}
          >
            <m.div
              className={`relative size-full rounded-full shadow-[0_14px_30px_-10px_rgb(0_0_0/0.65)] ${playing && !reduce ? "disc-spin" : ""}`}
              initial={reduce ? false : { x: "-22%" }}
              animate={{ x: 0 }}
              transition={{ duration: 0.9, delay: 1.3, ease: [0.22, 1, 0.36, 1] }}
              style={{
                background:
                  "conic-gradient(from 20deg, rgb(255 255 255 / 0.18), transparent 12% 38%, rgb(255 255 255 / 0.12) 50%, transparent 62% 88%, rgb(255 255 255 / 0.18)), repeating-radial-gradient(circle, #1f1c1a 0 1.5px, #100e0d 1.5px 3px)",
              }}
            >
              {/* La galleta del disco. */}
              <span className="absolute inset-[32%] flex flex-col items-center justify-center rounded-full bg-[#d9a441] text-[#1c1917]">
                <span className="text-[0.5rem] font-semibold tracking-[0.14em] uppercase">
                  Cara A
                </span>
                <span className="text-[0.5rem] tabular-nums">45 rpm</span>
              </span>
              <span className="absolute inset-[48.5%] rounded-full bg-[#f3ead8]" />
            </m.div>
          </div>
          {/* La funda, con el borde gastado de tanto sacar el disco. */}
          <div className="absolute inset-0 overflow-hidden bg-[#ad4418] text-[#fbf5e8] shadow-[0_24px_44px_-16px_rgb(28_25_23/0.65)]">
            <span
              aria-hidden
              className="absolute -right-[38%] -bottom-[38%] size-[105%] rounded-full border-[26px] border-[#d9a441]"
            />
            <span
              aria-hidden
              className="absolute -right-[18%] -bottom-[18%] size-[62%] rounded-full bg-[#1c1917]"
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(135deg,rgb(255_255_255/0.14),transparent_40%,rgb(0_0_0/0.12))]"
            />
            <div className="relative flex h-full flex-col justify-between p-5">
              <p className="text-right text-[0.75rem]">Discos {event.city}</p>
              <div>
                <h1
                  id="cover-title"
                  tabIndex={-1}
                  translate="no"
                  className="font-names text-[clamp(2.25rem,11vw,3rem)] leading-[0.95] outline-none"
                >
                  {event.couple.first}
                  {event.couple.second ? (
                    <span className="block">&amp; {event.couple.second}</span>
                  ) : null}
                </h1>
                <p className="mt-2 text-[1.375rem] italic" style={{ fontFamily: PLAYFAIR }}>
                  «Sí, quiero»
                </p>
              </div>
            </div>
          </div>
          {/* Pegatina de la tienda, pegada en una esquina. */}
          <span className="absolute -top-3 -left-3 grid size-[4.5rem] -rotate-12 place-items-center rounded-full bg-[#fbf5e8] text-center text-[0.625rem] leading-tight font-semibold text-[#1c1917] shadow-[0_6px_12px_-6px_rgb(0_0_0/0.5)]">
            Edición
            <br />
            de un solo
            <br />
            ejemplar
          </span>
        </Arrive>

        {/* La contraportada: la lista de canciones es el programa, con la hora como duración. */}
        <After
          reduce={reduce}
          className="mt-6 flex [rotate:1.2deg] flex-col bg-[#fbf5e8] px-4 pt-3 pb-3 shadow-[0_14px_30px_-16px_rgb(28_25_23/0.55)]"
        >
          <p className="flex items-baseline justify-between border-b-2 border-current pb-1.5 text-[0.8125rem]">
            <span>Grabado en directo en {event.city}</span>
            <time dateTime={isoDay(event.date)} className="tabular-nums">
              {year}
            </time>
          </p>
          <div className="mt-2 grid grid-cols-2 gap-x-5">
            {sides.map((side, s) => (
              <div key={s} className="min-w-0">
                <p className="text-[0.75rem] font-semibold">Cara {s ? "B" : "A"}</p>
                <ol className="mt-1 space-y-1 text-[0.875rem]">
                  {side.map((act, i) => (
                    <li key={act.id} className="flex items-baseline gap-2">
                      <span className="text-[0.75rem] font-semibold tabular-nums">
                        {s ? "B" : "A"}
                        {i + 1}
                      </span>
                      <span className="min-w-0 flex-1 truncate">{act.title}</span>
                      <span className="tabular-nums">{act.time}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
          <p
            className="mt-3 line-clamp-3 border-t border-current/40 pt-2 text-[0.9375rem] leading-snug italic"
            style={{ fontFamily: PLAYFAIR }}
          >
            {event.welcomeMessage}
          </p>
          {/* Los créditos del disco: quién lo firma y quién está invitado a tocarlo. */}
          <dl className="short-hide mt-3 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 border-t border-current/40 pt-2 text-[0.8125rem]">
            <dt className="opacity-80">Producción</dt>
            <dd className="truncate font-medium">{names(event)}</dd>
            <dt className="opacity-80">Colaboración especial</dt>
            <dd className="truncate font-medium">{guestName ?? "Vosotros"}</dd>
          </dl>
          <p className="mt-3 text-[0.75rem]">
            <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>. Se escucha
            mejor acompañado.
          </p>
        </After>
        <ActionButton label="Poner el disco" onClick={pull.finish} className="mt-auto" />
      </div>
    </div>
  );
}

/* ─────────────── Pasaporte: la tapa y, al abrirlo, la hoja de datos del invitado ─────────────── */

const mrz = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "<");

/** Girar un objeto plano hasta ponerlo de canto, cambiarle la cara y terminar el giro. */
function useFlip(reduce: boolean) {
  const [flipped, setFlipped] = useState(false);
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const turning = useRef(false);
  const flip = async () => {
    if (turning.current) return;
    haptic(10);
    playPaper(0.3);
    if (reduce) {
      setFlipped((v) => !v);
      return;
    }
    turning.current = true;
    await animate(
      scope.current,
      { rotateY: 90, transformPerspective: 1200 },
      { duration: 0.24, ease: [0.5, 0, 1, 0.6] },
    );
    setFlipped((v) => !v);
    await animate(scope.current, { rotateY: [-90, 0] }, { duration: 0.34, ease: [0, 0.5, 0.3, 1] });
    turning.current = false;
  };
  return { flipped, flip, scope };
}
const face = (shown: boolean) =>
  `col-start-1 row-start-1 ${shown ? "" : "pointer-events-none opacity-0"}`;

function FlipButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onPointerDown={(e) => e.stopPropagation()}
      onClick={onClick}
      className="mt-4 flex items-center gap-2 rounded-full border border-current/50 px-5 py-2.5 text-[0.9375rem] font-medium"
      style={{ fontFamily: SANS }}
    >
      <RefreshCw aria-hidden className="size-4" />
      {label}
    </button>
  );
}

function DataField({
  label,
  wide = false,
  children,
}: {
  label: string;
  /** Ocupa las dos columnas. */
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={wide ? "col-span-2 min-w-0" : "min-w-0"}>
      <dt className="text-[0.5625rem] tracking-[0.12em] uppercase">{label}</dt>
      <dd className="truncate text-[0.875rem] font-bold" style={{ fontFamily: MONO }}>
        {children}
      </dd>
    </div>
  );
}

function PassportCover({ event, guestName, onOpen, reduce }: ConceptProps) {
  const { flipped, flip, scope } = useFlip(reduce);
  const { dd, mm, yy } = dateParts(event.date);
  const initials = `${event.couple.first[0] ?? ""}${event.couple.second?.[0] ?? ""}`;
  return (
    <div
      className="absolute inset-0 overflow-hidden bg-[radial-gradient(110%_70%_at_50%_30%,#f1ece0_0%,#e3dac6_65%,#d3c7ad_100%)]"
      style={{ fontFamily: SANS }}
    >
      <div aria-hidden className="paper-grain absolute inset-0 opacity-50" />
      <div className="relative flex h-full flex-col items-center px-6 pt-[max(4.25rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <Arrive
          reduce={reduce}
          tilt={-3}
          className="relative mt-2 flex min-h-0 w-full max-w-[17.5rem] flex-1 flex-col justify-center"
        >
          {/* Un visado asoma por arriba, metido entre las hojas. */}
          <div
            aria-hidden
            className="absolute -top-1 right-6 h-24 w-28 rotate-[8deg] bg-[#f8f4ea] px-2 py-2 shadow-[0_4px_10px_-4px_rgb(0_0_0/0.4)]"
          >
            <span
              className="block -rotate-6 rounded-[4px] border-2 border-[#2a4a7f] px-1.5 py-0.5 text-center text-[0.625rem] leading-tight font-bold text-[#2a4a7f]"
              style={{ fontFamily: MONO }}
            >
              VISADO
              <br />
              {dd}·{mm}·{yy}
            </span>
          </div>
          <div
            ref={scope}
            data-side={flipped ? "datos" : "tapa"}
            className="relative grid aspect-[5/7] max-h-full w-full shadow-[0_30px_50px_-18px_rgb(30_27_46/0.65)]"
          >
            {/* La tapa. */}
            <div
              className={`${face(!flipped)} passport-cover flex flex-col items-center justify-between rounded-[10px] px-6 py-9 text-center`}
            >
              <div>
                <p className="text-[0.75rem] tracking-[0.3em] uppercase">Reino de</p>
                <h1
                  id="cover-title"
                  tabIndex={-1}
                  translate="no"
                  className="mt-2 font-names text-[clamp(1.9rem,9vw,2.5rem)] leading-[1.02] outline-none"
                >
                  {event.couple.first}
                  {event.couple.second ? (
                    <span className="block">&amp; {event.couple.second}</span>
                  ) : null}
                </h1>
              </div>
              {/* El escudo: laurel, corona de puntos y las iniciales. */}
              <svg aria-hidden viewBox="0 0 120 120" className="size-28">
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="1 5"
                  strokeLinecap="round"
                />
                <path
                  d="M60 22l4 9 10 1-7.5 6.5 2.3 9.7L60 43l-8.8 5.2 2.3-9.7L46 32l10-1z"
                  fill="currentColor"
                />
                <text
                  x="60"
                  y="84"
                  textAnchor="middle"
                  fontSize="26"
                  fill="currentColor"
                  style={{ fontFamily: PLAYFAIR }}
                >
                  {initials}
                </text>
              </svg>
              <p className="text-[1.125rem] tracking-[0.42em] uppercase">Pasaporte</p>
            </div>

            {/* La hoja de datos. */}
            <div
              className={`${face(flipped)} flex flex-col overflow-hidden rounded-[10px] bg-[#f1ece0] px-5 pt-5 pb-4 text-[#1e1b2e]`}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-[0.6875rem] tracking-[0.14em] uppercase">
                  Pasaporte de invitado
                </p>
                <span
                  className="-rotate-6 rounded-[4px] border-2 border-[#a3221b] px-2 py-0.5 text-[0.75rem] font-bold tracking-[0.12em] text-[#a3221b]"
                  style={{ fontFamily: MONO }}
                >
                  ADMITIDO
                </span>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
                <DataField label="Titular" wide>
                  {guestName ?? "Vosotros"}
                </DataField>
                <DataField label="Válido desde">
                  <time dateTime={isoDay(event.date)}>
                    {dd}/{mm}/{yearOf(event.date)}
                  </time>
                </DataField>
                <DataField label="Caduca">Nunca</DataField>
                <DataField label="Lugar de expedición" wide>
                  {event.city}
                </DataField>
                <DataField label="Autoridad" wide>
                  {names(event)}
                </DataField>
              </dl>
              <p className="mt-4 text-[0.875rem] italic" style={{ fontFamily: PLAYFAIR }}>
                Este documento da derecho a barra libre. No requiere vacunas, solo ganas.
              </p>
              {/* La línea de lectura mecánica, compuesta con los nombres y la fecha. */}
              <p
                aria-hidden
                className="mt-auto overflow-hidden border-t border-current/40 pt-2 text-[0.6875rem] leading-relaxed tracking-[0.08em] whitespace-nowrap"
                style={{ fontFamily: MONO }}
              >
                P&lt;ESP{mrz(names(event, "<<"))}
                {"<".repeat(30)}
                <br />
                {yy}
                {mm}
                {dd}
                {"<"}
                {mrz(event.city)}
                {"<".repeat(30)}
              </p>
            </div>
          </div>
        </Arrive>
        {/* Sobre la mesa, los sellos que ya lleva el viaje. */}
        <After
          reduce={reduce}
          className="mt-5 flex w-full max-w-[20rem] items-center justify-between gap-2"
        >
          <span
            className="-rotate-6 rounded-[4px] border-2 border-[#a3221b] px-2 py-1 text-center text-[0.6875rem] leading-tight font-bold text-[#a3221b]"
            style={{ fontFamily: MONO }}
          >
            ENTRADA
            <br />
            {event.city.split(/\s+/)[0]!.toLocaleUpperCase("es-ES")}
          </span>
          <span
            className="grid size-[4.25rem] rotate-6 place-items-center rounded-full border-2 border-[#2a4a7f] text-center text-[0.625rem] leading-tight font-bold text-[#2a4a7f]"
            style={{ fontFamily: MONO }}
          >
            {dd}·{mm}
            <br />
            20{yy}
          </span>
          <span
            className="rotate-3 rounded-full border-2 border-[#1e1b2e] px-2.5 py-1 text-center text-[0.6875rem] leading-tight font-bold"
            style={{ fontFamily: MONO }}
          >
            SALIDA:
            <br />
            NUNCA
          </span>
        </After>
        <FlipButton label={flipped ? "Cerrar el pasaporte" : "Abrir el pasaporte"} onClick={flip} />
        <div className="mt-1">
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

/* ───────────── Carta de restaurante: el programa son los platos; la fecha, bajo la campana ───────────── */

/** Cómo se llama cada acto del programa en la carta, en su orden. */
const COURSES = ["Para empezar", "Entrante", "Principal", "Postre", "Sobremesa", "Digestivo"];

function MenuCover({ event, guestName, onOpen, reduce }: ConceptProps) {
  const [served, setServed] = useState(false);
  const pull = usePull("y", 90, () => {
    setServed(true);
    haptic([8, 30, 12]);
  });
  const since = event.story.moments[0]?.year;
  return (
    <div className="tablecloth absolute inset-0 overflow-hidden" style={{ fontFamily: PLAYFAIR }}>
      <div className="relative mx-auto flex h-full w-full max-w-[26rem] flex-col px-5 pt-[max(4.25rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {/* La carta sobre el mantel, con su orla de filete doble, verde y dorado. */}
        <Arrive
          reduce={reduce}
          tilt={-1.2}
          className="paper-grain flex min-h-0 flex-1 flex-col border border-[#b08a2e] bg-[#fffdf8] p-1 shadow-[0_26px_44px_-20px_rgb(34_32_28/0.55)]"
        >
          <div className="flex min-h-0 flex-1 flex-col border-2 border-[#2f4a3a] px-5 pt-5 pb-3 text-center">
            <p
              className="text-[0.6875rem] tracking-[0.2em] text-[#2f4a3a] uppercase"
              style={{ fontFamily: SANS }}
            >
              Casa
            </p>
            <h1
              id="cover-title"
              tabIndex={-1}
              translate="no"
              className="mt-1 font-names text-[clamp(2.1rem,10.5vw,3rem)] leading-[1] outline-none"
            >
              {names(event)}
            </h1>
            {since ? <p className="mt-1 text-[0.875rem] italic">desde {since}</p> : null}

            {/* El plato con la fecha y, encima, la campana de plata. */}
            <div className="relative mx-auto mt-4 h-[8.5rem] w-full max-w-[17rem]">
              <div className="absolute inset-x-0 bottom-0 flex h-[6.5rem] flex-col items-center justify-center rounded-[50%] border border-[#b08a2e] bg-[#fffdf8] shadow-[0_10px_20px_-12px_rgb(34_32_28/0.5)]">
                <p
                  className="text-[0.625rem] tracking-[0.18em] text-[#7a2230] uppercase"
                  style={{ fontFamily: SANS }}
                >
                  Menú del día
                </p>
                <p className="mt-0.5 text-[1.125rem] leading-tight font-semibold">
                  <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>
                </p>
                <p className="text-[0.875rem] italic">en {event.city}</p>
              </div>
              <div
                {...pull.handlers}
                aria-hidden
                data-cloche={served ? "levantada" : "puesta"}
                className="absolute inset-x-[6%] bottom-[0.4rem] cursor-grab touch-none active:cursor-grabbing"
                style={{
                  transform: `translateY(${served ? -170 : -pull.offset}px)`,
                  opacity: served ? 0 : 1,
                  transition:
                    served || pull.offset === 0
                      ? `transform ${reduce ? 0 : 0.6}s ease-in, opacity ${reduce ? 0 : 0.6}s ease-in`
                      : undefined,
                  pointerEvents: served ? "none" : "auto",
                }}
              >
                <svg viewBox="0 0 240 120" className="block w-full">
                  <defs>
                    <linearGradient id="plata" x1="0" x2="1">
                      <stop offset="0" stopColor="#9aa0a4" />
                      <stop offset="0.3" stopColor="#f2f4f4" />
                      <stop offset="0.55" stopColor="#c3c8cb" />
                      <stop offset="1" stopColor="#7d8387" />
                    </linearGradient>
                  </defs>
                  <circle cx="120" cy="14" r="9" fill="url(#plata)" stroke="#6d7376" />
                  <path
                    d="M14 108C14 52 62 22 120 22s106 30 106 86z"
                    fill="url(#plata)"
                    stroke="#6d7376"
                  />
                  <rect
                    x="4"
                    y="106"
                    width="232"
                    height="9"
                    rx="4.5"
                    fill="#aeb4b7"
                    stroke="#6d7376"
                  />
                </svg>
              </div>
            </div>
            {served ? null : (
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={pull.finish}
                className="mx-auto mt-1 text-[0.875rem] underline underline-offset-4"
                style={{ fontFamily: SANS }}
              >
                Destapar
              </button>
            )}

            {/* Los platos: el programa, con la hora donde iría el precio. */}
            <ul className="mt-3 min-h-0 flex-1 space-y-2.5 overflow-hidden text-left">
              {event.program.slice(0, 4).map((act, i) => (
                <li key={act.id}>
                  <p
                    className="text-[0.6875rem] text-[#2f4a3a] italic"
                    style={{ fontFamily: SANS }}
                  >
                    {COURSES[i]}
                  </p>
                  <p className="flex items-baseline gap-2 text-[1.0625rem] font-semibold">
                    <span className="truncate">{act.title}</span>
                    <span
                      aria-hidden
                      className="min-w-4 flex-1 border-b border-dotted border-current"
                    />
                    <span className="tabular-nums" style={{ fontFamily: SANS }}>
                      {act.time}
                    </span>
                  </p>
                  <p className="truncate text-[0.8125rem] italic">{act.place}</p>
                </li>
              ))}
            </ul>
            <p className="mt-2 self-start text-[0.8125rem] italic">IVA y abrazos incluidos.</p>
            <OpenHint onOpen={onOpen} />
          </div>
        </Arrive>
        {/* El cartel de reserva, de pie sobre el mantel. */}
        <After
          reduce={reduce}
          className="absolute right-3 bottom-[max(6.25rem,calc(env(safe-area-inset-bottom)+5.5rem))] w-[8.5rem] rotate-[5deg] border border-[#b08a2e] bg-[#fffdf8] px-3 py-2 text-center shadow-[0_12px_20px_-10px_rgb(34_32_28/0.6)]"
        >
          <p className="text-[1.25rem] leading-none text-[#7a2230]" style={{ fontFamily: SCRIPT }}>
            Reservado
          </p>
          <p className="mt-1 truncate text-[0.8125rem] font-semibold">
            {guestName ?? "Para vosotros"}
          </p>
        </After>
      </div>
    </div>
  );
}

/* ───────────────── Cosecha: una botella con su etiqueta; se descorcha para abrir ───────────────── */

function VintageCover({ event, guestName, onOpen, reduce }: ConceptProps) {
  const [open, setOpen] = useState(false);
  const pull = usePull("y", 70, () => {
    setOpen(true);
    haptic([14, 30, 8]);
    playPop();
    window.setTimeout(onOpen, reduce ? 0 : 650);
  });
  return (
    <div
      className="absolute inset-0 overflow-hidden bg-[radial-gradient(70%_55%_at_50%_42%,#fbf6ea_0%,#ebe1cc_55%,#cdbb98_100%)]"
      style={{ fontFamily: SANS }}
    >
      <div aria-hidden className="paper-grain absolute inset-0 opacity-50" />
      {/* El estante de la bodega, donde descansa la botella. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[24%] bg-[linear-gradient(180deg,#8a6a45,#6d5134_30%,#5a4229)] shadow-[inset_0_6px_10px_rgb(0_0_0/0.25)]"
      />
      <div className="relative mx-auto flex h-full w-full max-w-[24rem] flex-col items-center px-6 pt-[max(4.25rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <Arrive
          reduce={reduce}
          tilt={0}
          className="relative mt-1 flex min-h-0 w-full flex-1 flex-col items-center"
        >
          {/* El corcho: se tira de él hacia arriba. */}
          <div
            {...pull.handlers}
            aria-hidden
            className="relative z-10 h-12 w-9 cursor-grab touch-none rounded-[5px] bg-[linear-gradient(90deg,#b98a56,#e2bd8a_45%,#a87943)] shadow-[inset_0_-6px_8px_rgb(0_0_0/0.18)] active:cursor-grabbing"
            style={{
              transform: `translateY(${open ? -150 : -pull.offset}px) rotate(${open ? 24 : 0}deg)`,
              opacity: open ? 0 : 1,
              transition:
                open || pull.offset === 0
                  ? `transform ${reduce ? 0 : 0.5}s ease-out, opacity ${reduce ? 0 : 0.5}s ease-in`
                  : undefined,
            }}
          />
          {/* El gollete con su cápsula y el cuerpo de la botella. */}
          <div
            aria-hidden
            className="-mt-5 h-[13%] w-12 rounded-t-[6px] bg-[linear-gradient(90deg,#3d0f1b,#7d2a3e_35%,#c9a14a_48%,#7d2a3e_60%,#3d0f1b)]"
          />
          <div aria-hidden className="h-[9%] w-12 bg-[#243a2e]" />
          <div
            aria-hidden
            className="h-[7%] w-full max-w-[14.5rem] bg-[#243a2e] [clip-path:polygon(39.5%_0,60.5%_0,100%_100%,0_100%)]"
          />
          <div className="relative flex min-h-0 w-full max-w-[14.5rem] flex-1 flex-col rounded-b-[18px] bg-[linear-gradient(90deg,#182a20,#2c4a3a_30%,#243a2e_60%,#14231b)] px-3 pt-3 pb-5">
            {/* Los reflejos del vidrio. */}
            <span
              aria-hidden
              className="absolute inset-y-3 left-[9%] w-2.5 rounded-full bg-white/20 blur-[2px]"
            />
            <span
              aria-hidden
              className="absolute inset-y-6 right-[11%] w-1 rounded-full bg-white/10 blur-[1px]"
            />
            {/* La etiqueta. */}
            <div className="paper-grain relative flex min-h-0 flex-1 flex-col items-center justify-between border border-[#b3924a] bg-[#f4efe2] px-3 py-4 text-center text-[#2a1a1f] shadow-[0_6px_14px_-6px_rgb(0_0_0/0.5),inset_0_0_0_4px_#f4efe2,inset_0_0_0_5px_#b3924a]">
              <div>
                <p className="text-[0.5625rem] tracking-[0.2em] uppercase">Bodega</p>
                <h1
                  id="cover-title"
                  tabIndex={-1}
                  translate="no"
                  className="mt-1 font-names text-[clamp(1.6rem,8vw,2.1rem)] leading-[1.02] outline-none"
                >
                  {event.couple.first}
                  {event.couple.second ? (
                    <span className="block">&amp; {event.couple.second}</span>
                  ) : null}
                </h1>
              </div>
              <div>
                <p className="text-[#5e1a2b]" style={{ fontFamily: SCRIPT }}>
                  <span className="text-[1.75rem] leading-none">Cosecha</span>
                </p>
                <p
                  className="text-[2.25rem] leading-none font-semibold text-[#5e1a2b]"
                  style={{ fontFamily: PLAYFAIR }}
                >
                  {yearOf(event.date)}
                </p>
              </div>
              <div className="w-full border-t border-[#b3924a] pt-2">
                <p className="text-[0.5625rem] tracking-[0.16em] uppercase">
                  Denominación de origen
                </p>
                <p className="truncate text-[0.9375rem] font-medium">{event.city}</p>
                <p className="mt-1 text-[0.75rem]">
                  <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>
                </p>
              </div>
            </div>
          </div>
          {/* La sombra sobre el estante. */}
          <span
            aria-hidden
            className="mt-[-0.5rem] h-4 w-[62%] max-w-[13rem] rounded-[50%] bg-black/35 blur-[6px]"
          />
          {/* La etiqueta colgada del cuello, con el nombre del invitado. */}
          <After
            reduce={reduce}
            className="absolute top-[11%] left-[calc(50%+1.75rem)] w-[7.25rem] origin-top-left rotate-[9deg]"
          >
            <span aria-hidden className="block h-5 w-px translate-x-2 bg-[#5e1a2b]" />
            <span className="block rounded-[3px] border border-[#b3924a] bg-[#fbf6ea] px-2.5 py-1.5 shadow-[0_8px_14px_-8px_rgb(0_0_0/0.5)]">
              <span className="block text-[0.6875rem] text-[#5e1a2b]">Reservada para</span>
              <span className="block truncate text-[0.875rem] leading-tight font-semibold">
                {guestName ?? "vosotros"}
              </span>
            </span>
          </After>
        </Arrive>
        <p className="relative mt-2 text-center text-[0.8125rem] text-[#fbf6ea] italic">
          Embotellado en origen. Consumir en buena compañía.
        </p>
        <ActionButton label="Descorchar" onClick={pull.finish} className="text-[#fbf6ea]" />
      </div>
    </div>
  );
}

/* ───────────────── Tarot: una carta boca abajo que resulta ser la de los enamorados ───────────────── */

function TarotCover({ event, onOpen, reduce }: ConceptProps) {
  const { flipped, flip, scope } = useFlip(reduce);
  const parts = madrid({ day: "numeric", month: "numeric", year: "numeric" }).formatToParts(
    new Date(event.date),
  );
  const part = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  const romanDate = `${roman(part("day"))} · ${roman(part("month"))} · ${roman(part("year"))}`;
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: SANS }}>
      {/* Tapete de terciopelo a la luz de una vela. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(60%_42%_at_50%_44%,#4a3a78_0%,#2b2148_45%,#1c1630_75%,#120e20_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(rgb(241_231_208/0.5)_0.6px,transparent_1px)] [background-size:37px_41px] opacity-40"
      />
      <div className="relative flex h-full flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <p className="text-[0.8125rem] italic" style={{ fontFamily: PLAYFAIR }}>
          Tres cartas sobre el tapete. La del centro es la vuestra.
        </p>
        <div className="relative mt-5 flex min-h-0 w-full max-w-[16rem] flex-1 flex-col justify-center">
          {/* Las otras dos cartas de la tirada, boca abajo a los lados. */}
          {[-1, 1].map((side) => (
            <m.div
              key={side}
              aria-hidden
              className="tarot-back absolute top-1/2 left-1/2 aspect-[4/7] w-[72%] rounded-[12px] border-2 border-[#d3ad5a] bg-[#251d3d] shadow-[0_20px_40px_-14px_rgb(0_0_0/0.8)]"
              initial={reduce ? false : { x: "-50%", y: "-50%", rotate: 0, opacity: 0 }}
              animate={{ x: `${-50 + side * 46}%`, y: "-46%", rotate: side * 11, opacity: 0.9 }}
              transition={{
                duration: 1,
                delay: 0.25 + (side + 1) * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          ))}
          <Arrive reduce={reduce} tilt={0} delay={0.55} className="relative">
            <div
              ref={scope}
              data-side={flipped ? "cara" : "dorso"}
              className="grid aspect-[4/7] max-h-full w-full text-[#d3ad5a] shadow-[0_28px_60px_-16px_rgb(0_0_0/0.8)]"
            >
              {/* El dorso: una retícula de rombos con el sol en el centro. */}
              <div
                aria-hidden
                className={`${face(!flipped)} tarot-back relative rounded-[12px] border-2 border-current bg-[#251d3d] p-2.5`}
              >
                <div className="grid size-full place-items-center rounded-[7px] border border-current">
                  <svg viewBox="0 0 100 100" className="size-24">
                    <circle
                      cx="50"
                      cy="50"
                      r="15"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    {Array.from({ length: 16 }, (_, i) => (
                      <path
                        key={i}
                        d={i % 2 ? "M50 28V16" : "M50 30V8"}
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        transform={`rotate(${i * 22.5} 50 50)`}
                      />
                    ))}
                  </svg>
                </div>
              </div>
              {/* La cara: VI, los enamorados. */}
              <div
                className={`${face(flipped)} flex flex-col items-center rounded-[12px] border-2 border-current bg-[#1c1630] p-2.5 text-center`}
              >
                <div className="flex size-full flex-col items-center rounded-[7px] border border-current px-3 py-3">
                  <p className="text-[1.5rem] leading-none" style={{ fontFamily: PLAYFAIR }}>
                    VI
                  </p>
                  {/* El sol, la luna y dos alianzas enlazadas. */}
                  <svg aria-hidden viewBox="0 0 140 150" className="min-h-0 w-full flex-1">
                    <circle
                      cx="38"
                      cy="34"
                      r="13"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    {Array.from({ length: 12 }, (_, i) => (
                      <path
                        key={i}
                        d="M38 16V9"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        transform={`rotate(${i * 30} 38 34)`}
                      />
                    ))}
                    <path
                      d="M112 22a14 14 0 1 0 0 26 11 11 0 0 1 0-26z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="58"
                      cy="100"
                      r="25"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    />
                    <circle
                      cx="84"
                      cy="100"
                      r="25"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    />
                    {[
                      [22, 68],
                      [120, 76],
                      [70, 56],
                      [70, 140],
                    ].map(([x, y]) => (
                      <path
                        key={`${x}-${y}`}
                        d={`M${x} ${y! - 4}l1.2 2.8 2.8 1.2-2.8 1.2-1.2 2.8-1.2-2.8-2.8-1.2 2.8-1.2z`}
                        fill="currentColor"
                      />
                    ))}
                  </svg>
                  <p className="text-[0.75rem] tracking-[0.3em] uppercase">Los enamorados</p>
                  <h1
                    id="cover-title"
                    tabIndex={-1}
                    translate="no"
                    className="mt-1 font-names text-[clamp(1.5rem,7.5vw,2rem)] leading-[1.02] text-[#f1e7d0] outline-none"
                  >
                    {names(event, " & ")}
                  </h1>
                  <p className="mt-1.5 text-[0.9375rem]" style={{ fontFamily: PLAYFAIR }}>
                    <time dateTime={isoDay(event.date)}>
                      <span aria-hidden>{romanDate}</span>
                      <span className="sr-only">{formatLongDate(event.date)}</span>
                    </time>
                  </p>
                  <p className="mt-0.5 text-[0.75rem] tracking-[0.16em] text-[#f1e7d0] uppercase">
                    {event.city}
                  </p>
                </div>
              </div>
            </div>
          </Arrive>
        </div>
        <ul
          aria-hidden
          className="mt-4 grid w-full max-w-[20rem] grid-cols-3 text-center text-[0.75rem] text-[#d3ad5a]"
        >
          <li>Lo que fue</li>
          <li className="text-[#f1e7d0]">Lo que es</li>
          <li>Lo que será</li>
        </ul>
        <FlipButton label="Dar la vuelta a la carta" onClick={flip} />
        <p className="mt-2 text-center text-[0.8125rem] italic">
          Las cartas no mienten: habrá baile.
        </p>
        <OpenHint onOpen={onOpen} />
      </div>
    </div>
  );
}

export const MORE_COVERS = {
  vinilo: VinylCover,
  pasaporte: PassportCover,
  carta: MenuCover,
  cosecha: VintageCover,
  tarot: TarotCover,
  ...MAP_COVERS,
  ...NEW_COVERS,
  ...MORE_NEW_COVERS,
  ...THIRD_NEW_COVERS,
  ...FOURTH_NEW_COVERS,
  ...FIFTH_NEW_COVERS,
  ...SIXTH_NEW_COVERS,
  ...SEVENTH_NEW_COVERS,
  ...EIGHTH_NEW_COVERS,
  ...NINTH_NEW_COVERS,
  ...TENTH_NEW_COVERS,
  ...ELEVENTH_NEW_COVERS,
  ...TWELFTH_NEW_COVERS,
  ...THIRTEENTH_NEW_COVERS,
  ...FOURTEENTH_NEW_COVERS,
  ...FIFTEENTH_NEW_COVERS,
  ...SIXTEENTH_NEW_COVERS,
  ...SEVENTEENTH_NEW_COVERS,
  ...EIGHTEENTH_NEW_COVERS,
  ...NINETEENTH_NEW_COVERS,
  ...TWENTIETH_NEW_COVERS,
  ...TWENTYFIRST_NEW_COVERS,
  ...TWENTYSECOND_NEW_COVERS,
  ...TWENTYTHIRD_NEW_COVERS,
  ...TWENTYFOURTH_NEW_COVERS,
  ...TWENTYFIFTH_NEW_COVERS,
  ...TWENTYSIXTH_NEW_COVERS,
  ...TWENTYSEVENTH_NEW_COVERS,
  ...TWENTYEIGHTH_NEW_COVERS,
  ...TWENTYNINTH_NEW_COVERS,
};
