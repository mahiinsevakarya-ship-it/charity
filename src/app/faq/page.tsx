import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Handshake, Package, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/ui/motion";
import { Button, SectionHeading } from "@/components/ui/primitives";
import { PageHeader } from "@/components/ui/page";
import { FaqExplorer } from "./FaqExplorer";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Straight answers about donating, doorstep pickup, verification, Impact Stars, your account and partner organisations — searchable, in plain English.",
};

const RELATED = [
  {
    href: "/donate",
    icon: Package,
    title: "Ready to give?",
    body: "The donation wizard walks you through category, condition, photos and a pickup slot in about three minutes.",
    label: "Start a donation",
  },
  {
    href: "/transparency",
    icon: ShieldCheck,
    title: "Want the receipts?",
    body: "Follow donation codes from a cupboard to a partner's distribution log, and see the totals update daily.",
    label: "Open transparency",
  },
  {
    href: "/partners",
    icon: Handshake,
    title: "Represent an organisation?",
    body: "What we need to verify you, how routing works, and why there is never a fee for partners.",
    label: "Partner with us",
  },
];

export default function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="Help centre"
        title="Questions we get asked. Answered plainly."
        subtitle="Search it, filter it, open what you need. Seventeen answers written by the people who answer the phone — no bots, no filler."
        actions={
          <>
            <Button href="/contact" variant="secondary">
              Ask something else
            </Button>
            <Button href="/donate">Start a donation</Button>
          </>
        }
      />

      <section aria-label="Frequently asked questions" className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <Reveal>
          <FaqExplorer />
        </Reveal>
      </section>

      <section aria-labelledby="related-heading" className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow="Keep going"
              title="Reading is fine. Doing is better."
              body="Everything in these answers becomes real the first time a volunteer rings your doorbell."
            />
          </Reveal>

          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {RELATED.map((link, i) => (
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
        </div>
      </section>
    </>
  );
}
