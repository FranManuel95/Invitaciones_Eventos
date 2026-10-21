"use client";

import { ImagePlus, Trash2 } from "lucide-react";
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
