"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Link2, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { useApp } from "@/lib/store";
import { Button, Card, Field, Input } from "@/components/ui/primitives";

type Phase = "idle" | "sending" | "sent";

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.6 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.2 17.6 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.5c0-1.6-.15-3.2-.43-4.7H24v9h12.9c-.56 2.9-2.2 5.4-4.7 7l7.6 5.9c4.4-4.1 7.2-10.2 7.2-17.2z" />
      <path fill="#FBBC05" d="M10.4 28.7c-.5-1.4-.8-2.9-.8-4.7s.3-3.3.8-4.7l-7.8-6.1C1 16.4 0 20.1 0 24s1 7.6 2.6 10.8l7.8-6.1z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.8 2.3-8.3 2.3-6.4 0-11.7-3.7-13.6-9.9l-7.8 6.1C6.5 42.6 14.6 48 24 48z" />
    </svg>
  );
}

export function AuthPanel({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const { signInMagic, signInGoogle } = useApp();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState("");
  const [googleBusy, setGoogleBusy] = useState(false);

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());

  function submitMagic(e: React.FormEvent) {
    e.preventDefault();
    if (!validEmail) {
      setError("Enter a valid email address so we can send the link.");
      return;
    }
    setError("");
    setPhase("sending");
    window.setTimeout(() => setPhase("sent"), 900);
  }

  function openMagicLink() {
    signInMagic(email.trim(), mode === "signup" ? name : undefined);
    router.push("/impact");
  }

  function google() {
    setGoogleBusy(true);
    window.setTimeout(() => {
      signInGoogle();
      router.push("/impact");
    }, 850);
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:gap-14 lg:px-8 lg:py-20">
      {/* story side */}
      <div className="hidden flex-col justify-between lg:flex">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-forest">
            ← Back to home
          </Link>
          <h1 className="font-display mt-8 text-4xl leading-[1.06] font-semibold text-ink text-balance">
            {mode === "login"
              ? "Welcome back. Your cupboard probably has something to give."
              : "Create an account in one tap. No password, ever."}
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
            ReKindle uses magic links and Google sign-in. We never ask you to invent or remember a
            password, and we never sell your data.
          </p>

          <ul className="mt-8 grid gap-4">
            {[
              { icon: Link2, title: "Magic link only", body: "Email in, link out, you are in. No password reset emails." },
              { icon: ShieldCheck, title: "Role-based access", body: "Donors, volunteers, NGOs and admins each see only what they need." },
              { icon: Sparkles, title: "Impact Stars on day one", body: "Every verified donation writes a star transaction to your account." },
            ].map((f) => (
              <li key={f.title} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mint text-forest">
                  <f.icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-extrabold text-ink">{f.title}</span>
                  <span className="block text-sm leading-relaxed text-muted">{f.body}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-10 max-w-sm rounded-2xl border border-line bg-cream p-5 text-sm leading-relaxed text-ink-soft">
          “I had two bags of books I would have thrown out. They reached a school library in eleven
          days.”
          <span className="mt-2 block text-xs font-bold text-forest-soft">
            — Mahesh R., Bengaluru · 18 donations
          </span>
        </p>
      </div>

      {/* form side */}
      <Card className="relative p-7 sm:p-9">
        <Link
          href="/"
          className="mb-6 inline-flex text-sm font-bold text-forest lg:hidden"
        >
          ← Back to home
        </Link>

        <p className="text-xs font-bold tracking-[0.2em] text-forest-soft uppercase">
          {mode === "login" ? "Sign in" : "Create account"}
        </p>
        <h2 className="font-display mt-2 text-3xl font-semibold text-ink">
          {mode === "login" ? "Continue to ReKindle" : "Start giving things a second life"}
        </h2>
        <p className="mt-2 text-sm text-muted">
          {mode === "login"
            ? "No password. We send you a one-time link."
            : "One email address is all we need."}
        </p>

        {phase === "sent" ? (
          <div className="anim-slide-up mt-7">
            <div className="rounded-2xl border border-mint-deep bg-mint p-6 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-forest text-cream">
                <Mail className="h-6 w-6" />
              </span>
              <p className="mt-4 text-base font-extrabold text-ink">Check your inbox</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                We sent a magic link to <span className="font-bold text-forest">{email}</span>.
                It expires in 15 minutes.
              </p>
            </div>

            <Button size="lg" className="mt-5 w-full" onClick={openMagicLink}>
              Open magic link
              <ArrowRight className="h-5 w-5" />
            </Button>
            <p className="mt-3 text-center text-xs text-muted">
              Demo mode: this button stands in for clicking the link in your email.
            </p>
            <button
              type="button"
              onClick={() => setPhase("idle")}
              className="mt-4 w-full text-center text-sm font-bold text-muted hover:text-forest"
            >
              Use a different email
            </button>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={google}
              disabled={googleBusy}
              className="mt-7 flex h-13 w-full items-center justify-center gap-3 rounded-xl border border-line-strong bg-white px-5 py-3.5 text-sm font-bold text-ink transition-colors hover:border-forest disabled:opacity-60"
              style={{ height: "3.25rem" }}
            >
              {googleBusy ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink border-t-transparent" />
              ) : (
                <GoogleMark />
              )}
              {googleBusy ? "Connecting to Google…" : "Continue with Google"}
            </button>

            <div className="my-6 flex items-center gap-4">
              <span className="h-px flex-1 bg-line" />
              <span className="text-xs font-bold text-muted">or with a magic link</span>
              <span className="h-px flex-1 bg-line" />
            </div>

            <form onSubmit={submitMagic} className="grid gap-4">
              {mode === "signup" && (
                <Field label="Your name" hint="optional">
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Mahesh Rao"
                    autoComplete="name"
                  />
                </Field>
              )}
              <Field label="Email address" error={error}>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  inputMode="email"
                />
              </Field>

              <Button
                type="submit"
                size="lg"
                loading={phase === "sending"}
                className="w-full"
                disabled={phase === "sending"}
              >
                {phase === "sending" ? "Sending…" : "Send magic link"}
              </Button>
            </form>

            <p className="mt-5 text-center text-sm text-muted">
              {mode === "login" ? (
                <>
                  New here?{" "}
                  <Link href="/signup" className="font-bold text-forest underline underline-offset-4">
                    Create an account
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <Link href="/login" className="font-bold text-forest underline underline-offset-4">
                    Sign in
                  </Link>
                </>
              )}
            </p>
          </>
        )}

        <p className="mt-6 flex items-center justify-center gap-1.5 border-t border-line pt-5 text-center text-xs text-muted">
          <Check className="h-3.5 w-3.5 text-forest" />
          No passwords stored · Encrypted in transit · Delete your account anytime
        </p>
      </Card>
    </div>
  );
}
