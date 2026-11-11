"use client";

import { ArrowUpRight, Navigation } from "lucide-react";
import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { buttonClasses } from "@/components/ui/button";
import type { WeddingEvent } from "@/lib/domain/types";
import { useScrollProgress } from "../effects/scroll-progress";
import { haptic, playTick } from "../effects/sound";

const appleMaps = (q: string) => `https://maps.apple.com/?q=${encodeURIComponent(q)}`;
/** Ruta hasta el sitio: en el móvil abre la aplicación de mapas con el destino ya puesto. */
const directions = (q: string) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}`;

/*
 * «Dónde», como una escena: cada sitio ocupa la pantalla con su foto, que se acerca despacio y se
 * funde con la del siguiente mientras se baja. Abajo, el recorrido: un punto viaja de un sitio a
 * otro. Reutiliza los estilos de «Nuestra historia» (.story-*), movidos por --p.
 *
 * Solo se usa cuando hay al menos dos sitios, todos con foto, y no se pide reducir el
 * movimiento; si no, las tarjetas de siempre (`VenuesSection`).
 */
export function VenueScene({ event }: { event: WeddingEvent }) {
  const venues = event.venues;
  const count = venues.length;
  // Solo el sitio que se está viendo recibe toques y foco.
  const [active, setActive] = useState(0);
  const scene = useScrollProgress<HTMLDivElement>("pin", true, count, (step, first) => {
    setActive(step);
    if (first) return;
    haptic(8);
    playTick();
  });
  return (
    <section id="lugares" aria-labelledby="lugares-title" className="bg-[#10110d]">
      <div
        ref={scene}
        className="scroll-scene"
        style={{ "--n": count, height: `calc(${count - 1} * 110svh + 100svh)` } as CSSProperties}
      >
        <div className="sticky top-0 h-[100svh] overflow-hidden text-white">
          {venues.map((venue, i) => (
            <div
              key={venue.id}
              className="story-photo absolute inset-0"
              style={{ "--i": i } as CSSProperties}
            >
              <Image
                src={venue.photo!}
                alt={venue.photoAlt}
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          ))}
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(180deg,rgb(0_0_0/0.55)_0%,rgb(0_0_0/0.05)_24%,rgb(0_0_0/0)_38%,rgb(0_0_0/0.74)_70%,rgb(0_0_0/0.9)_100%)]"
          />

          <div className="relative mx-auto flex h-full max-w-5xl flex-col px-6 pt-20 pb-8 sm:px-10">
            <h2
              id="lugares-title"
              className="font-display text-[2.5rem] leading-[1.05] [text-shadow:0_2px_24px_rgb(0_0_0/0.4)] sm:text-[3rem]"
            >
              Dónde
            </h2>
            <p className="mt-2 text-[0.9375rem] text-white/85">
              {event.city}, {event.region}
            </p>

            <ol className="relative mt-auto min-h-[19rem]">
              {venues.map((venue, i) => (
                <li
                  key={venue.id}
                  inert={active !== i}
                  className="story-chapter absolute inset-x-0 bottom-0"
                  style={{ "--i": i } as CSSProperties}
                >
                  <p className="caption text-white/85">{venue.kind}</p>
                  <h3 className="mt-1 font-display text-[clamp(2.75rem,13vw,4.5rem)] leading-[0.95] [text-shadow:0_2px_30px_rgb(0_0_0/0.45)]">
                    {venue.name}
                  </h3>
                  <address className="mt-3 text-[1rem] leading-relaxed text-white/90 not-italic">
                    {venue.address}, {venue.city}
                  </address>
                  {venue.note ? (
                    <p className="mt-2 max-w-[38ch] text-[0.9375rem] leading-relaxed text-white/80">
                      {venue.note}
                    </p>
                  ) : null}
                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
                    <a
                      href={directions(venue.mapsQuery)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonClasses("secondary", "md", "border-transparent")}
                    >
                      <Navigation aria-hidden className="size-4" />
                      Ver la ruta
                      <span className="sr-only">
                        a {venue.name} (se abre Google Maps en una pestaña nueva)
                      </span>
                    </a>
                    <a
                      href={appleMaps(venue.mapsQuery)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[0.9375rem] text-white underline decoration-white/60 decoration-1 underline-offset-[5px] hover:decoration-white"
                    >
                      Apple Maps
                      <ArrowUpRight aria-hidden className="size-3.5" />
                      <span className="sr-only">: {venue.name} (se abre en una pestaña nueva)</span>
                    </a>
                  </div>
                </li>
              ))}
            </ol>

            {/* El recorrido: un punto viaja de un sitio al siguiente mientras se baja. */}
            <div aria-hidden className="relative mt-8 h-3">
              <div className="absolute inset-x-1.5 top-1/2 border-t border-dashed border-white/45" />
              {venues.map((venue, i) => (
                <span
                  key={venue.id}
                  className="absolute top-1/2 size-2 -translate-y-1/2 rounded-full border border-white bg-[#10110d]"
                  style={{ left: `calc(${count > 1 ? i / (count - 1) : 0} * (100% - 0.5rem))` }}
                />
              ))}
              <span className="venue-car absolute top-1/2 size-3 -translate-y-1/2 rounded-full bg-gold-soft shadow-[0_0_0_4px_rgb(255_255_255/0.18)]" />
            </div>
          </div>
        </div>
      </div>
      {/* De la última foto al papel de la sección siguiente, sin corte. */}
      <div aria-hidden className="scene-out h-[22svh]" />
    </section>
  );
}
