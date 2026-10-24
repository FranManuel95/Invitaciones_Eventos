import { clsx } from "clsx";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { TEMPLATE_IDS, TEMPLATES } from "@/lib/theme";
import { COVER_IDS, COVERS } from "@/lib/theme/cover";
import { OPENING_IDS, OPENINGS } from "@/lib/theme/envelope";
import { OpeningReel } from "./opening-reel";

/*
 * Galerías de la página de venta y de /ejemplos con imágenes y grabaciones reales de la
 * invitación de ejemplo (se regeneran con scripts/capturas-venta.mjs). Cada pieza es un enlace
 * a esa misma variante abierta a pantalla completa.
 */

const DEMO = "/i/familia-garcia";

/** Un móvil con la proporción de un iPhone; el contenido llena la pantalla. */
export function PhoneFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={clsx(
        "relative aspect-[390/844] overflow-hidden rounded-[1.6rem] border-[5px] border-ink bg-ink shadow-[var(--shadow-lift)]",
        className,
      )}
    >
      <div className="absolute inset-0 overflow-hidden rounded-[1.25rem]">{children}</div>
    </div>
  );
}

/** Enlace que cubre toda la pieza: el móvil y el texto se pueden pulsar. */
const coverLink =
  "after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-[1.6rem] focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-gold";

export function PremiumBadge() {
  return (
    <span className="ml-2 inline-block rounded-full border border-wax/30 bg-wax/[0.07] px-2 py-0.5 align-[0.2em] font-sans text-[0.75rem] leading-none text-wax">
      Premium
    </span>
  );
}

/**
 * Las aperturas en marcha, como sobres sobre una mesa. En el móvil se desliza de lado; en
 * pantallas anchas caben todas en una fila, alternando la altura.
 */
export function OpeningShowcase({ className }: { className?: string }) {
  return (
    <ul
      className={clsx(
        "flex snap-x snap-mandatory scroll-px-6 gap-5 overflow-x-auto px-6 pt-2 pb-8 sm:scroll-px-10 sm:px-10 lg:grid lg:grid-cols-7 lg:gap-6 lg:overflow-visible lg:pb-14",
        className,
      )}
    >
      {OPENING_IDS.map((id) => {
        const opening = OPENINGS[id];
        return (
          <li key={id} className="relative w-[11.5rem] shrink-0 snap-start lg:w-auto lg:even:mt-14">
            <PhoneFrame>
              <OpeningReel id={id} label={opening.label} />
            </PhoneFrame>
            <h3 className="mt-4 font-display text-[1.3125rem] leading-tight text-ink">
              <Link
                href={`${DEMO}?apertura=${id}`}
                className={`${coverLink} decoration-gold underline-offset-4 hover:underline`}
              >
                {opening.label}
                {opening.premium ? <PremiumBadge /> : null}
              </Link>
            </h3>
            <p className="mt-1 text-[0.875rem] leading-snug text-ink-soft">{opening.description}</p>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Las plantillas, por el sobre con el que llegan (es lo que más cambia entre una y otra). La
 * primera va en grande: con las otras doce, la rejilla de dos o de cuatro columnas queda completa.
 */
export function TemplateShowcase() {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-4 sm:gap-x-6">
      {TEMPLATE_IDS.map((id, i) => {
        const template = TEMPLATES[id];
        const featured = i === 0;
        return (
          <li
            key={id}
            className={clsx("relative flex flex-col", featured && "col-span-2 sm:row-span-2")}
          >
            <span
              className={clsx(
                "relative block overflow-hidden rounded-[3px] bg-ivory shadow-[var(--shadow-paper)]",
                featured ? "aspect-[4/5] sm:aspect-auto sm:min-h-0 sm:flex-1" : "aspect-[4/5]",
              )}
            >
              <Image
                src={`/venta/plantilla-${id}.webp`}
                alt=""
                fill
                sizes={
                  featured ? "(min-width: 640px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"
                }
                className="object-cover object-[50%_38%]"
              />
            </span>
            <h3
              className={clsx(
                "mt-3 font-display leading-tight text-ink",
                featured ? "text-[1.75rem]" : "text-[1.3125rem]",
              )}
            >
              <Link
                href={`${DEMO}?plantilla=${id}`}
                className={`${coverLink} decoration-gold underline-offset-4 hover:underline focus-visible:after:rounded-[3px]`}
              >
                {template.label}
              </Link>
            </h3>
            <p className="mt-0.5 text-[0.875rem] leading-snug text-ink-soft">
              {template.description}
            </p>
          </li>
        );
      })}
    </ul>
  );
}

/** Los fondos de la portada. «Vuestro vídeo» necesita un vídeo de la pareja: aquí no se enseña. */
export function CoverShowcase() {
  return (
    <ul className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
      {COVER_IDS.filter((id) => id !== "video").map((id) => (
        <li key={id} className="relative">
          <PhoneFrame>
            <Image
              src={`/venta/portada-${id}.webp`}
              alt=""
              fill
              sizes="(min-width: 1024px) 15vw, (min-width: 640px) 30vw, 45vw"
              className="object-cover"
            />
          </PhoneFrame>
          <h3 className="mt-4 font-display text-[1.3125rem] leading-tight text-ink">
            <Link
              href={`${DEMO}?portada=${id}`}
              className={`${coverLink} decoration-gold underline-offset-4 hover:underline`}
            >
              {COVERS[id].label}
            </Link>
          </h3>
          <p className="mt-1 text-[0.875rem] leading-snug text-ink-soft">
            {COVERS[id].description}
          </p>
        </li>
      ))}
    </ul>
  );
}
