import { MOTIFS, type MotifId } from "./cover";

/*
 * Lo que cada plantilla de concepto cambia fuera de la portada: el objeto que trae la carta (la
 * apertura «concepto»), el membrete y la despedida de la carta, y las etiquetas del pase del
 * invitado. Solo texto: el aspecto va en globals.css, por `data-motif`.
 *
 * Regla de las plantillas de concepto: el humor va en los detalles. Las etiquetas del pase que
 * importan (mesa, autobús) siguen diciendo «mesa» y «autobús».
 */
export interface ConceptKit {
  /** Lo que se abre, con su artículo: «el telegrama». Da nombre al botón: «Abrir el telegrama». */
  object: string;
  /** Rótulo impreso en el objeto que trae la carta. */
  carrier: string;
  /** Membrete de la carta y despedida al pie. */
  letterhead: string;
  signoff: string;
  pass: {
    /** Lo que es el pase en ese mundo («Tarjeta de embarque»). */
    kicker: string;
    /** Cómo se llama a quienes vienen. */
    people: string;
    table?: string;
    bus?: string;
  };
}

type ConceptMotifId = Exclude<
  MotifId,
  "ninguno" | "lavanda" | "pampa" | "olivo" | "buganvilla" | "paniculata" | "eucalipto"
>;

