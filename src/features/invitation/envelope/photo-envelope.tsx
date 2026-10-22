"use client";

import { Pointer } from "lucide-react";
import { m, useAnimate, useReducedMotion } from "motion/react";
import type { CSSProperties } from "react";
import type { GuestGroup, WeddingEvent } from "@/lib/domain/types";
import type { Theme } from "@/lib/theme";
import { seeded } from "@/lib/theme/cover";
import { haptic, playPaper, playSealCrack, unlockAudio } from "../effects/sound";
import { useOpening } from "./use-opening";

/*
 * Apertura «sobre fotográfico»: cuatro fotos de un sobre real (cerrado, el lacre que salta, el
 * sobre abierto con luz dentro y la tarjeta que sale) montadas como una película corta. La cámara
 * se acerca al lacre, estalla en chispas doradas, un destello da paso al sobre abierto y al final
 * se entra en la tarjeta, que se convierte en la carta. Las fotos son siempre las mismas (no
 * dependen del tema): están en public/aperturas/sobre-foto y se pueden cambiar por otras más
 * grandes con el mismo encuadre.
 */

const SHOTS = [1, 2, 3, 4].map((n) => `/aperturas/sobre-foto/${n}.webp`);
// Dónde está cada cosa en las fotos (en %): el lacre en la primera, la luz en la tercera y el
// centro de la tarjeta en la cuarta, para que la cámara se acerque justo ahí.
const SEAL = "50% 55%";
const GLOW = "50% 62%";
const CARD = "51% 46%";

// Chispas doradas del lacre: dirección, distancia y tamaño fijos (iguales en cada carga).
const SPARKS = (() => {
  const rand = seeded(7);
  return Array.from({ length: 22 }, (_, i) => {
    const angle = (i / 22) * Math.PI * 2 + rand() * 0.5;
    // Distancia en centésimas del lado corto de la pantalla.
    const distance = 22 + rand() * 30;
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      size: 4 + rand() * 7,
      delay: rand() * 0.15,
    };
  });
})();

const ease = [0.22, 1, 0.36, 1] as const;
const wait = (s: number) => new Promise((r) => setTimeout(r, s * 1000));

