import { clsx } from "clsx";

/** Distintivo visible en todas las pantallas: los datos y acciones son de demostración. */
export function DemoBadge({
  className,
  tone = "light",
  label = "Demo con datos ficticios",
}: {
  className?: string;
  tone?: "light" | "dark";
  label?: string;
}) {
  return (
    <span
      className={clsx(
        "pointer-events-none inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.75rem] leading-none",
        tone === "light"
          ? "bg-paper/85 text-ink-soft ring-1 ring-ink/10 backdrop-blur"
          : "bg-black/30 text-white/85 ring-1 ring-white/20 backdrop-blur",
        className,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-gold" />
      {label}
    </span>
  );
}
