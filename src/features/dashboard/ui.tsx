import { clsx } from "clsx";
import { Check, Clock, X } from "lucide-react";
import type { ReactNode } from "react";
import type { AttendanceStatus, MenuId } from "@/lib/domain/types";

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
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow ? <p className="eyebrow text-muted">{eyebrow}</p> : null}
        <h1 className="mt-1 font-display text-[2.25rem] leading-tight text-ink">{title}</h1>
        {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
      </div>
      {actions}
    </header>
  );
}

export function Card({
  title,
  icon,
  action,
  children,
  className,
}: {
  title?: string;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={clsx("min-w-0 rounded-xl border border-line bg-paper p-5 sm:p-6", className)}
      aria-label={title}
    >
      {title ? (
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-ink">
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

export function Kpi({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: ReactNode;
  detail?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-line bg-paper p-5">
      <p className="flex items-center gap-2 text-[0.8125rem] text-muted">
        {icon}
        {label}
      </p>
      <p className="mt-2 font-display text-[2.5rem] leading-none text-ink lining-nums tabular-nums">
        {value}
      </p>
      {detail ? <p className="mt-2 text-xs text-muted">{detail}</p> : null}
    </div>
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
