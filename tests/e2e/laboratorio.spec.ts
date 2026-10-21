import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("laboratorio del sobre 3D", () => {
  test("se enlaza desde la portada y abre el sobre (o muestra la alternativa)", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Comparar con el sobre 3D" }).click();
    await expect(page.getByRole("heading", { name: "Sobre 3D con WebGL" })).toBeVisible();
    const open = page.getByRole("button", { name: "Abrir el sobre" });
    const fallback = page.getByText("Este navegador no puede mostrar gráficos 3D");
    await expect(open.or(fallback)).toBeVisible();
    if (await open.isVisible()) {
      await expect(page.locator("canvas")).toBeAttached();
      await open.click();
      await expect(page.getByRole("status")).toContainText("está fuera del sobre", {
        timeout: 15_000,
      });
      await expect(page.getByRole("button", { name: "Volver a cerrar" })).toBeVisible();
    }
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
    const { violations } = await new AxeBuilder({ page }).analyze();
    expect(violations.filter((v) => ["serious", "critical"].includes(v.impact ?? ""))).toEqual([]);
  });

  test("con movimiento reducido remite al sobre CSS", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/laboratorio/sobre-3d");
    await expect(page.getByText("Tienes activado «reducir movimiento»")).toBeVisible();
    await expect(page.locator("canvas")).toHaveCount(0);
    await context.close();
  });
});
