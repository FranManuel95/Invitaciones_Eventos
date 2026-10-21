"use client";

import { m } from "motion/react";
import Image from "next/image";
import { useEffect } from "react";
import type { WeddingEvent } from "@/lib/domain/types";

/**
 * Apertura corta para quien vuelve a la invitación en la misma sesión: la foto de portada y
 * los nombres durante un instante, y luego el contenido. Un toque la adelanta.
 */
export function BriefStage({ event, onDone }: { event: WeddingEvent; onDone: () => void }) {
  useEffect(() => {
    const id = window.setTimeout(onDone, 1900);
    return () => window.clearTimeout(id);
  }, [onDone]);

  return (
    <section
      aria-labelledby="brief-title"
      className="fixed inset-0 z-20 grid place-items-center overflow-hidden bg-black text-white"
      onClick={onDone}
    >
      {event.coverPhoto ? (
        <m.div
          aria-hidden
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 0.75, scale: 1.02 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={event.coverPhoto}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </m.div>
      ) : null}
      <m.h1
        id="brief-title"
        tabIndex={-1}
        translate="no"
        className="relative text-center font-display text-[clamp(3rem,14vw,6.5rem)] leading-[0.92] outline-none [text-shadow:0_2px_30px_rgb(0_0_0/0.35)]"
        initial={{ opacity: 0, filter: "blur(8px)", y: 10 }}
        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {event.couple.first}
        <span className="block">&amp; {event.couple.second}</span>
      </m.h1>
    </section>
  );
}
