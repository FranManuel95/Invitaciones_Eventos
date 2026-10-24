import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Editor de la demo: sin guardado ni red. La vista previa es un iframe con la invitación real.
test.describe("editor de la invitación", () => {
  test("el estilo y los nombres se ven al momento en la vista previa", async ({ page }) => {
    await page.goto("/editor/demo");
    const preview = page.frameLocator('iframe[title="Vista previa de la invitación"]');
    await expect(preview.locator("[data-style='mediterraneo']")).toBeAttached();

    await page.getByRole("tab", { name: "Colores" }).click();
    await page.getByRole("radio", { name: /Noche/ }).check({ force: true });
    await expect(preview.locator("[data-style='noche']")).toBeAttached();

    await page.getByRole("tab", { name: "Pareja y fecha" }).click();
    await page.getByLabel("Primer nombre").fill("Lucía");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Lucía & Daniel");
    await expect(preview.locator("#cover-title")).toContainText("Lucía");
  });

  test("una plantilla y un color propio cambian la vista previa", async ({ page }) => {
    await page.goto("/editor/demo");
    const preview = page.frameLocator('iframe[title="Vista previa de la invitación"]');
    await expect(preview.locator("[data-style='mediterraneo']")).toBeAttached();
    await expect(page.getByRole("radio", { name: /Almendro/ })).toBeChecked();

    await page.getByRole("radio", { name: /Esmeralda/ }).check({ force: true });
    await expect(preview.locator("[data-style='esmeralda']")).toBeAttached();

    await page.getByRole("tab", { name: "Colores" }).click();
    await page.getByLabel("Color propio").fill("#ffd400");
    await expect(page.getByText(/versión algo más intensa|Se lee bien/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Quitar color propio" })).toBeVisible();
    await page.getByRole("tab", { name: "Plantillas" }).click();
    await expect(page.getByText("Estilo personalizado")).toBeVisible();
  });

  test("la tipografía cambia los nombres de la vista previa", async ({ page }) => {
    await page.goto("/editor/demo");
    const preview = page.frameLocator('iframe[title="Vista previa de la invitación"]');
    await page.getByRole("tab", { name: "Tipografía" }).click();
    await page.getByRole("radio", { name: /Caligráfica/ }).check({ force: true });
    await expect
      .poll(() => preview.locator("#cover-title").evaluate((el) => getComputedStyle(el).fontFamily))
      .toMatch(/Great Vibes/i);
  });

  test("el sobre a medida se ve en la vista previa", async ({ page, isMobile }) => {
    await page.goto("/editor/demo");
    const preview = page.frameLocator('iframe[title="Vista previa de la invitación"]');
    await expect(preview.locator("#cover-title")).toBeAttached();
    await page.getByRole("tab", { name: "Sobre", exact: true }).click();
    // El apartado lleva la vista previa al sobre.
    await expect(preview.locator("[data-flap-shape='pico']")).toBeAttached();
    await page.getByRole("radio", { name: /Festoneada/ }).check({ force: true });
    await expect(preview.locator("[data-flap-shape='festoneada']")).toBeAttached();
    await page.getByRole("radio", { name: /400 g/ }).check({ force: true });
    await page.getByRole("radio", { name: /Flores/ }).check({ force: true });
    await page.getByRole("radio", { name: /Corazón/ }).check({ force: true });
    if (!isMobile) {
      await expect(page.getByRole("button", { name: "Sobre", pressed: true })).toBeVisible();
    }
  });

  test("la composición de la carta cambia en la vista previa", async ({ page }) => {
    await page.goto("/editor/demo");
    const preview = page.frameLocator('iframe[title="Vista previa de la invitación"]');
    await expect(preview.locator("#cover-title")).toBeAttached();
    await page.getByRole("tab", { name: "Carta", exact: true }).click();
    await expect(preview.locator("[data-layout='clasica']")).toBeAttached();
    await page.getByRole("radio", { name: /Editorial/ }).check({ force: true });
    await expect(preview.locator("[data-layout='editorial']")).toBeAttached();
    await expect(preview.locator("#letter-title")).toHaveText(/Hola,/);
    await page.getByRole("radio", { name: /Con foto/ }).check({ force: true });
    await expect(preview.locator("[data-layout='foto'] img")).toBeAttached();
  });

  test("reordenar secciones cambia la invitación", async ({ page }) => {
    await page.goto("/editor/demo");
    const preview = page.frameLocator('iframe[title="Vista previa de la invitación"]');
    await expect(preview.locator("#cover-title")).toBeAttached();
    await page.getByRole("tab", { name: "Secciones y música" }).click();
    await expect(preview.locator("#fecha")).toBeAttached();
    for (let i = 0; i < 6; i++) {
      await page.getByRole("button", { name: "Subir «Regalo»" }).click();
    }
    await expect(page.getByRole("button", { name: "Subir «Regalo»" })).toBeDisabled();
    // La vista previa recibe el borrador con un pequeño retardo.
    await expect
      .poll(() =>
        preview.locator("main > section[id]").evaluateAll((els) => els.map((el) => el.id)[0]),
      )
      .toBe("regalo");
  });

  test("la apertura elegida se ve en la vista previa", async ({ page }) => {
    await page.goto("/editor/demo");
    const preview = page.frameLocator('iframe[title="Vista previa de la invitación"]');
    await expect(preview.locator("#cover-title")).toBeAttached();
    await page.getByRole("tab", { name: "Apertura", exact: true }).click();
    await page.getByRole("radio", { name: /Caja con lazo/ }).check({ force: true });
    await expect(preview.locator("[data-opening='caja']")).toBeAttached();
    await page.getByRole("radio", { name: /pantalla completa/ }).check({ force: true });
    await expect(preview.locator("[data-opening='pantalla']")).toBeAttached();
  });

  test("si la vista previa se recarga, recupera el borrador y la pantalla", async ({ page }) => {
    await page.goto("/editor/demo");
    const preview = page.frameLocator('iframe[title="Vista previa de la invitación"]');
    await expect(preview.locator("#cover-title")).toBeAttached();
    await page.getByRole("tab", { name: "Apertura", exact: true }).click();
    await page.getByRole("radio", { name: /Caja con lazo/ }).check({ force: true });
    await expect(preview.locator("[data-opening='caja']")).toBeAttached();
    // El móvil puede descartar el iframe y volver a cargarlo por su cuenta.
    await page.evaluate(() => {
      const frame = document.querySelector<HTMLIFrameElement>(
        'iframe[title="Vista previa de la invitación"]',
      );
      if (frame) frame.src = frame.src;
    });
    await expect(preview.locator("[data-opening='caja']")).toBeAttached();
  });

  test("con campos por revisar, la vista previa avisa de que está en pausa", async ({
    page,
    isMobile,
  }) => {
    await page.goto("/editor/demo");
    await page.getByRole("tab", { name: "Pareja y fecha" }).click();
    await page.getByLabel("Primer nombre").fill("");
    // En el móvil, editar y ver se alternan.
    if (isMobile) await page.getByRole("button", { name: "Vista previa" }).click();
    await expect(page.getByText(/La vista previa está en pausa/)).toBeVisible();
  });

  test("se elige el estilo de música y se escucha una muestra", async ({ page }) => {
    await page.goto("/editor/demo");
    await page.getByRole("tab", { name: "Secciones y música" }).click();
    await page.getByRole("radio", { name: /Caja de música/ }).check({ force: true });
    const sample = page.getByRole("button", { name: "Escuchar una muestra" });
    await sample.click();
    await expect(page.getByRole("button", { name: "Parar" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await page.getByRole("button", { name: "Parar" }).click();
    await page.getByRole("radio", { name: /Vuestra canción/ }).check({ force: true });
    await expect(page.getByText(/En la demo no se suben canciones/)).toBeVisible();
  });

  test("salta a la pantalla elegida", async ({ page, isMobile }) => {
    await page.goto("/editor/demo");
    if (isMobile) await page.getByRole("button", { name: "Vista previa" }).click();
    const preview = page.frameLocator('iframe[title="Vista previa de la invitación"]');
    await expect(preview.locator("#cover-title")).toBeAttached();
    await page.getByRole("button", { name: "Invitación", exact: true }).click();
    await expect(preview.locator("#content-title")).toBeAttached();
  });

  test("ocultar una sección la quita de la vista previa", async ({ page, isMobile }) => {
    await page.goto("/editor/demo");
    const preview = page.frameLocator('iframe[title="Vista previa de la invitación"]');
    await expect(preview.locator("#cover-title")).toBeAttached();
    if (isMobile) await page.getByRole("button", { name: "Vista previa" }).click();
    await page.getByRole("button", { name: "Invitación", exact: true }).click();
    await expect(preview.locator("#historia")).toBeAttached();
    if (isMobile) await page.getByRole("button", { name: "Editar" }).click();
    await page.getByRole("tab", { name: "Secciones y música" }).click();
    await page.getByRole("checkbox", { name: "Nuestra historia" }).uncheck({ force: true });
    await expect(preview.locator("#historia")).toHaveCount(0);
    await expect(preview.getByRole("link", { name: "Nuestra historia" })).toHaveCount(0);
  });

  test("marca los errores y bloquea su pestaña", async ({ page }) => {
    await page.goto("/editor/demo");
    await page.getByRole("tab", { name: "Programa y lugares" }).click();
    const title = page.getByLabel("Título").first();
    await title.fill("");
    await expect(title).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByText("Este campo no puede quedar vacío.")).toBeVisible();
    await expect(
      page.getByRole("status").filter({ hasText: "Hay campos por revisar." }),
    ).toBeVisible();
    await expect(page.getByRole("tab", { name: /Programa y lugares 1 por revisar/ })).toBeVisible();
    await title.fill("Ceremonia");
    await expect(page.getByText("Este campo no puede quedar vacío.")).toHaveCount(0);
  });

  test("añade, mueve y quita actos del programa", async ({ page }) => {
    await page.goto("/editor/demo");
    await page.getByRole("tab", { name: "Programa y lugares" }).click();
    await page.getByRole("button", { name: "Añadir acto" }).click();
    const added = page.getByRole("group", { name: "Acto 5" });
    await expect(added).toBeVisible();
    await added.getByLabel("Título").fill("Recena");
    await page.getByRole("button", { name: "Subir «Recena»" }).click();
    // El programa va primero: el acto nuevo pasa del quinto al cuarto puesto.
    await expect(page.locator("fieldset > legend").nth(3)).toHaveText("Recena");
    await page.getByRole("button", { name: "Quitar «Recena»" }).click();
    await expect(page.getByRole("group", { name: "Recena" })).toHaveCount(0);
  });

  test("las pestañas se recorren con las flechas", async ({ page }) => {
    await page.goto("/editor/demo");
    await page.getByRole("tab", { name: "Estilo" }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("tab", { name: "Pareja y fecha" })).toBeFocused();
    await expect(page.getByRole("tab", { name: "Pareja y fecha" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  test("sin desbordes ni infracciones graves", async ({ page }) => {
    await page.goto("/editor/demo");
    await page.waitForTimeout(600);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
    for (const tab of [
      "Estilo",
      "Colores",
      "Sobre",
      "Pareja y fecha",
      "Programa y lugares",
      "Autobuses y menús",
    ]) {
      if (["Colores", "Sobre"].includes(tab))
        await page.getByRole("tab", { name: "Estilo" }).click();
      await page.getByRole("tab", { name: tab, exact: true }).click();
      const { violations } = await new AxeBuilder({ page }).exclude("iframe").analyze();
      const serious = violations.filter((v) => ["serious", "critical"].includes(v.impact ?? ""));
      expect(
        serious.map((v) => `${tab} · ${v.id}: ${v.nodes.map((n) => n.target).join(" | ")}`),
      ).toEqual([]);
    }
  });
});
