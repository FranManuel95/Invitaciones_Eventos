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
