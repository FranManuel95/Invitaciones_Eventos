import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("página de venta", () => {
  test("presenta el producto, el precio y enlaza a los ejemplos", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 1, name: "Una invitación que se abre como una carta" }),
    ).toBeVisible();
    await expect(page.getByText("129 €", { exact: true })).toBeVisible();
    // La invitación de ejemplo se ve dentro del móvil.
    const phone = page.frameLocator('iframe[title="Invitación de ejemplo de María y Daniel"]');
    await expect(phone.getByRole("heading", { level: 1, name: /María/ })).toBeAttached();

    await page.getByRole("link", { name: "Ejemplos", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Invitaciones de ejemplo" })).toBeVisible();
  });

  test("el formulario marca los errores y conserva lo escrito", async ({ page }) => {
    await page.goto("/#pedir");
    await page.getByLabel("Vuestros nombres").fill("Ana y Luis");
    await page.getByLabel("Correo").fill("ana-sin-arroba");
    await page.getByRole("button", { name: "Pedir nuestra invitación" }).click();
    await expect(page.getByText("Revisad el correo: le falta algo.")).toBeVisible();
    await expect(page.getByLabel("Correo")).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByLabel("Vuestros nombres")).toHaveValue("Ana y Luis");
  });

  test("las preguntas se despliegan", async ({ page }) => {
    await page.goto("/");
    await page.getByText("¿Hay que pagar algo más?").click();
    await expect(page.getByText(/una sola vez por boda, sin suscripciones/)).toBeVisible();
  });

  test("sin desbordes ni infracciones graves", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(400);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
    // El contenido del iframe ya se revisa en las pruebas de la invitación.
    const { violations } = await new AxeBuilder({ page }).exclude("iframe").analyze();
    const serious = violations.filter((v) => ["serious", "critical"].includes(v.impact ?? ""));
    expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(" | ")}`)).toEqual([]);
  });

  test("los ejemplos enlazan cada apertura, portada y momento", async ({ page }) => {
    await page.goto("/ejemplos");
    const openings = page.getByRole("region", { name: "Aperturas" });
    await expect(openings.getByRole("link")).toHaveCount(4);
    await expect(page.getByRole("region", { name: "Portadas" }).getByRole("link")).toHaveCount(4);
    await openings.getByRole("link", { name: /Caja con lazo/ }).click();
    await expect(page).toHaveURL(/apertura=caja/);
    await expect(page.getByRole("heading", { level: 1, name: /María/ })).toBeAttached();
  });

  test("los textos legales se enlazan desde el pie y marcan los datos que faltan", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Privacidad", exact: true }).click();
    await expect(
      page.getByRole("heading", { level: 1, name: "Política de privacidad" }),
    ).toBeVisible();
    // En las pruebas no hay datos del titular: se ven los huecos por rellenar.
    await expect(page.getByText(/Texto en preparación/)).toBeVisible();
    await expect(page.getByText("[pendiente: NIF]").first()).toBeVisible();
    await page.getByRole("link", { name: "Aviso legal", exact: true }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Aviso legal" })).toBeVisible();
    const { violations } = await new AxeBuilder({ page }).analyze();
    const serious = violations.filter((v) => ["serious", "critical"].includes(v.impact ?? ""));
    expect(serious.map((v) => v.id)).toEqual([]);
  });

  test("sin dominio propio, robots.txt no deja indexar nada", async ({ request }) => {
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toMatch(/Disallow: \/\s*$/m);
  });
});
