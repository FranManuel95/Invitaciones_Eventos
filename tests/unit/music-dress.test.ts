import { describe, expect, it } from "vitest";
import { checkMediaFile } from "@/features/editor/photo-field";
import { dressKind } from "@/lib/dress";
import { parseTheme } from "@/lib/theme";

describe("música y vestimenta", () => {
  it("sin estilo elegido suena el piano de siempre", () => {
    expect(parseTheme({}).musicStyle).toBe("piano");
    expect(parseTheme({ musicStyle: "rock" }).musicStyle).toBe("piano");
    expect(parseTheme({ musicStyle: "cajita" }).musicStyle).toBe("cajita");
  });

  it("solo acepta canciones MP3 o M4A de hasta 30 MB", () => {
    const file = (type: string, size: number) => ({ type, size }) as File;
    expect(checkMediaFile(file("audio/mpeg", 4_000_000), "audio")).toBeNull();
    expect(checkMediaFile(file("audio/x-m4a", 4_000_000), "audio")).toBeNull();
    expect(checkMediaFile(file("audio/wav", 4_000_000), "audio")).toMatch(/MP3 o M4A/);
    expect(checkMediaFile(file("audio/mpeg", 40 * 1024 * 1024), "audio")).toMatch(/30 MB/);
  });

  it.each([
    ["Ellas", "dress"],
    ["Para ellas", "dress"],
    ["Ellos", "suit"],
    ["Caballeros", "suit"],
    ["Niños y niñas", "kids"],
    ["Todos", "hanger"],
  ])("«%s» lleva el pictograma %s", (who, kind) => {
    expect(dressKind(who)).toBe(kind);
  });
});
