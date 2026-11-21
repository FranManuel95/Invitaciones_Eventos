import { describe, expect, it } from "vitest";
import { PLANS, PRICE_FROM_EUR, planName, withPlan } from "@/lib/sales/plans";

describe("paquetes de la página de venta", () => {
  it("el precio «desde» es el del más barato y cada paquete cuesta más que el anterior", () => {
    expect(PRICE_FROM_EUR).toBe(PLANS[0]?.price);
    const prices = PLANS.map((p) => p.price);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  it("marca el paquete en el mensaje, y no inventa uno que no existe", () => {
    expect(withPlan("Hola", "album")).toBe("Paquete: Invitación + álbum.\n\nHola");
    expect(withPlan("Hola", "no-se")).toBe("Hola");
    expect(withPlan("Hola", "<script>")).toBe("Hola");
    expect(planName("todo")).toBe("Todo incluido");
  });

  it("no pasa del límite del mensaje", () => {
    expect(withPlan("x".repeat(2000), "todo")).toHaveLength(2000);
  });
});
