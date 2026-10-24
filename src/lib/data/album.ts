import "server-only";
import { cache } from "react";
import { demoEvent } from "@/data/demo/event";
import { createAnonClient, createSessionClient } from "@/lib/supabase/server";
import { supabaseEnv } from "@/lib/supabase/env";
import { DEFAULT_THEME, type Theme } from "@/lib/theme";
import { parseTheme } from "@/lib/theme/schema";

/*
 * Álbum de los invitados. Los invitados lo abren con el token del álbum del evento (el del QR de
 * las mesas o el enlace de la invitación) y solo ven las fotos aprobadas; la pareja modera las
 * pendientes desde el panel. En la demo («demo») hay fotos de ejemplo y la subida se simula.
 */

export const DEMO_ALBUM_TOKEN = "demo";
export const GUEST_PHOTOS_BUCKET = "guest-photos";

export interface AlbumPhoto {
  id: string;
  url: string;
  createdAt: string;
  status?: "pending" | "approved" | "hidden";
}

export interface Album {
  token: string;
  demo: boolean;
  couple: { first: string; second: string };
  date: string;
  theme: Theme;
  photos: AlbumPhoto[];
}

const DEMO_PHOTOS = [
  "banquete",
  "finca",
  "iglesia",
  "historia-hoy",
  "historia-pedida",
  "pareja",
].map((name, i) => ({
  id: `demo-${name}`,
  url: `/fotos/${name}.jpg`,
  createdAt: new Date(Date.UTC(2027, 4, 22, 21, 10 - i * 7)).toISOString(),
  status: "approved" as const,
}));

/** URL pública de una foto del álbum (las rutas llevan un uuid imposible de adivinar). */
export function guestPhotoUrl(path: string) {
  const env = supabaseEnv();
  return env ? `${env.url}/storage/v1/object/public/${GUEST_PHOTOS_BUCKET}/${path}` : path;
}

export const getAlbum = cache(async (token: string): Promise<Album | null> => {
  if (token === DEMO_ALBUM_TOKEN) {
    return {
      token,
      demo: true,
      couple: demoEvent.couple,
      date: demoEvent.date,
      theme: DEFAULT_THEME,
      photos: DEMO_PHOTOS,
    };
  }
  if (!/^[\w-]{10,64}$/.test(token)) return null;
  const supabase = createAnonClient();
  if (!supabase) return null;
  const { data, error } = await supabase.rpc("album_info", { p_token: token });
  if (error || !data) return null;
  const raw = data as {
    couple: { first: string; second: string };
    date: string;
    theme: unknown;
    photos: { path: string; createdAt: string }[];
  };
  return {
    token,
    demo: false,
    couple: raw.couple,
    date: raw.date,
    theme: parseTheme(raw.theme),
    photos: raw.photos.map((p) => ({
      id: p.path,
      url: guestPhotoUrl(p.path),
      createdAt: p.createdAt,
    })),
  };
});

/** Fotos del álbum para moderar en el panel (miembros del evento; en la demo, las de ejemplo). */
export async function getAlbumModeration(
  eventId: string,
): Promise<{ token: string; photos: (AlbumPhoto & { path: string })[] } | null> {
  if (eventId === "demo") {
    return {
      token: DEMO_ALBUM_TOKEN,
      photos: DEMO_PHOTOS.map((p, i) => ({
        ...p,
        path: p.url,
        status: i < 2 ? ("pending" as const) : ("approved" as const),
      })),
    };
  }
  const supabase = await createSessionClient();
  if (!supabase) return null;
  const [event, photos] = await Promise.all([
    supabase.from("events").select("album_token").eq("id", eventId).maybeSingle(),
    supabase
      .from("guest_photos")
      .select("id, path, status, created_at")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false })
      .limit(500),
  ]);
  if (!event.data) return null;
  return {
    token: event.data.album_token as string,
    photos: (photos.data ?? []).map((p) => ({
      id: p.id as string,
      path: p.path as string,
      url: guestPhotoUrl(p.path as string),
      createdAt: p.created_at as string,
      status: p.status as AlbumPhoto["status"],
    })),
  };
}
