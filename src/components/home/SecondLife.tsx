import { BookOpen, HandHeart, PackageCheck, Shirt, Sparkles, Footprints, Backpack } from "lucide-react";
import { Reveal } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/primitives";

const FLOW = [
  { label: "Unused at home", hint: "Sitting in a cupboard", icon: PackageCheck },
  { label: "Donated", hint: "Picked up in your slot", icon: HandHeart },
  { label: "Reused", hint: "Sorted at a partner hub", icon: Sparkles },
  { label: "Real impact", hint: "Used by a person", icon: BookOpen },
];

const MAPPINGS = [
  { icon: Shirt, mine: "Your old clothes", theirs: "Keep someone warm." },
  { icon: BookOpen, mine: "Your old books", theirs: "Help someone learn." },
  { icon: Footprints, mine: "Your unused shoes", theirs: "Help someone move forward." },
  { icon: Backpack, mine: "Your unused bags", theirs: "Help a student carry their dreams." },
];

export function SecondLife() {
  return (
    <section aria-labelledby="second-life-heading" className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8 lg:pt-32">
      <Reveal>
        <SectionHeading
          eyebrow="Your donation has a second life"
          title="Someone, somewhere, needs what you no longer use."
          body="The things you have finished with are not the end of a story. Somewhere in your city, they are the start of one."
        />
      </Reveal>

      {/* transformation flow */}
      <Reveal delay={100} className="mt-12">
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {FLOW.map((stage, i) => (
            <li key={stage.label} className="relative">
              <div className="surface-card flex h-full flex-col items-start gap-3 p-6 lg:mx-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-mint text-forest">
                  <stage.icon className="h-5 w-5" strokeWidth={2} />
                </span>
                <div>
                  <p className="text-[0.7rem] font-bold tracking-[0.18em] text-gold-deep uppercase">
                    Step {i + 1}
                  </p>
                  <p className="mt-1 text-base font-extrabold text-ink">{stage.label}</p>
                  <p className="mt-1 text-sm text-muted">{stage.hint}</p>
                </div>
              </div>
              {i < FLOW.length - 1 && (
                <span
                  aria-hidden
                  className="absolute top-1/2 -right-3 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-line-strong bg-white text-forest lg:flex"
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </li>
          ))}
        </ol>
      </Reveal>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {MAPPINGS.map((m, i) => (
          <Reveal key={m.mine} delay={i * 80}>
            <div className="surface-cream flex h-full flex-col gap-4 p-6 transition-transform duration-300 hover:-translate-y-1">
              <m.icon className="h-6 w-6 text-clay" strokeWidth={1.8} />
              <div>
                <p className="text-sm font-bold text-muted">{m.mine}</p>
                <p className="mt-1 text-lg leading-snug font-extrabold text-forest">→ {m.theirs}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
