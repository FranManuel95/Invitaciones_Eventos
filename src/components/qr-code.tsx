"use client";

import { clsx } from "clsx";
import { forwardRef, useEffect, useState } from "react";

/** QR dibujado con React a partir de la matriz de `uqr` (se carga solo cuando hace falta). */
export const QrCode = forwardRef<
  SVGSVGElement,
  { value: string; label: string; className?: string }
>(function QrCode({ value, label, className }, ref) {
  const [matrix, setMatrix] = useState<boolean[][] | null>(null);
  useEffect(() => {
    let cancelled = false;
    void import("uqr").then(({ encode }) => {
      if (!cancelled) setMatrix(encode(value, { border: 1, ecc: "M" }).data);
    });
    return () => {
      cancelled = true;
    };
  }, [value]);

  const size = matrix?.length ?? 29;
  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={label}
      viewBox={`0 0 ${size} ${size}`}
      className={clsx("rounded-[2px] bg-paper", className)}
      shapeRendering="crispEdges"
    >
      {matrix ? (
        <>
          <rect width={size} height={size} fill="#ffffff" />
          <path
            fill="#1b1b1e"
            d={matrix
              .flatMap((row, y) => row.map((on, x) => (on ? `M${x} ${y}h1v1h-1z` : "")))
              .join("")}
          />
        </>
      ) : (
        <rect width={size} height={size} fill="var(--color-cream)" />
      )}
    </svg>
  );
});
