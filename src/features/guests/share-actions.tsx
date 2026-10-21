"use client";

import { Check, Copy, Download, MessageCircle, QrCode as QrIcon } from "lucide-react";
import { useRef, useState } from "react";
import { QrCode } from "@/components/qr-code";
import { Dialog } from "@/components/ui/dialog";
import { buttonClasses } from "@/components/ui/button";
import type { GuestGroup } from "@/lib/domain/types";
import { invitationUrl, inviteMessage, whatsappUrl } from "@/lib/guests/share";

const smallButton =
  "inline-flex h-9 items-center gap-1.5 rounded-md border border-ink/15 bg-paper px-3 text-[0.8125rem] text-ink transition-colors hover:border-ink/40";

/** Copiar el enlace, enviarlo por WhatsApp o enseñar su QR. */
export function ShareActions({
  group,
  couple,
  origin,
}: {
  group: GuestGroup;
  couple: { first: string; second: string };
  origin: string;
}) {
  const [copied, setCopied] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const qr = useRef<SVGSVGElement>(null);
  const url = invitationUrl(origin, group.token);
  const message = inviteMessage(couple, group, url);

  const copy = async () => {
    await navigator.clipboard.writeText(url).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    if (!qr.current) return;
    const svg = new XMLSerializer().serializeToString(qr.current);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    link.download = `invitacion-${group.displayName.toLowerCase().replace(/[^a-z0-9]+/gi, "-")}.svg`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="flex flex-wrap gap-1.5">
      <button type="button" onClick={copy} className={smallButton}>
        {copied ? (
          <Check aria-hidden className="size-3.5" />
        ) : (
          <Copy aria-hidden className="size-3.5" />
        )}
        {copied ? "Copiado" : "Copiar enlace"}
        <span className="sr-only"> de {group.displayName}</span>
      </button>
      <a
        href={whatsappUrl(message, group.phone)}
        target="_blank"
        rel="noopener noreferrer"
        className={smallButton}
      >
        <MessageCircle aria-hidden className="size-3.5" />
        WhatsApp
        <span className="sr-only"> para {group.displayName} (se abre en una pestaña nueva)</span>
      </a>
      <button type="button" onClick={() => setQrOpen(true)} className={smallButton}>
        <QrIcon aria-hidden className="size-3.5" />
        QR<span className="sr-only"> de {group.displayName}</span>
      </button>
      <span role="status" className="sr-only">
        {copied ? "Enlace copiado." : ""}
      </span>
      <Dialog
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        title={group.displayName}
        description="Escanéalo con la cámara del móvil para abrir su invitación. Puedes imprimirlo en la invitación de papel."
      >
        <QrCode
          ref={qr}
          value={url}
          label={`Código QR de la invitación de ${group.displayName}`}
          className="mx-auto size-56"
        />
        <p className="mt-3 text-center text-[0.8125rem] break-all text-muted">{url}</p>
        <div className="mt-5 flex justify-center">
          <button type="button" onClick={download} className={buttonClasses("secondary", "md")}>
            <Download aria-hidden className="size-4" />
            Descargar QR (SVG)
          </button>
        </div>
      </Dialog>
    </div>
  );
}
