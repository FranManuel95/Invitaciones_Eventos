"use client";

import { m, useTransform, type MotionValue } from "motion/react";
import Image from "next/image";

/**
 * Fotografía de portada con el mismo paralaje que el paisaje ilustrado: al levantar la hoja
 * la foto se queda algo atrás y la inclinación la desplaza un poco. Va algo ampliada para que
 * los desplazamientos nunca dejen ver el borde.
 */
export function CoverPhoto({
  src,
  lift,
  tiltX,
  tiltY,
}: {
  src: string;
  lift: MotionValue<number>;
  tiltX: MotionValue<number>;
  tiltY: MotionValue<number>;
}) {
  const y = useTransform(() => -lift.get() * 0.3 + tiltY.get() * -10);
  const x = useTransform(() => tiltX.get() * -16);
  return (
    <m.div aria-hidden className="absolute inset-0 scale-[1.08]" style={{ x, y }}>
      <Image src={src} alt="" fill priority sizes="100vw" className="object-cover" />
    </m.div>
  );
}
