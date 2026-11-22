/*
 * Portada: la foto con efecto 3D de siempre, cuatro escenas animadas dibujadas en SVG y CSS, la
 * foto como en una película, un vídeo corto subido por la pareja o un fondo pintado (acuarelas y
 * papeles con el centro despejado para los nombres). Encima puede ir un efecto que se mueve.
 */

export const COVER_IDS = [
  "foto",
  "luces",
  "acuarela",
  "estrellas",
  "herbario",
  "cine",
  "video",
  "ramas",
  "buganvilla",
  "medianoche",
  "arcilla",
  "orilla",
  "terciopelo",
  "lavanda",
  "cortijo",
  "lino",
  "granada",
  "eucalipto",
  "paniculata",
  "toile",
  "silvestres",
  "selva",
  "tarjeta",
  "cinta",
  "gaceta",
  "embarque",
  "premio",
  "telegrama",
  "postal",
  "vinilo",
  "pasaporte",
  "carta",
  "mapa",
  "constelacion",
  "comic",
  "cosecha",
  "tarot",
  "arcade",
  "semillas",
  "instantanea",
  "abanico",
  "cerillas",
  "galleta",
  "casete",
  "botella",
  "crucigrama",
  "tren",
  "receta",
  "concierto",
  "feria",
  "biblioteca",
  "llave",
  "partitura",
  "brujula",
  "lacre",
  "poker",
  "adviento",
  "horoscopo",
  "metro",
  "equipaje",
  "fidelidad",
  "diploma",
  "cromos",
  "bombones",
  "telefono",
  "radio",
  "maquina",
  "puzle",
  "tarta",
  "taquilla",
  "globo",
  "nieve",
  "brindis",
  "cometa",
  "reloj",
  "faro",
  "musica",
  "farolillo",
  "barco",
  "prensado",
  "cartas",
  "ramo",
  "anillos",
  "baile",
  "capsula",
  "sellos",
  "disco",
  "cuaderno",
  "pinata",
  "arroz",
  "vela",
] as const;
export type CoverId = (typeof COVER_IDS)[number];

