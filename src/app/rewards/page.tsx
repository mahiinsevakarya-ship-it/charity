"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Award,
  BookOpen,
  Gift,
  Lock,
  Package,
  Recycle,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { useApp, useMyStats } from "@/lib/store";
import { BADGES, LEVELS, nextLevel } from "@/lib/catalog";
import { formatDate, itemWords, num } from "@/lib/format";
import { Counter, fireConfetti } from "@/components/ui/motion";
import {
  Button,
  Card,
  EmptyState,
  ProgressBar,
  SectionHeading,
  Skeleton,
  StatusPill,
} from "@/components/ui/primitives";
import { AuthGate, PageHeader, Shell } from "@/components/ui/page";

const BADGE_ICONS: Record<string, typeof Award> = {
  sparkle: Sparkles,
  book: BookOpen,
  recycle: Recycle,
  users: Users,
  package: Package,
  trophy: Trophy,
};

const PERKS = [
  {
    id: "perk_sapling",
    label: "3 saplings planted with GreenLoop",
    stars: 120,
    emoji: "🌱",
    stock: "14 left this month",
  },
  {
    id: "perk_bookmark",
    label: "SevaKarya x Vidya Setu bookmark set",
    stars: 250,
    emoji: "🔖",
    stock: "Made from recycled donations",
  },
  {
    id: "perk_pass",
    label: "Community wardrobe priority pass",
    stars: 600,
    emoji: "🎟️",
    stock: "For Contributor level and above",
  },
  {
    id: "perk_report",
    label: "Printed impact report with your name",
    stars: 1500,
    emoji: "📜",
    stock: "Ships quarterly",
  },
];

