import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("página de venta", () => {
  test("presenta el producto, el precio y enlaza a los ejemplos", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 1, name: "Una invitación que se abre como una carta" }),
    ).toBeVisible();
    await expect(page.getByText("129 €", { exact: true })).toBeVisible();
    // La invitación de ejemplo se carga dentro del móvil al tocarlo.
    await page.getByRole("button", { name: "Abrir la invitación aquí" }).click();
    const phone = page.frameLocator('iframe[title="Invitación de ejemplo de María y Daniel"]');
    await expect(phone.getByRole("heading", { level: 1, name: /María/ })).toBeAttached();

    await page.getByRole("link", { name: "Ejemplos", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Invitaciones de ejemplo" })).toBeVisible();
  });

  test("cuenta el recorrido del invitado paso a paso, con el sobre en vídeo", async ({ page }) => {
    await page.goto("/");
    // La portada: el sobre real en bucle, que se puede parar.
    await page.getByRole("button", { name: "Pausar el vídeo del sobre" }).click();
    await expect(page.getByRole("button", { name: "Reproducir el vídeo del sobre" })).toBeVisible();
    const journey = page.getByRole("region", { name: "Así la vive cada invitado" });
    if ((page.viewportSize()?.width ?? 0) < 640) {
      // En el móvil, un paso a la vez, dentro de los márgenes, con botones.
      await expect(journey.getByRole("heading", { name: "Le llega vuestro enlace" })).toBeVisible();
      await expect(journey.getByRole("button", { name: "Paso anterior" })).toBeDisabled();
      await journey.getByRole("button", { name: "Paso siguiente" }).click();
      await expect(journey.getByRole("heading", { name: "Rompe el lacre" })).toBeVisible();
      await expect(journey.getByText(/^2\s*de 7$/)).toBeAttached();
    } else {
      await expect(journey.getByRole("listitem")).toHaveCount(7);
      await expect(journey.getByRole("heading", { name: "Rompe el lacre" })).toBeVisible();
    }
    for (const name of ["Y vosotros, la boda en orden", "Un precio, sin letra pequeña"]) {
      await expect(page.getByRole("region", { name })).toBeAttached();
    }
  });

  test("el muestrario enseña las veinticinco plantillas por familias", async ({ page }) => {
    await page.goto("/");
    const book = page.getByRole("region", { name: "Veinticinco plantillas para empezar" });
    const papel = book.getByRole("tab", { name: /Papel y acuarela/ });
    await expect(papel).toHaveAttribute("aria-selected", "true");
    await expect(book.getByRole("tabpanel").getByRole("link")).toHaveCount(10);
    // Con el teclado se pasa a la otra familia.
    await papel.focus();
    await page.keyboard.press("ArrowRight");
    const objetos = book.getByRole("tab", { name: /Objetos/ });
    await expect(objetos).toHaveAttribute("aria-selected", "true");
    await expect(objetos).toBeFocused();
    await expect(book.getByRole("tabpanel").getByRole("link")).toHaveCount(15);
    await book.getByRole("link", { name: "Gaceta", exact: true }).click();
    await expect(page).toHaveURL(/plantilla=gaceta/);
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
    await expect(openings.getByRole("link")).toHaveCount(7);
    // La película se ofrece como apertura premium.
    await expect(openings.getByRole("link", { name: /Sobre de película.*Premium/ })).toBeVisible();
    await expect(page.getByRole("region", { name: "Portadas" }).getByRole("link")).toHaveCount(32);
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

  test("las pieles de las plantillas con motivo solo se descargan con ellas", async ({ page }) => {
    const skins = (path: string) =>
      page.goto(path).then(() =>
        page.evaluate(async () => {
          const css = await Promise.all(
            [...document.querySelectorAll<HTMLLinkElement>("link[rel=stylesheet]")].map((l) =>
              fetch(l.href).then((r) => r.text()),
            ),
          );
          // El minificador quita las comillas del selector: [data-motif=gaceta].
          return css.some((text) => /data-motif=("?)gaceta/.test(text));
        }),
      );
    expect(await skins("/")).toBe(false);
    expect(await skins("/i/familia-garcia?plantilla=olivar")).toBe(false);
    expect(await skins("/i/familia-garcia?plantilla=gaceta")).toBe(true);
  });
});
