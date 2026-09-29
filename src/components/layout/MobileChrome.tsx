"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clock, Home, PackagePlus, Plus, Sparkles, User } from "lucide-react";

const TABS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/donate", label: "Donate", icon: PackagePlus },
  { href: "/impact", label: "Impact", icon: Sparkles },
  { href: "/my-donations", label: "History", icon: Clock },
  { href: "/profile", label: "Profile", icon: User },
];

export function MobileChrome() {
  const pathname = usePathname();

  return (
    <>
      <Link
        href="/donate"
        className="fixed right-4 bottom-24 z-40 inline-flex h-14 items-center gap-2 rounded-full bg-forest px-5 text-sm font-bold text-cream shadow-pop transition-transform active:scale-95 md:hidden"
        aria-label="Start a donation"
      >
        <Plus className="h-5 w-5" />
        Donate
      </Link>

      <nav
        aria-label="Mobile"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-bg/95 backdrop-blur-xl md:hidden"
      >
        <ul className="mx-auto flex max-w-lg items-stretch justify-between px-2">
          {TABS.map((tab) => {
            const active =
              tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
            return (
              <li key={tab.href} className="flex-1">
                <Link
                  href={tab.href}
                  className={`flex flex-col items-center gap-1 rounded-xl py-2.5 text-[0.65rem] font-bold transition-colors ${
                    active ? "text-forest" : "text-muted"
                  }`}
                >
                  <span
                    className={`flex h-7 w-10 items-center justify-center rounded-full transition-colors ${
                      active ? "bg-mint" : ""
                    }`}
                  >
                    <tab.icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.4 : 1.9} />
                  </span>
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
