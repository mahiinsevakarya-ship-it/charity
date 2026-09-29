"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Download,
  Inbox,
  MapPin,
  PackageCheck,
  Save,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { CATEGORY_MAP, STATUS_META } from "@/lib/catalog";
import type { Category, Donation, DonationStatus } from "@/lib/types";
import { formatDate, num } from "@/lib/format";
import {
  Button,
  Card,
  Chip,
  EmptyState,
  ProgressBar,
  SectionHeading,
  Skeleton,
  StatusPill,
} from "@/components/ui/primitives";
import { PageHeader, Shell } from "@/components/ui/page";

const PARTNER_ID = "p_vidyasetu";

const NEXT: Partial<Record<DonationStatus, DonationStatus>> = {
  PICKUP_SCHEDULED: "RECEIVED",
  COLLECTED: "RECEIVED",
  RECEIVED: "VERIFIED",
  VERIFIED: "DISTRIBUTED",
  DISTRIBUTED: "COMPLETED",
};

const DEFAULT_NOTES: Partial<Record<DonationStatus, string>> = {
  RECEIVED: "Counted and logged at the Vidya Setu sorting hub.",
  VERIFIED: "Photographed, counted and cleared for distribution.",
  DISTRIBUTED: "Handed over at the government school drive.",
  COMPLETED: "Distribution complete — reported back with photos.",
};

interface Report {
  id: string;
  label: string;
  range: string;
  received: number;
  distributed: number;
  people: number;
  breakdown: { cat: Category; n: number }[];
}

const REPORTS: Report[] = [
  {
    id: "q2-2026",
    label: "Q2 2026",
    range: "Apr – Jun 2026",
    received: 640,
    distributed: 596,
    people: 720,
    breakdown: [
      { cat: "BOOKS", n: 280 },
      { cat: "CLOTHES", n: 210 },
      { cat: "SHOES", n: 96 },
      { cat: "BAGS", n: 54 },
    ],
  },
  {
    id: "q3-2026",
    label: "Q3 2026",
    range: "Jul – Sep 2026",
    received: 812,
    distributed: 744,
    people: 960,
    breakdown: [
      { cat: "BOOKS", n: 340 },
      { cat: "CLOTHES", n: 268 },
      { cat: "SHOES", n: 130 },
      { cat: "BAGS", n: 74 },
    ],
  },
];

type TabId = "incoming" | "distribution" | "needs" | "reports";

const TABS: { id: TabId; label: string }[] = [
  { id: "incoming", label: "Incoming" },
  { id: "distribution", label: "Distribution" },
  { id: "needs", label: "Item needs" },
  { id: "reports", label: "Impact reports" },
];

const itemTotal = (d: Donation) => d.items.reduce((s, i) => s + i.quantity, 0);

