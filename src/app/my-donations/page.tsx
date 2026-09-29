"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Inbox } from "lucide-react";
import { useApp } from "@/lib/store";
import { CATEGORY_MAP, STATUS_META } from "@/lib/catalog";
import type { Donation } from "@/lib/types";
import { formatDate, relativeTime } from "@/lib/format";
import { Button, Chip, DonationSkeleton, EmptyState, StatusPill } from "@/components/ui/primitives";
import { PageHeader, Shell } from "@/components/ui/page";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "active", label: "In progress" },
  { id: "verified", label: "Verified" },
  { id: "rejected", label: "Not accepted" },
] as const;

function matches(d: Donation, filter: string) {
  if (filter === "all") return true;
  if (filter === "active")
    return !["VERIFIED", "DISTRIBUTED", "COMPLETED", "REJECTED"].includes(d.status);
  if (filter === "verified") return ["VERIFIED", "DISTRIBUTED", "COMPLETED"].includes(d.status);
  return d.status === "REJECTED";
}

export default function MyDonationsPage() {
  const { myDonations, ready } = useApp();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 550);
    return () => clearTimeout(t);
  }, []);

  const list = useMemo(
    () => myDonations.filter((d) => matches(d, filter)),
    [myDonations, filter],
  );

  const counts = useMemo(
    () => ({
      all: myDonations.length,
      active: myDonations.filter((d) => matches(d, "active")).length,
      verified: myDonations.filter((d) => matches(d, "verified")).length,
      rejected: myDonations.filter((d) => matches(d, "rejected")).length,
    }),
    [myDonations],
  );

  return (
    <>
      <PageHeader
        eyebrow="History"
        title="My donations"
        subtitle="Every donation, from submission to distribution, with its status and Impact Stars."
        back={{ href: "/impact", label: "Impact dashboard" }}
        actions={<Button href="/donate">New donation</Button>}
      />

      <Shell>
        <div className="mb-6 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <Chip key={f.id} active={filter === f.id} onClick={() => setFilter(f.id)}>
              {f.label}
              <span
                className={`rounded-full px-1.5 text-[0.7rem] ${
                  filter === f.id ? "bg-white/20" : "bg-sand"
                }`}
              >
                {counts[f.id]}
              </span>
            </Chip>
          ))}
        </div>

        {loading || !ready ? (
          <div className="grid gap-4">
            {[0, 1, 2].map((i) => (
              <DonationSkeleton key={i} />
            ))}
          </div>
        ) : list.length === 0 ? (
          <EmptyState
            title={filter === "all" ? "No donations yet" : "Nothing in this filter"}
            body={
              filter === "all"
                ? "The first one takes about three minutes. Clothes, books, shoes, bags — anything still usable."
                : "Try another filter, or start a new donation."
            }
            action={<Button href="/donate">Start a donation</Button>}
            icon={<Inbox className="h-7 w-7" />}
          />
        ) : (
          <ul className="grid gap-4">
            {list.map((d) => {
              const meta = STATUS_META[d.status];
              return (
                <li key={d.id}>
                  <Link
                    href={`/my-donations/${d.code}`}
                    className="surface-card group block p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-mint-deep hover:shadow-card sm:p-6"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="flex items-center gap-2 text-lg font-extrabold text-ink">
                          Donation {d.code}
                          <ArrowRight className="h-4 w-4 -translate-x-1 text-muted opacity-0 transition-all group-hover:translate-x-0 group-hover:text-forest group-hover:opacity-100" />
                        </p>
                        <p className="mt-1 text-xs text-muted">
                          {formatDate(d.createdAt)} · {relativeTime(d.createdAt)}
                          {d.pickup.city ? ` · ${d.pickup.city}` : ""}
                        </p>
                      </div>
                      <StatusPill label={meta.label} tone={meta.tone} />
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {d.items.map((it) => (
                        <span
                          key={it.id}
                          className="rounded-full border border-line bg-cream px-3 py-1.5 text-xs font-bold text-ink-soft"
                        >
                          {CATEGORY_MAP[it.category].emoji} {it.quantity}{" "}
                          {CATEGORY_MAP[it.category].label}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                      <div className="flex items-center gap-3 text-xs font-semibold text-muted">
                        <span>
                          {d.pickup.method === "PICKUP" ? "Pickup" : "Drop-off"}
                          {d.pickup.slot ? ` · ${d.pickup.slot}` : ""}
                        </span>
                        {d.flags > 0 && (
                          <span className="rounded-full bg-clay-soft px-2 py-0.5 text-[0.7rem] font-bold text-[#b14f31]">
                            {d.flags} note{d.flags > 1 ? "s" : ""} from review
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-extrabold text-gold-deep tabular-nums">
                        {d.awardedStars
                          ? `+${d.awardedStars} ⭐ awarded`
                          : `≈ ${d.expectedStars} ⭐ pending`}
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Shell>
    </>
  );
}