export const COVERS: Record<CoverId, { label: string; description: string }> = {
  foto: {
    label: "Foto en 3D",
    description: "Vuestra foto con profundidad que se mueve con el móvil.",
  },
  luces: {
    label: "Luces y mariposas",
    description: "Guirnalda de luces, destellos y mariposas que revolotean.",
  },
  acuarela: {
    label: "Acuarela floral",
    description: "Flores pintadas que se abren y pétalos que caen.",
  },
  estrellas: {
    label: "Cielo estrellado",
    description: "Estrellas que titilan y alguna estrella fugaz.",
  },
  herbario: {
    label: "Herbario",
    description: "Ramas de olivo y eucalipto en oro que se dibujan solas, con un marco fino.",
  },
  cine: {
    label: "Película",
    description: "Vuestra foto a cámara lenta, con bandas de cine y los nombres que se enfocan.",
  },
  video: { label: "Vuestro vídeo", description: "Un vídeo corto de fondo, sin sonido y en bucle." },
  ramas: {
    label: "Ramas de olivo",
    description: "Acuarela de olivo y eucalipto sobre papel de algodón, con toques de oro.",
  },
  buganvilla: {
    label: "Buganvilla",
    description: "Pared encalada con buganvilla y la luz de la tarde entre las hojas.",
  },
  medianoche: {
    label: "Medianoche",
    description: "Azul profundo con flores y estrellas doradas.",
  },
  arcilla: {
    label: "Arcilla",
    description: "Papel artesanal color teja con rosas secas y hierba de la pampa.",
  },
  orilla: {
    label: "Orilla",
    description: "Acuarela de mar en calma, arena clara y conchas.",
  },
  terciopelo: {
    label: "Terciopelo",
    description: "Terciopelo verde con hojas en penumbra y un marco dorado art déco.",
  },
  lavanda: {
    label: "Lavanda",
    description: "Tallos de lavanda en acuarela sobre papel lila.",
  },
  cortijo: {
    label: "Pampa",
    description: "Plumeros de la pampa sobre papel color trigo, con un lacre de sol.",
  },
  lino: {
    label: "Paniculata",
    description: "Paniculata muy fina sobre blanco de lino, con un filete doble.",
  },
  granada: {
    label: "Olivo en oro",
    description: "Vino oscuro con ramas de olivo doradas y un lacre de almendro.",
  },
  eucalipto: {
    label: "Eucalipto",
    description: "Ramas de eucalipto sobre verde gris, con un lacre de hoja.",
  },
  paniculata: {
    label: "Paniculata",
    description: "Ramas de paniculata y eucalipto en acuarela sobre salvia pálido.",
  },
  toile: {
    label: "Toile azul",
    description: "Papel pintado de pajarillos azules y una tarjeta marfil en el centro.",
  },
  silvestres: {
    label: "Flores silvestres",
    description: "Florecillas rosa y salvia alrededor de una tarjeta lisa.",
  },
  selva: {
    label: "Selva",
    description: "Hojas tropicales verdes y una tarjeta esmeralda con filete de oro.",
  },
  tarjeta: {
    label: "Tarjeta a la luz",
    description:
      "Vuestros nombres en una tarjeta entre paniculata, con la luz de la tarde (vídeo).",
  },
  cinta: {
    label: "Cinta de seda",
    description: "Una cinta burdeos sobre mantel de lino, con la luz de la ventana (vídeo).",
  },
  gaceta: {
    label: "Gaceta",
    description:
      "La portada de un periódico: cabecera, titular con vuestros nombres y foto en trama.",
  },
  embarque: {
    label: "Tarjeta de embarque",
    description: "Un billete a nombre del invitado que se abre arrancando el resguardo.",
  },
  premio: {
    label: "Décimo premiado",
    description: "Un décimo de lotería con la fecha bajo una capa dorada que se rasca.",
  },
  telegrama: {
    label: "Telegrama",
    description: "Un telegrama urgente que se teclea solo, con sus tiras de papel y sus STOP.",
  },
  postal: {
    label: "Postal",
    description:
      "Una postal con vuestra foto; al girarla, el mensaje a mano, el sello y el matasellos.",
  },
  vinilo: {
    label: "Vinilo",
    description:
      "La funda de un sencillo con el disco asomando: se saca el disco y empieza a sonar.",
  },
  pasaporte: {
    label: "Pasaporte",
    description: "Un pasaporte que se abre por la hoja de datos, a nombre del invitado.",
  },
  carta: {
    label: "Carta de restaurante",
    description:
      "La carta de un restaurante: el programa son los platos y la fecha espera bajo la campana.",
  },
  mapa: {
    label: "Mapa del tesoro",
    description: "Un mapa a mano con la ruta hasta la boda: se sigue con el dedo hasta la X.",
  },
  constelacion: {
    label: "Constelación",
    description: "La carta celeste de esa noche: se unen las estrellas y la figura se enciende.",
  },
  comic: {
    label: "Cómic",
    description: "La portada de un tebeo con sus viñetas; la última trae la fecha.",
  },
  cosecha: {
    label: "Cosecha",
    description: "Una botella con vuestra etiqueta y vuestra añada: se descorcha para abrir.",
  },
  tarot: {
    label: "Tarot",
    description:
      "Una carta boca abajo que, al girarla, es la de los enamorados con vuestros nombres.",
  },
  arcade: {
    label: "Arcade",
    description: "La pantalla de inicio de una recreativa: jugador 1, jugador 2 y un botón rojo.",
  },
  semillas: {
    label: "Sobre de semillas",
    description:
      "Un sobre de semillas con vuestra variedad: se siembra y brotan flores alrededor de la fecha.",
  },
  instantanea: {
    label: "Instantánea",
    description: "Una foto instantánea en blanco: al frotarla aparece vuestra foto.",
  },
  abanico: {
    label: "Abanico",
    description: "Un abanico de encaje rojo que se despliega con la fecha pintada.",
  },
  cerillas: {
    label: "Caja de cerillas",
    description: "Una caja de fósforos con vuestra marca: se empuja el cajón y se enciende.",
  },
  galleta: {
    label: "Galleta de la suerte",
    description: "Se parte la galleta y sale la fortuna con vuestra fecha.",
  },
  casete: {
    label: "Casete",
    description: "Una cinta grabada a mano que se rebobina; las canciones son el programa.",
  },
  botella: {
    label: "Mensaje en una botella",
    description: "Una botella en la orilla: se tira del corcho y sale la carta.",
  },
  crucigrama: {
    label: "Crucigrama",
    description: "Vuestros nombres cruzados en la cuadrícula; la fecha y el lugar son las pistas.",
  },
  tren: {
    label: "Billete de tren",
    description: "Un billete de cartón con destino a vuestra boda que el invitado pica.",
  },
  receta: {
    label: "Receta de la abuela",
    description: "La ficha de cocina de la boda: los ingredientes sois vosotros y se van tachando.",
  },
  concierto: {
    label: "Entrada de concierto",
    description: "La entrada de vuestra gira «Sí, quiero»: el invitado la escanea en la puerta.",
  },
  feria: {
    label: "Cartel de feria",
    description: "Un cartel de fiestas con farolillos que se encienden al tocarlos.",
  },
  biblioteca: {
    label: "Ficha de biblioteca",
    description: "La ficha de préstamo de vuestra historia: la boda se sella con su fecha.",
  },
  llave: {
    label: "Llave de hotel",
    description: "La llave de latón de la habitación: el número es vuestra fecha y se gira.",
  },
  partitura: {
    label: "Partitura",
    description: "Vuestra marcha nupcial en un pentagrama: las notas suenan al tocarlas.",
  },
  brujula: {
    label: "Brújula",
    description: "Una brújula de latón cuya aguja busca el lugar de la boda.",
  },
  lacre: {
    label: "Lacre",
    description:
      "Un sello de latón sobre cera burdeos: el invitado lo estampa con el dedo (vídeo).",
  },
  poker: {
    label: "Póker",
    description: "Una mano en el tapete: al destaparla, escalera de color con vuestras iniciales.",
  },
  adviento: {
    label: "Calendario de puertas",
    description: "La cuenta atrás del mes de la boda: se abre la ventanita de vuestro día.",
  },
  horoscopo: {
    label: "Horóscopo",
    description: "La columna del periódico con el signo del día de la boda y su predicción.",
  },
  metro: {
    label: "Plano de metro",
    description:
      "Una línea con vuestro nombre: las paradas son el programa y el tren llega a la fiesta.",
  },
  equipaje: {
    label: "Etiqueta de equipaje",
    description: "Pasajeros, destino y contenido frágil; al darle la vuelta, la fecha.",
  },
  fidelidad: {
    label: "Tarjeta de fidelidad",
    description: "Nueve sellos de café y el décimo, el de la boda gratis, lo pone el invitado.",
  },
  diploma: {
    label: "Diploma",
    description:
      "Un título enrollado: «Licenciados en quererse», que se desenrolla tirando del rodillo.",
  },
  cromos: {
    label: "Sobre de cromos",
    description:
      "Un sobre de la colección de la boda: se rasga y salen vuestros cromos y el de la fecha.",
  },
  bombones: {
    label: "Caja de bombones",
    description: "Seis bombones y, en cada uno, un dato del día: fecha, lugar, hora y fiesta.",
  },
  telefono: {
    label: "Teléfono de disco",
    description: "Un teléfono antiguo: el invitado marca vuestra fecha girando el disco.",
  },
  radio: {
    label: "Radio antigua",
    description: "Una radio de madera que se sintoniza en la emisora de vuestra boda.",
  },
  maquina: {
    label: "Máquina de escribir",
    description: "Una carta en el rodillo: al teclear, se escriben vuestros nombres.",
  },
  puzle: {
    label: "Puzle",
    description: "Vuestra foto en nueve piezas revueltas: se giran hasta que encaja.",
  },
  tarta: {
    label: "Tarta nupcial",
    description: "Una tarta de tres pisos: al cortar la porción, cada piso dice un dato del día.",
  },
  taquilla: {
    label: "Entrada de cine",
    description:
      "Estreno de «Felices para siempre»: sesión, sala y butaca, y se arranca la matriz.",
  },
  globo: {
    label: "Globo aerostático",
    description:
      "Un globo listo para despegar: al soltar el lastre, sube con la fecha en la cesta.",
  },
  nieve: {
    label: "Bola de nieve",
    description: "Un recuerdo de cristal: al agitarlo nieva y, al posarse, aparece la fecha.",
  },
  brindis: {
    label: "Brindis",
    description: "Dos copas con vuestros nombres que chocan al tocarlas: ¡chin, chin!",
  },
  cometa: {
    label: "Cometa",
    description: "Una cometa en la playa: al tirar del hilo sube con vuestros nombres en la cola.",
  },
  reloj: {
    label: "Reloj de arena",
    description: "Se le da la vuelta y cae la arena hasta llegar a la fecha.",
  },
  faro: {
    label: "Faro",
    description: "Un faro de noche en la costa: al encenderlo, su haz os guía hasta la boda.",
  },
  musica: {
    label: "Caja de música",
    description: "Se le da cuerda tres veces, se abre la tapa y la bailarina gira con la melodía.",
  },
  farolillo: {
    label: "Farolillo de papel",
    description:
      "Un farolillo con vuestros nombres: se enciende la mecha y sube al cielo de noche.",
  },
  barco: {
    label: "Barco de papel",
    description: "Se suelta en el agua y navega hasta el muelle del lugar de la boda.",
  },
  prensado: {
    label: "Rama prensada",
    description: "Un cuaderno de herbario: al pasar la tapa, una rama de olivo con su etiqueta.",
  },
  cartas: {
    label: "Cartas atadas",
    description: "Un fajo de cartas con cinta burdeos: se tira del lazo y se abren en abanico.",
  },
  ramo: {
    label: "Ramo de novia",
    description: "El ramo se lanza, vuela por la pantalla y cae en tus manos.",
  },
  anillos: {
    label: "Estuche de anillos",
    description:
      "Un estuche de terciopelo: se abre con un clic y la fecha va grabada en los anillos.",
  },
  baile: {
    label: "Carné de baile",
    description: "El carné de baile de antes, con un baile libre para apuntar al invitado.",
  },
  capsula: {
    label: "Cápsula del tiempo",
    description: "Una lata enterrada que se desentierra: «No abrir hasta» el año de la boda.",
  },
  sellos: {
    label: "Pliego de sellos",
    description:
      "Un pliego de sellos con vuestras iniciales: se arranca uno y lleva el matasellos.",
  },
  disco: {
    label: "Bola de discoteca",
    description:
      "Una sala a oscuras: se enciende la bola y los reflejos bailan alrededor de la fecha.",
  },
  cuaderno: {
    label: "Cuaderno de viaje",
    description: "Un cuaderno con billetes y mapas pegados: se pasan las páginas hasta el destino.",
  },
  pinata: {
    label: "Piñata",
    description: "Una piñata de estrella: tres golpes y se rompe en una lluvia de caramelos.",
  },
  arroz: {
    label: "Lluvia de arroz",
    description: "Un cucurucho de papel: se lanza el arroz y cae sobre vuestros nombres.",
  },
  vela: {
    label: "Vela",
    description: "Una vela encendida: se sopla, se pide un deseo y queda la fecha.",
  },
};

