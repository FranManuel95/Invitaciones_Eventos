import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PAGES = [
  "/panel/demo",
  "/panel/demo/invitados",
  "/panel/demo/transporte",
  "/panel/demo/menus",
  "/panel/demo/comunicaciones",
  "/panel/demo/regalos",
  "/panel/demo/imprimir",
];

test.describe("panel del organizador", () => {
  test("muestra el resumen con métricas", async ({ page }) => {
    await page.goto("/panel/demo");
    await expect(page.getByRole("heading", { level: 1, name: "Hola, María" })).toBeVisible();
    await expect(page.locator("dt", { hasText: /^Invitados$/ })).toBeVisible();
    await expect(page.getByText("150", { exact: true }).first()).toBeVisible();
  });

  test("filtra y busca invitados", async ({ page, isMobile }) => {
    await page.goto("/panel/demo/invitados?estado=pending");
    await expect(page.getByRole("radio", { name: "Pendientes" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    await page.getByRole("radio", { name: "Todos" }).click();
    await page.getByRole("searchbox", { name: "Buscar invitado o grupo" }).fill("garcia");
    await expect(page.getByText(/^3 invitados/)).toBeVisible();
    // Los filtros se reflejan en la URL y sobreviven a una recarga.
    await expect(page).toHaveURL(/q=garcia/);
    await page.reload();
    await expect(page.getByRole("searchbox", { name: "Buscar invitado o grupo" })).toHaveValue(
      "garcia",
    );
    await expect(page.getByText(/^3 invitados/)).toBeVisible();
    const scope = isMobile ? page.getByRole("list").last() : page.getByRole("table");
    await expect(scope.getByText("Lucía García Ortega")).toBeVisible();
    await page.getByRole("searchbox", { name: "Buscar invitado o grupo" }).fill("zzz");
    await expect(page.getByText("Ningún invitado coincide con estos filtros")).toBeVisible();
  });

  for (const path of PAGES) {
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

test.describe("aperturas de las invitaciones", () => {
  test("el panel distingue las abiertas de las que nadie ha abierto", async ({ page }) => {
    await page.goto("/panel/demo");
    await expect(page.getByText(/aún no la han abierto/)).toBeVisible();
    await page.goto("/panel/demo/invitaciones");
    await expect(page.getByText("Sin abrir").first()).toBeVisible();
    await expect(page.getByText(/^Abierta el \d{2}\/\d{2}\/\d{4}$/).first()).toBeVisible();
    // Los recordatorios empiezan por las que nadie ha abierto.
    await page.goto("/panel/demo/comunicaciones");
    const first = page
      .getByRole("listitem")
      .filter({ hasText: /Sin abrir|Abierta el/ })
      .first();
    await expect(first).toContainText("Sin abrir");
  });
});
