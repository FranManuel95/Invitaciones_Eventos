import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { DemoBadge } from "@/components/demo-badge";
import { buttonClasses } from "@/components/ui/button";
import { BlossomCorner, Monogram } from "@/features/invitation/ornaments";
import { CoverShowcase, OpeningShowcase, TemplateShowcase } from "@/features/sales/showcase";
import { getEvent, listShowcaseInvitations } from "@/lib/data/repository";

const NOTES: Record<string, string> = {
  "familia-garcia": "Familia con una niña y una plaza libre para acompañante.",
  "carlos-ruiz": "Invitación individual con acompañante opcional.",
  "elena-y-pablo": "Pareja con dos plazas.",
  "prueba-error": "Simula un fallo de red al enviar la respuesta la primera vez.",
  "plazo-cerrado": "Muestra cómo se ve la invitación con el plazo de confirmación cerrado.",
};

export const metadata = { title: "Ejemplos" };

/** La invitación cambia según el momento: cada uno con su enlace directo. */
const MOMENTS = [
  {
    href: "/i/familia-garcia?fase=save-the-date",
    label: "Save the date",
    text: "El primer aviso: solo la fecha y el calendario, sin confirmación.",
  },
  {
    href: "/i/carlos-ruiz?dia=boda&hora=19:10",
    label: "El día de la boda",
    text: "Qué está pasando ahora y qué viene después (simulado a las 19:10).",
  },
  {
    href: "/i/carlos-ruiz?dia=despues",
    label: "Después de la boda",
    text: "El agradecimiento de la pareja y el álbum, en el mismo enlace.",
  },
  {
    href: "/i/carlos-ruiz",
    label: "Lista de regalos",
    text: "Pulsa «Saltar intro» y baja hasta Regalos: reserva uno para que nadie lo repita.",
  },
  {
    href: "/album/demo",
    label: "Álbum de los invitados",
    text: "Las fotos que suben los invitados desde el QR de las mesas.",
  },
];

const sectionTitle = "font-display text-[2.25rem] leading-[1.05] text-ink sm:text-[2.75rem]";
const sectionNote = "mt-3 max-w-[52ch] text-[0.9375rem] leading-relaxed text-muted";

/** Índice de la demostración: invitaciones de ejemplo, estilos y el panel de los novios. */
export default async function Examples() {
  const [event, invitations] = await Promise.all([getEvent(), listShowcaseInvitations()]);

  return (
    <main className="paper-grain relative min-h-dvh overflow-hidden bg-paper">
      <BlossomCorner className="pointer-events-none absolute -top-8 -right-10 w-48 rotate-180 opacity-80 sm:w-72" />

      <div className="relative mx-auto max-w-5xl px-6 pt-10 pb-20 sm:px-10 sm:pt-14">
        <div className="flex items-center gap-4">
          <Monogram
            first={event.couple.first}
            second={event.couple.second}
            className="size-11 text-gold"
          />
          <DemoBadge />
        </div>

        <h1 className="mt-16 max-w-[14ch] font-display text-[clamp(3rem,9vw,5.75rem)] leading-[0.95] tracking-[-0.01em] text-ink">
          Invitaciones que se abren como una carta
        </h1>
        <p className="mt-6 max-w-[52ch] text-[1.0625rem] leading-relaxed text-ink-soft">
          Una demo navegable con la boda ficticia de {event.couple.first} y {event.couple.second}.
          Abre cualquiera de estas invitaciones como lo haría un invitado, o entra en el panel donde
          los novios siguen las respuestas.
        </p>

        <section
          aria-labelledby="invitaciones"
          className="mt-16 md:grid md:grid-cols-[13rem_minmax(0,1fr)] md:gap-14"
        >
          <h2 id="invitaciones" className="font-display text-[1.75rem] leading-tight text-ink">
            Invitaciones de ejemplo
          </h2>
          <ul className="mt-4 border-t border-ink/30 md:mt-0">
            {invitations.map((g) => (
              <li key={g.token} className="border-b border-line">
                <Link
                  href={`/i/${g.token}`}
                  className="group flex items-center justify-between gap-4 py-5 transition-colors hover:bg-ivory/60"
                >
                  <span>
                    <span className="block font-display text-[1.625rem] leading-tight text-ink">
                      {g.displayName}
                    </span>
                    <span className="mt-1 block text-[0.9375rem] text-muted">{NOTES[g.token]}</span>
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

        <section aria-labelledby="plantillas" className="mt-20">
          <h2 id="plantillas" className={sectionTitle}>
            Plantillas
          </h2>
          <p className={sectionNote}>
            La misma invitación con cada plantilla del editor. Cada una trae su papel, su forro, su
            lacre, su letra y su forma de abrirse.
          </p>
          <div className="mt-8">
            <TemplateShowcase />
          </div>
        </section>
      </div>

      <section
        aria-labelledby="aperturas"
        className="relative bg-[linear-gradient(180deg,var(--scene-1),var(--scene-2))] pt-16"
      >
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <h2 id="aperturas" className={sectionTitle}>
            Aperturas
          </h2>
          <p className={sectionNote}>
            Cómo se abre la invitación después de la portada. Toca cualquiera para abrirla tú.
          </p>
        </div>
        <OpeningShowcase className="mx-auto mt-10 max-w-[90rem]" />
      </section>

      <div className="relative mx-auto max-w-5xl px-6 pb-20 sm:px-10">
        <section aria-labelledby="portadas" className="mt-20">
          <h2 id="portadas" className={sectionTitle}>
            Portadas
          </h2>
          <p className={sectionNote}>Lo primero que ve el invitado, con vuestros nombres.</p>
          <div className="mt-8">
            <CoverShowcase />
          </div>
        </section>

        <section
          aria-labelledby="momentos"
          className="mt-20 md:grid md:grid-cols-[13rem_minmax(0,1fr)] md:gap-14"
        >
          <div>
            <h2 id="momentos" className="font-display text-[1.75rem] leading-tight text-ink">
              Momentos
            </h2>
            <p className="mt-2 text-[0.9375rem] text-muted">
              La invitación cambia según el momento.
            </p>
          </div>
          <ul className="mt-4 grid border-t border-ink/30 sm:grid-cols-2 sm:gap-x-8 md:mt-0">
            {MOMENTS.map((l) => (
              <li key={l.href} className="border-b border-line">
                <Link
                  href={l.href}
                  className="group flex items-center justify-between gap-4 py-4 transition-colors hover:bg-ivory/60"
                >
                  <span>
                    <span className="block font-display text-[1.375rem] leading-tight text-ink">
                      {l.label}
                    </span>
                    <span className="mt-1 block text-[0.875rem] text-muted">{l.text}</span>
                  </span>
                  <ArrowRight
                    aria-hidden
                    className="size-4 shrink-0 text-ink-soft transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-16 md:ml-[16.5rem]">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link href="/panel/demo" className={buttonClasses("primary", "lg")}>
              Abrir el panel de los novios
            </Link>
            <Link
              href="/entrar"
              className="text-[0.9375rem] text-ink-soft underline decoration-gold underline-offset-4 hover:text-ink hover:decoration-ink"
            >
              Crear vuestra invitación
            </Link>
            <Link
              href="/laboratorio/sobre-3d"
              className="text-[0.9375rem] text-ink-soft underline decoration-gold underline-offset-4 hover:text-ink hover:decoration-ink"
            >
              Comparar con el sobre 3D
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
