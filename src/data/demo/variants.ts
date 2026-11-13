import type { WeddingEvent } from "@/lib/domain/types";
import type { GuestbookState } from "@/lib/guestbook";
import type { TemplateId } from "@/lib/theme";
import { demoEvent } from "./event";

/**
 * Bodas ficticias para enseñar plantillas distintas como si fueran de parejas distintas
 * (`?plantilla=buganvilla`, `?plantilla=olivar`). El resto de plantillas usa la de María y Daniel.
 * Nombres, lugares, teléfonos y cuentas son inventados.
 */
interface DemoVariant {
  event: WeddingEvent;
  guestbook: GuestbookState;
}

/**
 * Fotos de cada variante. Mientras no existan las suyas (ver `docs/higgsfield/TANDA-INSTAGRAM.md`)
 * apuntan a las de la demo principal: al generarlas, solo se cambia este mapa.
 */
const PHOTOS = {
  buganvilla: {
    cover: "/fotos/portada.jpg",
    depth: "/fotos/portada-profundidad.png",
    couple: "/fotos/pareja.jpg",
    ceremony: "/fotos/iglesia.jpg",
    venue: "/fotos/finca.jpg",
    banquet: "/fotos/banquete.jpg",
    story: [
      "/fotos/historia-amalfi.jpg",
      "/fotos/historia-florencia.jpg",
      "/fotos/historia-pedida.jpg",
      "/fotos/historia-hoy.jpg",
    ],
  },
  olivar: {
    cover: "/fotos/olivar/portada.jpg",
    depth: "/fotos/olivar/portada-profundidad.png",
    couple: "/fotos/olivar/pareja.jpg",
    ceremony: "/fotos/olivar/ceremonia.jpg",
    venue: "/fotos/olivar/finca.jpg",
    banquet: "/fotos/olivar/banquete.jpg",
    story: [
      "/fotos/olivar/historia-1.jpg",
      "/fotos/olivar/historia-2.jpg",
      "/fotos/olivar/historia-3.jpg",
      "/fotos/olivar/historia-4.jpg",
    ],
  },
} as const;

function guestbook(messages: [name: string, body: string][], songs: string[]): GuestbookState {
  return {
    messages: messages.map(([name, body], index) => ({
      id: `demo-${index + 1}`,
      name,
      body,
      createdAt: new Date(Date.UTC(2027, 1, 14 - index * 3, 9, 10)).toISOString(),
      mine: false,
    })),
    songs,
  };
}

