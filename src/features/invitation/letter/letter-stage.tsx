"use client";

import { hostNames } from "@/lib/event-kind";
import { clsx } from "clsx";
import { ChevronDown } from "lucide-react";
import { m } from "motion/react";
import Image from "next/image";
import {
  useEffect,
  useRef,
  ViewTransition,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { Button } from "@/components/ui/button";
import type { GuestGroup, WeddingEvent } from "@/lib/domain/types";
import { formatWeekdayDate } from "@/lib/format";
import { DEFAULT_THEME, type OrnamentId, type Theme } from "@/lib/theme";
import { FoilMonogram } from "../effects/foil";
import { Petals } from "../effects/petals";
import { BlossomCorner, DecoCorner, EucalyptusCorner, OliveCorner } from "../ornaments";
import { useSwipeUp } from "../use-swipe-up";

/**
 * Pantalla 3 · Carta personalizada.
 * No aparece con un fundido: es la misma carta que acaba de salir del sobre, que crece hasta su
 * tamaño (<ViewTransition name="carta">). Al continuar, vuelve a transformarse en la cabecera.
 *
 * El tema elige la composición (clásica, editorial, con foto, marco o minimal), el borde del
 * papel y el ornamento de las esquinas de la escena.
 */
export function LetterStage({
  event,
  group,
  onContinue,
  theme = DEFAULT_THEME,
}: {
  event: WeddingEvent;
  group: GuestGroup;
  onContinue: () => void;
  theme?: Theme;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Se monta tras la salida del sobre: enfoca su título para teclado y lectores de pantalla.
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  const swipe = useSwipeUp(onContinue);
  const photo = event.story.couplePhoto ?? event.coverPhoto;
  // Sin foto, la composición «con foto» se queda en la clásica.
  const layout = theme.layout === "foto" && !photo ? "clasica" : theme.layout;
  const props = { event, group, headingRef, onContinue };

  return (
    <section
      aria-labelledby="letter-title"
      className="fixed inset-0 z-10 flex items-center justify-center overflow-hidden bg-[radial-gradient(110%_70%_at_50%_40%,var(--scene-1)_0%,var(--scene-2)_60%,var(--scene-3)_100%)] px-5 py-16"
      style={{ touchAction: "none" }}
      {...swipe}
    >
      <div aria-hidden className="paper-grain absolute inset-0" />
      {/* El foco de la apertura del sobre se abre poco a poco: la luz vuelve a la escena. */}
      <m.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_48%,transparent_35%,rgb(28_20_12/0.55)_100%)]"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.6, delay: 0.3, ease: "easeOut" }}
      />
      <SceneCorners ornament={theme.ornament} />
      {theme.ornament === "almendro" ? <Petals /> : null}

      {/* La sombra va en un contenedor aparte: la máscara del borde de papel la recortaría. */}
      <div
        className={clsx(
          "relative w-full max-w-[22rem] drop-shadow-[0_24px_30px_rgb(35_30_15/0.28)] sm:max-w-md",
          layout === "minimal" || layout === "editorial" ? "rotate-[-0.6deg]" : "rotate-[-1.2deg]",
        )}
      >
        <ViewTransition name="carta" share="paper-morph" default="none">
          <article
            data-layout={layout}
            className={clsx(
              "paper-grain relative bg-paper",
              theme.edge === "barba" && "deckle",
              theme.edge === "redondeado" && "overflow-hidden rounded-[1.25rem]",
              layout === "foto" ? "pb-12 sm:pb-14" : "py-12 sm:py-14",
              layout === "editorial" ? "px-8 text-left sm:px-11" : "px-8 text-center sm:px-12",
            )}
          >
            {layout === "editorial" ? (
              <EditorialLetter {...props} />
            ) : layout === "minimal" ? (
              <MinimalLetter {...props} />
            ) : layout === "foto" ? (
              <PhotoLetter {...props} photo={photo!} />
            ) : (
              <ClassicLetter {...props} framed={layout === "marco"} />
            )}
          </article>
        </ViewTransition>
      </div>

      <p
        aria-hidden
        className="absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] flex flex-col items-center gap-1 text-[0.8125rem] text-ink-soft"
      >
        Desliza para continuar
        <ChevronDown className="nudge size-4" />
      </p>
    </section>
  );
}

