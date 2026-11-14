"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

/**
 * Botones «anterior / siguiente» para un pase horizontal del móvil (las figuras del dress code,
 * las notas del libro de firmas). El pase sigue deslizándose con el dedo; esto lo hace evidente y
 * da una alternativa a quien no desliza. En pantallas anchas el pase es una rejilla y no se pinta.
 */
export function RailControls({
  railId,
  count,
  itemName,
}: {
  /** id de la lista (`<ul>`) que se desliza. */
  railId: string;
  count: number;
  /** Cómo se llama cada elemento en el lector de pantalla: «idea», «mensaje»… */
  itemName: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const rail = document.getElementById(railId);
    if (!rail) return;
    const update = () => {
      const centre = rail.scrollLeft + rail.clientWidth / 2;
      let best = 0;
      let distance = Infinity;
      Array.from(rail.children).forEach((child, i) => {
        const item = child as HTMLElement;
        const d = Math.abs(item.offsetLeft + item.offsetWidth / 2 - centre);
        if (d < distance) {
          distance = d;
          best = i;
        }
      });
      setIndex(best);
    };
    update();
    rail.addEventListener("scroll", update, { passive: true });
    return () => rail.removeEventListener("scroll", update);
  }, [railId, count]);

  const go = useCallback(
    (to: number) => {
      const rail = document.getElementById(railId);
      const item = rail?.children[to] as HTMLElement | undefined;
      if (!rail || !item) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      rail.scrollTo({
        left: item.offsetLeft - (rail.clientWidth - item.offsetWidth) / 2,
        behavior: reduce ? "auto" : "smooth",
      });
    },
    [railId],
  );

  if (count < 2) return null;
  const button =
    "grid size-11 place-items-center rounded-full border border-line bg-paper text-ink transition-colors hover:bg-cream disabled:opacity-35";
  return (
    <div className="mt-3 flex items-center justify-between sm:hidden">
      <button
        type="button"
        className={button}
        onClick={() => go(index - 1)}
        disabled={index === 0}
        aria-label={`${itemName} anterior`}
      >
        <ChevronLeft aria-hidden className="size-5" />
      </button>
      <p aria-live="polite" className="text-[0.875rem] text-ink-soft tabular-nums">
        {index + 1} de {count}
      </p>
      <button
        type="button"
        className={button}
        onClick={() => go(index + 1)}
        disabled={index === count - 1}
        aria-label={`${itemName} siguiente`}
      >
        <ChevronRight aria-hidden className="size-5" />
      </button>
    </div>
  );
}
