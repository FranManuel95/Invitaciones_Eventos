"use client";

import { AnimatePresence, MotionConfig } from "motion/react";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { DemoBadge } from "@/components/demo-badge";
import { hasOpenedEnvelope, markEnvelopeOpened } from "@/lib/data/rsvp-store";
import type { GuestGroup, WeddingEvent } from "@/lib/domain/types";
import { InvitationContent } from "./content/invitation-content";
import { CoverStage } from "./cover/cover-stage";
import { EnvelopeStage } from "./envelope/envelope-stage";
import { LetterStage } from "./letter/letter-stage";

type Stage = "cover" | "envelope" | "letter" | "content";

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
      if (next === "content") markEnvelopeOpened(group.token);
      setStage(next);
    },
    [group.token],
  );

  // Gestión del foco: al cambiar de pantalla se enfoca su título para lectores de pantalla y teclado.
  useEffect(() => {
    if (!userNavigated.current) return;
    const frame = requestAnimationFrame(() => {
      const heading = document.getElementById(HEADINGS[stage]);
      heading?.focus({ preventScroll: true });
    });
    if (stage === "content") window.scrollTo({ top: 0 });
    return () => cancelAnimationFrame(frame);
  }, [stage]);

  const intro = stage !== "content";

  return (
    <MotionConfig reducedMotion="user">
      {intro ? (
        <div className="fixed top-[max(1rem,env(safe-area-inset-top))] right-4 z-50">
          <button
            type="button"
            onClick={() => go("content")}
            className={
              stage === "cover"
                ? "rounded-full border border-white/40 bg-black/15 px-4 py-2 text-xs tracking-[0.14em] text-white backdrop-blur-sm transition-colors hover:bg-black/30"
                : "rounded-full border border-ink/20 bg-paper/60 px-4 py-2 text-xs tracking-[0.14em] text-ink backdrop-blur-sm transition-colors hover:bg-paper"
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
          <EnvelopeStage key="envelope" event={event} group={group} onOpened={() => go("letter")} />
        ) : null}
        {stage === "letter" ? (
          <LetterStage key="letter" event={event} group={group} onContinue={() => go("content")} />
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
        <InvitationContent event={event} group={group} onReplay={() => go("cover")} />
      ) : null}
    </MotionConfig>
  );
}
