"use client";

import { hostNames } from "@/lib/event-kind";
import { Pointer } from "lucide-react";
import { m, useAnimate, useReducedMotion, useTransform } from "motion/react";
import { ViewTransition } from "react";
import type { GuestGroup, WeddingEvent } from "@/lib/domain/types";
import { formatLongDate } from "@/lib/format";
import { DEFAULT_THEME, WEIGHTS, type Theme } from "@/lib/theme";
import { FoilMonogram } from "../effects/foil";
import { haptic, playPaper, unlockAudio } from "../effects/sound";
import { useTilt } from "../effects/tilt";
import { Monogram } from "../ornaments";
import { useOpening } from "./use-opening";

/*
 * Apertura «caja con lazo», vista desde arriba: una caja de papel atada con una cinta de seda del
 * color del lacre. Al tocarla, el lazo se deshace (las lazadas se recogen y las cintas se retiran
 * hacia los bordes), la tapa se levanta y sale, y la carta se eleva desde el fondo forrado.
 */

const paper = (angle: string) =>
  `var(--env-texture), linear-gradient(${angle}, var(--env-paper-a), var(--env-paper-b))`;
// Seda: el color de la cera con un brillo que recorre la cinta.
const satin = (angle: string) =>
  `linear-gradient(${angle}, color-mix(in srgb, var(--seal), black 30%), var(--seal) 30%, color-mix(in srgb, var(--seal), white 30%) 50%, var(--seal) 70%, color-mix(in srgb, var(--seal), black 30%))`;