/**
 * Portadas de concepto: no son un fondo con los nombres encima, sino un objeto entero (un
 * periódico, un billete, un décimo) con su propia composición. `paper` e `ink` son los colores
 * de la hoja; casi todas son claras, y las oscuras lo dicen con `tone`.
 */
export const CONCEPT_COVERS = {
  gaceta: { ink: "#161513", paper: "#f4f1e8" },
  embarque: { ink: "#14233f", paper: "#dfe8f1" },
  premio: { ink: "#1b3527", paper: "#f5f2e4" },
  telegrama: { ink: "#1f2f4d", paper: "#f0e6cb" },
  postal: { ink: "#1e3a6e", paper: "#efe5d0" },
  vinilo: { ink: "#1c1917", paper: "#f3ead8" },
  pasaporte: { ink: "#1e1b2e", paper: "#e9e2d2" },
  carta: { ink: "#22201c", paper: "#fbf8f1" },
  mapa: { ink: "#3b2a1a", paper: "#efe2c4" },
  constelacion: { ink: "#f2ecdb", paper: "#0d1530", tone: "oscuro" },
  comic: { ink: "#141414", paper: "#fbf3df" },
  cosecha: { ink: "#2a1a1f", paper: "#f4efe2" },
  tarot: { ink: "#f1e7d0", paper: "#1c1630", tone: "oscuro" },
  arcade: { ink: "#f4f4f0", paper: "#12122b", tone: "oscuro" },
  semillas: { ink: "#2b3a23", paper: "#ece0c5" },
  instantanea: { ink: "#2a221b", paper: "#cdb99a" },
  abanico: { ink: "#3a1418", paper: "#f4e7d6" },
  cerillas: { ink: "#1f2433", paper: "#e4d6b8" },
  galleta: { ink: "#2b1a14", paper: "#f3e4cc" },
  casete: { ink: "#1d1f2b", paper: "#e7dfcf" },
  botella: { ink: "#1f3a37", paper: "#e9e1cf" },
  crucigrama: { ink: "#1b1b1b", paper: "#e4e0d6" },
  tren: { ink: "#1f2b1d", paper: "#e6dcc6" },
  receta: { ink: "#3b2a20", paper: "#eadfca" },
  concierto: { ink: "#f4f1ea", paper: "#16121f", tone: "oscuro" },
  feria: { ink: "#3a1418", paper: "#f0e2c6" },
  biblioteca: { ink: "#2a2622", paper: "#ddd3bd" },
  llave: { ink: "#3a2a14", paper: "#e9dcc0" },
  partitura: { ink: "#2b2620", paper: "#e7dfcc" },
  brujula: { ink: "#3b2e1c", paper: "#e4d7b8" },
  lacre: { ink: "#2e1a16", paper: "#e9dcc6" },
  poker: { ink: "#f2e6c9", paper: "#0f3a26", tone: "oscuro" },
  adviento: { ink: "#1f3b5c", paper: "#e7dcc6" },
  horoscopo: { ink: "#1f1d2b", paper: "#e2ddd0" },
  metro: { ink: "#1f2433", paper: "#e5e6ea" },
  equipaje: { ink: "#2c2418", paper: "#e7dcc6" },
  fidelidad: { ink: "#3a2416", paper: "#e6dccb" },
  diploma: { ink: "#3a2a1a", paper: "#e6dcc6" },
  cromos: { ink: "#1d1f2b", paper: "#e9e3d6" },
  bombones: { ink: "#3b1f17", paper: "#efe3d2" },
  telefono: { ink: "#3a1418", paper: "#eadfca" },
  radio: { ink: "#2c1a0c", paper: "#e6d8bc" },
  maquina: { ink: "#1f2a27", paper: "#e3dfd3" },
  puzle: { ink: "#2d2a26", paper: "#e9e4da" },
  tarta: { ink: "#4a2a33", paper: "#f6ece6" },
  taquilla: { ink: "#f3dfc0", paper: "#2a0b10", tone: "oscuro" },
  globo: { ink: "#2a2a3a", paper: "#cfe0ea" },
  nieve: { ink: "#2f4a5e", paper: "#e6ecef" },
  brindis: { ink: "#f6ecd4", paper: "#141024", tone: "oscuro" },
  cometa: { ink: "#2a3340", paper: "#d8ecf3" },
  reloj: { ink: "#3a2616", paper: "#efe4cc" },
  faro: { ink: "#e9eef6", paper: "#0f1a33", tone: "oscuro" },
  musica: { ink: "#4a1f2a", paper: "#f3dde2" },
  farolillo: { ink: "#f6ead8", paper: "#1c1436", tone: "oscuro" },
  barco: { ink: "#1f3b44", paper: "#eee7d8" },
  prensado: { ink: "#2f3a28", paper: "#f1ecdc" },
  cartas: { ink: "#3a2a1c", paper: "#ebe0cc" },
  ramo: { ink: "#4a2230", paper: "#f8ece6" },
  anillos: { ink: "#f6e9d8", paper: "#1a0f18", tone: "oscuro" },
  baile: { ink: "#2e1d33", paper: "#efe4ee" },
  capsula: { ink: "#22301f", paper: "#e4ecdc" },
  sellos: { ink: "#22303f", paper: "#efe7d8" },
  disco: { ink: "#f7eefc", paper: "#0d0818", tone: "oscuro" },
  cuaderno: { ink: "#2f2418", paper: "#e8dcc6" },
  pinata: { ink: "#3a1f2c", paper: "#fff0d4" },
  arroz: { ink: "#2f2a22", paper: "#f0ece2" },
  vela: { ink: "#f6ead8", paper: "#1e140c", tone: "oscuro" },
} as const satisfies Partial<Record<CoverId, { ink: string; paper: string; tone?: "oscuro" }>>;
export type ConceptCoverId = keyof typeof CONCEPT_COVERS;
export function isConceptCover(id: CoverId): id is ConceptCoverId {
  return id in CONCEPT_COVERS;
}
/** Portadas de concepto de fondo oscuro (cielo, tarot, recreativa): los botones van en blanco. */
export function isDarkConcept(id: ConceptCoverId) {
  return "tone" in CONCEPT_COVERS[id];
}
/** Si los botones que van encima de la portada deben ir en tinta (portada clara) o en blanco. */
export function isLightCover(id: CoverId) {
  if (isConceptCover(id)) return !isDarkConcept(id);
  return isPaintedCover(id) && PAINTED_COVERS[id].tone === "claro";
}

