"use client";

import { m, useTransform, type MotionValue } from "motion/react";
import { useId, type ReactNode } from "react";

/**
 * Paisaje al atardecer (colinas, cipreses y una masía) dibujado en SVG y separado en capas.
 * Cada capa es un SVG propio dentro de un div: al desplazarlas, el navegador mueve mapas de
 * bits ya pintados (composición en GPU) en lugar de volver a dibujar el SVG en cada fotograma.
 * Sustituye a la fotografía de portada mientras no haya una con derechos de uso.
 */

function cypress(x: number, base: number, h: number, w: number) {
  return `M${x} ${base}C${x - w} ${base - h * 0.28} ${x - w * 0.55} ${base - h * 0.82} ${x} ${base - h}C${x + w * 0.55} ${base - h * 0.82} ${x + w} ${base - h * 0.28} ${x} ${base}Z`;
}

const FAR_CYPRESSES: [number, number, number][] = [
  [598, 652, 30],
  [612, 650, 38],
  [626, 649, 26],
  [785, 655, 34],
  [798, 657, 28],
  [438, 666, 24],
];

const NEAR_CYPRESSES: [number, number, number][] = [
  [180, 760, 110],
  [206, 756, 84],
  [232, 754, 120],
  [1010, 742, 96],
  [1036, 740, 130],
  [1062, 744, 88],
];

function LayerSvg({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 1200 1000"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      className="size-full"
    >
      {children}
    </svg>
  );
}

