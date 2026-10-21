"use client";

import { ChevronDown } from "lucide-react";
import { m, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import type { GuestGroup, WeddingEvent } from "@/lib/domain/types";
import { useSwipeUp } from "../use-swipe-up";
import { formatWeekdayDate } from "@/lib/format";
import { BlossomCorner, Monogram } from "../ornaments";

const silk = [0.22, 1, 0.36, 1] as const;

/** Pantalla 3 · Carta personalizada que sale del sobre. */
export function LetterStage({
  event,
  group,
  onContinue,
}: {
  event: WeddingEvent;
  group: GuestGroup;
  onContinue: () => void;
}) {
  const reduce = useReducedMotion();
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Se monta tras la salida del sobre: enfoca su título al aparecer para teclado y lectores de pantalla.
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  const swipe = useSwipeUp(onContinue);

  return (
    <m.section
      aria-labelledby="letter-title"
      className="fixed inset-0 z-10 flex items-center justify-center overflow-hidden bg-[radial-gradient(110%_70%_at_50%_40%,#f3e9dd_0%,#e8d9c7_60%,#d9c6ad_100%)] px-5 py-16"
      style={{ touchAction: "none" }}
      {...swipe}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: -40 }}
      transition={{ duration: 0.5, ease: silk }}
    >
      <div aria-hidden className="paper-grain absolute inset-0" />
      <BlossomCorner className="pointer-events-none absolute -top-6 -right-8 w-44 rotate-180 opacity-90 sm:w-60" />
      <BlossomCorner className="pointer-events-none absolute -bottom-6 -left-8 w-48 opacity-90 sm:w-64" />

      <m.article
        className="paper-grain relative w-full max-w-[22rem] rounded-[3px] bg-paper px-8 py-12 text-center shadow-[var(--shadow-lift)] sm:max-w-md sm:px-12 sm:py-14"
        initial={reduce ? false : { scale: 1.06, rotate: 0, y: 10 }}
        animate={{ scale: 1, rotate: -1.2, y: 0 }}
        transition={{ duration: 0.9, ease: silk }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-3 rounded-[2px] border border-gold/30"
        />
        <Monogram
          first={event.couple.first}
          second={event.couple.second}
          className="mx-auto size-11 text-gold"
        />
        <h1
          id="letter-title"
          ref={headingRef}
          tabIndex={-1}
          className="mt-6 font-display text-[2rem] leading-tight text-ink outline-none sm:text-[2.375rem]"
        >
          Hola, {group.displayName}:
        </h1>
        <p className="mx-auto mt-5 max-w-[18rem] font-display text-[1.1875rem] leading-[1.6] text-ink-soft">
          {event.cardMessage}
        </p>
        <p translate="no" className="mt-8 font-display text-[1.75rem] leading-tight text-ink">
          {event.couple.first} &amp; {event.couple.second}
        </p>
        <p className="caption mt-1 text-ink-soft">{formatWeekdayDate(event.date)}</p>

        <Button className="mt-9 w-full" size="lg" onClick={onContinue}>
          Ver la invitación
        </Button>
      </m.article>

      <p
        aria-hidden
        className="absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] flex flex-col items-center gap-1 text-[0.8125rem] text-ink-soft"
      >
        Desliza para continuar
        <ChevronDown className="nudge size-4" />
      </p>
    </m.section>
  );
}
