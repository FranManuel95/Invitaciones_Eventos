"use client";

import { Pointer } from "lucide-react";
import { m, useAnimate, useReducedMotion, useTransform } from "motion/react";
import { ViewTransition } from "react";
import type { GuestGroup, WeddingEvent } from "@/lib/domain/types";
import { formatLongDate } from "@/lib/format";
import { DEFAULT_THEME, WEIGHTS, type Theme } from "@/lib/theme";
import { FoilMonogram } from "../effects/foil";
import { haptic, playPaper, playSealCrack, unlockAudio } from "../effects/sound";
import { useTilt } from "../effects/tilt";
import { Monogram, WaxSealArt } from "../ornaments";
import { useOpening } from "./use-opening";

/*
 * Apertura «díptico»: una tarjeta de dos hojas cerrada con el lacre en el centro. Al tocarla, el
 * lacre se parte y las hojas giran hacia los lados (rotateY desde cada borde exterior) como unas
 * puertas, con una sombra interior que se aclara al abrirse. Dentro espera la carta, que se
 * transforma en la carta grande.
 */

const paper = (angle: string) =>
  `var(--env-texture), linear-gradient(${angle}, var(--env-paper-a), var(--env-paper-b))`;

export function Diptych({
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
    await animate("[data-seal]", { scale: [1, 0.86, 1.04] }, { duration: 0.32, ease: "easeOut" });
    if (!alive.current) return;
    playSealCrack();
    haptic([8, 30, 14]);
    animate("[data-seal]", { opacity: 0, scale: 0.6, y: 40 }, { duration: 0.5, ease: "easeIn" });

    // Las hojas se abren a la vez, con una pequeña diferencia: la mano tira primero de la derecha.
    playPaper(0.7, 0.05);
    animate("[data-door-shade]", { opacity: [0.45, 0] }, { duration: 1.1 * pace, delay: 0.15 });
    animate(
      "[data-door='l']",
      { rotateY: -168 },
      { duration: 1.15 * pace, delay: 0.12, ease: [0.55, 0, 0.25, 1] },
    );
    await animate(
      "[data-door='r']",
      { rotateY: 168 },
      { duration: 1.15 * pace, ease: [0.55, 0, 0.25, 1] },
    );
    if (!alive.current) return;
    animate("[data-door]", { opacity: 0 }, { duration: 0.5 });
    await animate(
      "[data-letter]",
      { scale: 1.06, y: -6 },
      { duration: 0.6, ease: [0.33, 0, 0.15, 1] },
    );
    if (alive.current) onOpened();
  }

  return (
    <section
      aria-labelledby="envelope-title"
      inert={!interactive}
      data-opening="diptico"
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
          className="relative block aspect-[5/7] w-[min(74vw,340px)]"
          style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 1300 }}
        >
          {/* Botón vacío encima del dibujo: su nombre accesible no compite con los textos. */}
          <button
            type="button"
            onClick={() => void open()}
            aria-label="Abrir la invitación"
            aria-disabled={opening}
            className="absolute inset-0 z-30 cursor-pointer rounded-[4px] focus-visible:outline-offset-8"
          />
          {/* Interior: la carta que se ve al abrir las hojas. */}
          <ViewTransition name="carta" share="paper-morph" default="none">
            <m.span
              data-letter
              aria-hidden
              className="paper-grain absolute inset-0 block rounded-[2px] bg-paper shadow-[0_20px_30px_-12px_rgb(35_30_15/0.4)]"
            >
              <span className="flex h-full flex-col items-center justify-center px-5 text-center">
                <FoilMonogram
                  first={event.couple.first}
                  second={event.couple.second}
                  className="size-11 text-[2.75rem]"
                />
                <span className="letterpress mt-4 block font-names text-[2rem] leading-none text-ink">
                  {event.couple.first} &amp; {event.couple.second}
                </span>
                <span className="caption mt-2 block text-ink-soft">
                  {formatLongDate(event.date)}
                </span>
              </span>
            </m.span>
          </ViewTransition>

          {/* Hojas: cada una gira desde su borde exterior. */}
          {(["l", "r"] as const).map((side) => (
            <m.span
              key={side}
              data-door={side}
              aria-hidden
              className={`absolute inset-y-0 z-10 block w-1/2 ${side === "l" ? "left-0" : "right-0"}`}
              style={{
                transformOrigin: side === "l" ? "0% 50%" : "100% 50%",
                transformPerspective: 1400,
                backfaceVisibility: "hidden",
              }}
            >
              <span
                className={`paper-grain absolute inset-0 block ${side === "l" ? "rounded-l-[2px]" : "rounded-r-[2px]"} shadow-[0_18px_28px_-14px_rgb(35_30_15/0.45)]`}
                style={{ backgroundImage: paper(side === "l" ? "100deg" : "260deg") }}
              >
                {/* Filete dorado de cada hoja. */}
                <span
                  className={`absolute inset-y-3 block border-gold/60 ${side === "l" ? "right-0 left-3 border-y border-l" : "right-3 left-0 border-y border-r"}`}
                />
                <span
                  data-door-shade
                  className={`absolute inset-0 block opacity-0 ${side === "l" ? "bg-[linear-gradient(90deg,transparent,rgb(30_20_10/0.5))]" : "bg-[linear-gradient(270deg,transparent,rgb(30_20_10/0.5))]"}`}
                />
              </span>
            </m.span>
          ))}

          {/* Lacre que une las dos hojas. */}
          <m.span
            data-seal
            aria-hidden
            className="absolute top-1/2 left-1/2 z-20 block w-[26%] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_4px_5px_rgb(40_15_10/0.4)]"
          >
            <WaxSealArt
              monogram={event.couple.monogram}
              shape={theme.sealShape}
              mark={theme.sealMark}
              className="block aspect-square size-full"
            />
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
              Toca la tarjeta para abrirla
            </>
          )}
        </p>
      </div>
    </section>
  );
}
