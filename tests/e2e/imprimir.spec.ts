import { expect, test } from "@playwright/test";

test.describe("imprimir desde el panel", () => {
  test("cada documento se ve antes de imprimir", async ({ page }) => {
    await page.goto("/panel/demo/imprimir");
    await expect(page.getByRole("heading", { name: "Imprimir", level: 1 })).toBeVisible();
    // Tarjetas de mesa: una por invitado que viene (o aún no ha respondido).
    await expect(page.getByText("Abril Cabrera Romero")).toBeVisible();

    await page.getByText("Busca tu mesa", { exact: true }).click();
    await expect(page.getByRole("heading", { name: "Busca tu mesa" })).toBeVisible();

    await page.getByText("Carteles del álbum", { exact: true }).click();
    await expect(page.getByRole("img", { name: /Código QR del álbum, Mesa 1$/ })).toBeVisible();

    await page.getByText("Hoja del catering", { exact: true }).click();
    const table = page.getByRole("table", { name: "Menús por mesa" });
    await expect(table.getByRole("rowheader", { name: "Total" })).toBeVisible();

    await page.getByText("Canciones para el DJ", { exact: true }).click();
    await expect(page.getByRole("heading", { name: "Canciones para el DJ" })).toBeVisible();
    await expect(page.getByText(/Dancing Queen/)).toBeVisible();
  });

  test("al imprimir solo sale el documento, sin el menú del panel", async ({ page }) => {
    await page.goto("/panel/demo/imprimir");
    await page.emulateMedia({ media: "print" });
    await expect(page.getByRole("button", { name: "Imprimir" })).toBeHidden();
    await expect(page.getByText("Qué quieres imprimir")).toBeHidden();
  });
});
