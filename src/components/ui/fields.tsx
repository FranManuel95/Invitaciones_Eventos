import { clsx } from "clsx";
import { Check, Minus, Plus } from "lucide-react";
import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

/** Mensaje de error asociado a un control mediante aria-describedby. */
export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-2 text-[0.8125rem] font-medium text-danger">
      {message}
    </p>
  );
}

interface ChoiceCardProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: ReactNode;
  description?: ReactNode;
  type?: "radio" | "checkbox";
}

/** Opción grande tipo tarjeta (radio o checkbox nativo, accesible con teclado). */
export function ChoiceCard({
  label,
  description,
  type = "radio",
  className,
  ...props
}: ChoiceCardProps) {
  return (
    <label
      className={clsx(
        "group relative flex cursor-pointer items-center gap-3 rounded-lg border border-line bg-paper px-4 py-3.5 transition-colors",
        "hover:border-ink/30 has-[:checked]:border-ink has-[:checked]:bg-white has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ink has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-ivory",
        className,
      )}
    >
      <input type={type} className="peer sr-only" {...props} />
      <span
        aria-hidden
        className={clsx(
          "grid size-[1.125rem] shrink-0 place-items-center border border-ink/35 transition-colors peer-checked:border-ink peer-checked:bg-ink",
          type === "radio" ? "rounded-full" : "rounded-[4px]",
        )}
      >
        {type === "radio" ? (
          <span className="size-1.5 rounded-full bg-paper" />
        ) : (
          <Check className="size-3 text-paper" strokeWidth={3} />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[0.9375rem] font-medium text-ink">{label}</span>
        {description ? (
          <span className="mt-0.5 block text-[0.8125rem] text-muted">{description}</span>
        ) : null}
      </span>
    </label>
  );
}

/** Ficha conmutable pequeña (alergias). */
export function CheckChip({
  label,
  className,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { label: string }) {
  return (
    <label
      className={clsx(
        "inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 text-[0.8125rem] text-ink-soft transition-colors",
        "hover:border-ink/30 has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-paper has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ink has-[:focus-visible]:ring-offset-2",
        className,
      )}
    >
      <input type="checkbox" className="sr-only" {...props} />
      {label}
    </label>
  );
}

const inputBase =
  "w-full rounded-md border border-line bg-paper px-3.5 text-[0.9375rem] text-ink placeholder:text-stone transition-colors hover:border-ink/30 focus:border-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/20 aria-[invalid=true]:border-danger";

export function TextInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={clsx(inputBase, "h-11", className)} {...props} />;
}

export function TextArea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={clsx(inputBase, "min-h-24 resize-y py-3 leading-relaxed", className)}
      {...props}
    />
  );
}

/** Contador accesible con botones +/−. */
export function Counter({
  value,
  min,
  max,
  onChange,
  label,
  id,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  label: string;
  id: string;
}) {
  return (
    <div className="inline-flex items-center gap-4" role="group" aria-labelledby={`${id}-label`}>
      <span id={`${id}-label`} className="sr-only">
        {label}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={`Quitar una (${label})`}
        className="grid size-9 place-items-center rounded-full border border-ink/20 text-ink transition-colors hover:border-ink disabled:opacity-30"
      >
        <Minus className="size-4" />
      </button>
      <output
        id={id}
        aria-live="polite"
        className="min-w-6 text-center font-display text-2xl text-ink"
      >
        {value}
      </output>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={`Añadir una (${label})`}
        className="grid size-9 place-items-center rounded-full border border-ink/20 text-ink transition-colors hover:border-ink disabled:opacity-30"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
