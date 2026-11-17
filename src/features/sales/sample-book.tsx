"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useId, useRef, useState, type KeyboardEvent } from "react";

export interface SampleFamily {
  id: string;
  label: string;
  note: string;
  templates: { id: string; label: string; description: string }[];
}

const DEMO = "/i/familia-garcia";

/**
 * El muestrario de plantillas: una pestaña por familia y, dentro, un carril horizontal que se
 * desliza con el dedo o con las flechas. Cada tarjeta abre esa plantilla a pantalla completa.
 */
export function SampleBook({ families }: { families: readonly SampleFamily[] }) {
  const [active, setActive] = useState(0);
  const base = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const rail = useRef<HTMLUListElement>(null);
  const family = families[active]!;

  const select = (i: number) => {
    setActive(i);
    rail.current?.scrollTo({ left: 0 });
  };
  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (active + step + families.length) % families.length;
    select(next);
    tabs.current[next]?.focus();
  };
  const scroll = (dir: number) => {
    const el = rail.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div role="tablist" aria-label="Familias de plantillas" className="flex flex-wrap gap-2">
          {families.map((f, i) => (
            <button
              key={f.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${base}-tab-${f.id}`}
              aria-selected={i === active}
              aria-controls={`${base}-panel`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => select(i)}
              onKeyDown={onKey}
              className={
                i === active
                  ? "rounded-full bg-[var(--papel)] px-5 py-2.5 text-[0.9375rem] text-[var(--tinta)]"
                  : "rounded-full border border-[var(--tinta-3)] px-5 py-2.5 text-[0.9375rem] text-[var(--niebla)] transition-colors hover:border-[var(--oro)] hover:text-[var(--papel)]"
              }
            >
              {f.label}
              <span className="ml-2 tabular-nums opacity-70">{f.templates.length}</span>
            </button>
          ))}
        </div>
        <div className="hidden gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Plantillas anteriores"
            className="grid size-11 place-items-center rounded-full border border-[var(--tinta-3)] text-[var(--papel)] transition-colors hover:border-[var(--oro)]"
          >
            <ChevronLeft aria-hidden className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Plantillas siguientes"
            className="grid size-11 place-items-center rounded-full border border-[var(--tinta-3)] text-[var(--papel)] transition-colors hover:border-[var(--oro)]"
          >
            <ChevronRight aria-hidden className="size-5" />
          </button>
        </div>
      </div>
      <p className="mt-5 max-w-[56ch] text-[1rem] leading-relaxed text-[var(--niebla)]">
        {family.note}
      </p>

      <div
        role="tabpanel"
        id={`${base}-panel`}
        aria-labelledby={`${base}-tab-${family.id}`}
        className="mt-10"
      >
        <ul
          ref={rail}
          aria-label={`Plantillas: ${family.label}`}
          className="v-rail -mx-6 flex snap-x snap-mandatory scroll-px-6 gap-6 overflow-x-auto px-6 pb-4 sm:-mx-10 sm:scroll-px-10 sm:px-10 lg:mx-0 lg:scroll-px-0 lg:px-0"
        >
          {family.templates.map((t) => (
            <li
              key={t.id}
              className="relative w-[15rem] shrink-0 snap-start sm:w-[16.5rem] lg:w-[calc((100%-4.5rem)/4)]"
            >
              <div className="relative aspect-[390/844] overflow-hidden rounded-[1.1rem] ring-1 ring-[var(--tinta-3)] transition-[box-shadow] duration-300 hover:ring-[var(--oro)]">
                <Image
                  src={`/venta/plantilla-${t.id}-portada.webp`}
                  alt=""
                  fill
                  sizes="264px"
                  className="object-cover"
                />
              </div>
              <h3 className="v-display mt-5 text-[1.875rem] leading-none text-[var(--papel)]">
                <Link
                  href={`${DEMO}?plantilla=${t.id}`}
                  className="after:absolute after:inset-0 after:rounded-[1.1rem] after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-[var(--oro)]"
                >
                  {t.label}
                </Link>
              </h3>
              <p className="mt-2 text-[0.875rem] leading-snug text-[var(--niebla)]">
                {t.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
