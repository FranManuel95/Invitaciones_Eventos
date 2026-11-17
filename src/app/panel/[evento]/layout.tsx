import { hostNames } from "@/lib/event-kind";
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { DemoBadge } from "@/components/demo-badge";
import { MobileNav, SidebarNav } from "@/features/dashboard/panel-nav";
import { Monogram } from "@/features/invitation/ornaments";
import { formatLongDate } from "@/lib/format";
import { loadOrganizer } from "./load";
import "./panel.css";

export const metadata: Metadata = {
  title: { default: "Panel", template: "%s | Panel" },
};

// La barra del navegador del móvil, del color de la barra del panel.
export const viewport: Viewport = { themeColor: "#1b2033" };

export default async function PanelLayout(props: LayoutProps<"/panel/[evento]">) {
  const { event, base, isDemo, meta } = await loadOrganizer(props.params);

  const brand = (
    <Link href={base} className="flex min-w-0 items-center gap-3">
      <Monogram
        first={event.couple.first}
        second={event.couple.second}
        className="size-10 shrink-0 text-gold"
      />
      <span className="min-w-0">
        <span translate="no" className="panel-title block truncate text-[1.5rem] leading-none">
          {hostNames(event.couple)}
        </span>
        <span className="mt-1 block text-[0.8125rem] text-muted">{formatLongDate(event.date)}</span>
      </span>
    </Link>
  );

  const extra = isDemo ? (
    <div className="space-y-3">
      <Link
        href="/i/familia-garcia"
        className="block text-[0.875rem] text-ink-soft underline decoration-gold underline-offset-4 hover:text-ink"
      >
        Ver una invitación de ejemplo
      </Link>
      <DemoBadge tone="dark" />
    </div>
  ) : (
    <div className="space-y-3">
      <p className="flex items-center gap-2 text-[0.8125rem] text-muted">
        <span
          aria-hidden
          className={`size-2 rounded-full ${meta?.status === "published" ? "bg-[#7fc49a]" : "bg-gold"}`}
        />
        {meta?.status === "published" ? "Invitación publicada" : "Borrador sin publicar"}
      </p>
      <Link
        href="/panel"
        className="block text-[0.875rem] text-ink-soft underline decoration-gold underline-offset-4 hover:text-ink"
      >
        Mis eventos
      </Link>
    </div>
  );

  return (
    <div className="panel min-h-dvh lg:grid lg:grid-cols-[17rem_minmax(0,1fr)] print:block">
      <a
        href="#contenido"
        className="sr-only-focusable fixed top-2 left-2 z-50 rounded-md bg-ink px-4 py-2 text-sm text-paper"
      >
        Saltar al contenido
      </a>

      {/* Escritorio: el menú, sobre la tinta, fijo mientras se baja. */}
      <aside className="panel-dark hidden lg:block print:hidden">
        <div className="sticky top-0 flex h-dvh flex-col gap-8 overflow-y-auto px-4 py-6">
          <div className="px-2">{brand}</div>
          <SidebarNav base={base} />
          <div className="mt-auto px-3">{extra}</div>
          <p className="px-3 text-[0.75rem] text-muted">
            <span className="panel-title text-[1.125rem] text-ink-soft">eFeLe</span> Invitaciones
          </p>
        </div>
      </aside>

      {/* Móvil: arriba, solo quién y cuándo; abajo, la navegación. */}
      <header className="panel-dark sticky top-0 z-30 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 lg:hidden print:hidden">
        <div className="flex items-center justify-between gap-3">
          {brand}
          {isDemo ? <DemoBadge tone="dark" label="Demo" /> : null}
        </div>
      </header>
      <MobileNav base={base} footer={extra} />

      <main
        id="contenido"
        tabIndex={-1}
        className="min-w-0 px-4 pt-6 pb-28 outline-none sm:px-6 lg:px-12 lg:pt-10 lg:pb-16 print:p-0"
      >
        <div className="mx-auto max-w-6xl">{props.children}</div>
      </main>
    </div>
  );
}
