import { Quote } from "lucide-react";
import { Reveal } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/primitives";

const CHAINS = [
  {
    title: "A book you finished can become a lesson someone starts.",
    quote:
      "The spine was cracked and the pages were soft, but for the class it arrived in, it was the only physics reference on the shelf.",
    steps: ["Old book", "Donation", "Student", "Learning"],
    meta: "Vidya Setu Trust · Bengaluru rural",
    accent: "bg-mint text-forest",
  },
  {
    title:
      "A pair of shoes in your cupboard can help someone take their next step.",
    quote:
      "They were outgrown, not worn out. A repair café fixed the sole in twenty minutes and they went to a child walking 3 km to school.",
    steps: ["Old shoes", "Donation", "Repair", "Walked daily"],
    meta: "GreenLoop Collective · Bengaluru",
    accent: "bg-gold-soft text-gold-deep",
  },
  {
    title: "Eight shirts can become a winter that feels less cold.",
    quote:
      "We log every bundle by hand. When the temperature drops, the families on our list already know what is waiting for them.",
    steps: ["Old shirts", "Donation", "Family", "Warm winter"],
    meta: "Sahaara Shelter · Mumbai",
    accent: "bg-clay-soft text-[#b14f31]",
  },
];

export function ImpactStories() {
  return (
    <section aria-labelledby="stories-heading" className="mt-24 bg-cream lg:mt-32">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <Reveal>
          <SectionHeading
            eyebrow="Impact stories"
            title="Where your things actually end up."
            body="Short, unedited updates from our partners. No stock photos, no invented numbers — just the path an item took."
          />
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {CHAINS.map((story, i) => (
            <Reveal key={story.title} delay={i * 90}>
              <article className="surface-card flex h-full flex-col p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card">
                <Quote className="h-7 w-7 text-mint-deep" strokeWidth={1.6} />
                <h3 className="mt-4 text-lg leading-snug font-extrabold text-ink text-balance">
                  {story.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted italic">
                  “{story.quote}”
                </p>

                <ol className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-2 text-[0.72rem] font-bold">
                  {story.steps.map((s, idx) => (
                    <li key={s} className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 ${idx === story.steps.length - 1 ? story.accent : "bg-sand text-ink-soft"}`}
                      >
                        {s}
                      </span>
                      {idx < story.steps.length - 1 && <span aria-hidden className="text-line-strong">→</span>}
                    </li>
                  ))}
                </ol>

                <p className="mt-6 border-t border-line pt-4 text-xs font-bold tracking-wide text-forest-soft uppercase">
                  {story.meta}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
