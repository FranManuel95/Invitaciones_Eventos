"use client";

import { clsx } from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { monthGrid, weekdayInitials } from "@/lib/calendar";
import { byDay, shiftMonth, type AgendaEntry, type AgendaKind } from "@/lib/planning/agenda";

const KIND: Record<AgendaKind, { label: string; dot: string }> = {
  wedding: { label: "Boda", dot: "bg-wax" },
  deadline: { label: "Plazo", dot: "bg-warning" },
  task: { label: "Tarea", dot: "bg-ink" },
  payment: { label: "Pago", dot: "bg-gold" },
};

const monthFmt = new Intl.DateTimeFormat("es-ES", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});
const dayFmt = new Intl.DateTimeFormat("es-ES", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});
const asDate = (iso: string) => new Date(`${iso}T12:00:00Z`);

/** Calendario mensual con todo lo que tiene fecha, y la lista de los próximos 30 días. */
export function AgendaCalendar({
  entries,
  base,
  today,
}: {
  entries: AgendaEntry[];
  /** Raíz del evento en el panel (/panel/demo o /panel/<id>). */
  base: string;
  /** AAAA-MM-DD */
  today: string;
}) {
  const [month, setMonth] = useState(today.slice(0, 7));
  const days = byDay(entries);
  const weeks = monthGrid(`${month}-01`);
  const initials = weekdayInitials();
  const limit = asDate(today);
  limit.setUTCDate(limit.getUTCDate() + 30);
  const soon = entries.filter(
    (e) => e.date >= today && e.date <= limit.toISOString().slice(0, 10) && !e.done,
  );

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
      <section aria-labelledby="mes" className="rounded-md border border-line bg-paper p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setMonth(shiftMonth(month, -1))}
            aria-label="Mes anterior"
            className="grid size-9 place-items-center rounded-md text-ink-soft hover:bg-ink/5 hover:text-ink"
          >
            <ChevronLeft aria-hidden className="size-5" />
          </button>
          <h2
            id="mes"
            aria-live="polite"
            className="font-display text-[1.5rem] text-ink first-letter:uppercase"
          >
            {monthFmt.format(asDate(`${month}-15`))}
          </h2>
          <button
            type="button"
            onClick={() => setMonth(shiftMonth(month, 1))}
            aria-label="Mes siguiente"
            className="grid size-9 place-items-center rounded-md text-ink-soft hover:bg-ink/5 hover:text-ink"
          >
            <ChevronRight aria-hidden className="size-5" />
          </button>
        </div>
        <table className="mt-4 w-full table-fixed border-collapse">
          <caption className="sr-only">Agenda del mes</caption>
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
                  const list = cell.iso ? (days.get(cell.iso) ?? []) : [];
                  return (
                    <td
                      key={i}
                      className={clsx(
                        "h-20 border border-line/70 p-1 align-top sm:h-24",
                        cell.iso === today && "bg-cream/60",
                      )}
                    >
                      {cell.day ? (
                        <>
                          <span
                            className={clsx(
                              "text-[0.75rem] tabular-nums",
                              cell.iso === today ? "font-semibold text-ink" : "text-muted",
                            )}
                          >
                            {cell.day}
                          </span>
                          <ul className="mt-0.5 space-y-0.5">
                            {list.slice(0, 3).map((e, k) => (
                              <li
                                key={k}
                                className="flex items-start gap-1 text-[0.6875rem] leading-tight"
                              >
                                <span
                                  aria-hidden
                                  className={clsx(
                                    "mt-1 size-1.5 shrink-0 rounded-full",
                                    KIND[e.kind].dot,
                                  )}
                                />
                                <span
                                  className={clsx(
                                    "line-clamp-2",
                                    e.done ? "text-muted line-through" : "text-ink",
                                  )}
                                >
                                  <span className="sr-only">{KIND[e.kind].label}: </span>
                                  {e.label}
                                </span>
                              </li>
                            ))}
                            {list.length > 3 ? (
                              <li className="text-[0.6875rem] text-muted">
                                y {list.length - 3} más
                              </li>
                            ) : null}
                          </ul>
                        </>
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <ul
          className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[0.8125rem] text-muted"
          aria-label="Leyenda"
        >
          {Object.values(KIND).map((k) => (
            <li key={k.label} className="flex items-center gap-1.5">
              <span aria-hidden className={clsx("size-2 rounded-full", k.dot)} />
              {k.label}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="proximos">
        <h2 id="proximos" className="font-display text-[1.5rem] text-ink">
          Próximos 30 días
        </h2>
        <ul className="mt-4 divide-y divide-line">
          {soon.map((e, i) => (
            <li key={i} className="py-2.5">
              <Link href={`${base}${e.path}`} className="group block">
                <span className="block text-[0.8125rem] text-muted first-letter:uppercase">
                  {dayFmt.format(asDate(e.date))} · {KIND[e.kind].label}
                </span>
                <span className="block text-[0.9375rem] text-ink group-hover:underline">
                  {e.label}
                </span>
              </Link>
            </li>
          ))}
          {soon.length === 0 ? (
            <li className="py-3 text-[0.9375rem] text-muted">Nada en los próximos 30 días.</li>
          ) : null}
        </ul>
      </section>
    </div>
  );
}
