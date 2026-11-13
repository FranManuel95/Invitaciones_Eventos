"use client";

import { hostNames, ofEvent } from "@/lib/event-kind";
import { clsx } from "clsx";
import { ChevronDown, RotateCcw } from "lucide-react";
import { useReducedMotion } from "motion/react";
import Image from "next/image";
import {
  type CSSProperties,
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
  ViewTransition,
} from "react";
import { DemoBadge } from "@/components/demo-badge";
import { buttonClasses } from "@/components/ui/button";
import type { GuestGroup, WeddingEvent } from "@/lib/domain/types";
import { formatWeekdayDate, isoDay } from "@/lib/format";
import { useScrollProgress, useViewProgress } from "../effects/scroll-progress";
import { AlmondBranch, Monogram } from "../ornaments";
import { RsvpSection } from "../rsvp/rsvp-section";
import { DaysLeft } from "./countdown";
import { useSavedResponse } from "../rsvp/use-saved-response";
import { GiftSection } from "./gift-section";
import { EMPTY_GIFT_STATUS, type GiftStatus } from "@/lib/gifts";
import { ResponseStatus } from "./response-status";
import { dayClock, isAfterEvent, liveProgram } from "@/lib/day-mode";
import { ThankYou } from "./thank-you";
import { LiveDay } from "./live-day";
import { SaveTheDate, SaveTheDateOnly } from "./save-the-date";
import {
  SECTION_IDS,
  type CalendarId,
  type SealMarkId,
  type SealShapeId,
  type SectionId,
} from "@/lib/theme";
import { ProgramScene } from "./program-scene";
import { StoryScene } from "./story-scene";
import { StorySection } from "./story-section";
import { PracticalSection, ProgramSection, TransportSection, VenuesSection } from "./sections";

const NAV = [
  { id: "fecha", label: "La fecha" },
  { id: "programa", label: "El día" },
  { id: "lugares", label: "Dónde" },
  { id: "transporte", label: "Cómo llegar" },
  { id: "info", label: "Antes de venir" },
  { id: "historia", label: "Nuestra historia" },
  { id: "regalo", label: "Regalo" },
  { id: "confirmar", label: "Confirmar" },
];
const NO_HIDDEN: SectionId[] = [];
const DEFAULT_ORDER: readonly SectionId[] = SECTION_IDS;

/**
 * Scroll con inercia suave (Lenis), solo en la plantilla Cine y si no se pide reducir el
 * movimiento. La librería se descarga únicamente cuando hace falta.
 */
function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let lenis: { destroy: () => void } | null = null;
    let cancelled = false;
    void import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({ autoRaf: true, lerp: 0.08, anchors: true });
    });
    return () => {
      cancelled = true;
      lenis?.destroy();
    };
  }, [enabled]);
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

export interface InvitationContentProps {
  event: WeddingEvent;
  group: GuestGroup;
  onReplay: () => void;
  /** Si llega desde la introducción, enfoca el título (se carga aparte, tras la carta). */
  focusOnMount: boolean;
  calendar?: CalendarId;
  /** Texto del distintivo (null: sin distintivo, en invitaciones reales). */
  badge?: string | null;
  /** Secciones que la pareja ha ocultado desde el editor. */
  hidden?: SectionId[];
  /** Orden de las secciones elegido en el editor (la confirmación va siempre al final). */
  order?: readonly SectionId[];
  /** En «save_the_date» solo se ven la fecha y el calendario, sin confirmación. */
  phase?: "save_the_date" | "invitacion";
  /** Token del álbum de fotos (null: sin álbum). */
  albumToken?: string | null;
  /** Reservas de la lista de regalos. */
  gifts?: GiftStatus;
  /** Scroll suave «de película» (Lenis), en la plantilla Cine. */
  smooth?: boolean;
  /** El lacre del tema: sella la respuesta al confirmar. */
  seal?: { shape: SealShapeId; mark: SealMarkId };
}

