"use client";

import { clsx } from "clsx";
import { Check, EyeOff, Printer, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";
import { deletePhoto, setPhotoStatus } from "@/app/panel/[evento]/album/actions";
import { QrCode } from "@/components/qr-code";
import { buttonClasses } from "@/components/ui/button";
import type { AlbumPhoto } from "@/lib/data/album";
import { DownloadAll } from "./download-all";

type Filter = "pending" | "approved" | "hidden";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "pending", label: "Por revisar" },
  { id: "approved", label: "Aprobadas" },
  { id: "hidden", label: "Ocultas" },
];

/**
 * Moderación del álbum: QR para imprimir y fotos por estado. En la demo (sin evento real) los
 * cambios se quedan en el navegador.
 */
export function AlbumModeration({
  eventId,
  token,
  photos: initial,
  couple,
}: {
  eventId: string | null;
  token: string;
  photos: AlbumPhoto[];
  couple: string;
}) {
  const [photos, setPhotos] = useState(initial);
  const [filter, setFilter] = useState<Filter>("pending");
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  const url = `${origin}/album/${token}`;
  const shown = photos.filter((p) => (p.status ?? "approved") === filter);
  const count = (f: Filter) => photos.filter((p) => (p.status ?? "approved") === f).length;

  const change = (photo: AlbumPhoto, next: Filter | "deleted") =>
    start(async () => {
      setError(null);
      if (eventId) {
        const result =
          next === "deleted"
            ? await deletePhoto(eventId, photo.id)
            : await setPhotoStatus(eventId, photo.id, next as "approved" | "hidden");
        if (!result.ok) return setError(result.error);
      }
      setPhotos((list) =>
        next === "deleted"
          ? list.filter((p) => p.id !== photo.id)
          : list.map((p) => (p.id === photo.id ? { ...p, status: next } : p)),
      );
    });

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_17rem]">
      <section aria-labelledby="fotos-album">
        <h2 id="fotos-album" className="sr-only">
          Fotos
        </h2>
        <div role="group" aria-label="Filtrar fotos" className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={clsx(
                "rounded-full border px-3.5 py-1.5 text-[0.875rem]",
                filter === f.id
                  ? "border-ink bg-ink text-paper"
                  : "border-line bg-paper text-ink-soft",
              )}
            >
              {f.label} ({count(f.id)})
            </button>
          ))}
        </div>
        <div className="mt-3">
          <DownloadAll
            urls={photos.filter((p) => (p.status ?? "approved") === "approved").map((p) => p.url)}
            couple={couple}
          />
        </div>
        <p role="status" aria-live="polite" className="mt-2 text-[0.875rem] text-danger">
          {error}
        </p>
        {shown.length ? (
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {shown.map((p, i) => (
              <li key={p.id} className="overflow-hidden rounded-[3px] border border-line bg-paper">
                <div className="relative aspect-square bg-cream">
                  <Image
                    src={p.url}
                    alt={`Foto ${i + 1} de los invitados`}
                    fill
                    sizes="(min-width: 1024px) 15vw, 45vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-wrap gap-1 p-2">
                  {filter !== "approved" ? (
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => change(p, "approved")}
                      className={buttonClasses("secondary", "sm")}
                    >
                      <Check aria-hidden className="size-4" />
                      Aprobar<span className="sr-only"> la foto {i + 1}</span>
                    </button>
                  ) : null}
                  {filter !== "hidden" ? (
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => change(p, "hidden")}
                      className={buttonClasses("ghost", "sm")}
                    >
                      <EyeOff aria-hidden className="size-4" />
                      Ocultar<span className="sr-only"> la foto {i + 1}</span>
                    </button>
                  ) : null}
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => {
                      if (window.confirm("¿Borrar esta foto para siempre?")) change(p, "deleted");
                    }}
                    className={buttonClasses("ghost", "sm")}
                  >
                    <Trash2 aria-hidden className="size-4" />
                    <span className="sr-only">Borrar la foto {i + 1}</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 text-[0.9375rem] text-muted">
            {filter === "pending" ? "No hay fotos por revisar." : "No hay fotos en este apartado."}
          </p>
        )}
      </section>

      <aside
        aria-labelledby="qr-album"
        className="h-fit rounded-[3px] border border-line bg-paper p-5 print:border-0"
      >
        <h2 id="qr-album" className="font-display text-[1.375rem] text-ink">
          QR para las mesas
        </h2>
        <p className="mt-1 text-[0.875rem] text-muted">
          Los invitados lo escanean y suben sus fotos al momento.
        </p>
        <div className="mt-4 rounded-[3px] border border-line p-4 text-center">
          <p className="font-names text-[1.5rem] text-ink">{couple}</p>
          <QrCode value={url} label="Código QR del álbum" className="mx-auto mt-3 size-40" />
          <p className="mt-3 text-[0.8125rem] text-ink-soft">Comparte tus fotos de hoy</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className={buttonClasses("secondary", "sm")}
          >
            <Printer aria-hidden className="size-4" />
            Imprimir
          </button>
          <a
            href={`/album/${token}`}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses("ghost", "sm")}
          >
            Abrir el álbum<span className="sr-only"> (pestaña nueva)</span>
          </a>
        </div>
      </aside>
    </div>
  );
}
