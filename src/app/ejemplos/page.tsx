import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { DemoBadge } from "@/components/demo-badge";
import { buttonClasses } from "@/components/ui/button";
import { BlossomCorner, Monogram } from "@/features/invitation/ornaments";
import { getEvent, listShowcaseInvitations } from "@/lib/data/repository";
import { COVER_IDS, COVERS } from "@/lib/theme/cover";
import { OPENING_IDS, OPENINGS } from "@/lib/theme/envelope";
import {
  applyTemplate,
  DEFAULT_THEME,
  ENVELOPES,
  STYLES,
  TEMPLATE_IDS,
  TEMPLATES,
  waxHex,
} from "@/lib/theme";

const NOTES: Record<string, string> = {
  "familia-garcia": "Familia con una niña y una plaza libre para acompañante.",
  "carlos-ruiz": "Invitación individual con acompañante opcional.",
  "elena-y-pablo": "Pareja con dos plazas.",
  "prueba-error": "Simula un fallo de red al enviar la respuesta la primera vez.",
  "plazo-cerrado": "Muestra cómo se ve la invitación con el plazo de confirmación cerrado.",
};

export const metadata = { title: "Ejemplos" };

/** Variantes que no se ven con la invitación por defecto: cada una con su enlace directo. */
const VARIANTS = [
  {
    id: "aperturas",
    title: "Aperturas",
    note: "Cómo se abre la invitación después de la portada.",
    links: OPENING_IDS.map((id) => ({
      href: `/i/familia-garcia?apertura=${id}`,
      label: OPENINGS[id].label,
      text: OPENINGS[id].description,
      badge: OPENINGS[id].premium ? "Premium" : undefined,
    })),
  },
  {
    id: "portadas",
    title: "Portadas",
    note: "Lo primero que ve el invitado, con sus nombres.",
    // «Vuestro vídeo» necesita un vídeo subido por la pareja: en la demo no hay.
    links: COVER_IDS.filter((id) => id !== "video").map((id) => ({
      href: `/i/familia-garcia?portada=${id}`,
      label: COVERS[id].label,
      text: COVERS[id].description,
    })),
  },
  {
    id: "momentos",
    title: "Momentos",
    note: "La invitación cambia según el momento.",
    links: [
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
    ],
  },
];

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

        <section
          aria-labelledby="estilos"
          className="mt-16 md:grid md:grid-cols-[13rem_minmax(0,1fr)] md:gap-14"
        >
          <div>
            <h2 id="estilos" className="font-display text-[1.75rem] leading-tight text-ink">
              Estilos
            </h2>
            <p className="mt-2 text-[0.9375rem] text-muted">
              La misma invitación con cada una de las plantillas del editor.
            </p>
          </div>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 md:mt-0 lg:grid-cols-4">
            {TEMPLATE_IDS.map((id) => {
              const t = applyTemplate(DEFAULT_THEME, id);
              const style = STYLES[t.style];
              return (
                <li key={id}>
                  <Link
                    href={`/i/familia-garcia?plantilla=${id}`}
                    className="group block rounded-[3px] border border-line bg-paper p-4 transition-shadow hover:shadow-[var(--shadow-paper)]"
                  >
                    {/* Muestra: papel, tinta, oro, sobre y lacre del estilo. */}
                    <span
                      aria-hidden
                      className="relative flex h-24 items-end gap-1.5 rounded-[2px] p-3"
                      style={{ background: style.palette.ivory }}
                    >
                      {[style.palette.paper, style.palette.ink, style.palette.gold].map((c) => (
                        <span
                          key={c}
                          className="size-6 rounded-full ring-1 ring-black/10"
                          style={{ background: c }}
                        />
                      ))}
                      <span
                        className="absolute top-3 right-3 h-10 w-14 rounded-[2px] shadow-sm"
                        style={{
                          background: `linear-gradient(180deg, ${ENVELOPES[t.envelope].paper[0]}, ${ENVELOPES[t.envelope].paper[1]})`,
                        }}
                      >
                        <span
                          className="absolute top-1/2 left-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
                          style={{ background: waxHex(t) }}
                        />
                      </span>
                    </span>
                    <span className="mt-3 flex items-center justify-between gap-2">
                      <span className="font-display text-[1.375rem] leading-tight text-ink">
                        {TEMPLATES[id].label}
                      </span>
                      <ArrowRight
                        aria-hidden
                        className="size-4 shrink-0 text-ink-soft transition-transform group-hover:translate-x-1"
                      />
                    </span>
                    <span className="mt-1 block text-[0.875rem] text-muted">
                      {TEMPLATES[id].description}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {VARIANTS.map((group) => (
          <section
            key={group.id}
            aria-labelledby={group.id}
            className="mt-16 md:grid md:grid-cols-[13rem_minmax(0,1fr)] md:gap-14"
          >
            <div>
              <h2 id={group.id} className="font-display text-[1.75rem] leading-tight text-ink">
                {group.title}
              </h2>
              <p className="mt-2 text-[0.9375rem] text-muted">{group.note}</p>
            </div>
            <ul className="mt-4 grid border-t border-ink/30 sm:grid-cols-2 sm:gap-x-8 md:mt-0">
              {group.links.map((l) => (
                <li key={l.href} className="border-b border-line">
                  <Link
                    href={l.href}
                    className="group flex items-center justify-between gap-4 py-4 transition-colors hover:bg-ivory/60"
                  >
                    <span>
                      <span className="block font-display text-[1.375rem] leading-tight text-ink">
                        {l.label}
                        {"badge" in l && typeof l.badge === "string" ? (
                          <span className="ml-2 inline-block rounded-full border border-gold/60 bg-gold/10 px-2 py-0.5 align-middle font-sans text-[0.6875rem] font-medium tracking-wide text-ink-soft uppercase">
                            {l.badge}
                          </span>
                        ) : null}
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
        ))}

        <div className="mt-14 md:ml-[15.5rem]">
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
