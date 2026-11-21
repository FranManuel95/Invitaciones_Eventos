import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("página de venta", () => {
  test("presenta el producto, el precio y enlaza a los ejemplos", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 1, name: "Una invitación que se abre como una carta" }),
    ).toBeVisible();
    for (const price of ["79 €", "99 €", "149 €"]) {
      await expect(page.getByText(price, { exact: true })).toBeVisible();
    }
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
    for (const name of ["Y vosotros, la boda en orden", "Elegid lo que necesitáis"]) {
      await expect(page.getByRole("region", { name })).toBeAttached();
    }
  });

  test("cada paquete deja elegido su opción en el formulario", async ({ page }) => {
    await page.goto("/");
    const form = page.locator("#pedir");
    await expect(form.getByRole("radio", { name: "Aún no lo sé" })).toBeChecked();
    await page.getByRole("link", { name: "Pedir «Invitación + álbum»" }).click();
    await expect(form.getByRole("radio", { name: /Invitación \+ álbum · 99 €/ })).toBeChecked();
    await page.getByRole("link", { name: "Pedir «Todo incluido»" }).click();
    await expect(form.getByRole("radio", { name: /Todo incluido · 149 €/ })).toBeChecked();
  });

  test("la invitación a juego con la decoración lleva a pedirla", async ({ page }) => {
    await page.goto("/");
    const decor = page.getByRole("region", { name: "A juego con vuestra decoración" });
    // Va entre el panel de los novios y el precio.
    const order = await page
      .getByRole("heading", { level: 2 })
      .evaluateAll((hs) => hs.map((h) => h.textContent?.trim()));
    const at = order.indexOf("A juego con vuestra decoración");
    expect(order[at - 1]).toBe("Y vosotros, la boda en orden");
    expect(order[at + 1]).toBe("Elegid lo que necesitáis");
    await expect(
      decor.getByRole("list", { name: "Tres decoraciones de muestra" }).getByRole("listitem"),
    ).toHaveCount(3);
    await expect(
      decor.getByRole("link", { name: "Ver decoraciones en Instagram" }),
    ).toHaveAttribute("href", "https://www.instagram.com/eventos.efele/");
    await decor.getByRole("link", { name: "Contadnos vuestra decoración" }).click();
    await expect(page).toHaveURL(/#pedir$/);
    await expect(page.getByLabel("Vuestros nombres")).toBeInViewport();
  });

  test("el muestrario enseña las cincuenta y cinco plantillas por familias", async ({ page }) => {
    await page.goto("/");
    const book = page.getByRole("region", { name: "Cincuenta y cinco plantillas para empezar" });
    const papel = book.getByRole("tab", { name: /Papel y acuarela/ });
    await expect(papel).toHaveAttribute("aria-selected", "true");
    await expect(book.getByRole("tabpanel").getByRole("link")).toHaveCount(21);
    // Con el teclado se pasa a la otra familia.
    await papel.focus();
    await page.keyboard.press("ArrowRight");
    const objetos = book.getByRole("tab", { name: /Objetos/ });
    await expect(objetos).toHaveAttribute("aria-selected", "true");
    await expect(objetos).toBeFocused();
    await expect(book.getByRole("tabpanel").getByRole("link")).toHaveCount(34);
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
    await expect(
      page.getByText(/una sola vez por boda, desde 79 € según lo que incluya/),
    ).toBeVisible();
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
    await expect(page.getByRole("banner").getByRole("link", { name: /eFeLe/ })).toBeVisible();
    const openings = page.getByRole("region", { name: "Siete aperturas" });
    await expect(openings.getByRole("link")).toHaveCount(7);
    // La película se ofrece como apertura premium.
    await expect(openings.getByRole("link", { name: /Sobre de película.*Premium/ })).toBeAttached();
    // Las portadas, por familias: entre las tres pestañas están las cincuenta y seis.
    const covers = page.getByRole("region", { name: "Cincuenta y seis portadas" });
    const tabs = covers.getByRole("tab");
    await expect(tabs).toHaveCount(3);
    let total = 0;
    for (const [i, expected] of [6, 16, 34].entries()) {
      await tabs.nth(i).click();
      await expect(tabs.nth(i)).toHaveAttribute("aria-selected", "true");
      await expect(covers.getByRole("tabpanel").getByRole("link")).toHaveCount(expected);
      total += expected;
    }
    expect(total).toBe(56);
    await covers.getByRole("link", { name: "Gaceta", exact: true }).click();
    await expect(page).toHaveURL(/portada=gaceta/);
    await page.goBack();
    // Las plantillas, también por familias y con su apertura asomando.
    const templates = page.getByRole("region", { name: "Cincuenta y cinco plantillas" });
    await expect(templates.getByRole("tabpanel").getByRole("link")).toHaveCount(21);
    await expect(templates.getByText(/^Se abre con:/).first()).toBeAttached();
    // Nada se sale de la página.
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
    const { violations } = await new AxeBuilder({ page }).analyze();
    const serious = violations.filter((v) => ["serious", "critical"].includes(v.impact ?? ""));
    expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(" | ")}`)).toEqual([]);
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
