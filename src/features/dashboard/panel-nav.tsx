"use client";

import { clsx } from "clsx";
import {
  Bus,
  CalendarCheck,
  ClipboardList,
  Gift,
  Home,
  Images,
  LayoutGrid,
  Mail,
  MessageSquareHeart,
  MoreHorizontal,
  Printer,
  Send,
  Settings,
  Users,
  UtensilsCrossed,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

type Item = { path: string; label: string; icon: LucideIcon };

/** Las secciones, agrupadas por lo que se hace en cada una. */
const GROUPS: { title: string | null; items: Item[] }[] = [
  { title: null, items: [{ path: "", label: "Inicio", icon: Home }] },
  {
    title: "Invitados",
    items: [
      { path: "/invitaciones", label: "Invitaciones", icon: Mail },
      { path: "/invitados", label: "Lista de invitados", icon: Users },
      { path: "/comunicaciones", label: "Recordatorios", icon: Send },
      { path: "/mensajes", label: "Libro de firmas", icon: MessageSquareHeart },
      { path: "/regalos", label: "Regalos", icon: Gift },
      { path: "/album", label: "Álbum", icon: Images },
    ],
  },
  {
    title: "El día",
    items: [
      { path: "/mesas", label: "Mesas", icon: LayoutGrid },
      { path: "/menus", label: "Menús y alergias", icon: UtensilsCrossed },
      { path: "/transporte", label: "Transporte", icon: Bus },
      { path: "/imprimir", label: "Imprimir", icon: Printer },
    ],
  },
  {
    title: "Organización",
    items: [
      { path: "/tareas", label: "Tareas", icon: ClipboardList },
      { path: "/presupuesto", label: "Presupuesto", icon: Wallet },
      { path: "/agenda", label: "Agenda", icon: CalendarCheck },
      { path: "/ajustes", label: "Ajustes", icon: Settings },
    ],
  },
];

/** Lo que más se usa, en la barra inferior del móvil. El resto, en «Más». */
const BOTTOM: Item[] = [
  { path: "", label: "Inicio", icon: Home },
  { path: "/invitaciones", label: "Invitaciones", icon: Mail },
  { path: "/invitados", label: "Invitados", icon: Users },
  { path: "/mesas", label: "Mesas", icon: LayoutGrid },
];

/** `base` es la raíz del evento: /panel/demo o /panel/<id>. */
function useIsActive(base: string) {
  const pathname = usePathname();
  return (path: string) => {
    const href = base + path;
    return path === "" ? pathname === href : pathname.startsWith(href);
  };
}

function Groups({ base, onNavigate }: { base: string; onNavigate?: () => void }) {
  const isActive = useIsActive(base);
  return (
    <>
      {GROUPS.map((group) => {
        const id = group.title ? `nav-${group.title.toLowerCase().replace(/\s+/g, "-")}` : null;
        return (
          <div key={group.title ?? "inicio"} className={group.title ? "mt-7" : undefined}>
            {group.title ? (
              <p id={id!} className="mb-1.5 px-3 text-[0.8125rem] text-muted">
                {group.title}
              </p>
            ) : null}
            <ul className="space-y-0.5" aria-labelledby={id ?? undefined}>
              {group.items.map(({ path, label, icon: Icon }) => {
                const active = isActive(path);
                return (
                  <li key={path}>
                    <Link
                      href={base + path}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={clsx(
                        "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[0.9375rem] transition-colors",
                        active
                          ? "bg-paper font-medium text-ink before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:rounded-full before:bg-gold"
                          : "text-ink-soft hover:bg-paper/60 hover:text-ink",
                      )}
                    >
                      <Icon
                        aria-hidden
                        className={clsx("size-[1.125rem]", active && "text-gold")}
                        strokeWidth={1.75}
                      />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </>
  );
}

/** Navegación lateral (escritorio). */
export function SidebarNav({ base }: { base: string }) {
  return (
    <nav aria-label="Panel">
      <Groups base={base} />
    </nav>
  );
}

/**
 * Navegación del móvil: una barra abajo con lo más usado y «Más», que abre todas las secciones
 * en una hoja (un <dialog> nativo: atrapa el foco y se cierra con Escape).
 */
export function MobileNav({ base, footer }: { base: string; footer?: ReactNode }) {
  const isActive = useIsActive(base);
  const pathname = usePathname();
  const sheet = useRef<HTMLDialogElement>(null);
  const inBottom = BOTTOM.some((item) => isActive(item.path));

  // Al cambiar de página, la hoja se cierra.
  useEffect(() => {
    sheet.current?.close();
  }, [pathname]);

  const tab =
    "flex min-w-0 flex-1 flex-col items-center gap-1 rounded-lg py-2 text-[0.6875rem] transition-colors";

  return (
    <>
      <nav
        aria-label="Panel"
        className="panel-dark fixed inset-x-0 bottom-0 z-40 border-t border-line px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:hidden print:hidden"
      >
        <ul className="flex gap-1">
          {BOTTOM.map(({ path, label, icon: Icon }) => {
            const active = isActive(path);
            return (
              <li key={path} className="flex min-w-0 flex-1">
                <Link
                  href={base + path}
                  aria-current={active ? "page" : undefined}
                  className={clsx(tab, active ? "text-ink" : "text-muted hover:text-ink")}
                >
                  <Icon
                    aria-hidden
                    className={clsx("size-5", active && "text-gold")}
                    strokeWidth={1.75}
                  />
                  <span className="truncate">{label}</span>
                </Link>
              </li>
            );
          })}
          <li className="flex min-w-0 flex-1">
            <button
              type="button"
              onClick={() => sheet.current?.showModal()}
              aria-haspopup="dialog"
              className={clsx(tab, !inBottom ? "text-ink" : "text-muted hover:text-ink")}
            >
              <MoreHorizontal
                aria-hidden
                className={clsx("size-5", !inBottom && "text-gold")}
                strokeWidth={1.75}
              />
              Más
            </button>
          </li>
        </ul>
      </nav>

      <dialog
        ref={sheet}
        aria-label="Todas las secciones"
        className="panel-sheet"
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
      >
        <div className="panel-sheet-body panel-dark absolute inset-x-0 bottom-0 max-h-[88svh] overflow-y-auto rounded-t-2xl px-4 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <div className="flex items-center justify-between px-3 pb-2">
            <p className="panel-title text-[1.75rem] leading-none">Secciones</p>
            <button
              type="button"
              onClick={() => sheet.current?.close()}
              aria-label="Cerrar"
              className="grid size-10 place-items-center rounded-full text-ink-soft hover:bg-paper"
            >
              <X aria-hidden className="size-5" />
            </button>
          </div>
          <nav aria-label="Todas las secciones">
            <Groups base={base} onNavigate={() => sheet.current?.close()} />
          </nav>
          {footer ? <div className="mt-6 border-t border-line px-3 pt-4">{footer}</div> : null}
        </div>
      </dialog>
    </>
  );
}
