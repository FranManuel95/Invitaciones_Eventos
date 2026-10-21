import { expect, test } from "@playwright/test";

/*
 * Recorrido real contra Supabase: entrar, crear un evento con invitados de ejemplo, publicar,
 * responder como invitado y ver la respuesta en el panel. Solo se ejecuta si hay un usuario
 * de prueba (E2E_EMAIL y E2E_PASSWORD) y Supabase está configurado; la contraseña nunca va
 * en el repositorio.
 */
const email = process.env.E2E_EMAIL;
const password = process.env.E2E_PASSWORD;

test.describe("recorrido real con Supabase", () => {
  test.skip(!email || !password, "Sin usuario de prueba (E2E_EMAIL / E2E_PASSWORD)");
  test.skip(({ isMobile }) => isMobile, "Se ejecuta una vez, en escritorio");

  test("crear, publicar, responder y ver la respuesta", async ({ page, context }) => {
    test.setTimeout(90_000);
    await page.goto("/panel");
    await expect(page).toHaveURL(/\/entrar/);
    await page.getByLabel("Email").fill(email!);
    await page.getByLabel("Contraseña").fill(password!);
    await page.getByRole("button", { name: "Entrar", exact: true }).last().click();
    await expect(page.getByRole("heading", { name: "Vuestras invitaciones" })).toBeVisible();

    await page.getByLabel("Nombre de uno").fill("Prueba");
    await page.getByLabel("Nombre del otro").fill("Automática");
    await page.getByLabel("Fecha de la boda").fill("2030-06-15");
    await page.getByRole("button", { name: "Crear invitación" }).click();
    await expect(page.getByRole("heading", { name: "Borrador sin publicar" })).toBeVisible({
      timeout: 20_000,
    });
    const eventUrl = page.url();

    await page.getByRole("button", { name: "Publicar" }).click();
    await expect(page.getByRole("heading", { name: "Invitación publicada" })).toBeVisible({
      timeout: 15_000,
    });

    // Enlace de la primera invitación (Familia García, la de ejemplo).
    await page.getByText(/Enlaces de las invitaciones/).click();
    const link = page.getByRole("link", { name: /la invitación de Familia García/ });
    const href = await link.getAttribute("href");
    expect(href).toMatch(/^\/i\/[\w-]{22}$/);

    const guest = await context.newPage();
    await guest.goto(href!);
    await guest.getByRole("button", { name: "Saltar intro" }).click();
    await guest.getByRole("button", { name: "No podré asistir" }).click();
    const next = () => guest.getByRole("button", { name: /^(Siguiente|Revisar)/ }).click();
    await next().catch(() => {});
    await guest.getByRole("button", { name: "Enviar respuesta" }).click();
    await expect(guest.getByText(/Gracias por avisarnos|Te echaremos de menos/)).toBeVisible({
      timeout: 15_000,
    });

    // Al recargar, la respuesta viene del servidor.
    await guest.reload();
    await guest
      .getByRole("button", { name: "Saltar intro" })
      .click()
      .catch(() => {});
    await expect(
      guest.getByText(/No podréis venir|no podréis acompañarnos/i).first(),
    ).toBeVisible();

    await page.goto(`${eventUrl}/invitados?estado=declined`);
    await expect(page.getByText("Familia García").first()).toBeVisible();
  });
});
