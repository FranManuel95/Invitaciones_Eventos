/*
 * Carta: composición del contenido, borde del papel y ornamento de las esquinas de la escena.
 */

export const LAYOUT_IDS = ["clasica", "editorial", "foto", "marco", "minimal"] as const;
export const EDGE_IDS = ["barba", "recto", "redondeado"] as const;
export const ORNAMENT_IDS = ["almendro", "olivo", "eucalipto", "geometrico", "ninguno"] as const;

export type LayoutId = (typeof LAYOUT_IDS)[number];
export type EdgeId = (typeof EDGE_IDS)[number];
export type OrnamentId = (typeof ORNAMENT_IDS)[number];

export const LAYOUTS: Record<LayoutId, { label: string; description: string }> = {
  clasica: { label: "Clásica", description: "Todo centrado bajo el monograma." },
  editorial: {
    label: "Editorial",
    description: "Nombres grandes arriba y el texto alineado a la izquierda.",
  },
  foto: { label: "Con foto", description: "Vuestra foto encabeza la carta." },
  marco: { label: "Marco", description: "Doble filete dorado con esquinas grabadas." },
  minimal: { label: "Minimal", description: "Sin adornos: mucho aire y letra pequeña." },
};

export const EDGES: Record<EdgeId, { label: string; description: string }> = {
  barba: { label: "Barba de papel", description: "Borde irregular de papel hecho a mano." },
  recto: { label: "Corte recto", description: "Guillotinado limpio." },
  redondeado: { label: "Esquinas redondas", description: "Cantos suaves, más moderno." },
};

export const ORNAMENTS: Record<OrnamentId, { label: string; description: string }> = {
  almendro: { label: "Flor de almendro", description: "Ramilletes rosados." },
  olivo: { label: "Olivo", description: "Ramas de olivo con aceitunas." },
  eucalipto: { label: "Eucalipto", description: "Hojas redondas verde agua." },
  geometrico: { label: "Art déco", description: "Esquinas geométricas en oro." },
  ninguno: { label: "Sin ornamento", description: "Solo el papel." },
};