export const CONCEPT_KITS: Record<ConceptMotifId, ConceptKit> = {
  gaceta: {
    object: "el periódico",
    carrier: "Edición especial · Reparto a domicilio",
    letterhead: "La Gaceta · Noticia breve",
    signoff: "Sigue en la página 2",
    pass: {
      kicker: "Acreditación de prensa",
      people: "Acreditados",
      table: "Mesa de redacción",
      bus: "Autobús de reparto",
    },
  },
  embarque: {
    object: "el sobre de correo aéreo",
    carrier: "Par avion · Correo aéreo",
    letterhead: "Etiqueta de equipaje · Prioridad",
    signoff: "Buen vuelo",
    pass: {
      kicker: "Tarjeta de embarque",
      people: "Pasajeros",
      table: "Asiento (mesa)",
      bus: "Conexión en autobús",
    },
  },
  premio: {
    object: "el sobre de la administración",
    carrier: "Administración de lotería n.º 1",
    letterhead: "Bases del sorteo",
    signoff: "El premio se recoge en persona",
    pass: { kicker: "Décimo premiado", people: "Agraciados" },
  },
  telegrama: {
    object: "el telegrama",
    carrier: "Servicio de telégrafos · Urgente",
    letterhead: "Telegrama · Texto completo",
    signoff: "Fin del mensaje STOP",
    pass: { kicker: "Acuse de recibo", people: "Destinatarios" },
  },
  postal: {
    object: "la postal",
    carrier: "Correos · Tarjeta postal",
    letterhead: "Tarjeta postal",
    signoff: "Franqueo pagado en ilusión",
    pass: { kicker: "Postal de vuelta", people: "Remitentes" },
  },
  vinilo: {
    object: "la funda",
    carrier: "Sencillo · 45 revoluciones",
    letterhead: "Notas de la funda",
    signoff: "Fin de la cara A",
    pass: { kicker: "Entrada al concierto", people: "Público" },
  },
  pasaporte: {
    object: "el pasaporte",
    carrier: "Pasaporte · Documento de viaje",
    letterhead: "Visado de entrada",
    signoff: "Buen viaje",
    pass: { kicker: "Visado concedido", people: "Titulares" },
  },
  carta: {
    object: "la carta",
    carrier: "Carta de la casa",
    letterhead: "Recomendación de la casa",
    signoff: "La casa invita",
    pass: { kicker: "Reserva confirmada", people: "Comensales" },
  },
  mapa: {
    object: "el mapa",
    carrier: "Mapa del tesoro · No perder",
    letterhead: "Diario de a bordo",
    signoff: "La X marca el sitio",
    pass: { kicker: "Salvoconducto", people: "Tripulación", bus: "Autobús (ruta marítima)" },
  },
  constelacion: {
    object: "la carta celeste",
    carrier: "Carta celeste · Hemisferio norte",
    letterhead: "Observación del cielo",
    signoff: "Visible a simple vista",
    pass: { kicker: "Pase de observatorio", people: "Observadores" },
  },
  comic: {
    object: "el tebeo",
    carrier: "¡Número 1! · Edición de coleccionista",
    letterhead: "Mientras tanto…",
    signoff: "¡Continuará!",
    pass: { kicker: "Carné del club de lectores", people: "Lectores" },
  },
  cosecha: {
    object: "la caja de la botella",
    carrier: "Reserva especial · Frágil",
    letterhead: "Nota de cata",
    signoff: "Consumir en buena compañía",
    pass: { kicker: "Invitación a la cata", people: "Catadores" },
  },
  tarot: {
    object: "la baraja",
    carrier: "Arcanos mayores",
    letterhead: "La lectura",
    signoff: "Así estaba escrito",
    pass: { kicker: "Carta del destino", people: "Consultantes" },
  },
  arcade: {
    object: "la máquina",
    carrier: "Inserte moneda",
    letterhead: "Instrucciones del juego",
    signoff: "¿Continuar? Sí",
    pass: { kicker: "Ficha de jugador", people: "Jugadores" },
  },
  semillas: {
    object: "el sobre de semillas",
    carrier: "Semillas de temporada",
    letterhead: "Instrucciones de siembra",
    signoff: "Florece cada aniversario",
    pass: { kicker: "Ficha de vivero", people: "Jardineros" },
  },
  instantanea: {
    object: "la foto",
    carrier: "Revelado instantáneo",
    letterhead: "Escrito al dorso de la foto",
    signoff: "Para pegar en el álbum",
    pass: { kicker: "Foto de grupo", people: "Salen en la foto" },
  },
  abanico: {
    object: "el abanico",
    carrier: "Abanico de encaje",
    letterhead: "Pintado en el país del abanico",
    signoff: "Con mucho arte",
    pass: { kicker: "Entrada a la caseta", people: "Invitados" },
  },
  cerillas: {
    object: "la caja de cerillas",
    carrier: "Fósforos de seguridad",
    letterhead: "Instrucciones de la caja",
    signoff: "Frótese con cariño",
    pass: { kicker: "Vale por una noche", people: "Contenido" },
  },
  galleta: {
    object: "la galleta",
    carrier: "Galleta de la suerte",
    letterhead: "Lo que dice vuestra fortuna",
    signoff: "La fortuna no falla",
    pass: { kicker: "Fortuna personal", people: "Afortunados" },
  },
  casete: {
    object: "la cinta",
    carrier: "Cinta grabada a mano",
    letterhead: "Notas de la cara A",
    signoff: "Fin de la cara A · Dale la vuelta",
    pass: { kicker: "Pase de backstage", people: "En la lista" },
  },
  botella: {
    object: "la botella",
    carrier: "Mensaje en una botella",
    letterhead: "Escrito en la orilla",
    signoff: "Devuélvase al mar con la respuesta",
    pass: { kicker: "Pasaje de vuelta", people: "Náufragos" },
  },
  crucigrama: {
    object: "el periódico",
    carrier: "Pasatiempos · Edición especial",
    letterhead: "Solución del crucigrama",
    signoff: "Soluciones en la próxima edición",
    pass: { kicker: "Autodefinido", people: "Jugadores" },
  },
  tren: {
    object: "el billete",
    carrier: "Ferrocarril de la boda",
    letterhead: "Aviso a los viajeros",
    signoff: "Próxima parada: el baile",
    pass: {
      kicker: "Billete de ida",
      people: "Viajeros",
      table: "Coche (mesa)",
      bus: "Enlace en autobús",
    },
  },
  receta: {
    object: "el recetario",
    carrier: "Recetas de la abuela",
    letterhead: "Elaboración",
    signoff: "Se sirve con mucho cariño",
    pass: { kicker: "Ficha de comensal", people: "Comensales" },
  },
  concierto: {
    object: "la entrada",
    carrier: "Gira «Sí, quiero»",
    letterhead: "Notas del concierto",
    signoff: "Gracias por venir al directo",
    pass: {
      kicker: "Pase de backstage",
      people: "Público",
      table: "Fila (mesa)",
      bus: "Lanzadera en autobús",
    },
  },
  feria: {
    object: "el cartel",
    carrier: "Gran fiesta",
    letterhead: "Bando de las fiestas",
    signoff: "¡Vivan los novios!",
    pass: { kicker: "Entrada a la caseta", people: "Feriantes" },
  },
  biblioteca: {
    object: "el libro",
    carrier: "Biblioteca municipal",
    letterhead: "Capítulo nuevo",
    signoff: "Préstamo para toda la vida",
    pass: { kicker: "Carné de lector", people: "Lectores" },
  },
  llave: {
    object: "la llave",
    carrier: "Gran Hotel",
    letterhead: "Recepción",
    signoff: "Salida: nunca",
    pass: { kicker: "Tarjeta de huésped", people: "Huéspedes" },
  },
  partitura: {
    object: "la partitura",
    carrier: "Op. 1 · Allegro con amore",
    letterhead: "Notas del programa",
    signoff: "Fine",
    pass: { kicker: "Butaca de estreno", people: "Público" },
  },
  brujula: {
    object: "la brújula",
    carrier: "Cuaderno de bitácora",
    letterhead: "Rumbo y derrota",
    signoff: "Puerto de destino: el baile",
    pass: { kicker: "Rol de tripulantes", people: "Tripulación" },
  },
};

/** El kit del motivo, si es de concepto (con los de acuarela o sin motivo, null). */
export function conceptKit(motif: MotifId | undefined): ConceptKit | null {
  if (!motif || MOTIFS[motif].kind !== "concepto") return null;
  return CONCEPT_KITS[motif as ConceptMotifId] ?? null;
}
