"use client";

import { useState } from "react";
import { Check, Lock, UserPlus, X } from "lucide-react";
import { Avatar } from "@/components/ui/motion";
import { Button, Input } from "@/components/ui/primitives";

interface GoogleAccount {
  name: string;
  email: string;
  avatarColor: string;
  initials: string;
}

const PRESET_ACCOUNTS: GoogleAccount[] = [
  {
    name: "Mahesh Rao",
    email: "mahesh.rao@gmail.com",
    avatarColor: "#0e5c43",
    initials: "MR",
  },
  {
    name: "Ananya Sharma",
    email: "ananya.s@gmail.com",
    avatarColor: "#b14f31",
    initials: "AS",
  },
];

export function GoogleAuthModal({
  isOpen,
  onClose,
  onSelectAccount,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (account: { name: string; email: string }) => void;
}) {
  const [customMode, setCustomMode] = useState(false);
  const [customEmail, setCustomEmail] = useState("");
  const [customName, setCustomName] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<GoogleAccount | null>(null);

  if (!isOpen) return null;

  function choose(acc: GoogleAccount) {
    setSelected(acc);
    setLoading(true);
    window.setTimeout(() => {
      onSelectAccount({ name: acc.name, email: acc.email });
      setLoading(false);
    }, 600);
  }

  function submitCustom(e: React.FormEvent) {
    e.preventDefault();
    if (!customEmail.includes("@")) return;
    const cleanName = customName.trim() || customEmail.split("@")[0];
    const acc: GoogleAccount = {
      name: cleanName,
      email: customEmail.trim(),
      avatarColor: "#4285F4",
      initials: cleanName.slice(0, 2).toUpperCase(),
    };
    choose(acc);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="anim-pop relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Google Header */}
        <div className="border-b border-gray-100 p-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <svg viewBox="0 0 48 48" className="h-6 w-6" aria-hidden="true">
                <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.6 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.2 17.6 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.5c0-1.6-.15-3.2-.43-4.7H24v9h12.9c-.56 2.9-2.2 5.4-4.7 7l7.6 5.9c4.4-4.1 7.2-10.2 7.2-17.2z" />
                <path fill="#FBBC05" d="M10.4 28.7c-.5-1.4-.8-2.9-.8-4.7s.3-3.3.8-4.7l-7.8-6.1C1 16.4 0 20.1 0 24s1 7.6 2.6 10.8l7.8-6.1z" />
                <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.8 2.3-8.3 2.3-6.4 0-11.7-3.7-13.6-9.9l-7.8 6.1C6.5 42.6 14.6 48 24 48z" />
              </svg>
              <span className="text-sm font-bold text-gray-700">Sign in with Google</span>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <h2 className="mt-3 text-lg font-bold text-gray-900">Choose an account</h2>
          <p className="text-xs text-gray-500">to continue to <strong className="text-gray-800">ReKindle Charity</strong></p>
        </div>

        {/* Account List */}
        <div className="p-6">
          {customMode ? (
            <form onSubmit={submitCustom} className="grid gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700">Your Name</label>
                <Input
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Rahul Verma"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700">Google Email</label>
                <Input
                  type="email"
                  required
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="mt-1"
                />
              </div>
              <div className="mt-2 flex gap-2">
                <Button type="submit" size="sm" loading={loading} className="w-full">
                  Continue as {customEmail || "Google Account"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => setCustomMode(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="grid gap-2">
              {PRESET_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  disabled={loading}
                  onClick={() => choose(acc)}
                  className="flex w-full items-center justify-between rounded-xl border border-gray-100 p-3.5 text-left transition-all hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <Avatar initials={acc.initials} color={acc.avatarColor} size="md" />
                    <div>
                      <p className="text-sm font-bold text-gray-900">{acc.name}</p>
                      <p className="text-xs text-gray-500">{acc.email}</p>
                    </div>
                  </div>
                  {selected?.email === acc.email && loading ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-forest border-t-transparent" />
                  ) : (
                    <Check className="h-4 w-4 text-transparent hover:text-gray-300" />
                  )}
                </button>
              ))}

              <button
                disabled={loading}
                onClick={() => setCustomMode(true)}
                className="flex w-full items-center gap-3 rounded-xl border border-dashed border-gray-200 p-3.5 text-left text-xs font-bold text-forest transition-colors hover:bg-mint/40"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-mint text-forest">
                  <UserPlus className="h-4 w-4" />
                </span>
                Use another Google account
              </button>
            </div>
          )}

          {/* Google Consent Footer */}
          <div className="mt-6 border-t border-gray-100 pt-4 text-center">
            <p className="flex items-center justify-center gap-1.5 text-[0.7rem] text-gray-500">
              <Lock className="h-3 w-3 text-gray-400" />
              ReKindle will access your name, email address, and profile picture.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
