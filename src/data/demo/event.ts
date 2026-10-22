import type { WeddingEvent } from "@/lib/domain/types";

/**
 * Evento ficticio de demostración. Nombres, lugares y direcciones son inventados.
 */
export const demoEvent: WeddingEvent = {
  id: "evt-demo-maria-daniel",
  couple: { first: "María", second: "Daniel", monogram: "M&D" },
  date: "2027-05-22T16:30:00+02:00",
  city: "Chinchón",
  region: "Madrid",
  rsvpDeadline: "2027-04-15T23:59:00+02:00",
  hashtag: "#MaríaYDaniel2027",
  cardMessage:
    "Nos hace mucha ilusión compartir contigo este día tan especial. Queremos que formes parte de nuestra historia.",
  welcomeMessage:
    "Después de once años, dos mudanzas y un perro llamado Higo, nos casamos. Aquí tienes todo lo necesario para que solo te preocupes de disfrutar.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia de San Juan",
      kind: "Ceremonia",
      address: "Plaza de la Iglesia, 1",
      city: "Chinchón, Madrid",
      mapsQuery: "Plaza Mayor Chinchón",
      note: "Recomendamos llegar 20 minutos antes. Hay aparcamiento público a 200 m.",
      photo: "/fotos/iglesia.jpg",
      photoAlt: "Fachada de piedra de la iglesia, con rosetón y campanario",
    },
    {
      id: "finca",
      name: "Finca Los Almendros",
      kind: "Cóctel, banquete y fiesta",
      address: "Camino del Olivar, s/n",
      city: "Chinchón, Madrid",
      mapsQuery: "Chinchón Madrid",
      note: "A 8 minutos en coche de la iglesia. Los autobuses salen de la plaza al terminar la ceremonia.",
      photo: "/fotos/finca.jpg",
      photoAlt: "Jardín de la finca al anochecer, con guirnaldas de luces y mesas altas",
    },
  ],
  thankYouMessage:
    "Gracias por venir, por bailar hasta tarde y por cada abrazo. Aquí están las fotos que hicisteis: nos encanta verlas una y otra vez.",
  program: [
    {
      id: "ceremonia",
      time: "16:30",
      title: "Ceremonia",
      venueId: "iglesia",
      place: "Iglesia de San Juan",
      description: "El momento más importante. Os esperamos dentro con tiempo.",
      icon: "ceremony",
    },
    {
      id: "coctel",
      time: "18:00",
      title: "Cóctel",
      venueId: "finca",
      place: "Jardines de la finca",
      description: "Brindis entre almendros, música en directo y algo de picar.",
      icon: "cocktail",
    },
    {
      id: "banquete",
      time: "21:00",
      title: "Banquete",
      venueId: "finca",
      place: "Salón del Olivar",
      description: "Cena con el menú que elijas al confirmar.",
      icon: "banquet",
    },
    {
      id: "fiesta",
      time: "00:00",
      title: "Fiesta",
      venueId: "finca",
      place: "Hasta que el cuerpo aguante",
      description: "Barra libre y baile. Los últimos autobuses salen a las 03:30.",
      icon: "party",
    },
  ],
  busRoutes: [
    {
      id: "madrid",
      label: "Madrid → Finca",
      pickupPoint: "Hotel Plaza de España, Madrid",
      departure: "15:15",
      returnTrips: ["01:30", "03:30"],
      seats: 50,
    },
    {
      id: "valencia",
      label: "Valencia → Finca",
      pickupPoint: "Estación Joaquín Sorolla, Valencia",
      departure: "12:00",
      returnTrips: ["03:30"],
      seats: 30,
    },
    {
      id: "barcelona",
      label: "Barcelona → Finca",
      pickupPoint: "Estación de Sants, Barcelona",
      departure: "09:30",
      returnTrips: ["03:30"],
      seats: 20,
    },
  ],
  menu: [
    { id: "carne", label: "Carne", description: "Lomo de ternera con parmentier trufada" },
    { id: "pescado", label: "Pescado", description: "Lubina con velouté de azafrán" },
    { id: "vegetariano", label: "Vegetariano", description: "Risotto de setas y parmesano" },
    { id: "vegano", label: "Vegano", description: "Berenjena asada, miso y granada" },
    {
      id: "infantil",
      label: "Infantil",
      description: "Menú pensado para los más pequeños",
      childrenOnly: true,
    },
  ],
  dressCode: {
    title: "Formal de jardín",
    detail:
      "Tejidos ligeros y colores suaves. El cóctel es sobre césped: mejor evitar tacones finos.",
    palette: [
      { name: "Rosa flor de almendro", hex: "#e6d4cc" },
      { name: "Oro viejo", hex: "#d3c08f" },
      { name: "Verde almendro", hex: "#8d9a84" },
      { name: "Azul atardecer", hex: "#6f8cab" },
      { name: "Lino", hex: "#e6e0d2" },
    ],
    examples: [
      { who: "Ellas", text: "Vestido midi o largo de tejido fluido; sandalia o tacón ancho." },
      { who: "Ellos", text: "Traje claro o de lino; la corbata es opcional." },
      { who: "Niños", text: "Ropa cómoda en los colores de la paleta: habrá juegos en el jardín." },
    ],
  },
  accommodation: [
    {
      name: "Parador de Chinchón",
      distance: "A 5 min de la iglesia",
      detail: "Bloque de habitaciones reservado hasta el 1 de abril. Menciona la boda.",
    },
    {
      name: "Casa rural El Lagar",
      distance: "A 10 min de la finca",
      detail: "Ideal para grupos y familias con niños.",
    },
  ],
  story: {
    intro: "Once años, dos mudanzas y un perro. Esta es la versión corta.",
    couplePhoto: "/fotos/pareja.jpg",
    moments: [
      {
        year: "2015",
        title: "Nos conocimos en Amalfi",
        text: "La misma excursión de Erasmus y el último sitio libre en el muro del mirador. Nos quedamos hasta que se fue el sol.",
        photo: "/fotos/historia-amalfi.jpg",
        photoAlt: "María y Daniel de espaldas, sentados frente a la costa de Amalfi",
      },
      {
        year: "2017",
        title: "El primer viaje",
        text: "Florencia en agosto, con una mochila y un mapa de papel. Volvimos sabiendo que podíamos con todo.",
        photo: "/fotos/historia-florencia.jpg",
        photoAlt: "María y Daniel mirando la cúpula de Florencia desde un mirador",
      },
      {
        year: "2026",
        title: "La pedida",
        text: "En el mirador de Chinchón, al atardecer. Dijo que sí antes de que terminara la pregunta.",
        photo: "/fotos/historia-pedida.jpg",
        photoAlt: "Anillo de compromiso en un estuche de terciopelo entre flores blancas",
      },
      {
        year: "Hoy",
        title: "Y ahora, la boda",
        text: "Vivimos en Madrid con Higo, un perro de agua que eligió el sofá y, de paso, a nosotros. Solo faltáis vosotros.",
        photo: "/fotos/historia-hoy.jpg",
        photoAlt: "María y Daniel de espaldas, viendo el atardecer sobre el mar",
      },
    ],
  },
  coverPhoto: "/fotos/portada.jpg",
  coverDepthMap: "/fotos/portada-profundidad.png",
  banquetPhoto: "/fotos/banquete.jpg",
  contactPhone: "+34 600 000 000",
  gift: {
    message:
      "Vuestra presencia es nuestro mejor regalo. Si aun así queréis tener un detalle, os dejamos algunas ideas y nuestra cuenta.",
    holder: "María y Daniel (cuenta de demostración)",
    // IBAN ficticio con formato válido de longitud, pero sin banco real: solo para la demo.
    iban: "ES00 0000 0000 0000 0000 0000",
    items: [
      {
        id: "viaje",
        title: "Nuestro viaje a Japón",
        detail: "Dos semanas entre Kioto y las islas de Seto. Cualquier aportación nos acerca.",
        price: "Lo que queráis",
        url: "",
        photo: null,
        shared: true,
      },
      {
        id: "vajilla",
        title: "Vajilla de cerámica de Talavera",
        detail: "La de doce servicios, en blanco y azul, para las comidas de los domingos.",
        price: "340 €",
        url: "",
        photo: null,
        shared: false,
      },
      {
        id: "cafetera",
        title: "Cafetera de espresso",
        detail: "Para empezar cada mañana como en Florencia.",
        price: "180 €",
        url: "",
        photo: null,
        shared: false,
      },
      {
        id: "olivo",
        title: "Un olivo para la casa del pueblo",
        detail: "Lo plantaremos el primer aniversario.",
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
      answer:
        "Sí, si aparecen en tu invitación. Habrá zona infantil con monitores durante el banquete.",
    },
    {
      question: "¿Hasta cuándo puedo cambiar mi respuesta?",
      answer: "Puedes editarla desde este mismo enlace hasta el 15 de abril de 2027.",
    },
    {
      question: "¿Habrá opciones sin gluten?",
      answer: "Sí. Indícalo al confirmar y el catering preparará tu menú por separado.",
    },
    {
      question: "¿Hay lista de bodas?",
      answer:
        "No hay lista: si queréis tener un detalle, en la sección «Regalo» tenéis nuestra cuenta.",
    },
  ],
};
