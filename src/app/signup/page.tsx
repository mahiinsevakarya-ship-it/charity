import type { Metadata } from "next";
import { AuthPanel } from "@/components/auth/AuthPanel";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a ReKindle account with a magic link. No password required.",
};

export default function SignupPage() {
  return <AuthPanel mode="signup" />;
}
