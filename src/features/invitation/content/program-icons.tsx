"use client";

import { m } from "motion/react";

/*
 * Iconos del programa con una microanimación que se reproduce una vez al llegar a ellos:
 * los anillos se juntan, la copa brinda, el plato humea y las notas saltan.
 * MotionConfig reducedMotion="user" (experience.tsx) los deja quietos si se pide.
 */

const view = { once: true, amount: 0.9 } as const;
const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function Rings() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
      <m.circle
        cx="9"
        cy="13"
        r="5"
        {...stroke}
        initial={{ x: -4 }}
        whileInView={{ x: 0 }}
        viewport={view}
        transition={{ type: "spring", stiffness: 120, damping: 9, delay: 0.15 }}
      />
      <m.circle
        cx="15"
        cy="13"
        r="5"
        {...stroke}
        initial={{ x: 4 }}
        whileInView={{ x: 0 }}
        viewport={view}
        transition={{ type: "spring", stiffness: 120, damping: 9, delay: 0.15 }}
      />
      <path d="M13.5 5.5l1.5-2 1.5 2" {...stroke} />
    </svg>
  );
}

function Glass() {
  return (
    <m.svg
      viewBox="0 0 24 24"
      className="size-6"
      aria-hidden
      style={{ originX: "50%", originY: "90%" }}
      initial={{ rotate: 0 }}
      whileInView={{ rotate: [0, -14, 9, -4, 0] }}
      viewport={view}
      transition={{ duration: 0.9, delay: 0.2 }}
    >
      <path d="M6 4h12l-1 4a5 5 0 0 1-10 0L6 4z" {...stroke} />
      <path d="M12 13v6M8.5 20h7" {...stroke} />
      <m.circle
        cx="17.5"
        cy="3"
        r="0.9"
        fill="currentColor"
        initial={{ opacity: 0, y: 2 }}
        whileInView={{ opacity: [0, 1, 0], y: -3 }}
        viewport={view}
        transition={{ duration: 0.9, delay: 0.45 }}
      />
    </m.svg>
  );
}

function Plate() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
      <ellipse cx="12" cy="18" rx="8" ry="2.5" {...stroke} />
      <path d="M6.5 17.2a5.5 5.5 0 0 1 11 0" {...stroke} />
      {[9, 12, 15].map((x, i) => (
        <m.path
          key={x}
          d={`M${x} 10c-1-1.2 1-2.2 0-3.6S${x + 1} 4.2 ${x} 3`}
          {...stroke}
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: [0, 1, 0.7] }}
          viewport={view}
          transition={{ duration: 1.2, delay: 0.2 + i * 0.18 }}
        />
      ))}
    </svg>
  );
}

function Notes() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
      {[
        { d: "M7 17V7l6-2v10", cx: 5.5, cy: 17, cx2: 11.5, cy2: 15, delay: 0.15 },
        { d: "M17 13V5", cx: 15.5, cy: 13, delay: 0.35 },
      ].map((n, i) => (
        <m.g
          key={i}
          initial={{ y: 0 }}
          whileInView={{ y: [0, -3, 0, -2, 0] }}
          viewport={view}
          transition={{ duration: 1, delay: n.delay }}
        >
          <path d={n.d} {...stroke} />
          <circle cx={n.cx} cy={n.cy} r="1.6" fill="currentColor" />
          {n.cx2 ? <circle cx={n.cx2} cy={n.cy2} r="1.6" fill="currentColor" /> : null}
        </m.g>
      ))}
    </svg>
  );
}

const ICONS: Record<string, () => React.JSX.Element> = {
  ceremonia: Rings,
  coctel: Glass,
  banquete: Plate,
  fiesta: Notes,
};

export function ProgramIcon({ id }: { id: string }) {
  const Icon = ICONS[id];
  return Icon ? <Icon /> : <span className="size-2 rounded-full bg-current" />;
}
