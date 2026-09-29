import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, EyeOff, Lock, MapPinOff, ShieldCheck, CreditCard } from "lucide-react";
import { Reveal } from "@/components/ui/motion";
import { Button, StatusPill } from "@/components/ui/primitives";
import { PageHeader } from "@/components/ui/page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What ReKindle collects (account, address, donation photos), how we use it, cookies and localStorage, who we share it with, how long we keep it and the rights you can exercise.",
};

type Section = { id: string; title: string; paras: ReactNode[] };

const SECTIONS: Section[] = [
  {
    id: "collect",
    title: "What we collect",
    paras: [
      "We collect only what a donation actually needs. That falls into four groups:",
      <>
        <strong className="font-bold text-ink">Account details</strong> — your name and email
        address, and, if you choose Google sign-in, the identifier Google shares with us. No
        password is ever created or stored; sign-in is by magic link.
      </>,
      <>
        <strong className="font-bold text-ink">Pickup and donation details</strong> — the address
        and phone number for the collection slot, the category, quantities and condition of what you
        are giving, and any note you add for the volunteer.
      </>,
      <>
        <strong className="font-bold text-ink">Photos and messages</strong> — images of the items
        you list, the occasional handover photo taken by a volunteer, and anything you send us
        through the contact form or by email.
      </>,
      <>
        <strong className="font-bold text-ink">Activity and technical logs</strong> — your Impact
        Stars ledger, donation statuses, and standard server logs such as IP address, browser and
        device type, which we keep for security and debugging.
      </>,
    ],
  },
  {
    id: "use",
    title: "How we use your information",
    paras: [
      "We use your data to run the service: to send you a magic link, to book and confirm a pickup, to show your donation timeline, to credit Impact Stars after verification, and to answer you when you write in.",
      "Beyond that, we use aggregated, non-identifying figures to publish impact statistics, and we may occasionally email you about a donation that needs your attention or a change to how ReKindle works. Marketing emails are separate, optional, and every one of them has a one-click unsubscribe.",
      "Our legal bases are your consent (you chose to give us this information to make a donation happen), the performance of our agreement with you, and our legitimate interest in keeping the Platform secure and improving it. Where Indian law requires a notice of consent, we ask for it at the point of collection.",
    ],
  },
  {
    id: "photos",
    title: "Your donation photos",
    paras: [
      "Photos are the heart of verification, so it is worth being specific about them. They are used to check condition and counts against what you listed, to help the partner decide what it can accept, and to show progress on your own donation timeline.",
      "They are shared with the partner organisation receiving that specific donation — nobody else. They are never published with your name attached, never used in marketing without asking you first, and never sold or licensed to anyone.",
      "Photos stay with the donation record until the donation completes and for 12 months afterwards, or until you ask us to delete them — whichever comes first. If you would rather a particular photo was removed, write to us with the donation code and we will delete it.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies, localStorage and trackers",
    paras: [
      <>
        ReKindle uses a small number of first-party cookies to keep you signed in and to remember
        preferences such as your chosen city. We do not run advertising cookies, and we do not drop
        third-party trackers that follow you across other websites.
      </>,
      <>
        We also use localStorage in your browser. Your session, donations, star transactions and
        preferences are saved under the key{" "}
        <code className="rounded bg-sand px-1.5 py-0.5 text-[0.85rem] font-semibold text-ink-soft">
          rekindle:v1
        </code>{" "}
        so the dashboard loads instantly and still works when your connection does not. That data
        lives in your browser, not on a marketing profile — clearing your browser data signs you
        out and clears your local draft.
      </>,
      "You can block or clear cookies and localStorage in your browser settings at any time. The Platform will still work; you will simply need to sign in again, and any unsaved donation draft will be lost.",
    ],
  },
  {
    id: "sharing",
    title: "Who we share it with",
    paras: [
      <>
        We do not sell your personal data. Not to advertisers, not to data brokers, not to anyone.
        We share it only in these situations:
      </>,
      "The partner organisation receiving your donation — they get your first name, the pickup or drop-off details, the item list and the photos for that donation, because they cannot receive it otherwise.",
      "Pickup volunteers and logistics partners working on our behalf — they get the address, the slot window and your contact number for that collection, and nothing more.",
      "Service providers who host our database, deliver magic-link emails, or help us run support. They process data on our written instructions and may not use it for their own purposes.",
      "Authorities, when the law requires it. If we ever receive a lawful request, we will tell you unless we are legally prohibited from doing so.",
    ],
  },
  {
    id: "storage",
    title: "Where your data lives",
    paras: [
      "ReKindle is an Indian company and your data is stored on servers located in India, operated by established cloud providers. Pickup details, photos and star records stay within India.",
      "Our email delivery provider may process messages outside India in order to deliver them. Where that happens, we rely on contractual safeguards and keep the amount of data involved to the minimum needed to send the message.",
      "Volunteers and partner staff who can see your information are based in India, are trained on handling it, and are given access only for the donation in front of them.",
    ],
  },
  {
    id: "retention",
    title: "How long we keep it",
    paras: [
      "While your account is active, we keep your account details, donation history and star ledger so the service works. When you ask us to delete your account, we remove your profile, address, phone number and photos within 30 days and email you a confirmation.",
      "We keep donation and star transaction records for as long as legally required for audit and accounting — usually eight years for financial and tax records — stripped of your address and photos. Support emails are kept for 24 months so we can see what we told you before.",
      "Server logs are kept for 90 days, then deleted or aggregated. Anything past these periods is either anonymised beyond recognition or erased.",
    ],
  },
  {
    id: "rights",
    title: "Your rights",
    paras: [
      "You are in control of your information. Under Indian law, including the Digital Personal Data Protection Act, 2023, you can ask us to:",
      <>
        <strong className="font-bold text-ink">Access</strong> a copy of everything we hold about
        you; <strong className="font-bold text-ink">correct</strong> anything inaccurate;
        <strong className="font-bold text-ink"> delete</strong> your account and personal data;
        <strong className="font-bold text-ink"> port</strong> your donation history in a readable
        file; and <strong className="font-bold text-ink"> withdraw consent</strong> for anything you
        previously agreed to, including marketing emails.
      </>,
      <>
        To exercise any of these, email{" "}
        <a
          href="mailto:help@rekindle.org"
          className="font-bold text-forest underline decoration-mint-deep underline-offset-4"
        >
          help@rekindle.org
        </a>{" "}
        from the address on your account with the word “privacy” in the subject line. We reply
        within 30 days, usually within three working days, and we will not ask you why you want it.
        If we ever refuse a request, we will explain the reason in writing.
      </>,
      "If you are unhappy with how we handle your data, you can raise a complaint with us first — and, if you remain unsatisfied, with the Data Protection Board of India.",
    ],
  },
  {
    id: "children",
    title: "Children's privacy",
    paras: [
      "ReKindle is not directed at children under 18, and we do not knowingly create accounts for them. We do not knowingly collect their personal data either.",
      "When a school, college or youth group runs a donation drive, the account is held by a teacher or an adult coordinator who is responsible for it. Children can take part in the collection without an individual account or a personal address being stored.",
      "If you believe a child has given us personal data without that kind of supervision, write to us and we will delete it promptly.",
    ],
  },
  {
    id: "security",
    title: "How we keep it safe",
    paras: [
      "All traffic to ReKindle is encrypted in transit (HTTPS). Access to production data is limited to a small number of engineers who need it, is logged, and is revoked when someone's role changes.",
      "We never collect payment card details — donors pay nothing — so there is no card data for anyone to steal. Donation photos are stored separately from public web paths and are only reachable through an authenticated request for that donation.",
      "If something does go wrong, we will tell you and the relevant authorities within the timelines Indian law requires, and we will tell you what happened in plain language rather than a legal one.",
    ],
  },
  {
    id: "changes-contact",
    title: "Changes to this policy, and how to reach us",
    paras: [
      "When we change this policy materially, we update the date below, show a notice on the Platform and email the address on your account at least 14 days before it takes effect. Minor clarifications just get a new date.",
      <>
        The controller of your data is ReKindle Technologies Pvt. Ltd., No. 42, 3rd Floor, 80 Feet
        Road, 4th Block, Koramangala, Bengaluru 560034. For anything privacy-related, email{" "}
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
        .
      </>,
    ],
  },
];

const NEVER = [
  { icon: CreditCard, label: "We never ask for card details" },
  { icon: EyeOff, label: "We never sell or rent your data" },
  { icon: MapPinOff, label: "We never track your location in the background" },
  { icon: Lock, label: "We never show your address to anyone but the volunteer" },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        subtitle="What we collect, why we collect it, how long we keep it and how to make us delete it — written so you can actually finish reading it."
        actions={
          <Button href="/terms" variant="secondary">
            Read the Terms
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
                  Ask about your data
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
                  <ShieldCheck className="h-5 w-5" strokeWidth={1.9} />
                </span>
                <p className="mt-4 max-w-3xl text-[0.98rem] leading-relaxed text-ink-soft">
                  The short version: we collect a name, an email, an address and photos of what you
                  are giving — because a pickup needs all four. We do not sell it, we do not run
                  ads, and you can have all of it deleted by writing one email.
                </p>

                <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {NEVER.map((item) => (
                    <li
                      key={item.label}
                      className="flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 text-sm font-semibold text-ink-soft"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-mint text-forest">
                        <item.icon className="h-4 w-4" strokeWidth={2} />
                      </span>
                      {item.label}
                    </li>
                  ))}
                </ul>
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
                  <Lock className="h-5 w-5" strokeWidth={1.9} />
                </span>
                <h2 className="font-display mt-4 text-2xl font-semibold text-ink">
                  Want a copy of your data, or want it gone?
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">
                  One email does it. Put “privacy” in the subject line, write from the address on
                  your account, and we will reply within three working days — with the export, or
                  with a confirmation that it is deleted.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button href="/contact">Contact the team</Button>
                  <Button href="/faq" variant="secondary">
                    Privacy questions in the FAQ
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
