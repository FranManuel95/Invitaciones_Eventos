import { describe, expect, it } from "vitest";
import { CSV_TEMPLATE, csvToGroups, parseCsv } from "@/lib/guests/csv";
import { validateGroup } from "@/lib/guests/group-input";
import { inviteMessage, normalizePhone, whatsappUrl } from "@/lib/guests/share";

describe("CSV de invitados", () => {
  it("lee comillas, comas dentro de un campo, BOM y saltos de línea de Windows", () => {
    expect(parseCsv('﻿a,b,c\r\n"García, Lucía","dice ""hola""",3\r\n')).toEqual([
      ["a", "b", "c"],
      ["García, Lucía", 'dice "hola"', "3"],
    ]);
  });

  it("detecta el punto y coma de Excel en español", () => {
    expect(parseCsv("a;b\n1,5;2")).toEqual([
      ["a", "b"],
      ["1,5", "2"],
    ]);
  });

  it("agrupa la plantilla en invitaciones con su primera persona como principal", () => {
    const { groups, errors } = csvToGroups(CSV_TEMPLATE);
    expect(errors).toEqual([]);
    expect(groups.map((g) => [g.displayName, g.members.length, g.maxAttendees])).toEqual([
      ["Familia Ejemplo", 3, 4],
      ["Carmen Prueba", 1, 2],
    ]);
    expect(groups[0]?.members[2]).toMatchObject({ firstName: "Martina", isChild: true });
    expect(groups[0]?.phone).toBe("600 000 000");
  });

  it("acepta cabeceras con tildes y mayúsculas y completa las plazas", () => {
    const { groups } = csvToGroups("Invitación,Nombre,Niño\nLos Pérez,Juan,\nLos Pérez,Rosa,\n");
    expect(groups[0]).toMatchObject({
      displayName: "Los Pérez",
      maxAttendees: 2,
      category: "Familia",
    });
  });

  it("marca los errores con su número de línea", () => {
    const { errors } = csvToGroups(
      "invitacion;nombre;plazas\nFamilia A;;\n;Pepe;\nFamilia B;Eva;dos\nFamilia C;Eva;0\n",
    );
    expect(errors).toEqual([
      { line: 2, message: "Falta el nombre de la persona." },
      { line: 3, message: "Falta el nombre de la invitación." },
      { line: 4, message: "Las plazas tienen que ser un número entero." },
      { line: 5, message: "Las plazas tienen que ser un número entero." },
    ]);
  });

  it("exige las columnas imprescindibles", () => {
    expect(csvToGroups("nombre;apellidos\nAna;Ruiz").errors[0]?.message).toBe(
      "Falta la columna «invitacion».",
    );
  });
});

describe("invitación", () => {
  const base = {
    displayName: "Familia Ruiz",
    category: "Familia",
    maxAttendees: 1,
    phone: "",
    members: [
      { firstName: "Ana", lastName: "Ruiz", isChild: false },
      { firstName: "Leo", lastName: "Ruiz", isChild: true },
    ],
  };

  it("no deja menos plazas que personas", () => {
    const check = validateGroup(base);
    expect(check.ok).toBe(false);
    if (!check.ok) {
      expect(check.errors.get("maxAttendees")).toBe(
        "Las plazas no pueden ser menos que las personas de la invitación.",
      );
    }
    expect(validateGroup({ ...base, maxAttendees: 3 }).ok).toBe(true);
  });

  it("exige un nombre en cada persona", () => {
    const check = validateGroup({
      ...base,
      maxAttendees: 2,
      members: [{ firstName: " ", lastName: "", isChild: false }],
    });
    expect(check.ok ? null : check.errors.get("members.0.firstName")).toBe(
      "Este campo no puede quedar vacío.",
    );
  });
});

describe("envío", () => {
  it("normaliza teléfonos", () => {
    expect(normalizePhone("600 12 34 56")).toBe("34600123456");
    expect(normalizePhone("+34 600-123-456")).toBe("34600123456");
    expect(normalizePhone("0033 6 12 34 56 78")).toBe("33612345678");
    expect(normalizePhone("123")).toBeNull();
    expect(normalizePhone("")).toBeNull();
  });

  it("escribe en singular o en plural", () => {
    const couple = { first: "María", second: "Daniel" };
    const one = inviteMessage(
      couple,
      { displayName: "Carlos", members: [{}], maxAttendees: 1 },
      "u",
    );
    const many = inviteMessage(
      couple,
      { displayName: "Familia", members: [{}, {}], maxAttendees: 2 },
      "u",
    );
    expect(one).toContain("queremos que estés");
    expect(one).toContain("tienes tu invitación");
    expect(many).toContain("queremos que estéis");
    expect(many).toContain("tenéis vuestra invitación");
  });

  it("abre WhatsApp con el texto codificado y, si lo hay, el número", () => {
    expect(whatsappUrl("Hola & adiós", "600123456")).toBe(
      "https://wa.me/34600123456?text=Hola%20%26%20adi%C3%B3s",
    );
    expect(whatsappUrl("Hola")).toBe("https://wa.me/?text=Hola");
  });
});
