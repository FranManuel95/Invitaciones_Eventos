"use client";

import { clsx } from "clsx";
import { useEffect, useRef, useState } from "react";
import type { Stage } from "@/features/invitation/experience";
import type { Draft } from "@/lib/editor/draft";
import { PREVIEW_STAGES, type FromPreview, type ToPreview } from "./messages";

const PHONE = { width: 390, height: 844 };

/**
 * Móvil con la invitación real (un iframe de /editor/<evento>/vista). Recibe el borrador
 * válido con un pequeño retardo mientras se escribe y salta a la pantalla elegida. En un hueco
 * estrecho (el propio móvil) la invitación llena el hueco a su tamaño real, sin marco de móvil.
 */
export function PreviewFrame({
  src,
  draft,
  stage,
  section,
  onStage,
  mini = false,
}: {
  src: string;
  /** Borrador válido, o null mientras haya campos con errores (la vista previa queda en pausa). */
  draft: Draft | null;
  /** Pantalla que se ve; el editor la cambia al elegir un apartado (p. ej. el sobre). */
  stage: Stage;
  /** Sección de la invitación a la que bajar (lo que se está editando). */
  section?: string;
  onStage: (stage: Stage) => void;
  /** En miniatura (el móvil mientras se edita): sin botones ni marco, a escala. */
  mini?: boolean;
}) {
  const paused = draft === null;
  const frame = useRef<HTMLIFrameElement>(null);
  const box = useRef<HTMLDivElement>(null);
  // Cuántas veces ha avisado la vista previa de que está lista. Cada aviso (también tras una
  // recarga del iframe, que el móvil puede hacer por su cuenta) vuelve a enviar borrador y pantalla.
  const [ready, setReady] = useState(0);
  const [scale, setScale] = useState(0.7);
  // En el móvil (pantallas sin columna para la vista previa), la invitación ocupa todo el hueco, sin dibujar un móvil.
  const [narrow, setNarrow] = useState(false);
  const fill = narrow && !mini;

  const post = (message: ToPreview) =>
    frame.current?.contentWindow?.postMessage(message, window.location.origin);

  // La vista previa avisa cuando está lista (también tras recargarse).
  useEffect(() => {
    const onMessage = (e: MessageEvent<FromPreview>) => {
      if (e.origin !== window.location.origin || e.source !== frame.current?.contentWindow) return;
      if (e.data?.type === "ready") setReady((n) => n + 1);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Si la vista previa cargó antes de que el editor empezase a escuchar, su aviso «ready» se
  // perdió y nunca llegaría el borrador. Por eso el editor la llama («hello») hasta que contesta.
  useEffect(() => {
    if (ready) return;
    const call = () => post({ type: "hello" });
    call();
    const id = window.setInterval(call, 400);
    return () => window.clearInterval(id);
  }, [ready]);

  // Último borrador válido: si el iframe se recarga mientras hay campos con errores, recibe este.
  const lastDraft = useRef<Draft | null>(null);
  useEffect(() => {
    if (draft) lastDraft.current = draft;
  }, [draft]);

  useEffect(() => {
    const current = draft ?? lastDraft.current;
    if (!ready || !current) return;
    const id = window.setTimeout(
      () => post({ type: "draft", content: current.content, theme: current.theme }),
      120,
    );
    return () => window.clearTimeout(id);
  }, [ready, draft]);

  // Al cambiar de pantalla (desde los botones o desde el editor), la vista previa salta a ella.
  useEffect(() => {
    if (ready) post({ type: "stage", stage, section });
  }, [ready, stage, section]);

  // El móvil se escala para caber en el hueco disponible.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const { width, height } = entry.contentRect;
      if (!width || !height) return;
      setNarrow(window.innerWidth < 1024);
      setScale(Math.max(0.2, Math.min(1, width / PHONE.width, height / PHONE.height)));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex h-full min-h-0 flex-col items-center gap-3 lg:gap-5">
      <div
        hidden={mini}
        role="group"
        aria-label="Pantalla de la vista previa"
        className="flex max-w-full shrink-0 [scrollbar-width:none] gap-0.5 overflow-x-auto rounded-full bg-paper p-1 shadow-[var(--shadow-paper)] ring-1 ring-line"
      >
        {PREVIEW_STAGES.map((s) => (
          <button
            key={s.stage}
            type="button"
            aria-pressed={stage === s.stage}
            onClick={() => onStage(s.stage)}
            className={clsx(
              "min-h-10 shrink-0 rounded-full px-3.5 text-[0.8125rem] whitespace-nowrap transition-colors lg:min-h-9",
              stage === s.stage ? "bg-ink font-medium text-paper" : "text-ink-soft hover:text-ink",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
      <p
        role="status"
        className={clsx(
          "max-w-[34ch] text-center text-[0.8125rem] font-medium text-danger",
          (!paused || mini) && "sr-only",
        )}
      >
        {paused ? "La vista previa está en pausa: revisa los campos marcados en rojo." : ""}
      </p>
      <div ref={box} className="flex min-h-0 w-full flex-1 justify-center">
        <div
          className={clsx(
            "relative shrink-0 overflow-hidden bg-ink",
            fill
              ? "size-full rounded-2xl shadow-[var(--shadow-paper)] ring-1 ring-line"
              : mini
                ? ""
                : "rounded-[2.25rem] shadow-[var(--shadow-lift)] ring-[6px] ring-ink",
          )}
          style={fill ? undefined : { width: PHONE.width * scale, height: PHONE.height * scale }}
        >
          <iframe
            ref={frame}
            src={src}
            title="Vista previa de la invitación"
            tabIndex={mini ? -1 : undefined}
            className="absolute top-0 left-0 origin-top-left border-0 bg-ivory"
            style={
              fill
                ? { width: "100%", height: "100%" }
                : { width: PHONE.width, height: PHONE.height, transform: `scale(${scale})` }
            }
          />
        </div>
      </div>
    </div>
  );
}
