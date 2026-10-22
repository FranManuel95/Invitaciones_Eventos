import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// PNG de 2×2 píxeles: suficiente para recorrer la reducción y la subida (simulada en la demo).
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAFklEQVR4nGP8z8DAwMDAxMDAwMDAAAANHQEDasKb6QAAAABJRU5ErkJggg==",
  "base64",
);

async function noSerious(page: Page) {
  const { violations } = await new AxeBuilder({ page }).analyze();
  const serious = violations.filter((v) => ["serious", "critical"].includes(v.impact ?? ""));
  expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(" | ")}`)).toEqual([]);
}

test.describe("álbum de los invitados", () => {
  test("el pase de fotos avanza, se pausa y se cierra", async ({ page }) => {
    await page.goto("/album/demo");
    await page.getByRole("button", { name: "Ver el pase de fotos" }).click();
    const show = page.getByRole("dialog", { name: "Pase de fotos" });
    await expect(show).toBeVisible();
    await expect(show.getByRole("img", { name: "Foto 1 de 6" })).toBeAttached();
    await show.getByRole("button", { name: "Foto siguiente" }).click();
    await expect(show.getByRole("img", { name: "Foto 2 de 6" })).toBeAttached();
    await show.getByRole("button", { name: "Pausar el pase" }).click();
    await expect(show.getByText("2 / 6")).toBeVisible();
    await page.keyboard.press("ArrowLeft");
    await expect(show.getByText("1 / 6")).toBeVisible();
    await noSerious(page);
    await page.keyboard.press("Escape");
    await expect(show).toBeHidden();
    await expect(page.getByRole("button", { name: "Ver el pase de fotos" })).toBeFocused();
  });

  test("se ven las fotos aprobadas y se sube una (demo)", async ({ page }) => {
    await page.goto("/album/demo");
    await expect(
      page.getByRole("heading", { level: 1, name: /El álbum de María & Daniel/ }),
    ).toBeVisible();
    await expect(page.getByRole("img", { name: /Foto \d del álbum/ })).toHaveCount(6);
    await page.getByLabel("Elegir fotos").setInputFiles({
      name: "foto.png",
      mimeType: "image/png",
      buffer: PNG,
    });
    await expect(page.getByText(/1 foto enviada/)).toBeVisible();
    await expect(page.getByText("Pendiente de revisar")).toBeVisible();
    await noSerious(page);
  });

  test("un álbum desconocido devuelve 404", async ({ page }) => {
    const response = await page.goto("/album/no-existe-este-album");
    expect(response?.status()).toBe(404);
  });

  test("la invitación enlaza al álbum", async ({ page }) => {
    await page.goto("/i/carlos-ruiz");
    await page.getByRole("button", { name: "Saltar intro" }).click();
    await expect(page.getByRole("link", { name: "Abrir el álbum" })).toHaveAttribute(
      "href",
      "/album/demo",
    );
  });

  test("el panel modera las fotos y muestra el QR", async ({ page }) => {
    await page.goto("/panel/demo/album");
    await expect(page.getByRole("heading", { name: "Álbum de los invitados" })).toBeVisible();
    await expect(page.getByRole("img", { name: "Código QR del álbum" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Por revisar (2)" })).toBeVisible();
    await page.getByRole("button", { name: "Aprobar la foto 1" }).click();
    await expect(page.getByRole("button", { name: "Por revisar (1)" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Aprobadas (5)" })).toBeVisible();
    await noSerious(page);
  });
});
