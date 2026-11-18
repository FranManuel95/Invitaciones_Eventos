import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { demoEvent } from "@/data/demo/event";
import { demoVariant } from "@/data/demo/variants";
import { eventContentSchema } from "@/lib/domain/event-schema";
import { TEMPLATE_IDS } from "@/lib/theme";

// Cada plantilla con boda propia enseña una pareja, un sitio y una historia que no se repiten.
const variants = TEMPLATE_IDS.flatMap((id) => {
  const variant = demoVariant(id);
  return variant ? [{ id, ...variant }] : [];
});

describe("bodas de ejemplo de las plantillas", () => {
  it("hay una boda propia para cada plantilla de concepto", () => {
    for (const id of ["gaceta", "embarque", "premio", "vinilo", "cosecha", "semillas"]) {
      expect(demoVariant(id), id).not.toBeNull();
    }
  });

  it("cada boda cumple el esquema del contenido del evento", () => {
    for (const { id, event } of variants) {
      // El contenido es el evento sin su id (el id es la columna de la tabla).
      const content: Record<string, unknown> = { ...event };
      delete content.id;
      const parsed = eventContentSchema.safeParse(content);
      expect(parsed.success ? "ok" : parsed.error.issues, id).toBe("ok");
    }
  });

  it("no hay dos bodas en la misma ciudad, con la misma pareja ni con la misma historia", () => {
    const all = [demoEvent, ...variants.map((v) => v.event)];
    const unique = (values: string[]) => new Set(values).size === values.length;
    expect(unique(all.map((e) => e.id))).toBe(true);
    expect(unique(all.map((e) => e.city))).toBe(true);
    expect(unique(all.map((e) => `${e.couple.first} y ${e.couple.second}`))).toBe(true);
    expect(unique(all.map((e) => e.story.intro))).toBe(true);
    expect(unique(all.map((e) => e.welcomeMessage))).toBe(true);
    expect(unique(all.map((e) => e.venues.map((v) => v.name).join("|")))).toBe(true);
    const books = variants.map((v) => v.guestbook?.messages[0]?.body ?? "");
    expect(unique(books)).toBe(true);
  });

  it("el programa apunta a sitios de la boda y la respuesta se cierra antes del día", () => {
    for (const { id, event } of variants) {
      const venues = new Set(event.venues.map((v) => v.id));
      for (const act of event.program)
        expect(venues.has(act.venueId), `${id}: ${act.title}`).toBe(true);
      expect(new Date(event.rsvpDeadline) < new Date(event.date), id).toBe(true);
      // La hora de la ceremonia es la de la invitación.
      expect(event.date.slice(11, 16), id).toBe(event.program[0]!.time);
    }
  });

  it("los textos hablan de la pareja de la boda y las fotos existen", () => {
    for (const { id, event } of variants) {
      const names = [event.couple.first, event.couple.second];
      for (const moment of event.story.moments) {
        if (moment.photoAlt.includes(" de espaldas") || moment.photoAlt.includes(" riendo")) {
          expect(moment.photoAlt, id).toContain(`${names[0]} y ${names[1]}`);
        }
      }
      expect(event.gift.holder, id).toBe(`${names[0]} y ${names[1]}`);
      const photos = [
        event.coverPhoto,
        event.banquetPhoto,
        event.story.couplePhoto,
        ...event.venues.map((v) => v.photo),
        ...event.story.moments.map((m) => m.photo),
      ];
      for (const photo of photos) {
        if (photo) expect(existsSync(join("public", photo)), `${id}: ${photo}`).toBe(true);
      }
    }
  });
});
