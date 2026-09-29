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
  message = "We keep a record of your donations, pickup slots and Impact Stars, so we need to know who you are.",
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
        <div className="surface-card mx-auto max-w-lg p-8 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-mint text-forest">
            <Lock className="h-6 w-6" />
          </span>
          <h2 className="font-display mt-5 text-2xl font-semibold text-ink">{title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">{message}</p>
          <div className="mt-7 flex flex-col gap-3">
            <Button href="/login" size="lg">
              Continue with Magic Link
            </Button>
            <Button href="/login?mode=google" size="lg" variant="secondary">
              Continue with Google
            </Button>
          </div>
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
