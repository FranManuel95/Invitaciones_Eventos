import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Portadas animadas: se leen bien, son accesibles y dejan abrir la invitación.
test.describe("portadas", () => {
  for (const scene of ["luces", "acuarela", "estrellas", "herbario"]) {
    test(`${scene}: título legible, accesible y se abre`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(`/i/familia-garcia?portada=${scene}`);
      await expect(page.locator(`[data-cover='${scene}']`)).toBeAttached();
      await expect(page.getByRole("heading", { level: 1, name: /María/ })).toBeVisible();
      await page.waitForTimeout(3200);
      const { violations } = await new AxeBuilder({ page }).analyze();
      const serious = violations.filter((v) => ["serious", "critical"].includes(v.impact ?? ""));
      expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(" | ")}`)).toEqual(
        [],
      );
      await page.getByRole("button", { name: /toca para abrir/i }).click();
      await expect(page.getByRole("button", { name: "Abrir el sobre" })).toBeVisible();
      expect(errors).toEqual([]);
    });
  }

  for (const [scene, tone] of [
    ["ramas", "claro"],
    ["buganvilla", "claro"],
    ["orilla", "claro"],
    ["terciopelo", "oscuro"],
    ["medianoche", "oscuro"],
    ["arcilla", "oscuro"],
  ]) {
    test(`${scene}: fondo pintado con los nombres legibles y accesible`, async ({ page }) => {
      await page.goto(`/i/familia-garcia?portada=${scene}`);
      const cover = page.locator(`[data-cover='${scene}'][data-tone='${tone}']`);
      await expect(cover).toBeAttached();
      await expect(cover.locator("img")).toHaveJSProperty("complete", true);
      await expect(page.getByRole("heading", { level: 1, name: /María/ })).toBeVisible();
      await page.waitForTimeout(3200);
      const { violations } = await new AxeBuilder({ page }).include("[data-cover]").analyze();
      const serious = violations.filter((v) => ["serious", "critical"].includes(v.impact ?? ""));
      expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(" | ")}`)).toEqual(
        [],
      );
      await page.getByRole("button", { name: /toca para abrir/i }).click();
      await expect(page.getByRole("button", { name: "Abrir el sobre" })).toBeVisible();
    });
  }

  test("en una portada clara los botones de arriba van en tinta", async ({ page }) => {
    await page.goto("/i/familia-garcia?portada=ramas");
    const skip = page.getByRole("button", { name: "Saltar intro" });
    await expect(skip).toBeVisible();
    const sum = await skip.evaluate((el) =>
      (getComputedStyle(el).color.match(/[\d.]+/g) ?? [])
        .slice(0, 3)
        .reduce((total, value) => total + Number(value), 0),
    );
    // Tinta oscura, no blanco.
    expect(sum).toBeLessThan(300);
  });

  test("efecto de portada: el bucle se reproduce y con movimiento reducido no se pinta", async ({
    browser,
    page,
  }) => {
    await page.goto("/i/familia-garcia?portada=medianoche&efecto=oro");
    const effect = page.locator("[data-cover-effect='oro']");
    await expect(effect).toBeAttached();
    await expect
      .poll(() => effect.evaluate((el: HTMLVideoElement) => el.currentTime))
      .toBeGreaterThan(0);
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const still = await context.newPage();
    await still.goto("/i/familia-garcia?portada=medianoche&efecto=oro");
    await expect(still.locator("[data-cover='medianoche']")).toBeAttached();
    await expect(still.locator("[data-cover-effect]")).toHaveCount(0);
    await context.close();
  });

  test("con movimiento reducido las escenas quedan quietas", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/i/familia-garcia?portada=luces");
    await expect(page.locator("[data-cover='luces']")).toBeAttached();
    const animated = await page
      .locator("[data-cover='luces'] .scene-fly, [data-cover='luces'] .scene-twinkle")
      .evaluateAll(
        (els) => els.filter((el) => getComputedStyle(el).animationName !== "none").length,
      );
    expect(animated).toBe(0);
    await expect(page.locator("canvas")).toHaveCount(0);
    await context.close();
  });

  test("herbario: con movimiento reducido las ramas ya están dibujadas", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/i/familia-garcia?portada=herbario");
    const drawn = page.locator("[data-cover='herbario'] .herb-draw");
    await expect(drawn.first()).toBeAttached();
    // Se comprueba cuando la página se ha asentado (los estilos tardan un instante en aplicarse).
    await expect
      .poll(() =>
        drawn.evaluateAll(
          (els) =>
            els.filter((el) => {
              const style = getComputedStyle(el);
              return style.animationName !== "none" || style.strokeDasharray !== "none";
            }).length,
        ),
      )
      .toBe(0);
    await context.close();
  });

  test("el editor cambia la portada de la vista previa", async ({ page }) => {
    await page.goto("/editor/demo");
    const preview = page.frameLocator('iframe[title="Vista previa de la invitación"]');
    await expect(preview.locator("[data-cover='foto']")).toBeAttached();
    await page.getByRole("tab", { name: "Portada", exact: true }).click();
    await page.getByRole("radio", { name: /Cielo estrellado/ }).check({ force: true });
    await expect(preview.locator("[data-cover='estrellas']")).toBeAttached();
    await page.getByRole("radio", { name: /Vuestro vídeo/ }).check({ force: true });
    await expect(page.getByText(/En la demo no se suben vídeos/)).toBeVisible();
  });

  test("con motivo de acuarela, la pintura de la portada sigue dentro de la invitación", async ({
    page,
  }) => {
    await page.goto("/i/familia-garcia?plantilla=lavanda");
    await page.getByRole("button", { name: "Saltar intro" }).click();
    await expect(page.locator("[data-motif='lavanda']")).toBeAttached();
    // La cabecera va pintada (sin foto) y cada sección se anuncia con su ramita.
    const hero = page.locator("header.motif-hero");
    await expect(hero).toBeVisible();
    await expect(hero.locator("img")).toHaveCount(0);
    await expect(hero).toHaveCSS("background-image", /lavanda-fondo\.webp/);
    await expect(page.locator("#fecha .motif-sprig")).toHaveCSS(
      "background-image",
      /acuarelas\/lavanda\.webp/,
    );
    await expect(page.locator("footer .motif-closing-seal")).toHaveCSS(
      "background-image",
      /lavanda-lacre\.webp/,
    );
    // Las plantillas sin motivo siguen con su cabecera de foto y su raya dorada.
    await page.goto("/i/familia-garcia?plantilla=olivar");
    await page.getByRole("button", { name: "Saltar intro" }).click();
    await expect(page.locator("header.motif-hero")).toHaveCount(0);
    await expect(page.locator("#fecha .motif-sprig")).toBeHidden();
  });

  test("gaceta: la portada es un periódico y dentro las secciones son páginas numeradas", async ({
    page,
  }) => {
    await page.goto("/i/familia-garcia?plantilla=gaceta");
    await expect(
      page.getByRole("heading", { level: 1, name: /Clara y Mateo.*se casan/ }),
    ).toBeVisible();
    await expect(page.getByText("La Gaceta", { exact: true })).toBeVisible();
    const { violations } = await new AxeBuilder({ page }).analyze();
    const serious = violations.filter((v) => ["serious", "critical"].includes(v.impact ?? ""));
    expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(" | ")}`)).toEqual([]);
    await page.getByRole("button", { name: /toca para abrir/i }).click();
    await expect(page.locator("[data-opening='pantalla']")).toBeAttached();
    await page.getByRole("button", { name: "Saltar intro" }).click();
    const page2 = await page
      .locator("#fecha .motif-sprig")
      .evaluate((el) => getComputedStyle(el, "::before").content);
    expect(page2).toContain("Página");
  });

  test("embarque: el billete va a nombre del invitado y se abre arrancando el resguardo", async ({
    page,
  }) => {
    await page.goto("/i/familia-garcia?plantilla=embarque");
    await expect(page.getByRole("heading", { level: 1, name: /Noa & Álex/ })).toBeVisible();
    await expect(page.getByRole("article").getByText("Familia García")).toBeVisible();
    await expect(page.getByText("VEJ", { exact: true })).toBeVisible();
    const { violations } = await new AxeBuilder({ page }).analyze();
    const serious = violations.filter((v) => ["serious", "critical"].includes(v.impact ?? ""));
    expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(" | ")}`)).toEqual([]);
    await page.getByRole("button", { name: /Arrancar el resguardo.*toca para abrir/ }).click();
    await expect(page.locator("[data-opening='pantalla']")).toBeAttached();
  });

  test("premio: la fecha se descubre rascando, o con el botón para quien no pueda rascar", async ({
    page,
  }) => {
    await page.goto("/i/familia-garcia?plantilla=premio");
    await expect(page.getByRole("heading", { level: 1, name: /Sofía/ })).toBeVisible();
    const foil = page.locator("canvas[data-scratch]");
    await expect(foil).toHaveAttribute("data-scratch", "pendiente");
    // Rascar con el puntero no levanta la portada: solo borra la capa dorada.
    const box = (await foil.boundingBox())!;
    await page.mouse.move(box.x + 12, box.y + 14);
    await page.mouse.down();
    for (let row = 0; row < 5; row += 1) {
      const y = box.y + 14 + (row * (box.height - 28)) / 4;
      await page.mouse.move(box.x + (row % 2 ? 12 : box.width - 12), y, { steps: 14 });
    }
    await page.mouse.up();
    await expect(foil).toHaveAttribute("data-scratch", "hecho");
    await expect(page.locator("#cover-title")).toBeVisible();
    await expect(page.getByRole("button", { name: "Descubrir sin rascar" })).toHaveCount(0);

    // Sin rascar: el botón hace lo mismo, y la fecha está siempre en la página.
    await page.reload();
    await expect(
      page.locator("[data-cover='premio']").getByText("18 de diciembre de 2027", { exact: true }),
    ).toBeAttached();
    await page.getByRole("button", { name: "Descubrir sin rascar" }).click();
    await expect(page.locator("canvas[data-scratch]")).toHaveAttribute("data-scratch", "hecho");
    const { violations } = await new AxeBuilder({ page }).analyze();
    const serious = violations.filter((v) => ["serious", "critical"].includes(v.impact ?? ""));
    expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(" | ")}`)).toEqual([]);
  });
  test("telegrama: el mensaje se teclea con los datos de la boda y se abre arrancando la tira", async ({
    page,
  }) => {
    await page.goto("/i/familia-garcia?plantilla=telegrama");
    const cover = page.locator("[data-cover='telegrama']");
    await expect(cover.getByRole("heading", { level: 1, name: "Irene y Guille" })).toBeVisible();
    await expect(cover.getByText("Familia García", { exact: true })).toBeVisible();
    // El mensaje completo está siempre en la página, aunque aún se esté tecleando.
    await expect(
      cover.getByText("NOS CASAMOS. Stop. 18 SEPTIEMBRE 2027. Stop. BAEZA. Stop. NO FALTES. Stop."),
    ).toBeAttached();
    // Tocar el telegrama lo termina de teclear, sin levantar la portada.
    await cover.getByText("TELEGRAMA", { exact: true }).click();
    await expect(cover.getByText("NO FALTES STOP", { exact: true })).toBeVisible();
    await expect(cover.locator(".type-caret")).toHaveCount(0);
    const { violations } = await new AxeBuilder({ page }).analyze();
    const serious = violations.filter((v) => ["serious", "critical"].includes(v.impact ?? ""));
    expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(" | ")}`)).toEqual([]);
    await page.getByRole("button", { name: /Arrancar la tira.*toca para abrir/ }).click();
    await expect(page.locator("[data-opening='pantalla']")).toBeAttached();
    await page.getByRole("button", { name: "Saltar intro" }).click();
    const strip = page.locator("#fecha .motif-sprig");
    expect(await strip.evaluate((el) => getComputedStyle(el, "::before").content)).toContain(
      "MENSAJE",
    );
    expect(await strip.evaluate((el) => getComputedStyle(el, "::after").content)).toContain("STOP");
  });

  test("telegrama: con movimiento reducido el mensaje llega ya escrito", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/i/familia-garcia?plantilla=telegrama");
    const cover = page.locator("[data-cover='telegrama']");
    await expect(cover.getByText("NO FALTES STOP", { exact: true })).toBeVisible();
    await expect(cover.locator(".type-caret")).toHaveCount(0);
    await context.close();
  });

  test("postal: se gira para leer el mensaje, la dirección del invitado y el matasellos", async ({
    page,
  }) => {
    await page.goto("/i/familia-garcia?plantilla=postal");
    const cover = page.locator("[data-cover='postal']");
    await expect(cover.getByRole("heading", { level: 1, name: /Vera.*Nico/ })).toBeVisible();
    await expect(cover.getByText("Recuerdo de")).toBeVisible();
    const card = cover.locator("[data-side]");
    await expect(card).toHaveAttribute("data-side", "anverso");
    // La fecha está en la página aunque el reverso aún no se vea.
    await expect(cover.getByText("21 de agosto de 2027")).toBeAttached();
    await cover.getByRole("button", { name: "Girar la postal" }).click();
    await expect(card).toHaveAttribute("data-side", "reverso");
    await expect(cover.getByText("Familia García", { exact: true })).toBeVisible();
    await expect(cover.getByText("21 de agosto de 2027")).toBeVisible();
    // Girarla no levanta la portada.
    await expect(cover).toBeVisible();
    // El contraste se mide con la postal ya quieta, no a mitad del giro.
    await page.waitForTimeout(500);
    const { violations } = await new AxeBuilder({ page }).analyze();
    const serious = violations.filter((v) => ["serious", "critical"].includes(v.impact ?? ""));
    expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(" | ")}`)).toEqual([]);
    await cover.getByRole("button", { name: /toca para abrir/i }).click();
    // Debajo espera el sobre de siempre.
    await expect(page.getByRole("button", { name: "Abrir el sobre" })).toBeVisible();
    await page.getByRole("button", { name: "Saltar intro" }).click();
    const stamp = page.locator("#fecha .motif-sprig");
    // Cada sección lleva su sello, con el valor que le toca (5, 10, 15…).
    expect(await stamp.evaluate((el) => getComputedStyle(el, "::before").content)).toContain(
      "sello",
    );
    await expect(stamp).toBeVisible();
  });
});
