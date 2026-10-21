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

/** Crea o reanuda el contexto de audio. Llamar dentro del gesto (toque o clic). */
export function unlockAudio() {
  if (isMuted() || typeof window === "undefined") return;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return;
  context ??= new Ctor();
  if (context.state === "suspended") void context.resume();
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
