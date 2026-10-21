import type { Metadata } from "next";
import Link from "next/link";
import { DemoBadge } from "@/components/demo-badge";
import { SidebarNav, TopNav } from "@/features/dashboard/panel-nav";
import { Monogram } from "@/features/invitation/ornaments";
import { formatLongDate } from "@/lib/format";
import { loadOrganizer } from "./load";

export const metadata: Metadata = {
  title: { default: "Panel", template: "%s | Panel" },
};

export default async function PanelLayout(props: LayoutProps<"/panel/[evento]">) {
  const { event, base, isDemo, meta } = await loadOrganizer(props.params);
  const brand = (
    <Link href={base} className="flex items-center gap-2.5">
      <Monogram
        first={event.couple.first}
        second={event.couple.second}
        className="size-9 text-gold"
      />
      <span>
        <span translate="no" className="block font-display text-xl leading-none text-ink">
          {event.couple.first} &amp; {event.couple.second}
        </span>
        <span className="mt-1 block text-[0.8125rem] text-muted">{formatLongDate(event.date)}</span>
      </span>
    </Link>
  );

  return (
    <div className="min-h-dvh bg-ivory lg:grid lg:grid-cols-[15.5rem_1fr] print:block print:bg-white">
      <a
        href="#contenido"
        className="sr-only-focusable fixed top-2 left-2 z-50 rounded-md bg-ink px-4 py-2 text-sm text-paper"
      >
        Saltar al contenido
      </a>
      <aside className="hidden border-r border-line bg-paper/70 lg:flex lg:flex-col lg:gap-8 lg:px-4 lg:py-6 print:hidden">
        <div className="px-2">{brand}</div>
        <SidebarNav base={base} />
        <div className="mt-auto space-y-4 px-2">
          {isDemo ? (
            <Link
              href="/i/familia-garcia"
              className="block text-[0.875rem] text-ink-soft underline decoration-gold underline-offset-4 hover:text-ink hover:decoration-ink"
            >
              Ver una invitación de ejemplo
            </Link>
          ) : (
            <>
              <p className="text-[0.8125rem] text-muted">
                {meta?.status === "published" ? "Publicada" : "Borrador sin publicar"}
              </p>
              <Link
                href="/panel"
                className="block text-[0.875rem] text-ink-soft underline decoration-gold underline-offset-4 hover:text-ink hover:decoration-ink"
              >
                Mis eventos
              </Link>
            </>
          )}
          {isDemo ? <DemoBadge /> : null}
        </div>
      </aside>

      <header className="sticky top-0 z-30 border-b border-line bg-ivory/90 px-4 pt-4 pb-3 backdrop-blur-md lg:hidden print:hidden">
        <div className="mb-3 flex items-center justify-between gap-3">
          {brand}
          {isDemo ? <DemoBadge /> : null}
        </div>
        <TopNav base={base} />
      </header>

      <main
        id="contenido"
        tabIndex={-1}
        className="min-w-0 px-4 py-6 outline-none sm:px-6 lg:px-10 lg:py-9"
      >
        {props.children}
      </main>
    </div>
  );
}
