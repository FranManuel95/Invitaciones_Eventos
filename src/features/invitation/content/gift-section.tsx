"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { WeddingEvent } from "@/lib/domain/types";
import { Section } from "./sections";

/** Regalo: número de cuenta con botón de copiar y aviso accesible al copiarlo. */
export function GiftSection({ event }: { event: WeddingEvent }) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(event.gift.iban.replaceAll(" ", ""));
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
    }
  };

  return (
    <Section id="regalo" title="Regalo">
      <div className="max-w-xl">
        <p className="font-display text-[1.5rem] leading-snug text-ink">{event.gift.message}</p>
        <div className="paper-grain mt-6 rounded-[3px] border border-line bg-paper p-5">
          <p className="text-[0.8125rem] text-muted">Titular</p>
          <p className="text-ink">{event.gift.holder}</p>
          <p className="mt-3 text-[0.8125rem] text-muted">Número de cuenta (IBAN)</p>
          <p translate="no" className="font-mono text-[1.0625rem] tracking-wide text-ink">
            {event.gift.iban}
          </p>
          <Button variant="secondary" className="mt-4" onClick={copy}>
            {status === "copied" ? (
              <>
                <Check aria-hidden className="size-4" /> Copiado
              </>
            ) : (
              <>
                <Copy aria-hidden className="size-4" /> Copiar número de cuenta
              </>
            )}
          </Button>
          <p aria-live="polite" className="mt-2 min-h-5 text-[0.8125rem] text-muted">
            {status === "copied"
              ? "Número de cuenta copiado."
              : status === "error"
                ? "No se ha podido copiar. Selecciona el número y cópialo a mano."
                : ""}
          </p>
        </div>
      </div>
    </Section>
  );
}