/**
 * Fondos pintados: una imagen en `public/portadas/<id>.webp`. Los claros llevan los nombres en
 * tinta (`ink`) y un halo del color del papel (`paper`) detrás; los oscuros, en blanco.
 */
export const PAINTED_COVERS = {
  ramas: { tone: "claro", ink: "#34432f", paper: "#fbf9f1" },
  buganvilla: { tone: "claro", ink: "#5c1f3d", paper: "#fdf6ee" },
  medianoche: { tone: "oscuro", ink: "#ffffff", paper: "#16224f" },
  arcilla: { tone: "oscuro", ink: "#ffffff", paper: "#b7705a" },
  orilla: { tone: "claro", ink: "#24465c", paper: "#f6fafb" },
  terciopelo: { tone: "oscuro", ink: "#ffffff", paper: "#0e3327" },
  lavanda: { tone: "claro", ink: "#3a2f63", paper: "#f6f3fa" },
  cortijo: { tone: "claro", ink: "#4a2c18", paper: "#f3e6cf" },
  lino: { tone: "claro", ink: "#3a332c", paper: "#f8f4ec" },
  granada: { tone: "oscuro", ink: "#ffffff", paper: "#3a121b" },
  eucalipto: { tone: "claro", ink: "#22382f", paper: "#e7efe9" },
  paniculata: { tone: "claro", ink: "#2c3d2f", paper: "#eef1e7" },
  toile: { tone: "claro", ink: "#24406e", paper: "#f7f3ea" },
  silvestres: { tone: "claro", ink: "#5e2f3c", paper: "#fbf4f0" },
  selva: { tone: "oscuro", ink: "#ffffff", paper: "#123326" },
  tarjeta: { tone: "claro", ink: "#3d3226", paper: "#efe6d6" },
  cinta: { tone: "claro", ink: "#4a1a22", paper: "#efe4d8" },
} as const satisfies Partial<
  Record<CoverId, { tone: "claro" | "oscuro"; ink: string; paper: string }>
