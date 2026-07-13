"use client";

import { useActionState } from "react";
import { LoaderCircle, LogIn } from "lucide-react";
import { login, type LoginState } from "../actions";
import { ErrorNote, Field, inputClass } from "@/components/forms/fields";

const initialLoginState: LoginState = { status: "idle" };

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [state, formAction, pending] = useActionState(login, initialLoginState);

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <input type="hidden" name="redirectTo" value={redirectTo} />

      <Field label="Adresse e-mail" required>
        <input
          type="email"
          name="email"
          required
          autoComplete="username"
          className={inputClass}
          placeholder="admin@lumora.com"
        />
      </Field>

      <Field label="Mot de passe" required>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </Field>

      {state.status === "error" && state.message && (
        <ErrorNote message={state.message} />
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn-gold w-full disabled:cursor-wait disabled:opacity-65"
      >
        {pending ? (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        ) : (
          <LogIn className="h-4 w-4" />
        )}
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
