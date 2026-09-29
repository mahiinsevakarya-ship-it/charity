"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { Logo } from "@/components/ui/primitives";

const COLUMNS = [
  {
    title: "Give",
    links: [
      { href: "/donate", label: "Donate items" },
      { href: "/my-donations", label: "My donations" },
      { href: "/rewards", label: "Impact Stars" },
      { href: "/impact", label: "Impact dashboard" },
    ],
  },
  {
    title: "Platform",
    links: [
      { href: "/transparency", label: "Transparency" },
      { href: "/partners", label: "NGO partners" },
      { href: "/about", label: "About us" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/faq", label: "FAQ" },
      { href: "/terms", label: "Terms & Conditions" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/ngo", label: "Partner dashboard" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo className="h-9" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              A reuse platform for the things you no longer need. We connect your cupboards with
              schools, shelters and community partners who can use them today.
            </p>
            <p className="mt-5 max-w-sm rounded-2xl border border-line bg-white/70 px-4 py-3 text-xs leading-relaxed text-muted">
              <span className="font-bold text-ink-soft">Impact Stars are recognition points</span>{" "}
              for your contribution and do not represent cash value unless explicitly stated by the
              platform.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-forest-soft">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm font-semibold text-ink-soft transition-colors hover:text-forest"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted">
            © 2026 ReKindle Technologies Pvt. Ltd. · Bengaluru, India
          </p>
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest-soft">
            Built for a world that throws away less
            <Heart className="h-3.5 w-3.5 fill-current" />
          </p>
        </div>
      </div>
    </footer>
  );
}
