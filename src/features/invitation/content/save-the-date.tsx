"use client";

import { CalendarPlus } from "lucide-react";
import { m, useInView, useReducedMotion } from "motion/react";
import { useRef, useState, type MouseEvent } from "react";
import { buttonClasses } from "@/components/ui/button";
import {
  buildIcs,
  googleCalendarUrl,
  monthGrid,
  pagesUntil,
  weekdayInitials,
  type MonthPage,
} from "@/lib/calendar";
import type { WeddingEvent } from "@/lib/domain/types";
import { formatWeekdayDate, isoDay } from "@/lib/format";
import { FlipCountdown } from "./countdown";
import { Section } from "./sections";

const monthName = (iso: string) =>
  new Intl.DateTimeFormat("es-ES", { month: "long", timeZone: "Europe/Madrid" }).format(
    new Date(iso),
  );

const pageName = ({ year, month }: MonthPage) =>
  new Intl.DateTimeFormat("es-ES", { month: "long", timeZone: "UTC" }).format(
    new Date(Date.UTC(year, month - 1, 15)),
  );

/** Cada hoja tarda algo menos que la anterior: el taco «se acelera» hasta llegar a mayo. */
function pageDelays(count: number) {
  const delays: number[] = [];
  let t = 0.35;
  for (let i = 0; i < count; i++) {
    delays.push(t);
    t += Math.max(0.16, 0.48 * 0.82 ** i);
  }
  return { delays, end: t + 0.35 };
}

/**
 * «Guarda la fecha»: un taco de calendario. Al llegar, las hojas de los meses que faltan caen
 * una tras otra hasta descubrir el mes de la boda, y entonces se rodea el día a mano.
 */
