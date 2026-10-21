"use client";

import { clsx } from "clsx";
import { RotateCcw } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { DemoBadge } from "@/components/demo-badge";
import type { GuestGroup, WeddingEvent } from "@/lib/domain/types";
import { Landscape } from "../cover/landscape";
import { Divider, Emblem, OliveSprig } from "../ornaments";
import { RsvpSection } from "../rsvp/rsvp-section";
import { Countdown } from "./countdown";
import { Reveal } from "./reveal";
import { PracticalSection, ProgramSection, TransportSection, VenuesSection } from "./sections";

const NAV = [
  { id: "programa", label: "Programa" },
  { id: "lugares", label: "Lugares" },
  { id: "transporte", label: "Transporte" },
  { id: "info", label: "Información" },
  { id: "confirmar", label: "Confirmar" },
];

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

const NAV_IDS = NAV.map((n) => n.id);

/** Pantallas 4 a 7 · La invitación completa con secciones y RSVP. */
export function InvitationContent({
  event,
  group,
  onReplay,
}: {
  event: WeddingEvent;
  group: GuestGroup;
  onReplay: () => void;
}) {
  const active = useActiveSection(NAV_IDS);
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="bg-ivory"
    >
      <a
        href="#confirmar"
        className="sr-only-focusable fixed top-2 left-2 z-50 rounded-md bg-ink px-4 py-2 text-sm text-paper"
      >
        Ir a confirmar asistencia
      </a>

      <header className="relative flex min-h-[78svh] flex-col items-center justify-end overflow-hidden px-6 pt-24 pb-14 text-center text-white">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Landscape className="size-full" />
        </motion.div>
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgb(20_22_32/0.35)_0%,rgb(20_16_22/0.05)_30%,rgb(20_14_20/0.6)_55%,rgb(14_11_16/0.88)_100%)]"
        />
        <DemoBadge
          tone="dark"
          className="absolute top-[max(1rem,env(safe-area-inset-top))] left-4"
        />
        <div className="relative">
          <p className="eyebrow text-white/80">Nos casamos</p>
          <h1
            id="content-title"
            tabIndex={-1}
            className="mt-4 font-display text-[clamp(3rem,13vw,5.5rem)] leading-[0.95] font-light outline-none"
          >
            {event.couple.first} <span className="italic">&amp;</span> {event.couple.second}
          </h1>
          <p className="mt-5 text-sm tracking-[0.4em] text-white/90">
            <time dateTime={event.date.slice(0, 10)}>{event.dateLabel}</time>
          </p>
          <p className="eyebrow mt-2 text-white/70">
            {event.city} · {event.region}
          </p>
          <div className="mt-10">
            <Countdown date={event.date} />
          </div>
        </div>
      </header>

      <nav
        aria-label="Secciones de la invitación"
        className="sticky top-0 z-30 border-b border-line bg-ivory/90 backdrop-blur-md"
      >
        <ul
          ref={navRef}
          className="relative mx-auto flex max-w-4xl [scrollbar-width:none] gap-1 overflow-x-auto px-4 py-2 sm:justify-center"
        >
          {NAV.map((item) => (
            <li key={item.id} className="shrink-0">
              <a
                href={`#${item.id}`}
                aria-current={active === item.id ? "true" : undefined}
                className={clsx(
                  "block rounded-full px-3.5 py-2 text-[0.8125rem] transition-colors",
                  active === item.id ? "bg-ink text-paper" : "text-ink-soft hover:bg-ink/5",
                  item.id === "confirmar" && active !== item.id && "font-semibold text-ink",
                )}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <main>
        <section aria-label="Bienvenida" className="relative px-6 py-20 text-center sm:py-28">
          <Reveal className="mx-auto max-w-xl">
            <Emblem className="mx-auto size-9 text-gold" />
            <p className="eyebrow mt-6 text-muted">Para {group.displayName}</p>
            <p className="mt-5 font-display text-[1.625rem] leading-snug font-light text-ink sm:text-3xl">
              {event.welcomeMessage}
            </p>
            <Divider className="mx-auto mt-8 text-gold" />
          </Reveal>
          <OliveSprig className="pointer-events-none absolute right-4 bottom-6 w-20 opacity-50 sm:right-[12%] sm:w-28" />
        </section>

        <ProgramSection event={event} />
        <VenuesSection event={event} />
        <TransportSection event={event} />
        <PracticalSection event={event} />
        <RsvpSection event={event} group={group} />
      </main>

      <footer className="border-t border-line bg-paper px-6 pt-16 pb-[max(3rem,env(safe-area-inset-bottom))] text-center">
        <p className="font-display text-4xl text-ink">
          {event.couple.first} <span className="italic">&amp;</span> {event.couple.second}
        </p>
        <p className="mt-2 text-sm tracking-[0.3em] text-ink-soft">{event.dateLabel}</p>
        <p className="mt-4 text-sm text-muted">{event.hashtag}</p>
        <button
          type="button"
          onClick={onReplay}
          className="mt-8 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[0.8125rem] text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
        >
          <RotateCcw aria-hidden className="size-4" /> Volver a abrir el sobre
        </button>
        <p className="mx-auto mt-10 max-w-sm text-xs leading-relaxed text-muted">
          Prototipo de demostración. Los nombres, lugares y respuestas son ficticios y las
          respuestas solo se guardan en este navegador.
        </p>
      </footer>
    </motion.div>
  );
}
