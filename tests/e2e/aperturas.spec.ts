import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Las aperturas distintas del sobre en la mesa: cada una se abre una sola vez, llega a la carta y es accesible.
const OPENINGS = [
  { opening: "pantalla", button: "Abrir el sobre", heading: "Familia García" },
  { opening: "diptico", button: "Abrir la invitación", heading: "Familia García" },
  { opening: "caja", button: "Abrir la caja", heading: "Familia García" },
  { opening: "foto", button: "Abrir el sobre", heading: "Familia García" },
];

test.describe("aperturas", () => {
  for (const { opening, button, heading } of OPENINGS) {
    test(`${opening}: se abre una vez y llega a la carta`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(`/i/familia-garcia?apertura=${opening}`);
      await page.getByRole("button", { name: /toca para abrir/i }).click();
      await expect(page.locator(`[data-opening='${opening}']`)).toBeAttached();
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();

      const { violations } = await new AxeBuilder({ page }).analyze();
      const serious = violations.filter((v) => ["serious", "critical"].includes(v.impact ?? ""));
      expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(" | ")}`)).toEqual(
        [],
      );

      const trigger = page.getByRole("button", { name: button });
      await trigger.click();
      // Toques extra a mitad de la apertura: no la relanzan.
      await page.waitForTimeout(300);
      await trigger.click({ force: true }).catch(() => {});
      const letter = page.getByRole("heading", { name: "Hola, Familia García:" });
      await expect(letter).toBeVisible({ timeout: 10_000 });
      await expect(letter).toBeFocused();
      expect(errors).toEqual([]);
    });
  }

  test("con movimiento reducido las aperturas pasan directas a la carta", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    for (const { opening, button } of OPENINGS) {
      await page.goto(`/i/elena-y-pablo?apertura=${opening}`);
      await page.evaluate(() => sessionStorage.clear());
      await page.reload();
      await page.getByRole("button", { name: /toca para abrir/i }).click();
      await page.getByRole("button", { name: button }).click();
      await expect(page.getByRole("heading", { name: /^Hola, Elena y Pablo/ })).toBeVisible({
        timeout: 2000,
      });
    }
    await context.close();
  });
});
