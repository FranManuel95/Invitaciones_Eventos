"use client";

import type { MusicId } from "@/lib/theme/music";
import { audioContext } from "./sound";

/**
 * Música ambiente generada en el navegador (Web Audio) sobre la progresión lenta
 * Fa maj7 · La m7 · Re m9 · Do maj7, con reverberación hecha con ruido. Cuatro estilos: piano
 * con cuerdas, caja de música, guitarra punteada y solo cuerdas. No hay archivos de audio ni
 * licencias. Con «propia» suena la canción que ha subido la pareja. Entra en 3 s y sale con un
 * fundido.
 */

const CHORDS = [
  [53, 57, 60, 64, 69], // Fa maj7 (Fa La Do Mi + La)
  [57, 60, 64, 67, 72], // La m7
  [50, 57, 62, 65, 64], // Re m9 (Re La Re Fa Mi)
  [48, 55, 59, 64, 67], // Do maj7
];
const CHORD_SECONDS = 4.2;
const midi = (n: number) => 440 * 2 ** ((n - 69) / 12);

type Generated = Exclude<MusicId, "propia">;

let state: {
  master: GainNode;
  timer: number;
  next: number;
  index: number;
  style: Generated;
  nodes: Set<AudioScheduledSourceNode>;
  /** Canción propia (en vez de música generada). */
  audio?: HTMLAudioElement;
} | null = null;

function reverb(ctx: AudioContext) {
  const seconds = 3.2;
  const length = Math.floor(ctx.sampleRate * seconds);
  const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const data = impulse.getChannelData(c);
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 2.6;
  }
  const node = ctx.createConvolver();
  node.buffer = impulse;
  return node;
}

/** Nota de «piano»: dos parciales con ataque rápido y caída larga. */
function piano(ctx: AudioContext, out: AudioNode, note: number, at: number, velocity: number) {
  if (!state) return;
  for (const [ratio, level, type] of [
    [1, 1, "triangle"],
    [2, 0.25, "sine"],
  ] as const) {
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = midi(note) * ratio;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(0.06 * velocity * level, at + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 3.6);
    osc.connect(gain).connect(out);
    osc.start(at);
    osc.stop(at + 3.7);
    state.nodes.add(osc);
    osc.onended = () => state?.nodes.delete(osc);
  }
}

/** Nota de caja de música: seno brillante con un parcial metálico y caída corta. */
function musicBox(ctx: AudioContext, out: AudioNode, note: number, at: number, velocity: number) {
  if (!state) return;
  for (const [ratio, level] of [
    [1, 1],
    [3.01, 0.18],
    [5.4, 0.05],
  ] as const) {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = midi(note) * ratio;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(0.05 * velocity * level, at + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 1.8 / ratio ** 0.3);
    osc.connect(gain).connect(out);
    osc.start(at);
    osc.stop(at + 2);
    state.nodes.add(osc);
    osc.onended = () => state?.nodes.delete(osc);
  }
}

/** Cuerda pulsada de guitarra: triángulo con un filtro que se cierra deprisa, como el nailon. */
function pluck(ctx: AudioContext, out: AudioNode, note: number, at: number, velocity: number) {
  if (!state) return;
  const osc = ctx.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.value = midi(note);
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.Q.value = 0.7;
  filter.frequency.setValueAtTime(3200, at);
  filter.frequency.exponentialRampToValueAtTime(420, at + 0.35);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(0.045 * velocity, at + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + 2.2);
  osc.connect(filter).connect(gain).connect(out);
  osc.start(at);
  osc.stop(at + 2.3);
  state.nodes.add(osc);
  osc.onended = () => state?.nodes.delete(osc);
}

/** Cuerdas: dos sierras ligeramente desafinadas, filtradas y con ataque lento. */
function strings(ctx: AudioContext, out: AudioNode, note: number, at: number) {
  if (!state) return;
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 850;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.linearRampToValueAtTime(0.018, at + 1.6);
  gain.gain.linearRampToValueAtTime(0.0001, at + CHORD_SECONDS + 0.8);
  filter.connect(gain).connect(out);
  for (const detune of [-7, 7]) {
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = midi(note);
    osc.detune.value = detune;
    osc.connect(filter);
    osc.start(at);
    osc.stop(at + CHORD_SECONDS + 0.9);
    state.nodes.add(osc);
    osc.onended = () => state?.nodes.delete(osc);
  }
}

