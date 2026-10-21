/*
 * Fotos subidas desde el editor. Se recodifican en el navegador antes de subirlas:
 * - como mucho 2000 px de lado, en WebP: pesan poco y cargan rápido en el móvil;
 * - al pintar en un canvas se pierden el EXIF y la ubicación GPS.
 * Para la portada se genera además un mapa de profundidad aproximado (cerca = claro) que usa
 * el efecto 3D: un degradado vertical (el suelo está más cerca que el cielo) mezclado con la
 * luminosidad suavizada de la foto.
 */

export const MAX_SIDE = 2000;
export const MAX_BYTES = 8 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

/** Medidas para que el lado mayor no pase de `max`, sin agrandar fotos pequeñas. */
export function fitWithin(width: number, height: number, max = MAX_SIDE) {
  const scale = Math.min(1, max / Math.max(width, height));
  return { width: Math.round(width * scale), height: Math.round(height * scale) };
}

/** Comprueba el archivo elegido. Devuelve un mensaje de error o null. */
export function checkImageFile(file: File): string | null {
  if (!ACCEPTED.includes(file.type)) return "Sube una foto en JPG, PNG, WebP o HEIC.";
  if (file.size > 25 * 1024 * 1024) return "La foto pesa demasiado (máximo 25 MB).";
  return null;
}

function canvasBlob(canvas: HTMLCanvasElement, type: string, quality?: number) {
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("No se pudo procesar la foto."))),
      type,
      quality,
    ),
  );
}

/** Foto reducida y sin metadatos, en WebP. */
export async function prepareImage(file: File) {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const size = fitWithin(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = size.width;
  canvas.height = size.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo procesar la foto.");
  ctx.drawImage(bitmap, 0, 0, size.width, size.height);
  const photo = await canvasBlob(canvas, "image/webp", 0.85);
  if (photo.size > MAX_BYTES) throw new Error("La foto sigue pesando demasiado. Prueba con otra.");
  return { photo, bitmap, ...size };
}

/** Mapa de profundidad aproximado (512 px de ancho, en escala de grises). */
export async function approximateDepth(bitmap: ImageBitmap) {
  const { width, height } = fitWithin(bitmap.width, bitmap.height, 512);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo procesar la foto.");
  ctx.filter = "grayscale(1) blur(6px)";
  ctx.drawImage(bitmap, 0, 0, width, height);
  ctx.filter = "none";
  const image = ctx.getImageData(0, 0, width, height);
  const px = image.data;
  for (let y = 0; y < height; y++) {
    const ground = 40 + (y / height) * 200; // de lejos (arriba) a cerca (abajo)
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const value = Math.round(ground * 0.75 + (px[i] ?? 0) * 0.25);
      px[i] = px[i + 1] = px[i + 2] = value;
    }
  }
  ctx.putImageData(image, 0, 0);
  return canvasBlob(canvas, "image/png");
}
