import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { ContactForm } from "@/features/sales/contact-form";
import { PhoneDemo } from "@/features/sales/phone-demo";
import { OpeningShowcase, PhoneFrame, TemplateShowcase } from "@/features/sales/showcase";
import { BlossomCorner } from "@/features/invitation/ornaments";
import { PRICE_EUR } from "@/lib/sales/contact";
import { siteUrl } from "@/lib/site";

export function generateMetadata(): Metadata {
  const url = siteUrl();
  return {
    title: { absolute: "Invitaciones de boda que se abren como una carta" },
    description: `Invitación digital con sobre, lacre y carta, confirmaciones, mesas, menús y lista de regalos. Pago único de ${PRICE_EUR} €.`,
    // Solo con dominio propio: las direcciones de prueba de Vercel no deben indexarse.
    ...(url ? { robots: { index: true, follow: true }, alternates: { canonical: url } } : {}),
  };
}

/** Lo que vive cada invitado, en orden: es una secuencia, por eso va numerada. */
const GUEST_STEPS = [
  {
    title: "Una portada con vuestros nombres",
    text: "Vuestra foto, un cielo de estrellas o una acuarela. Con música, si queréis.",
  },
  {
    title: "Un sobre que se abre con un toque",
    text: "Papel, forro y lacre a vuestro gusto. Dentro, una carta con su nombre.",
  },
  {
    title: "La invitación, con todo lo que necesita saber",
    text: "El programa del día, cómo llegar, el autobús, el código de vestimenta y vuestra historia.",
  },
  {
    title: "Confirma en un minuto",
    text: "Quién viene, menú, alergias y si necesita autobús. Puede cambiarlo hasta la fecha límite.",
  },
];

const PANEL_FEATURES = [
  ["Confirmaciones al momento", "Quién viene, quién falta y a quién recordárselo por WhatsApp."],
  ["Menús y alergias", "El resumen que pide el catering, listo para enviar."],
  ["Mesas", "Un plano para colocar a cada invitado arrastrando."],
  ["Autobuses", "Plazas por ruta y quién ofrece coche."],
  ["Lista de regalos", "Cada invitado reserva uno y nadie repite. La cuenta, si preferís."],
  ["Álbum con QR", "Los invitados suben sus fotos desde la mesa y vosotros elegís cuáles se ven."],
  ["Tareas y presupuesto", "Lo que queda por hacer y lo que queda por pagar, con fechas."],
  ["Save the date", "Primero el aviso con la fecha; después, la invitación con el mismo enlace."],
];

const INCLUDED = [
  "Invitaciones para todos vuestros invitados, sin límite",
  "Editor con plantillas, colores, tipografías, sobres y lacres",
  "Panel de organización hasta el día de la boda",
  "Cambios ilimitados, también después de enviarla",
  "Ayuda por correo para dejarla a vuestro gusto",
];

const FAQS = [
  {
    q: "¿Los invitados tienen que instalar algo?",
    a: "No. Es un enlace que se abre en el navegador del móvil o del ordenador. Se lo podéis mandar por WhatsApp, por correo o como queráis.",
  },
  {
    q: "¿Cada invitado recibe su propia invitación?",
    a: "Sí. Cada familia o pareja tiene su enlace, con su nombre en la carta y sus plazas. Así sabéis quién ha respondido.",
  },
  {
    q: "¿Podemos cambiar algo después de enviarla?",
    a: "Sí, cuando queráis. Los invitados ven siempre la última versión con el mismo enlace.",
  },
  {
    q: "¿Y nuestras fotos y los datos de los invitados?",
    a: "Solo los veis vosotros y las personas a las que deis acceso. Las invitaciones no aparecen en buscadores y, si borráis el evento, se borra todo, fotos incluidas.",
  },
  {
    q: "¿Hay que pagar algo más?",
    a: `No. Son ${PRICE_EUR} € una sola vez por boda, sin suscripciones ni cobros por invitado.`,
  },
];

const linkClass =
  "text-[0.9375rem] text-ink-soft underline decoration-gold underline-offset-4 hover:text-ink hover:decoration-ink";