/** Pantallas 4 a 7 · La invitación completa con secciones y RSVP. */
export function InvitationContent({
  event,
  group,
  onReplay,
  focusOnMount,
  calendar,
  badge,
  hidden = NO_HIDDEN,
  order = DEFAULT_ORDER,
  phase = "invitacion",
  albumToken = null,
  gifts = EMPTY_GIFT_STATUS,
  smooth = false,
  seal,
}: InvitationContentProps) {
  useSmoothScroll(smooth);
  const early = phase === "save_the_date";
  const shows = (id: SectionId) => !hidden.includes(id);
  const nav = useMemo(() => {
    const rank = (id: string) => {
      const i = (order as readonly string[]).indexOf(id);
      return i === -1 ? order.length : i;
    };
    return NAV.filter((n) => !(hidden as string[]).includes(n.id)).sort(
      (a, b) => rank(a.id) - rank(b.id),
    );
  }, [hidden, order]);
  const navIds = useMemo(() => nav.map((n) => n.id), [nav]);
  const active = useActiveSection(navIds);
  const saved = useSavedResponse(group.token);
  // Reloj del modo «día de la boda» (o simulado con ?dia=boda&hora=19:10 en la demo).
  const [clock, setClock] = useState(() => dayClock(event, new Date(), window.location.search));
  useEffect(() => {
    if (!clock.active || clock.simulated) return;
    const id = window.setInterval(
      () => setClock(dayClock(event, new Date(), window.location.search)),
      30_000,
    );
    return () => window.clearInterval(id);
  }, [clock.active, clock.simulated, event]);
  const live = clock.active ? liveProgram(event.program, clock.minutes) : null;
  // Después de la boda: gracias y fotos en vez de confirmar (en la demo, ?dia=despues).
  const [after] = useState(() => !early && isAfterEvent(event, new Date(), window.location.search));
  const titleRef = useRef<HTMLHeadingElement>(null);
  const reduce = useReducedMotion();
  // Portada con foto: la de la pareja y, si no la hay, la de la portada.
  const heroPhoto = event.story.couplePhoto ?? event.coverPhoto;
  const hero = useScrollProgress<HTMLElement>("leave", Boolean(heroPhoto) && !reduce);
  const page = useViewProgress<HTMLDivElement>(!reduce);
  const welcome = useMemo(() => event.welcomeMessage.split(/\s+/), [event.welcomeMessage]);

  useEffect(() => {
    if (!focusOnMount) return;
    window.scrollTo({ top: 0 });
    titleRef.current?.focus({ preventScroll: true });
  }, [focusOnMount]);
  const navRef = useRef<HTMLUListElement>(null);
  // Las escenas a pantalla completa («El día» y «Nuestra historia»): con movimiento reducido, o
  // el día de la boda, se usan las listas de siempre.
  const programScene = !reduce && !clock.active;
  const storyScene = !reduce && event.story.moments.every((moment) => moment.photo);
  // Dentro de una escena la barra de secciones se retira: la pantalla es toda suya.
  const immersive =
    (active === "programa" && programScene) || (active === "historia" && storyScene);
  const cta = heroPhoto
    ? buttonClasses("secondary", "lg", "border-transparent")
    : buttonClasses("primary", "lg");

  // En móvil la barra de secciones se desplaza en horizontal: mantiene visible la sección activa.
  useEffect(() => {
    const list = navRef.current;
    const link = list?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!list || !link) return;
    list.scrollTo({
      left: link.offsetLeft - list.clientWidth / 2 + link.clientWidth / 2,
      behavior: "smooth",
    });
  }, [active]);

  return (
    <div ref={page} className="bg-ivory">
      {early || after ? null : (
        <a
          href="#confirmar"
          className="sr-only-focusable fixed top-2 left-2 z-50 rounded-md bg-ink px-4 py-2 text-sm text-paper"
        >
          Ir a confirmar asistencia
        </a>
      )}

      {/* La carta de la pantalla anterior se transforma en esta cabecera: con foto, una portada a
          pantalla completa que se aleja al bajar; sin foto, una cabecera de papel. */}
      <ViewTransition name="carta" share="paper-morph" default="none">
        <header
          ref={hero}
          className={clsx(
            "relative overflow-hidden",
            heroPhoto
              ? "hero flex min-h-[100svh] flex-col bg-ink text-white"
              : "paper-grain bg-paper",
          )}
        >
          {heroPhoto ? (
            <>
              <div aria-hidden className="hero-photo absolute inset-0">
                <Image
                  src={heroPhoto}
                  alt=""
                  fill
                  priority
                  sizes="100vw"
                  className="hero-photo-in object-cover object-[50%_28%]"
                />
              </div>
              {/* Sombra para leer: arriba, el distintivo; abajo, los nombres y los botones. */}
              <div
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(180deg,rgb(0_0_0/0.42)_0%,rgb(0_0_0/0)_24%,rgb(0_0_0/0)_38%,rgb(0_0_0/0.72)_82%,rgb(0_0_0/0.86)_100%)]"
              />
              <div aria-hidden className="hero-shade absolute inset-0 bg-ink" />
            </>
          ) : null}
          <div
            className={clsx(
              "relative mx-auto w-full max-w-5xl px-6 pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-10",
              heroPhoto ? "flex flex-1 flex-col pb-20" : "pb-16 sm:pb-24",
            )}
          >
            <div className="flex items-center justify-between">
              <Monogram
                first={event.couple.first}
                second={event.couple.second}
                className={clsx("size-11", heroPhoto ? "text-white/90" : "text-gold")}
              />
              {badge === null ? null : <DemoBadge label={badge} />}
            </div>

            <div className={heroPhoto ? "hero-copy mt-auto pt-24" : undefined}>
              <h1
                id="content-title"
                ref={titleRef}
                tabIndex={-1}
                translate="no"
                className={clsx(
                  "font-names leading-[0.86] tracking-[-0.02em] outline-none",
                  heroPhoto
                    ? "hero-rise text-[clamp(3.75rem,18vw,9rem)] text-white [text-shadow:0_2px_30px_rgb(0_0_0/0.45)]"
                    : "mt-16 text-[clamp(4rem,19vw,10rem)] text-ink sm:mt-24",
                )}
              >
                {event.couple.first}
                {event.couple.second ? (
                  <span className="block pl-[0.6em]">&amp; {event.couple.second}</span>
                ) : null}
              </h1>

              <div
                className={clsx(
                  "grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end",
                  heroPhoto ? "hero-rise mt-7 [animation-delay:160ms]" : "mt-10 sm:mt-14",
                )}
              >
                <div>
                  <p
                    className={clsx(
                      "font-display text-[1.5rem] leading-snug sm:text-[1.75rem]",
                      heroPhoto ? "text-white" : "text-ink",
                    )}
                  >
                    <time
                      dateTime={isoDay(event.date)}
                      className="inline-block first-letter:uppercase"
                    >
                      {formatWeekdayDate(event.date)}
                    </time>
                    <br />
                    <span className={clsx("italic", heroPhoto ? "text-white/85" : "text-ink-soft")}>
                      {event.city}, {event.region}
                    </span>
                  </p>
                  {clock.active || after ? null : (
                    <div className="mt-3 flex flex-wrap items-baseline gap-x-5 gap-y-1 text-[0.9375rem]">
                      <DaysLeft
                        date={event.date}
                        className={heroPhoto ? "text-white/85" : "text-muted"}
                      />
                      <a
                        href="#fecha"
                        className={clsx(
                          "underline underline-offset-4",
                          heroPhoto
                            ? "text-white decoration-white/60 hover:decoration-white"
                            : "text-ink decoration-gold hover:decoration-ink",
                        )}
                      >
                        Añadir al calendario
                      </a>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {early ? (
                    <a href="#fecha" className={cta}>
                      Guardar la fecha
                    </a>
                  ) : clock.active ? (
                    <a href="#en-directo" className={cta}>
                      Qué pasa ahora
                    </a>
                  ) : after ? (
                    <a href="#gracias-title" className={cta}>
                      Leer nuestro agradecimiento
                    </a>
                  ) : (
                    <a href="#confirmar" className={cta}>
                      Confirmar asistencia
                    </a>
                  )}
                  {early || after ? null : (
                    <a
                      href="#programa"
                      className={buttonClasses(heroPhoto ? "light" : "secondary", "lg")}
                    >
                      Ver el programa
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
          {heroPhoto ? (
            <ChevronDown
              aria-hidden
              className="nudge absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 size-5 -translate-x-1/2 text-white/80"
            />
          ) : (
            <AlmondBranch className="pointer-events-none absolute -right-6 bottom-6 w-40 rotate-[-12deg] opacity-80 sm:right-[6%] sm:w-56" />
          )}
        </header>
      </ViewTransition>

      {clock.active ? <LiveDay event={event} clock={clock} /> : null}
      {after ? <ThankYou event={event} albumToken={albumToken} /> : null}

      {early ? (
        <SaveTheDateOnly event={event} calendar={calendar} />
      ) : (
        <>
          {after ? null : (
            <aside aria-label="Tu respuesta" className="border-t border-line bg-paper">
              <div className="mx-auto max-w-5xl px-6 py-4 sm:px-10">
                <ResponseStatus event={event} group={group} />
              </div>
            </aside>
          )}

          <nav
            aria-label="Secciones de la invitación"
            inert={immersive}
            className={clsx(
              "sticky top-0 z-30 border-y border-line bg-ivory/92 backdrop-blur-md transition-[translate,opacity] duration-500",
              immersive && "-translate-y-full opacity-0",
            )}
          >
            <ul
              ref={navRef}
              className="relative mx-auto flex max-w-5xl [scrollbar-width:none] gap-6 overflow-x-auto px-6 sm:px-10"
            >
              {nav
                .filter((item) => !(after && item.id === "confirmar"))
                .map((item) => (
                  <li key={item.id} className="shrink-0">
                    <a
                      href={`#${item.id}`}
                      aria-current={active === item.id ? "true" : undefined}
                      className={clsx(
                        "block border-b-2 py-3.5 text-[0.9375rem] transition-colors",
                        active === item.id
                          ? "border-ink text-ink"
                          : "border-transparent text-muted hover:text-ink",
                      )}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
            </ul>
          </nav>

          <main>
            <section
              aria-label="Bienvenida"
              className="mx-auto max-w-5xl px-6 py-16 sm:px-10 sm:py-24"
            >
              {/* La bienvenida se enciende palabra a palabra al pasar por el centro. */}
              <p
                data-view
                style={{ "--n": welcome.length } as CSSProperties}
                className="max-w-[34ch] font-display text-[1.625rem] leading-[1.45] text-ink sm:text-[2rem] md:ml-[15.5rem]"
              >
                {welcome.map((word, i) => (
                  <Fragment key={i}>
                    <span className="lit-word" style={{ "--i": i } as CSSProperties}>
                      {word}
                    </span>{" "}
                  </Fragment>
                ))}
              </p>
            </section>

            {order.filter(shows).map((id) => (
              <Fragment key={id}>
                {
                  {
                    fecha: clock.active ? null : <SaveTheDate event={event} variant={calendar} />,
                    // El día de la boda manda lo práctico: la lista, con el acto de ahora.
                    programa: programScene ? (
                      <ProgramScene event={event} />
                    ) : (
                      <ProgramSection event={event} currentId={live?.current?.id ?? null} />
                    ),
                    lugares: <VenuesSection event={event} />,
                    transporte: <TransportSection event={event} response={saved} />,
                    info: <PracticalSection event={event} />,
                    historia: storyScene ? (
                      <StoryScene event={event} />
                    ) : (
                      <StorySection event={event} />
                    ),
                    regalo: (
                      <GiftSection
                        event={event}
                        token={group.token}
                        live={Boolean(group.persisted)}
                        initial={gifts}
                      />
                    ),
                  }[id]
                }
              </Fragment>
            ))}
            {after ? null : <RsvpSection event={event} group={group} seal={seal} />}
            {albumToken ? (
              <section aria-labelledby="album-title" className="border-t border-line bg-paper">
                <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-14 sm:flex-row sm:items-center sm:justify-between sm:px-10">
                  <div>
                    <h2
                      id="album-title"
                      className="font-display text-[1.75rem] leading-tight text-ink"
                    >
                      El álbum {ofEvent(event)}
                    </h2>
                    <p className="mt-1 max-w-[46ch] text-[0.9375rem] leading-relaxed text-muted">
                      {after
                        ? "Las fotos que hicisteis ese día. Si te queda alguna en el móvil, aún puedes subirla."
                        : "Ese día, sube aquí las fotos que hagas. Las mesas tendrán también un código QR."}
                    </p>
                  </div>
                  <a href={`/album/${albumToken}`} className={buttonClasses("secondary", "lg")}>
                    Abrir el álbum
                  </a>
                </div>
              </section>
            ) : null}
          </main>
        </>
      )}

      {/* Cierre: con foto de portada, la última imagen es esa; sin ella, un pie de papel. */}
      <footer
        className={clsx(
          "relative overflow-hidden",
          event.coverPhoto ? "bg-ink text-white" : "border-t border-line bg-paper",
        )}
      >
        {event.coverPhoto ? (
          <>
            <Image
              src={event.coverPhoto}
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-[50%_40%]"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(180deg,rgb(0_0_0/0.5)_0%,rgb(0_0_0/0.12)_40%,rgb(0_0_0/0.78)_100%)]"
            />
          </>
        ) : null}
        <div
          className={clsx(
            "relative mx-auto flex max-w-5xl flex-col gap-6 px-6 pb-[max(3rem,env(safe-area-inset-bottom))] sm:px-10",
            event.coverPhoto
              ? "min-h-[82svh] justify-end pt-24"
              : "pt-14 sm:flex-row sm:items-end sm:justify-between",
          )}
        >
          <div>
            {event.coverPhoto ? (
              <p className="mb-4 font-display text-[1.5rem] leading-snug first-letter:uppercase">
                {after ? "Gracias por estar" : "Os esperamos"}
              </p>
            ) : null}
            <p
              translate="no"
              className={clsx(
                "font-names",
                event.coverPhoto
                  ? "text-[clamp(3rem,15vw,6rem)] leading-[0.9] [text-shadow:0_2px_30px_rgb(0_0_0/0.45)]"
                  : "text-4xl text-ink",
              )}
            >
              {hostNames(event.couple)}
            </p>
            {event.coverPhoto ? (
              <p className="mt-4 font-display text-[1.25rem] first-letter:uppercase">
                {formatWeekdayDate(event.date)}, en {event.city}
              </p>
            ) : null}
            <p
              translate="no"
              className={clsx("caption mt-1", event.coverPhoto ? "text-white/80" : "text-ink-soft")}
            >
              {event.hashtag}
            </p>
          </div>
          <button
            type="button"
            onClick={onReplay}
            className={clsx(
              "inline-flex items-center gap-2 self-start rounded-md px-3 py-2 text-[0.9375rem] transition-colors",
              event.coverPhoto
                ? "-ml-3 text-white/90 hover:bg-white/10 hover:text-white"
                : "text-ink-soft hover:bg-ink/5 hover:text-ink sm:self-auto",
            )}
          >
            <RotateCcw aria-hidden className="size-4" /> Volver a abrir el sobre
          </button>
          <p
            className={clsx(
              "max-w-prose text-[0.8125rem] leading-relaxed",
              event.coverPhoto ? "text-white/70" : "text-muted",
            )}
          >
            Prototipo de demostración. Los nombres, lugares y respuestas son ficticios, y las
            respuestas solo se guardan en este navegador.
          </p>
        </div>
      </footer>
    </div>
  );
}
