import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from "three";

/**
 * Texturas procedurales dibujadas en un canvas una sola vez: sin imágenes externas ni
 * licencias que revisar, y con un peso de unos pocos KB de código.
 */

/** Ruido determinista para que la textura sea idéntica en cada carga. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function canvas(size: number) {
  const el = document.createElement("canvas");
  el.width = el.height = size;
  return [el, el.getContext("2d")!] as const;
}

/** Papel verjurado: base marfil, grano fino y fibras sueltas. */
export function paperTexture(base = "#f4efe4", size = 512) {
  const [el, ctx] = canvas(size);
  const rand = seeded(7);
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);
  const image = ctx.getImageData(0, 0, size, size);
  for (let i = 0; i < image.data.length; i += 4) {
    const n = (rand() - 0.5) * 14;
    image.data[i] = image.data[i]! + n;
    image.data[i + 1] = image.data[i + 1]! + n;
    image.data[i + 2] = image.data[i + 2]! + n;
  }
  ctx.putImageData(image, 0, 0);
  ctx.lineCap = "round";
  for (let i = 0; i < 260; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const length = 6 + rand() * 22;
    const angle = rand() * Math.PI;
    ctx.strokeStyle = `rgba(120, 100, 70, ${0.05 + rand() * 0.08})`;
    ctx.lineWidth = 0.6 + rand() * 0.6;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(
      x + Math.cos(angle) * length * 0.5 + (rand() - 0.5) * 6,
      y + Math.sin(angle) * length * 0.5 + (rand() - 0.5) * 6,
      x + Math.cos(angle) * length,
      y + Math.sin(angle) * length,
    );
    ctx.stroke();
  }
  const texture = new CanvasTexture(el);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

/** Cara del lacre: color de cera con el monograma; la segunda textura marca el oro (metal). */
export function sealFaceTextures(first: string, second: string, size = 256) {
  const draw = (ctx: CanvasRenderingContext2D, wax: string, ink: string) => {
    const c = size / 2;
    const gradient = ctx.createRadialGradient(c * 0.8, c * 0.7, 4, c, c, c);
    gradient.addColorStop(0, wax === "#000" ? "#000" : "#86283a");
    gradient.addColorStop(1, wax);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = ink;
    ctx.lineWidth = size * 0.02;
    ctx.beginPath();
    ctx.arc(c, c, c * 0.72, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = ink;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `italic ${size * 0.34}px "Bodoni Moda", Didot, Georgia, serif`;
    ctx.fillText(first[0] ?? "", c - size * 0.1, c - size * 0.06);
    ctx.fillText(second[0] ?? "", c + size * 0.1, c + size * 0.1);
  };
  const [colorEl, colorCtx] = canvas(size);
  draw(colorCtx, "#5e1824", "#d9bf82");
  const [metalEl, metalCtx] = canvas(size);
  draw(metalCtx, "#000", "#fff");
  const color = new CanvasTexture(colorEl);
  color.colorSpace = SRGBColorSpace;
  return { color, metal: new CanvasTexture(metalEl) };
}

/** Carta apaisada: papel con los nombres, la fecha y el lugar. */
export function letterTexture(lines: { names: string; date: string; place: string }) {
  const width = 1024;
  const height = 704;
  const el = document.createElement("canvas");
  el.width = width;
  el.height = height;
  const ctx = el.getContext("2d")!;
  const paper = paperTexture("#fbf8f1", 512).image as HTMLCanvasElement;
  ctx.drawImage(paper, 0, 0, width, height);
  ctx.strokeStyle = "rgba(163, 135, 78, 0.7)";
  ctx.lineWidth = 2;
  ctx.strokeRect(30, 30, width - 60, height - 60);
  ctx.fillStyle = "#23271e";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.font = `400 28px "Jost", Futura, system-ui, sans-serif`;
  ctx.fillText("N O S   C A S A M O S", width / 2, 170);
  ctx.font = `400 108px "Bodoni Moda", Didot, Georgia, serif`;
  ctx.fillText(lines.names, width / 2, 340);
  ctx.font = `italic 38px "Bodoni Moda", Didot, Georgia, serif`;
  ctx.fillStyle = "#42463b";
  ctx.fillText(lines.date, width / 2, 470);
  ctx.fillText(lines.place, width / 2, 525);
  const texture = new CanvasTexture(el);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}
