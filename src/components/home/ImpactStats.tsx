import { BadgeCheck } from "lucide-react";
import { PLATFORM_STATS } from "@/lib/seed";
import { Counter, Reveal } from "@/components/ui/motion";

const STATS = [
  { label: "Items reused", value: PLATFORM_STATS.itemsReused },
  { label: "Books shared", value: PLATFORM_STATS.booksShared },
  { label: "Clothes donated", value: PLATFORM_STATS.clothesDonated },
  { label: "Pairs of shoes reused", value: PLATFORM_STATS.shoesReused },
  { label: "People reached", value: PLATFORM_STATS.peopleReached },
];

export function ImpactStats() {
  return (
    <section aria-labelledby="impact-heading" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Reveal className="overflow-hidden rounded-[2rem] bg-forest-dark px-6 py-12 text-cream shadow-pop sm:px-10 lg:px-14 lg:py-16">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-mint-deep">
              Verified platform activity
            </p>
            <h2
              id="impact-heading"
              className="font-display mt-3 text-3xl font-semibold text-cream sm:text-4xl"
            >
              Together, we have already…
            </h2>
          </div>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-mint-deep">
            <BadgeCheck className="h-4 w-4" />
            Counted only after a partner confirms receipt
          </p>
        </div>

        <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-3 lg:grid-cols-5">
          {STATS.map((s, i) => (
            <div key={s.label} className={i > 0 ? "lg:border-l lg:border-white/12 lg:pl-6" : ""}>
              <dt className="order-2 mt-2 text-sm font-semibold text-mint-deep/90">{s.label}</dt>
              <dd className="font-display text-[clamp(2rem,4vw,2.9rem)] leading-none font-semibold text-cream tabular-nums">
                <Counter value={s.value} />
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-10 border-t border-white/12 pt-6 text-xs leading-relaxed text-mint-deep/80">
          Numbers update daily from verified donations. Each figure is traceable to a donation ID,
          a pickup record and a partner confirmation — see the{" "}
          <a href="/transparency" className="font-bold text-gold underline underline-offset-4">
            Transparency dashboard
          </a>
          .
        </p>
      </Reveal>
    </section>
  );
}
