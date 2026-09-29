"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock,
  ImageOff,
  MapPin,
  Phone,
  Sparkles,
  Truck,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { CATEGORY_MAP, CONDITIONS, STATUS_FLOW, STATUS_META } from "@/lib/catalog";
import type { DonationStatus } from "@/lib/types";
import { formatDate, itemWords } from "@/lib/format";
import {
  Button,
  Card,
  EmptyState,
  Skeleton,
  StatusPill,
} from "@/components/ui/primitives";
import { PageHeader, Shell } from "@/components/ui/page";
import { useConfettiOnMount } from "@/components/ui/motion";

export default function DonationDetailsPage() {
  const params = useParams<{ code: string }>();
  const { donations, partners, ready, justVerifiedId, clearJustVerified } = useApp();

  const donation = donations.find((d) => d.code === params.code);
  const isFresh = Boolean(donation && justVerifiedId === donation.id);
  useConfettiOnMount(isFresh);

  useEffect(() => {
    if (isFresh) {
      const t = setTimeout(() => clearJustVerified(), 4000);
      return () => clearTimeout(t);
    }
  }, [isFresh, clearJustVerified]);

  if (!ready) {
    return (
      <Shell>
        <Skeleton className="h-10 w-72" />
        <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-72 w-full" />
        </div>
      </Shell>
    );
  }

  if (!donation) {
    return (
      <Shell>
        <EmptyState
          title="We could not find that donation"
          body={`No donation matches the code "${params.code}". It may belong to a different account.`}
          action={<Button href="/my-donations">Back to my donations</Button>}
        />
      </Shell>
    );
  }

  const meta = STATUS_META[donation.status];
  const partner = partners.find((p) => p.id === donation.partnerId);
  const flow =
    donation.status === "REJECTED"
      ? (["SUBMITTED", "REJECTED"] as DonationStatus[])
      : STATUS_FLOW;

  return (
    <>
      <PageHeader
        eyebrow="Donation details"
        title={donation.code}
        subtitle={`Submitted on ${formatDate(donation.createdAt)} · ${donation.pickup.method === "PICKUP" ? "Doorstep pickup" : "Drop-off"}`}
        back={{ href: "/my-donations", label: "My donations" }}
        actions={
          <div className="flex items-center gap-3">
            <StatusPill label={meta.label} tone={meta.tone} />
            <Button href="/donate" variant="secondary">
              Donate again
            </Button>
          </div>
        }
      />

      <Shell>
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="grid gap-6">
            {/* timeline */}
            <Card className="p-6">
              <h2 className="text-sm font-extrabold tracking-[0.16em] text-forest-soft uppercase">
                Status timeline
              </h2>
              <ol className="mt-5 grid gap-0">
                {flow.map((status, i) => {
                  const entry = donation.timeline.find((t) => t.status === status);
                  const done = entry && status !== "REJECTED" ? true : status === "REJECTED" ? Boolean(entry) : false;
                  const isCurrent =
                    status === donation.status || (donation.status === "UNDER_REVIEW" && status === "SUBMITTED");
                  return (
                    <li key={status} className="relative flex gap-4 pb-6 last:pb-0">
                      {i < flow.length - 1 && (
                        <span
                          aria-hidden
                          className="absolute top-6 bottom-0 left-[11px] w-px bg-line"
                        />
                      )}
                      <span
                        className={`relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                          done
                            ? "border-forest bg-forest text-cream"
                            : "border-line-strong bg-white text-muted"
                        } ${isCurrent ? "ring-4 ring-mint" : ""}`}
                      >
                        {done ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          <Circle className="h-2.5 w-2.5" />
                        )}
                      </span>
                      <div className="-mt-0.5 min-w-0">
                        <p
                          className={`text-sm font-extrabold ${done ? "text-ink" : "text-muted"}`}
                        >
                          {STATUS_META[status].label}
                          {isCurrent && (
                            <span className="ml-2 rounded-full bg-mint px-2 py-0.5 text-[0.65rem] font-bold text-forest">
                              current
                            </span>
                          )}
                        </p>
                        {entry ? (
                          <>
                            <p className="text-xs text-muted">{formatDate(entry.at)}</p>
                            {entry.note && (
                              <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                                {entry.note}
                              </p>
                            )}
                          </>
                        ) : (
                          <p className="text-xs text-muted">Pending</p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </Card>

            {/* items */}
            <Card className="p-6">
              <h2 className="text-sm font-extrabold tracking-[0.16em] text-forest-soft uppercase">
                Items in this donation
              </h2>
              <ul className="mt-4 divide-y divide-line">
                {donation.items.map((it) => (
                  <li key={it.id} className="flex items-center justify-between py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cream text-xl">
                        {CATEGORY_MAP[it.category].emoji}
                      </span>
                      <div>
                        <p className="text-sm font-extrabold text-ink">
                          {it.quantity} {CATEGORY_MAP[it.category].label}
                        </p>
                        <p className="text-xs text-muted">
                          {CONDITIONS.find((c) => c.key === it.condition)?.label}
                          {it.note ? ` · ${it.note}` : ""}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-gold-deep tabular-nums">
                      {CATEGORY_MAP[it.category].starsPerUnit > 0
                        ? `+${it.quantity * CATEGORY_MAP[it.category].starsPerUnit} ⭐`
                        : "manual review"}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* photos */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-extrabold tracking-[0.16em] text-forest-soft uppercase">
                  Photos
                </h2>
                <span className="text-xs text-muted">{donation.images.length} attached</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {donation.images.map((img) => (
                  <div
                    key={img.id}
                    className="relative aspect-4/3 overflow-hidden rounded-2xl border border-line bg-sand"
                  >
                    {img.preview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={img.preview}
                        alt={img.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-muted">
                        <ImageOff className="h-5 w-5" />
                        <span className="px-2 text-center text-[0.65rem] font-semibold">
                          {img.name}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
                {donation.images.length === 0 && (
                  <p className="col-span-full rounded-xl bg-cream px-4 py-6 text-center text-sm text-muted">
                    No photos were attached to this donation.
                  </p>
                )}
              </div>
            </Card>
          </div>

          {/* right rail */}
          <div className="grid gap-6">
            <Card className="overflow-hidden">
              <div className="border-b border-line bg-cream px-6 py-5">
                <p className="text-xs font-bold tracking-[0.16em] text-forest-soft uppercase">
                  Impact Stars
                </p>
                <p className="font-display mt-2 text-4xl font-semibold text-ink">
                  {donation.awardedStars ? (
                    <>
                      +{donation.awardedStars}{" "}
                      <span className="text-gold" aria-hidden>
                        ⭐
                      </span>
                    </>
                  ) : (
                    <>
                      ≈ {donation.expectedStars}{" "}
                      <span className="text-gold" aria-hidden>
                        ⭐
                      </span>
                    </>
                  )}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  {donation.awardedStars
                    ? "Awarded after partner verification. Transaction written to your ledger."
                    : "Expected reward. Credited only after a partner verifies the donation."}
                </p>
              </div>

              {donation.awardedStars ? (
                <ul className="divide-y divide-line px-6">
                  {donation.items.map((it) => (
                    <li key={it.id} className="flex items-center justify-between py-3 text-sm">
                      <span className="text-ink-soft">
                        {itemWords(it.quantity, it.category)} ×{" "}
                        {CATEGORY_MAP[it.category].starsPerUnit}
                      </span>
                      <span className="font-bold text-ink tabular-nums">
                        +{it.quantity * CATEGORY_MAP[it.category].starsPerUnit}
                      </span>
                    </li>
                  ))}
                  <li className="flex items-center justify-between py-3 text-sm font-extrabold text-forest">
                    Total awarded
                    <span className="tabular-nums">+{donation.awardedStars}</span>
                  </li>
                </ul>
              ) : (
                <div className="px-6 py-5">
                  <div className="rounded-xl bg-gold-soft px-4 py-3 text-xs font-semibold leading-relaxed text-ink-soft">
                    Stars stay pending until status reaches{" "}
                    <span className="font-extrabold text-gold-deep">Verified</span>. This protects
                    the platform from reward farming.
                  </div>
                </div>
              )}
            </Card>

            <Card className="p-6">
              <h2 className="text-sm font-extrabold tracking-[0.16em] text-forest-soft uppercase">
                {donation.pickup.method === "PICKUP" ? "Pickup details" : "Drop-off details"}
              </h2>
              <ul className="mt-4 grid gap-3.5 text-sm text-ink-soft">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                  <span>
                    {donation.pickup.address ?? donation.pickup.city}
                    {donation.pickup.address && donation.pickup.city
                      ? `, ${donation.pickup.city}`
                      : ""}
                  </span>
                </li>
                <li className="flex gap-3">
                  <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                  <span>
                    {donation.pickup.date ? formatDate(donation.pickup.date) : "Date to be confirmed"}
                  </span>
                </li>
                <li className="flex gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                  <span>{donation.pickup.slot ?? "Slot to be confirmed"}</span>
                </li>
                {donation.pickup.phone && (
                  <li className="flex gap-3">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                    <span>{donation.pickup.phone}</span>
                  </li>
                )}
                <li className="flex gap-3">
                  <Truck className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                  <span>
                    {donation.pickup.method === "PICKUP"
                      ? "Doorstep pickup by a ReKindle volunteer"
                      : "Self drop-off at a partner point"}
                  </span>
                </li>
              </ul>
            </Card>

            {partner && (
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-xl text-sm font-extrabold text-ink"
                    style={{ backgroundColor: logoTint(partner.logoBg) }}
                  >
                    {partner.initials}
                  </span>
                  <div>
                    <p className="flex items-center gap-1.5 text-sm font-extrabold text-ink">
                      {partner.name}
                      {partner.verified && <BadgeCheck className="h-4 w-4 text-forest" />}
                    </p>
                    <p className="text-xs text-muted">
                      {partner.kind} · {partner.city}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted">{partner.blurb}</p>
                <Link
                  href="/partners"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-forest underline underline-offset-4"
                >
                  View partner profile
                </Link>
              </Card>
            )}

            {donation.verificationNote && (
              <Card className="p-6">
                <p className="flex items-center gap-2 text-sm font-extrabold text-ink">
                  <Sparkles className="h-4 w-4 text-gold" />
                  Note from the ReKindle team
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {donation.verificationNote}
                </p>
              </Card>
            )}
          </div>
        </div>
      </Shell>
    </>
  );
}

function logoTint(bg: string) {
  return bg || "#e6f2ec";
}
