"use client";

import { Film, ImagePlus, Music, Trash2 } from "lucide-react";
import Image from "next/image";
import { useId, useRef, useState } from "react";
import { buttonClasses } from "@/components/ui/button";
import { errorFor, getIn, type Path } from "@/lib/editor/draft";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { useEditor } from "./fields";
import { approximateDepth, checkImageFile, prepareImage } from "./image";

const BUCKET = "event-media";

/**
 * Foto de un hueco de la invitación. Se reduce y se limpia en el navegador y se sube al
 * almacenamiento del evento. En la portada se sube además su mapa de profundidad.
 */
export function PhotoField({
  label,
  path,
  depthPath,
  hint,
}: {
  label: string;
  path: Path;
  /** Ruta donde guardar el mapa de profundidad (solo la portada). */
  depthPath?: Path;
  hint?: string;
}) {
  const { draft, set, eventId, errors } = useEditor();
  const src = getIn(draft.content, path) as string | null | undefined;
  const input = useRef<HTMLInputElement>(null);
  const id = useId();
  const [status, setStatus] = useState<{ busy: boolean; message: string | null }>({
    busy: false,
    message: null,
  });
  const error = errorFor(errors, path);

  async function upload(file: File) {
    const invalid = checkImageFile(file);
    if (invalid) return setStatus({ busy: false, message: invalid });
    const supabase = createBrowserSupabase();
    if (!supabase || !eventId) return;
    setStatus({ busy: true, message: "Preparando la foto…" });
    try {
      const { photo, bitmap } = await prepareImage(file);
      setStatus({ busy: true, message: "Subiendo…" });
      const name = crypto.randomUUID();
      const put = async (blob: Blob, ext: string, type: string) => {
        const key = `${eventId}/${name}${ext}`;
        const { error: e } = await supabase.storage
          .from(BUCKET)
          .upload(key, blob, { contentType: type, cacheControl: "31536000", upsert: false });
        if (e) throw new Error("No hemos podido subir la foto. Revisa tu conexión.");
        return supabase.storage.from(BUCKET).getPublicUrl(key).data.publicUrl;
      };
      const url = await put(photo, ".webp", "image/webp");
      set(path, url);
      if (depthPath) {
        setStatus({ busy: true, message: "Preparando el efecto 3D…" });
        const depth = await approximateDepth(bitmap);
        set(depthPath, await put(depth, "-profundidad.png", "image/png"));
      }
      bitmap.close();
      setStatus({ busy: false, message: "Foto subida." });
    } catch (e) {
      setStatus({
        busy: false,
        message: e instanceof Error ? e.message : "No hemos podido subir la foto.",
      });
    }
  }

  return (
    <div>
      <p id={`${id}-label`} className="mb-1.5 text-[0.875rem] font-medium text-ink">
        {label}
      </p>
      <div className="flex items-center gap-4">
        <div className="relative grid size-20 shrink-0 place-items-center overflow-hidden rounded-md border border-line bg-cream">
          {src ? (
            <Image src={src} alt="" fill sizes="80px" className="object-cover" />
          ) : (
            <ImagePlus aria-hidden className="size-6 text-stone" />
          )}
        </div>
        <div className="min-w-0">
          {eventId ? (
            <div className="flex flex-wrap gap-2">
              <label
                className={buttonClasses(
                  "secondary",
                  "sm",
                  "cursor-pointer has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ink",
                )}
              >
                <input
                  ref={input}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                  className="sr-only"
                  aria-describedby={`${id}-label`}
                  disabled={status.busy}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void upload(file);
                    e.target.value = "";
                  }}
                />
                {src ? "Cambiar foto" : "Subir foto"}
              </label>
              {src ? (
                <button
                  type="button"
                  className={buttonClasses("ghost", "sm")}
                  disabled={status.busy}
                  onClick={() => {
                    set(path, null);
                    if (depthPath) set(depthPath, null);
                  }}
                >
                  <Trash2 aria-hidden className="size-4" />
                  Quitar
                </button>
              ) : null}
            </div>
          ) : (
            <p className="text-[0.8125rem] text-muted">
              En la demo no se suben fotos. Crea vuestro evento para usar las vuestras.
            </p>
          )}
          {hint ? <p className="mt-1.5 text-[0.8125rem] text-muted">{hint}</p> : null}
          <p role="status" aria-live="polite" className="mt-1 text-[0.8125rem] text-ink-soft">
            {status.message}
          </p>
          {error ? <p className="text-[0.8125rem] font-medium text-danger">{error}</p> : null}
        </div>
      </div>
    </div>
  );
}

const MAX_MEDIA = 30 * 1024 * 1024;