/*
 * Coreografía de la carta: el contenido se «imprime» por partes mientras el papel aún llega desde
 * el sobre, como una tarjeta que se lee de arriba abajo. Los nombres se escriben de izquierda a
 * derecha, como con tinta, y el botón llega el último. Son animaciones CSS (globals.css:
 * letter-piece, letter-ink, letter-finale) y no de Motion: las de Motion esperan a que acabe el
 * relevo de pantalla y dejaban la carta en blanco medio segundo. `i` es el turno de cada parte.
 */
type RevealKind = "piece" | "ink" | "finale";

/** Una parte de la carta que entra en su turno. */
function Reveal({
  children,
  i,
  kind = "piece",
  className,
}: {
  children: ReactNode;
  i: number;
  kind?: RevealKind;
  className?: string;
}) {
  return (
    <div className={clsx(`letter-${kind}`, className)} style={{ "--i": i } as CSSProperties}>
      {children}
    </div>
  );
}

interface LetterProps {
  event: WeddingEvent;
  group: GuestGroup;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onContinue: () => void;
}

const CORNERS = {
  almendro: BlossomCorner,
  olivo: OliveCorner,
  eucalipto: EucalyptusCorner,
  geometrico: DecoCorner,
  ninguno: null,
} satisfies Record<OrnamentId, unknown>;

/** Ornamento de las dos esquinas de la escena. */
function SceneCorners({ ornament }: { ornament: OrnamentId }) {
  const Corner = CORNERS[ornament];
  if (!Corner) return null;
  const deco = ornament === "geometrico";
  return (
    <>
      <Corner
        className={clsx(
          "pointer-events-none absolute rotate-180 opacity-90",
          deco ? "right-3 bottom-3 w-24 sm:w-36" : "-top-6 -right-8 w-44 sm:w-60",
        )}
      />
      <Corner
        className={clsx(
          "pointer-events-none absolute opacity-90",
          // Las esquinas déco van abajo: arriba están los botones de sonido y saltar.
          deco ? "bottom-3 left-3 w-24 -scale-y-100 sm:w-36" : "-bottom-6 -left-8 w-48 sm:w-64",
        )}
      />
    </>
  );
}

function Greeting({
  group,
  headingRef,
  className,
}: Pick<LetterProps, "group" | "headingRef"> & { className: string }) {
  return (
    <h1
      id="letter-title"
      ref={headingRef}
      tabIndex={-1}
      className={clsx("letterpress font-display leading-tight text-ink outline-none", className)}
    >
      Hola, {group.displayName}:
    </h1>
  );
}

function Names({ event, className, i }: { event: WeddingEvent; className: string; i: number }) {
  return (
    <Reveal i={i} kind="ink">
      <p
        translate="no"
        className={clsx("letterpress font-names leading-tight text-ink", className)}
      >
        {hostNames(event.couple)}
      </p>
    </Reveal>
  );
}

function Continue({
  onContinue,
  className,
  i,
}: {
  onContinue: () => void;
  className?: string;
  i: number;
}) {
  return (
    <Reveal i={i} kind="finale" className={className}>
      <Button className="w-full" size="lg" onClick={onContinue}>
        Descubrir la invitación
      </Button>
    </Reveal>
  );
}

function Message({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={clsx("font-display text-[1.1875rem] leading-[1.6] text-ink-soft", className)}>
      {children}
    </p>
  );
}

