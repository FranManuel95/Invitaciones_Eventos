"use client";

import { ChevronDown } from "lucide-react";
import { m } from "motion/react";
import { useEffect, useRef, ViewTransition } from "react";
import { Button } from "@/components/ui/button";
import type { GuestGroup, WeddingEvent } from "@/lib/domain/types";
import { formatWeekdayDate } from "@/lib/format";
import { FoilMonogram } from "../effects/foil";
import { Petals } from "../effects/petals";
import { BlossomCorner } from "../ornaments";
import { useSwipeUp } from "../use-swipe-up";

/**
 * Pantalla 3 · Carta personalizada.
 * No aparece con un fundido: es la misma carta que acaba de salir del sobre, que crece hasta su
 * tamaño (<ViewTransition name="carta">). Al continuar, vuelve a transformarse en la cabecera.
 */
export function LetterStage({
  event,
  group,
  onContinue,
}: {
  event: WeddingEvent;
  group: GuestGroup;
  onContinue: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Se monta tras la salida del sobre: enfoca su título para teclado y lectores de pantalla.
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  const swipe = useSwipeUp(onContinue);

  return (
    <section
      aria-labelledby="letter-title"
      className="fixed inset-0 z-10 flex items-center justify-center overflow-hidden bg-[radial-gradient(110%_70%_at_50%_40%,var(--scene-1)_0%,var(--scene-2)_60%,var(--scene-3)_100%)] px-5 py-16"
      style={{ touchAction: "none" }}
      {...swipe}
    >
      <div aria-hidden className="paper-grain absolute inset-0" />
      {/* El foco de la apertura del sobre se abre poco a poco: la luz vuelve a la escena. */}
      <m.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_48%,transparent_35%,rgb(28_20_12/0.55)_100%)]"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.6, delay: 0.3, ease: "easeOut" }}
      />
      <BlossomCorner className="pointer-events-none absolute -top-6 -right-8 w-44 rotate-180 opacity-90 sm:w-60" />
      <BlossomCorner className="pointer-events-none absolute -bottom-6 -left-8 w-48 opacity-90 sm:w-64" />
      <Petals />

      {/* La sombra va en un contenedor aparte: la máscara del borde de papel la recortaría. */}
      <div className="relative w-full max-w-[22rem] rotate-[-1.2deg] drop-shadow-[0_24px_30px_rgb(35_30_15/0.28)] sm:max-w-md">
        <ViewTransition name="carta" share="paper-morph" default="none">
          <article className="paper-grain deckle relative bg-paper px-8 py-12 text-center sm:px-12 sm:py-14">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-4 border border-gold/35"
            />
            <FoilMonogram
              first={event.couple.first}
              second={event.couple.second}
              className="mx-auto size-12 text-[3rem]"
            />
            <h1
              id="letter-title"
              ref={headingRef}
              tabIndex={-1}
              className="letterpress mt-6 font-display text-[2rem] leading-tight text-ink outline-none sm:text-[2.375rem]"
            >
              Hola, {group.displayName}:
            </h1>
            <p className="mx-auto mt-5 max-w-[18rem] font-display text-[1.1875rem] leading-[1.6] text-ink-soft">
              {event.cardMessage}
            </p>
            <p
              translate="no"
              className="letterpress mt-8 font-display text-[1.75rem] leading-tight text-ink"
            >
              {event.couple.first} &amp; {event.couple.second}
            </p>
            <p className="caption mt-1 text-ink-soft">{formatWeekdayDate(event.date)}</p>

            <Button className="mt-9 w-full" size="lg" onClick={onContinue}>
              Ver la invitación
            </Button>
          </article>
        </ViewTransition>
      </div>

      <p
        aria-hidden
        className="absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] flex flex-col items-center gap-1 text-[0.8125rem] text-ink-soft"
      >
        Desliza para continuar
        <ChevronDown className="nudge size-4" />
      </p>
    </section>
  );
}
