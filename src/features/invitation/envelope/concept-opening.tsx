"use client";

import { Pointer } from "lucide-react";
import { m, useAnimate, useReducedMotion } from "motion/react";
import { ViewTransition } from "react";
import type { GuestGroup, WeddingEvent } from "@/lib/domain/types";
import { conceptKit } from "@/lib/theme/concept-kit";
import { DEFAULT_THEME, type MotifId, type Theme } from "@/lib/theme";
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
type Exit = "lift" | "slide" | "flip";

/** Cómo se abre cada objeto: se levanta, se desliza de lado o se gira como una tapa. */
const EXITS: Partial<Record<MotifId, Exit>> = {
  embarque: "slide",
  telegrama: "slide",
  vinilo: "slide",
  comic: "slide",
  pasaporte: "flip",
  postal: "flip",
  tarot: "flip",
};

const SERIF = "var(--font-playfair), 'Playfair Display', Georgia, serif";
const MONO = "ui-monospace, 'SF Mono', Menlo, Consolas, monospace";

/** El emblema del objeto, en el centro: lo que hace reconocible el periódico, el disco, la caja… */
function Emblem({ motif, event }: { motif: MotifId; event: WeddingEvent }) {
  const { first, second } = event.couple;
  const initials = `${first[0] ?? ""}${second?.[0] ?? ""}`;
  const year = new Intl.DateTimeFormat("es-ES", {
    timeZone: "Europe/Madrid",
    year: "numeric",
  }).format(new Date(event.date));
  switch (motif) {
    case "gaceta":
      return (
        <span className="block w-full">
          <span
            className="block text-[2rem] leading-none font-black italic"
            style={{ fontFamily: SERIF }}
          >
            La Gaceta
          </span>
          <span
            className="mt-2 block border-y border-current py-1 text-[0.8125rem] font-bold"
            style={{ fontFamily: SERIF }}
          >
            {first}
            {second ? ` y ${second}` : ""} se casan
          </span>
          <span className="mt-2 grid grid-cols-3 gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="block h-10 bg-[repeating-linear-gradient(180deg,currentColor_0_1px,transparent_1px_5px)] opacity-40"
              />
            ))}
          </span>
        </span>
      );
    case "embarque":
    case "postal":
      return (
        <span className="flex w-full items-start justify-between">
          <span className="block -rotate-12 rounded-full border-2 border-current px-3 py-3 text-[0.625rem] leading-tight font-bold opacity-80">
            {initials}
            <br />
            {year}
          </span>
          <span className="stamp-teeth block bg-[var(--color-gold)] p-[5px]">
            <span
              className="flex h-16 w-12 items-center justify-center border border-[var(--color-paper)]/70 text-[1.25rem] text-[var(--color-paper)]"
              style={{ fontFamily: SERIF }}
            >
              {initials}
            </span>
          </span>
        </span>
      );
    case "premio":
    case "telegrama":
    case "arcade":
      return (
        <span
          className={`block leading-none font-bold tracking-[0.06em] tabular-nums ${motif === "telegrama" ? "text-[1.625rem]" : "text-[2.25rem]"}`}
          style={{
            fontFamily:
              motif === "arcade"
                ? "var(--font-pixel), monospace"
                : motif === "telegrama"
                  ? "var(--font-courier), 'Courier New', monospace"
                  : MONO,
          }}
        >
          {motif === "arcade" ? "1UP" : motif === "premio" ? year : "TELEGRAMA"}
        </span>
      );
    case "vinilo":
      return (
        <span
          className="block size-28 rounded-full shadow-[0_10px_20px_-8px_rgb(0_0_0/0.6)]"
          style={{
            background:
              "radial-gradient(circle, #f3ead8 0 6%, #d9a441 6.5% 30%, transparent 30.5%), conic-gradient(from 20deg, rgb(255 255 255 / 0.18), transparent 12% 38%, rgb(255 255 255 / 0.12) 50%, transparent 62% 88%, rgb(255 255 255 / 0.18)), repeating-radial-gradient(circle, #1f1c1a 0 1.5px, #100e0d 1.5px 3px)",
          }}
        />
      );
    case "carta":
      return (
        <span
          className="block text-[2.5rem] leading-none"
          style={{ fontFamily: "var(--font-pinyon), cursive" }}
        >
          Menú
        </span>
      );
    case "constelacion":
      return (
        <svg viewBox="0 0 100 100" className="size-28 text-[var(--color-gold)]">
          <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle
            cx="50"
            cy="50"
            r="30"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.6"
          />
          <polyline
            points="22,62 36,36 56,46 70,24 76,62"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          {[
            [22, 62],
            [36, 36],
            [56, 46],
            [70, 24],
            [76, 62],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="2.4" fill="currentColor" />
          ))}
        </svg>
      );
    case "mapa":
      return (
        <svg viewBox="0 0 100 100" className="size-28">
          <path
            d="M14 82C30 70 24 52 44 46S66 34 72 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="2 6"
            strokeLinecap="round"
          />
          <path
            d="M66 14l12 12M78 14L66 26"
            stroke="var(--color-gold)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="14" cy="82" r="4" fill="var(--color-gold)" />
        </svg>
      );
    case "comic":
      return (
        <span
          className="block -rotate-3 text-[2.5rem] leading-[0.9] text-[var(--color-gold)] [text-shadow:3px_3px_0_var(--color-ink)]"
          style={{ fontFamily: "var(--font-bangers), Impact, sans-serif" }}
        >
          ¡Boda!
        </span>
      );
    case "cosecha":
      return (
        <span
          className="block border-[3px] border-current px-3 py-1 text-[1.75rem] leading-none font-bold tracking-[0.2em]"
          style={{ fontFamily: MONO }}
        >
          FRÁGIL
        </span>
      );
    case "tarot":
      return (
        <svg viewBox="0 0 100 100" className="size-24 text-[var(--color-gold)]">
          <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="1.5" />
          {Array.from({ length: 16 }, (_, i) => (
            <path
              key={i}
              d={i % 2 ? "M50 28V16" : "M50 30V8"}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              transform={`rotate(${i * 22.5} 50 50)`}
            />
          ))}
        </svg>
      );
    case "semillas":
      return (
        <span
          className="block text-[1.5rem] leading-tight"
          style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
        >
          Amor de
          <br />
          {first}
          {second ? ` y ${second}` : ""}
        </span>
      );
    default:
      return <Monogram first={first} second={second} className="concept-carrier-mark size-20" />;
  }
}

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
  const exit: Exit = (kit && EXITS[theme.motif]) || "lift";

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
    if (exit === "slide") {
      // Se desliza de lado, como un disco que sale de su funda o una carta del sobre.
      await animate(
        "[data-carrier]",
        { x: [0, -10, 520], rotate: [0, -1, 7] },
        { duration: 1, times: [0, 0.2, 1], ease: [0.5, 0, 0.75, 0.2] },
      );
    } else if (exit === "flip") {
      // Se abre como una tapa: gira sobre su borde izquierdo y desaparece de canto.
      await animate(
        "[data-carrier]",
        { rotateY: [0, -110], transformPerspective: 1100, opacity: [1, 1, 0] },
        { duration: 1, ease: [0.5, 0, 0.3, 1], opacity: { times: [0, 0.8, 1], duration: 1 } },
      );
    } else {
      // Se levanta y sale por arriba, algo girado, como cuando se tira de él.
      await animate(
        "[data-carrier]",
        { y: [0, 14, -620], rotate: [0, 1.5, -9] },
        { duration: 1.05, times: [0, 0.18, 1], ease: [0.5, 0, 0.75, 0.2] },
      );
    }
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
            style={exit === "flip" ? { transformOrigin: "0% 50%" } : undefined}
            className="concept-carrier absolute -inset-3 z-10 flex flex-col items-center justify-between rounded-[6px] px-5 py-6 text-center shadow-[0_26px_44px_-18px_rgb(20_15_10/0.6)]"
          >
            <span className="concept-carrier-label">{kit?.carrier ?? "Correspondencia"}</span>
            <Emblem motif={kit ? theme.motif : "ninguno"} event={event} />
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
