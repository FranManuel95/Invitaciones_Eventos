import { wedding } from "./wedding-builder";

/*
 * Una boda ficticia por plantilla, con su sitio, su historia y sus textos, a juego con el concepto
 * de cada una (Embarque, una pareja viajera; Vinilo, una pareja de músicos; Cosecha, una bodega…).
 * Las ciudades existen; los sitios, las personas, las direcciones y los hoteles son inventados.
 */

export const lavanda = wedding({
  id: "evt-demo-lucia-marcos",
  first: "Lucía",
  second: "Marcos",
  date: "2027-11-06T19:00:00+01:00",
  rsvpDeadline: "2027-10-01T23:59:00+02:00",
  city: "Brihuega",
  region: "Guadalajara",
  couple: "olivar",
  coverPhoto: "/fotos/olivar/historia-4.jpg",
  cardMessage:
    "Nos conocimos entre lavanda y queremos casarnos con su olor todavía en la ropa. Ven a celebrarlo con nosotros.",
  welcomeMessage:
    "Ella hace perfumes y él cuida abejas: era cuestión de tiempo que coincidiéramos en un campo morado. Aquí tienes todo para acompañarnos.",
  thankYouMessage:
    "Gracias por venir a la Alcarria en pleno otoño, por los brindis junto a la chimenea y por bailar hasta tarde. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Ermita de la Vega",
      kind: "Ceremonia",
      address: "Camino de la Vega, s/n",
      note: "A las afueras del pueblo, con aparcamiento al lado. Llegad 20 minutos antes: anochece pronto.",
      photo: "ermitaOlivos",
    },
    {
      id: "finca",
      name: "Destilería El Lavandar",
      kind: "Cóctel, cena y fiesta",
      address: "Carretera de Masegoso, km 2",
      note: "A 8 minutos de la ermita. La cena es dentro, en la antigua nave de los alambiques.",
      photo: "cortijo",
    },
  ],
  climate: [13, 2, 35],
  program: [
    [
      "19:00",
      "Ceremonia",
      "iglesia",
      "Ermita de la Vega",
      "Breve, a la luz de las velas y con un cuarteto de cuerda.",
      "ceremony",
    ],
    [
      "20:00",
      "Cóctel",
      "finca",
      "Junto a los alambiques",
      "Vino caliente, quesos de la Alcarria y miel de nuestras colmenas.",
      "cocktail",
    ],
    [
      "21:30",
      "Cena",
      "finca",
      "La nave grande",
      "Cena de otoño, con el menú que elijas al confirmar.",
      "banquet",
    ],
    [
      "00:00",
      "Fiesta",
      "finca",
      "Hasta que se apague la chimenea",
      "Barra libre y baile. Hay chocolate caliente a las dos.",
      "party",
    ],
  ],
  busRoutes: [
    ["madrid", "Madrid → Brihuega", "Avenida de América, Madrid", "17:00", ["01:30", "03:30"], 50],
    [
      "guadalajara",
      "Guadalajara → Brihuega",
      "Estación de tren, Guadalajara",
      "17:45",
      ["03:30"],
      30,
    ],
  ],
  menu: {
    carne: "Cordero asado con miel de lavanda y patatas panaderas",
    pescado: "Bacalao con pisto y aceite de romero",
    vegetariano: "Crema de calabaza y risotto de setas",
    vegano: "Guiso de garbanzos con boletus y castañas",
  },
  dressCode: {
    title: "Elegante de otoño",
    detail: "Colores de lavanda y de piedra. La ermita es fría: traed abrigo para la ceremonia.",
    palette: [
      { name: "Lavanda", hex: "#b9a8dc" },
      { name: "Malva", hex: "#8d78b8" },
      { name: "Añil", hex: "#3d3560" },
      { name: "Gris perla", hex: "#d9d6e0" },
      { name: "Verde salvia", hex: "#a9b79c" },
    ],
    examples: [
      "Vestido midi o largo en tonos lila o gris; mejor tacón ancho, que hay camino de tierra.",
      "Traje de lana en gris o azul noche; la corbata, si os apetece.",
      "Ropa de abrigo y cómoda: hay jardín para correr.",
    ],
  },
  accommodation: [
    [
      "Hotel Plaza del Coso",
      "En el centro, a 5 min de la ermita",
      "Habitaciones reservadas hasta el 20 de septiembre. Menciona la boda.",
    ],
    [
      "Casa rural Los Alambiques",
      "Junto a la destilería",
      "Seis habitaciones con chimenea, ideal para grupos.",
    ],
  ],
  story: {
    intro:
      "Un festival de la lavanda, un frasco de perfume y muchas abejas. Esta es la versión corta.",
    moments: [
      [
        "2020",
        "El campo morado",
        "Ella vino a recoger flor para sus perfumes y él le avisó de que las abejas no pican si no corres. Corrió igual.",
        "olivos",
      ],
      [
        "2022",
        "El primer perfume",
        "Lo llamó «Marcos en julio». Él dice que huele a miel; ella, a verano.",
        "terraza",
      ],
      [
        "2026",
        "La pedida",
        "Con el anillo escondido en una caja de esencias. Lo encontró al tercer frasco.",
        "anilloMuro",
      ],
      [
        "Hoy",
        "Y ahora, la boda",
        "Vivimos en Brihuega, entre el taller y las colmenas. Solo faltáis vosotros.",
        "olivar",
      ],
    ],
  },
  gifts: [
    [
      "Nuestro viaje a la Provenza",
      "A ver los campos de Valensole y aprender de sus perfumistas.",
      "Lo que queráis",
    ],
    ["Un alambique de cobre pequeño", "Para destilar en casa los experimentos de Lucía.", "260 €"],
    ["Dos colmenas nuevas", "Las abejas de Marcos necesitan vecinas.", "180 €"],
    ["Un rosal para el patio", "Lo plantaremos al volver del viaje.", "35 €"],
  ],
  kids: "Habrá monitores y una sala de juegos junto a la nave.",
  faq: [
    "¿Hará frío?",
    "Por la noche, bastante. La nave tiene calefacción y chimenea, pero traed abrigo para la ermita.",
  ],
  guestbook: [
    ["Sara y Joaquín", "Llevamos años oliendo a lavanda en cada cena con vosotros. ¡Qué ganas!"],
    ["La abuela Pilar", "Que la miel no os falte nunca, y la paciencia tampoco."],
    ["Los del taller", "Ya tenemos el perfume para la boda. Adivinad cuál."],
  ],
  songs: ["La vie en rose", "Lavender Haze", "Contigo", "Como hablar", "September", "Valerie"],
});

export const cortijo = wedding({
  id: "evt-demo-rocio-manuel",
  first: "Rocío",
  second: "Manuel",
  date: "2027-10-02T12:30:00+02:00",
  rsvpDeadline: "2027-08-25T23:59:00+02:00",
  city: "Carmona",
  region: "Sevilla",
  couple: "olivar",
  coverPhoto: "/fotos/olivar/historia-1.jpg",
  cardMessage:
    "Nos casamos en el cortijo de la familia, con caballos, plumeros y mucho mantel. Nos encantaría verte allí.",
  welcomeMessage:
    "Crecimos a dos fincas de distancia y tardamos treinta años en darnos cuenta. Aquí tienes todo para pasar el día con nosotros.",
  thankYouMessage:
    "Gracias por las sevillanas, por la sobremesa interminable y por quedaros a ver la puesta de sol. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Ermita de Santa Ana",
      kind: "Ceremonia",
      address: "Camino de la Ermita, s/n",
      note: "A las afueras de Carmona. Hay sitio para aparcar en la explanada.",
      photo: "ermitaOlivos",
    },
    {
      id: "finca",
      name: "Cortijo El Alcor",
      kind: "Aperitivo, comida y fiesta",
      address: "Carretera de Brenes, km 6",
      note: "A 15 minutos de la ermita, por la vega. Los autobuses salen al terminar la ceremonia.",
      photo: "cortijo",
    },
  ],
  climate: [28, 15, 10],
  program: [
    [
      "12:30",
      "Ceremonia",
      "iglesia",
      "Ermita de Santa Ana",
      "Con coro rociero y la puerta abierta al campo.",
      "ceremony",
    ],
    [
      "13:45",
      "Aperitivo",
      "finca",
      "El patio de los caballos",
      "Jamón, gambas de Huelva y rebujito bien frío.",
      "cocktail",
    ],
    [
      "15:30",
      "Comida",
      "finca",
      "Bajo la pérgola",
      "Comida larga con el menú que elijas al confirmar.",
      "banquet",
    ],
    [
      "19:00",
      "Fiesta",
      "finca",
      "Hasta que salga la luna",
      "Sevillanas, barra libre y recena de montaditos.",
      "party",
    ],
  ],
  busRoutes: [
    [
      "sevilla",
      "Sevilla → Cortijo",
      "Prado de San Sebastián, Sevilla",
      "11:15",
      ["21:00", "01:30"],
      50,
    ],
    ["carmona", "Carmona → Cortijo", "Puerta de Sevilla, Carmona", "12:00", ["01:30"], 30],
  ],
  menu: {
    carne: "Carrillada ibérica al vino de naranja",
    pescado: "Lubina a la sal con ajo blanco",
    vegetariano: "Espinacas con garbanzos y huevo de corral",
    vegano: "Berenjenas asadas con miel de caña vegetal y almendras",
  },
  dressCode: {
    title: "Campo de gala",
    detail: "Colores de trigo y de teja. El aperitivo es sobre albero: mejor evitar tacones finos.",
    palette: [
      { name: "Trigo", hex: "#e3d1b0" },
      { name: "Teja", hex: "#c0623f" },
      { name: "Burdeos", hex: "#8a2a35" },
      { name: "Verde olivo", hex: "#7d8a5f" },
      { name: "Nogal", hex: "#654a30" },
    ],
    examples: [
      "Vestido midi con flores o en un color liso cálido; cuña o tacón ancho.",
      "Traje en tonos tierra o azul; la chaqueta se podrá quitar en la comida.",
      "Ropa fresca: verán los caballos de cerca.",
    ],
  },
  accommodation: [
    [
      "Hotel Alcázar de la Puerta",
      "En Carmona, a 10 min de la ermita",
      "Habitaciones reservadas hasta el 15 de agosto. Menciona la boda.",
    ],
    [
      "Casas del Cortijo",
      "Dentro de la finca",
      "Cuatro casitas para la familia; preguntadnos si queréis una.",
    ],
  ],
  story: {
    intro:
      "Dos cortijos vecinos, un caballo escapado y treinta años de despiste. Esta es la versión corta.",
    moments: [
      [
        "2019",
        "El caballo",
        "La yegua de Rocío se coló en la finca de Manuel. Él la devolvió y se quedó a comer.",
        "olivos",
      ],
      [
        "2021",
        "Sevilla",
        "Un piso en la Alameda, con terraza y vistas a las azoteas. Los domingos, al campo.",
        "terraza",
      ],
      [
        "2026",
        "La pedida",
        "En la feria, en la caseta de siempre, delante de toda la familia. Hubo sevillanas.",
        "anilloMuro",
      ],
      [
        "Hoy",
        "Y ahora, la boda",
        "Volvemos al campo donde nos conocimos, a dos fincas de casa. Solo faltáis vosotros.",
        "olivar",
      ],
    ],
  },
  gifts: [
    [
      "Nuestro viaje a Argentina",
      "Las estancias de la pampa, a caballo. Cualquier aportación nos acerca.",
      "Lo que queráis",
    ],
    ["Una vajilla de La Cartuja", "La de toda la vida, para los almuerzos de domingo.", "320 €"],
    ["Una montura nueva", "La de la yegua, que ya tiene sus años.", "450 €"],
    ["Un naranjo para el patio", "Para que algún día haya azahar en casa.", "60 €"],
  ],
  kids: "Habrá monitores, paseos en poni y comida para ellos.",
  faq: [
    "¿Hará calor?",
    "A mediodía, sí. Hay sombra en la pérgola, abanicos en las mesas y agua fresca todo el día.",
  ],
  guestbook: [
    ["Los primos de Écija", "Vamos con la guitarra y las palmas. ¡Vivan los novios!"],
    ["Tía Reme", "Treinta años viéndoos crecer en fincas vecinas. Ya era hora."],
    ["Fernando", "Reservo la primera sevillana con la novia. Manuel, tú la segunda."],
  ],
  songs: [
    "Sevilla tiene un color especial",
    "Algo se muere en el alma",
    "Volando voy",
    "Sarandonga",
    "La flaca",
    "September",
  ],
});

export const lino = wedding({
  id: "evt-demo-alba-sergio",
  first: "Alba",
  second: "Sergio",
  date: "2027-06-12T18:30:00+02:00",
  rsvpDeadline: "2027-05-05T23:59:00+02:00",
  city: "Ciutadella",
  region: "Menorca",
  couple: "mar",
  coverPhoto: "/fotos/buganvilla/portada.jpg",
  cardMessage: "Una boda sencilla, de lino y cal, con el mar al lado. No nos la imaginamos sin ti.",
  welcomeMessage:
    "Ella cose velas y él repara barcos de madera: nos casamos en el puerto donde trabajamos. Aquí tienes todo para acompañarnos.",
  thankYouMessage:
    "Gracias por cruzar el mar para estar con nosotros, por la cena tranquila y por la fiesta que no lo fue tanto. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Ermita de Sant Joan",
      kind: "Ceremonia",
      address: "Camí de Sant Joan, s/n",
      note: "A 5 minutos del centro. Mejor calzado plano: el último tramo es de piedra.",
      photo: "ermitaMar",
    },
    {
      id: "finca",
      name: "Lloc de Sa Vela",
      kind: "Cóctel, cena y fiesta",
      address: "Camí de Cala Morell, km 3",
      note: "A 12 minutos de la ermita, frente al mar. Los autobuses salen al terminar la ceremonia.",
      photo: "terrazaMar",
    },
  ],
  climate: [26, 17, 5],
  program: [
    [
      "18:30",
      "Ceremonia",
      "iglesia",
      "Ermita de Sant Joan",
      "Corta, sencilla y con las puertas abiertas al mar.",
      "ceremony",
    ],
    [
      "19:30",
      "Cóctel",
      "finca",
      "La terraza",
      "Gin de la isla con limonada, queso de Mahón y la puesta de sol.",
      "cocktail",
    ],
    [
      "21:30",
      "Cena",
      "finca",
      "Bajo los toldos de lino",
      "Mesas largas con el menú que elijas al confirmar.",
      "banquet",
    ],
    [
      "00:30",
      "Fiesta",
      "finca",
      "Hasta que llegue el primer barco",
      "Barra libre, música en directo y ensaimadas a las tres.",
      "party",
    ],
  ],
  busRoutes: [
    [
      "ciutadella",
      "Ciutadella → Finca",
      "Plaça des Born, Ciutadella",
      "17:45",
      ["02:00", "04:00"],
      50,
    ],
    ["mao", "Maó → Finca", "Estación de autobuses, Maó", "17:00", ["04:00"], 30],
  ],
  menu: {
    carne: "Paletilla de cordero menorquín con patata nueva",
    pescado: "Caldereta de pescado de roca",
    vegetariano: "Berenjenas rellenas a la menorquina",
    vegano: "Arroz de verduras de la huerta y algas",
  },
  dressCode: {
    title: "Lino y cal",
    detail: "Tejidos naturales y colores claros. Cenamos al aire libre: traed algo para la brisa.",
    palette: [
      { name: "Lino", hex: "#e9e2d4" },
      { name: "Carbón", hex: "#3b3a38" },
      { name: "Rosa viejo", hex: "#c9a3a0" },
      { name: "Arena", hex: "#d8c7a8" },
    ],
    examples: [
      "Vestido de lino o algodón, liso; avarcas o sandalia plana.",
      "Camisa de lino y pantalón claro; la chaqueta es opcional.",
      "Ropa fresca y cómoda: habrá juegos junto a la terraza.",
    ],
  },
  accommodation: [
    [
      "Hotel Sa Murada",
      "En el casco antiguo, a 5 min de la ermita",
      "Habitaciones reservadas hasta el 25 de abril. Menciona la boda.",
    ],
    [
      "Apartamentos Cala Morell",
      "A 5 min de la finca",
      "Junto al mar, por si queréis quedaros el fin de semana.",
    ],
  ],
  story: {
    intro: "Una vela rota, un barco viejo y muchas horas en el puerto. Esta es la versión corta.",
    moments: [
      [
        "2018",
        "La vela rota",
        "Él le llevó una vela hecha jirones; ella tardó tres semanas en coserla a propósito.",
        "cala",
      ],
      [
        "2021",
        "La vuelta a la isla",
        "Una semana dando la vuelta a Menorca, de cala en cala, con una furgoneta prestada.",
        "furgoneta",
      ],
      [
        "2026",
        "La pedida",
        "En el llaüt que restauraron juntos, el día que por fin flotó.",
        "anilloBarca",
      ],
      [
        "Hoy",
        "Y ahora, la boda",
        "Seguimos en Ciutadella, entre el taller y el puerto. Solo faltáis vosotros.",
        "orilla",
      ],
    ],
  },
  gifts: [
    [
      "Nuestro viaje a Noruega",
      "Los fiordos en velero, por supuesto. Cualquier aportación nos acerca.",
      "Lo que queráis",
    ],
    ["Una máquina de coser industrial", "La de Alba ya tiene más años que el taller.", "540 €"],
    [
      "Herramientas de carpintería de ribera",
      "Gubias y cepillos para los barcos de Sergio.",
      "210 €",
    ],
    ["Un olivo para el patio", "Lo plantaremos al volver del viaje.", "70 €"],
  ],
  kids: "Habrá monitores y cena para ellos.",
  faq: [
    "¿Cómo llego a Menorca?",
    "Hay vuelos a Maó y barco desde Barcelona o Alcúdia. Desde Maó sale un autobús a la finca.",
  ],
  guestbook: [
    ["Marina y Pau", "Iremos en barco, como debe ser. ¡Enhorabuena!"],
    ["L'avi Joan", "Que naveguéis siempre con buen viento."],
    ["Los del puerto", "Prometemos no hablar de barcos en la cena. O casi."],
  ],
  songs: ["Mediterráneo", "La mar", "Banana Pancakes", "Sea of Love", "Valerie", "September"],
});

export const granada = wedding({
  id: "evt-demo-ines-pablo",
  first: "Inés",
  second: "Pablo",
  date: "2027-05-08T18:00:00+02:00",
  rsvpDeadline: "2027-04-01T23:59:00+02:00",
  city: "Granada",
  region: "Granada",
  couple: "olivar",
  coverPhoto: "/fotos/olivar/pareja.jpg",
  cardMessage:
    "Nos casamos frente a la Alhambra, en un carmen del Albaicín. Queremos que estés con nosotros.",
  welcomeMessage:
    "Ella restaura yeserías y él toca la guitarra en las cuevas del Sacromonte. Aquí tienes todo para acompañarnos.",
  thankYouMessage:
    "Gracias por subir las cuestas del Albaicín, por la guitarra a medianoche y por cada abrazo. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia de San Gregorio Alto",
      kind: "Ceremonia",
      address: "Cuesta de San Gregorio, 2",
      note: "En pleno Albaicín, sin coches. Os recomendamos el autobús o subir a pie con calzado cómodo.",
      photo: "iglesia",
    },
    {
      id: "finca",
      name: "Carmen de las Granadas",
      kind: "Cóctel, cena y fiesta",
      address: "Callejón del Aljibe, 7",
      note: "A 5 minutos a pie de la iglesia. Desde el jardín se ve la Alhambra.",
      photo: "patioOlivos",
    },
  ],
  climate: [24, 10, 20],
  program: [
    [
      "18:00",
      "Ceremonia",
      "iglesia",
      "San Gregorio Alto",
      "Con guitarra y cante, a media luz.",
      "ceremony",
    ],
    [
      "19:15",
      "Cóctel",
      "finca",
      "El mirador",
      "Vino de la Contraviesa y la Alhambra encendiéndose al fondo.",
      "cocktail",
    ],
    [
      "21:00",
      "Cena",
      "finca",
      "El jardín de los granados",
      "Cena con el menú que elijas al confirmar.",
      "banquet",
    ],
    [
      "23:30",
      "Fiesta",
      "finca",
      "Hasta que cante el gallo",
      "Barra libre, flamenco en directo y churros al amanecer.",
      "party",
    ],
  ],
  busRoutes: [
    ["centro", "Centro → Albaicín", "Plaza Nueva, Granada", "17:15", ["01:00", "03:30"], 30],
    ["malaga", "Málaga → Granada", "Estación María Zambrano, Málaga", "15:45", ["03:30"], 50],
  ],
  menu: {
    carne: "Cordero segureño con migas",
    pescado: "Bacalao con alboronía",
    vegetariano: "Habas con alcachofas y huevo",
    vegano: "Remojón granadino y pastela de verduras",
  },
  dressCode: {
    title: "Noche andaluza",
    detail: "Vino, oro y marfil. Las calles son empedradas: dejad los tacones finos en casa.",
    palette: [
      { name: "Granate", hex: "#6e1f2c" },
      { name: "Oro viejo", hex: "#c9a14a" },
      { name: "Marfil", hex: "#f1e6d6" },
      { name: "Rosa palo", hex: "#d6a9a4" },
      { name: "Negro", hex: "#26201f" },
    ],
    examples: [
      "Vestido largo en granate, oro o negro; tacón ancho o plano.",
      "Traje oscuro; la corbata, a vuestro gusto.",
      "Ropa cómoda: hay jardín y escaleras.",
    ],
  },
  accommodation: [
    [
      "Hotel Casa del Aljibe",
      "En el Albaicín, a 3 min del carmen",
      "Habitaciones reservadas hasta el 20 de marzo. Menciona la boda.",
    ],
    [
      "Apartamentos Plaza Nueva",
      "A 10 min a pie",
      "En el centro, con el autobús de la boda en la puerta.",
    ],
  ],
  story: {
    intro: "Una yesería rota, una guitarra y muchas cuestas. Esta es la versión corta.",
    moments: [
      [
        "2019",
        "La guitarra",
        "Ella restauraba el techo de una cueva y él ensayaba debajo. Bajó a pedirle silencio y se quedó a escuchar.",
        "terraza",
      ],
      [
        "2021",
        "El campo",
        "Los fines de semana, al cortijo de su abuelo en la Vega, a coger aceitunas y desconectar.",
        "olivos",
      ],
      [
        "2026",
        "La pedida",
        "Con una soleá que le escribió él. Ella dijo que sí antes del final.",
        "anilloMuro",
      ],
      [
        "Hoy",
        "Y ahora, la boda",
        "Seguimos en el Albaicín, con la Alhambra en la ventana. Solo faltáis vosotros.",
        "olivar",
      ],
    ],
  },
  gifts: [
    [
      "Nuestro viaje a Marrakech",
      "A buscar los yeseros y las guitarras del otro lado. Cualquier aportación nos acerca.",
      "Lo que queráis",
    ],
    ["Una vajilla de Fajalauza", "La de siempre, en verde y azul, hecha aquí.", "290 €"],
    ["Una guitarra nueva", "Para que Pablo jubile la de los ensayos.", "650 €"],
    ["Un granado para el patio", "Lo plantaremos al volver del viaje.", "45 €"],
  ],
  kids: "Habrá monitores y cena para ellos en el jardín.",
  faq: [
    "¿Cómo se sube al Albaicín?",
    "En los autobuses de la boda o en el microbús desde Plaza Nueva. En coche no se puede subir.",
  ],
  guestbook: [
    ["Lucía y Javi", "Que suene la soleá otra vez, por favor."],
    ["La abuela Encarna", "Os quiero ver bailar a los dos. Y que no se os enfríe la cena."],
    ["Los del Sacromonte", "La guitarra la llevamos nosotros. Tú solo cásate, Pablo."],
  ],
  songs: ["Entre dos aguas", "Granada", "Volando voy", "Me quedo contigo", "La flaca", "Valerie"],
});

export const eucalipto = wedding({
  id: "evt-demo-marta-adrian",
  first: "Marta",
  second: "Adrián",
  date: "2027-04-24T12:00:00+02:00",
  rsvpDeadline: "2027-03-15T23:59:00+01:00",
  city: "Cartaya",
  region: "Huelva",
  couple: "mar",
  coverPhoto: "/fotos/buganvilla/historia-1.jpg",
  cardMessage:
    "Nos casamos entre eucaliptos, con el río a un lado y el mar al otro. Ven a celebrarlo con nosotros.",
  welcomeMessage:
    "Somos biólogos y nos conocimos contando aves en las marismas. Aquí tienes todo para pasar el día con nosotros.",
  thankYouMessage:
    "Gracias por venir hasta la costa de Huelva, por la comida al aire libre y por bailar entre los árboles. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia del Rosario",
      kind: "Ceremonia",
      address: "Plaza Redonda, 1",
      note: "En el centro de Cartaya. Hay aparcamiento junto al paseo.",
      photo: "iglesia",
    },
    {
      id: "finca",
      name: "Finca Los Eucaliptos",
      kind: "Aperitivo, comida y fiesta",
      address: "Camino de El Rompido, km 4",
      note: "A 15 minutos de la iglesia, junto al río Piedras. Los autobuses salen al terminar.",
      photo: "terrazaMar",
    },
  ],
  climate: [23, 11, 15],
  program: [
    [
      "12:00",
      "Ceremonia",
      "iglesia",
      "Iglesia del Rosario",
      "Breve y con música de cámara.",
      "ceremony",
    ],
    [
      "13:15",
      "Aperitivo",
      "finca",
      "Bajo los eucaliptos",
      "Gambas blancas, coquinas y vino del Condado.",
      "cocktail",
    ],
    [
      "15:00",
      "Comida",
      "finca",
      "La pradera del río",
      "Comida al aire libre con el menú que elijas al confirmar.",
      "banquet",
    ],
    [
      "18:30",
      "Fiesta",
      "finca",
      "Hasta que se haga de noche",
      "Barra libre y baile. Los últimos autobuses salen a la una.",
      "party",
    ],
  ],
  busRoutes: [
    ["huelva", "Huelva → Cartaya", "Plaza de las Monjas, Huelva", "11:00", ["21:00", "01:00"], 50],
    ["sevilla", "Sevilla → Cartaya", "Plaza de Armas, Sevilla", "10:00", ["01:00"], 30],
  ],
  menu: {
    carne: "Presa ibérica de la sierra con patatas a lo pobre",
    pescado: "Choco frito y corvina a la plancha",
    vegetariano: "Ensalada de fresas de Huelva y queso de cabra",
    vegano: "Arroz con verduras y espárragos trigueros",
  },
  dressCode: {
    title: "Primavera en el campo",
    detail: "Verdes de hoja y tonos claros. La comida es sobre hierba: mejor cuña que tacón fino.",
    palette: [
      { name: "Eucalipto", hex: "#8fa59a" },
      { name: "Verde bosque", hex: "#2f4a3e" },
      { name: "Salvia", hex: "#b7c4b0" },
      { name: "Crudo", hex: "#efe9dc" },
    ],
    examples: [
      "Vestido fluido en verde o un color claro; cuña o sandalia.",
      "Traje claro o chaqueta de lino; la corbata es opcional.",
      "Ropa cómoda: habrá talleres de naturaleza junto al río.",
    ],
  },
  accommodation: [
    [
      "Hotel Río Piedras",
      "En El Rompido, a 5 min de la finca",
      "Habitaciones reservadas hasta el 10 de marzo. Menciona la boda.",
    ],
    ["Casa rural La Marisma", "A 10 min de la iglesia", "Ideal para familias con niños."],
  ],
  story: {
    intro:
      "Unos prismáticos, un censo de aves y un río que lleva al mar. Esta es la versión corta.",
    moments: [
      [
        "2018",
        "El censo",
        "Les tocó contar flamencos juntos un enero helado. Ella contó 214; él, 215. Siguen discutiéndolo.",
        "cala",
      ],
      [
        "2021",
        "La costa de Portugal",
        "Un mes de furgoneta siguiendo a las aves hasta el Algarve. Volvimos con 300 fotos de pájaros y ninguna nuestra.",
        "furgoneta",
      ],
      [
        "2026",
        "La pedida",
        "En la barca de un pescador, al amanecer, con las espátulas de testigo.",
        "anilloBarca",
      ],
      [
        "Hoy",
        "Y ahora, la boda",
        "Vivimos en Cartaya, a diez minutos de la marisma. Solo faltáis vosotros.",
        "orilla",
      ],
    ],
  },
  gifts: [
    [
      "Nuestro viaje a Costa Rica",
      "Selva, tortugas y, claro, muchas aves. Cualquier aportación nos acerca.",
      "Lo que queráis",
    ],
    ["Unos prismáticos buenos", "Los de Adrián son de cuando hizo la comunión.", "380 €"],
    ["Un kayak doble", "Para recorrer el río Piedras los domingos.", "520 €"],
    ["Cajas nido para el jardín", "Las colgaremos al volver del viaje.", "40 €"],
  ],
  kids: "Habrá monitores y un taller de naturaleza para ellos.",
  faq: [
    "¿Hay mosquitos junto al río?",
    "En abril, casi ninguno. Aun así, habrá repelente en el aseo.",
  ],
  guestbook: [
    ["Elena y Rubén", "Nosotros contaremos a los invitados. Prometemos no equivocarnos."],
    ["El abuelo Antonio", "Que seáis tan felices como un flamenco en la marisma."],
    ["Los del máster", "Vamos todos en el autobús de Sevilla. ¡Vivan los novios!"],
  ],
  songs: ["Hoy", "Here Comes the Sun", "La bicicleta", "Pájaros de barro", "September", "Valerie"],
});

export const gaceta = wedding({
  id: "evt-demo-clara-mateo",
  first: "Clara",
  second: "Mateo",
  date: "2027-10-23T18:30:00+02:00",
  rsvpDeadline: "2027-09-15T23:59:00+02:00",
  city: "Santander",
  region: "Cantabria",
  couple: "mar",
  coverPhoto: "/fotos/buganvilla/pareja.jpg",
  cardMessage:
    "Exclusiva: nos casamos. Tenemos sitio para ti en primera fila. No te pierdas la noticia del año.",
  welcomeMessage:
    "Nos conocimos en la redacción de un periódico, una noche de cierre. Aquí tienes toda la información, contrastada y sin erratas.",
  thankYouMessage:
    "Gracias por cubrir la boda con nosotros, por los titulares en el libro de firmas y por bailar hasta el cierre. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia de San Roque del Muelle",
      kind: "Ceremonia",
      address: "Calle del Muelle, 9",
      note: "En el centro. Hay aparcamiento público a dos calles.",
      photo: "iglesia",
    },
    {
      id: "finca",
      name: "La Antigua Imprenta",
      kind: "Cóctel, cena y fiesta",
      address: "Paseo de la Bahía, 14",
      note: "A 10 minutos a pie de la iglesia. Fue la imprenta de un diario: aún quedan las rotativas.",
      photo: "terrazaMar",
    },
  ],
  climate: [19, 12, 40],
  program: [
    [
      "18:30",
      "Ceremonia",
      "iglesia",
      "San Roque del Muelle",
      "Puntual, como un cierre de edición.",
      "ceremony",
    ],
    [
      "19:45",
      "Cóctel",
      "finca",
      "La sala de rotativas",
      "Anchoas de Santoña, rabas y vermut.",
      "cocktail",
    ],
    [
      "21:30",
      "Cena",
      "finca",
      "La terraza de la bahía",
      "Cena con el menú que elijas al confirmar.",
      "banquet",
    ],
    [
      "00:00",
      "Fiesta",
      "finca",
      "Hasta la última edición",
      "Barra libre y baile. La recena sale a las tres, como el periódico.",
      "party",
    ],
  ],
  busRoutes: [
    ["bilbao", "Bilbao → Santander", "Termibus, Bilbao", "16:45", ["02:00", "04:30"], 50],
    [
      "torrelavega",
      "Torrelavega → Santander",
      "Estación de autobuses, Torrelavega",
      "17:45",
      ["04:30"],
      30,
    ],
  ],
  menu: {
    carne: "Solomillo de ternera tudanca con queso de Tresviso",
    pescado: "Merluza del Cantábrico en salsa verde",
    vegetariano: "Pimientos rellenos de setas",
    vegano: "Cocido lebaniego de verduras",
  },
  dressCode: {
    title: "Blanco y negro",
    detail:
      "Como un periódico: tinta, papel y algún rojo de titular. Puede llover: traed paraguas.",
    palette: [
      { name: "Negro tinta", hex: "#161513" },
      { name: "Blanco roto", hex: "#f4f1e8" },
      { name: "Rojo titular", hex: "#a3221b" },
      { name: "Gris plomo", hex: "#76726a" },
    ],
    examples: [
      "Vestido en blanco, negro o rojo; el tacón, a vuestro gusto.",
      "Traje oscuro y, si os animáis, pajarita.",
      "Ropa cómoda y un abrigo para la terraza.",
    ],
  },
  accommodation: [
    [
      "Hotel Bahía Vieja",
      "A 5 min de la iglesia",
      "Habitaciones reservadas hasta el 1 de septiembre. Menciona la boda.",
    ],
    [
      "Apartamentos El Sardinero",
      "A 15 min en taxi",
      "Frente a la playa, para alargar el fin de semana.",
    ],
  ],
  story: {
    intro: "Una errata, una noche de cierre y muchos cafés de máquina. Esta es la versión corta.",
    moments: [
      [
        "2017",
        "La errata",
        "Ella corrigió un titular de él a las dos de la mañana. Él insistió en invitarla a desayunar para agradecérselo.",
        "cala",
      ],
      [
        "2020",
        "El reportaje",
        "Un mes por la costa en furgoneta para un especial de verano. Publicamos ocho páginas y volvimos juntos.",
        "furgoneta",
      ],
      [
        "2026",
        "La pedida",
        "Con un anuncio por palabras en la última página. Ella lo leyó en la barca, de vacaciones.",
        "anilloBarca",
      ],
      [
        "Hoy",
        "Y ahora, la boda",
        "Seguimos en Santander, en la misma redacción. Solo faltáis vosotros.",
        "orilla",
      ],
    ],
  },
  gifts: [
    [
      "Nuestro viaje a Nueva York",
      "A ver la sala de un gran diario y desayunar como en las películas.",
      "Lo que queráis",
    ],
    ["Una máquina de escribir antigua", "Para el salón, de adorno (y para alguna carta).", "190 €"],
    ["Una suscripción doble", "Dos diarios, en papel, durante un año.", "300 €"],
    ["Una estantería para los libros", "Que ya no caben en el pasillo.", "240 €"],
  ],
  kids: "Habrá monitores y una sala de juegos en la imprenta.",
  faq: [
    "¿Y si llueve?",
    "Es Santander: lo tenemos previsto. La cena se puede hacer dentro, junto a las rotativas.",
  ],
  guestbook: [
    ["La sección de Deportes", "Os damos cobertura completa. Y prometemos no hablar de fútbol."],
    ["Tía Begoña", "Siempre supe que esto acabaría en portada."],
    ["Íñigo, el de maquetación", "La foto de la boda, a cinco columnas. Palabra."],
  ],
  songs: [
    "Hoy puede ser un gran día",
    "Mediterráneo",
    "September",
    "Mi gran noche",
    "Valerie",
    "Dancing Queen",
  ],
});

export const embarque = wedding({
  id: "evt-demo-noa-alex",
  first: "Noa",
  second: "Álex",
  date: "2027-07-10T19:00:00+02:00",
  rsvpDeadline: "2027-06-01T23:59:00+02:00",
  city: "Teguise",
  region: "Lanzarote",
  couple: "mar",
  coverPhoto: "/fotos/buganvilla/historia-2.jpg",
  cardMessage:
    "Treinta países después, aterrizamos en Lanzarote para casarnos. Tu billete ya está emitido.",
  welcomeMessage:
    "Nos conocimos en una puerta de embarque, con el vuelo retrasado. Aquí tienes todo lo que necesitas para el viaje.",
  thankYouMessage:
    "Gracias por volar hasta la isla, por los brindis entre volcanes y por bailar hasta el último vuelo. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Ermita de las Nieves",
      kind: "Ceremonia",
      address: "Camino de la Ermita, s/n",
      note: "En lo alto del risco, sobre el mar. Sopla viento: mejor recogido que pamela.",
      photo: "ermitaMar",
    },
    {
      id: "finca",
      name: "Finca Volcán Azul",
      kind: "Cóctel, cena y fiesta",
      address: "Carretera de Famara, km 5",
      note: "A 15 minutos de la ermita, entre viñas en ceniza. Los autobuses salen al terminar.",
      photo: "terrazaMar",
    },
  ],
  climate: [28, 20, 0],
  program: [
    [
      "19:00",
      "Ceremonia",
      "iglesia",
      "Ermita de las Nieves",
      "Embarque puntual: os esperamos dentro con tiempo.",
      "ceremony",
    ],
    [
      "20:15",
      "Cóctel",
      "finca",
      "La terraza de Famara",
      "Malvasía de la isla, papas arrugadas y el sol cayendo al mar.",
      "cocktail",
    ],
    [
      "21:45",
      "Cena",
      "finca",
      "El jardín de cactus",
      "Cena con el menú que elijas al confirmar.",
      "banquet",
    ],
    [
      "00:30",
      "Fiesta",
      "finca",
      "Hasta el primer vuelo",
      "Barra libre, música de medio mundo y recena a las tres.",
      "party",
    ],
  ],
  busRoutes: [
    [
      "arrecife",
      "Arrecife → Finca",
      "Aeropuerto de Lanzarote, llegadas",
      "17:45",
      ["02:00", "04:30"],
      50,
    ],
    [
      "puerto",
      "Puerto del Carmen → Finca",
      "Avenida de las Playas, Puerto del Carmen",
      "17:30",
      ["04:30"],
      30,
    ],
  ],
  menu: {
    carne: "Cabrito al horno con mojo verde",
    pescado: "Cherne a la plancha con batata",
    vegetariano: "Queso de cabra asado con mojo rojo y ensalada",
    vegano: "Potaje de verduras con gofio",
  },
  dressCode: {
    title: "Elegante de viaje",
    detail:
      "Colores de aerolínea antigua: marino, rojo y crema. Hace viento y sol: gafas y algo para los hombros.",
    palette: [
      { name: "Azul marino", hex: "#14233f" },
      { name: "Rojo correo", hex: "#b3312a" },
      { name: "Crema", hex: "#f8f4ea" },
      { name: "Azul cielo", hex: "#b5c8dc" },
    ],
    examples: [
      "Vestido ligero en marino, rojo o crema; sandalia o cuña, que hay picón.",
      "Traje claro o americana azul, sin corbata.",
      "Ropa fresca y una gorra: el sol de la isla engaña.",
    ],
  },
  accommodation: [
    [
      "Hotel Villa de Teguise",
      "En el pueblo, a 5 min de la ermita",
      "Habitaciones reservadas hasta el 20 de mayo. Menciona la boda.",
    ],
    [
      "Casitas de Famara",
      "A 10 min de la finca",
      "Frente a la playa de los surfistas, para alargar el viaje.",
    ],
  ],
  story: {
    intro:
      "Un vuelo retrasado, treinta países y demasiados sellos en el pasaporte. Esta es la versión corta.",
    moments: [
      [
        "2018",
        "La puerta B23",
        "Seis horas de retraso en Lisboa. Compartimos enchufe, bocadillo y, al final, asiento.",
        "cala",
      ],
      [
        "2021",
        "La ruta",
        "Tres meses en furgoneta de Portugal a Grecia. Volvimos con una lista de países pendientes.",
        "furgoneta",
      ],
      [
        "2026",
        "La pedida",
        "En una barca frente a La Graciosa, al amanecer. El anillo viajó escondido en la mochila un mes.",
        "anilloBarca",
      ],
      [
        "Hoy",
        "Y ahora, la boda",
        "Vivimos en Lanzarote desde hace dos años. De aquí no nos movemos (salvo de vacaciones).",
        "orilla",
      ],
    ],
  },
  gifts: [
    [
      "Nuestro viaje a Japón",
      "El país número treinta y uno. Cualquier aportación nos acerca.",
      "Lo que queráis",
    ],
    ["Dos maletas de cabina", "Las nuestras ya han dado la vuelta al mundo.", "260 €"],
    ["Un mapa para rascar", "Para ir tachando los países que nos quedan.", "35 €"],
    ["Una cámara de carrete", "Para las fotos del próximo viaje.", "180 €"],
  ],
  kids: "Habrá monitores y cena para ellos.",
  faq: [
    "¿Cómo llego a Lanzarote?",
    "Hay vuelos directos desde casi todas las ciudades. El autobús de la boda os recoge en el aeropuerto.",
  ],
  guestbook: [
    ["Carla y Toni", "Ya tenemos los billetes. Este sí que no se retrasa."],
    ["La abuela Rosa", "Por fin os quedáis quietos en un sitio. Qué alegría, hijos."],
    ["Los compañeros de viaje", "Llevamos el mapa de Grecia firmado por todos."],
  ],
  songs: [
    "Volando voy",
    "Viajar contigo",
    "Leaving on a Jet Plane",
    "Mediterráneo",
    "Valerie",
    "September",
  ],
});

export const premio = wedding({
  id: "evt-demo-sofia-diego",
  first: "Sofía",
  second: "Diego",
  date: "2027-12-18T12:30:00+01:00",
  rsvpDeadline: "2027-11-10T23:59:00+01:00",
  city: "Toledo",
  region: "Toledo",
  couple: "olivar",
  coverPhoto: "/fotos/olivar/pareja.jpg",
  cardMessage:
    "Nos ha tocado el gordo: nos casamos cuatro días antes del sorteo. Rasca, mira la fecha y ven.",
  welcomeMessage:
    "Llevamos diez años comprando el mismo décimo y nunca ha tocado. Ahora vamos a por otro premio. Aquí tienes todo para acompañarnos.",
  thankYouMessage:
    "Gracias por compartir el décimo de la suerte, por la comida de Navidad adelantada y por los villancicos de madrugada. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Ermita del Valle Alto",
      kind: "Ceremonia",
      address: "Carretera del Valle, km 1",
      note: "Al otro lado del río, con Toledo enfrente. Hay aparcamiento junto a la ermita.",
      photo: "ermitaOlivos",
    },
    {
      id: "finca",
      name: "Cigarral de la Suerte",
      kind: "Aperitivo, comida y fiesta",
      address: "Camino de los Cigarrales, 18",
      note: "A 5 minutos de la ermita, entre olivos y con vistas a la ciudad.",
      photo: "patioOlivos",
    },
  ],
  climate: [11, 2, 30],
  program: [
    [
      "12:30",
      "Ceremonia",
      "iglesia",
      "Ermita del Valle Alto",
      "Con villancicos al final, que estamos en fechas.",
      "ceremony",
    ],
    [
      "13:45",
      "Aperitivo",
      "finca",
      "Junto a la chimenea",
      "Mazapán, perdiz escabechada y vino de la tierra.",
      "cocktail",
    ],
    [
      "15:30",
      "Comida",
      "finca",
      "El salón del cigarral",
      "Comida de Navidad adelantada, con el menú que elijas al confirmar.",
      "banquet",
    ],
    [
      "19:00",
      "Fiesta",
      "finca",
      "Hasta que canten los niños de San Ildefonso",
      "Barra libre y baile. Se reparte un décimo por mesa.",
      "party",
    ],
  ],
  busRoutes: [
    ["madrid", "Madrid → Toledo", "Plaza Elíptica, Madrid", "11:00", ["21:00", "01:30"], 50],
    ["toledo", "Toledo → Cigarral", "Puerta de Bisagra, Toledo", "12:00", ["01:30"], 30],
  ],
  menu: {
    carne: "Perdiz estofada a la toledana",
    pescado: "Lomo de bacalao con pisto manchego",
    vegetariano: "Migas con uvas y huevo de corral",
    vegano: "Crema de castañas y pastel de setas",
  },
  dressCode: {
    title: "Gala de invierno",
    detail: "Verde de imprenta, oro y algo de rojo, como un décimo. Hace frío: traed abrigo.",
    palette: [
      { name: "Verde imprenta", hex: "#1b3527" },
      { name: "Oro viejo", hex: "#b08a2e" },
      { name: "Rojo sorteo", hex: "#a3221b" },
      { name: "Papel", hex: "#ebe7d4" },
    ],
    examples: [
      "Vestido largo o midi en tonos de invierno; abrigo para la ermita.",
      "Traje oscuro con corbata o pajarita.",
      "Ropa de abrigo: habrá juegos en el jardín si sale el sol.",
    ],
  },
  accommodation: [
    [
      "Hotel Puerta del Sol",
      "En el casco histórico, a 10 min del cigarral",
      "Habitaciones reservadas hasta el 1 de noviembre. Menciona la boda.",
    ],
    [
      "Hotel Mirador de los Cigarrales",
      "A 5 min de la ermita",
      "Con la mejor vista de Toledo; ideal para quedarse el fin de semana.",
    ],
  ],
  story: {
    intro:
      "Una cola de lotería, un décimo a medias y diez años sin premio. Esta es la versión corta.",
    moments: [
      [
        "2017",
        "La cola",
        "Dos horas de cola en Madrid para comprar lotería. Él se quedó sin cambio y ella le prestó diez euros.",
        "terraza",
      ],
      [
        "2019",
        "El décimo compartido",
        "Desde entonces compramos uno a medias cada Navidad. Nunca nos ha tocado ni el reintegro.",
        "olivos",
      ],
      [
        "2026",
        "La pedida",
        "El 22 de diciembre, con el sorteo de fondo. El anillo iba envuelto en un décimo.",
        "anilloMuro",
      ],
      [
        "Hoy",
        "Y ahora, la boda",
        "Vivimos en Toledo, con vistas al río. Esta vez, el premio es seguro. Solo faltáis vosotros.",
        "olivar",
      ],
    ],
  },
  gifts: [
    [
      "Nuestro viaje a Laponia",
      "Ya que nos casamos en Navidad, a ver a Papá Noel. Cualquier aportación nos acerca.",
      "Lo que queráis",
    ],
    ["Una vajilla de Talavera", "La de toda la vida, para las cenas de Nochebuena.", "340 €"],
    ["Un décimo para cada año", "Durante diez años. Algún día tocará.", "200 €"],
    ["Un olivo para el cigarral", "Lo plantaremos en el primer aniversario.", "90 €"],
  ],
  kids: "Habrá monitores, un taller de adornos de Navidad y comida para ellos.",
  faq: [
    "¿Habrá lotería?",
    "Sí: cada mesa tendrá un décimo del sorteo del 22. Si toca, se reparte entre la mesa.",
  ],
  guestbook: [
    ["Laura y Óscar", "Diez años sin premio y ahora os toca el gordo. ¡Enhorabuena!"],
    ["El abuelo Felipe", "Yo pongo el mazapán. Que seáis muy felices."],
    ["Los de la oficina", "Ya tenemos el número de la boda. Si toca, invitamos nosotros."],
  ],
  songs: [
    "Last Christmas",
    "All I Want for Christmas Is You",
    "Hoy puede ser un gran día",
    "September",
    "Valerie",
    "Mi gran noche",
  ],
});

export const telegrama = wedding({
  id: "evt-demo-irene-guille",
  first: "Irene",
  second: "Guille",
  date: "2027-09-18T18:00:00+02:00",
  rsvpDeadline: "2027-08-10T23:59:00+02:00",
  city: "Almagro",
  region: "Ciudad Real",
  couple: "olivar",
  coverPhoto: "/fotos/olivar/historia-2.jpg",
  cardMessage: "Noticia urgente: nos casamos. Stop. Te queremos allí. Stop. Contesta pronto. Stop.",
  welcomeMessage:
    "Ella estudia cartas antiguas y él arregla radios de válvulas. Nos escribimos telegramas en broma desde la primera cita. Aquí tienes todo, sin abreviar.",
  thankYouMessage:
    "Gracias por venir a Almagro. Stop. Por los brindis y el baile. Stop. Aquí están vuestras fotos. Stop.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia de San Bartolomé el Viejo",
      kind: "Ceremonia",
      address: "Calle de la Feria, 6",
      note: "A dos calles de la plaza Mayor. El centro es peatonal: aparcad en la ronda.",
      photo: "iglesia",
    },
    {
      id: "finca",
      name: "Casa de Postas del Camino Real",
      kind: "Cóctel, cena y fiesta",
      address: "Camino de Bolaños, km 3",
      note: "A 10 minutos de la iglesia. Fue una casa de postas: aún conserva el antiguo telégrafo.",
      photo: "cortijo",
    },
  ],
  climate: [29, 14, 10],
  program: [
    [
      "18:00",
      "Ceremonia",
      "iglesia",
      "San Bartolomé el Viejo",
      "Corta y al grano, como un buen telegrama.",
      "ceremony",
    ],
    [
      "19:15",
      "Cóctel",
      "finca",
      "El patio de las postas",
      "Berenjenas de Almagro, queso manchego y vino de Valdepeñas.",
      "cocktail",
    ],
    [
      "21:00",
      "Cena",
      "finca",
      "Las caballerizas",
      "Cena con el menú que elijas al confirmar.",
      "banquet",
    ],
    [
      "23:30",
      "Fiesta",
      "finca",
      "Hasta el último mensaje",
      "Barra libre y baile. Recena de migas a las dos.",
      "party",
    ],
  ],
  busRoutes: [
    ["madrid", "Madrid → Almagro", "Estación de Atocha, Madrid", "15:30", ["01:00", "03:30"], 50],
    [
      "ciudad-real",
      "Ciudad Real → Almagro",
      "Estación de tren, Ciudad Real",
      "17:00",
      ["03:30"],
      30,
    ],
  ],
  menu: {
    carne: "Caldereta de cordero manchego",
    pescado: "Bacalao al ajoarriero",
    vegetariano: "Pisto manchego con huevo de corral",
    vegano: "Gachas de almortas con setas",
  },
  dressCode: {
    title: "Elegante de verano",
    detail:
      "Azul de cinta, rojo de urgente y color papel. El patio es de piedra: tacón ancho mejor.",
    palette: [
      { name: "Azul de cinta", hex: "#1f2f4d" },
      { name: "Rojo urgente", hex: "#a3221b" },
      { name: "Papel", hex: "#f0e6cb" },
      { name: "Trigo", hex: "#d3c59f" },
    ],
    examples: [
      "Vestido midi liso o de rayas; tacón ancho o alpargata.",
      "Traje claro o azul; corbata opcional.",
      "Ropa fresca: hay patio para correr.",
    ],
  },
  accommodation: [
    [
      "Hotel Corral de Comedias",
      "En la plaza Mayor, a 3 min de la iglesia",
      "Habitaciones reservadas hasta el 1 de agosto. Menciona la boda.",
    ],
    [
      "Casa rural El Telegrafista",
      "A 5 min de la casa de postas",
      "Cinco habitaciones, ideal para grupos.",
    ],
  ],
  story: {
    intro:
      "Una radio rota, una carta de 1920 y muchos mensajes con «stop». Esta es la versión corta.",
    moments: [
      [
        "2019",
        "La radio",
        "Ella llevó a arreglar la radio de su abuelo. Él tardó un mes, a propósito. Stop.",
        "terraza",
      ],
      [
        "2021",
        "El primer telegrama",
        "«Cena viernes. Stop. Llevo vino. Stop.» Así la invitó a la segunda cita.",
        "olivos",
      ],
      [
        "2026",
        "La pedida",
        "Por telegrama, claro: «¿Te casas conmigo? Stop.» Contestó en persona.",
        "anilloMuro",
      ],
      [
        "Hoy",
        "Y ahora, la boda",
        "Vivimos en Almagro, entre cartas viejas y radios de válvulas. Solo faltáis vosotros. Stop.",
        "olivar",
      ],
    ],
  },
  gifts: [
    [
      "Nuestro viaje a Escocia",
      "Castillos, faros y oficinas de correos antiguas. Cualquier aportación nos acerca.",
      "Lo que queráis",
    ],
    ["Una radio de válvulas de 1950", "Para el salón; Guille ya sabe arreglarla.", "220 €"],
    ["Papel y sobres de algodón", "Para seguir escribiéndonos cartas.", "60 €"],
    ["Una mesa de escritorio", "Para los manuscritos de Irene.", "380 €"],
  ],
  kids: "Habrá monitores y un taller de cartas para ellos.",
  faq: [
    "¿Cómo contesto?",
    "Desde este enlace, en un minuto. Si prefieres un telegrama, también lo aceptamos.",
  ],
  guestbook: [
    ["Ana y Luis", "Recibido. Stop. Allí estaremos. Stop. Con tacones bajos. Stop."],
    ["La tía Carmen", "Que vuestra vida sea larga y sin interferencias."],
    ["Los de la facultad", "Prometemos no escribir el discurso con «stop». Mentira."],
  ],
  songs: ["Mi carta", "Please Mr. Postman", "Contigo", "La flaca", "September", "Valerie"],
});

export const postal = wedding({
  id: "evt-demo-vera-nico",
  first: "Vera",
  second: "Nico",
  date: "2027-08-21T19:30:00+02:00",
  rsvpDeadline: "2027-07-12T23:59:00+02:00",
  city: "Cudillero",
  region: "Asturias",
  couple: "mar",
  coverPhoto: "/fotos/buganvilla/historia-4.jpg",
  cardMessage:
    "Nos pasamos dos años escribiéndonos postales. Esta es la última, y es para invitarte.",
  welcomeMessage:
    "Ella vivía en Lisboa y él en Asturias, y nos escribíamos una postal cada semana. Ahora vivimos juntos y nos casamos en el pueblo más de postal que conocemos.",
  thankYouMessage:
    "Gracias por venir hasta Cudillero, por las postales del libro de firmas y por bailar junto al mar. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia de San Pedro del Puerto",
      kind: "Ceremonia",
      address: "Calle del Puerto, 3",
      note: "Sobre el puerto. El pueblo es muy empinado: calzado cómodo y llegar con tiempo.",
      photo: "iglesia",
    },
    {
      id: "finca",
      name: "Casona Los Indianos",
      kind: "Cóctel, cena y fiesta",
      address: "Camino del Faro, 12",
      note: "A 10 minutos del puerto, en el acantilado. Los autobuses salen al terminar la ceremonia.",
      photo: "terrazaMar",
    },
  ],
  climate: [22, 15, 30],
  program: [
    [
      "19:30",
      "Ceremonia",
      "iglesia",
      "San Pedro del Puerto",
      "Con gaita al salir, como manda la tradición.",
      "ceremony",
    ],
    [
      "20:45",
      "Cóctel",
      "finca",
      "El jardín del faro",
      "Sidra escanciada, pixín y quesos de la tierra.",
      "cocktail",
    ],
    [
      "22:00",
      "Cena",
      "finca",
      "La galería acristalada",
      "Cena con el menú que elijas al confirmar.",
      "banquet",
    ],
    [
      "00:30",
      "Fiesta",
      "finca",
      "Hasta que vuelvan los barcos",
      "Barra libre, música y recena de bollos preñaos.",
      "party",
    ],
  ],
  busRoutes: [
    [
      "oviedo",
      "Oviedo → Cudillero",
      "Estación de autobuses, Oviedo",
      "18:15",
      ["02:30", "05:00"],
      50,
    ],
    ["gijon", "Gijón → Cudillero", "Plaza del Humedal, Gijón", "18:00", ["05:00"], 30],
  ],
  menu: {
    carne: "Cachopo de ternera asturiana con patatas",
    pescado: "Merluza del pincho a la sidra",
    vegetariano: "Pastel de cabracho vegetal y ensalada de la huerta",
    vegano: "Fabes con verduras y pimentón",
  },
  dressCode: {
    title: "Verano del norte",
    detail: "Colores de postal antigua. Por la noche refresca: traed una chaqueta.",
    palette: [
      { name: "Azul bolígrafo", hex: "#1e3a6e" },
      { name: "Verde sello", hex: "#2f6b57" },
      { name: "Atardecer", hex: "#e6bd9c" },
      { name: "Cartulina", hex: "#f6f0e1" },
      { name: "Rojo matasellos", hex: "#b3312a" },
    ],
    examples: [
      "Vestido midi y algo para los hombros; el pueblo tiene cuestas.",
      "Traje claro o americana azul; corbata opcional.",
      "Ropa cómoda y un chubasquero por si acaso.",
    ],
  },
  accommodation: [
    [
      "Hotel El Muelle Viejo",
      "En el puerto, a 2 min de la iglesia",
      "Habitaciones reservadas hasta el 1 de julio. Menciona la boda.",
    ],
    [
      "Apartamentos El Faro",
      "Junto a la casona",
      "Con vistas al mar, para alargar el fin de semana.",
    ],
  ],
  story: {
    intro:
      "Ciento cuatro postales, dos países y un buzón que ya nos conoce. Esta es la versión corta.",
    moments: [
      [
        "2019",
        "La primera postal",
        "Nos conocimos una semana en el Algarve. Él le pidió la dirección para mandarle una postal. Mandó ciento cuatro.",
        "cala",
      ],
      [
        "2021",
        "La mudanza",
        "Ella cruzó Portugal y media España en furgoneta, con las postales en una caja de zapatos.",
        "furgoneta",
      ],
      [
        "2026",
        "La pedida",
        "En la barca de su tío, con una postal que decía: «¿Y si nos casamos?».",
        "anilloBarca",
      ],
      [
        "Hoy",
        "Y ahora, la boda",
        "Vivimos en Gijón y nos seguimos escribiendo, aunque sea de una habitación a otra.",
        "orilla",
      ],
    ],
  },
  gifts: [
    [
      "Nuestro viaje a las Azores",
      "Un sitio de postal que aún no conocemos. Cualquier aportación nos acerca.",
      "Lo que queráis",
    ],
    ["Un álbum para las postales", "Las ciento cuatro, por orden.", "80 €"],
    ["Una cámara instantánea", "Para hacer postales propias.", "150 €"],
    ["Una vajilla de cerámica de Faro", "Para las cenas en casa.", "260 €"],
  ],
  kids: "Habrá monitores y cena para ellos.",
  faq: [
    "¿Y si llueve?",
    "Es Asturias: la cena es en una galería acristalada y hay carpa para el cóctel.",
  ],
  guestbook: [
    ["Inês e João", "Viemos de Lisboa para isto. Parabéns!"],
    ["El tío Ramón", "Ya tengo la sidra fría y la gaita afinada."],
    ["La cartera del barrio", "Ciento cuatro postales. Os echaré de menos."],
  ],
  songs: [
    "Postcards from Italy",
    "Asturias",
    "Mediterráneo",
    "Volando voy",
    "Valerie",
    "September",
  ],
});

export const vinilo = wedding({
  id: "evt-demo-nuria-dani",
  first: "Nuria",
  second: "Dani",
  date: "2027-10-02T18:30:00+02:00",
  rsvpDeadline: "2027-08-25T23:59:00+02:00",
  city: "Valencia",
  region: "Valencia",
  couple: "mar",
  coverPhoto: "/fotos/buganvilla/pareja.jpg",
  cardMessage: "Cara A: nos casamos. Cara B: queremos que estés en la pista. Pon el disco y ven.",
  welcomeMessage:
    "Ella toca el bajo y él pincha discos. Nos conocimos peleándonos por el mismo vinilo en una tienda del Carmen. Aquí tienes todo para acompañarnos.",
  thankYouMessage:
    "Gracias por llenar la pista, por las canciones del libro de firmas y por quedaros hasta el último bis. Aquí están vuestras fotos.",
  venues: [
    {
      id: "finca",
      name: "Alquería del Disco",
      kind: "Ceremonia, cena y concierto",
      address: "Camí de la Horta, 21",
      note: "Entre huertas, a 15 minutos del centro. Hay aparcamiento y autobús desde la ciudad.",
      photo: "pista",
    },
  ],
  climate: [26, 17, 20],
  program: [
    [
      "18:30",
      "Ceremonia",
      "finca",
      "El jardín de los naranjos",
      "Civil, con la banda tocando la entrada.",
      "ceremony",
    ],
    [
      "19:30",
      "Cóctel",
      "finca",
      "La era",
      "Horchata, agua de Valencia y tapas de la huerta.",
      "cocktail",
    ],
    [
      "21:30",
      "Cena",
      "finca",
      "La nave de la alquería",
      "Cena con el menú que elijas al confirmar.",
      "banquet",
    ],
    [
      "00:00",
      "Fiesta",
      "finca",
      "Concierto y sesión",
      "Primero la banda de Nuria, luego los discos de Dani. Sin hora de cierre.",
      "party",
    ],
  ],
  busRoutes: [
    [
      "centro",
      "Centro → Alquería",
      "Plaza del Ayuntamiento, Valencia",
      "17:45",
      ["02:00", "04:30"],
      50,
    ],
    ["castellon", "Castellón → Alquería", "Estación de tren, Castellón", "17:00", ["04:30"], 30],
  ],
  menu: {
    carne: "Paella valenciana de pollo y conejo",
    pescado: "Arroz del senyoret",
    vegetariano: "Arroz de verduras de la huerta",
    vegano: "Arroz de alcachofas y garrofó",
  },
  dressCode: {
    title: "Noche de concierto",
    detail: "Negro de vinilo con algo de naranja o mostaza. Se baila mucho: calzado cómodo.",
    palette: [
      { name: "Negro vinilo", hex: "#1c1917" },
      { name: "Naranja", hex: "#c2511f" },
      { name: "Mostaza", hex: "#d9a441" },
      { name: "Crema", hex: "#f3ead8" },
    ],
    examples: [
      "Vestido o mono con el que podáis bailar; zapatillas permitidas.",
      "Traje o americana con camiseta: como en un concierto bueno.",
      "Ropa cómoda y cascos para los oídos, que habrá música alta.",
    ],
  },
  accommodation: [
    [
      "Hotel Barrio del Carmen",
      "En el centro, a 15 min de la alquería",
      "Habitaciones reservadas hasta el 15 de agosto. Menciona la boda.",
    ],
    ["Apartamentos La Malvarrosa", "Frente a la playa", "Para alargar el fin de semana."],
  ],
  story: {
    intro:
      "Un vinilo, una tienda pequeña y una discusión que todavía no ha terminado. Esta es la versión corta.",
    moments: [
      [
        "2018",
        "El disco",
        "El último vinilo de una edición limitada. Ninguno lo soltó, así que lo escuchamos juntos.",
        "cala",
      ],
      [
        "2021",
        "La gira",
        "Un verano de festivales en furgoneta, ella con la banda y él con los discos.",
        "furgoneta",
      ],
      [
        "2026",
        "La pedida",
        "En una barca en la Albufera, con el anillo dentro de la funda de aquel disco.",
        "anilloBarca",
      ],
      [
        "Hoy",
        "Y ahora, la boda",
        "Vivimos en el Cabanyal con dos mil discos y un bajo. Solo faltáis vosotros.",
        "orilla",
      ],
    ],
  },
  gifts: [
    [
      "Nuestro viaje a Londres",
      "Tiendas de discos y salas de conciertos. Cualquier aportación nos acerca.",
      "Lo que queráis",
    ],
    ["Un tocadiscos nuevo", "El de Dani tiene treinta años y se nota.", "420 €"],
    ["Un amplificador para el bajo", "Para que suene en casa (bajito).", "350 €"],
    ["Un mueble para los discos", "Que ya no caben en el pasillo.", "240 €"],
  ],
  kids: "Habrá monitores, cascos de protección y cena para ellos.",
  faq: [
    "¿Puedo pedir canciones?",
    "Sí: déjalas en el libro de firmas. Dani promete pinchar todas (o casi).",
  ],
  guestbook: [
    ["La banda", "Ensayamos la de la entrada desde marzo. Que nadie llore. Mentira, llorad."],
    ["Tía Amparo", "Yo solo quiero un pasodoble. Uno."],
    ["Los de la tienda", "El disco sigue siendo nuestro, que conste."],
  ],
  songs: [
    "Rock the Casbah",
    "Lucha de gigantes",
    "Heroes",
    "Mr. Brightside",
    "Bailando",
    "September",
  ],
});

export const pasaporte = wedding({
  id: "evt-demo-paula-iker",
  first: "Paula",
  second: "Íker",
  date: "2027-06-26T19:00:00+02:00",
  rsvpDeadline: "2027-05-20T23:59:00+02:00",
  city: "Hondarribia",
  region: "Gipuzkoa",
  couple: "mar",
  coverPhoto: "/fotos/buganvilla/historia-2.jpg",
  cardMessage:
    "Nos casamos en la frontera, con un pie en cada lado. Tu pasaporte para la boda ya está sellado.",
  welcomeMessage:
    "Ella es de Toulouse y él de Hondarribia. Nos conocimos cruzando el puente del Bidasoa cada mañana. Aquí tienes todo, en los dos idiomas que hablamos en casa.",
  thankYouMessage:
    "Gracias por cruzar fronteras para estar con nosotros, por los brindis en tres idiomas y por cada baile. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia de Santa Engracia",
      kind: "Ceremonia",
      address: "Calle Mayor, 11",
      note: "En lo alto del casco antiguo. Las calles son empedradas: calzado cómodo.",
      photo: "iglesia",
    },
    {
      id: "finca",
      name: "Caserío Amalur",
      kind: "Cóctel, cena y fiesta",
      address: "Barrio de Jaizubia, 7",
      note: "A 10 minutos de la iglesia, mirando a la bahía. Los autobuses salen al terminar.",
      photo: "terrazaMar",
    },
  ],
  climate: [23, 15, 35],
  program: [
    [
      "19:00",
      "Ceremonia",
      "iglesia",
      "Santa Engracia",
      "En castellano, francés y euskera, sin prisas.",
      "ceremony",
    ],
    [
      "20:15",
      "Cóctel",
      "finca",
      "La campa del caserío",
      "Txakoli, pintxos y queso de los dos lados.",
      "cocktail",
    ],
    [
      "21:45",
      "Cena",
      "finca",
      "El bodegón",
      "Cena con el menú que elijas al confirmar.",
      "banquet",
    ],
    [
      "00:30",
      "Fiesta",
      "finca",
      "Hasta que abra la frontera",
      "Barra libre, trikitixa y recena a las tres.",
      "party",
    ],
  ],
  busRoutes: [
    [
      "donostia",
      "Donostia → Hondarribia",
      "Plaza de Gipuzkoa, Donostia",
      "18:00",
      ["02:30", "04:30"],
      50,
    ],
    ["biarritz", "Biarritz → Hondarribia", "Gare de Biarritz", "17:45", ["04:30"], 30],
  ],
  menu: {
    carne: "Chuletón de vaca con pimientos de Gernika",
    pescado: "Kokotxas de merluza al pilpil",
    vegetariano: "Piperrada con huevo y pan de caserío",
    vegano: "Alubias de Tolosa con verduras",
  },
  dressCode: {
    title: "Elegante de frontera",
    detail: "Granate de pasaporte y dorado de sello. Puede llover: traed paraguas.",
    palette: [
      { name: "Granate", hex: "#5a1220" },
      { name: "Dorado", hex: "#c9a14a" },
      { name: "Azul sello", hex: "#2a4a7f" },
      { name: "Papel", hex: "#f1ece0" },
    ],
    examples: [
      "Vestido midi y algo de abrigo; tacón ancho, que hay empedrado.",
      "Traje oscuro o azul; corbata opcional.",
      "Ropa cómoda y un chubasquero.",
    ],
  },
  accommodation: [
    [
      "Hotel Murallas",
      "En el casco antiguo, a 3 min de la iglesia",
      "Habitaciones reservadas hasta el 10 de mayo. Menciona la boda.",
    ],
    [
      "Chambres du Pont",
      "En Hendaya, al otro lado del puente",
      "Para quien venga de Francia, a 10 min del caserío.",
    ],
  ],
  story: {
    intro: "Un puente, dos países y tres idiomas. Esta es la versión corta.",
    moments: [
      [
        "2018",
        "El puente",
        "Cada mañana cruzábamos el Bidasoa en sentido contrario. Un día ella perdió el bus y él la llevó.",
        "cala",
      ],
      [
        "2021",
        "La costa",
        "De Burdeos a Lisboa en furgoneta, sellando el pasaporte de mentira en cada pueblo.",
        "furgoneta",
      ],
      [
        "2026",
        "La pedida",
        "En una txalupa, justo en medio de la bahía: ni en Francia ni en España.",
        "anilloBarca",
      ],
      [
        "Hoy",
        "Y ahora, la boda",
        "Vivimos en Hondarribia, a un puente de su familia. Solo faltáis vosotros.",
        "orilla",
      ],
    ],
  },
  gifts: [
    [
      "Nuestro viaje a Islandia",
      "Un país nuevo para los dos pasaportes. Cualquier aportación nos acerca.",
      "Lo que queráis",
    ],
    ["Una vajilla de Pasaia", "Para las comidas con las dos familias.", "300 €"],
    ["Clases de euskera para Paula", "Y de francés para Íker.", "200 €"],
    ["Un manzano para la huerta", "Para tener sidra propia algún día.", "50 €"],
  ],
  kids: "Habrá monitores y cena para ellos.",
  faq: [
    "¿Necesito pasaporte de verdad?",
    "No: con el DNI basta para cruzar la frontera. El de la boda os lo damos nosotros.",
  ],
  guestbook: [
    ["Camille et Julien", "On arrive de Toulouse en voiture. Félicitations !"],
    ["Amama Miren", "Zorionak, maiteak. Y que no os falte de nada."],
    ["Los de la cuadrilla", "Llevamos la trikitixa. Íker, prepárate."],
  ],
  songs: ["La vie en rose", "Txoria txori", "Mediterráneo", "Volando voy", "Valerie", "September"],
});

export const carta = wedding({
  id: "evt-demo-rocio-manu",
  first: "Rocío",
  second: "Manu",
  date: "2027-05-29T13:00:00+02:00",
  rsvpDeadline: "2027-04-20T23:59:00+02:00",
  city: "Priego de Córdoba",
  region: "Córdoba",
  couple: "olivar",
  coverPhoto: "/fotos/olivar/banquete.jpg",
  cardMessage:
    "Hoy cocinamos para ti. Menú del día: una boda, una comida larga y la sobremesa sin hora.",
  welcomeMessage:
    "Somos cocineros y nos conocimos en la misma cocina, peleando por el último fuego libre. Aquí tienes la carta completa del día.",
  thankYouMessage:
    "Gracias por venir con hambre, por repetir postre y por la sobremesa más larga que hemos servido. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Ermita de la Aurora Vieja",
      kind: "Ceremonia",
      address: "Calle Aurora, 2",
      note: "En el centro del pueblo. Hay aparcamiento en el paseo.",
      photo: "ermitaOlivos",
    },
    {
      id: "finca",
      name: "Almazara El Fogón",
      kind: "Aperitivo, comida y fiesta",
      address: "Carretera de Zagrilla, km 3",
      note: "A 10 minutos de la ermita, entre olivos. La cocina estará abierta para quien quiera mirar.",
      photo: "patioOlivos",
    },
  ],
  climate: [27, 13, 10],
  program: [
    [
      "13:00",
      "Ceremonia",
      "iglesia",
      "Ermita de la Aurora",
      "Breve: la comida no espera.",
      "ceremony",
    ],
    [
      "14:00",
      "Aperitivo",
      "finca",
      "El patio de la almazara",
      "Salmorejo, aceite nuevo y vino de Montilla.",
      "cocktail",
    ],
    [
      "15:30",
      "Comida",
      "finca",
      "Bajo los olivos",
      "Siete pases y el menú que elijas al confirmar.",
      "banquet",
    ],
    [
      "19:00",
      "Fiesta",
      "finca",
      "Sobremesa y baile",
      "Barra libre y, a medianoche, la recena que cocinamos nosotros.",
      "party",
    ],
  ],
  busRoutes: [
    [
      "cordoba",
      "Córdoba → Priego",
      "Paseo de la Victoria, Córdoba",
      "11:30",
      ["21:00", "01:30"],
      50,
    ],
    ["granada", "Granada → Priego", "Palacio de Congresos, Granada", "11:45", ["01:30"], 30],
  ],
  menu: {
    carne: "Rabo de toro deshuesado con puré de patata",
    pescado: "Bacalao confitado en aceite de Priego",
    vegetariano: "Flamenquín de berenjena y queso",
    vegano: "Alcachofas confitadas con salmorejo de remolacha",
  },
  dressCode: {
    title: "Mantel largo",
    detail: "Verde botella, burdeos y oro. Comeremos al aire libre: algo fresco y sin tacón fino.",
    palette: [
      { name: "Verde botella", hex: "#2f4a3a" },
      { name: "Burdeos", hex: "#7a2230" },
      { name: "Dorado", hex: "#b08a2e" },
      { name: "Mantel", hex: "#fbf8f1" },
    ],
    examples: [
      "Vestido midi y cómodo, que la comida es larga; cuña o tacón ancho.",
      "Traje ligero; la chaqueta se quita en el segundo plato.",
      "Ropa fresca: habrá taller de pizzas para ellos.",
    ],
  },
  accommodation: [
    [
      "Hotel Fuente del Rey",
      "En el centro, a 5 min de la ermita",
      "Habitaciones reservadas hasta el 10 de abril. Menciona la boda.",
    ],
    [
      "Casa rural El Lagar",
      "Junto a la almazara",
      "Ideal para familias y para quien no quiera conducir después de comer.",
    ],
  ],
  story: {
    intro: "Una cocina, dos delantales y muchos platos rotos. Esta es la versión corta.",
    moments: [
      [
        "2018",
        "El último fuego",
        "Primer día en la misma cocina y un solo fuego libre. Lo compartieron y se quemó el arroz.",
        "terraza",
      ],
      [
        "2021",
        "El restaurante",
        "Abrimos uno pequeño en Córdoba. Ella hace los postres; él, todo lo demás (dice él).",
        "olivos",
      ],
      ["2026", "La pedida", "Con el anillo escondido en el postre. Casi se lo come.", "anilloMuro"],
      [
        "Hoy",
        "Y ahora, la boda",
        "Cocinamos con el aceite de la familia de Manu, en el pueblo donde se hace. Solo faltáis vosotros.",
        "olivar",
      ],
    ],
  },
  gifts: [
    [
      "Nuestro viaje a Japón",
      "A comer, claro: de Tokio a Osaka. Cualquier aportación nos acerca.",
      "Lo que queráis",
    ],
    [
      "Un juego de cuchillos japoneses",
      "Para la cocina de casa, que es la única que no es del trabajo.",
      "390 €",
    ],
    ["Una paellera grande", "Para cocinar para todos cuando vengáis.", "90 €"],
    ["Un olivo con vuestro nombre", "Lo plantaremos en la finca el primer aniversario.", "90 €"],
  ],
  kids: "Habrá monitores, taller de pizzas y comida para ellos.",
  faq: [
    "¿Y si tengo alergias?",
    "Dínoslo al confirmar. Cocinamos nosotros: te preparamos un plato a medida.",
  ],
  guestbook: [
    ["La brigada del restaurante", "Ese día no cocináis vosotros. Bueno, solo la recena."],
    ["La abuela Dolores", "El aceite de este año es el mejor que hemos tenido. Como vosotros."],
    ["Carmen, la de sala", "Yo os sirvo el vino. Que sea con alegría."],
  ],
  songs: [
    "Hoy puede ser un gran día",
    "Bailando",
    "Andaluces de Jaén",
    "Sarandonga",
    "September",
    "Valerie",
  ],
});

export const mapa = wedding({
  id: "evt-demo-aitana-bruno",
  first: "Aitana",
  second: "Bruno",
  date: "2027-07-24T19:00:00+02:00",
  rsvpDeadline: "2027-06-15T23:59:00+02:00",
  city: "Formentera",
  region: "Baleares",
  couple: "mar",
  coverPhoto: "/fotos/buganvilla/historia-1.jpg",
  cardMessage: "Hemos escondido una boda en una isla. Sigue el mapa: la X marca el sitio.",
  welcomeMessage:
    "Nos conocimos buscando tesoros escondidos, de esos de coordenadas y cajitas. Ahora el tesoro es la boda. Aquí tienes todas las pistas.",
  thankYouMessage:
    "Gracias por cruzar el mar, por encontrar cada pista y por bailar hasta que salió el sol. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Ermita de Sant Ferran",
      kind: "Ceremonia",
      address: "Plaça de l'Església, 1",
      note: "En Sant Ferran. Se llega en bici o en el autobús de la boda desde el puerto.",
      photo: "ermitaMar",
      city: "Sant Ferran de ses Roques, Baleares",
    },
    {
      id: "faro",
      name: "Mirador del Faro Viejo",
      kind: "Cóctel",
      address: "Camí del Far, s/n",
      note: "A 10 minutos de la ermita, en el acantilado. Sopla viento: algo para los hombros.",
      photo: "terrazaMar",
    },
    {
      id: "finca",
      name: "Finca Es Tresor",
      kind: "Cena y fiesta",
      address: "Camí de Ses Salines, km 2",
      note: "A 15 minutos del faro, junto a las salinas.",
      photo: "pista",
    },
  ],
  climate: [30, 22, 0],
  program: [
    [
      "19:00",
      "Ceremonia",
      "iglesia",
      "Ermita de Sant Ferran",
      "La primera parada del mapa.",
      "ceremony",
    ],
    [
      "20:15",
      "Cóctel",
      "faro",
      "Mirador del Faro Viejo",
      "Hierbas ibicencas, sobrasada y la puesta de sol.",
      "cocktail",
    ],
    [
      "22:00",
      "Cena",
      "finca",
      "El jardín de las salinas",
      "Cena con el menú que elijas al confirmar.",
      "banquet",
    ],
    [
      "00:30",
      "Fiesta",
      "finca",
      "Donde marca la X",
      "Barra libre y baile bajo las luces. Hay un tesoro escondido.",
      "party",
    ],
  ],
  busRoutes: [
    [
      "puerto",
      "La Savina → Boda",
      "Puerto de La Savina, llegada de los barcos",
      "18:15",
      ["02:30", "05:00"],
      50,
    ],
    ["es-pujols", "Es Pujols → Boda", "Paseo de Es Pujols", "18:30", ["05:00"], 30],
  ],
  menu: {
    carne: "Sofrit pagès con patata",
    pescado: "Bullit de peix y arroz a banda",
    vegetariano: "Ensalada payesa con pimientos asados",
    vegano: "Tumbet de verduras",
  },
  dressCode: {
    title: "Aventura elegante",
    detail: "Colores de mapa viejo y de mar. Hay arena y caminos: sandalia plana.",
    palette: [
      { name: "Sepia", hex: "#3b2a1a" },
      { name: "Rojo lacre", hex: "#9b2c1f" },
      { name: "Mar", hex: "#9fb7b5" },
      { name: "Verde tierra", hex: "#6f7d4f" },
      { name: "Pergamino", hex: "#efe2c4" },
    ],
    examples: [
      "Vestido ligero y sandalia plana: el mapa tiene arena.",
      "Camisa de lino y pantalón claro; nada de corbata.",
      "Ropa fresca y gorra: habrá búsqueda del tesoro para ellos.",
    ],
  },
  accommodation: [
    [
      "Hostal Es Tresor",
      "En Sant Ferran, a 3 min de la ermita",
      "Habitaciones reservadas hasta el 1 de junio. Menciona la boda.",
    ],
    ["Apartamentos Es Pujols", "Frente a la playa", "Para alargar el viaje unos días."],
  ],
  story: {
    intro: "Unas coordenadas, una caja de latón y muchos mapas. Esta es la versión corta.",
    moments: [
      [
        "2019",
        "La caja de latón",
        "Buscábamos el mismo tesoro escondido en una cala. Lo encontramos a la vez y firmamos juntos el cuaderno.",
        "cala",
      ],
      [
        "2021",
        "La ruta",
        "Un verano entero de furgoneta siguiendo pistas por la costa. Encontramos 63 tesoros.",
        "furgoneta",
      ],
      [
        "2026",
        "La pedida",
        "Ella le dio unas coordenadas. En el punto había una barca y, dentro, el anillo.",
        "anilloBarca",
      ],
      [
        "Hoy",
        "Y ahora, la boda",
        "Vivimos en Ibiza y cruzamos a Formentera siempre que podemos. Solo faltáis vosotros.",
        "orilla",
      ],
    ],
  },
  gifts: [
    [
      "Nuestro viaje a Escocia",
      "Islas, castillos y mapas antiguos. Cualquier aportación nos acerca.",
      "Lo que queráis",
    ],
    ["Un GPS de montaña", "El nuestro ya se pierde más que nosotros.", "260 €"],
    ["Dos bicis para la isla", "Para llegar a las calas sin coche.", "480 €"],
    ["Un mapa antiguo enmarcado", "Para la pared del salón.", "120 €"],
  ],
  kids: "Habrá monitores y una búsqueda del tesoro para ellos.",
  faq: [
    "¿Cómo llego a Formentera?",
    "En barco desde Ibiza, unos 30 minutos. El autobús de la boda espera en el puerto de La Savina.",
  ],
  guestbook: [
    ["Nerea y Pol", "Hemos encontrado la boda a la primera. ¡Enhorabuena!"],
    ["El abuelo Vicent", "Os dejo una pista: sed felices."],
    ["Los del club de tesoros", "Escondimos algo en la finca. Buena suerte."],
  ],
  songs: [
    "Mediterráneo",
    "Islands in the Stream",
    "La isla bonita",
    "Volando voy",
    "Valerie",
    "September",
  ],
});

export const constelacion = wedding({
  id: "evt-demo-lola-samuel",
  first: "Lola",
  second: "Samuel",
  date: "2027-12-11T19:30:00+01:00",
  rsvpDeadline: "2027-11-02T23:59:00+01:00",
  city: "Garafía",
  region: "La Palma",
  couple: "mar",
  coverPhoto: "/fotos/buganvilla/historia-4.jpg",
  cardMessage:
    "Nos casamos bajo uno de los cielos más limpios del mundo. Queremos verte entre las estrellas.",
  welcomeMessage:
    "Somos astrónomos y nos conocimos en el observatorio, una noche de nubes en la que no se veía nada. Aquí tienes todo para acompañarnos.",
  thankYouMessage:
    "Gracias por subir hasta las estrellas, por mirar por el telescopio en la fiesta y por cada brindis. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia de Nuestra Señora de las Estrellas",
      kind: "Ceremonia",
      address: "Plaza de Baltasar Martín, 1",
      note: "En el centro de Garafía. La carretera tiene curvas: mejor en el autobús de la boda.",
      photo: "iglesia",
    },
    {
      id: "finca",
      name: "Hacienda Cielo Abierto",
      kind: "Cóctel, cena y fiesta",
      address: "Camino del Roque, km 4",
      note: "A 15 minutos de la iglesia. Por la noche apagamos las luces para ver las estrellas.",
      photo: "pista",
    },
  ],
  climate: [17, 9, 30],
  program: [
    [
      "19:30",
      "Ceremonia",
      "iglesia",
      "Nuestra Señora de las Estrellas",
      "Con la primera estrella de la noche.",
      "ceremony",
    ],
    [
      "20:45",
      "Cóctel",
      "finca",
      "El mirador",
      "Vino de la isla, quesos palmeros y telescopios.",
      "cocktail",
    ],
    [
      "22:00",
      "Cena",
      "finca",
      "Bajo la Vía Láctea",
      "Cena con el menú que elijas al confirmar.",
      "banquet",
    ],
    [
      "00:30",
      "Fiesta",
      "finca",
      "Hasta el amanecer",
      "Barra libre, baile y una visita guiada al cielo a las dos.",
      "party",
    ],
  ],
  busRoutes: [
    [
      "santa-cruz",
      "Santa Cruz → Garafía",
      "Avenida Marítima, Santa Cruz de La Palma",
      "17:45",
      ["02:30", "05:00"],
      50,
    ],
    [
      "los-llanos",
      "Los Llanos → Garafía",
      "Plaza de España, Los Llanos de Aridane",
      "18:00",
      ["05:00"],
      30,
    ],
  ],
  menu: {
    carne: "Cabrito en adobo con papas",
    pescado: "Vieja sancochada con mojo",
    vegetariano: "Queso asado con mojo verde y papas",
    vegano: "Potaje de berros con gofio",
  },
  dressCode: {
    title: "Noche de gala",
    detail: "Azul noche y oro de estrella. Arriba hace frío de noche: abrigo sin excusa.",
    palette: [
      { name: "Azul noche", hex: "#0d1530" },
      { name: "Oro", hex: "#d8b96a" },
      { name: "Azul claro", hex: "#6f8cc4" },
      { name: "Marfil", hex: "#f2ecdb" },
    ],
    examples: [
      "Vestido largo en azul noche o dorado, y abrigo.",
      "Traje oscuro o esmoquin.",
      "Ropa de abrigo: los telescopios son para ellos primero.",
    ],
  },
  accommodation: [
    [
      "Hotel El Roque",
      "En Garafía, a 5 min de la iglesia",
      "Habitaciones reservadas hasta el 20 de octubre. Menciona la boda.",
    ],
    ["Casas rurales del Cielo", "Junto a la hacienda", "Con terraza para seguir mirando el cielo."],
  ],
  story: {
    intro: "Una noche de nubes, un telescopio y mucho café. Esta es la versión corta.",
    moments: [
      [
        "2018",
        "La noche nublada",
        "Primera noche de los dos en el observatorio y no se veía nada. Hablamos hasta el amanecer.",
        "cala",
      ],
      [
        "2021",
        "El eclipse",
        "Cruzamos media Europa en furgoneta para ver un eclipse. Llegamos tarde, pero llegamos juntos.",
        "furgoneta",
      ],
      [
        "2026",
        "La pedida",
        "En una barca, de noche, con la Vía Láctea encima. El anillo brillaba más.",
        "anilloBarca",
      ],
      [
        "Hoy",
        "Y ahora, la boda",
        "Vivimos en La Palma, cerca del observatorio. Solo faltáis vosotros.",
        "orilla",
      ],
    ],
  },
  gifts: [
    [
      "Nuestro viaje a Atacama",
      "El desierto con el cielo más limpio. Cualquier aportación nos acerca.",
      "Lo que queráis",
    ],
    ["Un telescopio para casa", "Para no tener que ir al trabajo a mirar las estrellas.", "650 €"],
    ["Una estrella con vuestro nombre", "En nuestro mapa del cielo, claro.", "20 €"],
    ["Una manta para el mirador", "Para las noches largas de observación.", "60 €"],
  ],
  kids: "Habrá monitores, un planetario hinchable y cena para ellos.",
  faq: [
    "¿Veremos estrellas?",
    "Si el cielo está despejado, muchísimas. A las dos apagamos todas las luces y habrá telescopios.",
  ],
  guestbook: [
    ["Los del observatorio", "Hemos reservado el cielo para esa noche. Que no se nuble."],
    ["Abuela Candelaria", "Mis dos estrellas. Que seáis muy felices."],
    ["Elsa y Marco", "Pedimos un deseo por vosotros con la primera estrella fugaz."],
  ],
  songs: [
    "Fly me to the moon",
    "A Sky Full of Stars",
    "Starman",
    "La Luna",
    "September",
    "Valerie",
  ],
});

export const comic = wedding({
  id: "evt-demo-valeria-jorge",
  first: "Valeria",
  second: "Jorge",
  date: "2027-06-05T18:00:00+02:00",
  rsvpDeadline: "2027-04-28T23:59:00+02:00",
  city: "Sitges",
  region: "Barcelona",
  couple: "mar",
  coverPhoto: "/fotos/buganvilla/pareja.jpg",
  cardMessage:
    "¡Atención! En el próximo número, nuestros héroes se casan. Y tú sales en la última viñeta.",
  welcomeMessage:
    "Ella dibuja y él escribe los guiones. Nos conocimos en un salón del cómic, haciendo cola para la misma firma. Aquí tienes todo para acompañarnos.",
  thankYouMessage:
    "Gracias por venir disfrazados (algunos), por los bocadillos del libro de firmas y por bailar hasta el final. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Ermita del Vinyet",
      kind: "Ceremonia",
      address: "Passeig del Vinyet, 5",
      note: "Junto al paseo marítimo. Hay aparcamiento en el paseo.",
      photo: "ermitaMar",
    },
    {
      id: "finca",
      name: "Villa Viñeta",
      kind: "Cóctel, cena y fiesta",
      address: "Carrer de la Riera, 22",
      note: "A 10 minutos de la ermita. Los autobuses salen al terminar la ceremonia.",
      photo: "terrazaMar",
    },
  ],
  climate: [25, 17, 10],
  program: [
    ["18:00", "Ceremonia", "iglesia", "Ermita del Vinyet", "Primer capítulo: el sí.", "ceremony"],
    [
      "19:15",
      "Cóctel",
      "finca",
      "La terraza",
      "Cava del Penedès, croquetas y un fotomatón con bocadillos de cómic.",
      "cocktail",
    ],
    ["21:00", "Cena", "finca", "El jardín", "Cena con el menú que elijas al confirmar.", "banquet"],
    [
      "23:30",
      "Fiesta",
      "finca",
      "Continuará…",
      "Barra libre y baile. Concurso de disfraces a la una.",
      "party",
    ],
  ],
  busRoutes: [
    [
      "barcelona",
      "Barcelona → Sitges",
      "Plaça d'Espanya, Barcelona",
      "16:45",
      ["02:00", "04:00"],
      50,
    ],
    [
      "vilanova",
      "Vilanova → Sitges",
      "Estación de tren, Vilanova i la Geltrú",
      "17:15",
      ["04:00"],
      30,
    ],
  ],
  menu: {
    carne: "Fricandó de ternera con setas",
    pescado: "Suquet de rape y gambas",
    vegetariano: "Escalivada con queso de cabra y romesco",
    vegano: "Arroz de verduras con romesco",
  },
  dressCode: {
    title: "Elegante con superpoderes",
    detail: "Rojo, amarillo y azul, como una portada de tebeo. Si queréis, un guiño de disfraz.",
    palette: [
      { name: "Rojo", hex: "#d92b2b" },
      { name: "Amarillo", hex: "#f5c518" },
      { name: "Azul", hex: "#2563c9" },
      { name: "Negro", hex: "#141414" },
    ],
    examples: [
      "Vestido de un color vivo; la capa es opcional.",
      "Traje con una corbata o unos calcetines de héroe.",
      "¡Disfraz! Habrá concurso para ellos también.",
    ],
  },
  accommodation: [
    [
      "Hotel Platja",
      "Frente al mar, a 5 min de la ermita",
      "Habitaciones reservadas hasta el 15 de abril. Menciona la boda.",
    ],
    ["Apartamentos La Riera", "A 3 min de la villa", "Para grupos de amigos."],
  ],
  story: {
    intro: "Una cola de firmas, un rotulador y muchas viñetas. Esta es la versión corta.",
    moments: [
      [
        "2017",
        "La cola",
        "Tres horas de cola para que nos firmaran el mismo tebeo. Ella le dibujó un retrato mientras tanto.",
        "cala",
      ],
      [
        "2020",
        "El primer cómic",
        "Lo hicimos juntos en un verano de furgoneta por la costa. Vendimos 200 ejemplares, casi todos a la familia.",
        "furgoneta",
      ],
      [
        "2026",
        "La pedida",
        "En la última página de nuestro cómic nuevo. Ella lo leyó en la barca.",
        "anilloBarca",
      ],
      [
        "Hoy",
        "Y ahora, la boda",
        "Vivimos en Sitges, con un estudio lleno de lápices. Solo faltáis vosotros.",
        "orilla",
      ],
    ],
  },
  gifts: [
    [
      "Nuestro viaje a Angulema",
      "Al festival de cómic más grande de Europa. Cualquier aportación nos acerca.",
      "Lo que queráis",
    ],
    ["Una tableta de dibujo", "Para que Valeria jubile la de la carrera.", "480 €"],
    ["Una estantería para los tebeos", "Que ya no caben ni en la cocina.", "220 €"],
    ["Una edición integral", "De nuestra serie favorita, en tapa dura.", "90 €"],
  ],
  kids: "Habrá monitores, taller de dibujo y cena para ellos.",
  faq: [
    "¿Hay que ir disfrazado?",
    "No hace falta. Pero si traes un guiño de héroe, participas en el concurso.",
  ],
  guestbook: [
    ["Los del salón del cómic", "¡Zas! ¡Pum! ¡Enhorabuena!"],
    ["La iaia Montse", "Mis dos dibujantes favoritos. Que seáis felices."],
    ["Bea y Sergi", "Llevamos capa. Avisados estáis."],
  ],
  songs: ["Holding Out for a Hero", "Superman", "Mediterráneo", "Bailando", "Valerie", "September"],
});

export const cosecha = wedding({
  id: "evt-demo-blanca-rodrigo",
  first: "Blanca",
  second: "Rodrigo",
  date: "2027-09-25T13:00:00+02:00",
  rsvpDeadline: "2027-08-16T23:59:00+02:00",
  city: "Falset",
  region: "Tarragona",
  couple: "olivar",
  coverPhoto: "/fotos/olivar/historia-3.jpg",
  cardMessage:
    "Nos casamos en plena vendimia, en la bodega de la familia. Ven a brindar por nuestra mejor añada.",
  welcomeMessage:
    "Ella es enóloga y él cultiva la viña de su abuelo. Nos conocimos en una vendimia y llevamos siete cosechas juntos. Aquí tienes todo para acompañarnos.",
  thankYouMessage:
    "Gracias por brindar con nuestro vino, por pisar uva con nosotros y por quedaros hasta el último trago. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Ermita de Sant Pere de les Vinyes",
      kind: "Ceremonia",
      address: "Camí de la Ermita, s/n",
      note: "Entre viñas y olivos, a las afueras de Falset. Hay aparcamiento junto a la ermita.",
      photo: "ermitaOlivos",
    },
    {
      id: "finca",
      name: "Celler Mas de l'Àvia",
      kind: "Aperitivo, comida y fiesta",
      address: "Carretera de Gratallops, km 3",
      note: "A 10 minutos de la ermita. Haremos una visita a la bodega antes de comer.",
      photo: "patioOlivos",
    },
  ],
  climate: [26, 14, 15],
  program: [
    [
      "13:00",
      "Ceremonia",
      "iglesia",
      "Sant Pere de les Vinyes",
      "Con la uva recién cogida en el altar.",
      "ceremony",
    ],
    [
      "14:00",
      "Aperitivo",
      "finca",
      "Entre las barricas",
      "Vino joven, embutidos de la comarca y una pisada de uva.",
      "cocktail",
    ],
    [
      "15:30",
      "Comida",
      "finca",
      "El patio de la masía",
      "Comida larga, con el menú que elijas al confirmar y un vino para cada plato.",
      "banquet",
    ],
    [
      "19:00",
      "Fiesta",
      "finca",
      "Hasta la última botella",
      "Barra libre y baile. Se abre la añada de la boda.",
      "party",
    ],
  ],
  busRoutes: [
    [
      "tarragona",
      "Tarragona → Falset",
      "Plaça Imperial Tarraco, Tarragona",
      "11:30",
      ["21:00", "01:30"],
      50,
    ],
    ["reus", "Reus → Falset", "Estación de tren, Reus", "11:45", ["01:30"], 30],
  ],
  menu: {
    carne: "Conejo con caracoles y alioli",
    pescado: "Romesco de pescado de la costa",
    vegetariano: "Calçots asados y escalivada",
    vegano: "Arroz de setas del Priorat",
  },
  dressCode: {
    title: "Vendimia elegante",
    detail: "Vino, oro y verde botella. Hay tierra entre las viñas: mejor tacón ancho.",
    palette: [
      { name: "Vino", hex: "#5e1a2b" },
      { name: "Dorado", hex: "#b3924a" },
      { name: "Verde botella", hex: "#243a2e" },
      { name: "Etiqueta", hex: "#f4efe2" },
    ],
    examples: [
      "Vestido midi en tonos vino o verde; tacón ancho o cuña.",
      "Traje en tonos tierra; la corbata, opcional.",
      "Ropa cómoda que se pueda manchar: habrá pisada de uva para ellos.",
    ],
  },
  accommodation: [
    [
      "Hotel Plaça del Priorat",
      "En el centro de Falset, a 5 min de la ermita",
      "Habitaciones reservadas hasta el 1 de agosto. Menciona la boda.",
    ],
    ["Mas de les Oliveres", "A 5 min de la bodega", "Casa rural entre viñas, ideal para grupos."],
  ],
  story: {
    intro: "Una vendimia, un depósito de vino y siete cosechas. Esta es la versión corta.",
    moments: [
      [
        "2020",
        "La vendimia",
        "Ella vino a hacer prácticas y él le enseñó a cortar racimos. Se cortó un dedo y él la llevó al médico.",
        "olivos",
      ],
      [
        "2022",
        "El primer vino",
        "Lo hicimos juntos con la uva de la viña vieja. Salieron 300 botellas; quedan dos.",
        "terraza",
      ],
      [
        "2026",
        "La pedida",
        "En la bodega, con el anillo atado al cuello de una botella de aquella añada.",
        "anilloMuro",
      ],
      [
        "Hoy",
        "Y ahora, la boda",
        "Vivimos en la masía, entre viñas y olivos. Solo faltáis vosotros.",
        "olivar",
      ],
    ],
  },
  gifts: [
    [
      "Nuestro viaje a Burdeos",
      "Bodegas, castillos y mucho vino. Cualquier aportación nos acerca.",
      "Lo que queráis",
    ],
    ["Una barrica de roble", "Para la añada de la boda.", "450 €"],
    ["Copas de cristal fino", "Doce, para las catas en casa.", "180 €"],
    ["Una cepa con vuestro nombre", "La plantaremos en la viña nueva.", "50 €"],
  ],
  kids: "Habrá monitores, pisada de uva y comida para ellos.",
  faq: [
    "¿Hay que beber vino?",
    "Claro que no. Habrá mosto, cerveza, refrescos y agua de la masía.",
  ],
  guestbook: [
    ["Los de la cooperativa", "Este año la vendimia la hacemos sin vosotros. Solo este año."],
    ["La iaia Teresa", "Siete cosechas esperando esta. Que sea la mejor."],
    ["Anna i Jordi", "Llevamos sacacorchos de repuesto, por si acaso."],
  ],
  songs: ["Red Red Wine", "Vino tinto", "Mediterráneo", "La flaca", "September", "Valerie"],
});

export const tarot = wedding({
  id: "evt-demo-abril-oscar",
  first: "Abril",
  second: "Óscar",
  date: "2027-11-20T19:00:00+01:00",
  rsvpDeadline: "2027-10-12T23:59:00+02:00",
  city: "Cedeira",
  region: "A Coruña",
  couple: "mar",
  coverPhoto: "/fotos/buganvilla/historia-3.jpg",
  cardMessage: "Las cartas lo dijeron antes que nosotros: nos casamos. Ven a ver cómo se cumple.",
  welcomeMessage:
    "Ella ilustra barajas y él cuenta leyendas de la costa en un museo. Nos conocimos en una feria, cuando ella le echó las cartas por broma. Aquí tienes todo para acompañarnos.",
  thankYouMessage:
    "Gracias por venir al fin del mundo, por la queimada y por cada conjuro bien dicho. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia de Santa María do Mar",
      kind: "Ceremonia",
      address: "Rúa do Porto, 4",
      note: "Junto al puerto. Llegad con tiempo y paraguas: aquí llueve sin avisar.",
      photo: "iglesia",
    },
    {
      id: "finca",
      name: "Pazo das Meigas",
      kind: "Cóctel, cena y fiesta",
      address: "Lugar de Montoxo, 9",
      note: "A 15 minutos del puerto, mirando a la ría. Los autobuses salen al terminar.",
      photo: "pista",
    },
  ],
  climate: [14, 8, 60],
  program: [
    [
      "19:00",
      "Ceremonia",
      "iglesia",
      "Santa María do Mar",
      "Con gaita y a la luz de las velas.",
      "ceremony",
    ],
    ["20:15", "Cóctel", "finca", "La galería del pazo", "Pulpo, percebes y albariño.", "cocktail"],
    [
      "21:45",
      "Cena",
      "finca",
      "El salón de piedra",
      "Cena con el menú que elijas al confirmar.",
      "banquet",
    ],
    [
      "00:00",
      "Fiesta",
      "finca",
      "Queimada y baile",
      "Conjuro a medianoche y barra libre después.",
      "party",
    ],
  ],
  busRoutes: [
    [
      "coruna",
      "A Coruña → Cedeira",
      "Plaza de Pontevedra, A Coruña",
      "17:30",
      ["02:00", "04:30"],
      50,
    ],
    ["ferrol", "Ferrol → Cedeira", "Estación de tren, Ferrol", "18:00", ["04:30"], 30],
  ],
  menu: {
    carne: "Ternera gallega asada con castañas",
    pescado: "Rodaballo con ajada",
    vegetariano: "Empanada de verduras y queso de tetilla",
    vegano: "Caldo gallego de verduras y empanada de setas",
  },
  dressCode: {
    title: "Noche de meigas",
    detail: "Violeta, oro y ciruela. Noviembre en Galicia: abrigo y paraguas.",
    palette: [
      { name: "Violeta", hex: "#1c1630" },
      { name: "Oro", hex: "#d3ad5a" },
      { name: "Ciruela", hex: "#5c2f5a" },
      { name: "Marfil", hex: "#f1e7d0" },
    ],
    examples: [
      "Vestido largo en tonos oscuros y un buen abrigo.",
      "Traje oscuro; la capa, si os atrevéis.",
      "Ropa de abrigo y botas de agua.",
    ],
  },
  accommodation: [
    [
      "Hotel A Ría",
      "En el puerto, a 2 min de la iglesia",
      "Habitaciones reservadas hasta el 1 de octubre. Menciona la boda.",
    ],
    ["Casa rural O Faro", "A 10 min del pazo", "Con chimenea, para los días de lluvia."],
  ],
  story: {
    intro: "Una baraja, una feria y una carta que salió dos veces. Esta es la versión corta.",
    moments: [
      [
        "2018",
        "Los enamorados",
        "Ella le echó las cartas en una feria por broma. Salieron Los enamorados. Dos veces.",
        "cala",
      ],
      [
        "2021",
        "La costa da Morte",
        "Un mes en furgoneta buscando leyendas de faro en faro. Él las contaba y ella las dibujaba.",
        "furgoneta",
      ],
      [
        "2026",
        "La pedida",
        "En una barca frente a San Andrés de Teixido. Dicen que quien no va de vivo, va de muerto.",
        "anilloBarca",
      ],
      [
        "Hoy",
        "Y ahora, la boda",
        "Vivimos en Cedeira, con una baraja nueva a medio pintar. Solo faltáis vosotros.",
        "orilla",
      ],
    ],
  },
  gifts: [
    [
      "Nuestro viaje a Irlanda",
      "Más leyendas, más faros y más lluvia. Cualquier aportación nos acerca.",
      "Lo que queráis",
    ],
    ["Un juego de pinceles finos", "Para la baraja que Abril aún no ha terminado.", "120 €"],
    ["Unas cuncas para la queimada", "Con su pote de barro, para las noches de San Juan.", "70 €"],
    ["Una lámpara de lectura", "Para los libros de leyendas de Óscar.", "90 €"],
  ],
  kids: "Habrá monitores, cuentacuentos y cena para ellos.",
  faq: [
    "¿Y si llueve?",
    "Lloverá, es Galicia en noviembre. Todo es bajo techo, salvo el conjuro (que también se puede hacer dentro).",
  ],
  guestbook: [
    ["Uxía e Brais", "As cartas non mentían. Parabéns!"],
    ["La avoa Carmiña", "Haberlas, haylas. Y vosotros, a ser felices."],
    ["Los del museo", "Ya tenemos la leyenda de vuestra boda escrita."],
  ],
  songs: ["Magic", "Rumore", "A Rianxeira", "La flaca", "September", "Valerie"],
});

export const arcade = wedding({
  id: "evt-demo-leire-marc",
  first: "Leire",
  second: "Marc",
  date: "2027-07-03T19:00:00+02:00",
  rsvpDeadline: "2027-05-25T23:59:00+02:00",
  city: "Getxo",
  region: "Bizkaia",
  couple: "mar",
  coverPhoto: "/fotos/buganvilla/historia-2.jpg",
  cardMessage:
    "Jugador 2 se ha unido a la partida. Nos casamos y tú tienes una vida extra para venir.",
  welcomeMessage:
    "Nos conocimos en un salón recreativo, peleando por el récord de la misma máquina. Ella hace videojuegos y él los arregla. Aquí tienes todo para acompañarnos.",
  thankYouMessage:
    "Gracias por jugar con nosotros, por batir récords en la fiesta y por bailar hasta el game over. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Palacio Itsasoa",
      kind: "Ceremonia",
      address: "Paseo de las Grandes Villas, 15",
      note: "Civil, en el jardín del palacio. Hay aparcamiento en el puerto viejo.",
      photo: "terrazaMar",
    },
    {
      id: "finca",
      name: "Antiguo salón Neón",
      kind: "Cena y fiesta",
      address: "Calle del Puerto Viejo, 4",
      note: "A 5 minutos a pie del palacio. Las máquinas son gratis toda la noche.",
      photo: "pista",
    },
  ],
  climate: [24, 15, 30],
  program: [
    [
      "19:00",
      "Ceremonia",
      "iglesia",
      "Jardín del palacio",
      "Pulsad start: empieza la partida.",
      "ceremony",
    ],
    [
      "20:00",
      "Cóctel",
      "iglesia",
      "La terraza del mar",
      "Txakoli, pintxos y la puesta de sol sobre el Abra.",
      "cocktail",
    ],
    [
      "21:30",
      "Cena",
      "finca",
      "El salón Neón",
      "Cena con el menú que elijas al confirmar.",
      "banquet",
    ],
    [
      "00:00",
      "Fiesta",
      "finca",
      "Hasta el game over",
      "Barra libre, música de 8 bits y torneo de recreativas.",
      "party",
    ],
  ],
  busRoutes: [
    ["bilbao", "Bilbao → Getxo", "Plaza Moyúa, Bilbao", "18:00", ["02:30", "04:30"], 50],
    ["donostia", "Donostia → Getxo", "Estación de autobuses, Donostia", "17:00", ["04:30"], 30],
  ],
  menu: {
    carne: "Carrilleras al vino tinto con puré",
    pescado: "Bacalao a la vizcaína",
    vegetariano: "Pimientos rellenos de hongos",
    vegano: "Porrusalda con verduras de temporada",
  },
  dressCode: {
    title: "Neón elegante",
    detail: "Un toque de magenta, cian o amarillo sobre fondo oscuro. Se baila: calzado cómodo.",
    palette: [
      { name: "Magenta", hex: "#ff3d81" },
      { name: "Cian", hex: "#37d5d6" },
      { name: "Amarillo", hex: "#ffd23f" },
      { name: "Azul noche", hex: "#12122b" },
    ],
    examples: [
      "Vestido oscuro con un detalle de color neón; zapatillas permitidas.",
      "Traje oscuro con calcetines o corbata de color.",
      "Ropa cómoda: tendrán su propio torneo.",
    ],
  },
  accommodation: [
    [
      "Hotel Puerto Viejo",
      "A 3 min del palacio",
      "Habitaciones reservadas hasta el 15 de mayo. Menciona la boda.",
    ],
    ["Apartamentos Ereaga", "Frente a la playa", "Para alargar el fin de semana."],
  ],
  story: {
    intro: "Una máquina recreativa, un récord y muchas monedas. Esta es la versión corta.",
    moments: [
      [
        "2017",
        "El récord",
        "Ella tenía el récord de la máquina; él se lo quitó; ella lo recuperó al día siguiente. Así seis meses.",
        "cala",
      ],
      [
        "2020",
        "La ruta de los salones",
        "Un verano en furgoneta buscando salones recreativos antiguos. Encontramos catorce.",
        "furgoneta",
      ],
      [
        "2026",
        "La pedida",
        "Él escribió «¿TE CASAS?» en la tabla de récords. Ella contestó con tres letras: «SÍ».",
        "anilloBarca",
      ],
      [
        "Hoy",
        "Y ahora, la boda",
        "Vivimos en Getxo, con dos máquinas en el salón. Solo faltáis vosotros.",
        "orilla",
      ],
    ],
  },
  gifts: [
    [
      "Nuestro viaje a Tokio",
      "Los salones de Akihabara nos esperan. Cualquier aportación nos acerca.",
      "Lo que queráis",
    ],
    ["Una máquina recreativa restaurada", "La tercera del salón.", "900 €"],
    ["Una consola antigua", "Para la colección de Marc.", "150 €"],
    ["Un sofá para jugar", "El nuestro ya tiene la forma de los dos.", "600 €"],
  ],
  kids: "Habrá monitores, máquinas para ellos y cena.",
  faq: ["¿Las máquinas son gratis?", "Sí, toda la noche. El récord de la boda tiene premio."],
  guestbook: [
    ["Los del salón", "Os guardamos la máquina de siempre. Récord nuevo o no hay boda."],
    ["Amona Begoña", "No entiendo nada de esas maquinitas, pero os quiero mucho."],
    ["Aitor y Júlia", "Insert coin. ¡Que viva la partida!"],
  ],
  songs: ["Pac-Man Fever", "Take On Me", "Bailando", "Mr. Brightside", "September", "Valerie"],
});

export const semillas = wedding({
  id: "evt-demo-olivia-tomas",
  first: "Olivia",
  second: "Tomás",
  date: "2027-04-17T12:30:00+02:00",
  rsvpDeadline: "2027-03-08T23:59:00+01:00",
  city: "Cabezuela del Valle",
  region: "Cáceres",
  couple: "olivar",
  coverPhoto: "/fotos/olivar/historia-1.jpg",
  cardMessage:
    "Sembramos esto hace seis años y ya ha florecido. Nos casamos con los cerezos en flor. Ven a verlo.",
  welcomeMessage:
    "Tenemos una huerta ecológica y un banco de semillas antiguas. Nos casamos en el valle, en plena floración. Aquí tienes todo para acompañarnos.",
  thankYouMessage:
    "Gracias por venir al valle, por plantar vuestra semilla y por la sobremesa entre cerezos. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Ermita de San Isidro Labrador",
      kind: "Ceremonia",
      address: "Camino de la Garganta, s/n",
      note: "A las afueras del pueblo, entre bancales. Hay aparcamiento junto a la ermita.",
      photo: "ermitaOlivos",
    },
    {
      id: "finca",
      name: "La Huerta del Valle",
      kind: "Aperitivo, comida y fiesta",
      address: "Paraje de Las Vegas, 3",
      note: "A 10 minutos de la ermita, junto al río. Los autobuses salen al terminar.",
      photo: "patioOlivos",
    },
  ],
  climate: [20, 7, 30],
  program: [
    [
      "12:30",
      "Ceremonia",
      "iglesia",
      "San Isidro Labrador",
      "Breve, con flores de la huerta.",
      "ceremony",
    ],
    [
      "13:45",
      "Aperitivo",
      "finca",
      "Entre los bancales",
      "Verduras de la huerta, queso de la Vera y pitarra.",
      "cocktail",
    ],
    [
      "15:30",
      "Comida",
      "finca",
      "Bajo los cerezos",
      "Comida larga con el menú que elijas al confirmar.",
      "banquet",
    ],
    [
      "19:00",
      "Fiesta",
      "finca",
      "Hasta que caiga la noche",
      "Barra libre y baile. Cada invitado se lleva sus semillas.",
      "party",
    ],
  ],
  busRoutes: [
    ["plasencia", "Plasencia → Valle", "Plaza Mayor, Plasencia", "11:30", ["21:00", "01:00"], 50],
    ["madrid", "Madrid → Valle", "Estación Sur, Madrid", "09:00", ["01:00"], 30],
  ],
  menu: {
    carne: "Cabrito asado con patatas revolconas",
    pescado: "Trucha del Jerte con jamón",
    vegetariano: "Pimientos de la Vera rellenos de verduras y queso",
    vegano: "Guiso de verduras de la huerta con pimentón",
  },
  dressCode: {
    title: "Primavera de huerta",
    detail: "Verde hoja, rojo amapola y tonos de papel kraft. Hay tierra: calzado cómodo.",
    palette: [
      { name: "Verde hoja", hex: "#5d7a3a" },
      { name: "Amapola", hex: "#c8452c" },
      { name: "Kraft", hex: "#ece0c5" },
      { name: "Crema", hex: "#fbf6e7" },
    ],
    examples: [
      "Vestido de flores o liso; cuña o calzado plano para la huerta.",
      "Traje ligero o chaqueta con pantalón claro; sin corbata.",
      "Ropa que se pueda manchar: habrá taller de siembra para ellos.",
    ],
  },
  accommodation: [
    [
      "Hotel Valle del Jerte",
      "En el pueblo, a 5 min de la ermita",
      "Habitaciones reservadas hasta el 1 de marzo. Menciona la boda.",
    ],
    ["Casa rural Los Cerezos", "Junto a la huerta", "Ideal para familias con niños."],
  ],
  story: {
    intro:
      "Un mercado de agricultores, un sobre de semillas y una huerta. Esta es la versión corta.",
    moments: [
      [
        "2021",
        "El mercado",
        "Ella vendía tomates antiguos y él compró todos los que quedaban. No le gustan los tomates.",
        "olivos",
      ],
      [
        "2022",
        "La ciudad",
        "Un año en Madrid, con una terraza llena de macetas. No aguantamos sin campo.",
        "terraza",
      ],
      [
        "2026",
        "La pedida",
        "Con el anillo enterrado en un bancal. Ella lo encontró al plantar las lechugas.",
        "anilloMuro",
      ],
      [
        "Hoy",
        "Y ahora, la boda",
        "Vivimos en el valle, con la huerta y el banco de semillas. Solo faltáis vosotros.",
        "olivar",
      ],
    ],
  },
  gifts: [
    [
      "Nuestro viaje a Japón",
      "A ver los cerezos de allí. Cualquier aportación nos acerca.",
      "Lo que queráis",
    ],
    ["Un invernadero pequeño", "Para que las semillas empiecen antes.", "450 €"],
    ["Herramientas de huerta", "Azadas, rastrillos y unos guantes que duren.", "120 €"],
    ["Un cerezo con vuestro nombre", "Lo plantaremos en la huerta el primer aniversario.", "60 €"],
  ],
  kids: "Habrá monitores, taller de siembra y comida para ellos.",
  faq: [
    "¿Estarán los cerezos en flor?",
    "Si la primavera acompaña, sí: mediados de abril suele ser la mejor semana.",
  ],
  guestbook: [
    ["Los del mercado", "Os llevamos los mejores tomates del puesto. Tomás, esta vez cómetelos."],
    ["La abuela Juana", "Lo que se siembra con cariño crece solo. Enhorabuena, hijos."],
    ["Nuria y Pedro", "Ya tenemos sitio en el balcón para nuestras semillas."],
  ],
  songs: ["Here Comes the Sun", "Hoy", "La flaca", "Contigo", "September", "Valerie"],
});

export const instantanea = wedding({
  id: "evt-demo-carla-hugo",
  first: "Carla",
  second: "Hugo",
  date: "2027-09-11T18:00:00+02:00",
  rsvpDeadline: "2027-07-31T23:59:00+02:00",
  city: "Cadaqués",
  region: "Girona",
  couple: "mar",
  coverPhoto: "/fotos/buganvilla/portada.jpg",
  cardMessage:
    "Llevamos ocho años haciéndonos fotos. Nos falta la más importante, y queremos que salgas en ella.",
  welcomeMessage:
    "Ella hace las fotos y él sale movido en todas. Nos casamos junto al mar y aquí está todo lo que necesitas para la foto de grupo.",
  thankYouMessage:
    "Gracias por salir en la foto, por los bailes y por las instantáneas del fotomatón. Aquí están todas, sin retocar.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia de Santa Maria",
      kind: "Ceremonia",
      address: "Carrer Església, s/n",
      note: "En lo alto del pueblo; se sube andando por las calles empedradas. Calzado cómodo.",
      photo: "ermitaMar",
    },
    {
      id: "finca",
      name: "Mas de les Oliveres",
      kind: "Aperitivo, cena y fiesta",
      address: "Camí de Portlligat, 9",
      note: "A 5 minutos en autobús, sobre la cala. Hay fotomatón con carrete para todos.",
      photo: "terrazaMar",
    },
  ],
  climate: [26, 18, 10],
  program: [
    ["18:00", "Ceremonia", "iglesia", "Santa Maria", "Breve y con vistas a la bahía.", "ceremony"],
    [
      "19:15",
      "Aperitivo",
      "finca",
      "En la terraza",
      "Anchoas, vermut y la hora dorada para las fotos.",
      "cocktail",
    ],
    [
      "21:00",
      "Cena",
      "finca",
      "Bajo las guirnaldas",
      "Con el menú que elijas al confirmar.",
      "banquet",
    ],
    [
      "23:30",
      "Fiesta",
      "finca",
      "Hasta que se acabe el carrete",
      "Barra libre, baile y fotomatón.",
      "party",
    ],
  ],
  busRoutes: [
    [
      "figueres",
      "Figueres → Cadaqués",
      "Estación de tren, Figueres",
      "16:45",
      ["01:30", "03:30"],
      50,
    ],
    ["barcelona", "Barcelona → Cadaqués", "Estació del Nord, Barcelona", "15:00", ["03:30"], 30],
  ],
  menu: {
    carne: "Suquet de ternera con setas",
    pescado: "Suquet de rape y gambas",
    vegetariano: "Arroz de verduras de la huerta",
    vegano: "Escalivada con romesco y pan de coca",
  },
  dressCode: {
    title: "Verano en película",
    detail: "Colores suaves que salgan bien en foto: crema, coral, azul empolvado. Sin blanco.",
    palette: [
      { name: "Crema", hex: "#f3e7d3" },
      { name: "Coral", hex: "#e07a5f" },
      { name: "Azul empolvado", hex: "#9fb4c7" },
      { name: "Óxido", hex: "#a3402a" },
    ],
    examples: [
      "Vestido de lino o de flores pequeñas; sandalia plana para las cuestas.",
      "Camisa clara y pantalón de lino; chaqueta opcional.",
      "Ropa fresca: habrá juegos en el jardín y cámaras para ellos.",
    ],
  },
  accommodation: [
    [
      "Hotel Llané Petit",
      "En la playa, a 5 min de la iglesia",
      "Habitaciones reservadas hasta el 15 de julio.",
    ],
    ["Apartamentos Portlligat", "Junto a la finca", "Para grupos; se llega andando a la cena."],
  ],
  story: {
    intro:
      "Un carrete olvidado, una cámara prestada y ocho años de fotos. Esta es la versión corta.",
    moments: [
      [
        "2019",
        "El carrete",
        "Hugo se dejó la cámara en un bar. Carla la devolvió con un carrete entero de fotos suyas.",
        "cala",
      ],
      [
        "2021",
        "La furgoneta",
        "Un verano entero por la costa, con dos cámaras y un mapa.",
        "furgoneta",
      ],
      [
        "2026",
        "La pedida",
        "En una barca, a la hora dorada. La foto salió movida, como siempre.",
        "anilloBarca",
      ],
      ["Hoy", "Y ahora, la boda", "Falta la foto de grupo. Y sales tú.", "orilla"],
    ],
  },
  gifts: [
    [
      "Nuestro viaje a Islandia",
      "A fotografiar auroras. Cualquier aportación nos acerca.",
      "Lo que queráis",
    ],
    ["Una cámara de las de antes", "Para el álbum de la familia que viene.", "320 €"],
    ["Revelar todas las fotos de la boda", "En papel, para tocarlas.", "150 €"],
    ["Un marco grande para el salón", "Para la foto de grupo, claro.", "90 €"],
  ],
  kids: "Habrá monitores, cámaras de juguete y cena para ellos.",
  faq: ["¿Puedo hacer fotos en la ceremonia?", "Mejor no: la haremos nosotros y os la mandaremos."],
  guestbook: [
    [
      "Los del laboratorio",
      "Os guardamos un carrete del bueno. Que salgáis enfocados por una vez.",
    ],
    ["Iaia Montse", "Las fotos de mi nieta son las más bonitas del mundo. Y este chico, también."],
    ["Ona y Biel", "Prometemos no salir con los ojos cerrados."],
  ],
  songs: [
    "Photograph",
    "Mediterráneo",
    "Golden Hour",
    "La foto de los dos",
    "September",
    "Valerie",
  ],
});

export const abanico = wedding({
  id: "evt-demo-inma-curro",
  first: "Inma",
  second: "Curro",
  date: "2027-04-24T19:00:00+02:00",
  rsvpDeadline: "2027-03-15T23:59:00+01:00",
  city: "Sevilla",
  region: "Sevilla",
  couple: "olivar",
  coverPhoto: "/fotos/olivar/portada.jpg",
  cardMessage:
    "Nos conocimos bailando la cuarta sevillana y desde entonces no hemos parado. Ven a bailar con nosotros.",
  welcomeMessage:
    "Nos casamos en primavera, con azahar en las calles y la feria a la vuelta de la esquina. Aquí tienes todo para acompañarnos.",
  thankYouMessage:
    "Gracias por bailar hasta el final, por los abanicos al aire y por las sevillanas a las cinco de la mañana. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Parroquia de Santa Ana",
      kind: "Ceremonia",
      address: "Calle Pureza, 80, Triana",
      note: "En pleno barrio de Triana. Recomendamos venir en taxi: no hay dónde aparcar.",
      photo: "iglesia",
    },
    {
      id: "finca",
      name: "Hacienda Los Naranjos",
      kind: "Aperitivo, cena y fiesta",
      address: "Carretera de Dos Hermanas, km 4",
      note: "A 20 minutos; los autobuses salen al terminar la ceremonia.",
      photo: "cortijo",
    },
  ],
  climate: [25, 12, 15],
  program: [
    ["19:00", "Ceremonia", "iglesia", "Santa Ana", "Con coro rociero a la salida.", "ceremony"],
    [
      "20:30",
      "Aperitivo",
      "finca",
      "En el patio de los naranjos",
      "Jamón, manzanilla y cortador en directo.",
      "cocktail",
    ],
    [
      "22:00",
      "Cena",
      "finca",
      "Bajo los farolillos",
      "Con el menú que elijas al confirmar.",
      "banquet",
    ],
    [
      "00:30",
      "Fiesta",
      "finca",
      "Caseta propia",
      "Barra libre, sevillanas y lo que pinche el DJ.",
      "party",
    ],
  ],
  busRoutes: [
    ["centro", "Sevilla centro → Hacienda", "Puerta de Jerez", "20:00", ["03:00", "06:00"], 55],
    ["triana", "Triana → Hacienda", "Plaza del Altozano", "20:00", ["06:00"], 30],
  ],
  menu: {
    carne: "Presa ibérica con patatas a lo pobre",
    pescado: "Lubina a la sal con ajo blanco",
    vegetariano: "Espinacas con garbanzos y huevo poché",
    vegano: "Berenjenas con miel de caña (sin miel) y salmorejo",
  },
  dressCode: {
    title: "Primavera en Sevilla",
    detail: "Colores de azahar y de mantón: crema, rojo, verde naranjo. Se baila mucho.",
    palette: [
      { name: "Rojo mantón", hex: "#9b1d2c" },
      { name: "Crema encaje", hex: "#f4e7d6" },
      { name: "Verde naranjo", hex: "#4f6b3a" },
      { name: "Albero", hex: "#d9a441" },
    ],
    examples: [
      "Vestido de flores o de lunares; abanico y cuña para bailar.",
      "Traje claro, corbata alegre; la chaqueta se puede quitar en la caseta.",
      "Traje de flamenca bienvenido; habrá clase de sevillanas para ellos.",
    ],
  },
  accommodation: [
    [
      "Hotel Triana Río",
      "Junto a la iglesia",
      "Habitaciones reservadas hasta el 1 de marzo. Menciona la boda.",
    ],
    ["Casa Patio de Santa Cruz", "En el centro, cerca del autobús", "Ideal para grupos de amigos."],
  ],
  story: {
    intro: "Una caseta, una cuarta sevillana y un abanico perdido. Esta es la versión corta.",
    moments: [
      [
        "2019",
        "La feria",
        "Ella perdió el abanico bailando; él lo encontró y tardó un año en devolverlo.",
        "olivos",
      ],
      ["2021", "El barrio", "Un piso en Triana con un balcón lleno de geranios.", "terraza"],
      [
        "2026",
        "La pedida",
        "En la Hacienda, bajo un naranjo en flor, con el abanico de vuelta en una caja.",
        "anilloMuro",
      ],
      ["Hoy", "Y ahora, la boda", "Solo falta que bailes con nosotros.", "olivar"],
    ],
  },
  gifts: [
    ["Nuestro viaje a México", "Cualquier aportación nos acerca.", "Lo que queráis"],
    ["Un mantón de Manila bordado", "Para colgarlo en el salón.", "280 €"],
    ["Clases de baile para los dos", "Por si algún día aprendemos la quinta.", "150 €"],
    ["Una vajilla de Cartuja", "La de toda la vida.", "220 €"],
  ],
  kids: "Habrá monitores, clase de sevillanas y cena para ellos.",
  faq: ["¿Hay que saber bailar sevillanas?", "No: a medianoche hay una clase exprés para todos."],
  guestbook: [
    ["Las de la academia", "Os tenemos preparada la cuarta. Ensayad un poco, que se nota."],
    ["Abuela Rocío", "Qué bonitos vais a ir. Llevaos el abanico, que hace calor."],
    ["Pepe y Sara", "Nos pedimos la primera sevillana con los novios."],
  ],
  songs: [
    "Sevilla tiene un color especial",
    "Algo se muere en el alma",
    "Volando voy",
    "Bulería",
    "Valerie",
    "September",
  ],
});

export const cerillas = wedding({
  id: "evt-demo-marta-quique",
  first: "Marta",
  second: "Quique",
  date: "2027-10-16T13:00:00+02:00",
  rsvpDeadline: "2027-09-10T23:59:00+02:00",
  city: "Logroño",
  region: "La Rioja",
  couple: "olivar",
  coverPhoto: "/fotos/olivar/historia-2.jpg",
  cardMessage:
    "Saltó la chispa en un concierto y no se ha apagado. Ven a la boda, que la vamos a encender del todo.",
  welcomeMessage:
    "Nos casamos en plena vendimia, entre viñas y calados. Aquí tienes todo lo que hace falta para que la fiesta no se apague.",
  thankYouMessage:
    "Gracias por mantener la fiesta encendida hasta el amanecer. Aquí están vuestras fotos, con humo y todo.",
  venues: [
    {
      id: "iglesia",
      name: "Concatedral de Santa María de la Redonda",
      kind: "Ceremonia",
      address: "Calle Portales, 14",
      note: "En el casco antiguo. Hay parking en la calle Bretón de los Herreros.",
      photo: "iglesia",
    },
    {
      id: "finca",
      name: "Bodega El Calado",
      kind: "Aperitivo, comida y fiesta",
      address: "Camino de la Grajera, 7",
      note: "A 15 minutos, entre viñas. Los autobuses salen al terminar la ceremonia.",
      photo: "pista",
    },
  ],
  climate: [19, 8, 25],
  program: [
    ["13:00", "Ceremonia", "iglesia", "La Redonda", "Breve, con órgano y campanas.", "ceremony"],
    [
      "14:15",
      "Aperitivo",
      "finca",
      "En el calado",
      "Pinchos de la calle Laurel y vino de la casa.",
      "cocktail",
    ],
    [
      "16:00",
      "Comida",
      "finca",
      "Entre barricas",
      "Con el menú que elijas al confirmar.",
      "banquet",
    ],
    [
      "19:30",
      "Fiesta",
      "finca",
      "Con hoguera en las viñas",
      "Barra libre, concierto y baile.",
      "party",
    ],
  ],
  busRoutes: [
    ["centro", "Logroño → Bodega", "Plaza del Ayuntamiento", "13:45", ["22:00", "02:00"], 55],
    ["haro", "Haro → Logroño", "Estación de Haro", "11:30", ["02:00"], 30],
  ],
  menu: {
    carne: "Chuletillas al sarmiento con pimientos",
    pescado: "Bacalao a la riojana",
    vegetariano: "Patatas a la riojana sin chorizo, con setas",
    vegano: "Pochas con verduras de la huerta",
  },
  dressCode: {
    title: "Otoño en las viñas",
    detail: "Rojo vino, azul noche, crema y teja. Se camina por tierra: tacón ancho o plano.",
    palette: [
      { name: "Azul etiqueta", hex: "#1f2433" },
      { name: "Rojo cerilla", hex: "#a82d1d" },
      { name: "Cartón", hex: "#e0d1b3" },
      { name: "Teja", hex: "#b5652e" },
    ],
    examples: [
      "Vestido de otoño y una chaqueta para la hoguera.",
      "Traje oscuro o americana de pana; la corbata, opcional.",
      "Ropa abrigada: habrá castañas y bengalas (con monitores).",
    ],
  },
  accommodation: [
    [
      "Hotel Calle Mayor",
      "En el casco antiguo",
      "Habitaciones reservadas hasta el 1 de septiembre.",
    ],
    ["Casa rural Las Viñas", "Junto a la bodega", "Para quien quiera quedarse a la hoguera."],
  ],
  story: {
    intro:
      "Un concierto, un mechero que no funcionaba y una caja de cerillas. Esta es la versión corta.",
    moments: [
      [
        "2018",
        "El concierto",
        "Ella pidió fuego; él solo tenía una caja de cerillas de un bar. Aún la guardamos.",
        "terraza",
      ],
      [
        "2021",
        "La vendimia",
        "Primer otoño juntos cortando uva en la viña de su abuelo.",
        "olivos",
      ],
      [
        "2026",
        "La pedida",
        "En la bodega, con el anillo dentro de una caja de cerillas. Casi lo tira.",
        "anilloMuro",
      ],
      ["Hoy", "Y ahora, la boda", "Falta encender la fiesta. Contigo.", "olivar"],
    ],
  },
  gifts: [
    ["Nuestro viaje a Japón", "Cualquier aportación nos acerca.", "Lo que queráis"],
    ["Una chimenea para casa", "Para los inviernos de Logroño.", "450 €"],
    ["Un tocadiscos", "El de los conciertos de siempre.", "180 €"],
    ["Una barrica con nuestro nombre", "Para abrirla en el primer aniversario.", "120 €"],
  ],
  kids: "Habrá monitores, castañas y comida para ellos.",
  faq: ["¿Hace frío en la bodega?", "Dentro no; fuera, al caer la tarde, sí. Trae una chaqueta."],
  guestbook: [
    ["Los del bar de la calle Laurel", "Os guardamos una caja de cerillas de recuerdo."],
    ["Aitona Ramón", "En mi viña se conocieron de verdad. Enhorabuena, chavales."],
    ["Leire y Jon", "Que no se apague nunca. ¡Y que dure la hoguera!"],
  ],
  songs: [
    "Light My Fire",
    "Fuego",
    "Ojalá que llueva café",
    "September",
    "Valerie",
    "Mr. Brightside",
  ],
});

export const galleta = wedding({
  id: "evt-demo-ines-bruno",
  first: "Inés",
  second: "Bruno",
  date: "2027-06-19T18:30:00+02:00",
  rsvpDeadline: "2027-05-10T23:59:00+02:00",
  city: "El Saler",
  region: "Valencia",
  couple: "mar",
  coverPhoto: "/fotos/buganvilla/historia-2.jpg",
  cardMessage:
    "La galleta de la suerte de nuestra primera cena decía «Muy pronto, una gran celebración». Tenía razón.",
  welcomeMessage:
    "Nos conocimos en un restaurante pequeño y desde entonces leemos juntos todas las fortunas. Aquí tienes la nuestra.",
  thankYouMessage:
    "Gracias por venir a cumplir la profecía. Aquí están vuestras fotos, con galleta incluida.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia de San Juan del Hospital",
      kind: "Ceremonia",
      address: "Calle Trinquete de Caballeros, 5",
      note: "En el centro de Valencia, junto al Mercado Central. Mejor venir en metro.",
      photo: "iglesia",
      city: "Valencia",
    },
    {
      id: "finca",
      name: "Alquería del Mar",
      kind: "Aperitivo, cena y fiesta",
      address: "Camí del Palmar, 12",
      note: "A 20 minutos, entre arrozales y la playa. Los autobuses salen al terminar.",
      photo: "terrazaMar",
    },
  ],
  climate: [29, 20, 5],
  program: [
    [
      "18:30",
      "Ceremonia",
      "iglesia",
      "San Juan del Hospital",
      "Breve, con cuarteto de cuerda.",
      "ceremony",
    ],
    [
      "19:45",
      "Aperitivo",
      "finca",
      "Junto a los arrozales",
      "Horchata, esgarraet y la puesta de sol.",
      "cocktail",
    ],
    ["21:30", "Cena", "finca", "En el jardín", "Con el menú que elijas al confirmar.", "banquet"],
    [
      "00:00",
      "Fiesta",
      "finca",
      "Hasta que salga el sol",
      "Barra libre, baile y galletas de la suerte.",
      "party",
    ],
  ],
  busRoutes: [
    ["centro", "Valencia → Alquería", "Plaza del Ayuntamiento", "19:15", ["02:00", "05:00"], 55],
    ["playa", "La Malvarrosa → Alquería", "Paseo Marítimo", "19:00", ["05:00"], 30],
  ],
  menu: {
    carne: "Arroz al horno con costilla",
    pescado: "Arroz a banda con alioli",
    vegetariano: "Paella de verduras de la huerta",
    vegano: "All i pebre de verduras con boniato",
  },
  dressCode: {
    title: "Noche de verano",
    detail: "Colores alegres y ligeros. Hay arena cerca: sandalia o alpargata.",
    palette: [
      { name: "Rojo laca", hex: "#a8241c" },
      { name: "Galleta", hex: "#e0a65a" },
      { name: "Arroz", hex: "#fbf3e6" },
      { name: "Verde arrozal", hex: "#6b8a4a" },
    ],
    examples: [
      "Vestido de verano; alpargata para el jardín.",
      "Camisa de lino y pantalón claro.",
      "Ropa fresca: habrá juegos y piscina pequeña para ellos.",
    ],
  },
  accommodation: [
    [
      "Hotel Mercat",
      "En el centro, a 3 min de la iglesia",
      "Habitaciones reservadas hasta el 1 de mayo.",
    ],
    ["Apartamentos El Saler", "Junto a la playa", "Ideal para quedarse el domingo."],
  ],
  story: {
    intro: "Una cena, una galleta y una fortuna que acertó. Esta es la versión corta.",
    moments: [
      [
        "2020",
        "La galleta",
        "«Muy pronto, una gran celebración». Nos reímos mucho. Seis años después, aquí estamos.",
        "cala",
      ],
      [
        "2022",
        "La furgoneta",
        "Un verano entero buscando el mejor arroz de la costa.",
        "furgoneta",
      ],
      [
        "2026",
        "La pedida",
        "El anillo, dentro de una galleta de la suerte. Casi se lo come.",
        "anilloBarca",
      ],
      ["Hoy", "Y ahora, la boda", "Solo falta que la fortuna te traiga a la fiesta.", "orilla"],
    ],
  },
  gifts: [
    ["Nuestro viaje a Japón", "Cualquier aportación nos acerca.", "Lo que queráis"],
    ["Una paellera de las grandes", "Para las comidas de los domingos.", "90 €"],
    ["Clases de cocina para dos", "Para dejar de pedir a domicilio.", "160 €"],
    ["Una vajilla para doce", "Porque los domingos somos muchos.", "240 €"],
  ],
  kids: "Habrá monitores, piscina pequeña y cena para ellos.",
  faq: [
    "¿Habrá galletas de la suerte?",
    "Una para cada invitado, con su fortuna. Algunas aciertan.",
  ],
  guestbook: [
    ["Los del restaurante", "La galleta era nuestra. Exigimos invitación a la próxima."],
    ["Yaya Amparo", "Qué bonita la boda en verano. Llevad abanico."],
    ["Pau y Clara", "Nuestra fortuna dice que bailaremos hasta el amanecer."],
  ],
  songs: ["Lucky", "La Bamba", "Good as Hell", "September", "Valerie", "Dancing Queen"],
});

export const casete = wedding({
  id: "evt-demo-alba-dario",
  first: "Alba",
  second: "Darío",
  date: "2027-07-17T19:00:00+02:00",
  rsvpDeadline: "2027-06-07T23:59:00+02:00",
  city: "Gijón",
  region: "Asturias",
  couple: "olivar",
  coverPhoto: "/fotos/olivar/historia-2.jpg",
  cardMessage:
    "Nos conocimos grabándonos cintas en el instituto. Esta es la última, y la mejor: la de nuestra boda.",
  welcomeMessage:
    "Rebobina con nosotros: catorce años de cintas, conciertos y viajes en coche. Aquí tienes la lista de canciones del gran día.",
  thankYouMessage:
    "Gracias por cantar con nosotros hasta quedaros sin voz. Aquí están vuestras fotos, cara A y cara B.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia de San Pedro",
      kind: "Ceremonia",
      address: "Campo Valdés, s/n",
      note: "Frente a la playa de San Lorenzo. Hay parking en El Molinón.",
      photo: "iglesia",
    },
    {
      id: "finca",
      name: "Quinta La Ería",
      kind: "Aperitivo, cena y fiesta",
      address: "Camino de Cabueñes, 42",
      note: "A 15 minutos, entre prados. Los autobuses salen al terminar la ceremonia.",
      photo: "pista",
    },
  ],
  climate: [23, 15, 30],
  program: [
    [
      "19:00",
      "Ceremonia",
      "iglesia",
      "San Pedro",
      "Con la banda del instituto, reunida para la ocasión.",
      "ceremony",
    ],
    [
      "20:15",
      "Aperitivo",
      "finca",
      "En el prado",
      "Sidra escanciada, quesos y croquetas.",
      "cocktail",
    ],
    [
      "21:45",
      "Cena",
      "finca",
      "En el hórreo grande",
      "Con el menú que elijas al confirmar.",
      "banquet",
    ],
    [
      "00:00",
      "Fiesta",
      "finca",
      "Concierto y baile",
      "Barra libre y la cara B, a todo volumen.",
      "party",
    ],
  ],
  busRoutes: [
    ["centro", "Gijón → Quinta", "Plaza del Humedal", "18:30", ["02:00", "05:00"], 55],
    ["oviedo", "Oviedo → Gijón", "Estación de autobuses, Oviedo", "17:45", ["05:00"], 30],
  ],
  menu: {
    carne: "Cachopo de ternera con patatas",
    pescado: "Merluza a la sidra",
    vegetariano: "Fabada de verduras",
    vegano: "Pote de verduras de la huerta",
  },
  dressCode: {
    title: "Concierto de verano",
    detail: "Colores de cinta: crema, negro y un toque naranja. Hay prado: calzado plano.",
    palette: [
      { name: "Negro cinta", hex: "#1d1f2b" },
      { name: "Naranja", hex: "#b04a22" },
      { name: "Mostaza", hex: "#e0a63a" },
      { name: "Crema etiqueta", hex: "#f3ede2" },
    ],
    examples: [
      "Vestido o mono cómodo; algo de abrigo para la noche.",
      "Camisa y pantalón chino; la americana, opcional.",
      "Ropa cómoda: habrá karaoke infantil.",
    ],
  },
  accommodation: [
    [
      "Hotel Playa San Lorenzo",
      "Frente a la iglesia",
      "Habitaciones reservadas hasta el 1 de junio.",
    ],
    ["Casa rural La Ería", "Junto a la quinta", "Para quien quiera quedarse a la última canción."],
  ],
  story: {
    intro: "Una cinta grabada, un walkman compartido y muchas canciones. Esta es la versión corta.",
    moments: [
      [
        "2013",
        "La cinta",
        "Él le grabó una cinta con la radio. Ella se la devolvió con la cara B.",
        "terraza",
      ],
      [
        "2017",
        "Los conciertos",
        "Treinta conciertos en dos años, casi todos bajo la lluvia.",
        "olivos",
      ],
      [
        "2026",
        "La pedida",
        "En el coche, con una cinta que acababa con la pregunta.",
        "anilloMuro",
      ],
      ["Hoy", "Y ahora, la boda", "Falta la última canción. La cantamos contigo.", "olivar"],
    ],
  },
  gifts: [
    [
      "Nuestro viaje a Nueva Orleans",
      "A escuchar jazz. Cualquier aportación nos acerca.",
      "Lo que queráis",
    ],
    ["Un tocadiscos con altavoces", "Para el salón de casa.", "350 €"],
    ["Entradas para un festival", "El del verano que viene.", "180 €"],
    ["Una guitarra acústica", "Para las sobremesas largas.", "220 €"],
  ],
  kids: "Habrá monitores, karaoke y cena para ellos.",
  faq: ["¿Se pueden pedir canciones?", "Sí: al confirmar, apunta la tuya en la lista de música."],
  guestbook: [
    ["La banda del instituto", "Ensayamos el viernes. Esta vez afinados, prometido."],
    ["Güela Covadonga", "Qué ilusión. La sidra, con moderación, ¿eh?"],
    ["Nacho y Lúa", "Nos pedimos la primera balada."],
  ],
  songs: [
    "Mix Tape",
    "Maldito duende",
    "Mr. Brightside",
    "La chica de ayer",
    "September",
    "Valerie",
  ],
});

export const botella = wedding({
  id: "evt-demo-noa-leo",
  first: "Noa",
  second: "Leo",
  date: "2027-08-28T19:30:00+02:00",
  rsvpDeadline: "2027-07-20T23:59:00+02:00",
  city: "Zahara de los Atunes",
  region: "Cádiz",
  couple: "mar",
  coverPhoto: "/fotos/buganvilla/historia-4.jpg",
  cardMessage:
    "Hace diez años tiramos una botella al mar con un deseo dentro. Se cumplió, y esta es la respuesta.",
  welcomeMessage:
    "Nos casamos frente al Atlántico, con los pies en la arena. Aquí tienes todo lo que necesitas para llegar a la orilla.",
  thankYouMessage:
    "Gracias por venir hasta la orilla, por bailar descalzos y por las promesas al mar. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Playa del Carmen",
      kind: "Ceremonia",
      address: "Acceso por la calle Almadraba",
      note: "Ceremonia civil en la arena: os daremos alpargatas a la entrada.",
      photo: "ermitaMar",
    },
    {
      id: "finca",
      name: "Chiringuito La Almadraba",
      kind: "Aperitivo, cena y fiesta",
      address: "Paseo Marítimo, 2",
      note: "A 3 minutos andando por la playa. Hay parking municipal en la entrada del pueblo.",
      photo: "terrazaMar",
    },
  ],
  climate: [28, 19, 0],
  program: [
    [
      "19:30",
      "Ceremonia",
      "iglesia",
      "En la orilla",
      "Al atardecer, con los pies en la arena.",
      "ceremony",
    ],
    [
      "20:30",
      "Aperitivo",
      "finca",
      "Frente al mar",
      "Atún de almadraba y vino de Jerez.",
      "cocktail",
    ],
    [
      "22:00",
      "Cena",
      "finca",
      "Bajo las estrellas",
      "Con el menú que elijas al confirmar.",
      "banquet",
    ],
    [
      "00:30",
      "Fiesta",
      "finca",
      "Hasta el amanecer",
      "Barra libre, baile descalzo y hoguera.",
      "party",
    ],
  ],
  busRoutes: [
    ["cadiz", "Cádiz → Zahara", "Plaza de Sevilla, Cádiz", "18:00", ["02:30", "06:00"], 55],
    ["vejer", "Vejer → Zahara", "La Plazuela, Vejer", "18:45", ["06:00"], 30],
  ],
  menu: {
    carne: "Retinto a la brasa con patatas",
    pescado: "Tataki de atún rojo de almadraba",
    vegetariano: "Arroz meloso de verduras",
    vegano: "Tomates de la huerta con aceite y pan de campo",
  },
  dressCode: {
    title: "Orilla al atardecer",
    detail: "Blancos rotos, arena y azul. Ceremonia en la playa: nada de tacón fino.",
    palette: [
      { name: "Vidrio de botella", hex: "#2f6b63" },
      { name: "Arena", hex: "#e9e1cf" },
      { name: "Azul orilla", hex: "#8fc0c9" },
      { name: "Lacre", hex: "#a3402a" },
    ],
    examples: [
      "Vestido ligero y alpargata o sandalia plana.",
      "Camisa de lino; corbata, mejor no.",
      "Ropa de playa y un jersey para la noche.",
    ],
  },
  accommodation: [
    ["Hotel Atlanterra", "Junto a la playa", "Habitaciones reservadas hasta el 15 de julio."],
    ["Apartamentos La Almadraba", "En el pueblo", "Para grupos; se llega andando a todo."],
  ],
  story: {
    intro: "Una botella al mar, un deseo y diez años de mareas. Esta es la versión corta.",
    moments: [
      [
        "2017",
        "La botella",
        "Escribimos un deseo cada uno, sin enseñárnoslo, y lo tiramos al mar.",
        "cala",
      ],
      [
        "2020",
        "El viaje",
        "Una costa entera en furgoneta buscando la playa perfecta.",
        "furgoneta",
      ],
      [
        "2026",
        "La pedida",
        "En una barca, con una botella igual que aquella. Dentro, el anillo.",
        "anilloBarca",
      ],
      ["Hoy", "Y ahora, la boda", "Los dos deseos eran el mismo. Ven a verlo cumplirse.", "orilla"],
    ],
  },
  gifts: [
    ["Nuestro viaje a las Azores", "Cualquier aportación nos acerca.", "Lo que queráis"],
    ["Una tabla de surf", "Para las mañanas de levante.", "380 €"],
    ["Una lámina de la costa", "Para el salón de casa.", "120 €"],
    ["Una noche en un faro", "Para el primer aniversario.", "200 €"],
  ],
  kids: "Habrá monitores, castillos de arena y cena para ellos.",
  faq: [
    "¿Hay que ir en zapatos a la ceremonia?",
    "No: os damos alpargatas a la entrada de la playa.",
  ],
  guestbook: [
    ["Los del chiringuito", "Os guardamos la mejor mesa, la de la orilla."],
    ["Abuela Pepa", "Qué boda tan bonita. Ponte crema, que el sol de Zahara pica."],
    ["Mar y Teo", "Nuestro deseo: que dure tanto como la marea."],
  ],
  songs: ["Mediterráneo", "La playa", "Sea of Love", "September", "Valerie", "Dancing Queen"],
});

export const crucigrama = wedding({
  id: "evt-demo-sara-ivan",
  first: "Sara",
  second: "Iván",
  date: "2027-05-15T12:00:00+02:00",
  rsvpDeadline: "2027-04-05T23:59:00+02:00",
  city: "Salamanca",
  region: "Salamanca",
  couple: "olivar",
  coverPhoto: "/fotos/olivar/historia-1.jpg",
  cardMessage:
    "Nos conocimos peleándonos por el último crucigrama del periódico de la biblioteca. Ella ganó. Él sigue sin aceptarlo.",
  welcomeMessage:
    "Seis letras, horizontal: «lo que vamos a celebrar». Si lo has adivinado, aquí tienes todo lo demás.",
  thankYouMessage:
    "Gracias por resolver con nosotros el crucigrama más difícil. Aquí están vuestras fotos, sin pistas.",
  venues: [
    {
      id: "iglesia",
      name: "Clerecía de Salamanca",
      kind: "Ceremonia",
      address: "Calle Compañía, 5",
      note: "En el centro histórico. Hay parking en la plaza de Santa Eulalia.",
      photo: "iglesia",
    },
    {
      id: "finca",
      name: "Finca Los Arapiles",
      kind: "Aperitivo, comida y fiesta",
      address: "Carretera de Arapiles, km 3",
      note: "A 15 minutos, entre encinas. Los autobuses salen al terminar la ceremonia.",
      photo: "cortijo",
    },
  ],
  climate: [21, 7, 25],
  program: [
    ["12:00", "Ceremonia", "iglesia", "La Clerecía", "Con coro universitario.", "ceremony"],
    [
      "13:30",
      "Aperitivo",
      "finca",
      "Bajo las encinas",
      "Ibéricos, hornazo y vino de la tierra.",
      "cocktail",
    ],
    [
      "15:00",
      "Comida",
      "finca",
      "En el salón de la finca",
      "Con el menú que elijas al confirmar.",
      "banquet",
    ],
    [
      "18:30",
      "Fiesta",
      "finca",
      "Con tuna incluida",
      "Barra libre, baile y la tuna a las ocho.",
      "party",
    ],
  ],
  busRoutes: [
    ["centro", "Salamanca → Finca", "Plaza Mayor (calle Toro)", "13:00", ["21:00", "01:00"], 55],
    ["madrid", "Madrid → Salamanca", "Estación Sur, Madrid", "08:45", ["01:00"], 30],
  ],
  menu: {
    carne: "Lechazo asado con ensalada",
    pescado: "Bacalao confitado con pimientos",
    vegetariano: "Patatas meneás con setas",
    vegano: "Lentejas de la Armuña con verduras",
  },
  dressCode: {
    title: "Primavera en la meseta",
    detail: "Blanco y negro de periódico, con un toque de rojo. Mañana templada; tarde fresca.",
    palette: [
      { name: "Tinta", hex: "#1b1b1b" },
      { name: "Papel", hex: "#f5f3ee" },
      { name: "Lápiz rojo", hex: "#b02a2a" },
      { name: "Piedra de Villamayor", hex: "#d9b77a" },
    ],
    examples: [
      "Vestido de día; una chaqueta para la tarde.",
      "Traje gris o azul; la corbata, a elegir.",
      "Ropa cómoda: tendrán pasatiempos y juegos en el jardín.",
    ],
  },
  accommodation: [
    [
      "Hotel Plaza Mayor",
      "En el centro, a 3 min de la Clerecía",
      "Habitaciones reservadas hasta el 1 de abril.",
    ],
    ["Casa rural Arapiles", "Junto a la finca", "Para quedarse a la tuna."],
  ],
  story: {
    intro: "Una biblioteca, un periódico y un crucigrama a medias. Esta es la versión corta.",
    moments: [
      [
        "2018",
        "El crucigrama",
        "Los dos queríamos el periódico. Lo resolvimos juntos, a medias y discutiendo.",
        "olivos",
      ],
      [
        "2021",
        "La terraza",
        "Un piso con terraza y un periódico cada domingo, sin falta.",
        "terraza",
      ],
      [
        "2026",
        "La pedida",
        "En el crucigrama del domingo: once letras, «¿quieres casarte?».",
        "anilloMuro",
      ],
      ["Hoy", "Y ahora, la boda", "Falta la última palabra. La escribes con nosotros.", "olivar"],
    ],
  },
  gifts: [
    ["Nuestro viaje a Escocia", "Cualquier aportación nos acerca.", "Lo que queráis"],
    ["Una estantería para la biblioteca", "Ya no caben los libros.", "260 €"],
    ["La suscripción al periódico", "Por los crucigramas, claro.", "120 €"],
    ["Un sillón de lectura", "Para los domingos.", "340 €"],
  ],
  kids: "Habrá monitores, sopas de letras y comida para ellos.",
  faq: ["¿Habrá tuna?", "Sí, a las ocho. No hay escapatoria."],
  guestbook: [
    ["Los de la biblioteca", "Os guardamos el periódico del día. El crucigrama, sin hacer."],
    ["Abuela Charo", "Diez letras: «enhorabuena». Os quiero."],
    ["Dani y Marta", "Horizontal, cuatro letras: «baile». Nos vemos en la pista."],
  ],
  songs: ["Clavelitos", "Hoy", "Sweet Caroline", "September", "Valerie", "Mi gran noche"],
});

export const tren = wedding({
  id: "evt-demo-paula-gael",
  first: "Paula",
  second: "Gael",
  date: "2027-09-25T17:00:00+02:00",
  rsvpDeadline: "2027-08-16T23:59:00+02:00",
  city: "Canfranc",
  region: "Huesca",
  couple: "olivar",
  coverPhoto: "/fotos/olivar/historia-2.jpg",
  cardMessage:
    "Nos conocimos en un tren que llegó cuatro horas tarde. Fue el mejor retraso de nuestra vida. Sube a este, que sale puntual.",
  welcomeMessage:
    "Nos casamos en una estación de montaña, entre túneles y hayedos. Aquí tienes el billete y todos los horarios.",
  thankYouMessage:
    "Gracias por subir al tren con nosotros y por bailar en el andén. Aquí están vuestras fotos, con humo de locomotora.",
  venues: [
    {
      id: "iglesia",
      name: "Estación Internacional de Canfranc",
      kind: "Ceremonia",
      address: "Plaza Aragón, s/n",
      note: "Ceremonia civil en el vestíbulo de la estación. Hay parking en la explanada.",
      photo: "iglesia",
    },
    {
      id: "finca",
      name: "Hotel del Andén",
      kind: "Aperitivo, cena y fiesta",
      address: "Andén principal, 1",
      note: "En la misma estación: se cruza el andén andando.",
      photo: "pista",
    },
  ],
  climate: [17, 6, 35],
  program: [
    [
      "17:00",
      "Ceremonia",
      "iglesia",
      "En el vestíbulo",
      "Bajo el reloj de la estación.",
      "ceremony",
    ],
    [
      "18:15",
      "Aperitivo",
      "finca",
      "En el andén",
      "Con las montañas de fondo y vino del Somontano.",
      "cocktail",
    ],
    [
      "20:00",
      "Cena",
      "finca",
      "En el salón de los viajeros",
      "Con el menú que elijas al confirmar.",
      "banquet",
    ],
    [
      "22:30",
      "Fiesta",
      "finca",
      "Última parada: la pista",
      "Barra libre y baile hasta el último tren.",
      "party",
    ],
  ],
  busRoutes: [
    ["jaca", "Jaca → Canfranc", "Estación de autobuses, Jaca", "16:00", ["01:00", "04:00"], 55],
    ["zaragoza", "Zaragoza → Canfranc", "Estación Delicias, Zaragoza", "13:30", ["04:00"], 30],
  ],
  menu: {
    carne: "Ternasco de Aragón asado",
    pescado: "Trucha del Pirineo con jamón",
    vegetariano: "Borrajas con patata y setas",
    vegano: "Migas de pastor con verduras",
  },
  dressCode: {
    title: "Otoño en la montaña",
    detail: "Verde billete, gris piedra y crema. Hace fresco: chaqueta o chal.",
    palette: [
      { name: "Verde billete", hex: "#2f6a35" },
      { name: "Cartón", hex: "#cfe0c3" },
      { name: "Hierro", hex: "#1f2b1d" },
      { name: "Haya en otoño", hex: "#b5652e" },
    ],
    examples: [
      "Vestido de otoño y un abrigo ligero.",
      "Traje o americana de lana; corbata opcional.",
      "Ropa de abrigo: habrá tren de juguete para ellos.",
    ],
  },
  accommodation: [
    ["Hotel del Andén", "En la misma estación", "Habitaciones reservadas hasta el 1 de agosto."],
    ["Albergue Canfranc Pueblo", "A 5 minutos en coche", "Para grupos y para madrugar al monte."],
  ],
  story: {
    intro: "Un tren con cuatro horas de retraso y dos asientos juntos. Esta es la versión corta.",
    moments: [
      [
        "2019",
        "El retraso",
        "Cuatro horas parados en un túnel. Nos dio tiempo a contarnos la vida entera.",
        "olivos",
      ],
      [
        "2022",
        "La terraza",
        "Un piso con vistas a las vías, para no olvidar de dónde venimos.",
        "terraza",
      ],
      [
        "2026",
        "La pedida",
        "En el mismo tren, en el mismo túnel. Esta vez el retraso fue a propósito.",
        "anilloMuro",
      ],
      ["Hoy", "Y ahora, la boda", "Próxima estación: la nuestra. Sube.", "olivar"],
    ],
  },
  gifts: [
    ["Nuestro viaje en el Transiberiano", "Cualquier aportación nos acerca.", "Lo que queráis"],
    ["Una maqueta de tren", "Para la sobremesa de los domingos.", "180 €"],
    ["Un mapa ferroviario antiguo", "Enmarcado, para el pasillo.", "90 €"],
    ["Una noche en un coche cama", "Para el primer aniversario.", "220 €"],
  ],
  kids: "Habrá monitores, un tren de juguete y cena para ellos.",
  faq: [
    "¿Hay tren hasta Canfranc?",
    "Sí, desde Zaragoza; pero mejor el autobús de la boda, que vuelve de noche.",
  ],
  guestbook: [
    ["Los del vagón 4", "Os guardamos el asiento de la ventanilla. Para siempre."],
    ["Yaya Pilar", "Qué bonito casarse en la estación. Abrigaos, que en Canfranc refresca."],
    ["Íñigo y Laia", "Billete picado. Llegamos puntuales, prometido."],
  ],
  songs: [
    "Locomotion",
    "Último tren a Zaragoza",
    "Midnight Train to Georgia",
    "September",
    "Valerie",
    "Mr. Brightside",
  ],
});

export const receta = wedding({
  id: "evt-demo-elsa-mateo",
  first: "Elsa",
  second: "Mateo",
  date: "2027-10-02T13:00:00+02:00",
  rsvpDeadline: "2027-08-23T23:59:00+02:00",
  city: "Tolosa",
  region: "Gipuzkoa",
  couple: "olivar",
  coverPhoto: "/fotos/olivar/historia-4.jpg",
  cardMessage:
    "La abuela dice que la receta del amor lleva paciencia, buena compañía y fuego lento. Ven a probarla.",
  welcomeMessage:
    "Nos conocimos en la cocina de un restaurante y desde entonces no hemos parado de cocinar juntos. Aquí tienes la receta del día.",
  thankYouMessage:
    "Gracias por venir a comer, a brindar y a pedir la receta de la tarta. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia de Santa María de Tolosa",
      kind: "Ceremonia",
      address: "Plaza de Santa María, 1",
      note: "En el casco viejo. Hay parking junto al mercado del Tinglado.",
      photo: "iglesia",
    },
    {
      id: "finca",
      name: "Caserío Etxeberri",
      kind: "Aperitivo, comida y fiesta",
      address: "Barrio Usabal, 12",
      note: "A 10 minutos, entre prados. Los autobuses salen al terminar la ceremonia.",
      photo: "patioOlivos",
    },
  ],
  climate: [20, 10, 40],
  program: [
    ["13:00", "Ceremonia", "iglesia", "Santa María", "Con txistu a la salida.", "ceremony"],
    ["14:15", "Aperitivo", "finca", "En la campa", "Pintxos, sidra y queso Idiazabal.", "cocktail"],
    [
      "16:00",
      "Comida",
      "finca",
      "En el caserío",
      "Con el menú que elijas al confirmar.",
      "banquet",
    ],
    [
      "19:30",
      "Fiesta",
      "finca",
      "Con la tarta de la abuela",
      "Barra libre y baile hasta la noche.",
      "party",
    ],
  ],
  busRoutes: [
    ["centro", "Tolosa → Caserío", "Plaza Zaharra", "13:50", ["22:00", "01:30"], 55],
    ["donostia", "Donostia → Tolosa", "Estación de autobuses, Donostia", "11:45", ["01:30"], 30],
  ],
  menu: {
    carne: "Chuletón con pimientos de Gernika",
    pescado: "Merluza en salsa verde",
    vegetariano: "Alubias de Tolosa con verduras",
    vegano: "Porrusalda con patata y puerro",
  },
  dressCode: {
    title: "Domingo de caserío",
    detail: "Colores de cocina: crema, rojo y verde prado. Hay campa: calzado cómodo.",
    palette: [
      { name: "Rojo pimiento", hex: "#a3402a" },
      { name: "Ficha", hex: "#fffaf0" },
      { name: "Verde prado", hex: "#4f6b3a" },
      { name: "Harina", hex: "#ecdcbf" },
    ],
    examples: [
      "Vestido de día y algo de abrigo; cuña o plano para la campa.",
      "Traje o americana; la corbata, opcional.",
      "Ropa cómoda: habrá taller de galletas para ellos.",
    ],
  },
  accommodation: [
    ["Hotel Oria", "En el centro de Tolosa", "Habitaciones reservadas hasta el 15 de agosto."],
    ["Agroturismo Usabal", "Junto al caserío", "Para quedarse al desayuno del domingo."],
  ],
  story: {
    intro: "Una cocina, un delantal prestado y una receta de la abuela. Esta es la versión corta.",
    moments: [
      [
        "2018",
        "La cocina",
        "Ella era jefa de partida y él el nuevo. Se le quemó el arroz el primer día.",
        "olivos",
      ],
      ["2021", "La terraza", "Un piso con una cocina enorme y un balcón con tomateras.", "terraza"],
      [
        "2026",
        "La pedida",
        "El anillo, escondido en un pastel de la receta de la abuela.",
        "anilloMuro",
      ],
      ["Hoy", "Y ahora, la boda", "La receta está lista. Solo faltas tú en la mesa.", "olivar"],
    ],
  },
  gifts: [
    [
      "Nuestro viaje a Italia",
      "A aprender a hacer pasta. Cualquier aportación nos acerca.",
      "Lo que queráis",
    ],
    ["Una cazuela de hierro", "Para los guisos de toda la vida.", "180 €"],
    ["Un curso de cocina para dos", "Para no dejar de aprender.", "160 €"],
    ["El recetario de la abuela, impreso", "Para que no se pierda.", "60 €"],
  ],
  kids: "Habrá monitores, taller de galletas y comida para ellos.",
  faq: ["¿Habrá tarta de la abuela?", "Sí: a las siete y media, con la receta en cada mesa."],
  guestbook: [
    ["Los del restaurante", "Os guardamos los delantales. Esta vez, sin arroz quemado."],
    ["Amama Mari", "Mi receta, en vuestra boda. No se puede pedir más."],
    ["Jon e Irati", "Nos apuntamos a repetir postre."],
  ],
  songs: ["Sugar", "Itsasoa gara", "Cheek to Cheek", "September", "Valerie", "Dancing Queen"],
});

export const concierto = wedding({
  id: "evt-demo-vega-marcos",
  first: "Vega",
  second: "Marcos",
  date: "2027-07-10T18:30:00+02:00",
  rsvpDeadline: "2027-05-31T23:59:00+02:00",
  city: "Benicàssim",
  region: "Castellón",
  couple: "mar",
  coverPhoto: "/fotos/buganvilla/historia-2.jpg",
  cardMessage:
    "Nos conocimos en primera fila de un festival, empapados y afónicos. Esta es la gira que de verdad nos importa: única fecha.",
  welcomeMessage:
    "Diez festivales, cien conciertos y una sola canción que es la nuestra. Aquí tienes tu entrada para el directo más importante.",
  thankYouMessage:
    "Gracias por venir al directo, por los bises y por cantar hasta quedaros sin voz. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Villa del Mar",
      kind: "Ceremonia",
      address: "Paseo Marítimo Pilar Coloma, 14",
      note: "Ceremonia civil en el jardín de la villa, frente a la playa.",
      photo: "ermitaMar",
    },
    {
      id: "finca",
      name: "Escenario Las Palmeras",
      kind: "Aperitivo, cena y concierto",
      address: "Avenida de Ferrandis Salvador, 72",
      note: "A 5 minutos en lanzadera. Hay concierto en directo y DJ hasta el amanecer.",
      photo: "pista",
    },
  ],
  climate: [30, 21, 5],
  program: [
    [
      "18:30",
      "Ceremonia",
      "iglesia",
      "En el jardín",
      "Breve, con la banda tocando a la salida.",
      "ceremony",
    ],
    [
      "19:45",
      "Aperitivo",
      "finca",
      "Junto al escenario",
      "Vermut, tapas y prueba de sonido.",
      "cocktail",
    ],
    [
      "21:30",
      "Cena",
      "finca",
      "Bajo las palmeras",
      "Con el menú que elijas al confirmar.",
      "banquet",
    ],
    [
      "23:30",
      "Fiesta",
      "finca",
      "Concierto y DJ",
      "Barra libre, concierto sorpresa y bises.",
      "party",
    ],
  ],
  busRoutes: [
    [
      "castellon",
      "Castellón → Benicàssim",
      "Plaza de la Paz, Castellón",
      "17:45",
      ["02:30", "05:30"],
      55,
    ],
    ["valencia", "Valencia → Benicàssim", "Estación del Norte, Valencia", "16:30", ["05:30"], 30],
  ],
  menu: {
    carne: "Costillas a baja temperatura con boniato",
    pescado: "Atún a la plancha con tomate",
    vegetariano: "Hamburguesa de setas con queso de cabra",
    vegano: "Tacos de jaca frutal con guacamole",
  },
  dressCode: {
    title: "Festival de verano",
    detail: "Negro de escenario con un toque neón. Se baila mucho: calzado cómodo.",
    palette: [
      { name: "Escenario", hex: "#17131f" },
      { name: "Foco rosa", hex: "#ff6b8a" },
      { name: "Foco azul", hex: "#46b4ff" },
      { name: "Entrada", hex: "#f4f1ea" },
    ],
    examples: [
      "Vestido negro o de lentejuelas; zapatillas permitidas.",
      "Camisa estampada o camiseta bajo americana.",
      "Cascos antirruido para ellos: habrá zona de juegos tranquila.",
    ],
  },
  accommodation: [
    ["Hotel Bonaire", "Frente a la playa", "Habitaciones reservadas hasta el 1 de junio."],
    ["Camping Bonterra", "A 10 minutos andando", "Para quien quiera vivirlo como un festival."],
  ],
  story: {
    intro: "Una primera fila, un chubasco y una canción a gritos. Esta es la versión corta.",
    moments: [
      [
        "2017",
        "El festival",
        "Llovía a mares. Compartimos chubasquero y nos aprendimos la canción a medias.",
        "cala",
      ],
      [
        "2020",
        "La furgoneta",
        "Seis festivales en un verano, durmiendo en la furgoneta.",
        "furgoneta",
      ],
      [
        "2026",
        "La pedida",
        "En un concierto, cuando sonó nuestra canción. El grupo lo sabía.",
        "anilloBarca",
      ],
      ["Hoy", "Y ahora, la boda", "Única fecha. No te lo puedes perder.", "orilla"],
    ],
  },
  gifts: [
    ["Nuestro viaje a Glastonbury", "Cualquier aportación nos acerca.", "Lo que queráis"],
    ["Un tocadiscos de los buenos", "Para los vinilos de la gira.", "320 €"],
    ["Abono para el festival del año que viene", "Para dos, claro.", "260 €"],
    ["Una guitarra eléctrica", "Por si algún día montamos grupo.", "240 €"],
  ],
  kids: "Habrá monitores, cascos y cena para ellos.",
  faq: [
    "¿Habrá concierto de verdad?",
    "Sí: un grupo sorpresa a las doce y media. No preguntéis cuál.",
  ],
  guestbook: [
    ["Los de la primera fila", "Os guardamos el sitio junto al escenario. Como siempre."],
    ["Abuela Fina", "No sé qué es un pogo, pero lo bailaré."],
    ["Hugo y Ane", "Bis, bis, bis."],
  ],
  songs: [
    "Mr. Brightside",
    "Sweet Child O' Mine",
    "La flaca",
    "September",
    "Valerie",
    "Wonderwall",
  ],
});

export const feria = wedding({
  id: "evt-demo-macarena-rafa",
  first: "Macarena",
  second: "Rafa",
  date: "2027-05-08T18:00:00+02:00",
  rsvpDeadline: "2027-03-29T23:59:00+02:00",
  city: "Jerez de la Frontera",
  region: "Cádiz",
  couple: "olivar",
  coverPhoto: "/fotos/olivar/portada.jpg",
  cardMessage:
    "Nos conocimos en la feria, entre farolillos y rebujito. Esta vez la caseta es nuestra y estás invitado.",
  welcomeMessage:
    "Nos casamos en mayo, con los caballos en la calle y los farolillos encendidos. Aquí tienes el programa de nuestras fiestas.",
  thankYouMessage:
    "Gracias por bailar en nuestra caseta hasta que se apagaron los farolillos. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia de San Miguel",
      kind: "Ceremonia",
      address: "Plaza de San Miguel, s/n",
      note: "En el barrio de San Miguel. Mejor venir andando o en taxi.",
      photo: "iglesia",
    },
    {
      id: "finca",
      name: "Bodega Los Arcos",
      kind: "Aperitivo, cena y caseta",
      address: "Calle Pizarro, 7",
      note: "A 10 minutos andando. La caseta tiene farolillos, albero y escenario.",
      photo: "cortijo",
    },
  ],
  climate: [27, 13, 10],
  program: [
    ["18:00", "Ceremonia", "iglesia", "San Miguel", "Con coro flamenco a la salida.", "ceremony"],
    [
      "19:30",
      "Aperitivo",
      "finca",
      "En el patio de la bodega",
      "Fino, rebujito y jamón al corte.",
      "cocktail",
    ],
    ["21:30", "Cena", "finca", "Bajo los arcos", "Con el menú que elijas al confirmar.", "banquet"],
    [
      "23:30",
      "Fiesta",
      "finca",
      "En nuestra caseta",
      "Barra libre, sevillanas y rumba hasta el amanecer.",
      "party",
    ],
  ],
  busRoutes: [
    ["cadiz", "Cádiz → Jerez", "Plaza de Sevilla, Cádiz", "16:45", ["03:00", "06:00"], 55],
    ["sevilla", "Sevilla → Jerez", "Plaza de Armas, Sevilla", "16:00", ["06:00"], 30],
  ],
  menu: {
    carne: "Rabo de toro al oloroso",
    pescado: "Urta a la roteña",
    vegetariano: "Berza de verduras sin pringá",
    vegano: "Tagarninas esparragás con pan frito",
  },
  dressCode: {
    title: "Feria de mayo",
    detail: "Colores de farolillo y de lunares. Hay albero: tacón ancho.",
    palette: [
      { name: "Rojo banderín", hex: "#9b1d2c" },
      { name: "Albero", hex: "#e0b24a" },
      { name: "Verde caseta", hex: "#2f6b45" },
      { name: "Cal", hex: "#fbf1dc" },
    ],
    examples: [
      "Traje de flamenca o vestido de lunares; flor en el pelo.",
      "Traje corto o chaqueta clara; corbata alegre.",
      "Trajes de feria para ellos, si les apetece; habrá tiovivo.",
    ],
  },
  accommodation: [
    [
      "Hotel Casa Palacio",
      "En el centro de Jerez",
      "Habitaciones reservadas hasta el 15 de marzo.",
    ],
    ["Casa Patio San Miguel", "Junto a la iglesia", "Ideal para grupos de amigos."],
  ],
  story: {
    intro: "Una caseta, un rebujito derramado y una sevillana. Esta es la versión corta.",
    moments: [
      [
        "2019",
        "La feria",
        "Él le tiró el rebujito encima. Ella le hizo bailar las cuatro sevillanas de castigo.",
        "olivos",
      ],
      ["2022", "El patio", "Un piso con patio de geranios en el barrio de San Miguel.", "terraza"],
      ["2026", "La pedida", "En la feria, bajo los farolillos de la misma caseta.", "anilloMuro"],
      ["Hoy", "Y ahora, la boda", "La caseta es nuestra. Solo faltas tú.", "olivar"],
    ],
  },
  gifts: [
    ["Nuestro viaje a Argentina", "Cualquier aportación nos acerca.", "Lo que queráis"],
    ["Un juego de copas de catavino", "Para el fino de los domingos.", "60 €"],
    ["Un mantón bordado", "Para la feria del año que viene.", "240 €"],
    ["Una vajilla de La Cartuja", "La de toda la vida.", "220 €"],
  ],
  kids: "Habrá monitores, tiovivo y cena para ellos.",
  faq: [
    "¿Se baila mucho?",
    "Toda la noche. A medianoche hay clase de sevillanas para quien la necesite.",
  ],
  guestbook: [
    ["Los de la caseta", "Os guardamos el farolillo más grande. Que no se apague."],
    ["Abuela Reme", "Qué bonita mi niña de flamenca. Viva Jerez."],
    ["Lolo y Triana", "Nos pedimos la rumba de las cuatro."],
  ],
  songs: [
    "Sevillanas del Espolón",
    "Volando voy",
    "Amor de San Juan",
    "September",
    "Valerie",
    "Bamboléo",
  ],
});

export const biblioteca = wedding({
  id: "evt-demo-clara-martin",
  first: "Clara",
  second: "Martín",
  date: "2027-04-23T12:30:00+02:00",
  rsvpDeadline: "2027-03-14T23:59:00+01:00",
  city: "Alcalá de Henares",
  region: "Madrid",
  couple: "olivar",
  coverPhoto: "/fotos/olivar/historia-1.jpg",
  cardMessage:
    "Nos conocimos pidiendo el mismo libro en la biblioteca. Lo leímos a medias y no lo hemos devuelto nunca.",
  welcomeMessage:
    "Nos casamos el Día del Libro, en la ciudad de Cervantes. Aquí tienes todo para el capítulo más bonito.",
  thankYouMessage:
    "Gracias por venir a escribir con nosotros este capítulo. Aquí están vuestras fotos, sin multa por retraso.",
  venues: [
    {
      id: "iglesia",
      name: "Capilla de San Ildefonso",
      kind: "Ceremonia",
      address: "Plaza de San Diego, s/n",
      note: "Dentro del Colegio Mayor. Hay parking en la plaza de Cervantes.",
      photo: "iglesia",
    },
    {
      id: "finca",
      name: "Quinta de los Libreros",
      kind: "Aperitivo, comida y fiesta",
      address: "Camino de los Afligidos, 9",
      note: "A 10 minutos. Los autobuses salen al terminar la ceremonia.",
      photo: "patioOlivos",
    },
  ],
  climate: [20, 7, 30],
  program: [
    [
      "12:30",
      "Ceremonia",
      "iglesia",
      "San Ildefonso",
      "Con lectura de un fragmento del Quijote.",
      "ceremony",
    ],
    [
      "13:45",
      "Aperitivo",
      "finca",
      "En el claustro",
      "Vino de Madrid y tapas complutenses.",
      "cocktail",
    ],
    [
      "15:30",
      "Comida",
      "finca",
      "En la biblioteca de la quinta",
      "Con el menú que elijas al confirmar.",
      "banquet",
    ],
    [
      "19:00",
      "Fiesta",
      "finca",
      "En el jardín",
      "Barra libre, baile y libros para llevar.",
      "party",
    ],
  ],
  busRoutes: [
    ["centro", "Alcalá → Quinta", "Plaza de Cervantes", "13:15", ["21:00", "01:00"], 55],
    ["madrid", "Madrid → Alcalá", "Avenida de América, Madrid", "11:15", ["01:00"], 30],
  ],
  menu: {
    carne: "Cordero asado con patatas panaderas",
    pescado: "Bacalao al ajoarriero",
    vegetariano: "Pisto manchego con huevo",
    vegano: "Judiones con verduras",
  },
  dressCode: {
    title: "Primavera de biblioteca",
    detail: "Tonos de lomo de libro: granate, verde, crema. Hay claustro de piedra: tacón ancho.",
    palette: [
      { name: "Sello granate", hex: "#7d1f3a" },
      { name: "Cartón", hex: "#f3ead2" },
      { name: "Lomo verde", hex: "#3d6644" },
      { name: "Tinta", hex: "#2a2622" },
    ],
    examples: [
      "Vestido de día y una chaqueta para el claustro.",
      "Traje o americana de tweed; la corbata, opcional.",
      "Ropa cómoda: habrá cuentacuentos para ellos.",
    ],
  },
  accommodation: [
    [
      "Parador de Alcalá",
      "En el centro, junto a la capilla",
      "Habitaciones reservadas hasta el 1 de marzo.",
    ],
    ["Hostal Complutense", "A 5 minutos andando", "Más sencillo y muy céntrico."],
  ],
  story: {
    intro:
      "Una biblioteca, un mismo libro y un préstamo que nunca devolvimos. Esta es la versión corta.",
    moments: [
      [
        "2018",
        "El libro",
        "Los dos pedimos el mismo ejemplar. La bibliotecaria nos hizo compartirlo.",
        "olivos",
      ],
      ["2021", "La estantería", "Un piso pequeño con más libros que platos.", "terraza"],
      [
        "2026",
        "La pedida",
        "El anillo, dentro de aquel libro, en la página donde nos quedamos.",
        "anilloMuro",
      ],
      [
        "Hoy",
        "Y ahora, la boda",
        "Empieza un capítulo nuevo. Ven a leerlo con nosotros.",
        "olivar",
      ],
    ],
  },
  gifts: [
    [
      "Nuestro viaje a Dublín",
      "A ver la biblioteca del Trinity. Cualquier aportación nos acerca.",
      "Lo que queráis",
    ],
    ["Una estantería de pared", "Ya no caben los libros.", "280 €"],
    ["Un sillón de lectura", "Para los domingos de lluvia.", "340 €"],
    ["Una edición antigua del Quijote", "Para empezar la biblioteca familiar.", "150 €"],
  ],
  kids: "Habrá monitores, cuentacuentos y comida para ellos.",
  faq: [
    "¿Hay que llevar un libro?",
    "Si quieres, sí: haremos un intercambio de libros en la fiesta.",
  ],
  guestbook: [
    ["Los de la biblioteca", "El libro sigue sin devolver. Lo damos por perdido con mucho gusto."],
    ["Abuelo Julián", "Que vuestra historia tenga muchos tomos."],
    ["Bea y Nico", "Nos apuntamos al intercambio de libros."],
  ],
  songs: [
    "Sweet Caroline",
    "Pongamos que hablo de Madrid",
    "Book of Love",
    "September",
    "Valerie",
    "Dancing Queen",
  ],
});

export const llave = wedding({
  id: "evt-demo-julia-andres",
  first: "Julia",
  second: "Andrés",
  date: "2027-06-12T18:00:00+02:00",
  rsvpDeadline: "2027-05-03T23:59:00+02:00",
  city: "Donostia",
  region: "Gipuzkoa",
  couple: "mar",
  coverPhoto: "/fotos/buganvilla/historia-1.jpg",
  cardMessage:
    "Nos conocimos en el ascensor de un hotel que se quedó parado entre dos plantas. Esta vez la puerta se abre sola: pasa.",
  welcomeMessage:
    "Tenemos reservada la mejor habitación de la ciudad para celebrarlo. Aquí tienes tu llave y todo lo que necesitas.",
  thankYouMessage:
    "Gracias por alojaros en nuestra boda y por no querer hacer el check-out. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Basílica de Santa María del Coro",
      kind: "Ceremonia",
      address: "Calle 31 de Agosto, 46",
      note: "En la Parte Vieja. Hay parking en el Boulevard.",
      photo: "iglesia",
    },
    {
      id: "finca",
      name: "Gran Hotel de la Concha",
      kind: "Aperitivo, cena y fiesta",
      address: "Paseo de la Concha, 2",
      note: "A 10 minutos andando por el paseo. Salón con vistas a la bahía.",
      photo: "terrazaMar",
    },
  ],
  climate: [22, 15, 35],
  program: [
    [
      "18:00",
      "Ceremonia",
      "iglesia",
      "Santa María del Coro",
      "Con órgano y txistu a la salida.",
      "ceremony",
    ],
    [
      "19:15",
      "Aperitivo",
      "finca",
      "En la terraza",
      "Pintxos, txakoli y la bahía al atardecer.",
      "cocktail",
    ],
    [
      "21:00",
      "Cena",
      "finca",
      "En el salón de baile",
      "Con el menú que elijas al confirmar.",
      "banquet",
    ],
    ["23:30", "Fiesta", "finca", "Hasta el desayuno", "Barra libre, orquesta y DJ.", "party"],
  ],
  busRoutes: [
    ["bilbao", "Bilbao → Donostia", "Termibus, Bilbao", "16:15", ["02:00", "05:00"], 55],
    ["hondarribia", "Hondarribia → Donostia", "Plaza de Armas", "17:15", ["05:00"], 30],
  ],
  menu: {
    carne: "Solomillo con foie y reducción de Pedro Ximénez",
    pescado: "Rodaballo a la brasa con refrito",
    vegetariano: "Hongos de temporada con yema curada",
    vegano: "Pochas con verduras y piparras",
  },
  dressCode: {
    title: "Gran hotel",
    detail: "Elegante de noche: granate, latón y crema. Habrá salón de baile.",
    palette: [
      { name: "Terciopelo", hex: "#6e1f2c" },
      { name: "Latón", hex: "#c9a14a" },
      { name: "Crema", hex: "#f8f1e2" },
      { name: "Bahía", hex: "#46627a" },
    ],
    examples: [
      "Vestido largo o de cóctel; zapato cómodo para el salón.",
      "Traje oscuro o esmoquin; la pajarita, bienvenida.",
      "Elegantes y cómodos: habrá sala de juegos para ellos.",
    ],
  },
  accommodation: [
    [
      "Gran Hotel de la Concha",
      "Donde es la cena",
      "Habitaciones reservadas hasta el 1 de mayo. Menciona la boda.",
    ],
    ["Pensión La Parte Vieja", "Junto a la basílica", "Más sencilla y en pleno centro."],
  ],
  story: {
    intro: "Un ascensor parado, cuarenta minutos y una conversación. Esta es la versión corta.",
    moments: [
      [
        "2019",
        "El ascensor",
        "Se quedó parado entre la planta cuatro y la cinco. Salimos con planes para cenar.",
        "cala",
      ],
      ["2021", "Los viajes", "Un hotel distinto cada mes, coleccionando llaves.", "furgoneta"],
      [
        "2026",
        "La pedida",
        "En la habitación del primer hotel, con el anillo en el llavero.",
        "anilloBarca",
      ],
      ["Hoy", "Y ahora, la boda", "Tu habitación está lista. Solo falta que llegues.", "orilla"],
    ],
  },
  gifts: [
    [
      "Nuestro viaje a Viena",
      "A dormir en un gran hotel de verdad. Cualquier aportación nos acerca.",
      "Lo que queráis",
    ],
    ["Un juego de sábanas de hotel", "Para que casa sea como el hotel.", "180 €"],
    ["Una cena en el salón de la Concha", "Para el primer aniversario.", "220 €"],
    ["Un llavero de latón grabado", "Para la llave de casa.", "40 €"],
  ],
  kids: "Habrá monitores, sala de juegos y cena para ellos.",
  faq: [
    "¿Hay habitaciones en el hotel?",
    "Sí, con precio especial hasta el 1 de mayo. Menciona la boda.",
  ],
  guestbook: [
    ["Los del ascensor", "Prometemos no quedarnos encerrados esta vez."],
    ["Amona Josefa", "Qué hotel tan elegante. Ponte la chaqueta, hijo."],
    ["Mikel y Ane", "Habitación pedida. No pensamos hacer el check-out."],
  ],
  songs: [
    "Hotel California",
    "La chica de ayer",
    "Fly Me to the Moon",
    "September",
    "Valerie",
    "Mi gran noche",
  ],
});

export const partitura = wedding({
  id: "evt-demo-nerea-pol",
  first: "Nerea",
  second: "Pol",
  date: "2027-10-23T17:30:00+02:00",
  rsvpDeadline: "2027-09-13T23:59:00+02:00",
  city: "Barcelona",
  region: "Barcelona",
  couple: "mar",
  coverPhoto: "/fotos/buganvilla/historia-4.jpg",
  cardMessage:
    "Nos conocimos en la orquesta del conservatorio: ella al violín, él desafinando al chelo. Esta es nuestra pieza favorita.",
  welcomeMessage:
    "Hemos compuesto el día como una sinfonía en cuatro movimientos. Aquí tienes el programa del estreno.",
  thankYouMessage:
    "Gracias por el aplauso más largo de nuestra vida. Aquí están vuestras fotos, con bis incluido.",
  venues: [
    {
      id: "iglesia",
      name: "Basílica de Santa Maria del Mar",
      kind: "Ceremonia",
      address: "Plaça de Santa Maria, 1",
      note: "En el Born. Mejor venir en metro: no hay dónde aparcar.",
      photo: "iglesia",
    },
    {
      id: "finca",
      name: "Casa de la Música",
      kind: "Aperitivo, cena y fiesta",
      address: "Carrer de Sant Pere Més Alt, 11",
      note: "A 10 minutos andando. Habrá cuarteto de cuerda en el aperitivo.",
      photo: "pista",
    },
  ],
  climate: [21, 14, 30],
  program: [
    [
      "17:30",
      "Ceremonia",
      "iglesia",
      "Santa Maria del Mar",
      "Con coro y cuarteto de cuerda.",
      "ceremony",
    ],
    [
      "18:45",
      "Aperitivo",
      "finca",
      "En el claustro",
      "Cava, tapas y música de cámara.",
      "cocktail",
    ],
    [
      "20:30",
      "Cena",
      "finca",
      "En el salón de los espejos",
      "Con el menú que elijas al confirmar.",
      "banquet",
    ],
    ["23:00", "Fiesta", "finca", "Del adagio al rock", "Barra libre, orquesta y DJ.", "party"],
  ],
  busRoutes: [
    [
      "girona",
      "Girona → Barcelona",
      "Estació d'autobusos, Girona",
      "15:30",
      ["01:30", "04:30"],
      55,
    ],
    ["sitges", "Sitges → Barcelona", "Estació de Sitges", "16:15", ["04:30"], 30],
  ],
  menu: {
    carne: "Fricandó de ternera con setas",
    pescado: "Suquet de pescado de roca",
    vegetariano: "Canelones de setas y espinacas",
    vegano: "Escalivada con romesco y coca",
  },
  dressCode: {
    title: "Noche de estreno",
    detail: "Negro de concierto con un toque de rojo. Es una boda de gala, sin exigir esmoquin.",
    palette: [
      { name: "Tinta", hex: "#2b2620" },
      { name: "Papel pautado", hex: "#fbf7ec" },
      { name: "Nota roja", hex: "#a3402a" },
      { name: "Madera de violín", hex: "#8a5a2c" },
    ],
    examples: [
      "Vestido de noche o de cóctel; algo de abrigo para el claustro.",
      "Traje oscuro; corbata o pajarita.",
      "Elegantes: habrá taller de instrumentos para ellos.",
    ],
  },
  accommodation: [
    ["Hotel Born", "Junto a la basílica", "Habitaciones reservadas hasta el 15 de septiembre."],
    ["Apartamentos Sant Pere", "Junto a la Casa de la Música", "Para grupos de amigos."],
  ],
  story: {
    intro: "Un violín, un chelo desafinado y un ensayo eterno. Esta es la versión corta.",
    moments: [
      ["2016", "El ensayo", "Él desafinó toda la tarde. Ella le afinó el chelo y la vida.", "cala"],
      [
        "2019",
        "La gira",
        "Un verano tocando en las plazas de los pueblos de la costa.",
        "furgoneta",
      ],
      [
        "2026",
        "La pedida",
        "Al final de un concierto, con el anillo dentro del estuche del violín.",
        "anilloBarca",
      ],
      ["Hoy", "Y ahora, la boda", "La pieza está escrita. Falta el público.", "orilla"],
    ],
  },
  gifts: [
    [
      "Nuestro viaje a Viena",
      "Al concierto de Año Nuevo. Cualquier aportación nos acerca.",
      "Lo que queráis",
    ],
    ["Un atril de madera", "Para los ensayos en casa.", "120 €"],
    ["Abono para el Liceu", "Para la temporada que viene.", "300 €"],
    ["Cuerdas nuevas para todo el año", "Que se rompen mucho.", "80 €"],
  ],
  kids: "Habrá monitores, taller de instrumentos y cena para ellos.",
  faq: [
    "¿Hay que saber de música?",
    "No: basta con aplaudir al final de cada movimiento (y no entre medias).",
  ],
  guestbook: [
    ["La orquesta del conservatorio", "Hemos ensayado una sorpresa. Esta vez afinados."],
    ["Àvia Montserrat", "Qué bonito tocáis los dos. Y qué bonito os queréis."],
    ["Biel y Laia", "Pedimos el bis desde ya."],
  ],
  songs: [
    "Canon de Pachelbel",
    "Mediterráneo",
    "Can't Help Falling in Love",
    "September",
    "Valerie",
    "Dancing Queen",
  ],
});

export const brujula = wedding({
  id: "evt-demo-lara-diego",
  first: "Lara",
  second: "Diego",
  date: "2027-08-14T19:00:00+02:00",
  rsvpDeadline: "2027-07-05T23:59:00+02:00",
  city: "Fisterra",
  region: "A Coruña",
  couple: "mar",
  coverPhoto: "/fotos/buganvilla/historia-2.jpg",
  cardMessage:
    "Llevamos diez años navegando juntos. Esta vez el rumbo es el fin del mundo, y queremos que vengas en el barco.",
  welcomeMessage:
    "Nos casamos en Fisterra, donde se acaba el mapa. Aquí tienes la carta de navegación con todo lo que necesitas.",
  thankYouMessage:
    "Gracias por navegar hasta el fin del mundo con nosotros. Aquí están vuestras fotos, con el faro al fondo.",
  venues: [
    {
      id: "iglesia",
      name: "Faro de Fisterra",
      kind: "Ceremonia",
      address: "Cabo Fisterra, s/n",
      note: "Ceremonia civil junto al faro, al atardecer. Lleva una chaqueta: sopla el viento.",
      photo: "ermitaMar",
    },
    {
      id: "finca",
      name: "Pazo do Cabo",
      kind: "Aperitivo, cena y fiesta",
      address: "Lugar de San Martiño, 3",
      note: "A 10 minutos en autobús, mirando al mar.",
      photo: "terrazaMar",
    },
  ],
  climate: [22, 15, 20],
  program: [
    [
      "19:00",
      "Ceremonia",
      "iglesia",
      "Junto al faro",
      "Al atardecer, en el fin del mundo.",
      "ceremony",
    ],
    [
      "20:15",
      "Aperitivo",
      "finca",
      "En el jardín del pazo",
      "Pulpo, percebes y albariño.",
      "cocktail",
    ],
    [
      "22:00",
      "Cena",
      "finca",
      "En el hórreo grande",
      "Con el menú que elijas al confirmar.",
      "banquet",
    ],
    ["00:00", "Fiesta", "finca", "Con queimada", "Barra libre, gaitas y DJ.", "party"],
  ],
  busRoutes: [
    [
      "santiago",
      "Santiago → Fisterra",
      "Praza de Galicia, Santiago",
      "17:00",
      ["02:30", "05:30"],
      55,
    ],
    ["coruna", "A Coruña → Fisterra", "Estación de autobuses, A Coruña", "16:45", ["05:30"], 30],
  ],
  menu: {
    carne: "Ternera gallega con patatas",
    pescado: "Merluza de pincho a la gallega",
    vegetariano: "Empanada de verduras y grelos",
    vegano: "Caldo gallego de verduras",
  },
  dressCode: {
    title: "Atardecer en el cabo",
    detail: "Azul marino, crema y un toque de rojo. Sopla el viento: chaqueta o chal.",
    palette: [
      { name: "Rosa de los vientos", hex: "#9b1d2c" },
      { name: "Carta náutica", hex: "#fbf4e2" },
      { name: "Latón", hex: "#c9a14a" },
      { name: "Atlántico", hex: "#2f4a5e" },
    ],
    examples: [
      "Vestido y chal; calzado plano para la roca.",
      "Traje azul o americana con jersey; sin corbata.",
      "Ropa de abrigo: habrá búsqueda del tesoro con brújula para ellos.",
    ],
  },
  accommodation: [
    ["Hotel O Semáforo", "Junto al faro", "Pocas habitaciones: reservad pronto."],
    ["Casa rural Fin da Terra", "En el pueblo", "Para grupos y para la queimada del domingo."],
  ],
  story: {
    intro:
      "Una regata, un barco prestado y una brújula que no funcionaba. Esta es la versión corta.",
    moments: [
      [
        "2017",
        "La regata",
        "Nos perdimos en la primera regata. La brújula marcaba el sur. Llegamos últimos y juntos.",
        "cala",
      ],
      [
        "2020",
        "La costa",
        "Un verano costeando Galicia en un velero de segunda mano.",
        "furgoneta",
      ],
      [
        "2026",
        "La pedida",
        "En el barco, frente al faro, con el anillo dentro de la brújula.",
        "anilloBarca",
      ],
      ["Hoy", "Y ahora, la boda", "El rumbo está fijado: fin del mundo. Sube a bordo.", "orilla"],
    ],
  },
  gifts: [
    ["Nuestra vuelta a las islas Feroe", "Cualquier aportación nos acerca.", "Lo que queráis"],
    ["Una brújula que funcione", "Para no volver a perdernos.", "90 €"],
    ["Velas nuevas para el barco", "Que las viejas tienen diez años.", "400 €"],
    ["Una carta náutica enmarcada", "La de nuestra costa.", "120 €"],
  ],
  kids: "Habrá monitores, búsqueda del tesoro y cena para ellos.",
  faq: ["¿Hace frío en el faro?", "Al atardecer, sí, y sopla. Trae algo de abrigo."],
  guestbook: [
    ["La tripulación del velero", "Esta vez la brújula la llevamos nosotros."],
    ["Avoa Carmiña", "Que el mar os sea siempre bueno, rapaces."],
    ["Xoán y Uxía", "Nos pedimos la queimada."],
  ],
  songs: ["Sailing", "Mediterráneo", "La isla bonita", "September", "Valerie", "Dancing Queen"],
});

// La brújula enseña las coordenadas del sitio (en una boda real, las del cálculo del tiempo).
brujula.event.climate = { ...brujula.event.climate!, lat: 42.882, lon: -9.272 };

export const lacre = wedding({
  id: "evt-demo-aurora-gonzalo",
  first: "Aurora",
  second: "Gonzalo",
  date: "2027-09-18T17:00:00+02:00",
  rsvpDeadline: "2027-08-09T23:59:00+02:00",
  city: "Segovia",
  region: "Segovia",
  couple: "olivar",
  coverPhoto: "/fotos/olivar/portada.jpg",
  cardMessage:
    "Nos escribimos cartas durante un año entero, cada una con su lacre. Esta es la última, y la más importante.",
  welcomeMessage:
    "Nos casamos bajo el acueducto, en una ciudad de piedra y cartas. Aquí tienes todo lo que necesitas, bajo sello.",
  thankYouMessage:
    "Gracias por venir a abrir nuestra carta más importante. Aquí están vuestras fotos, lacradas con cariño.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia de San Martín",
      kind: "Ceremonia",
      address: "Plaza de Medina del Campo, 1",
      note: "En el centro, junto a la calle Real. Mejor dejar el coche fuera de la muralla.",
      photo: "iglesia",
    },
    {
      id: "finca",
      name: "Palacio de los Lacres",
      kind: "Aperitivo, cena y fiesta",
      address: "Camino del Parral, 4",
      note: "A 10 minutos, con vistas al Alcázar. Los autobuses salen al terminar la ceremonia.",
      photo: "cortijo",
    },
  ],
  climate: [23, 9, 15],
  program: [
    ["17:00", "Ceremonia", "iglesia", "San Martín", "Con lectura de nuestras cartas.", "ceremony"],
    [
      "18:15",
      "Aperitivo",
      "finca",
      "En el jardín del palacio",
      "Vino de Rueda y ponche segoviano.",
      "cocktail",
    ],
    [
      "20:00",
      "Cena",
      "finca",
      "En el salón de los escudos",
      "Con el menú que elijas al confirmar.",
      "banquet",
    ],
    [
      "22:30",
      "Fiesta",
      "finca",
      "Hasta la madrugada",
      "Barra libre, baile y cartas a los novios.",
      "party",
    ],
  ],
  busRoutes: [
    ["centro", "Segovia → Palacio", "Plaza del Azoguejo", "16:30", ["01:00", "04:00"], 55],
    ["madrid", "Madrid → Segovia", "Moncloa, Madrid", "15:00", ["04:00"], 30],
  ],
  menu: {
    carne: "Cochinillo asado a la segoviana",
    pescado: "Lubina con judiones de La Granja",
    vegetariano: "Judiones con verduras",
    vegano: "Sopa castellana de verduras",
  },
  dressCode: {
    title: "Otoño castellano",
    detail: "Burdeos, crema y oro viejo. Hay calles de piedra: tacón ancho.",
    palette: [
      { name: "Lacre", hex: "#7d1a26" },
      { name: "Papel de carta", hex: "#f7f0e4" },
      { name: "Latón", hex: "#c9a14a" },
      { name: "Piedra", hex: "#b9ab92" },
    ],
    examples: [
      "Vestido de otoño y abrigo ligero.",
      "Traje oscuro; corbata o pajarita.",
      "Ropa de abrigo: habrá taller de lacre para ellos.",
    ],
  },
  accommodation: [
    [
      "Parador de Segovia",
      "Con vistas a la ciudad",
      "Habitaciones reservadas hasta el 1 de agosto.",
    ],
    ["Hotel Real Acueducto", "Junto al acueducto", "Céntrico y cerca de la iglesia."],
  ],
  story: {
    intro: "Un año de cartas, cien lacres y un buzón muy usado. Esta es la versión corta.",
    moments: [
      [
        "2020",
        "La primera carta",
        "Él le escribió a mano porque no tenía su teléfono. Ella contestó con lacre.",
        "olivos",
      ],
      [
        "2022",
        "El escritorio",
        "Un piso con un escritorio grande y un cajón lleno de cartas.",
        "terraza",
      ],
      ["2026", "La pedida", "En una carta lacrada, con el anillo bajo el sello.", "anilloMuro"],
      ["Hoy", "Y ahora, la boda", "Esta carta es para ti. Ábrela.", "olivar"],
    ],
  },
  gifts: [
    [
      "Nuestro viaje a Florencia",
      "A comprar papel de carta. Cualquier aportación nos acerca.",
      "Lo que queráis",
    ],
    ["Un juego de lacre y sello", "Con nuestras iniciales.", "70 €"],
    ["Un escritorio de madera", "Para seguir escribiéndonos.", "380 €"],
    ["Papel de algodón para un año", "Para las cartas que vendrán.", "90 €"],
  ],
  kids: "Habrá monitores, taller de lacre y cena para ellos.",
  faq: [
    "¿Podemos dejaros una carta?",
    "Sí, por favor: habrá un buzón en la fiesta y lacre para sellarla.",
  ],
  guestbook: [
    ["Los del buzón", "Os dejamos la carta lacrada en el buzón de la fiesta."],
    ["Abuela Pilar", "Qué bonito escribirse cartas. Seguid haciéndolo."],
    ["Óscar y Jimena", "Nos pedimos el lacre dorado."],
  ],
  songs: ["Contigo", "Cartas amarillas", "La vie en rose", "September", "Valerie", "Dancing Queen"],
});

export const poker = wedding({
  id: "evt-demo-mireia-joel",
  first: "Mireia",
  second: "Joel",
  date: "2027-11-06T18:00:00+01:00",
  rsvpDeadline: "2027-09-27T23:59:00+02:00",
  city: "Peralada",
  region: "Girona",
  couple: "mar",
  coverPhoto: "/fotos/buganvilla/historia-1.jpg",
  cardMessage:
    "Nos lo jugamos todo a una carta hace siete años y ganamos. Esta es la última mano: ven a verla.",
  welcomeMessage:
    "Nos casamos en un castillo con casino, entre viñas y tapetes verdes. Aquí tienes todas las reglas de la casa.",
  thankYouMessage:
    "Gracias por apostar por nosotros y por la última mano a las cinco de la mañana. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia del Carmen",
      kind: "Ceremonia",
      address: "Plaça del Carme, 1",
      note: "Dentro del recinto del castillo. Hay parking junto a la entrada.",
      photo: "iglesia",
    },
    {
      id: "finca",
      name: "Castillo de Peralada",
      kind: "Aperitivo, cena y fiesta",
      address: "Carrer Sant Joan, s/n",
      note: "En el mismo recinto: del claustro al salón del casino, andando.",
      photo: "pista",
    },
  ],
  climate: [17, 7, 25],
  program: [
    ["18:00", "Ceremonia", "iglesia", "El Carmen", "Breve, con cuarteto de cuerda.", "ceremony"],
    ["19:15", "Aperitivo", "finca", "En el claustro", "Cava del Empordà y tapas.", "cocktail"],
    [
      "21:00",
      "Cena",
      "finca",
      "En el salón de los espejos",
      "Con el menú que elijas al confirmar.",
      "banquet",
    ],
    [
      "23:30",
      "Fiesta",
      "finca",
      "Con mesas de juego",
      "Barra libre, ruleta (sin dinero) y DJ.",
      "party",
    ],
  ],
  busRoutes: [
    [
      "figueres",
      "Figueres → Peralada",
      "Estación de tren, Figueres",
      "17:15",
      ["02:00", "05:00"],
      55,
    ],
    ["girona", "Girona → Peralada", "Estació d'autobusos, Girona", "16:30", ["05:00"], 30],
  ],
  menu: {
    carne: "Mar i muntanya de pollo y gambas",
    pescado: "Lubina con suquet",
    vegetariano: "Risotto de setas del Empordà",
    vegano: "Escalivada con romesco y pan de coca",
  },
  dressCode: {
    title: "Noche de casino",
    detail: "Verde tapete, negro y oro. Etiqueta, sin exagerar.",
    palette: [
      { name: "Tapete", hex: "#1f6b46" },
      { name: "Corazones", hex: "#b3192c" },
      { name: "Marfil de carta", hex: "#f2e6c9" },
      { name: "Ficha dorada", hex: "#e8c25f" },
    ],
    examples: [
      "Vestido largo o de cóctel; algo de abrigo.",
      "Esmoquin o traje oscuro; pajarita bienvenida.",
      "Elegantes: tendrán su propia mesa de juegos de cartas.",
    ],
  },
  accommodation: [
    ["Hotel Peralada", "Junto al castillo", "Habitaciones reservadas hasta el 15 de septiembre."],
    ["Hotel Empordà", "En Figueres", "A 10 minutos en coche."],
  ],
  story: {
    intro: "Una partida de cartas, un farol y una apuesta ganada. Esta es la versión corta.",
    moments: [
      [
        "2020",
        "El farol",
        "Ella le ganó al póker con una pareja de doses. Él aún no se lo cree.",
        "cala",
      ],
      [
        "2022",
        "La furgoneta",
        "Un verano de festivales jugando a las cartas en la furgoneta.",
        "furgoneta",
      ],
      ["2026", "La pedida", "Con el anillo escondido en el bote de una partida.", "anilloBarca"],
      ["Hoy", "Y ahora, la boda", "Todo al rojo. Ven a ver la última mano.", "orilla"],
    ],
  },
  gifts: [
    [
      "Nuestro viaje a Las Vegas",
      "Cualquier aportación nos acerca (sin apostarla).",
      "Lo que queráis",
    ],
    ["Una mesa de juego plegable", "Para las partidas de los viernes.", "180 €"],
    ["Un maletín de fichas de póker", "Del bueno, con su baraja.", "90 €"],
    ["Una cena en el castillo", "Para el primer aniversario.", "220 €"],
  ],
  kids: "Habrá monitores, juegos de mesa y cena para ellos.",
  faq: [
    "¿Se juega con dinero?",
    "No: las fichas son de la casa y el premio es un baile con los novios.",
  ],
  guestbook: [
    [
      "Los de la partida de los viernes",
      "Os guardamos la silla de siempre. Ya no hay farol que valga.",
    ],
    ["Àvia Rosa", "Nunca me gustaron las cartas, pero esta mano sí."],
    ["Pol y Aina", "Vamos con todo. Al rojo."],
  ],
  songs: [
    "Poker Face",
    "Luck Be a Lady",
    "Viva Las Vegas",
    "September",
    "Valerie",
    "Dancing Queen",
  ],
});

export const adviento = wedding({
  id: "evt-demo-laura-inigo",
  first: "Laura",
  second: "Íñigo",
  date: "2027-12-11T13:00:00+01:00",
  rsvpDeadline: "2027-11-01T23:59:00+01:00",
  city: "Ezcaray",
  region: "La Rioja",
  couple: "olivar",
  coverPhoto: "/fotos/olivar/historia-2.jpg",
  cardMessage:
    "Llevamos un año contando los días con un calendario de puertas en la nevera. Ya solo queda una: la nuestra.",
  welcomeMessage:
    "Nos casamos en diciembre, con chimenea, mantas y quizá nieve. Aquí tienes la cuenta atrás y todo lo demás.",
  thankYouMessage:
    "Gracias por venir en pleno invierno y por el calor de la fiesta. Aquí están vuestras fotos, con nieve incluida.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia de Santa María la Mayor",
      kind: "Ceremonia",
      address: "Plaza de la Iglesia, 1",
      note: "En el centro del pueblo. Llevad abrigo: la iglesia es fresca.",
      photo: "iglesia",
    },
    {
      id: "finca",
      name: "Casona del Oja",
      kind: "Aperitivo, comida y fiesta",
      address: "Camino de Valdezcaray, 2",
      note: "A 5 minutos, junto al río. Hay chimenea y mantas para todos.",
      photo: "cortijo",
    },
  ],
  climate: [7, -1, 40],
  program: [
    [
      "13:00",
      "Ceremonia",
      "iglesia",
      "Santa María la Mayor",
      "Con coro y villancicos a la salida.",
      "ceremony",
    ],
    [
      "14:15",
      "Aperitivo",
      "finca",
      "Junto a la chimenea",
      "Vino caliente, castañas y queso.",
      "cocktail",
    ],
    [
      "16:00",
      "Comida",
      "finca",
      "En el salón del río",
      "Con el menú que elijas al confirmar.",
      "banquet",
    ],
    [
      "19:30",
      "Fiesta",
      "finca",
      "Hasta que nieve",
      "Barra libre, baile y chocolate a medianoche.",
      "party",
    ],
  ],
  busRoutes: [
    [
      "logrono",
      "Logroño → Ezcaray",
      "Plaza del Ayuntamiento, Logroño",
      "11:45",
      ["21:00", "01:00"],
      55,
    ],
    ["santo-domingo", "Santo Domingo → Ezcaray", "Plaza de España", "12:30", ["01:00"], 30],
  ],
  menu: {
    carne: "Cordero asado con patatas",
    pescado: "Bacalao a la riojana",
    vegetariano: "Caparrones de verduras",
    vegano: "Potaje de alubias con verduras",
  },
  dressCode: {
    title: "Boda de invierno",
    detail: "Azul noche, crema y oro. Hace frío: abrigo, chal y calzado de suela gruesa.",
    palette: [
      { name: "Azul calendario", hex: "#1f3b5c" },
      { name: "Oro de ventanita", hex: "#c9a14a" },
      { name: "Crema", hex: "#f7f1e3" },
      { name: "Verde abeto", hex: "#2f5a43" },
    ],
    examples: [
      "Vestido de manga larga y abrigo; botas permitidas.",
      "Traje de lana o tweed; bufanda bienvenida.",
      "Abrigo y gorro: habrá muñeco de nieve si nieva.",
    ],
  },
  accommodation: [
    [
      "Hotel Echaurren",
      "En el centro de Ezcaray",
      "Habitaciones reservadas hasta el 1 de noviembre.",
    ],
    ["Casa rural El Oja", "Junto a la casona", "Para quedarse al chocolate del domingo."],
  ],
  story: {
    intro:
      "Un calendario de puertas, un invierno y muchas cuentas atrás. Esta es la versión corta.",
    moments: [
      [
        "2019",
        "La nevada",
        "Nos quedamos atrapados por la nieve en el mismo refugio. Dos días.",
        "olivos",
      ],
      [
        "2022",
        "La casa",
        "Un piso con chimenea y un calendario de puertas cada diciembre.",
        "terraza",
      ],
      ["2026", "La pedida", "Detrás de la puerta 24, el anillo.", "anilloMuro"],
      ["Hoy", "Y ahora, la boda", "Queda una puerta. Ábrela con nosotros.", "olivar"],
    ],
  },
  gifts: [
    [
      "Nuestro viaje a Laponia",
      "A ver auroras. Cualquier aportación nos acerca.",
      "Lo que queráis",
    ],
    ["Una manta de lana grande", "Para las tardes de chimenea.", "120 €"],
    ["Unos esquís para ella", "Que los de él ya los tiene.", "300 €"],
    ["Un calendario de puertas hecho a mano", "Para el primer aniversario.", "60 €"],
  ],
  kids: "Habrá monitores, taller de adornos y comida para ellos.",
  faq: ["¿Y si nieva?", "Mejor: los autobuses llevan cadenas y la casona tiene chimenea."],
  guestbook: [
    ["Los del refugio", "Esta vez llevamos provisiones para dos días, por si acaso."],
    ["Abuela Teresa", "Qué ilusión una boda en Navidad. Abrigaos mucho."],
    ["Asier y Nahia", "Nos pedimos el chocolate de medianoche."],
  ],
  songs: [
    "Let It Snow",
    "All I Want for Christmas Is You",
    "Hoy",
    "September",
    "Valerie",
    "Dancing Queen",
  ],
});

export const horoscopo = wedding({
  id: "evt-demo-candela-ruben",
  first: "Candela",
  second: "Rubén",
  date: "2027-06-05T12:30:00+02:00",
  rsvpDeadline: "2027-04-26T23:59:00+02:00",
  city: "Cuenca",
  region: "Cuenca",
  couple: "olivar",
  coverPhoto: "/fotos/olivar/historia-4.jpg",
  cardMessage:
    "Su horóscopo decía «conocerás a alguien que te hará reír». El de él, «cuidado con los tropiezos». Los dos acertaron.",
  welcomeMessage:
    "Los astros dicen que el 5 de junio es un gran día para casarse. Les hemos hecho caso. Aquí tienes todo lo demás.",
  thankYouMessage:
    "Gracias por venir a cumplir la predicción. Aquí están vuestras fotos; los astros, encantados.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia de San Pedro",
      kind: "Ceremonia",
      address: "Calle del Trabuco, 1",
      note: "En lo alto del casco antiguo, junto a las casas colgadas. Calzado cómodo.",
      photo: "iglesia",
    },
    {
      id: "finca",
      name: "Parador de las Hoces",
      kind: "Aperitivo, comida y fiesta",
      address: "Subida a San Pablo, s/n",
      note: "Al otro lado del puente de San Pablo: se cruza andando con vistas a la hoz.",
      photo: "patioOlivos",
    },
  ],
  climate: [26, 12, 15],
  program: [
    ["12:30", "Ceremonia", "iglesia", "San Pedro", "Breve, con coro.", "ceremony"],
    [
      "13:45",
      "Aperitivo",
      "finca",
      "En el claustro",
      "Morteruelo, zarajos y vino de la Manchuela.",
      "cocktail",
    ],
    [
      "15:30",
      "Comida",
      "finca",
      "Mirando a la hoz",
      "Con el menú que elijas al confirmar.",
      "banquet",
    ],
    [
      "19:00",
      "Fiesta",
      "finca",
      "Bajo las estrellas",
      "Barra libre, baile y telescopio en la terraza.",
      "party",
    ],
  ],
  busRoutes: [
    ["centro", "Cuenca → Parador", "Plaza de España", "13:15", ["21:00", "01:00"], 55],
    ["madrid", "Madrid → Cuenca", "Estación Sur, Madrid", "10:00", ["01:00"], 30],
  ],
  menu: {
    carne: "Cordero asado con pisto",
    pescado: "Trucha a la conquense",
    vegetariano: "Pisto con huevo y pan de pueblo",
    vegano: "Ajoarriero de verduras",
  },
  dressCode: {
    title: "Noche de estrellas",
    detail: "Azul noche, violeta y crema. Tarde fresca en el parador: chaqueta.",
    palette: [
      { name: "Bola de cristal", hex: "#5b3b8a" },
      { name: "Tinta", hex: "#1f1d2b" },
      { name: "Papel", hex: "#f4f0e6" },
      { name: "Estrella", hex: "#e8c25f" },
    ],
    examples: [
      "Vestido de verano y una chaqueta para la noche.",
      "Traje ligero; corbata opcional.",
      "Ropa cómoda: habrá telescopio y mapa del cielo para ellos.",
    ],
  },
  accommodation: [
    ["Parador de Cuenca", "Donde es la comida", "Habitaciones reservadas hasta el 15 de abril."],
    ["Posada de San José", "En el casco antiguo", "Con vistas a la hoz del Huécar."],
  ],
  story: {
    intro: "Dos horóscopos, un tropiezo y una carcajada. Esta es la versión corta.",
    moments: [
      [
        "2019",
        "El tropiezo",
        "Él tropezó en las casas colgadas y ella no podía parar de reír. Así empezó.",
        "olivos",
      ],
      ["2022", "El balcón", "Un piso con balcón para ver las estrellas.", "terraza"],
      [
        "2026",
        "La pedida",
        "En la terraza del parador, con un telescopio apuntando a su signo.",
        "anilloMuro",
      ],
      ["Hoy", "Y ahora, la boda", "Los astros ya han hablado. Faltas tú.", "olivar"],
    ],
  },
  gifts: [
    [
      "Nuestro viaje a La Palma",
      "A ver las estrellas. Cualquier aportación nos acerca.",
      "Lo que queráis",
    ],
    ["Un telescopio", "Para el balcón.", "260 €"],
    ["Una noche en un observatorio", "Para el primer aniversario.", "180 €"],
    ["Un mapa del cielo del día de la boda", "Enmarcado, para el salón.", "70 €"],
  ],
  kids: "Habrá monitores, telescopio y comida para ellos.",
  faq: [
    "¿De verdad creéis en el horóscopo?",
    "No. Pero esta vez acertó, así que le damos la razón.",
  ],
  guestbook: [
    ["Los de las casas colgadas", "Esta vez cuidado con los escalones, Rubén."],
    ["Abuela Encarna", "Yo ya lo sabía sin horóscopo."],
    ["Sergio y Alma", "Géminis los dos. Peligro en la pista de baile."],
  ],
  songs: ["Starman", "Dancing in the Moonlight", "Hoy", "September", "Valerie", "Dancing Queen"],
});

export const metro = wedding({
  id: "evt-demo-ainhoa-raul",
  first: "Ainhoa",
  second: "Raúl",
  date: "2027-05-29T13:00:00+02:00",
  rsvpDeadline: "2027-04-19T23:59:00+02:00",
  city: "Bilbao",
  region: "Bizkaia",
  couple: "olivar",
  coverPhoto: "/fotos/olivar/historia-2.jpg",
  cardMessage:
    "Coincidimos cada mañana en el mismo vagón durante un año sin hablarnos. Un día se averió el metro y no paramos de hablar.",
  welcomeMessage:
    "Nos casamos en Bilbao, en la ciudad del metro que nos juntó. Aquí tienes el plano y todas las paradas del día.",
  thankYouMessage:
    "Gracias por subir a nuestra línea y quedaros hasta el último tren. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia de San Antón",
      kind: "Ceremonia",
      address: "Calle Ribera, 1",
      note: "En el Casco Viejo, junto a la ría. La parada de metro más cercana es Zazpikaleak.",
      photo: "iglesia",
    },
    {
      id: "finca",
      name: "Palacio de la Ría",
      kind: "Aperitivo, comida y fiesta",
      address: "Muelle de Uribitarte, 4",
      note: "A 10 minutos andando por la ría. Los autobuses salen al terminar la ceremonia.",
      photo: "pista",
    },
  ],
  climate: [21, 12, 40],
  program: [
    ["13:00", "Ceremonia", "iglesia", "San Antón", "Con txalaparta a la salida.", "ceremony"],
    ["14:15", "Aperitivo", "finca", "Junto a la ría", "Pintxos, txakoli y gilda.", "cocktail"],
    [
      "16:00",
      "Comida",
      "finca",
      "En el salón del muelle",
      "Con el menú que elijas al confirmar.",
      "banquet",
    ],
    [
      "19:30",
      "Fiesta",
      "finca",
      "Última parada",
      "Barra libre y baile hasta el último metro.",
      "party",
    ],
  ],
  busRoutes: [
    ["getxo", "Getxo → Bilbao", "Estación de Algorta", "12:00", ["22:00", "02:00"], 55],
    ["donostia", "Donostia → Bilbao", "Estación de autobuses, Donostia", "11:00", ["02:00"], 30],
  ],
  menu: {
    carne: "Carrilleras al vino de Rioja",
    pescado: "Bacalao al pil pil",
    vegetariano: "Pimientos del piquillo rellenos de setas",
    vegano: "Porrusalda con verduras",
  },
  dressCode: {
    title: "Primavera en la ría",
    detail: "Rojo de línea, blanco y gris. Llueve a veces: paraguas a mano.",
    palette: [
      { name: "Rojo línea", hex: "#c21b2a" },
      { name: "Plano", hex: "#f6f6f4" },
      { name: "Rótulo", hex: "#1f2433" },
      { name: "Ría", hex: "#4a6a7a" },
    ],
    examples: [
      "Vestido de entretiempo y una gabardina.",
      "Traje gris o azul; la corbata, opcional.",
      "Ropa cómoda: habrá trenecito de juguete para ellos.",
    ],
  },
  accommodation: [
    ["Hotel Ría", "Junto al Casco Viejo", "Habitaciones reservadas hasta el 1 de abril."],
    ["Pensión Abando", "Junto a la estación", "Para los que vienen en tren."],
  ],
  story: {
    intro: "Un vagón, un año de silencio y una avería. Esta es la versión corta.",
    moments: [
      ["2019", "El vagón", "El mismo vagón cada mañana, sin decirnos ni hola.", "terraza"],
      [
        "2020",
        "La avería",
        "Cuarenta minutos parados en el túnel. Salimos con su número.",
        "olivos",
      ],
      [
        "2026",
        "La pedida",
        "En el andén de siempre, con el anillo en el bolsillo del abono.",
        "anilloMuro",
      ],
      ["Hoy", "Y ahora, la boda", "Próxima parada: la nuestra. Sube.", "olivar"],
    ],
  },
  gifts: [
    [
      "Nuestro viaje a Tokio",
      "A probar su metro. Cualquier aportación nos acerca.",
      "Lo que queráis",
    ],
    ["Un plano del metro enmarcado", "Para el pasillo.", "70 €"],
    ["Bicicletas para los dos", "Para cuando no haya metro.", "400 €"],
    ["Una cafetera italiana", "Para las mañanas antes del metro.", "60 €"],
  ],
  kids: "Habrá monitores, trenecito y comida para ellos.",
  faq: ["¿Se puede ir en metro?", "Sí: la parada Zazpikaleak está a dos minutos de la iglesia."],
  guestbook: [
    ["Los del vagón", "Os guardamos el asiento de siempre. Junto a la puerta."],
    ["Amona Begoña", "Qué bonito, hijos. En metro se conoce gente buena."],
    ["Unai y Maite", "Nos vemos en la última parada."],
  ],
  songs: [
    "Last Train to London",
    "Underground",
    "Txoriak txori",
    "September",
    "Valerie",
    "Dancing Queen",
  ],
});

export const equipaje = wedding({
  id: "evt-demo-berta-nico",
  first: "Berta",
  second: "Nico",
  date: "2027-09-04T19:00:00+02:00",
  rsvpDeadline: "2027-07-26T23:59:00+02:00",
  city: "Mahón",
  region: "Menorca",
  couple: "mar",
  coverPhoto: "/fotos/buganvilla/historia-2.jpg",
  cardMessage:
    "Nos intercambiaron las maletas en un aeropuerto. La de ella tenía su ropa; la de él, un billete a Menorca. Fuimos juntos.",
  welcomeMessage:
    "Nos casamos en Menorca, al final del viaje que empezó con una maleta equivocada. Aquí tienes la etiqueta y el itinerario.",
  thankYouMessage:
    "Gracias por hacer la maleta y venir hasta la isla. Aquí están vuestras fotos, con arena en los zapatos.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia de Santa María de Mahón",
      kind: "Ceremonia",
      address: "Plaça Constitució, 3",
      note: "En el centro de Mahón. Hay parking en la explanada.",
      photo: "ermitaMar",
    },
    {
      id: "finca",
      name: "Lloc de la Mar",
      kind: "Aperitivo, cena y fiesta",
      address: "Camí de Sant Felip, 12",
      note: "A 15 minutos, junto a una cala. Los autobuses salen al terminar.",
      photo: "terrazaMar",
    },
  ],
  climate: [28, 20, 10],
  program: [
    [
      "19:00",
      "Ceremonia",
      "iglesia",
      "Santa María",
      "Con el órgano grande de la iglesia.",
      "ceremony",
    ],
    [
      "20:15",
      "Aperitivo",
      "finca",
      "Frente a la cala",
      "Gin menorquín, queso de Mahón y sobrasada.",
      "cocktail",
    ],
    [
      "22:00",
      "Cena",
      "finca",
      "En el patio de la finca",
      "Con el menú que elijas al confirmar.",
      "banquet",
    ],
    ["00:00", "Fiesta", "finca", "Hasta el amanecer", "Barra libre, baile y pomada.", "party"],
  ],
  busRoutes: [
    ["aeropuerto", "Aeropuerto → Mahón", "Aeropuerto de Menorca", "17:30", ["03:00", "05:30"], 55],
    ["ciutadella-bus", "Ciutadella → Mahón", "Plaça dels Pins", "17:45", ["05:30"], 30],
  ],
  menu: {
    carne: "Cordero con hierbas de la isla",
    pescado: "Caldereta de langosta",
    vegetariano: "Oliaigua con higos",
    vegano: "Tumbet de verduras",
  },
  dressCode: {
    title: "Final de verano en la isla",
    detail: "Cuero, lino y azul de mar. Hay arena: avarcas o sandalias.",
    palette: [
      { name: "Cuero", hex: "#6b4226" },
      { name: "Cartón", hex: "#e9d7b0" },
      { name: "Mar", hex: "#2f6a8a" },
      { name: "Cal", hex: "#f8f1e2" },
    ],
    examples: [
      "Vestido de lino y avarcas.",
      "Camisa de lino y pantalón claro.",
      "Ropa de playa: habrá castillos de arena para ellos.",
    ],
  },
  accommodation: [
    ["Hotel del Puerto", "En el puerto de Mahón", "Habitaciones reservadas hasta el 15 de julio."],
    ["Casa rural Sant Felip", "Junto a la finca", "Para quedarse al baño del domingo."],
  ],
  story: {
    intro:
      "Una maleta equivocada, un billete a Menorca y un viaje juntos. Esta es la versión corta.",
    moments: [
      [
        "2019",
        "La maleta",
        "En la cinta, dos maletas iguales. Nos llevamos la equivocada los dos.",
        "cala",
      ],
      ["2021", "El viaje", "Un año entero con una maleta compartida.", "furgoneta"],
      [
        "2026",
        "La pedida",
        "En la cala, con el anillo dentro de la maleta de aquel día.",
        "anilloBarca",
      ],
      ["Hoy", "Y ahora, la boda", "Haz la maleta: el destino es Menorca.", "orilla"],
    ],
  },
  gifts: [
    ["Nuestro viaje a Japón", "Cualquier aportación nos acerca.", "Lo que queráis"],
    ["Dos maletas que no se confundan", "Una de cada color, por favor.", "260 €"],
    ["Un mapamundi para rascar", "Para ir marcando viajes.", "40 €"],
    ["Una cámara instantánea", "Para el álbum de viajes.", "120 €"],
  ],
  kids: "Habrá monitores, castillos de arena y cena para ellos.",
  faq: [
    "¿Cómo se llega a Menorca?",
    "En avión o en barco desde Barcelona; el autobús de la boda sale del aeropuerto.",
  ],
  guestbook: [
    ["Los del aeropuerto", "Esta vez etiquetad bien las maletas."],
    ["Iaia Margalida", "Qué bonita la isla para casarse. Traed sombrero."],
    ["Marc y Júlia", "Maleta hecha. Llegamos el viernes."],
  ],
  songs: [
    "Leaving on a Jet Plane",
    "Mediterráneo",
    "Viajando por el mundo",
    "September",
    "Valerie",
    "Dancing Queen",
  ],
});

export const fidelidad = wedding({
  id: "evt-demo-gema-alex",
  first: "Gema",
  second: "Álex",
  date: "2027-03-20T12:00:00+01:00",
  rsvpDeadline: "2027-02-08T23:59:00+01:00",
  city: "Oviedo",
  region: "Asturias",
  couple: "olivar",
  coverPhoto: "/fotos/olivar/historia-1.jpg",
  cardMessage:
    "Nos conocimos en la cola del café de la esquina. Nueve tarjetas llenas después, la décima es la boda.",
  welcomeMessage:
    "Nos casamos en Oviedo, a dos calles del café de siempre. Aquí tienes la tarjeta: el último sello lo pones tú.",
  thankYouMessage:
    "Gracias por venir a tomaros algo con nosotros. Esta vez invitó la casa. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia de San Isidoro",
      kind: "Ceremonia",
      address: "Plaza de la Constitución, 3",
      note: "En el centro, junto al Ayuntamiento. Hay parking en la calle Uría.",
      photo: "iglesia",
    },
    {
      id: "finca",
      name: "Café Casa del Reloj",
      kind: "Aperitivo, comida y fiesta",
      address: "Calle Gascona, 7",
      note: "A 5 minutos andando por el bulevar de la sidra.",
      photo: "patioOlivos",
    },
  ],
  climate: [14, 6, 45],
  program: [
    ["12:00", "Ceremonia", "iglesia", "San Isidoro", "Breve, con gaita a la salida.", "ceremony"],
    ["13:15", "Aperitivo", "finca", "En la barra", "Café, sidra y pinchos de la casa.", "cocktail"],
    [
      "15:00",
      "Comida",
      "finca",
      "En el salón del reloj",
      "Con el menú que elijas al confirmar.",
      "banquet",
    ],
    [
      "18:30",
      "Fiesta",
      "finca",
      "Con chocolate y churros",
      "Barra libre, baile y café para aguantar.",
      "party",
    ],
  ],
  busRoutes: [
    ["gijon", "Gijón → Oviedo", "Estación de autobuses, Gijón", "11:00", ["21:00", "01:00"], 55],
    ["aviles", "Avilés → Oviedo", "Estación de Avilés", "11:00", ["01:00"], 30],
  ],
  menu: {
    carne: "Cachopo de la casa con patatas",
    pescado: "Merluza a la sidra",
    vegetariano: "Pote de verduras con queso",
    vegano: "Fabes con verduras",
  },
  dressCode: {
    title: "Primavera de café",
    detail: "Crema, marrón café y rojo de sello. Puede llover: paraguas.",
    palette: [
      { name: "Café", hex: "#3a2416" },
      { name: "Crema", hex: "#f6efe2" },
      { name: "Sello", hex: "#a3402a" },
      { name: "Verde prado", hex: "#4f6b3a" },
    ],
    examples: [
      "Vestido de entretiempo y gabardina.",
      "Traje de lana; corbata opcional.",
      "Chubasquero: habrá taller de galletas para ellos.",
    ],
  },
  accommodation: [
    ["Hotel de la Reconquista", "En el centro", "Habitaciones reservadas hasta el 1 de febrero."],
    ["Pensión Gascona", "En el bulevar de la sidra", "Para quedarse al vermú del domingo."],
  ],
  story: {
    intro: "Una cola de café, un vaso cambiado y nueve tarjetas llenas. Esta es la versión corta.",
    moments: [
      ["2018", "La cola", "Nos dieron el café cambiado. Ninguno lo devolvió.", "olivos"],
      ["2021", "La terraza", "Un piso con terraza y una cafetera que no descansa.", "terraza"],
      ["2026", "La pedida", "En el café de siempre, con el anillo en la taza.", "anilloMuro"],
      ["Hoy", "Y ahora, la boda", "Falta un sello. Lo pones tú.", "olivar"],
    ],
  },
  gifts: [
    [
      "Nuestro viaje a Colombia",
      "A ver de dónde viene el café. Cualquier aportación nos acerca.",
      "Lo que queráis",
    ],
    ["Una cafetera de las buenas", "La de ahora ya no puede más.", "320 €"],
    ["Un molinillo de café", "Para hacerlo como en el café.", "90 €"],
    ["Tazas para doce", "Que siempre faltan.", "60 €"],
  ],
  kids: "Habrá monitores, taller de galletas y comida para ellos.",
  faq: [
    "¿Habrá café para aguantar?",
    "Toda la fiesta. Lo pone el café de siempre, que es quien nos presentó.",
  ],
  guestbook: [
    ["Los del café", "Os guardamos la mesa de la ventana. Y la tarjeta número diez."],
    ["Güelita Maruja", "Qué bonito. Y qué buen café hacen ahí."],
    ["Pelayo y Coral", "Un cortado para nosotros y un baile para los novios."],
  ],
  songs: [
    "Coffee",
    "Ojalá que llueva café",
    "La vie en rose",
    "September",
    "Valerie",
    "Dancing Queen",
  ],
});

export const diploma = wedding({
  id: "evt-demo-marina-adrian",
  first: "Marina",
  second: "Adrián",
  date: "2027-06-26T18:00:00+02:00",
  rsvpDeadline: "2027-05-17T23:59:00+02:00",
  city: "Santiago de Compostela",
  region: "A Coruña",
  couple: "olivar",
  coverPhoto: "/fotos/olivar/historia-1.jpg",
  cardMessage:
    "Nos conocimos en primero de carrera, compartiendo apuntes y nervios. Ahora nos graduamos en lo más difícil.",
  welcomeMessage:
    "Nos casamos en la ciudad donde estudiamos. Aquí tienes todo para el acto de graduación más bonito.",
  thankYouMessage:
    "Gracias por venir a nuestra graduación y por la tuna a la una de la mañana. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia de San Martín Pinario",
      kind: "Ceremonia",
      address: "Praza da Inmaculada, 3",
      note: "En la zona vieja, junto a la catedral. Mejor venir andando.",
      photo: "iglesia",
    },
    {
      id: "finca",
      name: "Pazo de Fonseca",
      kind: "Aperitivo, cena y fiesta",
      address: "Rúa do Franco, s/n",
      note: "A 5 minutos andando. El claustro de la antigua universidad.",
      photo: "patioOlivos",
    },
  ],
  climate: [24, 13, 25],
  program: [
    ["18:00", "Ceremonia", "iglesia", "San Martín Pinario", "Con coro universitario.", "ceremony"],
    ["19:15", "Aperitivo", "finca", "En el claustro", "Pulpo, empanada y albariño.", "cocktail"],
    [
      "21:00",
      "Cena",
      "finca",
      "En el aula magna",
      "Con el menú que elijas al confirmar.",
      "banquet",
    ],
    ["23:30", "Fiesta", "finca", "Con tuna", "Barra libre, tuna y baile hasta tarde.", "party"],
  ],
  busRoutes: [
    [
      "coruna",
      "A Coruña → Santiago",
      "Estación de autobuses, A Coruña",
      "16:30",
      ["02:00", "05:00"],
      55,
    ],
    ["vigo", "Vigo → Santiago", "Estación de Vigo-Urzaiz", "16:00", ["05:00"], 30],
  ],
  menu: {
    carne: "Ternera gallega asada",
    pescado: "Lubina con ajada",
    vegetariano: "Empanada de verduras y queso de tetilla",
    vegano: "Caldo gallego de verduras",
  },
  dressCode: {
    title: "Acto de graduación",
    detail: "Granate, crema y oro. Hay calles de piedra: tacón ancho.",
    palette: [
      { name: "Lazo granate", hex: "#7d1f2e" },
      { name: "Pergamino", hex: "#f9f2e0" },
      { name: "Sello de oro", hex: "#c99a3e" },
      { name: "Piedra", hex: "#8f8b80" },
    ],
    examples: [
      "Vestido de cóctel y un chal para el claustro.",
      "Traje oscuro; la beca, opcional.",
      "Elegantes: habrá orla de recuerdo para ellos.",
    ],
  },
  accommodation: [
    [
      "Hostal dos Reis Católicos",
      "En la plaza del Obradoiro",
      "Habitaciones reservadas hasta el 1 de mayo.",
    ],
    ["Pensión Franco", "Junto al pazo", "Céntrica y sencilla."],
  ],
  story: {
    intro: "Unos apuntes compartidos, una biblioteca y muchos exámenes. Esta es la versión corta.",
    moments: [
      [
        "2015",
        "Primero de carrera",
        "Ella le dejó los apuntes de Historia. Él nunca se los devolvió.",
        "olivos",
      ],
      [
        "2019",
        "La graduación",
        "Nos graduamos el mismo día. Él tropezó al subir a por el título.",
        "terraza",
      ],
      [
        "2026",
        "La pedida",
        "En el claustro de Fonseca, con el anillo dentro de un rollo de diploma.",
        "anilloMuro",
      ],
      ["Hoy", "Y ahora, la boda", "Falta la última asignatura. Ven a vernos aprobar.", "olivar"],
    ],
  },
  gifts: [
    ["Nuestro viaje a Oxford", "Cualquier aportación nos acerca.", "Lo que queráis"],
    ["Una estantería para los libros de carrera", "Que no caben.", "220 €"],
    ["Una pluma estilográfica para cada uno", "Para firmar el acta.", "120 €"],
    ["Un marco para el diploma", "Este, claro.", "60 €"],
  ],
  kids: "Habrá monitores, orla de recuerdo y cena para ellos.",
  faq: ["¿Habrá tuna?", "Sí, a medianoche. Es tradición en Santiago y no hay forma de evitarla."],
  guestbook: [
    ["Los de la residencia", "Os guardamos los apuntes de primero. Sin subrayar."],
    ["Avoa Lola", "Qué orgullo, rapaces. Matrícula de honor."],
    ["Brais y Noa", "Nos pedimos la canción de la tuna."],
  ],
  songs: ["Gaudeamus igitur", "Clavelitos", "Hoy", "September", "Valerie", "Dancing Queen"],
});

export const cromos = wedding({
  id: "evt-demo-cris-dani",
  first: "Cris",
  second: "Dani",
  date: "2027-07-03T19:00:00+02:00",
  rsvpDeadline: "2027-05-24T23:59:00+02:00",
  city: "Zaragoza",
  region: "Zaragoza",
  couple: "mar",
  coverPhoto: "/fotos/buganvilla/historia-1.jpg",
  cardMessage:
    "Nos conocimos cambiando cromos en el patio del colegio. Ella tenía el que le faltaba a él. Treinta años después, colección completa.",
  welcomeMessage:
    "Nos casamos en Zaragoza, donde empezó la colección. Aquí tienes el sobre con todos los cromos del día.",
  thankYouMessage:
    "Gracias por completar nuestra colección. Aquí están vuestras fotos; las repetidas, también.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia de San Pablo",
      kind: "Ceremonia",
      address: "Calle San Pablo, 42",
      note: "En el barrio de San Pablo. Mejor venir en tranvía.",
      photo: "iglesia",
    },
    {
      id: "finca",
      name: "Finca La Alfranca",
      kind: "Aperitivo, cena y fiesta",
      address: "Camino de la Alfranca, s/n",
      note: "A 15 minutos, junto al Ebro. Los autobuses salen al terminar la ceremonia.",
      photo: "pista",
    },
  ],
  climate: [33, 19, 5],
  program: [
    ["19:00", "Ceremonia", "iglesia", "San Pablo", "Con jota a la salida.", "ceremony"],
    [
      "20:15",
      "Aperitivo",
      "finca",
      "Junto al Ebro",
      "Ternasco en pinchos y vino de Cariñena.",
      "cocktail",
    ],
    ["22:00", "Cena", "finca", "En el jardín", "Con el menú que elijas al confirmar.", "banquet"],
    [
      "00:00",
      "Fiesta",
      "finca",
      "Con intercambio de cromos",
      "Barra libre, baile y álbum para firmar.",
      "party",
    ],
  ],
  busRoutes: [
    ["centro", "Zaragoza → Finca", "Plaza de España", "18:30", ["02:00", "05:00"], 55],
    ["huesca", "Huesca → Zaragoza", "Estación de Huesca", "17:00", ["05:00"], 30],
  ],
  menu: {
    carne: "Ternasco de Aragón con patatas",
    pescado: "Bacalao ajoarriero",
    vegetariano: "Borrajas con almejas (sin almejas)",
    vegano: "Pochas con verduras",
  },
  dressCode: {
    title: "Verano de colección",
    detail: "Colores de cromo: amarillo, rojo y blanco. Hace calor: ropa ligera.",
    palette: [
      { name: "Sobre rojo", hex: "#c21b2a" },
      { name: "Cromo", hex: "#ffd23f" },
      { name: "Álbum", hex: "#f7f4ec" },
      { name: "Naranja", hex: "#ff8a3d" },
    ],
    examples: [
      "Vestido de verano con un toque de color.",
      "Camisa de lino; la corbata, opcional.",
      "Ropa fresca: habrá sobres de cromos para ellos.",
    ],
  },
  accommodation: [
    ["Hotel Pilar", "Junto a la basílica", "Habitaciones reservadas hasta el 15 de mayo."],
    ["Albergue Alfranca", "Junto a la finca", "Para quedarse al día siguiente."],
  ],
  story: {
    intro: "Un patio de colegio, un cromo repetido y un cambio. Esta es la versión corta.",
    moments: [
      [
        "1996",
        "El cambio",
        "Él tenía tres repetidos; ella, el que le faltaba. Se lo cambió por los tres.",
        "cala",
      ],
      [
        "2015",
        "El reencuentro",
        "Nos volvimos a ver en una feria de coleccionistas. Ella aún tenía los tres.",
        "furgoneta",
      ],
      ["2026", "La pedida", "En un sobre de cromos, con el anillo dentro.", "anilloBarca"],
      ["Hoy", "Y ahora, la boda", "Colección completa. Solo faltas tú en el álbum.", "orilla"],
    ],
  },
  gifts: [
    ["Nuestro viaje a Japón", "Cualquier aportación nos acerca.", "Lo que queráis"],
    ["Un mueble para los álbumes", "Que ocupan media casa.", "260 €"],
    ["La colección de este año", "Sobres para los dos.", "60 €"],
    ["Un marco para el primer cromo", "El del patio.", "40 €"],
  ],
  kids: "Habrá monitores, sobres de cromos y cena para ellos.",
  faq: ["¿Habrá cromos de verdad?", "Sí: cada invitado recibe un sobre con los cromos de la boda."],
  guestbook: [
    ["Los del patio", "Seguimos teniendo repetidos. Os los cambiamos por un baile."],
    ["Yaya Pili", "Qué bonito, chiquetes. Ya era hora."],
    ["Jorge y Lucía", "Nos pedimos el cromo de los novios."],
  ],
  songs: ["La chica de ayer", "Cuéntame", "Mi gran noche", "September", "Valerie", "Dancing Queen"],
});

export const bombones = wedding({
  id: "evt-demo-olga-sergi",
  first: "Olga",
  second: "Sergi",
  date: "2027-02-13T13:00:00+01:00",
  rsvpDeadline: "2027-01-04T23:59:00+01:00",
  city: "Vic",
  region: "Barcelona",
  couple: "olivar",
  coverPhoto: "/fotos/olivar/historia-4.jpg",
  cardMessage:
    "Ella hacía bombones y él se comía los que salían feos. Nunca hubo tantos bombones feos como aquel invierno.",
  welcomeMessage:
    "Nos casamos la víspera de San Valentín, en Vic, con chocolate caliente y mantas. Aquí tienes la caja con todo lo que necesitas.",
  thankYouMessage:
    "Gracias por venir a probar nuestra caja más especial. Aquí están vuestras fotos, con chocolate incluido.",
  venues: [
    {
      id: "iglesia",
      name: "Catedral de Vic",
      kind: "Ceremonia",
      address: "Plaça de la Catedral, s/n",
      note: "En el centro histórico. Hay parking junto al mercado.",
      photo: "iglesia",
    },
    {
      id: "finca",
      name: "Mas de la Xocolata",
      kind: "Aperitivo, comida y fiesta",
      address: "Camí de Sant Bartomeu, 8",
      note: "A 10 minutos, entre campos. Hay chimenea y mantas.",
      photo: "cortijo",
    },
  ],
  climate: [11, 0, 15],
  program: [
    ["13:00", "Ceremonia", "iglesia", "La catedral", "Con coro y órgano.", "ceremony"],
    [
      "14:15",
      "Aperitivo",
      "finca",
      "Junto a la chimenea",
      "Fuet de Vic, coca y vermut.",
      "cocktail",
    ],
    [
      "16:00",
      "Comida",
      "finca",
      "En el salón de piedra",
      "Con el menú que elijas al confirmar.",
      "banquet",
    ],
    [
      "19:00",
      "Fiesta",
      "finca",
      "Con fuente de chocolate",
      "Barra libre, baile y bombones.",
      "party",
    ],
  ],
  busRoutes: [
    [
      "barcelona",
      "Barcelona → Vic",
      "Estació del Nord, Barcelona",
      "11:30",
      ["21:00", "01:00"],
      55,
    ],
    ["manlleu", "Manlleu → Vic", "Plaça Fra Bernadí", "12:15", ["01:00"], 30],
  ],
  menu: {
    carne: "Civet de jabalí con setas",
    pescado: "Bacalao con samfaina",
    vegetariano: "Canelones de setas con bechamel de trufa",
    vegano: "Escudella de verduras",
  },
  dressCode: {
    title: "Invierno de chocolate",
    detail: "Marrón chocolate, crema y dorado. Hace frío: abrigo y chal.",
    palette: [
      { name: "Chocolate", hex: "#3b1f17" },
      { name: "Crema", hex: "#f3e6d0" },
      { name: "Papel dorado", hex: "#d9b25e" },
      { name: "Frambuesa", hex: "#9b2c46" },
    ],
    examples: [
      "Vestido de manga larga y abrigo.",
      "Traje de lana; bufanda bienvenida.",
      "Abrigo: habrá taller de bombones para ellos.",
    ],
  },
  accommodation: [
    ["Parador de Vic-Sau", "Junto al pantano", "Habitaciones reservadas hasta el 1 de enero."],
    ["Hotel Vic Centre", "En la plaza Mayor", "Céntrico, a 5 minutos de la catedral."],
  ],
  story: {
    intro: "Un obrador, muchos bombones feos y un invierno largo. Esta es la versión corta.",
    moments: [
      [
        "2019",
        "El obrador",
        "Él entró a comprar una caja y salió con trabajo de catador.",
        "olivos",
      ],
      [
        "2021",
        "La casa",
        "Un piso encima del obrador, que huele a chocolate todo el año.",
        "terraza",
      ],
      [
        "2026",
        "La pedida",
        "En una caja de bombones, con el anillo en el hueco del praliné.",
        "anilloMuro",
      ],
      ["Hoy", "Y ahora, la boda", "La caja está lista. Ven a probarla.", "olivar"],
    ],
  },
  gifts: [
    [
      "Nuestro viaje a Bélgica",
      "A aprender de los maestros. Cualquier aportación nos acerca.",
      "Lo que queráis",
    ],
    ["Moldes nuevos para el obrador", "Que los viejos ya no dan más.", "180 €"],
    ["Una fuente de chocolate", "Para las fiestas de casa.", "120 €"],
    ["Un curso de chocolatería", "Para él, que solo sabe comérselos.", "200 €"],
  ],
  kids: "Habrá monitores, taller de bombones y comida para ellos.",
  faq: ["¿Habrá bombones para llevar?", "Sí: una cajita para cada invitado, hecha en el obrador."],
  guestbook: [
    ["Los del obrador", "Os guardamos los bombones feos. Son los más ricos."],
    ["Àvia Carme", "Qué boda tan dulce. Abrigaos, que en Vic hace frío."],
    ["Arnau y Mar", "Nos pedimos la fuente de chocolate."],
  ],
  songs: ["Sugar", "Chocolate", "Contigo", "September", "Valerie", "Dancing Queen"],
});

export const telefono = wedding({
  id: "evt-demo-pilar-hector",
  first: "Pilar",
  second: "Héctor",
  date: "2027-04-10T17:30:00+02:00",
  rsvpDeadline: "2027-03-01T23:59:00+01:00",
  city: "Teruel",
  region: "Teruel",
  couple: "olivar",
  coverPhoto: "/fotos/olivar/historia-1.jpg",
  cardMessage:
    "Nos conocimos por una llamada equivocada. Él quería pedir una pizza; ella le convenció para cenar con ella.",
  welcomeMessage:
    "Nos casamos en Teruel, la ciudad de los amantes. Marca nuestro número: aquí tienes todo lo que necesitas.",
  thankYouMessage:
    "Gracias por responder a nuestra llamada. Aquí están vuestras fotos; no cuelgues todavía.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia de San Pedro",
      kind: "Ceremonia",
      address: "Calle Hartzenbusch, 1",
      note: "Junto al mausoleo de los Amantes. Mejor venir andando.",
      photo: "iglesia",
    },
    {
      id: "finca",
      name: "Palacio de los Marcilla",
      kind: "Aperitivo, cena y fiesta",
      address: "Plaza del Torico, 6",
      note: "A 5 minutos andando por el centro.",
      photo: "patioOlivos",
    },
  ],
  climate: [17, 4, 25],
  program: [
    [
      "17:30",
      "Ceremonia",
      "iglesia",
      "San Pedro",
      "Con lectura de la leyenda de los Amantes.",
      "ceremony",
    ],
    [
      "18:45",
      "Aperitivo",
      "finca",
      "En el patio",
      "Jamón de Teruel y vino del Matarraña.",
      "cocktail",
    ],
    [
      "20:30",
      "Cena",
      "finca",
      "En el salón principal",
      "Con el menú que elijas al confirmar.",
      "banquet",
    ],
    [
      "23:00",
      "Fiesta",
      "finca",
      "Hasta la madrugada",
      "Barra libre, baile y centralita de mensajes.",
      "party",
    ],
  ],
  busRoutes: [
    [
      "zaragoza",
      "Zaragoza → Teruel",
      "Estación Delicias, Zaragoza",
      "15:00",
      ["02:00", "05:00"],
      55,
    ],
    ["valencia", "Valencia → Teruel", "Estación del Norte, Valencia", "15:00", ["05:00"], 30],
  ],
  menu: {
    carne: "Ternasco con patatas a lo pobre",
    pescado: "Bacalao con ajoarriero",
    vegetariano: "Migas con verduras",
    vegano: "Guiso de judías con verduras",
  },
  dressCode: {
    title: "Primavera de los Amantes",
    detail: "Rojo de teléfono, crema y gris. Tarde fresca: chaqueta.",
    palette: [
      { name: "Rojo baquelita", hex: "#7a1f2a" },
      { name: "Crema", hex: "#f8f1e4" },
      { name: "Metal", hex: "#b9b2a4" },
      { name: "Mudéjar", hex: "#2f6b6a" },
    ],
    examples: [
      "Vestido de entretiempo y chaqueta.",
      "Traje oscuro; corbata opcional.",
      "Abrigo: habrá teléfonos de juguete para ellos.",
    ],
  },
  accommodation: [
    ["Hotel Torico Plaza", "En el centro", "Habitaciones reservadas hasta el 1 de marzo."],
    ["Hostal Mudéjar", "Junto a la torre", "Sencillo y céntrico."],
  ],
  story: {
    intro:
      "Una llamada equivocada, una pizza que nunca llegó y una cena. Esta es la versión corta.",
    moments: [
      [
        "2019",
        "La llamada",
        "Marcó un número equivocado y ella contestó. Hablaron una hora.",
        "olivos",
      ],
      ["2021", "La casa", "Un piso con un teléfono antiguo que suena de verdad.", "terraza"],
      [
        "2026",
        "La pedida",
        "Por teléfono, desde la otra habitación. Ella dijo que sí antes de colgar.",
        "anilloMuro",
      ],
      ["Hoy", "Y ahora, la boda", "Marca el número: es nuestra fecha.", "olivar"],
    ],
  },
  gifts: [
    ["Nuestro viaje a Italia", "Cualquier aportación nos acerca.", "Lo que queráis"],
    ["Un teléfono antiguo restaurado", "Para el recibidor.", "150 €"],
    ["Una cena para dos", "Sin pizza.", "90 €"],
    ["Una vajilla de Teruel", "La de cerámica de siempre.", "220 €"],
  ],
  kids: "Habrá monitores, teléfonos de juguete y cena para ellos.",
  faq: [
    "¿Por qué un teléfono?",
    "Porque nos conocimos por una llamada equivocada. Y porque marcar la fecha es más bonito.",
  ],
  guestbook: [
    ["La pizzería", "Aún esperamos aquel pedido. Enhorabuena."],
    ["Abuela Carmen", "Qué bonito, hijos. Llamad más a menudo."],
    ["Iván y Rut", "Nos pedimos la primera llamada después de la boda."],
  ],
  songs: ["Call Me Maybe", "Hello", "Te llamo", "September", "Valerie", "Dancing Queen"],
});

export const radio = wedding({
  id: "evt-demo-silvia-javier",
  first: "Silvia",
  second: "Javier",
  date: "2027-10-09T18:00:00+02:00",
  rsvpDeadline: "2027-08-30T23:59:00+02:00",
  city: "Soria",
  region: "Soria",
  couple: "olivar",
  coverPhoto: "/fotos/olivar/historia-2.jpg",
  cardMessage:
    "Nos conocimos en una radio local: ella leía las noticias y él ponía la música. Esta es nuestra emisión más importante.",
  welcomeMessage:
    "Nos casamos en Soria, en otoño, entre chopos dorados. Sintoniza nuestra emisora: aquí tienes toda la programación.",
  thankYouMessage:
    "Gracias por quedaros en antena hasta el final. Aquí están vuestras fotos, con música de fondo.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia de San Juan de Rabanera",
      kind: "Ceremonia",
      address: "Calle Caballeros, 1",
      note: "En el centro de Soria. Hay parking en la plaza de Mariano Granados.",
      photo: "iglesia",
    },
    {
      id: "finca",
      name: "La Dehesa de la Radio",
      kind: "Aperitivo, cena y fiesta",
      address: "Paseo de San Prudencio, 14",
      note: "A 10 minutos, junto al Duero. Los autobuses salen al terminar.",
      photo: "cortijo",
    },
  ],
  climate: [18, 5, 30],
  program: [
    [
      "18:00",
      "Ceremonia",
      "iglesia",
      "San Juan de Rabanera",
      "Con la sintonía de la radio a la salida.",
      "ceremony",
    ],
    [
      "19:15",
      "Aperitivo",
      "finca",
      "Junto al Duero",
      "Torreznos, mantequilla de Soria y ribera.",
      "cocktail",
    ],
    [
      "21:00",
      "Cena",
      "finca",
      "En el salón de la dehesa",
      "Con el menú que elijas al confirmar.",
      "banquet",
    ],
    [
      "23:30",
      "Fiesta",
      "finca",
      "En antena hasta el amanecer",
      "Barra libre, DJ y dedicatorias en directo.",
      "party",
    ],
  ],
  busRoutes: [
    ["centro", "Soria → Dehesa", "Plaza Mayor", "17:30", ["02:00", "05:00"], 55],
    ["madrid", "Madrid → Soria", "Avenida de América, Madrid", "14:30", ["05:00"], 30],
  ],
  menu: {
    carne: "Asado de cordero con patatas",
    pescado: "Truchas a la soriana",
    vegetariano: "Revuelto de setas de Soria",
    vegano: "Guiso de setas y patatas",
  },
  dressCode: {
    title: "Otoño en el Duero",
    detail: "Madera, crema y rojo de aguja. Tarde fría: abrigo.",
    palette: [
      { name: "Madera", hex: "#8a5a2c" },
      { name: "Tela de altavoz", hex: "#d9c39a" },
      { name: "Aguja", hex: "#c21b2a" },
      { name: "Chopo dorado", hex: "#d9a441" },
    ],
    examples: [
      "Vestido de otoño y abrigo.",
      "Traje de lana o pana.",
      "Abrigo: habrá taller de radio para ellos.",
    ],
  },
  accommodation: [
    [
      "Parador de Soria",
      "Con vistas al Duero",
      "Habitaciones reservadas hasta el 1 de septiembre.",
    ],
    ["Hotel Leonor", "En el centro", "A 5 minutos de la iglesia."],
  ],
  story: {
    intro:
      "Una emisora local, un micrófono compartido y muchas canciones dedicadas. Esta es la versión corta.",
    moments: [
      [
        "2017",
        "La emisora",
        "Ella leía las noticias; él le dedicaba una canción cada día.",
        "terraza",
      ],
      ["2020", "El programa", "Un programa juntos los sábados por la mañana.", "olivos"],
      ["2026", "La pedida", "En directo, en mitad del programa. Media Soria lo oyó.", "anilloMuro"],
      ["Hoy", "Y ahora, la boda", "Sintoniza la emisora: estamos en antena.", "olivar"],
    ],
  },
  gifts: [
    ["Nuestro viaje a Londres", "Cualquier aportación nos acerca.", "Lo que queráis"],
    ["Una radio antigua restaurada", "Para el salón.", "180 €"],
    ["Un tocadiscos", "Para la música que no sale en la radio.", "220 €"],
    ["Unos auriculares buenos", "Para las madrugadas.", "140 €"],
  ],
  kids: "Habrá monitores, taller de radio y cena para ellos.",
  faq: [
    "¿Se pueden dedicar canciones?",
    "Sí: en la fiesta hay un micrófono para dedicatorias en directo.",
  ],
  guestbook: [
    ["Los de la emisora", "Os guardamos la sintonía. Seguimos en antena."],
    ["Abuelo Teodoro", "Os oía todos los sábados. Enhorabuena."],
    ["Rober y Marta", "Pedimos la canción del verano."],
  ],
  songs: [
    "Video Killed the Radio Star",
    "Radio Ga Ga",
    "La radio",
    "September",
    "Valerie",
    "Dancing Queen",
  ],
});

export const maquina = wedding({
  id: "evt-demo-carmen-lluis",
  first: "Carmen",
  second: "Lluís",
  date: "2027-05-01T12:00:00+02:00",
  rsvpDeadline: "2027-03-22T23:59:00+01:00",
  city: "Tarragona",
  region: "Tarragona",
  couple: "mar",
  coverPhoto: "/fotos/buganvilla/historia-4.jpg",
  cardMessage:
    "Nos escribíamos cartas a máquina desde dos ciudades. Él tecleaba con dos dedos; ella le corregía las faltas.",
  welcomeMessage:
    "Nos casamos en Tarragona, frente al Mediterráneo. Aquí tienes la carta, escrita a máquina, con todo lo que necesitas.",
  thankYouMessage:
    "Gracias por leernos hasta el final. Aquí están vuestras fotos, sin una sola falta.",
  venues: [
    {
      id: "iglesia",
      name: "Catedral de Tarragona",
      kind: "Ceremonia",
      address: "Pla de la Seu, s/n",
      note: "En lo alto de la Part Alta. Mejor venir andando.",
      photo: "iglesia",
    },
    {
      id: "finca",
      name: "Villa del Balcón",
      kind: "Aperitivo, cena y fiesta",
      address: "Passeig de les Palmeres, 2",
      note: "A 10 minutos andando, con vistas al mar.",
      photo: "terrazaMar",
    },
  ],
  climate: [21, 13, 20],
  program: [
    ["12:00", "Ceremonia", "iglesia", "La catedral", "Con coro y órgano.", "ceremony"],
    ["13:15", "Aperitivo", "finca", "En el balcón", "Vermut, anchoas y vistas al mar.", "cocktail"],
    [
      "15:00",
      "Cena",
      "finca",
      "En el salón de la villa",
      "Con el menú que elijas al confirmar.",
      "banquet",
    ],
    ["18:30", "Fiesta", "finca", "Hasta la noche", "Barra libre, baile y castells.", "party"],
  ],
  busRoutes: [
    [
      "barcelona",
      "Barcelona → Tarragona",
      "Estació de Sants, Barcelona",
      "10:30",
      ["21:00", "01:00"],
      55,
    ],
    ["reus", "Reus → Tarragona", "Estació de Reus", "11:15", ["01:00"], 30],
  ],
  menu: {
    carne: "Fricandó con setas",
    pescado: "Romesco de pescado",
    vegetariano: "Calçots con salsa romesco",
    vegano: "Escalivada con pan de coca",
  },
  dressCode: {
    title: "Primavera mediterránea",
    detail: "Verde máquina, crema y azul mar. Hay escaleras: calzado cómodo.",
    palette: [
      { name: "Verde máquina", hex: "#2f4f4a" },
      { name: "Papel", hex: "#fbf8f0" },
      { name: "Tinta", hex: "#1f1f1f" },
      { name: "Mediterráneo", hex: "#2f6a8a" },
    ],
    examples: [
      "Vestido de primavera; algo de abrigo para el balcón.",
      "Traje claro; corbata opcional.",
      "Ropa cómoda: habrá taller de cartas para ellos.",
    ],
  },
  accommodation: [
    [
      "Hotel Imperial Tarraco",
      "Junto al balcón del Mediterráneo",
      "Habitaciones reservadas hasta el 15 de marzo.",
    ],
    ["Hotel Part Alta", "Junto a la catedral", "Céntrico y tranquilo."],
  ],
  story: {
    intro: "Dos ciudades, una máquina de escribir y muchas cartas. Esta es la versión corta.",
    moments: [
      [
        "2018",
        "La primera carta",
        "Él le escribió a máquina para pedirle un libro. Ella le devolvió la carta corregida.",
        "cala",
      ],
      [
        "2021",
        "La mudanza",
        "Por fin en la misma ciudad, con la máquina en el salón.",
        "furgoneta",
      ],
      ["2026", "La pedida", "En una carta a máquina, sin faltas por primera vez.", "anilloBarca"],
      ["Hoy", "Y ahora, la boda", "La carta está escrita. Falta tu respuesta.", "orilla"],
    ],
  },
  gifts: [
    ["Nuestro viaje a Irlanda", "Cualquier aportación nos acerca.", "Lo que queráis"],
    ["Cintas nuevas para la máquina", "Que la de ahora ya no marca.", "40 €"],
    ["Papel de carta para un año", "Para seguir escribiéndonos.", "60 €"],
    ["Un escritorio de madera", "Para la máquina.", "320 €"],
  ],
  kids: "Habrá monitores, taller de cartas y comida para ellos.",
  faq: [
    "¿Podemos escribiros una carta?",
    "Sí: habrá una máquina de escribir en la fiesta para dejarnos un mensaje.",
  ],
  guestbook: [
    ["Los de la oficina de correos", "Echaremos de menos vuestras cartas. Enhorabuena."],
    ["Àvia Montse", "Qué bonito escribís los dos. Y qué bien os queréis."],
    ["Jan y Laia", "Os dejamos carta a máquina. Con faltas, para que la corrijas."],
  ],
  songs: [
    "Please Mr. Postman",
    "Mediterráneo",
    "Cartas amarillas",
    "September",
    "Valerie",
    "Dancing Queen",
  ],
});

export const puzle = wedding({
  id: "evt-demo-vera-tomas",
  first: "Ane",
  second: "Tomás",
  date: "2027-06-19T12:30:00+02:00",
  rsvpDeadline: "2027-05-10T23:59:00+02:00",
  city: "Vitoria-Gasteiz",
  region: "Álava",
  couple: "olivar",
  coverPhoto: "/fotos/olivar/portada.jpg",
  cardMessage:
    "Nos conocimos haciendo un puzle de mil piezas en una casa rural. Nos sobró una pieza y nos faltó otra. Ahora encajamos.",
  welcomeMessage:
    "Nos casamos en Vitoria, en verano, entre jardines. Aquí están todas las piezas del día.",
  thankYouMessage:
    "Gracias por ser una pieza imprescindible de nuestro día. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Catedral de Santa María",
      kind: "Ceremonia",
      address: "Plaza de Santa María, s/n",
      note: "En el casco medieval. Mejor venir andando o en tranvía.",
      photo: "iglesia",
    },
    {
      id: "finca",
      name: "Palacio de los Jardines",
      kind: "Aperitivo, cena y fiesta",
      address: "Paseo de la Senda, 3",
      note: "A 10 minutos, entre jardines. Los autobuses salen al terminar.",
      photo: "patioOlivos",
    },
  ],
  climate: [24, 12, 30],
  program: [
    ["12:30", "Ceremonia", "iglesia", "Santa María", "Con coro y txistu.", "ceremony"],
    ["13:45", "Aperitivo", "finca", "En el jardín", "Pintxos y vino de Rioja Alavesa.", "cocktail"],
    [
      "15:30",
      "Cena",
      "finca",
      "En el salón de los espejos",
      "Con el menú que elijas al confirmar.",
      "banquet",
    ],
    [
      "19:00",
      "Fiesta",
      "finca",
      "Hasta la noche",
      "Barra libre, baile y un puzle gigante para todos.",
      "party",
    ],
  ],
  busRoutes: [
    ["bilbao", "Bilbao → Vitoria", "Termibus, Bilbao", "11:00", ["22:00", "01:00"], 55],
    ["donostia", "Donostia → Vitoria", "Estación de autobuses, Donostia", "10:45", ["01:00"], 30],
  ],
  menu: {
    carne: "Carrilleras al vino tinto",
    pescado: "Bacalao al pil pil",
    vegetariano: "Pimientos rellenos de setas",
    vegano: "Pochas con verduras",
  },
  dressCode: {
    title: "Verano en el jardín",
    detail: "Azul cielo, gris y crema. Hay jardín: calzado cómodo.",
    palette: [
      { name: "Cielo", hex: "#2f5f8a" },
      { name: "Cartón", hex: "#ece7dd" },
      { name: "Carbón", hex: "#2d2a26" },
      { name: "Verde jardín", hex: "#4f6b3a" },
    ],
    examples: [
      "Vestido de verano; algo de abrigo por la tarde.",
      "Traje claro; corbata opcional.",
      "Ropa cómoda: habrá puzles para ellos.",
    ],
  },
  accommodation: [
    ["Hotel Silken Ciudad", "En el centro", "Habitaciones reservadas hasta el 1 de mayo."],
    ["Casa rural Senda", "Junto al palacio", "Para quedarse al domingo."],
  ],
  story: {
    intro: "Un puzle de mil piezas, una casa rural y una pieza de más. Esta es la versión corta.",
    moments: [
      [
        "2018",
        "El puzle",
        "Mil piezas, una mesa y dos desconocidos. Nos sobró una pieza y nos faltó otra.",
        "olivos",
      ],
      ["2021", "La casa", "Un salón entero dedicado a los puzles.", "terraza"],
      [
        "2026",
        "La pedida",
        "En un puzle de nuestra foto, con el anillo en la última pieza.",
        "anilloMuro",
      ],
      ["Hoy", "Y ahora, la boda", "Falta la última pieza: tú.", "olivar"],
    ],
  },
  gifts: [
    ["Nuestro viaje a Japón", "Cualquier aportación nos acerca.", "Lo que queráis"],
    ["Un puzle de cinco mil piezas", "Para el próximo invierno.", "60 €"],
    ["Una mesa de puzles", "Con cajones y luz.", "180 €"],
    ["Un marco grande", "Para el puzle de nuestra foto.", "70 €"],
  ],
  kids: "Habrá monitores, puzles y comida para ellos.",
  faq: [
    "¿Qué es el puzle gigante?",
    "Una foto nuestra en cien piezas: cada invitado pone la suya en la fiesta.",
  ],
  guestbook: [
    ["Los de la casa rural", "Encontramos la pieza que os faltaba. Os la llevamos."],
    ["Amona Itziar", "Qué bien encajáis los dos."],
    ["Iker y Leire", "Nos pedimos una esquina del puzle gigante."],
  ],
  songs: ["Piece by Piece", "Together", "Hoy", "September", "Valerie", "Dancing Queen"],
});

export const tarta = wedding({
  id: "evt-demo-rosa-julian",
  first: "Rosa",
  second: "Julián",
  date: "2027-05-22T13:00:00+02:00",
  rsvpDeadline: "2027-04-12T23:59:00+02:00",
  city: "Astorga",
  region: "León",
  couple: "olivar",
  coverPhoto: "/fotos/olivar/historia-4.jpg",
  cardMessage:
    "Nos conocimos en un concurso de tartas. Ella ganó; él se comió la suya entera. Esta es la tarta que haremos juntos.",
  welcomeMessage:
    "Nos casamos en Astorga, la ciudad del chocolate y los mantecados. Aquí tienes todos los pisos del día.",
  thankYouMessage:
    "Gracias por venir a probar nuestra tarta. Aquí están vuestras fotos, con nata incluida.",
  venues: [
    {
      id: "iglesia",
      name: "Catedral de Astorga",
      kind: "Ceremonia",
      address: "Plaza de la Catedral, s/n",
      note: "En el centro, junto al palacio de Gaudí. Mejor venir andando.",
      photo: "iglesia",
    },
    {
      id: "finca",
      name: "Obrador de la Muralla",
      kind: "Aperitivo, cena y fiesta",
      address: "Calle de la Muralla, 12",
      note: "A 5 minutos andando, junto a la muralla romana.",
      photo: "cortijo",
    },
  ],
  climate: [19, 6, 25],
  program: [
    ["13:00", "Ceremonia", "iglesia", "La catedral", "Con coro y órgano.", "ceremony"],
    [
      "14:15",
      "Aperitivo",
      "finca",
      "En el patio del obrador",
      "Cecina, mantecadas y vino del Bierzo.",
      "cocktail",
    ],
    [
      "16:00",
      "Cena",
      "finca",
      "En el salón de la muralla",
      "Con el menú que elijas al confirmar.",
      "banquet",
    ],
    [
      "19:00",
      "Fiesta",
      "finca",
      "Con la tarta",
      "Barra libre, baile y la tarta de tres pisos.",
      "party",
    ],
  ],
  busRoutes: [
    ["leon", "León → Astorga", "Estación de autobuses, León", "11:45", ["21:00", "01:00"], 55],
    ["ponferrada", "Ponferrada → Astorga", "Estación de Ponferrada", "11:30", ["01:00"], 30],
  ],
  menu: {
    carne: "Cocido maragato",
    pescado: "Bacalao al ajoarriero",
    vegetariano: "Pimientos asados del Bierzo con queso",
    vegano: "Garbanzos con verduras",
  },
  dressCode: {
    title: "Primavera de pastelería",
    detail: "Rosa de flor de azúcar, nata y bizcocho. Mañana fresca: chaqueta.",
    palette: [
      { name: "Flor de azúcar", hex: "#d98aa0" },
      { name: "Nata", hex: "#fffaf6" },
      { name: "Bizcocho", hex: "#e9c7a0" },
      { name: "Chocolate", hex: "#4a2a33" },
    ],
    examples: [
      "Vestido de primavera y chaqueta.",
      "Traje claro; corbata opcional.",
      "Ropa cómoda: habrá taller de magdalenas para ellos.",
    ],
  },
  accommodation: [
    ["Hotel Gaudí", "Frente al palacio", "Habitaciones reservadas hasta el 1 de abril."],
    ["Hostal La Peseta", "En el centro", "Famoso por su cocido."],
  ],
  story: {
    intro: "Un concurso de tartas, un premio y una tarta comida entera. Esta es la versión corta.",
    moments: [
      [
        "2019",
        "El concurso",
        "Ella ganó con una tarta de tres pisos. Él se comió la suya antes de que la juzgaran.",
        "olivos",
      ],
      ["2022", "El obrador", "Un obrador pequeño junto a la muralla.", "terraza"],
      ["2026", "La pedida", "En una tarta, con el anillo en el piso de arriba.", "anilloMuro"],
      ["Hoy", "Y ahora, la boda", "La tarta está lista. Solo falta cortarla contigo.", "olivar"],
    ],
  },
  gifts: [
    ["Nuestro viaje a Viena", "Cualquier aportación nos acerca.", "Lo que queráis"],
    ["Una batidora de las buenas", "Para el obrador de casa.", "300 €"],
    ["Moldes de tres pisos", "Para las tartas de los domingos.", "80 €"],
    ["Un curso de pastelería", "Para él.", "150 €"],
  ],
  kids: "Habrá monitores, taller de magdalenas y comida para ellos.",
  faq: ["¿Habrá tarta de verdad?", "De tres pisos, hecha por la novia. Se corta a las siete."],
  guestbook: [
    ["Los del concurso", "Esta vez dejad tarta para los demás."],
    ["Abuela Celia", "Qué dulces sois los dos."],
    ["Rubén y Ana", "Nos pedimos el piso de chocolate."],
  ],
  songs: ["Sugar", "Cake by the Ocean", "Hoy", "September", "Valerie", "Dancing Queen"],
});

export const taquilla = wedding({
  id: "evt-demo-lucas-amaia",
  first: "Amaia",
  second: "Lucas",
  date: "2027-11-20T18:00:00+01:00",
  rsvpDeadline: "2027-10-11T23:59:00+02:00",
  city: "Almería",
  region: "Almería",
  couple: "mar",
  coverPhoto: "/fotos/buganvilla/historia-2.jpg",
  cardMessage:
    "Nos conocimos en un cine de verano, en la última fila. La película era malísima; la compañía, no.",
  welcomeMessage:
    "Nos casamos en Almería, tierra de películas. Aquí tienes tu entrada para el estreno.",
  thankYouMessage:
    "Gracias por venir al estreno y aplaudir al final. Aquí están vuestras fotos, sin cortes.",
  venues: [
    {
      id: "iglesia",
      name: "Catedral de Almería",
      kind: "Ceremonia",
      address: "Plaza de la Catedral, 8",
      note: "En el centro. Hay parking en la Rambla.",
      photo: "iglesia",
    },
    {
      id: "finca",
      name: "Antiguo Cine Imperial",
      kind: "Aperitivo, cena y fiesta",
      address: "Paseo de Almería, 45",
      note: "A 5 minutos andando, en el antiguo cine restaurado.",
      photo: "pista",
    },
  ],
  climate: [22, 14, 10],
  program: [
    ["18:00", "Ceremonia", "iglesia", "La catedral", "Con coro y órgano.", "ceremony"],
    [
      "19:15",
      "Aperitivo",
      "finca",
      "En el vestíbulo del cine",
      "Palomitas, tapas y vino de la tierra.",
      "cocktail",
    ],
    [
      "21:00",
      "Cena",
      "finca",
      "En el patio de butacas",
      "Con el menú que elijas al confirmar.",
      "banquet",
    ],
    [
      "23:30",
      "Fiesta",
      "finca",
      "En la gran pantalla",
      "Barra libre, baile y la película de nuestra historia.",
      "party",
    ],
  ],
  busRoutes: [
    [
      "roquetas",
      "Roquetas → Almería",
      "Plaza de la Constitución, Roquetas",
      "17:00",
      ["02:00", "05:00"],
      55,
    ],
    ["granada", "Granada → Almería", "Estación de autobuses, Granada", "15:00", ["05:00"], 30],
  ],
  menu: {
    carne: "Cordero segureño con patatas",
    pescado: "Gallineta a la almeriense",
    vegetariano: "Gurullos con verduras",
    vegano: "Trigo con verduras de la huerta",
  },
  dressCode: {
    title: "Noche de estreno",
    detail: "Granate de butaca, crema y dorado. Alfombra roja opcional.",
    palette: [
      { name: "Butaca", hex: "#3a0f16" },
      { name: "Entrada", hex: "#f3dfc0" },
      { name: "Proyector", hex: "#e8b866" },
      { name: "Pantalla", hex: "#f6f2ea" },
    ],
    examples: [
      "Vestido de noche o de cóctel.",
      "Traje oscuro o esmoquin.",
      "Elegantes: habrá sesión de dibujos para ellos.",
    ],
  },
  accommodation: [
    ["Hotel Catedral", "Junto a la catedral", "Habitaciones reservadas hasta el 15 de octubre."],
    ["Hotel Paseo", "Frente al cine", "Para salir del estreno andando."],
  ],
  story: {
    intro: "Un cine de verano, una película malísima y la última fila. Esta es la versión corta.",
    moments: [
      [
        "2018",
        "La última fila",
        "Una película malísima y dos risas que no paraban. Nos echaron.",
        "cala",
      ],
      ["2021", "Los rodajes", "Un verano recorriendo los decorados del desierto.", "furgoneta"],
      [
        "2026",
        "La pedida",
        "En el cine de verano, con el anillo en el cubo de palomitas.",
        "anilloBarca",
      ],
      ["Hoy", "Y ahora, la boda", "Estreno mundial. Tu butaca te espera.", "orilla"],
    ],
  },
  gifts: [
    ["Nuestro viaje a Hollywood", "Cualquier aportación nos acerca.", "Lo que queráis"],
    ["Un proyector para casa", "Para las sesiones de los domingos.", "350 €"],
    ["Una máquina de palomitas", "Imprescindible.", "80 €"],
    ["Abono para el festival de cine", "Para los dos.", "120 €"],
  ],
  kids: "Habrá monitores, sesión de dibujos y cena para ellos.",
  faq: ["¿Habrá película?", "Sí: la de nuestra historia, en la pantalla del cine, a las doce."],
  guestbook: [
    ["Los del cine de verano", "Os guardamos la última fila. Esta vez, sin risas."],
    ["Abuela Encarna", "Qué bonito todo, como en las películas."],
    ["Pablo y Sara", "Pedimos palomitas dulces."],
  ],
  songs: ["Cinema Italiano", "Moon River", "Hoy", "September", "Valerie", "Dancing Queen"],
});

export const globo = wedding({
  id: "evt-demo-eva-marco",
  first: "Eva",
  second: "Marco",
  date: "2027-09-11T12:00:00+02:00",
  rsvpDeadline: "2027-08-02T23:59:00+02:00",
  city: "Piedrahíta",
  region: "Ávila",
  couple: "olivar",
  coverPhoto: "/fotos/olivar/historia-4.jpg",
  cardMessage:
    "Nos conocimos en un vuelo en globo al amanecer. Ella tenía miedo a las alturas; él le cogió la mano todo el viaje.",
  welcomeMessage:
    "Nos casamos en la sierra, donde despegan los globos. Aquí tienes el plan de vuelo del día.",
  thankYouMessage:
    "Gracias por subir con nosotros tan alto. Aquí están vuestras fotos, con vistas.",
  venues: [
    {
      id: "iglesia",
      name: "Ermita de la Virgen de la Sierra",
      kind: "Ceremonia",
      address: "Camino de la Ermita, s/n",
      note: "En lo alto del pueblo; hay aparcamiento junto a la ermita.",
      photo: "iglesia",
    },
    {
      id: "finca",
      name: "Finca El Despegue",
      kind: "Aperitivo, cena y fiesta",
      address: "Carretera de la Sierra, km 7",
      note: "A 10 minutos, en la pradera de donde salen los globos.",
      photo: "patioOlivos",
    },
  ],
  climate: [24, 10, 15],
  program: [
    ["12:00", "Ceremonia", "iglesia", "La ermita", "Breve, con vistas al valle.", "ceremony"],
    [
      "13:15",
      "Aperitivo",
      "finca",
      "En la pradera",
      "Vino, embutido de la sierra y un globo inflándose.",
      "cocktail",
    ],
    ["15:00", "Cena", "finca", "Bajo la carpa", "Con el menú que elijas al confirmar.", "banquet"],
    [
      "18:30",
      "Fiesta",
      "finca",
      "Hasta que anochezca",
      "Barra libre, baile y vuelos cautivos.",
      "party",
    ],
  ],
  busRoutes: [
    [
      "avila",
      "Ávila → Piedrahíta",
      "Estación de autobuses, Ávila",
      "10:45",
      ["21:00", "01:00"],
      55,
    ],
    ["madrid", "Madrid → Ávila", "Moncloa, Madrid", "09:00", ["01:00"], 30],
  ],
  menu: {
    carne: "Chuletón de Ávila",
    pescado: "Truchas del Tormes",
    vegetariano: "Patatas revolconas con setas",
    vegano: "Judías del Barco con verduras",
  },
  dressCode: {
    title: "Fin de verano en la sierra",
    detail: "Rojo y amarillo de globo, verde y crema. Pradera: calzado plano.",
    palette: [
      { name: "Rojo globo", hex: "#c8312b" },
      { name: "Amarillo", hex: "#f2c230" },
      { name: "Cielo", hex: "#8fb7d8" },
      { name: "Pradera", hex: "#7ea05a" },
    ],
    examples: [
      "Vestido de lino y chaqueta.",
      "Traje claro; sin corbata.",
      "Ropa cómoda: habrá vuelos cautivos para ellos.",
    ],
  },
  accommodation: [
    ["Hotel Sierra de Gredos", "En el pueblo", "Habitaciones reservadas hasta el 1 de agosto."],
    ["Casa rural El Despegue", "Junto a la finca", "Para el vuelo del domingo."],
  ],
  story: {
    intro: "Un globo, un amanecer y una mano que no soltó. Esta es la versión corta.",
    moments: [
      [
        "2019",
        "El vuelo",
        "Ella tenía miedo a las alturas. Él le cogió la mano durante una hora.",
        "olivos",
      ],
      ["2022", "La sierra", "Una casa con vistas a los globos de los domingos.", "terraza"],
      [
        "2026",
        "La pedida",
        "En la cesta, a mil metros. Ella dijo que sí sin mirar abajo.",
        "anilloMuro",
      ],
      ["Hoy", "Y ahora, la boda", "Suelta el lastre: subimos juntos.", "olivar"],
    ],
  },
  gifts: [
    ["Nuestro viaje a Capadocia", "Cualquier aportación nos acerca.", "Lo que queráis"],
    ["Un vuelo en globo para dos", "Para el primer aniversario.", "300 €"],
    ["Unos prismáticos", "Para ver los globos desde casa.", "90 €"],
    ["Una manta de picnic", "Para la pradera.", "50 €"],
  ],
  kids: "Habrá monitores, vuelos cautivos y comida para ellos.",
  faq: [
    "¿Se puede subir al globo?",
    "Sí: hay vuelos cautivos, atados al suelo, durante la fiesta.",
  ],
  guestbook: [
    ["Los del primer vuelo", "Esta vez la mano ya va cogida."],
    ["Abuela Rosario", "Yo me quedo en tierra, pero os veo subir."],
    ["Dani y Clara", "Nos pedimos el primer vuelo."],
  ],
  songs: ["Up Where We Belong", "Volar", "Hoy", "September", "Valerie", "Dancing Queen"],
});

export const nieve = wedding({
  id: "evt-demo-irene-pau",
  first: "Irene",
  second: "Pau",
  date: "2027-01-23T13:00:00+01:00",
  rsvpDeadline: "2026-12-14T23:59:00+01:00",
  city: "Jaca",
  region: "Huesca",
  couple: "olivar",
  coverPhoto: "/fotos/olivar/historia-2.jpg",
  cardMessage:
    "Nos conocimos en una estación de esquí, atrapados por una ventisca. Desde entonces, el invierno es nuestra estación.",
  welcomeMessage:
    "Nos casamos en Jaca, en pleno invierno. Agita la bola: aquí tienes todo lo que necesitas.",
  thankYouMessage:
    "Gracias por venir con nieve, frío y ganas de fiesta. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Catedral de Jaca",
      kind: "Ceremonia",
      address: "Plaza de San Pedro, 5",
      note: "En el centro. Llevad abrigo: la catedral es fresca.",
      photo: "iglesia",
    },
    {
      id: "finca",
      name: "Refugio de la Ciudadela",
      kind: "Aperitivo, cena y fiesta",
      address: "Avenida del Primer Viernes de Mayo, 2",
      note: "A 5 minutos andando, con chimenea y vistas a la nieve.",
      photo: "cortijo",
    },
  ],
  climate: [6, -3, 40],
  program: [
    [
      "13:00",
      "Ceremonia",
      "iglesia",
      "La catedral",
      "Con coro y villancicos de montaña.",
      "ceremony",
    ],
    ["14:15", "Aperitivo", "finca", "Junto a la chimenea", "Vino caliente y migas.", "cocktail"],
    [
      "16:00",
      "Cena",
      "finca",
      "En el salón del refugio",
      "Con el menú que elijas al confirmar.",
      "banquet",
    ],
    ["19:30", "Fiesta", "finca", "Hasta que nieve", "Barra libre, baile y chocolate.", "party"],
  ],
  busRoutes: [
    ["huesca", "Huesca → Jaca", "Estación de Huesca", "11:30", ["21:00", "01:00"], 55],
    ["zaragoza", "Zaragoza → Jaca", "Estación Delicias, Zaragoza", "10:30", ["01:00"], 30],
  ],
  menu: {
    carne: "Ternasco al horno con patatas",
    pescado: "Bacalao con tomate",
    vegetariano: "Borrajas con patata",
    vegano: "Potaje de montaña",
  },
  dressCode: {
    title: "Boda de invierno",
    detail: "Blanco nieve, azul y rojo. Hace frío: abrigo, gorro y botas.",
    palette: [
      { name: "Nieve", hex: "#f8fafb" },
      { name: "Azul invierno", hex: "#2f4a5e" },
      { name: "Casita roja", hex: "#b02a2a" },
      { name: "Abeto", hex: "#2f5a43" },
    ],
    examples: [
      "Vestido de manga larga y abrigo; botas permitidas.",
      "Traje de lana; bufanda.",
      "Ropa de nieve: habrá trineos para ellos.",
    ],
  },
  accommodation: [
    ["Hotel Jaca", "En el centro", "Habitaciones reservadas hasta el 1 de diciembre."],
    ["Albergue de la Ciudadela", "Junto al refugio", "Para quedarse a esquiar."],
  ],
  story: {
    intro: "Una ventisca, una cabaña y una noche de chocolate. Esta es la versión corta.",
    moments: [
      [
        "2018",
        "La ventisca",
        "Atrapados en una cabaña de la estación. Dos tazas de chocolate y una conversación larguísima.",
        "olivos",
      ],
      ["2021", "La montaña", "Un piso en Jaca para estar cerca de la nieve.", "terraza"],
      [
        "2026",
        "La pedida",
        "En lo alto de una pista, con el anillo dentro de un guante.",
        "anilloMuro",
      ],
      [
        "Hoy",
        "Y ahora, la boda",
        "Agita la bola: la fecha aparece cuando se posa la nieve.",
        "olivar",
      ],
    ],
  },
  gifts: [
    ["Nuestro viaje a Noruega", "Cualquier aportación nos acerca.", "Lo que queráis"],
    ["Unos esquís nuevos", "Para ella.", "300 €"],
    ["Una chimenea de leña", "Para las tardes de invierno.", "400 €"],
    ["Una bola de nieve de recuerdo", "Con nuestra foto.", "30 €"],
  ],
  kids: "Habrá monitores, trineos y comida para ellos.",
  faq: ["¿Y si nieva mucho?", "Mejor: los autobuses llevan cadenas y el refugio tiene chimenea."],
  guestbook: [
    ["Los de la cabaña", "Esta vez llevad más chocolate."],
    ["Yaya Pilar", "Abrigaos, que en Jaca hace frío de verdad."],
    ["Marc y Ona", "Nos pedimos el primer trineo."],
  ],
  songs: ["Let It Snow", "Winter Song", "Hoy", "September", "Valerie", "Dancing Queen"],
});

export const brindis = wedding({
  id: "evt-demo-lidia-oscar",
  first: "Lidia",
  second: "Óscar",
  date: "2027-12-31T19:00:00+01:00",
  rsvpDeadline: "2027-11-21T23:59:00+01:00",
  city: "Sant Sadurní d'Anoia",
  region: "Barcelona",
  couple: "mar",
  coverPhoto: "/fotos/buganvilla/historia-1.jpg",
  cardMessage:
    "Nos conocimos brindando por error con la copa del otro. Llevamos ocho años brindando por aquel error.",
  welcomeMessage:
    "Nos casamos en Nochevieja, entre bodegas de cava. Aquí tienes todo lo que necesitas para el brindis más largo.",
  thankYouMessage:
    "Gracias por empezar el año brindando con nosotros. Aquí están vuestras fotos, con burbujas.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia de Sant Sadurní",
      kind: "Ceremonia",
      address: "Plaça de l'Església, 1",
      note: "En el centro del pueblo. Hay parking junto a la estación.",
      photo: "iglesia",
    },
    {
      id: "finca",
      name: "Caves del Brindis",
      kind: "Aperitivo, cena y fiesta",
      address: "Carrer de les Caves, 12",
      note: "A 5 minutos, en una bodega de cava con salón de baile.",
      photo: "pista",
    },
  ],
  climate: [12, 2, 15],
  program: [
    ["19:00", "Ceremonia", "iglesia", "Sant Sadurní", "Con coro y órgano.", "ceremony"],
    [
      "20:15",
      "Aperitivo",
      "finca",
      "En la cava",
      "Visita a la bodega y cava de la casa.",
      "cocktail",
    ],
    [
      "21:45",
      "Cena",
      "finca",
      "En el salón de las barricas",
      "Con el menú que elijas al confirmar.",
      "banquet",
    ],
    [
      "23:30",
      "Fiesta",
      "finca",
      "Hasta el año que viene",
      "Uvas a medianoche, brindis y baile hasta el amanecer.",
      "party",
    ],
  ],
  busRoutes: [
    [
      "barcelona",
      "Barcelona → Sant Sadurní",
      "Plaça Espanya, Barcelona",
      "17:45",
      ["03:00", "06:00"],
      55,
    ],
    ["vilafranca", "Vilafranca → Sant Sadurní", "Estació de Vilafranca", "18:15", ["06:00"], 30],
  ],
  menu: {
    carne: "Canelones de Nochevieja",
    pescado: "Lubina con salsa de cava",
    vegetariano: "Risotto de setas al cava",
    vegano: "Verduras asadas con romesco",
  },
  dressCode: {
    title: "Nochevieja de gala",
    detail: "Oro, negro y lentejuelas. Es la noche más larga: zapatos cómodos.",
    palette: [
      { name: "Cava", hex: "#f3d27a" },
      { name: "Noche", hex: "#141024" },
      { name: "Lentejuela", hex: "#c9c2d8" },
      { name: "Burdeos", hex: "#7a1f2a" },
    ],
    examples: [
      "Vestido de fiesta, lentejuelas bienvenidas.",
      "Esmoquin o traje oscuro.",
      "De fiesta: habrá campanadas de mentira para ellos.",
    ],
  },
  accommodation: [
    [
      "Hotel de les Caves",
      "Junto a la bodega",
      "Habitaciones reservadas hasta el 15 de noviembre.",
    ],
    ["Hotel Vilafranca", "A 10 minutos", "Con traslado de vuelta incluido."],
  ],
  story: {
    intro:
      "Una copa cambiada, un brindis por error y ocho años de burbujas. Esta es la versión corta.",
    moments: [
      [
        "2019",
        "La copa",
        "Brindamos con la copa del otro sin darnos cuenta. Nos dio la risa.",
        "cala",
      ],
      ["2022", "La vendimia", "Un otoño entero en el Penedès, entre viñas.", "furgoneta"],
      ["2026", "La pedida", "En la cava, con el anillo dentro de la copa.", "anilloBarca"],
      ["Hoy", "Y ahora, la boda", "Las copas están servidas. Solo falta la tuya.", "orilla"],
    ],
  },
  gifts: [
    ["Nuestro viaje a Champaña", "Cualquier aportación nos acerca.", "Lo que queráis"],
    ["Copas de cristal tallado", "Para los brindis de casa.", "120 €"],
    ["Una caja de cava de reserva", "Para el primer aniversario.", "90 €"],
    ["Una nevera de vinos", "Para guardar las botellas.", "350 €"],
  ],
  kids: "Habrá monitores, campanadas de mentira y cena para ellos.",
  faq: ["¿Habrá uvas?", "Sí: doce, a medianoche, con las campanadas en la pantalla de la cava."],
  guestbook: [
    ["Los de la copa cambiada", "Esta vez cada uno con la suya. O no."],
    ["Àvia Núria", "Qué boda tan bonita para empezar el año."],
    ["Martí y Aina", "Nos pedimos el primer brindis del año."],
  ],
  songs: ["Celebration", "Champagne Supernova", "Hoy", "September", "Valerie", "Dancing Queen"],
});

export const cometa = wedding({
  id: "evt-demo-ariadna-ciro",
  first: "Ariadna",
  second: "Ciro",
  date: "2027-06-12T18:30:00+02:00",
  rsvpDeadline: "2027-05-01T23:59:00+02:00",
  city: "Tarifa",
  region: "Cádiz",
  couple: "mar",
  coverPhoto: "/fotos/buganvilla/historia-2.jpg",
  cardMessage:
    "Nos conocimos enredando nuestras cometas en la playa. Desde entonces no hemos soltado el hilo.",
  welcomeMessage:
    "Nos casamos donde sopla el viento. Aquí tienes todo lo que necesitas para volar con nosotros.",
  thankYouMessage:
    "Gracias por venir hasta el sur, por aguantar el levante y por bailar descalzos. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Ermita de la Luz",
      kind: "Ceremonia",
      address: "Camino de la Ermita, s/n",
      note: "Frente al mar, a las afueras. Hay sitio para aparcar junto a la ermita.",
      photo: "iglesia",
    },
    {
      id: "finca",
      name: "Chiringuito Las Cometas",
      kind: "Aperitivo, cena y fiesta",
      address: "Playa de Valdevaqueros, km 75",
      note: "En la misma playa, con carpa por si sopla el levante.",
      photo: "pista",
    },
  ],
  climate: [26, 18, 5],
  program: [
    [
      "18:30",
      "Ceremonia",
      "iglesia",
      "Ermita de la Luz",
      "Al aire libre, con el mar detrás.",
      "ceremony",
    ],
    [
      "19:45",
      "Aperitivo",
      "finca",
      "En la arena",
      "Con cometas para quien quiera echarlas a volar.",
      "cocktail",
    ],
    ["21:30", "Cena", "finca", "Bajo la carpa", "Con el menú que elijas al confirmar.", "banquet"],
    [
      "23:30",
      "Fiesta",
      "finca",
      "Hasta que amaine",
      "Música, hoguera y baile en la arena.",
      "party",
    ],
  ],
  busRoutes: [
    [
      "tarifa",
      "Tarifa → Valdevaqueros",
      "Puerta de Jerez, Tarifa",
      "18:00",
      ["02:00", "04:30"],
      15,
    ],
    ["algeciras", "Algeciras → Tarifa", "Estación de Algeciras", "17:30", ["04:30"], 30],
  ],
  menu: {
    carne: "Presa ibérica a la brasa",
    pescado: "Atún rojo de almadraba",
    vegetariano: "Arroz de verduras de la huerta",
    vegano: "Tartar de tomate y aguacate",
  },
  dressCode: {
    title: "Playa con viento",
    detail: "Blanco, azul y un toque rojo. Habrá arena y levante: nada de tacón fino.",
    palette: [
      { name: "Cielo", hex: "#9cc9e6" },
      { name: "Arena", hex: "#d9c79a" },
      { name: "Cometa", hex: "#e0533d" },
      { name: "Sol", hex: "#f2c230" },
    ],
    examples: [
      "Vestido fluido que no tema al viento.",
      "Lino claro y alpargatas.",
      "Un pañuelo para el pelo: el levante no perdona.",
    ],
  },
  accommodation: [
    [
      "Hotel Punta Paloma",
      "A 3 minutos de la playa",
      "Habitaciones reservadas hasta el 1 de mayo.",
    ],
    ["Hostal del Levante", "En el centro de Tarifa", "Con el autobús de vuelta en la puerta."],
  ],
  story: {
    intro:
      "Dos cometas enredadas, un hilo que no se soltó y siete veranos de viento. Esta es la versión corta.",
    moments: [
      [
        "2020",
        "Las cometas",
        "Se nos enredaron los hilos en la playa y tardamos una hora en soltarlos.",
        "cala",
      ],
      ["2023", "La furgoneta", "Un verano entero buscando viento por la costa.", "furgoneta"],
      ["2026", "La pedida", "Con el anillo atado a la cola de la cometa.", "anilloBarca"],
      ["Hoy", "Y ahora, la boda", "La cometa ya está en el aire. Solo faltas tú.", "orilla"],
    ],
  },
  gifts: [
    ["Nuestro viaje a Cabo Verde", "Cualquier aportación nos acerca.", "Lo que queráis"],
    ["Dos cometas de acrobacia", "Para seguir enredándonos.", "180 €"],
    ["Un curso de kitesurf", "Para atrevernos con el agua.", "250 €"],
    ["Una cámara acuática", "Para las fotos desde el mar.", "300 €"],
  ],
  kids: "Habrá monitores, castillos de arena y cometas pequeñas para ellos.",
  faq: ["¿Y si sopla mucho levante?", "Tenemos carpa y plan B en el salón del chiringuito."],
  guestbook: [
    ["Los del hilo enredado", "Por fin os casáis: ya era hora de atar ese nudo."],
    ["Abuela Pepa", "Qué bonito ver volar tantas cometas a la vez."],
    ["Lucía y Teo", "Nos pedimos el primer baile en la arena."],
  ],
  songs: ["Volare", "Sol, arena y mar", "Mediterráneo", "Valerie", "Dancing Queen", "Viva la vida"],
});

export const reloj = wedding({
  id: "evt-demo-miriam-saul",
  first: "Miriam",
  second: "Saúl",
  date: "2027-10-09T12:30:00+02:00",
  rsvpDeadline: "2027-09-01T23:59:00+02:00",
  city: "Ávila",
  region: "Ávila",
  couple: "olivar",
  coverPhoto: "/fotos/olivar/historia-2.jpg",
  cardMessage:
    "Nos conocimos en una relojería, esperando a que nos arreglaran el mismo reloj. Llevamos nueve años sin mirar la hora.",
  welcomeMessage:
    "La cuenta atrás ya ha empezado. Aquí tienes todo lo que necesitas para el día que llevamos esperando.",
  thankYouMessage:
    "Gracias por regalarnos vuestro tiempo, por cada baile y por quedaros hasta tarde. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia de San Vicente",
      kind: "Ceremonia",
      address: "Plaza de San Vicente, 1",
      note: "Junto a la muralla. Hay parking en la puerta de San Vicente.",
      photo: "iglesia",
    },
    {
      id: "finca",
      name: "Palacio del Reloj",
      kind: "Aperitivo, cena y fiesta",
      address: "Calle de los Caballeros, 9",
      note: "A 5 minutos andando, en un palacio con patio de piedra.",
      photo: "pista",
    },
  ],
  climate: [19, 7, 20],
  program: [
    ["12:30", "Ceremonia", "iglesia", "San Vicente", "Con cuarteto de cuerda.", "ceremony"],
    [
      "13:45",
      "Aperitivo",
      "finca",
      "En el patio",
      "Al sol de otoño, con vino de la tierra.",
      "cocktail",
    ],
    [
      "15:00",
      "Comida",
      "finca",
      "En el salón de los relojes",
      "Con el menú que elijas al confirmar.",
      "banquet",
    ],
    ["18:00", "Fiesta", "finca", "Sin mirar la hora", "Baile, barra libre y recena.", "party"],
  ],
  busRoutes: [
    ["madrid", "Madrid → Ávila", "Moncloa, Madrid", "10:30", ["21:00", "00:30"], 75],
    ["segovia-bus", "Segovia → Ávila", "Estación de autobuses de Segovia", "11:00", ["00:30"], 60],
  ],
  menu: {
    carne: "Chuletón de Ávila",
    pescado: "Bacalao confitado",
    vegetariano: "Judías del Barco con verduras",
    vegano: "Crema de calabaza y castañas",
  },
  dressCode: {
    title: "Otoño con hora",
    detail: "Tonos tierra, madera y oro. Hay calles de piedra: tacón ancho mejor.",
    palette: [
      { name: "Arena", hex: "#d9a441" },
      { name: "Nogal", hex: "#7a4a2c" },
      { name: "Cristal", hex: "#dcecf0" },
      { name: "Piedra", hex: "#b8a98e" },
    ],
    examples: [
      "Vestido midi en tonos tierra.",
      "Traje de lana fría con corbata mostaza.",
      "Una chaqueta: en Ávila refresca al caer la tarde.",
    ],
  },
  accommodation: [
    [
      "Parador de Ávila",
      "Dentro de la muralla",
      "Habitaciones reservadas hasta el 1 de septiembre.",
    ],
    ["Hotel Puerta del Alcázar", "A 5 minutos andando", "Con desayuno tarde para el domingo."],
  ],
  story: {
    intro:
      "Un reloj roto, una relojería y nueve años de minutos compartidos. Esta es la versión corta.",
    moments: [
      [
        "2018",
        "La relojería",
        "Llevábamos el mismo reloj a arreglar. Nos tocó esperar juntos.",
        "olivos",
      ],
      [
        "2021",
        "El primer piso",
        "Un reloj de pared en cada habitación. Ninguno en hora.",
        "terraza",
      ],
      ["2026", "La pedida", "Con el anillo dentro de un reloj de bolsillo.", "anilloMuro"],
      ["Hoy", "Y ahora, la boda", "Queda poca arena por caer. Solo faltas tú.", "olivar"],
    ],
  },
  gifts: [
    ["Nuestro viaje a Suiza", "Cualquier aportación nos acerca.", "Lo que queráis"],
    ["Un reloj de pared antiguo", "Que esta vez sí dé la hora.", "200 €"],
    ["Una vajilla para doce", "Para las comidas largas de domingo.", "180 €"],
    ["Un fin de semana sin reloj", "Para descansar después de la boda.", "300 €"],
  ],
  kids: "Habrá monitores, juegos en el patio y comida para ellos.",
  faq: [
    "¿A qué hora acaba?",
    "Cuando caiga el último grano. Habrá autobús de vuelta a las 21:00 y a las 00:30.",
  ],
  guestbook: [
    ["Los de la relojería", "Nueve años después, el reloj sigue en hora."],
    ["Tía Maribel", "Qué bien se está sin mirar el reloj."],
    ["Chema y Rut", "Nos pedimos la última hora de baile."],
  ],
  songs: ["Time After Time", "Reloj", "El tiempo", "September", "Valerie", "Dancing Queen"],
});

export const faro = wedding({
  id: "evt-demo-estela-unai",
  first: "Estela",
  second: "Unai",
  date: "2027-08-21T19:00:00+02:00",
  rsvpDeadline: "2027-07-10T23:59:00+02:00",
  city: "Comillas",
  region: "Cantabria",
  couple: "mar",
  coverPhoto: "/fotos/buganvilla/historia-4.jpg",
  cardMessage:
    "Nos conocimos una noche de niebla subiendo al faro. Él llevaba linterna; ella, el mapa.",
  welcomeMessage:
    "Nos casamos junto al Cantábrico, a la luz del faro. Aquí tienes todo lo que necesitas para llegar a buen puerto.",
  thankYouMessage:
    "Gracias por cruzar el norte para estar con nosotros, por la niebla y por bailar hasta el amanecer. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia de San Cristóbal",
      kind: "Ceremonia",
      address: "Plaza de la Iglesia, 2",
      note: "En lo alto del pueblo. Hay parking junto a la plaza.",
      photo: "iglesia",
    },
    {
      id: "finca",
      name: "Finca El Farero",
      kind: "Aperitivo, cena y fiesta",
      address: "Camino del Faro, 4",
      note: "A 10 minutos, en un acantilado con el faro de fondo.",
      photo: "pista",
    },
  ],
  climate: [23, 15, 25],
  program: [
    ["19:00", "Ceremonia", "iglesia", "San Cristóbal", "Con gaita y órgano.", "ceremony"],
    [
      "20:15",
      "Aperitivo",
      "finca",
      "En el acantilado",
      "Al atardecer, con anchoas y sidra.",
      "cocktail",
    ],
    [
      "21:45",
      "Cena",
      "finca",
      "En la carpa del faro",
      "Con el menú que elijas al confirmar.",
      "banquet",
    ],
    [
      "23:45",
      "Fiesta",
      "finca",
      "A la luz del faro",
      "Baile, hoguera y orujo para la niebla.",
      "party",
    ],
  ],
  busRoutes: [
    [
      "santander",
      "Santander → Comillas",
      "Plaza de Alfonso XIII, Santander",
      "18:00",
      ["02:30", "05:00"],
      50,
    ],
    [
      "san-vicente",
      "San Vicente → Comillas",
      "Puerto de San Vicente de la Barquera",
      "18:30",
      ["05:00"],
      20,
    ],
  ],
  menu: {
    carne: "Solomillo de ternera cántabra",
    pescado: "Merluza del Cantábrico",
    vegetariano: "Pastel de puerros y queso",
    vegano: "Pochas con verduras",
  },
  dressCode: {
    title: "Noche en la costa",
    detail: "Azul marino, blanco y oro. Por la noche refresca: trae chaqueta.",
    palette: [
      { name: "Noche", hex: "#0f1a33" },
      { name: "Luz", hex: "#ffe9a8" },
      { name: "Faro", hex: "#c8312b" },
      { name: "Espuma", hex: "#f4efe6" },
    ],
    examples: [
      "Vestido largo en azul noche.",
      "Traje marino con zapato cómodo para el césped.",
      "Un chal o chaqueta: el viento del norte sopla de noche.",
    ],
  },
  accommodation: [
    ["Hotel Marina de Comillas", "En el puerto", "Habitaciones reservadas hasta el 10 de julio."],
    ["Posada del Faro", "A 5 minutos de la finca", "Con desayuno de domingo con vistas."],
  ],
  story: {
    intro:
      "Una noche de niebla, un faro y ocho años siguiendo la misma luz. Esta es la versión corta.",
    moments: [
      ["2019", "El faro", "Subimos al faro una noche de niebla. Bajamos de la mano.", "cala"],
      ["2022", "La furgoneta", "Un verano recorriendo los faros del norte.", "furgoneta"],
      ["2026", "La pedida", "En lo alto del faro, con el haz de luz de testigo.", "anilloBarca"],
      ["Hoy", "Y ahora, la boda", "El faro ya está encendido. Solo faltas tú.", "orilla"],
    ],
  },
  gifts: [
    ["Nuestro viaje a Islandia", "Cualquier aportación nos acerca.", "Lo que queráis"],
    ["Una lámpara de faro", "Para el salón de casa.", "150 €"],
    ["Un velero de alquiler", "Para un día entero en el mar.", "280 €"],
    ["Dos chubasqueros buenos", "Para el norte, que nunca falla.", "120 €"],
  ],
  kids: "Habrá monitores, búsqueda del tesoro y cena para ellos.",
  faq: ["¿Y si hay niebla?", "Mejor: el faro se ve más. La carpa está cerrada y climatizada."],
  guestbook: [
    ["Los de la noche de niebla", "Qué suerte que aquella noche subierais al faro."],
    ["Aitona Jon", "Nunca había visto un faro tan bonito como esta boda."],
    ["Ione y Asier", "Nos pedimos el primer baile a la luz del faro."],
  ],
  songs: ["Lighthouse", "Mediterráneo", "La luz", "September", "Valerie", "Dancing Queen"],
});

export const musica = wedding({
  id: "evt-demo-celia-bosco",
  first: "Celia",
  second: "Bosco",
  date: "2027-04-24T13:00:00+02:00",
  rsvpDeadline: "2027-03-15T23:59:00+01:00",
  city: "Úbeda",
  region: "Jaén",
  couple: "olivar",
  coverPhoto: "/fotos/olivar/historia-1.jpg",
  cardMessage:
    "Nos conocimos en un anticuario, los dos queriendo la misma caja de música. Ahora es de los dos.",
  welcomeMessage:
    "Dale cuerda y escucha: suena nuestra canción. Aquí tienes todo lo que necesitas para bailarla con nosotros.",
  thankYouMessage:
    "Gracias por bailar con nosotros entre olivos y piedra dorada. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Sacra Capilla del Salvador",
      kind: "Ceremonia",
      address: "Plaza Vázquez de Molina, s/n",
      note: "En la plaza renacentista. Hay parking en la plaza de Andalucía.",
      photo: "ermitaOlivos",
    },
    {
      id: "finca",
      name: "Palacio de la Melodía",
      kind: "Aperitivo, comida y fiesta",
      address: "Calle Real, 21",
      note: "A 5 minutos andando, con patio de columnas y salón de baile.",
      photo: "patioOlivos",
    },
  ],
  climate: [23, 10, 25],
  program: [
    ["13:00", "Ceremonia", "iglesia", "El Salvador", "Con cuarteto de cuerda y piano.", "ceremony"],
    [
      "14:15",
      "Aperitivo",
      "finca",
      "En el patio",
      "Con aceite de la tierra y vino fino.",
      "cocktail",
    ],
    [
      "15:30",
      "Comida",
      "finca",
      "En el salón de baile",
      "Con el menú que elijas al confirmar.",
      "banquet",
    ],
    ["18:30", "Fiesta", "finca", "Al compás", "Primer baile con la melodía de la caja.", "party"],
  ],
  busRoutes: [
    ["jaen", "Jaén → Úbeda", "Estación de autobuses de Jaén", "11:45", ["21:00", "00:30"], 50],
    ["baeza", "Baeza → Úbeda", "Plaza del Pópulo, Baeza", "12:30", ["00:30"], 15],
  ],
  menu: {
    carne: "Cordero segureño",
    pescado: "Bacalao con pisto",
    vegetariano: "Andrajos de setas",
    vegano: "Pipirrana con aceite nuevo",
  },
  dressCode: {
    title: "Primavera de gala",
    detail: "Rosa empolvado, oro y marfil. Hay suelo de piedra: tacón ancho mejor.",
    palette: [
      { name: "Bailarina", hex: "#f2b8c6" },
      { name: "Oro", hex: "#c9a65d" },
      { name: "Marfil", hex: "#fdf7f8" },
      { name: "Vino", hex: "#7a2e3e" },
    ],
    examples: [
      "Vestido de tul o de seda.",
      "Traje claro con pajarita.",
      "Zapatos para bailar: habrá vals.",
    ],
  },
  accommodation: [
    ["Parador de Úbeda", "En la misma plaza", "Habitaciones reservadas hasta el 15 de marzo."],
    ["Hotel Palacio de Baeza", "A 10 minutos", "Con traslado de vuelta incluido."],
  ],
  story: {
    intro:
      "Una caja de música, un anticuario y siete años bailando la misma canción. Esta es la versión corta.",
    moments: [
      ["2020", "El anticuario", "Los dos queríamos la caja. Acabamos compartiendo café.", "olivos"],
      ["2022", "El primer vals", "En la boda de una prima, sin saber bailar.", "terraza"],
      ["2026", "La pedida", "Con el anillo dentro de la caja, sonando.", "anilloMuro"],
      ["Hoy", "Y ahora, la boda", "La caja ya tiene cuerda. Solo faltas tú.", "olivar"],
    ],
  },
  gifts: [
    ["Nuestro viaje a Viena", "Cualquier aportación nos acerca.", "Lo que queráis"],
    ["Clases de baile", "Para el próximo vals.", "150 €"],
    ["Un tocadiscos antiguo", "Para el salón.", "250 €"],
    ["Una vajilla de Úbeda", "Cerámica verde de la tierra.", "180 €"],
  ],
  kids: "Habrá monitores, cajas de música para pintar y comida para ellos.",
  faq: ["¿Hay que saber bailar?", "No: habrá vals, pero también de todo lo demás."],
  guestbook: [
    ["Los del anticuario", "Al final la caja fue de los dos. Como tenía que ser."],
    ["Abuela Amparo", "Qué bonito el vals. Me habéis hecho llorar."],
    ["Nacho y Leyre", "Nos pedimos la próxima canción."],
  ],
  songs: [
    "Vals del Emperador",
    "La vie en rose",
    "Moon River",
    "September",
    "Valerie",
    "Dancing Queen",
  ],
});

export const farolillo = wedding({
  id: "evt-demo-lorena-inaki",
  first: "Lorena",
  second: "Iñaki",
  date: "2027-07-17T20:00:00+02:00",
  rsvpDeadline: "2027-06-01T23:59:00+02:00",
  city: "Albarracín",
  region: "Teruel",
  couple: "olivar",
  coverPhoto: "/fotos/olivar/historia-4.jpg",
  cardMessage:
    "Nos conocimos soltando farolillos en una verbena. Pedimos el mismo deseo sin saberlo.",
  welcomeMessage:
    "Nos casamos al anochecer, entre murallas y farolillos. Aquí tienes todo lo que necesitas para pedir tu deseo con nosotros.",
  thankYouMessage:
    "Gracias por subir hasta Albarracín, por soltar vuestros farolillos y por bailar bajo las estrellas. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia de Santa María",
      kind: "Ceremonia",
      address: "Calle de Santa María, 1",
      note: "En lo alto del pueblo. Hay parking a la entrada, junto al río.",
      photo: "iglesia",
    },
    {
      id: "finca",
      name: "Masía de los Deseos",
      kind: "Aperitivo, cena y fiesta",
      address: "Camino del Guadalaviar, km 2",
      note: "A 5 minutos, con pradera para soltar los farolillos.",
      photo: "cortijo",
    },
  ],
  climate: [29, 13, 10],
  program: [
    ["20:00", "Ceremonia", "iglesia", "Santa María", "Al atardecer, con coro.", "ceremony"],
    ["21:15", "Aperitivo", "finca", "En la pradera", "Con jamón de Teruel y vino.", "cocktail"],
    [
      "22:30",
      "Cena",
      "finca",
      "Bajo las estrellas",
      "Con el menú que elijas al confirmar.",
      "banquet",
    ],
    [
      "00:30",
      "Fiesta",
      "finca",
      "Suelta de farolillos",
      "Un deseo cada uno y baile hasta tarde.",
      "party",
    ],
  ],
  busRoutes: [
    ["teruel", "Teruel → Albarracín", "Plaza del Torico, Teruel", "19:00", ["03:00", "05:00"], 40],
    ["valencia", "Valencia → Albarracín", "Estación de Joaquín Sorolla", "17:00", ["05:00"], 150],
  ],
  menu: {
    carne: "Ternasco de Aragón",
    pescado: "Trucha del Guadalaviar",
    vegetariano: "Pisto con huevo de corral",
    vegano: "Migas de verduras",
  },
  dressCode: {
    title: "Noche de verano",
    detail: "Colores cálidos al anochecer. En la sierra refresca de noche: trae chaqueta.",
    palette: [
      { name: "Farolillo", hex: "#ffb35c" },
      { name: "Noche", hex: "#1c1436" },
      { name: "Teja", hex: "#b5532a" },
      { name: "Luna", hex: "#f6ead8" },
    ],
    examples: [
      "Vestido largo en tonos cálidos.",
      "Traje de lino con chaqueta para la noche.",
      "Calzado cómodo: hay cuestas y pradera.",
    ],
  },
  accommodation: [
    [
      "Hotel Casa de Santiago",
      "En el casco antiguo",
      "Habitaciones reservadas hasta el 1 de junio.",
    ],
    ["Hostal de la Muralla", "A 5 minutos andando", "Con desayuno tarde para el domingo."],
  ],
  story: {
    intro:
      "Dos farolillos, un mismo deseo y seis años de noches de verano. Esta es la versión corta.",
    moments: [
      ["2021", "La verbena", "Soltamos el farolillo a la vez. Se fueron juntos.", "olivos"],
      ["2023", "La casa", "Un piso con terraza para ver las estrellas.", "terraza"],
      ["2026", "La pedida", "Con el anillo atado a un farolillo que no despegó.", "anilloMuro"],
      ["Hoy", "Y ahora, la boda", "La mecha está encendida. Solo faltas tú.", "olivar"],
    ],
  },
  gifts: [
    ["Nuestro viaje a Laponia", "Para ver auroras.", "Lo que queráis"],
    ["Un telescopio", "Para la terraza.", "300 €"],
    ["Una noche en un mirador de estrellas", "En Teruel, claro.", "180 €"],
    ["Farolillos para el aniversario", "Un deseo al año.", "60 €"],
  ],
  kids: "Habrá monitores, farolillos de papel para pintar y cena para ellos.",
  faq: [
    "¿Los farolillos son seguros?",
    "Son biodegradables y con permiso; los soltamos en la pradera, lejos del pinar.",
  ],
  guestbook: [
    ["Los de la verbena", "Ya sabemos qué deseo pedisteis."],
    ["Tío Ramón", "Qué noche más bonita. Y qué cielo."],
    ["Elena y Javi", "Nos pedimos el farolillo más grande."],
  ],
  songs: ["Starlight", "Fix You", "Lucía", "September", "Valerie", "Dancing Queen"],
});

export const barco = wedding({
  id: "evt-demo-maite-fermin",
  first: "Maite",
  second: "Fermín",
  date: "2027-09-25T17:30:00+02:00",
  rsvpDeadline: "2027-08-15T23:59:00+02:00",
  city: "Combarro",
  region: "Pontevedra",
  couple: "mar",
  coverPhoto: "/fotos/buganvilla/historia-3.jpg",
  cardMessage:
    "Nos conocimos haciendo barcos de papel en una boda ajena. El suyo flotó; el de ella, también.",
  welcomeMessage:
    "Nos casamos junto a la ría, entre hórreos y barcas. Aquí tienes todo lo que necesitas para llegar a buen puerto.",
  thankYouMessage:
    "Gracias por cruzar la ría con nosotros, por la queimada y por cada baile. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia de San Roque",
      kind: "Ceremonia",
      address: "Rúa San Roque, 2",
      note: "Junto a la ría. Hay parking a la entrada del pueblo.",
      photo: "ermitaMar",
    },
    {
      id: "finca",
      name: "Pazo do Peirao",
      kind: "Aperitivo, cena y fiesta",
      address: "Camiño do Peirao, 8",
      note: "A 5 minutos, con jardín sobre el agua y muelle propio.",
      photo: "terrazaMar",
    },
  ],
  climate: [22, 13, 30],
  program: [
    ["17:30", "Ceremonia", "iglesia", "San Roque", "Con gaita a la salida.", "ceremony"],
    [
      "18:45",
      "Aperitivo",
      "finca",
      "En el muelle",
      "Con marisco de la ría y albariño.",
      "cocktail",
    ],
    ["20:30", "Cena", "finca", "En el jardín", "Con el menú que elijas al confirmar.", "banquet"],
    [
      "23:00",
      "Fiesta",
      "finca",
      "Con queimada",
      "Conjuro, baile y barcos de papel en el agua.",
      "party",
    ],
  ],
  busRoutes: [
    [
      "pontevedra",
      "Pontevedra → Combarro",
      "Estación de Pontevedra",
      "16:45",
      ["01:30", "04:00"],
      20,
    ],
    ["vigo", "Vigo → Combarro", "Praza de América, Vigo", "16:15", ["04:00"], 45],
  ],
  menu: {
    carne: "Ternera gallega",
    pescado: "Rodaballo con ajada",
    vegetariano: "Empanada de verduras",
    vegano: "Grelos con patatas y pimentón",
  },
  dressCode: {
    title: "Ría de septiembre",
    detail: "Azul petróleo, blanco papel y verde ría. Puede llover: lleva paraguas bonito.",
    palette: [
      { name: "Papel", hex: "#fbfaf6" },
      { name: "Ría", hex: "#8fb7bd" },
      { name: "Petróleo", hex: "#1f3b44" },
      { name: "Hórreo", hex: "#b8a98e" },
    ],
    examples: [
      "Vestido midi con chaqueta ligera.",
      "Traje azul con zapato de cordones.",
      "Un paraguas: en Galicia, por si acaso.",
    ],
  },
  accommodation: [
    ["Hotel Peirao de Combarro", "En el puerto", "Habitaciones reservadas hasta el 15 de agosto."],
    ["Casa dos Hórreos", "A 5 minutos andando", "Con desayuno de domingo con vistas a la ría."],
  ],
  story: {
    intro:
      "Dos barcos de papel, una boda ajena y siete años navegando juntos. Esta es la versión corta.",
    moments: [
      ["2020", "Los barcos", "En la boda de unos amigos, en una fuente. Los dos flotaron.", "cala"],
      ["2023", "La furgoneta", "Un verano entero de rías en rías.", "furgoneta"],
      ["2026", "La pedida", "Con el anillo en un barco de papel, en la ría.", "anilloBarca"],
      ["Hoy", "Y ahora, la boda", "El barco ya está en el agua. Solo faltas tú.", "orilla"],
    ],
  },
  gifts: [
    ["Nuestro viaje a los fiordos", "Cualquier aportación nos acerca.", "Lo que queráis"],
    ["Un kayak doble", "Para seguir navegando juntos.", "400 €"],
    ["Una vajilla de Sargadelos", "Para las cenas de casa.", "200 €"],
    ["Una noche en un faro", "En la Costa da Morte.", "250 €"],
  ],
  kids: "Habrá monitores, barcos de papel para la fuente y cena para ellos.",
  faq: ["¿Y si llueve?", "Tenemos carpa sobre el jardín y paraguas para todos."],
  guestbook: [
    ["Los de la fuente", "Sabíamos que esos barcos llegarían a puerto."],
    ["Avoa Carmiña", "Que boda máis bonita, cariño."],
    ["Uxía y Brais", "Nos pedimos la queimada."],
  ],
  songs: ["Sailing", "Mar adentro", "Mediterráneo", "September", "Valerie", "Dancing Queen"],
});

export const prensado = wedding({
  id: "evt-demo-noelia-arturo",
  first: "Noelia",
  second: "Arturo",
  date: "2027-10-23T12:30:00+02:00",
  rsvpDeadline: "2027-09-15T23:59:00+02:00",
  city: "Baena",
  region: "Córdoba",
  couple: "olivar",
  coverPhoto: "/fotos/olivar/historia-3.jpg",
  cardMessage:
    "Nos conocimos en una recogida de aceituna. Ella guardó una rama en un libro; él, el número de ella.",
  welcomeMessage:
    "Nos casamos en plena cosecha, entre olivos centenarios. Aquí tienes todo lo que necesitas para acompañarnos.",
  thankYouMessage:
    "Gracias por venir al olivar, por probar el aceite nuevo y por bailar hasta tarde. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia de Santa María la Mayor",
      kind: "Ceremonia",
      address: "Calle Santa María, 3",
      note: "En lo alto del pueblo. Hay parking en el paseo.",
      photo: "ermitaOlivos",
    },
    {
      id: "finca",
      name: "Cortijo del Herbario",
      kind: "Aperitivo, comida y fiesta",
      address: "Carretera de Zuheros, km 6",
      note: "A 10 minutos, con almazara antigua y patio entre olivos.",
      photo: "cortijo",
    },
  ],
  climate: [21, 9, 20],
  program: [
    ["12:30", "Ceremonia", "iglesia", "Santa María la Mayor", "Con coro rociero.", "ceremony"],
    [
      "14:00",
      "Aperitivo",
      "finca",
      "En el patio",
      "Cata de aceite nuevo y vino de Montilla.",
      "cocktail",
    ],
    [
      "15:30",
      "Comida",
      "finca",
      "En la almazara",
      "Con el menú que elijas al confirmar.",
      "banquet",
    ],
    ["18:30", "Fiesta", "finca", "Entre olivos", "Baile, barra libre y recena.", "party"],
  ],
  busRoutes: [
    [
      "cordoba",
      "Córdoba → Baena",
      "Paseo de la Victoria, Córdoba",
      "11:15",
      ["21:00", "00:30"],
      60,
    ],
    ["lucena", "Lucena → Baena", "Plaza Nueva, Lucena", "11:45", ["00:30"], 35],
  ],
  menu: {
    carne: "Rabo de toro",
    pescado: "Bacalao con aceite de oliva virgen",
    vegetariano: "Salmorejo y berenjenas con miel",
    vegano: "Remojón de naranja y aceituna",
  },
  dressCode: {
    title: "Otoño en el olivar",
    detail: "Verde oliva, tierra y crema. Hay tierra y césped: mejor tacón ancho.",
    palette: [
      { name: "Oliva", hex: "#4f6145" },
      { name: "Aceituna", hex: "#3c3550" },
      { name: "Pliego", hex: "#fbf8ef" },
      { name: "Sepia", hex: "#6b5a3c" },
    ],
    examples: [
      "Vestido midi en verde o tierra.",
      "Traje de lino o lana fría.",
      "Una chaqueta para la tarde.",
    ],
  },
  accommodation: [
    [
      "Hotel Casa Grande",
      "En el centro de Baena",
      "Habitaciones reservadas hasta el 15 de septiembre.",
    ],
    ["Casa rural Los Olivos", "Junto a la finca", "Con desayuno de aceite y pan."],
  ],
  story: {
    intro:
      "Una rama de olivo guardada en un libro y ocho cosechas juntos. Esta es la versión corta.",
    moments: [
      ["2019", "La recogida", "Una mañana de aceituna, con las manos negras de vareo.", "olivos"],
      ["2022", "El cuaderno", "Empezamos un herbario con cada sitio al que viajábamos.", "terraza"],
      ["2026", "La pedida", "Con el anillo prensado entre dos hojas del cuaderno.", "anilloMuro"],
      ["Hoy", "Y ahora, la boda", "La rama sigue en el libro. Solo faltas tú.", "olivar"],
    ],
  },
  gifts: [
    ["Nuestro viaje a Creta", "Para ver olivos milenarios.", "Lo que queráis"],
    ["Un olivo para el jardín", "Que crezca con nosotros.", "120 €"],
    ["Una prensa de flores", "Para seguir llenando el herbario.", "60 €"],
    ["Una cata de aceites", "Para aprender de lo nuestro.", "90 €"],
  ],
  kids: "Habrá monitores, un taller de herbario y comida para ellos.",
  faq: ["¿Habrá aceite para llevar?", "Sí: una botella de aceite nuevo para cada familia."],
  guestbook: [
    ["Los de la recogida", "Quién os iba a decir que esa rama acabaría en boda."],
    ["Abuelo Rafael", "El mejor aceite y la mejor boda del pueblo."],
    ["Pilar y Andrés", "Nos pedimos una rama para nuestro herbario."],
  ],
  songs: ["Olivo", "La bien pagá", "Corazón contento", "September", "Valerie", "Dancing Queen"],
});

export const cartas = wedding({
  id: "evt-demo-ruth-gabriel",
  first: "Ruth",
  second: "Gabriel",
  date: "2027-05-15T18:00:00+02:00",
  rsvpDeadline: "2027-04-01T23:59:00+02:00",
  city: "Sigüenza",
  region: "Guadalajara",
  couple: "olivar",
  coverPhoto: "/fotos/olivar/pareja.jpg",
  cardMessage:
    "Durante un año nos escribimos cartas sin conocernos. La primera vez que nos vimos ya sabíamos todo.",
  welcomeMessage:
    "Esta es nuestra última carta antes de la boda. Aquí tienes todo lo que necesitas para venir.",
  thankYouMessage:
    "Gracias por venir a Sigüenza y por escribirnos en el libro de firmas. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Catedral de Sigüenza",
      kind: "Ceremonia",
      address: "Plaza Mayor, s/n",
      note: "En el centro. Hay parking en la Alameda.",
      photo: "iglesia",
    },
    {
      id: "finca",
      name: "Casona del Escribano",
      kind: "Aperitivo, cena y fiesta",
      address: "Travesaña Alta, 14",
      note: "A 5 minutos andando, con jardín y salón de piedra.",
      photo: "patioOlivos",
    },
  ],
  climate: [20, 7, 30],
  program: [
    ["18:00", "Ceremonia", "iglesia", "La catedral", "Con órgano y lectura de cartas.", "ceremony"],
    [
      "19:30",
      "Aperitivo",
      "finca",
      "En el jardín",
      "Con buzón para cartas a los novios.",
      "cocktail",
    ],
    [
      "21:00",
      "Cena",
      "finca",
      "En el salón de piedra",
      "Con el menú que elijas al confirmar.",
      "banquet",
    ],
    ["23:30", "Fiesta", "finca", "Hasta el último sello", "Baile y barra libre.", "party"],
  ],
  busRoutes: [
    ["madrid", "Madrid → Sigüenza", "Avenida de América, Madrid", "16:00", ["01:30", "04:00"], 105],
    ["guadalajara", "Guadalajara → Sigüenza", "Estación de Guadalajara", "16:45", ["04:00"], 60],
  ],
  menu: {
    carne: "Cabrito asado",
    pescado: "Trucha escabechada",
    vegetariano: "Migas de pastor con huevo",
    vegano: "Pisto manchego",
  },
  dressCode: {
    title: "Tarde de primavera",
    detail: "Papel, sepia y burdeos. Hay calles empedradas: tacón ancho.",
    palette: [
      { name: "Papel", hex: "#faf5ec" },
      { name: "Sepia", hex: "#6b5a3c" },
      { name: "Lacre", hex: "#7a1f2a" },
      { name: "Tinta", hex: "#2e2116" },
    ],
    examples: [
      "Vestido de flores pequeñas.",
      "Traje con chaleco.",
      "Una chaqueta: en Sigüenza refresca al caer la tarde.",
    ],
  },
  accommodation: [
    ["Parador de Sigüenza", "En el castillo", "Habitaciones reservadas hasta el 1 de abril."],
    ["Hostal de la Alameda", "A 5 minutos andando", "Con desayuno tarde para el domingo."],
  ],
  story: {
    intro:
      "Ciento doce cartas, un año sin vernos y una estación de tren. Esta es la versión corta.",
    moments: [
      [
        "2019",
        "La primera carta",
        "Un intercambio de cartas entre desconocidos. Nos tocó juntos.",
        "olivos",
      ],
      [
        "2020",
        "La estación",
        "Nos vimos por primera vez en el andén. Ya lo sabíamos todo.",
        "terraza",
      ],
      ["2026", "La pedida", "En la carta número ciento doce.", "anilloMuro"],
      ["Hoy", "Y ahora, la boda", "Esta es la última carta. Solo faltas tú.", "olivar"],
    ],
  },
  gifts: [
    ["Nuestro viaje a Edimburgo", "Cualquier aportación nos acerca.", "Lo que queráis"],
    ["Una pluma estilográfica", "Para las cartas que quedan.", "120 €"],
    ["Un escritorio antiguo", "Para escribirlas.", "300 €"],
    ["Papel de carta y sellos", "Para un año entero.", "50 €"],
  ],
  kids: "Habrá monitores, un taller de cartas y cena para ellos.",
  faq: [
    "¿Qué es el buzón?",
    "Escribidnos una carta en el aperitivo: la abriremos en nuestro primer aniversario.",
  ],
  guestbook: [
    ["Los del intercambio", "Sabíamos que esas cartas acabarían así."],
    ["Tía Consuelo", "Qué bonito leer vuestras cartas en la ceremonia."],
    ["Bea y Óliver", "Os escribimos la carta más larga del buzón."],
  ],
  songs: [
    "Please Mr. Postman",
    "Te escribo desde el tren",
    "Cartas amarillas",
    "September",
    "Valerie",
    "Dancing Queen",
  ],
});

export const ramo = wedding({
  id: "evt-demo-patricia-simon",
  first: "Patricia",
  second: "Simón",
  date: "2027-06-26T19:30:00+02:00",
  rsvpDeadline: "2027-05-15T23:59:00+02:00",
  city: "Sóller",
  region: "Mallorca",
  couple: "mar",
  coverPhoto: "/fotos/buganvilla/portada.jpg",
  cardMessage:
    "Ella cogió el ramo en la boda de su prima. Él estaba justo detrás, intentando esquivarlo.",
  welcomeMessage:
    "Esta vez el ramo es nuestro, y ya sabemos a quién se lo vamos a lanzar. Aquí tienes todo para venir.",
  thankYouMessage:
    "Gracias por venir a Sóller, por los naranjos y por pelearos por el ramo. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia de Sant Bartomeu",
      kind: "Ceremonia",
      address: "Plaça de la Constitució, 1",
      note: "En la plaza. Hay parking junto a la estación del tren.",
      photo: "ermitaMar",
    },
    {
      id: "finca",
      name: "Finca dels Tarongers",
      kind: "Aperitivo, cena y fiesta",
      address: "Camí de Sa Figuera, 5",
      note: "A 10 minutos, entre naranjos y con vistas al valle.",
      photo: "terrazaMar",
    },
  ],
  climate: [28, 18, 5],
  program: [
    ["19:30", "Ceremonia", "iglesia", "Sant Bartomeu", "Con cuarteto de cuerda.", "ceremony"],
    ["20:45", "Aperitivo", "finca", "Entre naranjos", "Con zumo de Sóller y cava.", "cocktail"],
    ["22:00", "Cena", "finca", "En la terraza", "Con el menú que elijas al confirmar.", "banquet"],
    ["00:00", "Fiesta", "finca", "Lanzamiento del ramo", "Y baile hasta que amanezca.", "party"],
  ],
  busRoutes: [
    ["palma", "Palma → Sóller", "Plaça d'Espanya, Palma", "18:30", ["02:30", "05:00"], 35],
    [
      "port",
      "Port de Sóller → Sóller",
      "Parada del tranvía, Port de Sóller",
      "19:00",
      ["05:00"],
      10,
    ],
  ],
  menu: {
    carne: "Cordero mallorquín",
    pescado: "Gallo de San Pedro con sobrasada",
    vegetariano: "Tumbet",
    vegano: "Coca de trampó",
  },
  dressCode: {
    title: "Verano entre naranjos",
    detail: "Blanco roto, rosa y verde. Hay césped: sandalias planas mejor.",
    palette: [
      { name: "Azahar", hex: "#fffaf7" },
      { name: "Peonía", hex: "#e8a7b3" },
      { name: "Tallo", hex: "#a9c09a" },
      { name: "Frambuesa", hex: "#9c3a4c" },
    ],
    examples: [
      "Vestido largo y fluido.",
      "Traje de lino claro.",
      "Manos libres a medianoche: se lanza el ramo.",
    ],
  },
  accommodation: [
    [
      "Hotel Ses Tarongers",
      "En el centro de Sóller",
      "Habitaciones reservadas hasta el 15 de mayo.",
    ],
    ["Hostal del Port", "En el Port de Sóller", "Con el tranvía a la puerta."],
  ],
  story: {
    intro:
      "Un ramo cogido al vuelo, un esquive fallido y seis años juntos. Esta es la versión corta.",
    moments: [
      ["2021", "El ramo", "Ella lo cogió; él se lo llevó en la cara.", "cala"],
      ["2023", "La casa", "Un piso con naranjo en el patio.", "furgoneta"],
      ["2026", "La pedida", "Con el anillo atado al ramo de aquella boda, seco.", "anilloBarca"],
      ["Hoy", "Y ahora, la boda", "El ramo ya está listo. Solo faltas tú.", "orilla"],
    ],
  },
  gifts: [
    ["Nuestro viaje a Japón", "Para ver los cerezos.", "Lo que queráis"],
    ["Un naranjo para el patio", "El segundo.", "90 €"],
    ["Clases de cerámica", "Para hacer nuestros jarrones.", "150 €"],
    ["Un ramo cada aniversario", "Durante cinco años.", "200 €"],
  ],
  kids: "Habrá monitores, una búsqueda de flores y cena para ellos.",
  faq: [
    "¿Quién puede coger el ramo?",
    "Cualquiera que se atreva. Hay ramo de repuesto, por si acaso.",
  ],
  guestbook: [
    ["La prima del ramo", "De nada, de verdad."],
    ["Padrina Aina", "Quina boda més bonica."],
    ["Rocío y Dani", "Esta vez nos ponemos delante."],
  ],
  songs: ["Flowers", "Bailando", "La flor de la canela", "September", "Valerie", "Dancing Queen"],
});

export const anillos = wedding({
  id: "evt-demo-alicia-ramiro",
  first: "Alicia",
  second: "Ramiro",
  date: "2027-11-13T13:00:00+01:00",
  rsvpDeadline: "2027-10-01T23:59:00+02:00",
  city: "Chinchilla de Montearagón",
  region: "Albacete",
  couple: "olivar",
  coverPhoto: "/fotos/olivar/historia-2.jpg",
  cardMessage:
    "Nos conocimos en el taller de un joyero: ella aprendía a grabar; él traía un anillo para arreglar.",
  welcomeMessage:
    "Los anillos ya están grabados. Aquí tienes todo lo que necesitas para venir a verlos puestos.",
  thankYouMessage:
    "Gracias por subir a Chinchilla, por el castillo y por cada baile. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia de Santa María del Salvador",
      kind: "Ceremonia",
      address: "Plaza de la Constitución, 1",
      note: "En la plaza Mayor. Hay parking a la entrada del pueblo.",
      photo: "iglesia",
    },
    {
      id: "finca",
      name: "Palacete del Joyero",
      kind: "Aperitivo, comida y fiesta",
      address: "Calle de la Reina, 30",
      note: "A 5 minutos, bajo el castillo y con salón de espejos.",
      photo: "patioOlivos",
    },
  ],
  climate: [15, 4, 30],
  program: [
    ["13:00", "Ceremonia", "iglesia", "Santa María", "Con cuarteto de cuerda.", "ceremony"],
    [
      "14:15",
      "Aperitivo",
      "finca",
      "En el invernadero",
      "Con queso manchego y vino de la tierra.",
      "cocktail",
    ],
    [
      "15:30",
      "Comida",
      "finca",
      "En el salón de espejos",
      "Con el menú que elijas al confirmar.",
      "banquet",
    ],
    ["18:30", "Fiesta", "finca", "Bajo la lámpara", "Baile, barra libre y recena.", "party"],
  ],
  busRoutes: [
    ["albacete", "Albacete → Chinchilla", "Estación de Albacete", "12:15", ["21:00", "00:30"], 20],
    ["hellin", "Hellín → Chinchilla", "Plaza de la Iglesia, Hellín", "11:45", ["00:30"], 45],
  ],
  menu: {
    carne: "Faisán con castañas",
    pescado: "Merluza en salsa verde",
    vegetariano: "Pisto manchego con huevo",
    vegano: "Crema de calabaza y setas",
  },
  dressCode: {
    title: "Gala de otoño",
    detail: "Granate, oro y marfil. Es noviembre: abrigo bonito.",
    palette: [
      { name: "Terciopelo", hex: "#6e1f38" },
      { name: "Oro", hex: "#d8b25e" },
      { name: "Satén", hex: "#f3ece4" },
      { name: "Noche", hex: "#1a0f18" },
    ],
    examples: [
      "Vestido largo de terciopelo o satén.",
      "Traje oscuro con pañuelo granate.",
      "Un abrigo: en lo alto del cerro sopla.",
    ],
  },
  accommodation: [
    ["Hotel del Castillo", "Junto a la muralla", "Habitaciones reservadas hasta el 1 de octubre."],
    ["Hostal de los Jardines", "A 5 minutos andando", "Con desayuno tarde para el domingo."],
  ],
  story: {
    intro: "Un taller de joyería, un anillo roto y nueve años de oro. Esta es la versión corta.",
    moments: [
      ["2018", "El taller", "Ella grababa; él esperaba su anillo arreglado.", "olivos"],
      ["2021", "El primer piso", "Con un banco de joyero en el salón.", "terraza"],
      [
        "2026",
        "La pedida",
        "Con un anillo que ella misma había grabado sin saberlo.",
        "anilloMuro",
      ],
      ["Hoy", "Y ahora, la boda", "Los anillos ya llevan la fecha. Solo faltas tú.", "olivar"],
    ],
  },
  gifts: [
    ["Nuestro viaje a Florencia", "Para ver el Ponte Vecchio.", "Lo que queráis"],
    ["Herramientas de joyero", "Para el taller de casa.", "200 €"],
    ["Una lámpara de araña", "Para el comedor.", "250 €"],
    ["Una noche en un castillo", "Para el primer aniversario.", "180 €"],
  ],
  kids: "Habrá monitores, un taller de pulseras y comida para ellos.",
  faq: ["¿Qué llevan grabado los anillos?", "Nuestras iniciales y la fecha. Lo demás es secreto."],
  guestbook: [
    ["Los del taller", "Sabíamos que ese anillo era especial."],
    ["Abuela Pilar", "Qué anillos tan bonitos, y qué novios."],
    ["Lola y Fede", "Nos pedimos el primer baile bajo la lámpara."],
  ],
  songs: ["Diamonds", "Perfect", "Contigo", "September", "Valerie", "Dancing Queen"],
});

export const baile = wedding({
  id: "evt-demo-mar-ismael",
  first: "Mar",
  second: "Ismael",
  date: "2027-02-12T19:00:00+01:00",
  rsvpDeadline: "2027-01-10T23:59:00+01:00",
  city: "Burgos",
  region: "Burgos",
  couple: "olivar",
  coverPhoto: "/fotos/olivar/banquete.jpg",
  cardMessage:
    "Nos conocimos en una academia de baile: a los dos nos sobraba una pareja. Desde entonces no la buscamos.",
  welcomeMessage:
    "Hemos reservado la pista entera. Aquí tienes todo lo que necesitas para bailar con nosotros.",
  thankYouMessage:
    "Gracias por bailar con nosotros toda la noche y por apuntaros en el carné. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia de San Nicolás",
      kind: "Ceremonia",
      address: "Calle Fernán González, 2",
      note: "Junto a la catedral. Hay parking en la plaza del Rey San Fernando.",
      photo: "iglesia",
    },
    {
      id: "finca",
      name: "Salón Gran Vals",
      kind: "Aperitivo, cena y fiesta",
      address: "Paseo del Espolón, 8",
      note: "A 5 minutos andando, con salón de baile y orquesta.",
      photo: "pista",
    },
  ],
  climate: [8, -1, 35],
  program: [
    ["19:00", "Ceremonia", "iglesia", "San Nicolás", "Con órgano.", "ceremony"],
    [
      "20:15",
      "Aperitivo",
      "finca",
      "En el vestíbulo",
      "Con morcilla de Burgos y vino del Duero.",
      "cocktail",
    ],
    ["21:30", "Cena", "finca", "En el salón", "Con el menú que elijas al confirmar.", "banquet"],
    [
      "23:30",
      "Fiesta",
      "finca",
      "Salón Gran Vals",
      "Vals, pasodoble, rumba y lo que pidáis.",
      "party",
    ],
  ],
  busRoutes: [
    [
      "valladolid",
      "Valladolid → Burgos",
      "Estación de Valladolid",
      "17:30",
      ["02:30", "05:00"],
      75,
    ],
    ["palencia", "Palencia → Burgos", "Plaza Mayor, Palencia", "17:45", ["05:00"], 60],
  ],
  menu: {
    carne: "Lechazo asado",
    pescado: "Bacalao al ajoarriero",
    vegetariano: "Olla podrida de verduras",
    vegano: "Alubias rojas con verduras",
  },
  dressCode: {
    title: "Noche de salón",
    detail: "Lila, violeta y oro. Es febrero en Burgos: abrigo y zapato de baile.",
    palette: [
      { name: "Lila", hex: "#d6c0e0" },
      { name: "Violeta", hex: "#5a3a6a" },
      { name: "Oro", hex: "#c9a65d" },
      { name: "Marfil", hex: "#fffaf4" },
    ],
    examples: [
      "Vestido con vuelo, para girar.",
      "Traje con zapato de baile.",
      "Un abrigo largo: fuera hiela.",
    ],
  },
  accommodation: [
    ["Hotel del Espolón", "Junto al salón", "Habitaciones reservadas hasta el 10 de enero."],
    ["Hostal de la Catedral", "A 5 minutos andando", "Con desayuno tarde para el domingo."],
  ],
  story: {
    intro:
      "Una academia de baile, dos parejas que faltaban y ocho años bailando. Esta es la versión corta.",
    moments: [
      [
        "2019",
        "La academia",
        "Nos tocó bailar juntos porque sobrábamos. Ya no sobramos.",
        "olivos",
      ],
      ["2022", "El concurso", "Quedamos cuartos en un concurso de pasodoble.", "terraza"],
      ["2026", "La pedida", "En mitad de un vals, delante de toda la academia.", "anilloMuro"],
      ["Hoy", "Y ahora, la boda", "La pista está reservada. Solo faltas tú.", "olivar"],
    ],
  },
  gifts: [
    ["Nuestro viaje a Buenos Aires", "Para aprender tango.", "Lo que queráis"],
    ["Clases de tango", "Para ir preparados.", "150 €"],
    ["Zapatos de baile a medida", "Para los dos.", "220 €"],
    ["Un tocadiscos", "Para bailar en casa.", "250 €"],
  ],
  kids: "Habrá monitores, una mini disco y cena para ellos.",
  faq: ["¿Hay que saber bailar?", "No: habrá una clase rápida en el aperitivo."],
  guestbook: [
    ["Los de la academia", "Ya sabíamos que acabaríais así."],
    ["Abuelo Julián", "Me guardasteis el pasodoble. Gracias."],
    ["Sonia y Edu", "Apuntados en la rumba."],
  ],
  songs: [
    "Vals de las flores",
    "Paquito el chocolatero",
    "Bamboléo",
    "September",
    "Valerie",
    "Dancing Queen",
  ],
});

export const capsula = wedding({
  id: "evt-demo-elisa-jacobo",
  first: "Elisa",
  second: "Jacobo",
  date: "2027-05-29T18:30:00+02:00",
  rsvpDeadline: "2027-04-15T23:59:00+02:00",
  city: "Ronda",
  region: "Málaga",
  couple: "olivar",
  coverPhoto: "/fotos/olivar/portada.jpg",
  cardMessage:
    "Con quince años enterramos una lata en el patio del colegio. Prometimos abrirla juntos. Lo haremos en la boda.",
  welcomeMessage:
    "La cápsula ya está desenterrada. Aquí tienes todo lo que necesitas para abrirla con nosotros.",
  thankYouMessage:
    "Gracias por venir a Ronda y por meter algo en nuestra nueva cápsula. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia de Santa María la Mayor",
      kind: "Ceremonia",
      address: "Plaza Duquesa de Parcent, s/n",
      note: "En la ciudad vieja. Hay parking junto al Puente Nuevo.",
      photo: "ermitaOlivos",
    },
    {
      id: "finca",
      name: "Cortijo de la Cápsula",
      kind: "Aperitivo, cena y fiesta",
      address: "Camino de los Molinos, km 3",
      note: "A 10 minutos, con jardín y vistas a la serranía.",
      photo: "cortijo",
    },
  ],
  climate: [26, 12, 10],
  program: [
    [
      "18:30",
      "Ceremonia",
      "iglesia",
      "Santa María la Mayor",
      "Con la apertura de la cápsula.",
      "ceremony",
    ],
    ["19:45", "Aperitivo", "finca", "En el jardín", "Con vino de la serranía.", "cocktail"],
    [
      "21:15",
      "Cena",
      "finca",
      "Bajo los olivos",
      "Con el menú que elijas al confirmar.",
      "banquet",
    ],
    [
      "23:30",
      "Fiesta",
      "finca",
      "Hasta tarde",
      "Y una cápsula nueva para dentro de veinte años.",
      "party",
    ],
  ],
  busRoutes: [
    ["malaga", "Málaga → Ronda", "Estación María Zambrano", "16:30", ["02:30", "05:00"], 105],
    ["marbella", "Marbella → Ronda", "Estación de autobuses de Marbella", "17:00", ["05:00"], 70],
  ],
  menu: {
    carne: "Rabo de toro rondeño",
    pescado: "Trucha a la rondeña",
    vegetariano: "Sopa de tomate con higos",
    vegano: "Berenjenas a la serrana",
  },
  dressCode: {
    title: "Primavera de campo",
    detail: "Verde, tierra y crema. Hay jardín: nada de tacón fino.",
    palette: [
      { name: "Jardín", hex: "#dfe8d6" },
      { name: "Tierra", hex: "#6b4f35" },
      { name: "Lata", hex: "#9aa8ad" },
      { name: "Papel", hex: "#fbf7ee" },
    ],
    examples: [
      "Vestido de flores y sandalia plana.",
      "Traje de lino con alpargatas.",
      "Algo para la cápsula nueva: una carta, una foto, un recuerdo.",
    ],
  },
  accommodation: [
    ["Parador de Ronda", "Junto al Puente Nuevo", "Habitaciones reservadas hasta el 15 de abril."],
    ["Hotel Molino Viejo", "Junto a la finca", "Con desayuno de domingo en el jardín."],
  ],
  story: {
    intro:
      "Una lata enterrada a los quince, una promesa y veinte años después. Esta es la versión corta.",
    moments: [
      [
        "2007",
        "La cápsula",
        "La enterramos en el patio del colegio con una carta de cada uno.",
        "olivos",
      ],
      ["2019", "El reencuentro", "Nos vimos en la reunión de antiguos alumnos.", "terraza"],
      ["2026", "La pedida", "Él desenterró la lata; dentro había un anillo.", "anilloMuro"],
      ["Hoy", "Y ahora, la boda", "La lata está abierta. Solo faltas tú.", "olivar"],
    ],
  },
  gifts: [
    ["Nuestro viaje a Islandia", "Cualquier aportación nos acerca.", "Lo que queráis"],
    ["Una cápsula de verdad", "De acero, para veinte años.", "80 €"],
    ["Un álbum de fotos antiguo", "Para lo que encontramos.", "60 €"],
    ["Un olivo para el patio", "Donde enterraremos la nueva.", "120 €"],
  ],
  kids: "Habrá monitores, una búsqueda del tesoro y cena para ellos.",
  faq: [
    "¿Qué meto en la cápsula nueva?",
    "Lo que quieras: una carta, una foto o una predicción para dentro de veinte años.",
  ],
  guestbook: [
    ["Los de la clase de 3.º B", "Por fin abrimos la lata."],
    ["Profe Manoli", "Sabía que ese patio daría para mucho."],
    ["Cris y Álvaro", "Hemos metido una predicción en la cápsula."],
  ],
  songs: [
    "Time of Your Life",
    "Veinte años",
    "Nuestra canción",
    "September",
    "Valerie",
    "Dancing Queen",
  ],
});

export const sellos = wedding({
  id: "evt-demo-nora-fidel",
  first: "Nora",
  second: "Fidel",
  date: "2027-09-04T17:00:00+02:00",
  rsvpDeadline: "2027-07-20T23:59:00+02:00",
  city: "Ourense",
  region: "Ourense",
  couple: "mar",
  coverPhoto: "/fotos/buganvilla/historia-1.jpg",
  cardMessage:
    "Nos conocimos en un mercadillo de sellos, peleando por el mismo. Al final lo pegamos en la misma carta.",
  welcomeMessage:
    "Esta carta va certificada y con sello propio. Aquí tienes todo lo que necesitas para llegar a la boda.",
  thankYouMessage:
    "Gracias por venir a Ourense, por las termas y por cada baile. Aquí están vuestras fotos, con matasellos.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia de Santa Eufemia",
      kind: "Ceremonia",
      address: "Rúa de Santo Domingo, 4",
      note: "En el casco viejo. Hay parking en la praza Maior.",
      photo: "ermitaMar",
    },
    {
      id: "finca",
      name: "Pazo do Correo",
      kind: "Aperitivo, cena y fiesta",
      address: "Camiño das Burgas, 7",
      note: "A 10 minutos, junto al río y con jardín de camelias.",
      photo: "terrazaMar",
    },
  ],
  climate: [27, 14, 15],
  program: [
    ["17:00", "Ceremonia", "iglesia", "Santa Eufemia", "Con gaita a la salida.", "ceremony"],
    ["18:15", "Aperitivo", "finca", "En el jardín", "Con pulpo, empanada y ribeiro.", "cocktail"],
    [
      "19:45",
      "Cena",
      "finca",
      "En el salón del pazo",
      "Con el menú que elijas al confirmar.",
      "banquet",
    ],
    ["22:30", "Fiesta", "finca", "Hasta el último sello", "Baile y queimada.", "party"],
  ],
  busRoutes: [
    ["vigo", "Vigo → Ourense", "Praza de América, Vigo", "15:45", ["01:30", "04:00"], 75],
    ["santiago", "Santiago → Ourense", "Estación de Santiago", "15:30", ["04:00"], 90],
  ],
  menu: {
    carne: "Ternera gallega",
    pescado: "Merluza a la gallega",
    vegetariano: "Empanada de verduras",
    vegano: "Castañas con setas",
  },
  dressCode: {
    title: "Fin de verano",
    detail: "Azul correos, crema y un toque rojo. Puede llover: lleva chaqueta.",
    palette: [
      { name: "Correos", hex: "#2c5a7a" },
      { name: "Matasellos", hex: "#b23a2e" },
      { name: "Sello", hex: "#f7efe0" },
      { name: "Tinta", hex: "#1d2a37" },
    ],
    examples: [
      "Vestido midi y chaqueta ligera.",
      "Traje azul con corbata roja.",
      "Un paraguas, por si acaso.",
    ],
  },
  accommodation: [
    ["Hotel Termas", "Junto a las Burgas", "Habitaciones reservadas hasta el 20 de julio."],
    ["Pensión do Correo", "En el casco viejo", "Con desayuno tarde para el domingo."],
  ],
  story: {
    intro:
      "Un sello que querían los dos, una carta compartida y siete años de correo. Esta es la versión corta.",
    moments: [
      ["2020", "El mercadillo", "Los dos queríamos el mismo sello de 1950.", "cala"],
      ["2022", "La colección", "Juntamos nuestras colecciones en un solo álbum.", "furgoneta"],
      ["2026", "La pedida", "En una carta con un sello hecho a medida.", "anilloBarca"],
      ["Hoy", "Y ahora, la boda", "El sello ya está pegado. Solo faltas tú.", "orilla"],
    ],
  },
  gifts: [
    ["Nuestro viaje a Islandia", "Cualquier aportación nos acerca.", "Lo que queráis"],
    ["Un álbum de sellos de piel", "Para la colección.", "120 €"],
    ["Una lupa de filatelista", "Para los detalles.", "45 €"],
    ["Una escapada a las termas", "Para descansar.", "150 €"],
  ],
  kids: "Habrá monitores, un taller de sellos y cena para ellos.",
  faq: ["¿Habrá sellos para llevar?", "Sí: un pliego de nuestro sello para cada familia."],
  guestbook: [
    ["Los del mercadillo", "Al final el sello fue de los dos."],
    ["Avó Manolo", "Que boda tan bonita, e que sellos!"],
    ["Iria y Xoán", "Os mandamos una carta con vuestro sello."],
  ],
  songs: [
    "Please Mr. Postman",
    "Escríbeme",
    "Sign, Sealed, Delivered",
    "September",
    "Valerie",
    "Dancing Queen",
  ],
});

export const disco = wedding({
  id: "evt-demo-valentina-joaquin",
  first: "Valentina",
  second: "Joaquín",
  date: "2027-08-07T20:00:00+02:00",
  rsvpDeadline: "2027-06-30T23:59:00+02:00",
  city: "Benidorm",
  region: "Alicante",
  couple: "mar",
  coverPhoto: "/fotos/buganvilla/pareja.jpg",
  cardMessage:
    "Nos conocimos en una discoteca de los setenta, los dos con pantalón de campana. Seguimos bailando.",
  welcomeMessage:
    "La bola de espejos ya cuelga. Aquí tienes todo lo que necesitas para no parar de bailar.",
  thankYouMessage:
    "Gracias por quemar la pista con nosotros hasta el amanecer. Aquí están vuestras fotos, con brillos.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia de San Jaime",
      kind: "Ceremonia",
      address: "Plaza de Castelar, 1",
      note: "En el casco antiguo, sobre el mar. Hay parking en la calle Alameda.",
      photo: "ermitaMar",
    },
    {
      id: "finca",
      name: "Sala Espejos",
      kind: "Aperitivo, cena y fiesta",
      address: "Avenida del Mediterráneo, 45",
      note: "A 10 minutos, con terraza al mar y pista con bola de espejos.",
      photo: "pista",
    },
  ],
  climate: [31, 23, 5],
  program: [
    ["20:00", "Ceremonia", "iglesia", "San Jaime", "Al atardecer, con el mar detrás.", "ceremony"],
    ["21:15", "Aperitivo", "finca", "En la terraza", "Con cócteles de colores.", "cocktail"],
    ["22:30", "Cena", "finca", "Bajo la bola", "Con el menú que elijas al confirmar.", "banquet"],
    ["00:30", "Fiesta", "finca", "Sala Espejos", "Música disco hasta el amanecer.", "party"],
  ],
  busRoutes: [
    [
      "alicante",
      "Alicante → Benidorm",
      "Plaza de los Luceros, Alicante",
      "18:45",
      ["03:30", "06:00"],
      45,
    ],
    ["altea", "Altea → Benidorm", "Paseo de Altea", "19:15", ["06:00"], 15],
  ],
  menu: {
    carne: "Solomillo con salsa de vino",
    pescado: "Arroz a banda",
    vegetariano: "Arroz de verduras",
    vegano: "Coca de verduras",
  },
  dressCode: {
    title: "Noche disco",
    detail: "Brillos, lentejuelas y colores. Zapatos para bailar toda la noche.",
    palette: [
      { name: "Neón", hex: "#ff7ad9" },
      { name: "Espejo", hex: "#cfd2dc" },
      { name: "Cian", hex: "#7ae0ff" },
      { name: "Noche", hex: "#0d0818" },
    ],
    examples: [
      "Lentejuelas o lamé, sin miedo.",
      "Camisa de seda y pantalón de campana.",
      "Zapato cómodo: se baila hasta el amanecer.",
    ],
  },
  accommodation: [
    ["Hotel Levante Playa", "Frente al mar", "Habitaciones reservadas hasta el 30 de junio."],
    ["Hostal del Castell", "En el casco antiguo", "Con desayuno hasta las 13:00."],
  ],
  story: {
    intro:
      "Una discoteca, dos pantalones de campana y nueve años sin parar de bailar. Esta es la versión corta.",
    moments: [
      ["2018", "La pista", "Una fiesta de los setenta. Nos tocó la misma baldosa.", "cala"],
      ["2021", "El concurso", "Ganamos un concurso de baile en la playa.", "furgoneta"],
      ["2026", "La pedida", "Bajo una bola de espejos, en mitad de una canción.", "anilloBarca"],
      ["Hoy", "Y ahora, la boda", "La bola ya gira. Solo faltas tú.", "orilla"],
    ],
  },
  gifts: [
    ["Nuestro viaje a Nueva York", "Para bailar en Manhattan.", "Lo que queráis"],
    ["Una bola de espejos para casa", "Para el salón, claro.", "80 €"],
    ["Un tocadiscos con vinilos de disco", "Para seguir bailando.", "250 €"],
    ["Clases de baile", "Para el próximo concurso.", "150 €"],
  ],
  kids: "Habrá monitores, mini disco y cena para ellos.",
  faq: [
    "¿Hasta qué hora es la fiesta?",
    "Hasta el amanecer. Hay autobús de vuelta a las 03:30 y a las 06:00.",
  ],
  guestbook: [
    ["Los de la baldosa", "Seguís bailando igual de mal y de bien."],
    ["Tía Encarna", "Qué fiesta. Me duelen los pies de bailar."],
    ["Noelia y Marcos", "Nos pedimos la bola de espejos."],
  ],
  songs: ["Stayin' Alive", "I Will Survive", "Dancing Queen", "September", "Valerie", "Le Freak"],
});

export const cuaderno = wedding({
  id: "evt-demo-angela-hernan",
  first: "Ángela",
  second: "Hernán",
  date: "2027-10-02T18:00:00+02:00",
  rsvpDeadline: "2027-08-31T23:59:00+02:00",
  city: "Cádiz",
  region: "Cádiz",
  couple: "mar",
  coverPhoto: "/fotos/buganvilla/historia-2.jpg",
  cardMessage:
    "Nos conocimos en un tren nocturno, los dos con un cuaderno de viaje. Desde entonces escribimos en el mismo.",
  welcomeMessage:
    "La última etapa del cuaderno es nuestra boda. Aquí tienes todo lo que necesitas para el viaje.",
  thankYouMessage:
    "Gracias por viajar hasta Cádiz con nosotros y por firmar en el cuaderno. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia de Santa Cruz",
      kind: "Ceremonia",
      address: "Calle Obispo José María Rancés, 1",
      note: "En el barrio del Pópulo. Hay parking en el puerto.",
      photo: "ermitaMar",
    },
    {
      id: "finca",
      name: "Baluarte de los Viajeros",
      kind: "Aperitivo, cena y fiesta",
      address: "Paseo de Santa Bárbara, 2",
      note: "A 10 minutos andando, sobre la muralla y frente al mar.",
      photo: "terrazaMar",
    },
  ],
  climate: [26, 18, 15],
  program: [
    ["18:00", "Ceremonia", "iglesia", "Santa Cruz", "Con coro y guitarra.", "ceremony"],
    ["19:15", "Aperitivo", "finca", "Sobre la muralla", "Con atardecer y pescaíto.", "cocktail"],
    ["20:45", "Cena", "finca", "En el baluarte", "Con el menú que elijas al confirmar.", "banquet"],
    ["23:00", "Fiesta", "finca", "Última etapa", "Baile, chirigota y barra libre.", "party"],
  ],
  busRoutes: [
    ["sevilla", "Sevilla → Cádiz", "Estación de Santa Justa", "16:00", ["02:30", "05:00"], 105],
    ["jerez", "Jerez → Cádiz", "Estación de Jerez", "17:00", ["05:00"], 40],
  ],
  menu: {
    carne: "Retinto con patatas",
    pescado: "Atún de almadraba encebollado",
    vegetariano: "Tortillitas de verduras",
    vegano: "Ensalada de tomate de Conil",
  },
  dressCode: {
    title: "Otoño en el sur",
    detail: "Cuero, crema y teja. Hay brisa de mar: lleva algo de abrigo.",
    palette: [
      { name: "Cuero", hex: "#7a4a2c" },
      { name: "Papel", hex: "#fbf6ea" },
      { name: "Billete", hex: "#f5d9c8" },
      { name: "Mapa", hex: "#cfe0d6" },
    ],
    examples: [
      "Vestido fluido en tonos tierra.",
      "Traje de lino con zapato cómodo.",
      "Un chal: de noche sopla el levante.",
    ],
  },
  accommodation: [
    ["Hotel Playa Victoria", "Frente a la playa", "Habitaciones reservadas hasta el 31 de agosto."],
    ["Hostal del Pópulo", "En el casco antiguo", "Con desayuno de domingo."],
  ],
  story: {
    intro: "Un tren nocturno, dos cuadernos y diez países juntos. Esta es la versión corta.",
    moments: [
      ["2019", "El tren", "Compartimos litera y lápiz. Ella dibujaba; él escribía.", "cala"],
      ["2022", "El viaje largo", "Seis meses con la furgoneta por Europa.", "furgoneta"],
      ["2026", "La pedida", "En la última página del cuaderno, escrita a lápiz.", "anilloBarca"],
      ["Hoy", "Y ahora, la boda", "La última etapa es Cádiz. Solo faltas tú.", "orilla"],
    ],
  },
  gifts: [
    ["Nuestro viaje a Japón", "La próxima etapa.", "Lo que queráis"],
    ["Un cuaderno de cuero", "Para el siguiente viaje.", "60 €"],
    ["Una mochila para dos", "Para no separarnos.", "150 €"],
    ["Una noche en un tren", "El que vosotros elijáis.", "200 €"],
  ],
  kids: "Habrá monitores, pasaportes para sellar y cena para ellos.",
  faq: [
    "¿Qué es lo de firmar en el cuaderno?",
    "En el aperitivo habrá un cuaderno de viaje para que nos dejéis una página.",
  ],
  guestbook: [
    ["Los del tren nocturno", "Sabíamos que esa litera daría para mucho."],
    ["Abuela Remedios", "Qué boda tan bonita, y qué viajeros."],
    ["Carlota y Nacho", "Os hemos dejado un mapa en el cuaderno."],
  ],
  songs: [
    "Mediterráneo",
    "Viajando por el mundo",
    "Cádiz",
    "September",
    "Valerie",
    "Dancing Queen",
  ],
});

export const pinata = wedding({
  id: "evt-demo-jimena-mauro",
  first: "Jimena",
  second: "Mauro",
  date: "2027-07-03T19:30:00+02:00",
  rsvpDeadline: "2027-05-25T23:59:00+02:00",
  city: "Mojácar",
  region: "Almería",
  couple: "mar",
  coverPhoto: "/fotos/buganvilla/historia-4.jpg",
  cardMessage:
    "Nos conocimos en un cumpleaños, rompiendo la misma piñata. Ella dio el golpe final; él recogió los caramelos.",
  welcomeMessage:
    "Esta boda viene con piñata, caramelos y mucha fiesta. Aquí tienes todo lo que necesitas.",
  thankYouMessage:
    "Gracias por venir a Mojácar, por los golpes a la piñata y por bailar hasta el alba. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia de Santa María de Mojácar",
      kind: "Ceremonia",
      address: "Plaza del Parterre, 1",
      note: "En lo alto del pueblo blanco. Hay parking a la entrada.",
      photo: "ermitaMar",
    },
    {
      id: "finca",
      name: "Cortijo de los Caramelos",
      kind: "Aperitivo, cena y fiesta",
      address: "Camino de la Playa, km 4",
      note: "A 10 minutos, con terraza sobre el mar y una piñata gigante.",
      photo: "terrazaMar",
    },
  ],
  climate: [31, 21, 5],
  program: [
    [
      "19:30",
      "Ceremonia",
      "iglesia",
      "Santa María",
      "Al atardecer, con el pueblo de fondo.",
      "ceremony",
    ],
    [
      "20:45",
      "Aperitivo",
      "finca",
      "En la terraza",
      "Con limonada y tapas del Levante.",
      "cocktail",
    ],
    ["22:00", "Cena", "finca", "Junto al mar", "Con el menú que elijas al confirmar.", "banquet"],
    ["00:00", "Fiesta", "finca", "La piñata", "A medianoche se rompe la piñata gigante.", "party"],
  ],
  busRoutes: [
    [
      "almeria",
      "Almería → Mojácar",
      "Estación Intermodal de Almería",
      "18:00",
      ["03:00", "05:30"],
      75,
    ],
    ["garrucha", "Garrucha → Mojácar", "Puerto de Garrucha", "19:00", ["05:30"], 10],
  ],
  menu: {
    carne: "Choto al ajillo",
    pescado: "Gamba roja de Garrucha",
    vegetariano: "Gurullos de verduras",
    vegano: "Trigo con hinojo y verduras",
  },
  dressCode: {
    title: "Fiesta de colores",
    detail: "Colores vivos, sin miedo. Hay terraza y arena: calzado cómodo.",
    palette: [
      { name: "Fucsia", hex: "#ff5d8f" },
      { name: "Mango", hex: "#ffc93c" },
      { name: "Turquesa", hex: "#4cc9f0" },
      { name: "Menta", hex: "#7bd389" },
    ],
    examples: [
      "Vestido de color, cuanto más vivo mejor.",
      "Camisa estampada y pantalón claro.",
      "Manos libres a medianoche: hay piñata.",
    ],
  },
  accommodation: [
    ["Hotel Mojácar Playa", "Frente al mar", "Habitaciones reservadas hasta el 25 de mayo."],
    ["Hostal del Parterre", "En el pueblo", "Con desayuno hasta las 13:00."],
  ],
  story: {
    intro:
      "Una piñata compartida, un golpe certero y seis años de fiesta. Esta es la versión corta.",
    moments: [
      ["2021", "La piñata", "Ella dio el golpe; él se llevó los caramelos y su teléfono.", "cala"],
      ["2023", "La furgoneta", "Un verano entero de pueblo en pueblo.", "furgoneta"],
      ["2026", "La pedida", "Con el anillo dentro de una piñata pequeñita.", "anilloBarca"],
      ["Hoy", "Y ahora, la boda", "La piñata ya cuelga. Solo faltas tú.", "orilla"],
    ],
  },
  gifts: [
    ["Nuestro viaje a México", "Para ver piñatas de verdad.", "Lo que queráis"],
    ["Una hamaca doble", "Para la terraza.", "120 €"],
    ["Una máquina de helados", "Para el verano.", "150 €"],
    ["Una cena en la playa", "Para el aniversario.", "90 €"],
  ],
  kids: "Habrá monitores, su propia piñata y cena para ellos.",
  faq: ["¿Quién rompe la piñata?", "A medianoche, por turnos. Los niños, antes, con la suya."],
  guestbook: [
    ["Los del cumpleaños", "Ese golpe fue el principio de todo."],
    ["Tía Maruja", "Qué fiesta, y qué piñata más grande."],
    ["Laura y Pepe", "Nos pedimos el siguiente golpe."],
  ],
  songs: ["La bamba", "Despacito", "Vivir mi vida", "September", "Valerie", "Dancing Queen"],
});

export const arroz = wedding({
  id: "evt-demo-raquel-eloy",
  first: "Raquel",
  second: "Eloy",
  date: "2027-09-18T12:30:00+02:00",
  rsvpDeadline: "2027-08-01T23:59:00+02:00",
  city: "Laguardia",
  region: "Álava",
  couple: "olivar",
  coverPhoto: "/fotos/olivar/historia-1.jpg",
  cardMessage:
    "Nos conocimos a la salida de una boda, con los bolsillos llenos de arroz. Nos lo tiramos el uno al otro.",
  welcomeMessage:
    "Prepara el cucurucho: esta vez el arroz es para nosotros. Aquí tienes todo lo que necesitas.",
  thankYouMessage:
    "Gracias por venir a Laguardia y por la lluvia de arroz más grande de la Rioja. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia de Santa María de los Reyes",
      kind: "Ceremonia",
      address: "Calle Mayor, 1",
      note: "Dentro de la muralla. Hay parking a la entrada del pueblo.",
      photo: "iglesia",
    },
    {
      id: "finca",
      name: "Bodega del Cucurucho",
      kind: "Aperitivo, comida y fiesta",
      address: "Carretera de Elciego, km 2",
      note: "A 5 minutos, entre viñedos y con calados antiguos.",
      photo: "cortijo",
    },
  ],
  climate: [24, 11, 15],
  program: [
    ["12:30", "Ceremonia", "iglesia", "Santa María", "Y a la salida, lluvia de arroz.", "ceremony"],
    ["13:45", "Aperitivo", "finca", "En el viñedo", "Con vino de la casa y pinchos.", "cocktail"],
    [
      "15:00",
      "Comida",
      "finca",
      "En los calados",
      "Con el menú que elijas al confirmar.",
      "banquet",
    ],
    ["18:00", "Fiesta", "finca", "Entre barricas", "Baile y barra libre.", "party"],
  ],
  busRoutes: [
    ["logrono", "Logroño → Laguardia", "Estación de Logroño", "11:30", ["21:00", "00:30"], 30],
    ["vitoria", "Vitoria → Laguardia", "Estación de Vitoria-Gasteiz", "11:15", ["00:30"], 50],
  ],
  menu: {
    carne: "Chuletillas al sarmiento",
    pescado: "Bacalao a la riojana",
    vegetariano: "Menestra de verduras",
    vegano: "Patatas a la riojana con verduras",
  },
  dressCode: {
    title: "Vendimia",
    detail: "Blanco roto, vino y oro viejo. Hay viñedo: tacón ancho mejor.",
    palette: [
      { name: "Arroz", hex: "#fbf9f4" },
      { name: "Oro viejo", hex: "#c9a65d" },
      { name: "Tempranillo", hex: "#6b1e2a" },
      { name: "Sarmiento", hex: "#6b5a3c" },
    ],
    examples: [
      "Vestido midi en tonos vino o crema.",
      "Traje de lana fría con corbata granate.",
      "Un bolsillo libre para el arroz.",
    ],
  },
  accommodation: [
    [
      "Hotel Villa de Laguardia",
      "Junto a la muralla",
      "Habitaciones reservadas hasta el 1 de agosto.",
    ],
    ["Casa rural Los Calados", "Junto a la bodega", "Con desayuno de domingo."],
  ],
  story: {
    intro:
      "Un bolsillo lleno de arroz, una boda ajena y siete vendimias juntos. Esta es la versión corta.",
    moments: [
      ["2020", "El arroz", "A la salida de una boda nos lo tiramos el uno al otro.", "olivos"],
      ["2022", "La vendimia", "Un otoño entero vendimiando en la Rioja.", "terraza"],
      ["2026", "La pedida", "Con el anillo escondido en un cucurucho de arroz.", "anilloMuro"],
      ["Hoy", "Y ahora, la boda", "El arroz ya está en los cucuruchos. Solo faltas tú.", "olivar"],
    ],
  },
  gifts: [
    ["Nuestro viaje a Burdeos", "Para seguir con las bodegas.", "Lo que queráis"],
    ["Una cava de vinos", "Para casa.", "300 €"],
    ["Una paellera grande", "Que el arroz siga.", "60 €"],
    ["Una cata para dos", "En la Rioja Alavesa.", "90 €"],
  ],
  kids: "Habrá monitores, cucuruchos para pintar y comida para ellos.",
  faq: [
    "¿Podemos lanzar arroz?",
    "Sí: os daremos cucuruchos a la salida. Arroz de verdad, nada de confeti.",
  ],
  guestbook: [
    ["Los de la otra boda", "Seguís teniendo arroz en los bolsillos."],
    ["Amama Josefa", "Qué boda tan bonita entre viñas."],
    ["Miren y Unax", "Hemos tirado arroz para tres bodas más."],
  ],
  songs: ["Arroz con leche", "Vino tinto", "Sarandonga", "September", "Valerie", "Dancing Queen"],
});

export const vela = wedding({
  id: "evt-demo-sonia-tristan",
  first: "Sonia",
  second: "Tristán",
  date: "2027-12-11T18:00:00+01:00",
  rsvpDeadline: "2027-11-01T23:59:00+01:00",
  city: "Cangas de Onís",
  region: "Asturias",
  couple: "olivar",
  coverPhoto: "/fotos/olivar/historia-4.jpg",
  cardMessage:
    "Nos conocimos en un apagón, en un refugio de montaña. Solo había una vela y la compartimos toda la noche.",
  welcomeMessage:
    "Nos casamos a la luz de las velas, en pleno invierno. Aquí tienes todo lo que necesitas para acompañarnos.",
  thankYouMessage:
    "Gracias por venir a Asturias en diciembre y por encender vuestra vela. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia de Santa María",
      kind: "Ceremonia",
      address: "Avenida de Covadonga, 1",
      note: "En el centro, junto al puente romano. Hay parking en el mercado.",
      photo: "iglesia",
    },
    {
      id: "finca",
      name: "Palacio de las Velas",
      kind: "Aperitivo, cena y fiesta",
      address: "Camino del Sella, 8",
      note: "A 5 minutos, junto al río, con mil velas encendidas.",
      photo: "pista",
    },
  ],
  climate: [11, 3, 50],
  program: [
    ["18:00", "Ceremonia", "iglesia", "Santa María", "A la luz de las velas.", "ceremony"],
    [
      "19:15",
      "Aperitivo",
      "finca",
      "Junto a la chimenea",
      "Con sidra y quesos asturianos.",
      "cocktail",
    ],
    [
      "20:45",
      "Cena",
      "finca",
      "En el salón de las velas",
      "Con el menú que elijas al confirmar.",
      "banquet",
    ],
    ["23:00", "Fiesta", "finca", "Hasta tarde", "Baile, gaita y orujo para el frío.", "party"],
  ],
  busRoutes: [
    [
      "oviedo",
      "Oviedo → Cangas de Onís",
      "Estación de autobuses de Oviedo",
      "16:45",
      ["02:00", "04:30"],
      70,
    ],
    ["arriondas", "Arriondas → Cangas de Onís", "Puente de Arriondas", "17:30", ["04:30"], 15],
  ],
  menu: {
    carne: "Cachopo de ternera asturiana",
    pescado: "Merluza a la sidra",
    vegetariano: "Fabada de verduras",
    vegano: "Pote de berzas y patatas",
  },
  dressCode: {
    title: "Invierno a la luz de las velas",
    detail: "Oro, crema y tonos cálidos. Hace frío: abrigo y botas bonitas.",
    palette: [
      { name: "Llama", hex: "#ffc24a" },
      { name: "Cera", hex: "#fffaf0" },
      { name: "Penumbra", hex: "#1e140c" },
      { name: "Brasa", hex: "#ff7a1a" },
    ],
    examples: [
      "Vestido largo de terciopelo.",
      "Traje de lana con bufanda.",
      "Botas: hay piedra mojada.",
    ],
  },
  accommodation: [
    [
      "Parador de Cangas de Onís",
      "En el monasterio",
      "Habitaciones reservadas hasta el 1 de noviembre.",
    ],
    ["Hotel del Sella", "Junto al río", "Con desayuno tarde para el domingo."],
  ],
  story: {
    intro: "Un apagón, un refugio y una sola vela para los dos. Esta es la versión corta.",
    moments: [
      [
        "2019",
        "El refugio",
        "Se fue la luz y solo quedó una vela. Hablamos hasta que se gastó.",
        "olivos",
      ],
      [
        "2022",
        "La cabaña",
        "Una cabaña en los Picos con chimenea y velas en cada ventana.",
        "terraza",
      ],
      ["2026", "La pedida", "A la luz de una vela, en el mismo refugio.", "anilloMuro"],
      ["Hoy", "Y ahora, la boda", "La vela ya está encendida. Solo faltas tú.", "olivar"],
    ],
  },
  gifts: [
    ["Nuestro viaje a Noruega", "Para ver la aurora.", "Lo que queráis"],
    ["Un candelabro antiguo", "Para la mesa de casa.", "120 €"],
    ["Una noche en el refugio", "Donde todo empezó.", "100 €"],
    ["Una manta de lana", "Para el invierno.", "80 €"],
  ],
  kids: "Habrá monitores, farolillos de papel y cena para ellos.",
  faq: [
    "¿Qué es lo de encender una vela?",
    "A la entrada, cada invitado enciende una vela con un deseo para nosotros.",
  ],
  guestbook: [
    ["Los del refugio", "Qué suerte que aquella noche se fue la luz."],
    ["Güela Covadonga", "Qué boda más bonita, y qué luz."],
    ["Xana y Pelayo", "Encendimos la vela más grande."],
  ],
  songs: [
    "Candle in the Wind",
    "Asturias, patria querida",
    "La luz",
    "September",
    "Valerie",
    "Dancing Queen",
  ],
});

export const columpio = wedding({
  id: "evt-demo-leonor-teodoro",
  first: "Leonor",
  second: "Teodoro",
  date: "2027-06-05T18:30:00+02:00",
  rsvpDeadline: "2027-04-30T23:59:00+02:00",
  city: "Hervás",
  region: "Cáceres",
  couple: "olivar",
  coverPhoto: "/fotos/olivar/historia-3.jpg",
  cardMessage:
    "De pequeños nos peleábamos por el columpio del castaño del pueblo. Ahora lo compartimos.",
  welcomeMessage:
    "El columpio del castaño sigue ahí y nosotros también. Aquí tienes todo lo que necesitas para venir.",
  thankYouMessage:
    "Gracias por venir al valle del Ambroz y por columpiaros con nosotros. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia de Santa María de Aguas Vivas",
      kind: "Ceremonia",
      address: "Calle de la Iglesia, 1",
      note: "En lo alto del barrio judío. Hay parking junto al río.",
      photo: "ermitaOlivos",
    },
    {
      id: "finca",
      name: "Finca del Castaño",
      kind: "Aperitivo, cena y fiesta",
      address: "Camino de la Garganta, km 2",
      note: "A 10 minutos, con un castaño centenario y su columpio.",
      photo: "cortijo",
    },
  ],
  climate: [27, 13, 15],
  program: [
    ["18:30", "Ceremonia", "iglesia", "Aguas Vivas", "Con coro del valle.", "ceremony"],
    [
      "19:45",
      "Aperitivo",
      "finca",
      "Bajo el castaño",
      "Con cerezas del Jerte y vino de pitarra.",
      "cocktail",
    ],
    ["21:15", "Cena", "finca", "En el prado", "Con el menú que elijas al confirmar.", "banquet"],
    ["23:30", "Fiesta", "finca", "Hasta tarde", "Baile, columpio y barra libre.", "party"],
  ],
  busRoutes: [
    [
      "plasencia",
      "Plasencia → Hervás",
      "Estación de autobuses de Plasencia",
      "17:30",
      ["02:00", "04:30"],
      40,
    ],
    ["bejar", "Béjar → Hervás", "Plaza Mayor, Béjar", "17:45", ["04:30"], 25],
  ],
  menu: {
    carne: "Cabrito de la sierra",
    pescado: "Trucha del Ambroz",
    vegetariano: "Patatas revolconas con setas",
    vegano: "Ensalada de cerezas y pimientos",
  },
  dressCode: {
    title: "Jardín de junio",
    detail: "Verdes, cereza y crema. Hay prado: nada de tacón fino.",
    palette: [
      { name: "Prado", hex: "#c9d9a8" },
      { name: "Castaño", hex: "#6b4f35" },
      { name: "Cereza", hex: "#a8243a" },
      { name: "Cielo", hex: "#e4f0f4" },
    ],
    examples: [
      "Vestido de flores con vuelo.",
      "Traje claro con alpargatas.",
      "Algo con lo que columpiarse a gusto.",
    ],
  },
  accommodation: [
    [
      "Hotel El Jardín del Convento",
      "En el centro de Hervás",
      "Habitaciones reservadas hasta el 30 de abril.",
    ],
    ["Casa rural El Castaño", "Junto a la finca", "Con desayuno de cerezas."],
  ],
  story: {
    intro:
      "Un columpio disputado, un castaño y veinte veranos en el pueblo. Esta es la versión corta.",
    moments: [
      ["2005", "El columpio", "Nos peleábamos por él cada verano. Ganaba ella.", "olivos"],
      [
        "2019",
        "El reencuentro",
        "Volvimos al pueblo el mismo verano. El columpio, también.",
        "terraza",
      ],
      [
        "2026",
        "La pedida",
        "En el columpio del castaño, con el anillo atado a la cuerda.",
        "anilloMuro",
      ],
      ["Hoy", "Y ahora, la boda", "El columpio está listo. Solo faltas tú.", "olivar"],
    ],
  },
  gifts: [
    ["Nuestro viaje a Japón", "Para ver los cerezos en flor.", "Lo que queráis"],
    ["Un columpio para el jardín", "El nuestro.", "150 €"],
    ["Un cerezo joven", "Para plantarlo juntos.", "60 €"],
    ["Una hamaca de madera", "Para las siestas.", "120 €"],
  ],
  kids: "Habrá monitores, columpios y cena para ellos.",
  faq: ["¿Se puede subir al columpio?", "Sí, por turnos y sin empujones fuertes."],
  guestbook: [
    ["Los del pueblo", "Por fin os ponéis de acuerdo con el columpio."],
    ["Abuela Petra", "Qué bonito el castaño lleno de luces."],
    ["Elena y Sergio", "Nos pedimos el columpio a medianoche."],
  ],
  songs: ["Columpio", "La flaca", "Lady Madrid", "September", "Valerie", "Dancing Queen"],
});

export const semaforo = wedding({
  id: "evt-demo-irati-mikel",
  first: "Irati",
  second: "Mikel",
  date: "2027-07-10T18:00:00+02:00",
  rsvpDeadline: "2027-06-01T23:59:00+02:00",
  city: "Pamplona",
  region: "Navarra",
  couple: "olivar",
  coverPhoto: "/fotos/olivar/pareja.jpg",
  cardMessage:
    "Nos conocimos parados en un semáforo en rojo, cada uno en su bici. Cuando se puso verde, seguimos juntos.",
  welcomeMessage:
    "Rojo: guarda la fecha. Ámbar: confirma. Verde: ¡a la fiesta! Aquí tienes todo lo que necesitas.",
  thankYouMessage:
    "Gracias por venir a Pamplona y por saltaros todos los semáforos de la pista. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia de San Saturnino",
      kind: "Ceremonia",
      address: "Calle Ansoleaga, 2",
      note: "En el casco viejo. Hay parking en la plaza del Castillo.",
      photo: "iglesia",
    },
    {
      id: "finca",
      name: "Jardín de la Vía Verde",
      kind: "Aperitivo, cena y fiesta",
      address: "Paseo de la Taconera, 6",
      note: "A 10 minutos andando, con jardín junto a la muralla.",
      photo: "patioOlivos",
    },
  ],
  climate: [28, 14, 15],
  program: [
    ["18:00", "Ceremonia", "iglesia", "San Saturnino", "Con txistu a la salida.", "ceremony"],
    ["19:15", "Aperitivo", "finca", "En el jardín", "Con pinchos y vino navarro.", "cocktail"],
    [
      "21:00",
      "Cena",
      "finca",
      "Bajo la muralla",
      "Con el menú que elijas al confirmar.",
      "banquet",
    ],
    [
      "23:30",
      "Fiesta",
      "finca",
      "Luz verde",
      "Baile y barra libre hasta que cambie el semáforo.",
      "party",
    ],
  ],
  busRoutes: [
    ["tudela", "Tudela → Pamplona", "Estación de Tudela", "16:45", ["02:30", "05:00"], 60],
    ["estella", "Estella → Pamplona", "Plaza de los Fueros, Estella", "17:15", ["05:00"], 40],
  ],
  menu: {
    carne: "Cordero al chilindrón",
    pescado: "Trucha a la navarra",
    vegetariano: "Menestra de Tudela",
    vegano: "Pochas con verduras",
  },
  dressCode: {
    title: "Verano en verde",
    detail: "Un toque de rojo, ámbar o verde: elige tu luz. Hay jardín: calzado cómodo.",
    palette: [
      { name: "Rojo", hex: "#ff4b3e" },
      { name: "Ámbar", hex: "#ffb627" },
      { name: "Verde", hex: "#3ddc84" },
      { name: "Asfalto", hex: "#1d2027" },
    ],
    examples: [
      "Algo rojo, ámbar o verde.",
      "Traje oscuro con pañuelo de color.",
      "Zapatillas para la pista, si quieres.",
    ],
  },
  accommodation: [
    ["Hotel La Perla", "En la plaza del Castillo", "Habitaciones reservadas hasta el 1 de junio."],
    ["Hostal de la Taconera", "Junto al jardín", "Con desayuno tarde para el domingo."],
  ],
  story: {
    intro: "Un semáforo en rojo, dos bicis y nueve años en verde. Esta es la versión corta.",
    moments: [
      ["2018", "El semáforo", "Un rojo eterno. Hablamos hasta que se puso verde.", "olivos"],
      ["2021", "La ruta", "El Camino de Santiago en bici, de Roncesvalles a Fisterra.", "terraza"],
      ["2026", "La pedida", "En el mismo cruce, con el semáforo en verde.", "anilloMuro"],
      ["Hoy", "Y ahora, la boda", "Luz verde. Solo faltas tú.", "olivar"],
    ],
  },
  gifts: [
    ["Nuestro viaje a Ámsterdam", "En bici, claro.", "Lo que queráis"],
    ["Dos bicis de paseo", "Para seguir rodando.", "400 €"],
    ["Un tándem", "Para no separarnos nunca.", "300 €"],
    ["Una ruta guiada por Navarra", "Para el aniversario.", "120 €"],
  ],
  kids: "Habrá monitores, circuito de bicis y cena para ellos.",
  faq: ["¿Cómo llego?", "En verde, por supuesto. Hay autobús desde Tudela y Estella."],
  guestbook: [
    ["Los del cruce", "Menudo semáforo más largo aquel."],
    ["Amatxi Miren", "Qué boda tan bonita, y qué colores."],
    ["Ane y Gorka", "En verde hasta el final."],
  ],
  songs: [
    "Semáforo",
    "Rojo, amarillo y verde",
    "Highway to Hell",
    "September",
    "Valerie",
    "Dancing Queen",
  ],
});

export const paraguas = wedding({
  id: "evt-demo-carolina-damian",
  first: "Carolina",
  second: "Damián",
  date: "2027-10-16T17:00:00+02:00",
  rsvpDeadline: "2027-09-01T23:59:00+02:00",
  city: "Lugo",
  region: "Lugo",
  couple: "mar",
  coverPhoto: "/fotos/buganvilla/historia-3.jpg",
  cardMessage:
    "Nos conocimos bajo el mismo paraguas, en la muralla, en un día de aguacero. Ninguno quiso soltarlo.",
  welcomeMessage:
    "Llueva o haga sol, nos casamos. Aquí tienes todo lo que necesitas (y un paraguas, por si acaso).",
  thankYouMessage:
    "Gracias por venir a Lugo, por los paraguas de colores y por bailar bajo la lluvia. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia de San Pedro",
      kind: "Ceremonia",
      address: "Rúa de San Pedro, 3",
      note: "Dentro de la muralla. Hay parking en la praza Maior.",
      photo: "ermitaMar",
    },
    {
      id: "finca",
      name: "Pazo da Chuvia",
      kind: "Aperitivo, cena y fiesta",
      address: "Camiño do Miño, 12",
      note: "A 10 minutos, junto al río y con carpa por si llueve.",
      photo: "terrazaMar",
    },
  ],
  climate: [18, 9, 55],
  program: [
    [
      "17:00",
      "Ceremonia",
      "iglesia",
      "San Pedro",
      "Con gaita y paraguas de colores a la salida.",
      "ceremony",
    ],
    [
      "18:15",
      "Aperitivo",
      "finca",
      "Bajo la carpa",
      "Con pulpo, queso de Arzúa y ribeiro.",
      "cocktail",
    ],
    [
      "19:45",
      "Cena",
      "finca",
      "En el salón del pazo",
      "Con el menú que elijas al confirmar.",
      "banquet",
    ],
    ["22:30", "Fiesta", "finca", "Llueva o no", "Baile y queimada.", "party"],
  ],
  busRoutes: [
    ["coruna", "A Coruña → Lugo", "Estación de A Coruña", "15:30", ["01:30", "04:00"], 75],
    ["ourense-bus", "Ourense → Lugo", "Estación de autobuses de Ourense", "15:30", ["04:00"], 75],
  ],
  menu: {
    carne: "Lacón con grelos",
    pescado: "Bacalao a la gallega",
    vegetariano: "Empanada de verduras y setas",
    vegano: "Caldo gallego de verduras",
  },
  dressCode: {
    title: "Otoño gallego",
    detail: "Lo que quieras, pero con un paraguas bonito. Habrá barro: calzado sensato.",
    palette: [
      { name: "Paraguas", hex: "#c8312b" },
      { name: "Lluvia", hex: "#8d9aa6" },
      { name: "Cielo", hex: "#cfe6f2" },
      { name: "Piedra", hex: "#6b7984" },
    ],
    examples: [
      "Vestido midi y chaqueta impermeable bonita.",
      "Traje de lana con botas.",
      "Tu paraguas de colores: los mejores salen en las fotos.",
    ],
  },
  accommodation: [
    ["Hotel da Muralla", "Junto a la muralla", "Habitaciones reservadas hasta el 1 de septiembre."],
    ["Pensión do Miño", "Junto al río", "Con desayuno tarde para el domingo."],
  ],
  story: {
    intro: "Un aguacero, un solo paraguas y ocho otoños gallegos. Esta es la versión corta.",
    moments: [
      ["2019", "El aguacero", "Paseando por la muralla. Solo él llevaba paraguas.", "cala"],
      ["2022", "La furgoneta", "Un verano lloviendo por toda Galicia.", "furgoneta"],
      ["2026", "La pedida", "Bajo el mismo paraguas, en la muralla, lloviendo.", "anilloBarca"],
      ["Hoy", "Y ahora, la boda", "Llueva o no, solo faltas tú.", "orilla"],
    ],
  },
  gifts: [
    ["Nuestro viaje a Escocia", "Más lluvia, por favor.", "Lo que queráis"],
    ["Dos paraguas buenos", "De los que no se dan la vuelta.", "90 €"],
    ["Una chimenea de leña", "Para los días de lluvia.", "400 €"],
    ["Botas de agua a juego", "Para los paseos.", "70 €"],
  ],
  kids: "Habrá monitores, charcos permitidos y cena para ellos.",
  faq: ["¿Y si llueve?", "Lloverá. Hay carpa, paraguas para todos y queimada para el frío."],
  guestbook: [
    ["Los de la muralla", "Ese paraguas ha dado mucho de sí."],
    ["Avoa Lola", "Que boda tan bonita, e choveu pouco!"],
    ["Antía y Breixo", "Bailamos bajo la lluvia hasta el final."],
  ],
  songs: [
    "Singin' in the Rain",
    "Bajo la lluvia",
    "Umbrella",
    "September",
    "Valerie",
    "Dancing Queen",
  ],
});

export const cascanueces = wedding({
  id: "evt-demo-adela-gil",
  first: "Adela",
  second: "Gil",
  date: "2027-12-18T17:00:00+01:00",
  rsvpDeadline: "2027-11-10T23:59:00+01:00",
  city: "Benasque",
  region: "Huesca",
  couple: "olivar",
  coverPhoto: "/fotos/olivar/historia-2.jpg",
  cardMessage:
    "Nos conocimos en un ensayo de El Cascanueces: ella era Clara; él, el ratón que perdía la batalla.",
  welcomeMessage:
    "Nos casamos en pleno invierno, entre montañas nevadas. Aquí tienes todo lo que necesitas para el cuento.",
  thankYouMessage:
    "Gracias por subir al Pirineo en diciembre y por bailar el vals de las flores. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia de Santa María de Benasque",
      kind: "Ceremonia",
      address: "Plaza de la Iglesia, 1",
      note: "En el centro del pueblo. Hay parking a la entrada; lleva cadenas.",
      photo: "iglesia",
    },
    {
      id: "finca",
      name: "Refugio del Soldadito",
      kind: "Aperitivo, cena y fiesta",
      address: "Camino de Cerler, km 3",
      note: "A 10 minutos, con chimenea y ventanales a la montaña.",
      photo: "pista",
    },
  ],
  climate: [4, -6, 40],
  program: [
    [
      "17:00",
      "Ceremonia",
      "iglesia",
      "Santa María",
      "Con coro y el vals de las flores.",
      "ceremony",
    ],
    [
      "18:15",
      "Aperitivo",
      "finca",
      "Junto a la chimenea",
      "Con vino caliente y castañas.",
      "cocktail",
    ],
    [
      "19:45",
      "Cena",
      "finca",
      "En el salón de la montaña",
      "Con el menú que elijas al confirmar.",
      "banquet",
    ],
    [
      "22:00",
      "Fiesta",
      "finca",
      "Hasta tarde",
      "Baile y chocolate con churros a medianoche.",
      "party",
    ],
  ],
  busRoutes: [
    ["huesca", "Huesca → Benasque", "Estación de Huesca", "14:30", ["01:00", "03:30"], 135],
    ["graus", "Graus → Benasque", "Plaza Mayor, Graus", "15:30", ["03:30"], 60],
  ],
  menu: {
    carne: "Ternasco de Aragón al horno",
    pescado: "Bacalao con setas",
    vegetariano: "Crema de castañas y setas",
    vegano: "Guiso de alubias y verduras de invierno",
  },
  dressCode: {
    title: "Cuento de invierno",
    detail: "Verde abeto, rojo y oro. Hace mucho frío: abrigo, botas y guantes.",
    palette: [
      { name: "Abeto", hex: "#1f3a2c" },
      { name: "Soldadito", hex: "#b8232f" },
      { name: "Oro", hex: "#d4af37" },
      { name: "Nieve", hex: "#f4ead6" },
    ],
    examples: [
      "Vestido largo de terciopelo y abrigo.",
      "Traje de lana con bufanda roja.",
      "Botas de nieve para el camino.",
    ],
  },
  accommodation: [
    [
      "Hotel de la Montaña",
      "En el centro de Benasque",
      "Habitaciones reservadas hasta el 10 de noviembre.",
    ],
    ["Apartamentos Cerler", "Junto a la finca", "Con desayuno de domingo y forfait con descuento."],
  ],
  story: {
    intro: "Una Clara, un ratón derrotado y ocho inviernos juntos. Esta es la versión corta.",
    moments: [
      ["2019", "El ensayo", "Ella bailaba; él perdía la batalla cada tarde.", "olivos"],
      ["2022", "La montaña", "Un invierno entero en una cabaña del Pirineo.", "terraza"],
      ["2026", "La pedida", "Con el anillo dentro de una nuez, en Nochebuena.", "anilloMuro"],
      ["Hoy", "Y ahora, la boda", "La nuez ya está partida. Solo faltas tú.", "olivar"],
    ],
  },
  gifts: [
    ["Nuestro viaje a Viena", "Para ver El Cascanueces de verdad.", "Lo que queráis"],
    ["Un cascanueces de madera", "Para la repisa.", "60 €"],
    ["Raquetas de nieve", "Para las excursiones.", "150 €"],
    ["Un fin de semana en un balneario", "Para descongelarnos.", "200 €"],
  ],
  kids: "Habrá monitores, trineos y cena para ellos.",
  faq: [
    "¿Y si nieva mucho?",
    "Habrá autobús con cadenas desde Huesca y Graus. Consultad el parte.",
  ],
  guestbook: [
    ["La compañía de ballet", "El ratón por fin gana algo."],
    ["Yaya Pilar", "Qué boda tan bonita, entre la nieve."],
    ["Marina y Josan", "Nos pedimos el vals de las flores."],
  ],
  songs: [
    "Vals de las flores",
    "Let It Snow",
    "Blanca Navidad",
    "September",
    "Valerie",
    "Dancing Queen",
  ],
});

export const hamaca = wedding({
  id: "evt-demo-begona-ulises",
  first: "Begoña",
  second: "Ulises",
  date: "2027-08-28T20:00:00+02:00",
  rsvpDeadline: "2027-07-15T23:59:00+02:00",
  city: "Nerja",
  region: "Málaga",
  couple: "mar",
  coverPhoto: "/fotos/buganvilla/portada.jpg",
  cardMessage:
    "Nos conocimos peleando por la última hamaca de un chiringuito. Acabamos compartiéndola.",
  welcomeMessage:
    "Nos casamos al atardecer, sin prisa y junto al mar. Aquí tienes todo lo que necesitas.",
  thankYouMessage:
    "Gracias por venir a Nerja, por el atardecer y por bailar descalzos. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia de El Salvador",
      kind: "Ceremonia",
      address: "Plaza Balcón de Europa, 1",
      note: "Junto al Balcón de Europa. Hay parking en el centro.",
      photo: "ermitaMar",
    },
    {
      id: "finca",
      name: "Chiringuito Las Palmeras",
      kind: "Aperitivo, cena y fiesta",
      address: "Playa de Burriana, s/n",
      note: "A 10 minutos, sobre la arena, con hamacas para todos.",
      photo: "terrazaMar",
    },
  ],
  climate: [31, 22, 5],
  program: [
    ["20:00", "Ceremonia", "iglesia", "El Salvador", "Al atardecer, sobre el mar.", "ceremony"],
    ["21:15", "Aperitivo", "finca", "En las hamacas", "Con espetos y tinto de verano.", "cocktail"],
    ["22:30", "Cena", "finca", "Sobre la arena", "Con el menú que elijas al confirmar.", "banquet"],
    ["00:30", "Fiesta", "finca", "Descalzos", "Música y baile hasta el amanecer.", "party"],
  ],
  busRoutes: [
    [
      "malaga-bus",
      "Málaga → Nerja",
      "Estación de autobuses de Málaga",
      "18:45",
      ["03:00", "05:30"],
      60,
    ],
    ["frigiliana", "Frigiliana → Nerja", "Plaza de Frigiliana", "19:15", ["05:30"], 15],
  ],
  menu: {
    carne: "Presa ibérica al carbón",
    pescado: "Espeto de sardinas y fritura",
    vegetariano: "Ajoblanco y berenjenas con miel",
    vegano: "Gazpacho y ensalada malagueña",
  },
  dressCode: {
    title: "Atardecer en la playa",
    detail: "Tonos de atardecer, lino y descalzos. Hay arena: nada de tacón.",
    palette: [
      { name: "Atardecer", hex: "#ffb38a" },
      { name: "Hamaca", hex: "#e4572e" },
      { name: "Sol", hex: "#ffd166" },
      { name: "Palmera", hex: "#2f6b3f" },
    ],
    examples: [
      "Vestido largo de lino.",
      "Camisa de lino y bermudas elegantes.",
      "Descalzos en la arena: habrá zapatillas.",
    ],
  },
  accommodation: [
    ["Hotel Balcón de Europa", "Junto al mirador", "Habitaciones reservadas hasta el 15 de julio."],
    ["Hostal Burriana", "Junto a la playa", "Con desayuno hasta las 13:00."],
  ],
  story: {
    intro:
      "Una hamaca disputada, un chiringuito y siete veranos sin prisa. Esta es la versión corta.",
    moments: [
      ["2020", "La hamaca", "Quedaba una. Acabamos compartiéndola.", "cala"],
      ["2022", "La furgoneta", "Un verano de calas por toda la costa.", "furgoneta"],
      ["2026", "La pedida", "En la misma hamaca, al atardecer.", "anilloBarca"],
      ["Hoy", "Y ahora, la boda", "La hamaca está colgada. Solo faltas tú.", "orilla"],
    ],
  },
  gifts: [
    ["Nuestro viaje a Bali", "Más hamacas.", "Lo que queráis"],
    ["Una hamaca doble para la terraza", "La nuestra.", "120 €"],
    ["Un kayak", "Para las calas.", "300 €"],
    ["Una cena en el Balcón de Europa", "Para el aniversario.", "90 €"],
  ],
  kids: "Habrá monitores, castillos de arena y cena para ellos.",
  faq: [
    "¿Hay que llevar algo para la playa?",
    "Solo ganas de descalzarse. Habrá toallas y zapatillas.",
  ],
  guestbook: [
    ["Los del chiringuito", "Aquella hamaca dio para mucho."],
    ["Abuela Rosario", "Qué atardecer más bonito."],
    ["Paula y Rubén", "Nos pedimos la hamaca de al lado."],
  ],
  songs: ["Sin prisa", "La playa", "Bailando", "September", "Valerie", "Dancing Queen"],
});

export const picnic = wedding({
  id: "evt-demo-monica-aitor",
  first: "Mónica",
  second: "Aitor",
  date: "2027-06-19T13:00:00+02:00",
  rsvpDeadline: "2027-05-10T23:59:00+02:00",
  city: "Llanes",
  region: "Asturias",
  couple: "olivar",
  coverPhoto: "/fotos/olivar/banquete.jpg",
  cardMessage:
    "Nos conocimos en un pícnic de amigos: ella llevó la tortilla; él, el mantel. Desde entonces, a medias.",
  welcomeMessage:
    "Nos casamos en el prado, con mantel de cuadros y cesta. Aquí tienes todo lo que necesitas.",
  thankYouMessage:
    "Gracias por venir a Llanes, por el pícnic en el prado y por bailar entre las mantas. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Basílica de Santa María del Concejo",
      kind: "Ceremonia",
      address: "Calle Mayor, 2",
      note: "En el casco antiguo. Hay parking junto al puerto.",
      photo: "ermitaOlivos",
    },
    {
      id: "finca",
      name: "Prado de los Cuadros",
      kind: "Aperitivo, comida y fiesta",
      address: "Camino de los Bufones, km 1",
      note: "A 10 minutos, un prado frente al mar con mantas y cestas para todos.",
      photo: "cortijo",
    },
  ],
  climate: [21, 13, 30],
  program: [
    [
      "13:00",
      "Ceremonia",
      "iglesia",
      "Santa María del Concejo",
      "Con gaita a la salida.",
      "ceremony",
    ],
    ["14:15", "Aperitivo", "finca", "En el prado", "Con sidra escanciada y quesos.", "cocktail"],
    [
      "15:30",
      "Comida",
      "finca",
      "Sobre las mantas",
      "Una cesta de pícnic por mesa, con el menú que elijas.",
      "banquet",
    ],
    ["18:30", "Fiesta", "finca", "Al atardecer", "Baile en el prado y hoguera.", "party"],
  ],
  busRoutes: [
    [
      "oviedo-llanes",
      "Oviedo → Llanes",
      "Estación de autobuses de Oviedo",
      "11:15",
      ["21:00", "00:30"],
      90,
    ],
    ["ribadesella", "Ribadesella → Llanes", "Puerto de Ribadesella", "12:00", ["00:30"], 35],
  ],
  menu: {
    carne: "Empanada de carne y pastel de cabracho",
    pescado: "Bonito en escabeche",
    vegetariano: "Tortilla de patatas y ensalada de huerta",
    vegano: "Hummus de fabas y verduras asadas",
  },
  dressCode: {
    title: "Pícnic en el prado",
    detail: "Cuadros, flores y colores de campo. Hay hierba: zapato plano.",
    palette: [
      { name: "Cuadros", hex: "#a8243a" },
      { name: "Mimbre", hex: "#c99a5b" },
      { name: "Prado", hex: "#c9d9a8" },
      { name: "Mantel", hex: "#fbf5ea" },
    ],
    examples: [
      "Vestido de flores o de cuadros.",
      "Camisa de lino y tirantes.",
      "Una chaqueta: el norte refresca por la tarde.",
    ],
  },
  accommodation: [
    ["Hotel del Puerto", "En el puerto de Llanes", "Habitaciones reservadas hasta el 10 de mayo."],
    ["Casa rural Los Bufones", "Junto al prado", "Con desayuno de domingo."],
  ],
  story: {
    intro: "Una tortilla, un mantel de cuadros y siete años de pícnics. Esta es la versión corta.",
    moments: [
      ["2020", "El pícnic", "Ella trajo la tortilla; él, el mantel.", "olivos"],
      [
        "2022",
        "La cesta",
        "Nos regalamos una cesta de mimbre. La hemos usado cien veces.",
        "terraza",
      ],
      [
        "2026",
        "La pedida",
        "Con el anillo dentro de la cesta, entre las servilletas.",
        "anilloMuro",
      ],
      ["Hoy", "Y ahora, la boda", "El mantel ya está puesto. Solo faltas tú.", "olivar"],
    ],
  },
  gifts: [
    ["Nuestro viaje a la Provenza", "Pícnics entre lavanda.", "Lo que queráis"],
    ["Una cesta de pícnic completa", "Para cuatro.", "90 €"],
    ["Una manta grande de lana", "Para los prados.", "70 €"],
    ["Un curso de cocina asturiana", "Para mejorar la tortilla.", "120 €"],
  ],
  kids: "Habrá monitores, juegos en el prado y comida para ellos.",
  faq: [
    "¿Se come en el suelo?",
    "Hay mantas y cojines, pero también mesas bajas para quien lo prefiera.",
  ],
  guestbook: [
    ["Los del primer pícnic", "La tortilla sigue siendo la mejor."],
    ["Güelo Pepe", "Qué boda tan bonita, en el prado."],
    ["Nerea y Xuan", "Nos pedimos la cesta de los postres."],
  ],
  songs: ["Picnic", "Soleá", "Here Comes the Sun", "September", "Valerie", "Dancing Queen"],
});

export const molinillo = wedding({
  id: "evt-demo-celeste-lisandro",
  first: "Celeste",
  second: "Lisandro",
  date: "2027-05-08T18:00:00+02:00",
  rsvpDeadline: "2027-04-01T23:59:00+02:00",
  city: "Consuegra",
  region: "Toledo",
  couple: "olivar",
  coverPhoto: "/fotos/olivar/historia-1.jpg",
  cardMessage:
    "Nos conocimos en la feria del pueblo: él vendía molinillos de papel y ella compró todos los azules.",
  welcomeMessage:
    "Nos casamos entre molinos, donde siempre sopla el viento. Aquí tienes todo lo que necesitas.",
  thankYouMessage:
    "Gracias por venir a Consuegra, por subir al cerro de los molinos y por bailar con el viento. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia de San Juan Bautista",
      kind: "Ceremonia",
      address: "Plaza de España, 1",
      note: "En el centro del pueblo. Hay parking junto al ayuntamiento.",
      photo: "iglesia",
    },
    {
      id: "finca",
      name: "Molino del Cerro Calderico",
      kind: "Aperitivo, cena y fiesta",
      address: "Cerro Calderico, s/n",
      note: "A 10 minutos, junto a los molinos y con vistas a toda la llanura.",
      photo: "cortijo",
    },
  ],
  climate: [24, 10, 20],
  program: [
    ["18:00", "Ceremonia", "iglesia", "San Juan Bautista", "Con coro manchego.", "ceremony"],
    [
      "19:15",
      "Aperitivo",
      "finca",
      "Entre los molinos",
      "Con queso manchego y vino de la tierra.",
      "cocktail",
    ],
    [
      "20:45",
      "Cena",
      "finca",
      "En la carpa del cerro",
      "Con el menú que elijas al confirmar.",
      "banquet",
    ],
    ["23:00", "Fiesta", "finca", "Con el viento a favor", "Baile y barra libre.", "party"],
  ],
  busRoutes: [
    [
      "toledo-c",
      "Toledo → Consuegra",
      "Estación de autobuses de Toledo",
      "16:45",
      ["02:00", "04:30"],
      60,
    ],
    ["madrid-c", "Madrid → Consuegra", "Estación Sur, Madrid", "15:45", ["04:30"], 120],
  ],
  menu: {
    carne: "Perdiz estofada",
    pescado: "Bacalao con pisto",
    vegetariano: "Migas con uvas",
    vegano: "Gazpacho manchego de verduras",
  },
  dressCode: {
    title: "Primavera de colores",
    detail: "Los cuatro colores del molinillo. Arriba sopla el viento: nada de pamelas grandes.",
    palette: [
      { name: "Fresa", hex: "#ff6b6b" },
      { name: "Girasol", hex: "#ffd166" },
      { name: "Menta", hex: "#06d6a0" },
      { name: "Cielo", hex: "#118ab2" },
    ],
    examples: [
      "Vestido de un color vivo.",
      "Traje claro con pajarita de color.",
      "Un pañuelo para el pelo: el cerro es ventoso.",
    ],
  },
  accommodation: [
    [
      "Hotel La Vida de Antes",
      "En el centro de Consuegra",
      "Habitaciones reservadas hasta el 1 de abril.",
    ],
    ["Casa rural Los Molinos", "Al pie del cerro", "Con desayuno manchego."],
  ],
  story: {
    intro:
      "Un puesto de molinillos, todos los azules vendidos y ocho primaveras juntos. Esta es la versión corta.",
    moments: [
      [
        "2019",
        "La feria",
        "Ella compró todos los molinillos azules. Él le regaló uno rojo.",
        "olivos",
      ],
      ["2022", "El primer molino", "Restauramos un molino viejo con amigos.", "terraza"],
      [
        "2026",
        "La pedida",
        "Con el anillo atado a un molinillo, en lo alto del cerro.",
        "anilloMuro",
      ],
      ["Hoy", "Y ahora, la boda", "El viento ya sopla. Solo faltas tú.", "olivar"],
    ],
  },
  gifts: [
    ["Nuestro viaje a Holanda", "Para ver otros molinos.", "Lo que queráis"],
    ["Una cometa grande", "Para el cerro.", "60 €"],
    ["Una bici de paseo", "Para la llanura.", "250 €"],
    ["Una noche en un molino", "Para el aniversario.", "150 €"],
  ],
  kids: "Habrá monitores, molinillos de papel para hacer y cena para ellos.",
  faq: ["¿Hará viento?", "Siempre. Por eso hay molinos. Trae algo de abrigo para la noche."],
  guestbook: [
    ["Los de la feria", "El molinillo rojo sigue en vuestra ventana."],
    ["Abuela Sagrario", "Qué boda tan bonita, entre molinos."],
    ["Rocío y Abel", "Nos pedimos el molinillo azul."],
  ],
  songs: [
    "Molinos de viento",
    "Blowin' in the Wind",
    "El viento",
    "September",
    "Valerie",
    "Dancing Queen",
  ],
});

export const candado = wedding({
  id: "evt-demo-marisa-german",
  first: "Marisa",
  second: "Germán",
  date: "2027-09-11T18:30:00+02:00",
  rsvpDeadline: "2027-08-01T23:59:00+02:00",
  city: "Castro Urdiales",
  region: "Cantabria",
  couple: "mar",
  coverPhoto: "/fotos/buganvilla/historia-1.jpg",
  cardMessage:
    "En un viaje cerramos un candado en un puente y tiramos la llave. Ahora toca cerrar el de verdad.",
  welcomeMessage:
    "Cerramos el candado y tiramos la llave al mar. Aquí tienes todo lo que necesitas para verlo.",
  thankYouMessage:
    "Gracias por venir a Castro Urdiales y por colgar vuestro candado. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia de Santa María de la Asunción",
      kind: "Ceremonia",
      address: "Calle Subida a Santa María, 1",
      note: "Sobre el puerto. Hay parking en el paseo marítimo.",
      photo: "ermitaMar",
    },
    {
      id: "finca",
      name: "Puente del Castillo",
      kind: "Aperitivo, cena y fiesta",
      address: "Paseo del Faro, 3",
      note: "A 5 minutos, junto al puente medieval y frente al mar.",
      photo: "terrazaMar",
    },
  ],
  climate: [22, 15, 30],
  program: [
    ["18:30", "Ceremonia", "iglesia", "Santa María", "Con el mar de fondo.", "ceremony"],
    ["19:45", "Aperitivo", "finca", "En el puente", "Con anchoas y txakoli.", "cocktail"],
    ["21:15", "Cena", "finca", "Frente al mar", "Con el menú que elijas al confirmar.", "banquet"],
    ["23:30", "Fiesta", "finca", "Llave al mar", "Cada invitado cuelga su candado.", "party"],
  ],
  busRoutes: [
    ["bilbao-c", "Bilbao → Castro Urdiales", "Termibus, Bilbao", "17:15", ["02:00", "04:30"], 40],
    ["laredo", "Laredo → Castro Urdiales", "Paseo de Laredo", "17:45", ["04:30"], 25],
  ],
  menu: {
    carne: "Solomillo de ternera cántabra",
    pescado: "Bonito con tomate",
    vegetariano: "Pimientos rellenos de verduras",
    vegano: "Ensalada de alubias y pimientos",
  },
  dressCode: {
    title: "Atardecer en el Cantábrico",
    detail: "Rosa, gris hierro y un toque rojo. Al atardecer refresca: chaqueta.",
    palette: [
      { name: "Atardecer", hex: "#f6d7c3" },
      { name: "Candado", hex: "#d23b52" },
      { name: "Hierro", hex: "#2b2b2b" },
      { name: "Mar", hex: "#3f5a70" },
    ],
    examples: [
      "Vestido midi rosa o rojo.",
      "Traje gris con corbata roja.",
      "Trae tu candado: habrá rotulador para firmarlo.",
    ],
  },
  accommodation: [
    [
      "Hotel del Puerto de Castro",
      "Junto al puerto",
      "Habitaciones reservadas hasta el 1 de agosto.",
    ],
    ["Pensión del Castillo", "Junto al faro", "Con desayuno de domingo con vistas."],
  ],
  story: {
    intro:
      "Un candado en un puente de París, una llave al Sena y ocho años juntos. Esta es la versión corta.",
    moments: [
      ["2019", "El puente", "Cerramos un candado en París. La llave, al río.", "cala"],
      ["2022", "La furgoneta", "Recorrimos todos los puentes del Cantábrico.", "furgoneta"],
      ["2026", "La pedida", "Con el anillo colgado de un candado nuevo.", "anilloBarca"],
      ["Hoy", "Y ahora, la boda", "El candado está listo. Solo faltas tú.", "orilla"],
    ],
  },
  gifts: [
    ["Nuestro viaje a París", "Para volver al puente.", "Lo que queráis"],
    ["Un candado grabado", "Para la puerta de casa.", "40 €"],
    ["Un paseo en velero", "Por la costa.", "200 €"],
    ["Una cena frente al mar", "Para el aniversario.", "90 €"],
  ],
  kids: "Habrá monitores, búsqueda de llaves y cena para ellos.",
  faq: [
    "¿Hay que llevar candado?",
    "Si quieres. Si no, habrá candados para todos en el aperitivo.",
  ],
  guestbook: [
    ["Los de París", "Aquella llave sigue en el fondo del Sena."],
    ["Tía Begoña", "Qué boda más bonita junto al puente."],
    ["Leire y Jon", "Hemos colgado el candado más grande."],
  ],
  songs: [
    "Can't Help Falling in Love",
    "La llave",
    "Contigo",
    "September",
    "Valerie",
    "Dancing Queen",
  ],
});

export const gramola = wedding({
  id: "evt-demo-rebeca-nacho",
  first: "Rebeca",
  second: "Nacho",
  date: "2027-07-24T19:30:00+02:00",
  rsvpDeadline: "2027-06-10T23:59:00+02:00",
  city: "Peñíscola",
  region: "Castellón",
  couple: "mar",
  coverPhoto: "/fotos/buganvilla/historia-2.jpg",
  cardMessage:
    "Nos conocimos en un bar con gramola: los dos echamos una moneda para la misma canción.",
  welcomeMessage:
    "La gramola ya tiene monedas y la pista está lista. Aquí tienes todo lo que necesitas.",
  thankYouMessage:
    "Gracias por venir a Peñíscola y por elegir tantas canciones. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Ermita de la Virgen de la Ermitana",
      kind: "Ceremonia",
      address: "Calle del Castillo, 2",
      note: "Junto al castillo del Papa Luna. Hay parking a la entrada del casco.",
      photo: "ermitaMar",
    },
    {
      id: "finca",
      name: "Sala Gramola",
      kind: "Aperitivo, cena y fiesta",
      address: "Paseo Marítimo, 44",
      note: "A 10 minutos, con terraza al mar y una gramola de verdad.",
      photo: "pista",
    },
  ],
  climate: [30, 22, 5],
  program: [
    ["19:30", "Ceremonia", "iglesia", "La Ermitana", "Con guitarra española.", "ceremony"],
    [
      "20:45",
      "Aperitivo",
      "finca",
      "En la terraza",
      "Con langostinos de Vinaròs y cava.",
      "cocktail",
    ],
    ["22:00", "Cena", "finca", "En la sala", "Con el menú que elijas al confirmar.", "banquet"],
    ["00:00", "Fiesta", "finca", "La gramola", "Cada invitado elige una canción.", "party"],
  ],
  busRoutes: [
    [
      "castellon",
      "Castellón → Peñíscola",
      "Estación de Castellón",
      "18:00",
      ["03:00", "05:30"],
      60,
    ],
    ["vinaros", "Vinaròs → Peñíscola", "Plaza de Vinaròs", "18:45", ["05:30"], 15],
  ],
  menu: {
    carne: "Entrecot con salsa de vino",
    pescado: "Arroz a banda",
    vegetariano: "Arroz de verduras",
    vegano: "Coca de verduras asadas",
  },
  dressCode: {
    title: "Noche de gramola",
    detail: "Naranja neón, vino y negro. Zapatos para bailar toda la noche.",
    palette: [
      { name: "Neón", hex: "#ff9e3d" },
      { name: "Vino", hex: "#5a2a1c" },
      { name: "Vinilo", hex: "#1a1a1a" },
      { name: "Crema", hex: "#fbeee6" },
    ],
    examples: [
      "Vestido de los cincuenta con vuelo.",
      "Camisa estampada y tirantes.",
      "Una moneda en el bolsillo para la gramola.",
    ],
  },
  accommodation: [
    ["Hotel Papa Luna", "Frente al castillo", "Habitaciones reservadas hasta el 10 de junio."],
    ["Hostal del Puerto", "Junto al puerto", "Con desayuno hasta las 13:00."],
  ],
  story: {
    intro: "Dos monedas para la misma canción y nueve años bailando. Esta es la versión corta.",
    moments: [
      ["2018", "La gramola", "Echamos una moneda a la vez para la misma canción.", "cala"],
      ["2021", "El tocadiscos", "Juntamos nuestros vinilos en una sola estantería.", "furgoneta"],
      ["2026", "La pedida", "En el mismo bar, con la misma canción.", "anilloBarca"],
      ["Hoy", "Y ahora, la boda", "La gramola ya suena. Solo faltas tú.", "orilla"],
    ],
  },
  gifts: [
    ["Nuestro viaje a Memphis", "Para ver Graceland.", "Lo que queráis"],
    ["Una gramola de verdad", "Algún día.", "500 €"],
    ["Vinilos para la colección", "Los que tú elijas.", "40 €"],
    ["Clases de rock and roll", "Para el próximo baile.", "120 €"],
  ],
  kids: "Habrá monitores, mini disco y cena para ellos.",
  faq: [
    "¿Puedo pedir una canción?",
    "Claro: en la confirmación hay un hueco para ella. La pondremos en la gramola.",
  ],
  guestbook: [
    ["Los del bar", "Aquella canción sonó dos veces seguidas."],
    ["Abuelo Vicent", "Qué bien se baila con vosotros."],
    ["Andrea y Lucas", "Hemos echado veinte monedas."],
  ],
  songs: [
    "Rock Around the Clock",
    "Jailhouse Rock",
    "La gramola",
    "September",
    "Valerie",
    "Dancing Queen",
  ],
});

export const huellas = wedding({
  id: "evt-demo-ariana-enzo",
  first: "Ariana",
  second: "Enzo",
  date: "2027-06-12T19:30:00+02:00",
  rsvpDeadline: "2027-05-01T23:59:00+02:00",
  city: "Ciudadela",
  region: "Menorca",
  couple: "mar",
  coverPhoto: "/fotos/buganvilla/historia-4.jpg",
  cardMessage:
    "Nos conocimos siguiendo las mismas huellas en una cala vacía. Al final del camino estaba el otro.",
  welcomeMessage:
    "Nos casamos junto al mar, descalzos. Aquí tienes todo lo que necesitas para caminar con nosotros.",
  thankYouMessage:
    "Gracias por venir a Menorca y por dejar vuestras huellas junto a las nuestras. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Catedral de Ciudadela",
      kind: "Ceremonia",
      address: "Plaça de la Catedral, 1",
      note: "En el centro antiguo. Hay parking junto al puerto.",
      photo: "ermitaMar",
    },
    {
      id: "finca",
      name: "Cala de las Huellas",
      kind: "Aperitivo, cena y fiesta",
      address: "Camí de Cavalls, km 12",
      note: "A 15 minutos, en una finca sobre una cala de arena blanca.",
      photo: "terrazaMar",
    },
  ],
  climate: [27, 18, 5],
  program: [
    ["19:30", "Ceremonia", "iglesia", "La catedral", "Con guitarra y violín.", "ceremony"],
    [
      "20:45",
      "Aperitivo",
      "finca",
      "En la arena",
      "Descalzos, con pomada y queso de Mahón.",
      "cocktail",
    ],
    ["22:00", "Cena", "finca", "Sobre la cala", "Con el menú que elijas al confirmar.", "banquet"],
    ["00:00", "Fiesta", "finca", "Hasta el amanecer", "Baile junto al mar.", "party"],
  ],
  busRoutes: [
    ["mao", "Maó → Ciudadela", "Estació de Maó", "18:15", ["03:00", "05:30"], 50],
    ["ferreries", "Ferreries → Ciudadela", "Plaça de Ferreries", "18:45", ["05:30"], 25],
  ],
  menu: {
    carne: "Cordero menorquín",
    pescado: "Caldereta de langosta",
    vegetariano: "Berenjenas rellenas a la menorquina",
    vegano: "Tumbet de verduras",
  },
  dressCode: {
    title: "Descalzos en la arena",
    detail: "Blanco, arena y azul. Habrá arena: descalzos o sandalia plana.",
    palette: [
      { name: "Arena", hex: "#e3d2ae" },
      { name: "Mar", hex: "#bfe3ea" },
      { name: "Concha", hex: "#fbf6ea" },
      { name: "Huella", hex: "#6b4a2a" },
    ],
    examples: [
      "Vestido largo y suelto.",
      "Lino blanco con abarcas.",
      "Descalzos en la cala: guardamos los zapatos.",
    ],
  },
  accommodation: [
    [
      "Hotel del Port",
      "Junto al puerto de Ciudadela",
      "Habitaciones reservadas hasta el 1 de mayo.",
    ],
    ["Agroturismo Sa Cala", "Junto a la finca", "Con desayuno de ensaimadas."],
  ],
  story: {
    intro:
      "Dos caminos de huellas en una cala vacía y siete veranos juntos. Esta es la versión corta.",
    moments: [
      ["2020", "Las huellas", "Seguimos las mismas huellas y nos encontramos al final.", "cala"],
      ["2022", "La furgoneta", "Un verano entero por el Camí de Cavalls.", "furgoneta"],
      [
        "2026",
        "La pedida",
        "Escrita con el dedo en la arena, antes de que llegara la ola.",
        "anilloBarca",
      ],
      ["Hoy", "Y ahora, la boda", "Las huellas llegan a la orilla. Solo faltas tú.", "orilla"],
    ],
  },
  gifts: [
    ["Nuestro viaje a las Maldivas", "Más arena.", "Lo que queráis"],
    ["Una tabla de paddle surf", "Para las calas.", "350 €"],
    ["Una cámara de fotos", "Para las huellas que vengan.", "250 €"],
    ["Una noche en un faro", "Para el aniversario.", "200 €"],
  ],
  kids: "Habrá monitores, castillos de arena y cena para ellos.",
  faq: [
    "¿Se puede ir descalzo?",
    "Se recomienda. Guardaremos vuestros zapatos a la entrada de la cala.",
  ],
  guestbook: [
    ["Los de la cala", "Esas huellas acabaron en boda."],
    ["Àvia Margalida", "Quina boda més bonica, vora la mar."],
    ["Joana y Toni", "Hemos dejado nuestras huellas al lado."],
  ],
  songs: ["Mediterráneo", "La playa", "Ocean Eyes", "September", "Valerie", "Dancing Queen"],
});

export const nevera = wedding({
  id: "evt-demo-natalia-lucio",
  first: "Natalia",
  second: "Lucio",
  date: "2027-04-17T13:00:00+02:00",
  rsvpDeadline: "2027-03-10T23:59:00+01:00",
  city: "Zarautz",
  region: "Gipuzkoa",
  couple: "olivar",
  coverPhoto: "/fotos/olivar/historia-3.jpg",
  cardMessage:
    "Compartimos piso y nevera tres años sin decirnos nada. Un día dejó una nota en la puerta. Esta es la última.",
  welcomeMessage:
    "La nota de la nevera dice: «Boda. No faltes». Aquí tienes todo lo que necesitas.",
  thankYouMessage:
    "Gracias por venir a Zarautz y por no tocar la tarta antes de tiempo. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia de Santa María la Real",
      kind: "Ceremonia",
      address: "Kale Nagusia, 1",
      note: "En el centro. Hay parking junto al paseo.",
      photo: "iglesia",
    },
    {
      id: "finca",
      name: "Caserío de la Nevera",
      kind: "Aperitivo, comida y fiesta",
      address: "Camino de Getaria, km 2",
      note: "A 10 minutos, con viñedo de txakoli y vistas al mar.",
      photo: "cortijo",
    },
  ],
  climate: [18, 10, 40],
  program: [
    ["13:00", "Ceremonia", "iglesia", "Santa María la Real", "Con coro y txistu.", "ceremony"],
    ["14:15", "Aperitivo", "finca", "Entre viñas", "Con txakoli y pintxos.", "cocktail"],
    [
      "15:30",
      "Comida",
      "finca",
      "En el caserío",
      "Con el menú que elijas al confirmar.",
      "banquet",
    ],
    [
      "18:30",
      "Fiesta",
      "finca",
      "La tarta",
      "A las siete se abre la nevera y sale la tarta.",
      "party",
    ],
  ],
  busRoutes: [
    ["donostia", "Donostia → Zarautz", "Plaza Gipuzkoa, Donostia", "12:00", ["21:00", "00:30"], 30],
    ["getaria", "Getaria → Zarautz", "Puerto de Getaria", "12:30", ["00:30"], 10],
  ],
  menu: {
    carne: "Chuletón a la brasa",
    pescado: "Merluza en salsa verde",
    vegetariano: "Pimientos de Gernika y tortilla",
    vegano: "Porrusalda con verduras",
  },
  dressCode: {
    title: "Primavera en la costa",
    detail: "Verde menta, rosa y crema. En la costa vasca puede llover: chaqueta.",
    palette: [
      { name: "Menta", hex: "#9fd3c7" },
      { name: "Tarta", hex: "#e8a7b3" },
      { name: "Nota", hex: "#fff7a8" },
      { name: "Cromo", hex: "#cfe3dd" },
    ],
    examples: [
      "Vestido midi en tonos pastel.",
      "Traje claro con corbata menta.",
      "Una chaqueta: el norte es el norte.",
    ],
  },
  accommodation: [
    [
      "Hotel de la Playa",
      "Frente al mar de Zarautz",
      "Habitaciones reservadas hasta el 10 de marzo.",
    ],
    ["Agroturismo Getaria", "Junto al caserío", "Con desayuno de domingo."],
  ],
  story: {
    intro:
      "Una nevera compartida, cien notas en la puerta y ocho años juntos. Esta es la versión corta.",
    moments: [
      ["2019", "El piso", "Compartíamos nevera y nos escribíamos notas.", "olivos"],
      ["2021", "La nota", "«¿Cenamos?», decía una nota. Cenamos.", "terraza"],
      ["2026", "La pedida", "En una nota pegada con imán: «¿Te casas conmigo?».", "anilloMuro"],
      ["Hoy", "Y ahora, la boda", "La tarta ya está en la nevera. Solo faltas tú.", "olivar"],
    ],
  },
  gifts: [
    ["Nuestro viaje a Japón", "Cualquier aportación nos acerca.", "Lo que queráis"],
    ["Una nevera retro", "Menta, claro.", "500 €"],
    ["Imanes de todo el mundo", "Para la puerta.", "30 €"],
    ["Un curso de repostería", "Para la próxima tarta.", "120 €"],
  ],
  kids: "Habrá monitores, magdalenas para decorar y comida para ellos.",
  faq: ["¿Qué pasa con la tarta?", "Sale de la nevera a las siete. Hasta entonces, no se toca."],
  guestbook: [
    ["Los compañeros de piso", "Por fin sabemos qué decían esas notas."],
    ["Amama Josune", "Qué tarta más rica y qué boda más bonita."],
    ["Maialen y Iker", "Os hemos dejado una nota en la nevera."],
  ],
  songs: ["Cake by the Ocean", "Sugar", "Dulce", "September", "Valerie", "Dancing Queen"],
});

export const tetera = wedding({
  id: "evt-demo-esther-pelayo",
  first: "Esther",
  second: "Pelayo",
  date: "2027-10-30T17:00:00+02:00",
  rsvpDeadline: "2027-09-20T23:59:00+02:00",
  city: "Ribadeo",
  region: "Lugo",
  couple: "mar",
  coverPhoto: "/fotos/buganvilla/historia-3.jpg",
  cardMessage:
    "Nos conocimos en una casa de té, pidiendo la misma tetera. La camarera nos sirvió dos tazas de la misma.",
  welcomeMessage:
    "Os invitamos a tomar el té con nosotros, y a casarnos de paso. Aquí tienes todo lo que necesitas.",
  thankYouMessage:
    "Gracias por venir a Ribadeo y por quedaros a la última tacita. Aquí están vuestras fotos.",
  venues: [
    {
      id: "iglesia",
      name: "Iglesia de Santa María del Campo",
      kind: "Ceremonia",
      address: "Rúa de Santa María, 4",
      note: "En el casco antiguo. Hay parking junto a la ría.",
      photo: "ermitaMar",
    },
    {
      id: "finca",
      name: "Casa de Indianos do Té",
      kind: "Aperitivo, cena y fiesta",
      address: "Avenida de Galicia, 22",
      note: "A 5 minutos, una casa de indianos con jardín y salón de té.",
      photo: "terrazaMar",
    },
  ],
  climate: [17, 9, 50],
  program: [
    [
      "17:00",
      "Ceremonia",
      "iglesia",
      "Santa María do Campo",
      "Con cuarteto de cuerda.",
      "ceremony",
    ],
    [
      "18:15",
      "Aperitivo",
      "finca",
      "Té en el jardín",
      "Té, pastas y vino de la Ribeira Sacra.",
      "cocktail",
    ],
    [
      "19:45",
      "Cena",
      "finca",
      "En el salón de té",
      "Con el menú que elijas al confirmar.",
      "banquet",
    ],
    ["22:30", "Fiesta", "finca", "Última tacita", "Baile y queimada.", "party"],
  ],
  busRoutes: [
    ["lugo-r", "Lugo → Ribadeo", "Estación de autobuses de Lugo", "15:15", ["01:30", "04:00"], 90],
    ["luarca", "Luarca → Ribadeo", "Puerto de Luarca", "15:45", ["04:00"], 50],
  ],
  menu: {
    carne: "Ternera gallega al vino",
    pescado: "Merluza de pincho con almejas",
    vegetariano: "Pastel de setas y castañas",
    vegano: "Crema de calabaza y castañas",
  },
  dressCode: {
    title: "Té de otoño",
    detail: "Azul porcelana, crema y rosa. Es otoño en Galicia: paraguas y chaqueta.",
    palette: [
      { name: "Porcelana", hex: "#3f5f8a" },
      { name: "Taza", hex: "#fdfbf6" },
      { name: "Flor", hex: "#e8a7b3" },
      { name: "Té", hex: "#b5652a" },
    ],
    examples: [
      "Vestido midi de flores pequeñas.",
      "Traje de tweed con chaleco.",
      "Un paraguas bonito, por si acaso.",
    ],
  },
  accommodation: [
    [
      "Hotel Casa dos Indianos",
      "Junto a la finca",
      "Habitaciones reservadas hasta el 20 de septiembre.",
    ],
    ["Pensión da Ría", "Junto a la ría", "Con desayuno de domingo con té."],
  ],
  story: {
    intro: "Una tetera para dos, una casa de té y ocho otoños juntos. Esta es la versión corta.",
    moments: [
      ["2019", "La tetera", "Pedimos la misma. Nos sirvieron dos tazas de ella.", "cala"],
      ["2022", "El viaje", "Un mes por las casas de té de Inglaterra.", "furgoneta"],
      ["2026", "La pedida", "En los posos de una taza: «¿Te casas conmigo?».", "anilloBarca"],
      ["Hoy", "Y ahora, la boda", "El té ya está servido. Solo faltas tú.", "orilla"],
    ],
  },
  gifts: [
    ["Nuestro viaje a Japón", "Para la ceremonia del té.", "Lo que queráis"],
    ["Una tetera de porcelana", "Con flores azules.", "80 €"],
    ["Una caja de tés del mundo", "Para un año.", "60 €"],
    ["Una vajilla de té para doce", "Para las tardes de domingo.", "200 €"],
  ],
  kids: "Habrá monitores, merienda y cena para ellos.",
  faq: ["¿Habrá café?", "También. Pero el té es obligatorio a las seis."],
  guestbook: [
    ["Los de la casa de té", "Aquella tetera tenía mucho que decir."],
    ["Avoa Dolores", "Que boda máis bonita, e que té máis rico."],
    ["Uxía y Martín", "Nos tomamos la última tacita."],
  ],
  songs: ["Tea for Two", "Té para tres", "La vie en rose", "September", "Valerie", "Dancing Queen"],
});
