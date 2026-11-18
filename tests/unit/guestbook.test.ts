import { describe, expect, it } from "vitest";
import { demoEvent } from "@/data/demo/event";
import { demoGuestbook, demoGuestbookEntries } from "@/data/demo/guestbook";
import { eventContentSchema } from "@/lib/domain/event-schema";
import {
  addOwnMessage,
  cleanMessage,
  EMPTY_GUESTBOOK,
  GUESTBOOK_MAX_LENGTH,
  GUESTBOOK_MAX_PER_GROUP,
  messageError,
  parseGuestbook,
} from "@/lib/guestbook";

describe("libro de firmas", () => {
  it("lo que no cuadra con el formato se lee como un libro vacío", () => {
    expect(parseGuestbook(undefined)).toEqual(EMPTY_GUESTBOOK);
    expect(parseGuestbook({ messages: [{ id: 1 }], songs: [] })).toEqual(EMPTY_GUESTBOOK);
    const state = { messages: [], songs: ["September"] };
    expect(parseGuestbook(state)).toEqual(state);
  });

  it("limpia espacios y saltos de línea del mensaje", () => {
    expect(cleanMessage("  Qué  alegría\n\nmás grande  ")).toBe("Qué alegría más grande");
  });

  it("no deja firmar en blanco, de más ni por cuarta vez", () => {
    expect(messageError("   ", EMPTY_GUESTBOOK)).toMatch(/Escribe/);
    expect(messageError("a".repeat(GUESTBOOK_MAX_LENGTH + 1), EMPTY_GUESTBOOK)).toMatch(/Máximo/);
    expect(messageError("¡Vivan los novios!", EMPTY_GUESTBOOK)).toBeNull();
    let state = EMPTY_GUESTBOOK;
    for (let i = 0; i < GUESTBOOK_MAX_PER_GROUP; i++) {
      state = addOwnMessage(state, "Familia García", `Mensaje ${i}`, new Date(2027, 1, i + 1));
    }
    expect(messageError("Otro más", state)).toMatch(/Ya habéis dejado/);
  });

  it("el mensaje propio va el primero y firmado con el nombre de la invitación", () => {
    const state = addOwnMessage(
      demoGuestbook(),
      "Familia García",
      " ¡Allí estaremos! ",
      new Date(),
    );
    expect(state.messages[0]).toMatchObject({
      name: "Familia García",
      body: "¡Allí estaremos!",
      mine: true,
    });
  });

  it("la demo no enseña a los invitados los mensajes ocultos", () => {
    const hidden = demoGuestbookEntries.filter((entry) => entry.hidden);
    expect(hidden.length).toBeGreaterThan(0);
    const ids = demoGuestbook().messages.map((m) => m.id);
    for (const entry of hidden) expect(ids).not.toContain(entry.id);
  });

  it("el contenido acepta el libro, el Bizum y la lista de música, y rechaza enlaces sin https", () => {
    expect(eventContentSchema.safeParse(demoEvent).success).toBe(true);
    const bad = { ...demoEvent, playlistUrl: "javascript:alert(1)" };
    expect(eventContentSchema.safeParse(bad).success).toBe(false);
    const badBizum = { ...demoEvent, gift: { ...demoEvent.gift, bizum: "<b>600</b>" } };
    expect(eventContentSchema.safeParse(badBizum).success).toBe(false);
  });
});
