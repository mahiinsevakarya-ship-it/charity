import Link from "next/link";
import {
  ArrowRight,
  Leaf,
  MapPin,
  ShieldCheck,
  Truck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/motion";

function HeroScene() {
  return (
    <div className="relative mx-auto w-full max-w-[580px]">
      {/* Central Illustration Container */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-line bg-gradient-to-br from-[#fdfbf7] via-[#faf4e8] to-[#f4ebe0] p-6 shadow-[0_30px_70px_-20px_rgba(14,92,67,0.18)] sm:p-8">
        {/* Subtle Background Pattern & Glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-mint/50 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gold-soft/60 blur-3xl"
        />

        {/* Vector Artwork */}
        <svg
          viewBox="0 0 520 400"
          className="relative z-10 h-auto w-full"
          role="img"
          aria-label="SevaKarya Giving Ecosystem: donor parcel routed to school library and community shelter"
        >
          <defs>
            <linearGradient id="boxGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#dfb78c" />
              <stop offset="100%" stopColor="#bf8f5f" />
            </linearGradient>
            <linearGradient id="forestGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#16825f" />
              <stop offset="100%" stopColor="#0e5c43" />
            </linearGradient>
            <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f7c844" />
              <stop offset="100%" stopColor="#f0b01c" />
            </linearGradient>
            <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#0e5c43" floodOpacity="0.12" />
            </filter>
          </defs>

          {/* Background Ambient Pedestal */}
          <ellipse cx="260" cy="350" rx="210" ry="32" fill="#ebdcc8" opacity="0.6" />
          <ellipse cx="260" cy="345" rx="160" ry="22" fill="#f5ede0" />

          {/* Dynamic Golden Giving Arc */}
          <path
            d="M 120 280 C 120 140, 400 140, 400 270"
            fill="none"
            stroke="url(#goldGrad)"
            strokeWidth="3.5"
            strokeDasharray="8 8"
            className="flow-line"
            opacity="0.85"
          />

          {/* Central SevaKarya Care Box */}
          <g filter="url(#shadow)" transform="translate(180, 180)">
            {/* Box Body */}
            <rect x="0" y="40" width="160" height="120" rx="16" fill="url(#boxGrad)" />
            {/* Box Flap shading */}
            <path d="M 0 40 L 80 58 L 160 40 L 160 52 L 80 70 L 0 52 Z" fill="#aa7949" opacity="0.4" />
            {/* Vertical Eco Ribbon */}
            <rect x="70" y="40" width="20" height="120" fill="url(#forestGrad)" />
            {/* Horizontal Ribbon */}
            <rect x="0" y="90" width="160" height="18" fill="url(#forestGrad)" opacity="0.9" />

            {/* Official SevaKarya Sprout Seal */}
            <circle cx="80" cy="99" r="24" fill="#fdfcfa" stroke="#e8e4dc" strokeWidth="2" />
            <circle cx="80" cy="99" r="20" fill="#0e5c43" />
            {/* Sprout Icon in seal */}
            <path
              d="M 74 107 C 74 100, 78 95, 84 93 C 84 99, 81 104, 74 107 Z"
              fill="#f0b01c"
            />
            <path
              d="M 86 107 C 86 102, 83 97, 78 95 C 78 101, 81 105, 86 107 Z"
              fill="#a7f3d0"
            />
            <line x1="80" y1="99" x2="80" y2="108" stroke="#fdfcfa" strokeWidth="2" strokeLinecap="round" />

            {/* Sparkle badge on box */}
            <circle cx="140" cy="55" r="10" fill="#f0b01c" />
            <path d="M 140 49 L 142 53 L 146 55 L 142 57 L 140 61 L 138 57 L 134 55 L 138 53 Z" fill="#ffffff" />
          </g>

          {/* Left Giving Stack: Folded Clothes & Storybooks */}
          <g filter="url(#shadow)" transform="translate(60, 210)">
            {/* Bottom Book */}
            <rect x="10" y="90" width="100" height="22" rx="4" fill="#0e5c43" />
            <rect x="10" y="92" width="6" height="18" fill="#f0b01c" />
            <rect x="110" y="93" width="90" height="16" fill="#fdfcfa" rx="2" opacity="0.3" />

            {/* Middle Book (Terracotta) */}
            <rect x="18" y="70" width="88" height="20" rx="4" fill="#df7a58" />
            <rect x="18" y="72" width="6" height="16" fill="#fdfcfa" />

            {/* Top Folded Apparel with Tag */}
            <rect x="12" y="32" width="96" height="38" rx="12" fill="#16825f" />
            <path d="M 45 32 Q 60 48 75 32" fill="none" stroke="#0e5c43" strokeWidth="3" strokeLinecap="round" />
            {/* Garment Tag */}
            <rect x="85" y="44" width="18" height="22" rx="3" fill="#fdfcfa" stroke="#e8e4dc" strokeWidth="1" />
            <circle cx="94" cy="48" r="2" fill="#0e5c43" />
            <line x1="88" y1="54" x2="100" y2="54" stroke="#a7f3d0" strokeWidth="2" />
            <line x1="88" y1="59" x2="96" y2="59" stroke="#cbd5e1" strokeWidth="1.5" />
          </g>

          {/* Right Receiving Outcome: School Desk, Backpack & Verified Handover */}
          <g filter="url(#shadow)" transform="translate(360, 210)">
            {/* Backpack */}
            <rect x="25" y="40" width="70" height="75" rx="20" fill="#0e5c43" />
            <rect x="35" y="65" width="50" height="40" rx="10" fill="#16825f" />
            <circle cx="60" cy="52" r="6" fill="#f0b01c" />
            <rect x="52" y="78" width="16" height="5" rx="2.5" fill="#fdfcfa" />
            {/* Backpack Straps */}
            <path d="M 40 40 Q 60 20 80 40" fill="none" stroke="#f0b01c" strokeWidth="4" strokeLinecap="round" />

            {/* Pair of Shoes */}
            <rect x="5" y="98" width="40" height="16" rx="8" fill="#f0b01c" />
            <path d="M 12 98 L 22 92 L 35 98" fill="#df7a58" />
            <rect x="20" y="106" width="22" height="6" rx="3" fill="#ffffff" opacity="0.9" />

            {/* Verified Partner Stamp Flag */}
            <g transform="translate(60, 0)">
              <line x1="20" y1="10" x2="20" y2="45" stroke="#0e5c43" strokeWidth="3" strokeLinecap="round" />
              <path d="M 20 10 L 65 18 L 20 28 Z" fill="#f0b01c" />
              <circle cx="34" cy="19" r="3" fill="#ffffff" />
            </g>
          </g>

          {/* Floating Sparkles */}
          <g transform="translate(140, 110)">
            <path d="M 10 0 L 13 7 L 20 10 L 13 13 L 10 20 L 7 13 L 0 10 L 7 7 Z" fill="#f0b01c" />
          </g>
          <g transform="translate(380, 120)">
            <path d="M 8 0 L 10 6 L 16 8 L 10 10 L 8 16 L 6 10 L 0 8 L 6 6 Z" fill="#16825f" />
          </g>
          <g transform="translate(255, 70)">
            <path d="M 12 0 L 15 9 L 24 12 L 15 15 L 12 24 L 9 15 L 0 12 L 9 9 Z" fill="#f0b01c" />
          </g>
        </svg>

        {/* 4 Interactive Live Floating Cards */}
        {/* 1. Top-Left: Curated Items */}
        <div className="absolute top-3 left-3 flex items-center gap-2.5 rounded-2xl border border-line-strong bg-white/95 px-3 py-2 shadow-card backdrop-blur-md anim-float sm:top-5 sm:left-5 sm:px-3.5 sm:py-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-mint text-sm font-bold text-forest">
            📚
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-extrabold text-ink">15 Books & 8 Clothes</p>
            <p className="truncate text-[0.65rem] font-semibold text-muted">Vidya Setu School Library</p>
          </div>
        </div>

        {/* 2. Top-Right: Star Reward */}
        <div
          className="absolute top-3 right-3 flex items-center gap-2 rounded-2xl border border-[#f3e0ab] bg-gold-soft/95 px-3 py-2 shadow-card backdrop-blur-md anim-float sm:top-5 sm:right-5 sm:px-3.5 sm:py-2.5"
          style={{ animationDelay: "1.2s" }}
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gold text-xs font-bold text-white shadow-xs">
            ⭐
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-extrabold text-gold-deep">+260 Impact Stars</p>
            <p className="truncate text-[0.65rem] font-semibold text-gold-deep/80">Credited on verified pickup</p>
          </div>
        </div>

        {/* 3. Bottom-Left: Community Impact */}
        <div
          className="absolute bottom-3.5 left-3 flex max-w-[200px] items-center gap-2 rounded-2xl border border-line bg-white/95 px-3 py-1.5 shadow-card backdrop-blur-md anim-float sm:bottom-5 sm:left-5 sm:px-3 sm:py-2"
          style={{ animationDelay: "0.6s" }}
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-mint text-forest">
            <Users className="h-3 w-3" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[0.72rem] font-extrabold text-ink">45+ Children</p>
            <p className="truncate text-[0.62rem] font-bold text-forest">Govt Primary School</p>
          </div>
        </div>

        {/* 4. Bottom-Right: Doorstep Pickup Status */}
        <div
          className="absolute right-3 bottom-3.5 flex max-w-[190px] items-center gap-2 rounded-2xl border border-mint-deep bg-mint/95 px-3 py-1.5 shadow-card backdrop-blur-md sm:right-5 sm:bottom-5 sm:px-3 sm:py-2"
          style={{ animationDelay: "1.8s" }}
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-forest text-cream">
            <Truck className="h-3 w-3" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[0.72rem] font-extrabold text-forest-dark">Doorstep Pickup</p>
            <p className="truncate text-[0.62rem] font-bold text-forest">Today · 10 AM – 12 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1000px_520px_at_15%_-10%,#e6f2ec_0%,transparent_60%),radial-gradient(880px_460px_at_95%_0%,#fdf3d8_0%,transparent_55%)]"
      />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pt-10 pb-14 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-8 lg:pt-16 lg:pb-24">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-mint-deep bg-mint px-4 py-1.5 text-xs font-bold tracking-wide text-forest">
            <Leaf className="h-3.5 w-3.5" />
            Give it a second life
          </span>

          <h1 className="font-display mt-6 text-[clamp(2.4rem,5.6vw,4rem)] leading-[1.02] font-semibold text-ink text-balance">
            Give what you don&apos;t need.
            <span className="mt-2 block text-forest">Change someone&apos;s tomorrow.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft text-pretty">
            Your old clothes, books and shoes can become someone else&apos;s new beginning. List a
            donation in under three minutes — we handle pickup, verification and the handover to a
            trusted NGO near you.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button href="/donate" size="lg">
              Donate Now
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button href="/impact" size="lg" variant="secondary">
              See Your Impact
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4 border-t border-line pt-6">
            <div className="flex -space-x-2.5">
              {[
                ["MR", "#0e5c43"],
                ["AS", "#df7a58"],
                ["FQ", "#16825f"],
                ["NK", "#d99512"],
              ].map(([initials, color]) => (
                <span
                  key={initials}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-bg text-[0.68rem] font-bold text-white"
                  style={{ backgroundColor: color }}
                >
                  {initials}
                </span>
              ))}
              <span className="inline-flex h-9 items-center rounded-full border-2 border-bg bg-cream px-3 text-[0.7rem] font-bold text-ink-soft">
                12k+ donors
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-ink-soft">
              <MapPin className="h-4 w-4 text-forest" />
              46 partner orgs across 19 cities
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-ink-soft">
              <ShieldCheck className="h-4 w-4 text-forest" />
              94% of submissions verified
            </div>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <HeroScene />
        </Reveal>

        <div className="sr-only">
          <Link href="/donate">Donate now</Link>
        </div>
      </div>
    </section>
  );
}
