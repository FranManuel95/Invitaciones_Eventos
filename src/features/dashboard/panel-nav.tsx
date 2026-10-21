"use client";

import { clsx } from "clsx";
import {
  Bus,
  CalendarCheck,
  ClipboardList,
  Home,
  LayoutGrid,
  Mail,
  Send,
  Settings,
  Users,
  UtensilsCrossed,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS: { path: string; label: string; icon: LucideIcon }[] = [
  { path: "", label: "Inicio", icon: Home },
  { path: "/invitaciones", label: "Invitaciones", icon: Mail },
  { path: "/invitados", label: "Invitados", icon: Users },
  { path: "/transporte", label: "Transporte", icon: Bus },
  { path: "/menus", label: "Menús", icon: UtensilsCrossed },
  { path: "/mesas", label: "Mesas", icon: LayoutGrid },
  { path: "/comunicaciones", label: "Recordatorios", icon: Send },
];

const SOON: { label: string; icon: LucideIcon }[] = [
  { label: "Tareas", icon: ClipboardList },
  { label: "Presupuesto", icon: Wallet },
  { label: "Agenda", icon: CalendarCheck },
  { label: "Ajustes", icon: Settings },
];

const itemsFor = (base: string) => ITEMS.map((item) => ({ ...item, href: base + item.path }));

/** `base` es la raíz del evento: /panel/demo o /panel/<id>. */
function useIsActive(base: string) {
  const pathname = usePathname();
  return (href: string) => (href === base ? pathname === href : pathname.startsWith(href));
}

/** Navegación lateral (escritorio). */
export function SidebarNav({ base }: { base: string }) {
  const isActive = useIsActive(base);
  return (
    <nav aria-label="Panel">
      <ul className="space-y-0.5">
        {itemsFor(base).map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              className={clsx(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive(href)
                  ? "bg-ink/[0.06] font-semibold text-ink"
                  : "text-ink-soft hover:bg-ink/[0.04] hover:text-ink",
              )}
            >
              <Icon aria-hidden className="size-4" strokeWidth={1.75} />
              {label}
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-8 px-3 text-[0.8125rem] text-muted">Próximamente</p>
      <ul className="mt-2 space-y-0.5" aria-label="Módulos en preparación">
        {SOON.map(({ label, icon: Icon }) => (
          <li key={label} className="flex items-center gap-3 px-3 py-2 text-sm text-muted">
            <Icon aria-hidden className="size-4" strokeWidth={1.75} />
            {label}
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Navegación compacta desplazable (móvil y tableta). */
export function TopNav({ base }: { base: string }) {
  const isActive = useIsActive(base);
  return (
    <nav aria-label="Panel" className="-mx-4 [scrollbar-width:none] overflow-x-auto px-4">
      <ul className="flex gap-1">
        {itemsFor(base).map(({ href, label, icon: Icon }) => (
          <li key={href} className="shrink-0">
            <Link
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              className={clsx(
                "flex items-center gap-2 rounded-full px-3.5 py-2 text-[0.8125rem] transition-colors",
                isActive(href) ? "bg-ink text-paper" : "text-ink-soft hover:bg-ink/5",
              )}
            >
              <Icon aria-hidden className="size-3.5" strokeWidth={1.75} />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