>;
export type PaintedCoverId = keyof typeof PAINTED_COVERS;
/** Fondos pintados que se mueven: un bucle en `public/portadas/<id>.mp4` y `.webm`. */
export const MOVING_PAINTED_COVERS: readonly PaintedCoverId[] = ["tarjeta", "cinta"];
export function isPaintedCover(id: CoverId): id is PaintedCoverId {
  return id in PAINTED_COVERS;
}

/** Efecto sobre la portada: un vídeo corto en bucle que solo suma luz (se ve en fondos oscuros). */
export const COVER_EFFECT_IDS = ["ninguno", "petalos", "oro", "luciernagas"] as const;
export type CoverEffectId = (typeof COVER_EFFECT_IDS)[number];

export const COVER_EFFECTS: Record<CoverEffectId, { label: string; description: string }> = {
  ninguno: { label: "Sin efecto", description: "La portada tal cual." },
  petalos: { label: "Pétalos", description: "Pétalos blancos que caen despacio." },
  oro: { label: "Polvo de oro", description: "Motas doradas que flotan y brillan." },
  luciernagas: {
    label: "Luciérnagas",
    description: "Puntos de luz cálida que se encienden y se apagan.",
  },
};

/** Generador pseudoaleatorio con semilla (mulberry32): las escenas son iguales en cada carga. */
export function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Motivo de acuarela que acompaña toda la invitación (no solo la portada): la cabecera y el
 * cierre siguen pintados, cada sección lleva su ramita, y la carta, una esquina pintada y un
 * lacre de verdad. Las imágenes están en `public/acuarelas/<id>.webp` y `<id>-lacre.webp`.
 */
