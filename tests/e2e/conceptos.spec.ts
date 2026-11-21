import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/*
 * Plantillas de concepto de la ronda 20. Para todas: los nombres en el título, la fecha siempre en
 * la página, sin fallos graves de accesibilidad, el botón que abre y el rótulo de sección propio.
 * Después, la interacción de cada una.
 */
const CONCEPTS = [
  { id: "vinilo", names: /Nuria.*Dani/, date: "2 de octubre de 2027", opening: "concepto" },
  { id: "pasaporte", names: /Paula.*Íker/, date: "26/06/2027", opening: "concepto" },
  { id: "carta", names: /Rocío y Manu/, date: "29 de mayo de 2027", opening: "concepto" },
  { id: "mapa", names: /Aitana y Bruno/, date: "24 de julio de 2027", opening: "concepto" },
  {
    id: "constelacion",
    names: /Lola & Samuel/,
    date: "11 de diciembre de 2027",
    opening: "concepto",
  },
  { id: "comic", names: /Valeria y Jorge/, date: "05/06/27", opening: "concepto" },
  {
    id: "cosecha",
    names: /Blanca.*Rodrigo/,
    date: "25 de septiembre de 2027",
    opening: "concepto",
  },
  { id: "tarot", names: /Abril & Óscar/, date: "20 de noviembre de 2027", opening: "concepto" },
  { id: "arcade", names: /Leire.*Marc/, date: "3 de julio de 2027", opening: "concepto" },
  {
    id: "semillas",
    names: /Amor de Olivia y Tomás/,
    date: "17 de abril de 2027",
    opening: "concepto",
  },
  { id: "instantanea", names: /Carla & Hugo/, date: "11·09·27", opening: "concepto" },
  { id: "abanico", names: /Inma y Curro/, date: "24 de abril de 2027", opening: "concepto" },
  { id: "cerillas", names: /Marta & Quique/, date: "16 de octubre de 2027", opening: "concepto" },
] as const;

const cover = (page: Page, id: string) => page.locator(`[data-cover='${id}']`);

/** Tras la portada llega el sobre de la plantilla (a pantalla completa o sobre la mesa). */
async function expectOpened(page: Page) {
  await expect(page.locator("#envelope-title")).toBeAttached();
}

