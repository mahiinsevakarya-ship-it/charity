import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  ClipboardList,
  Eye,
  FileCheck2,
  Handshake,
  PackageCheck,
  RefreshCcw,
} from "lucide-react";
import { PLATFORM_STATS, SEED_PARTNERS } from "@/lib/seed";
import { STATUS_META } from "@/lib/catalog";
import type { DonationStatus } from "@/lib/types";
import { Reveal, Counter } from "@/components/ui/motion";
import {
  Button,
  Card,
  SectionHeading,
  StatusPill,
} from "@/components/ui/primitives";
import { PageHeader, Shell } from "@/components/ui/page";
import { CategoryBar, DownloadReport } from "./Report";

export const metadata: Metadata = {
  title: "Transparency",
  description:
    "Where SevaKarya donations go: collection, verification and distribution statistics, status definitions and partner reporting.",
};

const FUNNEL = [
  { label: "Donations submitted", value: 3124, hint: "since October 2025" },
  { label: "Items collected", value: 13140, hint: "98% of scheduled pickups" },
  { label: "Items verified", value: PLATFORM_STATS.itemsReused, hint: "95% of collected items" },
  { label: "Items distributed", value: 11946, hint: "96% of verified items" },
  { label: "People reached", value: PLATFORM_STATS.peopleReached, hint: "across 19 cities" },
];

const MONTHLY = [
  { m: "Feb", v: 1320 },
  { m: "Mar", v: 1410 },
  { m: "Apr", v: 1480 },
  { m: "May", v: 1560 },
  { m: "Jun", v: 1640 },
  { m: "Jul", v: 1780 },
  { m: "Aug", v: 1890 },
  { m: "Sep", v: 1402 },
];

const CATEGORY_SPLIT = [
  { key: "BOOKS" as const, value: PLATFORM_STATS.booksShared },
  { key: "CLOTHES" as const, value: PLATFORM_STATS.clothesDonated },
  { key: "SHOES" as const, value: PLATFORM_STATS.shoesReused },
  { key: "BAGS" as const, value: 268 },
  { key: "TOYS" as const, value: 183 },
];

const STATUS_ORDER: DonationStatus[] = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "PICKUP_SCHEDULED",
  "COLLECTED",
  "RECEIVED",
  "VERIFIED",
  "DISTRIBUTED",
  "COMPLETED",
  "REJECTED",
];

const STATUS_MEANING: Record<DonationStatus, string> = {
  SUBMITTED: "Your submission is in the queue and a partner is being assigned.",
  UNDER_REVIEW: "A human reviewer is checking photos, quantities and condition.",
  PICKUP_SCHEDULED: "A volunteer and a slot are assigned for doorstep collection.",
  COLLECTED: "The volunteer has physically collected the items from you.",
  RECEIVED: "Items arrived at the partner hub and are being sorted.",
  VERIFIED: "Counts and condition confirmed. Impact Stars are written to your ledger.",
  DISTRIBUTED: "Items handed to people, families, students or classrooms.",
  COMPLETED: "Partner has submitted a distribution report with photos.",
  REJECTED: "Not accepted for reuse — redirected to recycling or returned to you.",
};

const PROCESS = [
  {
    icon: PackageCheck,
    title: "Receive",
    body: "Items are collected at your door or at a partner drop-off point. The volunteer logs a receipt against your donation code.",
  },
  {
    icon: Eye,
    title: "Inspect",
    body: "At the hub, our team checks photos against what physically arrived: count, condition, safety and cleanliness.",
  },
  {
    icon: FileCheck2,
    title: "Verify or reject",
    body: "Roughly 95% pass. The rest are rejected with a written reason and either returned to you or sent to a recycling partner.",
  },
  {
    icon: Handshake,
    title: "Hand over",
    body: "Verified items are allocated to a partner with a matching need, who confirms distribution with photos and counts.",
  },
];

