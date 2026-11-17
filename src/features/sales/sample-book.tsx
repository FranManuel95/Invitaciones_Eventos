"use client";

import { clsx } from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { OpeningReel } from "./opening-reel";

/**
 * Una pieza del muestrario. Por defecto es una plantilla: su portada en
 * `/venta/plantilla-<id>-portada.webp` y su enlace a la invitación de ejemplo con esa plantilla.
 */
export interface SampleItem {
  id: string;
  label: string;
  description: string;
  /** A dónde lleva la tarjeta; por defecto, la invitación de ejemplo con esta plantilla. */
  href?: string;
  /** La imagen del móvil; por defecto, la portada de la plantilla. */
  src?: string;
  /** Una segunda imagen que asoma delante (lo que se abre después de la portada). */
  inset?: string;
  /** Una línea más, en pequeño, bajo la descripción. */
  detail?: string;
  /** Distintivo junto al nombre (p. ej. «Premium»). */
  badge?: string;
  /** Si lleva la grabación de una apertura en vez de una imagen fija: su identificador. */
  reel?: string;
}

export interface SampleFamily {
  id: string;
  label: string;
  note: string;
  templates: SampleItem[];
}

const DEMO = "/i/familia-garcia";

/** Colores según el fondo de la sección: la tinta de la venta o el papel. */
const TONES = {
  tinta: {
    tabOn: "bg-[var(--papel)] text-[var(--tinta)]",
    countOn: "text-[var(--grafito)]",
    tabOff:
      "border border-[var(--tinta-3)] text-[var(--niebla)] hover:border-[var(--oro)] hover:text-[var(--papel)]",
    arrow: "border-[var(--tinta-3)] text-[var(--papel)] hover:border-[var(--oro)]",
    soft: "text-[var(--niebla)]",
    title: "text-[var(--papel)]",
    ring: "ring-[var(--tinta-3)] hover:ring-[var(--oro)]",
    badge: "border-[var(--oro)] text-[var(--oro-claro)]",
  },
  papel: {
    tabOn: "bg-[var(--tinta)] text-[var(--papel)]",
    countOn: "text-[var(--niebla)]",
    tabOff:
      "border border-[var(--linea)] text-[var(--grafito)] hover:border-[var(--oro-tinta)] hover:text-[var(--tinta)]",
    arrow: "border-[var(--linea)] text-[var(--tinta)] hover:border-[var(--oro-tinta)]",
    soft: "text-[var(--grafito)]",
    title: "text-[var(--tinta)]",
    ring: "ring-[var(--papel-2)] hover:ring-[var(--oro-tinta)] shadow-[0_24px_48px_-32px_rgb(27_32_51/0.55)]",
    badge: "border-[var(--lacre)]/40 text-[var(--lacre)]",
  },
} as const;

/** Ancho de cada tarjeta en pantallas anchas: cuántas caben a la vez dentro de los márgenes. */
const PER_VIEW = {
  4: "lg:w-[calc((100%-4.5rem)/4)]",
  5: "lg:w-[calc((100%-6rem)/5)]",
} as const;

/**
 * El muestrario: una pestaña por familia y, dentro, un carril horizontal que se desliza con el
 * dedo o con las flechas, siempre dentro de los márgenes de la página. Cada tarjeta abre esa
 * variante de la invitación a pantalla completa. Con una sola familia no hay pestañas.
 */
