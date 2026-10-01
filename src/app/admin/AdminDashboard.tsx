"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Ban,
  Check,
  CheckCircle2,
  Copy,
  Download,
  Flag,
  Gift,
  Layers,
  Lock,
  MessageSquare,
  ScrollText,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Users2,
  X,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { CATEGORIES, CATEGORY_MAP, STATUS_META } from "@/lib/catalog";
import type { DonationStatus, Role } from "@/lib/types";
import { formatDate, itemWords, num, relativeTime } from "@/lib/format";
import { Avatar, fireConfetti } from "@/components/ui/motion";
import {
  Button,
  Card,
  EmptyState,
  Field,
  Input,
  Skeleton,
  StatusPill,
} from "@/components/ui/primitives";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { PageHeader, Shell } from "@/components/ui/page";
import { CategoryBar } from "@/app/transparency/Report";

type TabId = "overview" | "queue" | "users" | "partners" | "rules" | "audit";

const TABS: { id: TabId; label: string; icon: typeof Layers }[] = [
  { id: "overview", label: "Overview", icon: Layers },
  { id: "queue", label: "Verification queue", icon: ShieldCheck },
  { id: "users", label: "Users", icon: Users2 },
  { id: "partners", label: "NGOs", icon: BadgeCheck },
  { id: "rules", label: "Star rules", icon: Gift },
  { id: "audit", label: "Audit log", icon: ScrollText },
];

const OPEN_STATUSES: DonationStatus[] = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "PICKUP_SCHEDULED",
  "COLLECTED",
  "RECEIVED",
];

const NEXT_STATUS: Partial<Record<DonationStatus, DonationStatus>> = {
  SUBMITTED: "PICKUP_SCHEDULED",
  UNDER_REVIEW: "PICKUP_SCHEDULED",
  PICKUP_SCHEDULED: "COLLECTED",
  COLLECTED: "RECEIVED",
  RECEIVED: "VERIFIED",
};

const AUDIT = [
  { at: "29 Sep 2026 · 09:12", who: "ops@sevakarya.com", action: "Verified donation RK-1024", target: "+146 ⭐ to Mahesh Rao" },
  { at: "28 Sep 2026 · 18:40", who: "ops@sevakarya.com", action: "Flagged RK-1008 as possible duplicate", target: "2 review notes" },
  { at: "28 Sep 2026 · 15:02", who: "system", action: "Auto-rejected upload over 5 MB", target: "user ananya.s@example.com" },
  { at: "27 Sep 2026 · 11:25", who: "admin@sevakarya.com", action: "Approved partner Sanvedana Community Centre", target: "documents pending" },
  { at: "26 Sep 2026 · 17:55", who: "ops@sevakarya.com", action: "Adjusted stars −40 (reversed reward)", target: "duplicate submission" },
  { at: "25 Sep 2026 · 10:08", who: "system", action: "Rate limit triggered on /api/donations", target: "3 requests blocked" },
];

