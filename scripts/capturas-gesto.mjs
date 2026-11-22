/*
 * Tres capturas de una portada de concepto con gesto: antes, a mitad del gesto y al terminar.
 * Sirve para revisar a ojo cómo se ve una plantilla mientras se pule.
 *
 *   npx next dev -p 3124            (o npm run build && npx next start -p 3124)
 *   node scripts/capturas-gesto.mjs <plantilla> <selector> recta <dx> <dy>
 *   node scripts/capturas-gesto.mjs <plantilla> <selector> giro <grados>
 *
 * Ejemplos:
 *   node scripts/capturas-gesto.mjs persiana ".cursor-grab" recta 0 200
 *   node scripts/capturas-gesto.mjs noria "[data-noria]" giro 180
 *   node scripts/capturas-gesto.mjs buzon "[data-buzon] .cursor-grab" recta 96 150
 *
 * «recta» arrastra en línea desde el centro del elemento; «giro» da vueltas alrededor de él.
 * Guarda gesto-<plantilla>-1.png, -2.png y -3.png en la carpeta temporal y escribe la ruta.
 */
import os from "node:os";
import path from "node:path";
import { chromium } from "@playwright/test";

const [id, sel, mode, a = "0", b = "0"] = process.argv.slice(2);
if (!id || !sel || !["recta", "giro"].includes(mode)) {
  console.error("Uso: node scripts/capturas-gesto.mjs <plantilla> <selector> recta|giro …");
  process.exit(1);
}
const base = process.env.BASE ?? "http://localhost:3124";
const out = (n) => path.join(os.tmpdir(), `gesto-${id}-${n}.png`);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto(`${base}/i/familia-garcia?plantilla=${id}`);
await page.waitForTimeout(4000);
await page.screenshot({ path: out(1) });
const box = await page.locator(`[data-cover='${id}'] ${sel}`).first().boundingBox();
const cx = box.x + box.width / 2;
const cy = box.y + Math.min(box.height / 2, 170);

if (mode === "recta") {
  const [dx, dy] = [Number(a), Number(b)];
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  await page.mouse.move(cx + dx / 2, cy + dy / 2, { steps: 10 });
  await page.waitForTimeout(300);
  await page.screenshot({ path: out(2) });
  await page.mouse.move(cx + dx, cy + dy, { steps: 10 });
} else {
  const deg = Number(a);
  const r = box.width * 0.4;
  const yc = box.y + box.height / 2;
  const at = (g) => [
    cx + r * Math.cos((g * Math.PI) / 180),
    yc + r * Math.sin((g * Math.PI) / 180),
  ];
  await page.mouse.move(...at(0));
  await page.mouse.down();
  for (let g = 5; g <= deg; g += 5) {
    await page.mouse.move(...at(g));
    if (g === Math.round(deg / 10) * 5) await page.screenshot({ path: out(2) });
  }
}
await page.mouse.up();
await page.waitForTimeout(2500);
await page.screenshot({ path: out(3) });
await browser.close();
console.log([1, 2, 3].map(out).join("\n"));
