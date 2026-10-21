import { ArrowUpRight, Plus } from "lucide-react";
import type { ReactNode } from "react";
import type { RsvpResponse, WeddingEvent } from "@/lib/domain/types";
import { describeTransport } from "@/lib/rsvp/summary";
import { formatLongDate } from "@/lib/format";

/*
 * Secciones de la invitación con maquetación editorial: en escritorio el título ocupa una
 * columna de margen y el contenido la columna principal; en móvil todo va en una columna
 * alineada a la izquierda. Sin tarjetas ni apariciones por sección: el único momento
 * coreografiado es la apertura del sobre.
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
            className="font-display text-[2.5rem] leading-[1.05] text-ink sm:text-[3rem] md:sticky md:top-24"
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

export function ProgramSection({ event }: { event: WeddingEvent }) {
  return (
    <Section id="programa" title="El día" aside={formatLongDate(event.date)}>
      <ol className="border-t border-line">
        {event.program.map((item) => (
          <li
            key={item.id}
            className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-5 border-b border-line py-6 sm:grid-cols-[7.5rem_minmax(0,1fr)]"
          >
            <time className="font-display text-[2rem] leading-none text-ink tabular-nums sm:text-[2.5rem]">
              {item.time}
            </time>
            <div>
              <h3 className="text-[1.0625rem] font-medium text-ink">{item.title}</h3>
              <p className="caption text-ink-soft">{item.place}</p>
              <p className="mt-2 max-w-prose text-[0.9375rem] leading-relaxed text-muted">
                {item.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

const googleMaps = (q: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
const appleMaps = (q: string) => `https://maps.apple.com/?q=${encodeURIComponent(q)}`;

/** Plano ilustrado del trayecto iglesia → finca (orientativo, no a escala). */
function RouteMap({ from, to }: { from: string; to: string }) {
  return (
    <figure className="overflow-hidden rounded-[2px] border border-line bg-paper">
      <svg
        viewBox="0 0 640 260"
        role="img"
        aria-labelledby="route-map-title"
        className="block h-auto w-full"
      >
        <title id="route-map-title">{`Plano orientativo: de ${from} a ${to}, unos 8 minutos en coche`}</title>
        <rect width="640" height="260" fill="#f3efe5" />
        <g stroke="#e2dccd" strokeWidth="1">
          {Array.from({ length: 9 }, (_, i) => (
            <path key={`v${i}`} d={`M${i * 80} 0V260`} />
          ))}
          {Array.from({ length: 4 }, (_, i) => (
            <path key={`h${i}`} d={`M0 ${i * 80}H640`} />
          ))}
        </g>
        {/* Casco urbano */}
        <g fill="#e6dfcf">
          <rect x="70" y="70" width="46" height="30" />
          <rect x="124" y="64" width="38" height="40" />
          <rect x="84" y="108" width="70" height="26" />
          <rect x="164" y="112" width="30" height="22" />
        </g>
        {/* Olivares y almendros de la finca */}
        <g fill="#c9cfae">
          {Array.from({ length: 24 }, (_, i) => (
            <circle key={i} cx={430 + (i % 6) * 22} cy={150 + Math.floor(i / 6) * 20} r="5" />
          ))}
        </g>
        <path
          d="M140 120C210 120 220 190 300 190S400 150 470 165"
          fill="none"
          stroke="#a3874e"
          strokeWidth="2.5"
          strokeDasharray="1 7"
          strokeLinecap="round"
        />
        <g transform="translate(140 120)">
          <circle r="9" fill="#23271e" />
          <circle r="3" fill="#faf8f3" />
        </g>
        <g transform="translate(470 165)">
          <circle r="9" fill="#6b1e2a" />
          <circle r="3" fill="#faf8f3" />
        </g>
        <g fontFamily="var(--font-display)" fontSize="22" fill="#23271e">
          <text x="140" y="96" textAnchor="middle">
            {from}
          </text>
          <text x="470" y="140" textAnchor="middle">
            {to}
          </text>
          <text x="300" y="222" textAnchor="middle" fontStyle="italic" fill="#5c5e53" fontSize="19">
            8 min en coche
          </text>
        </g>
      </svg>
    </figure>
  );
}

export function VenuesSection({ event }: { event: WeddingEvent }) {
  const [first, second] = event.venues;
  return (
    <Section id="lugares" title="Dónde" tone="tinted" aside={`${event.city}, ${event.region}`}>
      {first && second ? <RouteMap from={first.name} to={second.name} /> : null}
      <div className="mt-10 grid gap-10 sm:grid-cols-2">
        {event.venues.map((venue) => (
          <article key={venue.id}>
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
          <p className="mt-5 text-[0.875rem] text-ink-soft">Colores que nos gustan</p>
          <ul className="mt-2 flex gap-2">
            {event.dressCode.palette.map((color) => (
              <li
                key={color.hex}
                className="size-9 rounded-full ring-1 ring-ink/15"
                style={{ backgroundColor: color.hex }}
              >
                <span className="sr-only">{color.name}</span>
              </li>
            ))}
          </ul>
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