const MEDIA = {
  video: {
    // «video/quicktime» es el .mov de los vídeos grabados con el iPhone.
    types: ["video/mp4", "video/quicktime", "video/webm"],
    accept: "video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm",
    wrongType: "Sube el vídeo en MP4, MOV (el del iPhone) o WebM.",
    tooBig: "El vídeo pesa demasiado (máximo 30 MB). Recórtalo a unos segundos.",
    uploading: "Subiendo el vídeo…",
    done: "Vídeo subido.",
    add: "Subir vídeo",
    change: "Cambiar vídeo",
    demo: "En la demo no se suben vídeos. Crea vuestro evento para usar el vuestro.",
  },
  audio: {
    types: ["audio/mpeg", "audio/mp4", "audio/x-m4a", "audio/aac"],
    accept: "audio/mpeg,audio/mp4,audio/x-m4a,audio/aac,.mp3,.m4a",
    wrongType: "Sube la canción en MP3 o M4A.",
    tooBig: "La canción pesa demasiado (máximo 30 MB).",
    uploading: "Subiendo la canción…",
    done: "Canción subida.",
    add: "Subir canción",
    change: "Cambiar canción",
    demo: "En la demo no se suben canciones. Crea vuestro evento para usar la vuestra.",
  },
} as const;
type MediaKind = keyof typeof MEDIA;

const EXTENSIONS: Record<string, string> = {
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/quicktime": ".mov",
  "audio/mpeg": ".mp3",
  "audio/mp4": ".m4a",
  "audio/x-m4a": ".m4a",
  "audio/aac": ".aac",
};

/** Comprueba un vídeo de portada o una canción antes de subirlos. */
export function checkMediaFile(file: File, kind: MediaKind): string | null {
  const media = MEDIA[kind];
  if (!(media.types as readonly string[]).includes(file.type)) return media.wrongType;
  if (file.size > MAX_MEDIA) return media.tooBig;
  return null;
}
export const checkVideoFile = (file: File) => checkMediaFile(file, "video");

/**
 * Vídeo de fondo de la portada o canción de la apertura. Se suben tal cual (sin procesar) al
 * almacenamiento del evento.
 */
export function MediaField({
  label,
  path,
  hint,
  kind,
}: {
  label: string;
  path: Path;
  hint?: string;
  kind: MediaKind;
}) {
  const media = MEDIA[kind];
  const { draft, set, eventId, errors } = useEditor();
  const src = getIn(draft.content, path) as string | null | undefined;
  const id = useId();
  const [status, setStatus] = useState<{ busy: boolean; message: string | null }>({
    busy: false,
    message: null,
  });
  const error = errorFor(errors, path);

  async function upload(file: File) {
    const invalid = checkMediaFile(file, kind);
    if (invalid) return setStatus({ busy: false, message: invalid });
    const supabase = createBrowserSupabase();
    if (!supabase || !eventId) return;
    setStatus({ busy: true, message: media.uploading });
    const key = `${eventId}/${crypto.randomUUID()}${EXTENSIONS[file.type] ?? ""}`;
    const { error: e } = await supabase.storage
      .from(BUCKET)
      .upload(key, file, { contentType: file.type, cacheControl: "31536000", upsert: false });
    if (e) {
      return setStatus({ busy: false, message: "No hemos podido subirlo. Revisa tu conexión." });
    }
    set(path, supabase.storage.from(BUCKET).getPublicUrl(key).data.publicUrl);
    setStatus({ busy: false, message: media.done });
  }

  return (
    <div>
      <p id={`${id}-label`} className="mb-1.5 text-[0.875rem] font-medium text-ink">
        {label}
      </p>
      <div className="flex items-center gap-4">
        <div className="relative grid size-20 shrink-0 place-items-center overflow-hidden rounded-md border border-line bg-cream">
          {src && kind === "video" ? (
            <video
              src={src}
              muted
              playsInline
              preload="metadata"
              className="size-full object-cover"
            />
          ) : kind === "video" ? (
            <Film aria-hidden className="size-6 text-stone" />
          ) : (
            <Music aria-hidden className={src ? "size-6 text-ink" : "size-6 text-stone"} />
          )}
        </div>
        <div className="min-w-0">
          {eventId ? (
            <div className="flex flex-wrap gap-2">
              <label
                className={buttonClasses(
                  "secondary",
                  "sm",
                  "cursor-pointer has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ink",
                )}
              >
                <input
                  type="file"
                  accept={media.accept}
                  className="sr-only"
                  aria-describedby={`${id}-label`}
                  disabled={status.busy}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void upload(file);
                    e.target.value = "";
                  }}
                />
                {src ? media.change : media.add}
              </label>
              {src ? (
                <button
                  type="button"
                  className={buttonClasses("ghost", "sm")}
                  disabled={status.busy}
                  onClick={() => set(path, null)}
                >
                  <Trash2 aria-hidden className="size-4" />
                  Quitar
                </button>
              ) : null}
            </div>
          ) : (
            <p className="text-[0.8125rem] text-muted">{media.demo}</p>
          )}
          {hint ? <p className="mt-1.5 text-[0.8125rem] text-muted">{hint}</p> : null}
          <p role="status" aria-live="polite" className="mt-1 text-[0.8125rem] text-ink-soft">
            {status.message}
          </p>
          {error ? <p className="text-[0.8125rem] font-medium text-danger">{error}</p> : null}
        </div>
      </div>
    </div>
  );
}
