"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent } from "react";

export interface JourneyStep {
  src: string;
  title: string;
  text: string;
  /** Texto alternativo de la pantalla. */
  alt: string;
}

/** Marco de móvil fino, sin cromo de marca: lo que importa es la pantalla. */
function Phone({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`relative aspect-[390/844] overflow-hidden rounded-[2.1rem] border-[7px] border-[var(--tinta)] bg-[var(--tinta)] shadow-[0_40px_80px_-30px_rgb(27_32_51/0.55)] ${className}`}
    >
      <div className="absolute inset-0 overflow-hidden rounded-[1.6rem]">{children}</div>
    </div>
  );
}

/**
 * El recorrido del invitado, paso a paso. En pantallas anchas el móvil se queda fijo a la
 * izquierda y cambia de pantalla según el paso que se lee; en tableta, cada paso lleva la suya;
 * en el móvil, un paso a la vez (MobileSteps).
 */
export function Journey({ steps }: { steps: readonly JourneyStep[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      // Cuenta como activo el paso que cruza la franja central de la ventana.
      { rootMargin: "-45% 0px -45% 0px" },
    );
    for (const el of refs.current) if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
      <div aria-hidden className="hidden lg:block">
        <div className="sticky top-[max(2rem,calc(50svh-21rem))]">
          <Phone className="mx-auto w-[19.5rem]">
            {steps.map((step, i) => (
              <div
                key={step.src}
                data-active={i === active ? "" : undefined}
                className="v-screen absolute inset-0"
              >
                <Image
                  src={step.src}
                  alt=""
                  fill
                  sizes="312px"
                  className="object-cover object-top"
                  priority={i === 0}
                />
              </div>
            ))}
          </Phone>
        </div>
      </div>

      <MobileSteps steps={steps} />

      <ol className="hidden gap-16 sm:grid lg:gap-0">
        {steps.map((step, i) => (
          <li
            key={step.src}
            ref={(el) => {
              refs.current[i] = el;
            }}
            data-index={i}
            data-active={i === active ? "" : undefined}
            className="v-step grid grid-cols-[11rem_minmax(0,1fr)] items-center gap-6 lg:flex lg:min-h-[64svh] lg:flex-col lg:items-start lg:justify-center"
          >
            <Phone className="w-[11rem] lg:hidden">
              <Image
                src={step.src}
                alt={step.alt}
                fill
                sizes="176px"
                className="object-cover object-top"
              />
            </Phone>
            <div>
              <p className="v-num text-[3rem] leading-none text-[var(--oro-tinta)]">{i + 1}</p>
              <h3 className="v-display mt-3 text-[2.75rem] leading-[1.05]">{step.title}</h3>
              <p className="mt-4 max-w-[38ch] text-[1.0625rem] leading-relaxed text-[var(--grafito)]">
                {step.text}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/**
 * El recorrido en el móvil: un solo móvil centrado, dentro de los márgenes, con el paso debajo.
 * Se pasa con los botones o deslizando el dedo sobre la pantalla.
 */
function MobileSteps({ steps }: { steps: readonly JourneyStep[] }) {
  const [index, setIndex] = useState(0);
  const startX = useRef<number | null>(null);
  const step = steps[index]!;
  const go = (delta: number) => setIndex((i) => Math.min(steps.length - 1, Math.max(0, i + delta)));

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    startX.current = e.clientX;
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
  };

  const arrow =
    "grid size-11 place-items-center rounded-full border border-[var(--papel-2)] bg-white text-[var(--tinta)] transition-opacity disabled:opacity-35";

  return (
    <div className="sm:hidden">
      <div
        className="mx-auto w-[min(58vw,14.5rem)] touch-pan-y"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (startX.current = null)}
      >
        <Phone>
          {steps.map((s, i) => (
            <div
              key={s.src}
              data-active={i === index ? "" : undefined}
              className="v-screen absolute inset-0"
            >
              <Image
                src={s.src}
                alt={i === index ? s.alt : ""}
                fill
                sizes="232px"
                className="object-cover object-top"
              />
            </div>
          ))}
        </Phone>
      </div>

      <div aria-live="polite" className="mt-8 text-center">
        <p className="v-num text-[2.25rem] leading-none text-[var(--oro-tinta)]">
          {index + 1}
          <span className="sr-only"> de {steps.length}</span>
        </p>
        <h3 className="v-display mt-2 text-[1.875rem] leading-[1.05]">{step.title}</h3>
        <p className="mx-auto mt-3 min-h-[4.9em] max-w-[32ch] text-[0.9375rem] leading-relaxed text-[var(--grafito)]">
          {step.text}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={index === 0}
          aria-label="Paso anterior"
          className={arrow}
        >
          <ChevronLeft aria-hidden className="size-5" />
        </button>
        <div aria-hidden className="flex gap-2">
          {steps.map((s, i) => (
            <span
              key={s.src}
              className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ${
                i === index ? "w-5 bg-[var(--oro-tinta)]" : "w-1.5 bg-[var(--papel-2)]"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={index === steps.length - 1}
          aria-label="Paso siguiente"
          className={arrow}
        >
          <ChevronRight aria-hidden className="size-5" />
        </button>
      </div>
    </div>
  );
}
