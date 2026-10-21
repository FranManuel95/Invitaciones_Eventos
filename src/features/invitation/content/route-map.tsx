"use client";

import { m, useReducedMotion } from "motion/react";
import { useId } from "react";

const ROUTE = "M140 120C210 120 220 190 300 190S400 150 470 165";

/**
 * Plano ilustrado del trayecto iglesia → finca (orientativo, no a escala). Al llegar, el
 * camino se dibuja y un autobús lo recorre una y otra vez (SMIL animateMotion, sin JavaScript
 * por fotograma). Con «reducir movimiento» se ve el camino completo y sin autobús.
 */
export function RouteMap({ from, to }: { from: string; to: string }) {
  const reduce = useReducedMotion();
  const uid = useId().replace(/:/g, "");
  const routeId = `ruta-${uid}`;
  const maskId = `trazo-${uid}`;

  return (
    <figure className="overflow-hidden rounded-[2px] border border-line bg-paper">
      <svg
        viewBox="0 0 640 260"
        role="img"
        aria-labelledby="route-map-title"
        className="block h-auto w-full"
      >
        <title id="route-map-title">{`Plano orientativo: de ${from} a ${to}, unos 8 minutos en coche`}</title>
        <defs>
          <path id={routeId} d={ROUTE} />
          {/* El camino punteado se descubre con una máscara que se va dibujando. */}
          <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="640" height="260">
            <m.path
              d={ROUTE}
              fill="none"
              stroke="#fff"
              strokeWidth="14"
              strokeLinecap="round"
              initial={{ pathLength: reduce ? 1 : 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1.6, ease: [0.45, 0, 0.2, 1], delay: 0.2 }}
            />
          </mask>
        </defs>
        <rect width="640" height="260" fill="#f3efe5" />
        <g stroke="#e2dccd" strokeWidth="1">
          {Array.from({ length: 9 }, (_, i) => (
            <path key={`v${i}`} d={`M${i * 80} 0V260`} />
          ))}
          {Array.from({ length: 4 }, (_, i) => (
            <path key={`h${i}`} d={`M0 ${i * 80}H640`} />
          ))}
        </g>
        {/* Casco urbano */}
        <g fill="#e6dfcf">
          <rect x="70" y="70" width="46" height="30" />
          <rect x="124" y="64" width="38" height="40" />
          <rect x="84" y="108" width="70" height="26" />
          <rect x="164" y="112" width="30" height="22" />
        </g>
        {/* Olivares y almendros de la finca */}
        <g fill="#c9cfae">
          {Array.from({ length: 24 }, (_, i) => (
            <circle key={i} cx={430 + (i % 6) * 22} cy={150 + Math.floor(i / 6) * 20} r="5" />
          ))}
        </g>
        <path
          d={ROUTE}
          fill="none"
          stroke="#a3874e"
          strokeWidth="2.5"
          strokeDasharray="1 7"
          strokeLinecap="round"
          mask={`url(#${maskId})`}
        />
        {reduce ? null : (
          <g aria-hidden>
            {/* Autobús: sale de la iglesia, llega a la finca, se para y vuelve a empezar. */}
            <g>
              <rect x="-13" y="-8" width="26" height="14" rx="3" fill="#6b1e2a" />
              <rect x="-10" y="-5.5" width="6" height="4.5" rx="1" fill="#faf8f3" />
              <rect x="-2.5" y="-5.5" width="6" height="4.5" rx="1" fill="#faf8f3" />
              <rect x="5" y="-5.5" width="5.5" height="4.5" rx="1" fill="#faf8f3" />
              <circle cx="-7" cy="6.5" r="2.4" fill="#23271e" />
              <circle cx="7" cy="6.5" r="2.4" fill="#23271e" />
              <animateMotion
                dur="7s"
                begin="1.8s"
                repeatCount="indefinite"
                rotate="auto"
                keyPoints="0;1;1"
                keyTimes="0;0.7;1"
                calcMode="linear"
                fill="freeze"
              >
                <mpath href={`#${routeId}`} />
              </animateMotion>
            </g>
          </g>
        )}
        <g transform="translate(140 120)">
          <circle r="9" fill="#23271e" />
          <circle r="3" fill="#faf8f3" />
        </g>
        <g transform="translate(470 165)">
          <circle r="9" fill="#6b1e2a" />
          <circle r="3" fill="#faf8f3" />
        </g>
        <g fontFamily="var(--font-display)" fontSize="22" fill="#23271e">
          <text x="140" y="96" textAnchor="middle">
            {from}
          </text>
          <text x="470" y="140" textAnchor="middle">
            {to}
          </text>
          <text x="300" y="222" textAnchor="middle" fontStyle="italic" fill="#5c5e53" fontSize="19">
            8 min en coche
          </text>
        </g>
      </svg>
    </figure>
  );
}
