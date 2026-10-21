import {
  BedDouble,
  Bus,
  Church,
  Clock,
  ExternalLink,
  MapPin,
  Music,
  Plus,
  Shirt,
  UtensilsCrossed,
  Wine,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import type { ProgramIcon, WeddingEvent } from "@/lib/domain/types";
import { Divider } from "../ornaments";
import { Reveal } from "./reveal";

const PROGRAM_ICONS: Record<ProgramIcon, LucideIcon> = {
  ceremony: Church,
  cocktail: Wine,
  banquet: UtensilsCrossed,
  party: Music,
  bus: Bus,
};

export function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: ReactNode;
}) {
  return (
    <Reveal className="mx-auto max-w-xl text-center">
      <p className="eyebrow text-muted">{eyebrow}</p>
      <h2
        id={id}
        className="mt-3 font-display text-[2.5rem] leading-tight font-light text-ink sm:text-5xl"
      >
        {title}
      </h2>
      <Divider className="mx-auto mt-4 text-gold" />
      {intro ? <p className="mt-5 text-[0.9375rem] leading-relaxed text-muted">{intro}</p> : null}
    </Reveal>
  );
}

export function ProgramSection({ event }: { event: WeddingEvent }) {
  return (
    <section
      aria-labelledby="programa-title"
      id="programa"
      className="scroll-mt-20 px-6 py-20 sm:py-28"
    >
      <SectionHeading
        id="programa-title"
        eyebrow="Programa"
        title="El gran día"
        intro="Aquí tienes todos los detalles para que no te pierdas nada."
      />
      <ol className="relative mx-auto mt-14 max-w-md">
        <span aria-hidden className="absolute top-3 bottom-3 left-[1.375rem] w-px bg-ink/15" />
        {event.program.map((item, i) => {
          const Icon = PROGRAM_ICONS[item.icon];
          return (
            <li key={item.id} className="relative pb-10 pl-16 last:pb-0">
              <Reveal delay={i * 0.08}>
                <span
                  aria-hidden
                  className="absolute top-0 left-0 grid size-11 place-items-center rounded-full border border-ink/15 bg-paper text-ink shadow-[var(--shadow-paper)]"
                >
                  <Icon className="size-[1.125rem]" strokeWidth={1.5} />
                </span>
                <p className="flex items-baseline gap-3">
                  <time className="font-display text-2xl text-ink lining-nums tabular-nums">
                    {item.time}
                  </time>
                  <span className="text-[0.9375rem] font-semibold text-ink">{item.title}</span>
                </p>
                <p className="mt-0.5 text-sm text-ink-soft">{item.place}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
              </Reveal>
            </li>
          );
        })}
      </ol>
      <p className="mt-12 text-center">
        <a
          href="#lugares"
          className="inline-flex items-center gap-2 text-sm text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
        >
          <MapPin aria-hidden className="size-4" /> Ver en el mapa
        </a>
      </p>
    </section>
  );
}

