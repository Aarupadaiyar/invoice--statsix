"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { inputClass, labelClass, btnPrimary, btnSecondary } from "@/lib/ui";
import { Loader2, Mail } from "lucide-react";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"password" | "magic">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message === "Invalid login credentials" ? "Incorrect email or password." : error.message);
      return;
    }
    router.push(searchParams.get("next") || "/dashboard");
    router.refresh();
  }

  async function handleMagicLinkSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const next = searchParams.get("next") || "/dashboard";
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setMagicLinkSent(true);
  }

  if (magicLinkSent) {
    return (
      <div className="text-center">
        <h1 className="text-xl font-semibold mb-2">Check your email</h1>
        <p className="text-sm text-black/60">
          We&apos;ve sent a one-time login link to <strong>{email}</strong>. Open it to log in, no password needed.
        </p>
        <button
          onClick={() => {
            setMagicLinkSent(false);
            setMode("password");
          }}
          className="mt-6 text-accent font-medium hover:underline text-sm"
        >
          Back to log in
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-1">Welcome back</h1>
      <p className="text-sm text-black/50 mb-6">Log in to manage your invoices and receipts.</p>

      {mode === "password" ? (
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className={labelClass} htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-black/70" htmlFor="password">Password</label>
              <Link href="/forgot-password" className="text-xs font-medium text-accent hover:underline">
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button type="submit" disabled={loading} className={`${btnPrimary} w-full`}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            Log in
          </button>
        </form>
      ) : (
        <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
          <div>
            <label className={labelClass} htmlFor="magic-email">Email</label>
            <input
              id="magic-email"
              type="email"
              required
              autoComplete="email"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="mt-1.5 text-xs text-black/40">We&apos;ll email you a one-time link to log in, no password needed.</p>
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button type="submit" disabled={loading} className={`${btnPrimary} w-full`}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Mail className="size-4" />}
            Send login link
          </button>
        </form>
      )}

      <button
        onClick={() => {
          setError(null);
          setMode(mode === "password" ? "magic" : "password");
        }}
        className={`${btnSecondary} w-full mt-3`}
      >
        {mode === "password" ? "Forgot your password? Log in with email instead" : "Log in with password instead"}
      </button>

      <p className="mt-6 text-sm text-center text-black/50">
        No account yet?{" "}
        <Link href="/signup" className="text-accent font-medium hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