export default function TransparencyPage() {
  const maxMonthly = Math.max(...MONTHLY.map((x) => x.v));
  const maxCategory = Math.max(...CATEGORY_SPLIT.map((c) => c.value));

  return (
    <>
      <PageHeader
        eyebrow="Trust & transparency"
        title="Know where your donation goes."
        subtitle="Every number on this page is derived from verified donations, pickup receipts and partner distribution reports. Nothing here is estimated or rounded up."
        back={{ href: "/", label: "Home" }}
        actions={<DownloadReport />}
      />

      <Shell>
        {/* funnel */}
        <Reveal>
          <Card className="overflow-hidden">
            <div className="border-b border-line bg-cream px-6 py-5 sm:px-8">
              <h2 className="text-sm font-extrabold tracking-[0.16em] text-forest-soft uppercase">
                Collection → distribution funnel
              </h2>
              <p className="mt-1.5 text-sm text-muted">
                October 2025 to 29 September 2026 · updated daily at 06:00 IST
              </p>
            </div>
            <ol className="grid divide-y divide-line lg:grid-cols-5 lg:divide-x lg:divide-y-0">
              {FUNNEL.map((f, i) => (
                <li key={f.label} className="px-6 py-6 sm:px-8">
                  <span className="text-[0.7rem] font-bold text-gold-deep tabular-nums">
                    0{i + 1}
                  </span>
                  <p className="font-display mt-2 text-4xl font-semibold text-ink tabular-nums">
                    <Counter value={f.value} />
                  </p>
                  <p className="mt-1 text-sm font-bold text-ink-soft">{f.label}</p>
                  <p className="mt-1 text-xs text-muted">{f.hint}</p>
                </li>
              ))}
            </ol>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-mint/50 px-6 py-4 text-xs font-semibold text-forest-dark sm:px-8">
              <span>
                6% of inspected items do not qualify for reuse and are redirected to certified
                recycling partners — they never enter the “reused” count.
              </span>
              <Link href="/faq" className="underline underline-offset-4">
                Read the verification FAQ
              </Link>
            </div>
          </Card>
        </Reveal>

        {/* category + monthly */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <Card className="h-full p-6 sm:p-8">
              <h2 className="text-sm font-extrabold tracking-[0.16em] text-forest-soft uppercase">
                Verified items by category
              </h2>
              <div className="mt-6 grid gap-5">
                {CATEGORY_SPLIT.map((c) => (
                  <CategoryBar key={c.key} category={c.key} value={c.value} max={maxCategory} />
                ))}
              </div>
              <p className="mt-6 border-t border-line pt-4 text-xs leading-relaxed text-muted">
                Bags, toys and other household items are counted individually. Pairs of shoes are
                counted as one unit.
              </p>
            </Card>
          </Reveal>

          <Reveal delay={90}>
            <Card className="h-full p-6 sm:p-8">
              <h2 className="text-sm font-extrabold tracking-[0.16em] text-forest-soft uppercase">
                Items verified per month
              </h2>
              <div className="mt-6 flex h-52 items-end gap-2.5 sm:gap-3">
                {MONTHLY.map((mo) => (
                  <div key={mo.m} className="group flex flex-1 flex-col items-center gap-2">
                    <span className="text-[0.62rem] font-bold text-muted opacity-0 transition-opacity group-hover:opacity-100">
                      {mo.v.toLocaleString("en-IN")}
                    </span>
                    <div className="flex h-[150px] w-full items-end">
                      <div
                        className="w-full rounded-t-lg bg-linear-to-t from-forest to-forest-soft transition-all duration-500 group-hover:from-forest-dark"
                        style={{ height: `${Math.round((mo.v / maxMonthly) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[0.7rem] font-bold text-muted">{mo.m}</span>
                  </div>
                ))}
              </div>
              <p className="mt-6 border-t border-line pt-4 text-xs leading-relaxed text-muted">
                September 2026 is a partial month (up to the 29th). Seasonal peaks follow school
                re-openings and winter relief drives.
              </p>
            </Card>
          </Reveal>
        </div>

        {/* process */}
        <section className="mt-16">
          <Reveal>
            <SectionHeading
              eyebrow="Verification process"
              title="Four checks between your cupboard and someone's home."
              body="No donation is rewarded on submission. Stars are only written after a human confirms what physically arrived."
            />
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((p, i) => (
              <Reveal key={p.title} delay={i * 80}>
                <Card className="h-full p-6">
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-mint text-forest">
                      <p.icon className="h-5 w-5" />
                    </span>
                    <span className="font-display text-3xl font-semibold text-mint-deep">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-extrabold text-ink">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </section>

        {/* status dictionary */}
        <section className="mt-16">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow="Status definitions"
              title="What every status means."
              body="These are the same nine states you see on your donation, shown exactly as our system records them."
            />
          </Reveal>
          <Reveal delay={80}>
            <Card className="mt-6 overflow-hidden">
              <div className="hidden border-b border-line bg-cream px-6 py-3 text-[0.7rem] font-bold tracking-wide text-muted uppercase md:grid md:grid-cols-[220px_1fr_150px]">
                <span>Status</span>
                <span>What it means</span>
                <span>Stars</span>
              </div>
              <ul className="divide-y divide-line">
                {STATUS_ORDER.map((s) => (
                  <li
                    key={s}
                    className="grid gap-2 px-6 py-4 md:grid-cols-[220px_1fr_150px] md:items-center md:gap-4"
                  >
                    <span>
                      <StatusPill label={STATUS_META[s].label} tone={STATUS_META[s].tone} />
                    </span>
                    <span className="text-sm leading-relaxed text-ink-soft">
                      {STATUS_MEANING[s]}
                    </span>
                    <span className="text-xs font-bold text-muted">
                      {s === "VERIFIED" ? "Credited here" : s === "REJECTED" ? "Never credited" : "Still pending"}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        </section>

        {/* partners */}
        <section className="mt-16">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow="Partner reporting"
              title="Where the items ended up."
              body="Aggregates reported by our verified partners. Tap through to the NGO dashboard to see the same data from their side."
            />
          </Reveal>
          <Reveal delay={80}>
            <Card className="mt-6 overflow-hidden">
              <ul className="divide-y divide-line">
                {SEED_PARTNERS.map((p) => (
                  <li
                    key={p.id}
                    className="grid gap-3 px-6 py-5 sm:grid-cols-[1fr_auto] sm:items-center"
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold text-ink"
                        style={{ backgroundColor: p.logoBg }}
                      >
                        {p.initials}
                      </span>
                      <div className="min-w-0">
                        <p className="flex flex-wrap items-center gap-2 text-sm font-extrabold text-ink">
                          {p.name}
                          {p.verified ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-mint px-2 py-0.5 text-[0.65rem] font-bold text-forest">
                              <BadgeCheck className="h-3 w-3" /> Verified
                            </span>
                          ) : (
                            <span className="rounded-full bg-gold-soft px-2 py-0.5 text-[0.65rem] font-bold text-gold-deep">
                              Verification in progress
                            </span>
                          )}
                        </p>
                        <p className="mt-0.5 text-xs text-muted">
                          {p.kind} · {p.city} · serving {p.states.join(", ")}
                        </p>
                        <p className="mt-1 line-clamp-1 text-xs text-ink-soft">{p.blurb}</p>
                      </div>
                    </div>
                    <div className="flex gap-6 sm:text-right">
                      <div>
                        <p className="text-lg font-extrabold text-ink tabular-nums">
                          {p.itemsDistributed.toLocaleString("en-IN")}
                        </p>
                        <p className="text-[0.65rem] font-bold text-muted">items distributed</p>
                      </div>
                      <div>
                        <p className="text-lg font-extrabold text-forest tabular-nums">
                          {p.peopleReached.toLocaleString("en-IN")}
                        </p>
                        <p className="text-[0.65rem] font-bold text-muted">people reached</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        </section>

        {/* methodology */}
        <section className="mt-16">
          <div className="grid gap-5 lg:grid-cols-3">
            <Reveal className="lg:col-span-2">
              <Card className="h-full p-7 sm:p-9">
                <h2 className="font-display text-2xl font-semibold text-ink">
                  How these numbers are produced
                </h2>
                <ul className="mt-5 grid gap-4">
                  {[
                    {
                      icon: ClipboardList,
                      t: "Every item is counted twice",
                      b: "Once at pickup by the volunteer, once at the hub by the partner. Mismatches trigger a review before anything is credited.",
                    },
                    {
                      icon: RefreshCcw,
                      t: "Rejected items are excluded",
                      b: "Damaged, unsafe or non-reusable goods are logged separately and never counted as reused.",
                    },
                    {
                      icon: BadgeCheck,
                      t: "Partners sign off on distribution",
                      b: "Counts only move to “distributed” when the partner uploads a report with photos and headcounts.",
                    },
                  ].map((x) => (
                    <li key={x.t} className="flex gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cream text-forest">
                        <x.icon className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block text-sm font-extrabold text-ink">{x.t}</span>
                        <span className="block text-sm leading-relaxed text-muted">{x.b}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-7 rounded-xl bg-cream px-4 py-3 text-xs leading-relaxed text-muted">
                  Last updated 29 September 2026 · Source: SevaKarya operational database, verified
                  donation records only · A full quarterly report is available on request at
                  transparency@sevakarya.com
                </p>
              </Card>
            </Reveal>

            <Reveal delay={90}>
              <Card className="flex h-full flex-col justify-between bg-forest p-7 text-cream">
                <div>
                  <p className="text-xs font-bold tracking-[0.2em] text-mint-deep uppercase">
                    Live platform numbers
                  </p>
                  <dl className="mt-5 grid gap-4">
                    {[
                      ["Partner organisations", PLATFORM_STATS.partners],
                      ["Cities covered", PLATFORM_STATS.cities],
                      ["Verification pass rate", `${Math.round(PLATFORM_STATS.verifiedRate * 100)}%`],
                      ["Items reused", PLATFORM_STATS.itemsReused],
                    ].map(([label, value]) => (
                      <div key={String(label)} className="border-b border-white/12 pb-3">
                        <dd className="font-display text-3xl font-semibold tabular-nums">
                          {typeof value === "number" ? <Counter value={value} /> : value}
                        </dd>
                        <dt className="text-xs font-semibold text-mint-deep">{label}</dt>
                      </div>
                    ))}
                  </dl>
                </div>
                <div className="mt-6 grid gap-3">
                  <Button href="/donate" variant="gold">
                    Donate with confidence
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button href="/ngo" variant="onDark">
                    Open partner dashboard
                  </Button>
                </div>
              </Card>
            </Reveal>
          </div>
        </section>
      </Shell>
    </>
  );
}
