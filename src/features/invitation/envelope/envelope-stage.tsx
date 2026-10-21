"use client";

import { Pointer } from "lucide-react";
import { m, useAnimate, useReducedMotion, useTransform } from "motion/react";
import { useEffect, useRef, useState, ViewTransition } from "react";
import type { GuestGroup, WeddingEvent } from "@/lib/domain/types";
import { formatLongDate } from "@/lib/format";
import { FoilMonogram } from "../effects/foil";
import { haptic, playPaper, playSealCrack, unlockAudio } from "../effects/sound";
import { useTilt } from "../effects/tilt";
import { AlmondBranch, Monogram, WaxSealArt } from "../ornaments";

/*
 * Pantalla 2 · Sobre con apertura 3D.
 *
 * Todas las piezas son hermanas dentro del mismo contexto de apilamiento para poder intercalar
 * la carta entre el fondo y el bolsillo. La solapa gira con `rotateX` y su propia perspectiva
 * (sin `preserve-3d`, que da problemas en Safari); al pasar de 90° cambia de cara y de z-index
 * para quedar detrás de la carta. Solo se animan transform y opacity.
 *
 * Realismo: la luz de la solapa depende de su ángulo, la solapa proyecta sombra sobre la carta,
 * el lacre se parte en dos mitades y suelta fragmentos, la carta sale con fricción y una leve
 * curvatura, y todo el sobre responde a la inclinación del móvil.
 * La carta lleva un <ViewTransition name="carta">: al terminar se transforma en la carta grande.
 */

const POCKET_TIP = 54; // % de altura donde se juntan las solapas laterales
const FLAP_DEPTH = 56; // % de altura que ocupa la solapa superior

// Forro del sobre: tinta de olivo con un fino rayado en oro, visible solo al abrirlo.
const linerPattern =
  "repeating-linear-gradient(135deg, #2c3125 0 9px, #a3874e 9px 9.6px, #2c3125 9.6px 18px)";

// Fragmentos de cera: posición final relativa al lacre (px), giro y tamaño.
const CRUMBS: [number, number, number, number][] = [
  [-38, 90, -140, 7],
  [-20, 120, 90, 5],
  [-6, 70, 200, 4],
  [14, 110, -60, 6],
  [30, 84, 160, 5],
  [44, 128, -220, 4],
  [-48, 60, 40, 4],
  [6, 140, 300, 3],
];

const friction = [0.33, 0, 0.15, 1] as const;

