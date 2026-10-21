"use client";

import { audioContext } from "./sound";

/**
 * Música ambiente generada en el navegador (Web Audio): una progresión lenta de piano
 * (Fa maj7 · La m7 · Re m9 · Do maj7) sobre un colchón de cuerdas, con reverberación hecha con
 * ruido. No hay archivos de audio ni licencias. Entra en 3 s y sale con un fundido.
 */

const CHORDS = [
  [53, 57, 60, 64, 69], // Fa maj7 (Fa La Do Mi + La)
  [57, 60, 64, 67, 72], // La m7
  [50, 57, 62, 65, 64], // Re m9 (Re La Re Fa Mi)
  [48, 55, 59, 64, 67], // Do maj7
];
const CHORD_SECONDS = 4.2;
const midi = (n: number) => 440 * 2 ** ((n - 69) / 12);

let state: {
  master: GainNode;
  timer: number;
  next: number;
  index: number;
  nodes: Set<AudioScheduledSourceNode>;
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
    strings(ctx, state.master, chord[0]! - 12, at);
    strings(ctx, state.master, chord[2]!, at);
    // Arpegio suave con un pequeño rubato.
    chord.forEach((note, i) =>
      piano(ctx, state!.master, note, at + i * 0.38 + (i % 2) * 0.03, 1 - i * 0.12),
    );
    state.index += 1;
    state.next += CHORD_SECONDS;
  }
}

export function startAmbient() {
  const ctx = audioContext();
  if (!ctx || state) return;
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
  state = { master, timer: 0, next: ctx.currentTime + 0.1, index: 0, nodes: new Set() };
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
      current.master.disconnect();
    },
    (fadeSeconds + 0.2) * 1000,
  );
}

export const isAmbientPlaying = () => state !== null;
