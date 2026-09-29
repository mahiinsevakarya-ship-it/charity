import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/motion";
import { Button } from "@/components/ui/primitives";

export function FinalCTA() {
  return (
    <section aria-labelledby="final-cta-heading" className="mx-auto mt-24 max-w-7xl px-4 sm:px-6 lg:mt-32 lg:px-8">
      <Reveal className="relative overflow-hidden rounded-[2.5rem] bg-forest px-6 py-16 text-center text-cream shadow-pop sm:px-12 lg:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:radial-gradient(circle_at_1px_1px,#fbf6ec_1px,transparent_0)] [background-size:26px_26px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-20 h-72 w-72 rounded-full bg-gold/25 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-mint/20 blur-3xl"
        />

        <div className="relative">
          <span className="text-3xl">🌱 → 🌿 → 🌳</span>
          <h2
            id="final-cta-heading"
            className="font-display mx-auto mt-6 max-w-3xl text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.05] font-semibold text-balance"
          >
            Ready to give something a second life?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-cream/75 text-pretty">
            One small act. One useful item. One better tomorrow.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button href="/donate" size="lg" variant="gold">
              Donate Now
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button href="/transparency" size="lg" variant="outlineLight">
              See where donations go
            </Button>
          </div>

          <p className="mt-8 text-xs font-semibold tracking-wide text-cream/55">
            Doorstep pickup in 19 cities · Verified partner network · Impact Stars after review
          </p>
        </div>
      </Reveal>
    </section>
  );
}
