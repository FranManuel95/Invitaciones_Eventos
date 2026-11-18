"use client";

import { clsx } from "clsx";
import Link from "next/link";
import { hasNewSince, replyLabel, repliesSummary, type NewReply } from "@/lib/guests/news";
import { markNewsSeen, useNewsSince, type VisitClock } from "./last-visit";

const when = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Madrid",
});

const SHOWN = 6;

/**
 * «Desde vuestra última visita»: quién ha respondido desde la última vez que entrasteis en el
 * panel. Si no hay nada nuevo (o el navegador no guarda la visita), no se muestra.
 */
export function SinceLastVisit({
  event,
  replies,
  clock,
  invitationsHref,
  className,
}: {
  event: string;
  /** Todas las respuestas, de la más reciente a la más antigua. */
  replies: NewReply[];
  clock?: VisitClock;
  invitationsHref: string;
  className?: string;
}) {
  const since = useNewsSince(event, clock);
  if (!since) return null;
  const fresh = replies.filter((r) => Date.parse(r.at) > Date.parse(since));
  if (!fresh.length) return null;
  const rest = fresh.length - SHOWN;

  return (
    <section
      aria-labelledby="novedades"
      className={clsx(
        "rounded-2xl border border-line bg-paper px-5 py-6 shadow-[var(--shadow-paper)] sm:px-7",
        className,
      )}
    >
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <h2 id="novedades" className="panel-title text-[1.875rem] leading-none text-ink">
          Desde vuestra última visita
        </h2>
        <p className="text-[0.875rem] text-muted">{repliesSummary(fresh)}</p>
      </div>
      <ul className="mt-4 divide-y divide-line border-y border-line">
        {fresh.slice(0, SHOWN).map((r) => (
          <li
            key={r.groupId + r.at}
            className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-3 py-3 sm:grid-cols-[auto_minmax(0,1fr)_auto]"
          >
            <span
              aria-hidden
              className={clsx(
                "size-2 translate-y-[-0.1em] rounded-full",
                r.status === "attending" ? "bg-gold" : "bg-wax",
              )}
            />
            <p className="min-w-0">
              <span className="font-display text-[1.1875rem] leading-snug text-ink">{r.name}</span>
              <span className="block text-[0.875rem] text-ink-soft sm:ml-2 sm:inline">
                {replyLabel(r)}
              </span>
            </p>
            <p className="col-start-2 text-[0.8125rem] text-muted tabular-nums sm:col-start-auto sm:text-right">
              <time dateTime={r.at}>{when.format(new Date(r.at))}</time>
            </p>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <Link
          href={invitationsHref}
          className="inline-flex min-h-11 items-center text-[0.9375rem] text-ink underline decoration-gold underline-offset-4 hover:decoration-ink"
        >
          {rest > 0
            ? `Ver ${rest === 1 ? "la otra" : `las otras ${rest}`} en Invitaciones`
            : "Ver todas las invitaciones"}
        </Link>
        <button
          type="button"
          onClick={() => markNewsSeen(event, clock)}
          className="inline-flex h-11 items-center rounded-full border border-line px-5 text-[0.9375rem] text-ink transition-colors hover:border-ink"
        >
          Marcar como visto
        </button>
      </div>
    </section>
  );
}

/** El punto de «hay respuestas nuevas» en la navegación. */
export function NewsDot({
  event,
  latest,
  clock,
  className,
}: {
  event: string;
  latest: string | null;
  clock?: VisitClock;
  className?: string;
}) {
  const since = useNewsSince(event, clock);
  if (!hasNewSince(latest, since)) return null;
  return (
    <>
      <span
        aria-hidden
        data-testid="punto-novedades"
        className={clsx("size-2 rounded-full bg-gold ring-2 ring-[#3a2a22]", className)}
      />
      <span className="sr-only"> (respuestas nuevas)</span>
    </>
  );
}
