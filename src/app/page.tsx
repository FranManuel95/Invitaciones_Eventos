import type { Metadata, Viewport } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "@/features/sales/contact-form";
import { HeroFilm } from "@/features/sales/hero-film";
import { Journey, type JourneyStep } from "@/features/sales/journey";
import { PlanLink } from "@/features/sales/plan-link";
import { PhoneDemo } from "@/features/sales/phone-demo";
import { SampleBook, type SampleFamily } from "@/features/sales/sample-book";
import { FEATURED_TEMPLATE_IDS, isConceptCover, TEMPLATES } from "@/lib/theme";
import { PLANS, PRICE_FROM_EUR } from "@/lib/sales/plans";
import { siteUrl } from "@/lib/site";
import "./venta.css";

export const viewport: Viewport = { themeColor: "#1b2033" };

export function generateMetadata(): Metadata {
  const url = siteUrl();
  return {
    title: { absolute: "Invitaciones eFeLe: invitaciones de boda que se abren como una carta" },
    description: `Invitación digital con sobre, lacre y carta, confirmaciones, mesas, menús y lista de regalos. Pago único por boda, desde ${PRICE_FROM_EUR} €.`,
    // Solo con dominio propio: las direcciones de prueba de Vercel no deben indexarse.
    ...(url ? { robots: { index: true, follow: true }, alternates: { canonical: url } } : {}),
  };
}

/** Lo que vive el invitado, en orden: es una secuencia, por eso va numerada. Todo en Arcilla. */
const STEPS: readonly JourneyStep[] = [
  {
    src: "/venta/plantilla-arcilla-portada.webp",
    title: "Le llega vuestro enlace",
    text: "Por WhatsApp o por correo, uno por familia. Al abrirlo, la portada con vuestros nombres y la fecha.",
    alt: "La portada de la plantilla Arcilla: María & Daniel, 22 de mayo de 2027, en Chinchón.",
  },
  {
    src: "/venta/recorrido-sobre.webp",
    title: "Rompe el lacre",
    text: "Toca el lacre y el sobre se abre de verdad, en vídeo y con su sonido.",
    alt: "Un sobre burdeos con un lacre dorado sobre una mesa de lino.",
  },
  {
    src: "/venta/recorrido-carta.webp",
    title: "Lee una carta con su nombre",
    text: "«Hola, Familia García». Cada invitación saluda a quien la recibe y sabe cuántas plazas tiene.",
    alt: "La carta: «Hola, Familia García», con el mensaje de María y Daniel.",
  },
  {
    src: "/venta/recorrido-inicio.webp",
    title: "Encuentra todo lo del día",
    text: "El programa hora a hora, la cuenta atrás y un toque para guardar la fecha en su calendario.",
    alt: "El inicio de la invitación con la foto de la pareja, la fecha y el botón para confirmar.",
  },
  {
    src: "/venta/recorrido-lugares.webp",
    title: "Sabe cómo llegar",
    text: "Cada lugar con su foto y su ruta en Maps o Waze. Si hay autobús, elige parada.",
    alt: "La iglesia, con su dirección y los botones de ruta.",
  },
  {
    src: "/venta/confirmar-pregunta.webp",
    title: "Confirma en un minuto",
    text: "Quién viene, qué menú, alergias y autobús. Sin instalar nada ni crear una cuenta.",
    alt: "«¿Venís?», con los botones «Sí, asistiré» y «No podré asistir».",
  },
  {
    src: "/venta/confirmar-pase.webp",
    title: "Guarda su pase",
    text: "Con sus menús, su autobús y, cuando la pongáis, su mesa. Puede cambiar la respuesta hasta el plazo.",
    alt: "El pase de la Familia García, con sus menús, su autobús y un código QR.",
  },
];

