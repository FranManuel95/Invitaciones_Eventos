"use client";

import { ChevronDown } from "lucide-react";
import { m, useReducedMotion } from "motion/react";
import type { WeddingEvent } from "@/lib/domain/types";
import { useSwipeUp } from "../use-swipe-up";
import { formatLongDate, isoDay } from "@/lib/format";
import { Landscape } from "./landscape";

const ease = [0.22, 1, 0.36, 1] as const;

/** Pantalla 1 · Portada cinematográfica. Se abre tocando, deslizando hacia arriba o con teclado. */
export function CoverStage({ event, onOpen }: { event: WeddingEvent; onOpen: () => void }) {
  const reduce = useReducedMotion();

  const swipe = useSwipeUp(onOpen);

  return (
    <m.section
      aria-labelledby="cover-title"
      className="fixed inset-0 z-20 overflow-hidden bg-[#2f3547] text-white"
      style={{ touchAction: "none" }}
      {...swipe}
      exit={reduce ? { opacity: 0 } : { y: "-100%" }}
      transition={{ duration: reduce ? 0.3 : 0.95, ease }}
    >
      <m.div
        className="absolute inset-0"
        initial={reduce ? false : { scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 3.2, ease }}
      >
        <Landscape className="size-full" />
      </m.div>
      {/* Velo para garantizar contraste del texto sobre la ilustración. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,rgb(20_22_32/0.55)_0%,rgb(20_22_32/0.05)_38%,rgb(20_16_22/0.15)_62%,rgb(14_11_16/0.8)_100%)]"
      />
      <div aria-hidden className="paper-grain absolute inset-0 opacity-60" />

      <div className="relative flex h-full flex-col items-center px-6 pt-[max(5rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))] text-center">
        <m.h1
          id="cover-title"
          tabIndex={-1}
          translate="no"
          className="mt-[14svh] font-display text-[clamp(3.5rem,17vw,8rem)] leading-[0.9] tracking-[-0.01em] outline-none [text-shadow:0_2px_30px_rgb(0_0_0/0.25)]"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, delay: 0.5, ease }}
        >
          {event.couple.first}
          <span className="block">&amp; {event.couple.second}</span>
        </m.h1>

        <m.p
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="mt-8 max-w-[19rem] font-display text-[1.375rem] leading-snug text-white/90 italic"
        >
          se casan el{" "}
          <time dateTime={isoDay(event.date)} className="whitespace-nowrap">
            {formatLongDate(event.date)}
          </time>{" "}
          en {event.city}
        </m.p>

        <m.button
          type="button"
          onClick={onOpen}
          className="group mt-auto flex flex-col items-center gap-1.5 rounded-full px-6 py-3 text-white/85 transition-colors hover:text-white"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.6, ease }}
        >
          <span className="text-[0.9375rem]">Desliza o toca para abrir</span>
          <ChevronDown aria-hidden className="nudge size-5 group-hover:translate-y-0.5" />
        </m.button>
      </div>
    </m.section>
  );
}