const googleMaps = (q: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
const appleMaps = (q: string) => `https://maps.apple.com/?q=${encodeURIComponent(q)}`;

/** Mapa ilustrado decorativo (no es un mapa real). */
function MapArt({ variant }: { variant: number }) {
  return (
    <svg
      viewBox="0 0 320 140"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      className="h-full w-full"
    >
      <rect width="320" height="140" fill="#ece3d4" />
      <g fill="none" stroke="#fbf8f2" strokeWidth="7" strokeLinecap="round">
        <path
          d={
            variant
              ? "M-10 110C80 90 120 40 200 52S300 20 330 30"
              : "M-10 40C60 60 140 50 190 90S290 120 330 100"
          }
        />
        <path d={variant ? "M120 150C130 100 160 70 150 -10" : "M80 -10C90 40 120 80 110 150"} />
      </g>
      <g fill="none" stroke="#fbf8f2" strokeWidth="3">
        <path d="M-10 18H330M40 -10V150M250 -10V150" opacity=".7" />
      </g>
      <path
        d="M210 -10C240 30 230 80 270 150"
        fill="none"
        stroke="#c8d3cf"
        strokeWidth="10"
        opacity=".8"
      />
      <g transform={`translate(${variant ? 196 : 168} ${variant ? 58 : 72})`}>
        <circle r="18" fill="#8a3a24" opacity=".14" />
        <path d="M0 6C-7-2-9-6-9-10a9 9 0 0 1 18 0c0 4-2 8-9 16Z" fill="#8a3a24" />
        <circle cy="-10" r="3" fill="#fbf8f2" />
      </g>
    </svg>
  );
}

export function VenuesSection({ event }: { event: WeddingEvent }) {
  return (
    <section
      aria-labelledby="lugares-title"
      id="lugares"
      className="scroll-mt-20 bg-cream/60 px-6 py-20 sm:py-28"
    >
      <SectionHeading id="lugares-title" eyebrow="Ubicaciones" title="Dónde celebrarlo" />
      <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2">
        {event.venues.map((venue, i) => (
          <Reveal key={venue.id} delay={i * 0.1}>
            <article className="overflow-hidden rounded-lg bg-paper shadow-[var(--shadow-paper)]">
              <div className="h-32">
                <MapArt variant={i % 2} />
              </div>
              <div className="p-6">
                <p className="eyebrow text-muted">{venue.kind}</p>
                <h3 className="mt-2 font-display text-[1.75rem] leading-tight text-ink">
                  {venue.name}
                </h3>
                <address className="mt-2 text-sm leading-relaxed text-ink-soft not-italic">
                  {venue.address}
                  <br />
                  {venue.city}
                </address>
                {venue.note ? (
                  <p className="mt-3 text-sm leading-relaxed text-muted">{venue.note}</p>
                ) : null}
                <div className="mt-5 flex flex-wrap gap-2">
                  <a
                    href={googleMaps(venue.mapsQuery)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 items-center gap-1.5 rounded-md border border-ink/20 px-3.5 text-[0.8125rem] text-ink transition-colors hover:border-ink"
                  >
                    Google Maps <ExternalLink aria-hidden className="size-3.5" />
                    <span className="sr-only">(se abre en una pestaña nueva)</span>
                  </a>
                  <a
                    href={appleMaps(venue.mapsQuery)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 items-center gap-1.5 rounded-md border border-ink/20 px-3.5 text-[0.8125rem] text-ink transition-colors hover:border-ink"
                  >
                    Apple Maps <ExternalLink aria-hidden className="size-3.5" />
                    <span className="sr-only">(se abre en una pestaña nueva)</span>
                  </a>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function TransportSection({ event }: { event: WeddingEvent }) {
  return (
    <section
      aria-labelledby="transporte-title"
      id="transporte"
      className="scroll-mt-20 px-6 py-20 sm:py-28"
    >
      <SectionHeading
        id="transporte-title"
        eyebrow="Transporte"
        title="Llegar y volver"
        intro="Queremos que llegues y vuelvas sin preocupaciones. Reserva tu plaza de autobús al confirmar."
      />
      <ul className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-3">
        {event.busRoutes.map((route, i) => (
          <li key={route.id}>
            <Reveal delay={i * 0.08} className="h-full">
              <div className="flex h-full flex-col rounded-lg border border-line bg-paper p-5">
                <Bus aria-hidden className="size-5 text-ink-soft" strokeWidth={1.5} />
                <h3 className="mt-4 font-semibold text-ink">{route.label}</h3>
                <p className="mt-1 text-sm text-muted">{route.pickupPoint}</p>
                <dl className="mt-4 space-y-1.5 border-t border-line pt-4 text-sm">
                  <div className="flex justify-between gap-2">
                    <dt className="text-muted">Salida</dt>
                    <dd className="text-ink tabular-nums">{route.departure}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-muted">Vuelta</dt>
                    <dd className="text-ink tabular-nums">{route.returnTrips.join(" · ")}</dd>
                  </div>
                </dl>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function PracticalSection({ event }: { event: WeddingEvent }) {
  return (
    <section
      aria-labelledby="info-title"
      id="info"
      className="scroll-mt-20 bg-cream/60 px-6 py-20 sm:py-28"
    >
      <SectionHeading
        id="info-title"
        eyebrow="Información práctica"
        title="Para que no falte nada"
      />
      <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2">
        <Reveal>
          <article className="h-full rounded-lg bg-paper p-6 shadow-[var(--shadow-paper)]">
            <Shirt aria-hidden className="size-5 text-ink-soft" strokeWidth={1.5} />
            <p className="eyebrow mt-4 text-muted">Vestimenta</p>
            <h3 className="mt-1 font-display text-2xl text-ink">{event.dressCode.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{event.dressCode.detail}</p>
            <ul className="mt-5 flex gap-2" aria-label="Paleta de colores sugerida">
              {event.dressCode.palette.map((color) => (
                <li
                  key={color}
                  className="size-8 rounded-full ring-1 ring-ink/10"
                  style={{ backgroundColor: color }}
                >
                  <span className="sr-only">{color}</span>
                </li>
              ))}
            </ul>
          </article>
        </Reveal>
        <Reveal delay={0.08}>
          <article className="h-full rounded-lg bg-paper p-6 shadow-[var(--shadow-paper)]">
            <BedDouble aria-hidden className="size-5 text-ink-soft" strokeWidth={1.5} />
            <p className="eyebrow mt-4 text-muted">Alojamiento</p>
            <ul className="mt-2 divide-y divide-line">
              {event.accommodation.map((a) => (
                <li key={a.name} className="py-3 first:pt-1 last:pb-0">
                  <h3 className="font-display text-xl text-ink">{a.name}</h3>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-soft">
                    <Clock aria-hidden className="size-3.5" /> {a.distance}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{a.detail}</p>
                </li>
              ))}
            </ul>
          </article>
        </Reveal>
      </div>

      <Reveal className="mx-auto mt-14 max-w-2xl">
        <h3 className="text-center font-display text-3xl text-ink">Preguntas frecuentes</h3>
        <div className="mt-6 divide-y divide-line border-y border-line">
          {event.faqs.map((faq) => (
            <details key={faq.question} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-[0.9375rem] font-medium text-ink [&::-webkit-details-marker]:hidden">
                {faq.question}
                <Plus
                  aria-hidden
                  className="size-4 shrink-0 text-ink-soft transition-transform duration-300 group-open:rotate-45"
                />
              </summary>
              <p className="pr-8 pb-5 text-sm leading-relaxed text-muted">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