export const MOTIF_IDS = [
  "ninguno",
  "lavanda",
  "pampa",
  "olivo",
  "buganvilla",
  "paniculata",
  "eucalipto",
  "gaceta",
  "embarque",
  "premio",
  "telegrama",
  "postal",
  "vinilo",
  "pasaporte",
  "carta",
  "mapa",
  "constelacion",
  "comic",
  "cosecha",
  "tarot",
  "arcade",
  "semillas",
  "instantanea",
  "abanico",
  "cerillas",
  "galleta",
  "casete",
  "botella",
  "crucigrama",
  "tren",
  "receta",
  "concierto",
  "feria",
  "biblioteca",
  "llave",
  "partitura",
  "brujula",
  "lacre",
  "poker",
  "adviento",
  "horoscopo",
  "metro",
  "equipaje",
  "fidelidad",
  "diploma",
  "cromos",
  "bombones",
  "telefono",
  "radio",
  "maquina",
  "puzle",
  "tarta",
  "taquilla",
  "globo",
  "nieve",
  "brindis",
  "cometa",
  "reloj",
  "faro",
  "musica",
  "farolillo",
  "barco",
  "prensado",
  "cartas",
  "ramo",
  "anillos",
  "baile",
  "capsula",
  "sellos",
  "disco",
  "cuaderno",
  "pinata",
  "arroz",
  "vela",
] as const;
export type MotifId = (typeof MOTIF_IDS)[number];
/**
 * `kind`: «acuarela» lleva ramas y lacre recortados; «concepto» viste la invitación con el
 * objeto de su portada (páginas de periódico, matasellos, número de serie).
 */
