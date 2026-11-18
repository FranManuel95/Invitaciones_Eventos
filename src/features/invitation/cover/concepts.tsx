"use client";

import { ChevronDown, Plane, RefreshCw } from "lucide-react";
import { m, useAnimate } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import type { WeddingEvent } from "@/lib/domain/types";
import { announcement, coverVerb, hostNames, hostsOf } from "@/lib/event-kind";
import { formatLongDate, formatWeekdayDate, isoDay } from "@/lib/format";
import { seeded, type ConceptCoverId } from "@/lib/theme";
import { useReducedMotionForMarkup } from "../effects/reduced-motion";
import { haptic, playKey, playPaper } from "../effects/sound";

/*
 * Portadas de concepto: en vez de un fondo con los nombres encima, la portada es un objeto
 * entero. Todas tienen el título de nivel 1 con los nombres (#cover-title) y un botón que abre
 * («Desliza o toca para abrir»), igual que el resto de portadas.
 */

import {
  COURIER,
  dateParts,
  FRAUNCES,
  madrid,
  MONO,
  OpenHint,
  PLAYFAIR,
  SANS,
  SCRIPT,
  type ConceptProps,
} from "./concept-kit";
import { MORE_COVERS } from "./concepts-more";

/* ───────────────────────── Gaceta: la portada de un periódico ───────────────────────── */

function GazetteCover({ event, onOpen }: ConceptProps) {
  const photo = event.story.couplePhoto ?? event.coverPhoto;
  const verb = coverVerb(hostsOf(event)).replace(/\s+el$/, "");
  return (
    <div
      className="absolute inset-0 flex flex-col px-5 pt-[max(4.25rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      style={{ fontFamily: PLAYFAIR }}
    >
      <div aria-hidden className="paper-grain absolute inset-0 opacity-50" />
      <div className="relative mx-auto flex min-h-0 w-full max-w-[30rem] flex-1 flex-col">
        <p
          className="flex justify-between border-y border-current py-1 text-[0.625rem] tracking-[0.14em] uppercase"
          style={{ fontFamily: SANS }}
        >
          <span>Edición especial</span>
          <span>{event.city}</span>
          <span>N.º 1</span>
        </p>
        <p className="mt-2 text-center text-[clamp(2.1rem,10.5vw,3.4rem)] leading-none font-black italic">
          La Gaceta
        </p>
        <p
          className="mt-1.5 border-b-[3px] border-double border-current pb-2 text-center text-[0.6875rem] tracking-[0.18em] uppercase"
          style={{ fontFamily: SANS }}
        >
          <time dateTime={isoDay(event.date)}>{formatWeekdayDate(event.date)}</time>
        </p>

        <p
          className="mt-4 text-[0.6875rem] font-semibold tracking-[0.16em] text-[#a3221b] uppercase"
          style={{ fontFamily: SANS }}
        >
          Última hora
        </p>
        <h1
          id="cover-title"
          tabIndex={-1}
          translate="no"
          className="mt-1 text-[clamp(2.5rem,12.5vw,4.25rem)] leading-[0.94] font-black tracking-[-0.02em] outline-none"
        >
          {event.couple.first}
          {event.couple.second ? ` y ${event.couple.second}` : ""}
          <span className="block italic">{verb}</span>
        </h1>
        <p className="mt-3 text-[1.0625rem] leading-snug italic">
          Será el {formatLongDate(event.date)} en {event.city}. Se espera lleno absoluto.
        </p>

        <div
          className={`mt-4 grid min-h-0 flex-1 gap-3 border-t border-current pt-3 ${photo ? "grid-cols-[1.2fr_1fr]" : ""}`}
        >
          {photo ? (
            <figure className="flex min-h-0 flex-col">
              <div className="relative min-h-0 flex-1 overflow-hidden border border-current">
                <Image
                  src={photo}
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 480px) 260px, 55vw"
                  className="object-cover object-[50%_25%] contrast-[1.2] grayscale"
                />
                {/* Trama de puntos, como la foto impresa de un periódico. */}
                <span
                  aria-hidden
                  className="absolute inset-0 bg-[radial-gradient(#000_0.8px,transparent_1.1px)] [background-size:4px_4px] opacity-35 mix-blend-multiply"
                />
              </div>
              <figcaption
                className="mt-1 text-[0.625rem] leading-tight opacity-80"
                style={{ fontFamily: SANS }}
              >
                Los protagonistas, en una imagen de archivo.
              </figcaption>
            </figure>
          ) : null}
          <div className="flex min-h-0 flex-col gap-2.5 overflow-hidden text-[0.75rem] leading-[1.35]">
            <p className="first-letter:float-left first-letter:mr-1 first-letter:text-[2.5rem] first-letter:leading-[0.78] first-letter:font-black">
              {event.welcomeMessage}
            </p>
            <div className="border-t border-current pt-2">
              <p
                className="text-[0.5625rem] font-semibold tracking-[0.16em] uppercase"
                style={{ fontFamily: SANS }}
              >
                En páginas interiores
              </p>
              <ul className="mt-1 space-y-0.5">
                {event.program.slice(0, 4).map((act) => (
                  <li key={act.id} className="flex gap-1.5">
                    <span className="font-black tabular-nums">{act.time}</span>
                    <span className="truncate italic">{act.title}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-auto border border-current px-2 py-1.5">
              <p
                className="text-[0.5625rem] font-semibold tracking-[0.16em] uppercase"
                style={{ fontFamily: SANS }}
              >
                El tiempo
              </p>
              <p className="italic">Despejado, con probabilidad de lágrimas de emoción.</p>
            </div>
          </div>
        </div>

        <div className="mt-2 border-t border-current pt-1">
          <OpenHint onOpen={onOpen}>
            <span className="text-[0.6875rem] tracking-[0.14em] uppercase opacity-70">
              Sigue en la página 2
            </span>
          </OpenHint>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────── Embarque: una tarjeta de embarque con resguardo ──────────────────── */

const code = (city: string) =>
  city
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z]/g, "")
    .slice(0, 3)
    .toUpperCase();

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-[0.5625rem] tracking-[0.14em] uppercase opacity-60">{label}</dt>
      <dd className="mt-0.5 truncate text-[0.875rem] font-medium" style={{ fontFamily: MONO }}>
        {children}
      </dd>
    </div>
  );
}

