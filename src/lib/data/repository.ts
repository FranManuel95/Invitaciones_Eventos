import "server-only";
import { cache } from "react";
import { demoEvent } from "@/data/demo/event";
import { demoGroups, demoResponses, showcaseGroups } from "@/data/demo/guests";
import { eventContentSchema, type EventContent } from "@/lib/domain/event-schema";
import type { GuestGroup, RsvpResponse, WeddingEvent } from "@/lib/domain/types";
import { rsvpResponseSchema } from "@/lib/rsvp/draft";
import type { SeatingTable } from "@/lib/seating";
import { demoAssignment, demoTables } from "@/data/demo/tables";
import { demoBudget, demoTasks } from "@/data/demo/planning";
import type { BudgetItem } from "@/lib/planning/budget";
import type { PlanTask } from "@/lib/planning/tasks";
import { DEFAULT_THEME, parseTheme, type Theme } from "@/lib/theme";
import { createAnonClient, createSessionClient } from "@/lib/supabase/server";

/**
 * Punto único de acceso a datos, con dos fuentes:
 * - la demostración (datos ficticios en memoria): invitaciones de ejemplo y /panel/demo;
 * - Supabase, si está configurado: eventos reales. Los invitados entran solo con su token
 *   (función get_invitation) y el panel ve lo que permiten las políticas RLS.
 */

export const DEMO_EVENT_KEY = "demo";

/** Fase publicada: primero el aviso «save the date» y después la invitación completa. */
export type EventPhase = "save_the_date" | "invitacion";

export interface Invitation {
  event: WeddingEvent;
  group: GuestGroup;
  theme: Theme;
  phase: EventPhase;
  /** Respuesta ya guardada en el servidor (null si aún no ha respondido; undefined en la demo). */
  response?: RsvpResponse | null;
}

export async function getEvent(): Promise<WeddingEvent> {
  return demoEvent;
}

