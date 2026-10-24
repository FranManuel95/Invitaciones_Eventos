/*
 * Imágenes y vídeos de la página de venta y de /ejemplos, sacados de la invitación de ejemplo:
 * la portada de cada plantilla y de cada fondo, y una grabación corta de cada apertura.
 *
 *   npm run build && PORT=3100 npm start
 *   node scripts/capturas-venta.mjs http://localhost:3100 [solo]
 *
 * «solo» limita a un grupo: plantillas, portadas, aperturas o panel. Guarda en public/venta/.
 * Necesita ffmpeg (los vídeos) y el Chromium de Playwright.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { chromium } from "@playwright/test";
import sharp from "sharp";

const [base = "http://localhost:3100", only] = process.argv.slice(2);
const OUT = path.resolve("public/venta");
const PHONE = { width: 390, height: 844 };

const TEMPLATES = [
  "almendro",
  "atelier",
  "medianoche",
  "jardin",
  "terracota",
  "empolvado",
  "costa",
  "esmeralda",
  "luciernagas",
  "acuarela",
  "gala",
  "herbario",
  "cine",
];
const COVERS = ["foto", "luces", "acuarela", "estrellas", "herbario", "cine"];
const OPENINGS = ["mesa", "pantalla", "diptico", "caja", "pelicula", "sobre3d", "ventana"];

const TRIGGER = /^Abrir (el sobre|la invitación|la caja)$/;

const browser = await chromium.launch({
  executablePath: fs.existsSync("/opt/pw-browsers/chromium")
    ? "/opt/pw-browsers/chromium"
    : undefined,
});

async function phonePage(scale = 2) {
  return browser.newPage({
    viewport: PHONE,
    deviceScaleFactor: scale,
    isMobile: true,
    hasTouch: true,
  });
}

async function still(page, file, width = 520) {
  const png = await page.screenshot();
  await sharp(png).resize({ width }).webp({ quality: 78 }).toFile(path.join(OUT, file));
  console.log(file);
}

/**
 * La portada ya asentada (las escenas entran con su animación) o, con «envelope», el sobre que
 * viene después: en las plantillas es lo que más cambia (papel, forro, lacre y letra).
 */
async function cover(query, file, envelope = false) {
  const page = await phonePage();
  await page.goto(`${base}/i/familia-garcia?${query}`);
  const start = page.getByRole("button", { name: /toca para abrir/i });
  await start.waitFor();
  if (envelope) {
    await start.click();
    await page.getByRole("button", { name: TRIGGER }).hover();
    await page.waitForTimeout(2500);
  } else {
    await page.waitForTimeout(3500);
  }
  await still(page, file);
  await page.close();
}

/**
 * Graba la apertura desde el sobre en reposo hasta la carta. Los fotogramas del navegador llegan
 * a ritmo irregular: ffmpeg los monta con la duración real de cada uno.
 */
async function opening(id) {
  const page = await phonePage(1.5);
  await page.goto(`${base}/i/familia-garcia?apertura=${id}`);
  await page.getByRole("button", { name: /toca para abrir/i }).click();
  const trigger = page.getByRole("button", { name: TRIGGER });
  await trigger.hover();
  await page.waitForTimeout(id === "sobre3d" ? 6000 : 1800);
  await still(page, `apertura-${id}.webp`);

  const cdp = await page.context().newCDPSession(page);
  const frames = [];
  cdp.on("Page.screencastFrame", async (f) => {
    frames.push({ t: f.metadata.timestamp, data: f.data });
    await cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }).catch(() => {});
  });
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 85, maxWidth: 585 });
  await page.waitForTimeout(900);
  if (id === "ventana") {
    // La ventana se abre deslizando el dedo hacia arriba.
    const box = await trigger.boundingBox();
    const x = box.x + box.width / 2;
    await page.mouse.move(x, box.y + box.height * 0.7);
    await page.mouse.down();
    for (let i = 1; i <= 12; i++) {
      await page.mouse.move(x, box.y + box.height * (0.7 - i * 0.04));
      await page.waitForTimeout(30);
    }
    await page.mouse.up();
  } else {
    await trigger.click();
  }
  await page
    .getByRole("heading", { name: "Hola, Familia García:" })
    .waitFor({ timeout: id === "sobre3d" ? 90_000 : 30_000 });
  await page.waitForTimeout(2200);
  await cdp.send("Page.stopScreencast");
  await page.close();

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `apertura-${id}-`));
  const list = frames.map((f, i) => {
    const name = `${String(i).padStart(4, "0")}.jpg`;
    fs.writeFileSync(path.join(dir, name), Buffer.from(f.data, "base64"));
    const next = frames[i + 1]?.t ?? f.t + 0.5;
    return `file '${name}'\nduration ${Math.max(next - f.t, 0.001).toFixed(3)}`;
  });
  fs.writeFileSync(path.join(dir, "list.txt"), `${list.join("\n")}\n`);
  const input = ["-y", "-f", "concat", "-safe", "0", "-i", path.join(dir, "list.txt")];
  const scale = "scale=540:-2:flags=lanczos,fps=30";
  execFileSync(
    "ffmpeg",
    [
      ...input,
      ...["-vf", scale, "-an", "-c:v", "libx264", "-crf", "27", "-preset", "slow"],
      ...["-pix_fmt", "yuv420p", "-movflags", "+faststart", path.join(OUT, `apertura-${id}.mp4`)],
    ],
    { stdio: "ignore" },
  );
  execFileSync(
    "ffmpeg",
    [
      ...input,
      ...["-vf", scale, "-an", "-c:v", "libvpx-vp9", "-crf", "38", "-b:v", "0"],
      path.join(OUT, `apertura-${id}.webm`),
    ],
    { stdio: "ignore" },
  );
  fs.rmSync(dir, { recursive: true, force: true });
  console.log(`apertura-${id} (${frames.length} fotogramas)`);
}

/** El panel de los novios, en un portátil. */
async function panel() {
  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1.5,
  });
  await page.goto(`${base}/panel/demo`);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1500);
  await still(page, "panel.webp", 1280);
  await page.close();
}

fs.mkdirSync(OUT, { recursive: true });
if (!only || only === "plantillas")
  for (const id of TEMPLATES) await cover(`plantilla=${id}`, `plantilla-${id}.webp`, true);
if (!only || only === "portadas")
  for (const id of COVERS) await cover(`portada=${id}`, `portada-${id}.webp`);
if (!only || only === "aperturas") for (const id of OPENINGS) await opening(id);
if (!only || only === "panel") await panel();
await browser.close();
