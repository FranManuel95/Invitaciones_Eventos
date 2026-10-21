/**
 * Modelo de dominio del prototipo.
 * Es un borrador del modelo conceptual de PROJECT_SPEC.md: todavía no existe base de datos.
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
  program: ProgramItem[];
  venues: Venue[];
  busRoutes: BusRoute[];
  menu: MenuOption[];
  dressCode: { title: string; detail: string; palette: { name: string; hex: string }[] };
  accommodation: Accommodation[];
  faqs: Faq[];
  gift: { message: string; holder: string; iban: string };
  story: { intro: string; couplePhoto: string | null; moments: StoryMoment[] };
  /** Foto de la portada (vertical); sin ella se usa el paisaje ilustrado en SVG. */
  coverPhoto: string | null;
  /** Foto de ambiente del banquete, en la tarjeta de confirmación. */
  banquetPhoto: string | null;
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
