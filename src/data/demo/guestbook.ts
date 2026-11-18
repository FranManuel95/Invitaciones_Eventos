import type { GuestbookEntry, GuestbookState } from "@/lib/guestbook";

/** Mensajes ficticios del libro de firmas de la demo (los ven el panel y las invitaciones). */
export const demoGuestbookEntries: GuestbookEntry[] = [
  {
    id: "demo-1",
    groupName: "Elena y Pablo",
    body: "¡Por fin! Llevamos once años esperando este día casi tanto como vosotros. Contad con nosotros hasta que cierren la pista.",
    createdAt: "2027-02-14T09:10:00Z",
    hidden: false,
  },
  {
    id: "demo-2",
    groupName: "Abuela Carmen",
    body: "Qué alegría más grande. Ya tengo el vestido y los zapatos de bailar. Que seáis muy felices, hijos.",
    createdAt: "2027-02-10T17:32:00Z",
    hidden: false,
  },
  {
    id: "demo-3",
    groupName: "Carlos",
    body: "Higo tiene que llevar los anillos. No acepto otra opción.",
    createdAt: "2027-02-06T21:05:00Z",
    hidden: false,
  },
  {
    id: "demo-4",
    groupName: "Los primos de Valencia",
    body: "Vamos en el autobús de las doce con la paella en el corazón. ¡Vivan los novios!",
    createdAt: "2027-02-03T12:48:00Z",
    hidden: false,
  },
  {
    id: "demo-5",
    groupName: "Compañeros del estudio",
    body: "Mensaje de prueba, perdón.",
    createdAt: "2027-02-02T08:15:00Z",
    hidden: true,
  },
];

/** Canciones ficticias pedidas al confirmar. */
export const demoSongs = [
  "September",
  "La flaca",
  "Dancing Queen",
  "Sarandonga",
  "Mr. Brightside",
  "Vivir así es morir de amor",
  "Valerie",
  "La bicicleta",
];

/** Lo que ve una invitación de la demo: los mensajes visibles, ninguno suyo todavía. */
export function demoGuestbook(): GuestbookState {
  return {
    messages: demoGuestbookEntries
      .filter((entry) => !entry.hidden)
      .map((entry) => ({
        id: entry.id,
        name: entry.groupName,
        body: entry.body,
        createdAt: entry.createdAt,
        mine: false,
      })),
    songs: demoSongs,
  };
}
