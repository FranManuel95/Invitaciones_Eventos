"use client";

import { useEffect, useState } from "react";
import { PREVIEW_GROUP, type FromPreview, type ToPreview } from "@/features/editor/messages";
import { InvitationExperience, type Stage } from "@/features/invitation/experience";
import { eventContentSchema, type EventContent } from "@/lib/domain/event-schema";
import type { Theme } from "@/lib/theme";
import { themeInputSchema } from "@/lib/theme/schema";

/**
 * Recibe el borrador del editor por postMessage y vuelve a pintar la invitación al momento.
 * Al cambiar de pantalla se remonta la experiencia para empezar en la pantalla pedida.
 */
export function PreviewClient({
  initialContent,
  initialTheme,
}: {
  initialContent: EventContent;
  initialTheme: Theme;
}) {
  const [content, setContent] = useState(initialContent);
  const [theme, setTheme] = useState(initialTheme);
  const [stage, setStage] = useState<{ stage: Stage; section?: string; n: number }>({
    stage: "cover",
    n: 0,
  });

  useEffect(() => {
    const onMessage = (e: MessageEvent<ToPreview>) => {
      if (e.origin !== window.location.origin || e.source !== window.parent) return;
      const data = e.data;
      if (data?.type === "draft") {
        const nextContent = eventContentSchema.safeParse(data.content);
        const nextTheme = themeInputSchema.safeParse(data.theme);
        if (nextContent.success) setContent(nextContent.data);
        if (nextTheme.success) setTheme(nextTheme.data);
      } else if (data?.type === "stage") {
        setStage((s) => ({ stage: data.stage, section: data.section, n: s.n + 1 }));
      } else if (data?.type === "hello") {
        // El editor puede haber empezado a escuchar después de nuestro primer aviso.
        window.parent.postMessage({ type: "ready" } satisfies FromPreview, window.location.origin);
      }
    };
    window.addEventListener("message", onMessage);
    // Avisa de que está lista: el editor le manda el borrador actual.
    window.parent.postMessage({ type: "ready" } satisfies FromPreview, window.location.origin);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Si el editor pide una sección (lo que se está editando), se baja hasta ella en cuanto existe.
  useEffect(() => {
    const id = stage.section;
    if (!id) return;
    let tries = 0;
    const timer = window.setInterval(() => {
      const el = document.getElementById(id);
      if (el || ++tries > 40) window.clearInterval(timer);
      el?.scrollIntoView({ block: "start", behavior: "instant" });
    }, 100);
    return () => window.clearInterval(timer);
  }, [stage]);

  return (
    <InvitationExperience
      key={stage.n}
      event={{ ...content, id: "vista-previa" }}
      group={PREVIEW_GROUP}
      theme={theme}
      initialStage={stage.stage}
      preview
    />
  );
}
