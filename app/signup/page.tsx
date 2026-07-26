"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { supabase } from "@/lib/supabaseClient";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usaNumber, setUsaNumber] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!captchaToken) {
      setError("Please complete the captcha.");
      return;
    }

    setSubmitting(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { captchaToken },
      });
      if (signUpError) throw signUpError;

      const userId = data.user?.id;
      if (!userId) {
        throw new Error(
          "Check your email to confirm your account, then come back and log in."
        );
      }

      const { error: profileError } = await supabase.from("profiles").insert({
        id: userId,
        usa_fencing_number: usaNumber.trim(),
        display_name: displayName.trim() || null,
      });
      if (profileError) throw profileError;

      router.push("/");
    } catch (err: any) {
      setError(err.message ?? "Something went wrong.");
      captchaRef.current?.resetCaptcha();
      setCaptchaToken(null);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="font-display text-2xl text-steel-100">
        Create an account
      </h1>
      <p className="text-sm text-steel-400">
        A USA Fencing member number is required to leave reviews. Note: this
        isn't verified against USA Fencing's own system — it just ties your
        reviews to one account.
      </p>

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
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border border-piste-700 bg-piste-900 px-3 py-2 text-steel-100"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-steel-300">
            USA Fencing member number
          </label>
          <input
            required
            value={usaNumber}
            onChange={(e) => setUsaNumber(e.target.value)}
            placeholder="e.g. 100123456"
            className="w-full rounded border border-piste-700 bg-piste-900 px-3 py-2 text-steel-100"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-steel-300">
            Display name (optional)
          </label>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Shown on your reviews instead of your email"
            className="w-full rounded border border-piste-700 bg-piste-900 px-3 py-2 text-steel-100"
          />
        </div>

        <HCaptcha
          ref={captchaRef}
          sitekey="a39aedfc-43d0-4302-8e8a-4a6eb9403250"
          onVerify={(token) => setCaptchaToken(token)}
          onExpire={() => setCaptchaToken(null)}
        />

        {error && <p className="text-sm text-touche">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded bg-touche px-4 py-2 font-medium text-white hover:bg-touche-dim disabled:opacity-50"
        >
          {submitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="text-sm text-steel-400">
        Already have an account?{" "}
        <Link href="/login" className="text-touche hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
