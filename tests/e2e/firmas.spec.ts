import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("libro de firmas y música", () => {
  test("el invitado firma el libro y ve su mensaje el primero", async ({ page }) => {
    await page.goto("/i/carlos-ruiz");
    await page.getByRole("button", { name: "Saltar intro" }).click();
    const book = page.getByRole("region", { name: "Libro de firmas" });
    await book.scrollIntoViewIfNeeded();
    const list = book.getByRole("list", { name: "Mensajes del libro de firmas" });
    await expect(list.getByRole("listitem")).toHaveCount(4);

    // En blanco no se firma.
    await book.getByRole("button", { name: "Firmar el libro" }).click();
    await expect(book.getByRole("status")).toHaveText("Escribe unas palabras antes de firmar.");

    await book.getByLabel("Vuestro mensaje").fill("  ¡Allí estaré,\ncon ganas de bailar!  ");
    await book.getByRole("button", { name: "Firmar el libro" }).click();
    await expect(book.getByRole("status")).toHaveText(/ya está en el libro/);
    await expect(list.getByRole("listitem")).toHaveCount(5);
    await expect(list.getByRole("listitem").first()).toContainText(
      "¡Allí estaré, con ganas de bailar!",
    );
    await expect(list.getByRole("listitem").first()).toContainText("Vuestro mensaje");

    // Se recuerda al volver.
    await page.reload();
    await expect(
      page.getByRole("list", { name: "Mensajes del libro de firmas" }).getByRole("listitem"),
    ).toHaveCount(5);

    const { violations } = await new AxeBuilder({ page })
      .include('[aria-labelledby="firmas-title"]')
      .include('[aria-labelledby="musica-title"]')
      .analyze();
    expect(violations.filter((v) => ["serious", "critical"].includes(v.impact ?? ""))).toEqual([]);
  });

  test("la música enseña las canciones pedidas y el Bizum se puede copiar", async ({ page }) => {
    await page.goto("/i/carlos-ruiz");
    await page.getByRole("button", { name: "Saltar intro" }).click();
    const music = page.getByRole("region", { name: "La música la ponéis vosotros" });
    await expect(music.getByText("September")).toBeAttached();
    await expect(music.getByRole("link", { name: /Abrir la lista de la fiesta/ })).toHaveAttribute(
      "href",
      /^https:\/\//,
    );
    await expect(page.locator("#regalo").getByText("Por Bizum")).toBeAttached();
    await expect(
      page.locator("#regalo").getByRole("button", { name: "Copiar teléfono" }),
    ).toBeAttached();
  });

  test("el panel deja ocultar un mensaje y volver a mostrarlo", async ({ page }) => {
    await page.goto("/panel/demo/mensajes");
    await expect(page.getByRole("heading", { name: "Libro de firmas", level: 1 })).toBeVisible();
    await expect(page.getByText("Higo tiene que llevar los anillos")).toBeVisible();
    const hide = page.getByRole("button", { name: /^Ocultar ?: mensaje de Carlos$/ });
    await hide.click();
    await expect(
      page.getByRole("button", { name: /^Volver a mostrar ?: mensaje de Carlos$/ }),
    ).toBeVisible();
  });
});
