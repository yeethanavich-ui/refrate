"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setSubmitting(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    router.push("/");
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="font-display text-2xl text-steel-100">Log in</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm text-steel-300">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border border-piste-700 bg-piste-900 px-3 py-2 text-steel-100"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-steel-300">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border border-piste-700 bg-piste-900 px-3 py-2 text-steel-100"
          />
        </div>

        {error && <p className="text-sm text-touche">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded bg-touche px-4 py-2 font-medium text-white hover:bg-touche-dim disabled:opacity-50"
        >
          {submitting ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="text-sm text-steel-400">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-touche hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
