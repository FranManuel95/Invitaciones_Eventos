import { FEATURED_TEMPLATE_IDS, isConceptCover, TEMPLATES } from "@/lib/theme";
import { COVER_IDS, COVERS, isPaintedCover, isShownCover, type CoverId } from "@/lib/theme/cover";
import { FILMS, OPENINGS, SHOWN_OPENING_IDS } from "@/lib/theme/envelope";
import type { SampleFamily } from "./sample-book";

/*
 * Escaparates de /ejemplos: las plantillas, las aperturas y las portadas, ordenadas en familias
 * para el muestrario (`SampleBook`). Las imágenes y grabaciones son de la invitación de ejemplo
 * (se regeneran con scripts/capturas-venta.mjs) y cada pieza lleva a esa misma variante abierta a
 * pantalla completa.
 */

const DEMO = "/i/familia-garcia";

/** Las plantillas, con lo que se abre después de la portada asomando delante. */
export function templateFamilies(): SampleFamily[] {
  const pick = (concept: boolean) =>
    FEATURED_TEMPLATE_IDS.filter((id) => isConceptCover(TEMPLATES[id].look.cover!) === concept).map(
      (id) => {
        const template = TEMPLATES[id];
        const film = template.look.film ? FILMS[template.look.film] : null;
        return {
          id,
          label: template.label,
          description: template.description,
          inset: `/venta/plantilla-${id}.webp`,
          detail: film ? `Se abre con: ${film.label.toLowerCase()}.` : undefined,
        };
      },
    );
  return [
    {
      id: "papel",
      label: "Papel y acuarela",
      note: "Acuarelas, papeles y vuestra foto. Delante, lo que se abre después de la portada: un sobre, una caja o un díptico.",
      templates: pick(false),
    },
    {
      id: "objetos",
      label: "Objetos",
      note: "La invitación es otra cosa: un periódico con vuestro titular, una tarjeta de embarque, un décimo que se rasca, un disco que se saca de la funda.",
      templates: pick(true),
    },
  ];
}

/** Las aperturas en marcha: cada una, su grabación dentro del móvil. */
export function openingFamilies(): SampleFamily[] {
  return [
    {
      id: "aperturas",
      label: "Aperturas",
      note: "",
      templates: SHOWN_OPENING_IDS.map((id) => ({
        id,
        label: OPENINGS[id].label,
        description: OPENINGS[id].description,
        href: `${DEMO}?apertura=${id}`,
        reel: id,
        badge: OPENINGS[id].premium ? "Premium" : undefined,
      })),
    },
  ];
}

/** Los fondos de la portada, por familias. «Vuestro vídeo» necesita un vídeo de la pareja. */
export function coverFamilies(): SampleFamily[] {
  const shown = COVER_IDS.filter((id) => id !== "video" && isShownCover(id));
  const item = (id: CoverId) => ({
    id,
    label: COVERS[id].label,
    description: COVERS[id].description,
    href: `${DEMO}?portada=${id}`,
    src: `/venta/portada-${id}.webp`,
  });
  return [
    {
      id: "animadas",
      label: "Con movimiento",
      note: "Vuestra foto con profundidad o una escena que se mueve: luces, estrellas, flores que se abren.",
      templates: shown.filter((id) => !isPaintedCover(id) && !isConceptCover(id)).map(item),
    },
    {
      id: "pintadas",
      label: "Pintadas",
      note: "Acuarelas y papeles con el centro despejado para vuestros nombres.",
      templates: shown.filter(isPaintedCover).map(item),
    },
    {
      id: "objetos",
      label: "Objetos",
      note: "La portada es el objeto entero, con vuestros nombres en su sitio: la cabecera del periódico, el billete, el décimo.",
      templates: shown.filter(isConceptCover).map(item),
    },
  ];
}
