/*
 * Crucigrama de la plantilla de concepto «Crucigrama»: los nombres de la pareja se cruzan en una
 * cuadrícula, como en los pasatiempos (mayúsculas y sin tildes).
 */

/** Letras de un nombre para el crucigrama: mayúsculas y sin tildes (la Ñ se queda). */
export function crosswordLetters(word: string): string[] {
  return [
    ...word
      .toUpperCase()
      .replace(/Ñ/g, "\u0000")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\u0000/g, "Ñ")
      .replace(/[^A-ZÑ]/g, ""),
  ];
}

export interface Crossword {
  rows: number;
  cols: number;
  /** Letra de cada casilla con letra, por «fila,columna». */
  cells: Map<string, string>;
  /** Si las palabras comparten una letra y se cruzan (si no, van una debajo de otra). */
  crossed: boolean;
}

/**
 * Cruza dos palabras: la primera en horizontal y la segunda en vertical por la primera letra que
 * compartan. Si no comparten ninguna, la segunda va en horizontal debajo, separada por una fila.
 */
export function crossWords(across: string[], down: string[]): Crossword {
  for (let i = 0; i < across.length; i++) {
    const j = down.indexOf(across[i]!);
    if (j >= 0) {
      const cells = new Map<string, string>();
      across.forEach((ch, c) => cells.set(`${j},${c}`, ch));
      down.forEach((ch, r) => cells.set(`${r},${i}`, ch));
      return { rows: down.length, cols: across.length, cells, crossed: true };
    }
  }
  const cells = new Map<string, string>();
  across.forEach((ch, c) => cells.set(`0,${c}`, ch));
  down.forEach((ch, c) => cells.set(`2,${c}`, ch));
  return {
    rows: down.length ? 3 : 1,
    cols: Math.max(across.length, down.length),
    cells,
    crossed: false,
  };
}
