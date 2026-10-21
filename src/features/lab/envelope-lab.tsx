"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRef, useState, useSyncExternalStore } from "react";
import { buttonClasses } from "@/components/ui/button";
import type { SceneControls } from "./envelope-scene";

// three y la escena solo se descargan en esta ruta, nunca en la invitación.
const EnvelopeScene = dynamic(() => import("./envelope-scene"), {
  ssr: false,
  loading: () => <p className="grid h-full place-items-center text-muted">Cargando la escena…</p>,
});

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

const noop = () => () => {};
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function EnvelopeLab({
  names,
  date,
  place,
}: {
  names: string;
  date: string;
  place: string;
}) {
  const webgl = useSyncExternalStore(noop, supportsWebGL, () => true);
  const reduce = useSyncExternalStore(noop, reducedMotion, () => false);
  const controls = useRef<SceneControls | null>(null);
  const fpsRef = useRef<HTMLSpanElement>(null);
  const [state, setState] = useState<"closed" | "opening" | "open">("closed");

  if (!webgl || reduce) {
    return (
      <div className="grid min-h-[60dvh] place-items-center rounded-md border border-line bg-paper p-8 text-center">
        <div className="max-w-[42ch]">
          <p className="font-display text-[1.75rem] leading-tight text-ink">
            {webgl
              ? "Tienes activado «reducir movimiento»"
              : "Este navegador no puede mostrar gráficos 3D"}
          </p>
          <p className="mt-3 text-muted">
            La invitación usa el sobre CSS, que funciona en cualquier navegador y respeta esta
            preferencia.
          </p>
          <Link href="/i/familia-garcia" className={`${buttonClasses("primary", "lg")} mt-6`}>
            Ver la invitación
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="relative h-[min(70dvh,40rem)] overflow-hidden rounded-md border border-line">
        <EnvelopeScene
          controlsRef={controls}
          names={names}
          date={date}
          place={place}
          onOpened={() => setState("open")}
          onFps={(fps) => {
            if (fpsRef.current) fpsRef.current.textContent = String(fps);
          }}
        />
        <p className="pointer-events-none absolute top-3 right-3 rounded-full bg-paper/85 px-3 py-1 text-[0.8125rem] text-ink-soft tabular-nums">
          <span ref={fpsRef}>–</span> fps
        </p>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          className={buttonClasses("primary", "lg")}
          disabled={state === "opening"}
          onClick={() => {
            if (state === "open") {
              controls.current?.reset();
              setState("closed");
            } else {
              controls.current?.open();
              setState("opening");
            }
          }}
        >
          {state === "open"
            ? "Volver a cerrar"
            : state === "opening"
              ? "Abriendo…"
              : "Abrir el sobre"}
        </button>
        <p role="status" className="text-[0.9375rem] text-muted">
          {state === "open" ? `La carta de ${names} está fuera del sobre.` : ""}
        </p>
      </div>
    </div>
  );
}
