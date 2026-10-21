import { existsSync } from "node:fs";
import { defineConfig, devices } from "@playwright/test";

// En entornos con Chromium preinstalado (p. ej. contenedores CI) se usa ese binario.
const chromiumPath = process.env.PLAYWRIGHT_CHROMIUM_PATH ?? "/opt/pw-browsers/chromium";
const launchOptions = existsSync(chromiumPath) ? { executablePath: chromiumPath } : {};
const port = Number(process.env.PORT ?? 3100);

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: { baseURL: `http://localhost:${port}`, trace: "retain-on-failure", launchOptions },
  projects: [
    { name: "movil", use: { ...devices["Pixel 7"], launchOptions } },
    { name: "escritorio", use: { ...devices["Desktop Chrome"], launchOptions } },
  ],
  webServer: {
    command: `npm run start -- -p ${port}`,
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
