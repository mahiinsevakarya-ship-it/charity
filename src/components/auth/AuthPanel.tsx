"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Building2,
  Check,
  ExternalLink,
  HeartHandshake,
  Mail,
  MessageSquare,
  Phone,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { Button, Card, Field, Input } from "@/components/ui/primitives";
import { fireConfetti } from "@/components/ui/motion";
import { GoogleAuthModal } from "./GoogleAuthModal";

type Tab = "phone" | "magic" | "ngo";
type MagicPhase = "idle" | "sending" | "sent";
type OtpPhase = "input_phone" | "enter_otp";

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.6 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.2 17.6 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.5c0-1.6-.15-3.2-.43-4.7H24v9h12.9c-.56 2.9-2.2 5.4-4.7 7l7.6 5.9c4.4-4.1 7.2-10.2 7.2-17.2z" />
      <path fill="#FBBC05" d="M10.4 28.7c-.5-1.4-.8-2.9-.8-4.7s.3-3.3.8-4.7l-7.8-6.1C1 16.4 0 20.1 0 24s1 7.6 2.6 10.8l7.8-6.1z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.8 2.3-8.3 2.3-6.4 0-11.7-3.7-13.6-9.9l-7.8 6.1C6.5 42.6 14.6 48 24 48z" />
    </svg>
  );
}

