import { CalendarClock, Images, ListChecks, Star } from "lucide-react";
import { Reveal } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/primitives";

const STEPS = [
  {
    n: "01",
    title: "Choose what you want to give",
    body: "Select clothes, books, shoes, bags, toys or other reusable items. Pick as many as you like.",
    icon: ListChecks,
  },
  {
    n: "02",
    title: "Tell us about it",
    body: "Add quantities and condition, and upload a photo or two so our team can verify quickly.",
    icon: Images,
  },
  {
    n: "03",
    title: "Schedule pickup or drop off",
    body: "Choose a doorstep pickup slot or a partner drop-off point that is convenient for you.",
    icon: CalendarClock,
  },
  {
    n: "04",
    title: "Earn Impact Stars",
    body: "Once a partner verifies the donation, Impact Stars land in your account with a full receipt.",
    icon: Star,
  },
];

export function HowItWorks() {
  return (
    <section aria-labelledby="how-heading" className="mt-24 bg-cream lg:mt-32">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <Reveal>
          <SectionHeading
            eyebrow="How it works"
            title="Four steps between your cupboard and someone's new beginning."
            body="No paperwork, no back-and-forth. The whole flow is designed to be finished on your phone during a tea break."
          />
        </Reveal>

        <div className="relative mt-14">
          <div
            aria-hidden
            className="absolute top-10 right-[12%] left-[12%] hidden h-px bg-[repeating-linear-gradient(90deg,#ddd3c0_0_10px,transparent_10px_20px)] lg:block"
          />
          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <Reveal as="li" key={step.n} delay={i * 90} className="relative">
                <div className="surface-card flex h-full flex-col p-6 transition-transform duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-4xl font-semibold text-mint-deep">{step.n}</span>
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mint text-forest">
                      <step.icon className="h-6 w-6" strokeWidth={1.9} />
                    </span>
                  </div>
                  <h3 className="mt-5 text-base leading-snug font-extrabold text-ink">{step.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>

        <Reveal delay={200} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="/donate"
            className="rounded-full bg-forest px-7 py-3.5 text-sm font-bold text-cream shadow-[0_14px_34px_-16px_rgba(14,92,67,0.9)] transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
          >
            Begin Step 01
          </a>
          <p className="text-sm font-semibold text-muted">
            Average completion time: <span className="text-forest">2 min 40 s</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
