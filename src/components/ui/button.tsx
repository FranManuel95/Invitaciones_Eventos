import { clsx } from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "light";
type Size = "md" | "lg" | "sm";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-paper hover:bg-ink-soft active:bg-ink disabled:bg-ink/40 shadow-[0_1px_0_rgb(255_255_255/0.08)_inset]",
  secondary:
    "border border-ink/20 bg-paper text-ink hover:border-ink/40 hover:bg-white disabled:text-ink/40",
  ghost: "text-ink hover:bg-ink/5 disabled:text-ink/40",
  light: "border border-white/40 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[0.8125rem]",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-[0.9375rem]",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return clsx(
    "inline-flex items-center justify-center gap-2 rounded-md font-medium tracking-wide transition-colors duration-200 select-none disabled:cursor-not-allowed",
    variants[variant],
    sizes[size],
    className,
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

export function Button({ variant, size, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClasses(variant, size, className)} {...props} />;
}
