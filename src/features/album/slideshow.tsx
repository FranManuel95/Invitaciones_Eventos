"use client";

import { ChevronLeft, ChevronRight, Pause, Play, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { SLIDE_MS, kenBurns, stepIndex } from "@/lib/slideshow";

/**
 * Pase de fotos a pantalla completa: cada foto entra fundiéndose sobre la anterior y se mueve
 * despacio (Ken Burns). Pensado también para proyectarlo en la fiesta. Avanza solo, se puede
 * pausar y se maneja con las flechas del teclado; con movimiento reducido, las fotos no se mueven.
 */
export function Slideshow({
  photos,
  onClose,
}: {
  photos: { id: string; url: string }[];
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const total = photos.length;
  // Las dos últimas diapositivas: la que se va (debajo) y la que entra. Cada paso lleva una
  // clave nueva para que la que entra empiece su fundido desde cero.
  const [slides, setSlides] = useState([{ index: 0, key: 0 }]);
  const [playing, setPlaying] = useState(true);
  const current = slides[slides.length - 1] ?? { index: 0, key: 0 };

  const go = (delta: number) =>
    setSlides((list) => {
      const last = list[list.length - 1] ?? { index: 0, key: 0 };
      return [last, { index: stepIndex(last.index, delta, total), key: last.key + 1 }];
    });

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  useEffect(() => {
    if (!playing || total < 2) return;
    const timer = setTimeout(() => go(1), SLIDE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- cada diapositiva nueva reinicia la cuenta
  }, [current.key, playing, total]);

  const next = photos[stepIndex(current.index, 1, total)];

  return (
    <dialog
      ref={ref}
      aria-label="Pase de fotos"
      onClose={onClose}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        else if (e.key === "ArrowLeft") go(-1);
        else if (e.key === " " && e.target === e.currentTarget) {
          e.preventDefault();
          setPlaying((p) => !p);
        }
      }}
      className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none overflow-hidden bg-black p-0 text-white backdrop:bg-black"
    >
      {slides.map(({ index, key }) => {
        const photo = photos[index];
        if (!photo) return null;
        const motion = kenBurns(index);
        return (
          <div
            key={key}
            className="slide-fade absolute inset-0"
            style={
              {
                "--kb-origin": motion.origin,
                "--kb-from": motion.from,
                "--kb-to": motion.to,
              } as CSSProperties
            }
          >
            {/* El fondo: la misma foto, ampliada y desenfocada, para no dejar bandas negras. */}
            <Image
              src={photo.url}
              alt=""
              fill
              sizes="100vw"
              className="scale-110 object-cover opacity-40 blur-2xl"
            />
            <div className="slide-kb absolute inset-0">
              <Image
                src={photo.url}
                alt={`Foto ${index + 1} de ${total}`}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
          </div>
        );
      })}
      {/* La siguiente se descarga ya, invisible, para que entre sin esperas. */}
      {next && total > 1 ? (
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-0">
          <Image src={next.url} alt="" fill sizes="100vw" loading="eager" />
        </div>
      ) : null}

      <div className="absolute inset-x-0 top-0 flex justify-end bg-gradient-to-b from-black/50 to-transparent p-4 pt-[max(1rem,env(safe-area-inset-top))]">
        <button
          type="button"
          onClick={() => ref.current?.close()}
          aria-label="Cerrar el pase"
          className="grid size-11 place-items-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60"
        >
          <X aria-hidden className="size-5" />
        </button>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-3 bg-gradient-to-t from-black/60 to-transparent p-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Foto anterior"
          className="grid size-11 place-items-center rounded-full bg-black/40 transition-colors hover:bg-black/60"
        >
          <ChevronLeft aria-hidden className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pausar el pase" : "Seguir con el pase"}
          className="grid size-11 place-items-center rounded-full bg-black/40 transition-colors hover:bg-black/60"
        >
          {playing ? (
            <Pause aria-hidden className="size-5" />
          ) : (
            <Play aria-hidden className="size-5" />
          )}
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Foto siguiente"
          className="grid size-11 place-items-center rounded-full bg-black/40 transition-colors hover:bg-black/60"
        >
          <ChevronRight aria-hidden className="size-5" />
        </button>
        {/* Solo se anuncia en pausa: mientras avanza solo, no interrumpe cada seis segundos. */}
        <p
          aria-live={playing ? "off" : "polite"}
          className="absolute right-5 bottom-[max(1.25rem,env(safe-area-inset-bottom))] text-[0.875rem] text-white/85 tabular-nums"
        >
          {current.index + 1} / {total}
        </p>
      </div>
    </dialog>
  );
}