const buganvilla: DemoVariant = {
  event: {
    ...demoEvent,
    id: "evt-demo-carmen-alvaro",
    couple: { first: "Carmen", second: "Álvaro", monogram: "C&A" },
    date: "2027-09-18T18:00:00+02:00",
    city: "Altea",
    region: "Alicante",
    rsvpDeadline: "2027-08-10T23:59:00+02:00",
    hashtag: "#CarmenYÁlvaro",
    cardMessage:
      "Queremos celebrarlo frente al mar y con la gente que más queremos. Nos encantaría que estuvieras.",
    welcomeMessage:
      "Nos conocimos un verano y nos casamos en otro. Aquí tienes todo lo que necesitas para acompañarnos, con los pies casi en el agua.",
    thankYouMessage:
      "Gracias por venir hasta el mar, por los bailes descalzos y por cada brindis. Aquí están vuestras fotos.",
    venues: [
      {
        id: "iglesia",
        name: "Ermita de Santa Lucía",
        kind: "Ceremonia",
        address: "Carrer del Mirador, 3",
        city: "Altea, Alicante",
        mapsQuery: "Casco antiguo Altea",
        note: "Se sube a pie por el casco antiguo: mejor calzado cómodo y llegar 20 minutos antes.",
        photo: PHOTOS.buganvilla.ceremony,
        photoAlt: "Ermita encalada con cúpula azul sobre el mar",
      },
      {
        id: "finca",
        name: "Finca Cala Blanca",
        kind: "Cóctel, cena y fiesta",
        address: "Camí de la Cala, s/n",
        city: "Altea, Alicante",
        mapsQuery: "Altea Alicante",
        note: "A 10 minutos de la ermita. Los autobuses salen del paseo al terminar la ceremonia.",
        photo: PHOTOS.buganvilla.venue,
        photoAlt: "Terraza de la finca al atardecer, con mesas largas y el mar al fondo",
      },
    ],
    climate: { max: 28, min: 20, rainChance: 15, place: "Altea, Alicante" },
    program: [
      {
        id: "ceremonia",
        time: "18:00",
        title: "Ceremonia",
        venueId: "iglesia",
        place: "Ermita de Santa Lucía",
        description: "Con la luz de la tarde y el mar detrás. Os esperamos dentro con tiempo.",
        icon: "ceremony",
      },
      {
        id: "coctel",
        time: "19:30",
        title: "Cóctel",
        venueId: "finca",
        place: "Terraza del mar",
        description: "Vermut, arroces en la barra y la puesta de sol de fondo.",
        icon: "cocktail",
      },
      {
        id: "banquete",
        time: "21:30",
        title: "Cena",
        venueId: "finca",
        place: "Bajo las buganvillas",
        description: "Mesas largas al aire libre, con el menú que elijas al confirmar.",
        icon: "banquet",
      },
      {
        id: "fiesta",
        time: "00:30",
        title: "Fiesta",
        venueId: "finca",
        place: "Hasta que salga el sol",
        description: "Barra libre, alpargatas para bailar y recena a las tres.",
        icon: "party",
      },
    ],
    busRoutes: [
      {
        id: "alicante",
        label: "Alicante → Finca",
        pickupPoint: "Explanada de España, Alicante",
        departure: "16:30",
        returnTrips: ["02:00", "04:30"],
        seats: 50,
      },
      {
        id: "valencia",
        label: "Valencia → Finca",
        pickupPoint: "Estación Joaquín Sorolla, Valencia",
        departure: "15:30",
        returnTrips: ["04:30"],
        seats: 30,
      },
    ],
    menu: [
      { id: "carne", label: "Carne", description: "Cordero al horno con romero y patata" },
      { id: "pescado", label: "Pescado", description: "Dorada a la sal con verduras de la huerta" },
      { id: "vegetariano", label: "Vegetariano", description: "Arroz meloso de alcachofas" },
      { id: "vegano", label: "Vegano", description: "Coca de verduras asadas y almendra" },
      {
        id: "infantil",
        label: "Infantil",
        description: "Menú pensado para los más pequeños",
        childrenOnly: true,
      },
    ],
    dressCode: {
      title: "Elegante de verano",
      detail:
        "Lino, colores vivos y sandalia. La cena es al aire libre: traed algo para los hombros.",
      palette: [
        { name: "Fucsia buganvilla", hex: "#c2357a" },
        { name: "Cal", hex: "#f4efe6" },
        { name: "Azul cúpula", hex: "#3f6fa3" },
        { name: "Arena", hex: "#d9c7a6" },
        { name: "Verde pino", hex: "#5d7a5f" },
      ],
      examples: [
        { who: "Ellas", text: "Vestido largo y fluido en un color alegre; sandalia plana o cuña." },
        { who: "Ellos", text: "Traje de lino claro, sin corbata; mocasín o alpargata." },
        { who: "Niños", text: "Ropa fresca y cómoda: habrá juegos en el jardín." },
      ],
    },
    accommodation: [
      {
        name: "Hotel Mirador de Altea",
        distance: "A 5 min de la ermita",
        detail: "Habitaciones reservadas hasta el 1 de agosto. Menciona la boda.",
      },
      {
        name: "Casa La Barqueta",
        distance: "A 10 min de la finca",
        detail: "Apartamentos junto a la playa, ideales para quedarse el fin de semana.",
      },
    ],
    story: {
      intro: "Ocho veranos, una furgoneta y demasiadas paellas. Esta es la versión corta.",
      couplePhoto: PHOTOS.buganvilla.couple,
      moments: [
        {
          year: "2019",
          title: "Un verano en Cadaqués",
          text: "Ella vendía helados y él volvió cinco veces en una tarde. A la sexta le pidió el teléfono.",
          photo: PHOTOS.buganvilla.story[0],
          photoAlt: "Carmen y Álvaro de espaldas, sentados frente a una cala",
        },
        {
          year: "2021",
          title: "La furgoneta",
          text: "Tres semanas por la costa de Portugal, durmiendo con el ruido de las olas. Volvimos sin un euro y sin dudas.",
          photo: PHOTOS.buganvilla.story[1],
          photoAlt: "Carmen y Álvaro mirando el mar desde un acantilado",
        },
        {
          year: "2026",
          title: "La pedida",
          text: "En la barca de su abuelo, al amanecer. El anillo casi acaba en el agua, pero dijo que sí.",
          photo: PHOTOS.buganvilla.story[2],
          photoAlt: "Anillo de compromiso en un estuche sobre una mesa de madera clara",
        },
        {
          year: "Hoy",
          title: "Y ahora, la boda",
          text: "Vivimos en Valencia, a quince minutos de la playa en bici. Solo faltáis vosotros.",
          photo: PHOTOS.buganvilla.story[3],
          photoAlt: "Carmen y Álvaro de espaldas, paseando por la orilla al atardecer",
        },
      ],
    },
    coverPhoto: PHOTOS.buganvilla.cover,
    coverDepthMap: PHOTOS.buganvilla.depth,
    banquetPhoto: PHOTOS.buganvilla.banquet,
    gift: {
      ...demoEvent.gift,
      holder: "Carmen y Álvaro (cuenta de demostración)",
      items: [
        {
          id: "viaje",
          title: "Nuestro viaje a Grecia",
          detail: "Dos semanas de isla en isla por las Cícladas. Cualquier aportación nos acerca.",
          price: "Lo que queráis",
          url: "",
          photo: null,
          shared: true,
        },
        {
          id: "vajilla",
          title: "Paellera y fuego para la terraza",
          detail: "Para devolveros todas las paellas que os debemos.",
          price: "220 €",
          url: "",
          photo: null,
          shared: false,
        },
        {
          id: "cafetera",
          title: "Dos bicis de paseo",
          detail: "Para ir a la playa sin buscar aparcamiento.",
          price: "480 €",
          url: "",
          photo: null,
          shared: false,
        },
        {
          id: "olivo",
          title: "Una buganvilla para el balcón",
          detail: "La plantaremos al volver del viaje.",
          price: "45 €",
          url: "",
          photo: null,
          shared: false,
        },
      ],
    },
    faqs: [
      {
        question: "¿Puedo llevar a mis hijos?",
        answer: "Sí, si aparecen en tu invitación. Habrá monitores y cena para ellos.",
      },
      {
        question: "¿Hasta cuándo puedo cambiar mi respuesta?",
        answer: "Puedes editarla desde este mismo enlace hasta el 10 de agosto de 2027.",
      },
      {
        question: "¿Y si refresca por la noche?",
        answer: "Habrá mantas en las sillas, pero traed algo para los hombros.",
      },
      {
        question: "¿Hay lista de bodas?",
        answer: "No hay lista: en la sección «Regalo» tenéis algunas ideas y nuestra cuenta.",
      },
    ],
  },
  guestbook: guestbook(
    [
      [
        "Marta y Quique",
        "Ocho veranos esperando esta fiesta. Llevamos las alpargatas de repuesto.",
      ],
      ["Tía Amparo", "Qué ilusión más grande. Ya tengo el abanico a juego con las buganvillas."],
      ["Nacho", "Exijo que la paella de la recena la haga el novio. Es lo justo."],
      ["Las primas de Dénia", "Vamos todas en el autobús de Alicante. ¡Vivan los novios!"],
    ],
    [
      "Mediterráneo",
      "La bicicleta",
      "Dancing Queen",
      "Camarón que se duerme",
      "Valerie",
      "Sarandonga",
      "Mi gran noche",
      "September",
    ],
  ),
};

