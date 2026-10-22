"use client";

import { Download } from "lucide-react";
import { useState } from "react";
import { buttonClasses } from "@/components/ui/button";
import { zipNames, zipPrefix } from "@/lib/album-zip";

/**
 * Descarga todas las fotos aprobadas en un zip. Se monta en el navegador (sin pasar por el
 * servidor): descarga cada foto, las empaqueta sin recomprimir y guarda el archivo.
 */
export function DownloadAll({ urls, couple }: { urls: string[]; couple: string }) {
  const [status, setStatus] = useState<string>("");
  const [busy, setBusy] = useState(false);

  const download = async () => {
    setBusy(true);
    try {
      const { zipSync } = await import("fflate");
      const prefix = zipPrefix(couple);
      const names = zipNames(urls, prefix);
      const files: Record<string, Uint8Array> = {};
      for (const [i, url] of urls.entries()) {
        setStatus(`Preparando la foto ${i + 1} de ${urls.length}…`);
        const res = await fetch(url);
        if (!res.ok) throw new Error(String(res.status));
        files[names[i]!] = new Uint8Array(await res.arrayBuffer());
      }
      // Las fotos ya van comprimidas: guardarlas tal cual es más rápido y pesa lo mismo.
      const zip = zipSync(files, { level: 0 });
      const href = URL.createObjectURL(new Blob([zip as BlobPart], { type: "application/zip" }));
      const a = document.createElement("a");
      a.href = href;
      a.download = `${prefix}.zip`;
      a.click();
      URL.revokeObjectURL(href);
      setStatus(`Listo: ${urls.length} ${urls.length === 1 ? "foto" : "fotos"} descargadas.`);
    } catch {
      setStatus("No hemos podido descargar todas las fotos. Revisa la conexión y prueba otra vez.");
    } finally {
      setBusy(false);
    }
  };

  if (!urls.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={download}
        disabled={busy}
        className={buttonClasses("secondary", "sm")}
      >
        <Download aria-hidden className="size-4" />
        {busy
          ? "Descargando…"
          : `Descargar ${urls.length} ${urls.length === 1 ? "foto" : "fotos"} en un zip`}
      </button>
      <p role="status" aria-live="polite" className="text-[0.8125rem] text-muted">
        {status}
      </p>
    </div>
  );
}
