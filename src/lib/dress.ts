/** Pictograma de una sugerencia de vestimenta según a quién va dirigida. */
export type DressKind = "dress" | "suit" | "kids" | "hanger";

export function dressKind(who: string): DressKind {
  const key = who.toLowerCase();
  if (/niñ|peque|infant|bebé/.test(key)) return "kids";
  if (/\bella|mujer|dama|invitadas/.test(key)) return "dress";
  if (/\bellos\b|\bél\b|hombre|caballero|invitados/.test(key)) return "suit";
  return "hanger";
}
