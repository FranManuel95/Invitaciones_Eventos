"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Móvil de la página de venta. Primero enseña una portada ligera (una foto y los nombres) y la
 * invitación de verdad solo se carga al tocarla: así la página de venta pesa menos de la mitad.
 */
export function PhoneDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative h-[calc(844px*var(--s))] w-[calc(390px*var(--s))] overflow-hidden rounded-[2.25rem] border-[6px] border-ink bg-ink shadow-[var(--shadow-lift)]">
      {open ? (
        <iframe
          src="/i/familia-garcia"
          title="Invitación de ejemplo de María y Daniel"
          className="absolute top-0 left-0 h-[844px] w-[390px] origin-top-left scale-[var(--s)] rounded-[1.75rem] bg-ivory"
        />
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group absolute inset-0 overflow-hidden rounded-[1.75rem] text-center text-white focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
        >
          <Image
            src="/fotos/portada.jpg"
            alt=""
            fill
            priority
            sizes="320px"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <span
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(180deg,rgb(0_0_0/0.35),rgb(0_0_0/0.05)_45%,rgb(0_0_0/0.55))]"
          />
          <span className="relative grid h-full content-between px-6 py-10">
            <span className="font-display text-[2.75rem] leading-[0.95] [text-shadow:0_2px_24px_rgb(0_0_0/0.35)]">
              María
              <span className="block">&amp; Daniel</span>
            </span>
            <span className="mx-auto rounded-full border border-white/50 bg-white/15 px-5 py-2.5 text-[0.9375rem] backdrop-blur-sm transition-colors group-hover:bg-white/25">
              Abrir la invitación aquí
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
