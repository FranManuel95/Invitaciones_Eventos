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
  const [stage, setStage] = useState<{ stage: Stage; n: number }>({ stage: "cover", n: 0 });

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
        setStage((s) => ({ stage: data.stage, n: s.n + 1 }));
      }
    };
    window.addEventListener("message", onMessage);
    // Avisa de que está lista: el editor le manda el borrador actual.
    window.parent.postMessage({ type: "ready" } satisfies FromPreview, window.location.origin);
    return () => window.removeEventListener("message", onMessage);
  }, []);

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
