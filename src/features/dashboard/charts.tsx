"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { DailyPoint } from "@/lib/stats";

const shortDate = (iso: string) =>
  new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "2-digit", timeZone: "UTC" }).format(
    new Date(iso),
  );
const longDate = (iso: string) =>
  new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", timeZone: "UTC" }).format(
    new Date(iso),
  );

function niceMax(value: number) {
  if (value <= 10) return 10;
  const step = 10 ** Math.floor(Math.log10(value));
  return Math.ceil(value / (step / 2)) * (step / 2);
}

/**
 * Línea de confirmaciones acumuladas. Una sola serie (el título la nombra, sin leyenda),
 * cruz + tooltip al pasar el puntero o con las flechas del teclado, y tabla alternativa.
 */
export function ConfirmationsChart({ points, goal }: { points: DailyPoint[]; goal: number }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  // Se mide el contenedor antes de dibujar: un ancho fijo inicial ensancharía la rejilla en móvil.
  const [width, setWidth] = useState(0);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => entry && setWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const height = 210;
  const m = { top: 12, right: 12, bottom: 26, left: 34 };
  const innerW = Math.max(10, width - m.left - m.right);
  const innerH = height - m.top - m.bottom;
  const max = niceMax(Math.max(goal, ...points.map((p) => p.total)));
  const x = (i: number) => m.left + (points.length > 1 ? (i / (points.length - 1)) * innerW : 0);
  const y = (v: number) => m.top + innerH - (v / max) * innerH;

  const line = points
    .map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(p.total).toFixed(1)}`)
    .join("");
  const area = `${line}L${x(points.length - 1)} ${y(0)}L${x(0)} ${y(0)}Z`;
  const ticks = [0, max / 2, max];
  const labelEvery = Math.ceil(points.length / Math.max(2, Math.floor(innerW / 70)));

  const handleMove = (e: PointerEvent<SVGSVGElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    const rel = (e.clientX - box.left - m.left) / innerW;
    setActive(Math.max(0, Math.min(points.length - 1, Math.round(rel * (points.length - 1)))));
  };
  const handleKey = (e: KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    setActive((i) => {
      const current = i ?? points.length - 1;
      return Math.max(0, Math.min(points.length - 1, current + (e.key === "ArrowRight" ? 1 : -1)));
    });
  };

  const last = points.at(-1);
  const point = active !== null ? points[active] : undefined;

  return (
    <div>
      <div
        ref={wrapRef}
        className="relative rounded-md focus-visible:outline-2"
        tabIndex={0}
        role="img"
        aria-label={`Confirmaciones acumuladas: ${last?.total ?? 0} personas a ${last ? longDate(last.date) : ""}. Usa las flechas para recorrer los días.`}
        onKeyDown={handleKey}
        onBlur={() => setActive(null)}
      >
        <svg
          width={width}
          height={height}
          visibility={width ? "visible" : "hidden"}
          className="block overflow-visible"
          onPointerMove={handleMove}
          onPointerLeave={() => setActive(null)}
        >
          {ticks.map((t) => (
            <g key={t}>
              <line
                x1={m.left}
                x2={m.left + innerW}
                y1={y(t)}
                y2={y(t)}
                stroke="#1e2a28"
                strokeOpacity={0.08}
              />
              <text
                x={m.left - 8}
                y={y(t)}
                dy="0.32em"
                textAnchor="end"
                className="fill-muted text-[10px] tabular-nums"
              >
                {t}
              </text>
            </g>
          ))}
          {points.map((p, i) =>
            i % labelEvery === 0 ? (
              <text
                key={p.date}
                x={x(i)}
                y={height - 6}
                textAnchor="middle"
                className="fill-muted text-[10px] tabular-nums"
              >
                {shortDate(p.date)}
              </text>
            ) : null,
          )}
          <path d={area} fill="#1e2a28" fillOpacity={0.06} />
          <path
            d={line}
            fill="none"
            stroke="#1e2a28"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {last ? (
            <circle
              cx={x(points.length - 1)}
              cy={y(last.total)}
              r={4}
              fill="#1e2a28"
              stroke="#fbf8f2"
              strokeWidth={2}
            />
          ) : null}
          {point && active !== null ? (
            <g pointerEvents="none">
              <line
                x1={x(active)}
                x2={x(active)}
                y1={m.top}
                y2={m.top + innerH}
                stroke="#1e2a28"
                strokeOpacity={0.35}
                strokeDasharray="3 3"
              />
              <circle
                cx={x(active)}
                cy={y(point.total)}
                r={5}
                fill="#1e2a28"
                stroke="#fbf8f2"
                strokeWidth={2}
              />
            </g>
          ) : null}
          {/* Zona de captura mayor que la línea */}
          <rect x={m.left} y={m.top} width={innerW} height={innerH} fill="transparent" />
        </svg>
        {point && active !== null ? (
          <div
            role="status"
            className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 rounded-md bg-ink px-2.5 py-1.5 text-xs whitespace-nowrap text-paper shadow-lg"
            style={{ left: Math.min(Math.max(x(active), 70), width - 70) }}
          >
            <span className="block text-paper/70">{longDate(point.date)}</span>
            <span className="font-semibold tabular-nums">{point.total} confirmados</span>
          </div>
        ) : null}
      </div>
      <details className="mt-3 text-xs text-muted">
        <summary className="cursor-pointer select-none hover:text-ink">Ver como tabla</summary>
        <div className="mt-2 max-h-48 overflow-y-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="py-1 font-medium">Día</th>
                <th className="py-1 text-right font-medium">Confirmados (acumulado)</th>
              </tr>
            </thead>
            <tbody>
              {points.map((p) => (
                <tr key={p.date} className="border-t border-line">
                  <td className="py-1">{longDate(p.date)}</td>
                  <td className="py-1 text-right text-ink tabular-nums">{p.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}

export interface DonutDatum {
  id: string;
  label: string;
  value: number;
  color: string;
}

/** Anillo de reparto con leyenda etiquetada (valor y porcentaje) y resaltado al pasar el puntero. */
export function DonutChart({ data, centerLabel }: { data: DonutDatum[]; centerLabel: string }) {
  const [hover, setHover] = useState<string | null>(null);
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = 44;
  const c = 2 * Math.PI * r;
  const gap = 2;
  const lengths = data.map((d) => (total ? (d.value / total) * c : 0));
  const offsets = lengths.map((_, i) => lengths.slice(0, i).reduce((s, l) => s + l, 0));
  const focused = data.find((d) => d.id === hover);

  return (
    <div className="@container">
      <div className="flex flex-col items-center gap-6 @[26rem]:flex-row">
        <div className="relative size-40 shrink-0">
          <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden>
            <circle
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke="#1e2a28"
              strokeOpacity={0.06}
              strokeWidth={10}
            />
            {data.map((d, i) => {
              const len = lengths[i]!;
              return (
                <circle
                  key={d.id}
                  cx="50"
                  cy="50"
                  r={r}
                  fill="none"
                  stroke={d.color}
                  strokeWidth={hover === d.id ? 12 : 10}
                  strokeDasharray={`${Math.max(0, len - gap)} ${c}`}
                  strokeDashoffset={-offsets[i]!}
                  opacity={hover && hover !== d.id ? 0.35 : 1}
                  className="transition-[opacity,stroke-width] duration-200"
                  onPointerEnter={() => setHover(d.id)}
                  onPointerLeave={() => setHover(null)}
                />
              );
            })}
          </svg>
          <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
            <div>
              <p className="font-display text-4xl leading-none text-ink lining-nums tabular-nums">
                {focused ? focused.value : total}
              </p>
              <p className="mt-1 text-[0.6875rem] text-muted">
                {focused ? focused.label : centerLabel}
              </p>
            </div>
          </div>
        </div>
        <ul className="w-full min-w-0 space-y-1.5 text-sm">
          {data.map((d) => (
            <li
              key={d.id}
              onPointerEnter={() => setHover(d.id)}
              onPointerLeave={() => setHover(null)}
              className="flex items-center gap-2.5 rounded-md px-2 py-1 hover:bg-ink/[0.03]"
            >
              <span
                aria-hidden
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: d.color }}
              />
              <span className="flex-1 text-ink-soft">{d.label}</span>
              <span className="font-semibold text-ink tabular-nums">{d.value}</span>
              <span className="w-10 text-right text-xs text-muted tabular-nums">
                {total ? Math.round((d.value / total) * 100) : 0}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
