import type { ProgramIcon, WeddingEvent } from "@/lib/domain/types";
import type { GuestbookState } from "@/lib/guestbook";
import { formatLongDate } from "@/lib/format";
import { demoEvent } from "./event";

/** Una boda ficticia de la demo y, si la tiene, su libro de firmas. */
export interface DemoVariant {
  event: WeddingEvent;
  /** Si falta, la plantilla enseña el libro de firmas de la boda de María y Daniel. */
  guestbook?: GuestbookState;
}

export function guestbook(
  messages: [name: string, body: string][],
  songs: string[],
): GuestbookState {
  return {
    messages: messages.map(([name, body], index) => ({
      id: `demo-${index + 1}`,
      name,
      body,
      createdAt: new Date(Date.UTC(2027, 1, 14 - index * 3, 9, 10)).toISOString(),
      mine: false,
    })),
    songs,
  };
}

/*
 * Solo hay fotos de dos parejas (generadas con IA; no son personas reales): la del mar
 * (`/fotos/buganvilla/`) y la del olivar (`/fotos/olivar/`). Cada boda usa las de una sola pareja,
 * y el texto alternativo describe lo que se ve en la foto, sea cual sea la historia.
 */
const SHOTS = {
  // Pareja del mar.
  cala: ["/fotos/buganvilla/historia-1.jpg", "de espaldas, sentados frente a una cala"],
  furgoneta: [
    "/fotos/buganvilla/historia-2.jpg",
    "de espaldas junto a una furgoneta, mirando el mar desde un acantilado",
  ],
  orilla: ["/fotos/buganvilla/historia-4.jpg", "de espaldas, paseando por la orilla al atardecer"],
  buganvilla: [
    "/fotos/buganvilla/portada.jpg",
    "riendo, junto a una pared encalada con buganvilla",
  ],
  // Pareja del olivar.
  olivos: ["/fotos/olivar/historia-1.jpg", "de espaldas, caminando entre olivos"],
  terraza: ["/fotos/olivar/historia-2.jpg", "mirando la ciudad desde una terraza"],
  olivar: ["/fotos/olivar/historia-4.jpg", "de espaldas, viendo caer la tarde sobre el olivar"],
} as const;

/** Fotos sin la pareja: el anillo y los sitios. */
const STILLS = {
  anilloBarca: [
    "/fotos/buganvilla/historia-3.jpg",
    "Anillo de compromiso en un estuche, sobre el banco de una barca frente al mar",
  ],
  anilloMuro: [
    "/fotos/olivar/historia-3.jpg",
    "Anillo de compromiso en un estuche, sobre un muro de piedra bajo un olivo al atardecer",
  ],
  ermitaMar: ["/fotos/buganvilla/ceremonia.jpg", "Ermita encalada con cúpula azul sobre el mar"],
  terrazaMar: [
    "/fotos/buganvilla/finca.jpg",
    "Terraza al atardecer, con mesas largas y el mar al fondo",
  ],
  ermitaOlivos: [
    "/fotos/olivar/ceremonia.jpg",
    "Ermita de piedra dorada con espadaña y campana, entre olivos",
  ],
  patioOlivos: ["/fotos/olivar/finca.jpg", "Patio con mesas largas bajo los olivos"],
  iglesia: [
    "/fotos/lugares/iglesia.jpg",
    "Interior de una iglesia de piedra con el pasillo adornado con paniculata",
  ],
  cortijo: [
    "/fotos/lugares/cortijo.jpg",
    "Cortijo al atardecer, con olivos y un camino de farolillos",
  ],
  pista: [
    "/fotos/lugares/pista.jpg",
    "Pista de baile en un jardín al anochecer, bajo un arco de flores y guirnaldas de luces",
  ],
} as const;

const COUPLES = {
  mar: { couple: "/fotos/buganvilla/pareja.jpg", banquet: "/fotos/buganvilla/banquete.jpg" },
  olivar: { couple: "/fotos/olivar/pareja.jpg", banquet: "/fotos/olivar/banquete.jpg" },
} as const;

type Shot = keyof typeof SHOTS;
type Still = keyof typeof STILLS;

/** Lo propio de cada boda; lo que se repite (menú infantil, plazo para cambiar la respuesta…) lo pone `wedding`. */
export interface WeddingSpec {
  id: string;
  first: string;
  second: string;
  date: string;
  rsvpDeadline: string;
  city: string;
  region: string;
  /** Fotos de qué pareja usa la boda. */
  couple: keyof typeof COUPLES;
  coverPhoto: string;
  cardMessage: string;
  welcomeMessage: string;
  thankYouMessage: string;
  venues: {
    id: string;
    name: string;
    kind: string;
    address: string;
    note: string;
    photo: Still;
    /** Si el sitio está en otro pueblo; si no, el de la boda. */
    city?: string;
  }[];
  climate: [max: number, min: number, rainChance: number];
  program: [
    time: string,
    title: string,
    venueId: string,
    place: string,
    description: string,
    icon: ProgramIcon,
  ][];
  busRoutes: [
    id: string,
    label: string,
    pickupPoint: string,
    departure: string,
    returnTrips: string[],
    seats: number,
  ][];
  menu: { carne: string; pescado: string; vegetariano: string; vegano: string };
  dressCode: {
    title: string;
    detail: string;
    palette: { name: string; hex: string }[];
    examples: [ellas: string, ellos: string, ninos: string];
  };
  accommodation: [name: string, distance: string, detail: string][];
  story: {
    intro: string;
    moments: [year: string, title: string, text: string, photo: Shot | Still][];
  };
  /** Ideas de regalo: la primera se puede pagar entre varios. */
  gifts: [title: string, detail: string, price: string][];
  /** Qué hay para los niños (va en la primera pregunta). */
  kids: string;
  /** La pregunta propia de esta boda. */
  faq: [question: string, answer: string];
  guestbook: [name: string, body: string][];
  songs: string[];
}

