import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("después de la boda", () => {
  test("la invitación da las gracias y lleva al álbum en vez de pedir confirmación", async ({
    page,
  }) => {
    await page.goto("/i/carlos-ruiz?dia=despues");
    await page.getByRole("button", { name: "Saltar intro" }).click();
    await expect(page.getByRole("heading", { name: "Gracias", level: 2 })).toBeVisible();
    await expect(page.getByText(/Gracias por venir, por bailar hasta tarde/)).toBeVisible();
    await expect(page.getByRole("link", { name: "Ver las fotos de la boda" })).toHaveAttribute(
      "href",
      "/album/demo",
    );
    await expect(page.getByRole("link", { name: "Confirmar asistencia" })).toHaveCount(0);
    await expect(page.locator("#confirmar")).toHaveCount(0);
    const { violations } = await new AxeBuilder({ page }).analyze();
    const serious = violations.filter((v) => ["serious", "critical"].includes(v.impact ?? ""));
    expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(" | ")}`)).toEqual([]);
  });

  test("la pareja descarga todas las fotos aprobadas en un zip", async ({ page }) => {
    await page.goto("/panel/demo/album");
    const button = page.getByRole("button", { name: "Descargar 4 fotos en un zip" });
    const download = page.waitForEvent("download");
    await button.click();
    expect((await download).suggestedFilename()).toBe("boda-maria-y-daniel.zip");
    await expect(page.getByText("Listo: 4 fotos descargadas.")).toBeVisible();
  });
});
