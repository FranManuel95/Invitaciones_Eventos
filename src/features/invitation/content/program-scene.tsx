"use client";

import type { CSSProperties } from "react";
import type { WeddingEvent } from "@/lib/domain/types";
import { formatLongDate } from "@/lib/format";
import { useScrollProgress } from "../effects/scroll-progress";
import { haptic, playTick } from "../effects/sound";
import { ProgramIcon } from "./program-icons";

/*
 * El día, contado con el dedo: la escena se queda fija y cada acto del programa ocupa la pantalla
 * mientras se baja. El cielo pasa de la tarde a la hora dorada, al atardecer y a la noche; el sol
 * se pone tras las colinas, sale la luna y se encienden las luces de la fiesta. Al terminar,
 * amanece hacia la sección siguiente.
 *
 * Todo sale de la variable --p (0 a 1) que escribe `useScrollProgress`; los estilos están en
 * globals.css (.day-*). Con movimiento reducido o el día de la boda se usa la lista de siempre
 * (`ProgramSection`).
 */
const step = (_step: number, first: boolean) => {
  if (first) return;
  haptic(8);
  playTick();
};

export function ProgramScene({
  event,
  dawn = true,
}: {
  event: WeddingEvent;
  /** Falso si lo que sigue es otra escena oscura: de la noche se pasa a ella sin amanecer. */
  dawn?: boolean;
}) {
  const acts = event.program;
  const count = Math.max(acts.length, 2);
  // Cada acto se nota en el dedo (y se oye, si hay sonido) al llegar.
  const scene = useScrollProgress<HTMLDivElement>("pin", true, count, step);
  return (
    <section id="programa" aria-labelledby="programa-title" className="day">
      <div
        ref={scene}
        className="scroll-scene"
        style={{ "--n": count, height: `calc(${count - 1} * 85svh + 100svh)` } as CSSProperties}
      >
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <div aria-hidden className="absolute inset-0">
            <div className="day-noon absolute inset-0" />
            <div className="day-gold absolute inset-0" />
            <div className="day-dusk absolute inset-0" />
            <div className="day-night absolute inset-0" />
            <div className="day-stars absolute inset-0" />
            <div className="day-sun absolute top-[13%] left-[10%] size-24 rounded-full" />
            <div className="day-moon absolute top-[15%] right-[13%] size-14 rounded-full" />
            <svg
              viewBox="0 0 400 120"
              preserveAspectRatio="none"
              className="day-hills-far absolute inset-x-0 bottom-0 h-[30%] w-full"
            >
              <path d="M0 62 C40 40 80 44 120 58 C160 72 190 30 240 34 C290 38 320 66 360 54 C380 48 392 50 400 52 L400 120 L0 120Z" />
            </svg>
            <svg
              viewBox="0 0 400 120"
              preserveAspectRatio="none"
              className="day-hills absolute inset-x-0 bottom-0 h-[21%] w-full"
            >
              <path d="M0 70 C50 34 100 40 150 62 C200 84 250 46 300 40 C340 36 370 56 400 64 L400 120 L0 120Z" />
            </svg>
            {/* Las luces de la fiesta, al caer la noche. */}
            <div className="day-lights absolute inset-x-[8%] bottom-[15%] h-6" />
          </div>

          <div className="relative mx-auto flex h-full max-w-5xl flex-col px-6 pt-20 pb-8 sm:px-10">
            <h2
              id="programa-title"
              className="day-ink font-display text-[2.5rem] leading-[1.05] sm:text-[3rem]"
            >
              El día
            </h2>
            <p className="day-ink-soft mt-2 text-[0.9375rem]">{formatLongDate(event.date)}</p>

            <ol className="relative flex-1">
              {acts.map((item, i) => (
                <li
                  key={item.id}
                  className="day-act absolute inset-x-0 top-[44%]"
                  style={{ "--i": i } as CSSProperties}
                >
                  <span className="day-ink grid size-12 place-items-center rounded-full border border-current/40">
                    <ProgramIcon id={item.id} />
                  </span>
                  <time className="day-ink mt-5 block font-display text-[clamp(4.5rem,24vw,8rem)] leading-[0.9] tabular-nums">
                    {item.time}
                  </time>
                  <h3 className="day-ink mt-4 font-display text-[2rem] leading-tight">
                    {item.title}
                  </h3>
                  <p className="day-ink-soft caption mt-1">{item.place}</p>
                  <p className="day-ink-soft mt-3 max-w-[34ch] text-[1rem] leading-relaxed">
                    {item.description}
                  </p>
                </li>
              ))}
            </ol>

            {/* Las horas del día: se marca la del acto que se está viendo. */}
            <ul aria-hidden className="relative flex justify-between gap-2">
              {acts.map((item, i) => (
                <li
                  key={item.id}
                  className="day-hour day-ink text-[0.8125rem] tabular-nums"
                  style={{ "--i": i } as CSSProperties}
                >
                  {item.time}
                </li>
              ))}
            </ul>
            <div aria-hidden className="day-rail mt-2 h-px">
              <div className="day-rail-fill h-full origin-left" />
            </div>
          </div>
        </div>
      </div>
      {/* Amanece: de la noche al color de la sección siguiente. */}
      {dawn ? <div aria-hidden className="day-dawn h-[34svh]" /> : null}
    </section>
  );
}
