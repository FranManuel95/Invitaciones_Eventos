import { describe, expect, it } from "vitest";
import { buildNewEventContent } from "@/lib/events/new-event";
import {
  firstSteps,
  personalization,
  showFirstSteps,
  themeChanged,
} from "@/lib/events/first-steps";
import { DEFAULT_THEME, TEMPLATE_IDS, applyTemplate } from "@/lib/theme";

const fresh = () => buildNewEventContent({ first: "Ana", second: "Luis", date: "2030-06-15" });
const SAMPLES = ["Familia García", "Marta y Jorge"];

const base = () => ({
  content: fresh(),
  theme: DEFAULT_THEME,
  groups: [] as { displayName: string }[],
  published: false,
  sampleNames: SAMPLES,
});

const done = (input: ReturnType<typeof base>) =>
  Object.fromEntries(firstSteps(input).map((s) => [s.id, s.done]));

describe("primeros pasos", () => {
  it("en un evento recién creado no hay nada hecho y la guía se ve", () => {
    const steps = firstSteps(base());
    expect(steps.map((s) => s.id)).toEqual([
      "plantilla",
      "fotos-textos",
      "invitaciones",
      "publicar",
    ]);
    expect(steps.every((s) => !s.done)).toBe(true);
    expect(showFirstSteps(steps)).toBe(true);
  });

  it("la plantilla cuenta como elegida al cambiar el aspecto o al publicar", () => {
    expect(themeChanged(DEFAULT_THEME)).toBe(false);
    const id = TEMPLATE_IDS.find((t) => themeChanged(applyTemplate(DEFAULT_THEME, t)))!;
    expect(done({ ...base(), theme: applyTemplate(DEFAULT_THEME, id) }).plantilla).toBe(true);
    expect(done({ ...base(), published: true }).plantilla).toBe(true);
  });

  it("fotos y textos necesita las dos cosas, y lo dice cuando falta una", () => {
    const photos = fresh();
    photos.coverPhoto = "https://example.invalid/portada.jpg";
    expect(personalization(photos)).toEqual({ photos: true, texts: false });
    const step = firstSteps({ ...base(), content: photos }).find((s) => s.id === "fotos-textos")!;
    expect(step.done).toBe(false);
    expect(step.detail).toMatch(/Las fotos ya son vuestras/);

    const both = structuredClone(photos);
    both.welcomeMessage = "Nos casamos y queremos que estés.";
    expect(done({ ...base(), content: both })["fotos-textos"]).toBe(true);
  });

  it("los textos de partida de otros tipos de evento no cuentan como propios", () => {
    const christening = buildNewEventContent({
      first: "Lucía",
      second: "",
      date: "2030-06-15",
      kind: "bautizo",
    });
    expect(personalization(christening)).toEqual({ photos: false, texts: false });
  });

  it("las invitaciones de ejemplo no cuentan como añadidas", () => {
    const samples = SAMPLES.map((displayName) => ({ displayName }));
    const onlySamples = firstSteps({ ...base(), groups: samples }).find(
      (s) => s.id === "invitaciones",
    )!;
    expect(onlySamples.done).toBe(false);
    expect(onlySamples.detail).toMatch(/solo están las de ejemplo/);
    expect(
      done({ ...base(), groups: [...samples, { displayName: "Tíos de Cuenca" }] }).invitaciones,
    ).toBe(true);
  });

  it("con todo hecho, la guía se oculta sola", () => {
    const content = fresh();
    content.coverPhoto = "https://example.invalid/portada.jpg";
    content.story.intro = "Nos conocimos en un tren.";
    const steps = firstSteps({
      ...base(),
      content,
      groups: [{ displayName: "Abuelos" }],
      published: true,
    });
    expect(steps.every((s) => s.done)).toBe(true);
    expect(showFirstSteps(steps)).toBe(false);
  });
});
