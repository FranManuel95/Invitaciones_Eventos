import { expect, test } from "@playwright/test";

test.describe("tiempo habitual", () => {
  test("la invitación lo cuenta en «Antes de venir»", async ({ page }) => {
    await page.goto("/i/carlos-ruiz");
    await page.getByRole("button", { name: "Saltar intro" }).click();
    await expect(
      page.locator("#info").getByText("Suele hacer entre 11 y 24 °C.", { exact: false }),
    ).toBeAttached();
  });

  test("cuando falta poco, enseña la previsión del día", async ({ page }) => {
    await page.goto("/i/carlos-ruiz?prevision=1");
    await page.getByRole("button", { name: "Saltar intro" }).click();
    await expect(page.locator("#info").getByText("Previsión para el día.")).toBeAttached();
    await expect(
      page.locator("#info").getByText("Entre 13 y 24 °C. Sin lluvia a la vista."),
    ).toBeAttached();
  });

  test("en el editor se ve, sin cifras a mano, y se puede dejar de mostrar", async ({ page }) => {
    await page.goto("/editor/demo");
    await page.getByRole("tab", { name: "Pareja y fecha" }).click();
    await expect(page.getByText("Suele hacer entre 11 y 24 °C.", { exact: false })).toBeVisible();
    await expect(page.getByLabel("Máxima (°C)")).toHaveCount(0);
    await expect(page.getByText("la invitación pasa a enseñar la previsión real")).toBeVisible();
    await page.getByRole("button", { name: "No mostrarlo" }).click();
    await expect(page.getByRole("button", { name: "Mostrar el tiempo" })).toBeVisible();
  });
});
