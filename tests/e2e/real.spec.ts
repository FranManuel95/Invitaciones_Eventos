import { expect, test } from "@playwright/test";

/*
 * Recorrido real contra Supabase: entrar, crear un evento con invitados de ejemplo, editarlo,
 * publicar,
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

    // Tras crearlo se abre el editor: un cambio de estilo y de texto se guarda solo.
    await expect(page).toHaveURL(/\/editor\/[0-9a-f-]{36}$/, { timeout: 20_000 });
    const eventId = page.url().split("/").pop()!;
    await page.getByRole("tab", { name: "Colores" }).click();
    await page.getByRole("radio", { name: /Noche/ }).check({ force: true });
    await page.getByRole("tab", { name: "Textos" }).click();
    await page.getByLabel("Mensaje de la carta").fill("Mensaje escrito desde el editor.");
    await expect(page.getByRole("status").filter({ hasText: /Guardado/ })).toBeVisible({
      timeout: 15_000,
    });

    const eventUrl = `/panel/${eventId}`;
    await page.goto(eventUrl);
    await expect(page.getByRole("heading", { name: "Borrador sin publicar" })).toBeVisible();

    await page.getByRole("button", { name: "Publicar invitación completa" }).click();
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
    // Ve lo publicado desde el editor: el estilo Noche y el mensaje nuevo.
    await expect(guest.locator("[data-style='noche']")).toBeAttached();
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

    // Alta de una invitación nueva desde el formulario: aparece con su enlace.
    await page.goto(`${eventUrl}/invitaciones`);
    await page.getByRole("button", { name: "Nueva invitación" }).click();
    const dialog = page.getByRole("dialog", { name: "Nueva invitación" });
    await dialog.getByLabel("Nombre de la invitación").fill("Familia Automática");
    await dialog.getByLabel("Nombre (principal)").fill("Rosa");
    await dialog.getByLabel("Teléfono (opcional)").fill("600 000 000");
    await dialog.getByRole("button", { name: "Crear invitación" }).click();
    await expect(page.getByRole("heading", { name: "Familia Automática" })).toBeVisible({
      timeout: 15_000,
    });
    const whatsapp = page.getByRole("link", { name: /WhatsApp para Familia Automática/ });
    await expect(whatsapp).toHaveAttribute("href", /^https:\/\/wa\.me\/34600000000\?text=/);

    // Organización: una tarea y una partida se guardan y siguen ahí al recargar.
    await page.goto(`${eventUrl}/tareas`);
    await page.getByRole("button", { name: "Nueva tarea" }).click();
    const taskDialog = page.getByRole("dialog", { name: "Nueva tarea" });
    await taskDialog.getByLabel("Tarea").fill("Probar el menú");
    await taskDialog.getByRole("button", { name: "Añadir tarea" }).click();
    await expect(page.getByRole("checkbox", { name: /Probar el menú/ })).toBeVisible();
    await page.reload();
    await expect(page.getByRole("checkbox", { name: /Probar el menú/ })).toBeVisible();

    await page.goto(`${eventUrl}/presupuesto`);
    await page.getByRole("button", { name: "Nueva partida" }).click();
    const budgetDialog = page.getByRole("dialog", { name: "Nueva partida" });
    await budgetDialog.getByLabel("Concepto").fill("Fotografía");
    await budgetDialog.getByLabel("Estimado (€)").fill("1200");
    await budgetDialog.getByRole("button", { name: "Añadir partida" }).click();
    await page.reload();
    await expect(page.getByText("Fotografía", { exact: true })).toBeVisible();
  });
});
