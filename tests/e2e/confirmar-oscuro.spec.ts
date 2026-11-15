import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// La confirmación de asistencia en los temas oscuros: todo se lee, paso a paso.
for (const plantilla of ["arcilla", "terciopelo"]) {
  test(`confirmar en la plantilla oscura ${plantilla}: el botón se ve y todos los pasos se leen`, async ({
    page,
  }) => {
    await page.goto(`/i/familia-garcia?plantilla=${plantilla}&grabar=1`);
    await page.getByRole("button", { name: /toca para abrir/i }).click();
    await page
      .getByRole("button", { name: /^Abrir (el sobre|la caja|la invitación)$/ })
      .click({ timeout: 20_000 });
    await page.getByRole("button", { name: "Descubrir la invitación" }).click({ timeout: 40_000 });

    const section = page.locator("#confirmar");
    await section.scrollIntoViewIfNeeded();
    const yes = section.getByRole("button", { name: "Sí, asistiré" });
    await expect(yes).toBeVisible();
    // El botón principal es claro sobre la foto oscura, no del color del papel del tema.
    const [r, g, b] = await yes.evaluate((el) =>
      (getComputedStyle(el).backgroundColor.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number),
    );
    expect(Math.min(r!, g!, b!)).toBeGreaterThan(200);

    await yes.click();
    for (let step = 0; step < 8; step++) {
      await page.waitForTimeout(450);
      const { violations } = await new AxeBuilder({ page })
        .include("#confirmar")
        .withRules(["color-contrast"])
        .analyze();
      expect(
        violations.map((v) => `paso ${step + 1}: ${v.nodes.map((n) => n.target).join(" | ")}`),
      ).toEqual([]);
      const next = section.getByRole("button", { name: /^Siguiente/ });
      if (!(await next.count())) break;
      await next.first().click();
    }
  });
}
