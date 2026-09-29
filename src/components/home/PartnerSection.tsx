import { ArrowRight, BadgeCheck, ClipboardList, FileCheck2, Handshake, PackageSearch, Send, BarChart3 } from "lucide-react";
import { SEED_PARTNERS } from "@/lib/seed";
import { Reveal } from "@/components/ui/motion";
import { Button } from "@/components/ui/primitives";

const CAPABILITIES = [
  { icon: FileCheck2, label: "Submit verification documents" },
  { icon: PackageSearch, label: "Specify the items you need" },
  { icon: Send, label: "Request donations from nearby donors" },
  { icon: ClipboardList, label: "Update distribution status" },
  { icon: BarChart3, label: "Report impact back to donors" },
  { icon: Handshake, label: "Manage your own partner dashboard" },
];

export function PartnerSection() {
  return (
    <section aria-labelledby="partner-heading" className="mt-24 bg-ink text-cream lg:mt-32">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">
              For NGOs & community organisations
            </p>
            <h2 id="partner-heading" className="font-display mt-4 text-[clamp(1.9rem,4vw,3rem)] leading-[1.05] font-semibold text-cream text-balance">
              Are you an NGO or community organisation?
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-cream/70 text-pretty">
              Tell us what your community actually needs. We route verified donations to you, and
              your team reports back with photos and counts so donors see exactly where their
              things went.
            </p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {CAPABILITIES.map((c) => (
                <li
                  key={c.label}
                  className="flex items-center gap-3 rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-3.5 text-sm font-semibold text-cream/85 transition-colors hover:border-gold/50"
                >
                  <c.icon className="h-4 w-4 shrink-0 text-gold" />
                  {c.label}
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap gap-3">
              <Button href="/partners" variant="gold" size="lg">
                Become a Partner
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button href="/ngo" size="lg" variant="onDark">
                Open partner dashboard
              </Button>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-[2rem] border border-white/12 bg-white/[0.05] p-6 sm:p-8">
              <div className="flex items-center gap-2 text-sm font-bold text-mint-deep">
                <BadgeCheck className="h-4 w-4" />
                Verified partner network · {SEED_PARTNERS.filter((p) => p.verified).length} live in
                this preview
              </div>
              <ul className="mt-6 grid gap-4">
                {SEED_PARTNERS.slice(0, 5).map((p) => (
                  <li
                    key={p.id}
                    className="flex items-start gap-4 rounded-2xl bg-white/[0.06] p-4 transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    <span
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold text-ink"
                      style={{ backgroundColor: p.logoBg }}
                    >
                      {p.initials}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate font-bold text-cream">{p.name}</span>
                        {p.verified && (
                          <BadgeCheck className="h-4 w-4 shrink-0 text-mint-deep" aria-label="Verified" />
                        )}
                      </span>
                      <span className="mt-0.5 block text-sm text-cream/60">
                        {p.city} · {p.focus.join(", ")}
                      </span>
                      <span className="mt-2 flex flex-wrap gap-1.5">
                        {p.needs.slice(0, 3).map((n) => (
                          <span
                            key={n}
                            className="rounded-full bg-white/10 px-2.5 py-1 text-[0.68rem] font-bold text-cream/70"
                          >
                            Needs {n.toLowerCase()}
                          </span>
                        ))}
                      </span>
                    </span>
                    <span className="shrink-0 text-right text-xs font-bold text-gold tabular-nums">
                      {p.itemsDistributed.toLocaleString("en-IN")}
                      <span className="block font-medium text-cream/50">items</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
