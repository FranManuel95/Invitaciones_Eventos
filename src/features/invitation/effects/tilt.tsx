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
 * Inclinación compartida por toda la introducción: el giroscopio en móvil y el puntero en
 * escritorio. Mueve el paralaje de la portada, el sobre y el brillo del oro.
 * Valores normalizados entre -1 y 1, suavizados con un muelle.
 */
interface Tilt {
  x: MotionValue<number>;
  y: MotionValue<number>;
  /** Pide permiso del giroscopio (iOS) dentro de un gesto del invitado. */
  enableDeviceTilt: () => void;
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

  const enableDeviceTilt = useCallback(() => {
    if (disabled || typeof DeviceOrientationEvent === "undefined") return;
    const ctor = DeviceOrientationEvent as unknown as OrientationPermission;
    if (typeof ctor.requestPermission === "function") {
      ctor
        .requestPermission()
        .then((state) => state === "granted" && listen())
        .catch(() => {});
    } else {
      listen();
    }
  }, [disabled, listen]);

  useEffect(() => {
    if (disabled) {
      rawX.set(0);
      rawY.set(0);
      return;
    }
    // Android y escritorio no piden permiso: se escucha directamente.
    const ctor =
      typeof DeviceOrientationEvent === "undefined"
        ? null
        : (DeviceOrientationEvent as unknown as OrientationPermission);
    if (ctor && typeof ctor.requestPermission !== "function") listen();

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      rawX.set((e.clientX / window.innerWidth) * 2 - 1);
      rawY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("deviceorientation", onOrientation);
      listening.current = false;
    };
  }, [disabled, listen, onOrientation, rawX, rawY]);

  const value = useMemo(() => ({ x, y, enableDeviceTilt }), [x, y, enableDeviceTilt]);
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
