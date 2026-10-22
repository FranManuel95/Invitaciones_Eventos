import { describe, expect, it } from "vitest";
import { checkVideoFile } from "@/features/editor/photo-field";
import { parseTheme, seeded } from "@/lib/theme";
import { eventContentSchema } from "@/lib/domain/event-schema";
import { demoEvent } from "@/data/demo/event";

describe("portadas", () => {
  it("el generador con semilla repite la misma escena en cada carga", () => {
    const a = seeded(7);
    const b = seeded(7);
    const first = [a(), a(), a()];
    expect([b(), b(), b()]).toEqual(first);
    for (const v of first) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
    expect(seeded(8)()).not.toBe(first[0]);
  });

  it("sin portada elegida se sigue viendo la foto", () => {
    expect(parseTheme({}).cover).toBe("foto");
    expect(parseTheme({ cover: "fuegos" }).cover).toBe("foto");
    expect(parseTheme({ cover: "luces" }).cover).toBe("luces");
  });

  it("el contenido guardado antes sin vídeo sigue siendo válido", () => {
    const content: Partial<typeof demoEvent> = { ...demoEvent };
    delete content.id;
    expect(eventContentSchema.safeParse(content).success).toBe(true);
    expect(
      eventContentSchema.safeParse({ ...content, coverVideo: "https://x.supabase.co/v/a.mp4" })
        .success,
    ).toBe(true);
    expect(
      eventContentSchema.safeParse({ ...content, coverVideo: "javascript:alert(1)" }).success,
    ).toBe(false);
  });

  it("solo acepta vídeos MP4 o WebM de hasta 30 MB", () => {
    const file = (type: string, size: number) => ({ type, size }) as File;
    expect(checkVideoFile(file("video/mp4", 5_000_000))).toBeNull();
    // Los vídeos del iPhone (.mov) se aceptan; otros formatos no.
    expect(checkVideoFile(file("video/quicktime", 5_000_000))).toBeNull();
    expect(checkVideoFile(file("video/x-msvideo", 5_000_000))).toMatch(/MP4, MOV/);
    expect(checkVideoFile(file("video/webm", 40 * 1024 * 1024))).toMatch(/30 MB/);
  });
});