function BoardingCover({ event, guestName, onOpen, reduce }: ConceptProps) {
  const [torn, setTorn] = useState(false);
  const { dd, mm } = dateParts(event.date);
  const initials = code(`${event.couple.first[0] ?? ""}${event.couple.second?.[0] ?? ""}`);
  const time = madrid({ hour: "2-digit", minute: "2-digit" }).format(new Date(event.date));
  const day = madrid({ day: "2-digit", month: "short", year: "numeric" })
    .format(new Date(event.date))
    .replaceAll(".", "");
  const tear = () => {
    if (torn) return;
    setTorn(true);
    haptic([8, 40, 14]);
    // El resguardo se desprende y, al caer, la portada se abre.
    window.setTimeout(onOpen, reduce ? 0 : 480);
  };
  return (
    <div
      className="absolute inset-0 overflow-hidden bg-[linear-gradient(180deg,#cfdcea_0%,#e6e6df_62%,#f3ead9_100%)]"
      style={{ fontFamily: SANS }}
    >
      {/* La ruta: un arco punteado que cruza el cielo, con un avión pequeño en la punta. */}
      <svg aria-hidden viewBox="0 0 400 800" className="absolute inset-0 size-full opacity-45">
        <path
          d="M-20 640 C 90 380, 250 250, 430 190"
          fill="none"
          stroke="#14233f"
          strokeWidth="1.2"
          strokeDasharray="2 7"
          strokeLinecap="round"
        />
        <circle cx="38" cy="566" r="3" fill="#b3312a" />
      </svg>

      <div className="relative flex h-full flex-col items-center px-5 pt-[max(4.75rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
        <p className="text-[0.75rem] tracking-[0.16em] uppercase opacity-75">
          Tiene un vuelo pendiente
        </p>
        <m.article
          className="relative mt-4 w-full max-w-[22.5rem] rounded-[14px] bg-[#fbf8ef] shadow-[0_30px_60px_rgb(20_35_63/0.28)]"
          initial={reduce ? false : { y: 40, rotate: 0, opacity: 0 }}
          animate={{ y: 0, rotate: -2.2, opacity: 1 }}
          transition={{ duration: 1.1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <header className="flex items-center justify-between rounded-t-[14px] bg-[#14233f] px-5 py-3 text-[#fbf8ef]">
            <span className="flex items-center gap-2 text-[0.75rem] tracking-[0.14em] uppercase">
              <Plane aria-hidden className="size-4 -rotate-45" /> Tarjeta de embarque
            </span>
            <span className="text-[0.75rem]" style={{ fontFamily: MONO }}>
              {initials} {dd}
              {mm}
            </span>
          </header>
          {/* Borde de correo aéreo. */}
          <div
            aria-hidden
            className="h-1.5 bg-[repeating-linear-gradient(135deg,#b3312a_0_10px,#fbf8ef_10px_20px,#14233f_20px_30px,#fbf8ef_30px_40px)]"
          />
          <div className="px-5 pt-4 pb-5">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p
                  className="text-[2.5rem] leading-none font-semibold tracking-tight"
                  style={{ fontFamily: MONO }}
                >
                  SOL
                </p>
                <p className="mt-1 text-[0.75rem] opacity-70">Soltería</p>
              </div>
              <span aria-hidden className="mb-5 flex flex-1 items-center gap-1.5 text-[#b3312a]">
                <span className="h-px flex-1 border-t border-dashed border-current" />
                <Plane className="size-4 rotate-45" />
                <span className="h-px flex-1 border-t border-dashed border-current" />
              </span>
              <div className="text-right">
                <p
                  className="text-[2.5rem] leading-none font-semibold tracking-tight"
                  style={{ fontFamily: MONO }}
                >
                  {code(event.city)}
                </p>
                <p className="mt-1 text-[0.75rem] opacity-70">{event.city}</p>
              </div>
            </div>

            <p className="mt-5 text-[0.5625rem] tracking-[0.14em] uppercase opacity-60">
              Operado por
            </p>
            <h1
              id="cover-title"
              tabIndex={-1}
              translate="no"
              className="mt-0.5 font-names text-[clamp(1.9rem,9vw,2.4rem)] leading-[1.02] outline-none"
            >
              {event.couple.first}
              {event.couple.second ? ` & ${event.couple.second}` : ""}
            </h1>

            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
              <Field label="Pasajeros">{guestName ?? "Vosotros"}</Field>
              <Field label="Fecha">
                <time dateTime={isoDay(event.date)}>{day}</time>
              </Field>
              <Field label="Embarque">{time}</Field>
              <Field label="Puerta">Sí, quiero</Field>
            </dl>
          </div>

          {/* Línea de corte, con las dos muescas del troquel. */}
          <div aria-hidden className="relative border-t-2 border-dashed border-[#14233f]/35">
            <span className="absolute top-1/2 -left-2.5 size-5 -translate-y-1/2 rounded-full bg-[#dfe5e6]" />
            <span className="absolute top-1/2 -right-2.5 size-5 -translate-y-1/2 rounded-full bg-[#dfe5e6]" />
          </div>
          <m.button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={tear}
            aria-label="Arrancar el resguardo: desliza o toca para abrir"
            className="flex w-full items-center gap-4 rounded-b-[14px] bg-[#fbf8ef] px-5 py-4 text-left"
            style={{ transformOrigin: "0% 0%" }}
            animate={torn && !reduce ? { y: 90, rotate: 9, opacity: 0 } : { y: 0, rotate: 0 }}
            transition={{ duration: 0.5, ease: [0.5, 0, 0.9, 0.4] }}
          >
            {/* Código de barras dibujado con rayas. */}
            <span
              aria-hidden
              className="h-11 w-28 shrink-0 bg-[repeating-linear-gradient(90deg,#14233f_0_2px,transparent_2px_3px,#14233f_3px_4px,transparent_4px_7px,#14233f_7px_10px,transparent_10px_12px)]"
            />
            <span className="min-w-0">
              <span className="block text-[0.9375rem] font-medium">Arranca el resguardo</span>
              <span className="block text-[0.75rem] opacity-70">Desliza o toca para abrir</span>
            </span>
            <ChevronDown aria-hidden className="nudge ml-auto size-5 shrink-0" />
          </m.button>
        </m.article>
        {/* Panel de salidas: el programa del día, como en un aeropuerto. */}
        <m.div
          aria-hidden
          className="mt-auto w-full max-w-[22.5rem] rounded-[10px] bg-[#14233f] px-4 py-3 text-[#f3ead9] shadow-[0_18px_40px_rgb(20_35_63/0.25)]"
          style={{ fontFamily: MONO }}
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.5 }}
        >
          <p
            className="flex justify-between text-[0.5625rem] tracking-[0.16em] text-[#f3ead9]/60 uppercase"
            style={{ fontFamily: SANS }}
          >
            <span>Salidas</span>
            <span>Estado</span>
          </p>
          <ul className="mt-1.5 space-y-1 text-[0.8125rem]">
            {event.program.slice(0, 3).map((act, i) => (
              <li key={act.id} className="flex items-baseline gap-3">
                <span className="text-[#f2c75c] tabular-nums">{act.time}</span>
                <span className="min-w-0 flex-1 truncate uppercase">{act.title}</span>
                <span className={i === 0 ? "text-[#8fd39b]" : "text-[#f3ead9]/60"}>
                  {i === 0 ? "EN HORA" : "PREVISTO"}
                </span>
              </li>
            ))}
          </ul>
        </m.div>
        <p className="pt-3 text-center text-[0.8125rem] italic opacity-75">
          Vuelo directo, sin escalas y sin billete de vuelta.
        </p>
      </div>
    </div>
  );
}

