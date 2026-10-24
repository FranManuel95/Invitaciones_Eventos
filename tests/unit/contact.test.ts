import { describe, expect, it } from "vitest";
import { validateContact } from "@/lib/sales/contact";

const base = { names: "Ana y Luis", email: "ana@example.invalid", weddingDate: "", message: "" };

describe("formulario de la página de venta", () => {
  it("acepta lo mínimo (nombres y correo) y limpia los espacios", () => {
    const r = validateContact({ ...base, names: "  Ana y Luis ", email: " ana@example.invalid " });
    expect(r).toEqual({
      ok: true,
      data: { names: "Ana y Luis", email: "ana@example.invalid", weddingDate: "", message: "" },
    });
  });

  it("marca cada campo que falla con un mensaje propio", () => {
    const r = validateContact({ names: " ", email: "ana", weddingDate: "12/06/2027", message: "" });
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.errors).toEqual({
      names: "Escribid vuestros nombres.",
      email: "Revisad el correo: le falta algo.",
      weddingDate: "Elegid la fecha en el calendario.",
    });
  });

  it("rechaza mensajes demasiado largos", () => {
    const r = validateContact({ ...base, message: "a".repeat(2001) });
    expect(r.ok).toBe(false);
  });
});
