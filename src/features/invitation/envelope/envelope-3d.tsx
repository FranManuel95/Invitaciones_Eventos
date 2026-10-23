"use client";

import { Pointer } from "lucide-react";
import { useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import {
  Component,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  ViewTransition,
} from "react";
import type { GuestGroup, WeddingEvent } from "@/lib/domain/types";
import { hostNames } from "@/lib/event-kind";
import { formatLongDate } from "@/lib/format";
import { DEFAULT_THEME, WEIGHTS, type Theme } from "@/lib/theme";
import { FoilMonogram } from "../effects/foil";
import { unlockAudio } from "../effects/sound";
import { useTilt } from "../effects/tilt";
import { EnvelopeStage } from "./envelope-stage";
import type { SceneHandle } from "./three/envelope-scene";
import { useOpening } from "./use-opening";

/*
 * Apertura «sobre en 3D»: el mismo sobre del tema (papel, solapa, forro y lacre), dibujado en 3D
 * con luz y sombras reales. La escena (three.js) solo se descarga para esta apertura y mientras el
 * invitado mira la portada. Sin WebGL o con movimiento reducido se usa el sobre en la mesa.
 */

const Scene = dynamic(() => import("./three/envelope-scene"), { ssr: false });

let webglSupport: boolean | undefined;
function hasWebGL() {
  if (webglSupport === undefined) {
    try {
      const probe = document.createElement("canvas");
      webglSupport = Boolean(probe.getContext("webgl2") ?? probe.getContext("webgl"));
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}
const noopSubscribe = () => () => {};

interface OpeningProps {
  event: WeddingEvent;
  group: GuestGroup;
  onOpened: () => void;
  interactive?: boolean;
  theme?: Theme;
}

/** Si la escena 3D falla (texturas que no llegan, gráficos que se caen), se cambia de sobre. */
class SceneBoundary extends Component<{ onError: () => void; children: ReactNode }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function Envelope3D(props: OpeningProps) {
  const reduce = useReducedMotion();
  const webgl = useSyncExternalStore(noopSubscribe, hasWebGL, () => true);
  const [failed, setFailed] = useState(false);
  if (reduce || !webgl || failed) return <EnvelopeStage {...props} />;
  return <Envelope3DStage {...props} onFail={() => setFailed(true)} />;
}

function Envelope3DStage({
  event,
  group,
  onOpened,
  interactive = true,
  theme = DEFAULT_THEME,
  onFail,
}: OpeningProps & { onFail: () => void }) {
  const tilt = useTilt();
  const { opening, begin, alive } = useOpening(interactive);
  const handle = useRef<SceneHandle | null>(null);
  const pending = useRef(false);
  const proxy = useRef<HTMLDivElement>(null);
  const displayProbe = useRef<HTMLHeadingElement>(null);
  const namesProbe = useRef<HTMLSpanElement>(null);
  const [fonts, setFonts] = useState<{ display: string; names: string } | null>(null);
  const [ready, setReady] = useState(false);
  const [presented, setPresented] = useState(false);

  // Las letras de la carta y del lacre se dibujan con las fuentes del tema: se esperan.
  useEffect(() => {
    let cancelled = false;
    const display = getComputedStyle(displayProbe.current!).fontFamily;
    const names = getComputedStyle(namesProbe.current!).fontFamily;
    void Promise.all([
      document.fonts.load(`italic 40px ${display}`),
      document.fonts.load(`40px ${display}`),
      document.fonts.load(`40px ${names}`),
    ])
      .catch(() => {})
      .then(() => {
        if (!cancelled) setFonts({ display, names });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const onReady = useCallback(() => {
    setReady(true);
    if (pending.current) handle.current?.open();
  }, []);

  const onPresented = useCallback(() => {
    // La carta 3D ya está de frente: el papel de la página la sustituye y se transforma.
    setPresented(true);
    window.setTimeout(() => {
      if (alive.current) onOpened();
    }, 200);
  }, [alive, onOpened]);

  function open() {
    if (!begin()) return;
    unlockAudio();
    if (handle.current) handle.current.open();
    else pending.current = true;
  }

  const [first, second] = [event.couple.first, event.couple.second];

  return (
    <section
      aria-labelledby="envelope-title"
      inert={!interactive}
      data-opening="sobre3d"
      className="fixed inset-0 z-10 overflow-hidden bg-[radial-gradient(120%_80%_at_50%_45%,var(--scene-2)_0%,var(--scene-3)_55%,var(--scene-4)_100%)]"
    >
      <div aria-hidden className="paper-grain absolute inset-0" />
      <div
        aria-hidden
        className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
      >
        {fonts ? (
          <SceneBoundary onError={onFail}>
            <Scene
              theme={theme}
              monogram={event.couple.monogram}
              initials={[first.charAt(0), second.charAt(0)]}
              names={hostNames(event.couple)}
              date={formatLongDate(event.date)}
              fonts={fonts}
              tilt={tilt}
              pace={WEIGHTS[theme.weight].pace}
              handleRef={handle}
              proxyRef={proxy}
              onReady={onReady}
              onPresented={onPresented}
            />
          </SceneBoundary>
        ) : null}
      </div>

      <div
        className={`pointer-events-none absolute inset-x-0 top-0 flex flex-col items-center px-6 pt-[max(4.5rem,env(safe-area-inset-top))] text-center transition-opacity duration-500 ${opening ? "opacity-0" : "opacity-100"}`}
      >
        <p className="caption text-ink-soft">Una invitación para</p>
        <h1
          ref={displayProbe}
          id="envelope-title"
          tabIndex={-1}
          className="mt-1 font-display text-[clamp(2.25rem,9vw,3.25rem)] leading-tight text-ink outline-none"
        >
          {group.displayName}
        </h1>
        <span ref={namesProbe} aria-hidden className="sr-only font-names">
          {hostNames(event.couple)}
        </span>
      </div>

      {/* Tocar en cualquier parte abre el sobre. */}
      <button
        type="button"
        onClick={open}
        aria-label="Abrir el sobre"
        aria-disabled={opening}
        aria-busy={opening}
        className={`absolute inset-0 z-10 focus-visible:outline-2 focus-visible:outline-offset-[-10px] focus-visible:outline-[var(--env-seal)] ${opening ? "cursor-default" : "cursor-pointer"}`}
      />

      <p
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-center justify-center gap-2 px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))] text-[0.9375rem] text-ink-soft"
      >
        {opening ? (
          "Abriendo…"
        ) : (
          <>
            <Pointer aria-hidden className="size-4" />
            Toca el sobre para abrirlo
          </>
        )}
      </p>

      {/* La carta de papel que releva a la 3D y se transforma en la carta grande. */}
      <ViewTransition name="carta" share="paper-morph" default="none">
        <div
          ref={proxy}
          aria-hidden
          className={`paper-grain pointer-events-none absolute z-20 overflow-hidden rounded-[2px] bg-paper transition-opacity duration-200 ${presented ? "opacity-100" : "opacity-0"}`}
        >
          <div className="flex h-full flex-col items-center justify-start pt-[6%] text-center">
            <FoilMonogram
              first={first}
              second={second}
              className="size-[clamp(2rem,9vw,3rem)] text-[clamp(2rem,9vw,3rem)]"
            />
            <span className="letterpress mt-[4%] block font-names text-[clamp(1.6rem,7.5vw,2.75rem)] leading-none text-ink">
              {hostNames(event.couple)}
            </span>
            <span className="caption mt-[4%] block text-ink-soft">
              {formatLongDate(event.date)}
            </span>
          </div>
        </div>
      </ViewTransition>
    </section>
  );
}
