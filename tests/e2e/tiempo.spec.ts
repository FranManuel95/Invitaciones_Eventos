import { expect, test } from "@playwright/test";

test.describe("tiempo habitual", () => {
  test("la invitación lo cuenta en «Antes de venir»", async ({ page }) => {
    await page.goto("/i/carlos-ruiz");
    await page.getByRole("button", { name: "Saltar intro" }).click();
    await expect(
      page.locator("#info").getByText("Suele hacer entre 11 y 24 °C.", { exact: false }),
    ).toBeAttached();
  });

  test("en el editor se puede retocar o dejar de mostrar", async ({ page }) => {
    await page.goto("/editor/demo");
    await page.getByRole("tab", { name: "Pareja y fecha" }).click();
    await expect(page.getByLabel("Máxima (°C)")).toHaveValue("24");
    await page.getByLabel("Máxima (°C)").fill("27");
    await expect(page.getByText("Suele hacer entre 11 y 27 °C.", { exact: false })).toBeVisible();
    await page.getByRole("button", { name: "No mostrarlo" }).click();
    await expect(page.getByRole("button", { name: "Calcular el tiempo habitual" })).toBeVisible();
  });
});