export default function RewardsPage() {
  const { transactions, ready, redeemPerk } = useApp();
  const stats = useMyStats();
  const [redeemed, setRedeemed] = useState<string[]>([]);

  const next = nextLevel(stats.balance);
  const progress = next
    ? Math.min(100, ((stats.balance - stats.level.min) / (next.min - stats.level.min)) * 100)
    : 100;

  const ledger = useMemo(
    () => [...transactions].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [transactions],
  );

  const earnedBadges = useMemo(() => {
    const set = new Set<string>();
    set.add("first_donation");
    if (stats.books >= 25) set.add("book_hero");
    if (stats.itemsReused >= 100) set.add("reuse_champion");
    if (stats.itemsReused >= 100) set.add("hundred_items");
    if (stats.verifiedCount >= 6) set.add("community_builder");
    if (stats.balance >= 5000) set.add("impact_champion");
    return set;
  }, [stats]);

  function redeem(id: string, stars: number, label: string) {
    if (redeemed.includes(id) || stats.balance < stars) return;
    redeemPerk(stars, label);
    setRedeemed((p) => [...p, id]);
    fireConfetti();
  }

  return (
    <>
      <PageHeader
        eyebrow="Rewards"
        title="Impact Stars & badges"
        subtitle="Your reputation as a giver. Stars arrive only after a partner verifies a donation, and every star is a transaction you can audit."
        back={{ href: "/impact", label: "Impact dashboard" }}
        actions={<Button href="/donate">Earn more stars</Button>}
      />

      <AuthGate
        title="Sign in to view your rewards"
        message="Your Impact Star balance, unlocked badges, and sustainability perks are tied to your personal donor account."
      >
        <Shell>
        {!ready ? (
          <div className="grid gap-4">
            <Skeleton className="h-40 w-full rounded-3xl" />
            <Skeleton className="h-64 w-full rounded-3xl" />
          </div>
        ) : (
          <>
            <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
              <Card className="relative overflow-hidden p-7 sm:p-9">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-20 -left-10 h-64 w-64 rounded-full bg-gold-soft blur-3xl"
                />
                <div className="relative">
                  <p className="text-xs font-bold tracking-[0.2em] text-forest-soft uppercase">
                    Current balance
                  </p>
                  <p className="font-display mt-3 flex items-end gap-3 text-6xl leading-none font-semibold text-ink tabular-nums">
                    <Counter value={stats.balance} />
                    <span className="mb-2 text-4xl text-gold" aria-hidden>
                      ⭐
                    </span>
                  </p>
                  <p className="mt-3 text-sm font-semibold text-muted">
                    {num(stats.starsEarned)} earned lifetime ·{" "}
                    {num(stats.starsEarned - stats.balance)} used on perks
                  </p>

                  <div className="mt-6">
                    <div className="mb-2 flex items-baseline justify-between text-xs font-bold">
                      <span>
                        {stats.level.emoji} {stats.level.name}
                      </span>
                      <span className="text-muted">
                        {next
                          ? `${num(next.min - stats.balance)} to ${next.emoji} ${next.name}`
                          : "Top level reached"}
                      </span>
                    </div>
                    <ProgressBar value={progress} tone="gold" />
                  </div>
                </div>
              </Card>

              <Card className="p-7">
                <p className="text-xs font-bold tracking-[0.2em] text-forest-soft uppercase">
                  How stars work
                </p>
                <ol className="mt-4 grid gap-3 text-sm">
                  {[
                    "You submit a donation",
                    "A partner physically receives it",
                    "Our team verifies photos and counts",
                    "Stars are written to your ledger",
                  ].map((s, i) => (
                    <li key={s} className="flex items-center gap-3 text-ink-soft">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mint text-[0.7rem] font-extrabold text-forest">
                        {i + 1}
                      </span>
                      {s}
                    </li>
                  ))}
                </ol>
                <div className="mt-5 rounded-xl border border-line bg-cream px-4 py-3 text-xs leading-relaxed text-muted">
                  Impact Stars are recognition points for your contribution and do not represent
                  cash value unless explicitly stated by the platform.
                </div>
              </Card>
            </div>

            {/* levels */}
            <section className="mt-10">
              <SectionHeading align="left" title="Levels" body="Recognition tiers based on lifetime verified stars." />
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {LEVELS.map((l) => {
                  const active = l.id === stats.level.id;
                  return (
                    <Card
                      key={l.id}
                      className={`p-6 transition-transform hover:-translate-y-1 ${active ? "border-forest bg-mint" : ""}`}
                    >
                      <span className="text-3xl">{l.emoji}</span>
                      <p className="mt-3 text-base font-extrabold text-ink">{l.name}</p>
                      <p className="mt-1 text-xs font-bold text-muted tabular-nums">
                        {l.max === Number.MAX_SAFE_INTEGER
                          ? `${num(l.min)}+ stars`
                          : `${num(l.min)}–${num(l.max)} stars`}
                      </p>
                      <p className="mt-3 text-xs leading-relaxed text-muted">{l.perk}</p>
                      {active && (
                        <p className="mt-4 inline-flex rounded-full bg-forest px-3 py-1 text-[0.7rem] font-bold text-cream">
                          Your level
                        </p>
                      )}
                    </Card>
                  );
                })}
              </div>
            </section>

            {/* badges */}
            <section className="mt-10">
              <SectionHeading
                align="left"
                title="Badges"
                body="Earned for consistent, meaningful giving — not for volume alone."
              />
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {BADGES.map((b) => {
                  const earned = earnedBadges.has(b.id);
                  const Icon = BADGE_ICONS[b.icon] ?? Award;
                  return (
                    <Card
                      key={b.id}
                      className={`flex gap-4 p-5 ${earned ? "" : "opacity-75"}`}
                    >
                      <span
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                          earned ? "bg-gold-soft text-gold-deep" : "bg-sand text-muted"
                        }`}
                      >
                        {earned ? <Icon className="h-6 w-6" /> : <Lock className="h-5 w-5" />}
                      </span>
                      <div className="min-w-0">
                        <p className="flex items-center gap-2 text-sm font-extrabold text-ink">
                          {b.name}
                          {earned && <span aria-label="earned">✓</span>}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-muted">{b.description}</p>
                        <p className="mt-2 text-[0.7rem] font-bold text-forest-soft">
                          {earned ? "Unlocked" : b.requirement}
                        </p>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </section>

            {/* perks */}
            <section className="mt-10">
              <SectionHeading
                align="left"
                title="Redeem selected perks"
                body="Optional. Stars are never money — these are small thank-yous from our partner network."
              />
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {PERKS.map((p) => {
                  const isRedeemed = redeemed.includes(p.id);
                  const affordable = stats.balance >= p.stars;
                  return (
                    <Card key={p.id} className="flex flex-col p-5">
                      <span className="text-2xl">{p.emoji}</span>
                      <p className="mt-3 flex-1 text-sm font-extrabold leading-snug text-ink">
                        {p.label}
                      </p>
                      <p className="mt-2 text-xs text-muted">{p.stock}</p>
                      <div className="mt-4 flex items-center justify-between gap-2">
                        <span className="text-sm font-extrabold text-gold-deep tabular-nums">
                          {num(p.stars)} ⭐
                        </span>
                        <Button
                          size="sm"
                          variant={isRedeemed ? "secondary" : "primary"}
                          disabled={!affordable || isRedeemed}
                          onClick={() => redeem(p.id, p.stars, p.label)}
                        >
                          {isRedeemed ? "Redeemed" : affordable ? "Redeem" : "Locked"}
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </section>

            {/* ledger */}
            <section className="mt-10">
              <SectionHeading
                align="left"
                title="Star transaction ledger"
                body="A permanent, append-only record. Balances are computed from these rows — never stored on their own."
              />
              {ledger.length === 0 ? (
                <div className="mt-6">
                  <EmptyState
                    title="No transactions yet"
                    body="Stars appear here after your first donation is verified."
                    action={<Button href="/donate">Donate something</Button>}
                    icon={<Gift className="h-7 w-7" />}
                  />
                </div>
              ) : (
                <Card className="mt-6 overflow-hidden">
                  <div className="hidden border-b border-line bg-cream px-6 py-3 text-[0.7rem] font-bold tracking-wide text-muted uppercase sm:grid sm:grid-cols-[130px_1fr_140px_110px]">
                    <span>Date</span>
                    <span>Reason</span>
                    <span>Reference</span>
                    <span className="text-right">Stars</span>
                  </div>
                  <ul className="divide-y divide-line">
                    {ledger.map((t) => (
                      <li
                        key={t.id}
                        className="grid gap-1 px-6 py-4 sm:grid-cols-[130px_1fr_140px_110px] sm:items-center sm:gap-4"
                      >
                        <span className="text-xs font-semibold text-muted">
                          {formatDate(t.createdAt)}
                        </span>
                        <span>
                          <span className="block text-sm font-semibold text-ink">{t.reason}</span>
                          {t.breakdown.length > 0 && (
                            <span className="mt-1 block text-xs text-muted">
                              {t.breakdown
                                .map((b) => `${itemWords(b.quantity, b.category)} × ${b.stars / Math.max(b.quantity, 1)}`)
                                .join(" · ")}
                            </span>
                          )}
                        </span>
                        <span className="text-xs font-bold text-muted">
                          {t.donationId === "manual" ? (
                            <StatusPill label="Admin adjustment" tone="pending" />
                          ) : t.donationCode.startsWith("PERK") ? (
                            t.donationCode
                          ) : (
                            <Link
                              href={`/my-donations/${t.donationCode}`}
                              className="text-forest underline underline-offset-4"
                            >
                              {t.donationCode}
                            </Link>
                          )}
                        </span>
                        <span
                          className={`text-left text-sm font-extrabold tabular-nums sm:text-right ${
                            t.stars < 0 ? "text-clay" : "text-forest"
                          }`}
                        >
                          {t.stars > 0 ? "+" : ""}
                          {num(t.stars)} ⭐
                        </span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </section>
          </>
        )}
        </Shell>
      </AuthGate>
    </>
  );
}
