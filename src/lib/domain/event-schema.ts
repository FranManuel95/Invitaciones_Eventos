import { z } from "zod";
import type { WeddingEvent } from "./types";

/*
 * Esquema del contenido de un evento tal como se guarda en la base de datos (events.content).
 * Es la frontera de confianza: lo que escribe el editor y lo que se lee para pintar la
 * invitación pasa por aquí. Refleja WeddingEvent (sin el id, que es la columna).
 */

const text = (max: number) => z.string().max(max);
/** Fotos: rutas propias (/fotos/…) o URLs https del almacenamiento de Supabase. */
const photo = z
  .string()
  .max(500)
  .regex(/^(\/[\w\-./]+|https:\/\/[\w.-]+\/[\w\-./%]+)$/, "Ruta de foto no válida")
  .nullable();
const time = z.string().regex(/^\d{2}:\d{2}$/, "Hora en formato HH:MM");
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}/, "Fecha ISO");

export const eventContentSchema = z.object({
  couple: z.object({ first: text(40).min(1), second: text(40).min(1), monogram: text(4) }),
  date: isoDate,
  city: text(80),
  region: text(80),
  rsvpDeadline: isoDate,
  hashtag: text(60),
  cardMessage: text(400),
  welcomeMessage: text(1200),
  // Opcional en el contenido guardado antes de existir.
  thankYouMessage: text(800).optional(),
  program: z
    .array(
      z.object({
        id: text(40).min(1),
        time,
        title: text(80).min(1),
        venueId: text(40),
        place: text(120),
        description: text(400),
        icon: z.enum(["ceremony", "cocktail", "banquet", "party", "bus"]),
      }),
    )
    .max(12),
  venues: z
    .array(
      z.object({
        id: text(40).min(1),
        name: text(120).min(1),
        kind: text(80),
        address: text(200),
        city: text(120),
        mapsQuery: text(200),
        note: text(400).optional(),
        photo,
        photoAlt: text(200),
      }),
    )
    .max(6),
  busRoutes: z
    .array(
      z.object({
        id: text(40).min(1),
        label: text(120).min(1),
        pickupPoint: text(200),
        departure: time,
        returnTrips: z.array(time).max(6),
        seats: z.number().int().min(0).max(500),
      }),
    )
    .max(8),
  menu: z
    .array(
      z.object({
        id: z.enum(["carne", "pescado", "vegetariano", "vegano", "infantil"]),
        label: text(60).min(1),
        description: text(200),
        childrenOnly: z.boolean().optional(),
      }),
    )
    .max(5),
  dressCode: z.object({
    title: text(80),
    detail: text(400),
    palette: z
      .array(z.object({ name: text(40), hex: z.string().regex(/^#[0-9a-fA-F]{6}$/) }))
      .max(8),
    // Sugerencias por persona («Ellas», «Ellos», «Niños»…); opcional en el contenido de antes.
    examples: z
      .array(z.object({ who: text(40), text: text(200) }))
      .max(4)
      .optional(),
  }),
  accommodation: z
    .array(z.object({ name: text(120), distance: text(60), detail: text(300) }))
    .max(8),
  faqs: z.array(z.object({ question: text(200), answer: text(800) })).max(20),
  gift: z.object({
    message: text(600),
    holder: text(120),
    iban: text(40),
    // Lista de regalos; opcional en el contenido guardado antes.
    items: z
      .array(
        z.object({
          id: text(40).min(1),
          title: text(120).min(1),
          detail: text(300),
          price: text(30),
          url: z.union([
            z.literal(""),
            z
              .string()
              .max(500)
              .regex(/^https:\/\/[^\s]+$/, "El enlace debe empezar por https://"),
          ]),
          photo,
          shared: z.boolean(),
        }),
      )
      .max(30)
      .optional(),
  }),
  story: z.object({
    intro: text(400),
    couplePhoto: photo,
    moments: z
      .array(
        z.object({
          year: text(12),
          title: text(80),
          text: text(400),
          photo,
          photoAlt: text(200),
        }),
      )
      .max(8),
  }),
  coverPhoto: photo,
  coverDepthMap: photo,
  // Vídeo de fondo de la portada (MP4 o WebM en Storage); opcional para el contenido guardado antes.
  coverVideo: photo.optional(),
  // Canción propia para la apertura (MP3 o M4A en Storage), si la pareja la elige.
  song: photo.optional(),
  banquetPhoto: photo,
  contactPhone: text(30),
}) satisfies z.ZodType<Omit<WeddingEvent, "id">>;

export type EventContent = z.infer<typeof eventContentSchema>;
