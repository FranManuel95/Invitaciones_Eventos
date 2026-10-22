import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
const { isIndexable, legalComplete, legalInfo, signupOpen, siteUrl } = await import("@/lib/site");

afterEach(() => vi.unstubAllEnvs());

describe("ajustes del sitio", () => {
  it("sin dominio propio no se indexa nada", () => {
    vi.stubEnv("SITE_URL", "");
    expect(siteUrl()).toBeNull();
    expect(isIndexable()).toBe(false);
  });

  it("acepta el dominio con https y quita la barra final; rechaza otras formas", () => {
    vi.stubEnv("SITE_URL", "https://invitaciones.example/");
    expect(siteUrl()).toBe("https://invitaciones.example");
    vi.stubEnv("SITE_URL", "http://invitaciones.example");
    expect(siteUrl()).toBeNull();
    vi.stubEnv("SITE_URL", "https://invitaciones.example/ruta");
    expect(siteUrl()).toBeNull();
  });

  it("el alta de cuentas sigue abierta salvo que se cierre a propósito", () => {
    vi.stubEnv("SIGNUP_OPEN", "");
    expect(signupOpen()).toBe(true);
    vi.stubEnv("SIGNUP_OPEN", "False");
    expect(signupOpen()).toBe(false);
  });

  it("los textos legales están completos solo con todos los datos del titular", () => {
    vi.stubEnv("LEGAL_TITULAR", "Titular de ejemplo");
    vi.stubEnv("LEGAL_NIF", "00000000T");
    vi.stubEnv("LEGAL_DOMICILIO", "Calle Ficticia 1, Madrid");
    vi.stubEnv("LEGAL_EMAIL", "");
    expect(legalComplete(legalInfo())).toBe(false);
    vi.stubEnv("LEGAL_EMAIL", "hola@invitaciones.example");
    expect(legalComplete(legalInfo())).toBe(true);
  });
});