export function SaveTheDate({ event }: { event: WeddingEvent }) {
  const day = isoDay(event.date);
  const weeks = monthGrid(day);
  const initials = weekdayInitials();
  const ceremony = event.program[0];
  const icsHref = `data:text/calendar;charset=utf-8,${encodeURIComponent(buildIcs(event))}`;
  const reduce = useReducedMotion();
  const pad = useRef<HTMLElement>(null);
  const inView = useInView(pad, { once: true, amount: 0.55 });
  const [pages] = useState(() => (reduce ? [] : pagesUntil(new Date().toISOString(), day)));
  const { delays, end } = pageDelays(pages.length);
  const dayRef = useRef<HTMLSpanElement>(null);
  const [flight, setFlight] = useState<{ x: number; y: number; dx: number; dy: number } | null>(
    null,
  );

  // Al añadir al calendario, el 22 «vuela» desde el taco hasta el botón pulsado.
  const fly = (e: MouseEvent<HTMLAnchorElement>) => {
    const from = dayRef.current?.getBoundingClientRect();
    if (reduce || !from) return;
    const to = e.currentTarget.getBoundingClientRect();
    setFlight({
      x: from.left + from.width / 2,
      y: from.top + from.height / 2,
      dx: to.left + to.width / 2 - (from.left + from.width / 2),
      dy: to.top + to.height / 2 - (from.top + from.height / 2),
    });
  };

  return (
    <Section id="fecha" title="Guarda la fecha" aside={formatWeekdayDate(event.date)}>
      <div className="grid gap-10 sm:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] sm:items-center">
        <figure
          ref={pad}
          className="paper-grain relative rounded-[2px] border border-line bg-paper px-5 pt-8 pb-6 shadow-[var(--shadow-paper)] [perspective:1100px]"
        >
          {/* Encuadernación del taco: una tira con los agujeros de la espiral. */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 z-40 flex h-4 items-center justify-around rounded-t-[2px] bg-ink/85 px-6"
          >
            {Array.from({ length: 9 }, (_, i) => (
              <span key={i} className="size-1.5 rounded-full bg-ivory/90" />
            ))}
          </div>
          {pages.map((page, i) => (
            <m.div
              key={`${page.year}-${page.month}`}
              aria-hidden
              className="paper-grain absolute inset-x-0 top-4 bottom-0 grid place-items-center bg-paper shadow-[0_1px_0_var(--color-line),0_10px_18px_-12px_rgb(0_0_0/0.25)]"
              style={{ zIndex: 30 - i, transformOrigin: "50% 0%" }}
              initial={{ rotateX: 0, y: 0, rotateZ: 0, opacity: 1 }}
              animate={
                inView
                  ? { rotateX: -110, y: -12, rotateZ: i % 2 ? 3 : -4, opacity: [1, 1, 0] }
                  : undefined
              }
              // La hoja se levanta entera por encima de la espiral y solo se desvanece al final.
              transition={{
                duration: 0.62,
                delay: delays[i],
                ease: [0.5, 0, 0.6, 1],
                opacity: { duration: 0.62, delay: delays[i], times: [0, 0.7, 1] },
              }}
            >
              <span className="text-center">
                <span className="block font-display text-[2.75rem] leading-none text-ink italic first-letter:uppercase">
                  {pageName(page)}
                </span>
                <span className="mt-2 block font-display text-xl text-ink-soft">{page.year}</span>
              </span>
            </m.div>
          ))}
          <figcaption className="flex items-baseline justify-between border-b border-ink/20 pb-3">
            <span className="font-display text-[2.25rem] leading-none text-ink italic first-letter:uppercase">
              {monthName(event.date)}
            </span>
            <span className="font-display text-xl text-ink-soft">{day.slice(0, 4)}</span>
          </figcaption>
          <table className="mt-3 w-full table-fixed text-center">
            <caption className="sr-only">
              Calendario de {monthName(event.date)} con el día de la boda marcado
            </caption>
            <thead>
              <tr>
                {initials.map((d, i) => (
                  <th
                    key={i}
                    scope="col"
                    className="pb-2 text-[0.75rem] font-medium text-muted uppercase"
                  >
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeks.map((week, w) => (
                <tr key={w}>
                  {week.map((cell, i) => {
                    const isDay = cell.iso === day;
                    return (
                      <td key={i} className="relative h-10 text-[0.9375rem] tabular-nums">
                        {cell.day ? (
                          <span
                            ref={isDay ? dayRef : undefined}
                            className={
                              isDay
                                ? "relative z-10 font-display text-xl text-wax"
                                : i >= 5
                                  ? "text-ink-soft"
                                  : "text-ink"
                            }
                          >
                            {cell.day}
                            {isDay ? <span className="sr-only"> (día de la boda)</span> : null}
                          </span>
                        ) : null}
                        {isDay ? (
                          <svg
                            aria-hidden
                            viewBox="0 0 60 44"
                            className="pointer-events-none absolute top-1/2 left-1/2 h-12 w-16 -translate-x-1/2 -translate-y-1/2 overflow-visible"
                          >
                            {/* Trazo a mano alzada: no cierra del todo y se pasa un poco. */}
                            <m.path
                              d="M38 6C22 2 6 9 5 22C4 34 18 41 32 39C47 37 57 28 55 17C53 8 42 4 30 6"
                              fill="none"
                              stroke="var(--color-wax)"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              initial={{ pathLength: 0, opacity: 0 }}
                              animate={inView ? { pathLength: 1, opacity: 1 } : undefined}
                              transition={{
                                duration: 1.1,
                                ease: [0.45, 0.05, 0.2, 1],
                                delay: pages.length ? end : 0.3,
                              }}
                            />
                          </svg>
                        ) : null}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </figure>

        <div>
          <p className="font-display text-[1.75rem] leading-snug text-ink">
            {ceremony ? `A las ${ceremony.time}, en ${ceremony.place}.` : null}
          </p>
          <p className="mt-2 max-w-prose text-[0.9375rem] leading-relaxed text-muted">
            Guárdalo ya en tu calendario. Podrás confirmar asistencia más abajo cuando quieras.
          </p>
          <FlipCountdown date={event.date} className="mt-6" />
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={googleCalendarUrl(event)}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses("secondary", "md")}
              onClick={fly}
            >
              <CalendarPlus aria-hidden className="size-4" />
              Google Calendar
              <span className="sr-only">(se abre en una pestaña nueva)</span>
            </a>
            <a
              href={icsHref}
              download="boda.ics"
              className={buttonClasses("secondary", "md")}
              onClick={fly}
            >
              <CalendarPlus aria-hidden className="size-4" />
              Apple u Outlook (.ics)
            </a>
          </div>
        </div>
      </div>
      {flight ? (
        <m.span
          aria-hidden
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 font-display text-2xl text-wax"
          style={{ left: flight.x, top: flight.y }}
          initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
          animate={{
            x: [0, flight.dx * 0.45, flight.dx],
            y: [0, flight.dy * 0.45 - 60, flight.dy],
            scale: [1, 1.6, 0.6],
            opacity: [1, 1, 0],
          }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          onAnimationComplete={() => setFlight(null)}
        >
          {Number(day.slice(8))}
        </m.span>
      ) : null}
    </Section>
  );
}
