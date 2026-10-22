import { ArrowUpRight, Plus } from "lucide-react";
import type { ReactNode } from "react";
import { dressKind } from "@/lib/dress";
import type { RsvpResponse, WeddingEvent } from "@/lib/domain/types";
import { describeTransport } from "@/lib/rsvp/summary";
import { formatLongDate } from "@/lib/format";
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
      className={tone === "tinted" ? "bg-cream/55" : undefined}
    >
      <div className="mx-auto grid max-w-5xl gap-8 px-6 py-16 sm:px-10 sm:py-24 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-14">
        <div>
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
                  now ? "border-wax text-wax" : "border-gold/60 text-gold"
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
const appleMaps = (q: string) => `https://maps.apple.com/?q=${encodeURIComponent(q)}`;

export function VenuesSection({ event }: { event: WeddingEvent }) {
  const [first, second] = event.venues;
  return (
    <Section id="lugares" title="Dónde" tone="tinted" aside={`${event.city}, ${event.region}`}>
      {first && second ? <RouteMap from={first.name} to={second.name} /> : null}
      <div className="mt-10 grid gap-10 sm:grid-cols-2">
        {event.venues.map((venue) => (
          <article key={venue.id}>
            <PhotoSlot
              src={venue.photo}
              alt={venue.photoAlt}
              ratio="3/2"
              sizes="(min-width: 640px) 320px, 92vw"
              tone={venue.id === "finca" ? 1 : 3}
              className="mb-5"
            />
            <p className="caption text-ink-soft">{venue.kind}</p>
            <h3 className="mt-1 font-display text-[1.75rem] leading-tight text-ink">
              {venue.name}
            </h3>
            <address className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft not-italic">
              {venue.address}
              <br />
              {venue.city}
            </address>
            {venue.note ? (
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{venue.note}</p>
            ) : null}
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[0.9375rem]">
              {[
                ["Abrir en Google Maps", googleMaps(venue.mapsQuery)],
                ["Abrir en Apple Maps", appleMaps(venue.mapsQuery)],
              ].map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-ink underline decoration-gold decoration-1 underline-offset-[5px] transition-colors hover:decoration-ink"
                  >
                    {label}
                    <ArrowUpRight aria-hidden className="size-3.5" />
                    <span className="sr-only">(se abre en una pestaña nueva)</span>
                  </a>
                </li>
              ))}
            </ul>
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
      <div
        role="region"
        aria-label="Horarios de autobús"
        tabIndex={0}
        className="relative overflow-x-auto"
      >
        <table className="w-full min-w-[30rem] text-left text-[0.9375rem]">
          <caption className="sr-only">Autobuses a la finca</caption>
          <thead>
            <tr className="border-b border-ink/30 text-muted">
              <th scope="col" className="py-3 pr-4 font-normal">
                Recogida
              </th>
              <th scope="col" className="py-3 pr-4 font-normal">
                Salida
              </th>
              <th scope="col" className="py-3 font-normal">
                Vuelta
              </th>
            </tr>
          </thead>
          <tbody>
            {event.busRoutes.map((route) => (
              <tr key={route.id} className="border-b border-line">
                <th scope="row" className="py-4 pr-4 font-normal text-ink">
                  {route.pickupPoint}
                </th>
                <td className="py-4 pr-4 font-display text-xl text-ink tabular-nums">
                  {route.departure}
                </td>
                <td className="py-4 text-ink-soft tabular-nums">{route.returnTrips.join(" y ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
          {event.dressCode.palette.length ? (
            <>
              <p className="mt-6 text-[0.875rem] text-ink-soft">Colores que nos gustan</p>
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-3">
                {event.dressCode.palette.map((color) => (
                  <li
                    key={color.hex}
                    className="flex w-14 flex-col items-center gap-1.5 text-center"
                  >
                    <span
                      aria-hidden
                      className="block size-12 rounded-full shadow-[inset_0_-4px_8px_rgb(0_0_0/0.12)] ring-1 ring-ink/15"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-[0.75rem] leading-tight text-muted">{color.name}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
          {event.dressCode.examples?.length ? (
            <ul className="mt-7 grid gap-3">
              {event.dressCode.examples.map((example) => (
                <li
                  key={example.who}
                  className="flex items-start gap-3 rounded-[3px] border border-line bg-paper p-3.5"
                >
                  <DressIcon who={example.who} />
                  <div>
                    <p className="text-[0.9375rem] font-medium text-ink">{example.who}</p>
                    <p className="text-[0.875rem] leading-relaxed text-muted">{example.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div>
          <h3 className="font-display text-[1.75rem] leading-tight text-ink">Dónde dormir</h3>
          <ul className="mt-2">
            {event.accommodation.map((a) => (
              <li key={a.name} className="border-b border-line py-4 first:pt-2 last:border-0">
                <p className="text-[1.0625rem] font-medium text-ink">{a.name}</p>
                <p className="caption text-ink-soft">{a.distance}</p>
                <p className="mt-1 text-[0.9375rem] leading-relaxed text-muted">{a.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <h3 className="mt-16 font-display text-[1.75rem] leading-tight text-ink">
        Preguntas frecuentes
      </h3>
      <div className="mt-4 border-t border-ink/30">
        {event.faqs.map((faq) => (
          <details key={faq.question} className="group border-b border-line">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-[1.0625rem] text-ink transition-colors hover:text-ink-soft [&::-webkit-details-marker]:hidden">
              {faq.question}
              <Plus
                aria-hidden
                className="size-4 shrink-0 text-ink-soft transition-transform duration-300 group-open:rotate-45"
              />
            </summary>
            <p className="max-w-prose pr-8 pb-5 text-[0.9375rem] leading-relaxed text-muted">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </Section>
  );
}

/**
 * Pictograma de la sugerencia de vestimenta según a quién va dirigida: vestido, traje, niños o
 * una percha para cualquier otro caso.
 */
function DressIcon({ who }: { who: string }) {
  const kind = dressKind(who);
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden
      className="mt-0.5 size-8 shrink-0 text-gold"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    >
      {kind === "dress" ? (
        <path d="M12 3h8l-1.5 6 6 18H7.5l6-18L12 3Zm1.5 6h5" />
      ) : kind === "suit" ? (
        <path d="M9 4h14l3 6-3 18H9L6 10l3-6Zm3 0 4 9 4-9M16 13v15M12.5 18h-3" />
      ) : kind === "kids" ? (
        <path d="M16 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5 4h10l3 7h-4l-1 11h-6l-1-11H8l3-7Z" />
      ) : (
        <path d="M16 9a2.5 2.5 0 1 1 2.5-2.5M16 9v2L4 22h24L16 11" />
      )}
    </svg>
  );
}
