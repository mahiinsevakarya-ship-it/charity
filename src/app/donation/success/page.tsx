"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  HeartHandshake,
  Home,
  PackageCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { STATUS_META, CATEGORY_MAP } from "@/lib/catalog";
import type { DonationStatus } from "@/lib/types";
import { Button, Card, StatusPill } from "@/components/ui/primitives";
import { Shell } from "@/components/ui/page";
import { Skeleton } from "@/components/ui/primitives";

const CHAIN = [
  { icon: Home, label: "Your home", hint: "Listed in 3 minutes" },
  { icon: HeartHandshake, label: "Community", hint: "Picked up or dropped off" },
  { icon: Users, label: "New home", hint: "Verified & distributed" },
  { icon: PackageCheck, label: "New life", hint: "Impact reported back" },
];

const STATUS_NOTE: Record<DonationStatus, string> = {
  SUBMITTED: "Your submission is in the queue — we are assigning a partner.",
  UNDER_REVIEW: "A reviewer is checking the photos and details you shared.",
  PICKUP_SCHEDULED: "A volunteer will call before arriving at your address.",
  COLLECTED: "Your items are on their way to the partner hub.",
  RECEIVED: "Items arrived at the hub and are being sorted.",
  VERIFIED: "Counts confirmed — your Impact Stars are now in your ledger.",
  DISTRIBUTED: "Your items have been handed over to people who need them.",
  COMPLETED: "The partner filed the distribution report. Thank you!",
  REJECTED: "These items did not qualify for reuse — the reason is on your donation page.",
};

function SuccessInner() {
  const params = useSearchParams();
  const code = params.get("code");
  const { donations, ready } = useApp();
  const donation = donations.find((d) => d.code === code) ?? donations[0];

  if (!ready) {
    return (
      <Shell>
        <Skeleton className="h-10 w-96" />
        <Skeleton className="mt-4 h-64 w-full" />
      </Shell>
    );
  }

  const meta = STATUS_META[donation.status];

  return (
    <Shell className="max-w-5xl">
      <div className="text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-mint text-forest anim-pop">
          <Sparkles className="h-8 w-8" />
        </span>
        <h1 className="font-display mt-6 text-[clamp(2rem,5vw,3.2rem)] leading-[1.05] font-semibold text-ink text-balance">
          You just gave something a second life. 💚
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          Your items are on their way to someone who will use them. We will update you at every
          step, and your Impact Stars land once a partner verifies the donation.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        <Card className="p-6">
          <p className="text-xs font-bold tracking-[0.16em] text-forest-soft uppercase">
            Donation ID
          </p>
          <p className="font-display mt-2 text-3xl font-semibold text-ink tabular-nums">
            {donation.code}
          </p>
          <p className="mt-2 text-xs text-muted">
            {donation.items.reduce((s, i) => s + i.quantity, 0)}{" "}
            {donation.items.reduce((s, i) => s + i.quantity, 0) === 1 ? "unit" : "units"} ·{" "}
            {donation.images.length} photo{donation.images.length === 1 ? "" : "s"}
          </p>
        </Card>

        <Card className="p-6">
          <p className="text-xs font-bold tracking-[0.16em] text-forest-soft uppercase">Status</p>
          <div className="mt-3">
            <StatusPill label={meta.label} tone={meta.tone} />
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted">{STATUS_NOTE[donation.status]}</p>
        </Card>

        <Card className="p-6 border-[#f3e0ab] bg-gold-soft">
          <p className="text-xs font-bold tracking-[0.16em] text-gold-deep uppercase">
            {donation.awardedStars ? "Stars awarded" : "Potential impact"}
          </p>
          <p className="font-display mt-2 text-3xl font-semibold text-gold-deep">
            +{donation.awardedStars ?? donation.expectedStars} ⭐
          </p>
          <p className="mt-2 text-xs leading-relaxed text-ink-soft">
            {donation.awardedStars
              ? "Credited to your Impact Star balance"
              : "Impact Stars after verification"}
          </p>
        </Card>
      </div>

      {/* visual chain */}
      <div className="mt-8 surface-cream p-6 sm:p-8">
        <p className="text-xs font-bold tracking-[0.16em] text-forest-soft uppercase">
          What happens next
        </p>
        <ol className="mt-6 grid gap-4 sm:grid-cols-4">
          {CHAIN.map((c, i) => (
            <li key={c.label} className="relative">
              <div className="flex items-start gap-3 sm:block">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-forest shadow-soft">
                  <c.icon className="h-5 w-5" />
                </span>
                <div className="sm:mt-3">
                  <p className="text-sm font-extrabold text-ink">{c.label}</p>
                  <p className="text-xs text-muted">{c.hint}</p>
                </div>
              </div>
              {i < CHAIN.length - 1 && (
                <span
                  aria-hidden
                  className="absolute top-5 -right-2 hidden h-5 w-5 items-center justify-center rounded-full border border-line-strong bg-white text-forest sm:flex"
                >
                  <ArrowRight className="h-3 w-3" />
                </span>
              )}
            </li>
          ))}
        </ol>
        <div className="mt-6 flex flex-wrap gap-1.5">
          {donation.items.map((it) => (
            <span
              key={it.id}
              className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-ink-soft border border-line"
            >
              {it.quantity} × {CATEGORY_MAP[it.category].label}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button href={`/my-donations/${donation.code}`} size="lg">
          Track My Donation
          <ArrowRight className="h-5 w-5" />
        </Button>
        <Button href="/donate" size="lg" variant="secondary">
          Donate Something Else
        </Button>
      </div>

      <p className="mt-6 text-center text-xs text-muted">
        A receipt was sent to your registered email. Need to change the slot?{" "}
        <Link href="/contact" className="font-bold text-forest underline underline-offset-4">
          Talk to us
        </Link>
        .
      </p>
    </Shell>
  );
}

export default function DonationSuccessPage() {
  return (
    <Suspense fallback={<Shell><Skeleton className="h-10 w-96" /></Shell>}>
      <SuccessInner />
    </Suspense>
  );
}
