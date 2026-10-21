"use client";

import { Pointer } from "lucide-react";
import { m, useAnimate, useReducedMotion, useTransform } from "motion/react";
import { useEffect, useRef, useState, ViewTransition } from "react";
import type { GuestGroup, WeddingEvent } from "@/lib/domain/types";
import { DEFAULT_THEME, ENVELOPES, flapGeometry, WEIGHTS, type Theme } from "@/lib/theme";
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
 * Solo participa en ese relevo (share); con default="none" no se «eleva» por encima del sobre
 * en otras transiciones, como el paso de la portada al sobre.
 *
 * Coreografía de cámara: al abrir, la escena se acerca despacio y los bordes se oscurecen como
 * un foco; la carta da un primer tirón, se desliza fuera, el sobre sale de plano por abajo y un
 * destello de luz recorre la carta justo antes de convertirse en la carta grande.
 */


// Papel, forro, textura e interior salen del tema (variables --env-* de src/lib/theme).
const linerPattern = "var(--env-liner)";
const paper = (angle: string) =>
  `var(--env-texture), linear-gradient(${angle}, var(--env-paper-b), var(--env-paper-a))`;

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
  theme = DEFAULT_THEME,
}: {
  event: WeddingEvent;
  group: GuestGroup;
  onOpened: () => void;
  /** Falso mientras la portada lo tapa: se ve al levantarla, pero no se puede usar aún. */
  interactive?: boolean;
  /** Papel, solapa, gramaje, forro y lacre elegidos para el evento. */
  theme?: Theme;
}) {
  // La solapa puede ser en pico, recta, redonda o festoneada; el lacre va en su borde inferior.
  const { depth: FLAP_DEPTH, clip: flapClip } = flapGeometry(theme.flap);
  // % de altura donde se juntan las solapas laterales del bolsillo. Con una solapa en pico queda
  // por debajo de la punta; con las demás, justo bajo su borde para que no asome la carta.
  const POCKET_TIP = theme.flap === "pico" ? 54 : FLAP_DEPTH - 1;
  const POCKET_BOTTOM = POCKET_TIP - 8; // el panel inferior monta sobre los laterales
  // Gramaje: un papel grueso tiene más canto, más sombra y una solapa que pesa más al abrirse.
  const weight = WEIGHTS[theme.weight];
  const pace = weight.pace;
  const reduce = useReducedMotion();
  const tilt = useTilt();
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const spotlight = useRef<HTMLDivElement>(null);
  const [opening, setOpening] = useState(false);
  // Guarda síncrona: un segundo toque (o un clic tardío) nunca relanza la secuencia.
  const started = useRef(false);
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
    if (started.current || !interactive) return;
    started.current = true;
    setOpening(true);
    unlockAudio();

    if (reduce) {
      onOpened();
      return;
    }

    // El título se retira para dejar espacio a la solapa abierta y a la carta.
    animate("[data-heading]", { opacity: 0, y: -12 }, { duration: 0.45, ease: "easeOut" });
    // Cámara: un acercamiento lento durante toda la apertura y un foco que oscurece los bordes.
    animate(scope.current, { scale: 1.1, y: 18 }, { duration: 4.6, ease: [0.45, 0, 0.25, 1] });
    if (spotlight.current) {
      animate(spotlight.current, { opacity: 1 }, { duration: 2.6, delay: 0.6, ease: "easeInOut" });
    }

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
    animate(
      "[data-flap-shade]",
      { opacity: 0.42 },
      { duration: 0.42 * pace, delay: 0.1, ease: "easeIn" },
    );
    await animate(
      "[data-flap]",
      { rotateX: 90 },
      { duration: 0.42 * pace, delay: 0.1, ease: [0.55, 0, 1, 0.45] },
    );
    if (!alive.current) return;
    animate("[data-flap]", { zIndex: 5 }, { duration: 0 });
    animate("[data-flap-outer]", { opacity: 0 }, { duration: 0 });
    animate("[data-liner-shade]", { opacity: [0.5, 0] }, { duration: 0.5, ease: "easeOut" });
    // La solapa abierta deja una sombra suave sobre el borde superior de la carta.
    animate("[data-letter-shadow]", { opacity: [0, 0.55, 0.25] }, { duration: 0.6 });
    await animate(
      "[data-flap]",
      { rotateX: 180 },
      { duration: 0.5 * pace, ease: [0, 0.55, 0.45, 1] },
    );
    if (!alive.current) return;

    // 3. La carta sale como sacada a mano: un primer tirón corto con un leve giro, y después
    //    un deslizamiento largo con fricción mientras el papel se endereza.
    playPaper(0.9, 0.05);
    animate("[data-letter-shadow]", { opacity: 0 }, { duration: 0.6, delay: 0.3 });
    await animate(
      "[data-letter]",
      { y: "-9%", rotate: -1.4 },
      { duration: 0.3, ease: [0.3, 0, 0.5, 1] },
    );
    if (!alive.current) return;
    await animate(
      "[data-letter]",
      { y: "-64%", rotate: 0.5, skewY: [0.8, 0.3, 0], scaleY: [0.992, 1] },
      { duration: 1.05, ease: friction },
    );
    if (!alive.current) return;

    // 4. El sobre sale de plano por abajo y la carta sube al centro, se endereza y crece; un
    //    destello la recorre. La solapa cae con el cuerpo: si se quedara, Safari la aplanaría
    //    al capturar el relevo y parecería un sobre cerrado.
    animate(
      "[data-body]",
      { y: 280, opacity: 0, scale: 0.94 },
      { duration: 0.8, ease: [0.55, 0, 0.85, 0.35] },
    );
    animate("[data-flap]", { y: 280, opacity: 0 }, { duration: 0.65, ease: [0.55, 0, 0.85, 0.35] });
    animate(
      "[data-letter-sheen]",
      { x: ["-160%", "160%"], opacity: [0, 1, 0] },
      { duration: 1.1, delay: 0.25, ease: "easeInOut" },
    );
    await animate(
      "[data-letter]",
      { y: "-18%", rotate: 0, scale: 1.16 },
      { duration: 0.95, ease: friction },
    );
    if (!alive.current) return;
    // Un instante de calma antes del relevo: da respiro al plano.
    await new Promise((resolve) => window.setTimeout(resolve, 160));
    if (alive.current) onOpened();
  }

  return (
    <section
      aria-labelledby="envelope-title"
      inert={!interactive}
      className="fixed inset-0 z-10 flex flex-col items-center justify-center overflow-hidden bg-[radial-gradient(120%_80%_at_50%_45%,var(--scene-2)_0%,var(--scene-3)_55%,var(--scene-4)_100%)] px-6 pt-16 pb-10"
    >
      <div aria-hidden className="paper-grain absolute inset-0" />
      {/* Foco: los bordes se oscurecen al abrir, como una cámara que se centra en la carta. */}
      <div
        ref={spotlight}
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_48%,transparent_35%,rgb(28_20_12/0.55)_100%)] opacity-0"
      />

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
            data-flap-shape={theme.flap}
            className={`relative block aspect-[10/7] ${opening ? "" : "envelope-idle"}`}
          >
            {/* Sombra proyectada en la mesa */}
            <span
              data-body
              aria-hidden
              className="absolute inset-x-[6%] -bottom-6 block h-8 rounded-[50%] bg-[#4b3a28] blur-xl"
              style={{ opacity: weight.shadow + 0.06 }}
            />

            {/* Fondo interior del sobre (visible al abrir) */}
            <span
              data-body
              aria-hidden
              className="absolute inset-0 block overflow-hidden rounded-[3px] bg-[var(--env-inside)]"
            >
              <span
                className="absolute inset-x-0 top-0 block h-[60%]"
                style={{ background: linerPattern }}
              />
            </span>

            {/* Carta: se transforma en la carta grande de la siguiente pantalla */}
            <ViewTransition name="carta" share="paper-morph" default="none">
              <m.span
                data-letter
                aria-hidden
                className="paper-grain absolute inset-x-[6%] top-[5%] z-10 block h-[88%] origin-bottom rounded-[2px] bg-paper shadow-[0_1px_3px_rgb(60_45_25/0.18)]"
              >
                {/* Destello de luz que cruza el papel al llegar al primer plano */}
                <span className="pointer-events-none absolute inset-0 block overflow-hidden rounded-[2px]">
                  <span
                    data-letter-sheen
                    className="absolute inset-y-0 left-1/4 block w-1/2 -skew-x-12 bg-[linear-gradient(90deg,transparent,rgb(255_250_235/0.75),transparent)] opacity-0"
                  />
                </span>
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
                  <span className="letterpress mt-2 block font-names text-[clamp(1.5rem,6.5vw,2.125rem)] leading-none text-ink">
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
              className="absolute inset-0 z-20 block"
              style={{
                filter: `drop-shadow(0 ${-weight.edge * 0.7}px ${weight.edge + 0.6}px rgb(80 60 35 / ${weight.shadow}))`,
              }}
            >
              <span
                className="paper-grain absolute inset-0 block"
                style={{
                  backgroundImage: paper("100deg"),
                  clipPath: `polygon(0 0, 0 100%, 50% ${POCKET_TIP}%)`,
                }}
              />
              <span
                className="paper-grain absolute inset-0 block brightness-[0.985]"
                style={{
                  backgroundImage: paper("260deg"),
                  clipPath: `polygon(100% 0, 100% 100%, 50% ${POCKET_TIP}%)`,
                }}
              />
              <span
                className="paper-grain absolute inset-0 block rounded-b-[3px]"
                style={{
                  backgroundImage: paper("0deg"),
                  clipPath: `polygon(0 100%, 100% 100%, 50% ${POCKET_BOTTOM}%)`,
                }}
              />
            </span>

            {/* Sombra de la solapa cerrada sobre el bolsillo */}
            <span
              data-flap-shadow
              aria-hidden
              className="absolute inset-x-0 top-[1.5%] z-[29] block bg-[#5a4630]/25 blur-[2px]"
              style={{ height: `${FLAP_DEPTH}%`, clipPath: flapClip }}
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
                style={{ background: linerPattern, clipPath: flapClip }}
              >
                <span
                  data-liner-shade
                  className="absolute inset-0 block bg-black opacity-0"
                  style={{ clipPath: flapClip }}
                />
              </span>
              {/* Canto del papel: una copia más oscura asoma bajo el borde según el gramaje. */}
              <span
                data-flap-outer
                className="absolute inset-0 block"
                style={{
                  background: "var(--env-edge)",
                  clipPath: flapClip,
                  transform: `translateY(${weight.edge}px)`,
                }}
              />
              <span
                data-flap-outer
                className="paper-grain absolute inset-0 block"
                style={{
                  backgroundImage: `var(--env-texture), linear-gradient(180deg, var(--env-paper-a), var(--env-paper-b))`,
                  clipPath: flapClip,
                }}
              >
                {ENVELOPES[theme.envelope].ornament ? (
                  <AlmondBranch className="absolute top-[22%] left-[55%] w-[22%] rotate-[4deg] opacity-95" />
                ) : null}
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
                  <WaxSealArt
                    monogram={event.couple.monogram}
                    shape={theme.sealShape}
                    mark={theme.sealMark}
                    className="size-full"
                  />
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
                  <WaxSealArt
                    monogram={event.couple.monogram}
                    shape={theme.sealShape}
                    mark={theme.sealMark}
                    className="size-full"
                  />
                </m.span>
                <m.span
                  data-seal-half="r"
                  className="absolute inset-0 block opacity-0"
                  style={{
                    clipPath: "polygon(52% 0, 100% 0, 100% 100%, 46% 100%, 56% 55%, 44% 30%)",
                  }}
                >
                  <WaxSealArt
                    monogram={event.couple.monogram}
                    shape={theme.sealShape}
                    mark={theme.sealMark}
                    className="size-full"
                  />
                </m.span>
                {CRUMBS.map(([, , , size], i) => (
                  <m.span
                    key={i}
                    data-crumb={i}
                    className="absolute top-1/2 left-1/2 block rounded-[40%] bg-[var(--seal)] opacity-0"
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