export default function SalesPage() {
  return (
    <div className="bg-paper">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 pt-6 sm:px-10">
        <p className="font-display text-[1.375rem] text-ink">Invitaciones</p>
        <nav aria-label="Principal" className="flex items-center gap-5">
          <Link href="/ejemplos" className={linkClass}>
            Ejemplos
          </Link>
          <Link href="/entrar" className={linkClass}>
            Entrar
          </Link>
        </nav>
      </header>

      <main>
        {/* Portada: el titular y, al lado, una invitación de verdad que se puede abrir. */}
        <section className="paper-grain relative overflow-hidden">
          <BlossomCorner className="pointer-events-none absolute -top-10 -left-14 hidden w-64 opacity-70 sm:block" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pt-14 pb-20 sm:px-10 md:grid-cols-[minmax(0,1fr)_auto] md:pt-20">
            <div>
              <h1 className="max-w-[13ch] font-display text-[clamp(3rem,8vw,5.5rem)] leading-[0.95] tracking-[-0.01em] text-ink">
                Una invitación que se abre como una carta
              </h1>
              <p className="mt-6 max-w-[46ch] text-[1.0625rem] leading-relaxed text-ink-soft">
                Vuestros invitados la reciben en el móvil, rompen el lacre y leen una carta con su
                nombre. Vosotros veis quién viene, qué come y dónde se sienta, sin hojas de cálculo.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                <a href="#pedir" className={buttonClasses("primary", "lg")}>
                  Pedir la nuestra
                </a>
                <Link href="/i/familia-garcia" className={linkClass}>
                  Abrir una de ejemplo a pantalla completa
                </Link>
              </div>
              <p className="mt-6 text-[0.9375rem] text-muted">
                {PRICE_EUR} €, pago único por boda.
              </p>
            </div>

            <figure className="relative mx-auto [--s:0.72] sm:[--s:0.8] md:mx-20">
              {/* Detrás, otras dos invitaciones abiertas en abanico, como en la mano. */}
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 hidden h-[calc(844px*var(--s))] md:block"
              >
                <PhoneFrame className="absolute top-6 -left-[26%] w-[70%] -rotate-[8deg]">
                  <Image src="/venta/plantilla-medianoche.webp" alt="" fill sizes="240px" />
                </PhoneFrame>
                <PhoneFrame className="absolute top-0 -right-[26%] w-[70%] rotate-[8deg]">
                  <Image src="/venta/plantilla-jardin.webp" alt="" fill sizes="240px" />
                </PhoneFrame>
              </div>
              <div className="relative">
                <PhoneDemo />
              </div>
              <figcaption className="relative mt-3 text-center text-[0.8125rem] text-muted">
                Es una invitación de verdad: ábrela y prueba a confirmar.
              </figcaption>
            </figure>
          </div>
        </section>

        {/* Las aperturas en marcha, sobre el color de la mesa en la que se abre el sobre. */}
        <section
          aria-labelledby="aperturas"
          className="overflow-hidden bg-[linear-gradient(180deg,var(--scene-1),var(--scene-2))] pt-20"
        >
          <div className="mx-auto max-w-6xl px-6 sm:px-10 md:grid md:grid-cols-[15rem_minmax(0,1fr)] md:gap-14">
            <h2
              id="aperturas"
              className="font-display text-[2.25rem] leading-[1.05] text-ink sm:text-[2.75rem]"
            >
              Elegid cómo se abre
            </h2>
            <p className="mt-4 max-w-[52ch] text-[1.0625rem] leading-relaxed text-ink-soft md:mt-2">
              Después de la portada llega el sobre. Puede esperar en la mesa, ocupar toda la
              pantalla o venir en una caja con lazo. Tocad cualquiera para probarla.
            </p>
          </div>
          <OpeningShowcase className="mx-auto mt-10 max-w-[90rem]" />
        </section>

        <section aria-labelledby="plantillas" className="mx-auto max-w-6xl px-6 py-20 sm:px-10">
          <div className="md:grid md:grid-cols-[15rem_minmax(0,1fr)] md:gap-14">
            <div>
              <h2
                id="plantillas"
                className="font-display text-[2.25rem] leading-[1.05] text-ink sm:text-[2.75rem]"
              >
                Plantillas para empezar
              </h2>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
                Cada una trae su papel, su forro, su lacre y su letra. Luego cambiáis lo que queráis
                en el editor.
              </p>
              <Link href="/ejemplos" className={`${linkClass} mt-4 inline-block`}>
                Ver portadas y momentos
              </Link>
            </div>
            <div className="mt-10 md:mt-0">
              <TemplateShowcase />
            </div>
          </div>
        </section>

        <section aria-labelledby="invitado" className="bg-ivory">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10">
            <div className="md:grid md:grid-cols-[15rem_minmax(0,1fr)] md:gap-14">
              <h2
                id="invitado"
                className="font-display text-[2.25rem] leading-[1.05] text-ink sm:text-[2.75rem]"
              >
                Lo que vive cada invitado
              </h2>
              <ol className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2 md:mt-0">
                {GUEST_STEPS.map((step, i) => (
                  <li key={step.title} className="border-t border-ink/25 pt-4">
                    <span
                      aria-hidden
                      className="font-display text-[1.75rem] leading-none text-gold"
                    >
                      {i + 1}
                    </span>
                    <h3 className="mt-2 font-display text-[1.5rem] leading-tight text-ink">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-soft">
                      {step.text}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section aria-labelledby="vosotros">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 md:grid md:grid-cols-[15rem_minmax(0,1fr)] md:gap-14">
            <div>
              <h2
                id="vosotros"
                className="font-display text-[2.25rem] leading-[1.05] text-ink sm:text-[2.75rem]"
              >
                Lo que tenéis vosotros
              </h2>
              <p className="mt-3 text-[0.9375rem] text-muted">
                Un panel para organizar la boda entre los dos, o con quien queráis.
              </p>
              <Link href="/panel/demo" className={`${linkClass} mt-4 inline-block`}>
                Ver el panel de ejemplo
              </Link>
            </div>
            <dl className="mt-8 grid gap-x-10 sm:grid-cols-2 md:mt-0">
              {PANEL_FEATURES.map(([title, text]) => (
                <div key={title} className="border-b border-line py-4">
                  <dt className="font-medium text-ink">{title}</dt>
                  <dd className="mt-1 text-[0.9375rem] text-ink-soft">{text}</dd>
                </div>
              ))}
            </dl>
          </div>
          <figure className="mx-auto max-w-6xl px-6 pb-20 sm:px-10">
            <div className="overflow-hidden rounded-[10px] border border-line shadow-[var(--shadow-lift)]">
              <Image
                src="/venta/panel.webp"
                width={1280}
                height={800}
                sizes="(min-width: 1152px) 1072px, 100vw"
                alt="El panel de María y Daniel: 111 de 150 invitados confirmados, cómo han llegado las respuestas y los menús elegidos."
                className="h-auto w-full"
              />
            </div>
            <figcaption className="mt-3 text-[0.8125rem] text-muted">
              El inicio del panel de la boda de ejemplo.
            </figcaption>
          </figure>
        </section>

        <section aria-labelledby="precio" className="bg-ivory">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 md:grid md:grid-cols-[15rem_minmax(0,1fr)] md:gap-14">
            <h2
              id="precio"
              className="font-display text-[2.25rem] leading-[1.05] text-ink sm:text-[2.75rem]"
            >
              Precio
            </h2>
            <div className="paper-grain mt-8 max-w-2xl rounded-[3px] border border-line bg-paper p-6 shadow-[var(--shadow-paper)] sm:p-8 md:mt-0">
              <p className="font-display text-[4.5rem] leading-none text-ink lining-nums">
                {PRICE_EUR} €
              </p>
              <p className="mt-2 text-[0.9375rem] text-muted">Una sola vez por boda.</p>
              <ul className="mt-6 grid gap-2.5 border-t border-line pt-5">
                {INCLUDED.map((item) => (
                  <li key={item} className="flex gap-3 text-[0.9375rem] text-ink-soft">
                    <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" />
                    {item}
                  </li>
                ))}
              </ul>
              <a href="#pedir" className={buttonClasses("primary", "lg", "mt-7")}>
                Pedir la nuestra
              </a>
            </div>
          </div>
        </section>

        <section aria-labelledby="preguntas">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 md:grid md:grid-cols-[15rem_minmax(0,1fr)] md:gap-14">
            <h2
              id="preguntas"
              className="font-display text-[2.25rem] leading-[1.05] text-ink sm:text-[2.75rem]"
            >
              Preguntas
            </h2>
            <div className="mt-8 max-w-2xl border-t border-ink/25 md:mt-0">
              {FAQS.map((f) => (
                <details key={f.q} className="group border-b border-line">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium text-ink [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span
                      aria-hidden
                      className="font-display text-[1.5rem] leading-none text-gold transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="pb-5 text-[0.9375rem] leading-relaxed text-ink-soft">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="pedir" aria-labelledby="pedir-title" className="scroll-mt-6 bg-ivory">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 md:grid md:grid-cols-[15rem_minmax(0,1fr)] md:gap-14">
            <div>
              <h2
                id="pedir-title"
                className="font-display text-[2.25rem] leading-[1.05] text-ink sm:text-[2.75rem]"
              >
                Pedid la vuestra
              </h2>
              <p className="mt-3 text-[0.9375rem] text-muted">
                Dejadnos vuestros datos y os escribimos para empezar.
              </p>
            </div>
            <div className="relative mt-8 max-w-2xl md:mt-0">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-[0.875rem] text-muted sm:px-10">
          <p>Invitaciones digitales para bodas.</p>
          <nav aria-label="Pie de página" className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/ejemplos" className={linkClass}>
              Ver todos los ejemplos
            </Link>
            <Link href="/aviso-legal" className={linkClass}>
              Aviso legal
            </Link>
            <Link href="/privacidad" className={linkClass}>
              Privacidad
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
