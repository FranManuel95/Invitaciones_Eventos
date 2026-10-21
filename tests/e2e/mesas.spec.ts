import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Plano de mesas y recordatorios de la demo (los cambios no se guardan).
test.describe("mesas y recordatorios", () => {
  test("sienta una invitación con el teclado y avisa si la mesa se llena de más", async ({
    page,
  }) => {
    await page.goto("/panel/demo/mesas");
    const presidential = page.getByRole("listitem").filter({
      has: page.getByRole("heading", { name: "Presidencial" }),
    });
    await expect(presidential).toContainText("0 de 8 sitios");

    // Primera invitación sin mesa: se sienta en la presidencial con su desplegable.
    const first = page.locator("[id^='mesa-']").first();
    const name = (await first.getAttribute("id"))!.slice("mesa-".length);
    await first.selectOption({ label: "Presidencial" });
    await expect(page.getByRole("status").first()).toContainText("Presidencial");
    await expect(presidential.locator(`#cambiar-${name}`)).toHaveValue("mesa-0");
  });

  test("las mesas se mueven con las flechas y se pueden añadir", async ({ page }) => {
    await page.goto("/panel/demo/mesas");
    const table = page.getByRole("button", { name: /^Mesa 1 \d/ });
    const before = await table.evaluate((el) => (el as HTMLElement).style.left);
    await table.focus();
    await page.keyboard.press("ArrowRight");
    await expect
      .poll(() => table.evaluate((el) => (el as HTMLElement).style.left))
      .not.toBe(before);

    await page.getByRole("button", { name: "Añadir mesa" }).click();
    const dialog = page.getByRole("dialog", { name: "Nueva mesa" });
    await expect(dialog.getByLabel("Nombre")).toHaveValue("Mesa 11");
    await dialog.getByLabel("Sitios").fill("6");
    await dialog.getByRole("button", { name: "Añadir mesa" }).click();
    await expect(page.getByRole("button", { name: /^Mesa 11 0\/6 sitios/ })).toBeVisible();
  });

  test("prepara el recordatorio por WhatsApp con el enlace y lo marca como avisado", async ({
    page,
  }) => {
    await page.goto("/panel/demo/comunicaciones");
    await expect(page.getByRole("heading", { level: 1, name: "Recordatorios" })).toBeVisible();
    const link = page.getByRole("link", { name: /^Recordar por WhatsApp/ }).first();
    const href = decodeURIComponent((await link.getAttribute("href")) ?? "");
    expect(href).toContain("María y Daniel");
    expect(href).toContain("15 de abril de 2027");
    expect(href).toMatch(/\/i\/[\w-]+$/);
    await link.evaluate((el) => el.removeAttribute("target"));
    await link.evaluate((el) => el.addEventListener("click", (e) => e.preventDefault()));
    await link.click();
    await expect(page.getByText("Avisada").first()).toBeVisible();
  });

  for (const path of ["/panel/demo/mesas", "/panel/demo/comunicaciones"]) {
    test(`sin desbordes ni infracciones graves en ${path}`, async ({ page }) => {
      await page.goto(path);
      await page.waitForTimeout(400);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
      const { violations } = await new AxeBuilder({ page }).analyze();
      const serious = violations.filter((v) => ["serious", "critical"].includes(v.impact ?? ""));
      expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(" | ")}`)).toEqual(
        [],
      );
    });
  }
});
