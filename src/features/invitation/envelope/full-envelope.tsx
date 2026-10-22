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
import { WaxSealArt } from "../ornaments";
import { useOpening } from "./use-opening";

/*
 * Apertura «sobre a pantalla completa»: el móvil entero es el sobre. La solapa baja en V hasta el
 * lacre, en el centro; el nombre del invitado va escrito en el frente, como una dirección. Al tocar
 * el lacre se parte, la solapa se levanta hacia arriba (rotateX con perspectiva propia) y la carta
 * sube desde dentro hasta convertirse en la carta grande (<ViewTransition name="carta">).
 */

const TIP = 56; // % de altura donde acaba la punta de la solapa (y va el lacre)
const SHOULDER = 30; // % de altura donde la solapa empieza a estrecharse
const flapInner = `polygon(0 0, 100% 0, 100% ${(SHOULDER / TIP) * 100}%, 50% 100%, 0 ${(SHOULDER / TIP) * 100}%)`;
const paper = (angle: string) =>
  `var(--env-texture), linear-gradient(${angle}, var(--env-paper-a), var(--env-paper-b))`;

export function FullEnvelope({
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
  const [scope, animate] = useAnimate<HTMLElement>();
  const { opening, begin, alive } = useOpening(interactive);
  const pace = WEIGHTS[theme.weight].pace;
  const shineX = useTransform(tilt.x, (v) => `${v * 30}%`);
  const sealX = useTransform(tilt.x, (v) => v * 4);
  const sealY = useTransform(tilt.y, (v) => v * 4);

  async function open() {
    if (!begin()) return;
    unlockAudio();
    if (reduce) {
      onOpened();
      return;
    }
    animate("[data-front]", { opacity: 0 }, { duration: 0.4 });
    // 1. El lacre cede y se parte; las mitades caen.
    await animate("[data-seal]", { scale: [1, 0.86, 1.04] }, { duration: 0.32, ease: "easeOut" });
    if (!alive.current) return;
    playSealCrack();
    haptic([8, 30, 14]);
    animate("[data-seal-whole]", { opacity: 0 }, { duration: 0 });
    animate("[data-seal-half]", { opacity: 1 }, { duration: 0 });
    animate(
      "[data-seal-half='l']",
      { x: -40, y: 160, rotate: -40, opacity: 0 },
      { duration: 0.9, ease: [0.5, 0, 0.9, 0.6] },
    );
    animate(
      "[data-seal-half='r']",
      { x: 36, y: 180, rotate: 32, opacity: 0 },
      { duration: 0.9, ease: [0.5, 0, 0.9, 0.6] },
    );

    // 2. La solapa se levanta hacia la cámara: se oscurece de canto y cambia de cara.
    playPaper(0.6, 0.05);
    animate("[data-flap-shade]", { opacity: 0.45 }, { duration: 0.45 * pace, ease: "easeIn" });
    await animate(
      "[data-flap]",
      { rotateX: 90 },
      { duration: 0.45 * pace, ease: [0.55, 0, 1, 0.45] },
    );
    if (!alive.current) return;
    animate("[data-flap-outer]", { opacity: 0 }, { duration: 0 });
    animate("[data-flap]", { zIndex: 5 }, { duration: 0 });
    await animate(
      "[data-flap]",
      { rotateX: 178 },
      { duration: 0.55 * pace, ease: [0, 0.55, 0.45, 1] },
    );
    if (!alive.current) return;

    // 3. La carta sube desde dentro; el sobre se queda atrás y se funde.
    playPaper(0.9, 0.05);
    animate("[data-body]", { opacity: 0, y: 60 }, { duration: 0.9, delay: 0.5, ease: "easeIn" });
    animate("[data-flap]", { opacity: 0 }, { duration: 0.6, delay: 0.5 });
    await animate("[data-letter]", { y: "-30%" }, { duration: 1, ease: [0.33, 0, 0.15, 1] });
    if (!alive.current) return;
    await animate(
      "[data-letter]",
      { y: "-8%", scale: 1.04 },
      { duration: 0.6, ease: [0.33, 0, 0.15, 1] },
    );
    if (alive.current) onOpened();
  }

  return (
    <section
      ref={scope}
      aria-labelledby="envelope-title"
      inert={!interactive}
      data-opening="pantalla"
      className="fixed inset-0 z-10 overflow-hidden bg-[var(--scene-3)]"
      onClick={() => void open()}
    >
      {/* Interior del sobre y forro, visibles al levantar la solapa. */}
      <div data-body aria-hidden className="absolute inset-0 bg-[var(--env-inside)]">
        <div
          className="absolute inset-x-0 top-0 h-[46%]"
          style={{ background: "var(--env-liner)" }}
        />
      </div>

      {/* Carta dentro del sobre: sube al abrir y se transforma en la carta grande. */}
      <ViewTransition name="carta" share="paper-morph" default="none">
        <m.div
          data-letter
          aria-hidden
          className="paper-grain absolute inset-x-[7%] top-[12%] bottom-[10%] z-10 rounded-[2px] bg-paper shadow-[0_1px_3px_rgb(60_45_25/0.18)]"
        >
          <div className="flex flex-col items-center px-6 pt-[14%] text-center">
            <FoilMonogram
              first={event.couple.first}
              second={event.couple.second}
              className="size-12 text-[3rem]"
            />
            <p className="letterpress mt-4 font-names text-[2.25rem] leading-none text-ink">
              {event.couple.first} &amp; {event.couple.second}
            </p>
            <p className="caption mt-2 text-ink-soft">{formatLongDate(event.date)}</p>
          </div>
        </m.div>
      </ViewTransition>

      {/* Bolsillo: dos laterales y el panel inferior, con sombras de pliegue. */}
      <div
        data-body
        aria-hidden
        className="absolute inset-0 z-20 drop-shadow-[0_-1px_2px_rgb(60_45_25/0.25)]"
      >
        <div
          className="paper-grain absolute inset-0"
          style={{
            backgroundImage: paper("100deg"),
            clipPath: `polygon(0 0, 0 100%, 50% ${TIP + 4}%)`,
          }}
        />
        <div
          className="paper-grain absolute inset-0 brightness-[0.985]"
          style={{
            backgroundImage: paper("260deg"),
            clipPath: `polygon(100% 0, 100% 100%, 50% ${TIP + 4}%)`,
          }}
        />
        <div
          className="paper-grain absolute inset-0"
          style={{
            backgroundImage: paper("0deg"),
            clipPath: `polygon(0 100%, 100% 100%, 100% 64%, 50% ${TIP}%, 0 64%)`,
          }}
        />
      </div>

      {/* Frente: el nombre del invitado escrito como una dirección. */}
      <div
        data-front
        className="pointer-events-none absolute inset-x-0 bottom-[14%] z-30 text-center"
      >
        <p className="caption text-ink-soft">Para</p>
        <h1
          id="envelope-title"
          tabIndex={-1}
          className="mt-1 px-6 font-names text-[clamp(2rem,9vw,2.75rem)] leading-tight text-ink outline-none"
        >
          {group.displayName}
        </h1>
      </div>

      {/* Solapa superior, de punta en el centro. */}
      <m.div
        data-flap
        aria-hidden
        className="absolute inset-x-0 top-0 z-40 drop-shadow-[0_3px_4px_rgb(50_35_20/0.28)]"
        style={{ height: `${TIP}%`, transformOrigin: "50% 0%", transformPerspective: 1200 }}
      >
        <div
          className="absolute inset-0"
          style={{ background: "var(--env-liner)", clipPath: flapInner }}
        />
        <div
          data-flap-outer
          className="paper-grain absolute inset-0"
          style={{ backgroundImage: paper("180deg"), clipPath: flapInner }}
        >
          <div
            data-flap-shade
            className="absolute inset-0 bg-[linear-gradient(180deg,rgb(40_30_15/0.15),rgb(40_30_15/0.85))] opacity-0"
          />
        </div>
      </m.div>

      {/* Lacre: es el botón (también se abre tocando cualquier parte del sobre). */}
      <m.div
        className="absolute z-50 block w-[min(34vw,9.5rem)] -translate-x-1/2 -translate-y-1/2"
        style={{ left: "50%", top: `${TIP}%`, x: reduce ? 0 : sealX, y: reduce ? 0 : sealY }}
      >
        {/* Botón vacío encima del lacre: su nombre accesible no compite con el dibujo. */}
        <button
          type="button"
          aria-label="Abrir el sobre"
          aria-disabled={opening}
          onClick={(e) => {
            e.stopPropagation();
            void open();
          }}
          className="absolute inset-0 z-10 rounded-full focus-visible:outline-offset-8"
        />
        <span
          data-seal
          aria-hidden
          className="relative block aspect-square drop-shadow-[0_5px_7px_rgb(40_15_10/0.4)]"
        >
          <span data-seal-whole className="absolute inset-0 block">
            <WaxSealArt
              monogram={event.couple.monogram}
              shape={theme.sealShape}
              mark={theme.sealMark}
              className="size-full"
            />
            <m.span
              className="absolute inset-[14%] block rounded-full bg-[radial-gradient(circle_at_35%_30%,rgb(255_235_220/0.35),transparent_45%)] mix-blend-screen"
              style={{ x: shineX }}
            />
          </span>
          {(["l", "r"] as const).map((side) => (
            <m.span
              key={side}
              data-seal-half={side}
              className="absolute inset-0 block opacity-0"
              style={{
                clipPath:
                  side === "l"
                    ? "polygon(0 0, 52% 0, 44% 30%, 56% 55%, 46% 100%, 0 100%)"
                    : "polygon(52% 0, 100% 0, 100% 100%, 46% 100%, 56% 55%, 44% 30%)",
              }}
            >
              <WaxSealArt
                monogram={event.couple.monogram}
                shape={theme.sealShape}
                mark={theme.sealMark}
                className="size-full"
              />
            </m.span>
          ))}
        </span>
      </m.div>

      <p
        data-front
        aria-live="polite"
        className="absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full bg-ink/80 px-5 py-2.5 text-[0.75rem] tracking-[0.22em] whitespace-nowrap text-paper uppercase backdrop-blur-sm"
      >
        {opening ? (
          "Abriendo…"
        ) : (
          <>
            <Pointer aria-hidden className="size-3.5" />
            Toca el sello para abrir
          </>
        )}
      </p>
    </section>
  );
}
