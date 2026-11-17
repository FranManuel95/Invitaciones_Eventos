import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/*
 * Plantillas de concepto de la ronda 20. Para todas: los nombres en el título, la fecha siempre en
 * la página, sin fallos graves de accesibilidad, el botón que abre y el rótulo de sección propio.
 * Después, la interacción de cada una.
 */
const CONCEPTS = [
  { id: "vinilo", names: /Nuria.*Dani/, date: "2 de octubre de 2027", opening: "pantalla" },
  { id: "pasaporte", names: /Paula.*Íker/, date: "26/06/2027", opening: "pantalla" },
  { id: "carta", names: /Rocío y Manu/, date: "29 de mayo de 2027", opening: "mesa" },
  { id: "mapa", names: /Aitana y Bruno/, date: "24 de julio de 2027", opening: "mesa" },
  {
    id: "constelacion",
    names: /Lola & Samuel/,
    date: "11 de diciembre de 2027",
    opening: "pantalla",
  },
  { id: "comic", names: /Valeria y Jorge/, date: "05/06/27", opening: "pantalla" },
  { id: "cosecha", names: /Blanca.*Rodrigo/, date: "25 de septiembre de 2027", opening: "mesa" },
  { id: "tarot", names: /Abril & Óscar/, date: "20 de noviembre de 2027", opening: "pantalla" },
  { id: "arcade", names: /Leire.*Marc/, date: "3 de julio de 2027", opening: "pantalla" },
  { id: "semillas", names: /Amor de Olivia y Tomás/, date: "17 de abril de 2027", opening: "mesa" },
] as const;

const cover = (page: Page, id: string) => page.locator(`[data-cover='${id}']`);

async function expectOpened(page: Page, opening: "pantalla" | "mesa") {
  if (opening === "pantalla")
    await expect(page.locator("[data-opening='pantalla']")).toBeAttached();
  else await expect(page.getByRole("button", { name: "Abrir el sobre" })).toBeVisible();
}

