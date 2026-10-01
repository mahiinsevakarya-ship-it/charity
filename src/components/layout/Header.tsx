"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Building2, ClipboardList, LogOut, Menu, ShieldCheck, Sparkles, User as UserIcon, X } from "lucide-react";
import { Button, Logo } from "@/components/ui/primitives";
import { Avatar } from "@/components/ui/motion";
import { num } from "@/lib/format";
import { useApp, useMyStats } from "@/lib/store";

const NAV = [
  { href: "/donate", label: "Donate" },
  { href: "/impact", label: "Impact" },
  { href: "/rewards", label: "Rewards" },
  { href: "/partners", label: "NGO Partners" },
  { href: "/transparency", label: "Transparency" },
];

export function Header() {
  const pathname = usePathname();
  const { me, signOut, ready } = useApp();
  const stats = useMyStats();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
    setMenu(false);
  }

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenu(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-bg/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="SevaKarya home" className="shrink-0">
          <Logo className="h-8" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
                  active ? "bg-mint text-forest" : "text-ink-soft hover:bg-cream hover:text-forest"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {ready && me ? (
            <>
              <Link
                href="/impact"
                className="hidden items-center gap-1.5 rounded-full border border-[#f3e0ab] bg-gold-soft px-3 py-1.5 text-sm font-bold text-gold-deep transition-colors hover:bg-gold hover:text-ink sm:inline-flex"
              >
                <Sparkles className="h-4 w-4" />
                {num(stats.balance)}
              </Link>
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenu((v) => !v)}
                  className="flex items-center gap-2 rounded-full border border-line-strong bg-white py-1 pl-1 pr-2.5 transition-colors hover:border-forest"
                  aria-expanded={menu}
                  aria-haspopup="menu"
                >
                  <Avatar initials={me.initials} color={me.avatarColor} size="sm" />
                  <span className="hidden text-sm font-bold text-ink md:block">
                    {me.name.split(" ")[0]}
                  </span>
                </button>
                {menu && (
                  <div
                    role="menu"
                    className="anim-slide-up absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-line bg-white p-2 shadow-card"
                  >
                    <div className="flex items-center gap-3 px-3 py-3">
                      <Avatar initials={me.initials} color={me.avatarColor} size="md" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-ink">{me.name}</p>
                        <p className="truncate text-xs text-muted">{me.email}</p>
                      </div>
                    </div>
                    <div className="mx-3 mb-2 rounded-xl bg-gold-soft px-3 py-2 text-xs font-bold text-gold-deep">
                      ⭐ {num(stats.balance)} Impact Stars · {stats.level.name}
                    </div>
                    {[
                      { href: "/profile", label: "Profile", icon: UserIcon, show: true },
                      { href: "/my-donations", label: "My Donations", icon: ClipboardList, show: me.role === "USER" || me.role === "ADMIN" },
                      { href: "/rewards", label: "Rewards & Stars", icon: Sparkles, show: me.role === "USER" || me.role === "ADMIN" },
                      { href: "/ngo", label: "Partner Dashboard", icon: Building2, show: me.role === "NGO" || me.role === "ADMIN" },
                      { href: "/admin", label: "Admin Console", icon: ShieldCheck, show: me.role === "ADMIN" },
                    ]
                      .filter((l) => l.show)
                      .map((l) => (
                        <Link
                          key={l.href}
                          href={l.href}
                          role="menuitem"
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:bg-cream hover:text-forest"
                        >
                          <l.icon className="h-4 w-4" />
                          {l.label}
                        </Link>
                      ))}
                    <button
                      onClick={() => {
                        signOut();
                        setMenu(false);
                      }}
                      role="menuitem"
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-clay transition-colors hover:bg-clay-soft"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link
              href="/login"
              className="hidden rounded-full px-3.5 py-2 text-sm font-semibold text-ink-soft transition-colors hover:text-forest sm:block"
            >
              Sign in
            </Link>
          )}

          <Button href="/donate" size="sm" className="hidden! sm:inline-flex! whitespace-nowrap">
            Donate Now
          </Button>

          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line-strong bg-white text-ink lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto border-t border-line bg-bg px-4 pb-28 pt-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {[{ href: "/", label: "Home" }, ...NAV, { href: "/about", label: "About Us" }, { href: "/faq", label: "FAQ" }].map(
              (item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl px-4 py-3.5 text-lg font-bold text-ink transition-colors hover:bg-cream"
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>
          <div className="mt-6 grid gap-3">
            <Button href="/donate" size="lg">
              Donate Now →
            </Button>
            {me ? (
              <Button href="/impact" variant="secondary" size="lg">
                See Your Impact
              </Button>
            ) : (
              <Button href="/login" variant="secondary" size="lg">
                Sign in with Magic Link
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
