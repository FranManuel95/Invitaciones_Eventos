"use client";

import { Volume2, VolumeX } from "lucide-react";
import { domAnimation, LazyMotion, MotionConfig, useReducedMotion } from "motion/react";
import {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  ViewTransition,
  type ComponentType,
} from "react";
import { DemoBadge } from "@/components/demo-badge";
import { hasOpenedEnvelope, markEnvelopeOpened } from "@/lib/data/session";
import { primeResponse } from "@/lib/data/rsvp-store";
import type { GuestGroup, RsvpResponse, WeddingEvent } from "@/lib/domain/types";
import { DEFAULT_THEME, STYLES, themeVars, type Theme } from "@/lib/theme";
import type { InvitationContentProps } from "./content/invitation-content";
import { BriefStage } from "./brief/brief-stage";
import { CoverStage } from "./cover/cover-stage";
import { startAmbient, stopAmbient } from "./effects/ambient";
import { isMuted, setMuted, subscribeMuted, unlockAudio } from "./effects/sound";
import { TiltProvider } from "./effects/tilt";
import { EnvelopeStage } from "./envelope/envelope-stage";
import { LetterStage } from "./letter/letter-stage";

export type Stage = "brief" | "cover" | "envelope" | "letter" | "content";

/*
 * El contenido y el RSVP (con Zod) no hacen falta para la portada: se cargan aparte y se
 * precargan en cuanto el invitado empieza a abrir la invitación. Se guarda el componente ya
 * resuelto (no con next/dynamic) para que no se suspenda al montarse: así la carta puede
 * transformarse en la cabecera dentro de la misma transición.
 */
const loadContent = () =>
  import("./content/invitation-content").then((mod) => mod.InvitationContent);

const noopSubscribe = () => () => {};

const HEADINGS: Record<Stage, string> = {
  brief: "brief-title",
  cover: "cover-title",
  envelope: "envelope-title",
  letter: "letter-title",
  content: "content-title",
};

/**
 * Orquesta el recorrido del invitado: portada → sobre → carta → invitación.
 * La introducción se puede saltar en cualquier momento. Quien vuelve en la misma sesión ve una
 * apertura corta (BriefStage) en lugar de toda la introducción.
 */
