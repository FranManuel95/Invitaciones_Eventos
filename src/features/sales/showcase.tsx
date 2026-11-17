import { clsx } from "clsx";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { FEATURED_TEMPLATE_IDS, TEMPLATES } from "@/lib/theme";
import { COVER_IDS, COVERS } from "@/lib/theme/cover";
import { FILMS, OPENINGS, SHOWN_OPENING_IDS } from "@/lib/theme/envelope";
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
      {SHOWN_OPENING_IDS.map((id) => {
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
 * Las plantillas, cada una con su portada en el móvil y, asomando delante, lo que se abre
 * después (un sobre, una caja o un díptico). En el móvil se deslizan de lado; en pantallas anchas
 * van de cinco en cinco.
 */
export function TemplateShowcase() {
  return (
    <ul className="-mx-6 flex snap-x snap-mandatory scroll-px-6 gap-6 overflow-x-auto px-6 pt-2 pb-6 sm:-mx-10 sm:scroll-px-10 sm:px-10 lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-x-7 lg:gap-y-14 lg:overflow-visible lg:px-0 lg:pb-0">
      {FEATURED_TEMPLATE_IDS.map((id) => {
        const template = TEMPLATES[id];
        const film = template.look.film ? FILMS[template.look.film] : null;
        return (
          <li key={id} className="relative w-[13.5rem] shrink-0 snap-start lg:w-auto">
            <div className="relative pr-5 pb-7">
              <PhoneFrame>
                <Image
                  src={`/venta/plantilla-${id}-portada.webp`}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 18vw, 216px"
                  className="object-cover"
                />
              </PhoneFrame>
              <span className="absolute right-0 bottom-0 block aspect-[4/5] w-[46%] overflow-hidden rounded-[3px] border-[3px] border-paper shadow-[var(--shadow-lift)]">
                <Image
                  src={`/venta/plantilla-${id}.webp`}
                  alt=""
                  fill
                  sizes="110px"
                  className="object-cover object-[50%_42%]"
                />
              </span>
            </div>
            <h3 className="mt-4 font-display text-[1.625rem] leading-tight text-ink">
              <Link
                href={`${DEMO}?plantilla=${id}`}
                className={`${coverLink} decoration-gold underline-offset-4 hover:underline`}
              >
                {template.label}
              </Link>
            </h3>
            <p className="mt-1 text-[0.875rem] leading-snug text-ink-soft">
              {template.description}
            </p>
            {film ? (
              <p className="mt-2 text-[0.8125rem] leading-snug text-muted">
                Se abre con: {film.label.toLowerCase()}.
              </p>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Una fila de capturas de la invitación dentro de móviles, cada una con su explicación. En el
 * móvil se desliza de lado. `numbered`: solo cuando el contenido es una secuencia de pasos.
 */
export function PhoneStrip({
  items,
  numbered = false,
  label,
}: {
  /** Nombre de la tira: en el móvil se desliza de lado y debe poder recorrerse con el teclado. */
  label: string;
  items: { src: string; title: string; text: string }[];
  numbered?: boolean;
}) {
  const List = numbered ? "ol" : "ul";
  return (
    <List
      tabIndex={0}
      aria-label={label}
      className="-mx-6 flex snap-x snap-mandatory scroll-px-6 gap-6 overflow-x-auto px-6 pt-2 pb-6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold sm:-mx-10 sm:scroll-px-10 sm:px-10 lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-7 lg:overflow-visible lg:px-0 lg:pb-0"
    >
      {items.map((item, i) => (
        <li key={item.src} className="w-[13.5rem] shrink-0 snap-start lg:w-auto">
          <PhoneFrame>
            <Image
              src={item.src}
              alt=""
              fill
              sizes="(min-width: 1024px) 18vw, 216px"
              className="object-cover object-top"
            />
          </PhoneFrame>
          <h3 className="mt-4 font-display text-[1.375rem] leading-tight text-ink">
            {numbered ? (
              <span aria-hidden className="mr-2 text-gold">
                {i + 1}
              </span>
            ) : null}
            {item.title}
          </h3>
          <p className="mt-1 text-[0.875rem] leading-snug text-ink-soft">{item.text}</p>
        </li>
      ))}
    </List>
  );
}

/** Una captura del editor o del panel en su marco, con su pie. */
export function ScreenShot({
  src,
  alt,
  caption,
  sizes = "(min-width: 1152px) 1072px, 100vw",
}: {
  src: string;
  alt: string;
  caption?: string;
  sizes?: string;
}) {
  return (
    <figure>
      <div className="overflow-hidden rounded-[10px] border border-line shadow-[var(--shadow-lift)]">
        <Image
          src={src}
          width={1280}
          height={800}
          sizes={sizes}
          alt={alt}
          className="h-auto w-full"
        />
      </div>
      {caption ? (
        <figcaption className="mt-3 text-[0.875rem] leading-snug text-ink-soft">
          {caption}
        </figcaption>
      ) : null}
    </figure>
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
