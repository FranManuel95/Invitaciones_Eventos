"use client";

import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/fields";
import { createBrowserSupabase } from "@/lib/supabase/browser";

type Mode = "entrar" | "crear";

/** Acceso de los novios u organizadores: email y contraseña (Supabase Auth). */
export function LoginForm({ next, signup = true }: { next: string; signup?: boolean }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("entrar");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{ tone: "error" | "ok"; text: string } | null>(null);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const supabase = createBrowserSupabase();
    if (!supabase) {
      setMessage({ tone: "error", text: "El acceso no está configurado en este entorno." });
      return;
    }
    setBusy(true);
    setMessage(null);
    if (mode === "entrar") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) {
        setMessage({
          tone: "error",
          text: error.message.includes("not confirmed")
            ? "Falta confirmar el email: abrid el enlace que os enviamos y volved a intentarlo."
            : "Email o contraseña incorrectos.",
        });
        return;
      }
      router.replace(next);
      router.refresh();
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/confirmar` },
      });
      setBusy(false);
      if (error) {
        setMessage({
          tone: "error",
          text:
            error.message.includes("Password") || error.message.includes("password")
              ? "La contraseña debe tener al menos 8 caracteres."
              : "No hemos podido crear la cuenta. Revisad el email y volved a intentarlo.",
        });
        return;
      }
      setMessage({
        tone: "ok",
        text: "Os hemos enviado un email. Abrid el enlace para confirmar la cuenta y después entrad aquí.",
      });
      setMode("entrar");
    }
  };

  return (
    <div>
      <h2 className="panel-title mb-6 text-[2rem] leading-none text-ink">
        {mode === "entrar" ? "Entrad con vuestro email" : "Cread vuestra cuenta"}
      </h2>
      {/* Con el alta cerrada solo se entra: las cuentas se piden por el formulario de la portada. */}
      <div
        role="tablist"
        aria-label="Acceso"
        hidden={!signup}
        className="mb-6 grid grid-cols-2 rounded-lg bg-cream p-1"
      >
        {(
          [
            ["entrar", "Entrar"],
            ["crear", "Crear cuenta"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={mode === value}
            onClick={() => {
              setMode(value);
              setMessage(null);
            }}
            className={`h-11 rounded-md text-[0.9375rem] transition-colors ${
              mode === value ? "bg-paper text-ink shadow-sm" : "text-ink-soft hover:text-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-[0.875rem] text-ink">
            Email
          </label>
          <TextInput
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-[0.875rem] text-ink">
            Contraseña
          </label>
          <div className="relative">
            <TextInput
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              minLength={8}
              autoComplete={mode === "entrar" ? "current-password" : "new-password"}
              aria-describedby={mode === "crear" ? "password-hint" : undefined}
              className="pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-pressed={showPassword}
              aria-label="Mostrar la contraseña"
              className="absolute inset-y-0 right-0 grid w-11 place-items-center rounded-r-md text-ink-soft hover:text-ink"
            >
              {showPassword ? (
                <EyeOff aria-hidden className="size-[1.125rem]" />
              ) : (
                <Eye aria-hidden className="size-[1.125rem]" />
              )}
            </button>
          </div>
          {mode === "crear" ? (
            <p id="password-hint" className="mt-1.5 text-[0.8125rem] text-muted">
              Al menos 8 caracteres.
            </p>
          ) : null}
        </div>
        <p role="status" aria-live="polite" className="min-h-5 text-[0.875rem]">
          {message ? (
            <span className={message.tone === "error" ? "text-danger" : "text-success"}>
              {message.text}
            </span>
          ) : null}
        </p>
        <Button type="submit" size="lg" className="w-full" disabled={busy}>
          {busy ? "Un momento…" : mode === "entrar" ? "Entrar" : "Crear cuenta"}
        </Button>
      </form>
    </div>
  );
}
