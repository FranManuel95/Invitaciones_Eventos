"use client";

import { hostNames } from "@/lib/event-kind";
import { Pointer } from "lucide-react";
import { m, useAnimate, useReducedMotion } from "motion/react";
import { useRef } from "react";
import type { GuestGroup, WeddingEvent } from "@/lib/domain/types";
import { formatLongDate } from "@/lib/format";
import type { Theme } from "@/lib/theme";
import { haptic, playSealCrack, unlockAudio } from "../effects/sound";
import { useOpening } from "./use-opening";

/*
 * Apertura «sobre de película»: un vídeo real (generado con Higgsfield a partir de dos fotos) en
 * el que se rompe el lacre, se levanta la solapa y sale una tarjeta en blanco. Al acabar, los
 * nombres aparecen escritos sobre esa tarjeta, inclinados como ella, y se pasa a la carta.
 * El vídeo es siempre el mismo (no depende del tema) y vive en public/aperturas/sobre-video.
 */

const DIR = "/aperturas/sobre-video";
// Segundos tras empezar el vídeo en que se parte el lacre: un destello dorado lo acompaña y tapa
// el instante en que el vídeo duplica el lacre al levantarse la solapa.
const CRACK_AT = 0.8;
const ease = [0.22, 1, 0.36, 1] as const;

export function VideoEnvelope({
  event,
  group,
  onOpened,
  interactive = true,
}: {
  event: WeddingEvent;
  group: GuestGroup;
  onOpened: () => void;
  interactive?: boolean;
  theme?: Theme;
}) {
  const reduce = useReducedMotion();
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const { opening, begin, alive } = useOpening(interactive);
  const video = useRef<HTMLVideoElement>(null);

  async function open() {
    if (!begin()) return;
    unlockAudio();
    const el = video.current;
    if (reduce || !el) {
      onOpened();
      return;
    }
    animate("[data-heading]", { opacity: 0, y: -10 }, { duration: 0.5 });
    try {
      await el.play();
    } catch {
      // Si el navegador no deja reproducirlo, se pasa directamente a la carta.
      onOpened();
      return;
    }
    await new Promise((r) => setTimeout(r, CRACK_AT * 1000));
    if (!alive.current) return;
    playSealCrack();
    haptic([10, 30, 18]);
    animate(
      "[data-flash]",
      { opacity: [0, 1, 1, 0] },
      { duration: 1.15, times: [0, 0.2, 0.62, 1] },
    );
  }

  async function onEnded() {
    // Los nombres se escriben sobre la tarjeta y, tras un momento, empieza la carta.
    await animate(
      "[data-names]",
      { opacity: [0, 1], filter: ["blur(8px)", "blur(0px)"] },
      { duration: 1.1, ease },
    );
    await new Promise((r) => setTimeout(r, 1200));
    if (!alive.current) return;
    await animate("[data-paper]", { opacity: 1 }, { duration: 0.6 });
    if (alive.current) onOpened();
  }

  return (
    <section
      aria-labelledby="envelope-title"
      inert={!interactive}
      data-opening="pelicula"
      className="fixed inset-0 z-10 overflow-hidden bg-[#e9e0d1]"
    >
      {/* Relleno para pantallas anchas: el primer fotograma, ampliado y desenfocado. */}
      <div
        aria-hidden
        className="absolute inset-0 scale-110 bg-cover bg-center opacity-80 blur-2xl"
        style={{ backgroundImage: `url(${DIR}/inicio.webp)` }}
      />
      <div ref={scope} className="absolute inset-0">
        {/* El vídeo llena el móvil; en pantallas anchas se ve entero, centrado. */}
        <div className="video-envelope-frame @container absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <video
            ref={video}
            poster={`${DIR}/inicio.webp`}
            muted
            playsInline
            preload="auto"
            aria-hidden
            onEnded={() => void onEnded()}
            className="size-full object-cover"
          >
            <source src={`${DIR}/sobre.webm`} type="video/webm" />
            <source src={`${DIR}/sobre.mp4`} type="video/mp4" />
          </video>
          <m.div
            data-flash
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(36%_21%_at_47%_51%,#fffaf0_0%,#fffaf0_30%,rgb(255_238_196/0.98)_55%,rgb(242_212_150/0.6)_75%,transparent_100%),radial-gradient(80%_55%_at_46%_51%,rgb(255_236_190/0.55),transparent_80%)] opacity-0"
          />
          {/* Los nombres, escritos sobre la tarjeta en blanco del último fotograma. */}
          <m.div
            data-names
            aria-hidden
            className="absolute flex flex-col items-center text-center text-[#3d3226] opacity-0"
            style={{ left: "13%", top: "25%", width: "82%", rotate: "11deg" }}
          >
            <span className="text-[2.8cqw] tracking-[0.25em] text-[#6b5a45] uppercase">
              Os invitamos
            </span>
            <span className="mt-3 font-names text-[9cqw] leading-[1] text-balance">
              {hostNames(event.couple)}
            </span>
            <span className="mt-4 font-display text-[4.2cqw] italic">
              {formatLongDate(event.date)}
            </span>
          </m.div>
        </div>

        <div
          data-heading
          className="absolute inset-x-0 top-0 bg-gradient-to-b from-[#f4ede2]/90 via-[#f4ede2]/60 to-transparent px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-16 text-center text-[#3d3226]"
        >
          <p className="caption text-[#6b5a45]">Una invitación para</p>
          <h1
            id="envelope-title"
            tabIndex={-1}
            className="mt-1 font-display text-[clamp(2rem,8vw,3rem)] leading-tight outline-none"
          >
            {group.displayName}
          </h1>
        </div>

        {/* Botón invisible sobre todo el vídeo: tocar en cualquier sitio abre el sobre. */}
        <button
          type="button"
          onClick={() => void open()}
          aria-label="Abrir el sobre"
          aria-disabled={opening}
          className="absolute inset-0 z-10 cursor-pointer focus-visible:outline-offset-[-8px]"
        />

        <p
          data-heading
          aria-live="polite"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-center justify-center gap-2 bg-gradient-to-t from-[#f4ede2]/90 to-transparent px-6 pt-16 pb-[max(2rem,env(safe-area-inset-bottom))] text-[0.9375rem] text-[#4a3b2a]"
        >
          {opening ? (
            "Abriendo…"
          ) : (
            <>
              <Pointer aria-hidden className="size-4" />
              Toca el lacre para abrir el sobre
            </>
          )}
        </p>
      </div>

      {/* El papel de la tarjeta, que llena la pantalla justo antes de la carta. */}
      <m.div
        data-paper
        aria-hidden
        className="pointer-events-none absolute inset-0 z-30 bg-ivory opacity-0"
      />
    </section>
  );
}
