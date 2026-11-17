"use client";

import { m } from "motion/react";

/**
 * Texto que aparece letra a letra, de desenfocado a nítido, como los créditos de una película.
 * Los lectores de pantalla leen el texto completo (sr-only); las letras sueltas van ocultas.
 */
export function SplitText({
  text,
  delay = 0,
  stagger = 0.045,
  animate = true,
  className,
}: {
  text: string;
  delay?: number;
  stagger?: number;
  /** false con movimiento reducido: el texto aparece tal cual. */
  animate?: boolean;
  className?: string;
}) {
  // Con o sin movimiento, el mismo HTML: el servidor no sabe si se pide movimiento reducido y un
  // HTML distinto en el cliente obliga a React a montar la página entera de nuevo.
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {Array.from(text).map((char, i) => (
          <m.span
            key={i}
            className="inline-block whitespace-pre"
            initial={animate ? { opacity: 0, y: "0.18em", filter: "blur(10px)" } : false}
            animate={{ opacity: 1, y: "0em", filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: delay + i * stagger, ease: [0.22, 1, 0.36, 1] }}
          >
            {char}
          </m.span>
        ))}
      </span>
    </span>
  );
}
