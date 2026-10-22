"use client";

import { Camera, Check, ImagePlus } from "lucide-react";
import Image from "next/image";
import { useId, useState } from "react";
import { DemoBadge } from "@/components/demo-badge";
import { buttonClasses } from "@/components/ui/button";
import { checkImageFile, prepareImage } from "@/features/editor/image";
import { Monogram } from "@/features/invitation/ornaments";
import type { Album } from "@/lib/data/album";
import { formatLongDate } from "@/lib/format";
import { createBrowserSupabase } from "@/lib/supabase/browser";

const BUCKET = "guest-photos";
const MAX_FILES = 10;

type Upload = {
  id: string;
  name: string;
  preview: string;
  state: "pending" | "done" | "error";
  message?: string;
};

/**
 * Álbum de los invitados: suben sus fotos (se reducen y se limpian de datos de ubicación en el
 * navegador) y ven las que la pareja ya ha aprobado. Las suyas aparecen como «pendientes» hasta
 * que la pareja las revise.
 */
export function AlbumView({ album }: { album: Album }) {
  const inputId = useId();
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [busy, setBusy] = useState(false);
  const done = uploads.filter((u) => u.state === "done").length;

  const update = (id: string, patch: Partial<Upload>) =>
    setUploads((list) => list.map((u) => (u.id === id ? { ...u, ...patch } : u)));

  async function send(files: File[]) {
    setBusy(true);
    const batch = files.slice(0, MAX_FILES).map((file) => ({
      file,
      upload: {
        id: crypto.randomUUID(),
        name: file.name,
        preview: URL.createObjectURL(file),
        state: "pending" as const,
      },
    }));
    setUploads((list) => [...batch.map((b) => b.upload), ...list]);
    const supabase = album.demo ? null : createBrowserSupabase();
    for (const { file, upload } of batch) {
      const invalid = checkImageFile(file);
      if (invalid) {
        update(upload.id, { state: "error", message: invalid });
        continue;
      }
      try {
        const { photo, bitmap } = await prepareImage(file);
        bitmap.close();
        if (album.demo || !supabase) {
          // Demo: no hay red; se simula la subida.
          await new Promise((r) => setTimeout(r, 300));
          update(upload.id, { state: "done" });
          continue;
        }
        const slot = await supabase.rpc("album_upload_slot", { p_token: album.token });
        if (slot.error || typeof slot.data !== "string") throw new Error(slot.error?.message);
        const put = await supabase.storage
          .from(BUCKET)
          .upload(slot.data, photo, { contentType: "image/webp", upsert: false });
        if (put.error) throw new Error(put.error.message);
        const confirm = await supabase.rpc("album_confirm", {
          p_token: album.token,
          p_path: slot.data,
        });
        if (confirm.error) throw new Error(confirm.error.message);
        update(upload.id, { state: "done" });
      } catch (e) {
        const text = e instanceof Error && /muchas fotos/.test(e.message) ? e.message : null;
        update(upload.id, {
          state: "error",
          message: text ?? "No hemos podido subirla. Revisa la conexión y prueba otra vez.",
        });
      }
    }
    setBusy(false);
  }

  return (
    <main className="mx-auto max-w-5xl px-6 pt-[max(1.5rem,env(safe-area-inset-top))] pb-20 sm:px-10">
      <div className="flex items-center justify-between">
        <Monogram
          first={album.couple.first}
          second={album.couple.second}
          className="size-11 text-gold"
        />
        {album.demo ? <DemoBadge /> : null}
      </div>
      <p className="caption mt-12 text-ink-soft">{formatLongDate(album.date)}</p>
      <h1 className="mt-2 font-names text-[clamp(2.75rem,12vw,5rem)] leading-[0.95] text-ink">
        El álbum de {album.couple.first} &amp; {album.couple.second}
      </h1>
      <p className="mt-4 max-w-[52ch] text-[1.0625rem] leading-relaxed text-ink-soft">
        Comparte las fotos que hagas hoy. Las verán los novios y, cuando las revisen, aparecerán
        aquí para todos.
      </p>

      <section
        aria-labelledby="subir"
        className="mt-8 rounded-[3px] border border-line bg-paper p-5 sm:p-6"
      >
        <h2 id="subir" className="font-display text-[1.5rem] text-ink">
          Sube tus fotos
        </h2>
        <p className="mt-1 text-[0.9375rem] text-muted">
          Hasta {MAX_FILES} a la vez. Antes de enviarlas se reducen y se les quita la ubicación.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <label
            htmlFor={inputId}
            className={buttonClasses(
              "primary",
              "lg",
              "cursor-pointer has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ink",
            )}
          >
            <ImagePlus aria-hidden className="size-5" />
            Elegir fotos
            <input
              id={inputId}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
              multiple
              disabled={busy}
              className="sr-only"
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []);
                e.target.value = "";
                if (files.length) void send(files);
              }}
            />
          </label>
          <label className={buttonClasses("secondary", "lg", "cursor-pointer")}>
            <Camera aria-hidden className="size-5" />
            Hacer una foto
            <input
              type="file"
              accept="image/*"
              capture="environment"
              disabled={busy}
              className="sr-only"
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []);
                e.target.value = "";
                if (files.length) void send(files);
              }}
            />
          </label>
        </div>
        <p role="status" aria-live="polite" className="mt-3 text-[0.9375rem] text-ink-soft">
          {busy
            ? "Subiendo…"
            : done
              ? `${done === 1 ? "1 foto enviada" : `${done} fotos enviadas`}. ¡Gracias! Aparecerán cuando los novios las revisen.`
              : null}
        </p>
        {uploads.length ? (
          <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
            {uploads.map((u) => (
              <li
                key={u.id}
                className="relative aspect-square overflow-hidden rounded-[2px] bg-cream"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- vista previa local (blob:) */}
                <img src={u.preview} alt="" className="size-full object-cover" />
                <span
                  className={`absolute inset-x-0 bottom-0 flex items-center gap-1 px-1.5 py-1 text-[0.6875rem] ${u.state === "error" ? "bg-danger text-paper" : "bg-ink/70 text-paper"}`}
                >
                  {u.state === "done" ? <Check aria-hidden className="size-3" /> : null}
                  {u.state === "pending"
                    ? "Subiendo…"
                    : u.state === "done"
                      ? "Pendiente de revisar"
                      : "No se subió"}
                </span>
                {u.message ? <span className="sr-only">{u.message}</span> : null}
              </li>
            ))}
          </ul>
        ) : null}
        {uploads.some((u) => u.message) ? (
          <p className="mt-2 text-[0.875rem] text-danger">
            {uploads.find((u) => u.message)?.message}
          </p>
        ) : null}
      </section>

      <section aria-labelledby="fotos" className="mt-12">
        <h2 id="fotos" className="font-display text-[1.75rem] text-ink">
          Fotos de la boda
        </h2>
        {album.photos.length ? (
          <ul className="mt-5 columns-2 gap-3 sm:columns-3">
            {album.photos.map((p, i) => (
              <li
                key={p.id}
                className="mb-3 break-inside-avoid overflow-hidden rounded-[2px] bg-cream"
              >
                <Image
                  src={p.url}
                  alt={`Foto ${i + 1} del álbum`}
                  width={800}
                  height={600}
                  sizes="(min-width: 640px) 33vw, 50vw"
                  className="h-auto w-full"
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-[0.9375rem] text-muted">
            Todavía no hay fotos. ¡Sé el primero en subir una!
          </p>
        )}
      </section>
    </main>
  );
}
