"use client";

import { Pointer } from "lucide-react";
import { m, useAnimate, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { GuestGroup, WeddingEvent } from "@/lib/domain/types";
import { quadToMatrix3d, scaleQuad, type Quad } from "@/lib/quad";
import type { Theme } from "@/lib/theme";
import { haptic, playSealCrack, unlockAudio } from "../effects/sound";
import { useOpening } from "./use-opening";

/*
 * Apertura «sobre de película»: un vídeo real (generado con Higgsfield a partir de dos fotos) en
 * el que se rompe el lacre, se levanta la solapa y sale una tarjeta en blanco. Al acabar, la
 * tarjeta hace de carta: el saludo al invitado, el mensaje y el botón para descubrir la invitación
 * aparecen impresos en ella, pegados a sus cuatro esquinas con su perspectiva (los nombres ya
 * salen en la portada).
 * El vídeo es siempre el mismo (no depende del tema) y vive en public/aperturas/sobre-video.
 */

const DIR = "/aperturas/sobre-video";
// Segundos tras empezar el vídeo en que entra el primer plano del lacre: suena y vibra.
const CRACK_AT = 2.95;
// Esquinas de la tarjeta en el último fotograma (fracciones del vídeo, medidas sobre final.webp):
// arriba-izquierda, arriba-derecha, abajo-derecha y abajo-izquierda.
const CARD: Quad = [
  [228 / 720, 358 / 1280],
  [576 / 720, 392 / 1280],
  [495 / 720, 938 / 1280],
  [145 / 720, 860 / 1280],
];
// La tarjeta «plana» sobre la que se maqueta el texto antes de pegarla (misma proporción).
const CARD_W = 500;
const CARD_H = 725;
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
  // La tarjeta ya está fuera: al acabar el vídeo, o directamente con movimiento reducido.
  const [done, setDone] = useState(false);
  const doneRef = useRef(false);
  const [still, setStill] = useState(false);
  const greeting = useRef<HTMLHeadingElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [cardTransform, setCardTransform] = useState<string | null>(null);

  // El texto se pega a la tarjeta según el tamaño real del vídeo en pantalla.
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const fit = () =>
      setCardTransform(
        quadToMatrix3d(CARD_W, CARD_H, scaleQuad(CARD, el.offsetWidth, el.offsetHeight)),
      );
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (done) greeting.current?.focus({ preventScroll: true });
  }, [done]);

  const finish = (withStill: boolean) => {
    if (withStill) video.current?.pause();
    doneRef.current = true;
    setStill(withStill);
    setDone(true);
  };

  // Red de seguridad: si el vídeo da error o no avanza, se muestra ya la tarjeta abierta. Así la
  // apertura nunca se queda parada (p. ej., un navegador que elige un formato que luego no pinta).
  const fallBack = () => {
    if (alive.current && !doneRef.current) finish(true);
  };

  async function open() {
    if (!begin()) return;
    unlockAudio();
    const el = video.current;
    if (reduce || !el) {
      finish(true);
      return;
    }
    animate("[data-heading]", { opacity: 0, y: -10 }, { duration: 0.5 });
    const watchdog = setTimeout(() => {
      if (el.currentTime < 0.3) fallBack();
    }, 4000);
    try {
      await el.play();
    } catch {
      // Si el navegador no deja reproducirlo, se muestra ya la tarjeta abierta.
      clearTimeout(watchdog);
      fallBack();
      return;
    }
    await new Promise((r) => setTimeout(r, CRACK_AT * 1000));
    if (!alive.current) return;
    playSealCrack();
    haptic([10, 30, 18]);
  }

  async function continueToInvitation() {
    await animate("[data-paper]", { opacity: 1 }, { duration: reduce ? 0 : 0.5 });
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
        <div
          ref={frame}
          className="video-envelope-frame absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <video
            ref={video}
            poster={`${DIR}/inicio.webp`}
            muted
            playsInline
            preload="auto"
            aria-hidden
            onEnded={() => finish(false)}
            onError={() => {
              if (opening) fallBack();
            }}
            className="size-full object-cover"
          >
            {/* MP4 (H.264) primero, con su códec exacto: el iPhone solo elige lo que de verdad
                reproduce. El WebM queda para navegadores sin H.264. */}
            <source src={`${DIR}/sobre.mp4`} type='video/mp4; codecs="avc1.64001F"' />
            <source src={`${DIR}/sobre.webm`} type='video/webm; codecs="vp9"' />
          </video>
          {/* Último fotograma, para quien no ve el vídeo (movimiento reducido o sin vídeo). */}
          {still ? (
            // eslint-disable-next-line @next/next/no-img-element -- fotograma fijo a pantalla completa
            <img
              src={`${DIR}/final.webp`}
              alt=""
              className="absolute inset-0 size-full object-cover"
            />
          ) : null}
          {/* La tarjeta hace de carta: saludo, mensaje y botón, impresos sobre ella. */}
          {done && cardTransform ? (
            <m.div
              initial={reduce ? false : { opacity: 0, filter: "blur(6px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.1, ease }}
              className="absolute top-0 left-0 z-20 flex flex-col items-center justify-center px-[78px] pt-[150px] pb-[140px] text-center text-[#3d3226]"
              style={{
                width: CARD_W,
                height: CARD_H,
                transformOrigin: "0 0",
                transform: cardTransform,
              }}
            >
              <h2
                ref={greeting}
                id="letter-title"
                tabIndex={-1}
                className="font-display text-[46px] leading-[1.05] text-balance outline-none"
              >
                Hola, {group.displayName}:
              </h2>
              <p className="mt-5 line-clamp-6 text-[20px] leading-relaxed text-pretty text-[#4a3b2a]">
                {event.cardMessage}
              </p>
              <button
                type="button"
                onClick={() => void continueToInvitation()}
                className="mt-7 rounded-[3px] bg-[#2f2a22] px-8 py-3.5 text-[19px] font-medium text-[#f4ede2] transition-colors hover:bg-[#1f1b15]"
              >
                Descubrir la invitación
              </button>
            </m.div>
          ) : null}
        </div>

        <div
          data-heading
          style={done ? { opacity: 0 } : undefined}
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
        {done ? null : (
          <button
            type="button"
            onClick={() => void open()}
            aria-label="Abrir el sobre"
            aria-disabled={opening}
            className="absolute inset-0 z-10 cursor-pointer focus-visible:outline-offset-[-8px]"
          />
        )}

        <p
          data-heading
          aria-live="polite"
          style={done ? { opacity: 0 } : undefined}
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

      {/* El papel, que llena la pantalla justo antes de la invitación. */}
      <m.div
        data-paper
        aria-hidden
        className="pointer-events-none absolute inset-0 z-30 bg-ivory opacity-0"
      />
    </section>
  );
}
