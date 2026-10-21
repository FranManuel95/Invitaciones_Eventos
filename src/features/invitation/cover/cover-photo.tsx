"use client";

import { m, useTransform, type MotionValue } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

function supportsWebGL() {
  try {
    return Boolean(document.createElement("canvas").getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Fotografía de portada. La imagen (next/image, prioritaria) se ve desde el primer momento y es
 * la alternativa sin WebGL o con movimiento reducido. Si hay mapa de profundidad, encima se
 * funde una versión «foto 3D» en WebGL (ver depth-shader.ts) que solo se descarga aquí.
 */
export function CoverPhoto({
  src,
  depthSrc,
  cinematic,
  lift,
  tiltX,
  tiltY,
}: {
  src: string;
  depthSrc: string | null;
  /** false con movimiento reducido: solo la foto, sin lienzo. */
  cinematic: boolean;
  lift: MotionValue<number>;
  tiltX: MotionValue<number>;
  tiltY: MotionValue<number>;
}) {
  const y = useTransform(() => -lift.get() * 0.3 + tiltY.get() * -10);
  const x = useTransform(() => tiltX.get() * -16);
  const canvasHost = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = canvasHost.current;
    if (!cinematic || !depthSrc || !host || !supportsWebGL()) return;
    let cancelled = false;
    let destroy = () => {};
    void import("./depth-shader")
      .then(({ createDepthScene }) => createDepthScene(host, src, depthSrc))
      .then((scene) => {
        if (cancelled) return scene.destroy();
        const update = () =>
          scene.setOffset(
            tiltX.get() * -0.022,
            tiltY.get() * 0.018 + (lift.get() / window.innerHeight) * -0.05,
          );
        const stops = [tiltX, tiltY, lift].map((v) => v.on("change", update));
        update();
        destroy = () => {
          stops.forEach((stop) => stop());
          scene.destroy();
        };
        setReady(true);
      })
      // Sin WebGL (o si falla la carga) se queda la foto: no hay nada que avisar.
      .catch(() => {});
    return () => {
      cancelled = true;
      destroy();
    };
  }, [cinematic, depthSrc, src, lift, tiltX, tiltY]);

  return (
    <>
      <m.div aria-hidden className="absolute inset-0 scale-[1.08]" style={{ x, y }}>
        <Image src={src} alt="" fill priority sizes="100vw" className="object-cover" />
      </m.div>
      <div
        ref={canvasHost}
        aria-hidden
        className="absolute inset-0 transition-opacity duration-[1.4s] ease-out"
        style={{ opacity: ready ? 1 : 0 }}
      />
    </>
  );
}
