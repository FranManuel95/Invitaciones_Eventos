"use client";

import { clsx } from "clsx";
import { RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState, ViewTransition } from "react";
import { DemoBadge } from "@/components/demo-badge";
import { buttonClasses } from "@/components/ui/button";
import type { GuestGroup, WeddingEvent } from "@/lib/domain/types";
import { formatWeekdayDate, isoDay } from "@/lib/format";
import { AlmondBranch, Monogram } from "../ornaments";
import { RsvpSection } from "../rsvp/rsvp-section";
import { DaysLeft } from "./countdown";
import { useSavedResponse } from "../rsvp/use-saved-response";
import { GiftSection } from "./gift-section";
import { ResponseStatus } from "./response-status";
import { dayClock, liveProgram } from "@/lib/day-mode";
import { LiveDay } from "./live-day";
import { SaveTheDate } from "./save-the-date";
import type { CalendarId, SectionId } from "@/lib/theme";
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
}: InvitationContentProps) {
  const shows = (id: SectionId) => !hidden.includes(id);
  const nav = useMemo(() => NAV.filter((n) => !(hidden as string[]).includes(n.id)), [hidden]);
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
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!focusOnMount) return;
    window.scrollTo({ top: 0 });
    titleRef.current?.focus({ preventScroll: true });
  }, [focusOnMount]);
  const navRef = useRef<HTMLUListElement>(null);

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
    <div className="bg-ivory">
      <a
        href="#confirmar"
        className="sr-only-focusable fixed top-2 left-2 z-50 rounded-md bg-ink px-4 py-2 text-sm text-paper"
      >
        Ir a confirmar asistencia
      </a>

      {/* La carta de la pantalla anterior se transforma en esta cabecera de papel. */}
      <ViewTransition name="carta" share="paper-morph" default="none">
        <header className="paper-grain relative overflow-hidden bg-paper">
          <div className="mx-auto max-w-5xl px-6 pt-[max(1.25rem,env(safe-area-inset-top))] pb-16 sm:px-10 sm:pb-24">
            <div className="flex items-center justify-between">
              <Monogram
                first={event.couple.first}
                second={event.couple.second}
                className="size-11 text-gold"
              />
              {badge === null ? null : <DemoBadge label={badge} />}
            </div>

            <h1
              id="content-title"
              ref={titleRef}
              tabIndex={-1}
              translate="no"
              className="mt-16 font-names text-[clamp(4rem,19vw,10rem)] leading-[0.86] tracking-[-0.02em] text-ink outline-none sm:mt-24"
            >
              {event.couple.first}
              <span className="block pl-[0.6em]">&amp; {event.couple.second}</span>
            </h1>

            <div className="mt-10 grid gap-8 sm:mt-14 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
              <div>
                <p className="font-display text-[1.5rem] leading-snug text-ink sm:text-[1.75rem]">
                  <time
                    dateTime={isoDay(event.date)}
                    className="inline-block first-letter:uppercase"
                  >
                    {formatWeekdayDate(event.date)}
                  </time>
                  <br />
                  <span className="text-ink-soft italic">
                    {event.city}, {event.region}
                  </span>
                </p>
                {clock.active ? null : (
                  <div className="mt-3 flex flex-wrap items-baseline gap-x-5 gap-y-1 text-[0.9375rem]">
                    <DaysLeft date={event.date} className="text-muted" />
                    <a
                      href="#fecha"
                      className="text-ink underline decoration-gold underline-offset-4 hover:decoration-ink"
                    >
                      Añadir al calendario
                    </a>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {clock.active ? (
                  <a href="#en-directo" className={buttonClasses("primary", "lg")}>
                    Qué pasa ahora
                  </a>
                ) : (
                  <a href="#confirmar" className={buttonClasses("primary", "lg")}>
                    Confirmar asistencia
                  </a>
                )}
                <a href="#programa" className={buttonClasses("secondary", "lg")}>
                  Ver el programa
                </a>
              </div>
            </div>
          </div>
          <AlmondBranch className="pointer-events-none absolute -right-6 bottom-6 w-40 rotate-[-12deg] opacity-80 sm:right-[6%] sm:w-56" />
        </header>
      </ViewTransition>

      {clock.active ? <LiveDay event={event} clock={clock} /> : null}

      <aside aria-label="Tu respuesta" className="border-t border-line bg-paper">
        <div className="mx-auto max-w-5xl px-6 py-4 sm:px-10">
          <ResponseStatus event={event} group={group} />
        </div>
      </aside>

      <nav
        aria-label="Secciones de la invitación"
        className="sticky top-0 z-30 border-y border-line bg-ivory/92 backdrop-blur-md"
      >
        <ul
          ref={navRef}
          className="relative mx-auto flex max-w-5xl [scrollbar-width:none] gap-6 overflow-x-auto px-6 sm:px-10"
        >
          {nav.map((item) => (
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
        <section aria-label="Bienvenida" className="mx-auto max-w-5xl px-6 py-16 sm:px-10 sm:py-24">
          <p className="max-w-[34ch] font-display text-[1.625rem] leading-[1.45] text-ink sm:text-[2rem] md:ml-[15.5rem]">
            {event.welcomeMessage}
          </p>
        </section>

        {clock.active || !shows("fecha") ? null : <SaveTheDate event={event} variant={calendar} />}
        {shows("programa") ? (
          <ProgramSection event={event} currentId={live?.current?.id ?? null} />
        ) : null}
        {shows("lugares") ? <VenuesSection event={event} /> : null}
        {shows("transporte") ? <TransportSection event={event} response={saved} /> : null}
        {shows("info") ? <PracticalSection event={event} /> : null}
        {shows("historia") ? <StorySection event={event} /> : null}
        {shows("regalo") ? <GiftSection event={event} /> : null}
        <RsvpSection event={event} group={group} />
      </main>

      <footer className="border-t border-line bg-paper">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 pt-14 pb-[max(3rem,env(safe-area-inset-bottom))] sm:flex-row sm:items-end sm:justify-between sm:px-10">
          <div>
            <p translate="no" className="font-names text-4xl text-ink">
              {event.couple.first} &amp; {event.couple.second}
            </p>
            <p translate="no" className="caption mt-1 text-ink-soft">
              {event.hashtag}
            </p>
          </div>
          <button
            type="button"
            onClick={onReplay}
            className="inline-flex items-center gap-2 self-start rounded-md px-3 py-2 text-[0.9375rem] text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink sm:self-auto"
          >
            <RotateCcw aria-hidden className="size-4" /> Volver a abrir el sobre
          </button>
        </div>
        <p className="mx-auto max-w-5xl px-6 pb-10 text-[0.8125rem] leading-relaxed text-muted sm:px-10">
          Prototipo de demostración. Los nombres, lugares y respuestas son ficticios, y las
          respuestas solo se guardan en este navegador.
        </p>
      </footer>
    </div>
  );
}
