import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Invitaciones de la demo: enlaces, WhatsApp, QR y vista previa del CSV (sin guardar).
test.describe("invitaciones del panel", () => {
  test("busca y prepara el WhatsApp con el enlace personal", async ({ page }) => {
    await page.goto("/panel/demo/invitaciones");
    await expect(page.getByText(/^74 invitaciones · \d+ personas$/)).toBeVisible();
    await page.getByRole("searchbox", { name: "Buscar invitación o persona" }).fill("lucia");
    await expect(page.getByRole("heading", { name: "Familia García" })).toBeVisible();
    await expect(page.getByText(/^\d+ de 74 invitaciones$/)).toBeVisible();

    const whatsapp = page.getByRole("link", { name: /WhatsApp para Familia García/ });
    const href = decodeURIComponent((await whatsapp.getAttribute("href")) ?? "");
    expect(href).toMatch(/^https:\/\/wa\.me\/\?text=/);
    expect(href).toContain("¡Hola, Familia García!");
    expect(href).toContain("queremos que estéis");
    expect(href).toMatch(/\/i\/familia-garcia$/);
  });

  test("enseña el QR en un diálogo que se cierra con Escape", async ({ page }) => {
    await page.goto("/panel/demo/invitaciones");
    const open = page.getByRole("button", { name: "QR de Familia García" });
    await open.click();
    const dialog = page.getByRole("dialog", { name: "Familia García" });
    const qr = dialog.getByRole("img", { name: /Código QR de la invitación/ });
    await expect(qr).toBeVisible();
    // Dibujado: la matriz ya está cargada.
    await expect(qr.locator("path")).toHaveCount(1);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(open).toBeFocused();
  });

  test("revisa el CSV antes de importar y señala la línea con error", async ({ page }) => {
    await page.goto("/panel/demo/invitaciones");
    await page.getByRole("button", { name: "Importar CSV" }).click();
    const dialog = page.getByRole("dialog", { name: "Importar invitados" });
    await dialog.locator("input[type=file]").setInputFiles({
      name: "invitados.csv",
      mimeType: "text/csv",
      buffer: Buffer.from(
        "invitacion;nombre;apellidos;plazas\nFamilia Uno;Ana;Ruiz;3\nFamilia Uno;Luis;Ruiz;\nFamilia Dos;;;\n",
      ),
    });
    await expect(dialog.getByRole("alert")).toContainText(
      "Línea 4: Falta el nombre de la persona.",
    );
    await expect(dialog.getByText("1 invitación · 2 personas")).toBeVisible();
    await expect(dialog.getByText("Ana, Luis · 3 plazas")).toBeVisible();
    await expect(dialog.getByRole("button", { name: /^Importar/ })).toBeDisabled();
  });

  test("sin desbordes ni infracciones graves, también con el diálogo abierto", async ({ page }) => {
    await page.goto("/panel/demo/invitaciones");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
    const check = async () => {
      const { violations } = await new AxeBuilder({ page }).analyze();
      return violations
        .filter((v) => ["serious", "critical"].includes(v.impact ?? ""))
        .map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(" | ")}`);
    };
    expect(await check()).toEqual([]);
    await page.getByRole("button", { name: "Importar CSV" }).click();
    expect(await check()).toEqual([]);
  });
});
