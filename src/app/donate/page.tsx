"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { DonateWizard } from "@/components/donate/Wizard";
import { AuthGate, PageHeader, Shell } from "@/components/ui/page";
import { Skeleton } from "@/components/ui/primitives";

function WizardLoader() {
  return (
    <Shell>
      <div className="grid gap-4">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-72 w-full" />
      </div>
    </Shell>
  );
}

function DonateInner() {
  const params = useSearchParams();
  const preset = params.get("category");

  useEffect(() => {
    if (preset) {
      sessionStorage.setItem("rk:preset-category", preset);
    }
  }, [preset]);

  return (
    <>
      <PageHeader
        eyebrow="Start a donation"
        title="Give something a second life."
        subtitle="Six short steps. About three minutes. You can come back to this draft at any point."
        back={{ href: "/", label: "Home" }}
      />
      <AuthGate
        title="Sign in to start a donation"
        message="Your donation, pickup slot and Impact Stars are tied to your account, so we need to know who you are. Magic link only — no password."
      >
        <DonateWizard />
      </AuthGate>
    </>
  );
}

export default function DonatePage() {
  return (
    <Suspense fallback={<WizardLoader />}>
      <DonateInner />
    </Suspense>
  );
}
