/**
 * Modelo de dominio. En la base de datos (Supabase) el contenido del evento se guarda como
 * JSON validado por eventContentSchema; invitados, respuestas y mesas van en tablas.
 * Las invitaciones se asignan a un grupo (familia, pareja…) con un enlace personal (token).
 */

export type MenuId = "carne" | "pescado" | "vegetariano" | "vegano" | "infantil";

export type AllergyId = "gluten" | "lactosa" | "frutos-secos" | "marisco" | "huevo" | "otros";

export type ProgramIcon = "ceremony" | "cocktail" | "banquet" | "party" | "bus";

export type AttendanceStatus = "attending" | "declined" | "pending";

export interface Venue {
  id: string;
  name: string;
  kind: string;
  address: string;
  city: string;
  /** Texto que se envía a los proveedores de mapas. */
  mapsQuery: string;
  note?: string;
  /** Ruta en /public/fotos; null mientras no haya foto (se muestra una ilustración). */
  photo: string | null;
  photoAlt: string;
}

export interface ProgramItem {
  id: string;
  time: string;
  title: string;
  venueId: string;
  place: string;
  description: string;
  icon: ProgramIcon;
}

export interface BusRoute {
  id: string;
  label: string;
  pickupPoint: string;
  departure: string;
  returnTrips: string[];
  seats: number;
}

export interface MenuOption {
  id: MenuId;
  label: string;
  description: string;
  childrenOnly?: boolean;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface Accommodation {
  name: string;
  distance: string;
  detail: string;
}

export interface StoryMoment {
  year: string;
  title: string;
  text: string;
  /** Ruta en /public/fotos; null mientras no haya foto (se muestra una ilustración). */
  photo: string | null;
  photoAlt: string;
}

/** Regalo de la lista: un invitado lo reserva («lo regalo yo»); los compartidos, varios. */
export interface GiftItem {
  id: string;
  title: string;
  detail: string;
  /** Precio orientativo en texto libre («120 €», «A partir de 30 €»). */
  price: string;
  /** Enlace a la tienda (https) o vacío. */
  url: string;
  photo: string | null;
  /** Se puede regalar entre varios (el viaje, una aportación…). */
  shared: boolean;
}

export interface WeddingEvent {
  id: string;
  couple: { first: string; second: string; monogram: string };
  /** Fecha ISO local del evento. */
  date: string;
  city: string;
  region: string;
  /** Fecha ISO tras la cual no se pueden editar respuestas. */
  rsvpDeadline: string;
  hashtag: string;
  cardMessage: string;
  welcomeMessage: string;
  /** Agradecimiento que ven los invitados después de la boda (si falta, uno por defecto). */
  thankYouMessage?: string;
  program: ProgramItem[];
  venues: Venue[];
  busRoutes: BusRoute[];
  menu: MenuOption[];
  dressCode: {
    title: string;
    detail: string;
    palette: { name: string; hex: string }[];
    /** Sugerencias por persona («Ellas», «Ellos», «Niños»…). */
    examples?: { who: string; text: string }[];
  };
  accommodation: Accommodation[];
  faqs: Faq[];
  gift: { message: string; holder: string; iban: string; items?: GiftItem[] };
  story: { intro: string; couplePhoto: string | null; moments: StoryMoment[] };
  /** Foto de la portada (vertical); sin ella se usa el paisaje ilustrado en SVG. */
  coverPhoto: string | null;
  /** Mapa de profundidad de la portada (blanco = cerca), generado con scripts/depth-map.py. */
  coverDepthMap: string | null;
  /** Vídeo corto de fondo de la portada (si la pareja elige «Vuestro vídeo»). */
  coverVideo?: string | null;
  /** Canción propia para la apertura (si la pareja elige «Vuestra canción»). */
  song?: string | null;
  /** Foto de ambiente del banquete, en la tarjeta de confirmación. */
  banquetPhoto: string | null;
  /** Tiempo habitual en esas fechas (calculado desde el editor; opcional). */
  climate?: { max: number; min: number; rainChance: number; place: string } | null;
  /** Teléfono de contacto para el día de la boda (de demostración). */
  contactPhone: string;
}

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  isPrimary: boolean;
  isChild?: boolean;
}

export interface GuestGroup {
  id: string;
  token: string;
  /** Nombre con el que se saluda en la invitación ("Familia García", "Lucía y Pablo"). */
  displayName: string;
  /** Categoría organizativa en el panel. */
  category: string;
  members: Guest[];
  /** Total de plazas, incluidos acompañantes sin nombre todavía. */
  maxAttendees: number;
  /** Solo para la demo: fuerza un fallo al guardar o un plazo cerrado. */
  demo?: { failFirstSave?: boolean; deadlinePassed?: boolean };
  /** Teléfono para enviarla por WhatsApp (eventos reales). */
  phone?: string | null;
  /** Guardado en la base de datos: las respuestas se envían al servidor. */
  persisted?: boolean;
  /** Mesa asignada en el plano. */
  tableId?: string | null;
  /** Primera vez que el invitado abrió su enlace (null: aún no). */
  openedAt?: string | null;
  /** Nombre de la mesa (para el pase del invitado). */
  tableName?: string | null;
}

export interface AttendeeResponse {
  /** id del invitado o "extra-n" para acompañantes añadidos por el invitado. */
  guestId: string;
  name: string;
  isExtra: boolean;
  isChild: boolean;
  menu: MenuId | null;
  allergies: AllergyId[];
  allergyNotes: string;
}

export interface TransportResponse {
  needsBus: boolean;
  routeId: string | null;
  /** Plazas de autobús reservadas (0 si no usan el autobús). */
  busSeats: number;
  offersCarSeats: boolean;
  carSeats: number;
}

export interface RsvpResponse {
  groupId: string;
  status: Exclude<AttendanceStatus, "pending">;
  attendees: AttendeeResponse[];
  transport: TransportResponse | null;
  message: string;
  /** Canción que no puede faltar en la fiesta (opcional). */
  song: string;
  updatedAt: string;
}
