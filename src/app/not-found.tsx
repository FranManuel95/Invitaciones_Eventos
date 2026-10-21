import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { Emblem } from "@/features/invitation/ornaments";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-6 text-center">
      <div>
        <Emblem className="mx-auto size-10 text-gold" />
        <h1 className="mt-6 font-display text-4xl text-ink">No encontramos esta invitación</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted">
          Revisa que el enlace esté completo. Si el problema continúa, escribe a quien te envió la
          invitación.
        </p>
        <Link href="/" className={buttonClasses("secondary", "md", "mt-8")}>
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
