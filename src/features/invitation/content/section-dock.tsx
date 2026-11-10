"use client";

import { clsx } from "clsx";
import { ChevronUp } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

export interface DockLink {
  href: string;
  label: string;
}

/**
 * Barra de secciones del móvil: una píldora flotante al alcance del pulgar. A la izquierda, por
 * dónde vas (con un anillo que se completa al bajar) y, al tocarla, el índice de la invitación; a
 * la derecha, lo más importante en cada momento (confirmar, o tu pase si ya has confirmado).
 * Aparece al dejar atrás la portada y se retira en las escenas a pantalla completa y al final.
 */
export function SectionDock({
  nav,
  active,
  hidden,
  cta,
}: {
  nav: { id: string; label: string }[];
  active: string | null;
  /** Dentro de una escena a pantalla completa o del formulario: la pantalla es suya. */
  hidden: boolean;
  cta: DockLink | null;
}) {
  const root = useRef<HTMLElement>(null);
  const [inRange, setInRange] = useState(false);
  const [open, setOpen] = useState(false);
  const listId = useId();
  const shown = inRange && !hidden;
  const expanded = open && shown;

  // Avance por la página (--page, de 0 a 1) y si estamos entre la portada y el cierre.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      el.style.setProperty("--page", (max > 0 ? Math.min(1, y / max) : 0).toFixed(3));
      setInRange(y > window.innerHeight * 0.7 && y < max - window.innerHeight * 0.55);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  // El índice se cierra con Escape o al tocar fuera.
  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointer = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [expanded]);

  const current = nav.find((item) => item.id === active)?.label ?? "Secciones";

  return (
    <nav
      ref={root}
      aria-label="Secciones de la invitación"
      inert={!shown}
      className={clsx(
        "fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-30 transition-[translate,opacity] duration-500 ease-out sm:hidden",
        shown ? "translate-y-0 opacity-100" : "translate-y-[150%] opacity-0",
      )}
    >
      <ul
        id={listId}
        hidden={!expanded}
        className="dock-index mb-2 rounded-[1.25rem] bg-ink/95 px-6 py-4 text-paper shadow-[0_18px_40px_-16px_rgb(0_0_0/0.6)] backdrop-blur-md"
      >
        {nav.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={active === item.id ? "true" : undefined}
              onClick={() => setOpen(false)}
              className={clsx(
                "flex items-baseline justify-between py-2 font-display text-[1.5rem] leading-tight",
                active === item.id ? "text-paper" : "text-paper/70",
              )}
            >
              {item.label}
              {active === item.id ? (
                <span aria-hidden className="size-1.5 self-center rounded-full bg-gold-soft" />
              ) : null}
            </a>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-2 rounded-full bg-ink/95 p-1.5 text-paper shadow-[0_14px_32px_-12px_rgb(0_0_0/0.55)] backdrop-blur-md">
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={listId}
          onClick={() => setOpen((value) => !value)}
          className="flex min-h-11 min-w-0 flex-1 items-center gap-3 rounded-full pr-3 pl-1.5 text-left"
        >
          {/* Anillo de avance: se completa al llegar al final de la invitación. */}
          <svg aria-hidden viewBox="0 0 32 32" className="size-8 shrink-0 -rotate-90">
            <circle
              cx="16"
              cy="16"
              r="13"
              fill="none"
              stroke="rgb(255 255 255 / 0.22)"
              strokeWidth="2"
            />
            <circle
              cx="16"
              cy="16"
              r="13"
              pathLength={1}
              fill="none"
              stroke="var(--color-gold-soft)"
              strokeWidth="2"
              strokeLinecap="round"
              className="dock-ring"
            />
          </svg>
          <span className="min-w-0 flex-1 truncate text-[0.9375rem]">
            <span className="sr-only">Índice. Estás en: </span>
            {current}
          </span>
          <ChevronUp
            aria-hidden
            className={clsx(
              "size-4 shrink-0 transition-transform duration-300",
              expanded && "rotate-180",
            )}
          />
        </button>
        {cta ? (
          <a
            href={cta.href}
            onClick={() => setOpen(false)}
            className="flex min-h-11 shrink-0 items-center rounded-full bg-paper px-5 text-[0.9375rem] font-medium text-ink"
          >
            {cta.label}
          </a>
        ) : null}
      </div>
    </nav>
  );
}
