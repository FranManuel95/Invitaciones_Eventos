import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Portadas animadas: se leen bien, son accesibles y dejan abrir la invitación.
test.describe("portadas", () => {
  for (const scene of ["luces", "acuarela", "estrellas", "herbario"]) {
    test(`${scene}: título legible, accesible y se abre`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(`/i/familia-garcia?portada=${scene}`);
      await expect(page.locator(`[data-cover='${scene}']`)).toBeAttached();
      await expect(page.getByRole("heading", { level: 1, name: /María/ })).toBeVisible();
      await page.waitForTimeout(3200);
      const { violations } = await new AxeBuilder({ page }).analyze();
      const serious = violations.filter((v) => ["serious", "critical"].includes(v.impact ?? ""));
      expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(" | ")}`)).toEqual(
        [],
      );
      await page.getByRole("button", { name: /toca para abrir/i }).click();
      await expect(page.getByRole("button", { name: "Abrir el sobre" })).toBeVisible();
      expect(errors).toEqual([]);
    });
  }

  test("con movimiento reducido las escenas quedan quietas", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/i/familia-garcia?portada=luces");
    await expect(page.locator("[data-cover='luces']")).toBeAttached();
    const animated = await page
      .locator("[data-cover='luces'] .scene-fly, [data-cover='luces'] .scene-twinkle")
      .evaluateAll(
        (els) => els.filter((el) => getComputedStyle(el).animationName !== "none").length,
      );
    expect(animated).toBe(0);
    await expect(page.locator("canvas")).toHaveCount(0);
    await context.close();
  });

  test("herbario: con movimiento reducido las ramas ya están dibujadas", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/i/familia-garcia?portada=herbario");
    const drawn = page.locator("[data-cover='herbario'] .herb-draw");
    await expect(drawn.first()).toBeAttached();
    const hidden = await drawn.evaluateAll(
      (els) =>
        els.filter((el) => {
          const style = getComputedStyle(el);
          return style.animationName !== "none" || style.strokeDasharray !== "none";
        }).length,
    );
    expect(hidden).toBe(0);
    await context.close();
  });

  test("el editor cambia la portada de la vista previa", async ({ page }) => {
    await page.goto("/editor/demo");
    const preview = page.frameLocator('iframe[title="Vista previa de la invitación"]');
    await expect(preview.locator("[data-cover='foto']")).toBeAttached();
    await page.getByRole("tab", { name: "Portada", exact: true }).click();
    await page.getByRole("radio", { name: /Cielo estrellado/ }).check({ force: true });
    await expect(preview.locator("[data-cover='estrellas']")).toBeAttached();
    await page.getByRole("radio", { name: /Vuestro vídeo/ }).check({ force: true });
    await expect(page.getByText(/En la demo no se suben vídeos/)).toBeVisible();
  });
});