test.describe("plantillas de concepto (segunda tanda)", () => {
  test("la apertura de concepto, elegida a mano, trae la carta en el objeto", async ({ page }) => {
    await page.goto("/i/elena-y-pablo?plantilla=telegrama&apertura=concepto");
    await cover(page, "telegrama")
      .getByRole("button", { name: /toca para abrir/i })
      .click();
    const opening = page.locator("[data-opening='concepto']");
    await expect(opening.getByText("Servicio de telégrafos · Urgente")).toBeVisible();
    await expect(opening.getByRole("heading", { name: "Elena y Pablo" })).toBeVisible();
    await page.getByRole("button", { name: "Abrir el telegrama" }).click();
    await expect(page.getByRole("heading", { name: /^Hola, Elena y Pablo/ })).toBeVisible();
    // La carta lleva el membrete y la despedida del concepto.
    await expect(page.locator("article[data-layout] .concept-letterhead").first()).toHaveText(
      "Telegrama · Texto completo",
    );
    await expect(page.locator("article[data-layout] .concept-signoff").first()).toHaveText(
      "Fin del mensaje STOP",
    );
    const { violations } = await new AxeBuilder({ page }).analyze();
    expect(
      violations.filter((v) => ["serious", "critical"].includes(v.impact ?? "")).map((v) => v.id),
    ).toEqual([]);
  });

  test("en pantallas bajas el botón de abrir queda siempre a la vista", async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 375, height: 667 } });
    const page = await context.newPage();
    for (const id of [...CONCEPTS.map((c) => c.id), "telegrama", "postal"]) {
      await page.goto(`/i/familia-garcia?plantilla=${id}`);
      const open = cover(page, id)
        .getByRole("button", { name: /toca para abrir/i })
        .last();
      await expect(open).toBeInViewport({ ratio: 1 });
    }
    await context.close();
  });

  test("el pase del invitado se viste del concepto sin perder lo importante", async ({ page }) => {
    await page.goto("/i/elena-y-pablo?plantilla=embarque");
    await page.getByRole("button", { name: "Saltar intro" }).click();
    const next = page.getByRole("button", { name: /^(Siguiente|Revisar)/ });
    await page.getByRole("button", { name: "Sí, asistiré" }).click();
    await next.click();
    await page.getByText("No, iremos por nuestra cuenta").click();
    await page
      .getByRole("group", { name: /plazas en vuestro coche/ })
      .getByText("No", { exact: true })
      .click();
    await next.click();
    for (const name of ["Elena Vidal", "Pablo Serra"]) {
      await page
        .getByRole("group", { name: `Menú para ${name}` })
        .getByText("Pescado")
        .click();
    }
    await next.click();
    await next.click();
    await page.getByRole("button", { name: "Enviar respuesta" }).click();
    const pass = page.locator("#pase article");
    await expect(pass.getByText("Tarjeta de embarque")).toBeVisible();
    await expect(pass.getByRole("heading", { name: "Pase de Elena y Pablo" })).toBeVisible();
    await expect(pass.getByText("Pasajeros")).toBeVisible();
    // Las etiquetas que importan siguen diciendo mesa y autobús.
    await expect(pass.getByText("Asiento (mesa)")).toBeVisible();
    await expect(pass.getByText("Conexión en autobús")).toBeVisible();
    const { violations } = await new AxeBuilder({ page }).include("#pase").analyze();
    expect(
      violations.filter((v) => ["serious", "critical"].includes(v.impact ?? "")).map((v) => v.id),
    ).toEqual([]);
  });

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
      await expectOpened(page);
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
    await expectOpened(page);
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
    await expectOpened(page);
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

  test("instantánea: frotar la foto la revela, y también el botón", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=instantanea");
    const stage = cover(page, "instantanea");
    const photo = stage.locator("[data-developed]");
    await expect(photo).toHaveAttribute("data-developed", "no");
    // Frotar con el dedo no levanta la portada.
    const box = (await photo.boundingBox())!;
    await page.mouse.move(box.x + 20, box.y + 20);
    await page.mouse.down();
    for (let i = 0; i < 6; i++) {
      await page.mouse.move(box.x + box.width - 20, box.y + 30 + i * 30, { steps: 4 });
      await page.mouse.move(box.x + 20, box.y + 45 + i * 30, { steps: 4 });
    }
    await page.mouse.up();
    // Frotando se revela del todo, sin levantar la portada.
    await expect(photo).toHaveAttribute("data-developed", "si");
    await expect(stage).toBeVisible();
    await expect(stage.getByRole("button", { name: "Revelada" })).toBeDisabled();
    // Sin frotar, el botón hace lo mismo.
    await page.reload();
    await cover(page, "instantanea").getByRole("button", { name: "Revelar la foto" }).click();
    await expect(cover(page, "instantanea").locator("[data-developed]")).toHaveAttribute(
      "data-developed",
      "si",
    );
  });

  test("abanico: se despliega con el botón y con el dedo", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=abanico");
    const stage = cover(page, "abanico");
    const fan = stage.locator("[data-fan]");
    await expect(fan).toHaveAttribute("data-fan", "cerrado");
    const box = (await fan.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height * 0.6);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 + 180, box.y + box.height * 0.6, { steps: 10 });
    await page.mouse.up();
    await expect(fan).toHaveAttribute("data-fan", "abierto");
    await expect(stage.getByRole("button", { name: "Abanico abierto" })).toBeDisabled();
    await expect(stage).toBeVisible();
  });

  test("cerillas: al sacar una cerilla se enciende", async ({ page }) => {
    await page.goto("/i/familia-garcia?plantilla=cerillas");
    const stage = cover(page, "cerillas");
    await expect(stage.locator("[data-box]")).toHaveAttribute("data-box", "cerrada");
    await stage.getByRole("button", { name: "Sacar una cerilla" }).click();
    await expect(stage.locator("[data-box]")).toHaveAttribute("data-box", "abierta");
    await expect(stage.locator("[data-lit]")).toBeAttached();
    await expect(stage.getByRole("button", { name: "Cerilla encendida" })).toBeDisabled();
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
      await expectOpened(page);
    }
    await context.close();
  });
});
