import { useId } from "react";
import { sealOutline, type SealMarkId, type SealShapeId } from "@/lib/theme/envelope";

/*
 * Ornamentos de la papelería. El motivo es el almendro de la finca: ramas con almendras
 * verdes (mayo) y la flor de almendro, blanca con el corazón rosado.
 */

/** Monograma de la pareja: iniciales en Bodoni cursiva entrelazadas dentro de un aro fino. */
export function Monogram({
  first,
  second,
  className,
}: {
  first: string;
  second: string;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className={className}>
      <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth="0.6" />
      <circle cx="32" cy="32" r="27.5" fill="none" stroke="currentColor" strokeWidth="0.3" />
      <text
        x="24.5"
        y="36"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontStyle="italic"
        fontSize="21"
        fill="currentColor"
      >
        {first.charAt(0)}
      </text>
      <text
        x="40"
        y="45"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontStyle="italic"
        fontSize="21"
        fill="currentColor"
      >
        {second.charAt(0)}
      </text>
    </svg>
  );
}

/** Rama de almendro con almendras verdes. */
export function AlmondBranch({ className }: { className?: string }) {
  const leaves = [
    [16, 72, -36, 24],
    [28, 61, 30, 22],
    [40, 52, -44, 26],
    [52, 43, 24, 24],
    [60, 32, -50, 22],
    [72, 26, 14, 24],
    [78, 15, -38, 20],
  ] as const;
  return (
    <svg viewBox="0 0 100 90" aria-hidden className={className}>
      <path
        d="M6 86C24 70 44 52 60 36S84 10 94 4"
        fill="none"
        stroke="#5f6648"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {leaves.map(([x, y, r, len], i) => (
        <path
          key={i}
          d={`M0 0C${len * 0.3} -4.5 ${len * 0.75} -4 ${len} 0C${len * 0.75} 4 ${len * 0.3} 4.5 0 0Z`}
          transform={`translate(${x} ${y}) rotate(${r})`}
          fill={i % 2 ? "#8a956c" : "#717d56"}
        />
      ))}
      {/* Almendras: óvalos aterciopelados con un brillo suave */}
      {[
        [44, 60, -20],
        [66, 41, 15],
      ].map(([x, y, r]) => (
        <g key={x} transform={`translate(${x} ${y}) rotate(${r})`}>
          <ellipse rx="4.2" ry="6" fill="#a3ad7e" />
          <ellipse cx="-1.2" cy="-1.6" rx="1.4" ry="2.4" fill="#d3d9b4" opacity=".7" />
        </g>
      ))}
    </svg>
  );
}

/** Ramillete de flor de almendro para las esquinas de la carta. */
export function BlossomCorner({ className }: { className?: string }) {
  const id = useId();
  const flower = (cx: number, cy: number, s: number, rot: number) => (
    <g transform={`translate(${cx} ${cy}) rotate(${rot}) scale(${s})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse
          key={a}
          cx="0"
          cy="-10.5"
          rx="7.5"
          ry="11"
          transform={`rotate(${a})`}
          fill={`url(#${id}-petal)`}
        />
      ))}
      <circle r="3.6" fill="#b0566c" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <circle key={a} cx="0" cy="-5" r="0.9" fill="#e9c37a" transform={`rotate(${a})`} />
      ))}
    </g>
  );
  return (
    <svg viewBox="0 0 160 160" aria-hidden className={className}>
      <defs>
        <radialGradient id={`${id}-petal`} cx="50%" cy="90%" r="85%">
          <stop offset="0" stopColor="#d79aa6" />
          <stop offset="0.35" stopColor="#f0d9da" />
          <stop offset="1" stopColor="#fdf9f6" />
        </radialGradient>
      </defs>
      <g fill="none" stroke="#5b4a3f" strokeWidth="1.6" strokeLinecap="round">
        <path d="M0 150C40 120 70 90 92 50" />
        <path d="M10 160C50 140 90 120 140 108" strokeWidth="1.2" />
      </g>
      {[
        [30, 128, -30],
        [60, 140, 60],
        [118, 114, -20],
      ].map(([x, y, r], i) => (
        <path
          key={i}
          d="M0 0C8-6 20-6 26 0C20 6 8 6 0 0Z"
          transform={`translate(${x} ${y}) rotate(${r})`}
          fill={i % 2 ? "#8a956c" : "#717d56"}
        />
      ))}
      {flower(88, 60, 1.25, 10)}
      {flower(122, 100, 0.95, 40)}
      {flower(58, 112, 0.8, -15)}
      <ellipse cx="104" cy="38" rx="3" ry="4" fill="#efd2d4" />
      <ellipse cx="141" cy="84" rx="2.4" ry="3.2" fill="#efd2d4" />
    </svg>
  );
}