/** Centrada bajo el monograma; con `framed`, doble filete dorado y rombos grabados. */
function ClassicLetter({
  event,
  group,
  headingRef,
  onContinue,
  framed,
}: LetterProps & { framed: boolean }) {
  return (
    <>
      {framed ? (
        <>
          <div aria-hidden className="pointer-events-none absolute inset-3 border border-gold/70" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-[1.15rem] border border-gold/40"
          />
          {["top-[0.42rem]", "bottom-[0.42rem]"].map((pos) => (
            <span
              key={pos}
              aria-hidden
              className={`absolute left-1/2 ${pos} block size-2.5 -translate-x-1/2 rotate-45 bg-gold`}
            />
          ))}
        </>
      ) : (
        <div aria-hidden className="pointer-events-none absolute inset-4 border border-gold/35" />
      )}
      <Reveal i={0}>
        <FoilMonogram
          first={event.couple.first}
          second={event.couple.second}
          className="mx-auto size-12 text-[3rem]"
        />
      </Reveal>
      <Reveal i={1}>
        <Greeting
          group={group}
          headingRef={headingRef}
          className="mt-6 text-[2rem] sm:text-[2.375rem]"
        />
      </Reveal>
      <Reveal i={2}>
        <Message className="mx-auto mt-5 max-w-[18rem]">{event.cardMessage}</Message>
      </Reveal>
      <Names i={3} event={event} className="mt-8 text-[1.75rem]" />
      <Reveal i={4}>
        <p className="caption mt-1 text-ink-soft">{formatWeekdayDate(event.date)}</p>
      </Reveal>
      <Continue i={5} onContinue={onContinue} className="mt-9" />
    </>
  );
}

/** Nombres grandes como cabecera de revista y el texto alineado a la izquierda. */
function EditorialLetter({ event, group, headingRef, onContinue }: LetterProps) {
  return (
    <>
      <Reveal i={0}>
        <p className="caption text-ink-soft">{formatWeekdayDate(event.date)}</p>
      </Reveal>
      <Names
        i={1}
        event={event}
        className="mt-3 text-[2.75rem] !leading-[0.95] sm:text-[3.25rem]"
      />
      <Reveal i={2}>
        <div aria-hidden className="mt-6 h-px w-16 bg-gold" />
      </Reveal>
      <Reveal i={3}>
        <Greeting group={group} headingRef={headingRef} className="mt-6 text-[1.625rem]" />
      </Reveal>
      <Reveal i={4}>
        <Message className="mt-3">{event.cardMessage}</Message>
      </Reveal>
      <Continue i={5} onContinue={onContinue} className="mt-9" />
    </>
  );
}

/** La foto de la pareja encabeza la carta, a sangre. */
function PhotoLetter({
  event,
  group,
  headingRef,
  onContinue,
  photo,
}: LetterProps & { photo: string }) {
  return (
    <>
      <div className="relative -mx-8 mb-7 aspect-[16/10] overflow-hidden sm:-mx-12">
        <Image
          src={photo}
          alt=""
          fill
          sizes="(min-width: 640px) 28rem, 22rem"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-paper to-transparent"
        />
      </div>
      <Names i={0} event={event} className="text-[2rem]" />
      <Reveal i={1}>
        <p className="caption mt-1 text-ink-soft">{formatWeekdayDate(event.date)}</p>
      </Reveal>
      <Reveal i={2}>
        <Greeting group={group} headingRef={headingRef} className="mt-6 text-[1.5rem]" />
      </Reveal>
      <Reveal i={3}>
        <Message className="mx-auto mt-3 max-w-[18rem]">{event.cardMessage}</Message>
      </Reveal>
      <Continue i={4} onContinue={onContinue} className="mt-8" />
    </>
  );
}

/** Sin monograma ni filetes: mucho aire, letra pequeña y mayúsculas espaciadas. */
function MinimalLetter({ event, group, headingRef, onContinue }: LetterProps) {
  return (
    <div className="py-4">
      <Reveal i={0}>
        <p className="text-[0.6875rem] tracking-[0.32em] text-ink-soft uppercase">
          {formatWeekdayDate(event.date)}
        </p>
      </Reveal>
      <Reveal i={1}>
        <Greeting group={group} headingRef={headingRef} className="mt-10 text-[1.5rem]" />
      </Reveal>
      <Reveal i={2}>
        <Message className="mx-auto mt-4 max-w-[17rem] !text-[1.0625rem]">
          {event.cardMessage}
        </Message>
      </Reveal>
      <Names i={3} event={event} className="mt-12 text-[1.5rem]" />
      <Continue i={4} onContinue={onContinue} className="mt-10" />
    </div>
  );
}
