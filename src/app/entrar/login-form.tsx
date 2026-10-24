"use client";

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
            ? "Confirma tu email con el enlace que te enviamos y vuelve a intentarlo."
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
              : "No hemos podido crear la cuenta. Revisa el email e inténtalo de nuevo.",
        });
        return;
      }
      setMessage({
        tone: "ok",
        text: "Te hemos enviado un email. Abre el enlace para confirmar la cuenta y después entra aquí.",
      });
      setMode("entrar");
    }
  };

  return (
    <div>
      {/* Con el alta cerrada solo se entra: las cuentas se piden por el formulario de la portada. */}
      <div
        role="tablist"
        aria-label="Acceso"
        hidden={!signup}
        className="grid grid-cols-2 rounded-md bg-ink/5 p-1"
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
            className={`h-10 rounded-[5px] text-[0.9375rem] transition-colors ${
              mode === value ? "bg-paper text-ink shadow-sm" : "text-ink-soft hover:text-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <form onSubmit={submit} className="mt-6 space-y-4" noValidate={false}>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-[0.875rem] text-ink">
            Email
          </label>
          <TextInput id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-[0.875rem] text-ink">
            Contraseña
          </label>
          <TextInput
            id="password"
            name="password"
            type="password"
            minLength={8}
            autoComplete={mode === "entrar" ? "current-password" : "new-password"}
            required
          />
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
