import { ArrowRight } from "lucide-react";
import type { Viewport } from "next";
import Link from "next/link";
import { SampleBook } from "@/features/sales/sample-book";
import { coverFamilies, openingFamilies, templateFamilies } from "@/features/sales/showcase";
import { getEvent, listShowcaseInvitations } from "@/lib/data/repository";
import "../venta.css";

export const metadata = { title: "Ejemplos" };
export const viewport: Viewport = { themeColor: "#3a2a22" };

const NOTES: Record<string, string> = {
  "familia-garcia": "Familia con una niña y una plaza libre para acompañante.",
  "carlos-ruiz": "Invitación individual con acompañante opcional.",
  "elena-y-pablo": "Pareja con dos plazas.",
  "prueba-error": "Simula un fallo de red al enviar la respuesta la primera vez.",
  "plazo-cerrado": "Muestra cómo se ve la invitación con el plazo de confirmación cerrado.",
};

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
    text: "Pulsad «Saltar intro» y bajad hasta Regalos: se reserva uno para que nadie lo repita.",
  },
  {
    href: "/album/demo",
    label: "Álbum de los invitados",
    text: "Las fotos que suben los invitados desde el QR de las mesas.",
  },
];

const shell = "mx-auto w-full max-w-6xl px-6 sm:px-10";
const sectionTitle = "v-display text-[clamp(2.6rem,5.2vw,4.5rem)] leading-[0.98]";

