"use client";

import { ChevronDown } from "lucide-react";
import { motion, useReducedMotion, type PanInfo } from "motion/react";
import { Button } from "@/components/ui/button";
import type { GuestGroup, WeddingEvent } from "@/lib/domain/types";
import { Divider, FloralCorner } from "../ornaments";

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

  const handlePanEnd = (_: PointerEvent, info: PanInfo) => {
    if (info.offset.y < -60 || info.velocity.y < -400) onContinue();
  };

  return (
    <motion.section
      aria-labelledby="letter-title"
      className="fixed inset-0 z-10 flex items-center justify-center overflow-hidden bg-[radial-gradient(110%_70%_at_50%_40%,#f3e9dd_0%,#e8d9c7_60%,#d9c6ad_100%)] px-5 py-16"
      style={{ touchAction: "none" }}
      onPanEnd={handlePanEnd}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: -40 }}
      transition={{ duration: 0.5, ease: silk }}
    >
      <div aria-hidden className="paper-grain absolute inset-0" />
      <FloralCorner className="pointer-events-none absolute -top-6 -right-8 w-44 rotate-180 opacity-90 sm:w-60" />
      <FloralCorner className="pointer-events-none absolute -bottom-6 -left-8 w-48 opacity-90 sm:w-64" />

      <motion.article
        className="paper-grain relative w-full max-w-[22rem] rounded-[3px] bg-paper px-8 py-12 text-center shadow-[var(--shadow-lift)] sm:max-w-md sm:px-12 sm:py-14"
        initial={reduce ? false : { scale: 1.06, rotate: 0, y: 10 }}
        animate={{ scale: 1, rotate: -1.2, y: 0 }}
        transition={{ duration: 0.9, ease: silk }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-3 rounded-[2px] border border-gold/30"
        />
        <p className="eyebrow text-muted">Para {group.displayName}</p>
        <h1
          id="letter-title"
          tabIndex={-1}
          className="mt-5 font-display text-5xl font-light text-ink outline-none"
        >
          ¡Hola!
        </h1>
        <p className="mx-auto mt-6 max-w-[17rem] font-display text-lg leading-relaxed text-ink-soft">
          {event.cardMessage}
        </p>
        <Divider className="mx-auto mt-8 text-gold" />
        <p className="mt-6 font-display text-[1.75rem] leading-tight text-ink">
          {event.couple.first} <span className="italic">&amp;</span> {event.couple.second}
        </p>
        <p className="mt-3 text-xs tracking-[0.38em] text-ink-soft">{event.dateLabel}</p>

        <Button className="mt-9 w-full" size="lg" onClick={onContinue}>
          Ver la invitación
        </Button>
      </motion.article>

      <p
        aria-hidden
        className="absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] flex flex-col items-center gap-1 text-xs tracking-[0.12em] text-ink-soft/80"
      >
        Desliza para continuar
        <ChevronDown className="size-4 motion-safe:animate-bounce" />
      </p>
    </motion.section>
  );
}
