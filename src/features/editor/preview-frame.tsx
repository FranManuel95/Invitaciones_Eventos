"use client";

import { clsx } from "clsx";
import { useEffect, useRef, useState } from "react";
import type { Stage } from "@/features/invitation/experience";
import type { Draft } from "@/lib/editor/draft";
import { PREVIEW_STAGES, type FromPreview, type ToPreview } from "./messages";

const PHONE = { width: 390, height: 844 };

/**
 * Móvil con la invitación real (un iframe de /editor/<evento>/vista). Recibe el borrador
 * válido con un pequeño retardo mientras se escribe y salta a la pantalla elegida.
 */
export function PreviewFrame({ src, draft }: { src: string; draft: Draft | null }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [scale, setScale] = useState(0.7);
  const [stage, setStage] = useState<Stage>("cover");

  const post = (message: ToPreview) =>
    frame.current?.contentWindow?.postMessage(message, window.location.origin);

  // La vista previa avisa cuando está lista (también tras recargarse).
  useEffect(() => {
    const onMessage = (e: MessageEvent<FromPreview>) => {
      if (e.origin !== window.location.origin || e.source !== frame.current?.contentWindow) return;
      if (e.data?.type === "ready") setReady(true);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    if (!ready || !draft) return;
    const id = window.setTimeout(
      () => post({ type: "draft", content: draft.content, theme: draft.theme }),
      120,
    );
    return () => window.clearTimeout(id);
  }, [ready, draft]);

  // El móvil se escala para caber en el hueco disponible.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const { width, height } = entry.contentRect;
      if (!width || !height) return;
      setScale(Math.max(0.35, Math.min(1, width / PHONE.width, height / PHONE.height)));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex h-full min-h-0 flex-col items-center gap-4">
      <div
        role="group"
        aria-label="Pantalla de la vista previa"
        className="flex flex-wrap justify-center gap-1 rounded-full bg-ink/5 p-1"
      >
        {PREVIEW_STAGES.map((s) => (
          <button
            key={s.stage}
            type="button"
            aria-pressed={stage === s.stage}
            onClick={() => {
              setStage(s.stage);
              post({ type: "stage", stage: s.stage });
            }}
            className={clsx(
              "rounded-full px-3.5 py-1.5 text-[0.8125rem] transition-colors",
              stage === s.stage ? "bg-paper text-ink shadow-sm" : "text-ink-soft hover:text-ink",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div ref={box} className="flex min-h-0 w-full flex-1 justify-center">
        <div
          className="relative shrink-0 overflow-hidden rounded-[2.25rem] bg-ink shadow-[var(--shadow-lift)] ring-[6px] ring-ink"
          style={{ width: PHONE.width * scale, height: PHONE.height * scale }}
        >
          <iframe
            ref={frame}
            src={src}
            title="Vista previa de la invitación"
            className="absolute top-0 left-0 origin-top-left border-0 bg-ivory"
            style={{ width: PHONE.width, height: PHONE.height, transform: `scale(${scale})` }}
          />
        </div>
      </div>
    </div>
  );
}
