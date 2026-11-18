import type { Metadata, Viewport } from "next";
import { redirect } from "next/navigation";
import { listMyEvents } from "@/lib/data/repository";
import { earliestEventDate } from "@/lib/events/new-event";
import { createSessionClient } from "@/lib/supabase/server";
import { MyEvents } from "./my-events";
import "./[evento]/panel.css";

export const metadata: Metadata = { title: "Mis eventos" };
export const viewport: Viewport = { themeColor: "#3a2a22" };

export default async function MyEventsPage() {
  const supabase = await createSessionClient();
  // Sin Supabase (modo demostración) solo existe el panel de ejemplo.
  if (!supabase) redirect("/panel/demo");
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/entrar");
  const events = await listMyEvents();
  const minDate = earliestEventDate();

  return <MyEvents email={data.user.email} events={events} minDate={minDate} />;
}
