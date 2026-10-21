"use client";

import { Pointer } from "lucide-react";
import { m, useAnimate, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import type { GuestGroup, WeddingEvent } from "@/lib/domain/types";
import { formatLongDate } from "@/lib/format";
import { AlmondBranch, Monogram, WaxSealArt } from "../ornaments";

const silk = [0.22, 1, 0.36, 1] as const;

/*
 * Pantalla 2 · Sobre con apertura 3D.
 *
 * Todas las piezas son hermanas dentro del mismo contexto de apilamiento para poder intercalar
 * la carta entre el fondo y el bolsillo. La solapa gira con `rotateX` y su propia perspectiva
 * (sin `preserve-3d`, que da problemas en Safari); al pasar de 90° cambia de cara y de z-index
 * para quedar detrás de la carta. Solo se animan transform y opacity.
 */

const POCKET_TIP = 54; // % de altura donde se juntan las solapas laterales
const FLAP_DEPTH = 56; // % de altura que ocupa la solapa superior

// Forro del sobre: tinta de olivo con un fino rayado en oro, visible solo al abrirlo.
const linerPattern =
  "repeating-linear-gradient(135deg, #2c3125 0 9px, #a3874e 9px 9.6px, #2c3125 9.6px 18px)";

export function EnvelopeStage({
  event,
  group,
  onOpened,
}: {
  event: WeddingEvent;
  group: GuestGroup;
  onOpened: () => void;
}) {
  const reduce = useReducedMotion();
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const [opening, setOpening] = useState(false);
  const alive = useRef(true);

  // Inclinación sutil siguiendo el puntero (solo ratón): refuerza la sensación de objeto físico.
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(tiltX, { stiffness: 140, damping: 16 });
  const rotateY = useSpring(tiltY, { stiffness: 140, damping: 16 });

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const handlePointerMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse" || opening || reduce) return;
    const box = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - box.left) / box.width - 0.5;
    const py = (e.clientY - box.top) / box.height - 0.5;
    tiltX.set(-py * 10);
    tiltY.set(px * 14);
  };
  const resetTilt = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  async function open() {
    if (opening) return;
    setOpening(true);
    resetTilt();

    if (reduce) {
      await animate(scope.current, { opacity: 0 }, { duration: 0.25 });
      if (alive.current) onOpened();
      return;
    }

    // El título se retira para dejar espacio a la solapa abierta y a la carta.
    animate("[data-heading]", { opacity: 0, y: -12 }, { duration: 0.45, ease: "easeOut" });

    // 1. Presión sobre el lacre y rotura en dos mitades.
    await animate("[data-seal]", { scale: [1, 0.86, 1.02] }, { duration: 0.34, ease: "easeOut" });
    if (!alive.current) return;
    animate("[data-seal-whole]", { opacity: 0 }, { duration: 0 });
    animate("[data-seal-half]", { opacity: 1 }, { duration: 0 });
    animate(
      "[data-seal-half='l']",
      { x: -22, y: 70, rotate: -32, opacity: 0 },
      { duration: 0.75, ease: [0.5, 0, 0.9, 0.6] },
    );
    animate(
      "[data-seal-half='r']",
      { x: 20, y: 80, rotate: 26, opacity: 0 },
      { duration: 0.75, ease: [0.5, 0, 0.9, 0.6] },
    );

    // 2. La solapa se levanta hasta quedar de canto, cambia de cara y termina de abrirse.
    animate("[data-flap-shadow]", { opacity: 0 }, { duration: 0.3 });
    await animate(
      "[data-flap]",
      { rotateX: 90 },
      { duration: 0.42, delay: 0.1, ease: [0.55, 0, 1, 0.45] },
    );
    if (!alive.current) return;
    animate("[data-flap]", { zIndex: 5 }, { duration: 0 });
    animate("[data-flap-outer]", { opacity: 0 }, { duration: 0 });
    await animate("[data-flap]", { rotateX: 180 }, { duration: 0.5, ease: [0, 0.55, 0.45, 1] });
    if (!alive.current) return;

    // 3. La carta sale del sobre…
    await animate("[data-letter]", { y: "-64%" }, { duration: 0.95, ease: silk });
    if (!alive.current) return;

    // 4. …y el sobre se retira mientras la carta pasa al primer plano.
    animate("[data-body]", { y: 220, opacity: 0 }, { duration: 0.7, ease: [0.55, 0, 0.85, 0.35] });
    await animate("[data-letter]", { y: "-18%", scale: 1.14 }, { duration: 0.75, ease: silk });
    if (alive.current) onOpened();
  }

  return (
    <m.section
      aria-labelledby="envelope-title"
      className="fixed inset-0 z-10 flex flex-col items-center justify-center overflow-hidden bg-[radial-gradient(120%_80%_at_50%_45%,#e3d6c2_0%,#cdbca4_55%,#b6a387_100%)] px-6 pt-16 pb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.35 } }}
      transition={{ duration: 0.6 }}
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
          onPointerMove={handlePointerMove}
          onPointerLeave={resetTilt}
          aria-label="Abrir el sobre"
          aria-disabled={opening}
          className="group relative block w-[min(84vw,380px)] cursor-pointer rounded-sm focus-visible:outline-offset-8 sm:w-[440px]"
          style={{ rotateX, rotateY, transformPerspective: 1100 }}
          whileTap={opening || reduce ? undefined : { scale: 0.985 }}
        >
          {/* Flotación en reposo (CSS) en un contenedor propio para no competir con Motion. */}
          <span className={`relative block aspect-[10/7] ${opening ? "" : "envelope-idle"}`}>
            {/* Sombra proyectada */}
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

            {/* Carta */}
            <m.span
              data-letter
              aria-hidden
              className="paper-grain absolute inset-x-[6%] top-[5%] z-10 block h-[88%] rounded-[2px] bg-paper shadow-[0_1px_3px_rgb(60_45_25/0.18)]"
            >
              <span className="flex flex-col items-center px-4 pt-[7%] text-center">
                <Monogram
                  first={event.couple.first}
                  second={event.couple.second}
                  className="block size-[clamp(1.75rem,7vw,2.25rem)] text-gold"
                />
                <span className="mt-2 block font-display text-[clamp(1.5rem,6.5vw,2.125rem)] leading-none text-ink">
                  {event.couple.first} &amp; {event.couple.second}
                </span>
                <span className="caption mt-2 block !text-[clamp(0.75rem,3vw,0.9375rem)] text-ink-soft">
                  {formatLongDate(event.date)}
                </span>
              </span>
            </m.span>

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
              />
              <span
                data-flap-outer
                className="paper-grain absolute inset-0 block bg-[linear-gradient(180deg,#f3ebde,#ebe0ce)]"
                style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
              >
                <AlmondBranch className="absolute top-[22%] left-[55%] w-[22%] rotate-[4deg] opacity-95" />
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
                  className="absolute inset-0 block transition-transform duration-500 group-hover:scale-105"
                >
                  <WaxSealArt monogram={event.couple.monogram} className="size-full" />
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
              <Pointer aria-hidden className="size-4 motion-safe:animate-pulse" />
              Toca el sobre para abrirlo
            </>
          )}
        </p>
      </div>
    </m.section>
  );
}