const GIFT_IDS = ["viaje", "vajilla", "cafetera", "olivo"];

/** Monta una boda completa a partir de lo que tiene de propio. */
export function wedding(spec: WeddingSpec): DemoVariant {
  const { first, second } = spec;
  const names = `${first} y ${second}`;
  const place = `${spec.city}, ${spec.region}`;
  const photo = (key: Shot | Still) =>
    key in SHOTS
      ? { photo: SHOTS[key as Shot][0], photoAlt: `${names} ${SHOTS[key as Shot][1]}` }
      : { photo: STILLS[key as Still][0], photoAlt: STILLS[key as Still][1] };
  const [max, min, rainChance] = spec.climate;
  const event: WeddingEvent = {
    ...demoEvent,
    id: spec.id,
    couple: { first, second, monogram: `${first[0]}&${second[0]}` },
    date: spec.date,
    city: spec.city,
    region: spec.region,
    rsvpDeadline: spec.rsvpDeadline,
    hashtag: `#${first}Y${second}`,
    cardMessage: spec.cardMessage,
    welcomeMessage: spec.welcomeMessage,
    thankYouMessage: spec.thankYouMessage,
    venues: spec.venues.map((venue) => {
      const city = venue.city ?? place;
      return {
        id: venue.id,
        name: venue.name,
        kind: venue.kind,
        address: venue.address,
        city,
        mapsQuery: city,
        note: venue.note,
        ...photo(venue.photo),
      };
    }),
    climate: { max, min, rainChance, place },
    program: spec.program.map(([time, title, venueId, where, description, icon]) => ({
      id:
        icon === "ceremony"
          ? "ceremonia"
          : icon === "cocktail"
            ? "coctel"
            : icon === "banquet"
              ? "banquete"
              : "fiesta",
      time,
      title,
      venueId,
      place: where,
      description,
      icon,
    })),
    busRoutes: spec.busRoutes.map(([id, label, pickupPoint, departure, returnTrips, seats]) => ({
      id,
      label,
      pickupPoint,
      departure,
      returnTrips,
      seats,
    })),
    menu: [
      { id: "carne", label: "Carne", description: spec.menu.carne },
      { id: "pescado", label: "Pescado", description: spec.menu.pescado },
      { id: "vegetariano", label: "Vegetariano", description: spec.menu.vegetariano },
      { id: "vegano", label: "Vegano", description: spec.menu.vegano },
      {
        id: "infantil",
        label: "Infantil",
        description: "Menú pensado para los más pequeños",
        childrenOnly: true,
      },
    ],
    dressCode: {
      title: spec.dressCode.title,
      detail: spec.dressCode.detail,
      palette: spec.dressCode.palette,
      examples: [
        { who: "Ellas", text: spec.dressCode.examples[0] },
        { who: "Ellos", text: spec.dressCode.examples[1] },
        { who: "Niños", text: spec.dressCode.examples[2] },
      ],
    },
    accommodation: spec.accommodation.map(([name, distance, detail]) => ({
      name,
      distance,
      detail,
    })),
    story: {
      intro: spec.story.intro,
      couplePhoto: COUPLES[spec.couple].couple,
      moments: spec.story.moments.map(([year, title, text, shot]) => ({
        year,
        title,
        text,
        ...photo(shot),
      })),
    },
    coverPhoto: spec.coverPhoto,
    coverDepthMap: null,
    banquetPhoto: COUPLES[spec.couple].banquet,
    gift: {
      ...demoEvent.gift,
      holder: names,
      items: spec.gifts.map(([title, detail, price], i) => ({
        id: GIFT_IDS[i] ?? `regalo-${i + 1}`,
        title,
        detail,
        price,
        url: "",
        photo: null,
        shared: i === 0,
      })),
    },
    faqs: [
      {
        question: "¿Puedo llevar a mis hijos?",
        answer: `Sí, si aparecen en tu invitación. ${spec.kids}`,
      },
      {
        question: "¿Hasta cuándo puedo cambiar mi respuesta?",
        answer: `Puedes editarla desde este mismo enlace hasta el ${formatLongDate(spec.rsvpDeadline)}.`,
      },
      { question: spec.faq[0], answer: spec.faq[1] },
    ],
  };
  return { event, guestbook: guestbook(spec.guestbook, spec.songs) };
}
