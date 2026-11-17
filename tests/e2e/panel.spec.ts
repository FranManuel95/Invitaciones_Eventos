import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PAGES = [
  "/panel/demo",
  "/panel/demo/invitaciones",
  "/panel/demo/invitados",
  "/panel/demo/transporte",
  "/panel/demo/menus",
  "/panel/demo/comunicaciones",
  "/panel/demo/regalos",
  "/panel/demo/imprimir",
  "/panel/demo?vista=nuevo",
  "/entrar",
];

test.describe("panel del organizador", () => {
  test("muestra el resumen con métricas", async ({ page }) => {
    await page.goto("/panel/demo");
    await expect(page.getByRole("heading", { level: 1, name: "Hola, María" })).toBeVisible();
    await expect(page.locator("dt", { hasText: /^Invitados$/ })).toBeVisible();
    await expect(page.getByText("150", { exact: true }).first()).toBeVisible();
  });

  test("el inicio dice qué toca ahora y agrupa las canciones repetidas", async ({ page }) => {
    await page.goto("/panel/demo");
    const steps = page.getByRole("region", { name: "Qué toca ahora" });
    await expect(steps.getByText("8 invitaciones sin abrir")).toBeVisible();
    await expect(steps.getByText(/invitaciones confirmadas sin mesa/)).toBeVisible();
    await steps.getByRole("link", { name: "Sentar invitados" }).click();
    await expect(page).toHaveURL(/\/panel\/demo\/mesas$/);

    await page.goto("/panel/demo");
    const songs = page.getByRole("region", { name: /Canciones pedidas/ });
    // Cada canción sale una vez, con las veces que se ha pedido.
    await expect(songs.getByText("Mi gran noche — Raphael")).toHaveCount(1);
    await expect(songs.getByText(/\d+ veces/).first()).toBeVisible();
  });

  test("las invitaciones se filtran por estado", async ({ page }) => {
    await page.goto("/panel/demo/invitaciones");
    const filters = page.getByRole("group", { name: "Filtrar por estado" });
    await expect(filters.getByRole("button", { name: /Todas 74/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await filters.getByRole("button", { name: /Sin abrir 8/ }).click();
    await expect(page.getByText("8 de 74 invitaciones")).toBeVisible();
    await expect(page.getByRole("heading", { level: 3 })).toHaveCount(8);
    // Con un filtro y una búsqueda que no casan, se ofrece volver a ver todas.
    await page.getByLabel("Buscar invitación o persona").fill("zzzz");
    await page.getByRole("button", { name: "Ver todas" }).click();
    await expect(page.getByText(/74 invitaciones · /)).toBeVisible();
  });

  test("filtra y busca invitados", async ({ page, isMobile }) => {
    await page.goto("/panel/demo/invitados?estado=pending");
    await expect(page.getByRole("radio", { name: "Pendientes" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    await page.getByRole("radio", { name: "Todos" }).click();
    await page.getByRole("searchbox", { name: "Buscar invitado o grupo" }).fill("garcia");
    await expect(page.getByText(/^3 invitados/)).toBeVisible();
    // Los filtros se reflejan en la URL y sobreviven a una recarga.
    await expect(page).toHaveURL(/q=garcia/);
    await page.reload();
    await expect(page.getByRole("searchbox", { name: "Buscar invitado o grupo" })).toHaveValue(
      "garcia",
    );
    await expect(page.getByText(/^3 invitados/)).toBeVisible();
    const scope = isMobile ? page.getByRole("list").last() : page.getByRole("table");
    await expect(scope.getByText("Lucía García Ortega")).toBeVisible();
    await page.getByRole("searchbox", { name: "Buscar invitado o grupo" }).fill("zzz");
    await expect(page.getByText("Ningún invitado coincide con estos filtros")).toBeVisible();
  });

  for (const path of PAGES) {
    test(`sin desbordes ni infracciones graves en ${path}`, async ({ page }) => {
      await page.goto(path);
      await page.waitForTimeout(400);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
      const { violations } = await new AxeBuilder({ page }).analyze();
      const serious = violations.filter((v) => ["serious", "critical"].includes(v.impact ?? ""));
      expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(" | ")}`)).toEqual(
        [],
      );
    });
  }
});

test.describe("aperturas de las invitaciones", () => {
  test("el panel distingue las abiertas de las que nadie ha abierto", async ({ page }) => {
    await page.goto("/panel/demo");
    await expect(page.getByText(/aún no la han abierto/)).toBeVisible();
    await page.goto("/panel/demo/invitaciones");
    await expect(page.getByText("Sin abrir").first()).toBeVisible();
    await expect(page.getByText(/^Abierta el \d{2}\/\d{2}\/\d{4}$/).first()).toBeVisible();
    // Los recordatorios empiezan por las que nadie ha abierto.
    await page.goto("/panel/demo/comunicaciones");
    const first = page
      .getByRole("listitem")
      .filter({ hasText: /Sin abrir|Abierta el/ })
      .first();
    await expect(first).toContainText("Sin abrir");
  });
});

test.describe("primeros pasos y novedades", () => {
  test("un evento recién creado ve la guía; la demo, ya hecha, no", async ({ page }) => {
    await page.goto("/panel/demo");
    await expect(page.getByRole("region", { name: "Primeros pasos" })).toHaveCount(0);

    await page.goto("/panel/demo?vista=nuevo");
    const guide = page.getByRole("region", { name: "Primeros pasos" });
    await expect(guide.getByText("0 de 4 hechos")).toBeVisible();
    await expect(guide.getByRole("listitem")).toHaveText([
      /Elegid la plantilla/,
      /Poned vuestras fotos y textos/,
      /Añadid las invitaciones/,
      /Publicad la invitación/,
    ]);
    // El primer paso es el siguiente por hacer.
    await expect(guide.getByRole("listitem").first()).toHaveAttribute("aria-current", "step");
    await guide.getByRole("link", { name: "Añadir invitaciones" }).click();
    await expect(page).toHaveURL(/\/panel\/demo\/invitaciones$/);
  });

  test("las respuestas nuevas salen hasta marcarlas como vistas", async ({ page }) => {
    await page.goto("/panel/demo");
    const news = page.getByRole("region", { name: "Desde vuestra última visita" });
    await expect(news).toBeVisible();
    await expect(news.getByText(/^\d+ respuestas nuevas: /)).toBeVisible();
    await expect(
      news.getByText(/^(Confirma: vienen? \d+ personas?|No podrá venir)$/).first(),
    ).toBeVisible();
    // El punto de la navegación, junto a «Invitaciones».
    const nav = page.getByRole("navigation", { name: "Panel" }).locator("visible=true");
    await expect(
      nav.getByRole("link", {
        name: /Invitaciones \(respuestas nuevas\)|\(respuestas nuevas\)\s*Invitaciones/,
      }),
    ).toBeVisible();

    // Al cambiar de página dentro de la misma visita, siguen ahí.
    await page.goto("/panel/demo/mesas");
    await page.goto("/panel/demo");
    await expect(news).toBeVisible();

    await news.getByRole("button", { name: "Marcar como visto" }).click();
    await expect(news).toHaveCount(0);
    await expect(page.getByTestId("punto-novedades")).toHaveCount(0);
    await page.reload();
    await expect(page.getByRole("heading", { level: 1, name: "Hola, María" })).toBeVisible();
    await expect(news).toHaveCount(0);
  });

  test("sin poder guardar en el navegador, el panel funciona y no hay novedades", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      const fail = () => {
        throw new Error("bloqueado");
      };
      Object.defineProperty(window, "localStorage", { get: fail });
      Object.defineProperty(window, "sessionStorage", { get: fail });
    });
    await page.goto("/panel/demo");
    await expect(page.getByRole("heading", { level: 1, name: "Hola, María" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Desde vuestra última visita" })).toHaveCount(0);
  });
});

test.describe("entrar", () => {
  test("sin cuentas en este entorno, lleva al panel de ejemplo", async ({ page }) => {
    await page.goto("/entrar");
    await expect(page.getByRole("heading", { level: 1, name: "Vuestro panel" })).toBeVisible();
    await page.getByRole("link", { name: "Ver el panel de ejemplo" }).click();
    await expect(page).toHaveURL(/\/panel\/demo$/);
  });
});
