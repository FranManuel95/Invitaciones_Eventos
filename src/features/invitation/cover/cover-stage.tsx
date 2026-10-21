"use client";

import { ChevronDown } from "lucide-react";
import { motion, useReducedMotion, type PanInfo } from "motion/react";
import type { WeddingEvent } from "@/lib/domain/types";
import { Landscape } from "./landscape";

const ease = [0.22, 1, 0.36, 1] as const;

/** Pantalla 1 · Portada cinematográfica. Se abre tocando, deslizando hacia arriba o con teclado. */
export function CoverStage({ event, onOpen }: { event: WeddingEvent; onOpen: () => void }) {
  const reduce = useReducedMotion();

  const handlePanEnd = (_: PointerEvent, info: PanInfo) => {
    if (info.offset.y < -60 || info.velocity.y < -400) onOpen();
  };

  return (
    <motion.section
      aria-labelledby="cover-title"
      className="fixed inset-0 z-20 overflow-hidden bg-[#2f3547] text-white"
      style={{ touchAction: "none" }}
      onPanEnd={handlePanEnd}
      exit={reduce ? { opacity: 0 } : { y: "-100%" }}
      transition={{ duration: reduce ? 0.3 : 0.95, ease }}
    >
      <motion.div
        className="absolute inset-0"
        initial={reduce ? false : { scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 3.2, ease }}
      >
        <Landscape className="size-full" />
      </motion.div>
      {/* Velo para garantizar contraste del texto sobre la ilustración. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,rgb(20_22_32/0.55)_0%,rgb(20_22_32/0.05)_38%,rgb(20_16_22/0.15)_62%,rgb(14_11_16/0.8)_100%)]"
      />
      <div aria-hidden className="paper-grain absolute inset-0 opacity-60" />

      <div className="relative flex h-full flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))] text-center">
        <motion.p
          className="eyebrow text-white/80"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease }}
        >
          Nuestra boda
        </motion.p>

        <motion.h1
          id="cover-title"
          tabIndex={-1}
          className="mt-[12svh] font-display text-[clamp(3.25rem,15vw,6.5rem)] leading-[0.95] font-light text-balance outline-none [text-shadow:0_2px_30px_rgb(0_0_0/0.25)]"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, delay: 0.6, ease }}
        >
          {event.couple.first}
          <span className="block">
            <span className="font-normal italic">&amp;</span> {event.couple.second}
          </span>
        </motion.h1>

        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="mt-7 flex flex-col items-center gap-6"
        >
          <p className="font-sans text-sm tracking-[0.42em] text-white/90">
            <time dateTime={event.date.slice(0, 10)}>{event.dateLabel}</time>
          </p>
          <span aria-hidden className="h-px w-12 bg-white/60" />
          <p className="eyebrow text-white/70">
            {event.city} · {event.region}
          </p>
        </motion.div>

        <motion.button
          type="button"
          onClick={onOpen}
          className="group mt-auto flex flex-col items-center gap-2 rounded-full px-6 py-3 text-white/90 transition-colors hover:text-white"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.6, ease }}
        >
          <span className="text-[0.8125rem] tracking-[0.12em]">Desliza o toca para abrir</span>
          <ChevronDown
            aria-hidden
            className="size-5 group-hover:translate-y-0.5 motion-safe:animate-bounce"
          />
        </motion.button>
      </div>
    </motion.section>
  );
}