/** Las plantillas, por familias: las pintadas o con foto, y las que son un objeto. */
function families(): SampleFamily[] {
  const pick = (concept: boolean) =>
    FEATURED_TEMPLATE_IDS.filter((id) => isConceptCover(TEMPLATES[id].look.cover!) === concept).map(
      (id) => ({ id, label: TEMPLATES[id].label, description: TEMPLATES[id].description }),
    );
  return [
    {
      id: "papel",
      label: "Papel y acuarela",
      note: "Acuarelas, papeles y vuestra foto, cada una con su sobre en vídeo: un lacre que se rompe, una caja con lazo, un díptico.",
      templates: pick(false),
    },
    {
      id: "objetos",
      label: "Objetos",
      note: "La invitación es otra cosa: un periódico con vuestro titular, una tarjeta de embarque, un décimo que se rasca, un disco que se saca de la funda.",
      templates: pick(true),
    },
  ];
}

const FOR_YOU = [
  [
    "Quién viene, al momento",
    "Cada respuesta entra sola. Sabéis quién falta y se lo recordáis por WhatsApp con un toque.",
  ],
  ["Menús y alergias", "El resumen que pide el catering, mesa a mesa, listo para descargar."],
  ["Mesas", "Un plano donde buscáis a cada invitado y lo sentáis arrastrando."],
  ["Autobuses", "Plazas por ruta y parada, y quién ofrece sitio en su coche."],
  ["Tareas, presupuesto y agenda", "Lo que queda por hacer y por pagar, con sus fechas."],
  ["Álbum con QR", "Los invitados suben sus fotos desde la mesa y vosotros elegís cuáles se ven."],
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
    a: `No. Se paga una sola vez por boda, desde ${PRICE_FROM_EUR} € según lo que incluya, sin suscripciones ni cobros por invitado.`,
  },
];

/**
 * Tres decoraciones de muestra y su invitación: la misma paleta, la misma flor y el mismo lacre.
 * Las imágenes son las portadas pintadas y los lacres de las plantillas.
 */
const DECOR = [
  {
    name: "Pampa y terracota",
    colors: "Crudo, rosa pampa y terracota",
    swatches: ["#f3e6cf", "#e4bfa9", "#b8593a"],
    cover: "/portadas/cortijo-fondo.webp",
    seal: "/acuarelas/pampa-lacre.webp",
  },
  {
    name: "Lavanda",
    colors: "Blanco, lila y violeta",
    swatches: ["#f6f3fa", "#bcaad8", "#6a5799"],
    cover: "/portadas/lavanda.webp",
    seal: "/acuarelas/lavanda-lacre.webp",
  },
  {
    name: "Olivo y oro",
    colors: "Marfil, salvia y oro",
    swatches: ["#f8f4ea", "#a9b79c", "#c8a45c"],
    cover: "/portadas/ramas.webp",
    seal: "/venta/lacre-oro.webp",
  },
] as const;

const MATCH = [
  ["Los colores", "Los de vuestras mesas, del papel de la carta al forro del sobre."],
  ["Las flores", "Las mismas de los centros, también en la portada de la invitación."],
  ["El lacre", "Del color de la decoración, con el motivo que elijáis."],
] as const;

const shell = "mx-auto w-full max-w-6xl px-6 sm:px-10";

