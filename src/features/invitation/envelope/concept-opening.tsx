"use client";

import { Pointer } from "lucide-react";
import { m, useAnimate, useReducedMotion } from "motion/react";
import { ViewTransition } from "react";
import type { GuestGroup, WeddingEvent } from "@/lib/domain/types";
import { conceptKit } from "@/lib/theme/concept-kit";
import { DEFAULT_THEME, type Theme } from "@/lib/theme";
import { haptic, playPaper, unlockAudio } from "../effects/sound";
import { LetterMiniature } from "../letter/letter-miniature";
import { Monogram } from "../ornaments";
import { useOpening } from "./use-opening";

/*
 * Apertura «concepto»: la carta llega dentro del objeto de la plantilla (el periódico, el sobre de
 * correo aéreo, la funda del disco, la caja de la botella…). Es una sola pieza: la forma es la
 * misma y cada plantilla la viste con su rótulo (CONCEPT_KITS) y su papel (globals.css,
 * `.concept-carrier` por `data-motif`). Al tocarla, el objeto se levanta y deja la carta, que
 * crece hasta la carta grande. Sin motivo de concepto, se viste como un sobre de papelería.
 */
export function ConceptOpening({
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
  const kit = conceptKit(theme.motif);
  const object = kit?.object ?? "la invitación";

  async function open() {
    if (!begin()) return;
    unlockAudio();
    if (reduce) {
      onOpened();
      return;
    }
    haptic([8, 30, 14]);
    playPaper(0.6);
    animate("[data-heading]", { opacity: 0, y: -12 }, { duration: 0.4 });
    // El objeto se levanta y sale por arriba, algo girado, como cuando se tira de él.
    await animate(
      "[data-carrier]",
      { y: [0, 14, -620], rotate: [0, 1.5, -9] },
      { duration: 1.05, times: [0, 0.18, 1], ease: [0.5, 0, 0.75, 0.2] },
    );
    if (!alive.current) return;
    await animate(
      "[data-letter]",
      { scale: 1.06, y: -6 },
      { duration: 0.55, ease: [0.33, 0, 0.15, 1] },
    );
    if (alive.current) onOpened();
  }

  return (
    <section
      aria-labelledby="envelope-title"
      inert={!interactive}
      data-opening="concepto"
      className="fixed inset-0 z-10 flex flex-col items-center justify-center overflow-hidden bg-[radial-gradient(120%_80%_at_50%_45%,var(--scene-2)_0%,var(--scene-3)_55%,var(--scene-4)_100%)] px-6 pt-16 pb-10"
    >
      <div aria-hidden className="paper-grain absolute inset-0" />
      <div ref={scope} className="relative flex w-full flex-col items-center">
        <div data-heading className="mb-8 flex flex-col items-center text-center text-ink-soft">
          <p className="caption text-ink-soft">Ha llegado algo para</p>
          <h1
            id="envelope-title"
            tabIndex={-1}
            className="mt-1 font-display text-[clamp(2rem,8vw,3rem)] leading-tight text-ink outline-none"
          >
            {group.displayName}
          </h1>
        </div>

        <div className="relative w-[min(66vw,310px)]">
          <button
            type="button"
            onClick={() => void open()}
            aria-label={`Abrir ${object}`}
            aria-disabled={opening}
            className="absolute inset-0 z-30 cursor-pointer rounded-[6px] focus-visible:outline-offset-8"
          />
          {/* La carta espera debajo; es la misma que la grande. */}
          <ViewTransition name="carta" share="paper-morph" default="none">
            <m.span
              data-letter
              aria-hidden
              className="relative block drop-shadow-[0_14px_16px_rgb(35_30_15/0.3)]"
            >
              <LetterMiniature event={event} group={group} theme={theme} />
            </m.span>
          </ViewTransition>
          {/* El objeto de la plantilla, que tapa la carta. */}
          <m.span
            data-carrier
            aria-hidden
            className="concept-carrier absolute -inset-3 z-10 flex flex-col items-center justify-between rounded-[6px] px-5 py-6 text-center shadow-[0_26px_44px_-18px_rgb(20_15_10/0.6)]"
          >
            <span className="concept-carrier-label">{kit?.carrier ?? "Correspondencia"}</span>
            <Monogram
              first={event.couple.first}
              second={event.couple.second}
              className="concept-carrier-mark size-20"
            />
            <span className="concept-carrier-to">
              <span className="block text-[0.6875rem] tracking-[0.14em] uppercase opacity-80">
                Para
              </span>
              <span className="mt-0.5 block font-display text-[1.375rem] leading-tight">
                {group.displayName}
              </span>
            </span>
          </m.span>
        </div>

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
              Toca para abrir {object}
            </>
          )}
        </p>
      </div>
    </section>
  );
}
