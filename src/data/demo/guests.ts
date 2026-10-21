import type {
  AllergyId,
  AttendeeResponse,
  GuestGroup,
  MenuId,
  RsvpResponse,
} from "@/lib/domain/types";

/**
 * Invitados y respuestas ficticios, generados de forma determinista (misma semilla → mismos datos)
 * para que el panel y las pruebas sean estables. Ningún nombre corresponde a una persona real.
 */

export const DEMO_TOTAL_SEATS = 150;
/** Fecha de referencia de los datos del panel (las respuestas simuladas son anteriores). */
export const DEMO_REFERENCE_DATE = "2026-10-20";
const RESPONSES_START = "2026-09-01";

/** Invitaciones de ejemplo enlazadas desde la portada de la demo. */
export const showcaseGroups: GuestGroup[] = [
  {
    id: "g-familia-garcia",
    token: "familia-garcia",
    displayName: "Familia García",
    category: "Familia de María",
    maxAttendees: 4,
    members: [
      { id: "g1-1", firstName: "Lucía", lastName: "García Ortega", isPrimary: true },
      { id: "g1-2", firstName: "Andrés", lastName: "García Ortega", isPrimary: false },
      {
        id: "g1-3",
        firstName: "Martina",
        lastName: "García Sanz",
        isPrimary: false,
        isChild: true,
      },
    ],
  },
  {
    id: "g-carlos",
    token: "carlos-ruiz",
    displayName: "Carlos",
    category: "Amigos de Daniel",
    maxAttendees: 2,
    members: [{ id: "g2-1", firstName: "Carlos", lastName: "Ruiz Medina", isPrimary: true }],
  },
  {
    id: "g-elena-pablo",
    token: "elena-y-pablo",
    displayName: "Elena y Pablo",
    category: "Amigos de María",
    maxAttendees: 2,
    members: [
      { id: "g3-1", firstName: "Elena", lastName: "Vidal Roca", isPrimary: true },
      { id: "g3-2", firstName: "Pablo", lastName: "Serra Gil", isPrimary: false },
    ],
  },
  {
    id: "g-prueba-error",
    token: "prueba-error",
    displayName: "Invitación de prueba",
    category: "Demo",
    maxAttendees: 2,
    members: [{ id: "g4-1", firstName: "Invitado", lastName: "de prueba", isPrimary: true }],
    demo: { failFirstSave: true },
  },
  {
    id: "g-plazo-cerrado",
    token: "plazo-cerrado",
    displayName: "Invitación fuera de plazo",
    category: "Demo",
    maxAttendees: 1,
    members: [{ id: "g5-1", firstName: "Invitada", lastName: "fuera de plazo", isPrimary: true }],
    demo: { deadlinePassed: true },
  },
];