export function NgoDashboard() {
  const { donations, partners, ready, setStatus } = useApp();
  const partner = partners.find((p) => p.id === PARTNER_ID);
  const [tab, setTab] = useState<TabId>("incoming");
  const [needs, setNeeds] = useState<Category[]>(partner?.needs ?? []);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const mine = useMemo(
    () =>
      donations
        .filter((d) => d.partnerId === PARTNER_ID)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [donations],
  );

  const distribution = useMemo(
    () => mine.filter((d) => d.status === "DISTRIBUTED" || d.status === "COMPLETED"),
    [mine],
  );

  const itemsReceived = useMemo(() => mine.reduce((s, d) => s + itemTotal(d), 0), [mine]);

  const pendingPickups = useMemo(
    () =>
      mine.filter((d) => !["VERIFIED", "DISTRIBUTED", "COMPLETED", "REJECTED"].includes(d.status))
        .length,
    [mine],
  );

  if (!ready || !partner) {
    return (
      <>
        <PageHeader
          eyebrow="Partner dashboard"
          title="Opening your dashboard…"
          subtitle="Pulling in the donations routed to you."
        />
        <Shell>
          <div className="grid gap-4">
            <Skeleton className="h-44 w-full rounded-3xl" />
            <Skeleton className="h-10 w-80 rounded-xl" />
            <Skeleton className="h-72 w-full rounded-3xl" />
          </div>
        </Shell>
      </>
    );
  }

  const partnerName = partner.name;

  function advance(d: Donation) {
    const to = NEXT[d.status];
    if (!to) return;
    const note = window.prompt(
      `Note for ${d.code} → ${STATUS_META[to].label}`,
      DEFAULT_NOTES[to] ?? "",
    );
    if (note === null) return;
    setStatus(d.id, to, note.trim() || undefined);
  }

  function reportDistribution(d: Donation) {
    const people = Math.max(1, Math.ceil(itemTotal(d) / 4));
    const note = window.prompt(
      `Who received ${d.code}? Donors read this note.`,
      `Handed over to ${people} ${people === 1 ? "person" : "people"} at the weekend drive.`,
    );
    if (note === null) return;
    setStatus(d.id, "COMPLETED", note.trim() || undefined);
  }

  function toggleNeed(key: Category) {
    setNeeds((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key],
    );
    setSavedAt(null);
  }

  function saveNeeds() {
    setSavedAt(
      new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }),
    );
    window.setTimeout(() => setSavedAt(null), 4000);
  }

  function downloadReport(r: Report) {
    const rows: (string | number)[][] = [
      ["ReKindle impact report", partnerName],
      ["Period", `${r.label} (${r.range})`],
      ["Generated", new Date().toLocaleString("en-IN")],
      [],
      ["metric", "value"],
      ["Items received", r.received],
      ["Items distributed", r.distributed],
      ["People reached", r.people],
      [],
      ["category", "items"],
      ...r.breakdown.map((b) => [CATEGORY_MAP[b.cat].label, b.n] as (string | number)[]),
    ];
    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vidyasetu-${r.id}-impact-report.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const counts: Record<TabId, number | undefined> = {
    incoming: mine.length,
    distribution: distribution.length,
    needs: undefined,
    reports: undefined,
  };

  return (
    <>
      <PageHeader
        eyebrow="Partner dashboard"
        title={partner.name}
        subtitle={partner.blurb}
        back={{ href: "/partners", label: "Partner network" }}
        actions={
          <Button href="/transparency" variant="secondary">
            Public transparency page
          </Button>
        }
      />

      <Shell>
        {/* --------------------------- identity card -------------------------- */}
        <Card className="p-6 sm:p-8">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <span
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-lg font-extrabold text-ink"
                style={{ backgroundColor: partner.logoBg }}
                aria-hidden
              >
                {partner.initials}
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-extrabold text-ink">{partner.name}</h2>
                  {partner.verified && (
                    <StatusPill label="Verified partner" tone="success" />
                  )}
                </div>
                <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {partner.city}
                  </span>
                  <span aria-hidden>·</span>
                  <span>Partner since {formatDate(partner.since)}</span>
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {partner.focus.map((f) => (
                    <span
                      key={f}
                      className="rounded-full bg-mint px-3 py-1 text-[0.7rem] font-bold text-forest"
                    >
                      {f}
                    </span>
                  ))}
                </div>
                <p className="mt-3 flex items-center gap-1.5 text-xs font-bold text-forest-soft">
                  <BadgeCheck className="h-4 w-4" />
                  {partner.states.join(" · ")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 lg:min-w-[24rem]">
              {[
                { label: "Items received", value: itemsReceived },
                { label: "People reached", value: partner.peopleReached },
                { label: "Pending pickups", value: pendingPickups },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-line bg-cream px-3 py-4 text-center"
                >
                  <p className="font-display text-2xl font-semibold text-ink tabular-nums sm:text-3xl">
                    {num(s.value)}
                  </p>
                  <p className="mt-1 text-[0.65rem] font-bold uppercase tracking-wide text-muted">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* ------------------------------- tabs ------------------------------- */}
        <div
          role="tablist"
          aria-label="Partner dashboard sections"
          className="no-scrollbar mt-8 flex gap-1 overflow-x-auto border-b border-line"
        >
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.id)}
                className={`shrink-0 border-b-2 px-4 py-3 text-sm font-bold transition-colors ${
                  active
                    ? "border-forest text-forest"
                    : "border-transparent text-muted hover:text-forest"
                }`}
              >
                {t.label}
                {typeof counts[t.id] === "number" && (
                  <span
                    className={`ml-2 rounded-full px-2 py-0.5 text-[0.7rem] ${
                      active ? "bg-mint text-forest" : "bg-sand text-ink-soft"
                    }`}
                  >
                    {counts[t.id]}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ----------------------------- incoming ----------------------------- */}
        {tab === "incoming" && (
          <div role="tabpanel" className="mt-6">
            {mine.length === 0 ? (
              <EmptyState
                title="Nothing on the way yet"
                body="When donors pick Vidya Setu Trust, their donations show up here with a pickup slot and a status you can move forward."
                action={
                  <Button href="/partners#network" variant="secondary">
                    See your public card
                  </Button>
                }
                icon={<Inbox className="h-7 w-7" />}
              />
            ) : (
              <ul className="grid gap-4">
                {mine.map((d) => {
                  const meta = STATUS_META[d.status];
                  const to = NEXT[d.status];
                  return (
                    <li key={d.id}>
                      <Card className="p-5 sm:p-6">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <Link
                            href={`/my-donations/${d.code}`}
                            className="text-base font-extrabold text-ink underline-offset-4 transition-colors hover:text-forest hover:underline"
                          >
                            {d.code}
                          </Link>
                          <StatusPill label={meta.label} tone={meta.tone} />
                        </div>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {d.items.map((it) => (
                            <span
                              key={it.id}
                              className="rounded-full border border-line bg-cream px-3 py-1 text-[0.72rem] font-bold text-ink-soft"
                            >
                              <span aria-hidden>{CATEGORY_MAP[it.category].emoji}</span>{" "}
                              {it.quantity} {it.unit} · {CATEGORY_MAP[it.category].label}
                            </span>
                          ))}
                        </div>

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                          <p className="text-xs text-muted">
                            Donated {formatDate(d.createdAt)}
                            {d.pickup.slot ? ` · ${d.pickup.slot}` : ""}
                          </p>
                          {to ? (
                            <Button size="sm" variant="secondary" onClick={() => advance(d)}>
                              Mark {STATUS_META[to].label.toLowerCase()}
                            </Button>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-mint px-3 py-1 text-xs font-bold text-forest">
                              <BadgeCheck className="h-3.5 w-3.5" />
                              Closed out
                            </span>
                          )}
                        </div>
                      </Card>
                    </li>
                  );
                })}
              </ul>
            )}
            <p className="mt-5 text-xs leading-relaxed text-muted">
              Every status change is visible to the donor at{" "}
              <Link
                href="/my-donations"
                className="font-bold text-forest underline underline-offset-4"
              >
                /my-donations
              </Link>
              , with the note you write attached to the timeline.
            </p>
          </div>
        )}

        {/* ---------------------------- distribution -------------------------- */}
        {tab === "distribution" && (
          <div role="tabpanel" className="mt-6">
            {distribution.length === 0 ? (
              <EmptyState
                title="No handovers to report yet"
                body="Once a verified donation moves to distributed, it lands here so you can report how many people received it — donors see that note on their receipt."
                action={
                  <Button variant="secondary" onClick={() => setTab("incoming")}>
                    Go to incoming
                  </Button>
                }
                icon={<PackageCheck className="h-7 w-7" />}
              />
            ) : (
              <ul className="grid gap-4 sm:grid-cols-2">
                {distribution.map((d) => {
                  const people = Math.max(1, Math.ceil(itemTotal(d) / 4));
                  const done = d.status === "COMPLETED";
                  const progress = done ? 100 : 62;
                  return (
                    <li key={d.id}>
                      <Card className="flex h-full flex-col p-6">
                        <div className="flex items-center justify-between gap-3">
                          <Link
                            href={`/my-donations/${d.code}`}
                            className="font-extrabold text-ink underline-offset-4 hover:text-forest hover:underline"
                          >
                            {d.code}
                          </Link>
                          <StatusPill
                            label={done ? "Reported" : STATUS_META[d.status].label}
                            tone={done ? "success" : "active"}
                          />
                        </div>

                        <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                          Handed over to{" "}
                          <span className="font-extrabold text-ink">
                            {people} {people === 1 ? "person" : "people"}
                          </span>{" "}
                          · {itemTotal(d)} items in this batch.
                        </p>

                        <div className="mt-4">
                          <div className="mb-2 flex items-baseline justify-between text-xs font-bold">
                            <span className="text-muted">
                              {done ? "Reported back to the donor" : "Handed over · report pending"}
                            </span>
                            <span className="text-forest tabular-nums">{progress}%</span>
                          </div>
                          <ProgressBar value={progress} />
                        </div>

                        <div className="mt-5 flex-1" />
                        {done ? (
                          <p className="rounded-xl bg-mint px-4 py-3 text-xs font-bold leading-relaxed text-forest">
                            Thanks — the donor has this note on their timeline.
                          </p>
                        ) : (
                          <Button size="sm" onClick={() => reportDistribution(d)}>
                            <Save className="h-4 w-4" />
                            Report distribution
                          </Button>
                        )}
                      </Card>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

        {/* ----------------------------- item needs --------------------------- */}
        {tab === "needs" && (
          <div role="tabpanel" className="mt-6">
            <Card className="p-6 sm:p-8">
              <SectionHeading
                align="left"
                eyebrow="Live needs list"
                title="What Vidya Setu needs right now"
                body="Donors see this list on your public card and inside the donation flow. Switch something off the moment you are stocked up."
              />
              <div className="mt-7 flex flex-wrap gap-2">
                {(
                  [
                    ["CLOTHES", "👕"],
                    ["BOOKS", "📚"],
                    ["SHOES", "👟"],
                    ["BAGS", "🎒"],
                    ["TOYS", "🧸"],
                    ["OTHER", "🏠"],
                  ] as [Category, string][]
                ).map(([key, emoji]) => (
                  <Chip
                    key={key}
                    active={needs.includes(key)}
                    onClick={() => toggleNeed(key)}
                  >
                    <span aria-hidden>{emoji}</span>
                    {CATEGORY_MAP[key].label}
                  </Chip>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-4 border-t border-line pt-6">
                <Button onClick={saveNeeds} disabled={needs.length === 0}>
                  <Save className="h-4 w-4" />
                  Save needs
                </Button>
                {needs.length === 0 && (
                  <span className="text-xs font-semibold text-clay">
                    Keep at least one category on — an empty list hides your card from the feed.
                  </span>
                )}
                {savedAt && (
                  <span className="anim-slide-up rounded-xl bg-mint px-4 py-2.5 text-xs font-bold text-forest">
                    Saved at {savedAt} — donors now see {needs.length}{" "}
                    {needs.length === 1 ? "category" : "categories"}.
                  </span>
                )}
              </div>

              <dl className="mt-6 grid gap-3 rounded-2xl border border-line bg-cream px-5 py-5 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wide text-muted">
                    Currently on your card
                  </dt>
                  <dd className="mt-1 font-bold text-ink">
                    {needs.length
                      ? needs.map((n) => CATEGORY_MAP[n].label).join(" · ")
                      : "Nothing selected"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wide text-muted">
                    Service areas
                  </dt>
                  <dd className="mt-1 font-bold text-ink">{partner.states.join(" · ")}</dd>
                </div>
              </dl>
            </Card>
          </div>
        )}

        {/* --------------------------- impact reports ------------------------- */}
        {tab === "reports" && (
          <div role="tabpanel" className="mt-6">
            <SectionHeading
              align="left"
              eyebrow="Impact reports"
              title="Quarterly numbers, ready to share"
              body="Counts are pulled from what you reported on each batch. Download a CSV for your trustees, or send it straight to the donors who made it happen."
            />
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {REPORTS.map((r) => {
                const max = Math.max(...r.breakdown.map((b) => b.n), 1);
                return (
                  <Card key={r.id} className="flex h-full flex-col p-6 sm:p-7">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-display text-2xl font-semibold text-ink">{r.label}</p>
                        <p className="mt-1 text-xs font-bold text-muted">{r.range}</p>
                      </div>
                      <Button size="sm" variant="secondary" onClick={() => downloadReport(r)}>
                        <Download className="h-4 w-4" />
                        Download report
                      </Button>
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                      {[
                        { label: "Items received", value: r.received },
                        { label: "Distributed", value: r.distributed },
                        { label: "People reached", value: r.people },
                      ].map((s, i) => (
                        <div
                          key={s.label}
                          className={`rounded-2xl px-2 py-4 ${
                            i === 2 ? "bg-mint" : "bg-cream"
                          } border border-line`}
                        >
                          <p className="font-display text-2xl font-semibold text-ink tabular-nums">
                            {num(s.value)}
                          </p>
                          <p className="mt-1 text-[0.65rem] font-bold uppercase tracking-wide text-muted">
                            {s.label}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 space-y-3">
                      <p className="text-xs font-bold uppercase tracking-wide text-muted">
                        What moved
                      </p>
                      {r.breakdown.map((b, idx) => (
                        <div key={b.cat}>
                          <div className="mb-1.5 flex items-baseline justify-between text-xs">
                            <span className="font-bold text-ink">
                              {CATEGORY_MAP[b.cat].emoji} {CATEGORY_MAP[b.cat].label}
                            </span>
                            <span className="font-extrabold text-ink-soft tabular-nums">
                              {num(b.n)}
                            </span>
                          </div>
                          <ProgressBar
                            value={(b.n / max) * 100}
                            tone={idx % 2 === 1 ? "gold" : "forest"}
                          />
                        </div>
                      ))}
                    </div>

                    <p className="mt-6 border-t border-line pt-4 text-xs leading-relaxed text-muted">
                      {num(r.distributed)} of {num(r.received)} items were handed over this quarter —
                      the rest are queued for the next drive.
                    </p>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* ------------------------------ footer ------------------------------ */}
        <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-[2rem] border border-line bg-cream px-6 py-6 sm:flex-row sm:items-center sm:px-8">
          <p className="max-w-2xl text-sm leading-relaxed text-muted">
            These numbers feed the public{" "}
            <Link
              href="/transparency"
              className="font-bold text-forest underline underline-offset-4"
            >
              transparency page
            </Link>
            . Need a change to your profile or a data pull? Write to{" "}
            <span className="font-bold text-ink">partners@rekindle.org</span> and we will sort it
            the same working day.
          </p>
          <Button href="/partners#network" variant="secondary" className="shrink-0">
            Your public card
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </Shell>
    </>
  );
}