test.describe("plantillas de concepto (segunda tanda)", () => {
  for (const concept of CONCEPTS) {
    test(`${concept.id}: portada accesible, se abre y el interior lleva su rótulo`, async ({
      page,
    }) => {
      await page.goto(`/i/familia-garcia?plantilla=${concept.id}`);
      const stage = cover(page, concept.id);
      await expect(stage.getByRole("heading", { level: 1, name: concept.names })).toBeAttached();
      await expect(stage.getByText(concept.date).first()).toBeAttached();
      // Con las animaciones de entrada ya asentadas.
      await page.waitForTimeout(1500);
      const { violations } = await new AxeBuilder({ page }).analyze();
      const serious = violations.filter((v) => ["serious", "critical"].includes(v.impact ?? ""));
      expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(" | ")}`)).toEqual(
        [],
      );
      await stage.getByRole("button", { name: /toca para abrir/i }).click();
      await expectOpened(page, concept.opening);
      await page.getByRole("button", { name: "Saltar intro" }).click();
      await expect(page.locator(`[data-motif='${concept.id}']`)).toBeAttached();
      const sprig = page.locator("#fecha .motif-sprig");
      await expect(sprig).toBeVisible();
      const label = await sprig.evaluate(
        (el) => getComputedStyle(el, "::before").content + getComputedStyle(el, "::after").content,
      );
      expect(label.replaceAll("none", "").replaceAll('""', "")).not.toBe("");
      const { violations: inside } = await new AxeBuilder({ page }).include("#fecha").analyze();
      expect(
        inside.filter((v) => ["serious", "critical"].includes(v.impact ?? "")).map((v) => v.id),
      ).toEqual([]);
    });
  }

  test("pasaporte: al abrirlo, la hoja de datos va a nombre del invitado", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=pasaporte");
    const stage = cover(page, "pasaporte");
    const book = stage.locator("[data-side]");
    await expect(book).toHaveAttribute("data-side", "tapa");
    await stage.getByRole("button", { name: "Abrir el pasaporte" }).click();
    await expect(book).toHaveAttribute("data-side", "datos");
    await expect(stage.getByText("Familia García", { exact: true })).toBeVisible();
    await expect(stage.getByText("ADMITIDO")).toBeVisible();
    await expect(stage.getByRole("button", { name: "Cerrar el pasaporte" })).toBeVisible();
  });

  test("carta: la campana se levanta con el botón y la fecha queda a la vista", async ({
    page,
  }) => {
    await page.goto("/i/familia-garcia?plantilla=carta");
    const stage = cover(page, "carta");
    const cloche = stage.locator("[data-cloche]");
    await expect(cloche).toHaveAttribute("data-cloche", "puesta");
    await stage.getByRole("button", { name: "Destapar" }).click();
    await expect(cloche).toHaveAttribute("data-cloche", "levantada");
    await expect(stage.getByRole("button", { name: "Destapar" })).toHaveCount(0);
    // Los platos son el programa, con su hora.
    await expect(stage.getByText("Ceremonia")).toBeVisible();
    await expect(stage).toBeVisible();
  });

  test("tarot: la carta se gira y es la de los enamorados", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=tarot");
    const stage = cover(page, "tarot");
    const card = stage.locator("[data-side]");
    await expect(card).toHaveAttribute("data-side", "dorso");
    await stage.getByRole("button", { name: "Dar la vuelta a la carta" }).click();
    await expect(card).toHaveAttribute("data-side", "cara");
    await expect(stage.getByText("Los enamorados")).toBeVisible();
    await expect(stage.getByText("XX · XI · MMXXVII")).toBeVisible();
  });

  test("mapa: seguir la ruta con el puntero hasta la X abre la invitación", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=mapa");
    const stage = cover(page, "mapa");
    const map = stage.locator("svg[data-route]");
    await expect(map).toHaveAttribute("data-route", "pendiente");
    const box = (await map.boundingBox())!;
    // El dibujo mide 360 × 500 y se ajusta centrado dentro de su hueco.
    const scale = Math.min(box.width / 360, box.height / 500);
    const left = box.x + (box.width - 360 * scale) / 2;
    const top = box.y + (box.height - 500 * scale) / 2;
    const route = [
      [52, 452],
      [83, 398],
      [96, 344],
      [118, 322],
      [174, 322],
      [222, 308],
      [232, 290],
      [208, 236],
      [200, 186],
      [214, 170],
      [268, 164],
      [302, 132],
      [306, 112],
    ];
    await page.mouse.move(left + 52 * scale, top + 452 * scale);
    await page.mouse.down();
    for (const [x, y] of route) {
      await page.mouse.move(left + x! * scale, top + y! * scale, { steps: 6 });
    }
    await page.mouse.up();
    await expect(map).toHaveAttribute("data-route", "hecha");
    await expectOpened(page, "mesa");
  });

  test("constelación: cada toque une una estrella y, al completarla, se abre", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=constelacion");
    const stage = cover(page, "constelacion");
    const sky = stage.locator("svg[data-stars]");
    await expect(sky).toHaveAttribute("data-stars", "sueltas");
    // Los actos del programa dan nombre a las estrellas.
    await expect(sky.getByText("Ceremonia")).toBeVisible();
    for (let i = 0; i < 3; i += 1) await sky.click();
    await expect(sky).toHaveAttribute("data-stars", "unidas");
    await expectOpened(page, "pantalla");
  });

  test("cómic: las viñetas se pasan con los botones y la última trae la fecha", async ({
    page,
  }) => {
    await page.goto("/i/familia-garcia?plantilla=comic");
    const stage = cover(page, "comic");
    await expect(stage.getByText("¡Estáis invitados!")).toBeVisible();
    await expect(stage.getByRole("button", { name: "Viñeta anterior" })).toBeDisabled();
    await stage.getByRole("button", { name: "Viñeta siguiente" }).click();
    await expect(stage.getByText(/Mientras tanto, en/)).toBeVisible();
    await stage.getByRole("button", { name: "Viñeta siguiente" }).click();
    await expect(stage.getByText("5 de junio de 2027")).toBeVisible();
    await expect(stage.getByRole("button", { name: "Viñeta siguiente" })).toBeDisabled();
    // Pasar viñetas no levanta la portada.
    await expect(stage).toBeVisible();
  });

  test("semillas: al sembrar brotan las flores y el botón queda hecho", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=semillas");
    const stage = cover(page, "semillas");
    const bed = stage.locator("[data-sown]");
    await expect(bed).toHaveAttribute("data-sown", "no");
    await stage.getByRole("button", { name: "Sembrar", exact: true }).click();
    await expect(bed).toHaveAttribute("data-sown", "si");
    await expect(stage.getByRole("button", { name: "Sembrado" })).toBeDisabled();
  });

  test("con movimiento reducido las portadas se abren sin esperar animaciones", async ({
    browser,
  }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    for (const id of ["vinilo", "cosecha", "arcade"] as const) {
      await page.goto(`/i/familia-garcia?plantilla=${id}`);
      await cover(page, id)
        .getByRole("button", { name: /toca para abrir/i })
        .click();
      await expectOpened(page, id === "cosecha" ? "mesa" : "pantalla");
    }
    await context.close();
  });
});
