import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { ContactForm } from "@/features/sales/contact-form";
import { PhoneDemo } from "@/features/sales/phone-demo";
import { PhoneFrame, PhoneStrip, ScreenShot, TemplateShowcase } from "@/features/sales/showcase";
import { OPENING_IDS, OPENINGS } from "@/lib/theme/envelope";
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

/** Lo que encuentra el invitado al bajar por la invitación (no es una secuencia obligada). */
const INVITATION_SECTIONS = [
  {
    src: "/venta/seccion-fecha.webp",
    title: "La fecha",
    text: "Calendario, cuenta atrás y un toque para guardarla en su móvil.",
  },
  {
    src: "/venta/seccion-programa.webp",
    title: "El día, hora a hora",
    text: "Ceremonia, cóctel, banquete y fiesta, con el cielo que cambia según la hora.",
  },
  {
    src: "/venta/seccion-lugares.webp",
    title: "Dónde es y cómo llegar",
    text: "Cada lugar con su foto, su dirección y la ruta en Maps o Waze. También los autobuses.",
  },
  {
    src: "/venta/seccion-historia.webp",
    title: "Vuestra historia",
    text: "Vuestras fotos y vuestros momentos, año a año.",
  },
  {
    src: "/venta/seccion-regalos.webp",
    title: "Lista de regalos",
    text: "Cada invitado se apunta a un regalo y nadie repite. La cuenta, si preferís.",
  },
];

/** Lo que pasa cuando el invitado toca «Sí, asistiré»: es una secuencia, por eso va numerada. */
const RSVP_STEPS = [
  {
    src: "/venta/confirmar-pregunta.webp",
    title: "¿Venís?",
    text: "La pregunta, con las plazas de su invitación y el plazo para responder.",
  },
  {
    src: "/venta/confirmar-quien.webp",
    title: "Quién viene",
    text: "Marca a cada persona y añade acompañante si le sobran plazas.",
  },
  {
    src: "/venta/confirmar-transporte.webp",
    title: "Autobús o coche",
    text: "Elige parada y plazas, o dice si puede llevar a alguien en su coche.",
  },
  {
    src: "/venta/confirmar-menu.webp",
    title: "Menú y alergias",
    text: "Un menú por persona y sus alergias, que llegan tal cual al catering.",
  },
  {
    src: "/venta/confirmar-pase.webp",
    title: "Su pase",
    text: "Al enviar recibe un pase con sus menús, su autobús y su mesa. Puede cambiarlo hasta el plazo.",
  },
];