const FIRST_NAMES = [
  "Alba",
  "Adrián",
  "Beatriz",
  "Bruno",
  "Carmen",
  "Diego",
  "Irene",
  "Hugo",
  "Julia",
  "Jorge",
  "Laura",
  "Marcos",
  "Marta",
  "Nicolás",
  "Noelia",
  "Óscar",
  "Paula",
  "Raúl",
  "Sara",
  "Tomás",
  "Valeria",
  "Víctor",
  "Inés",
  "Álvaro",
  "Claudia",
  "Gonzalo",
  "Rocío",
  "Sergio",
  "Teresa",
  "Iván",
  "Nuria",
  "Rubén",
  "Silvia",
  "Mario",
  "Ainhoa",
  "Gabriel",
  "Celia",
  "Fernando",
  "Lorena",
  "Samuel",
];
const CHILD_NAMES = ["Leo", "Vera", "Mateo", "Olivia", "Izan", "Abril", "Gael", "Lola"];
const SURNAMES = [
  "Navarro",
  "Moreno",
  "Castillo",
  "Herrera",
  "Molina",
  "Ortega",
  "Delgado",
  "Romero",
  "Iglesias",
  "Cabrera",
  "Prieto",
  "Fuentes",
  "Campos",
  "Vega",
  "Lozano",
  "Rubio",
  "Marín",
  "Peña",
  "Calvo",
  "Soler",
  "Pastor",
  "Benítez",
  "Aguilar",
  "Santana",
  "Montero",
  "Crespo",
  "Esteban",
  "Rivas",
];
const SONGS = [
  "Despechá — Rosalía",
  "La flaca — Jarabe de Palo",
  "September — Earth, Wind & Fire",
  "Mi gran noche — Raphael",
  "Dancing Queen — ABBA",
  "Bailando — Enrique Iglesias",
  "Vivir así es morir de amor — Camilo Sesto",
  "Mr. Brightside — The Killers",
];
const CATEGORIES = [
  "Familia de María",
  "Familia de Daniel",
  "Amigos de María",
  "Amigos de Daniel",
  "Trabajo",
] as const;
const MESSAGES = [
  "¡Qué ganas de veros! Contad con nosotros para el baile.",
  "Llegaremos un poco justos a la ceremonia, ¡pero llegamos!",
  "¿Puede sonar algo de Rosalía en la fiesta?",
  "Gracias por pensar en nosotros. Os queremos.",
  "Necesitaremos una trona para el peque, si es posible.",
  "Llevamos meses esperando este día. ¡Viva los novios!",
  "Vamos desde Valencia con la abuela, ¿habrá sitio cerca de la entrada?",
  "Prometemos no llorar en la ceremonia. Bueno, un poco.",
];

/** PRNG pequeño y determinista (mulberry32). */
export function createRandom(seed: number) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    int: (min: number, max: number) => min + Math.floor(next() * (max - min + 1)),
    pick: <T>(items: readonly T[]): T => items[Math.floor(next() * items.length)] as T,
    weighted: <T>(items: readonly (readonly [T, number])[]): T => {
      const total = items.reduce((sum, [, w]) => sum + w, 0);
      let roll = next() * total;
      for (const [item, weight] of items) {
        roll -= weight;
        if (roll <= 0) return item;
      }
      return items[items.length - 1]![0];
    },
  };
}

function generateGroups(): GuestGroup[] {
  const rand = createRandom(20270522);
  const groups: GuestGroup[] = [];
  let seats = showcaseGroups.reduce((sum, g) => sum + g.maxAttendees, 0);
  let index = 0;

  while (seats < DEMO_TOTAL_SEATS) {
    index += 1;
    const remaining = DEMO_TOTAL_SEATS - seats;
    const kind = rand.weighted([
      ["single", 3],
      ["couple", 4],
      ["family", 2],
    ] as const);
    const surname = rand.pick(SURNAMES);
    const second = rand.pick(SURNAMES);
    const id = `g-${String(index).padStart(3, "0")}`;
    const person = (n: number, isPrimary: boolean, isChild = false) => ({
      id: `${id}-${n}`,
      firstName: isChild ? rand.pick(CHILD_NAMES) : rand.pick(FIRST_NAMES),
      lastName: `${surname} ${second}`,
      isPrimary,
      ...(isChild ? { isChild: true } : {}),
    });

    let members;
    let displayName: string;
    let maxAttendees: number;
    if (kind === "single" || remaining === 1) {
      members = [person(1, true)];
      maxAttendees = remaining > 1 && rand.next() < 0.35 ? 2 : 1;
      displayName = members[0]!.firstName;
    } else if (kind === "couple" || remaining === 2) {
      members = [person(1, true), person(2, false)];
      members[1]!.lastName = `${rand.pick(SURNAMES)} ${rand.pick(SURNAMES)}`;
      maxAttendees = 2;
      displayName = `${members[0]!.firstName} y ${members[1]!.firstName}`;
    } else {
      const kids = Math.min(rand.int(1, 2), remaining - 2);
      members = [person(1, true), person(2, false)];
      for (let k = 0; k < kids; k++) members.push(person(3 + k, false, true));
      maxAttendees = members.length;
      displayName = `Familia ${surname}`;
    }

    seats += maxAttendees;
    groups.push({
      id,
      token: `invitacion-${String(index).padStart(3, "0")}`,
      displayName,
      category: rand.pick(CATEGORIES),
      maxAttendees,
      members,
    });
  }
  return groups;
}

