import { clsx } from "clsx";
import { useId } from "react";

/** Ornamento geométrico usado como emblema (portada del sobre, cabeceras). */
export function Emblem({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden className={className}>
      <g stroke="currentColor" strokeWidth="1">
        <rect x="11" y="11" width="18" height="18" transform="rotate(45 20 20)" />
        <rect x="14" y="14" width="12" height="12" />
        <circle cx="20" cy="20" r="3" />
        <path d="M20 4v6M20 30v6M4 20h6M30 20h6" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** Separador fino con un rombo central. */
export function Divider({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 8" aria-hidden className={clsx("h-2 w-28", className)}>
      <path d="M0 4h52M68 4h52" stroke="currentColor" strokeWidth="0.75" />
      <path d="M60 0.5 63.5 4 60 7.5 56.5 4Z" fill="currentColor" />
    </svg>
  );
}

/** Rama de olivo dibujada a mano (decoración del sobre y de la tarjeta). */
export function OliveSprig({ className }: { className?: string }) {
  const leaves = [
    [18, 70, -38],
    [30, 60, 28],
    [36, 50, -42],
    [50, 42, 22],
    [54, 31, -48],
    [68, 25, 14],
    [72, 14, -40],
    [84, 10, 6],
  ] as const;
  return (
    <svg viewBox="0 0 100 90" aria-hidden className={className}>
      <path
        d="M6 86C24 70 44 52 60 36S84 10 94 4"
        fill="none"
        stroke="#6f7a5f"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {leaves.map(([x, y, r], i) => (
        <path
          key={i}
          d="M0 0C6-5 16-5 22 0C16 5 6 5 0 0Z"
          transform={`translate(${x} ${y}) rotate(${r})`}
          fill={i % 2 ? "#8d9a7a" : "#7a8868"}
          opacity={0.92}
        />
      ))}
      <circle cx="44" cy="58" r="2.6" fill="#4f5a44" />
      <circle cx="63" cy="40" r="2.2" fill="#56614a" />
    </svg>
  );
}

/** Ramillete floral (esquinas de la tarjeta). Flores de cinco pétalos y hojas largas. */
export function FloralCorner({ className }: { className?: string }) {
  const id = useId();
  const flower = (cx: number, cy: number, s: number, rot: number) => (
    <g transform={`translate(${cx} ${cy}) rotate(${rot}) scale(${s})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse
          key={a}
          cx="0"
          cy="-11"
          rx="8"
          ry="12"
          transform={`rotate(${a})`}
          fill={`url(#${id}-petal)`}
        />
      ))}
      <circle r="4" fill="#c79c74" />
      <circle r="1.6" fill="#8a5c3e" />
    </g>
  );
  return (
    <svg viewBox="0 0 160 160" aria-hidden className={className}>
      <defs>
        <radialGradient id={`${id}-petal`} cx="50%" cy="85%" r="80%">
          <stop offset="0" stopColor="#b9858a" />
          <stop offset="0.55" stopColor="#dcb3b2" />
          <stop offset="1" stopColor="#f3e2dc" />
        </radialGradient>
      </defs>
      <g fill="none" stroke="#7b876a" strokeWidth="1.2" strokeLinecap="round">
        <path d="M0 150C40 120 70 90 92 50" />
        <path d="M10 160C50 140 90 120 140 108" />
      </g>
      {[
        [30, 128, -30],
        [52, 104, 20],
        [70, 82, -35],
        [60, 140, 60],
        [96, 126, 10],
        [118, 114, -20],
      ].map(([x, y, r], i) => (
        <path
          key={i}
          d="M0 0C8-7 22-7 30 0C22 7 8 7 0 0Z"
          transform={`translate(${x} ${y}) rotate(${r})`}
          fill={i % 2 ? "#97a386" : "#7f8c6f"}
        />
      ))}
      {flower(88, 60, 1.25, 10)}
      {flower(122, 100, 0.95, 40)}
      {flower(58, 112, 0.8, -15)}
      <circle cx="104" cy="40" r="3" fill="#e8cfc7" />
      <circle cx="140" cy="84" r="2.5" fill="#e8cfc7" />
    </svg>
  );
}

/** Sello de lacre en SVG: borde irregular, relieve y monograma. */
export function WaxSealArt({ monogram, className }: { monogram: string; className?: string }) {
  const id = useId();
  // Borde irregular: 18 lóbulos con radios ligeramente distintos.
  const lobes = Array.from({ length: 36 }, (_, i) => {
    const angle = (i / 36) * Math.PI * 2;
    const r = i % 2 ? 46 : 48.5 + ((i * 7) % 5) * 0.4;
    return `${(50 + Math.cos(angle) * r).toFixed(2)},${(50 + Math.sin(angle) * r).toFixed(2)}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 100 100" aria-hidden className={className}>
      <defs>
        <radialGradient id={`${id}-wax`} cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#b5583a" />
          <stop offset="0.5" stopColor="#8a3a24" />
          <stop offset="1" stopColor="#5a2113" />
        </radialGradient>
        <radialGradient id={`${id}-inner`} cx="60%" cy="65%" r="70%">
          <stop offset="0" stopColor="#9a4429" />
          <stop offset="1" stopColor="#6c2918" />
        </radialGradient>
      </defs>
      <polygon points={lobes} fill={`url(#${id}-wax)`} />
      <circle cx="50" cy="50" r="33" fill={`url(#${id}-inner)`} />
      <circle
        cx="50"
        cy="50"
        r="33"
        fill="none"
        stroke="#c9774f"
        strokeOpacity=".55"
        strokeWidth="1.2"
      />
      <circle
        cx="50"
        cy="50"
        r="28.5"
        fill="none"
        stroke="#4b1a0e"
        strokeOpacity=".5"
        strokeWidth=".8"
      />
      <text
        x="50"
        y="57"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontStyle="italic"
        fontSize="22"
        fill="#e7a983"
        fillOpacity=".9"
        style={{ letterSpacing: "-0.5px" }}
      >
        {monogram}
      </text>
      <ellipse
        cx="34"
        cy="28"
        rx="12"
        ry="5"
        transform="rotate(-30 34 28)"
        fill="#fff"
        opacity=".13"
      />
    </svg>
  );
}
