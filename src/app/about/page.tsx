import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Eye,
  Handshake,
  Leaf,
  Lock,
  Recycle,
  ShieldCheck,
  Shirt,
  Sparkles,
  Users,
} from "lucide-react";
import { PLATFORM_STATS } from "@/lib/seed";
import { Avatar, Counter, Reveal } from "@/components/ui/motion";
import { Button, SectionHeading, StatusPill } from "@/components/ui/primitives";
import { PageHeader } from "@/components/ui/page";

export const metadata: Metadata = {
  title: "About us",
  description:
    "ReKindle is a reuse platform from Bengaluru. We pick up what you no longer need, verify it with a human, and route it to verified NGOs, shelters and schools — with a receipt for every step.",
};

const PROBLEMS = [
  {
    icon: Shirt,
    title: "Wardrobes grow faster than we notice",
    body: "Most unworn clothes are not worn out. They stopped fitting, stopped matching, or slipped down the rotation. That is a storage problem, not an end-of-life problem — and moving the bag solves it.",
  },
  {
    icon: BookOpen,
    title: "Books are read once, then stacked",
    body: "A novel, a workbook, a reference book: one reader, then a shelf. Meanwhile a class in the next ward shares a single copy between forty students. The book was never finished — it was parked.",
  },
  {
    icon: Recycle,
    title: "Recycling is the last resort, not the plan",
    body: "Turning old cloth into fibre needs water, sorting and energy. Keeping an item in use for one more year needs none of that. It just needs a handover — which is the only part we automate.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "You list it",
    body: "Pick a category, add quantities and condition, upload a photo or two. Clothes, books, shoes, bags, toys, household extras — about three minutes on your phone.",
  },
  {
    n: "02",
    title: "A human verifies it",
    body: "Someone on our team looks at the photos and counts before anything is scheduled. Nothing is credited from a form alone, and we tell you plainly if an item cannot be reused.",
  },
  {
    n: "03",
    title: "A partner receives it",
    body: "A document-verified NGO, shelter, school or community group collects or accepts the bundle, signs for it, and logs the count at their sorting hub.",
  },
  {
    n: "04",
    title: "We report it back",
    body: "The donation moves to Distributed, your Impact Stars land in a permanent ledger, and the totals roll into statistics anyone can check on the Transparency dashboard.",
  },
];

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Verification before celebration",
    body: "Stars, badges and totals arrive only after a partner signs for the items. A number we cannot trace is a number we do not publish.",
    tone: "bg-mint text-forest",
  },
  {
    icon: Leaf,
    title: "No guilt, ever",
    body: "We will never shame you for what is in your cupboard. Progress is made by making the good option the easy one — not by making anyone feel small.",
    tone: "bg-mint text-forest",
  },
  {
    icon: Eye,
    title: "Show the receipts",
    body: "Every donation carries a code, a pickup record and a distribution note. If we ask you to trust us, we also hand you the trail to check.",
    tone: "bg-gold-soft text-gold-deep",
  },
  {
    icon: Handshake,
    title: "Partners are the heroes",
    body: "We build the road; the people at the other end do the work. Partners set their needs, accept what fits, and report what reached whom.",
    tone: "bg-clay-soft text-[#b14f31]",
  },
  {
    icon: Sparkles,
    title: "Small counts",
    body: "Ten books is not a rounding error. We count in single items because a single item is exactly what changes one ordinary day for someone.",
    tone: "bg-mint text-forest",
  },
  {
    icon: Lock,
    title: "Privacy is part of the product",
    body: "An email to sign in, an address to collect from, photos to verify — that is the whole ask. Your details are never sold, and you can delete them anytime.",
    tone: "bg-sand text-ink-soft",
  },
];

