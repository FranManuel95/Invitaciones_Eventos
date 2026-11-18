"use client";

import { Pause, Play } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * El sobre de la portada de la venta: el vídeo real de la apertura, en bucle y sin sonido. Con
 * movimiento reducido se queda en un fotograma hasta que se pulse «Reproducir».
 */
export function HeroFilm() {
  const video = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const [choice, setChoice] = useState<"play" | "pause" | null>(null);
  const playing = choice ? choice === "play" : !reduce;

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    if (playing) el.play().catch(() => {});
    else el.pause();
  }, [playing]);

  return (
    <>
      <video
        ref={video}
        aria-hidden
        muted
        loop
        playsInline
        preload="auto"
        poster="/venta/portada-sobre.webp"
        className="absolute inset-0 size-full object-cover"
      >
        <source src="/venta/portada-sobre.webm" type="video/webm" />
        <source src="/venta/portada-sobre.mp4" type="video/mp4" />
      </video>
      <button
        type="button"
        onClick={() => setChoice(playing ? "pause" : "play")}
        aria-label={playing ? "Pausar el vídeo del sobre" : "Reproducir el vídeo del sobre"}
        className="absolute right-3 bottom-3 grid size-10 place-items-center rounded-full bg-[var(--tinta)]/60 text-[var(--papel)] backdrop-blur-sm transition-colors hover:bg-[var(--tinta)]/85"
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
