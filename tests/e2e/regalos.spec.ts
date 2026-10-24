import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("lista de regalos", () => {
  test("el invitado reserva un regalo, lo ve sellado como suyo y puede deshacerlo", async ({
    page,
  }) => {
    await page.goto("/i/carlos-ruiz");
    await page.getByRole("button", { name: "Saltar intro" }).click();
    const list = page.getByRole("list", { name: "Lista de regalos" });
    await list.scrollIntoViewIfNeeded();

    // El olivo ya lo ha reservado otra invitación: sin botón.
    const olive = list.getByRole("listitem").filter({ hasText: "Un olivo" });
    await expect(olive.getByText("Reservado", { exact: true })).toBeVisible();
    await expect(olive.getByRole("button")).toHaveCount(0);

    // El viaje es compartido: se ve cuántas invitaciones se han apuntado.
    const trip = list.getByRole("listitem").filter({ hasText: "Japón" });
    await expect(trip.getByText("Ya se han apuntado 2 invitaciones.")).toBeVisible();

    await list.getByRole("button", { name: /^Lo regalo yo ?: Cafetera de espresso$/ }).click();
    await expect(page.getByText(/Cafetera de espresso queda a vuestro nombre/)).toBeVisible();
    const coffee = list.getByRole("listitem").filter({ hasText: "Cafetera" });
    await expect(coffee.getByText("Reservado a vuestro nombre")).toBeVisible();

    // En la demo se recuerda en este navegador.
    await page.reload();
    await page
      .getByRole("button", { name: "Saltar intro" })
      .click()
      .catch(() => {});
    await expect(
      page
        .getByRole("list", { name: "Lista de regalos" })
        .getByRole("listitem")
        .filter({ hasText: "Cafetera" })
        .getByText("Reservado a vuestro nombre"),
    ).toBeVisible();
    await page.getByRole("button", { name: /^Deshacer ?: Cafetera de espresso$/ }).click();
    await expect(
      page.getByRole("button", { name: /^Lo regalo yo ?: Cafetera de espresso$/ }),
    ).toBeVisible();

    const { violations } = await new AxeBuilder({ page }).include("#regalo").analyze();
    const serious = violations.filter((v) => ["serious", "critical"].includes(v.impact ?? ""));
    expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(" | ")}`)).toEqual([]);
  });

  test("el panel muestra quién ha reservado cada regalo", async ({ page }) => {
    await page.goto("/panel/demo/regalos");
    await expect(page.getByRole("heading", { name: "Lista de regalos", level: 1 })).toBeVisible();
    const trip = page.getByRole("listitem").filter({ hasText: "Nuestro viaje a Japón" });
    await expect(trip).toContainText("Familia García");
    await expect(trip).toContainText("Carlos");
    await expect(
      page.getByRole("listitem").filter({ hasText: "Cafetera de espresso" }),
    ).toContainText("Libre");
  });

  test("el editor añade regalos a la lista", async ({ page }) => {
    await page.goto("/editor/demo");
    await page.getByRole("tab", { name: "Textos" }).click();
    await page.getByRole("button", { name: "Añadir regalo" }).click();
    const fieldset = page.getByRole("group", { name: "Regalo 5" });
    await fieldset.getByLabel("Regalo", { exact: true }).fill("Una bicicleta");
    await expect(page.getByRole("group", { name: "Una bicicleta" })).toBeVisible();
  });
});
