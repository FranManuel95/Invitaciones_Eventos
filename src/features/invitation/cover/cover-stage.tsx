"use client";

import { ChevronDown } from "lucide-react";
import { animate, m, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import dynamic from "next/dynamic";
import { useRef, type PointerEvent } from "react";
import type { WeddingEvent } from "@/lib/domain/types";
import type { CoverId } from "@/lib/theme";
import { formatLongDate, isoDay } from "@/lib/format";
import { playPaper, unlockAudio } from "../effects/sound";
import { SplitText } from "../effects/split-text";
import { useTilt } from "../effects/tilt";
import { CoverPhoto } from "./cover-photo";
import { Landscape } from "./landscape";

const ease = [0.22, 1, 0.36, 1] as const;

// Escenas animadas: cada una en su propio trozo, solo se descarga la que elige la pareja.
const SCENES = {
  luces: dynamic(() => import("./scenes/lights-scene").then((mod) => mod.LightsScene)),
  acuarela: dynamic(() => import("./scenes/watercolor-scene").then((mod) => mod.WatercolorScene)),
  estrellas: dynamic(() => import("./scenes/stars-scene").then((mod) => mod.StarsScene)),
};

/**
 * Pantalla 1 · Portada cinematográfica.
 * Se levanta con el dedo como una hoja: sigue al gesto, vuelve con un muelle si no se suelta
 * lo bastante arriba y sale con inercia si sí. Debajo ya está el sobre esperando.
 * El botón hace lo mismo para quien no quiera (o no pueda) arrastrar.
 */
export function CoverStage({
  event,
  onOpen,
  scene = "foto",
}: {
  event: WeddingEvent;
  onOpen: () => void;
  /** Fondo de la portada: foto en 3D, escena animada o vídeo de la pareja. */
  scene?: CoverId;
}) {
  const reduce = useReducedMotion();
  const tilt = useTilt();
  const lift = useMotionValue(0);
  const opacity = useMotionValue(1);
  const textY = useTransform(lift, (v) => v * 0.18);
  const shade = useTransform(lift, [0, -400], [0, 0.35]);
  const drag = useRef<{ y: number; t: number; lastY: number; lastT: number } | null>(null);
  const opening = useRef(false);

  const height = () => window.innerHeight;

  const finish = (velocity = 0) => {
    if (opening.current) return;
    opening.current = true;
    playPaper(0.7);
    if (reduce) {
      void animate(opacity, 0, { duration: 0.3 }).then(onOpen);
      return;
    }
    void animate(lift, -height() * 1.05, {
      type: "spring",
      velocity,
      stiffness: 120,
      damping: 22,
      restDelta: 2,
    }).then(onOpen);
  };

  const prime = () => {
    unlockAudio();
  };

  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    if (reduce || opening.current) return;
    prime();
    drag.current = { y: e.clientY, t: e.timeStamp, lastY: e.clientY, lastT: e.timeStamp };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d) return;
    const dy = e.clientY - d.y;
    // Hacia abajo ofrece resistencia, como una hoja sujeta por el borde.
    lift.set(dy < 0 ? dy : dy * 0.18);
    d.lastY = e.clientY;
    d.lastT = e.timeStamp;
  };

  const onPointerUp = (e: PointerEvent<HTMLElement>) => {
    // iOS solo desbloquea el audio al terminar el toque, no al empezarlo.
    unlockAudio();
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    const dy = e.clientY - d.y;
    const dt = Math.max(16, e.timeStamp - d.lastT);
    const velocity = ((e.clientY - d.lastY) / dt) * 1000;
    if (dy < -height() * 0.22 || (dy < -24 && velocity < -600)) {
      finish(velocity);
    } else {
      void animate(lift, 0, { type: "spring", stiffness: 260, damping: 24 });
    }
  };

  return (
    <m.section
      aria-labelledby="cover-title"
      data-cover={scene}
      className="fixed inset-0 z-20 overflow-hidden bg-[#2f3547] text-white shadow-[0_30px_60px_rgb(0_0_0/0.45)] select-none"
      style={{ y: lift, opacity, touchAction: "none" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <m.div
        className="absolute inset-0"
        initial={reduce ? false : { scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 3.4, ease }}
      >
        {scene === "luces" || scene === "acuarela" || scene === "estrellas" ? (
          (() => {
            const Scene = SCENES[scene];
            return <Scene />;
          })()
        ) : scene === "video" && event.coverVideo ? (
          <video
            className="absolute inset-0 size-full object-cover"
            src={event.coverVideo}
            poster={event.coverPhoto ?? undefined}
            muted
            playsInline
            loop
            autoPlay={!reduce}
            preload="metadata"
            aria-hidden
          />
        ) : event.coverPhoto ? (
          <CoverPhoto
            src={event.coverPhoto}
            depthSrc={event.coverDepthMap}
            cinematic={!reduce}
            lift={lift}
            tiltX={tilt.x}
            tiltY={tilt.y}
          />
        ) : (
          <Landscape lift={lift} tiltX={tilt.x} tiltY={tilt.y} />
        )}
      </m.div>
      {/* Velo para garantizar el contraste del texto sobre la ilustración. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,rgb(20_22_32/0.55)_0%,rgb(20_22_32/0.05)_38%,rgb(20_16_22/0.15)_62%,rgb(14_11_16/0.8)_100%)]"
        // Las escenas ya son oscuras y están pensadas para el texto blanco: les basta menos velo.
        style={{ opacity: scene === "foto" || scene === "video" ? 1 : 0.45 }}
      />
      {/* Una foto real tiene cielos más claros que la ilustración: algo más de velo tras el título. */}
      {event.coverPhoto ? (
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(90%_45%_at_50%_38%,rgb(20_16_22/0.35),transparent)]"
        />
      ) : null}
      {/* Apertura de película: se parte de negro y la imagen aparece poco a poco. */}
      {reduce ? null : (
        <m.div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-black"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.6, delay: 0.2, ease: "easeOut" }}
        />
      )}
      {/* Al levantarla, la hoja se oscurece un poco: deja de recibir la luz de frente. */}
      <m.div aria-hidden className="absolute inset-0 bg-black" style={{ opacity: shade }} />
      <div aria-hidden className="paper-grain absolute inset-0 opacity-60" />

      <m.div
        className="relative flex h-full flex-col items-center px-6 pt-[max(5rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))] text-center"
        style={{ y: textY }}
      >
        <h1
          id="cover-title"
          tabIndex={-1}
          translate="no"
          className="mt-[14svh] font-names text-[clamp(3.5rem,17vw,8rem)] leading-[0.9] tracking-[-0.01em] outline-none [text-shadow:0_2px_30px_rgb(0_0_0/0.25)]"
        >
          <SplitText text={event.couple.first} delay={1.1} animate={!reduce} className="block" />
          <SplitText
            text={`& ${event.couple.second}`}
            delay={1.1 + event.couple.first.length * 0.045 + 0.15}
            animate={!reduce}
            className="block"
          />
        </h1>

        <m.p
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 2.4 }}
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
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => {
            prime();
            finish();
          }}
          className="group mt-auto flex flex-col items-center gap-1.5 rounded-full px-6 py-3 text-white/85 transition-colors hover:text-white"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 3.1, ease }}
        >
          <span className="text-[0.9375rem]">Desliza o toca para abrir</span>
          <ChevronDown aria-hidden className="nudge size-5 group-hover:translate-y-0.5" />
        </m.button>
      </m.div>
    </m.section>
  );
}
