import { describe, expect, it } from "vitest";
import { demoEvent } from "@/data/demo/event";
import {
  dayClock,
  formatIn,
  isAfterEvent,
  liveProgram,
  nextReturns,
  toMinutes,
} from "@/lib/day-mode";

describe("modo día de la boda", () => {
  it("cuenta la madrugada como parte de la noche del evento", () => {
    expect(toMinutes("19:10")).toBe(19 * 60 + 10);
    expect(toMinutes("01:30")).toBe(25 * 60 + 30);
  });

  it("a las 19:10 está el cóctel y el banquete llega en 1 h 50 min", () => {
    const clock = dayClock(demoEvent, new Date("2026-01-01T00:00:00Z"), "?dia=boda&hora=19:10");
    expect(clock).toEqual({ active: true, minutes: 19 * 60 + 10, simulated: true });
    const live = liveProgram(demoEvent.program, clock.minutes);
    expect(live.current?.id).toBe("coctel");
    expect(live.next?.id).toBe("banquete");
    expect(formatIn(live.minutesToNext!)).toBe("en 1 h 50 min");
  });

  it("después de medianoche sigue la fiesta y no hay acto siguiente", () => {
    const live = liveProgram(demoEvent.program, toMinutes("00:40"));
    expect(live.current?.id).toBe("fiesta");
    expect(live.next).toBeNull();
    expect(
      nextReturns(demoEvent, toMinutes("00:40")).every(
        (r) => toMinutes(r.time) > toMinutes("00:40"),
      ),
    ).toBe(true);
  });

  it("se activa solo el día del evento en hora de Madrid", () => {
    // 22 de mayo de 2027 a las 18:00 en Madrid (UTC+2).
    expect(dayClock(demoEvent, new Date("2027-05-22T16:00:00Z")).active).toBe(true);
    // Madrugada siguiente, 02:00 en Madrid.
    expect(dayClock(demoEvent, new Date("2027-05-23T00:00:00Z"))).toMatchObject({
      active: true,
      minutes: 26 * 60,
    });
    expect(dayClock(demoEvent, new Date("2027-05-21T16:00:00Z")).active).toBe(false);
    expect(dayClock(demoEvent, new Date("2027-05-23T10:00:00Z")).active).toBe(false);
  });
});

describe("después de la boda", () => {
  // La boda de la demo es el 22 de mayo de 2027 (hora de Madrid, UTC+2).
  it("empieza a las 06:00 del día siguiente, cuando acaba el modo día", () => {
    expect(isAfterEvent(demoEvent, new Date("2027-05-22T20:00:00Z"))).toBe(false);
    expect(isAfterEvent(demoEvent, new Date("2027-05-23T03:30:00Z"))).toBe(false); // 05:30
    expect(isAfterEvent(demoEvent, new Date("2027-05-23T04:00:00Z"))).toBe(true); // 06:00
    expect(isAfterEvent(demoEvent, new Date("2027-07-01T10:00:00Z"))).toBe(true);
    expect(isAfterEvent(demoEvent, new Date("2027-04-01T10:00:00Z"))).toBe(false);
  });

  it("en la demo se puede ver con ?dia=despues", () => {
    expect(isAfterEvent(demoEvent, new Date("2026-01-01T00:00:00Z"), "?dia=despues")).toBe(true);
  });
});