export function SampleBook({
  families,
  tone = "tinta",
  noun = "Plantillas",
  perView = 4,
}: {
  families: readonly SampleFamily[];
  tone?: keyof typeof TONES;
  /** Qué se enseña, en plural y con mayúscula: nombra las pestañas, el carril y las flechas. */
  noun?: string;
  perView?: keyof typeof PER_VIEW;
}) {
  const [active, setActive] = useState(0);
  const base = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const rail = useRef<HTMLUListElement>(null);
  const family = families[active]!;
  const t = TONES[tone];
  const tabbed = families.length > 1;
  const lower = noun.toLowerCase();

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

  const arrow = clsx(
    "grid size-11 place-items-center rounded-full border transition-colors",
    t.arrow,
  );

  return (
    <div>
      <div
        className={clsx(
          "flex flex-wrap items-end gap-6",
          tabbed ? "justify-between" : "justify-end",
        )}
      >
        {tabbed ? (
          <div role="tablist" aria-label={`Familias de ${lower}`} className="flex flex-wrap gap-2">
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
                className={clsx(
                  "min-h-11 rounded-full px-5 py-2.5 text-[0.9375rem] transition-colors",
                  i === active ? t.tabOn : t.tabOff,
                )}
              >
                {f.label}
                <span className={clsx("ml-2 tabular-nums", i === active && t.countOn)}>
                  {f.templates.length}
                </span>
              </button>
            ))}
          </div>
        ) : null}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label={`${noun} anteriores`}
            className={arrow}
          >
            <ChevronLeft aria-hidden className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label={`${noun} siguientes`}
            className={arrow}
          >
            <ChevronRight aria-hidden className="size-5" />
          </button>
        </div>
      </div>
      {family.note ? (
        <p className={clsx("mt-5 max-w-[56ch] text-[1rem] leading-relaxed", t.soft)}>
          {family.note}
        </p>
      ) : null}

      <div
        {...(tabbed
          ? {
              role: "tabpanel",
              id: `${base}-panel`,
              "aria-labelledby": `${base}-tab-${family.id}`,
            }
          : {})}
        className="mt-10"
      >
        <ul
          ref={rail}
          aria-label={tabbed ? `${noun}: ${family.label}` : noun}
          className="v-rail flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4"
        >
          {family.templates.map((item) => (
            <li
              key={item.id}
              className={clsx(
                "relative w-[15rem] shrink-0 snap-start sm:w-[16.5rem]",
                PER_VIEW[perView],
              )}
            >
              <div className={clsx("relative", item.inset && "pr-4 pb-6")}>
                <div
                  className={clsx(
                    "relative aspect-[390/844] overflow-hidden rounded-[1.1rem] ring-1 transition-[box-shadow] duration-300",
                    t.ring,
                  )}
                >
                  {item.reel ? (
                    <OpeningReel id={item.reel} label={item.label} />
                  ) : (
                    <Image
                      src={item.src ?? `/venta/plantilla-${item.id}-portada.webp`}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 264px, 240px"
                      className="object-cover"
                    />
                  )}
                </div>
                {item.inset ? (
                  <span className="absolute right-0 bottom-0 block aspect-[4/5] w-[42%] overflow-hidden rounded-[3px] border-[3px] border-[var(--papel)] shadow-[0_18px_30px_-14px_rgb(0_0_0/0.55)]">
                    <Image
                      src={item.inset}
                      alt=""
                      fill
                      sizes="110px"
                      className="object-cover object-[50%_42%]"
                    />
                  </span>
                ) : null}
              </div>
              <h3 className={clsx("v-display mt-5 text-[1.875rem] leading-none", t.title)}>
                <Link
                  href={item.href ?? `${DEMO}?plantilla=${item.id}`}
                  className="after:absolute after:inset-0 after:rounded-[1.1rem] after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-[var(--oro)]"
                >
                  {item.label}
                  {item.badge ? (
                    <span
                      className={clsx(
                        "ml-2.5 inline-block rounded-full border px-2 py-1 align-middle font-sans text-[0.75rem] leading-none",
                        t.badge,
                      )}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              </h3>
              <p className={clsx("mt-2 text-[0.875rem] leading-snug", t.soft)}>
                {item.description}
              </p>
              {item.detail ? (
                <p className={clsx("mt-2 text-[0.8125rem] leading-snug", t.soft)}>{item.detail}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
