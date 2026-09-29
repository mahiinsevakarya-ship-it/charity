"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowRight, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { useApp } from "@/lib/store";
import { Button, Card } from "@/components/ui/primitives";
import { fireConfetti } from "@/components/ui/motion";

type Status = "verifying" | "success" | "expired" | "error";

export function VerifyClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { signInMagic } = useApp();

  const [status, setStatus] = useState<Status>(() => (!token ? "error" : "verifying"));
  const [errorMessage, setErrorMessage] = useState(() =>
    !token ? "No authentication token found in URL." : "",
  );
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    if (!token) return;

    let isMounted = true;

    async function verify() {
      try {
        const res = await fetch("/api/auth/verify-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (!isMounted) return;

        if (res.ok && data.valid && data.payload) {
          const { email, name, phone, role, whatsappOptIn, orgName, darpanId } = data.payload;
          setUserEmail(email);
          signInMagic(email, name, phone, role, whatsappOptIn, orgName, darpanId);
          setStatus("success");
          fireConfetti();

          const target = role === "NGO" ? "/ngo" : role === "ADMIN" ? "/admin" : "/impact";

          window.setTimeout(() => {
            router.push(target);
          }, 1400);
        } else {
          setStatus("expired");
          setErrorMessage(data.error || "This link is expired or has already been used.");
        }
      } catch {
        if (!isMounted) return;
        setStatus("error");
        setErrorMessage("Network error verifying your link. Please try again.");
      }
    }

    verify();

    return () => {
      isMounted = false;
    };
  }, [token, signInMagic, router]);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg items-center justify-center px-4 py-16">
      <Card className="w-full p-8 text-center sm:p-10">
        {status === "verifying" && (
          <div className="flex flex-col items-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-mint text-forest shadow-soft">
              <Loader2 className="h-8 w-8 animate-spin" />
            </span>
            <h1 className="font-display mt-6 text-2xl font-semibold text-ink">
              Verifying your magic link…
            </h1>
            <p className="mt-2 text-sm text-muted">
              Authenticating your session securely. You will be redirected in a moment.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="anim-pop flex flex-col items-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-forest text-cream shadow-soft">
              <CheckCircle2 className="h-8 w-8" />
            </span>
            <h1 className="font-display mt-6 text-2xl font-semibold text-ink">
              You are signed in!
            </h1>
            <p className="mt-2 text-sm text-ink-soft">
              Welcome to ReKindle, <span className="font-bold text-forest">{userEmail}</span>.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-xs font-bold text-forest">
              <Sparkles className="h-4 w-4" /> Redirecting to your dashboard…
            </div>
          </div>
        )}

        {(status === "expired" || status === "error") && (
          <div className="flex flex-col items-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-clay-soft text-[#b14f31] shadow-soft">
              <AlertCircle className="h-8 w-8" />
            </span>
            <h1 className="font-display mt-6 text-2xl font-semibold text-ink">
              Sign-in link expired
            </h1>
            <p className="mt-2 text-sm text-muted">
              {errorMessage || "Magic links are only valid for 15 minutes and can only be used once."}
            </p>
            <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
              <Button href="/login" size="lg" className="w-full">
                Request new link
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <Link
              href="/"
              className="mt-4 text-xs font-bold text-muted hover:text-forest"
            >
              ← Return to homepage
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}
