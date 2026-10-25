"use client";

import { Pause, Play } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * Grabación de una apertura dentro del móvil. Solo se descarga y se reproduce mientras se ve; con
 * movimiento reducido se queda en el primer fotograma hasta que se pulse «Ver».
 */
export function OpeningReel({ id, label }: { id: string; label: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const [choice, setChoice] = useState<"play" | "pause" | null>(null);
  const playing = choice ? choice === "play" : !reduce;

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    if (!playing) {
      el.pause();
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [playing]);

  return (
    <>
      <video
        ref={video}
        aria-hidden
        muted
        loop
        playsInline
        preload="none"
        poster={`/venta/apertura-${id}.webp`}
        className="absolute inset-0 size-full object-cover"
      >
        <source src={`/venta/apertura-${id}.webm`} type="video/webm" />
        <source src={`/venta/apertura-${id}.mp4`} type="video/mp4" />
      </video>
      <button
        type="button"
        onClick={() => setChoice(playing ? "pause" : "play")}
        aria-label={playing ? `Pausar «${label}»` : `Ver «${label}»`}
        className="absolute right-2 bottom-2 z-10 grid size-9 place-items-center rounded-full bg-ink/70 text-paper backdrop-blur-sm transition-colors hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        {playing ? (
          <Pause aria-hidden className="size-4" />
        ) : (
          <Play aria-hidden className="size-4" />
        )}
      </button>
    </>
  );
}
