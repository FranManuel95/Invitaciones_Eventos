import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// El botón de avance nombra su destino: «Siguiente: transporte», «Revisar respuesta»…
const next = (page: Page) => page.getByRole("button", { name: /^(Siguiente|Revisar)/ });

test.describe("experiencia del invitado", () => {
  test("abre el sobre y llega a la invitación", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto("/i/familia-garcia");
    await expect(page.getByRole("heading", { level: 1, name: /María/ })).toBeVisible();

    await page.getByRole("button", { name: /toca para abrir/i }).click();
    await expect(page.getByRole("heading", { name: "Familia García" })).toBeVisible();

    await page.getByRole("button", { name: "Abrir el sobre" }).click();
    const letter = page.getByRole("heading", { name: "Hola, Familia García:" });
    await expect(letter).toBeVisible({ timeout: 8000 });
    await expect(letter).toBeFocused();

    await page.getByRole("button", { name: "Ver la invitación" }).click();
    await expect(page.getByRole("heading", { name: "El día" })).toBeAttached();
    expect(errors).toEqual([]);
  });

  test("varios toques al sobre no repiten la apertura", async ({ page }) => {
    await page.goto("/i/familia-garcia");
    await page.getByRole("button", { name: /toca para abrir/i }).click();
    const envelope = page.getByRole("button", { name: "Abrir el sobre" });
    await envelope.click();
    // Toques extra a mitad de la apertura (doble toque, o un clic tardío en iOS).
    await page.waitForTimeout(400);
    await envelope.click({ force: true });
    await page.waitForTimeout(900);
    await envelope.click({ force: true }).catch(() => {});
    // La solapa nunca vuelve hacia atrás: su ángulo solo crece hasta que se retira.
    const angles: number[] = [];
    for (let i = 0; i < 8; i++) {
      const angle = await page
        .locator("[data-flap]")
        .evaluate((el) => Number(/rotateX\(([-\d.]+)deg\)/.exec(el.style.transform)?.[1] ?? 0))
        .catch(() => null);
      if (angle !== null) angles.push(angle);
      await page.waitForTimeout(120);
    }
    expect(angles).toEqual([...angles].sort((x, y) => x - y));
    await expect(page.getByRole("heading", { name: "Hola, Familia García:" })).toBeVisible({
      timeout: 8000,
    });
  });

  test("se puede saltar la introducción y al volver la apertura es corta", async ({ page }) => {
    await page.goto("/i/carlos-ruiz");
    await expect(page.getByRole("heading", { name: "María & Daniel", level: 1 })).toBeAttached();
    await page.getByRole("button", { name: "Saltar intro" }).click();
    await expect(page.locator("#content-title")).toBeFocused();
    await page.reload();
    // Apertura corta (foto y nombres) y, sin tocar nada, el contenido.
    await expect(page.locator("#brief-title")).toBeVisible();
    await expect(
      page.getByRole("navigation", { name: "Secciones de la invitación" }),
    ).toBeVisible();
  });

  test("con movimiento reducido el sobre se abre sin animación 3D", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/i/elena-y-pablo");
    await page.getByRole("button", { name: /toca para abrir/i }).click();
    await page.getByRole("button", { name: "Abrir el sobre" }).click();
    await expect(page.getByRole("heading", { name: /^Hola, Elena y Pablo/ })).toBeVisible({
      timeout: 2000,
    });
    // Sin portada en WebGL ni apertura corta al volver: directo al contenido.
    await expect(page.locator("canvas")).toHaveCount(0);
    await page.getByRole("button", { name: "Saltar intro" }).click();
    await page.reload();
    await expect(page.locator("#brief-title")).toHaveCount(0);
    await expect(
      page.getByRole("navigation", { name: "Secciones de la invitación" }),
    ).toBeVisible();
    await context.close();
  });

  test("RSVP con autobús: 3 de 4 plazas, pase y estado visibles", async ({ page }) => {
    await page.goto("/i/familia-garcia");
    await page.getByRole("button", { name: "Saltar intro" }).click();
    await page.getByRole("button", { name: "Sí, asistiré" }).click();

    await page.getByRole("button", { name: "Añadir acompañante" }).click();
    await next(page).click();
    await expect(page.getByText("Escribe el nombre de tu acompañante.")).toBeVisible();
    await page.getByLabel("Nombre del acompañante 1").fill("Jaime Torres");
    await next(page).click();

    await page.getByText("Sí, usaremos el autobús").click();
    await page.getByLabel("Punto de recogida").selectOption("madrid");
    await expect(page.locator("output#busSeats")).toHaveText("4");
    await page.getByRole("button", { name: "Quitar una (Plazas de autobús)" }).click();
    await next(page).click();

    for (const name of ["Lucía García", "Andrés García", "Jaime Torres"]) {
      await page
        .getByRole("group", { name: `Menú para ${name}` })
        .getByText("Carne")
        .click();
    }
    await next(page).click();
    await page.getByLabel("¿Qué canción no puede faltar?").fill("September");
    await next(page).click();
    await expect(page.getByRole("heading", { name: "Todo listo" })).toBeVisible();
    await page.getByRole("button", { name: "Enviar respuesta" }).click();

    await expect(page.getByRole("heading", { name: /Gracias por confirmar/ })).toBeVisible();
    const status = page.getByRole("complementary", { name: "Tu respuesta" });
    await expect(status).toContainText("Confirmado: 4 personas");
    await expect(status).toContainText("Autobús: Sí");
    await expect(status).toContainText("3 plazas desde Hotel Plaza de España, Madrid");
    await expect(page.getByRole("heading", { name: "Pase de Familia García" })).toBeVisible();
    await expect(page.getByRole("img", { name: /Código QR de demostración/ })).toBeVisible();

    await page.reload();
    await expect(page.getByRole("complementary", { name: "Tu respuesta" })).toContainText(
      "Autobús: Sí",
    );
  });

  test("RSVP sin autobús: queda claro el «no»", async ({ page }) => {
    await page.goto("/i/elena-y-pablo");
    await page.getByRole("button", { name: "Saltar intro" }).click();
    await page.getByRole("button", { name: "Sí, asistiré" }).click();
    await next(page).click();
    await page.getByText("No, iremos por nuestra cuenta").click();
    await page
      .getByRole("group", { name: /plazas en vuestro coche/ })
      .getByText("No", { exact: true })
      .click();
    await next(page).click();
    for (const name of ["Elena Vidal", "Pablo Serra"]) {
      await page
        .getByRole("group", { name: `Menú para ${name}` })
        .getByText("Pescado")
        .click();
    }
    await next(page).click();
    await next(page).click();
    await page.getByRole("button", { name: "Enviar respuesta" }).click();
    const status = page.getByRole("complementary", { name: "Tu respuesta" });
    await expect(status).toContainText("Autobús: No");
    await expect(status).toContainText("Vais por vuestra cuenta");
    await expect(page.locator("#transporte")).toContainText("Autobús: No");
  });

  test("calendario y regalo", async ({ page, context, browserName }) => {
    test.skip(browserName !== "chromium", "Permisos de portapapeles solo en Chromium");
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/i/carlos-ruiz");
    await page.getByRole("button", { name: "Saltar intro" }).click();
    await expect(page.getByRole("heading", { name: "Guarda la fecha" })).toBeAttached();
    await expect(page.getByRole("cell", { name: /22 \(día de la boda\)/ })).toBeAttached();
    await expect(page.getByText(/^Faltan \d+ días, \d+ horas y \d+ minutos\.$/)).toBeAttached();
    await expect(page.getByRole("link", { name: /Google Calendar/ })).toHaveAttribute(
      "href",
      /calendar\.google\.com/,
    );
    await page.getByRole("button", { name: "Copiar número de cuenta" }).click();
    await expect(page.getByText("Número de cuenta copiado.")).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      "ES0000000000000000000000",
    );
  });

  test("modo día de la boda: acto actual y siguiente", async ({ page }) => {
    await page.goto("/i/carlos-ruiz?dia=boda&hora=19:10");
    await page.getByRole("button", { name: "Saltar intro" }).click();
    const live = page.getByRole("region", { name: "Hoy es el día" });
    await expect(live).toBeVisible();
    await expect(live.getByText("Demo: son las 19:10")).toBeVisible();
    await expect(live.getByRole("definition").filter({ hasText: "Cóctel" }).first()).toBeVisible();
    await expect(live.getByText("en 1 h 50 min")).toBeVisible();
    await expect(page.locator('[aria-current="step"]')).toContainText("Cóctel");
    await expect(page.getByRole("heading", { name: "Guarda la fecha" })).toHaveCount(0);
    await expect(page.getByText(/^Faltan \d+ días/)).toHaveCount(0);
    await expect(page.getByText(/horas y \d+ minutos/)).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Qué pasa ahora" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Nuestra historia" })).toBeAttached();
  });

  test("muestra un error recuperable al enviar", async ({ page }) => {
    await page.goto("/i/prueba-error");
    await page.getByRole("button", { name: "Saltar intro" }).click();
    await page.getByRole("button", { name: "No podré asistir" }).click();
    await next(page).click();
    await page.getByRole("button", { name: "Enviar respuesta" }).click();
    await expect(
      page.getByRole("alert").filter({ hasText: "No hemos podido guardar" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Reintentar" }).click();
    await expect(page.getByRole("heading", { name: "Gracias por avisarnos" })).toBeVisible();
  });

  test("avisa antes de salir con una respuesta a medias", async ({ page }) => {
    await page.goto("/i/familia-garcia");
    await page.getByRole("button", { name: "Saltar intro" }).click();
    await page.getByRole("button", { name: "Sí, asistiré" }).click();
    await page.getByRole("button", { name: "Añadir acompañante" }).click();
    const dialog = page.waitForEvent("dialog");
    await page.close({ runBeforeUnload: true });
    expect((await dialog).type()).toBe("beforeunload");
  });

  test("respeta el plazo cerrado", async ({ page }) => {
    await page.goto("/i/plazo-cerrado");
    await page.getByRole("button", { name: "Saltar intro" }).click();
    await expect(page.getByRole("heading", { name: "El plazo ha terminado" })).toBeAttached();
  });

  test("el tema cambia estilo, sobre y calendario sin perder accesibilidad", async ({ page }) => {
    await page.goto("/i/carlos-ruiz?estilo=noche&sobre=kraft&lacre=oro&calendario=minimal");
    await expect(page.locator("[data-style='noche']")).toBeAttached();
    await page.getByRole("button", { name: "Saltar intro" }).click();
    await expect(page.locator("[data-calendar='minimal']")).toBeAttached();
    await expect(page.getByRole("cell", { name: /22 \(día de la boda\)/ })).toBeAttached();
    for (let i = 0; i < 20; i++) await page.mouse.wheel(0, 600);
    await page.waitForTimeout(1500);
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) =>
      ["serious", "critical"].includes(v.impact ?? ""),
    );
    expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(" | ")}`)).toEqual([]);
  });

  for (const [plantilla, calendario] of [
    ["medianoche", "poster"],
    ["costa", "semana"],
    ["empolvado", "corazon"],
  ]) {
    test(`plantilla ${plantilla}: calendario ${calendario} accesible`, async ({ page }) => {
      await page.goto(`/i/carlos-ruiz?plantilla=${plantilla}`);
      await page.getByRole("button", { name: "Saltar intro" }).click();
      await expect(page.locator(`[data-calendar='${calendario}']`)).toBeAttached();
      await expect(page.locator("#fecha").getByText("(día de la boda)")).toBeAttached();
      for (let i = 0; i < 20; i++) await page.mouse.wheel(0, 600);
      await page.waitForTimeout(1500);
      const results = await new AxeBuilder({ page }).analyze();
      const serious = results.violations.filter((v) =>
        ["serious", "critical"].includes(v.impact ?? ""),
      );
      expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(" | ")}`)).toEqual(
        [],
      );
    });
  }

  test("un token desconocido devuelve 404", async ({ page }) => {
    const response = await page.goto("/i/no-existe");
    expect(response?.status()).toBe(404);
  });

  test("sin infracciones de accesibilidad graves", async ({ page }) => {
    await page.goto("/i/familia-garcia");
    await page.waitForTimeout(3500);
    const cover = await new AxeBuilder({ page }).analyze();
    await page.getByRole("button", { name: "Saltar intro" }).click();
    await page.waitForTimeout(1200);
    // Las apariciones progresivas parten de opacidad 0: se recorre la página antes de auditar.
    for (let i = 0; i < 20; i++) await page.mouse.wheel(0, 600);
    await page.waitForTimeout(1500);
    const content = await new AxeBuilder({ page }).analyze();
    const serious = [...cover.violations, ...content.violations].filter((v) =>
      ["serious", "critical"].includes(v.impact ?? ""),
    );
    expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(" | ")}`)).toEqual([]);
  });
});
