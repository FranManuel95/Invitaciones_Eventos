import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { DemoBadge } from "@/components/demo-badge";
import { SidebarNav, TopNav } from "@/features/dashboard/panel-nav";
import { Emblem } from "@/features/invitation/ornaments";
import { getEvent } from "@/lib/data/repository";

export const metadata: Metadata = {
  title: { default: "Panel", template: "%s · Panel" },
};

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const event = await getEvent();
  const brand = (
    <Link href="/panel" className="flex items-center gap-2.5">
      <Emblem className="size-7 text-gold" />
      <span>
        <span className="block font-display text-lg leading-none text-ink">
          {event.couple.first} <span className="italic">&amp;</span> {event.couple.second}
        </span>
        <span className="mt-1 block text-[0.6875rem] tracking-[0.2em] text-muted">
          {event.dateLabel}
        </span>
      </span>
    </Link>
  );

  return (
    <div className="min-h-dvh bg-ivory lg:grid lg:grid-cols-[15.5rem_1fr]">
      <aside className="hidden border-r border-line bg-paper/70 lg:flex lg:flex-col lg:gap-8 lg:px-4 lg:py-6">
        <div className="px-2">{brand}</div>
        <SidebarNav />
        <div className="mt-auto space-y-4 px-2">
          <Link
            href="/i/familia-garcia"
            className="flex items-center gap-2 text-[0.8125rem] text-ink-soft underline decoration-ink/20 underline-offset-4 hover:text-ink"
          >
            Ver invitación de ejemplo <ExternalLink aria-hidden className="size-3.5" />
          </Link>
          <DemoBadge />
        </div>
      </aside>

      <header className="sticky top-0 z-30 border-b border-line bg-ivory/90 px-4 pt-4 pb-3 backdrop-blur-md lg:hidden">
        <div className="mb-3 flex items-center justify-between gap-3">
          {brand}
          <DemoBadge />
        </div>
        <TopNav />
      </header>

      <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-10 lg:py-9">{children}</main>
    </div>
  );
}
