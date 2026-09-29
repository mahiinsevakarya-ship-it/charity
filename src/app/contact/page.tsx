import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Handshake,
  Mail,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Reveal } from "@/components/ui/motion";
import { Button, SectionHeading, StatusPill } from "@/components/ui/primitives";
import { PageHeader } from "@/components/ui/page";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Questions about a pickup, an Impact Stars balance or a donation that has not moved? Reach the ReKindle team in Bengaluru — email, phone or a short form.",
};

const CHANNELS = [
  {
    icon: Mail,
    label: "Email",
    value: "help@rekindle.org",
    href: "mailto:help@rekindle.org",
    note: "Donation issues, account questions, feedback. We reply within one working day, Monday to Saturday.",
    tone: "bg-mint text-forest",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 80 4711 2200",
    href: "tel:+918047112200",
    note: "Mon–Sat, 8:00 AM – 8:00 PM IST. Rescheduling a pickup or chasing a volunteer is always faster by phone.",
    tone: "bg-gold-soft text-gold-deep",
  },
  {
    icon: MapPin,
    label: "Office",
    value: "Koramangala, Bengaluru",
    note: "ReKindle Technologies Pvt. Ltd., No. 42, 3rd Floor, 80 Feet Road, 4th Block, Bengaluru 560034. Visits by appointment — write to us first and we will keep someone free.",
    tone: "bg-clay-soft text-[#b14f31]",
  },
  {
    icon: Clock,
    label: "Pickup support",
    value: "Mon–Sat · 8:00 AM – 8:00 PM",
    note: "Sunday pickups run in Bengaluru, Mumbai, Pune and Delhi NCR. Drop-off points keep their own hours, listed during the donation flow.",
    tone: "bg-mint text-forest",
  },
  {
    icon: Package,
    label: "Drop off instead",
    value: "ReKindle Hub — Indiranagar",
    note: "12, 100 Feet Road, Indiranagar, Bengaluru 560038 · Mon–Sat, 10:00 AM – 6:00 PM. No appointment needed for bundles under 10 items.",
    tone: "bg-sand text-ink-soft",
  },
];

