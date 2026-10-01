"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { ArrowLeft, Lock } from "lucide-react";
import { Button, Skeleton } from "./primitives";
import { useApp } from "@/lib/store";

export function PageHeader({
  title,
  subtitle,
  eyebrow,
  back,
  actions,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  eyebrow?: string;
  back?: { href: string; label: string };
  actions?: ReactNode;
}) {
  return (
    <div className="border-b border-line bg-cream/60">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        {back && (
          <Link
            href={back.href}
            className="mb-5 inline-flex items-center gap-1.5 text-sm font-bold text-muted transition-colors hover:text-forest"
          >
            <ArrowLeft className="h-4 w-4" />
            {back.label}
          </Link>
        )}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            {eyebrow && (
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-forest-soft">
                {eyebrow}
              </p>
            )}
            <h1 className="font-display mt-2 text-[clamp(1.9rem,4vw,3rem)] leading-[1.06] font-semibold text-ink text-balance">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted text-pretty sm:text-lg">
                {subtitle}
              </p>
            )}
          </div>
          {actions && <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>}
        </div>
      </div>
    </div>
  );
}

export function Shell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14 ${className}`}>
      {children}
    </div>
  );
}

export function AuthGate({
  children,
  title = "Sign in to continue",
  message = "We keep a private record of your donations, pickup slots, and earned Impact Stars, so we need to know who you are.",
}: {
  children: ReactNode;
  title?: string;
  message?: string;
}) {
  const { ready, me } = useApp();

  if (!ready) {
    return (
      <Shell>
        <div className="grid gap-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-40 w-full" />
        </div>
      </Shell>
    );
  }

  if (!me) {
    return (
      <Shell>
        <div className="surface-card mx-auto max-w-md p-8 text-center sm:p-10">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-mint text-forest shadow-soft">
            <Lock className="h-6 w-6" />
          </span>
          <h2 className="font-display mt-5 text-2xl font-semibold text-ink">{title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">{message}</p>
          <div className="mt-7 flex flex-col gap-3">
            <a
              href="/api/auth/google"
              className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-line-strong bg-white px-5 text-sm font-bold text-ink transition-all hover:border-forest hover:bg-cream/40"
            >
              <svg viewBox="0 0 48 48" className="h-4 w-4" aria-hidden="true">
                <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.6 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.2 17.6 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.5c0-1.6-.15-3.2-.43-4.7H24v9h12.9c-.56 2.9-2.2 5.4-4.7 7l7.6 5.9c4.4-4.1 7.2-10.2 7.2-17.2z" />
                <path fill="#FBBC05" d="M10.4 28.7c-.5-1.4-.8-2.9-.8-4.7s.3-3.3.8-4.7l-7.8-6.1C1 16.4 0 20.1 0 24s1 7.6 2.6 10.8l7.8-6.1z" />
                <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.8 2.3-8.3 2.3-6.4 0-11.7-3.7-13.6-9.9l-7.8 6.1C6.5 42.6 14.6 48 24 48z" />
              </svg>
              Continue with Google
            </a>
            <Button href="/login" size="lg" className="w-full">
              Sign in with Magic Link
            </Button>
          </div>
          <p className="mt-5 text-xs text-muted">
            New to SevaKarya?{" "}
            <Link href="/signup" className="font-bold text-forest underline underline-offset-4">
              Create an account
            </Link>
          </p>
        </div>
      </Shell>
    );
  }

  return <>{children}</>;
}

export function Tabs({
  tabs,
  className = "",
}: {
  tabs: { id: string; label: string; count?: number }[];
  className?: string;
}) {
  return (
    <div className={`no-scrollbar flex gap-1 overflow-x-auto border-b border-line ${className}`}>
      {tabs.map((t) => {
        const href = `#${t.id}`;
        return (
          <a
            key={t.id}
            href={href}
            className="shrink-0 border-b-2 border-transparent px-4 py-3 text-sm font-bold text-muted transition-colors hover:text-forest"
          >
            {t.label}
            {typeof t.count === "number" && (
              <span className="ml-2 rounded-full bg-sand px-2 py-0.5 text-[0.7rem] text-ink-soft">
                {t.count}
              </span>
            )}
          </a>
        );
      })}
    </div>
  );
}
