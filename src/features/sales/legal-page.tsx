import Link from "next/link";
import type { ReactNode } from "react";
import type { LegalInfo } from "@/lib/site";

/** Dato del titular o, si falta en la configuración, un hueco marcado para completarlo. */
export function Datum({
  info,
  field,
  label,
}: {
  info: LegalInfo;
  field: keyof LegalInfo;
  label: string;
}) {
  const value = info[field];
  if (value) return <>{value}</>;
  return <mark className="rounded-sm bg-warning/15 px-1 text-warning">[pendiente: {label}]</mark>;
}

const linkClass =
  "text-[0.9375rem] text-ink-soft underline decoration-gold underline-offset-4 hover:text-ink hover:decoration-ink";

/** Página de texto legal con la cabecera y el pie de la página de venta. */
export function LegalPage({
  title,
  updated,
  complete,
  children,
}: {
  title: string;
  /** Fecha de la última revisión, en texto («22 de octubre de 2026»). */
  updated: string;
  complete: boolean;
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-paper">
      <header className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 pt-6 sm:px-10">
        <Link href="/" className="font-display text-[1.375rem] text-ink">
          Invitaciones
        </Link>
        <Link href="/#pedir" className={linkClass}>
          Pedir la vuestra
        </Link>
      </header>
      <main className="mx-auto max-w-3xl px-6 pt-14 pb-20 sm:px-10">
        <h1 className="font-display text-[clamp(2.5rem,6vw,3.5rem)] leading-[1.05] text-ink">
          {title}
        </h1>
        <p className="mt-3 text-[0.875rem] text-muted">Última revisión: {updated}.</p>
        {complete ? null : (
          <p className="mt-6 rounded-[3px] border border-warning/40 bg-warning/10 p-4 text-[0.9375rem] text-warning">
            Texto en preparación: faltan los datos del titular (marcados abajo).
          </p>
        )}
        <div className="legal mt-10 grid gap-8 text-[1rem] leading-relaxed text-ink-soft">
          {children}
        </div>
      </main>
      <footer className="border-t border-line">
        <nav
          aria-label="Textos legales"
          className="mx-auto flex max-w-3xl flex-wrap gap-x-6 gap-y-2 px-6 py-8 sm:px-10"
        >
          <Link href="/aviso-legal" className={linkClass}>
            Aviso legal
          </Link>
          <Link href="/privacidad" className={linkClass}>
            Privacidad
          </Link>
          <Link href="/" className={linkClass}>
            Volver al inicio
          </Link>
        </nav>
      </footer>
    </div>
  );
}

/** Apartado con título dentro de un texto legal. */
export function Clause({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="grid gap-3">
      <h2 className="font-display text-[1.625rem] leading-tight text-ink">{title}</h2>
      {children}
    </section>
  );
}
