import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthPanel } from "@/components/auth/AuthPanel";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to SevaKarya with a magic link or Google. No password required.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <AuthPanel mode="login" />
    </Suspense>
  );
}
