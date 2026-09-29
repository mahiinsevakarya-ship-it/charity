import { Hero } from "@/components/home/Hero";
import { ImpactStats } from "@/components/home/ImpactStats";
import { WhatCanYouDonate } from "@/components/home/WhatCanYouDonate";
import { HowItWorks } from "@/components/home/HowItWorks";
import { SecondLife } from "@/components/home/SecondLife";
import { ImpactStories } from "@/components/home/ImpactStories";
import { StarsSection } from "@/components/home/StarsSection";
import { PartnerSection } from "@/components/home/PartnerSection";
import { TransparencySection } from "@/components/home/TransparencySection";
import { FinalCTA } from "@/components/home/FinalCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ImpactStats />
      <WhatCanYouDonate />
      <HowItWorks />
      <SecondLife />
      <ImpactStories />
      <StarsSection />
      <PartnerSection />
      <TransparencySection />
      <FinalCTA />
    </>
  );
}
