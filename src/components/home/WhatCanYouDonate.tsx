import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CATEGORIES } from "@/lib/catalog";
import { Reveal } from "@/components/ui/motion";
import { SectionHeading } from "@/components/ui/primitives";

export function WhatCanYouDonate() {
  return (
    <section aria-labelledby="what-heading" className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8 lg:pt-28">
      <Reveal>
        <SectionHeading
          eyebrow="What can you donate?"
          title="Almost anything still useful has a second home."
          body="If it is clean, safe and usable, somebody in your city is looking for it today."
        />
      </Reveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((cat, i) => (
          <Reveal key={cat.key} delay={i * 70}>
            <Link
              href={`/donate?category=${cat.key}`}
              className="group surface-card flex h-full flex-col p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-mint-deep hover:shadow-card"
            >
              <div className="flex items-start justify-between">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cream text-3xl transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
                  {cat.emoji}
                </span>
                <ArrowUpRight className="h-5 w-5 text-muted opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-forest group-hover:opacity-100" />
              </div>
              <h3 className="mt-5 text-lg font-extrabold text-ink">{cat.label}</h3>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">{cat.blurb}</p>
              <p className="mt-4 inline-flex w-fit rounded-full bg-mint px-3 py-1 text-xs font-bold text-forest">
                {cat.starLabel}
              </p>
            </Link>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120} className="mt-8 text-center">
        <Link
          href="/donate"
          className="inline-flex items-center gap-2 text-sm font-bold text-forest underline decoration-mint-deep decoration-2 underline-offset-8 transition-colors hover:decoration-forest"
        >
          Start a donation — it takes about 3 minutes
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </Reveal>
    </section>
  );
}
