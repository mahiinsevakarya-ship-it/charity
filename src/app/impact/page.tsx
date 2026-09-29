"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Footprints,
  Gift,
  Package,
  Shirt,
  Sparkles,
  Star,
} from "lucide-react";
import { useApp, useMyStats } from "@/lib/store";
import { nextLevel, STATUS_META } from "@/lib/catalog";
import { itemWords, num, relativeTime } from "@/lib/format";
import { Avatar, Counter } from "@/components/ui/motion";
import {
  Button,
  Card,
  DonationSkeleton,
  EmptyState,
  ProgressBar,
  SectionHeading,
  StatusPill,
} from "@/components/ui/primitives";
import { PageHeader, Shell } from "@/components/ui/page";

const HELPED = [
  { icon: BookOpen, key: "books", label: "learning resources reach students", tone: "bg-mint text-forest" },
  { icon: Shirt, key: "clothes", label: "clothing items find new homes", tone: "bg-clay-soft text-[#b14f31]" },
  { icon: Footprints, key: "shoes", label: "pairs of shoes get reused", tone: "bg-gold-soft text-gold-deep" },
] as const;

export default function ImpactDashboardPage() {
  const { me, myDonations, ready } = useApp();
  const stats = useMyStats();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const next = nextLevel(stats.balance);
  const progress = next
    ? Math.min(100, ((stats.balance - stats.level.min) / (next.min - stats.level.min)) * 100)
    : 100;

  const recent = useMemo(() => myDonations.slice(0, 4), [myDonations]);

  const headline = useMemo(() => {
    const hour = new Date().getHours();
    return hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Impact dashboard"
        title={
          me ? (
            <>
              {headline}, {me.name.split(" ")[0]} 👋
            </>
          ) : (
            "Your impact"
          )
        }
        subtitle="A live view of everything your donations have achieved so far."
        actions={
          <>
            <Button href="/donate">New donation</Button>
            <Button href="/rewards" variant="secondary">
              Impact Stars
            </Button>
          </>
        }
      />

      <Shell>
        {/* hero stat */}
        <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
          <Card className="relative overflow-hidden p-7 sm:p-9">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-gold-soft blur-2xl"
            />
            <div className="relative flex items-start justify-between gap-6">
              <div>
                <p className="text-xs font-bold tracking-[0.2em] text-forest-soft uppercase">
                  Your impact
                </p>
                <p className="font-display mt-3 flex items-end gap-3 text-6xl leading-none font-semibold text-ink tabular-nums sm:text-7xl">
                  <Counter value={stats.balance} />
                  <span className="mb-2 text-4xl text-gold" aria-hidden>
                    ⭐
                  </span>
                </p>
                <p className="mt-4 text-sm font-semibold text-muted">
                  {num(stats.starsEarned)} earned lifetime · {stats.level.emoji}{" "}
                  <span className="text-ink">{stats.level.name}</span>
                </p>
              </div>
              <span className="hidden sm:block">
                <Avatar
                  initials={me?.initials ?? "RK"}
                  color={me?.avatarColor ?? "#0e5c43"}
                  size="xl"
                />
              </span>
            </div>

            {next && (
              <div className="relative mt-7">
                <div className="mb-2 flex items-baseline justify-between text-xs font-bold">
                  <span className="text-muted">
                    {stats.level.emoji} {stats.level.name}
                  </span>
                  <span className="text-forest">
                    {next.emoji} {next.name} at {num(next.min)} ⭐
                  </span>
                </div>
                <ProgressBar value={progress} tone="gold" />
                <p className="mt-2 text-xs text-muted">
                  {num(next.min - stats.balance)} more stars to unlock: {next.perk}
                </p>
              </div>
            )}

            <div className="relative mt-7 flex flex-wrap gap-3">
              <Link
                href="/rewards"
                className="inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 text-sm font-bold text-ink transition-colors hover:border-forest hover:text-forest"
              >
                <Gift className="h-4 w-4" />
                Rewards & badges
              </Link>
              <Link
                href="/my-donations"
                className="inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 text-sm font-bold text-ink transition-colors hover:border-forest hover:text-forest"
              >
                <Package className="h-4 w-4" />
                Full history
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Donations", value: stats.totalDonations },
              { label: "Items reused", value: stats.itemsReused },
              { label: "Books donated", value: stats.books },
              { label: "Clothes donated", value: stats.clothes },
              { label: "Shoes donated", value: stats.shoes },
              { label: "In progress", value: stats.pending },
            ].map((s, i) => (
              <Card key={s.label} className={`p-5 ${i === 5 ? "bg-cream" : ""}`}>
                <p className="font-display text-3xl font-semibold text-ink tabular-nums">
                  {loading ? "—" : num(s.value)}
                </p>
                <p className="mt-1 text-xs font-bold text-muted">{s.label}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* helped */}
        <section className="mt-10">
          <SectionHeading
            align="left"
            eyebrow="So far"
            title="Your donations helped…"
            body="Counts come from verified distributions reported back by our partners."
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {HELPED.map((h, idx) => {
              const value = stats[h.key as "books" | "clothes" | "shoes"];
              const max = Math.max(stats.books, stats.clothes, stats.shoes, 1);
              return (
                <Card key={h.key} className="p-6">
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${h.tone}`}
                  >
                    <h.icon className="h-5 w-5" />
                  </span>
                  <p className="font-display mt-4 flex items-baseline gap-2 text-4xl font-semibold text-ink tabular-nums">
                    <Counter value={value} duration={1200 + idx * 200} />
                  </p>
                  <p className="mt-1 text-sm font-semibold text-muted">{h.label}</p>
                  <ProgressBar
                    value={(value / max) * 100}
                    className="mt-4"
                    tone={idx === 2 ? "gold" : "forest"}
                  />
                </Card>
              );
            })}
          </div>
        </section>

        {/* recent */}
        <section className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <SectionHeading align="left" title="Recent donations" />
            <Link
              href="/my-donations"
              className="shrink-0 text-sm font-bold text-forest underline underline-offset-4"
            >
              View all
            </Link>
          </div>

          {loading || !ready ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[0, 1].map((i) => (
                <DonationSkeleton key={i} />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <div className="mt-6">
              <EmptyState
                title="No donations yet"
                body="Start with one box of things you no longer use. Clothes, books, shoes — anything usable."
                action={<Button href="/donate">Start your first donation</Button>}
                icon={<Star className="h-7 w-7" />}
              />
            </div>
          ) : (
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {recent.map((d) => {
                const meta = STATUS_META[d.status];
                return (
                  <li key={d.id}>
                    <Link
                      href={`/my-donations/${d.code}`}
                      className="surface-card block h-full p-5 transition-all hover:-translate-y-0.5 hover:shadow-card"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-base font-extrabold text-ink">Donation {d.code}</p>
                        <StatusPill label={meta.label} tone={meta.tone} />
                      </div>
                      <p className="mt-2 text-sm text-muted">
                        {d.items
                          .map(
                            (it) =>
                              itemWords(it.quantity, it.category),
                          )
                          .join(" + ")}
                      </p>
                      <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-xs">
                        <span className="text-muted">{relativeTime(d.createdAt)}</span>
                        <span className="font-extrabold text-gold-deep">
                          {d.awardedStars ? `+${d.awardedStars} ⭐` : `≈ ${d.expectedStars} ⭐ pending`}
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* pending nudge */}
        {stats.pending > 0 && (
          <Card className="mt-8 flex flex-col items-start justify-between gap-4 bg-forest p-6 text-cream sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
              <div>
                <p className="font-bold">
                  {stats.pending} donation{stats.pending > 1 ? "s are" : " is"} still moving through
                  the system
                </p>
                <p className="mt-1 text-sm text-cream/70">
                  Stars are credited as soon as a partner verifies them.
                </p>
              </div>
            </div>
            <Button href="/my-donations" variant="gold" className="shrink-0">
              Track them
            </Button>
          </Card>
        )}
      </Shell>
    </>
  );
}
