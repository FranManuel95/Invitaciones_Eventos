import { mix, sealDroplets, sealOutline, type LinerId, type SealMarkId } from "@/lib/theme";
import type { SealShapeId } from "@/lib/theme";

/*
 * Dibujos del sobre 3D en un canvas: la cara del lacre (con su marca en oro), el forro, la carta y
 * el recorte de la solapa. Se dibujan con las mismas formas que el sobre CSS, así que el lacre, la
 * solapa y el forro elegidos en el editor se ven igual en las dos versiones.
 */

function canvas(width: number, height = width) {
  const el = document.createElement("canvas");
  el.width = width;
  el.height = height;
  return [el, el.getContext("2d")!] as const;
}

/** Estrella de ocho puntas (la misma que la del lacre en SVG). */
function star(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 ? 6 : 15;
    ctx.lineTo(50 + Math.cos(a) * r, 50 + Math.sin(a) * r);
  }
  ctx.closePath();
  ctx.fill();
}

function almond(ctx: CanvasRenderingContext2D, paint: string) {
  ctx.strokeStyle = paint;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(36, 64);
  ctx.quadraticCurveTo(50, 52, 64, 36);
  ctx.stroke();
  const leaves: [number, number, number, number, number][] = [
    [44, 52, 6, 2.4, -62],
    [55, 49, 6, 2.4, 20],
    [52, 40, 5.5, 2.2, -70],
  ];
  for (const [cx, cy, rx, ry, rot] of leaves) {
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, (rot * Math.PI) / 180, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(62, 38, 3, 0, Math.PI * 2);
  ctx.arc(40, 61, 2.4, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Cara del lacre en un lienzo 100 × 100 escalado: cera con relieve de luz, aro dorado y la marca.
 * Con `metal`, dibuja solo el oro en blanco sobre negro (mapa de metal y de relieve).
 */
function drawSeal(
  ctx: CanvasRenderingContext2D,
  size: number,
  opts: { wax: string; shape: SealShapeId; mark: SealMarkId; monogram: string; font: string },
  metal: boolean,
) {
  const { wax, shape, mark, monogram, font } = opts;
  ctx.save();
  ctx.scale(size / 100, size / 100);
  // Fondo: el borde y los costados de la cera, algo más oscuros.
  ctx.fillStyle = metal ? "#000" : mix(wax, "#000000", 0.3);
  ctx.fillRect(0, 0, 100, 100);
  if (!metal) {
    const outer = ctx.createRadialGradient(38, 32, 2, 50, 50, 75);
    outer.addColorStop(0, mix(wax, "#ffffff", 0.22));
    outer.addColorStop(0.5, wax);
    outer.addColorStop(1, mix(wax, "#000000", 0.42));
    ctx.fillStyle = outer;
    ctx.beginPath();
    for (const pair of sealOutline(shape).split(" ")) {
      const [x, y] = pair.split(",").map(Number) as [number, number];
      ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    if (shape === "goteo") {
      for (const [cx, cy, r] of sealDroplets()) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    const inner = ctx.createRadialGradient(60, 65, 1, 60, 65, 50);
    inner.addColorStop(0, mix(wax, "#ffffff", 0.08));
    inner.addColorStop(1, mix(wax, "#000000", 0.24));
    ctx.fillStyle = inner;
    ctx.beginPath();
    ctx.arc(50, 50, 33, 0, Math.PI * 2);
    ctx.fill();
  }
  let paint: string | CanvasGradient = "#fff";
  if (!metal) {
    const gold = ctx.createLinearGradient(0, 0, 100, 100);
    gold.addColorStop(0, "#f1dca2");
    gold.addColorStop(0.5, "#c9a65d");
    gold.addColorStop(1, "#9c7a3c");
    paint = gold;
  }
  ctx.strokeStyle = paint;
  ctx.fillStyle = paint;
  ctx.lineWidth = 0.9;
  ctx.globalAlpha = metal ? 0.8 : 0.75;
  ctx.beginPath();
  ctx.arc(50, 50, 28.5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;
  switch (mark) {
    case "monograma":
      ctx.font = `italic 21px ${font}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      ctx.fillText(monogram, 50, 57.5);
      break;
    case "almendro":
      almond(ctx, metal ? "#fff" : "#c9a65d");
      break;
    case "corazon":
      ctx.fill(
        new Path2D(
          "M50 64C37 55 33 45 38.5 39.5 42.5 35.5 48 37 50 41.5 52 37 57.5 35.5 61.5 39.5 67 45 63 55 50 64Z",
        ),
      );
      break;
    case "estrella":
      star(ctx);
      break;
  }
  ctx.restore();
}

export function sealCanvases(opts: {
  wax: string;
  shape: SealShapeId;
  mark: SealMarkId;
  monogram: string;
  font: string;
}) {
  const size = 512;
  const [color, colorCtx] = canvas(size);
  drawSeal(colorCtx, size, opts, false);
  const [metal, metalCtx] = canvas(size);
  drawSeal(metalCtx, size, opts, true);
  // Relieve: la cera abombada hacia el centro, el sello hundido y la marca en alto.
  const [relief, reliefCtx] = canvas(size);
  reliefCtx.save();
  reliefCtx.scale(size / 100, size / 100);
  reliefCtx.fillStyle = "#222";
  reliefCtx.fillRect(0, 0, 100, 100);
  const dome = reliefCtx.createRadialGradient(46, 44, 4, 50, 50, 52);
  dome.addColorStop(0, "#c8c8c8");
  dome.addColorStop(0.7, "#8a8a8a");
  dome.addColorStop(1, "#3a3a3a");
  reliefCtx.fillStyle = dome;
  reliefCtx.beginPath();
  for (const pair of sealOutline(opts.shape).split(" ")) {
    const [x, y] = pair.split(",").map(Number) as [number, number];
    reliefCtx.lineTo(x, y);
  }
  reliefCtx.closePath();
  reliefCtx.fill();
  reliefCtx.fillStyle = "#5c5c5c";
  reliefCtx.beginPath();
  reliefCtx.arc(50, 50, 33, 0, Math.PI * 2);
  reliefCtx.fill();
  reliefCtx.restore();
  reliefCtx.globalAlpha = 0.55;
  reliefCtx.globalCompositeOperation = "lighter";
  reliefCtx.drawImage(metal, 0, 0);
  return { color, metal, relief };
}

/**
 * Sombra difusa de una forma (puntos en fracciones), con margen `pad` a cada lado para el
 * desenfoque. La forma se dibuja fuera del lienzo y solo cae dentro su sombra: así el borde
 * queda suave en cualquier navegador (Safari no admite `filter` en el canvas).
 */
export function softShadowCanvas(
  points: [number, number][],
  aspect: number,
  { pad, blur, color }: { pad: number; blur: number; color: string },
) {
  const width = 512;
  const height = Math.round(width / aspect);
  const [el, ctx] = canvas(width, height);
  const scale = 1 + 2 * pad;
  const away = width * 4;
  ctx.shadowColor = color;
  ctx.shadowBlur = blur * width;
  ctx.shadowOffsetX = away;
  ctx.fillStyle = "#000";
  ctx.beginPath();
  for (const [x, y] of points) {
    ctx.lineTo(((x + pad) / scale) * width - away, ((y + pad) / scale) * height);
  }
  ctx.closePath();
  ctx.fill();
  return el;
}

/** Forro: el interior del sobre con el dibujo elegido, en oro. */
export function linerCanvas(liner: LinerId, inside: string, gold: string, ownIsDots: boolean) {
  const size = 512;
  const [el, ctx] = canvas(size);
  ctx.fillStyle = inside;
  ctx.fillRect(0, 0, size, size);
  const kind = liner === "propio" ? (ownIsDots ? "lunares" : "rayas") : liner;
  ctx.fillStyle = gold;
  ctx.strokeStyle = gold;
  if (kind === "rayas") {
    ctx.lineWidth = 2;
    for (let i = -size; i < size * 2; i += 26) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + size, size);
      ctx.stroke();
    }
  } else if (kind === "lunares" || kind === "flores") {
    const step = kind === "flores" ? 40 : 18;
    for (let y = step / 2; y < size; y += step) {
      for (let x = step / 2; x < size; x += step) {
        if (kind === "lunares") {
          ctx.beginPath();
          ctx.arc(x, y, 2.4, 0, Math.PI * 2);
          ctx.fill();
          continue;
        }
        ctx.globalAlpha = 0.55;
        for (let p = 0; p < 5; p++) {
          const a = (p / 5) * Math.PI * 2 - Math.PI / 2;
          ctx.beginPath();
          ctx.arc(x + Math.cos(a) * 5.5, y + Math.sin(a) * 5.5, 4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (kind === "marmol") {
    ctx.globalAlpha = 0.22;
    ctx.strokeStyle = "#ffffff";
    for (let v = 0; v < 6; v++) {
      ctx.lineWidth = 1 + (v % 3);
      ctx.beginPath();
      let x = (v * 97) % size;
      ctx.moveTo(x, 0);
      for (let y = 0; y <= size; y += 32) {
        x += Math.sin(y / 60 + v) * 18 + 6;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  return el;
}

/** Recorte de la solapa (blanco = papel) a partir de sus puntos en fracciones. */
export function flapMaskCanvas(points: [number, number][]) {
  const width = 1024;
  const height = 512;
  const [el, ctx] = canvas(width, height);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  for (const [x, y] of points) ctx.lineTo(x * width, y * height);
  ctx.closePath();
  ctx.fill();
  return el;
}

/** Parte un texto en líneas que caben en `max` píxeles con la fuente actual del lienzo. */
function wrap(ctx: CanvasRenderingContext2D, text: string, max: number) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(next).width > max) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

/**
 * La carta de la invitación completa (composición clásica): monograma, saludo, mensaje, nombres,
 * fecha y botón, con las medidas de la carta de papel (maquetada a 352 px de ancho). Así la carta
 * 3D que sale del sobre es la misma que la carta grande que la releva.
 */
export function letterCanvas(opts: {
  aspect: number;
  paper: string;
  ink: string;
  inkSoft: string;
  gold: string;
  initials: [string, string];
  greeting: string;
  message: string;
  names: string;
  date: string;
  displayFont: string;
  namesFont: string;
}) {
  const w = 1024;
  const h = Math.round(w * opts.aspect);
  const [el, ctx] = canvas(w, h);
  const u = w / 352; // un píxel de la carta de papel
  ctx.fillStyle = opts.paper;
  ctx.fillRect(0, 0, w, h);
  // Filete dorado interior.
  ctx.strokeStyle = opts.gold;
  ctx.globalAlpha = 0.35;
  ctx.lineWidth = u;
  ctx.strokeRect(16 * u, 16 * u, w - 32 * u, h - 32 * u);
  ctx.globalAlpha = 1;
  const cx = w / 2;
  ctx.textAlign = "center";
  // Monograma: aro dorado con las iniciales.
  let y = 48 * u;
  const r = 24 * u;
  ctx.lineWidth = 1.5 * u;
  ctx.strokeStyle = opts.gold;
  ctx.beginPath();
  ctx.arc(cx, y + r, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = opts.gold;
  ctx.textBaseline = "middle";
  ctx.font = `italic ${24 * u}px ${opts.displayFont}`;
  ctx.fillText(opts.initials[0], cx - 5 * u, y + r - 4 * u);
  ctx.fillText(opts.initials[1], cx + 5 * u, y + r + 6 * u);
  y += 2 * r + 24 * u;
  ctx.textBaseline = "alphabetic";
  // Saludo.
  ctx.fillStyle = opts.ink;
  ctx.font = `${32 * u}px ${opts.displayFont}`;
  for (const line of wrap(ctx, opts.greeting, 288 * u)) {
    y += 40 * u;
    ctx.fillText(line, cx, y - 10 * u);
  }
  // Mensaje.
  y += 20 * u;
  ctx.fillStyle = opts.inkSoft;
  ctx.font = `${19 * u}px ${opts.displayFont}`;
  for (const line of wrap(ctx, opts.message, 288 * u)) {
    y += 30.4 * u;
    ctx.fillText(line, cx, y - 8 * u);
  }
  // Nombres y fecha.
  y += 32 * u + 35 * u;
  ctx.fillStyle = opts.ink;
  ctx.font = `${28 * u}px ${opts.namesFont}`;
  ctx.fillText(opts.names, cx, y - 8 * u);
  y += 4 * u + 20 * u;
  ctx.fillStyle = opts.inkSoft;
  ctx.font = `italic ${14 * u}px ${opts.displayFont}`;
  ctx.fillText(opts.date, cx, y - 5 * u);
  // Botón.
  y += 36 * u;
  const bw = 288 * u;
  const bh = 48 * u;
  ctx.fillStyle = opts.ink;
  ctx.beginPath();
  ctx.roundRect(cx - bw / 2, y, bw, bh, 6 * u);
  ctx.fill();
  ctx.fillStyle = opts.paper;
  ctx.textBaseline = "middle";
  ctx.font = `500 ${16 * u}px system-ui, sans-serif`;
  ctx.fillText("Descubrir la invitación", cx, y + bh / 2);
  return el;
}
