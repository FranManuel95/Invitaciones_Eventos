import { expect, test } from "@playwright/test";

// Lo que se enseña al grabar la demo para Instagram (?grabar=1) y los pases de una tarjeta.
test.describe("grabación y pases", () => {
  test("al grabar se esconden la vestimenta y los datos de pago, pero no lo demás", async ({
    page,
  }) => {
    await page.goto("/i/familia-garcia?plantilla=arcilla&grabar=1");
    await page.getByRole("button", { name: /toca para abrir/i }).click();
    await page.getByRole("button", { name: "Abrir el sobre" }).click();
    await page.getByRole("button", { name: "Descubrir la invitación" }).click({ timeout: 40_000 });

    const info = page.locator("#info");
    await expect(info.getByText("Dónde dormir")).toBeAttached();
    await expect(info.getByText("Colores que nos gustan")).toHaveCount(0);
    await expect(info.getByText("Formal de jardín")).toHaveCount(0);
    await expect(info.getByText("Ellas", { exact: true })).toHaveCount(0);

    const gift = page.locator("#regalo");
    await expect(gift.getByText("Por Bizum")).toHaveCount(0);
    await expect(gift.getByRole("button", { name: "Copiar número de cuenta" })).toHaveCount(0);
    // Los regalos en sí se quedan.
    await expect(gift.getByRole("list", { name: "Lista de regalos" })).toBeAttached();
  });

  test("sin grabar, la vestimenta y los datos de pago siguen en la demo", async ({ page }) => {
    await page.goto("/i/carlos-ruiz");
    await page.getByRole("button", { name: "Saltar intro" }).click();
    await expect(page.locator("#info").getByText("Colores que nos gustan")).toBeAttached();
    await expect(page.locator("#regalo").getByText("Por Bizum")).toBeAttached();
  });

  test("en el móvil, los regalos y las notas se ven de una en una, con flechas", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "movil", "Las flechas solo salen en el móvil.");
    await page.goto("/i/carlos-ruiz");
    await page.getByRole("button", { name: "Saltar intro" }).click();

    for (const [lista, nombre] of [
      ["Lista de regalos", "Regalo"],
      ["Mensajes del libro de firmas", "Mensaje"],
    ] as const) {
      const rail = page.getByRole("list", { name: lista });
      await rail.scrollIntoViewIfNeeded();
      const first = rail.getByRole("listitem").first();
      const [railBox, firstBox] = [await rail.boundingBox(), await first.boundingBox()];
      // Una sola tarjeta ocupa el ancho del pase: no asoma la siguiente.
      expect(firstBox!.width).toBeGreaterThan(railBox!.width * 0.85);
      const next = page.getByRole("button", { name: `${nombre} siguiente` });
      await expect(next).toBeVisible();
      await expect(page.getByText(/^1 de \d+$/).first()).toBeVisible();
      await next.click();
      await expect(page.getByText(/^2 de \d+$/).first()).toBeVisible();
    }
  });
});
