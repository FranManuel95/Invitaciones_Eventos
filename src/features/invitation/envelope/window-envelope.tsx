"use client";

import { ChevronsUp } from "lucide-react";
import {
  animate as animateValue,
  useAnimate,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import { useEffect, useRef, useState, ViewTransition, type PointerEvent } from "react";
import type { GuestGroup, WeddingEvent } from "@/lib/domain/types";
import { lerpQuad, quadBounds, quadToMatrix3d, scaleQuad, type Quad } from "@/lib/quad";
import { DEFAULT_THEME, type Theme } from "@/lib/theme";
import { haptic, playPaper, playSealCrack, unlockAudio } from "../effects/sound";
import { WaxSealArt } from "../ornaments";
import { EnvelopeStage } from "./envelope-stage";
import { breakSeal, SealBreakPieces } from "./seal-break";
import { LetterMiniature } from "../letter/letter-miniature";
import { useOpening } from "./use-opening";
import { WINDOW_FRAMES as META } from "./window-frames";

/*
 * Apertura «sobre junto a la ventana»: una secuencia de fotogramas renderizada en Blender (papel,
 * lino y luz de ventana con sombra de ramas) que avanza con el dedo. El invitado rompe el lacre,
 * levanta la solapa y saca la tarjeta deslizando hacia arriba; si solo toca, se abre sola. El
 * lacre del tema va encima de la foto y el texto se imprime en la tarjeta siguiendo sus cuatro
 * esquinas en cada fotograma (con mezcla «multiplicar», así la sombra de las ramas también lo
 * oscurece, como a la tinta de verdad).
 */

const DIR = "/aperturas/sobre-ventana";
const src = (i: number) => `${DIR}/f${String(i).padStart(2, "0")}.webp`;
// Texto maquetado en una tarjeta plana con la proporción de la tarjeta renderizada.
const TEXT_W = 500;
const TEXT_H = Math.round(TEXT_W / META.cardRatio);
const LAST = META.frames - 1;
// A partir de este punto del recorrido la tarjeta ya asoma.
const CARD_FROM = (META.flapFrames - 1) / LAST;

interface OpeningProps {
  event: WeddingEvent;
  group: GuestGroup;
  onOpened: () => void;
  interactive?: boolean;
  theme?: Theme;
}

export function WindowEnvelope(props: OpeningProps) {
  const [failed, setFailed] = useState(false);
  if (failed) return <EnvelopeStage {...props} />;
  return <WindowEnvelopeStage {...props} onFail={() => setFailed(true)} />;
}

function WindowEnvelopeStage({
  event,
  group,
  onOpened,
  interactive = true,
  theme = DEFAULT_THEME,
  onFail,
}: OpeningProps & { onFail: () => void }) {
  const reduce = useReducedMotion();
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const { opening, begin, alive } = useOpening(interactive);
  const frame = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const text = useRef<HTMLDivElement>(null);
  const images = useRef<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [done, setDone] = useState(false);
  const progress = useMotionValue(0);
  const drag = useRef<{ y: number; from: number; moved: boolean } | null>(null);
  const dragged = useRef(false);
  const broken = useRef(false);
  const sounds = useRef({ flap: false, card: false });
  const size = useRef({ w: 0, h: 0 });

  // Fotogramas: se descargan mientras el invitado ve la portada.
  useEffect(() => {
    let cancelled = false;
    const list = Array.from({ length: META.frames }, (_, i) => {
      const img = new Image();
      img.src = src(i);
      return img;
    });
    images.current = list;
    Promise.all(list.map((img) => img.decode()))
      .then(() => {
        if (!cancelled) setLoaded(true);
      })
      .catch(() => {
        if (!cancelled) onFail();
      });
    return () => {
      cancelled = true;
    };
  }, [onFail]);

  // Pinta el fotograma del recorrido (fundiendo con el siguiente) y coloca el texto encima.
  useEffect(() => {
    if (!loaded) return;
    const el = frame.current;
    const cv = canvas.current;
    const ctx = cv?.getContext("2d");
    if (!el || !cv || !ctx) return;
    const draw = (p: number) => {
      const { w, h } = size.current;
      const f = Math.min(LAST, Math.max(0, p * LAST));
      const i = Math.floor(f);
      const t = f - i;
      const next = Math.min(LAST, i + 1);
      ctx.globalAlpha = 1;
      ctx.drawImage(images.current[i]!, 0, 0, cv.width, cv.height);
      if (t > 0.02 && next !== i) {
        ctx.globalAlpha = t;
        ctx.drawImage(images.current[next]!, 0, 0, cv.width, cv.height);
      }
      if (text.current) {
        const quad = lerpQuad(META.cards[i] as Quad, META.cards[next] as Quad, t);
        text.current.style.transform = quadToMatrix3d(TEXT_W, TEXT_H, scaleQuad(quad, w, h));
        text.current.style.opacity = p >= CARD_FROM ? "1" : "0";
      }
      // Sonido de papel al levantar la solapa y al sacar la tarjeta.
      if (p > 0.04 && !sounds.current.flap) {
        sounds.current.flap = true;
        playPaper(0.7, 0.02);
      }
      if (p > CARD_FROM + 0.05 && !sounds.current.card) {
        sounds.current.card = true;
        playPaper(0.9, 0.02);
      }
    };
    const fit = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      size.current = { w: el.offsetWidth, h: el.offsetHeight };
      cv.width = Math.round(el.offsetWidth * dpr);
      cv.height = Math.round(el.offsetHeight * dpr);
      draw(progress.get());
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(el);
    const stop = progress.on("change", draw);
    return () => {
      observer.disconnect();
      stop();
    };
  }, [loaded, progress]);

  async function crack() {
    if (broken.current) return;
    broken.current = true;
    unlockAudio();
    playSealCrack();
    haptic([10, 30, 18]);
    animate("[data-heading]", { opacity: 0 }, { duration: 0.4 });
    const sealSize = scope.current?.querySelector("[data-seal]")?.getBoundingClientRect().width;
    await breakSeal(animate, scope, { size: sealSize ?? 70, fall: 1.8 });
  }

  function finish() {
    if (!alive.current) return;
    setDone(true);
    // La tarjeta de la foto ya está quieta: su copia de papel se transforma en la carta grande.
    window.setTimeout(() => {
      if (alive.current) onOpened();
    }, 80);
  }

  async function playTo(target: number, duration: number) {
    await animateValue(progress, target, { duration, ease: [0.42, 0, 0.22, 1] });
    if (alive.current && target === 1) finish();
  }

  // Tocar: se abre sola.
  async function open() {
    if (!begin()) return;
    if (reduce) {
      onOpened();
      return;
    }
    await crack();
    if (!alive.current) return;
    if (!loaded) {
      onOpened();
      return;
    }
    await playTo(1, 2.4);
  }

  // Deslizar hacia arriba: el dedo lleva la solapa y la tarjeta.
  function onPointerDown(e: PointerEvent<HTMLButtonElement>) {
    if (!interactive || !loaded || reduce || done) return;
    if (opening && !drag.current && !broken.current) return;
    drag.current = { y: e.clientY, from: progress.get(), moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: PointerEvent<HTMLButtonElement>) {
    const d = drag.current;
    if (!d) return;
    const dy = d.y - e.clientY;
    if (!d.moved && Math.abs(dy) < 10) return;
    if (!d.moved) {
      d.moved = true;
      begin();
      void crack();
    }
    const travel = (size.current.h || window.innerHeight) * 0.55;
    progress.set(Math.min(1, Math.max(0, d.from + dy / travel)));
  }

  function onPointerUp() {
    const d = drag.current;
    drag.current = null;
    if (!d?.moved) return;
    dragged.current = true;
    const p = progress.get();
    // Si se suelta pronto, la solapa vuelve; si no, la tarjeta termina de salir.
    if (p < 0.2) void playTo(0, 0.5);
    else void playTo(1, Math.max(0.5, (1 - p) * 2));
  }

  const last = META.cards[LAST] as Quad;
  const [cl, ct, cw, ch] = quadBounds(last);
  const [leftTop, tip, rightTop] = META.pocket as [number, number][];
  const pct = (v: number) => `${(v * 100).toFixed(2)}%`;
  // Lo que queda por encima del borde del bolsillo: la tarjeta solo se ve ahí mientras sale.
  const aboveTheFold = `polygon(0 0, 100% 0, 100% ${pct(rightTop![1])}, ${pct(rightTop![0])} ${pct(rightTop![1])}, ${pct(tip![0])} ${pct(tip![1])}, ${pct(leftTop![0])} ${pct(leftTop![1])}, 0 ${pct(leftTop![1])})`;

  // La carta de la invitación, solo la tinta: se imprime sobre la tarjeta de la foto.
  const printed = (
    <LetterMiniature
      event={event}
      group={group}
      theme={theme}
      bare
      fitHeight="box"
      className="size-full"
    />
  );

  return (
    <section
      aria-labelledby="envelope-title"
      inert={!interactive}
      data-opening="ventana"
      className="fixed inset-0 z-10 overflow-hidden bg-[#cdb79a]"
    >
      <div ref={scope} className="absolute inset-0">
        <div
          ref={frame}
          className="photo-envelope-frame absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          {/* Primer fotograma mientras llegan los demás. */}
          {/* eslint-disable-next-line @next/next/no-img-element -- fotograma a pantalla completa */}
          <img src={src(0)} alt="" className="absolute inset-0 size-full" />
          <canvas
            ref={canvas}
            aria-hidden
            className={`absolute inset-0 size-full ${loaded ? "" : "invisible"}`}
          />

          {/* Texto impreso en la tarjeta: visible solo por encima del bolsillo. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-multiply"
            style={{ clipPath: done ? undefined : aboveTheFold }}
          >
            <div
              ref={text}
              className="absolute top-0 left-0 opacity-0"
              style={{ width: TEXT_W, height: TEXT_H, transformOrigin: "0 0" }}
            >
              {printed}
            </div>
          </div>

          {/* Lacre del tema en la punta de la solapa. */}
          <div
            aria-hidden
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
            style={{
              left: pct(META.seal[0]!),
              top: pct(META.seal[1]!),
              width: pct(META.sealSize),
            }}
          >
            <div
              data-seal
              className="relative aspect-square drop-shadow-[0_3px_3px_rgb(50_25_10/0.45)]"
            >
              <span data-seal-whole className="absolute inset-0 block">
                <WaxSealArt
                  monogram={event.couple.monogram}
                  shape={theme.sealShape}
                  mark={theme.sealMark}
                  className="size-full"
                />
              </span>
              <SealBreakPieces
                monogram={event.couple.monogram}
                shape={theme.sealShape}
                mark={theme.sealMark}
              />
            </div>
          </div>

          {/* Copia de papel de la tarjeta final: se transforma en la carta grande. */}
          <ViewTransition name="carta" share="paper-morph" default="none">
            <div
              aria-hidden
              className={`absolute overflow-hidden ${done ? "opacity-100" : "opacity-0"}`}
              style={{
                left: pct(cl),
                top: pct(ct),
                width: pct(cw),
                height: pct(ch),
                backgroundImage: `url(${src(LAST)})`,
                backgroundSize: `${100 / cw}% ${100 / ch}%`,
                backgroundPosition: `${(cl / (1 - cw)) * 100}% ${(ct / (1 - ch)) * 100}%`,
              }}
            >
              <div className="absolute inset-0 mix-blend-multiply">{printed}</div>
            </div>
          </ViewTransition>
        </div>

        <div
          data-heading
          className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-[#efe3d0]/85 to-transparent px-6 pt-[max(4.5rem,env(safe-area-inset-top))] pb-14 text-center text-[#3d3226]"
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

        {/* Toda la pantalla responde: tocar abre el sobre; deslizar hacia arriba lo abre con el dedo. */}
        {done ? null : (
          <button
            type="button"
            onClick={() => {
              // El clic que sigue a un arrastre no cuenta como toque.
              if (dragged.current) {
                dragged.current = false;
                return;
              }
              if (!broken.current) void open();
              else if (progress.get() < 1 && !progress.isAnimating()) void playTo(1, 2);
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            aria-label="Abrir el sobre"
            aria-disabled={opening}
            className="absolute inset-0 z-20 cursor-pointer touch-none focus-visible:outline-offset-[-8px]"
          />
        )}

        <p
          data-heading
          role="status"
          aria-live="polite"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex items-center justify-center gap-2 bg-gradient-to-t from-[#efe3d0]/85 to-transparent px-6 pt-14 pb-[max(2rem,env(safe-area-inset-bottom))] text-[0.9375rem] text-[#4a3b2a]"
        >
          {opening ? (
            "Abriendo…"
          ) : (
            <>
              <ChevronsUp aria-hidden className="size-4" />
              Toca o desliza hacia arriba para abrir
            </>
          )}
        </p>
      </div>
    </section>
  );
}
