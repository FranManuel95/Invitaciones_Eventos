/** Nombres ordenados y sin repetir para las fotos del zip: «boda-maria-y-daniel-001.webp». */
export function zipNames(urls: string[], prefix: string): string[] {
  const width = Math.max(3, String(urls.length).length);
  return urls.map((url, i) => {
    const ext = /\.(webp|jpe?g|png)(?:$|\?)/i.exec(url)?.[1]?.toLowerCase() ?? "jpg";
    return `${prefix}-${String(i + 1).padStart(width, "0")}.${ext === "jpeg" ? "jpg" : ext}`;
  });
}

/** «María y Daniel» → «boda-maria-y-daniel». */
export function zipPrefix(couple: string): string {
  const clean = couple
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, "y")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return clean ? `boda-${clean}` : "fotos-boda";
}
