import type { Metadata } from "next";
import { AuthGate } from "@/components/ui/page";
import { NgoDashboard } from "./NgoDashboard";

export const metadata: Metadata = {
  title: "Partner dashboard",
  description:
    "Vidya Setu Trust on SevaKarya — incoming donations, distribution reporting, live item needs and quarterly impact reports.",
  robots: { index: false, follow: false },
};

export default function NgoPage() {
  return (
    <AuthGate
      title="Partner sign-in"
      message="The dashboard shows live donations routed to your organisation, so we need to know which partner account you are."
    >
      <NgoDashboard />
    </AuthGate>
  );
}
