"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import type { WeddingEvent } from "@/lib/domain/types";
import { useScrollProgress } from "../effects/scroll-progress";
import { haptic, playTick } from "../effects/sound";

/*
 * Nuestra historia en capítulos: la escena se queda fija y cada momento ocupa la pantalla con su
 * foto, que se mueve despacio y se funde con la siguiente mientras se baja; el año y el texto
 * entran encima. Estilos en globals.css (.story-*), movidos por --p.
 *
 * Solo se usa cuando todos los momentos tienen foto y no se pide reducir el movimiento; si no,
 * la línea de tiempo de siempre (`StorySection`).
 */
const step = (_step: number, first: boolean) => {
  if (first) return;
  haptic(8);
  playTick();
};

export function StoryScene({ event }: { event: WeddingEvent }) {
  const { story } = event;
  const count = Math.max(story.moments.length, 2);
  // Cada capítulo se nota en el dedo (y se oye, si hay sonido) al llegar.
  const scene = useScrollProgress<HTMLDivElement>("pin", true, count, step);
  return (
    <section id="historia" aria-labelledby="historia-title" className="bg-ink">
      <div aria-hidden className="story-in h-[14svh]" />
      <div
        ref={scene}
        className="scroll-scene"
        style={{ "--n": count, height: `calc(${count - 1} * 95svh + 100svh)` } as CSSProperties}
      >
        <div className="sticky top-0 h-[100svh] overflow-hidden text-white">
          {story.moments.map((moment, i) => (
            <div
              key={moment.year}
              aria-hidden
              className="story-photo absolute inset-0"
              style={{ "--i": i } as CSSProperties}
            >
              <Image src={moment.photo!} alt="" fill sizes="100vw" className="object-cover" />
            </div>
          ))}
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(180deg,rgb(0_0_0/0.55)_0%,rgb(0_0_0/0.05)_26%,rgb(0_0_0/0)_42%,rgb(0_0_0/0.7)_78%,rgb(0_0_0/0.88)_100%)]"
          />

          <div className="relative mx-auto flex h-full max-w-5xl flex-col px-6 pt-20 pb-10 sm:px-10">
            <h2
              id="historia-title"
              className="font-display text-[2.5rem] leading-[1.05] [text-shadow:0_2px_24px_rgb(0_0_0/0.4)] sm:text-[3rem]"
            >
              Nuestra historia
            </h2>
            <p className="mt-2 max-w-[30ch] text-[0.9375rem] text-white/85">{story.intro}</p>

            <ol className="relative mt-auto min-h-[15rem]">
              {story.moments.map((moment, i) => (
                <li
                  key={moment.year}
                  className="story-chapter absolute inset-x-0 bottom-0"
                  style={{ "--i": i } as CSSProperties}
                >
                  <p className="font-display text-[clamp(4rem,20vw,7rem)] leading-[0.9] tabular-nums [text-shadow:0_2px_30px_rgb(0_0_0/0.45)]">
                    {moment.year}
                  </p>
                  <h3 className="mt-3 font-display text-[1.875rem] leading-tight">
                    {moment.title}
                  </h3>
                  <p className="mt-2 max-w-[36ch] text-[1rem] leading-relaxed text-white/88">
                    {moment.text}
                  </p>
                </li>
              ))}
            </ol>

            <ul aria-hidden className="mt-7 flex gap-3">
              {story.moments.map((moment, i) => (
                <li
                  key={moment.year}
                  className="story-dot size-1.5 rounded-full bg-white"
                  style={{ "--i": i } as CSSProperties}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
      {/* De la última foto al papel de la sección siguiente, sin corte. */}
      <div aria-hidden className="story-out h-[22svh]" />
    </section>
  );
}