/* ───────────────── Premio: un décimo con la fecha bajo una capa que se rasca ───────────────── */

/** Roseta de filigrana (hipotrocoide), como las de los billetes y los décimos. */
function rosette(R: number, r: number, d: number, steps = 720) {
  const turns = r / gcd(R, r);
  let path = "";
  for (let i = 0; i <= steps; i += 1) {
    const t = (i / steps) * Math.PI * 2 * turns;
    const x = (R - r) * Math.cos(t) + d * Math.cos(((R - r) / r) * t);
    const y = (R - r) * Math.sin(t) - d * Math.sin(((R - r) / r) * t);
    path += `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return `${path}Z`;
}
function gcd(a: number, b: number): number {
  return b ? gcd(b, a % b) : a;
}
const ROSETTES = [rosette(96, 36, 56), rosette(96, 60, 70), rosette(100, 28, 40)];

function Guilloche({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="-130 -130 260 260" className={className}>
      {ROSETTES.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="currentColor" strokeWidth={0.5} />
      ))}
    </svg>
  );
}

/**
 * Zona de rascar. El contenido está siempre en la página (lo lee un lector de pantalla); encima
 * va un lienzo dorado que se borra con el dedo. Al quitar cerca de la mitad, se retira solo.
 */
function ScratchPanel({ children }: { children: ReactNode }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const last = useRef<{ x: number; y: number } | null>(null);
  const strokes = useRef(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;
    const box = el.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    el.width = Math.round(box.width * dpr);
    el.height = Math.round(box.height * dpr);
    ctx.scale(dpr, dpr);
    const gold = ctx.createLinearGradient(0, 0, box.width, box.height);
    gold.addColorStop(0, "#b8923a");
    gold.addColorStop(0.35, "#ecd58d");
    gold.addColorStop(0.55, "#c9a548");
    gold.addColorStop(0.8, "#f1dea0");
    gold.addColorStop(1, "#a9812c");
    ctx.fillStyle = gold;
    ctx.fillRect(0, 0, box.width, box.height);
    // Motas: la capa de rascar nunca es lisa.
    const random = seeded(2027);
    for (let i = 0; i < 1400; i += 1) {
      ctx.fillStyle = random() > 0.5 ? "rgb(255 255 255 / 0.22)" : "rgb(90 60 10 / 0.16)";
      ctx.fillRect(random() * box.width, random() * box.height, 1.4, 1.4);
    }
    ctx.fillStyle = "rgb(70 48 8 / 0.78)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "600 15px Jost, Futura, system-ui, sans-serif";
    ctx.fillText("RASCA AQUÍ", box.width / 2, box.height / 2 - 9);
    ctx.font = "13px Jost, Futura, system-ui, sans-serif";
    ctx.fillText("con el dedo, como un décimo", box.width / 2, box.height / 2 + 13);
  }, []);

  const reveal = () => {
    if (done) return;
    setDone(true);
    haptic([10, 30, 20]);
  };

  const point = (e: PointerEvent<HTMLCanvasElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - box.left, y: e.clientY - box.top };
  };
  const scratch = (e: PointerEvent<HTMLCanvasElement>) => {
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx || !last.current) return;
    const p = point(e);
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = 38;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
    strokes.current += 1;
    if (strokes.current % 6 !== 0) return;
    // Cuánto queda por rascar: se mira un píxel de cada dieciséis.
    const data = ctx.getImageData(0, 0, el.width, el.height).data;
    let clear = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 64) {
      total += 1;
      if (data[i]! < 40) clear += 1;
    }
    if (clear / total > 0.42) reveal();
  };

  return (
    <div className="relative">
      <div className="relative overflow-hidden rounded-[10px] border border-dashed border-current/50 bg-[#fbf9ef] px-4 py-5 text-center">
        {children}
        <canvas
          ref={canvas}
          aria-hidden
          data-scratch={done ? "hecho" : "pendiente"}
          className="absolute inset-0 size-full cursor-grab touch-none transition-opacity duration-700 active:cursor-grabbing"
          style={{ opacity: done ? 0 : 1, pointerEvents: done ? "none" : "auto" }}
          onPointerDown={(e) => {
            e.stopPropagation();
            e.currentTarget.setPointerCapture(e.pointerId);
            last.current = point(e);
            scratch(e);
          }}
          onPointerMove={(e) => {
            e.stopPropagation();
            scratch(e);
          }}
          onPointerUp={(e) => {
            e.stopPropagation();
            last.current = null;
          }}
          onPointerCancel={() => {
            last.current = null;
          }}
        />
      </div>
      {done ? null : (
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={reveal}
          className="mx-auto mt-2 block text-[0.8125rem] underline underline-offset-4 opacity-80 hover:opacity-100"
          style={{ fontFamily: SANS }}
        >
          Descubrir sin rascar
        </button>
      )}
    </div>
  );
}

function PrizeCover({ event, onOpen }: ConceptProps) {
  const { dd, mm, yy } = dateParts(event.date);
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ fontFamily: FRAUNCES }}>
      <div aria-hidden className="paper-grain absolute inset-0 opacity-40" />
      <Guilloche className="absolute -top-28 -right-28 size-[23rem] text-[#1b3527] opacity-25" />
      <Guilloche className="absolute -bottom-32 -left-32 size-[25rem] text-[#8a6410] opacity-30" />
      <div className="relative mx-auto flex h-full w-full max-w-[28rem] flex-col px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex h-full flex-col rounded-[6px] border border-current/60 p-1">
          <div className="flex min-h-0 flex-1 flex-col rounded-[3px] border border-current/30 px-4 pt-4 pb-2">
            <p
              className="flex items-baseline justify-between text-[0.6875rem] tracking-[0.14em] uppercase"
              style={{ fontFamily: SANS }}
            >
              <span>Sorteo extraordinario</span>
              <span className="text-[0.9375rem] tracking-[0.1em] text-[#a3221b]">
                N.º {dd}
                {mm}
                {yy}
              </span>
            </p>
            <p className="mt-[5svh] text-center text-[1.125rem] italic">Os ha tocado una boda</p>
            <h1
              id="cover-title"
              tabIndex={-1}
              translate="no"
              className="mt-2 text-center font-names text-[clamp(2.75rem,14vw,4.5rem)] leading-[0.95] tracking-[-0.01em] outline-none"
            >
              {event.couple.first}
              {event.couple.second ? (
                <span className="block">&amp; {event.couple.second}</span>
              ) : null}
            </h1>

            <div className="mt-[4.5svh]">
              <ScratchPanel>
                <p className="text-[0.8125rem] opacity-75" style={{ fontFamily: SANS }}>
                  El premio se entrega el
                </p>
                <p className="mt-1 text-[1.625rem] leading-tight font-semibold">
                  <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>
                </p>
                <p className="mt-1 text-[0.9375rem] italic">en {event.city}</p>
              </ScratchPanel>
            </div>

            <dl
              className="mt-auto grid grid-cols-3 border-y border-current/40 py-2.5 text-center"
              style={{ fontFamily: SANS }}
            >
              {[
                ["Serie", "Única"],
                ["Fracción", "1.ª"],
                ["Premio", "Una boda"],
              ].map(([label, value], i) => (
                <div key={label} className={i ? "border-l border-current/30" : undefined}>
                  <dt className="text-[0.5625rem] tracking-[0.16em] uppercase">{label}</dt>
                  <dd className="mt-0.5 text-[0.9375rem]" style={{ fontFamily: FRAUNCES }}>
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
            <p
              className="mt-2.5 text-center text-[0.75rem] leading-snug opacity-70"
              style={{ fontFamily: SANS }}
            >
              Premio único e intransferible. No caduca.
            </p>
            <div className="mt-3">
              <OpenHint onOpen={onOpen} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Telegrama: un telegrama urgente que se teclea solo, con sus STOP ─────────────── */

/** El mensaje, en el estilo de los telegramas: mayúsculas, sin artículos y un STOP tras cada frase. */
function telegramLines(event: WeddingEvent) {
  const hosts = hostsOf(event);
  const names = hostNames(hosts, " y ");
  // «María y Daniel nos casamos» → «NOS CASAMOS»; «Celebramos el bautizo de Lucía», tal cual.
  const news = announcement(hosts).replace(new RegExp(`^${names}\\s+`), "");
  const date = madrid({ day: "numeric", month: "long", year: "numeric" })
    .format(new Date(event.date))
    .replaceAll(" de ", " ");
  return [news, date, event.city, "No faltes"].map((line) => line.toLocaleUpperCase("es-ES"));
}

function TelegramCover({ event, guestName, onOpen, reduce }: ConceptProps) {
  const lines = telegramLines(event);
  const total = lines.reduce((sum, line) => sum + line.length, 0);
  // Cuántas letras lleva tecleadas la máquina (con movimiento reducido, todas desde el principio;
  // se decide al hidratar, porque el servidor no sabe si se pide movimiento reducido).
  const [keyed, setTyped] = useState(0);
  const typed = useReducedMotionForMarkup() ? total : keyed;
  const [torn, setTorn] = useState(false);
  const done = typed >= total;
  const { dd, mm, yy } = dateParts(event.date);
  const time = madrid({ hour: "2-digit", minute: "2-digit" }).format(new Date(event.date));
  const words = lines.join(" ").split(/\s+/).length + lines.length;

  useEffect(() => {
    if (done) return;
    // Arranca tras una pausa y teclea a ritmo de mecanógrafo, con una letra algo más lenta a ratos.
    const wait = typed === 0 ? 900 : typed % 7 === 0 ? 110 : 55;
    const timer = window.setTimeout(() => {
      setTyped((n) => n + 1);
      playKey();
    }, wait);
    return () => window.clearTimeout(timer);
  }, [typed, done]);

  const tear = () => {
    if (torn) return;
    setTyped(total);
    setTorn(true);
    haptic([8, 40, 14]);
    playPaper(0.4);
    // Las tiras se desprenden y, al caer, la portada se abre.
    window.setTimeout(onOpen, reduce ? 0 : 460);
  };

  // Dónde empieza cada tira dentro del mensaje.
  const starts = lines.map((_, i) => lines.slice(0, i).reduce((sum, l) => sum + l.length, 0));
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ fontFamily: SANS }}
      // Tocar el telegrama termina de teclearlo de golpe (el gesto de abrir sigue funcionando).
      onPointerDown={() => setTyped(total)}
    >
      <div aria-hidden className="paper-grain absolute inset-0 opacity-50" />
      <div className="relative mx-auto flex h-full w-full max-w-[28rem] flex-col px-5 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {/* Cabecera del impreso. */}
        <div className="flex items-end justify-between gap-3 border-b-2 border-current pb-2">
          <div>
            <p className="text-[0.6875rem] tracking-[0.16em] uppercase">Servicio de telégrafos</p>
            <p
              className="mt-1 text-[clamp(2rem,10.5vw,2.75rem)] leading-none font-bold tracking-[0.08em]"
              style={{ fontFamily: COURIER }}
            >
              TELEGRAMA
            </p>
          </div>
          <span
            className="mb-1 -rotate-6 rounded-[3px] border-2 border-[#a3221b] px-2.5 py-1 text-[0.8125rem] font-semibold tracking-[0.16em] text-[#a3221b] uppercase"
            style={{ fontFamily: COURIER }}
          >
            Urgente
          </span>
        </div>
        <dl className="grid grid-cols-4 border-b border-current text-center">
          {[
            ["N.º", `${dd}${mm}${yy}`],
            ["Palabras", String(words)],
            ["Día", <time key="d" dateTime={isoDay(event.date)}>{`${dd}/${mm}/${yy}`}</time>],
            ["Hora", time],
          ].map(([label, value], i) => (
            <div key={i} className={`py-1.5 ${i ? "border-l border-current" : ""}`}>
              <dt className="text-[0.5625rem] tracking-[0.14em] uppercase">{label}</dt>
              <dd className="text-[0.875rem] font-bold" style={{ fontFamily: COURIER }}>
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-4 text-[0.5625rem] tracking-[0.14em] uppercase">Remitente</p>
        <h1
          id="cover-title"
          tabIndex={-1}
          translate="no"
          className="mt-0.5 font-names text-[clamp(2.25rem,11vw,3.25rem)] leading-[1] outline-none"
        >
          {event.couple.first}
          {event.couple.second ? ` y ${event.couple.second}` : ""}
        </h1>
        <dl className="mt-3 grid grid-cols-2 gap-x-4 border-y border-current py-2">
          <div className="min-w-0">
            <dt className="text-[0.5625rem] tracking-[0.14em] uppercase">Destinatario</dt>
            <dd className="truncate text-[0.9375rem] font-bold" style={{ fontFamily: COURIER }}>
              {guestName ?? "Vosotros"}
            </dd>
          </div>
          <div className="min-w-0 border-l border-current pl-4">
            <dt className="text-[0.5625rem] tracking-[0.14em] uppercase">Origen</dt>
            <dd className="truncate text-[0.9375rem] font-bold" style={{ fontFamily: COURIER }}>
              {event.city}
            </dd>
          </div>
        </dl>

        {/* El mensaje completo, para quien no lo ve teclearse. */}
        <p className="sr-only">{lines.map((line) => `${line}. Stop.`).join(" ")}</p>
        {/* Las tiras de papel pegadas, cada una algo torcida; el texto llega letra a letra. */}
        <p className="mt-4 text-[0.5625rem] tracking-[0.14em] uppercase">Texto</p>
        <div
          aria-hidden
          className="telegram-lines mt-1 flex min-h-0 flex-1 flex-col items-start gap-[0.6875rem] overflow-hidden pt-[0.5rem]"
        >
          {lines.map((line, i) => {
            const before = starts[i]!;
            const shown = Math.max(0, Math.min(line.length, typed - before));
            const complete = shown === line.length;
            const typing = !done && typed >= before && !complete;
            if (!shown && !typing) return null;
            return (
              <m.p
                key={i}
                className="max-w-full bg-[#fbf6e6] px-3 py-[0.4375rem] text-[clamp(1.25rem,6vw,1.625rem)] leading-[1.75rem] font-bold break-words shadow-[0_3px_8px_-3px_rgb(31_47_77/0.45)]"
                style={{ fontFamily: COURIER, rotate: `${[-1.2, 0.8, -0.6, 1][i % 4]}deg` }}
                animate={
                  torn && !reduce
                    ? { y: 70 + i * 14, x: i % 2 ? 16 : -12, rotate: i % 2 ? 9 : -8, opacity: 0 }
                    : undefined
                }
                transition={{ duration: 0.45, delay: i * 0.04, ease: [0.5, 0, 0.9, 0.4] }}
              >
                {line.slice(0, shown)}
                {complete ? <span className="text-[#a3221b]"> STOP</span> : null}
                {typing ? <span className="type-caret">▮</span> : null}
              </m.p>
            );
          })}
        </div>

        {/* El pie del impreso: la firma del remitente y el sello de la oficina. */}
        <div className="short-hide mt-3 flex items-end justify-between gap-4 border-t border-current pt-3">
          <div className="min-w-0">
            <p className="text-[0.5625rem] tracking-[0.14em] uppercase">Firma del expedidor</p>
            <p
              translate="no"
              className="mt-1 truncate text-[1.75rem] leading-none"
              style={{ fontFamily: SCRIPT }}
            >
              {hostNames(hostsOf(event), " y ")}
            </p>
            <p className="mt-2 text-[0.8125rem] italic">Tasa: una sonrisa por palabra.</p>
          </div>
          <span
            aria-hidden
            className="grid size-[5.25rem] shrink-0 -rotate-12 place-items-center rounded-full border-2 border-[#a3221b] text-center text-[0.625rem] leading-tight font-bold text-[#a3221b] outline outline-1 -outline-offset-[7px] outline-[#a3221b]"
            style={{ fontFamily: COURIER }}
          >
            TELÉGRAFOS
            <br />
            {dd}·{mm}·{yy}
            <br />
            {event.city.split(/\s+/)[0]!.toLocaleUpperCase("es-ES")}
          </span>
        </div>
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={tear}
          className="mt-2 flex w-full items-center justify-between gap-3 border-t-2 border-dashed border-current pt-2.5 pb-1 text-left"
        >
          <span>
            <span className="block text-[0.9375rem] font-medium">Arrancar la tira</span>
            <span className="block text-[0.75rem]">Desliza o toca para abrir</span>
          </span>
          <ChevronDown aria-hidden className="nudge size-5 shrink-0" />
        </button>
      </div>
    </div>
  );
}

/* ───────────────── Postal: la foto por delante; detrás, mensaje, sello y matasellos ───────────────── */

function PostcardCover({ event, guestName, onOpen, reduce }: ConceptProps) {
  const photo = event.coverPhoto ?? event.story.couplePhoto;
  const [side, setSide] = useState<"anverso" | "reverso">("anverso");
  const [card, animate] = useAnimate<HTMLDivElement>();
  const turning = useRef(false);
  const { dd, mm, yy } = dateParts(event.date);
  const year = madrid({ year: "numeric" }).format(new Date(event.date));
  const initials = `${event.couple.first[0] ?? ""}${event.couple.second ? ` & ${event.couple.second[0]}` : ""}`;

  const flip = async () => {
    if (turning.current) return;
    const next = side === "anverso" ? "reverso" : "anverso";
    haptic(10);
    playPaper(0.3);
    if (reduce) {
      setSide(next);
      return;
    }
    turning.current = true;
    // Gira hasta ponerse de canto, cambia de cara y termina el giro (sin caras traseras en 3D).
    await animate(
      card.current,
      { rotateY: 90, transformPerspective: 1200 },
      { duration: 0.24, ease: [0.5, 0, 1, 0.6] },
    );
    setSide(next);
    await animate(card.current, { rotateY: [-90, 0] }, { duration: 0.34, ease: [0, 0.5, 0.3, 1] });
    turning.current = false;
  };

  const face = (shown: boolean) =>
    `col-start-1 row-start-1 transition-none ${shown ? "" : "pointer-events-none opacity-0"}`;

  return (
    <div
      className="absolute inset-0 overflow-hidden bg-[linear-gradient(180deg,#f3e3cd_0%,#efe5d0_55%,#e7dcc4_100%)]"
      style={{ fontFamily: SANS }}
    >
      <div aria-hidden className="paper-grain absolute inset-0 opacity-40" />
      <div className="relative flex h-full flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <p className="text-[0.75rem] tracking-[0.16em] uppercase">Ha llegado una postal</p>
        <m.div
          className="relative mt-4 flex min-h-0 w-full max-w-[21rem] flex-1 flex-col justify-center"
          initial={reduce ? false : { y: 36, opacity: 0, rotate: 0 }}
          animate={{ y: 0, opacity: 1, rotate: -2 }}
          transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Otra postal debajo, de otro viaje: la pila de recuerdos. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-[4%] top-[50%] aspect-[5/7] translate-x-4 -translate-y-1/2 rotate-[7deg] bg-[#fbf7ec] p-2.5 shadow-[0_18px_30px_-16px_rgb(30_58_110/0.45)]"
          >
            <div className="size-full bg-[linear-gradient(180deg,#e6bd9c,#cfdcea)] opacity-80" />
          </div>
          <div
            ref={card}
            data-side={side}
            className="grid aspect-[5/7] max-h-full w-full shadow-[0_28px_56px_-18px_rgb(30_58_110/0.5)]"
          >
            {/* Anverso: la foto con «Recuerdo de…» y los nombres. */}
            <div
              className={`${face(side === "anverso")} relative overflow-hidden bg-[#fbf7ec] p-2.5`}
            >
              <div className="relative size-full overflow-hidden bg-[linear-gradient(180deg,#f2b98f_0%,#f6d7a8_45%,#7fb0b8_100%)]">
                {photo ? (
                  <Image
                    src={photo}
                    alt=""
                    fill
                    priority
                    sizes="(min-width: 400px) 320px, 80vw"
                    className="object-cover object-[50%_30%]"
                  />
                ) : (
                  <span
                    aria-hidden
                    className="absolute top-[18%] left-1/2 size-28 -translate-x-1/2 rounded-full bg-[#fbe9c2]"
                  />
                )}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[linear-gradient(180deg,rgb(0_0_0/0.38)_0%,rgb(0_0_0/0)_34%,rgb(0_0_0/0)_56%,rgb(0_0_0/0.72)_100%)]"
                />
                <div className="absolute inset-x-4 top-4 text-white [text-shadow:0_2px_14px_rgb(0_0_0/0.55)]">
                  <p className="text-[1.75rem] leading-none" style={{ fontFamily: SCRIPT }}>
                    Recuerdo de
                  </p>
                  <p className="mt-1 text-[clamp(1.5rem,8vw,2.25rem)] leading-[0.95] font-extrabold tracking-[0.04em] text-balance uppercase">
                    {event.city}
                  </p>
                </div>
                <h1
                  id="cover-title"
                  tabIndex={-1}
                  translate="no"
                  className="absolute inset-x-4 bottom-4 font-names text-[clamp(2.25rem,11vw,3rem)] leading-[0.95] text-white outline-none [text-shadow:0_2px_18px_rgb(0_0_0/0.6)]"
                >
                  {event.couple.first}
                  {event.couple.second ? (
                    <span className="block">&amp; {event.couple.second}</span>
                  ) : null}
                </h1>
              </div>
            </div>

            {/* Reverso: matasellos y sello, la dirección y el mensaje a mano. */}
            <div
              className={`${face(side === "reverso")} flex flex-col overflow-hidden bg-[#fbf7ec] px-5 pt-4 pb-4 text-[#1e3a6e]`}
            >
              <div className="flex items-start justify-between">
                <div aria-hidden className="relative mt-1 text-[#b3312a]">
                  <span className="grid size-[4.75rem] -rotate-12 place-items-center rounded-full border-2 border-current text-center text-[0.6875rem] leading-tight font-semibold tracking-[0.04em] outline outline-1 -outline-offset-[7px] outline-current">
                    {dd}·{mm}·{yy}
                  </span>
                  <span className="absolute top-5 left-[4.5rem] h-9 w-16 bg-[repeating-linear-gradient(180deg,currentColor_0_1.5px,transparent_1.5px_7px)] opacity-80" />
                </div>
                {/* El sello, con su dentado. */}
                <div aria-hidden className="stamp-teeth bg-[#2f6b57] p-[5px]">
                  <div className="flex h-[4.5rem] w-[3.5rem] flex-col items-center justify-between border border-[#fbf7ec]/70 py-1.5 text-[#fbf7ec]">
                    <span className="text-[0.5rem] tracking-[0.14em] uppercase">Correos</span>
                    <span className="text-[1.5rem] leading-none" style={{ fontFamily: SCRIPT }}>
                      {initials}
                    </span>
                    <span className="text-[0.5625rem] tabular-nums">{year}</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 border-b border-current/50 pb-1">
                <p className="text-[0.5625rem] tracking-[0.14em] uppercase">Para</p>
                <p
                  className="truncate text-[1.625rem] leading-tight"
                  style={{ fontFamily: SCRIPT }}
                >
                  {guestName ?? "Vosotros"}
                </p>
              </div>
              <p
                className="mt-3 line-clamp-6 min-h-0 flex-1 text-[1.3125rem] leading-[1.45]"
                style={{ fontFamily: SCRIPT }}
              >
                {event.cardMessage}
              </p>
              <p
                className="mt-2 text-right text-[1.375rem] leading-tight"
                style={{ fontFamily: SCRIPT }}
              >
                {hostNames(hostsOf(event), " y ")}
              </p>
              <p className="mt-2 border-t border-current/50 pt-1.5 text-[0.75rem]">
                <time dateTime={isoDay(event.date)}>{formatLongDate(event.date)}</time>, en{" "}
                {event.city}
              </p>
            </div>
          </div>
        </m.div>

        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={flip}
          className="mt-4 flex items-center gap-2 rounded-full border border-current/50 bg-[#fbf7ec] px-5 py-2.5 text-[0.9375rem] font-medium"
        >
          <RefreshCw aria-hidden className="size-4" />
          Girar la postal
        </button>
        <p className="mt-2 text-center text-[0.8125rem] italic">Franqueo pagado en ilusión.</p>
        <div className="mt-1">
          <OpenHint onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}

const COVERS = {
  gaceta: GazetteCover,
  embarque: BoardingCover,
  premio: PrizeCover,
  telegrama: TelegramCover,
  postal: PostcardCover,
  ...MORE_COVERS,
} satisfies Record<ConceptCoverId, (props: ConceptProps) => ReactNode>;

export function ConceptCover({ scene, ...props }: ConceptProps & { scene: ConceptCoverId }) {
  const Cover = COVERS[scene];
  return <Cover {...props} />;
}
