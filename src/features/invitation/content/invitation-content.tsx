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
import { RSVP_START_EVENT, RsvpSection } from "../rsvp/rsvp-section";
import { DaysLeft } from "./countdown";
import { useSavedResponse } from "../rsvp/use-saved-response";
import { GiftSection } from "./gift-section";
import { GuestbookSection } from "./guestbook-section";
import { EMPTY_GUESTBOOK, type GuestbookState } from "@/lib/guestbook";
import { EMPTY_GIFT_STATUS, type GiftStatus } from "@/lib/gifts";
import { ResponseStatus } from "./response-status";
import { dayClock, isAfterEvent, liveProgram } from "@/lib/day-mode";
import { ThankYou } from "./thank-you";
import { LiveDay } from "./live-day";
import { SaveTheDate, SaveTheDateOnly } from "./save-the-date";
import { SectionDock, type DockLink } from "./section-dock";
import { isDeadlinePassed } from "@/lib/rsvp/draft";
import {
  SECTION_IDS,
  type CalendarId,
  type SealMarkId,
  type SealShapeId,
  type SectionId,
} from "@/lib/theme";
import { PlaylistBand } from "./playlist-band";
import { ProgramScene } from "./program-scene";
import { StoryScene } from "./story-scene";
import { VenueScene } from "./venue-scene";
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
  /** Libro de firmas y canciones pedidas. */
  guestbook?: GuestbookState;
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
  guestbook = EMPTY_GUESTBOOK,
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
  // Para el abanico del álbum: hasta tres fotos del evento, las que haya.
  const albumPhotos = useMemo(
    () =>
      [event.venues[1]?.photo, heroPhoto, event.venues[0]?.photo, event.coverPhoto]
        .filter((src, i, all): src is string => Boolean(src) && all.indexOf(src) === i)
        .slice(0, 3),
    [event.venues, event.coverPhoto, heroPhoto],
  );
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
  const venueScene =
    !reduce && event.venues.length >= 2 && event.venues.every((venue) => venue.photo);
  // Lo que sigue a «El día»: si es otra escena oscura, la noche enlaza con ella sin amanecer.
  const visible = order.filter(shows);
  const afterProgram = visible[visible.indexOf("programa") + 1];
  const darkAfterProgram =
    (afterProgram === "lugares" && venueScene) || (afterProgram === "historia" && storyScene);
  const immersive =
    (active === "programa" && programScene) ||
    (active === "historia" && storyScene) ||
    (active === "lugares" && venueScene);
  // Lo que ofrece la píldora del móvil: confirmar, o el pase si ya se ha confirmado.
  const closed = isDeadlinePassed(event, group);
  const dockCta: DockLink | null = after
    ? null
    : saved?.status === "attending"
      ? { href: "#pase", label: "Tu pase" }
      : closed
        ? null
        : saved
          ? { href: "#confirmar", label: "Cambiar respuesta" }
          : { href: "#confirmar", label: "Confirmar" };
  // Responder desde la píldora: el formulario se abre ya en el paso siguiente.
  const answerFromDock = (status: "attending" | "declined") => {
    window.dispatchEvent(new CustomEvent(RSVP_START_EVENT, { detail: status }));
    document.getElementById("confirmar")?.scrollIntoView({ block: "start" });
  };
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
          <nav
            aria-label="Secciones de la invitación"
            inert={immersive}
            className={clsx(
              "sticky top-0 z-30 border-y border-line bg-ivory/92 backdrop-blur-md transition-[translate,opacity] duration-500 max-sm:hidden",
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

          {/* En el móvil, la barra de secciones es una píldora flotante abajo, junto al pulgar. */}
          <SectionDock
            nav={after ? nav.filter((item) => item.id !== "confirmar") : nav}
            active={active}
            hidden={immersive || active === "confirmar"}
            cta={dockCta}
            ask={
              !saved && !closed && !after
                ? {
                    question: group.members.length > 1 ? "¿Venís?" : "¿Vienes?",
                    onAnswer: answerFromDock,
                  }
                : null
            }
          />

          <main>
            {/* Bienvenida: con foto de portada sigue sobre negro, como el título de una película,
                y se enciende palabra a palabra; después amanece hacia el papel. */}
            <section
              aria-label="Bienvenida"
              className={
                heroPhoto
                  ? "bg-[linear-gradient(180deg,#060605,#10110d_45%)] text-white"
                  : undefined
              }
            >
              <div
                className={clsx(
                  "mx-auto max-w-5xl px-6 sm:px-10",
                  heroPhoto ? "flex min-h-[78svh] flex-col justify-center py-20" : "py-16 sm:py-24",
                )}
              >
                <p
                  className={clsx(
                    "mb-6 font-display text-[1.375rem] italic md:ml-[15.5rem]",
                    heroPhoto ? "text-white/80" : "text-ink-soft",
                  )}
                >
                  {group.displayName}:
                </p>
                <p
                  data-view
                  style={{ "--n": welcome.length } as CSSProperties}
                  className={clsx(
                    "max-w-[30ch] font-display leading-[1.4] md:ml-[15.5rem]",
                    heroPhoto
                      ? "text-[clamp(1.875rem,8vw,2.5rem)] text-white"
                      : "text-[1.625rem] text-ink sm:text-[2rem]",
                  )}
                >
                  {welcome.map((word, i) => (
                    <Fragment key={i}>
                      <span className="lit-word" style={{ "--i": i } as CSSProperties}>
                        {word}
                      </span>{" "}
                    </Fragment>
                  ))}
                </p>
              </div>
              {heroPhoto ? <div aria-hidden className="scene-out h-[24svh]" /> : null}
            </section>

            {after ? null : (
              <aside aria-label="Tu respuesta" className="border-t border-line bg-paper">
                <div className="mx-auto max-w-5xl px-6 py-4 sm:px-10">
                  <ResponseStatus event={event} group={group} />
                </div>
              </aside>
            )}

            {order.filter(shows).map((id) => (
              <Fragment key={id}>
                {
                  {
                    fecha: clock.active ? null : <SaveTheDate event={event} variant={calendar} />,
                    // El día de la boda manda lo práctico: la lista, con el acto de ahora.
                    programa: programScene ? (
                      <ProgramScene event={event} dawn={!darkAfterProgram} />
                    ) : (
                      <ProgramSection event={event} currentId={live?.current?.id ?? null} />
                    ),
                    lugares: venueScene ? (
                      <VenueScene event={event} />
                    ) : (
                      <VenuesSection event={event} />
                    ),
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
            {after ? null : (
              <PlaylistBand
                url={event.playlistUrl ?? ""}
                response={saved}
                songs={guestbook.songs}
              />
            )}
            {event.guestbook ? (
              <GuestbookSection
                event={event}
                group={group}
                live={Boolean(group.persisted)}
                initial={guestbook}
              />
            ) : null}
            {albumToken ? (
              <section
                aria-labelledby="album-title"
                className="overflow-hidden border-t border-line bg-paper"
              >
                <div className="mx-auto grid max-w-5xl gap-10 px-6 py-16 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-10 sm:py-20">
                  {/* Tres fotos reveladas que se abren en abanico al llegar. */}
                  {albumPhotos.length >= 2 ? (
                    <div
                      data-view
                      aria-hidden
                      className="flex justify-center py-4 sm:order-2 sm:px-8"
                    >
                      {albumPhotos.map((src, i) => (
                        <span
                          key={src}
                          className="fan-card relative -mx-4 block w-32 bg-white p-1.5 pb-6 shadow-[0_14px_28px_-14px_rgb(0_0_0/0.55)]"
                          style={{ "--k": i - (albumPhotos.length - 1) / 2 } as CSSProperties}
                        >
                          <span className="relative block aspect-square overflow-hidden bg-cream">
                            <Image src={src} alt="" fill sizes="128px" className="object-cover" />
                          </span>
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <div>
                    <h2
                      id="album-title"
                      className="reveal-title font-display text-[2.5rem] leading-[1.05] text-ink sm:text-[3rem]"
                    >
                      El álbum {ofEvent(event)}
                    </h2>
                    <p className="mt-4 max-w-[46ch] text-[1.0625rem] leading-relaxed text-ink-soft">
                      {after
                        ? "Las fotos que hicisteis ese día. Si te queda alguna en el móvil, aún puedes subirla."
                        : "Ese día, sube aquí las fotos que hagas. Las mesas tendrán también un código QR."}
                    </p>
                    <a
                      href={`/album/${albumToken}`}
                      className={clsx(buttonClasses("primary", "lg"), "mt-7")}
                    >
                      Abrir el álbum
                    </a>
                  </div>
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
          {/* Solo en la demo y la vista previa (ni en invitaciones reales ni al grabar). */}
          {badge === null ? null : (
            <p
              className={clsx(
                "max-w-prose text-[0.8125rem] leading-relaxed",
                event.coverPhoto ? "text-white/70" : "text-muted",
              )}
            >
              Prototipo de demostración. Los nombres, lugares y respuestas son ficticios, y las
              respuestas solo se guardan en este navegador.
            </p>
          )}
        </div>
      </footer>
    </div>
  );
}