const QUICK_LINKS = [
  {
    href: "/faq",
    icon: Sparkles,
    title: "Quick answers",
    body: "Seventeen questions we get every day — donations, pickups, stars and privacy.",
    label: "Open the FAQ",
  },
  {
    href: "/transparency",
    icon: ShieldCheck,
    title: "Where did it go?",
    body: "Track a donation code from your door to a partner's distribution log.",
    label: "View transparency",
  },
  {
    href: "/donate",
    icon: Package,
    title: "Start a donation",
    body: "Have something ready? The wizard takes about three minutes end to end.",
    label: "Donate now",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Talk to a human."
        subtitle="Questions about a pickup, a donation that has not moved, or your Impact Stars? We are a small team in Bengaluru, we read everything, and we answer within a working day."
        actions={
          <>
            <Button href="/faq" variant="secondary">
              Check the FAQ first
            </Button>
            <Button href="tel:+918047112200">Call support</Button>
          </>
        }
      />

      {/* ------------------------- form + channels --------------------------- */}
      <section aria-label="Contact form and support channels" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal delay={110} className="space-y-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-forest-soft">
                Other ways to reach us
              </p>
              <h2 className="font-display mt-2 text-2xl font-semibold text-ink">
                Pick whichever is easiest.
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                <StatusPill label="Reply in 1 working day" tone="active" />
                <StatusPill label="English, हिन्दी, ಕನ್ನಡ" tone="muted" />
              </div>
            </div>

            <ul className="space-y-4">
              {CHANNELS.map((channel) => {
                const inner = (
                  <>
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${channel.tone}`}
                    >
                      <channel.icon className="h-5 w-5" strokeWidth={1.9} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-bold tracking-[0.14em] text-muted uppercase">
                        {channel.label}
                      </span>
                      <span className="mt-1 block text-base font-extrabold text-ink">
                        {channel.value}
                      </span>
                      <span className="mt-1.5 block text-sm leading-relaxed text-muted">
                        {channel.note}
                      </span>
                    </span>
                  </>
                );

                return (
                  <li key={channel.label}>
                    {channel.href ? (
                      <a
                        href={channel.href}
                        className="surface-card flex items-start gap-4 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-mint-deep hover:shadow-card"
                      >
                        {inner}
                      </a>
                    ) : (
                      <div className="surface-card flex items-start gap-4 p-5">{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* --------------------------- NGO enquiries --------------------------- */}
      <section aria-labelledby="ngo-heading" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="rounded-[2rem] bg-ink p-7 text-cream sm:p-10 lg:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-gold">
                <Handshake className="h-5 w-5" strokeWidth={1.9} />
              </span>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.22em] text-gold">
                NGO & partner enquiries
              </p>
              <h2
                id="ngo-heading"
                className="font-display mt-3 text-[clamp(1.5rem,3vw,2.2rem)] leading-[1.1] font-semibold text-balance"
              >
                Running an NGO, shelter, school or repair group?
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-cream/70 text-pretty">
                Tell us what your community actually needs and how often. Our partner team verifies
                your documents, sets up a needs list, and starts routing donations from donors near
                you — usually within two weeks of the first call. There is no fee, ever.
              </p>
              <ul className="mt-6 grid gap-2.5 text-sm text-cream/75 sm:grid-cols-2">
                <li className="flex items-start gap-2.5">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-mint-deep" />
                  Document verification and a public profile
                </li>
                <li className="flex items-start gap-2.5">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-mint-deep" />
                  Set the items you need, stop what you cannot use
                </li>
                <li className="flex items-start gap-2.5">
                  <Package className="mt-0.5 h-4 w-4 shrink-0 text-mint-deep" />
                  Pickup logistics handled by our volunteer network
                </li>
                <li className="flex items-start gap-2.5">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-mint-deep" />
                  Distribution reporting your donors can actually read
                </li>
              </ul>
            </div>

            <div className="rounded-[1.5rem] border border-white/12 bg-white/[0.05] p-6">
              <p className="text-sm leading-relaxed text-cream/70">
                Start with the partner page — it walks through what we need from you. Prefer email?{" "}
                <a
                  href="mailto:partners@rekindle.org"
                  className="font-bold text-gold underline underline-offset-4"
                >
                  partners@rekindle.org
                </a>
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Button href="/partners" size="lg" variant="gold">
                  Become a partner
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button href="/ngo" size="lg" variant="onDark">
                  Open partner dashboard
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---------------------------- quick links ---------------------------- */}
      <section aria-labelledby="quick-heading" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <Reveal>
          <SectionHeading
            align="left"
            eyebrow="Before you write"
            title="The answer might already be here."
            body="Most messages we receive are about one of these three things — and all three take less than a minute to check."
          />
        </Reveal>

        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {QUICK_LINKS.map((link, i) => (
            <Reveal key={link.href} delay={i * 80}>
              <Link
                href={link.href}
                className="surface-card group flex h-full flex-col p-6 transition-all duration-300 hover:-translate-y-1 hover:border-mint-deep hover:shadow-card"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-mint text-forest">
                  <link.icon className="h-5 w-5" strokeWidth={1.9} />
                </span>
                <h3 className="mt-4 text-base font-extrabold text-ink">{link.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{link.body}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-forest">
                  {link.label}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={160} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
          <span>
            Looking for terms instead?{" "}
            <Link
              href="/terms"
              className="font-bold text-forest underline decoration-mint-deep underline-offset-4"
            >
              Terms & Conditions
            </Link>
          </span>
          <span>
            Want to know what we store?{" "}
            <Link
              href="/privacy"
              className="font-bold text-forest underline decoration-mint-deep underline-offset-4"
            >
              Privacy Policy
            </Link>
          </span>
        </Reveal>
      </section>
    </>
  );
}