export function InvitationExperience({
  event,
  group,
  initialResponse,
  theme = DEFAULT_THEME,
  initialStage,
  preview = false,
}: {
  event: WeddingEvent;
  group: GuestGroup;
  /** Estilo, sobre, lacre y calendario elegidos para el evento. */
  theme?: Theme;
  /** Pantalla con la que empieza (la vista previa del editor salta a la que se pida). */
  initialStage?: Stage;
  /** Vista previa del editor: el distintivo dice «Vista previa». */
  preview?: boolean;
  /** Respuesta guardada en el servidor (invitaciones reales); undefined en la demo. */
  initialResponse?: RsvpResponse | null;
}) {
  // La respuesta del servidor se carga en la caché compartida antes del primer render.
  useState(() => {
    if (initialResponse !== undefined) primeResponse(group.token, initialResponse);
    return null;
  });
  const reduce = useReducedMotion();
  const [chosenStage, setStage] = useState<Stage | null>(null);
  const [Content, setContent] = useState<ComponentType<InvitationContentProps> | null>(null);
  const userNavigated = useRef(false);
  // Si ya abrió el sobre en esta sesión, apertura corta (en servidor siempre es la portada).
  const openedBefore = useSyncExternalStore(
    noopSubscribe,
    () => hasOpenedEnvelope(group.token),
    () => false,
  );
  const muted = useSyncExternalStore(subscribeMuted, isMuted, () => false);
  const stage: Stage =
    chosenStage ?? initialStage ?? (openedBefore ? (reduce ? "content" : "brief") : "cover");
  // Datos reales: sin distintivo. Demo o vista previa: se avisa de que no es una invitación real.
  const badge = group.persisted ? null : preview ? "Vista previa" : undefined;

  const preload = useCallback(() => {
    void loadContent().then((component) => setContent(() => component));
  }, []);

  useEffect(() => {
    if (openedBefore || (initialStage && initialStage !== "cover")) preload();
  }, [openedBefore, initialStage, preload]);

  useEffect(() => () => stopAmbient(0.3), []);

  const go = useCallback(
    (next: Stage) => {
      userNavigated.current = true;
      if (next !== "cover") preload();
      if (next === "content") markEnvelopeOpened(group.token);
      // Música: entra al levantar la portada y se despide al llegar al contenido.
      if (next === "envelope") startAmbient();
      if (next === "content" || next === "cover") stopAmbient(next === "content" ? 3 : 0.4);
      // Dentro de una transición: React activa los <ViewTransition> (la carta que se transforma).
      startTransition(() => setStage(next));
    },
    [group.token, preload],
  );

  const toContent = useCallback(() => go("content"), [go]);

  // Gestión del foco: al cambiar de pantalla se enfoca su título para lectores de pantalla y teclado.
  useEffect(() => {
    // La carta y el contenido enfocan su título al montarse.
    if (!userNavigated.current || stage === "content" || stage === "letter") return;
    const frame = requestAnimationFrame(() => {
      document.getElementById(HEADINGS[stage])?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [stage]);

  const intro = stage !== "content";
  const onDark = stage === "cover" || stage === "brief";

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <TiltProvider disabled={Boolean(reduce) || !intro}>
          {/* El tema sobrescribe las variables de color y tipografía de toda la invitación. */}
          <div
            data-style={theme.style}
            data-dark={STYLES[theme.style].dark ? "" : undefined}
            className="min-h-dvh bg-ivory text-ink"
            style={themeVars(theme)}
          >
            {intro ? (
              <div className="fixed top-[max(1rem,env(safe-area-inset-top))] right-4 z-50 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMuted(!muted);
                    if (!muted) stopAmbient(0.6);
                    else if (stage === "envelope" || stage === "letter") {
                      unlockAudio();
                      startAmbient();
                    }
                  }}
                  aria-pressed={!muted}
                  aria-label={muted ? "Activar sonido" : "Silenciar sonido"}
                  className={
                    onDark
                      ? "grid size-9 place-items-center rounded-full border border-white/40 bg-black/15 text-white backdrop-blur-sm transition-colors hover:bg-black/30"
                      : "grid size-9 place-items-center rounded-full border border-ink/20 bg-paper/60 text-ink backdrop-blur-sm transition-colors hover:bg-paper"
                  }
                >
                  {muted ? (
                    <VolumeX aria-hidden className="size-4" />
                  ) : (
                    <Volume2 aria-hidden className="size-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => go("content")}
                  className={
                    onDark
                      ? "rounded-full border border-white/40 bg-black/15 px-4 py-2 text-[0.8125rem] text-white backdrop-blur-sm transition-colors hover:bg-black/30"
                      : "rounded-full border border-ink/20 bg-paper/60 px-4 py-2 text-[0.8125rem] text-ink backdrop-blur-sm transition-colors hover:bg-paper"
                  }
                >
                  Saltar intro
                </button>
              </div>
            ) : null}

            {intro && badge !== null ? (
              <div className="fixed top-[max(1rem,env(safe-area-inset-top))] left-4 z-50">
                <DemoBadge tone={onDark ? "dark" : "light"} label={badge} />
              </div>
            ) : null}

            {stage === "brief" ? (
              <ViewTransition exit="fade-out" default="none">
                <BriefStage event={event} onDone={toContent} />
              </ViewTransition>
            ) : null}

            {/* El sobre ya está debajo de la portada: al levantarla con el dedo se ve esperando. */}
            {stage === "cover" || stage === "envelope" ? (
              <ViewTransition exit="fade-out" default="none">
                <EnvelopeStage
                  event={event}
                  group={group}
                  interactive={stage === "envelope"}
                  envelope={theme.envelope}
                  onOpened={() => go("letter")}
                />
              </ViewTransition>
            ) : null}
            {stage === "cover" ? <CoverStage event={event} onOpen={() => go("envelope")} /> : null}
            {stage === "letter" ? (
              <ViewTransition exit="fade-out" default="none">
                <LetterStage event={event} group={group} onContinue={() => go("content")} />
              </ViewTransition>
            ) : null}

            {stage === "content" ? (
              Content ? (
                <ViewTransition enter="fade-in" default="none">
                  <Content
                    event={event}
                    group={group}
                    onReplay={() => go("cover")}
                    focusOnMount={chosenStage !== null}
                    calendar={theme.calendar}
                    badge={badge}
                  />
                </ViewTransition>
              ) : (
                <p
                  role="status"
                  className="grid min-h-dvh place-items-center text-[0.9375rem] text-muted"
                >
                  Cargando la invitación…
                </p>
              )
            ) : null}
          </div>
        </TiltProvider>
      </MotionConfig>
    </LazyMotion>
  );
}