const olivar: DemoVariant = {
  event: {
    ...demoEvent,
    id: "evt-demo-elena-hugo",
    couple: { first: "Elena", second: "Hugo", monogram: "E&H" },
    date: "2027-10-16T12:30:00+02:00",
    city: "Baeza",
    region: "Jaén",
    rsvpDeadline: "2027-09-05T23:59:00+02:00",
    hashtag: "#ElenaYHugo",
    cardMessage:
      "Nos casamos entre olivos, donde empezó todo, y no nos lo imaginamos sin ti. Ven a celebrarlo con nosotros.",
    welcomeMessage:
      "Seis años, una cosecha a medias y un huerto que por fin da tomates: nos casamos. Aquí tienes todo lo necesario para pasar el día con nosotros.",
    thankYouMessage:
      "Gracias por la sobremesa más larga de nuestra vida y por bailar entre los olivos. Aquí están vuestras fotos.",
    venues: [
      {
        id: "iglesia",
        name: "Ermita de San Benito",
        kind: "Ceremonia",
        address: "Camino de la Ermita, s/n",
        city: "Baeza, Jaén",
        mapsQuery: "Baeza Jaén",
        note: "Hay aparcamiento junto a la ermita. Recomendamos llegar 20 minutos antes.",
        photo: PHOTOS.olivar.ceremony,
        photoAlt: "Ermita de piedra dorada con espadaña y campana, entre olivos",
      },
      {
        id: "finca",
        name: "Cortijo Los Aljibes",
        kind: "Aperitivo, comida y fiesta",
        address: "Carretera del Olivar, km 4",
        city: "Baeza, Jaén",
        mapsQuery: "Baeza Jaén",
        note: "A 12 minutos de la ermita, por un camino entre olivos. Los autobuses salen al terminar la ceremonia.",
        photo: PHOTOS.olivar.venue,
        photoAlt: "Patio del cortijo con mesas largas bajo los olivos",
      },
    ],
    climate: { max: 23, min: 11, rainChance: 25, place: "Baeza, Jaén" },
    program: [
      {
        id: "ceremonia",
        time: "12:30",
        title: "Ceremonia",
        venueId: "iglesia",
        place: "Ermita de San Benito",
        description: "Corta y con música en directo. Os esperamos dentro con tiempo.",
        icon: "ceremony",
      },
      {
        id: "coctel",
        time: "13:45",
        title: "Aperitivo",
        venueId: "finca",
        place: "Patio del cortijo",
        description: "Aceite nuevo, pan de pueblo y vermut entre los olivos.",
        icon: "cocktail",
      },
      {
        id: "banquete",
        time: "15:30",
        title: "Comida",
        venueId: "finca",
        place: "La almazara",
        description: "Comida larga, con el menú que elijas al confirmar, y sobremesa sin prisa.",
        icon: "banquet",
      },
      {
        id: "fiesta",
        time: "19:00",
        title: "Fiesta",
        venueId: "finca",
        place: "Hasta que se haga de noche (y un poco más)",
        description: "Barra libre y baile. Los últimos autobuses salen a las 02:00.",
        icon: "party",
      },
    ],
    busRoutes: [
      {
        id: "jaen",
        label: "Jaén → Cortijo",
        pickupPoint: "Estación de autobuses, Jaén",
        departure: "11:15",
        returnTrips: ["23:30", "02:00"],
        seats: 50,
      },
      {
        id: "granada",
        label: "Granada → Cortijo",
        pickupPoint: "Palacio de Congresos, Granada",
        departure: "10:30",
        returnTrips: ["02:00"],
        seats: 30,
      },
    ],
    menu: [
      { id: "carne", label: "Carne", description: "Presa ibérica con puré de boniato" },
      { id: "pescado", label: "Pescado", description: "Bacalao confitado en aceite de la finca" },
      { id: "vegetariano", label: "Vegetariano", description: "Canelón de espinacas y piñones" },
      { id: "vegano", label: "Vegano", description: "Pisto de la huerta con pan de aceite" },
      {
        id: "infantil",
        label: "Infantil",
        description: "Menú pensado para los más pequeños",
        childrenOnly: true,
      },
    ],
    dressCode: {
      title: "Elegante de campo",
      detail:
        "Tonos de tierra y de olivo. El aperitivo es sobre tierra: mejor evitar tacones finos.",
      palette: [
        { name: "Verde salvia", hex: "#a3ad96" },
        { name: "Verde olivo", hex: "#6b7455" },
        { name: "Trigo", hex: "#dcc9a0" },
        { name: "Tierra", hex: "#a8775a" },
        { name: "Crudo", hex: "#ece6d8" },
      ],
      examples: [
        { who: "Ellas", text: "Vestido midi en tonos tierra o verdes; tacón ancho o cuña." },
        { who: "Ellos", text: "Traje en tonos cálidos; la corbata es opcional." },
        { who: "Niños", text: "Ropa cómoda: tendrán todo el campo para correr." },
      ],
    },
    accommodation: [
      {
        name: "Hotel Palacio de Baeza",
        distance: "A 10 min de la ermita",
        detail: "Habitaciones reservadas hasta el 1 de septiembre. Menciona la boda.",
      },
      {
        name: "Casa rural La Almazara",
        distance: "A 5 min del cortijo",
        detail: "Ideal para grupos y familias con niños.",
      },
    ],
    story: {
      intro: "Seis años, un huerto y una furgoneta de segunda mano. Esta es la versión corta.",
      couplePhoto: PHOTOS.olivar.couple,
      moments: [
        {
          year: "2021",
          title: "La cosecha",
          text: "Ella vino a ayudar un fin de semana con la aceituna y él le enseñó a varear. Se quedó toda la campaña.",
          photo: PHOTOS.olivar.story[0],
          photoAlt: "Elena y Hugo de espaldas, caminando entre olivos",
        },
        {
          year: "2023",
          title: "La primera casa",
          text: "Un piso pequeño en Granada con una terraza enorme. Plantamos tomates antes de montar la cama.",
          photo: PHOTOS.olivar.story[1],
          photoAlt: "Elena y Hugo mirando la ciudad desde una terraza",
        },
        {
          year: "2026",
          title: "La pedida",
          text: "Bajo el olivo más viejo de la finca, con el anillo escondido en una cesta de aceitunas.",
          photo: PHOTOS.olivar.story[2],
          photoAlt:
            "Anillo de compromiso en un estuche, sobre un muro de piedra bajo un olivo al atardecer",
        },
        {
          year: "Hoy",
          title: "Y ahora, la boda",
          text: "Seguimos en Granada, con el huerto en la terraza y los domingos en el pueblo. Solo faltáis vosotros.",
          photo: PHOTOS.olivar.story[3],
          photoAlt: "Elena y Hugo de espaldas, viendo caer la tarde sobre el olivar",
        },
      ],
    },
    coverPhoto: PHOTOS.olivar.cover,
    coverDepthMap: PHOTOS.olivar.depth,
    banquetPhoto: PHOTOS.olivar.banquet,
    gift: {
      ...demoEvent.gift,
      holder: "Elena y Hugo (cuenta de demostración)",
      items: [
        {
          id: "viaje",
          title: "Nuestro viaje a la Toscana",
          detail: "Diez días de carreteras pequeñas y viñedos. Cualquier aportación nos acerca.",
          price: "Lo que queráis",
          url: "",
          photo: null,
          shared: true,
        },
        {
          id: "vajilla",
          title: "Vajilla de cerámica de Úbeda",
          detail: "La verde de toda la vida, para las comidas largas.",
          price: "280 €",
          url: "",
          photo: null,
          shared: false,
        },
        {
          id: "cafetera",
          title: "Una mesa grande de madera",
          detail: "Para que quepáis todos cuando vengáis a casa.",
          price: "390 €",
          url: "",
          photo: null,
          shared: false,
        },
        {
          id: "olivo",
          title: "Un olivo con vuestro nombre",
          detail: "Lo plantaremos en la finca el primer aniversario.",
          price: "90 €",
          url: "",
          photo: null,
          shared: false,
        },
      ],
    },
    faqs: [
      {
        question: "¿Puedo llevar a mis hijos?",
        answer: "Sí, si aparecen en tu invitación. Habrá monitores durante la comida.",
      },
      {
        question: "¿Hasta cuándo puedo cambiar mi respuesta?",
        answer: "Puedes editarla desde este mismo enlace hasta el 5 de septiembre de 2027.",
      },
      {
        question: "¿Habrá opciones sin gluten?",
        answer: "Sí. Indícalo al confirmar y el catering preparará tu menú por separado.",
      },
      {
        question: "¿Hay lista de bodas?",
        answer: "No hay lista: en la sección «Regalo» tenéis algunas ideas y nuestra cuenta.",
      },
    ],
  },
  guestbook: guestbook(
    [
      ["Irene y Samuel", "Seis años viendo venir esta boda. Reservadnos sitio en la sobremesa."],
      ["Abuelo Paco", "El aceite de este año lo pongo yo. Que seáis muy felices, hijos."],
      ["Jorge", "Prometo no sacar el vídeo de Hugo vareando. O sí."],
      ["Las amigas de Granada", "Vamos en el autobús de las diez y media, cantando desde ya."],
    ],
    [
      "Andaluces de Jaén",
      "La flaca",
      "September",
      "Sarandonga",
      "Vivir así es morir de amor",
      "Mr. Brightside",
      "Valerie",
      "Como camarón",
    ],
  ),
};

const VARIANTS: Partial<Record<TemplateId, DemoVariant>> = { buganvilla, olivar };

/** La boda ficticia propia de una plantilla, si la tiene. */
export function demoVariant(template: string | undefined): DemoVariant | null {
  return (template && VARIANTS[template as TemplateId]) || null;
}
