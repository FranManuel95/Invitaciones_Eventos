import type { WeddingEvent } from "@/lib/domain/types";

/**
 * Evento ficticio de demostración. Nombres, lugares y direcciones son inventados.
 */
export const demoEvent: WeddingEvent = {
  id: "evt-demo-maria-daniel",
  couple: { first: "María", second: "Daniel", monogram: "M&D" },
  date: "2027-05-22T16:30:00+02:00",
  dateLabel: "22 · 05 · 2027",
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
    },
    {
      id: "finca",
      name: "Finca Los Almendros",
      kind: "Cóctel, banquete y fiesta",
      address: "Camino del Olivar, s/n",
      city: "Chinchón, Madrid",
      mapsQuery: "Chinchón Madrid",
      note: "A 8 minutos en coche de la iglesia. Los autobuses salen de la plaza al terminar la ceremonia.",
    },
  ],
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
      pickupPoint: "Madrid · Hotel Plaza de España",
      departure: "15:15",
      returnTrips: ["01:30", "03:30"],
      seats: 50,
    },
    {
      id: "valencia",
      label: "Valencia → Finca",
      pickupPoint: "Valencia · Estación Joaquín Sorolla",
      departure: "12:00",
      returnTrips: ["03:30"],
      seats: 30,
    },
    {
      id: "barcelona",
      label: "Barcelona → Finca",
      pickupPoint: "Barcelona · Estación de Sants",
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
    palette: ["#e8d2ca", "#d6bf94", "#8d9a84", "#6f8cab", "#eee5d6"],
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
        "Vuestra presencia es nuestro mejor regalo. Si aun así queréis tener un detalle, preguntadnos sin compromiso.",
    },
  ],
};
