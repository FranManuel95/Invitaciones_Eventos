import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Tareas, presupuesto, agenda y ajustes de la demo (los cambios no se guardan).
test.describe("organización del evento", () => {
  test("tareas: marcar como hecha, filtrar y añadir", async ({ page }) => {
    await page.goto("/panel/demo/tareas");
    await expect(page.getByText(/^\d+ pendientes · 1 vencida/)).toBeVisible();
    const overdue = page.getByRole("checkbox", { name: /Elegir el catering/ });
    await expect(overdue).not.toBeChecked();
    // Al marcarla sale de «Pendientes»: se pulsa sin esperar a verla marcada aquí.
    await overdue.click();
    await expect(page.getByText(/^\d+ pendientes · Demo/)).toBeVisible();

    await page.getByRole("radio", { name: "Hechas" }).click();
    await expect(
      page.getByRole("checkbox", { name: /Elegir el catering/ }),
    ).toBeChecked();

    await page.getByRole("button", { name: "Nueva tarea" }).click();
    const dialog = page.getByRole("dialog", { name: "Nueva tarea" });
    await dialog.getByRole("button", { name: "Añadir tarea" }).click();
    await expect(dialog.getByText("Escribe la tarea.")).toBeVisible();
    await dialog.getByLabel("Tarea").fill("Elegir los zapatos");
    await dialog.getByLabel("Responsable").fill("María");
    await dialog.getByRole("button", { name: "Añadir tarea" }).click();
    await page.getByRole("radio", { name: "Pendientes" }).click();
    await expect(page.getByRole("checkbox", { name: /Elegir los zapatos/ })).toBeVisible();
  });

  test("presupuesto: los totales cambian al añadir una partida", async ({ page }) => {
    await page.goto("/panel/demo/presupuesto");
    const estimated = page.locator("dd").first();
    await expect(estimated).toHaveText(/29\.150\s€/);
    await page.getByRole("button", { name: "Nueva partida" }).click();
    const dialog = page.getByRole("dialog", { name: "Nueva partida" });
    await dialog.getByLabel("Concepto").fill("Peluquería");
    await dialog.getByLabel("Estimado (€)").fill("350");
    await dialog.getByRole("button", { name: "Añadir partida" }).click();
    await expect(estimated).toHaveText(/29\.500\s€/);
    await expect(page.getByText("Partida añadida: Peluquería.")).toBeVisible();
  });

  test("agenda: el plazo y la boda aparecen en su mes", async ({ page }) => {
    await page.goto("/panel/demo/agenda");
    await expect(page.getByRole("heading", { name: /octubre de 2026/i })).toBeVisible();
    for (let i = 0; i < 6; i++) await page.getByRole("button", { name: "Mes siguiente" }).click();
    await expect(page.getByRole("heading", { name: /abril de 2027/i })).toBeVisible();
    await expect(
      page.getByRole("cell").filter({ hasText: "Último día para confirmar" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Mes siguiente" }).click();
    await expect(page.getByRole("cell").filter({ hasText: "Día de la boda" })).toBeVisible();
  });

  test("ajustes: en la demo se ven los miembros sin acciones", async ({ page }) => {
    await page.goto("/panel/demo/ajustes");
    await expect(page.getByText("maria@ejemplo.invalid")).toBeVisible();
    await expect(page.getByRole("button", { name: "Enlace para organizar" })).toBeDisabled();
    await expect(page.getByRole("button", { name: "Borrar el evento" })).toBeDisabled();
  });

  for (const path of ["tareas", "presupuesto", "agenda", "ajustes"]) {
    test(`sin desbordes ni infracciones graves en ${path}`, async ({ page }) => {
      await page.goto(`/panel/demo/${path}`);
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
