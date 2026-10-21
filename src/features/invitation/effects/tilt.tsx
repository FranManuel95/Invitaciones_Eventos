"use client";

import { useMotionValue, useSpring, type MotionValue } from "motion/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";

/**
 * Inclinación compartida por toda la introducción. Mueve el paralaje de la portada, el sobre y
 * el brillo del oro. Valores normalizados entre -1 y 1, suavizados con un muelle.
 * - Android: el giroscopio (no pide permiso).
 * - iPhone: sigue al dedo. El giroscopio exige una ventana de permiso en cada visita, que
 *   interrumpía la apertura, así que no se pide nunca.
 * - Escritorio: el ratón.
 */
interface Tilt {
  x: MotionValue<number>;
  y: MotionValue<number>;
}

const TiltContext = createContext<Tilt | null>(null);

type OrientationPermission = { requestPermission?: () => Promise<"granted" | "denied"> };

export function TiltProvider({ children, disabled }: { children: ReactNode; disabled: boolean }) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 60, damping: 14 });
  const y = useSpring(rawY, { stiffness: 60, damping: 14 });
  const listening = useRef(false);

  const onOrientation = useCallback(
    (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      // gamma: izquierda/derecha (-90..90); beta: delante/detrás, con el móvil en la mano ~45°.
      rawX.set(Math.max(-1, Math.min(1, e.gamma / 25)));
      rawY.set(Math.max(-1, Math.min(1, (e.beta - 45) / 25)));
    },
    [rawX, rawY],
  );

  const listen = useCallback(() => {
    if (listening.current || disabled) return;
    listening.current = true;
    window.addEventListener("deviceorientation", onOrientation, { passive: true });
  }, [disabled, onOrientation]);

  useEffect(() => {
    if (disabled) {
      rawX.set(0);
      rawY.set(0);
      return;
    }
    // Donde el giroscopio no pide permiso (Android) se escucha directamente. En iOS, que lo
    // exige, la inclinación sigue al dedo.
    const ctor =
      typeof DeviceOrientationEvent === "undefined"
        ? null
        : (DeviceOrientationEvent as unknown as OrientationPermission);
    const needsPermission = typeof ctor?.requestPermission === "function";
    if (ctor && !needsPermission) listen();

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && !(needsPermission && e.pointerType === "touch")) return;
      rawX.set((e.clientX / window.innerWidth) * 2 - 1);
      rawY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    // Al levantar el dedo, el muelle devuelve todo al centro.
    const onRelease = (e: PointerEvent) => {
      if (e.pointerType !== "touch" || !needsPermission) return;
      rawX.set(0);
      rawY.set(0);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerup", onRelease, { passive: true });
    window.addEventListener("pointercancel", onRelease, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerup", onRelease);
      window.removeEventListener("pointercancel", onRelease);
      window.removeEventListener("deviceorientation", onOrientation);
      listening.current = false;
    };
  }, [disabled, listen, onOrientation, rawX, rawY]);

  const value = useMemo(() => ({ x, y }), [x, y]);
  return <TiltContext.Provider value={value}>{children}</TiltContext.Provider>;
}

/** Igual que useTilt, pero devuelve null fuera de la introducción (sin proveedor). */
export function useOptionalTilt() {
  return useContext(TiltContext);
}

export function useTilt() {
  const tilt = useContext(TiltContext);
  if (!tilt) throw new Error("useTilt debe usarse dentro de <TiltProvider>");
  return tilt;
}