export function AuthPanel({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const { signInGoogle, signInPhone, signInNgo } = useApp();

  const [activeTab, setActiveTab] = useState<Tab>("phone");
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  // Phone / WhatsApp state
  const [phoneNumber, setPhoneNumber] = useState("");
  const [donorName, setDonorName] = useState("");
  const [whatsappOptIn, setWhatsappOptIn] = useState(true);
  const [otpPhase, setOtpPhase] = useState<OtpPhase>("input_phone");
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [otpTimer, setOtpTimer] = useState(30);
  const [generatedOtp, setGeneratedOtp] = useState("849201");
  const [showWhatsAppPush, setShowWhatsAppPush] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [otpVerifying, setOtpVerifying] = useState(false);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Magic link state
  const [email, setEmail] = useState("");
  const [magicName, setMagicName] = useState("");
  const [magicPhase, setMagicPhase] = useState<MagicPhase>("idle");
  const [magicError, setMagicError] = useState("");
  const [magicVerifyUrl, setMagicVerifyUrl] = useState("");
  const [emailDispatched, setEmailDispatched] = useState(false);

  // NGO Portal state
  const [ngoName, setNgoName] = useState("");
  const [ngoEmail, setNgoEmail] = useState("");
  const [ngoPhone, setNgoPhone] = useState("");
  const [ngoDarpan, setNgoDarpan] = useState("");
  const [ngoError, setNgoError] = useState("");
  const [ngoSubmitting, setNgoSubmitting] = useState(false);

  // Countdown timer for OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpPhase === "enter_otp" && otpTimer > 0) {
      interval = setInterval(() => setOtpTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpPhase, otpTimer]);

  // 1. Phone OTP Handlers
  function sendOtp(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const clean = phoneNumber.replace(/\D/g, "");
    if (clean.length < 10) {
      setPhoneError("Enter a valid 10-digit mobile number.");
      return;
    }
    setPhoneError("");
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setOtpPhase("enter_otp");
    setOtpTimer(30);
    setShowWhatsAppPush(true);

    // Auto-hide push notification after 8s
    window.setTimeout(() => setShowWhatsAppPush(false), 8000);
  }

  function handleOtpChange(index: number, val: string) {
    if (!/^\d*$/.test(val)) return;
    const next = [...otpCode];
    next[index] = val.slice(-1);
    setOtpCode(next);

    if (val && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }

    // Auto-verify when 6 digits are typed
    if (next.every((d) => d !== "") && next.join("").length === 6) {
      verifyOtpCode(next.join(""));
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  }

  function fillOtpFromBanner() {
    const digits = generatedOtp.split("");
    setOtpCode(digits);
    verifyOtpCode(generatedOtp);
  }

  function verifyOtpCode(code: string) {
    setOtpVerifying(true);
    window.setTimeout(() => {
      if (code === generatedOtp || code.length === 6) {
        signInPhone(`+91 ${phoneNumber}`, donorName || undefined, whatsappOptIn);
        fireConfetti();
        router.push("/impact");
      } else {
        setPhoneError("Invalid OTP. Click the banner or resend.");
        setOtpVerifying(false);
      }
    }, 650);
  }

  // 2. Magic Link Handlers
  async function submitMagic(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      setMagicError("Enter a valid email address.");
      return;
    }
    setMagicError("");
    setMagicPhase("sending");

    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          name: magicName.trim() || undefined,
          role: "USER",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMagicVerifyUrl(data.verifyUrl || "");
        setEmailDispatched(Boolean(data.emailSent));
        setMagicPhase("sent");
      } else {
        setMagicError(data.error || "Could not send magic link.");
        setMagicPhase("idle");
      }
    } catch {
      setMagicError("Network error. Please try again.");
      setMagicPhase("idle");
    }
  }

  // 3. NGO Sign-in Handler
  function submitNgo(e: React.FormEvent) {
    e.preventDefault();
    if (!ngoName.trim()) {
      setNgoError("Organisation name is required.");
      return;
    }
    if (!ngoEmail.includes("@")) {
      setNgoError("Official email address is required.");
      return;
    }
    if (ngoPhone.replace(/\D/g, "").length < 10) {
      setNgoError("Coordinator mobile number is required.");
      return;
    }

    setNgoError("");
    setNgoSubmitting(true);

    window.setTimeout(() => {
      signInNgo(ngoName.trim(), ngoEmail.trim(), ngoPhone.trim(), ngoDarpan.trim() || undefined);
      fireConfetti();
      router.push("/ngo");
    }, 800);
  }

  // 4. Google Modal Selector Callback
  function handleGoogleAccount(account: { name: string; email: string }) {
    setShowGoogleModal(false);
    signInGoogle(account);
    fireConfetti();
    router.push("/impact");
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 pt-8 pb-28 sm:px-6 sm:py-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14 lg:px-8 lg:py-16">
      {/* Story Column */}
      <div className="hidden flex-col justify-between lg:flex">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-forest">
            ← Back to home
          </Link>
          <h1 className="font-display mt-8 text-4xl leading-[1.06] font-semibold text-ink text-balance">
            {mode === "login"
              ? "Welcome back to ReKindle."
              : "Give things a second life in 30 seconds."}
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
            Instant sign-in via WhatsApp/SMS OTP, Google, or Magic Link. Zero passwords to remember,
            and real-time pickup updates straight to your phone.
          </p>

          <ul className="mt-8 grid gap-4">
            {[
              {
                icon: Smartphone,
                title: "WhatsApp & SMS Updates",
                body: "Doorstep pickup alerts, volunteer tracking, and star awards delivered to WhatsApp.",
              },
              {
                icon: ShieldCheck,
                title: "Role-Based Hubs",
                body: "Dedicated portals for Donors, Verified NGOs, Doorstep Volunteers, and Admins.",
              },
              {
                icon: Sparkles,
                title: "Instant Impact Stars",
                body: "Verified donations automatically credit Impact Stars redeemable for sustainability perks.",
              },
            ].map((f) => (
              <li key={f.title} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mint text-forest">
                  <f.icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-extrabold text-ink">{f.title}</span>
                  <span className="block text-sm leading-relaxed text-muted">{f.body}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 max-w-sm rounded-2xl border border-line bg-cream p-5 text-sm leading-relaxed text-ink-soft">
          “Pickup arrived in 2 hours, and WhatsApp kept me posted until the books reached Vidya Setu.”
          <span className="mt-2 block text-xs font-bold text-forest-soft">
            — Mahesh R., Bengaluru · 18 donations verified
          </span>
        </div>
      </div>

      {/* Main Auth Form Card */}
      <div className="relative">
        {/* Simulated WhatsApp Notification Banner */}
        {showWhatsAppPush && (
          <div
            onClick={fillOtpFromBanner}
            className="anim-slide-up mb-4 flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-emerald-300 bg-emerald-50 p-4 shadow-lg transition-all hover:bg-emerald-100"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                <MessageSquare className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-extrabold text-emerald-900">
                  WhatsApp from ReKindle Security
                </p>
                <p className="text-sm font-bold text-emerald-800">
                  Your verification code is <span className="underline">{generatedOtp}</span>
                </p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-xs">
              Auto-fill OTP
            </span>
          </div>
        )}

        <Card className="p-7 sm:p-9">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold tracking-[0.2em] text-forest-soft uppercase">
              {mode === "login" ? "Welcome back" : "Get started"}
            </p>
            <Link href="/" className="text-xs font-bold text-forest lg:hidden">
              ← Home
            </Link>
          </div>

          <h2 className="font-display mt-2 text-2xl font-semibold text-ink sm:text-3xl">
            {mode === "login" ? "Sign in to your account" : "Create your donor profile"}
          </h2>
          <p className="mt-1 text-xs text-muted sm:text-sm">
            No passwords required. Choose your preferred sign-in method.
          </p>

          {/* Quick Google 1-Tap Button */}
          <button
            type="button"
            onClick={() => setShowGoogleModal(true)}
            className="mt-6 flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-line-strong bg-white px-5 py-3 text-sm font-bold text-ink transition-all hover:border-forest hover:bg-cream/40"
          >
            <GoogleMark />
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-4">
            <span className="h-px flex-1 bg-line" />
            <span className="text-xs font-bold text-muted uppercase">or continue with</span>
            <span className="h-px flex-1 bg-line" />
          </div>

          {/* Segmented Tab Selector */}
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-sand/60 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("phone")}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-bold transition-all ${
                activeTab === "phone"
                  ? "bg-white text-forest shadow-xs"
                  : "text-muted hover:text-ink"
              }`}
            >
              <Phone className="h-3.5 w-3.5" />
              Mobile OTP
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("magic")}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-bold transition-all ${
                activeTab === "magic"
                  ? "bg-white text-forest shadow-xs"
                  : "text-muted hover:text-ink"
              }`}
            >
              <Mail className="h-3.5 w-3.5" />
              Magic Link
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("ngo")}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-bold transition-all ${
                activeTab === "ngo"
                  ? "bg-white text-forest shadow-xs"
                  : "text-muted hover:text-ink"
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              NGO Portal
            </button>
          </div>

          {/* 1. MOBILE / WHATSAPP OTP TAB */}
          {activeTab === "phone" && (
            <div className="mt-6">
              {otpPhase === "input_phone" ? (
                <form onSubmit={sendOtp} className="grid gap-4">
                  {mode === "signup" && (
                    <Field label="Your full name" hint="optional">
                      <Input
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        placeholder="e.g. Mahesh Rao"
                        autoComplete="name"
                      />
                    </Field>
                  )}

                  <Field label="Mobile Number" error={phoneError}>
                    <div className="flex gap-2">
                      <span className="flex h-12 items-center justify-center rounded-xl border border-line-strong bg-cream px-3.5 text-sm font-bold text-ink">
                        🇮🇳 +91
                      </span>
                      <Input
                        type="tel"
                        required
                        inputMode="numeric"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="98450 11223"
                        className="flex-1 text-base tracking-wider"
                      />
                    </div>
                  </Field>

                  <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-line bg-cream p-3 text-xs text-ink-soft">
                    <input
                      type="checkbox"
                      checked={whatsappOptIn}
                      onChange={(e) => setWhatsappOptIn(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded-md text-forest focus:ring-forest"
                    />
                    <span>
                      <strong className="block font-bold text-forest">WhatsApp notifications enabled</strong>
                      Receive pickup tracking, volunteer details, and impact certificates.
                    </span>
                  </label>

                  <Button type="submit" size="lg" className="w-full">
                    Send Verification Code
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
              ) : (
                <div className="anim-slide-up grid gap-4">
                  <div className="rounded-2xl border border-mint-deep bg-mint p-4 text-center">
                    <p className="text-xs font-bold text-forest-soft uppercase tracking-wider">
                      OTP Sent to +91 {phoneNumber}
                    </p>
                    <p className="mt-1 text-xs text-ink-soft">
                      Check your SMS or WhatsApp for the 6-digit code.
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-center text-xs font-bold text-ink uppercase tracking-wider">
                      Enter 6-Digit Code
                    </label>
                    <div className="flex justify-center gap-2 sm:gap-3">
                      {otpCode.map((digit, i) => (
                        <input
                          key={i}
                          ref={(el) => {
                            otpInputsRef.current[i] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(i, e)}
                          className="h-13 w-11 rounded-xl border-2 border-line-strong bg-white text-center text-xl font-bold text-ink transition-all focus:border-forest focus:outline-hidden sm:w-12"
                        />
                      ))}
                    </div>
                    {phoneError && (
                      <p className="mt-2 text-center text-xs font-bold text-clay">{phoneError}</p>
                    )}
                  </div>

                  <Button
                    size="lg"
                    loading={otpVerifying}
                    onClick={() => verifyOtpCode(otpCode.join(""))}
                    disabled={otpCode.some((d) => !d) || otpVerifying}
                    className="w-full"
                  >
                    {otpVerifying ? "Verifying…" : "Verify & Sign In"}
                  </Button>

                  <div className="flex items-center justify-between text-xs font-semibold text-muted">
                    <button
                      type="button"
                      onClick={() => setOtpPhase("input_phone")}
                      className="hover:text-forest hover:underline"
                    >
                      Change phone number
                    </button>
                    <button
                      type="button"
                      disabled={otpTimer > 0}
                      onClick={() => sendOtp()}
                      className="flex items-center gap-1 font-bold text-forest disabled:text-muted hover:underline"
                    >
                      <RotateCcw className="h-3 w-3" />
                      {otpTimer > 0 ? `Resend in ${otpTimer}s` : "Resend OTP"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. MAGIC LINK TAB */}
          {activeTab === "magic" && (
            <div className="mt-6">
              {magicPhase === "sent" ? (
                <div className="anim-slide-up grid gap-4">
                  <div className="rounded-2xl border border-mint-deep bg-mint p-5 text-center">
                    <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-forest text-cream">
                      <Mail className="h-5 w-5" />
                    </span>
                    <p className="mt-3 text-base font-extrabold text-ink">Check your inbox</p>
                    <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                      {emailDispatched ? (
                        <>A real magic link was sent via Resend to <strong>{email}</strong>.</>
                      ) : (
                        <>We prepared a signed cryptographic token for <strong>{email}</strong>.</>
                      )}
                    </p>
                  </div>

                  {magicVerifyUrl && (
                    <Button
                      size="lg"
                      href={magicVerifyUrl}
                      className="w-full"
                    >
                      Open Magic Link Now
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}

                  <button
                    type="button"
                    onClick={() => setMagicPhase("idle")}
                    className="text-center text-xs font-bold text-muted hover:text-forest"
                  >
                    ← Send to a different email
                  </button>
                </div>
              ) : (
                <form onSubmit={submitMagic} className="grid gap-4">
                  {mode === "signup" && (
                    <Field label="Your name" hint="optional">
                      <Input
                        value={magicName}
                        onChange={(e) => setMagicName(e.target.value)}
                        placeholder="e.g. Mahesh Rao"
                      />
                    </Field>
                  )}

                  <Field label="Email address" error={magicError}>
                    <Input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      inputMode="email"
                    />
                  </Field>

                  <Button
                    type="submit"
                    size="lg"
                    loading={magicPhase === "sending"}
                    className="w-full"
                  >
                    {magicPhase === "sending" ? "Sending link…" : "Send Magic Link"}
                  </Button>
                </form>
              )}
            </div>
          )}

          {/* 3. NGO / PARTNER PORTAL TAB */}
          {activeTab === "ngo" && (
            <form onSubmit={submitNgo} className="mt-6 grid gap-4">
              <Field label="Organisation / Trust Name">
                <Input
                  required
                  value={ngoName}
                  onChange={(e) => setNgoName(e.target.value)}
                  placeholder="e.g. Vidya Setu Trust"
                />
              </Field>

              <Field label="Official Email">
                <Input
                  type="email"
                  required
                  value={ngoEmail}
                  onChange={(e) => setNgoEmail(e.target.value)}
                  placeholder="ops@vidyasetu.org"
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Coordinator WhatsApp">
                  <Input
                    type="tel"
                    required
                    value={ngoPhone}
                    onChange={(e) => setNgoPhone(e.target.value)}
                    placeholder="+91 98450 11223"
                  />
                </Field>

                <Field label="NGO Darpan / 80G ID" hint="optional">
                  <Input
                    value={ngoDarpan}
                    onChange={(e) => setNgoDarpan(e.target.value)}
                    placeholder="KA/2024/012345"
                  />
                </Field>
              </div>

              {ngoError && <p className="text-xs font-bold text-clay">{ngoError}</p>}

              <Button
                type="submit"
                size="lg"
                loading={ngoSubmitting}
                className="w-full"
              >
                <HeartHandshake className="h-4 w-4" />
                Access Partner Dashboard
              </Button>
            </form>
          )}

          <p className="mt-6 text-center text-xs text-muted">
            {mode === "login" ? (
              <>
                New to ReKindle?{" "}
                <Link href="/signup" className="font-bold text-forest underline underline-offset-4">
                  Create an account
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link href="/login" className="font-bold text-forest underline underline-offset-4">
                  Sign in
                </Link>
              </>
            )}
          </p>

          <p className="mt-6 flex items-center justify-center gap-1.5 border-t border-line pt-5 text-center text-xs text-muted">
            <Check className="h-3.5 w-3.5 text-forest" />
            End-to-end encrypted · WhatsApp pickup notifications · No passwords stored
          </p>
        </Card>
      </div>

      {/* Google Account Selector Modal */}
      <GoogleAuthModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
        onSelectAccount={handleGoogleAccount}
      />
    </div>
  );
}
