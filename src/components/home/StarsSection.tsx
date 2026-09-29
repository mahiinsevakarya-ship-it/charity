import { ArrowRight, Info, ShieldCheck } from "lucide-react";
import { CATEGORIES, LEVELS } from "@/lib/catalog";
import { Reveal, StarRow } from "@/components/ui/motion";
import { Button, SectionHeading } from "@/components/ui/primitives";

const PIPELINE = [
  { label: "Submitted", done: true },
  { label: "Pickup scheduled", done: true },
  { label: "Received", done: true },
  { label: "Verified", done: true },
  { label: "Stars awarded", done: false, current: true },
];

export function StarsSection() {
  return (
    <section aria-labelledby="stars-heading" className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8 lg:pt-32">
      <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <Reveal>
          <SectionHeading
            align="left"
            eyebrow="Impact Stars ⭐"
            title="Recognition that only arrives after verification."
            body="Stars are your impact reputation — never instant, never automatic. A partner confirms the items first, then the reward is written into a permanent transaction ledger you can audit any time."
          />

          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {CATEGORIES.map((c) => (
              <li
                key={c.key}
                className="surface-card flex items-center gap-3 px-4 py-3 transition-colors hover:border-mint-deep"
              >
                <span className="text-xl">{c.emoji}</span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-ink">{c.label}</span>
                  <span className="block text-xs font-semibold text-gold-deep">{c.starLabel}</span>
                </span>
              </li>
            ))}
          </ul>

          <ol className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-3">
            {PIPELINE.map((p, i) => (
              <li key={p.label} className="flex items-center gap-2">
                <span
                  className={`rounded-full border px-3 py-1.5 text-xs font-bold ${
                    p.current
                      ? "border-[#f3e0ab] bg-gold-soft text-gold-deep"
                      : "border-mint-deep bg-mint text-forest"
                  }`}
                >
                  {p.label}
                </span>
                {i < PIPELINE.length - 1 && <span className="text-line-strong">→</span>}
              </li>
            ))}
          </ol>

          <div className="mt-8 flex gap-3 rounded-2xl border border-line bg-cream p-5">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-forest" />
            <p className="text-sm leading-relaxed text-ink-soft">
              <span className="font-bold text-ink">Impact Stars are recognition points</span> for your
              contribution and do not represent cash value unless explicitly stated by the platform.
              Submitting low-quality or duplicate items will not earn stars — every donation is
              reviewed by a human first.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/rewards">
              See your rewards
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/transparency" variant="secondary">
              How verification works
            </Button>
          </div>
        </Reveal>

        <Reveal delay={140} className="lg:sticky lg:top-24">
          <div className="surface-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-line bg-cream px-6 py-5">
              <div>
                <p className="text-xs font-bold tracking-[0.16em] text-forest-soft uppercase">
                  Star transaction
                </p>
                <p className="mt-1 text-lg font-extrabold text-ink">Donation RK-1024</p>
              </div>
              <span className="rounded-full bg-forest px-3 py-1.5 text-xs font-bold text-cream">
                AWARDED
              </span>
            </div>

            <ul className="divide-y divide-line px-6">
              <li className="flex items-center justify-between py-4 text-sm">
                <span className="font-semibold text-ink-soft">12 books × 8 ⭐</span>
                <span className="font-bold text-ink tabular-nums">+96</span>
              </li>
              <li className="flex items-center justify-between py-4 text-sm">
                <span className="font-semibold text-ink-soft">5 clothes × 10 ⭐</span>
                <span className="font-bold text-ink tabular-nums">+50</span>
              </li>
              <li className="flex items-center justify-between py-4 text-sm">
                <span className="font-semibold text-ink-soft">Verification bonus</span>
                <span className="font-bold text-ink tabular-nums">+0</span>
              </li>
            </ul>

            <div className="flex items-center justify-between border-t border-line bg-mint px-6 py-5">
              <div className="flex items-center gap-2 text-sm font-bold text-forest">
                <ShieldCheck className="h-4 w-4" />
                Verified by Vidya Setu Trust
              </div>
              <span className="flex items-center gap-2">
                <StarRow count={146} size="lg" />
              </span>
            </div>

            <div className="grid gap-3 px-6 py-6">
              <p className="text-xs font-bold tracking-[0.16em] text-muted uppercase">
                Level ladder
              </p>
              <ul className="grid gap-2">
                {LEVELS.map((l) => (
                  <li
                    key={l.id}
                    className="flex items-center justify-between rounded-xl border border-line px-4 py-3 text-sm"
                  >
                    <span className="font-bold text-ink">
                      {l.emoji} {l.name}
                    </span>
                    <span className="text-xs font-semibold text-muted tabular-nums">
                      {l.max === Number.MAX_SAFE_INTEGER
                        ? `${l.min.toLocaleString("en-IN")}+ stars`
                        : `${l.min.toLocaleString("en-IN")}–${l.max.toLocaleString("en-IN")} stars`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
