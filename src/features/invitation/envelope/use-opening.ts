"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Guardas comunes de las aperturas (sobre, díptico, caja): `begin` solo deja empezar una vez, de
 * forma síncrona, aunque lleguen dos toques seguidos, y `alive` dice si la pantalla sigue montada
 * para no seguir animando ni avisar después de desmontarse.
 */
export function useOpening(interactive: boolean) {
  const [opening, setOpening] = useState(false);
  const started = useRef(false);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const begin = () => {
    if (started.current || !interactive) return false;
    started.current = true;
    setOpening(true);
    return true;
  };

  return { opening, begin, alive };
}
