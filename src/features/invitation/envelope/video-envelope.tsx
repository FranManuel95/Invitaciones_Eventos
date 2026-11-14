"use client";

import { Pointer } from "lucide-react";
import { m, useAnimate, useReducedMotion } from "motion/react";
import { useEffect, useRef, useSyncExternalStore, ViewTransition } from "react";
import type { GuestGroup, WeddingEvent } from "@/lib/domain/types";
import { DEFAULT_THEME, type Theme } from "@/lib/theme";
import { haptic, isMuted, subscribeMuted, unlockAudio } from "../effects/sound";
import { LetterMiniature } from "../letter/letter-miniature";
import { LETTER_SET, LETTER_SPOTLIGHT, letterFrame } from "../letter/letter-stage";
import { useOpening } from "./use-opening";

/*
 * Apertura «sobre de película»: un vídeo real (Higgsfield) de un sobre blanco con lacre dorado
 * sobre lino, con paniculata y luz de ventana. El lacre se parte con migas de oro, la solapa se abre
 * y del interior sale un destello dorado. En ese destello el papel llena la pantalla y entra la
 * carta de la invitación, con el saludo al invitado.
 * Hay dos encuadres del mismo vídeo: vertical para el móvil y horizontal para pantallas anchas.
 * Trae su propio sonido (ambiente, el golpe del lacre, el papel y el brillo), que respeta el botón
 * de silencio de la invitación.
 */

const DIR = "/aperturas/sobre-dorado";
// Segundos en que el lacre se rompe (vibración) y en que empieza el destello final. Cada
// encuadre es un vídeo distinto: el vertical es una sola toma de 10 s; el horizontal, de 8 s.
// Los sobres de color solo tienen encuadre vertical: en pantallas anchas se recorta.
const TIMING = {
  vertical: { crack: 2.2, glow: 8.9 },
  horizontal: { crack: 2.5, glow: 7.1 },
  salvia: { crack: 2.6, glow: 8.9 },
  burdeos: { crack: 2.2, glow: 8.9 },
} as const;

const WIDE = "(min-aspect-ratio: 1/1)";
function subscribeWide(callback: () => void) {
  const query = window.matchMedia(WIDE);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
const isWide = () => window.matchMedia(WIDE).matches;

export function VideoEnvelope({
  event,
  group,
  onOpened,
  interactive = true,
  theme = DEFAULT_THEME,
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
  const finished = useRef(false);
  const shaken = useRef(false);
  const wide = useSyncExternalStore(subscribeWide, isWide, () => false);
  const frame = letterFrame(event, theme);
  const cut = theme.film !== "blanco" ? theme.film : wide ? "horizontal" : "vertical";

  // El botón de silencio de la invitación también calla el vídeo.
  useEffect(() => {
    const sync = () => {
      if (video.current) video.current.muted = isMuted();
    };
    sync();
    const unsubscribe = subscribeMuted(sync);
    return () => {
      unsubscribe();
    };
  }, [cut]);

  // Al final, el destello dorado se funde con el papel y aparece la carta.
  async function finish() {
    if (finished.current || !alive.current) return;
    finished.current = true;
    if (reduce) {
      onOpened();
      return;
    }
    // La luz del sobre se funde con la pantalla de la carta (su fondo y su foco) y de ella sale
    // la carta, ya escrita, hasta su sitio exacto: al pasar a esa pantalla no cambia nada.
    animate("[data-paper]", { opacity: 1 }, { duration: 0.8, ease: "easeIn" });
    await animate(
      "[data-letter]",
      { opacity: [0, 1], scale: [0.5, 1], y: ["22%", "0%"] },
      { duration: 1.05, delay: 0.25, ease: [0.22, 1, 0.36, 1] },
    );
    if (alive.current) onOpened();
  }

  async function open() {
    if (!begin()) return;
    unlockAudio();
    const el = video.current;
    if (reduce || !el) {
      void finish();
      return;
    }
    animate("[data-heading]", { opacity: 0, y: -10 }, { duration: 0.5 });
    // Red de seguridad: si el vídeo no avanza (formato que no se pinta, red lenta), se sigue.
    const watchdog = window.setTimeout(() => {
      if (el.currentTime < 0.3) void finish();
    }, 4000);
    el.muted = isMuted();
    try {
      await el.play();
    } catch {
      // Si no deja reproducir con sonido, se intenta sin él; si tampoco, se pasa a la carta.
      try {
        el.muted = true;
        await el.play();
      } catch {
        window.clearTimeout(watchdog);
        void finish();
      }
    }
  }

  function onTimeUpdate() {
    const el = video.current;
    if (!el) return;
    const { crack, glow } = TIMING[cut];
    if (!shaken.current && el.currentTime >= crack) {
      shaken.current = true;
      haptic([10, 30, 18]);
    }
    if (el.currentTime >= glow) void finish();
  }

  return (
    <section
      aria-labelledby="envelope-title"
      inert={!interactive}
      data-opening="pelicula"
      className="fixed inset-0 z-10 overflow-hidden bg-[#e8dfd2]"
    >
      <div ref={scope} className="absolute inset-0">
        <video
          key={cut}
          ref={video}
          poster={`${DIR}/${cut}.webp`}
          playsInline
          preload="auto"
          aria-hidden
          onTimeUpdate={onTimeUpdate}
          onEnded={() => void finish()}
          onError={() => {
            if (opening) void finish();
          }}
          className="absolute inset-0 size-full object-cover"
        >
          {/* MP4 (H.264) primero, con su códec exacto: el iPhone solo elige lo que de verdad
              reproduce. El WebM queda para navegadores sin H.264. */}
          <source src={`${DIR}/${cut}.mp4`} type='video/mp4; codecs="avc1.640028, mp4a.40.2"' />
          <source src={`${DIR}/${cut}.webm`} type='video/webm; codecs="vp9, opus"' />
        </video>

        <div
          data-heading
          className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-[#f4ede2]/90 via-[#f4ede2]/60 to-transparent px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-16 text-center text-[#3d3226]"
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

        {/* La pantalla de la carta, que llega con el destello: fondo, foco y la carta en el sitio
            y con la inclinación que tendrá después. */}
        <m.div
          data-paper
          aria-hidden
          className={`pointer-events-none absolute inset-0 z-30 opacity-0 ${LETTER_SET}`}
        >
          <div className="paper-grain absolute inset-0" />
          <div className={`absolute inset-0 ${LETTER_SPOTLIGHT}`} />
          <div className={frame.className}>
            <ViewTransition name="carta" share="paper-morph" default="none">
              <m.div data-letter className="opacity-0">
                <LetterMiniature event={event} group={group} theme={theme} />
              </m.div>
            </ViewTransition>
          </div>
        </m.div>
      </div>
    </section>
  );
}
