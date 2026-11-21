/*
 * Paquetes de la página de venta. Los precios son PROVISIONALES: se cambian aquí y se ven en la
 * tarjeta, en el texto del precio «desde» y en las preguntas. Pago único por boda.
 */

export const PLAN_IDS = ["invitacion", "album", "todo"] as const;
export type PlanId = (typeof PLAN_IDS)[number];

export interface Plan {
  id: PlanId;
  name: string;
  price: number;
  /** Para quién es, en una línea. */
  pitch: string;
  includes: string[];
  /** Se destaca en la lista (el más completo). */
  featured?: boolean;
}

const BASE = [
  "Invitaciones para todos vuestros invitados, sin límite",
  "Cincuenta y cinco plantillas, siete aperturas y todos los colores, letras y lacres",
  "Confirmaciones con menús y la lista de quién viene",
  "Cambios ilimitados, también después de enviarla",
];

export const PLANS: Plan[] = [
  {
    id: "invitacion",
    name: "Invitación",
    price: 79,
    pitch: "Para enviarla y saber quién viene.",
    includes: [...BASE, "Ayuda por correo para dejarla a vuestro gusto"],
  },
  {
    id: "album",
    name: "Invitación + álbum",
    price: 99,
    pitch: "Para guardar las fotos de todos los invitados.",
    includes: [
      ...BASE,
      "Álbum con QR: los invitados suben sus fotos con toda su calidad y vosotros elegís cuáles se ven",
      "Ayuda por correo para dejarla a vuestro gusto",
    ],
  },
  {
    id: "todo",
    name: "Todo incluido",
    price: 149,
    pitch: "Para organizar la boda entera, hasta el último día.",
    featured: true,
    includes: [
      ...BASE,
      "El panel: mesas, autobuses, menús, tareas, presupuesto y agenda",
      "Álbum con QR con las fotos a calidad completa",
      "Ayuda por correo para dejarla a vuestro gusto",
    ],
  },
];

/** El precio más bajo, para el «desde» de los textos. */
export const PRICE_FROM_EUR = Math.min(...PLANS.map((p) => p.price));

export const planName = (id: string): string | null => PLANS.find((p) => p.id === id)?.name ?? null;

/** Marca el paquete en el mensaje de la solicitud (se lee en el panel de Supabase). */
export function withPlan(message: string, id: string): string {
  const name = planName(id);
  return (name ? `Paquete: ${name}.\n\n${message}` : message).slice(0, 2000);
}
