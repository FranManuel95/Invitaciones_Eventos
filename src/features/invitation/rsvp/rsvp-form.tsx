"use client";

import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import {
  addTransitionType,
  startTransition,
  useEffect,
  useRef,
  useState,
  ViewTransition,
} from "react";
import { Button } from "@/components/ui/button";
import { saveResponse } from "@/lib/data/rsvp-store";
import type { GuestGroup, RsvpResponse, WeddingEvent } from "@/lib/domain/types";
import {
  STEP_TITLES,
  stepsFor,
  toResponse,
  validateStep,
  type FieldErrors,
  type RsvpDraft,
  type RsvpStep,
} from "@/lib/rsvp/draft";
import { DraftSummary } from "./rsvp-summary";
import {
  AttendanceStep,
  GuestsStep,
  MenuStep,
  MessageStep,
  TransportStep,
  type StepProps,
} from "./rsvp-steps";

const STEP_COMPONENTS: Record<
  Exclude<RsvpStep, "summary">,
  (props: StepProps) => React.ReactNode
> = {
  attendance: AttendanceStep,
  guests: GuestsStep,
  transport: TransportStep,
  menu: MenuStep,
  message: MessageStep,
};

const QUESTIONS: Record<RsvpStep, string> = {
  attendance: "Confirma tu asistencia",
  guests: "Acompañantes",
  transport: "Transporte",
  menu: "Menú y alergias",
  message: "Unas palabras",
  summary: "Todo listo",
};

/** Formulario RSVP por pasos: valida cada paso, permite volver atrás y gestiona carga/error. */
export function RsvpForm({
  event,
  group,
  initialDraft,
  initialStep = "attendance",
  onSaved,
  onCancel,
}: {
  event: WeddingEvent;
  group: GuestGroup;
  initialDraft: RsvpDraft;
  initialStep?: RsvpStep;
  onSaved: (response: RsvpResponse) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState(initialDraft);
  const [step, setStep] = useState<RsvpStep>(initialStep);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const firstRender = useRef(true);

  const steps = stepsFor(draft, event, group);
  const index = Math.max(0, steps.indexOf(step));
  const isLast = step === "summary";
  const nextStep = steps[index + 1];
  const dirty = draft !== initialDraft;

  // Avisa antes de salir de la página con una respuesta a medias.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  const update = (patch: Partial<RsvpDraft>) => {
    setDraft((d) => ({ ...d, ...patch }));
    // Al corregir un campo se limpian sus errores para no mostrar avisos obsoletos.
    setErrors({});
  };

  const goTo = (next: RsvpStep, dir: number) => {
    setErrors({});
    setSaveError(null);
    // El cambio de paso va dentro de una transición: el paso que sale y el que entra se
    // deslizan en el sentido de la navegación (clases step-forward/step-back en globals.css).
    startTransition(() => {
      addTransitionType(dir > 0 ? "forward" : "back");
      setStep(next);
    });
  };

  const next = () => {
    const found = validateStep(step, draft, group);
    if (Object.keys(found).length) {
      setErrors(found);
      const firstKey = Object.keys(found)[0]!;
      requestAnimationFrame(() => document.getElementById(firstKey)?.focus());
      return;
    }
    if (nextStep) goTo(nextStep, 1);
  };

  const back = () => {
    const prev = steps[index - 1];
    if (prev) goTo(prev, -1);
    else onCancel();
  };

  const submit = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const saved = await saveResponse(group.token, group, toResponse(draft, group));
      onSaved(saved);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Algo ha fallado. Inténtalo de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  const StepComponent = step === "summary" ? null : STEP_COMPONENTS[step];

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (isLast) void submit();
        else next();
      }}
      className="scroll-mt-20"
      aria-labelledby="rsvp-step-title"
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-[0.875rem] text-muted">
          Paso {index + 1} de {steps.length}
          <span className="sr-only">: {STEP_TITLES[step]}</span>
        </p>
        <ol className="flex gap-1.5" aria-hidden>
          {steps.map((s, i) => (
            <li
              key={s}
              className={`h-1 w-5 rounded-full transition-colors duration-500 ${i <= index ? "bg-ink" : "bg-ink/15"}`}
            />
          ))}
        </ol>
      </div>

      <ViewTransition
        key={step}
        enter={{ forward: "step-forward", back: "step-back", default: "none" }}
        exit={{ forward: "step-forward", back: "step-back", default: "none" }}
        default="none"
      >
        <div>
          <h3
            id="rsvp-step-title"
            ref={headingRef}
            tabIndex={-1}
            className="mt-4 mb-6 font-display text-[2rem] leading-tight text-ink outline-none"
          >
            {QUESTIONS[step]}
          </h3>
          {StepComponent ? (
            <StepComponent
              event={event}
              group={group}
              draft={draft}
              errors={errors}
              update={update}
            />
          ) : (
            <DraftSummary event={event} group={group} draft={draft} onEdit={(s) => goTo(s, -1)} />
          )}
        </div>
      </ViewTransition>

      {saveError ? (
        <div
          role="alert"
          className="mt-6 flex gap-3 rounded-md border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger"
        >
          <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0" />
          <p>{saveError}</p>
        </div>
      ) : null}

      <div className="mt-8 flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={back} disabled={saving}>
          <ArrowLeft aria-hidden className="size-4" />
          {index === 0 ? "Cancelar" : "Atrás"}
        </Button>
        <Button type="submit" size="lg" disabled={saving} aria-busy={saving} className="min-w-44">
          {saving ? (
            <>
              <Loader2 aria-hidden className="size-4 animate-spin" /> Enviando…
            </>
          ) : isLast ? (
            saveError ? (
              "Reintentar"
            ) : (
              "Enviar respuesta"
            )
          ) : nextStep === "summary" ? (
            "Revisar respuesta"
          ) : (
            `Siguiente: ${STEP_TITLES[nextStep ?? "summary"].toLowerCase()}`
          )}
        </Button>
      </div>
    </form>
  );
}