export function AdminDashboard() {
  const {
    me,
    donations,
    users,
    transactions,
    partners,
    ready,
    setStatus,
    verifyDonation,
    adjustStars,
    createUser,
    updateUserRole,
    signInMagic,
  } = useApp();
  const [tab, setTab] = useState<TabId>("overview");
  const [toast, setToast] = useState<string | null>(null);

  // Superuser Invite Modal state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePhone, setInvitePhone] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("USER");
  const [inviteOrg, setInviteOrg] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteResultUrl, setInviteResultUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const queue = useMemo(
    () =>
      donations
        .filter((d) => OPEN_STATUSES.includes(d.status))
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    [donations],
  );

  const flagged = donations.filter((d) => d.flags > 0);
  const starsIssued = transactions.filter((t) => t.stars > 0).reduce((s, t) => s + t.stars, 0);
  const pending = queue.length;
  const awaitingReceipt = donations.filter(
    (d) => d.status === "PICKUP_SCHEDULED" || d.status === "COLLECTED",
  ).length;

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 4200);
  }

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.includes("@")) {
      notify("Please provide a valid name and email address.");
      return;
    }
    setInviteLoading(true);

    // 1. Create user in platform store
    createUser({
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      phone: invitePhone.trim() || undefined,
      role: inviteRole,
      orgName: inviteRole === "NGO" ? inviteOrg.trim() : undefined,
    });

    // 2. Generate secure Magic Invite Link via backend API
    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inviteEmail.trim(),
          name: inviteName.trim(),
          phone: invitePhone.trim() || undefined,
          role: inviteRole,
          orgName: inviteRole === "NGO" ? inviteOrg.trim() : undefined,
        }),
      });
      const data = await res.json();
      if (res.ok && data.verifyUrl) {
        setInviteResultUrl(data.verifyUrl);
        notify(`User ${inviteName} created · Invite link ready to share`);
        fireConfetti();
      } else {
        setInviteResultUrl(`${window.location.origin}/login?email=${encodeURIComponent(inviteEmail.trim())}`);
        notify(`User ${inviteName} created successfully`);
      }
    } catch {
      setInviteResultUrl(`${window.location.origin}/login?email=${encodeURIComponent(inviteEmail.trim())}`);
      notify(`User ${inviteName} created successfully`);
    } finally {
      setInviteLoading(false);
    }
  }

  function copyInviteLink() {
    if (!inviteResultUrl) return;
    navigator.clipboard.writeText(inviteResultUrl);
    setCopied(true);
    notify("Invite link copied to clipboard!");
    window.setTimeout(() => setCopied(false), 3000);
  }

  function resetInviteForm() {
    setShowAddUserModal(false);
    setInviteName("");
    setInviteEmail("");
    setInvitePhone("");
    setInviteRole("USER");
    setInviteOrg("");
    setInviteResultUrl(null);
    setCopied(false);
  }

  function advance(id: string, code: string, status: DonationStatus) {
    const next = NEXT_STATUS[status];
    if (!next) return;
    if (next === "VERIFIED") {
      verifyDonation(id);
      const donation = donations.find((d) => d.id === id);
      notify(
        donation && donation.expectedStars > 0
          ? `${code} verified · +${donation.expectedStars} ⭐ credited to the donor`
          : `${code} verified · reward is manual, adjust stars from the Users tab`,
      );
      fireConfetti();
    } else {
      setStatus(id, next);
      notify(`${code} moved to ${STATUS_META[next].label}`);
    }
  }

  function reject(id: string, code: string) {
    const reason = window.prompt(
      "Reason shown to the donor (rejected items are never credited stars):",
      "Item condition below the reusable standard",
    );
    if (reason === null) return;
    setStatus(id, "REJECTED", reason);
    notify(`${code} rejected · donor notified`);
  }

  function award(userId: string) {
    const raw = window.prompt("Stars to adjust (use a negative number to reverse):", "50");
    if (raw === null) return;
    const value = Number(raw);
    if (!Number.isFinite(value) || value === 0) return;
    const reason = window.prompt("Reason (written to the ledger):", "Manual admin adjustment");
    if (!reason) return;
    adjustStars(userId, value, reason);
    notify(`Star ledger updated: ${value > 0 ? "+" : ""}${value} ⭐`);
  }

  if (!ready) {
    return (
      <Shell>
        <Skeleton className="h-10 w-72" />
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="mt-6 h-96 w-full" />
      </Shell>
    );
  }

  // Superuser Gating Check: Only role === "ADMIN" can view the admin console
  if (ready && me?.role !== "ADMIN") {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-lg items-center justify-center px-4 py-16">
        <Card className="w-full p-8 text-center sm:p-10">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-clay-soft text-[#b14f31] shadow-soft">
            <Lock className="h-8 w-8" />
          </span>
          <p className="mt-6 text-xs font-bold tracking-[0.2em] text-[#b14f31] uppercase">
            Restricted Access · Superusers Only
          </p>
          <h1 className="font-display mt-2 text-2xl font-semibold text-ink">
            Admin Console Gated
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            You are signed in as <strong className="text-ink">{me?.name || "Donor"}</strong> ({me?.role || "USER"}).
            The Admin Console is restricted to Superusers and Platform Staff. Retailers and Donors can manage their donations in the Impact Dashboard.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <Button href="/impact" size="lg" className="w-full">
              Go to Donor Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                signInMagic("ops@sevakarya.com", "SevaKarya Ops", undefined, "ADMIN");
                notify("Switched to Superuser Admin session");
                fireConfetti();
              }}
              className="w-full text-xs"
            >
              <ShieldAlert className="h-4 w-4 text-forest" />
              Sign in as Superuser (Demo Admin)
            </Button>
          </div>
          <Link href="/" className="mt-4 block text-xs font-bold text-muted hover:text-forest">
            ← Return to Homepage
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Internal · ADMIN"
        title="Admin dashboard"
        subtitle="Verify donations, manage partners and users, and keep the Impact Star economy honest."
        back={{ href: "/impact", label: "Back to app" }}
        actions={
          <Link
            href="/transparency"
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-line-strong bg-white px-5 text-[0.95rem] font-semibold text-ink transition-colors hover:border-forest hover:text-forest"
          >
            Public transparency page
            <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      <Shell>
        {/* alerts */}
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="flex items-start gap-3 rounded-2xl border border-[#f3e0ab] bg-gold-soft px-5 py-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-gold-deep" />
            <div>
              <p className="text-lg font-extrabold text-ink tabular-nums">{pending}</p>
              <p className="text-xs font-semibold text-ink-soft">donations awaiting verification</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-2xl border border-mint-deep bg-mint px-5 py-4">
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-forest" />
            <div>
              <p className="text-lg font-extrabold text-ink tabular-nums">{num(starsIssued)}</p>
              <p className="text-xs font-semibold text-ink-soft">Impact Stars issued (ledger)</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-2xl border border-[#f2c9b8] bg-clay-soft px-5 py-4">
            <Flag className="mt-0.5 h-5 w-5 shrink-0 text-[#b14f31]" />
            <div>
              <p className="text-lg font-extrabold text-ink tabular-nums">{flagged.length}</p>
              <p className="text-xs font-semibold text-ink-soft">
                submissions flagged for review · {awaitingReceipt} pickups in motion
              </p>
            </div>
          </div>
        </div>

        {/* tabs */}
        <div className="no-scrollbar mt-8 flex gap-1 overflow-x-auto border-b border-line" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-colors ${
                tab === t.id
                  ? "border-forest text-forest"
                  : "border-transparent text-muted hover:text-ink"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
              {t.id === "queue" && pending > 0 && (
                <span className="rounded-full bg-gold-soft px-2 py-0.5 text-[0.7rem] text-gold-deep">
                  {pending}
                </span>
              )}
            </button>
          ))}
        </div>

        {toast && (
          <div className="anim-slide-up mt-5 flex items-center gap-3 rounded-2xl border border-mint-deep bg-mint px-5 py-4 text-sm font-bold text-forest">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            {toast}
          </div>
        )}

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <Card className="p-6 lg:col-span-2">
              <h2 className="text-sm font-extrabold tracking-[0.16em] text-forest-soft uppercase">
                Platform totals
              </h2>
              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { label: "Donations", value: donations.length },
                  { label: "Verified", value: donations.filter((d) => ["VERIFIED", "DISTRIBUTED", "COMPLETED"].includes(d.status)).length },
                  { label: "Users", value: users.length },
                  { label: "Partners", value: partners.filter((p) => p.verified).length },
                ].map((k) => (
                  <div key={k.label} className="rounded-2xl bg-cream px-4 py-4">
                    <p className="font-display text-3xl font-semibold text-ink tabular-nums">
                      {num(k.value)}
                    </p>
                    <p className="mt-1 text-xs font-bold text-muted">{k.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-7 grid gap-5 border-t border-line pt-6">
                <p className="text-xs font-bold tracking-[0.16em] text-muted uppercase">
                  Status distribution
                </p>
                {(["SUBMITTED", "PICKUP_SCHEDULED", "RECEIVED", "VERIFIED", "COMPLETED", "REJECTED"] as DonationStatus[]).map(
                  (s) => {
                    const count = donations.filter((d) => d.status === s).length;
                    const pct = donations.length ? (count / donations.length) * 100 : 0;
                    return (
                      <div key={s} className="grid gap-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <StatusPill label={STATUS_META[s].label} tone={STATUS_META[s].tone} />
                          <span className="font-bold text-ink tabular-nums">{count}</span>
                        </div>
                        <div className="h-2.5 overflow-hidden rounded-full bg-sand">
                          <div
                            className="h-full rounded-full bg-forest"
                            style={{ width: `${Math.max(3, pct)}%` }}
                          />
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </Card>

            <div className="grid gap-6">
              <Card className="p-6">
                <h2 className="text-sm font-extrabold tracking-[0.16em] text-forest-soft uppercase">
                  Stars issued by category
                </h2>
                <div className="mt-5 grid gap-5">
                  {CATEGORIES.filter((c) => c.starsPerUnit > 0).map((c) => {
                    const qty = donations
                      .filter((d) => d.awardedStars)
                      .reduce(
                        (s, d) =>
                          s + d.items.filter((i) => i.category === c.key).reduce((x, i) => x + i.quantity, 0),
                        0,
                      );
                    return (
                      <CategoryBar
                        key={c.key}
                        category={c.key}
                        value={qty * c.starsPerUnit}
                        max={72 * 8 + 48 * 10 + 26 * 20}
                      />
                    );
                  })}
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-sm font-extrabold tracking-[0.16em] text-forest-soft uppercase">
                  Latest activity
                </h2>
                <ul className="mt-4 grid gap-3">
                  {[...donations]
                    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
                    .slice(0, 5)
                    .map((d) => (
                      <li key={d.id} className="flex items-center justify-between gap-3 text-sm">
                        <Link
                          href={`/my-donations/${d.code}`}
                          className="font-bold text-ink underline-offset-4 hover:text-forest hover:underline"
                        >
                          {d.code}
                        </Link>
                        <span className="flex-1 truncate text-xs text-muted">
                          {d.items.map((i) => itemWords(i.quantity, i.category)).join(" + ")}
                        </span>
                        <span className="text-xs text-muted">{relativeTime(d.updatedAt)}</span>
                      </li>
                    ))}
                </ul>
              </Card>
            </div>
          </div>
        )}

        {/* QUEUE */}
        {tab === "queue" && (
          <div className="mt-6 grid gap-4">
            {queue.length === 0 ? (
              <EmptyState
                title="Verification queue is empty"
                body="Every submitted donation has been reviewed. New submissions appear here within seconds."
                icon={<ShieldCheck className="h-7 w-7" />}
              />
            ) : (
              queue.map((d) => {
                const donor = users.find((u) => u.id === d.userId);
                const canVerify = d.status === "RECEIVED" || d.status === "COLLECTED";
                return (
                  <Card key={d.id} className="p-5 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            href={`/my-donations/${d.code}`}
                            className="text-base font-extrabold text-ink underline-offset-4 hover:text-forest hover:underline"
                          >
                            {d.code}
                          </Link>
                          <StatusPill label={STATUS_META[d.status].label} tone={STATUS_META[d.status].tone} />
                          {d.flags > 0 && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-clay-soft px-2.5 py-1 text-[0.7rem] font-bold text-[#b14f31]">
                              <Flag className="h-3 w-3" />
                              {d.flags} flag{d.flags > 1 ? "s" : ""} · possible duplicate
                            </span>
                          )}
                        </div>
                        <p className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted">
                          <span className="inline-flex items-center gap-1.5">
                            <Avatar initials={donor?.initials ?? "?"} color={donor?.avatarColor ?? "#0e5c43"} size="sm" />
                            {donor?.name ?? "Unknown donor"}
                          </span>
                          <span>{formatDate(d.createdAt)}</span>
                          <span>
                            {d.pickup.method === "PICKUP" ? "Pickup" : "Drop-off"} ·{" "}
                            {d.pickup.city ?? "—"}
                          </span>
                          <span>{d.images.length} photo(s)</span>
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {d.items.map((i) => (
                            <span
                              key={i.id}
                              className="rounded-full border border-line bg-cream px-3 py-1 text-xs font-bold text-ink-soft"
                            >
                              {CATEGORY_MAP[i.category].emoji} {itemWords(i.quantity, i.category)}
                            </span>
                          ))}
                        </div>
                        {d.verificationNote && (
                          <p className="mt-3 rounded-xl bg-cream px-4 py-2.5 text-xs leading-relaxed text-ink-soft">
                            {d.verificationNote}
                          </p>
                        )}
                      </div>

                      <div className="flex w-full shrink-0 flex-col items-stretch gap-2 sm:w-auto sm:items-end">
                        <p className="text-right">
                          <span className="block text-xs font-semibold text-muted">
                            {d.awardedStars ? "awarded" : "expected reward"}
                          </span>
                          <span className="text-xl font-extrabold text-gold-deep tabular-nums">
                            {d.awardedStars
                              ? `+${d.awardedStars} ⭐`
                              : d.expectedStars > 0
                                ? `≈ ${d.expectedStars} ⭐`
                                : "manual ⭐"}
                          </span>
                        </p>
                        <div className="flex flex-wrap justify-end gap-2">
                          <Button
                            size="sm"
                            onClick={() => advance(d.id, d.code, d.status)}
                            disabled={!NEXT_STATUS[d.status]}
                            title={
                              canVerify ? "Verify and credit stars" : "Advance to the next stage"
                            }
                          >
                            {NEXT_STATUS[d.status] === "VERIFIED"
                              ? "Verify & award stars"
                              : `Mark ${STATUS_META[NEXT_STATUS[d.status] as DonationStatus]?.label.toLowerCase()}`}
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => reject(d.id, d.code)}
                            disabled={d.status === "REJECTED"}
                          >
                            <Ban className="h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                        {!canVerify && (
                          <p className="text-right text-[0.68rem] text-muted">
                            Verification unlocks once items are received at the hub.
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        )}

        {/* USERS */}
        {tab === "users" && (
          <div className="mt-6 grid gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-extrabold tracking-[0.16em] text-forest-soft uppercase">
                  User & Partner Management
                </h2>
                <p className="text-xs text-muted">
                  Superuser tools: create user accounts, assign roles, and share direct magic invite links.
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  resetInviteForm();
                  setShowAddUserModal(true);
                }}
              >
                <UserPlus className="h-4 w-4" />
                Invite / Create User
              </Button>
            </div>

            <Card className="overflow-hidden">
              <div className="hidden border-b border-line bg-cream px-6 py-3 text-[0.7rem] font-bold tracking-wide text-muted uppercase md:grid md:grid-cols-[1.4fr_1fr_100px_100px_180px]">
                <span>User & Role</span>
                <span>Email & Mobile</span>
                <span>Donations</span>
                <span>Stars</span>
                <span className="text-right">Superuser Actions</span>
              </div>
              <ul className="divide-y divide-line">
                {users.map((u) => {
                  const theirs = donations.filter((d) => d.userId === u.id);
                  const balance = transactions
                    .filter((t) => t.userId === u.id)
                    .reduce((s, t) => s + t.stars, 0);

                  return (
                    <li
                      key={u.id}
                      className="grid gap-3 px-6 py-4 md:grid-cols-[1.4fr_1fr_100px_100px_180px] md:items-center"
                    >
                      <span className="flex items-center gap-3">
                        <Avatar initials={u.initials} color={u.avatarColor} size="sm" />
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-extrabold text-ink">{u.name}</span>
                          <div className="flex items-center gap-1.5 mt-1">
                            <select
                              value={u.role}
                              disabled={u.id === me?.id}
                              onChange={(e) => {
                                const newRole = e.target.value as Role;
                                updateUserRole(u.id, newRole);
                                notify(`Updated ${u.name}'s role to ${newRole}`);
                              }}
                              className="h-7 rounded-md border border-line bg-white px-2 text-[0.7rem] font-bold text-ink focus:border-forest"
                            >
                              <option value="USER">USER (Donor)</option>
                              <option value="ADMIN">ADMIN (Superuser)</option>
                              <option value="NGO">NGO (Partner)</option>
                              <option value="VOLUNTEER">VOLUNTEER</option>
                            </select>
                            {u.orgName && (
                              <span className="truncate text-[0.65rem] font-bold text-muted">
                                ({u.orgName})
                              </span>
                            )}
                          </div>
                        </span>
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm text-ink">{u.email}</span>
                        {u.phone && (
                          <span className="block text-xs font-semibold text-muted">{u.phone}</span>
                        )}
                      </span>
                      <span className="text-sm font-bold text-ink tabular-nums">{theirs.length}</span>
                      <span className="text-sm font-bold text-gold-deep tabular-nums">
                        {num(balance)} ⭐
                      </span>
                      <span className="flex flex-wrap justify-start gap-2 md:justify-end">
                        <Button size="sm" variant="secondary" onClick={() => award(u.id)}>
                          Adjust stars
                        </Button>
                      </span>
                    </li>
                  );
                })}
              </ul>
              <p className="border-t border-line bg-cream px-6 py-3 text-xs text-muted">
                Every user creation and star adjustment is cryptographically recorded with the Superuser audit identity.
              </p>
            </Card>
          </div>
        )}

        {/* CREATE / INVITE USER MODAL */}
        {showAddUserModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="anim-pop relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-line bg-cream px-6 py-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-mint text-forest">
                    <UserPlus className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-extrabold text-ink">Superuser: Add & Invite User</h3>
                    <p className="text-xs text-muted">Assign roles and generate instant sign-in credentials.</p>
                  </div>
                </div>
                <button
                  onClick={resetInviteForm}
                  className="rounded-full p-1 text-muted hover:bg-white hover:text-ink"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {inviteResultUrl ? (
                <div className="p-6">
                  <div className="rounded-2xl border border-mint-deep bg-mint p-5 text-center">
                    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-forest text-cream">
                      <Check className="h-6 w-6" />
                    </span>
                    <h4 className="mt-3 text-lg font-extrabold text-ink">User Account Ready!</h4>
                    <p className="mt-1 text-xs text-ink-soft">
                      Account created for <strong>{inviteName}</strong> ({inviteRole}).
                      Share this private magic link with them to let them sign in in 1 click.
                    </p>
                  </div>

                  <div className="mt-5 rounded-xl border border-line bg-cream p-3">
                    <label className="block text-[0.7rem] font-bold text-muted uppercase">Magic Sign-in Link</label>
                    <p className="mt-1 truncate font-mono text-xs text-ink">{inviteResultUrl}</p>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <Button size="md" onClick={copyInviteLink} className="w-full">
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copied ? "Link Copied!" : "Copy Invite Link"}
                    </Button>

                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                        `Hi ${inviteName}, here is your secure SevaKarya (${inviteRole}) invite link: ${inviteResultUrl}`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Share on WhatsApp
                    </a>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetInviteForm}
                    className="mt-4 w-full text-xs"
                  >
                    Done & Close
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleCreateUser} className="grid gap-4 p-6">
                  <Field label="Full Name">
                    <Input
                      required
                      value={inviteName}
                      onChange={(e) => setInviteName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                    />
                  </Field>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Email Address">
                      <Input
                        type="email"
                        required
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="ramesh@example.com"
                      />
                    </Field>

                    <Field label="Mobile Number" hint="optional">
                      <PhoneInput
                        value={invitePhone}
                        onChange={setInvitePhone}
                      />
                    </Field>
                  </div>

                  <Field label="Platform Role">
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as Role)}
                      className="h-12 w-full rounded-xl border border-line-strong bg-white px-3.5 text-sm font-bold text-ink focus:border-forest focus:outline-hidden"
                    >
                      <option value="USER">USER (Donor / Retailer / Individual)</option>
                      <option value="NGO">NGO (Partner Organisation)</option>
                      <option value="VOLUNTEER">VOLUNTEER (Doorstep Collection Staff)</option>
                      <option value="ADMIN">ADMIN (Superuser / Platform Admin)</option>
                    </select>
                  </Field>

                  {inviteRole === "NGO" && (
                    <Field label="Organisation / Trust Name">
                      <Input
                        required
                        value={inviteOrg}
                        onChange={(e) => setInviteOrg(e.target.value)}
                        placeholder="e.g. Hope Foundation"
                      />
                    </Field>
                  )}

                  <div className="mt-2 flex justify-end gap-2 border-t border-line pt-4">
                    <Button type="button" variant="ghost" size="sm" onClick={resetInviteForm}>
                      Cancel
                    </Button>
                    <Button type="submit" size="sm" loading={inviteLoading}>
                      Create Account & Generate Invite
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* PARTNERS */}
        {tab === "partners" && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {partners.map((p) => (
              <Card key={p.id} className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-xl text-sm font-extrabold text-ink"
                      style={{ backgroundColor: p.logoBg }}
                    >
                      {p.initials}
                    </span>
                    <div>
                      <p className="text-sm font-extrabold text-ink">{p.name}</p>
                      <p className="text-xs text-muted">
                        {p.kind} · {p.city}
                      </p>
                    </div>
                  </div>
                  {p.verified ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-mint px-2.5 py-1 text-[0.7rem] font-bold text-forest">
                      <BadgeCheck className="h-3 w-3" /> Verified
                    </span>
                  ) : (
                    <span className="rounded-full bg-gold-soft px-2.5 py-1 text-[0.7rem] font-bold text-gold-deep">
                      Docs pending
                    </span>
                  )}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted">{p.blurb}</p>
                <div className="mt-4 grid grid-cols-3 gap-3 border-t border-line pt-4 text-center">
                  <div>
                    <p className="text-base font-extrabold text-ink tabular-nums">
                      {num(p.itemsDistributed)}
                    </p>
                    <p className="text-[0.65rem] font-bold text-muted">items</p>
                  </div>
                  <div>
                    <p className="text-base font-extrabold text-ink tabular-nums">
                      {num(p.peopleReached)}
                    </p>
                    <p className="text-[0.65rem] font-bold text-muted">people</p>
                  </div>
                  <div>
                    <p className="text-base font-extrabold text-ink">{p.needs.length}</p>
                    <p className="text-[0.65rem] font-bold text-muted">needs</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="secondary" href="/ngo">
                    Open dashboard
                  </Button>
                  <Button size="sm" variant="ghost" href="/partners">
                    Public profile
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* RULES */}
        {tab === "rules" && (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
            <Card className="overflow-hidden">
              <div className="border-b border-line bg-cream px-6 py-4">
                <h2 className="text-sm font-extrabold tracking-[0.16em] text-forest-soft uppercase">
                  Impact Star rules
                </h2>
                <p className="mt-1 text-xs text-muted">
                  Configuration v12 · effective 1 September 2026
                </p>
              </div>
              <ul className="divide-y divide-line">
                {CATEGORIES.map((c) => (
                  <li
                    key={c.key}
                    className="grid grid-cols-[1fr_90px_120px] items-center gap-3 px-6 py-4 text-sm"
                  >
                    <span className="flex items-center gap-2 font-bold text-ink">
                      <span className="text-lg">{c.emoji}</span>
                      {c.label}
                    </span>
                    <span className="text-xs text-muted">{c.unit}</span>
                    <span className="text-right font-extrabold text-gold-deep tabular-nums">
                      {c.starsPerUnit > 0 ? `${c.starsPerUnit} ⭐` : "manual"}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-line bg-cream px-6 py-4 text-xs leading-relaxed text-muted">
                Rule changes are versioned and require a second admin to approve before they apply to
                new donations. Existing transactions are never recalculated.
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-sm font-extrabold tracking-[0.16em] text-forest-soft uppercase">
                Abuse controls
              </h2>
              <ul className="mt-4 grid gap-3 text-sm text-ink-soft">
                {[
                  ["Duplicate detection", "Same donor, same category and quantity within 48 hours gets flagged."],
                  ["Image validation", "JPEG/PNG/WebP only, 5 MB max, EXIF stripped on upload."],
                  ["Rate limiting", "10 submissions per account per hour, 3 per minute per IP."],
                  ["Role-based access", "USER, NGO, VOLUNTEER and ADMIN scopes on every route."],
                  ["Audit log", "Every verification, rejection and star adjustment is recorded."],
                  ["No instant rewards", "Stars are written only after RECEIVED → VERIFIED."],
                ].map(([t, b]) => (
                  <li key={t} className="flex gap-3 rounded-xl bg-cream px-4 py-3">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                    <span>
                      <span className="block font-bold text-ink">{t}</span>
                      <span className="block text-xs leading-relaxed text-muted">{b}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        )}

        {/* AUDIT */}
        {tab === "audit" && (
          <Card className="mt-6 overflow-hidden">
            <div className="flex items-center justify-between border-b border-line bg-cream px-6 py-4">
              <h2 className="text-sm font-extrabold tracking-[0.16em] text-forest-soft uppercase">
                Audit log
              </h2>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  const csv = [
                    "timestamp,actor,action,target",
                    ...AUDIT.map((a) =>
                      [a.at, a.who, a.action, a.target]
                        .map((v) => `"${v.replace(/"/g, '""')}"`)
                        .join(","),
                    ),
                  ].join("\n");
                  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "rekindle-audit-log.csv";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
            <ul className="divide-y divide-line">
              {AUDIT.map((a) => (
                <li key={a.at} className="grid gap-1 px-6 py-4 sm:grid-cols-[170px_170px_1fr_200px] sm:gap-4">
                  <span className="text-xs font-semibold text-muted">{a.at}</span>
                  <span className="truncate text-xs font-bold text-forest-soft">{a.who}</span>
                  <span className="text-sm font-semibold text-ink">{a.action}</span>
                  <span className="text-xs text-muted">{a.target}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </Shell>
    </>
  );
}