export function EnvelopeStage({
  event,
  group,
  onOpened,
  interactive = true,
}: {
  event: WeddingEvent;
  group: GuestGroup;
  onOpened: () => void;
  /** Falso mientras la portada lo tapa: se ve al levantarla, pero no se puede usar aún. */
  interactive?: boolean;
}) {
  const reduce = useReducedMotion();
  const tilt = useTilt();
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const [opening, setOpening] = useState(false);
  const alive = useRef(true);

  // El sobre entero se inclina con el móvil o el ratón: es un objeto en la mano.
  const rotateX = useTransform(tilt.y, (v) => v * -7);
  const rotateY = useTransform(tilt.x, (v) => v * 10);
  const sealShineX = useTransform(tilt.x, (v) => `${v * 30}%`);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  async function open() {
    if (opening || !interactive) return;
    setOpening(true);
    unlockAudio();
    tilt.enableDeviceTilt();

    if (reduce) {
      onOpened();
      return;
    }

    // El título se retira para dejar espacio a la solapa abierta y a la carta.
    animate("[data-heading]", { opacity: 0, y: -12 }, { duration: 0.45, ease: "easeOut" });

    // 1. Presión: el sobre cede un poco y el lacre se aplasta antes de romperse.
    animate("[data-envelope]", { scale: [1, 0.982, 1], y: [0, 3, 0] }, { duration: 0.36 });
    await animate("[data-seal]", { scale: [1, 0.84, 1.03] }, { duration: 0.34, ease: "easeOut" });
    if (!alive.current) return;
    playSealCrack();
    haptic([8, 30, 14]);
    animate("[data-seal-whole]", { opacity: 0 }, { duration: 0 });
    animate("[data-seal-half]", { opacity: 1 }, { duration: 0 });
    animate(
      "[data-seal-half='l']",
      { x: -26, y: 84, rotate: -38, opacity: 0 },
      { duration: 0.8, ease: [0.5, 0, 0.9, 0.6] },
    );
    animate(
      "[data-seal-half='r']",
      { x: 22, y: 96, rotate: 30, opacity: 0 },
      { duration: 0.8, ease: [0.5, 0, 0.9, 0.6] },
    );
    CRUMBS.forEach(([x, y, rotate], i) => {
      animate(
        `[data-crumb='${i}']`,
        { x: [0, x * 0.4, x], y: [0, -14 - i * 2, y], rotate, opacity: [1, 1, 0] },
        { duration: 0.75 + i * 0.04, ease: "easeIn" },
      );
    });

    // 2. La solapa se levanta: se oscurece al ponerse de canto, cambia de cara y se aclara.
    playPaper(0.55, 0.05);
    animate("[data-flap-shadow]", { opacity: 0 }, { duration: 0.3 });
    animate("[data-flap-shade]", { opacity: 0.42 }, { duration: 0.42, delay: 0.1, ease: "easeIn" });
    await animate(
      "[data-flap]",
      { rotateX: 90 },
      { duration: 0.42, delay: 0.1, ease: [0.55, 0, 1, 0.45] },
    );
    if (!alive.current) return;
    animate("[data-flap]", { zIndex: 5 }, { duration: 0 });
    animate("[data-flap-outer]", { opacity: 0 }, { duration: 0 });
    animate("[data-liner-shade]", { opacity: [0.5, 0] }, { duration: 0.5, ease: "easeOut" });
    // La solapa abierta deja una sombra suave sobre el borde superior de la carta.
    animate("[data-letter-shadow]", { opacity: [0, 0.55, 0.25] }, { duration: 0.6 });
    await animate("[data-flap]", { rotateX: 180 }, { duration: 0.5, ease: [0, 0.55, 0.45, 1] });
    if (!alive.current) return;

    // 3. La carta sale con fricción: arranca despacio, se curva levemente y se endereza.
    playPaper(0.9, 0.05);
    animate("[data-letter-shadow]", { opacity: 0 }, { duration: 0.6, delay: 0.3 });
    await animate(
      "[data-letter]",
      { y: "-64%", skewY: [0.9, 0.4, 0], scaleY: [0.992, 1] },
      { duration: 1.05, ease: friction },
    );
    if (!alive.current) return;

    // 4. El sobre se retira y la carta sube al primer plano; luego se transforma en la carta grande.
    animate("[data-body]", { y: 240, opacity: 0 }, { duration: 0.7, ease: [0.55, 0, 0.85, 0.35] });
    await animate("[data-letter]", { y: "-20%", scale: 1.1 }, { duration: 0.7, ease: friction });
    if (alive.current) onOpened();
  }

  return (
    <section
      aria-labelledby="envelope-title"
      inert={!interactive}
      className="fixed inset-0 z-10 flex flex-col items-center justify-center overflow-hidden bg-[radial-gradient(120%_80%_at_50%_45%,#e3d6c2_0%,#cdbca4_55%,#b6a387_100%)] px-6 pt-16 pb-10"
    >
      <div aria-hidden className="paper-grain absolute inset-0" />

      <div ref={scope} className="relative flex w-full flex-col items-center">
        <div
          data-heading
          className="mb-10 flex flex-col items-center text-center text-ink-soft sm:mb-12"
        >
          <Monogram
            first={event.couple.first}
            second={event.couple.second}
            className="mb-5 size-12 text-ink-soft"
          />
          <p className="caption text-ink-soft">Una invitación para</p>
          <h1
            id="envelope-title"
            tabIndex={-1}
            className="mt-1 font-display text-[clamp(2.25rem,9vw,3.25rem)] leading-tight text-ink outline-none"
          >
            {group.displayName}
          </h1>
        </div>

        <m.button
          type="button"
          onClick={open}
          aria-label="Abrir el sobre"
          aria-disabled={opening}
          className="group relative block w-[min(84vw,380px)] cursor-pointer rounded-sm focus-visible:outline-offset-8 sm:w-[440px]"
          style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 1100 }}
        >
          {/* Flotación en reposo (CSS) en un contenedor propio para no competir con Motion. */}
          <span
            data-envelope
            className={`relative block aspect-[10/7] ${opening ? "" : "envelope-idle"}`}
          >
            {/* Sombra proyectada en la mesa */}
            <span
              data-body
              aria-hidden
              className="absolute inset-x-[6%] -bottom-6 block h-8 rounded-[50%] bg-[#4b3a28]/30 blur-xl"
            />

            {/* Fondo interior del sobre (visible al abrir) */}
            <span
              data-body
              aria-hidden
              className="absolute inset-0 block overflow-hidden rounded-[3px] bg-[#2c3125]"
            >
              <span
                className="absolute inset-x-0 top-0 block h-[60%]"
                style={{ background: linerPattern }}
              />
            </span>

            {/* Carta: se transforma en la carta grande de la siguiente pantalla */}
            <ViewTransition name="carta" share="paper-morph">
              <m.span
                data-letter
                aria-hidden
                className="paper-grain absolute inset-x-[6%] top-[5%] z-10 block h-[88%] origin-bottom rounded-[2px] bg-paper shadow-[0_1px_3px_rgb(60_45_25/0.18)]"
              >
                <span
                  data-letter-shadow
                  className="pointer-events-none absolute inset-x-0 top-0 block h-1/3 rounded-t-[2px] bg-[linear-gradient(180deg,rgb(35_30_20/0.45),transparent)] opacity-0"
                />
                <span className="flex flex-col items-center px-4 pt-[7%] text-center">
                  <FoilMonogram
                    first={event.couple.first}
                    second={event.couple.second}
                    className="size-[clamp(1.9rem,7.5vw,2.4rem)] text-[clamp(1.9rem,7.5vw,2.4rem)]"
                  />
                  <span className="letterpress mt-2 block font-display text-[clamp(1.5rem,6.5vw,2.125rem)] leading-none text-ink">
                    {event.couple.first} &amp; {event.couple.second}
                  </span>
                  <span className="caption mt-2 block !text-[clamp(0.75rem,3vw,0.9375rem)] text-ink-soft">
                    {formatLongDate(event.date)}
                  </span>
                </span>
              </m.span>
            </ViewTransition>

            {/* Bolsillo: tres triángulos con sombra estática de pliegue */}
            <span
              data-body
              aria-hidden
              className="absolute inset-0 z-20 block drop-shadow-[0_-1px_1.5px_rgb(80_60_35/0.22)]"
            >
              <span
                className="paper-grain absolute inset-0 block bg-[linear-gradient(100deg,#e7dcc9,#efe6d7)]"
                style={{ clipPath: `polygon(0 0, 0 100%, 50% ${POCKET_TIP}%)` }}
              />
              <span
                className="paper-grain absolute inset-0 block bg-[linear-gradient(260deg,#e5d9c5,#eee4d4)]"
                style={{ clipPath: `polygon(100% 0, 100% 100%, 50% ${POCKET_TIP}%)` }}
              />
              <span
                className="paper-grain absolute inset-0 block rounded-b-[3px] bg-[linear-gradient(0deg,#e9dfcd,#f2eadc)]"
                style={{ clipPath: `polygon(0 100%, 100% 100%, 50% ${POCKET_TIP - 8}%)` }}
              />
            </span>

            {/* Sombra de la solapa cerrada sobre el bolsillo */}
            <span
              data-flap-shadow
              aria-hidden
              className="absolute inset-x-0 top-[1.5%] z-[29] block bg-[#5a4630]/25 blur-[2px]"
              style={{ height: `${FLAP_DEPTH}%`, clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
            />

            {/* Solapa superior */}
            <m.span
              data-flap
              aria-hidden
              className="absolute inset-x-0 top-0 z-30 block"
              style={{
                height: `${FLAP_DEPTH}%`,
                transformOrigin: "50% 0%",
                transformPerspective: 900,
              }}
            >
              <span
                className="absolute inset-0 block"
                style={{ background: linerPattern, clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
              >
                <span
                  data-liner-shade
                  className="absolute inset-0 block bg-black opacity-0"
                  style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
                />
              </span>
              <span
                data-flap-outer
                className="paper-grain absolute inset-0 block bg-[linear-gradient(180deg,#f3ebde,#ebe0ce)]"
                style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
              >
                <AlmondBranch className="absolute top-[22%] left-[55%] w-[22%] rotate-[4deg] opacity-95" />
                {/* Luz rasante: la solapa se oscurece al girar hacia la vertical */}
                <span
                  data-flap-shade
                  className="absolute inset-0 block bg-[linear-gradient(180deg,rgb(40_30_15/0.2),rgb(40_30_15/0.9))] opacity-0"
                />
              </span>
            </m.span>

            {/* Lacre en la punta de la solapa */}
            <span
              aria-hidden
              className="absolute z-40 block w-[19%] -translate-x-1/2 -translate-y-1/2"
              style={{ left: "50%", top: `${FLAP_DEPTH}%` }}
            >
              <m.span
                data-seal
                className="relative block aspect-square drop-shadow-[0_3px_4px_rgb(60_20_10/0.35)]"
              >
                <span
                  data-seal-whole
                  className="absolute inset-0 block overflow-hidden rounded-full transition-transform duration-500 group-hover:scale-105"
                >
                  <WaxSealArt monogram={event.couple.monogram} className="size-full" />
                  {/* Reflejo de la cera que se desliza con la inclinación */}
                  <m.span
                    className="absolute inset-[12%] block rounded-full bg-[radial-gradient(circle_at_35%_30%,rgb(255_235_220/0.35),transparent_45%)] mix-blend-screen"
                    style={{ x: sealShineX }}
                  />
                </span>
                <m.span
                  data-seal-half="l"
                  className="absolute inset-0 block opacity-0"
                  style={{ clipPath: "polygon(0 0, 52% 0, 44% 30%, 56% 55%, 46% 100%, 0 100%)" }}
                >
                  <WaxSealArt monogram={event.couple.monogram} className="size-full" />
                </m.span>
                <m.span
                  data-seal-half="r"
                  className="absolute inset-0 block opacity-0"
                  style={{
                    clipPath: "polygon(52% 0, 100% 0, 100% 100%, 46% 100%, 56% 55%, 44% 30%)",
                  }}
                >
                  <WaxSealArt monogram={event.couple.monogram} className="size-full" />
                </m.span>
                {CRUMBS.map(([, , , size], i) => (
                  <m.span
                    key={i}
                    data-crumb={i}
                    className="absolute top-1/2 left-1/2 block rounded-[40%] bg-wax opacity-0"
                    style={{ width: size, height: size * 0.8 }}
                  />
                ))}
              </m.span>
            </span>
          </span>
        </m.button>

        <p
          data-heading
          aria-live="polite"
          className="mt-14 flex items-center gap-2 text-[0.9375rem] text-ink-soft"
        >
          {opening ? (
            "Abriendo…"
          ) : (
            <>
              <Pointer aria-hidden className="size-4" />
              Toca el sobre para abrirlo
            </>
          )}
        </p>
      </div>
    </section>
  );
}