/** Lo que se cambia en el editor. */
const EDITOR_FEATURES = [
  [
    "Plantilla, colores y letra",
    "Empezáis por una de las veinticinco y la lleváis a vuestro gusto.",
  ],
  ["Portada", "Vuestra foto, un vídeo o una de las portadas pintadas, con o sin efecto."],
  ["Textos y fotos", "La carta, vuestra historia, las preguntas frecuentes y cada foto."],
  ["Programa, lugares y autobuses", "Horas, direcciones, rutas y paradas."],
  ["Menús y regalos", "Lo que puede elegir cada invitado y vuestra lista de regalos."],
  ["Qué secciones se ven", "Ocultáis lo que no uséis y ponéis música si queréis."],
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
  "Editor con veinticinco plantillas, siete aperturas, colores, tipografías y lacres",
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
                <Link href="/i/familia-garcia?plantilla=arcilla" className={linkClass}>
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
                <div className="absolute top-6 -left-[26%] w-[70%] -rotate-[8deg]">
                  <PhoneFrame>
                    <Image
                      src="/venta/plantilla-terciopelo-portada.webp"
                      alt=""
                      fill
                      sizes="240px"
                    />
                  </PhoneFrame>
                </div>
                <div className="absolute top-0 -right-[26%] w-[70%] rotate-[8deg]">
                  <PhoneFrame>
                    <Image
                      src="/venta/plantilla-buganvilla-portada.webp"
                      alt=""
                      fill
                      sizes="240px"
                    />
                  </PhoneFrame>
                </div>
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

        <section aria-labelledby="plantillas" className="mx-auto max-w-6xl px-6 py-20 sm:px-10">
          <div className="md:flex md:items-end md:justify-between md:gap-14">
            <h2
              id="plantillas"
              className="font-display text-[2.25rem] leading-[1.05] text-ink sm:text-[2.75rem]"
            >
              Veinticinco plantillas para empezar
            </h2>
            <p className="mt-3 max-w-[48ch] text-[0.9375rem] leading-relaxed text-muted md:mt-0">
              Cada una llega con su portada, sus colores, su letra y su forma de abrirse. Tocad
              cualquiera para verla entera; luego cambiáis lo que queráis en el editor.
            </p>
          </div>
          <div className="mt-10">
            <TemplateShowcase />
          </div>
        </section>

        <section aria-labelledby="invitado" className="bg-ivory">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10">
            <div className="md:flex md:items-end md:justify-between md:gap-14">
              <h2
                id="invitado"
                className="font-display text-[2.25rem] leading-[1.05] text-ink sm:text-[2.75rem]"
              >
                Lo que recibe cada invitado
              </h2>
              <p className="mt-3 max-w-[48ch] text-[0.9375rem] leading-relaxed text-muted md:mt-0">
                Después de la portada y el sobre llega la invitación, con todo lo que necesita
                saber. Así se ve en tres de las plantillas.
              </p>
            </div>
            <div className="mt-10">
              <PhoneStrip label="Secciones de la invitación" items={INVITATION_SECTIONS} />
            </div>
          </div>
        </section>

        <section aria-labelledby="confirmar" className="mx-auto max-w-6xl px-6 py-20 sm:px-10">
          <div className="md:flex md:items-end md:justify-between md:gap-14">
            <h2
              id="confirmar"
              className="font-display text-[2.25rem] leading-[1.05] text-ink sm:text-[2.75rem]"
            >
              Confirma en un minuto
            </h2>
            <p className="mt-3 max-w-[48ch] text-[0.9375rem] leading-relaxed text-muted md:mt-0">
              Sin instalar nada ni crear una cuenta. Cada respuesta os llega al momento, con sus
              menús, sus alergias y su autobús.
            </p>
          </div>
          <div className="mt-10">
            <PhoneStrip label="Pasos para confirmar" items={RSVP_STEPS} numbered />
          </div>
        </section>

        <section aria-labelledby="editor" className="bg-ivory">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10">
            <div className="md:grid md:grid-cols-[15rem_minmax(0,1fr)] md:gap-14">
              <div>
                <h2
                  id="editor"
                  className="font-display text-[2.25rem] leading-[1.05] text-ink sm:text-[2.75rem]"
                >
                  La editáis vosotros
                </h2>
                <p className="mt-3 text-[0.9375rem] text-muted">
                  Veis el cambio en el móvil de al lado mientras lo hacéis, también después de
                  enviarla.
                </p>
              </div>
              <dl className="mt-8 grid gap-x-10 sm:grid-cols-2 md:mt-0">
                {EDITOR_FEATURES.map(([title, text]) => (
                  <div key={title} className="border-b border-line py-4">
                    <dt className="font-medium text-ink">{title}</dt>
                    <dd className="mt-1 text-[0.9375rem] text-ink-soft">{text}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="mt-12">
              <ScreenShot
                src="/venta/editor.webp"
                alt="El editor: a la izquierda, las plantillas; a la derecha, la invitación en un móvil."
                caption={`También elegís cómo se abre: ${OPENING_IDS.map((id) => OPENINGS[id].label.replace(/^\p{Lu}/u, (c) => c.toLowerCase())).join(", ")}.`}
              />
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
          <div className="mx-auto max-w-6xl px-6 pb-20 sm:px-10">
            <ScreenShot
              src="/venta/panel.webp"
              alt="El inicio del panel de María y Daniel: 111 de 150 invitados confirmados, qué toca ahora, cómo han llegado las respuestas y los menús elegidos."
              caption="El inicio: cuántos vienen, qué toca hacer ahora y cómo llegan las respuestas."
            />
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              <ScreenShot
                src="/venta/panel-invitaciones.webp"
                alt="La lista de invitaciones, con su estado y los botones para copiar el enlace, enviarlo por WhatsApp o ver su QR."
                caption="Invitaciones: cada una con su enlace, lista para WhatsApp o QR, y si la han abierto."
                sizes="(min-width: 768px) 340px, 100vw"
              />
              <ScreenShot
                src="/venta/panel-mesas.webp"
                alt="El plano del salón con las mesas y, al lado, las invitaciones que faltan por sentar."
                caption="Mesas: buscáis a cada invitado y lo sentáis en el plano; avisa si una mesa se llena."
                sizes="(min-width: 768px) 340px, 100vw"
              />
              <ScreenShot
                src="/venta/panel-menus.webp"
                alt="El reparto de menús y la lista de invitados con alergias."
                caption="Menús y alergias: el detalle se descarga para el catering, mesa a mesa."
                sizes="(min-width: 768px) 340px, 100vw"
              />
            </div>
          </div>
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
