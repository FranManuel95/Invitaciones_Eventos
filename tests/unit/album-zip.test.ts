import { describe, expect, it } from "vitest";
import { zipNames, zipPrefix } from "@/lib/album-zip";

describe("zip del álbum", () => {
  it("nombra las fotos en orden, con su extensión", () => {
    expect(
      zipNames(
        ["/fotos/finca.jpg", "https://x.supabase.co/a/b.webp?v=1", "/sin-extension"],
        "boda-x",
      ),
    ).toEqual(["boda-x-001.jpg", "boda-x-002.webp", "boda-x-003.jpg"]);
  });

  it("el nombre del archivo sale de la pareja, sin tildes ni símbolos", () => {
    expect(zipPrefix("María & Daniel")).toBe("boda-maria-y-daniel");
    expect(zipPrefix("  ")).toBe("fotos-boda");
  });
});
