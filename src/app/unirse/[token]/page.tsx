import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { buttonClasses } from "@/components/ui/button";
import { Monogram } from "@/features/invitation/ornaments";
import { createSessionClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Unirse al evento" };

/**
 * Enlace para unirse a la organización de un evento. Sin sesión, el proxy manda a /entrar y
 * vuelve aquí. Con sesión, se acepta la invitación y se abre el panel del evento.
 */
export default async function JoinPage(props: PageProps<"/unirse/[token]">) {
  const { token } = await props.params;
  const supabase = await createSessionClient();
  if (!supabase) redirect("/panel/demo");
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) redirect(`/entrar?siguiente=${encodeURIComponent(`/unirse/${token}`)}`);

  const { data: eventId, error } = /^[\w-]{10,64}$/.test(token)
    ? await supabase.rpc("accept_event_invite", { p_token: token })
    : { data: null, error: true };
  if (!error && typeof eventId === "string") redirect(`/panel/${eventId}`);

  return (
    <main className="paper-grain grid min-h-dvh place-items-center bg-ivory px-6 py-16 text-center">
      <div className="max-w-sm">
        <Monogram first="I" second="E" className="mx-auto size-12 text-gold" />
        <h1 className="mt-6 font-display text-[2.25rem] leading-tight text-ink">
          Este enlace ya no sirve
        </h1>
        <p className="mt-3 text-[0.9375rem] text-muted">
          Las invitaciones para organizar un evento caducan a los 7 días y solo se pueden usar una
          vez. Pide a quien te lo envió que cree otro desde Ajustes.
        </p>
        <Link href="/panel" className={buttonClasses("secondary", "md", "mt-8")}>
          Ir a mis eventos
        </Link>
      </div>
    </main>
  );
}