function generateResponses(groups: GuestGroup[]): RsvpResponse[] {
  const rand = createRandom(1405);
  const start = Date.parse(`${RESPONSES_START}T10:00:00Z`);
  const end = Date.parse(`${DEMO_REFERENCE_DATE}T20:00:00Z`);
  const responses: RsvpResponse[] = [];
  let messageIndex = 0;

  for (const group of groups) {
    const status = rand.weighted([
      ["attending", 76],
      ["declined", 7],
      ["pending", 17],
    ] as const);
    if (status === "pending") continue;

    // Las respuestas se concentran al principio y repuntan tras el recordatorio.
    const curve = rand.next() < 0.7 ? rand.next() ** 1.6 * 0.6 : 0.65 + rand.next() * 0.35;
    const updatedAt = new Date(start + curve * (end - start)).toISOString();

    if (status === "declined") {
      responses.push({
        groupId: group.id,
        status,
        attendees: [],
        transport: null,
        message: rand.next() < 0.5 ? "Lo sentimos muchísimo, ¡os celebraremos a la vuelta!" : "",
        song: "",
        updatedAt,
      });
      continue;
    }

    const attendees: AttendeeResponse[] = group.members.map((m) => {
      const allergic = rand.next() < 0.16;
      const allergies: AllergyId[] = allergic
        ? [
            rand.weighted([
              ["gluten", 12],
              ["lactosa", 8],
              ["frutos-secos", 5],
              ["marisco", 2],
              ["otros", 2],
            ] as const),
          ]
        : [];
      const menu: MenuId = m.isChild
        ? "infantil"
        : rand.weighted([
            ["carne", 40],
            ["pescado", 28],
            ["vegetariano", 19],
            ["vegano", 13],
          ] as const);
      return {
        guestId: m.id,
        name: `${m.firstName} ${m.lastName.split(" ")[0]}`,
        isExtra: false,
        isChild: Boolean(m.isChild),
        menu,
        allergies,
        allergyNotes: allergies.includes("otros") ? "Intolerancia al melocotón" : "",
      };
    });
    if (group.maxAttendees > group.members.length && rand.next() < 0.7) {
      attendees.push({
        guestId: "extra-1",
        name: `Acompañante de ${group.members[0]!.firstName}`,
        isExtra: true,
        isChild: false,
        menu: rand.pick(["carne", "pescado", "vegetariano"] as const),
        allergies: [],
        allergyNotes: "",
      });
    }

    const needsBus = rand.next() < 0.45;
    responses.push({
      groupId: group.id,
      status,
      attendees,
      transport: {
        needsBus,
        routeId: needsBus
          ? rand.weighted([
              ["madrid", 7],
              ["valencia", 3],
              ["barcelona", 2],
            ] as const)
          : null,
        busSeats: needsBus ? attendees.length : 0,
        offersCarSeats: !needsBus && rand.next() < 0.18,
        carSeats: 0,
      },
      message: rand.next() < 0.22 ? (MESSAGES[messageIndex++ % MESSAGES.length] ?? "") : "",
      song: rand.next() < 0.3 ? rand.pick(SONGS) : "",
      updatedAt,
    });
    const transport = responses[responses.length - 1]!.transport!;
    if (transport.offersCarSeats) transport.carSeats = rand.int(1, 3);
  }
  return responses;
}

export const generatedGroups = generateGroups();
export const demoGroups: GuestGroup[] = [...showcaseGroups, ...generatedGroups];
export const demoResponses: RsvpResponse[] = generateResponses(generatedGroups);
