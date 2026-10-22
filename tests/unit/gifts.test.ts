import { describe, expect, it } from "vitest";
import { demoEvent } from "@/data/demo/event";
import { eventContentSchema } from "@/lib/domain/event-schema";
import type { GiftItem } from "@/lib/domain/types";
import {
  applyClaim,
  EMPTY_GIFT_STATUS,
  giftState,
  othersOnShared,
  parseGiftStatus,
  summarizeGifts,
} from "@/lib/gifts";

const gift = (id: string, shared = false): GiftItem => ({
  id,
  title: id,
  detail: "",
  price: "",
  url: "",
  photo: null,
  shared,
});

describe("lista de regalos", () => {
  it("un regalo reservado por otra invitación queda sellado; uno compartido no", () => {
    const status = { counts: { cafetera: 1, viaje: 2 }, mine: [] };
    expect(giftState(gift("cafetera"), status)).toBe("taken");
    expect(giftState(gift("viaje", true), status)).toBe("free");
    expect(giftState(gift("olivo"), status)).toBe("free");
    expect(othersOnShared(gift("viaje", true), status)).toBe(2);
  });

  it("lo reservado por la propia invitación se ve como suyo y no cuenta como de otros", () => {
    const status = { counts: { viaje: 3 }, mine: ["viaje"] };
    expect(giftState(gift("viaje", true), status)).toBe("mine");
    expect(othersOnShared(gift("viaje", true), status)).toBe(2);
  });

  it("reservar y deshacer en local mantiene los recuentos y no duplica", () => {
    const once = applyClaim(EMPTY_GIFT_STATUS, "cafetera", true);
    expect(once).toEqual({ counts: { cafetera: 1 }, mine: ["cafetera"] });
    expect(applyClaim(once, "cafetera", true)).toBe(once);
    expect(applyClaim(once, "cafetera", false)).toEqual({ counts: { cafetera: 0 }, mine: [] });
    expect(applyClaim(EMPTY_GIFT_STATUS, "cafetera", false)).toBe(EMPTY_GIFT_STATUS);
  });

  it("un estado con forma rara del servidor se lee como lista sin reservas", () => {
    expect(parseGiftStatus(null)).toEqual(EMPTY_GIFT_STATUS);
    expect(parseGiftStatus({ counts: { a: -1 }, mine: [] })).toEqual(EMPTY_GIFT_STATUS);
    expect(parseGiftStatus({ counts: { a: 2 }, mine: ["a"] })).toEqual({
      counts: { a: 2 },
      mine: ["a"],
    });
  });

  it("el panel agrupa las reservas por regalo y separa las de regalos quitados", () => {
    const claims = [
      { itemId: "viaje", groupName: "Carlos", createdAt: "2027-02-11T10:00:00Z" },
      { itemId: "viaje", groupName: "Familia García", createdAt: "2027-02-03T10:00:00Z" },
      { itemId: "quitado", groupName: "Elena", createdAt: "2027-02-01T10:00:00Z" },
    ];
    const summary = summarizeGifts([gift("viaje", true), gift("olivo")], claims);
    expect(summary.rows[0]!.claims.map((c) => c.groupName)).toEqual(["Familia García", "Carlos"]);
    expect(summary.reserved).toBe(1);
    expect(summary.free).toBe(1);
    expect(summary.orphaned).toHaveLength(1);
  });

  it("el contenido acepta la lista, sin lista (eventos de antes) y rechaza enlaces sin https", () => {
    // Zod descarta el id, que no forma parte del contenido.
    const content = eventContentSchema.parse(demoEvent);
    expect(content.gift.items).toHaveLength(4);
    const oldGift = { ...content.gift, items: undefined };
    expect(eventContentSchema.safeParse({ ...content, gift: oldGift }).success).toBe(true);
    const bad = {
      ...content,
      gift: { ...content.gift, items: [{ ...gift("x"), url: "javascript:alert(1)" }] },
    };
    expect(eventContentSchema.safeParse(bad).success).toBe(false);
  });
});
