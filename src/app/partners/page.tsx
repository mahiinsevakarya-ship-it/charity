import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  MapPin,
  PackageSearch,
  Plus,
  Send,
  UserPlus,
} from "lucide-react";
import { SEED_PARTNERS } from "@/lib/seed";
import { CATEGORY_MAP } from "@/lib/catalog";
import { num } from "@/lib/format";
import { Counter, Reveal } from "@/components/ui/motion";
import {
  Button,
  Card,
  SectionHeading,
  StatusPill,
} from "@/components/ui/primitives";
import { PageHeader, Shell } from "@/components/ui/page";
import { PartnerApplyForm } from "./PartnerApplyForm";

export const metadata: Metadata = {
  title: "Become a Partner",
  description:
    "NGOs, shelters, schools and community groups: tell us what your people need and route verified SevaKarya donations to your door. Document verification in 2–4 working days, no fees, ever.",
};

const CAPABILITIES = [
  {
    icon: UserPlus,
    title: "Register your organisation",
    body: "Create one partner profile with the cities and states you serve. Update it once, it stays current everywhere donors look.",
  },
  {
    icon: FileCheck2,
    title: "Submit verification documents",
    body: "Upload your registration certificate, tax papers and signatory ID. Our team reads them and calls you once — no chasing.",
  },
  {
    icon: PackageSearch,
    title: "Specify the items you need",
    body: "Books for a reading corner, school shoes, winter jackets for a night shelter — set the categories you are short on this month.",
  },
  {
    icon: Send,
    title: "Request donations",
    body: "When a batch is urgent, ask donors nearby for a focused push instead of waiting for whatever trickles in.",
  },
  {
    icon: ClipboardList,
    title: "Update distribution status",
    body: "Move each shipment from received to verified to distributed, with a short note the donor can actually read.",
  },
  {
    icon: BarChart3,
    title: "Report impact",
    body: "Send counts and photos back each quarter, so every person who gave something knows exactly where it landed.",
  },
];

const STEPS = [
  {
    title: "Apply",
    body: "Fill the form below with your registration details and the items you need. About five minutes.",
  },
  {
    title: "Document verification",
    body: "We check your papers and make one call to your authorised signatory.",
    tag: "2–4 working days",
  },
  {
    title: "Set item needs & service areas",
    body: "Pick your categories, add the cities and states you cover, and say how often you can receive.",
  },
  {
    title: "Start receiving donations",
    body: "Your card goes live with a verified badge and donors start routing items to you.",
  },
];

const KIND_LABEL: Record<string, string> = {
  NGO: "NGO",
  SHELTER: "Shelter",
  SCHOOL: "School",
  COMMUNITY: "Community",
};

const DOCUMENTS = [
  {
    title: "Registration certificate",
    body: "Society / Trust / Section 8 registration, or your NGO Darpan Unique ID.",
  },
  {
    title: "12A & 80G (or equivalent)",
    body: "Your tax exemption certificate. Add FCRA approval if you receive foreign contributions.",
  },
  {
    title: "Authorised signatory ID",
    body: "Aadhaar or PAN of the person who signs off on every distribution you report.",
  },
  {
    title: "Bank & UDYAM details",
    body: "Current account passbook and Udyam / SME registration, for our audit trail.",
  },
  {
    title: "Distribution photos policy",
    body: "A one-page note on how you photograph handovers. We share it with donors, verbatim.",
  },
];

const FAQS = [
  {
    q: "Who can apply?",
    a: "NGOs, shelters, schools, registered trusts and community wardrobes — any group with a real distribution network and the paperwork to prove it. If you are newly registered, write to us and we will walk you through it.",
  },
  {
    q: "How long does verification take?",
    a: "Two to four working days once all five documents are in. We read every certificate, make one call to your signatory, and then your profile goes live with the verified badge.",
  },
  {
    q: "What does it cost?",
    a: "Nothing. SevaKarya never charges partners and takes no cut of the items you receive. Donors give to you, and it stays with you.",
  },
  {
    q: "What if we cannot accept something?",
    a: "Decline any request with a one-line note. Donors read your note, the items get routed to another partner, and nobody is penalised for saying no.",
  },
];

