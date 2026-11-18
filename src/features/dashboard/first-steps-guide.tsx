import { clsx } from "clsx";
import { Check } from "lucide-react";
import Link from "next/link";
import type { FirstStep } from "@/lib/events/first-steps";

/**
 * Guía de primeros pasos de un evento recién creado. Los pasos van en orden y el siguiente por
 * hacer se destaca; los hechos quedan marcados. La página decide si se enseña.
 */
export function FirstStepsGuide({
  steps,
  hrefs,
  welcome = false,
  className,
}: {
  steps: FirstStep[];
  /** Adónde lleva cada destino del paso. */
  hrefs: Record<FirstStep["target"], string>;
  /** Recién creado: se le da la bienvenida. */
  welcome?: boolean;
  className?: string;
}) {
  const doneCount = steps.filter((s) => s.done).length;
  const next = steps.find((s) => !s.done)?.id;

  return (
    <section
      aria-labelledby="primeros-pasos"
      className={clsx(
        "rounded-2xl border border-line bg-paper px-5 py-6 shadow-[var(--shadow-paper)] sm:px-7 sm:py-7",
        className,
      )}
    >
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div>
          <h2 id="primeros-pasos" className="panel-title text-[2rem] leading-none text-ink">
            Primeros pasos
          </h2>
          <p className="mt-2 max-w-[60ch] text-[0.9375rem] text-ink-soft">
            {welcome
              ? "Vuestro evento ya está creado. Con estos cuatro pasos, la invitación estará lista para enviar."
              : "Lo que falta para que la invitación esté lista para enviar. Esta guía desaparece cuando esté todo."}
          </p>
        </div>
        <p className="text-[0.875rem] text-muted tabular-nums">
          {doneCount} de {steps.length} hechos
        </p>
      </div>

      <ol className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {steps.map((step, i) => {
          const current = step.id === next;
          return (
            <li
              key={step.id}
              aria-current={current ? "step" : undefined}
              className={clsx(
                "flex flex-col rounded-xl border p-5",
                current ? "panel-dark border-transparent" : "border-line bg-ivory/60",
              )}
            >
              <p className="flex items-center gap-3">
                <span
                  aria-hidden
                  className={clsx(
                    "grid size-8 shrink-0 place-items-center rounded-full font-display text-[1.0625rem] lining-nums",
                    step.done
                      ? "bg-success text-white"
                      : current
                        ? "bg-gold text-[#3a2a22]"
                        : "border border-line text-ink-soft",
                  )}
                >
                  {step.done ? <Check className="size-4" strokeWidth={2.5} /> : i + 1}
                </span>
                <span
                  className={clsx(
                    "font-display text-[1.25rem] leading-tight",
                    step.done ? "text-ink-soft" : "text-ink",
                  )}
                >
                  {step.title}
                </span>
              </p>
              <p className="mt-2 flex-1 text-[0.875rem] leading-relaxed text-ink-soft">
                {step.done ? "Hecho." : step.detail}
              </p>
              {step.done ? null : (
                <Link
                  href={hrefs[step.target]}
                  className={clsx(
                    "mt-4 inline-flex h-11 items-center self-start rounded-full px-5 text-[0.9375rem] transition-colors",
                    current
                      ? "bg-[#f7efe9] font-medium text-[#3a2a22] hover:bg-white"
                      : "border border-line text-ink hover:border-ink",
                  )}
                >
                  {step.action}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
