import type { AllergyId, MenuId } from "./types";

export const ALLERGIES: { id: AllergyId; label: string }[] = [
  { id: "gluten", label: "Gluten" },
  { id: "lactosa", label: "Lactosa" },
  { id: "frutos-secos", label: "Frutos secos" },
  { id: "marisco", label: "Marisco" },
  { id: "huevo", label: "Huevo" },
  { id: "otros", label: "Otros" },
];

export const MENU_LABELS: Record<MenuId, string> = {
  carne: "Carne",
  pescado: "Pescado",
  vegetariano: "Vegetariano",
  vegano: "Vegano",
  infantil: "Infantil",
};

export const allergyLabel = (id: AllergyId) => ALLERGIES.find((a) => a.id === id)?.label ?? id;