export default function PartnersPage() {
  const networkItems = SEED_PARTNERS.reduce((s, p) => s + p.itemsDistributed, 0);
  const networkPeople = SEED_PARTNERS.reduce((s, p) => s + p.peopleReached, 0);
  const states = new Set(SEED_PARTNERS.flatMap((p) => p.states)).size;

  return (
    <>
      <PageHeader
        eyebrow="For NGOs, shelters, schools & community groups"
        title="Are you an NGO or community organisation?"
        subtitle="Tell us what your people actually need — storybooks for a reading corner, school shoes, winter jackets for a night shelter. We route verified donations to your door, and your team reports back with counts and photos so every donor sees exactly where their things landed."
        actions={
          <>
            <Button href="#apply">Start partner application</Button>
            <Button href="/transparency" variant="secondary">
              See where donations land
            </Button>
          </>
        }
      />

      {/* ---------------------------- capabilities ---------------------------- */}
      <Shell>
        <section aria-label="What partner organisations can do">
          <SectionHeading
            align="left"
            eyebrow="What partners can do"
            title="One dashboard for the whole pipeline"
            body="From your first document to your quarterly report — everything lives in one place, built for teams that are already short on time."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map((c, i) => (
              <Reveal key={c.title} delay={i * 60} className="h-full">
                <Card hover className="h-full p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-mint text-forest">
                    <c.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-extrabold text-ink">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{c.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ----------------------------- onboarding ---------------------------- */}
        <section aria-label="How onboarding works" className="mt-16 lg:mt-24">
          <SectionHeading
            align="left"
            eyebrow="How onboarding works"
            title="Four steps, about a week"
            body="No procurement portals, no back-and-forth email chains. A form, a document check, one call, and you are live."
          />
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.title} className="h-full">
                <Reveal delay={i * 70} className="h-full">
                  <Card className="flex h-full flex-col p-6">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest text-sm font-extrabold text-cream">
                      {i + 1}
                    </span>
                    <h3 className="mt-4 text-base font-extrabold text-ink">{s.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{s.body}</p>
                    {s.tag && (
                      <span className="mt-4 inline-flex w-fit rounded-full border border-[#f3e0ab] bg-gold-soft px-3 py-1 text-xs font-bold text-gold-deep">
                        {s.tag}
                      </span>
                    )}
                  </Card>
                </Reveal>
              </li>
            ))}
          </ol>
        </section>
      </Shell>

      {/* --------------------------- live network ---------------------------- */}
      <section
        id="network"
        aria-label="Live partner network"
        className="border-y border-line bg-cream py-16 lg:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            align="center"
            eyebrow="Live partner network"
            title="The organisations already receiving"
            body="Real cards, live right now. Donors see exactly this — what you need, how much you have moved, how many people you have reached."
          />

          <div className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Partner organisations", value: SEED_PARTNERS.length },
              { label: "States covered", value: states },
              { label: "Items distributed", value: networkItems },
              { label: "People reached", value: networkPeople },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 60}>
                <div className="rounded-2xl border border-line bg-white px-5 py-5 text-center">
                  <p className="font-display text-3xl font-semibold text-ink tabular-nums">
                    <Counter value={s.value} duration={1200 + i * 150} />
                  </p>
                  <p className="mt-1 text-[0.7rem] font-bold uppercase tracking-wide text-muted">
                    {s.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SEED_PARTNERS.map((p, i) => (
              <li key={p.id} className="h-full">
                <Reveal delay={(i % 3) * 80} className="h-full">
                  <Card hover className="flex h-full flex-col p-6">
                    <div className="flex items-start gap-4">
                      <span
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold text-ink"
                        style={{ backgroundColor: p.logoBg }}
                        aria-hidden
                      >
                        {p.initials}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate text-base font-extrabold text-ink">{p.name}</h3>
                          {p.verified && (
                            <BadgeCheck className="h-4 w-4 shrink-0 text-forest" aria-label="Verified" />
                          )}
                        </div>
                        <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-muted">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          {KIND_LABEL[p.kind]} · {p.city}
                        </p>
                      </div>
                      {p.verified ? (
                        <StatusPill label="Verified" tone="success" />
                      ) : (
                        <StatusPill label="Verification in progress" tone="pending" />
                      )}
                    </div>

                    <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">{p.blurb}</p>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {p.focus.map((f) => (
                        <span
                          key={f}
                          className="rounded-full bg-mint px-3 py-1 text-[0.7rem] font-bold text-forest"
                        >
                          {f}
                        </span>
                      ))}
                      {p.needs.map((n) => (
                        <span
                          key={n}
                          className="rounded-full border border-line-strong bg-white px-3 py-1 text-[0.7rem] font-bold text-ink-soft"
                        >
                          Needs {CATEGORY_MAP[n].label.toLowerCase()}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-4 text-center">
                      <div>
                        <p className="font-display text-xl font-semibold text-ink tabular-nums">
                          {num(p.itemsDistributed)}
                        </p>
                        <p className="text-[0.68rem] font-bold text-muted">items distributed</p>
                      </div>
                      <div className="border-l border-line">
                        <p className="font-display text-xl font-semibold text-ink tabular-nums">
                          {num(p.peopleReached)}
                        </p>
                        <p className="text-[0.68rem] font-bold text-muted">people reached</p>
                      </div>
                    </div>
                  </Card>
                </Reveal>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-center text-sm text-muted">
            {SEED_PARTNERS.filter((p) => p.verified).length} verified ·{" "}
            {SEED_PARTNERS.filter((p) => !p.verified).length} in verification ·{" "}
            <Link href="/transparency" className="font-bold text-forest underline underline-offset-4">
              see how we count these numbers
            </Link>
          </p>
        </div>
      </section>

      <Shell>
        {/* ---------------------------- documents ----------------------------- */}
        <section aria-label="Documents required">
          <SectionHeading
            align="left"
            eyebrow="Documents required"
            title="Keep these five ready"
            body="Scans are fine, nothing needs to be notarised. The faster these are in, the faster you are live."
          />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {DOCUMENTS.map((d, i) => (
              <li key={d.title} className="h-full">
                <Reveal delay={i * 50} className="h-full">
                  <div className="flex h-full items-start gap-3 rounded-2xl border border-line bg-cream px-5 py-5">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-forest" />
                    <div>
                      <p className="text-sm font-extrabold text-ink">{d.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-muted">{d.body}</p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
            <li className="h-full">
              <Reveal delay={DOCUMENTS.length * 50} className="h-full">
                <div className="flex h-full items-start gap-3 rounded-2xl border border-dashed border-line-strong bg-white px-5 py-5">
                  <Send className="mt-0.5 h-5 w-5 shrink-0 text-forest-soft" />
                  <div>
                    <p className="text-sm font-extrabold text-ink">Where to send them</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted">
                      Attach everything in the form below, or email{" "}
                      <span className="font-bold text-ink">partners@sevakarya.com</span>. We reply
                      within a working day.
                    </p>
                  </div>
                </div>
              </Reveal>
            </li>
          </ul>
        </section>

        {/* ------------------------------ form -------------------------------- */}
        <section id="apply" aria-label="Partner application form" className="mt-16 scroll-mt-24 lg:mt-24">
          <SectionHeading
            align="left"
            eyebrow="Partner application"
            title="Start your application"
            body="Eight fields. No account needed yet — we will set up your partner login when verification clears."
          />
          <div className="mt-8">
            <PartnerApplyForm />
          </div>
        </section>

        {/* ------------------------------- FAQ -------------------------------- */}
        <section aria-label="Frequently asked questions" className="mt-16 lg:mt-24">
          <SectionHeading
            align="left"
            eyebrow="FAQ"
            title="Quick answers"
            body="Anything else — write to partners@sevakarya.com and a human replies."
          />
          <div className="mt-8 grid max-w-4xl gap-3">
            {FAQS.map((f, i) => (
              <Reveal key={f.q} delay={i * 60}>
                <details className="group surface-card px-6 py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-extrabold text-ink [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <Plus className="h-4 w-4 shrink-0 text-forest transition-transform duration-300 group-open:rotate-45" />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </section>

        {/* --------------------------- closing CTA ---------------------------- */}
        <Reveal>
          <div className="mt-16 rounded-[2rem] bg-ink px-6 py-12 text-center text-cream sm:px-10 lg:mt-24">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">
              Already onboard?
            </p>
            <h2 className="font-display mx-auto mt-4 max-w-2xl text-[clamp(1.6rem,3.5vw,2.4rem)] leading-[1.1] font-semibold text-cream text-balance">
              Your partner dashboard is one click away.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-cream/70 text-pretty">
              Incoming donations, distribution reporting, your live needs list and quarterly impact
              reports — all in one place.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button href="/ngo" variant="gold" size="lg">
                Already a partner? Open dashboard
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button href="/transparency" variant="onDark" size="lg">
                See the transparency page
              </Button>
            </div>
          </div>
        </Reveal>
      </Shell>
    </>
  );
}
