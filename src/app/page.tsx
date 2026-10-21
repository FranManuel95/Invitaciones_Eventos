import { ArrowRight, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { DemoBadge } from "@/components/demo-badge";
import { buttonClasses } from "@/components/ui/button";
import { Divider, Emblem, FloralCorner } from "@/features/invitation/ornaments";
import { getEvent, listShowcaseInvitations } from "@/lib/data/repository";

const NOTES: Record<string, string> = {
  "familia-garcia": "Familia con una niña y una plaza libre para acompañante.",
  "carlos-ruiz": "Invitación individual con acompañante opcional.",
  "elena-y-pablo": "Pareja con dos plazas.",
  "prueba-error": "Simula un fallo de red al enviar la respuesta la primera vez.",
  "plazo-cerrado": "Muestra el estado de plazo de confirmación cerrado.",
};

export default async function Home() {
  const [event, invitations] = await Promise.all([getEvent(), listShowcaseInvitations()]);

  return (
    <main className="relative min-h-dvh overflow-hidden px-6 pt-16 pb-20 sm:pt-24">
      <div aria-hidden className="paper-grain absolute inset-0" />
      <FloralCorner className="pointer-events-none absolute -top-8 -right-10 w-48 rotate-180 opacity-70 sm:w-72" />

      <div className="relative mx-auto max-w-3xl">
        <DemoBadge />
        <Emblem className="mt-12 size-10 text-gold" />
        <p className="eyebrow mt-6 text-muted">Prototipo · Invitaciones premium</p>
        <h1 className="mt-4 font-display text-[clamp(2.75rem,9vw,4.75rem)] leading-[1.02] font-light text-ink">
          Una invitación que se vive,
          <span className="block italic">no solo se lee.</span>
        </h1>
        <Divider className="mt-8 text-gold" />
        <p className="mt-6 max-w-xl text-[0.9375rem] leading-relaxed text-muted">
          Demo navegable con datos ficticios de la boda de {event.couple.first} y{" "}
          {event.couple.second}. Abre una invitación como lo haría un invitado o entra en el panel
          del organizador.
        </p>

        <section aria-labelledby="invitaciones" className="mt-14">
          <h2 id="invitaciones" className="eyebrow text-ink-soft">
            Invitaciones de ejemplo
          </h2>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {invitations.map((g) => (
              <li key={g.token}>
                <Link
                  href={`/i/${g.token}`}
                  className="group flex items-center justify-between gap-4 py-5 transition-colors hover:bg-paper/60"
                >
                  <span>
                    <span className="block font-display text-2xl text-ink">{g.displayName}</span>
                    <span className="mt-1 block text-sm text-muted">{NOTES[g.token]}</span>
                  </span>
                  <ArrowRight
                    aria-hidden
                    className="size-5 shrink-0 text-ink-soft transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <Link href="/panel" className={buttonClasses("primary", "lg", "mt-12")}>
          <LayoutDashboard aria-hidden className="size-4" /> Abrir el panel del organizador
        </Link>
      </div>
    </main>
  );
}
