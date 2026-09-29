import Link from "next/link";
import { ArrowRight, Leaf, MapPin, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/motion";

function HeroScene() {
  return (
    <div className="relative">
      <svg
        viewBox="0 0 620 500"
        className="w-full drop-shadow-[0_30px_60px_rgba(26,26,23,0.13)]"
        role="img"
        aria-label="A donor handing a box of clothes and books to a volunteer, with a child receiving a book"
      >
        <defs>
          <pattern id="dots" width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.4" fill="#1a1a17" opacity="0.07" />
          </pattern>
          <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fdfbf6" />
            <stop offset="100%" stopColor="#f7efe1" />
          </linearGradient>
        </defs>

        <rect width="620" height="500" rx="36" fill="url(#sky)" />
        <rect width="620" height="500" rx="36" fill="url(#dots)" />
        <circle cx="512" cy="96" r="74" fill="#e6f2ec" />
        <circle cx="96" cy="132" r="46" fill="#fdf3d8" opacity="0.85" />

        {/* ground */}
        <ellipse cx="310" cy="434" rx="252" ry="30" fill="#f0e6d3" />

        {/* plant */}
        <g>
          <path d="M64 402h56l-8 34H72z" fill="#df7a58" />
          <path d="M92 402c0-34 16-52 34-60-4 30-14 48-34 60Z" fill="#16825f" />
          <path d="M92 402c-2-26-14-40-30-46 4 24 12 38 30 46Z" fill="#0e5c43" />
        </g>

        {/* donor */}
        <g>
          <rect x="150" y="300" width="25" height="94" rx="12" fill="#37423c" />
          <rect x="182" y="300" width="25" height="94" rx="12" fill="#2c352f" />
          <rect x="142" y="386" width="38" height="17" rx="8" fill="#1a1a17" />
          <rect x="178" y="386" width="38" height="17" rx="8" fill="#1a1a17" />
          <rect x="139" y="198" width="79" height="114" rx="32" fill="#0e5c43" />
          <path
            d="M214 226l44 56"
            stroke="#e8b48c"
            strokeWidth="19"
            strokeLinecap="round"
            fill="none"
          />
          <path d="M210 220l22 27" stroke="#0a4533" strokeWidth="21" strokeLinecap="round" fill="none" />
          <circle cx="178" cy="168" r="28" fill="#e8b48c" />
          <ellipse cx="178" cy="151" rx="28" ry="21" fill="#2b2118" />
          <circle cx="169" cy="170" r="2.8" fill="#1a1a17" />
          <circle cx="188" cy="170" r="2.8" fill="#1a1a17" />
          <path
            d="M170 181c5 5 12 5 17 0"
            stroke="#1a1a17"
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* carton with items */}
        <g>
          <rect x="268" y="246" width="46" height="56" rx="6" fill="#0e5c43" />
          <rect x="308" y="252" width="9" height="44" rx="3" fill="#fbf6ec" />
          <rect x="322" y="258" width="58" height="46" rx="10" fill="#df7a58" />
          <path d="M344 258l7 12 7-12" fill="#fbf6ec" />
          <rect x="252" y="296" width="118" height="18" rx="7" fill="#d19e6b" />
          <rect x="252" y="308" width="118" height="72" rx="8" fill="#e0b183" />
          <rect x="304" y="308" width="14" height="72" fill="#cd945f" opacity="0.75" />
          <path d="M252 320h118" stroke="#cd945f" strokeWidth="2" />
        </g>

        {/* volunteer */}
        <g>
          <rect x="416" y="302" width="25" height="92" rx="12" fill="#33404a" />
          <rect x="448" y="302" width="25" height="92" rx="12" fill="#28333c" />
          <rect x="408" y="386" width="38" height="17" rx="8" fill="#1a1a17" />
          <rect x="444" y="386" width="38" height="17" rx="8" fill="#1a1a17" />
          <rect x="404" y="198" width="81" height="116" rx="32" fill="#fbf6ec" stroke="#e3dbc9" strokeWidth="2" />
          <rect x="424" y="198" width="44" height="116" rx="22" fill="#df7a58" />
          <path
            d="M410 228l-42 54"
            stroke="#c98a5e"
            strokeWidth="19"
            strokeLinecap="round"
            fill="none"
          />
          <path d="M414 222l-22 26" stroke="#fbf6ec" strokeWidth="21" strokeLinecap="round" fill="none" />
          <circle cx="445" cy="168" r="28" fill="#c98a5e" />
          <ellipse cx="445" cy="150" rx="28" ry="21" fill="#3b2a1e" />
          <circle cx="436" cy="170" r="2.8" fill="#1a1a17" />
          <circle cx="455" cy="170" r="2.8" fill="#1a1a17" />
          <path
            d="M437 181c5 5 12 5 17 0"
            stroke="#1a1a17"
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
          />
          {/* clipboard */}
          <g transform="rotate(9 500 268)">
            <rect x="476" y="236" width="46" height="60" rx="7" fill="#ffffff" stroke="#ddd3c0" strokeWidth="2" />
            <rect x="488" y="230" width="22" height="12" rx="4" fill="#0e5c43" />
            <path d="M486 258h26M486 270h20" stroke="#c9c1ae" strokeWidth="4" strokeLinecap="round" />
          </g>
        </g>

        {/* child receiving a book */}
        <g>
          <rect x="524" y="344" width="16" height="46" rx="8" fill="#16825f" />
          <rect x="546" y="344" width="16" height="46" rx="8" fill="#16825f" />
          <rect x="518" y="384" width="26" height="13" rx="6" fill="#1a1a17" />
          <rect x="542" y="384" width="26" height="13" rx="6" fill="#1a1a17" />
          <rect x="518" y="296" width="50" height="56" rx="22" fill="#f0b01c" />
          <path d="M568 318l24 22" stroke="#c98a5e" strokeWidth="15" strokeLinecap="round" fill="none" />
          <rect x="576" y="322" width="34" height="26" rx="4" fill="#0e5c43" transform="rotate(-8 593 335)" />
          <circle cx="543" cy="278" r="20" fill="#c98a5e" />
          <ellipse cx="543" cy="265" rx="20" ry="15" fill="#2b2118" />
          <circle cx="537" cy="280" r="2.2" fill="#1a1a17" />
          <circle cx="550" cy="280" r="2.2" fill="#1a1a17" />
          <path d="M538 288c3 4 8 4 11 0" stroke="#1a1a17" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        </g>

        {/* handoff spark */}
        <path
          d="M244 244c26-30 62-38 96-22"
          stroke="#f0b01c"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          className="flow-line"
        />
      </svg>

      {/* floating chips */}
      <div className="absolute top-4 left-4 flex items-center gap-2 rounded-2xl border border-line bg-white/95 px-3.5 py-2.5 text-sm font-bold text-ink shadow-card anim-float sm:top-6 sm:left-6">
        <span className="text-base">👕</span> 8 clothes
      </div>
      <div
        className="absolute top-10 right-4 flex items-center gap-2 rounded-2xl border border-[#f3e0ab] bg-gold-soft px-3.5 py-2.5 text-sm font-extrabold text-gold-deep shadow-card anim-float sm:right-6"
        style={{ animationDelay: "1.2s" }}
      >
        <Star className="h-4 w-4 fill-gold text-gold" /> +120 after verification
      </div>
      <div
        className="absolute bottom-16 left-6 flex items-center gap-2 rounded-2xl border border-line bg-white/95 px-3.5 py-2.5 text-sm font-bold text-ink shadow-card anim-float sm:bottom-20"
        style={{ animationDelay: "0.6s" }}
      >
        <span className="text-base">📚</span> 12 books
      </div>
      <div className="absolute right-4 bottom-6 flex items-center gap-2 rounded-2xl border border-mint-deep bg-mint px-3.5 py-2.5 text-sm font-bold text-forest shadow-card sm:right-8">
        <ShieldCheck className="h-4 w-4" /> Pickup scheduled
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