/** Sello de lacre burdeos: borde irregular, relieve y monograma en oro. */
/** Estrella de ocho puntas para el lacre. */
const STAR = Array.from({ length: 16 }, (_, i) => {
  const angle = (i / 16) * Math.PI * 2 - Math.PI / 2;
  const r = i % 2 ? 6 : 15;
  return `${(50 + Math.cos(angle) * r).toFixed(1)},${(50 + Math.sin(angle) * r).toFixed(1)}`;
}).join(" ");

/** Marca grabada en la cera: iniciales, rama, corazón o estrella, en oro. */
function SealMark({ mark, monogram, fill }: { mark: SealMarkId; monogram: string; fill: string }) {
  switch (mark) {
    case "monograma":
      return (
        <text
          x="50"
          y="57.5"
          textAnchor="middle"
          fontFamily="var(--font-display)"
          fontStyle="italic"
          fontSize="21"
          fill={fill}
        >
          {monogram}
        </text>
      );
    case "almendro":
      return (
        <g fill={fill}>
          <path d="M36 64 Q50 52 64 36" fill="none" stroke={fill} strokeWidth="1.6" />
          <ellipse cx="44" cy="52" rx="6" ry="2.4" transform="rotate(-62 44 52)" />
          <ellipse cx="55" cy="49" rx="6" ry="2.4" transform="rotate(20 55 49)" />
          <ellipse cx="52" cy="40" rx="5.5" ry="2.2" transform="rotate(-70 52 40)" />
          <circle cx="62" cy="38" r="3" />
          <circle cx="40" cy="61" r="2.4" />
        </g>
      );
    case "corazon":
      return (
        <path
          d="M50 64C37 55 33 45 38.5 39.5 42.5 35.5 48 37 50 41.5 52 37 57.5 35.5 61.5 39.5 67 45 63 55 50 64Z"
          fill={fill}
        />
      );
    case "estrella":
      return <polygon points={STAR} fill={fill} />;
  }
}

export function WaxSealArt({
  monogram,
  className,
  shape = "cera",
  mark = "monograma",
}: {
  monogram: string;
  className?: string;
  shape?: SealShapeId;
  mark?: SealMarkId;
}) {
  const id = useId();
  // Contorno: cera derramada (irregular), círculo limpio o flor de ocho pétalos.
  const lobes = sealOutline(shape);
  return (
    <svg viewBox="0 0 100 100" aria-hidden className={className}>
      <defs>
        <radialGradient id={`${id}-wax`} cx="38%" cy="32%" r="75%">
          <stop offset="0" style={{ stopColor: "color-mix(in srgb, var(--seal), white 22%)" }} />
          <stop offset="0.5" style={{ stopColor: "var(--seal)" }} />
          <stop offset="1" style={{ stopColor: "color-mix(in srgb, var(--seal), black 42%)" }} />
        </radialGradient>
        <radialGradient id={`${id}-inner`} cx="60%" cy="65%" r="70%">
          <stop offset="0" style={{ stopColor: "color-mix(in srgb, var(--seal), white 8%)" }} />
          <stop offset="1" style={{ stopColor: "color-mix(in srgb, var(--seal), black 24%)" }} />
        </radialGradient>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f1dca2" />
          <stop offset="0.5" stopColor="#c9a65d" />
          <stop offset="1" stopColor="#9c7a3c" />
        </linearGradient>
      </defs>
      <polygon points={lobes} fill={`url(#${id}-wax)`} />
      <circle cx="50" cy="50" r="33" fill={`url(#${id}-inner)`} />
      <circle
        cx="50"
        cy="50"
        r="33"
        fill="none"
        style={{ stroke: "color-mix(in srgb, var(--seal), white 38%)" }}
        strokeOpacity=".5"
        strokeWidth="1.2"
      />
      <circle
        cx="50"
        cy="50"
        r="28.5"
        fill="none"
        stroke={`url(#${id}-gold)`}
        strokeOpacity=".7"
        strokeWidth=".7"
      />
      <SealMark mark={mark} monogram={monogram} fill={`url(#${id}-gold)`} />
      <ellipse
        cx="34"
        cy="28"
        rx="12"
        ry="5"
        transform="rotate(-30 34 28)"
        fill="#fff"
        opacity=".12"
      />
    </svg>
  );
}