export default function SalesPage() {
  return (
    <div className="venta">
      {/* ── Portada: el sobre real que se abre, sobre la tinta ── */}
      <div className="v-ink relative overflow-hidden">
        <header className={`${shell} flex items-center justify-between gap-6 pt-6`}>
          {/* La marca: eFeLe, la empresa de decoración de eventos, y el servicio. */}
          <Link href="/" className="flex items-baseline gap-2.5">
            <span className="v-display text-[1.875rem] leading-none">eFeLe</span>
            <span className="text-[0.8125rem] text-[var(--niebla)]">Invitaciones</span>
          </Link>
          <nav aria-label="Principal" className="flex items-center gap-6 text-[0.9375rem]">
            <a href="#recorrido" className="v-link hidden md:inline">
              Cómo funciona
            </a>
            <a href="#plantillas" className="v-link hidden md:inline">
              Plantillas
            </a>
            <a href="#precio" className="v-link hidden md:inline">
              Precio
            </a>
            <Link href="/ejemplos" className="v-link">
              Ejemplos
            </Link>
            <Link href="/entrar" className="v-link">
              Entrar
            </Link>
          </nav>
        </header>

        <section
          aria-labelledby="titular"
          className={`${shell} grid items-end gap-12 pt-12 pb-16 md:pt-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16 lg:pb-24`}
        >
          <div className="lg:pb-6">
            <h1
              id="titular"
              className="v-display max-w-[12ch] text-[clamp(3.4rem,6.6vw,6.25rem)] leading-[0.95]"
            >
              Una invitación que se abre como una carta
            </h1>
            <p className="mt-8 max-w-[44ch] text-[1.125rem] leading-relaxed text-[var(--niebla)]">
              Cada invitado rompe el lacre en su móvil y lee una carta con su nombre. Vosotros
              sabéis al momento quién viene, qué come y dónde se sienta.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
              <a href="#pedir" className="v-btn v-btn-papel">
                Pedir la nuestra
              </a>
              <Link href="/i/familia-garcia?plantilla=arcilla" className="v-link text-[0.9375rem]">
                Abrir una de ejemplo
              </Link>
            </div>
            <p className="mt-8 text-[0.9375rem] text-[var(--niebla)]">
              Desde {PRICE_FROM_EUR} € una sola vez por boda, para todos vuestros invitados.
            </p>
          </div>

          <figure>
            <div className="relative mx-auto aspect-[4/5] max-h-[62svh] w-full max-w-[30rem] overflow-hidden rounded-[6px] sm:aspect-[9/14] lg:aspect-[9/16] lg:max-h-[78svh]">
              <HeroFilm />
            </div>
            <figcaption className="mx-auto mt-4 max-w-[30rem] text-[0.875rem] text-[var(--niebla)]">
              Así se abre el sobre de la plantilla Buganvilla. Cada plantilla trae el suyo.
            </figcaption>
          </figure>
        </section>
      </div>

      <main>
        {/* ── El recorrido del invitado ── */}
        <section id="recorrido" aria-labelledby="recorrido-title" className="scroll-mt-4">
          <div className={`${shell} pt-16 pb-8 sm:pt-24 sm:pb-10 lg:pt-32`}>
            <h2
              id="recorrido-title"
              className="v-display max-w-[16ch] text-[clamp(2.6rem,5.2vw,4.5rem)] leading-[0.98]"
            >
              Así la vive cada invitado
            </h2>
            <p className="mt-6 max-w-[48ch] text-[1.0625rem] leading-relaxed text-[var(--grafito)]">
              De la portada al pase, en la plantilla Arcilla. Con cualquier otra cambia el aspecto,
              no el camino.
            </p>
          </div>
          <div className={`${shell} pb-16`}>
            <Journey steps={STEPS} />
          </div>

          {/* La invitación de verdad, para probarla aquí mismo. */}
          <div className={`${shell} pb-20 sm:pb-28`}>
            <div className="grid items-center gap-10 border-t border-[var(--papel-2)] pt-16 md:grid-cols-[minmax(0,1fr)_auto] md:gap-16">
              <div>
                <h3 className="v-display text-[clamp(2.2rem,4vw,3.25rem)] leading-[1.02]">
                  Probadla vosotros
                </h3>
                <p className="mt-4 max-w-[42ch] text-[1.0625rem] leading-relaxed text-[var(--grafito)]">
                  Es la invitación de ejemplo, completa. Abridla, romped el lacre y confirmad: las
                  respuestas solo se guardan en vuestro navegador.
                </p>
              </div>
              <div className="mx-auto [--s:0.72] sm:[--s:0.8]">
                <PhoneDemo />
              </div>
            </div>
          </div>
        </section>

        {/* ── El muestrario de plantillas, sobre la tinta ── */}
        <section
          id="plantillas"
          aria-labelledby="plantillas-title"
          className="v-ink scroll-mt-4 py-16 sm:py-24 lg:py-32"
        >
          <div className={shell}>
            <h2
              id="plantillas-title"
              className="v-display max-w-[14ch] text-[clamp(2.6rem,5.2vw,4.5rem)] leading-[0.98]"
            >
              Cincuenta y ocho plantillas para empezar
            </h2>
            <div className="mt-12">
              <SampleBook families={families()} />
            </div>
            <p className="mt-10 text-[0.9375rem]">
              <Link href="/ejemplos" className="v-link">
                Ver portadas, aperturas y momentos en los ejemplos
              </Link>
            </p>
          </div>
        </section>

        {/* ── Lo que tenéis vosotros ── */}
        {/* ── Lo que tenéis vosotros: panel, funciones y editor, en tres franjas equilibradas ── */}
        <section aria-labelledby="vosotros-title" className="py-16 sm:py-24 lg:py-32">
          <div
            className={`${shell} grid items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16`}
          >
            <div>
              <h2
                id="vosotros-title"
                className="v-display max-w-[12ch] text-[clamp(2.6rem,5.2vw,4.5rem)] leading-[0.98]"
              >
                Y vosotros, la boda en orden
              </h2>
              <p className="mt-6 max-w-[42ch] text-[1.0625rem] leading-relaxed text-[var(--grafito)]">
                Todo lo que responden los invitados llega a un panel para los dos: cuántos vienen,
                quién falta y qué toca hacer ahora.
              </p>
              <p className="mt-8 text-[0.9375rem]">
                <Link href="/panel/demo" className="v-link">
                  Ver el panel de ejemplo
                </Link>
              </p>
            </div>
            <figure>
              <div className="aspect-[4/3] overflow-hidden rounded-[10px] shadow-[0_40px_80px_-40px_rgb(27_32_51/0.5)] ring-1 ring-[var(--papel-2)] sm:aspect-auto">
                {/* En el móvil, ampliada y recortada: a tamaño completo no se leería. */}
                <div className="w-[175%] sm:w-full">
                  <Image
                    src="/venta/panel.webp"
                    width={1280}
                    height={800}
                    sizes="(min-width: 1024px) 660px, (min-width: 640px) 100vw, 175vw"
                    alt="El inicio del panel de María y Daniel: 111 de 150 invitados confirmados, qué toca ahora, cómo han llegado las respuestas y los menús elegidos."
                    className="h-auto w-full"
                  />
                </div>
              </div>
              <figcaption className="mt-3 text-[0.875rem] text-[var(--grafito)]">
                El panel: cuántos vienen y qué toca hacer ahora.
              </figcaption>
            </figure>
          </div>

          <dl
            className={`${shell} mt-14 grid gap-x-12 gap-y-8 sm:mt-20 sm:grid-cols-2 lg:mt-24 lg:grid-cols-3`}
          >
            {FOR_YOU.map(([title, text]) => (
              <div key={title} className="border-t border-[var(--papel-2)] pt-4">
                <dt className="text-[1rem] font-medium">{title}</dt>
                <dd className="mt-1 text-[0.9375rem] leading-relaxed text-[var(--grafito)]">
                  {text}
                </dd>
              </div>
            ))}
          </dl>

          <div
            className={`${shell} mt-16 grid items-center gap-10 sm:mt-20 sm:gap-12 lg:mt-28 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16`}
          >
            <figure className="order-2 lg:order-1">
              <div className="aspect-[4/3] overflow-hidden rounded-[10px] shadow-[0_40px_80px_-40px_rgb(27_32_51/0.5)] ring-1 ring-[var(--papel-2)] sm:aspect-auto">
                <div className="-ml-[75%] w-[175%] sm:ml-0 sm:w-full">
                  <Image
                    src="/venta/editor.webp"
                    width={1280}
                    height={800}
                    sizes="(min-width: 1024px) 660px, (min-width: 640px) 100vw, 175vw"
                    alt="El editor: a la izquierda, las plantillas; a la derecha, la invitación en un móvil."
                    className="h-auto w-full"
                  />
                </div>
              </div>
              <figcaption className="mt-3 text-[0.875rem] text-[var(--grafito)]">
                El editor: cada cambio se ve en el móvil de al lado.
              </figcaption>
            </figure>
            <div className="order-1 lg:order-2">
              <h3 className="v-display max-w-[14ch] text-[clamp(2.2rem,4vw,3.25rem)] leading-[1.02]">
                La editáis cuando queráis
              </h3>
              <p className="mt-5 max-w-[40ch] text-[1.0625rem] leading-relaxed text-[var(--grafito)]">
                Plantilla, colores, letra, fotos y textos, con la invitación en un móvil al lado.
                También después de enviarla: los invitados ven siempre la última versión, con el
                mismo enlace.
              </p>
            </div>
          </div>
        </section>

        {/* ── A juego con la decoración: lo que diferencia a eFeLe ── */}
        <section
          id="decoracion"
          aria-labelledby="decoracion-title"
          className="scroll-mt-4 bg-[var(--papel-2)] py-16 sm:py-24 lg:py-32"
        >
          <div
            className={`${shell} grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-x-16 lg:gap-y-10`}
          >
            <div className="lg:col-start-1 lg:row-start-1">
              <h2
                id="decoracion-title"
                className="v-display max-w-[13ch] text-[clamp(2.6rem,5.2vw,4.5rem)] leading-[0.98]"
              >
                A juego con vuestra decoración
              </h2>
              <p className="mt-6 max-w-[42ch] text-[1.0625rem] leading-relaxed text-[var(--grafito)]">
                En eFeLe decoramos bodas. Si también decoramos la vuestra, la invitación puede
                llevar lo mismo que veréis ese día en las mesas. Y se pide junto con la decoración.
              </p>
            </div>

            {/* Tres muestras: la paleta de la decoración y su invitación. */}
            <ul
              aria-label="Tres decoraciones de muestra"
              className="grid grid-cols-3 gap-4 self-center sm:gap-6 lg:col-start-2 lg:row-span-2 lg:row-start-1"
            >
              {DECOR.map((d, i) => (
                <li key={d.name} className={i === 1 ? "mt-8 sm:mt-12" : ""}>
                  <div className="relative">
                    <div className="relative aspect-[9/16] overflow-hidden rounded-[3px] bg-[var(--papel)] shadow-[0_30px_50px_-30px_rgb(27_32_51/0.55)] ring-1 ring-[var(--linea)]">
                      <Image
                        src={d.cover}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 200px, 30vw"
                        className="object-cover"
                      />
                    </div>
                    <Image
                      src={d.seal}
                      alt=""
                      width={120}
                      height={120}
                      className="absolute -bottom-4 left-2 size-11 rotate-[-10deg] drop-shadow-[0_8px_10px_rgb(0_0_0/0.3)] sm:left-3 sm:size-16"
                    />
                  </div>
                  <p className="mt-7 text-[0.875rem] leading-snug font-medium sm:mt-8 sm:text-[1rem]">
                    {d.name}
                  </p>
                  <div aria-hidden className="mt-2.5 flex gap-1 sm:mt-3 sm:gap-1.5">
                    {d.swatches.map((c) => (
                      <span
                        key={c}
                        className="size-4 rounded-full ring-1 ring-[var(--tinta)]/15 sm:size-6"
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-[0.8125rem] leading-snug text-[var(--grafito)] sm:text-[0.875rem]">
                    {d.colors}
                  </p>
                </li>
              ))}
            </ul>

            <div className="lg:col-start-1 lg:row-start-2">
              <dl className="grid gap-6 sm:grid-cols-3 lg:grid-cols-1">
                {MATCH.map(([title, text]) => (
                  <div key={title} className="border-t border-[var(--linea)] pt-4">
                    <dt className="text-[1rem] font-medium">{title}</dt>
                    <dd className="mt-1 text-[0.9375rem] leading-relaxed text-[var(--grafito)]">
                      {text}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-10 max-w-[40ch] text-[1.0625rem] leading-relaxed">
                Contadnos cómo será vuestra decoración y la invitación la sigue.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-4">
                <a href="#pedir" className="v-btn v-btn-lacre">
                  Contadnos vuestra decoración
                </a>
                <a
                  href="https://www.instagram.com/eventos.efele/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="v-link text-[0.9375rem]"
                >
                  Ver decoraciones en Instagram
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Precio: tres tarjetas impresas; la completa, cerrada con su lacre ── */}
        <section
          id="precio"
          aria-labelledby="precio-title"
          className="v-ink scroll-mt-4 py-16 sm:py-24 lg:py-32"
        >
          <div className={shell}>
            <div className="max-w-[44rem]">
              <h2
                id="precio-title"
                className="v-display text-[clamp(2.6rem,5.2vw,4.5rem)] leading-[0.98]"
              >
                Elegid lo que necesitáis
              </h2>
              <p className="mt-6 max-w-[48ch] text-[1.0625rem] leading-relaxed text-[var(--niebla)]">
                Se paga una vez por boda. Sin suscripciones y sin cobrar por invitado, invitéis a
                cuarenta o a cuatrocientos.
              </p>
            </div>
            <ul className="mt-14 grid items-stretch gap-8 lg:grid-cols-3 lg:gap-6">
              {PLANS.map((plan) => (
                <li key={plan.id} className="relative pt-10">
                  {plan.featured ? (
                    <Image
                      src="/venta/lacre-oro.webp"
                      alt=""
                      width={360}
                      height={360}
                      className="absolute top-0 left-1/2 z-10 size-20 -translate-x-1/2 rotate-[-8deg] drop-shadow-[0_10px_14px_rgb(0_0_0/0.35)]"
                    />
                  ) : null}
                  <div className="v-filete paper-grain flex h-full flex-col rounded-[3px] bg-[var(--papel)] px-7 pt-12 pb-8 text-center text-[var(--tinta)]">
                    <h3 className="v-display text-[1.75rem] leading-tight">{plan.name}</h3>
                    <p className="mt-2 text-[0.9375rem] text-[var(--grafito)]">{plan.pitch}</p>
                    <p className="v-num mt-6 text-[clamp(3.5rem,8vw,4.75rem)] leading-none">
                      {plan.price} €
                    </p>
                    <p className="mt-2 text-[0.875rem] text-[var(--grafito)]">
                      Una sola vez por boda
                    </p>
                    <ul className="mt-6 flex-1 divide-y divide-[var(--papel-2)] border-y border-[var(--papel-2)] text-left">
                      {plan.includes.map((item) => (
                        <li
                          key={item}
                          className="py-3 text-[0.9375rem] leading-snug text-[var(--grafito)]"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                    <PlanLink plan={plan.id} className="v-btn v-btn-lacre mt-7">
                      Pedir «{plan.name}»
                    </PlanLink>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-8 max-w-[60ch] text-[0.9375rem] text-[var(--niebla)]">
              ¿Dudáis cuál os conviene? Elegid «Aún no lo sé» en el formulario y os ayudamos. Se
              puede ampliar más adelante.
            </p>
          </div>
        </section>

        {/* ── Preguntas y formulario ── */}
        <section
          aria-labelledby="preguntas-title"
          className={`${shell} grid gap-16 py-24 lg:grid-cols-2 lg:gap-20 lg:py-32`}
        >
          <div>
            <h2
              id="preguntas-title"
              className="v-display text-[clamp(2.4rem,4.4vw,3.75rem)] leading-[0.98]"
            >
              Preguntas
            </h2>
            <div className="mt-10 border-t border-[var(--tinta)]/30">
              {FAQS.map((f) => (
                <details key={f.q} className="group border-b border-[var(--papel-2)]">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[1.0625rem] font-medium [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span
                      aria-hidden
                      className="text-[1.5rem] leading-none font-light text-[var(--oro-tinta)] transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="pb-6 text-[0.9375rem] leading-relaxed text-[var(--grafito)]">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>

          <div id="pedir" className="scroll-mt-6">
            <h2 className="v-display text-[clamp(2.4rem,4.4vw,3.75rem)] leading-[0.98]">
              Pedid la vuestra
            </h2>
            <p className="mt-4 text-[1.0625rem] text-[var(--grafito)]">
              Dejadnos vuestros datos y os escribimos para empezar.
            </p>
            <div className="mt-10 rounded-[6px] border-t-[3px] border-[var(--lacre)] bg-white p-6 shadow-[0_30px_60px_-40px_rgb(27_32_51/0.45)] sm:p-8">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="v-ink">
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
            <Link href="/ejemplos" className="v-link">
              Ver todos los ejemplos
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
