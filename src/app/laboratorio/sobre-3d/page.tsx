import type { Metadata } from "next";
import Link from "next/link";
import { DemoBadge } from "@/components/demo-badge";
import { EnvelopeLab } from "@/features/lab/envelope-lab";
import { getEvent } from "@/lib/data/repository";
import { formatLongDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Sobre 3D (laboratorio)",
  robots: { index: false },
};

export default async function SobreTresDe() {
  const event = await getEvent();
  return (
    <main className="min-h-dvh bg-ivory">
      <div className="mx-auto max-w-5xl px-4 pt-8 pb-16 sm:px-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="text-[0.9375rem] text-ink-soft underline decoration-gold underline-offset-4 hover:text-ink"
          >
            Volver a la demo
          </Link>
          <DemoBadge />
        </div>
        <h1 className="mt-10 font-display text-[clamp(2.25rem,6vw,3.5rem)] leading-[1.02] text-ink">
          Sobre 3D con WebGL
        </h1>
        <p className="mt-4 mb-8 max-w-[60ch] text-[1.0625rem] leading-relaxed text-ink-soft">
          Prototipo para comparar con el sobre de la invitación. Usa luces y sombras reales, papel
          con relieve y un lacre que se rompe en pedazos. Mueve el dedo o el ratón para inclinarlo.
        </p>
        <EnvelopeLab
          names={`${event.couple.first} & ${event.couple.second}`}
          date={formatLongDate(event.date)}
          place={`${event.city}, ${event.region}`}
        />
        <p className="mt-10 max-w-[60ch] text-[0.9375rem] leading-relaxed text-muted">
          Compáralo con{" "}
          <Link
            href="/i/familia-garcia"
            className="text-ink underline decoration-gold underline-offset-4"
          >
            el sobre de la invitación
          </Link>
          , hecho con CSS: pesa mucho menos y funciona en cualquier móvil.
        </p>
      </div>
    </main>
  );
}
