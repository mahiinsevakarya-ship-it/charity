import Link from "next/link";
import { ArrowRight, ClipboardCheck, FileBarChart2, MapPinCheck, PackageSearch, ShieldCheck, Users } from "lucide-react";
import { Reveal } from "@/components/ui/motion";
import { Button, SectionHeading } from "@/components/ui/primitives";

const CHAIN = [
  { label: "Donor", hint: "You, at home" },
  { label: "SevaKarya verification", hint: "Photos, counts, human review" },
  { label: "NGO / community partner", hint: "Pickup or drop-off receipt" },
  { label: "Person, family or student", hint: "Distribution logged" },
  { label: "Impact", hint: "Reported back to you" },
];

const FEATURES = [
  { icon: Users, title: "Partner organisations", body: "Every partner is document-verified before the first pickup, with a public profile and the items they need." },
  { icon: ClipboardCheck, title: "Verification process", body: "A human reviews photos and quantities. Nothing is credited until the items are physically received." },
  { icon: PackageSearch, title: "Donation tracking", body: "Each donation carries a code, a timeline and a pickup record you can follow end to end." },
  { icon: MapPinCheck, title: "Pickup status", body: "Volunteer assigned, en route, collected — with the same status visible to your partner." },
  { icon: ShieldCheck, title: "Distribution status", body: "Partners confirm when items reach people, with counts that roll up into public statistics." },
  { icon: FileBarChart2, title: "Impact reports", body: "Quarterly aggregates: what was collected, where it went and who it reached." },
];

export function TransparencySection() {
  return (
    <section aria-labelledby="transparency-heading" className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8 lg:pt-32">
      <Reveal>
        <SectionHeading
          eyebrow="Trust & transparency"
          title="Know where your donation goes."
          body="A donation should never disappear into a black box. Every item on SevaKarya has a code, a chain of custody and a partner signature at the end of it."
        />
      </Reveal>

      <Reveal delay={90} className="mt-12">
        <ol className="grid gap-3 lg:grid-cols-[repeat(5,1fr)] lg:gap-4">
          {CHAIN.map((step, i) => (
            <li key={step.label} className="relative">
              <div className="surface-card h-full p-5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest text-xs font-extrabold text-cream">
                  {i + 1}
                </span>
                <p className="mt-3 text-sm leading-snug font-extrabold text-ink">{step.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">{step.hint}</p>
              </div>
              {i < CHAIN.length - 1 && (
                <span
                  aria-hidden
                  className="absolute -bottom-3.5 left-1/2 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border border-line-strong bg-white text-forest lg:top-1/2 lg:-right-4 lg:bottom-auto lg:left-auto lg:-translate-x-0 lg:-translate-y-1/2"
                >
                  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3.5">
                    <path d="M12 5v14M6 13l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" className="lg:hidden" />
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" className="hidden lg:block" />
                  </svg>
                </span>
              )}
            </li>
          ))}
        </ol>
      </Reveal>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} delay={i * 70}>
            <div className="surface-card h-full p-6 transition-transform duration-300 hover:-translate-y-1">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-mint text-forest">
                <f.icon className="h-5 w-5" strokeWidth={1.9} />
              </span>
              <h3 className="mt-4 text-base font-extrabold text-ink">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={160} className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/transparency"
          className="group inline-flex items-center gap-2 rounded-full border border-forest px-6 py-3 text-sm font-bold text-forest transition-colors hover:bg-forest hover:text-cream"
        >
          Open the Transparency dashboard
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
        <Button href="/faq" variant="ghost">
          Read the verification FAQ
        </Button>
      </Reveal>
    </section>
  );
}
