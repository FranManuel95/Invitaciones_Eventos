"use client";

/**
 * Sonidos de la apertura sintetizados con Web Audio: no hay archivos de audio (ni licencias).
 * Solo suenan tras un gesto del invitado y respetan el botón de silencio.
 */

const MUTE_KEY = "invitacion:silencio";
const listeners = new Set<() => void>();
let context: AudioContext | null = null;

export function isMuted() {
  try {
    return window.localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false;
  }
}

export function setMuted(muted: boolean) {
  try {
    window.localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
  } catch {
    // Sin almacenamiento: el estado dura lo que la página.
  }
  listeners.forEach((l) => l());
}

export function subscribeMuted(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** WAV silencioso de 0,1 s generado en memoria (sin archivos). */
function silentWavUrl() {
  const samples = 800; // 8 kHz, mono, 16 bits
  const buffer = new ArrayBuffer(44 + samples * 2);
  const view = new DataView(buffer);
  const text = (offset: number, value: string) =>
    [...value].forEach((c, i) => view.setUint8(offset + i, c.charCodeAt(0)));
  text(0, "RIFF");
  view.setUint32(4, 36 + samples * 2, true);
  text(8, "WAVEfmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, 8000, true);
  view.setUint32(28, 16000, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  text(36, "data");
  view.setUint32(40, samples * 2, true);
  return URL.createObjectURL(new Blob([buffer], { type: "audio/wav" }));
}

let sessionPrimed = false;

/**
 * En iPhone, Web Audio calla si el interruptor de silencio está activado, salvo que la sesión
 * de audio sea de «reproducción». Safari 17+ lo permite directamente; en versiones anteriores,
 * reproducir un <audio> (aunque sea silencio) dentro del gesto cambia la sesión.
 */
function primeAudioSession() {
  if (sessionPrimed) return;
  sessionPrimed = true;
  const session = (navigator as unknown as { audioSession?: { type: string } }).audioSession;
  if (session) {
    try {
      session.type = "playback";
    } catch {
      // Sin API de sesión: queda el truco del <audio>.
    }
  }
  try {
    const element = new Audio(silentWavUrl());
    element.setAttribute("playsinline", "");
    void element.play().catch(() => {});
  } catch {
    // Sin <audio>: no hay nada más que hacer.
  }
}

/**
 * Crea o reanuda el contexto de audio. Llamar dentro de un gesto: en iOS solo cuentan el clic y
 * el final del toque (pointerup), no el inicio.
 */
export function unlockAudio() {
  if (isMuted() || typeof window === "undefined") return;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return;
  primeAudioSession();
  if (!context) {
    context = new Ctor();
    // iOS suspende el contexto al salir de la pestaña: se reanuda al volver.
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible" && context?.state !== "running") {
        void context?.resume();
      }
    });
  }
  if (context.state !== "running") void context.resume();
}

/** El contexto ya desbloqueado por un gesto (o null si aún no hay, o está en silencio). */
export function audioContext() {
  return isMuted() ? null : context;
}

function noiseBuffer(ctx: AudioContext, seconds: number) {
  const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * seconds), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

/** Roce de papel: ruido filtrado con una envolvente que sube y baja. */
export function playPaper(duration = 0.6, delay = 0) {
  if (!context || isMuted()) return;
  const ctx = context;
  const t = ctx.currentTime + delay;
  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer(ctx, duration);
  const band = ctx.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.setValueAtTime(1800, t);
  band.frequency.linearRampToValueAtTime(3200, t + duration);
  band.Q.value = 0.7;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.09, t + duration * 0.3);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  source.connect(band).connect(gain).connect(ctx.destination);
  source.start(t);
  source.stop(t + duration);
}

/** Crujido del lacre: chasquido seco y un golpe grave muy corto. */
export function playSealCrack() {
  if (!context || isMuted()) return;
  const ctx = context;
  const t = ctx.currentTime;
  const click = ctx.createBufferSource();
  click.buffer = noiseBuffer(ctx, 0.08);
  const high = ctx.createBiquadFilter();
  high.type = "highpass";
  high.frequency.value = 2500;
  const clickGain = ctx.createGain();
  clickGain.gain.setValueAtTime(0.25, t);
  clickGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
  click.connect(high).connect(clickGain).connect(ctx.destination);
  click.start(t);

  const thump = ctx.createOscillator();
  thump.type = "sine";
  thump.frequency.setValueAtTime(180, t);
  thump.frequency.exponentialRampToValueAtTime(60, t + 0.12);
  const thumpGain = ctx.createGain();
  thumpGain.gain.setValueAtTime(0.18, t);
  thumpGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
  thump.connect(thumpGain).connect(ctx.destination);
  thump.start(t);
  thump.stop(t + 0.15);
}

/** Vibración breve donde exista (Android). iOS no expone la API. */
export function haptic(pattern: number | number[] = 12) {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    // Sin vibración disponible.
  }
}