export const MOTIFS: Record<MotifId, { label: string; kind: "acuarela" | "concepto" | null }> = {
  ninguno: { label: "Sin motivo", kind: null },
  lavanda: { label: "Lavanda en acuarela", kind: "acuarela" },
  pampa: { label: "Plumeros de la pampa", kind: "acuarela" },
  olivo: { label: "Olivo en oro", kind: "acuarela" },
  buganvilla: { label: "Buganvilla y lacre de corazón", kind: "acuarela" },
  paniculata: { label: "Paniculata y lacre de almendro", kind: "acuarela" },
  eucalipto: { label: "Eucalipto y lacre de hoja", kind: "acuarela" },
  gaceta: { label: "Periódico", kind: "concepto" },
  embarque: { label: "Correo aéreo", kind: "concepto" },
  premio: { label: "Décimo de lotería", kind: "concepto" },
  telegrama: { label: "Telégrafos", kind: "concepto" },
  postal: { label: "Sellos y matasellos", kind: "concepto" },
  vinilo: { label: "Disco de vinilo", kind: "concepto" },
  pasaporte: { label: "Visados y sellos", kind: "concepto" },
  carta: { label: "Carta de restaurante", kind: "concepto" },
  mapa: { label: "Mapa del tesoro", kind: "concepto" },
  constelacion: { label: "Carta celeste", kind: "concepto" },
  comic: { label: "Tebeo", kind: "concepto" },
  cosecha: { label: "Bodega", kind: "concepto" },
  tarot: { label: "Arcanos", kind: "concepto" },
  arcade: { label: "Recreativa", kind: "concepto" },
  semillas: { label: "Vivero", kind: "concepto" },
  instantanea: { label: "Álbum de fotos", kind: "concepto" },
  abanico: { label: "Abanico y feria", kind: "concepto" },
  cerillas: { label: "Fósforos", kind: "concepto" },
  galleta: { label: "Fortuna", kind: "concepto" },
  casete: { label: "Cinta de casete", kind: "concepto" },
  botella: { label: "Mensaje en una botella", kind: "concepto" },
  crucigrama: { label: "Pasatiempos", kind: "concepto" },
  tren: { label: "Ferrocarril", kind: "concepto" },
  receta: { label: "Recetario", kind: "concepto" },
  concierto: { label: "Gira en directo", kind: "concepto" },
  feria: { label: "Fiestas del pueblo", kind: "concepto" },
  biblioteca: { label: "Biblioteca", kind: "concepto" },
  llave: { label: "Gran hotel", kind: "concepto" },
  partitura: { label: "Partitura", kind: "concepto" },
  brujula: { label: "Cuaderno de bitácora", kind: "concepto" },
  lacre: { label: "Sello y lacre", kind: "concepto" },
  poker: { label: "Casino", kind: "concepto" },
  adviento: { label: "Calendario de puertas", kind: "concepto" },
  horoscopo: { label: "Astros", kind: "concepto" },
  metro: { label: "Red de metro", kind: "concepto" },
  equipaje: { label: "Equipaje", kind: "concepto" },
  fidelidad: { label: "Cafetería", kind: "concepto" },
  diploma: { label: "Universidad del Amor", kind: "concepto" },
  cromos: { label: "Álbum de cromos", kind: "concepto" },
  bombones: { label: "Bombonería", kind: "concepto" },
  telefono: { label: "Centralita", kind: "concepto" },
  radio: { label: "Radio Amor", kind: "concepto" },
  maquina: { label: "Mecanografía", kind: "concepto" },
  puzle: { label: "Rompecabezas", kind: "concepto" },
  tarta: { label: "Pastelería", kind: "concepto" },
  taquilla: { label: "Sala de cine", kind: "concepto" },
  globo: { label: "Vuelo en globo", kind: "concepto" },
  nieve: { label: "Bola de nieve", kind: "concepto" },
  brindis: { label: "Brindis", kind: "concepto" },
  cometa: { label: "Día de cometas", kind: "concepto" },
  reloj: { label: "Reloj de arena", kind: "concepto" },
  faro: { label: "Faro", kind: "concepto" },
  musica: { label: "Caja de música", kind: "concepto" },
  farolillo: { label: "Farolillos", kind: "concepto" },
  barco: { label: "Barco de papel", kind: "concepto" },
  prensado: { label: "Herbario de campo", kind: "concepto" },
  cartas: { label: "Cartas de amor", kind: "concepto" },
  ramo: { label: "Ramo de novia", kind: "concepto" },
  anillos: { label: "Joyería", kind: "concepto" },
  baile: { label: "Salón de baile", kind: "concepto" },
  capsula: { label: "Cápsula del tiempo", kind: "concepto" },
  sellos: { label: "Filatelia", kind: "concepto" },
  disco: { label: "Discoteca", kind: "concepto" },
  cuaderno: { label: "Cuaderno de viaje", kind: "concepto" },
  pinata: { label: "Piñata", kind: "concepto" },
  arroz: { label: "Lluvia de arroz", kind: "concepto" },
  vela: { label: "Vela", kind: "concepto" },
};