export function PhotoEnvelope({
  group,
  onOpened,
  interactive = true,
}: {
  event: WeddingEvent;
  group: GuestGroup;
  onOpened: () => void;
  interactive?: boolean;
  theme?: Theme;
}) {
  const reduce = useReducedMotion();
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const { opening, begin, alive } = useOpening(interactive);

  async function open() {
    if (!begin()) return;
    unlockAudio();
    if (reduce) {
      onOpened();
      return;
    }
    animate("[data-heading]", { opacity: 0, y: -10 }, { duration: 0.5 });
    // 1. La cámara se acerca al lacre y este se enciende.
    haptic(14);
    animate("[data-glow]", { scale: [1, 2.8], opacity: [0.9, 0] }, { duration: 0.8 });
    await animate("[data-shot='1']", { scale: 1.16 }, { duration: 0.6, ease: [0.5, 0, 0.75, 0] });
    if (!alive.current) return;
    // 2. El lacre salta: primer plano y chispas de oro.
    playSealCrack();
    haptic([10, 30, 18]);
    animate("[data-spark]", { x: 0, y: 0, opacity: 1, scale: 1 }, { duration: 0 });
    const unit = Math.min(window.innerWidth, window.innerHeight) / 100;
    for (const [i, s] of SPARKS.entries()) {
      animate(
        `[data-spark='${i}']`,
        { x: s.x * unit, y: s.y * unit, opacity: [1, 1, 0], scale: [1, 0.4] },
        { duration: 1.3, delay: s.delay, ease: "easeOut" },
      );
    }
    animate("[data-shot='2']", { scale: [1.04, 1] }, { duration: 2.2, ease: "linear" });
    await animate("[data-shot='2']", { opacity: [0, 1] }, { duration: 0.35 });
    await wait(1.1);
    if (!alive.current) return;
    // 3. Un destello de luz y el sobre ya está abierto, brillando por dentro.
    playPaper(0.8, 0.05);
    animate("[data-flash]", { opacity: [0, 0.95, 0] }, { duration: 1, times: [0, 0.35, 1] });
    animate("[data-shot='3']", { scale: [1.12, 1] }, { duration: 2.2, ease });
    await animate("[data-shot='3']", { opacity: 1 }, { duration: 0.2, delay: 0.3 });
    animate("[data-inner]", { opacity: [0, 0.8, 0.45] }, { duration: 1.6 });
    await wait(1.3);
    if (!alive.current) return;
    // 4. Sale la tarjeta, con la cinta.
    playPaper(0.5, 0.02);
    animate("[data-shot='4']", { scale: [1.06, 1] }, { duration: 1.6, ease });
    await animate("[data-shot='4']", { opacity: [0, 1] }, { duration: 0.8 });
    await wait(0.6);
    if (!alive.current) return;
    // 5. La cámara entra en la tarjeta hasta que el papel llena la pantalla: es la carta.
    const frame = scope.current?.querySelector<HTMLElement>("[data-frame]");
    const box = frame?.getBoundingClientRect();
    const zoom = box
      ? Math.max(window.innerWidth / (box.width * 0.42), window.innerHeight / (box.height * 0.6))
      : 4;
    animate("[data-paper]", { opacity: 1 }, { duration: 0.55, delay: 0.55 });
    await animate("[data-frame]", { scale: zoom }, { duration: 1.2, ease: [0.65, 0, 0.85, 0.2] });
    if (alive.current) onOpened();
  }

  return (
    <section
      aria-labelledby="envelope-title"
      inert={!interactive}
      data-opening="foto"
      className="fixed inset-0 z-10 overflow-hidden bg-[#e6ddcf] text-[#4a3b2a]"
    >
      {/* Fondo: la primera foto, ampliada y desenfocada, para rellenar la pantalla. */}
      <div
        aria-hidden
        className="absolute inset-0 scale-125 bg-cover bg-center opacity-70 blur-2xl"
        style={{ backgroundImage: `url(${SHOTS[0]})` }}
      />
      <div aria-hidden className="absolute inset-0 bg-[#f3ece1]/35" />

      <div
        ref={scope}
        className="relative flex h-full flex-col items-center justify-center px-4 pt-16 pb-10"
      >
        <div data-heading className="mb-6 text-center">
          <p className="caption text-[#6b5a45]">Una invitación para</p>
          <h1
            id="envelope-title"
            tabIndex={-1}
            className="mt-1 font-display text-[clamp(2rem,8vw,3rem)] leading-tight outline-none"
          >
            {group.displayName}
          </h1>
        </div>

        <div className="relative">
          <m.div
            data-frame
            className="relative aspect-[374/304] w-[min(94vw,600px)] overflow-hidden rounded-[6px] shadow-[0_24px_60px_-20px_rgb(60_45_25/0.55)]"
            style={{ transformOrigin: CARD }}
          >
            {SHOTS.map((src, i) => (
              <m.img
                key={src}
                data-shot={i + 1}
                src={src}
                alt=""
                draggable={false}
                fetchPriority={i === 0 ? "high" : "low"}
                className="absolute inset-0 size-full object-cover select-none"
                style={{
                  opacity: i === 0 ? 1 : 0,
                  transformOrigin: i === 0 ? SEAL : i === 2 ? GLOW : i === 3 ? CARD : "50% 50%",
                }}
              />
            ))}
            {/* El lacre respira mientras espera. */}
            {opening ? null : (
              <span
                aria-hidden
                className="photo-seal-glow absolute size-[18%] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ left: "50%", top: "55%" }}
              />
            )}
            <m.span
              data-glow
              aria-hidden
              className="absolute size-[22%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(255_236_170/0.9),rgb(255_214_120/0.35)_45%,transparent_70%)] opacity-0"
              style={{ left: "50%", top: "55%" }}
            />
            {/* Luz que sale del sobre abierto. */}
            <m.span
              data-inner
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(40%_32%_at_50%_62%,rgb(255_230_160/0.9),transparent_70%)] opacity-0 mix-blend-screen"
            />
            <m.span
              data-flash
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_55%,#fff8e6,#f5dca0_60%,#e7c27a)] opacity-0"
            />
            {/* Botón vacío encima de la foto: su nombre accesible no compite con los textos. */}
            <button
              type="button"
              onClick={() => void open()}
              aria-label="Abrir el sobre"
              aria-disabled={opening}
              className="absolute inset-0 z-10 cursor-pointer rounded-[6px] focus-visible:outline-offset-4"
            />
          </m.div>
          {/* Chispas: fuera del marco (que recorta) para que vuelen por la pantalla. */}
          <span aria-hidden className="pointer-events-none absolute top-[55%] left-1/2 z-20">
            {SPARKS.map((s, i) => (
              <m.span
                key={i}
                data-spark={i}
                className="absolute block rounded-full bg-[radial-gradient(circle,#fff3c4,#e2b456_60%,#a87a2a)] opacity-0 shadow-[0_0_8px_rgb(255_210_120/0.8)]"
                style={{ width: s.size, height: s.size } as CSSProperties}
              />
            ))}
          </span>
        </div>

        <p
          data-heading
          aria-live="polite"
          className="mt-8 flex items-center gap-2 text-[0.9375rem] text-[#5a4936]"
        >
          {opening ? (
            "Abriendo…"
          ) : (
            <>
              <Pointer aria-hidden className="size-4" />
              Toca el lacre para abrir el sobre
            </>
          )}
        </p>
      </div>

      {/* El papel de la tarjeta, que llena la pantalla justo antes de la carta. */}
      <m.div data-paper aria-hidden className="absolute inset-0 bg-ivory opacity-0" />
    </section>
  );
}
