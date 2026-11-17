"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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
 * izquierda y cambia de pantalla según el paso que se lee; en el móvil, cada paso lleva la suya.
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

      <ol
        // En el móvil se desliza de lado (y se recorre con el teclado); desde tableta, en columna.
        tabIndex={0}
        aria-label="Pasos del invitado"
        className="v-rail -mx-6 flex snap-x snap-mandatory scroll-px-6 gap-5 overflow-x-auto px-6 pb-4 focus-visible:outline-offset-4 sm:mx-0 sm:grid sm:gap-16 sm:overflow-visible sm:px-0 sm:pb-0 lg:gap-0"
      >
        {steps.map((step, i) => (
          <li
            key={step.src}
            ref={(el) => {
              refs.current[i] = el;
            }}
            data-index={i}
            data-active={i === active ? "" : undefined}
            className="v-step flex w-[74vw] max-w-[18rem] shrink-0 snap-start flex-col gap-5 sm:grid sm:w-auto sm:max-w-none sm:grid-cols-[11rem_minmax(0,1fr)] sm:items-center sm:gap-6 lg:flex lg:min-h-[64svh] lg:flex-col lg:items-start lg:justify-center"
          >
            <Phone className="w-full sm:w-[11rem] lg:hidden">
              <Image
                src={step.src}
                alt={step.alt}
                fill
                sizes="(min-width: 640px) 176px, 74vw"
                className="object-cover object-top"
              />
            </Phone>
            <div>
              <p className="v-num text-[2.25rem] leading-none text-[var(--oro-tinta)] sm:text-[3rem]">
                {i + 1}
              </p>
              <h3 className="v-display mt-2 text-[1.75rem] leading-[1.05] sm:mt-3 sm:text-[2.75rem]">
                {step.title}
              </h3>
              <p className="mt-3 max-w-[38ch] text-[0.9375rem] leading-relaxed text-[var(--grafito)] sm:mt-4 sm:text-[1.0625rem]">
                {step.text}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