/** Capas de fondo a primer plano. `depth` indica cuánto se mueven (0 = horizonte, 1 = primer plano). */
function useLayers(): { depth: number; content: ReactNode }[] {
  const id = useId();
  const g = (name: string) => `${id}-${name}`;
  return [
    {
      depth: 0.12,
      content: (
        <LayerSvg>
          <defs>
            <linearGradient id={g("sky")} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#2f3547" />
              <stop offset="0.28" stopColor="#5d5465" />
              <stop offset="0.46" stopColor="#a87a72" />
              <stop offset="0.58" stopColor="#e2a77c" />
              <stop offset="0.66" stopColor="#f3cf9f" />
            </linearGradient>
            <radialGradient id={g("sun")} cx="640" cy="590" r="420" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#fff1d2" stopOpacity="0.95" />
              <stop offset="0.12" stopColor="#ffd9a0" stopOpacity="0.7" />
              <stop offset="0.45" stopColor="#f0a874" stopOpacity="0.22" />
              <stop offset="1" stopColor="#f0a874" stopOpacity="0" />
            </radialGradient>
            <radialGradient id={g("cloud")} cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#f7c9a8" stopOpacity="0.45" />
              <stop offset="1" stopColor="#f7c9a8" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="1200" height="1000" fill={`url(#${g("sky")})`} />
          <rect width="1200" height="1000" fill={`url(#${g("sun")})`} />
          <circle cx="640" cy="590" r="46" fill="#fff4dc" opacity="0.92" />
          {/* Nubes alargadas, sin filtros de desenfoque para no penalizar el rendimiento. */}
          <ellipse cx="300" cy="420" rx="320" ry="26" fill={`url(#${g("cloud")})`} />
          <ellipse cx="920" cy="470" rx="280" ry="20" fill={`url(#${g("cloud")})`} />
          <ellipse cx="760" cy="380" rx="200" ry="14" fill={`url(#${g("cloud")})`} opacity="0.7" />
        </LayerSvg>
      ),
    },
    {
      depth: 0.3,
      content: (
        <LayerSvg>
          <defs>
            <linearGradient id={g("mist")} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f6dcc0" stopOpacity="0" />
              <stop offset="0.5" stopColor="#f6dcc0" stopOpacity="0.38" />
              <stop offset="1" stopColor="#f6dcc0" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 606C150 572 262 594 382 580S620 556 760 574 1000 562 1200 584V1000H0Z"
            fill="#c49a84"
            opacity="0.9"
          />
          <path
            d="M0 640C120 612 240 628 360 618S560 594 700 614 960 632 1200 604V1000H0Z"
            fill="#a07a73"
          />
          <rect y="585" width="1200" height="110" fill={`url(#${g("mist")})`} />
        </LayerSvg>
      ),
    },
    {
      depth: 0.5,
      content: (
        <LayerSvg>
          <path
            d="M0 700C160 662 300 652 460 668S690 640 820 656 1050 690 1200 672V1000H0Z"
            fill="#76595c"
          />
          <g fill="#4d3b42">
            <rect x="676" y="626" width="74" height="26" />
            <rect x="740" y="606" width="16" height="46" />
            <path d="M672 627 713 612 754 627Z" />
            <path d="M737 607 748 598 759 607Z" />
            <rect x="652" y="636" width="26" height="16" />
            <path d="M649 637 665 629 681 637Z" />
          </g>
          <g fill="#f6c98f">
            <rect x="688" y="636" width="3" height="5" />
            <rect x="700" y="636" width="3" height="5" />
            <rect x="724" y="636" width="3" height="5" />
            <rect x="746" y="616" width="3" height="5" />
            <rect x="662" y="642" width="3" height="4" />
          </g>
          <g fill="#3c2f36">
            {FAR_CYPRESSES.map(([x, b, h]) => (
              <path key={`f${x}`} d={cypress(x, b, h, 6)} />
            ))}
          </g>
        </LayerSvg>
      ),
    },
    {
      depth: 0.78,
      content: (
        <LayerSvg>
          <defs>
            <linearGradient id={g("near")} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#58444a" />
              <stop offset="1" stopColor="#2e252b" />
            </linearGradient>
          </defs>
          <path
            d="M0 784C200 734 380 748 560 762S860 722 1000 736 1150 760 1200 752V1100H0Z"
            fill={`url(#${g("near")})`}
          />
          <g stroke="#6a545a" strokeOpacity="0.45" strokeWidth="2" fill="none">
            {Array.from({ length: 9 }, (_, i) => (
              <path
                key={i}
                d={`M${300 + i * 70} 1000C${420 + i * 45} 880 ${520 + i * 25} 800 ${600 + i * 8} 760`}
              />
            ))}
          </g>
          <path
            d="M560 1000C600 900 640 820 700 740 720 700 712 676 708 656"
            fill="none"
            stroke="#d9b48e"
            strokeOpacity="0.35"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <g fill="#1f191f">
            {NEAR_CYPRESSES.map(([x, b, h]) => (
              <path key={`n${x}`} d={cypress(x, b, h, 16)} />
            ))}
          </g>
        </LayerSvg>
      ),
    },
    {
      depth: 1,
      content: (
        <LayerSvg>
          <defs>
            <linearGradient id={g("front")} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#30262c" />
              <stop offset="1" stopColor="#15111a" />
            </linearGradient>
          </defs>
          <path
            d="M0 870C240 826 480 850 700 840S1050 812 1200 842V1100H0Z"
            fill={`url(#${g("front")})`}
          />
        </LayerSvg>
      ),
    },
  ];
}

function Layer({
  depth,
  lift,
  tiltX,
  tiltY,
  children,
}: {
  depth: number;
  lift: MotionValue<number>;
  tiltX: MotionValue<number>;
  tiltY: MotionValue<number>;
  children: ReactNode;
}) {
  // Al levantar la portada, las capas lejanas se quedan atrás (se mueven menos que el dedo)
  // y la inclinación desplaza más las capas cercanas: paralaje en dos ejes.
  const y = useTransform(() => -lift.get() * (1 - depth) * 0.55 + tiltY.get() * depth * -14);
  const x = useTransform(() => tiltX.get() * depth * -22);
  return (
    <m.div aria-hidden className="absolute -inset-x-[4%] -inset-y-[6%]" style={{ x, y }}>
      {children}
    </m.div>
  );
}

/**
 * @param lift Píxeles que la portada ha subido (negativo hacia arriba).
 */
export function Landscape({
  lift,
  tiltX,
  tiltY,
}: {
  lift: MotionValue<number>;
  tiltX: MotionValue<number>;
  tiltY: MotionValue<number>;
}) {
  const layers = useLayers();
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#2f3547]">
      {layers.map((layer) => (
        <Layer key={layer.depth} depth={layer.depth} lift={lift} tiltX={tiltX} tiltY={tiltY}>
          {layer.content}
        </Layer>
      ))}
    </div>
  );
}
