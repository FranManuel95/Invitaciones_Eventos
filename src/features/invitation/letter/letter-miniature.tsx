"use client";

import { clsx } from "clsx";
import { useLayoutEffect, useRef, useState } from "react";
import type { GuestGroup, WeddingEvent } from "@/lib/domain/types";
import type { Theme } from "@/lib/theme";
import { LetterPaper } from "./letter-stage";

/**
 * La carta de la invitación en pequeño, para meterla en el sobre. Se maqueta con el mismo ancho
 * que la carta grande y se reduce entera (no se recoloca el texto): al salir del sobre y crecer,
 * es la misma carta y el relevo no cambia nada de sitio.
 */
export function LetterMiniature({
  event,
  group,
  theme,
  className,
  onMeasure,
  bare = false,
  fitHeight,
}: {
  event: WeddingEvent;
  group: GuestGroup;
  theme: Theme;
  className?: string;
  /** Proporción alto/ancho de la carta (para dibujar la carta 3D con la misma forma). */
  onMeasure?: (aspect: number) => void;
  /** Solo la tinta, para imprimirla sobre la tarjeta de una foto. */
  bare?: boolean;
  /**
   * Alto máximo en px («box»: el alto del hueco): si la carta no cabe a lo ancho, se reduce
   * hasta caber y se centra.
   */
  fitHeight?: number | "box";
}) {
  const outer = useRef<HTMLSpanElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<{ scale: number; height: number; left: number } | null>(null);

  // Escala = ancho del hueco / ancho de la carta grande; la altura sale de la carta ya escalada.
  useLayoutEffect(() => {
    const box = outer.current;
    const letter = inner.current;
    if (!box || !letter) return;
    const measure = () => {
      const byWidth = box.offsetWidth / letter.offsetWidth;
      const maxHeight = fitHeight === "box" ? box.offsetHeight : fitHeight;
      const scale = maxHeight ? Math.min(byWidth, maxHeight / letter.offsetHeight) : byWidth;
      // Si se reduce para caber en alto, queda centrada a lo ancho.
      const left = (box.offsetWidth - letter.offsetWidth * scale) / 2;
      setFit({ scale, height: maxHeight ?? letter.offsetHeight * scale, left });
      onMeasure?.(letter.offsetHeight / letter.offsetWidth);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    observer.observe(letter);
    return () => observer.disconnect();
  }, [onMeasure, fitHeight]);

  return (
    <span
      ref={outer}
      className={clsx("relative block", className)}
      style={fitHeight === "box" ? undefined : { height: fit?.height }}
    >
      <div
        ref={inner}
        className="absolute top-0 left-0 w-[min(22rem,calc(100vw-2.5rem))] origin-top-left sm:w-[28rem]"
        style={{
          left: fit?.left ?? 0,
          transform: `scale(${fit?.scale ?? 1})`,
          visibility: fit ? undefined : "hidden",
        }}
      >
        <LetterPaper
          event={event}
          group={group}
          theme={theme}
          animate={false}
          preview
          bare={bare}
        />
      </div>
    </span>
  );
}