export function RibbonBox({
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
  const tilt = useTilt();
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const { opening, begin, alive } = useOpening(interactive);
  const pace = WEIGHTS[theme.weight].pace;
  const rotateX = useTransform(tilt.y, (v) => v * -6);
  const rotateY = useTransform(tilt.x, (v) => v * 9);

  async function open() {
    if (!begin()) return;
    unlockAudio();
    if (reduce) {
      onOpened();
      return;
    }
    animate("[data-heading]", { opacity: 0, y: -12 }, { duration: 0.45 });
    // 1. Se tira de una punta: las lazadas se recogen hacia el nudo y desaparecen.
    haptic(10);
    playPaper(0.35, 0.03);
    animate("[data-bow-loop]", { pathLength: 0, opacity: 0 }, { duration: 0.6, ease: "easeIn" });
    await animate(
      "[data-bow-knot]",
      { scale: [1, 1.15, 0], opacity: [1, 1, 0] },
      { duration: 0.65 },
    );
    if (!alive.current) return;
    // 2. Las cintas se retiran hacia los bordes.
    animate("[data-ribbon='v']", { scaleY: 0 }, { duration: 0.55, ease: [0.6, 0, 0.8, 0.4] });
    await animate("[data-ribbon='h']", { scaleX: 0 }, { duration: 0.55, ease: [0.6, 0, 0.8, 0.4] });
    if (!alive.current) return;
    // 3. La tapa se levanta hacia la cámara y sale por arriba.
    playPaper(0.8, 0.05);
    await animate("[data-lid]", { scale: 1.06, y: -8 }, { duration: 0.35 * pace, ease: "easeOut" });
    if (!alive.current) return;
    animate(
      "[data-lid]",
      { y: "-130%", rotate: -8, opacity: 0 },
      { duration: 0.85 * pace, ease: [0.55, 0, 0.85, 0.4] },
    );
    // 4. La carta sube desde el fondo de la caja.
    await animate(
      "[data-letter]",
      { scale: [0.94, 1.06], y: [6, -8] },
      { duration: 1, delay: 0.35, ease: [0.33, 0, 0.15, 1] },
    );
    if (!alive.current) return;
    animate("[data-box]", { opacity: 0 }, { duration: 0.4 });
    if (alive.current) onOpened();
  }

  return (
    <section
      aria-labelledby="envelope-title"
      inert={!interactive}
      data-opening="caja"
      className="fixed inset-0 z-10 flex flex-col items-center justify-center overflow-hidden bg-[radial-gradient(120%_80%_at_50%_45%,var(--scene-2)_0%,var(--scene-3)_55%,var(--scene-4)_100%)] px-6 pt-16 pb-10"
    >
      <div aria-hidden className="paper-grain absolute inset-0" />
      <div ref={scope} className="relative flex w-full flex-col items-center">
        <div data-heading className="mb-8 flex flex-col items-center text-center text-ink-soft">
          <Monogram
            first={event.couple.first}
            second={event.couple.second}
            className="mb-4 size-11"
          />
          <p className="caption text-ink-soft">Una invitación para</p>
          <h1
            id="envelope-title"
            tabIndex={-1}
            className="mt-1 font-display text-[clamp(2rem,8vw,3rem)] leading-tight text-ink outline-none"
          >
            {group.displayName}
          </h1>
        </div>

        <m.div
          className="relative block aspect-[4/5] w-[min(74vw,340px)]"
          style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 1300 }}
        >
          {/* Botón vacío encima del dibujo: su nombre accesible no compite con los textos. */}
          <button
            type="button"
            onClick={() => void open()}
            aria-label="Abrir la caja"
            aria-disabled={opening}
            className="absolute inset-0 z-30 cursor-pointer rounded-[4px] focus-visible:outline-offset-8"
          />
          {/* Fondo de la caja, forrado. */}
          <span
            data-box
            aria-hidden
            className="absolute inset-0 block rounded-[4px] shadow-[0_26px_40px_-16px_rgb(35_30_15/0.5)]"
            style={{ background: "var(--env-liner)" }}
          >
            <span className="absolute inset-0 block rounded-[4px] shadow-[inset_0_0_0_6px_var(--env-inside),inset_0_10px_24px_rgb(0_0_0/0.35)]" />
          </span>

          {/* Carta dentro de la caja. */}
          <ViewTransition name="carta" share="paper-morph" default="none">
            <m.span
              data-letter
              aria-hidden
              className="paper-grain absolute inset-[7%] block rounded-[2px] bg-paper shadow-[0_6px_14px_rgb(35_30_15/0.25)]"
            >
              <span className="flex h-full flex-col items-center justify-center px-5 text-center">
                <FoilMonogram
                  first={event.couple.first}
                  second={event.couple.second}
                  className="size-11 text-[2.75rem]"
                />
                <span className="letterpress mt-4 block font-names text-[2rem] leading-none text-ink">
                  {hostNames(event.couple)}
                </span>
                <span className="caption mt-2 block text-ink-soft">
                  {formatLongDate(event.date)}
                </span>
              </span>
            </m.span>
          </ViewTransition>

          {/* Tapa con la cinta en cruz y el lazo. */}
          <m.span data-lid aria-hidden className="absolute -inset-[3%] z-10 block">
            <span
              className="paper-grain absolute inset-0 block rounded-[5px] shadow-[0_2px_0_color-mix(in_srgb,var(--env-paper-b),black_18%),0_14px_24px_-10px_rgb(35_30_15/0.45)]"
              style={{ backgroundImage: paper("150deg") }}
            />
            <m.span
              data-ribbon="v"
              className="absolute inset-y-0 left-1/2 block w-[13%] -translate-x-1/2 shadow-[0_0_3px_rgb(0_0_0/0.25)]"
              style={{ background: satin("90deg"), transformOrigin: "50% 0%" }}
            />
            <m.span
              data-ribbon="h"
              className="absolute inset-x-0 top-1/2 block h-[10.5%] -translate-y-1/2 shadow-[0_0_3px_rgb(0_0_0/0.25)]"
              style={{ background: satin("180deg"), transformOrigin: "100% 50%" }}
            />
            <svg
              viewBox="0 0 120 80"
              className="absolute top-1/2 left-1/2 w-[58%] -translate-x-1/2 -translate-y-[58%] overflow-visible drop-shadow-[0_3px_3px_rgb(0_0_0/0.3)]"
            >
              {/* Lazadas y caídas de la cinta, en el color de la cera. */}
              {[
                "M60 40C44 14 14 10 12 28C10 44 38 46 60 40",
                "M60 40C76 14 106 10 108 28C110 44 82 46 60 40",
                "M60 42C52 56 44 70 34 78",
                "M60 42C68 56 78 68 90 76",
              ].map((d) => (
                <m.path
                  key={d}
                  data-bow-loop
                  d={d}
                  fill="none"
                  style={{ stroke: "var(--seal)" }}
                  strokeWidth="9"
                  strokeLinecap="round"
                />
              ))}
              {["M60 40C44 14 14 10 12 28", "M60 40C76 14 106 10 108 28"].map((d) => (
                <m.path
                  key={d}
                  data-bow-loop
                  d={d}
                  fill="none"
                  stroke="#fff"
                  strokeOpacity=".3"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              ))}
              <m.ellipse
                data-bow-knot
                cx="60"
                cy="41"
                rx="9"
                ry="7.5"
                style={{
                  fill: "color-mix(in srgb, var(--seal), black 15%)",
                  transformOrigin: "60px 41px",
                }}
              />
            </svg>
          </m.span>
        </m.div>

        <p
          data-heading
          aria-live="polite"
          className="mt-10 flex items-center gap-2 text-[0.9375rem] text-ink-soft"
        >
          {opening ? (
            "Abriendo…"
          ) : (
            <>
              <Pointer aria-hidden className="size-4" />
              Toca el lazo para abrir la caja
            </>
          )}
        </p>
      </div>
    </section>
  );
}
