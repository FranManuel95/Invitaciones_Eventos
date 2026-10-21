import { describe, expect, it } from "vitest";
import { demoEvent } from "@/data/demo/event";
import { eventContentSchema } from "@/lib/domain/event-schema";

// El contenido es el evento sin su id (el id es la columna de la tabla).
const content: Record<string, unknown> & typeof demoEvent = { ...demoEvent };
delete (content as Partial<typeof demoEvent>).id;

describe("esquema del contenido del evento", () => {
  it("acepta el evento de demostración completo", () => {
    const parsed = eventContentSchema.safeParse(content);
    expect(parsed.success ? "ok" : parsed.error.issues).toBe("ok");
  });

  it("rechaza fotos con rutas extrañas y horas mal escritas", () => {
    expect(
      eventContentSchema.safeParse({ ...content, coverPhoto: "javascript:alert(1)" }).success,
    ).toBe(false);
    expect(
      eventContentSchema.safeParse({
        ...content,
        program: [{ ...content.program[0]!, time: "4 de la tarde" }],
      }).success,
    ).toBe(false);
  });

  it("acepta fotos del almacenamiento de Supabase", () => {
    const url = "https://abc.supabase.co/storage/v1/object/public/event-media/e1/portada.webp";
    expect(eventContentSchema.safeParse({ ...content, coverPhoto: url }).success).toBe(true);
  });
});
