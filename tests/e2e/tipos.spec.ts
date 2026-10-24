import { expect, test } from "@playwright/test";

test.describe("otros tipos de evento", () => {
  test("un bautizo con un solo nombre se ve bien en la vista previa", async ({
    page,
    isMobile,
  }) => {
    await page.goto("/editor/demo");
    await page.getByRole("tab", { name: "Pareja y fecha" }).click();
    await page.getByLabel("Qué celebráis").selectOption("bautizo");
    await page.getByLabel("Primer nombre").fill("Lucía");
    await page.getByLabel("Segundo nombre").fill("");
    await expect(page.getByText(/La vista previa está en pausa/)).toHaveCount(0);
    if (isMobile) await page.getByRole("button", { name: "Vista previa" }).click();
    const preview = page.frameLocator('iframe[title="Vista previa de la invitación"]');
    // El título animado repite el texto para los lectores de pantalla: basta con que no haya «&».
    await expect(preview.locator("#cover-title")).toContainText("Lucía");
    await expect(preview.locator("#cover-title")).not.toContainText("&");
    await expect(preview.getByText(/se bautiza el/)).toBeVisible();
  });

  test("en una boda, quitar el segundo nombre pide escribirlo", async ({ page }) => {
    await page.goto("/editor/demo");
    await page.getByRole("tab", { name: "Pareja y fecha" }).click();
    await page.getByLabel("Segundo nombre").fill("");
    await expect(page.getByText("Escribe el segundo nombre.")).toBeVisible();
  });
});
