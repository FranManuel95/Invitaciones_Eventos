"use client";

import { CalendarPlus } from "lucide-react";
import { m } from "motion/react";
import { buttonClasses } from "@/components/ui/button";
import { buildIcs, googleCalendarUrl, monthGrid, weekdayInitials } from "@/lib/calendar";
import type { WeddingEvent } from "@/lib/domain/types";
import { formatWeekdayDate, isoDay } from "@/lib/format";
import { Section } from "./sections";

const monthName = (iso: string) =>
  new Intl.DateTimeFormat("es-ES", { month: "long", timeZone: "Europe/Madrid" }).format(
    new Date(iso),
  );

/**
 * «Guarda la fecha»: hoja de calendario del mes con el día rodeado a mano, como se marcaría en
 * un calendario de papel. El trazo se dibuja una sola vez al entrar en pantalla.
 */
export function SaveTheDate({ event }: { event: WeddingEvent }) {
  const day = isoDay(event.date);
  const weeks = monthGrid(day);
  const initials = weekdayInitials();
  const ceremony = event.program[0];
  const icsHref = `data:text/calendar;charset=utf-8,${encodeURIComponent(buildIcs(event))}`;

  return (
    <Section id="fecha" title="Guarda la fecha" aside={formatWeekdayDate(event.date)}>
      <div className="grid gap-10 sm:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] sm:items-center">
        <figure className="paper-grain relative rounded-[2px] border border-line bg-paper px-5 pt-5 pb-6 shadow-[var(--shadow-paper)]">
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
                              whileInView={{ pathLength: 1, opacity: 1 }}
                              viewport={{ once: true, amount: 0.6 }}
                              transition={{ duration: 1.1, ease: [0.45, 0.05, 0.2, 1], delay: 0.2 }}
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
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={googleCalendarUrl(event)}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses("secondary", "md")}
            >
              <CalendarPlus aria-hidden className="size-4" />
              Google Calendar
              <span className="sr-only">(se abre en una pestaña nueva)</span>
            </a>
            <a href={icsHref} download="boda.ics" className={buttonClasses("secondary", "md")}>
              <CalendarPlus aria-hidden className="size-4" />
              Apple u Outlook (.ics)
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}
