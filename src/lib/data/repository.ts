import "server-only";
import { cache } from "react";
import { demoEvent } from "@/data/demo/event";
import { demoGroups, demoResponses, showcaseGroups } from "@/data/demo/guests";
import { eventContentSchema } from "@/lib/domain/event-schema";
import type { GuestGroup, RsvpResponse, WeddingEvent } from "@/lib/domain/types";
import { rsvpResponseSchema } from "@/lib/rsvp/draft";
import { createAnonClient, createSessionClient } from "@/lib/supabase/server";

/**
 * Punto único de acceso a datos, con dos fuentes:
 * - la demostración (datos ficticios en memoria): invitaciones de ejemplo y /panel/demo;
 * - Supabase, si está configurado: eventos reales. Los invitados entran solo con su token
 *   (función get_invitation) y el panel ve lo que permiten las políticas RLS.
 */

export const DEMO_EVENT_KEY = "demo";

export interface Invitation {
  event: WeddingEvent;
  group: GuestGroup;
  /** Respuesta ya guardada en el servidor (null si aún no ha respondido; undefined en la demo). */
  response?: RsvpResponse | null;
}

export async function getEvent(): Promise<WeddingEvent> {
  return demoEvent;
}

/** Una sola consulta por petición aunque la usen los metadatos y la página (cache de React). */
export const getInvitation = cache(async (token: string): Promise<Invitation | null> => {
  const demo = demoGroups.find((g) => g.token === token);
  if (demo) return { event: demoEvent, group: demo };
  return getLiveInvitation(token);
});

async function getLiveInvitation(token: string): Promise<Invitation | null> {
  // Tokens con forma imposible no llegan a la base de datos.
  if (!/^[\w-]{10,64}$/.test(token)) return null;
  const supabase = createAnonClient();
  if (!supabase) return null;
  const { data, error } = await supabase.rpc("get_invitation", { p_token: token });
  if (error || !data) return null;

  const raw = data as {
    event: Record<string, unknown> & { id: string };
    group: {
      id: string;
      token: string;
      displayName: string;
      category: string;
      maxAttendees: number;
      members: GuestGroup["members"];
      table: string | null;
    };
    response: unknown;
  };
  const content = eventContentSchema.safeParse(raw.event);
  if (!content.success) {
    console.error("Contenido del evento no válido", raw.event.id, content.error.issues.slice(0, 3));
    return null;
  }
  const response = raw.response ? rsvpResponseSchema.safeParse(raw.response) : null;
  return {
    event: { ...content.data, id: raw.event.id },
    group: {
      id: raw.group.id,
      token: raw.group.token,
      displayName: raw.group.displayName,
      category: raw.group.category,
      maxAttendees: raw.group.maxAttendees,
      members: raw.group.members,
      tableName: raw.group.table,
      persisted: true,
    },
    response: response?.success ? response.data : null,
  };
}

/** Tokens que se generan estáticamente: las invitaciones de ejemplo. */
export async function listShowcaseInvitations(): Promise<GuestGroup[]> {
  return showcaseGroups;
}

export interface EventMeta {
  id: string;
  slug: string;
  status: "draft" | "published";
  publishedAt: string | null;
}

export interface OrganizerData {
  event: WeddingEvent;
  groups: GuestGroup[];
  responses: RsvpResponse[];
  /** Solo en eventos reales. */
  meta?: EventMeta;
}

/** Datos del panel. `eventKey` es "demo" o el id de un evento del usuario. */
export async function getOrganizerData(eventKey = DEMO_EVENT_KEY): Promise<OrganizerData | null> {
  if (eventKey === DEMO_EVENT_KEY) {
    return { event: demoEvent, groups: demoGroups, responses: demoResponses };
  }
  if (!/^[0-9a-f-]{36}$/.test(eventKey)) return null;
  const supabase = await createSessionClient();
  if (!supabase) return null;

  const [eventRes, groupsRes, responsesRes, seatsRes] = await Promise.all([
    supabase
      .from("events")
      .select("id, slug, status, content, published_at")
      .eq("id", eventKey)
      .maybeSingle(),
    supabase
      .from("guest_groups")
      .select(
        "id, token, display_name, category, max_attendees, sort, guests (id, first_name, last_name, is_primary, is_child, sort)",
      )
      .eq("event_id", eventKey)
      .order("sort")
      .order("display_name"),
    supabase.from("rsvp_responses").select("group_id, payload").eq("event_id", eventKey),
    supabase.from("seats").select("guest_id, tables (name)").eq("event_id", eventKey),
  ]);
  if (eventRes.error || !eventRes.data) return null;

  const content = eventContentSchema.safeParse(eventRes.data.content);
  if (!content.success) return null;

  const tableByGuest = new Map<string, string>();
  for (const seat of seatsRes.data ?? []) {
    const table = seat.tables as unknown as { name: string } | null;
    if (table) tableByGuest.set(seat.guest_id, table.name);
  }

  const groups: GuestGroup[] = (groupsRes.data ?? []).map((g) => {
    const guests = [...(g.guests ?? [])].sort((a, b) => a.sort - b.sort);
    return {
      id: g.id,
      token: g.token,
      displayName: g.display_name,
      category: g.category,
      maxAttendees: g.max_attendees,
      members: guests.map((p) => ({
        id: p.id,
        firstName: p.first_name,
        lastName: p.last_name,
        isPrimary: p.is_primary,
        isChild: p.is_child,
      })),
      tableName: guests.map((p) => tableByGuest.get(p.id)).find(Boolean) ?? null,
      persisted: true,
    };
  });

  const responses = (responsesRes.data ?? []).flatMap((r) => {
    const parsed = rsvpResponseSchema.safeParse({ ...(r.payload as object), groupId: r.group_id });
    return parsed.success ? [parsed.data] : [];
  });

  return {
    event: { ...content.data, id: eventRes.data.id },
    groups,
    responses,
    meta: {
      id: eventRes.data.id,
      slug: eventRes.data.slug,
      status: eventRes.data.status,
      publishedAt: eventRes.data.published_at,
    },
  };
}

export interface EventSummary extends EventMeta {
  couple: string;
  date: string;
  role: "owner" | "editor";
}

/** Eventos del usuario con sesión (vacío si no hay sesión o Supabase no está configurado). */
export async function listMyEvents(): Promise<EventSummary[]> {
  const supabase = await createSessionClient();
  if (!supabase) return [];
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return [];
  const { data } = await supabase
    .from("event_members")
    .select("role, events (id, slug, status, published_at, content)")
    .eq("user_id", user.user.id);
  return (data ?? []).flatMap((row) => {
    const e = row.events as unknown as {
      id: string;
      slug: string;
      status: "draft" | "published";
      published_at: string | null;
      content: { couple?: { first?: string; second?: string }; date?: string };
    } | null;
    if (!e) return [];
    return [
      {
        id: e.id,
        slug: e.slug,
        status: e.status,
        publishedAt: e.published_at,
        couple: `${e.content.couple?.first ?? ""} & ${e.content.couple?.second ?? ""}`,
        date: e.content.date ?? "",
        role: row.role,
      },
    ];
  });
}