/** Los ejemplos: invitaciones de la boda ficticia, plantillas, aperturas, portadas y momentos. */
export default async function Examples() {
  const [event, invitations] = await Promise.all([getEvent(), listShowcaseInvitations()]);
  const couple = `${event.couple.first} y ${event.couple.second}`;

  return (
    <div className="venta">
      {/* ── Portada: las invitaciones de ejemplo, listas para abrir ── */}
      <div className="v-ink">
        <header className={`${shell} flex items-center justify-between gap-6 pt-6`}>
          <Link href="/" className="flex items-baseline gap-2.5">
            <span className="v-display text-[1.875rem] leading-none">eFeLe</span>
            <span className="text-[0.8125rem] text-[var(--niebla)]">Invitaciones</span>
          </Link>
          <nav aria-label="Principal" className="flex items-center gap-6 text-[0.9375rem]">
            <a href="#plantillas" className="v-link hidden md:inline">
              Plantillas
            </a>
            <a href="#aperturas" className="v-link hidden md:inline">
              Aperturas
            </a>
            <a href="#portadas" className="v-link hidden md:inline">
              Portadas
            </a>
            <Link href="/#precio" className="v-link">
              Precio
            </Link>
            <Link href="/entrar" className="v-link">
              Entrar
            </Link>
          </nav>
        </header>

        <section
          aria-labelledby="titular"
          className={`${shell} grid gap-14 pt-14 pb-16 sm:pb-24 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-20 lg:pt-20 lg:pb-28`}
        >
          <div>
            <h1
              id="titular"
              className="v-display max-w-[11ch] text-[clamp(3.2rem,6.4vw,6rem)] leading-[0.95]"
            >
              Abridla como un invitado
            </h1>
            <p className="mt-8 max-w-[44ch] text-[1.125rem] leading-relaxed text-[var(--niebla)]">
              Todo es de una boda ficticia, la de {couple}. Abrid sus invitaciones y probad cada
              plantilla, apertura y portada. En el panel veréis cómo siguen los novios las
              respuestas.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
              <Link href="/panel/demo" className="v-btn v-btn-papel">
                Abrir el panel de los novios
              </Link>
              <Link href="/#pedir" className="v-link text-[0.9375rem]">
                Pedir la nuestra
              </Link>
            </div>
          </div>

          <section aria-labelledby="invitaciones" className="lg:pt-3">
            <h2 id="invitaciones" className="v-display text-[2rem] leading-tight">
              Invitaciones de ejemplo
            </h2>
            <p className="mt-2 text-[0.9375rem] text-[var(--niebla)]">
              Cada una saluda a quien la recibe y sabe cuántas plazas tiene.
            </p>
            <ul className="mt-6 border-t border-[var(--tinta-3)]">
              {invitations.map((g) => (
                <li key={g.token} className="border-b border-[var(--tinta-3)]">
                  <Link
                    href={`/i/${g.token}`}
                    className="group flex items-center justify-between gap-4 py-4 transition-colors hover:bg-[var(--tinta-2)]"
                  >
                    <span>
                      <span className="v-display block text-[1.75rem] leading-tight">
                        {g.displayName}
                      </span>
                      <span className="mt-1 block text-[0.875rem] text-[var(--niebla)]">
                        {NOTES[g.token]}
                      </span>
                    </span>
                    <ArrowRight
                      aria-hidden
                      className="size-5 shrink-0 text-[var(--oro)] transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </section>
      </div>

      <main>
        {/* ── Plantillas, sobre el papel ── */}
        <section
          id="plantillas"
          aria-labelledby="plantillas-title"
          className="scroll-mt-4 py-16 sm:py-24 lg:py-32"
        >
          <div className={shell}>
            <h2 id="plantillas-title" className={`${sectionTitle} max-w-[14ch]`}>
              Veinticinco plantillas
            </h2>
            <p className="mt-6 max-w-[48ch] text-[1.0625rem] leading-relaxed text-[var(--grafito)]">
              Cada una trae su portada, sus colores, su letra y su forma de abrirse. En el editor se
              cambia lo que haga falta.
            </p>
            <div className="mt-12">
              <SampleBook families={templateFamilies()} tone="papel" />
            </div>
          </div>
        </section>

        {/* ── Aperturas en marcha, sobre la tinta ── */}
        <section
          id="aperturas"
          aria-labelledby="aperturas-title"
          className="v-ink scroll-mt-4 py-16 sm:py-24 lg:py-32"
        >
          <div className={shell}>
            <h2 id="aperturas-title" className={sectionTitle}>
              Siete aperturas
            </h2>
            <p className="mt-6 max-w-[48ch] text-[1.0625rem] leading-relaxed text-[var(--niebla)]">
              Lo que pasa después de la portada, grabado tal cual lo ve el invitado. Tocad
              cualquiera para abrirla vosotros.
            </p>
            <div className="mt-12">
              <SampleBook families={openingFamilies()} noun="Aperturas" />
            </div>
          </div>
        </section>

        {/* ── Portadas, sobre el papel ── */}
        <section
          id="portadas"
          aria-labelledby="portadas-title"
          className="scroll-mt-4 py-16 sm:py-24 lg:py-32"
        >
          <div className={shell}>
            <h2 id="portadas-title" className={sectionTitle}>
              Treinta y dos portadas
            </h2>
            <p className="mt-6 max-w-[48ch] text-[1.0625rem] leading-relaxed text-[var(--grafito)]">
              Lo primero que ve el invitado, con vuestros nombres. Cualquier portada va con
              cualquier plantilla.
            </p>
            <div className="mt-12">
              <SampleBook families={coverFamilies()} tone="papel" noun="Portadas" perView={5} />
            </div>
          </div>
        </section>

        {/* ── Momentos y panel, sobre la tinta ── */}
        <section
          id="momentos"
          aria-labelledby="momentos-title"
          className="v-ink scroll-mt-4 py-16 sm:py-24 lg:py-32"
        >
          <div
            className={`${shell} grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-20`}
          >
            <div>
              <h2 id="momentos-title" className={sectionTitle}>
                Momentos
              </h2>
              <p className="mt-6 max-w-[36ch] text-[1.0625rem] leading-relaxed text-[var(--niebla)]">
                Con el mismo enlace, la invitación cambia según el momento: antes, durante y después
                de la boda.
              </p>
            </div>
            <ul className="grid border-t border-[var(--tinta-3)] sm:grid-cols-2 sm:gap-x-10">
              {MOMENTS.map((m) => (
                <li key={m.href} className="border-b border-[var(--tinta-3)]">
                  <Link
                    href={m.href}
                    className="group flex h-full items-center justify-between gap-4 py-5 transition-colors hover:bg-[var(--tinta-2)]"
                  >
                    <span>
                      <span className="v-display block text-[1.625rem] leading-tight">
                        {m.label}
                      </span>
                      <span className="mt-1 block text-[0.875rem] leading-snug text-[var(--niebla)]">
                        {m.text}
                      </span>
                    </span>
                    <ArrowRight
                      aria-hidden
                      className="size-4 shrink-0 text-[var(--oro)] transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={`${shell} mt-16 sm:mt-24`}>
            <div className="v-filete paper-grain rounded-[3px] bg-[var(--papel)] px-6 py-10 text-[var(--tinta)] sm:px-12 sm:py-12 md:flex md:items-center md:justify-between md:gap-12">
              <div>
                <h2 className="v-display text-[clamp(2.2rem,4vw,3.25rem)] leading-[1.02]">
                  El panel de los novios
                </h2>
                <p className="mt-4 max-w-[46ch] text-[1.0625rem] leading-relaxed text-[var(--grafito)]">
                  Cuántos vienen, quién falta, menús, mesas y autobuses. Todo con las respuestas de
                  la boda de {couple}.
                </p>
              </div>
              <div className="mt-8 flex flex-col items-start gap-4 md:mt-0 md:shrink-0 md:items-end">
                <Link href="/panel/demo" className="v-btn v-btn-lacre">
                  Abrir el panel de los novios
                </Link>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-[0.9375rem]">
                  <Link href="/entrar" className="v-link">
                    Crear vuestra invitación
                  </Link>
                  <Link href="/laboratorio/sobre-3d" className="v-link">
                    Comparar con el sobre 3D
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="v-ink border-t border-[var(--tinta-3)]">
        <div
          className={`${shell} flex flex-wrap items-center justify-between gap-6 py-10 text-[0.875rem] text-[var(--niebla)]`}
        >
          <div>
            <p className="flex items-baseline gap-2.5 text-[var(--papel)]">
              <span className="v-display text-[1.75rem] leading-none">eFeLe</span>
              <span className="text-[0.8125rem] text-[var(--niebla)]">Invitaciones</span>
            </p>
            <p className="mt-2">
              Un servicio de eFeLe, decoración de eventos.{" "}
              <a
                href="https://www.instagram.com/eventos.efele/"
                target="_blank"
                rel="noopener noreferrer"
                className="v-link"
              >
                @eventos.efele en Instagram
              </a>
            </p>
          </div>
          <nav aria-label="Pie de página" className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/" className="v-link">
              Volver a la página principal
            </Link>
            <Link href="/aviso-legal" className="v-link">
              Aviso legal
            </Link>
            <Link href="/privacidad" className="v-link">
              Privacidad
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
