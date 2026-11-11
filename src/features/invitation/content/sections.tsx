import { ArrowUpRight, CloudSun, MapPin, Navigation, Plus } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { climateText } from "@/lib/weather";
import Image from "next/image";
import type { ReactNode } from "react";
import type { RsvpResponse, WeddingEvent } from "@/lib/domain/types";
import { describeTransport } from "@/lib/rsvp/summary";
import { formatLongDate } from "@/lib/format";
import { DressFigures } from "./dress-figures";
import { PhotoSlot } from "./photo-slot";
import { ProgramIcon } from "./program-icons";
import { RouteMap } from "./route-map";

/*
 * Secciones de la invitación con maquetación editorial: en escritorio el título ocupa una
 * columna de margen y el contenido la columna principal; en móvil todo va en una columna
 * alineada a la izquierda. Los titulares suben desde detrás de una línea al llegar a ellos
 * (reveal-title, animación de scroll nativa en globals.css).
 */

export function Section({
  id,
  title,
  aside,
  children,
  tone = "plain",
}: {
  id: string;
  title: string;
  aside?: ReactNode;
  children: ReactNode;
  tone?: "plain" | "tinted";
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={tone === "tinted" ? "tone-tinted" : undefined}
    >
      <div className="mx-auto grid max-w-5xl gap-8 px-6 py-16 sm:px-10 sm:py-24 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-14">
        <div>
          {/* Una raya dorada se traza antes de que suba el titular. */}
          <span data-view aria-hidden className="title-rule mb-5 block h-px bg-gold" />
          <h2
            id={`${id}-title`}
            className="reveal-title font-display text-[2.5rem] leading-[1.05] text-ink sm:text-[3rem] md:sticky md:top-24"
          >
            {title}
          </h2>
          {aside ? <div className="mt-3 max-w-xs text-[0.9375rem] text-muted">{aside}</div> : null}
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}

export function ProgramSection({
  event,
  currentId,
}: {
  event: WeddingEvent;
  /** En el modo «día de la boda», el acto que está ocurriendo ahora. */
  currentId?: string | null;
}) {
  return (
    <Section id="programa" title="El día" aside={formatLongDate(event.date)}>
      <ol className="program-list relative">
        {/* Hilo del día: crece con el scroll (program-thread en globals.css). */}
        <span
          aria-hidden
          className="program-thread absolute top-8 bottom-8 left-[1.375rem] w-px bg-gradient-to-b from-gold via-gold/70 to-gold/20"
        />
        {event.program.map((item) => {
          const now = currentId === item.id;
          return (
            <li
              key={item.id}
              aria-current={now ? "step" : undefined}
              className={`relative grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-4 gap-y-2 py-6 sm:grid-cols-[2.75rem_7rem_minmax(0,1fr)] sm:gap-y-0 ${
                now
                  ? "-mx-3 rounded-[3px] bg-paper px-3 shadow-[inset_3px_0_0_var(--color-wax)]"
                  : ""
              }`}
            >
              <span
                className={`relative row-span-2 grid size-11 place-items-center rounded-full border bg-paper sm:row-span-1 ${
                  now ? "border-wax text-wax" : "program-dot border-gold/60 text-gold"
                }`}
              >
                <ProgramIcon id={item.id} />
              </span>
              <time className="pt-1.5 font-display text-[1.75rem] leading-none text-ink tabular-nums sm:text-[2.25rem]">
                {item.time}
              </time>
              <div>
                <h3 className="text-[1.0625rem] font-medium text-ink">
                  {item.title}
                  {now ? (
                    <span className="ml-2 rounded-full bg-wax px-2 py-0.5 align-middle text-[0.75rem] font-medium text-paper">
                      Ahora
                    </span>
                  ) : null}
                </h3>
                <p className="caption text-ink-soft">{item.place}</p>
                <p className="mt-2 max-w-prose text-[0.9375rem] leading-relaxed text-muted">
                  {item.description}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}

const googleMaps = (q: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
/** Ruta hasta el sitio: en el móvil abre la aplicación de mapas con el destino ya puesto. */
const directions = (q: string) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}`;
const appleMaps = (q: string) => `https://maps.apple.com/?q=${encodeURIComponent(q)}`;

export function VenuesSection({ event }: { event: WeddingEvent }) {
  const [first, second] = event.venues;
  return (
    <Section id="lugares" title="Dónde" tone="tinted" aside={`${event.city}, ${event.region}`}>
      {first && second ? <RouteMap from={first.name} to={second.name} /> : null}
      {/* En el móvil los sitios se pasan de lado con el dedo; en pantallas anchas, en paralelo. */}
      <div className="relative mt-10 flex snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto max-sm:-mx-6 max-sm:px-6 max-sm:pb-2 sm:grid sm:grid-cols-2 sm:gap-10 sm:overflow-visible">
        {event.venues.map((venue) => (
          <article
            key={venue.id}
            className={
              event.venues.length > 1 ? "shrink-0 snap-center max-sm:w-[86%]" : "w-full shrink-0"
            }
          >
            {venue.photo ? (
              // La foto, grande y con el nombre encima; se desplaza despacio dentro de su marco.
              <div
                data-view
                className="reveal-photo relative mb-5 aspect-[4/5] overflow-hidden rounded-[3px] bg-cream sm:aspect-[3/2] sm:rounded-[2px]"
              >
                <div className="absolute inset-0">
                  <div className="photo-drift absolute inset-0">
                    <Image
                      src={venue.photo}
                      alt={venue.photoAlt}
                      fill
                      sizes="(min-width: 640px) 320px, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-[linear-gradient(180deg,rgb(0_0_0/0)_45%,rgb(0_0_0/0.72)_100%)]"
                  />
                  <div className="absolute inset-x-5 bottom-5 text-white">
                    <p className="caption text-white/85">{venue.kind}</p>
                    <h3 className="mt-1 font-display text-[2rem] leading-[1.05] [text-shadow:0_2px_20px_rgb(0_0_0/0.4)] sm:text-[1.75rem]">
                      {venue.name}
                    </h3>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <PhotoSlot
                  src={null}
                  alt={venue.photoAlt}
                  ratio="3/2"
                  tone={venue.id === "finca" ? 1 : 3}
                  className="mb-5"
                />
                <p className="caption text-ink-soft">{venue.kind}</p>
                <h3 className="mt-1 font-display text-[1.75rem] leading-tight text-ink">
                  {venue.name}
                </h3>
              </>
            )}
            <address className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft not-italic">
              {venue.address}
              <br />
              {venue.city}
            </address>
            {venue.note ? (
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{venue.note}</p>
            ) : null}
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
              <a
                href={directions(venue.mapsQuery)}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses("primary", "md")}
              >
                <Navigation aria-hidden className="size-4" />
                Cómo llegar
                <span className="sr-only">
                  a {venue.name} (se abre Google Maps en una pestaña nueva)
                </span>
              </a>
              <a
                href={appleMaps(venue.mapsQuery)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[0.9375rem] text-ink underline decoration-gold decoration-1 underline-offset-[5px] transition-colors hover:decoration-ink"
              >
                Apple Maps
                <ArrowUpRight aria-hidden className="size-3.5" />
                <span className="sr-only">: {venue.name} (se abre en una pestaña nueva)</span>
              </a>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

export function TransportSection({
  event,
  response,
}: {
  event: WeddingEvent;
  response: RsvpResponse | null;
}) {
  const yours = response?.status === "attending" ? describeTransport(response, event) : null;
  return (
    <Section
      id="transporte"
      title="Cómo llegar"
      aside={yours ? undefined : "Reserva tu plaza de autobús al confirmar asistencia."}
    >
      {yours ? (
        <p className="mb-8 rounded-[3px] border-l-2 border-gold bg-paper px-4 py-3 text-[0.9375rem] text-ink-soft">
          Tu respuesta. Autobús: <strong className="font-semibold text-ink">{yours.answer}</strong>.{" "}
          {yours.detail}
        </p>
      ) : null}
      {/* Cada autobús, como un billete: la hora de salida en el resguardo y el resto al lado. */}
      <ul aria-label="Autobuses a la finca" className="grid max-w-xl gap-4">
        {event.busRoutes.map((route) => (
          <li
            key={route.id}
            data-view
            className="tag-in paper-grain relative grid grid-cols-[auto_minmax(0,1fr)] overflow-hidden rounded-[3px] border border-line bg-paper shadow-[0_10px_24px_-18px_rgb(0_0_0/0.35)]"
          >
            <div className="relative border-r border-dashed border-ink/30 px-5 py-5 text-center">
              <p className="text-[0.8125rem] text-muted">Salida</p>
              <p className="mt-1 font-display text-[2.5rem] leading-none text-ink tabular-nums">
                {route.departure}
              </p>
              {/* Las muescas del troquel, arriba y abajo de la línea de corte. */}
              <span
                aria-hidden
                className="absolute -top-2 -right-2 size-4 rounded-full border border-line bg-ivory"
              />
              <span
                aria-hidden
                className="absolute -right-2 -bottom-2 size-4 rounded-full border border-line bg-ivory"
              />
            </div>
            <div className="flex flex-col justify-center px-5 py-5">
              <h3 className="text-[1.0625rem] leading-snug font-medium text-ink">
                {route.pickupPoint}
              </h3>
              {route.returnTrips.length ? (
                <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-soft tabular-nums">
                  Vuelta a las {route.returnTrips.join(" y a las ")}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-6 max-w-prose text-[0.9375rem] leading-relaxed text-muted">
        Si vienes en coche, hay aparcamiento en la finca. Al confirmar puedes ofrecer plazas a otros
        invitados.
      </p>
    </Section>
  );
}

export function PracticalSection({ event }: { event: WeddingEvent }) {
  return (
    <Section id="info" title="Antes de venir" tone="tinted">
      <div className="grid gap-12 sm:grid-cols-2">
        <div>
          <h3 className="font-display text-[1.75rem] leading-tight text-ink">
            {event.dressCode.title}
          </h3>
          <p className="mt-2 max-w-prose text-[0.9375rem] leading-relaxed text-muted">
            {event.dressCode.detail}
          </p>
          {event.climate ? (
            <p className="mt-5 flex max-w-prose items-start gap-2.5 rounded-[3px] border border-line bg-paper p-3.5 text-[0.9375rem] leading-relaxed text-ink-soft">
              <CloudSun aria-hidden className="mt-0.5 size-5 shrink-0 text-gold" />
              <span>
                <span className="font-medium text-ink">El tiempo en estas fechas. </span>
                {climateText(event.climate)}
              </span>
            </p>
          ) : null}
          {event.dressCode.palette.length ? (
            <>
              <p className="mt-6 text-[0.875rem] text-ink-soft">Colores que nos gustan</p>
              {/* Muestras de tela: una carta de colores, cada una algo torcida. */}
              <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-5">
                {event.dressCode.palette.map((color, i) => (
                  <li
                    key={color.hex}
                    data-view
                    className="tag-in w-[4.75rem] bg-paper p-1.5 pb-2 shadow-[0_8px_18px_-12px_rgb(0_0_0/0.4)] ring-1 ring-ink/10"
                    style={{ rotate: `${[-2.5, 1.5, -1, 2.5, -1.5][i % 5]}deg` }}
                  >
                    <span
                      aria-hidden
                      className="paper-grain block h-[4.5rem]"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="mt-1.5 block text-[0.75rem] leading-tight text-ink-soft">
                      {color.name}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
          {event.dressCode.examples?.length ? (
            <DressFigures examples={event.dressCode.examples} palette={event.dressCode.palette} />
          ) : null}
        </div>
        <div>
          <h3 className="font-display text-[1.75rem] leading-tight text-ink">Dónde dormir</h3>
          {/* Cada alojamiento, una ficha con su enlace al mapa. */}
          <ul className="mt-4 grid gap-3">
            {event.accommodation.map((a) => (
              <li
                key={a.name}
                data-view
                className="tag-in paper-grain rounded-[3px] border border-line bg-paper p-5 shadow-[0_10px_24px_-18px_rgb(0_0_0/0.35)]"
              >
                <p className="font-display text-[1.375rem] leading-tight text-ink">{a.name}</p>
                <p className="caption mt-1 text-ink-soft">{a.distance}</p>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{a.detail}</p>
                <a
                  href={googleMaps(`${a.name}, ${event.city}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-[0.9375rem] text-ink underline decoration-gold decoration-1 underline-offset-[5px] transition-colors hover:decoration-ink"
                >
                  <MapPin aria-hidden className="size-4 text-gold" />
                  Ver en el mapa
                  <span className="sr-only">: {a.name} (se abre en una pestaña nueva)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <h3 className="mt-16 font-display text-[1.75rem] leading-tight text-ink">
        Preguntas frecuentes
      </h3>
      <div className="mt-5 grid max-w-2xl gap-2.5">
        {event.faqs.map((faq) => (
          <details
            key={faq.question}
            className="group rounded-[3px] border border-line bg-paper/70 px-5 transition-colors open:bg-paper open:shadow-[0_10px_24px_-18px_rgb(0_0_0/0.35)]"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left font-display text-[1.25rem] leading-snug text-ink [&::-webkit-details-marker]:hidden">
              {faq.question}
              <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line text-ink-soft transition-[rotate,background-color,color] duration-300 group-open:rotate-45 group-open:bg-ink group-open:text-paper">
                <Plus aria-hidden className="size-4" />
              </span>
            </summary>
            <p className="faq-answer max-w-prose pr-6 pb-5 text-[0.9375rem] leading-relaxed text-ink-soft">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </Section>
  );
}
