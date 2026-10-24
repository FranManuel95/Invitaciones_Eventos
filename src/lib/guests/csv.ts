import { validateGroup, type GroupInput } from "./group-input";

/*
 * Importación de invitados desde una hoja de cálculo. Una fila por persona; las filas con la
 * misma «invitacion» forman un grupo. Se aceptan coma o punto y coma (Excel en español usa «;»),
 * comillas y la marca BOM, y las cabeceras con o sin tildes ni mayúsculas.
 */

export const CSV_COLUMNS = [
  "invitacion",
  "categoria",
  "plazas",
  "telefono",
  "nombre",
  "apellidos",
  "nino",
] as const;

export const MAX_CSV_ROWS = 500;

export const CSV_TEMPLATE = [
  "invitacion;categoria;plazas;telefono;nombre;apellidos;nino",
  "Familia Ejemplo;Familia;4;600 000 000;Ana;Ejemplo Ruiz;no",
  "Familia Ejemplo;Familia;4;;Luis;Ejemplo Ruiz;no",
  "Familia Ejemplo;Familia;4;;Martina;Ejemplo;sí",
  "Carmen Prueba;Amigos;2;;Carmen;Prueba;no",
].join("\n");

/** Lee un CSV con comillas dobles. Detecta el separador por la primera línea. */
export function parseCsv(text: string): string[][] {
  const source = text.replace(/^﻿/, "");
  const firstLine = source.split(/\r?\n/, 1)[0] ?? "";
  const sep =
    (firstLine.match(/;/g)?.length ?? 0) >= (firstLine.match(/,/g)?.length ?? 0) ? ";" : ",";
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    if (quoted) {
      if (ch === '"' && source[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') {
        quoted = false;
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === sep) {
      row.push(cell);
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && source[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += ch;
    }
  }
  if (cell !== "" || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

const normalizeHeader = (h: string) =>
  h
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");

const YES = new Set(["si", "s", "x", "1", "true", "yes"]);

export interface CsvLineError {
  /** Número de línea en el archivo (la cabecera es la 1). */
  line: number;
  message: string;
}

export interface CsvResult {
  groups: GroupInput[];
  errors: CsvLineError[];
}

/** Convierte las filas del CSV en invitaciones listas para guardar, con errores por línea. */
export function csvToGroups(text: string): CsvResult {
  const rows = parseCsv(text);
  const errors: CsvLineError[] = [];
  const [header, ...body] = rows;
  if (!header) return { groups: [], errors: [{ line: 1, message: "El archivo está vacío." }] };
  const columns = header.map(normalizeHeader);
  const index = Object.fromEntries(CSV_COLUMNS.map((c) => [c, columns.indexOf(c)])) as Record<
    (typeof CSV_COLUMNS)[number],
    number
  >;
  for (const required of ["invitacion", "nombre"] as const) {
    if (index[required] < 0) {
      errors.push({ line: 1, message: `Falta la columna «${required}».` });
    }
  }
  if (errors.length) return { groups: [], errors };
  if (body.length > MAX_CSV_ROWS) {
    return {
      groups: [],
      errors: [{ line: 1, message: `Como máximo ${MAX_CSV_ROWS} personas por archivo.` }],
    };
  }

  const get = (row: string[], col: (typeof CSV_COLUMNS)[number]) =>
    index[col] >= 0 ? (row[index[col]] ?? "").trim() : "";

  // Agrupa conservando el orden de aparición y la primera línea de cada invitación.
  const drafts = new Map<
    string,
    {
      line: number;
      category: string;
      plazas: number;
      phone: string;
      members: GroupInput["members"];
    }
  >();
  body.forEach((row, i) => {
    const line = i + 2;
    const name = get(row, "invitacion");
    const first = get(row, "nombre");
    if (!name) return errors.push({ line, message: "Falta el nombre de la invitación." });
    if (!first) return errors.push({ line, message: "Falta el nombre de la persona." });
    const plazasText = get(row, "plazas");
    const plazas = plazasText ? Number(plazasText) : 0;
    if (plazasText && (!Number.isInteger(plazas) || plazas < 1)) {
      return errors.push({ line, message: "Las plazas tienen que ser un número entero." });
    }
    const draft = drafts.get(name) ?? {
      line,
      category: "",
      plazas: 0,
      phone: "",
      members: [],
    };
    draft.category ||= get(row, "categoria");
    draft.phone ||= get(row, "telefono");
    draft.plazas = Math.max(draft.plazas, plazas);
    draft.members.push({
      firstName: first,
      lastName: get(row, "apellidos"),
      isChild: YES.has(normalizeHeader(get(row, "nino"))),
    });
    drafts.set(name, draft);
  });

  const groups: GroupInput[] = [];
  for (const [displayName, d] of drafts) {
    const check = validateGroup({
      displayName,
      category: d.category || "Familia",
      maxAttendees: Math.max(d.plazas, d.members.length),
      phone: d.phone,
      members: d.members,
    });
    if (check.ok) groups.push(check.group);
    else {
      const [message] = check.errors.values();
      errors.push({ line: d.line, message: `«${displayName}»: ${message ?? "revisa sus datos."}` });
    }
  }
  return { groups, errors: errors.sort((a, b) => a.line - b.line) };
}
