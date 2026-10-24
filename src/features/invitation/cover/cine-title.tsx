"use client";

import { useEffect, useRef } from "react";

/**
 * Nombres de la portada «película», como los títulos de crédito: cada letra entra desenfocada y
 * separada y se asienta en su sitio. Usa GSAP (con SplitText), que solo se descarga en esta
 * portada. Mientras tanto, y con movimiento reducido, los nombres se ven tal cual.
 */
export function CineTitle({
  first,
  second,
  animate,
}: {
  first: string;
  second: string;
  animate: boolean;
}) {
  const root = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!animate || !el) return;
    let revert: (() => void) | undefined;
    let cancelled = false;
    void Promise.all([import("gsap"), import("gsap/SplitText")]).then(
      ([{ gsap }, { SplitText }]) => {
        if (cancelled) return;
        gsap.registerPlugin(SplitText);
        const ctx = gsap.context(() => {
          const split = SplitText.create(el.querySelectorAll("[data-line]"), {
            type: "chars",
            aria: "none",
          });
          const tl = gsap.timeline({ delay: 1.6 });
          tl.from(el, { letterSpacing: "0.35em", duration: 3.2, ease: "power3.out" }, 0);
          tl.from(
            split.chars,
            {
              opacity: 0,
              filter: "blur(14px)",
              yPercent: 18,
              duration: 1.6,
              ease: "power3.out",
              stagger: { each: 0.06, from: "center" },
            },
            0,
          );
        }, el);
        revert = () => ctx.revert();
      },
    );
    return () => {
      cancelled = true;
      revert?.();
    };
  }, [animate]);

  return (
    <>
      <span className="sr-only">{second ? `${first} y ${second}` : first}</span>
      <span ref={root} aria-hidden className="block tracking-[0.04em] uppercase">
        <span data-line className="block text-[0.72em]">
          {first}
        </span>
        {second ? (
          <>
            <span className="my-[0.12em] block font-display text-[0.32em] tracking-[0.5em] text-white/70 normal-case italic">
              &amp;
            </span>
            <span data-line className="block text-[0.72em]">
              {second}
            </span>
          </>
        ) : null}
      </span>
    </>
  );
}
