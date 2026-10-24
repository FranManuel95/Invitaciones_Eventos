import { clsx } from "clsx";
import { Check, Clock, Eye, EyeOff, X } from "lucide-react";
import type { ReactNode } from "react";
import type { AttendanceStatus, MenuId } from "@/lib/domain/types";
import { formatNumericDate } from "@/lib/format";

/** Colores categóricos de menús, validados para daltonismo y contraste (ver docs/DECISIONS.md). */
export const MENU_COLORS: Record<MenuId, string> = {
  carne: "#b8752e",
  pescado: "#3f74b0",
  vegano: "#a2556e",
  vegetariano: "#6f9142",
  infantil: "#7a6cb0",
};
export const MENU_ORDER: MenuId[] = ["carne", "pescado", "vegano", "vegetariano", "infantil"];

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="font-display text-[2.5rem] leading-[1.05] text-ink">{title}</h1>
        {description ? (
          <p className="mt-2 max-w-[60ch] text-[0.9375rem] text-muted">{description}</p>
        ) : null}
      </div>
      {actions}
    </header>
  );
}

/**
 * Bloque del panel. «surface» es una hoja de papel para datos interactivos (gráficos, tablas);
 * «ruled» es una sección abierta separada por un filete, para resúmenes y listas.
 */
export function Card({
  title,
  icon,
  action,
  children,
  className,
  variant = "surface",
}: {
  title?: string;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  variant?: "surface" | "ruled";
}) {
  return (
    <section
      className={clsx(
        "min-w-0",
        variant === "surface"
          ? "rounded-[3px] border border-line bg-paper p-5 sm:p-6"
          : "border-t border-ink/25 pt-4",
        className,
      )}
      aria-label={title}
    >
      {title ? (
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-[0.9375rem] font-medium text-ink">
            {icon}
            {title}
          </h2>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}

const STATUS: Record<AttendanceStatus, { label: string; icon: typeof Check; className: string }> = {
  attending: { label: "Confirmado", icon: Check, className: "bg-success/10 text-success" },
  pending: { label: "Pendiente", icon: Clock, className: "bg-warning/10 text-warning" },
  declined: { label: "No asiste", icon: X, className: "bg-danger/10 text-danger" },
};

/** Si una invitación sin respuesta se ha abierto ya (texto e icono, nunca solo color). */
export function OpenedBadge({ openedAt }: { openedAt: string | null | undefined }) {
  return openedAt ? (
    <span className="inline-flex items-center gap-1 text-xs text-ink-soft">
      <Eye aria-hidden className="size-3" />
      Abierta el {formatNumericDate(openedAt)}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs text-muted">
      <EyeOff aria-hidden className="size-3" />
      Sin abrir
    </span>
  );
}

/** Estado con icono y texto: nunca solo color. */
export function StatusBadge({ status }: { status: AttendanceStatus }) {
  const { label, icon: Icon, className } = STATUS[status];
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        className,
      )}
    >
      <Icon aria-hidden className="size-3" strokeWidth={2.5} />
      {label}
    </span>
  );
}

export function MenuDot({ menu }: { menu: MenuId }) {
  return (
    <span
      aria-hidden
      className="inline-block size-2 shrink-0 rounded-full"
      style={{ backgroundColor: MENU_COLORS[menu] }}
    />
  );
}

/** Banda de métricas: una sola pieza dividida por filetes, no una tarjeta por número. */
export function KpiStrip({
  items,
}: {
  items: { label: string; value: ReactNode; detail?: ReactNode }[];
}) {
  return (
    <dl className="grid grid-cols-2 border-y border-ink/25 xl:grid-cols-4">
      {items.map((item, i) => (
        <div
          key={item.label}
          className={clsx(
            "px-1 py-5 sm:px-5",
            i % 2 === 1 && "border-l border-line pl-4",
            i >= 2 && "border-t border-line xl:border-t-0",
            i >= 1 && "xl:border-l xl:border-line xl:pl-5",
          )}
        >
          <dt className="text-[0.875rem] text-muted">{item.label}</dt>
          <dd className="mt-1 font-display text-[2.75rem] leading-none text-ink lining-nums tabular-nums">
            {item.value}
          </dd>
          {item.detail ? <dd className="mt-2 text-[0.8125rem] text-muted">{item.detail}</dd> : null}
        </div>
      ))}
    </dl>
  );
}

export function Meter({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = max ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div
      role="meter"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-label={label}
      className="h-1.5 w-full overflow-hidden rounded-full bg-ink/[0.07]"
    >
      <div
        className={clsx("h-full rounded-full", pct >= 90 ? "bg-warning" : "bg-ink")}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