/** Una sola consulta por petición aunque la usen los metadatos y la página (cache de React). */
export const getInvitation = cache(async (token: string): Promise<Invitation | null> => {
  const demo = demoGroups.find((g) => g.token === token);
  if (demo) return { event: demoEvent, group: demo, theme: DEFAULT_THEME, phase: "invitacion" };
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
    theme: unknown;
    phase?: string;
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
    theme: parseTheme(raw.theme),
    phase: raw.phase === "save_the_date" ? "save_the_date" : "invitacion",
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
  /** Qué se ha publicado: el «save the date» o la invitación completa. */
  phase: EventPhase;
  publishedAt: string | null;
}

export interface OrganizerData {
  event: WeddingEvent;
  groups: GuestGroup[];
  responses: RsvpResponse[];
  /** Mesas del plano; la mesa de cada invitación va en `group.tableId`. */
  tables: SeatingTable[];
  /** Solo en eventos reales. */
  meta?: EventMeta;
}

/** Datos del panel. `eventKey` es "demo" o el id de un evento del usuario. */
export async function getOrganizerData(eventKey = DEMO_EVENT_KEY): Promise<OrganizerData | null> {
  if (eventKey === DEMO_EVENT_KEY) {
    return {
      event: demoEvent,
      groups: demoGroups.map((g) => ({ ...g, tableId: demoAssignment[g.id] ?? null })),
      responses: demoResponses,
      tables: demoTables,
    };
  }
  if (!/^[0-9a-f-]{36}$/.test(eventKey)) return null;
  const supabase = await createSessionClient();
  if (!supabase) return null;

  const [eventRes, groupsRes, responsesRes, tablesRes] = await Promise.all([
    supabase
      .from("events")
      .select("id, slug, status, phase, content, published_at")
      .eq("id", eventKey)
      .maybeSingle(),
    supabase
      .from("guest_groups")
      .select(
        "id, token, display_name, category, max_attendees, phone, table_id, sort, guests (id, first_name, last_name, is_primary, is_child, sort)",
      )
      .eq("event_id", eventKey)
      .order("sort")
      .order("display_name"),
    supabase.from("rsvp_responses").select("group_id, payload").eq("event_id", eventKey),
    supabase
      .from("tables")
      .select("id, name, shape, seats, x, y")
      .eq("event_id", eventKey)
      .order("name"),
  ]);
  if (eventRes.error || !eventRes.data) return null;

  const content = eventContentSchema.safeParse(eventRes.data.content);
  if (!content.success) return null;

  const tables: SeatingTable[] = (tablesRes.data ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    shape: t.shape === "rect" ? "rect" : "round",
    seats: t.seats,
    x: Number(t.x),
    y: Number(t.y),
  }));
  const tableName = new Map(tables.map((t) => [t.id, t.name]));

  const groups: GuestGroup[] = (groupsRes.data ?? []).map((g) => {
    const guests = [...(g.guests ?? [])].sort((a, b) => a.sort - b.sort);
    return {
      id: g.id,
      token: g.token,
      displayName: g.display_name,
      category: g.category,
      maxAttendees: g.max_attendees,
      phone: g.phone,
      members: guests.map((p) => ({
        id: p.id,
        firstName: p.first_name,
        lastName: p.last_name,
        isPrimary: p.is_primary,
        isChild: p.is_child,
      })),
      tableId: g.table_id,
      tableName: g.table_id ? (tableName.get(g.table_id) ?? null) : null,
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
    tables,
    meta: {
      id: eventRes.data.id,
      slug: eventRes.data.slug,
      status: eventRes.data.status,
      phase: eventRes.data.phase === "save_the_date" ? "save_the_date" : "invitacion",
      publishedAt: eventRes.data.published_at,
    },
  };
}

export interface PlanningData {
  tasks: PlanTask[];
  budget: BudgetItem[];
}

/** Tareas y presupuesto del evento (solo los miembros, por RLS). */
export async function getPlanningData(eventKey: string): Promise<PlanningData | null> {
  if (eventKey === DEMO_EVENT_KEY) return { tasks: demoTasks, budget: demoBudget };
  if (!/^[0-9a-f-]{36}$/.test(eventKey)) return null;
  const supabase = await createSessionClient();
  if (!supabase) return null;
  const [tasksRes, budgetRes] = await Promise.all([
    supabase
      .from("tasks")
      .select("id, title, due_date, assignee, done")
      .eq("event_id", eventKey)
      .order("due_date", { nullsFirst: false }),
    supabase
      .from("budget_items")
      .select("id, concept, category, estimated, paid, due_date, notes")
      .eq("event_id", eventKey)
      .order("concept"),
  ]);
  if (tasksRes.error || budgetRes.error) return null;
  return {
    tasks: (tasksRes.data ?? []).map((t) => ({
      id: t.id,
      title: t.title,
      dueDate: t.due_date,
      assignee: t.assignee ?? "",
      done: t.done,
    })),
    budget: (budgetRes.data ?? []).map((b) => ({
      id: b.id,
      concept: b.concept,
      category: b.category,
      estimated: Number(b.estimated),
      paid: Number(b.paid),
      dueDate: b.due_date,
      notes: b.notes ?? "",
    })),
  };
}

export interface EventMember {
  userId: string;
  role: "owner" | "editor";
  email: string;
  isMe: boolean;
}

export interface PendingInvite {
  id: string;
  token: string;
  role: "owner" | "editor";
  expiresAt: string;
}

export interface EventSettings {
  members: EventMember[];
  /** Invitaciones sin usar ni caducar (solo las ve el propietario). */
  invites: PendingInvite[];
  isOwner: boolean;
}

/** Miembros del evento e invitaciones pendientes. En la demo, dos miembros ficticios. */
export async function getEventSettings(eventKey: string): Promise<EventSettings | null> {
  if (eventKey === DEMO_EVENT_KEY) {
    return {
      members: [
        { userId: "demo-1", role: "owner", email: "maria@ejemplo.invalid", isMe: true },
        { userId: "demo-2", role: "editor", email: "daniel@ejemplo.invalid", isMe: false },
      ],
      invites: [],
      isOwner: true,
    };
  }
  if (!/^[0-9a-f-]{36}$/.test(eventKey)) return null;
  const supabase = await createSessionClient();
  if (!supabase) return null;
  const [membersRes, invitesRes] = await Promise.all([
    supabase.rpc("event_member_list", { p_event: eventKey }),
    supabase
      .from("event_invites")
      .select("id, token, role, expires_at")
      .eq("event_id", eventKey)
      .is("used_at", null)
      .gt("expires_at", new Date().toISOString())
      .order("created_at"),
  ]);
  if (membersRes.error || !membersRes.data?.length) return null;
  const members: EventMember[] = (
    membersRes.data as {
      user_id: string;
      role: "owner" | "editor";
      email: string;
      is_me: boolean;
    }[]
  ).map((m) => ({ userId: m.user_id, role: m.role, email: m.email, isMe: m.is_me }));
  return {
    members,
    invites: (invitesRes.data ?? []).map((i) => ({
      id: i.id,
      token: i.token,
      role: i.role,
      expiresAt: i.expires_at,
    })),
    isOwner: members.some((m) => m.isMe && m.role === "owner"),
  };
}

export interface EventDraft {
  content: EventContent;
  theme: Theme;
  /** Solo en eventos reales. */
  meta?: EventMeta & { unpublishedChanges: boolean };
}

/** Borrador para el editor: la demo (sin guardado) o un evento del usuario. */
export async function getEventDraft(eventKey: string): Promise<EventDraft | null> {
  if (eventKey === DEMO_EVENT_KEY) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- el id no forma parte del contenido
    const { id, ...content } = demoEvent;
    return { content, theme: DEFAULT_THEME };
  }
  if (!/^[0-9a-f-]{36}$/.test(eventKey)) return null;
  const supabase = await createSessionClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("events")
    .select(
      "id, slug, status, phase, content, theme, published_content, published_theme, published_at",
    )
    .eq("id", eventKey)
    .maybeSingle();
  if (!data) return null;
  const content = eventContentSchema.safeParse(data.content);
  if (!content.success) return null;
  return {
    content: content.data,
    theme: parseTheme(data.theme),
    meta: {
      id: data.id,
      slug: data.slug,
      status: data.status,
      phase: data.phase === "save_the_date" ? "save_the_date" : "invitacion",
      publishedAt: data.published_at,
      // Las dos columnas son jsonb: Postgres ordena las claves igual en ambas.
      unpublishedChanges:
        JSON.stringify(data.content) !== JSON.stringify(data.published_content) ||
        JSON.stringify(data.theme) !== JSON.stringify(data.published_theme),
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
    .select("role, events (id, slug, status, phase, published_at, content)")
    .eq("user_id", user.user.id);
  return (data ?? []).flatMap((row) => {
    const e = row.events as unknown as {
      id: string;
      slug: string;
      status: "draft" | "published";
      phase: string;
      published_at: string | null;
      content: { couple?: { first?: string; second?: string }; date?: string };
    } | null;
    if (!e) return [];
    return [
      {
        id: e.id,
        slug: e.slug,
        status: e.status,
        phase: e.phase === "save_the_date" ? "save_the_date" : "invitacion",
        publishedAt: e.published_at,
        couple: `${e.content.couple?.first ?? ""} & ${e.content.couple?.second ?? ""}`,
        date: e.content.date ?? "",
        role: row.role,
      },
    ];
  });
}