function schedule(ctx: AudioContext) {
  if (!state) return;
  // Programa los acordes con antelación: el temporizador puede retrasarse sin que se note.
  while (state.next < ctx.currentTime + 1.5) {
    const chord = CHORDS[state.index % CHORDS.length]!;
    const at = state.next;
    const out = state.master;
    switch (state.style) {
      case "piano":
        strings(ctx, out, chord[0]! - 12, at);
        strings(ctx, out, chord[2]!, at);
        // Arpegio suave con un pequeño rubato.
        chord.forEach((note, i) =>
          piano(ctx, out, note, at + i * 0.38 + (i % 2) * 0.03, 1 - i * 0.12),
        );
        break;
      case "cajita":
        // Dos octavas arriba, subiendo y bajando: el giro de una cajita de música.
        [...chord, ...chord.slice(1, -1).reverse()].forEach((note, i) =>
          musicBox(ctx, out, note + 24, at + i * 0.26, 0.9 - (i % 4) * 0.12),
        );
        break;
      case "guitarra":
        // Punteo: bajo y tres cuerdas que se repiten (p-i-m-a), dos veces por acorde.
        for (let rep = 0; rep < 2; rep++) {
          const base = at + rep * (CHORD_SECONDS / 2);
          pluck(ctx, out, chord[0]! - 12, base, 1);
          [chord[2]!, chord[3]!, chord[4]!, chord[3]!].forEach((note, i) =>
            pluck(ctx, out, note, base + 0.35 + i * 0.35, 0.75),
          );
        }
        break;
      case "cuerdas":
        strings(ctx, out, chord[0]! - 12, at);
        chord.slice(1, 4).forEach((note) => strings(ctx, out, note, at));
        break;
    }
    state.index += 1;
    state.next += CHORD_SECONDS;
  }
}

let waiting = false;

/**
 * Arranca la música de la apertura. `song` es la canción propia (si el estilo es «propia»); sin
 * ella se usa el piano.
 */
export function startAmbient(style: MusicId = "piano", song?: string | null) {
  const ctx = audioContext();
  if (!ctx || state || waiting) return;
  // En iOS el contexto puede tardar un instante en pasar a «running» tras el gesto.
  if (ctx.state !== "running") {
    waiting = true;
    void ctx
      .resume()
      .then(() => {
        waiting = false;
        if (ctx.state === "running") startAmbient(style, song);
      })
      .catch(() => {
        waiting = false;
      });
    return;
  }
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, ctx.currentTime);
  master.gain.exponentialRampToValueAtTime(0.9, ctx.currentTime + 3);
  const wet = ctx.createGain();
  wet.gain.value = 0.55;
  const dry = ctx.createGain();
  dry.gain.value = 0.7;
  const room = reverb(ctx);
  master.connect(dry).connect(ctx.destination);
  master.connect(room).connect(wet).connect(ctx.destination);
  if (style === "propia" && song) {
    // La canción pasa por el mismo volumen general: entra y sale con fundido (en iOS el volumen
    // del elemento <audio> no se puede cambiar, pero el de Web Audio sí).
    wet.gain.value = 0; // la canción ya trae su propia sala: sin reverberación añadida
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audio.src = song;
    audio.loop = true;
    ctx.createMediaElementSource(audio).connect(master);
    state = { master, timer: 0, next: 0, index: 0, style: "piano", nodes: new Set(), audio };
    void audio.play().catch(() => {});
    return;
  }
  const generated: Generated = style === "propia" ? "piano" : style;
  state = {
    master,
    timer: 0,
    next: ctx.currentTime + 0.1,
    index: 0,
    style: generated,
    nodes: new Set(),
  };
  schedule(ctx);
  state.timer = window.setInterval(() => schedule(ctx), 500);
}

export function stopAmbient(fadeSeconds = 2.5) {
  const current = state;
  if (!current) return;
  state = null;
  window.clearInterval(current.timer);
  const now = current.master.context.currentTime;
  current.master.gain.cancelScheduledValues(now);
  current.master.gain.setValueAtTime(Math.max(current.master.gain.value, 0.0001), now);
  current.master.gain.exponentialRampToValueAtTime(0.0001, now + fadeSeconds);
  window.setTimeout(
    () => {
      current.nodes.forEach((n) => {
        try {
          n.stop();
        } catch {
          // Ya parado.
        }
      });
      current.audio?.pause();
      current.master.disconnect();
    },
    (fadeSeconds + 0.2) * 1000,
  );
}

export const isAmbientPlaying = () => state !== null;
