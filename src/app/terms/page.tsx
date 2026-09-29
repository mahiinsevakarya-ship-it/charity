import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Scale, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/ui/motion";
import { Button, StatusPill } from "@/components/ui/primitives";
import { PageHeader } from "@/components/ui/page";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The agreement between you and ReKindle — accounts, eligible items, pickups, verification, Impact Stars, partner organisations, liability and governing law.",
};

type Section = { id: string; title: string; paras: ReactNode[] };

const SECTIONS: Section[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    paras: [
      <>
        ReKindle Technologies Pvt. Ltd. is a company registered in Bengaluru, Karnataka, which runs
        the website and app at rekindle.org (the “Platform”). In these terms, “ReKindle”, “we”, “us”
        and “our” mean the company, and “you” means anyone who uses the Platform.
      </>,
      <>
        We operate a reuse service: you list pre-owned clothes, books, shoes, bags, toys or
        household items, we coordinate verification and a doorstep pickup or drop-off, and a
        verified partner organisation receives and distributes them. We are a facilitator. We do
        not buy, sell, trade or take ownership of your items, and we never charge a donor for a
        pickup. You can read more about how we work on the{" "}
        <Link
          href="/about"
          className="font-bold text-forest underline decoration-mint-deep underline-offset-4"
        >
          About page
        </Link>
        .
      </>,
    ],
  },
  {
    id: "agreement",
    title: "Your agreement with us",
    paras: [
      "By creating an account, scheduling a pickup or otherwise using the Platform, you agree to these Terms & Conditions and to our Privacy Policy. If you do not agree with either, please do not use the Platform.",
      "You must be 18 years or older to schedule a pickup in your own name. Under-18s can take part through a school, college or family account, with an adult responsible for handing the bundle to the volunteer.",
      "We may update these terms from time to time. For material changes — anything that affects your stars, your data or your rights — we will email the address on your account and show a notice on the Platform at least 14 days before it takes effect. Continuing to use ReKindle after that date means you accept the updated terms; if you do not, close your account and stop using the Platform.",
    ],
  },
  {
    id: "account",
    title: "Your account",
    paras: [
      <>
        Accounts are free and are created with a magic link or through Google. You give us a name
        and an email address so that pickup slots, receipts and Impact Stars have somewhere to land.
        You are responsible for anything that happens under your account, so tell us straight away at{" "}
        <a
          href="mailto:help@rekindle.org"
          className="font-bold text-forest underline decoration-mint-deep underline-offset-4"
        >
          help@rekindle.org
        </a>{" "}
        if you think someone else has access to it.
      </>,
      "ReKindle is built for giving, not for selling. Listing items for sale, soliciting donors for a commercial purpose, running resale operations through the Platform, or creating duplicate accounts to collect stars more than once are all grounds for immediate suspension.",
      <>
        You can close your account at any time by writing to us. We will delete your profile,
        address and donation photos within 30 days, and keep only the minimal records the law
        requires. The details are in our{" "}
        <Link
          href="/privacy"
          className="font-bold text-forest underline decoration-mint-deep underline-offset-4"
        >
          Privacy Policy
        </Link>
        .
      </>,
    ],
  },
  {
    id: "eligible-items",
    title: "What you can (and cannot) donate",
    paras: [
      <>
        The Platform accepts clothes, books, shoes, bags, toys and household extras that are
        clean, complete and reusable. When you list an item you choose a condition — Like New, Good,
        Usable or Needs Repair — and upload photos that fairly describe what you are sending.
      </>,
      "You confirm that the items are yours to give, are not stolen, pledged as security, or subject to someone else's claim, and are not on any recall or safety notice. Children's items must meet current safety standards and include all of their parts.",
      "We cannot accept medicine, food, hazardous material, anything with exposed wiring or gas, items soiled or mouldy beyond practical reuse, or anything whose possession or transfer is against the law. If a partner finds such an item inside a bundle, it will be refused and we will arrange responsible disposal at our cost.",
      "Deliberately misdescribing an item — wrong counts, wrong condition, photos of something else — is a serious breach of these terms. We will pause the donation, remove any stars credited for it, and may suspend your account.",
    ],
  },
  {
    id: "pickup",
    title: "Pickup and drop-off",
    paras: [
      <>
        Doorstep pickups run in two-hour slots between 8 AM and 8 PM, seven days a week in the
        cities listed during the donation flow. Rescheduling is free up to two hours before your
        slot, from My Donations or by calling{" "}
        <a
          href="tel:+918047112200"
          className="font-bold text-forest underline decoration-mint-deep underline-offset-4"
        >
          +91 80 4711 2200
        </a>
        .
      </>,
      "If nobody is available and there is no safe place to leave the bundle, the slot is recorded as a no-show and can be rebooked once. Repeated no-shows may pause pickup privileges for 30 days — drop-off points stay open to you in the meantime.",
      "Our volunteers carry ReKindle ID and may show it on request. They will never ask you for money, a tip or a favour of any kind, and a pickup is always free. If someone does, refuse and report it to us the same day — it is grounds for removing that volunteer from the network.",
      "For drop-offs, the collection point's address and hours are shown in the wizard. Please only bring items within the stated weight or size guidance so the hub team can accept them in one visit.",
    ],
  },
  {
    id: "verification",
    title: "Verification, acceptance and rejection",
    paras: [
      "Every donation is reviewed by a human at our verification desk after it reaches the partner hub — normally within 24 hours, and up to 48 hours during January and August. Verification checks photos, counts and condition against what you listed.",
      "The partner receiving the bundle makes the final call on what it can use. The outcome, with a short reason, appears on your donation timeline. If items are declined, no Impact Stars are credited for them, and we offer a return or a responsible recycler within seven days at our cost.",
      <>
        Stars are awarded on the count a partner confirms, not the count entered in the form. That
        is deliberate: it is the only way the number on your dashboard means something. You can
        follow the whole chain on the{" "}
        <Link
          href="/transparency"
          className="font-bold text-forest underline decoration-mint-deep underline-offset-4"
        >
          Transparency dashboard
        </Link>
        .
      </>,
      "If you disagree with a decision, write to us within 14 days with the donation code. We will re-review it with the partner and reply with a clear answer — including when the answer is still no.",
    ],
  },
  {
    id: "stars",
    title: "Impact Stars",
    paras: [
      "Impact Stars are recognition points for verified donations. They are credited after a partner confirms receipt: 10 per clothing item, 8 per book, 20 per pair of shoes, 15 per bag and 12 per toy. “Other” items are assessed manually.",
      <>
        Stars are not currency. They have no cash value, cannot be transferred or sold, and do not
        expire unless a specific, clearly labelled promotion says otherwise. They unlock levels —
        Starter, Contributor, Community Builder and Impact Champion — and the perks attached to
        them, which are listed on the{" "}
        <Link
          href="/rewards"
          className="font-bold text-forest underline decoration-mint-deep underline-offset-4"
        >
          Rewards page
        </Link>
        .
      </>,
      "We may correct the ledger when there is a duplicate, a miscount or a system error, and we will tell you when we do. Perks are subject to availability and may change; if we change the earning rates or the level thresholds, we will give you 14 days' notice first.",
      "Impact Stars are recognition points for your contribution. They do not represent cash value unless a specific offer, in writing, says otherwise.",
    ],
  },
  {
    id: "conduct",
    title: "Fair use and community conduct",
    paras: [
      "Be decent to the volunteers, the hub teams and the people who receive your items. Discriminatory, abusive or threatening behaviour in messages, notes or photos is grounds for suspension, and we will not debate it.",
      "Do not include other people's personal details in your photos — faces, phone numbers, address slips. Blur or crop them before uploading. It protects them, and it keeps your donation moving faster through verification.",
      "Fabricating donations, farming stars through duplicate accounts, or using the Platform to promote a business will result in those stars being removed and the account being closed.",
      <>
        Feedback, suggestions and reviews you send us may be used to improve the Platform without
        any obligation to you. If you would rather we did not quote you publicly, say so in the
        message — we will keep it off the site. To raise a concern, use the{" "}
        <Link
          href="/contact"
          className="font-bold text-forest underline decoration-mint-deep underline-offset-4"
        >
          contact page
        </Link>
        .
      </>,
    ],
  },
  {
    id: "partners",
    title: "Partner organisations",
    paras: [
      "Partners are independent organisations — NGOs, shelters, schools and community groups. We verify their registration documents, address and references before they appear on the Platform, and we monitor their reporting, but we do not control how they operate.",
      "Partners agree to accept only what their community can use, to log counts honestly, to report distribution back to donors, and to keep donated items out of commercial sale. In return, they appear on the Platform, receive routed donations and logistics support at no cost.",
      "If a partner stops reporting or misuses donations, we pause their listings and stop routing to them while we investigate. Listings can be restored once the reporting is brought up to date.",
      <>
        Listing on ReKindle is not an endorsement of every activity of a partner organisation.
        Check the partner profile and, if you want more assurance, ask us for the verification date
        — we will happily share it. See{" "}
        <Link
          href="/partners"
          className="font-bold text-forest underline decoration-mint-deep underline-offset-4"
        >
          NGO partners
        </Link>
        .
      </>,
    ],
  },
  {
    id: "content",
    title: "Your content and our content",
    paras: [
      "Photos, notes and messages you upload stay yours. You give us a licence to store them, show them on your own donation timeline, and share them with the receiving partner for verification. That licence ends when you delete the content or your account, except for copies already lawfully shared with a partner.",
      "We may publish aggregated statistics — items collected, cities covered, categories donated — that cannot identify you. Public figures on the Transparency dashboard are built from those aggregates.",
      "The ReKindle name, logo, design, code, illustrations and written content belong to us or to our licensors. You may not copy, resell or rebrand them without written permission. Quoting a short excerpt with attribution in press or academic work is fine — just ask if you are unsure.",
    ],
  },
  {
    id: "liability",
    title: "Disclaimers and liability",
    paras: [
      "We work hard to offer a reliable service, but the Platform is provided “as is”. We cannot promise a particular pickup slot, a particular partner, or that an item you list will be accepted by someone nearby.",
      "Your items remain your responsibility until a volunteer collects them or a hub signs for them. After that we and our partners take reasonable care of them, but we are not responsible for delays caused by events outside our control — weather, strikes, civic restrictions or traffic.",
      "To the extent the law allows, ReKindle's total liability for any claim connected to the Platform is limited to ₹2,000 or the amount you have paid us in the twelve months before the claim, whichever is higher. You have paid nothing, so the figure is ₹2,000.",
      "Nothing in these terms limits liability that cannot be limited under Indian law, including liability for fraud, for death or personal injury caused by negligence, or your rights under the Consumer Protection Act, 2019.",
    ],
  },
  {
    id: "ending-law",
    title: "Ending your account, changes and governing law",
    paras: [
      "You can stop using ReKindle and close your account whenever you like, by writing to help@rekindle.org. We may suspend or end access if these terms are breached, if the Platform is misused, or if we are required to do so by law. Where it is fair to do so, we will warn you first.",
      "These terms are governed by the laws of India. The courts at Bengaluru, Karnataka have exclusive jurisdiction over any dispute, without prejudice to any consumer remedy available to you under applicable law.",
      <>
        Questions, complaints or a clause that does not read clearly? Write to{" "}
        <a
          href="mailto:help@rekindle.org"
          className="font-bold text-forest underline decoration-mint-deep underline-offset-4"
        >
          help@rekindle.org
        </a>{" "}
        or use the{" "}
        <Link
          href="/contact"
          className="font-bold text-forest underline decoration-mint-deep underline-offset-4"
        >
          contact form
        </Link>
        . We answer within one working day.
      </>,
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Terms & Conditions"
        subtitle="The plain-English agreement between you and ReKindle: what we do, what we ask of you, and what happens when something goes wrong."
        actions={
          <Button href="/privacy" variant="secondary">
            Read the Privacy Policy
          </Button>
        }
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-14">
          {/* ------------------------- desktop table of contents ------------------------ */}
          <nav aria-label="On this page" className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-line bg-cream p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-forest-soft">
                On this page
              </p>
              <ol className="mt-4 space-y-0.5">
                {SECTIONS.map((section, i) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="group flex items-start gap-2.5 rounded-lg px-2 py-1.5 text-sm leading-snug font-semibold text-ink-soft transition-colors hover:bg-white hover:text-forest"
                    >
                      <span className="text-[0.7rem] font-bold text-muted tabular-nums group-hover:text-forest-soft">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
              <div className="mt-4 border-t border-line pt-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-forest transition-colors hover:text-forest-dark"
                >
                  Questions? Talk to us
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </nav>

          <div className="min-w-0">
            {/* --------------------------- mobile section chips -------------------------- */}
            <nav
              aria-label="On this page"
              className="no-scrollbar -mx-4 mb-8 flex gap-2 overflow-x-auto px-4 lg:hidden"
            >
              {SECTIONS.map((section, i) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="shrink-0 rounded-full border border-line-strong bg-white px-3.5 py-2 text-xs font-bold text-ink-soft transition-colors hover:border-forest hover:text-forest"
                >
                  <span className="mr-1.5 text-muted tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {section.title}
                </a>
              ))}
            </nav>

            <Reveal>
              <div className="flex flex-wrap items-center gap-3">
                <StatusPill label="Last updated 14 September 2026" tone="active" />
                <span className="text-xs font-semibold text-muted">
                  Applies to rekindle.org and the ReKindle app
                </span>
              </div>

              <div className="mt-6 rounded-[1.75rem] border border-line bg-cream p-6 sm:p-8">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-mint text-forest">
                  <Scale className="h-5 w-5" strokeWidth={1.9} />
                </span>
                <p className="mt-4 max-w-3xl text-[0.98rem] leading-relaxed text-ink-soft">
                  Short version: donate things that are yours to give, treat volunteers and partners
                  decently, and never expect stars before an item is verified. The twelve sections
                  below are the long version — written to be read, not skipped.
                </p>
              </div>

              <div className="mt-4">
                {SECTIONS.map((section, i) => (
                  <section
                    key={section.id}
                    id={section.id}
                    className="scroll-mt-24 border-b border-line py-9 last:border-0"
                  >
                    <p className="text-xs font-bold tracking-[0.2em] text-gold-deep uppercase">
                      Section {String(i + 1).padStart(2, "0")}
                    </p>
                    <h2 className="font-display mt-2 text-[1.55rem] leading-tight font-semibold text-ink sm:text-[1.85rem]">
                      {section.title}
                    </h2>
                    <div className="mt-4 max-w-3xl space-y-4 text-[0.95rem] leading-relaxed text-ink-soft">
                      {section.paras.map((para, idx) => (
                        <p key={idx}>{para}</p>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </Reveal>

            {/* --------------------------------- closing -------------------------------- */}
            <Reveal delay={80} className="mt-10">
              <div className="rounded-[1.75rem] border border-mint-deep bg-mint p-7 sm:p-9">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-forest">
                  <ShieldCheck className="h-5 w-5" strokeWidth={1.9} />
                </span>
                <h2 className="font-display mt-4 text-2xl font-semibold text-ink">
                  Something in here does not sit right?
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">
                  Write to us and a person will read it — not a bot, not a ticket queue. We would
                  rather fix a confusing clause than have you sign past it.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button href="/contact">Contact us</Button>
                  <Button href="/faq" variant="secondary">
                    Browse the FAQ
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </>
  );
}