const TEAM = [
  {
    initials: "AR",
    name: "Ananya Rao",
    role: "Co-founder & CEO",
    color: "#0e5c43",
    bio: "Spent nine years in retail logistics watching good stock get written off. Now writes the pickup routes instead.",
  },
  {
    initials: "VS",
    name: "Vikram Shetty",
    role: "Co-founder & CTO",
    color: "#16825f",
    bio: "Built dispatch systems for a logistics startup. Built the donation ledger so every star ties back to a real item.",
  },
  {
    initials: "FQ",
    name: "Farah Qureshi",
    role: "Head of Partner Network",
    color: "#df7a58",
    bio: "Former programme manager at two Bengaluru shelters. Knows exactly what a partner can and cannot use.",
  },
  {
    initials: "KI",
    name: "Karthik Iyer",
    role: "Operations Lead",
    color: "#d99512",
    bio: "Runs the verification desk and the volunteer network across 19 cities. Still answers support mail on Saturdays.",
  },
];

const MILESTONES = [
  {
    date: "March 2025",
    title: "The first pickup",
    body: "Fourteen bags from one Indiranagar apartment building. Two volunteers, one borrowed tempo, no app — just a spreadsheet and a promise to follow up.",
  },
  {
    date: "June 2025",
    title: "Ten partners verified",
    body: "Our first cohort of shelters, schools and community groups cleared document checks, published needs lists and agreed to report distribution back.",
  },
  {
    date: "September 2025",
    title: "The verification desk opens",
    body: "Every submission started getting a human review before a slot was offered. Rejections dropped, and stars stopped being a rubber stamp.",
  },
  {
    date: "December 2025",
    title: "10,000 items reused",
    body: "A milestone we could point at donation IDs rather than estimates — each one with a pickup record and a partner confirmation behind it.",
  },
  {
    date: "February 2026",
    title: "Doorstep pickup in 19 cities",
    body: "The volunteer network crossed two hundred people, and seven-day slots from 8 AM to 8 PM opened in every city we serve.",
  },
  {
    date: "May 2026",
    title: "Transparency goes public",
    body: "Anyone — donor or not — can now follow a donation code from a cupboard to a partner's distribution log and see the totals update daily.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About ReKindle"
        title="Useful things deserve a second life, not a landfill."
        subtitle="ReKindle is a reuse platform from Bengaluru. We pick up what you no longer need, verify it with a human, and route it to schools, shelters and community partners who can use it this week."
        actions={
          <>
            <Button href="/donate">Start a donation</Button>
            <Button href="/contact" variant="secondary">
              Talk to us
            </Button>
          </>
        }
      />

      {/* ------------------------------- mission ------------------------------ */}
      <section aria-labelledby="mission-heading" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-forest-soft">
              Our mission
            </p>
            <h2
              id="mission-heading"
              className="font-display mt-4 text-[clamp(1.6rem,3.4vw,2.5rem)] leading-[1.12] font-semibold text-balance text-ink"
            >
              Make giving away as easy as throwing away — only the outcome is different.
            </h2>
            <div className="mt-6 flex flex-wrap gap-2">
              <StatusPill label="Founded 2025 · Bengaluru" tone="active" />
              <StatusPill label="46 verified partners" tone="pending" />
              <StatusPill label="19 cities" tone="muted" />
            </div>
          </Reveal>

          <Reveal delay={110} className="space-y-4 text-base leading-relaxed text-ink-soft">
            <p>
              Nobody clears out a cupboard because they do not care. They do it because it is a
              Tuesday evening, the bag is already by the door, and nobody has told them where it
              should go instead. We exist to be that answer: a doorstep slot, a five-minute form,
              and a partner who genuinely needed what you had.
            </p>
            <p>
              We are not a marketplace. We do not resell your things, and we do not keep them. Items
              move from a donor to a verified organisation, and then to a person — a student, a
              family, a shelter. Our whole job is to make that journey short, traceable and worth
              repeating next season.
            </p>
            <p>
              The boring parts — schedules, counts, signatures, follow-ups — are the product. That
              is why you can{" "}
              <Link
                href="/transparency"
                className="font-bold text-forest underline decoration-mint-deep underline-offset-4 transition-colors hover:decoration-forest"
              >
                follow a donation end to end
              </Link>
              .
            </p>

            <div className="grid grid-cols-3 gap-4 border-t border-line pt-6">
              <div>
                <p className="font-display text-[clamp(1.6rem,3vw,2.2rem)] leading-none font-semibold text-forest tabular-nums">
                  <Counter value={PLATFORM_STATS.itemsReused} />
                </p>
                <p className="mt-2 text-xs font-semibold text-muted">items reused</p>
              </div>
              <div>
                <p className="font-display text-[clamp(1.6rem,3vw,2.2rem)] leading-none font-semibold text-forest tabular-nums">
                  <Counter value={PLATFORM_STATS.partners} />
                </p>
                <p className="mt-2 text-xs font-semibold text-muted">verified partners</p>
              </div>
              <div>
                <p className="font-display text-[clamp(1.6rem,3vw,2.2rem)] leading-none font-semibold text-forest tabular-nums">
                  <Counter value={PLATFORM_STATS.cities} />
                </p>
                <p className="mt-2 text-xs font-semibold text-muted">cities with pickup</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------ why reuse ----------------------------- */}
      <section aria-labelledby="why-heading" className="bg-ink text-cream">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">Why reuse</p>
            <h2
              id="why-heading"
              className="font-display mt-4 max-w-3xl text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.08] font-semibold text-balance text-cream"
            >
              Recycling is the story we tell ourselves. Reuse is what actually happens.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-cream/70 text-pretty">
              Before anything can be recycled, it has to be collected, sorted and moved. Most
              discarded things never make it that far. The cheapest, cleanest step is the one where
              an item simply keeps being used.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {PROBLEMS.map((p, i) => (
              <Reveal key={p.title} delay={i * 90}>
                <article className="h-full rounded-[1.75rem] border border-white/12 bg-white/[0.05] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-gold">
                    <p.icon className="h-5 w-5" strokeWidth={1.9} />
                  </span>
                  <h3 className="mt-5 text-lg leading-snug font-extrabold text-cream text-balance">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-cream/65">{p.body}</p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200} className="mt-10 flex flex-col gap-4 border-t border-white/12 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-sm leading-relaxed text-cream/70">
              The most sustainable thing an item can do is keep being an item. See what that has
              added up to so far — every figure is traceable to a donation ID.
            </p>
            <Link
              href="/transparency"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-cream/30 px-6 py-3 text-sm font-bold text-cream transition-colors hover:bg-cream hover:text-forest"
            >
              Open the Transparency dashboard
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* --------------------------- how it works ----------------------------- */}
      <section aria-labelledby="glance-heading" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <Reveal>
          <SectionHeading
            eyebrow="How ReKindle works"
            title="Four stages, one promise: you always find out where it went."
            body="The full flow lives in the donation wizard. This is the shape of it — no forms, no jargon."
          />
        </Reveal>

        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <Reveal as="li" key={step.n} delay={i * 80}>
              <div className="surface-card h-full p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
                <div className="flex items-center justify-between">
                  <span className="font-display text-4xl font-semibold text-mint-deep">{step.n}</span>
                  <span className="h-2.5 w-2.5 rounded-full bg-gold" aria-hidden />
                </div>
                <h3 className="mt-5 text-base leading-snug font-extrabold text-ink">{step.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={180} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button href="/donate">Begin step 01</Button>
          <Button href="/faq" variant="ghost">
            Read the FAQ first
          </Button>
        </Reveal>
      </section>

      {/* ------------------------------- values ------------------------------- */}
      <section aria-labelledby="values-heading" className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <Reveal>
            <SectionHeading
              eyebrow="What we hold on to"
              title="Six things we argue about internally."
              body="Not a poster on a wall. These are the trade-offs we actually make when a deadline is tight."
            />
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 70}>
                <div className="surface-card h-full p-6 transition-all duration-300 hover:-translate-y-1 hover:border-mint-deep">
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${v.tone}`}
                  >
                    <v.icon className="h-5 w-5" strokeWidth={1.9} />
                  </span>
                  <h3 className="mt-4 text-base font-extrabold text-ink">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------- team -------------------------------- */}
      <section aria-labelledby="team-heading" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <Reveal>
          <SectionHeading
            align="left"
            eyebrow="The people"
            title="A small team, plus 200 volunteers who ring your doorbell."
            body="Four of us run the product, the desk and the partner network. Everyone else — hub staff, drivers, volunteers — makes the promise real on a Saturday morning."
          />
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((m, i) => (
            <Reveal key={m.name} delay={i * 80}>
              <article className="surface-card h-full p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
                <Avatar initials={m.initials} color={m.color} size="lg" />
                <h3 className="mt-4 text-base font-extrabold text-ink">{m.name}</h3>
                <p className="mt-0.5 text-xs font-bold tracking-wide text-forest-soft uppercase">
                  {m.role}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{m.bio}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={140} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-semibold text-muted">
          <span className="inline-flex items-center gap-2">
            <Users className="h-4 w-4 text-forest" />
            23 full-time people, 4 offices of volunteers
          </span>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-1.5 text-forest transition-colors hover:text-forest-dark"
          >
            Want to join us?
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </section>

      {/* ----------------------------- milestones ----------------------------- */}
      <section aria-labelledby="milestones-heading" className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow="Milestones · 2025 → 2026"
              title="What actually happened, in order."
              body="No hockey sticks. Just a steady list of things that got built, verified and switched on."
            />
          </Reveal>

          <ol className="mt-12 space-y-8 border-l border-line-strong pl-6 sm:pl-10">
            {MILESTONES.map((m, i) => (
              <Reveal as="li" key={m.date} delay={i * 60} className="relative">
                <span
                  aria-hidden
                  className="absolute top-1.5 -left-[calc(1.5rem+5px)] h-2.5 w-2.5 rounded-full bg-forest ring-4 ring-cream sm:-left-[calc(2.5rem+5px)]"
                />
                <p className="text-xs font-bold tracking-[0.18em] text-gold-deep uppercase">
                  {m.date}
                </p>
                <h3 className="mt-1.5 text-lg font-extrabold text-ink">{m.title}</h3>
                <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted">{m.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* -------------------------------- CTA --------------------------------- */}
      <section aria-labelledby="about-cta-heading" className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <Reveal className="relative overflow-hidden rounded-[2.5rem] bg-forest px-6 py-14 text-center text-cream shadow-pop sm:px-12 lg:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:radial-gradient(circle_at_1px_1px,#fbf6ec_1px,transparent_0)] [background-size:26px_26px]"
          />
          <div className="relative">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
              <Sparkles className="h-6 w-6 text-gold" />
            </span>
            <h2
              id="about-cta-heading"
              className="font-display mx-auto mt-6 max-w-2xl text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.06] font-semibold text-balance"
            >
              Your cupboard is a good place to start.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-cream/75 sm:text-lg">
              One bundle, one slot, three minutes. We handle the sorting, the signatures and the
              follow-up — you get the receipt and the stars.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button href="/donate" size="lg" variant="gold">
                Donate now
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button href="/contact" size="lg" variant="outlineLight">
                Ask us anything
              </Button>
            </div>
            <p className="mt-8 text-xs font-semibold tracking-wide text-cream/60">
              Already with us?{" "}
              <Link href="/login" className="text-gold underline underline-offset-4">
                Sign in
              </Link>{" "}
              · Running an organisation?{" "}
              <Link href="/partners" className="text-gold underline underline-offset-4">
                Become a partner
              </Link>
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
