import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("experiencia del invitado", () => {
  test("abre el sobre y llega a la invitación", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto("/i/familia-garcia");
    await expect(page.getByRole("heading", { level: 1, name: /María/ })).toBeVisible();

    await page.getByRole("button", { name: /toca para abrir/i }).click();
    await expect(page.getByRole("heading", { name: "Familia García" })).toBeVisible();

    await page.getByRole("button", { name: "Abrir el sobre" }).click();
    await expect(page.getByRole("heading", { name: "¡Hola!" })).toBeVisible({ timeout: 8000 });
    await expect(page.getByRole("heading", { name: "¡Hola!" })).toBeFocused();

    await page.getByRole("button", { name: "Ver la invitación" }).click();
    await expect(page.getByRole("heading", { name: "El gran día" })).toBeAttached();
    expect(errors).toEqual([]);
  });

  test("se puede saltar la introducción y no se repite en la sesión", async ({ page }) => {
    await page.goto("/i/carlos-ruiz");
    await page.getByRole("button", { name: "Saltar intro" }).click();
    await expect(page.locator("#content-title")).toBeFocused();
    await page.reload();
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
    await expect(page.getByRole("heading", { name: "¡Hola!" })).toBeVisible({ timeout: 2000 });
    await context.close();
  });

  test("RSVP completo: acompañante, autobús, menús y confirmación persistente", async ({
    page,
  }) => {
    await page.goto("/i/familia-garcia");
    await page.getByRole("button", { name: "Saltar intro" }).click();
    await page.getByRole("button", { name: "Sí, asistiré" }).click();

    await page.getByRole("button", { name: "Añadir acompañante" }).click();
    await page.getByRole("button", { name: "Continuar" }).click();
    await expect(page.getByText("Escribe el nombre de tu acompañante.")).toBeVisible();
    await page.getByLabel("Nombre del acompañante 1").fill("Jaime Torres");
    await page.getByRole("button", { name: "Continuar" }).click();

    await page.getByText("Sí, necesitamos plaza").click();
    await page.getByLabel("Punto de recogida").selectOption("madrid");
    await page.getByRole("button", { name: "Continuar" }).click();

    for (const name of ["Lucía García", "Andrés García", "Jaime Torres"]) {
      await page
        .getByRole("group", { name: `Menú para ${name}` })
        .getByText("Carne")
        .click();
    }
    await page.getByRole("button", { name: "Continuar" }).click();
    await page.getByRole("button", { name: "Continuar" }).click();
    await expect(page.getByRole("heading", { name: "Todo listo" })).toBeVisible();
    await page.getByRole("button", { name: "Enviar respuesta" }).click();

    await expect(page.getByRole("heading", { name: /Gracias por confirmar/ })).toBeVisible();
    await expect(page.getByText("Sí, 4 personas")).toBeVisible();
    await page.reload();
    await expect(page.getByRole("heading", { name: /Gracias por confirmar/ })).toBeVisible();
  });

  test("muestra un error recuperable al enviar", async ({ page }) => {
    await page.goto("/i/prueba-error");
    await page.getByRole("button", { name: "Saltar intro" }).click();
    await page.getByRole("button", { name: "No podré asistir" }).click();
    await page.getByRole("button", { name: "Continuar" }).click();
    await page.getByRole("button", { name: "Enviar respuesta" }).click();
    await expect(
      page.getByRole("alert").filter({ hasText: "No hemos podido guardar" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Reintentar" }).click();
    await expect(page.getByRole("heading", { name: "Gracias por avisarnos" })).toBeVisible();
  });

  test("respeta el plazo cerrado", async ({ page }) => {
    await page.goto("/i/plazo-cerrado");
    await page.getByRole("button", { name: "Saltar intro" }).click();
    await expect(page.getByRole("heading", { name: "El plazo ha terminado" })).toBeAttached();
  });

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
