"use client";

import { AnimatePresence, domAnimation, LazyMotion, MotionConfig } from "motion/react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { DemoBadge } from "@/components/demo-badge";
import { hasOpenedEnvelope, markEnvelopeOpened } from "@/lib/data/session";
import type { GuestGroup, WeddingEvent } from "@/lib/domain/types";
import { CoverStage } from "./cover/cover-stage";
import { EnvelopeStage } from "./envelope/envelope-stage";
import { LetterStage } from "./letter/letter-stage";

type Stage = "cover" | "envelope" | "letter" | "content";

// El contenido y el RSVP (con Zod) no hacen falta para la portada: se cargan aparte y se
// precargan en cuanto el invitado empieza a abrir la invitación.
const loadContent = () => import("./content/invitation-content");
const InvitationContent = dynamic(() => loadContent().then((mod) => mod.InvitationContent), {
  ssr: false,
  loading: () => (
    <p role="status" className="grid min-h-dvh place-items-center text-[0.9375rem] text-muted">
      Cargando la invitación…
    </p>
  ),
});

const noopSubscribe = () => () => {};

const HEADINGS: Record<Stage, string> = {
  cover: "cover-title",
  envelope: "envelope-title",
  letter: "letter-title",
  content: "content-title",
};

/**
 * Orquesta el recorrido del invitado: portada → sobre → carta → invitación.
 * La introducción se puede saltar en cualquier momento y no se repite en la misma sesión.
 */
export function InvitationExperience({ event, group }: { event: WeddingEvent; group: GuestGroup }) {
  const [chosenStage, setStage] = useState<Stage | null>(null);
  const userNavigated = useRef(false);
  // Si ya abrió el sobre en esta sesión, va directo al contenido (en servidor siempre es la portada).
  const openedBefore = useSyncExternalStore(
    noopSubscribe,
    () => hasOpenedEnvelope(group.token),
    () => false,
  );
  const stage: Stage = chosenStage ?? (openedBefore ? "content" : "cover");

  const go = useCallback(
    (next: Stage) => {
      userNavigated.current = true;
      if (next !== "cover") void loadContent();
      if (next === "content") markEnvelopeOpened(group.token);
      setStage(next);
    },
    [group.token],
  );

  // Gestión del foco: al cambiar de pantalla se enfoca su título para lectores de pantalla y teclado.
  useEffect(() => {
    // El contenido gestiona su propio foco porque se carga aparte.
    if (!userNavigated.current || stage === "content") return;
    const frame = requestAnimationFrame(() => {
      const heading = document.getElementById(HEADINGS[stage]);
      heading?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [stage]);

  const intro = stage !== "content";

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        {intro ? (
          <div className="fixed top-[max(1rem,env(safe-area-inset-top))] right-4 z-50">
            <button
              type="button"
              onClick={() => go("content")}
              className={
                stage === "cover"
                  ? "rounded-full border border-white/40 bg-black/15 px-4 py-2 text-[0.8125rem] text-white backdrop-blur-sm transition-colors hover:bg-black/30"
                  : "rounded-full border border-ink/20 bg-paper/60 px-4 py-2 text-[0.8125rem] text-ink backdrop-blur-sm transition-colors hover:bg-paper"
              }
            >
              Saltar intro
            </button>
          </div>
        ) : null}

        {intro ? (
          <div className="fixed top-[max(1rem,env(safe-area-inset-top))] left-4 z-50">
            <DemoBadge tone={stage === "cover" ? "dark" : "light"} />
          </div>
        ) : null}

        <AnimatePresence>
          {stage === "cover" ? (
            <CoverStage key="cover" event={event} onOpen={() => go("envelope")} />
          ) : null}
        </AnimatePresence>
        <AnimatePresence mode="wait">
          {stage === "envelope" ? (
            <EnvelopeStage
              key="envelope"
              event={event}
              group={group}
              onOpened={() => go("letter")}
            />
          ) : null}
          {stage === "letter" ? (
            <LetterStage
              key="letter"
              event={event}
              group={group}
              onContinue={() => go("content")}
            />
          ) : null}
        </AnimatePresence>
        {/* El sobre se monta bajo la portada para que se vea al deslizarla. */}
        {stage === "cover" ? (
          <div
            aria-hidden
            className="fixed inset-0 bg-[radial-gradient(120%_80%_at_50%_45%,#e3d6c2_0%,#cdbca4_55%,#b6a387_100%)]"
          />
        ) : null}

        {stage === "content" ? (
          <InvitationContent
            event={event}
            group={group}
            onReplay={() => go("cover")}
            focusOnMount={chosenStage !== null}
          />
        ) : null}
      </MotionConfig>
    </LazyMotion>
  );
}
