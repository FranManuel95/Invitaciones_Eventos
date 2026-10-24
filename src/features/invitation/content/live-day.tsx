"use client";

import { MapPin, Phone } from "lucide-react";
import type { DayClock } from "@/lib/day-mode";
import { formatIn, liveProgram, nextReturns } from "@/lib/day-mode";
import type { WeddingEvent } from "@/lib/domain/types";

const minutesToTime = (m: number) =>
  `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

/**
 * Modo «día de la boda»: lo que pasa ahora, lo siguiente, el próximo autobús de vuelta
 * y accesos directos. Sustituye a la información de «antes de la boda» en lo alto de la página.
 */
export function LiveDay({ event, clock }: { event: WeddingEvent; clock: DayClock }) {
  const { current, next, minutesToNext } = liveProgram(event.program, clock.minutes);
  const returns = nextReturns(event, clock.minutes).slice(0, 2);
  const finca = event.venues.find((v) => v.id === "finca") ?? event.venues.at(-1);

  return (
    <section aria-labelledby="en-directo" className="border-b border-line bg-ink text-paper">
      <div className="mx-auto max-w-5xl px-6 py-8 sm:px-10">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="en-directo" className="font-display text-[2rem] leading-tight">
            Hoy es el día
          </h2>
          <p className="text-[0.875rem] text-paper/70">
            {clock.simulated ? "Demo: " : ""}son las {minutesToTime(clock.minutes)}
          </p>
        </div>
        <dl className="mt-6 grid gap-6 sm:grid-cols-3">
          <div>
            <dt className="text-[0.8125rem] text-paper/70">Ahora</dt>
            <dd className="mt-1 font-display text-[1.5rem] leading-tight">
              {current ? current.title : "Aún no ha empezado"}
            </dd>
            {current ? <dd className="text-[0.9375rem] text-paper/80">{current.place}</dd> : null}
          </div>
          <div>
            <dt className="text-[0.8125rem] text-paper/70">Después</dt>
            <dd className="mt-1 font-display text-[1.5rem] leading-tight">
              {next ? `${next.title}, a las ${next.time}` : "Fin de fiesta"}
            </dd>
            {next && minutesToNext !== null ? (
              <dd className="text-[0.9375rem] text-paper/80">{formatIn(minutesToNext)}</dd>
            ) : null}
          </div>
          <div>
            <dt className="text-[0.8125rem] text-paper/70">Autobuses de vuelta</dt>
            <dd className="mt-1 font-display text-[1.5rem] leading-tight">
              {returns[0] ? `A las ${returns[0].time}` : "No quedan salidas"}
            </dd>
            {returns[0] ? (
              <dd className="text-[0.9375rem] text-paper/80">
                {returns.map((r) => `${r.route.split(" →")[0]} ${r.time}`).join(", ")}
              </dd>
            ) : null}
          </div>
        </dl>
        <div className="mt-7 flex flex-wrap gap-3">
          {finca ? (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(finca.mapsQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-md bg-paper px-4 text-[0.875rem] font-medium text-ink transition-colors hover:bg-cream"
            >
              <MapPin aria-hidden className="size-4" /> Cómo llegar a {finca.name}
              <span className="sr-only">(se abre en una pestaña nueva)</span>
            </a>
          ) : null}
          <a
            href={`tel:${event.contactPhone.replaceAll(" ", "")}`}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-paper/40 px-4 text-[0.875rem] text-paper transition-colors hover:bg-paper/10"
          >
            <Phone aria-hidden className="size-4" /> Llamar a la organización
          </a>
        </div>
      </div>
    </section>
  );
}
