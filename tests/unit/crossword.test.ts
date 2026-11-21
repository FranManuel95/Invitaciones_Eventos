import { describe, expect, it } from "vitest";
import { crossWords, crosswordLetters } from "@/lib/crossword";

describe("crucigrama de la boda", () => {
  it("escribe los nombres en mayúsculas, sin tildes y conservando la Ñ", () => {
    expect(crosswordLetters("Inés").join("")).toBe("INES");
    expect(crosswordLetters("Begoña").join("")).toBe("BEGOÑA");
    expect(crosswordLetters("José María").join("")).toBe("JOSEMARIA");
  });

  it("cruza los nombres por la primera letra común", () => {
    const grid = crossWords(crosswordLetters("María"), crosswordLetters("Daniel"));
    expect(grid.crossed).toBe(true);
    // La A de MARIA (columna 1) es la A de DANIEL (fila 1).
    expect(grid.cells.get("1,1")).toBe("A");
    expect(grid.cells.get("1,0")).toBe("M");
    expect(grid.cells.get("0,1")).toBe("D");
    expect(grid).toMatchObject({ rows: 6, cols: 5 });
    expect(grid.cells.size).toBe(5 + 6 - 1);
  });

  it("si no comparten letras, van una debajo de otra", () => {
    const grid = crossWords(crosswordLetters("Ruth"), crosswordLetters("Paco"));
    expect(grid).toMatchObject({ rows: 3, cols: 4, crossed: false });
    expect(grid.cells.get("2,0")).toBe("P");
  });

  it("con una sola persona (cumpleaños) queda una fila", () => {
    expect(crossWords(crosswordLetters("Lola"), [])).toMatchObject({ rows: 1, cols: 4 });
  });
});
