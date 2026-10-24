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
}: {
  event: WeddingEvent;
  group: GuestGroup;
  theme: Theme;
  className?: string;
}) {
  const outer = useRef<HTMLSpanElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<{ scale: number; height: number } | null>(null);

  // Escala = ancho del hueco / ancho de la carta grande; la altura sale de la carta ya escalada.
  useLayoutEffect(() => {
    const box = outer.current;
    const letter = inner.current;
    if (!box || !letter) return;
    const measure = () => {
      const scale = box.offsetWidth / letter.offsetWidth;
      setFit({ scale, height: letter.offsetHeight * scale });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    observer.observe(letter);
    return () => observer.disconnect();
  }, []);

  return (
    <span ref={outer} className={clsx("relative block", className)} style={{ height: fit?.height }}>
      <div
        ref={inner}
        className="absolute top-0 left-0 w-[min(22rem,calc(100vw-2.5rem))] origin-top-left sm:w-[28rem]"
        style={{
          transform: `scale(${fit?.scale ?? 1})`,
          visibility: fit ? undefined : "hidden",
        }}
      >
        <LetterPaper event={event} group={group} theme={theme} animate={false} preview />
      </div>
    </span>
  );
}
