"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  Download,
  Mail,
  Pencil,
  Phone,
  Sparkles,
  Trash2,
  UserCog,
} from "lucide-react";
import { useApp, useMyStats } from "@/lib/store";
import { BADGES } from "@/lib/catalog";
import { formatDate, num } from "@/lib/format";
import { Avatar } from "@/components/ui/motion";
import {
  Button,
  Card,
  Field,
  Input,
  StatusPill,
} from "@/components/ui/primitives";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { AuthGate, PageHeader, Shell } from "@/components/ui/page";

function ProfileContent() {
  const router = useRouter();
  const { me, updateMe, signOut, myDonations } = useApp();
  const stats = useMyStats();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(me?.name ?? "");
  const [phone, setPhone] = useState(me?.phone ?? "");
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!me) return null;

  function save() {
    updateMe({ name: name.trim() || me!.name, phone: phone.trim() });
    setEditing(false);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2600);
  }

  function exportData() {
    const payload = JSON.stringify(
      { profile: me, donations: myDonations, stars: stats },
      null,
      2,
    );
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rekindle-my-data.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <PageHeader
        eyebrow="Profile"
        title="Your account"
        subtitle="Personal details, level, badges and data controls."
        back={{ href: "/impact", label: "Impact dashboard" }}
        actions={
          <Button variant="secondary" onClick={() => setEditing((v) => !v)}>
            <Pencil className="h-4 w-4" />
            {editing ? "Close editor" : "Edit profile"}
          </Button>
        }
      />

      <Shell>
        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="grid gap-6">
            <Card className="p-7">
              <div className="flex items-center gap-5">
                <Avatar initials={me.initials} color={me.avatarColor} size="xl" />
                <div className="min-w-0">
                  <h2 className="text-xl font-extrabold text-ink">{me.name}</h2>
                  <p className="flex items-center gap-1.5 truncate text-sm text-muted">
                    <Mail className="h-4 w-4" />
                    {me.email}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    Member since {formatDate(me.joinedAt)}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-6 text-center">
                <div>
                  <p className="font-display text-2xl font-semibold text-ink tabular-nums">
                    {num(stats.balance)}
                  </p>
                  <p className="text-[0.7rem] font-bold text-muted">Impact Stars</p>
                </div>
                <div className="border-x border-line">
                  <p className="font-display text-2xl font-semibold text-ink tabular-nums">
                    {num(stats.totalDonations)}
                  </p>
                  <p className="text-[0.7rem] font-bold text-muted">Donations</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-semibold text-ink tabular-nums">
                    {num(stats.itemsReused)}
                  </p>
                  <p className="text-[0.7rem] font-bold text-muted">Items reused</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-line pt-5">
                <span className="rounded-full bg-mint px-3 py-1.5 text-xs font-bold text-forest">
                  {stats.level.emoji} {stats.level.name}
                </span>
                <span className="rounded-full border border-[#f3e0ab] bg-gold-soft px-3 py-1.5 text-xs font-bold text-gold-deep">
                  ⭐ {num(stats.balance)}
                </span>
                <span className="rounded-full border border-line bg-cream px-3 py-1.5 text-xs font-bold text-ink-soft">
                  {me.role}
                </span>
              </div>
            </Card>

            <Card className="p-7">
              <p className="flex items-center gap-2 text-sm font-extrabold text-ink">
                <UserCog className="h-4 w-4 text-forest" />
                Personal details
              </p>

              {editing ? (
                <div className="mt-5 grid gap-4">
                  <Field label="Full name">
                    <Input value={name} onChange={(e) => setName(e.target.value)} />
                  </Field>
                  <Field label="Contact number" hint="used for doorstep pickups">
                    <PhoneInput value={phone} onChange={setPhone} />
                  </Field>
                  <div className="flex gap-3">
                    <Button onClick={save}>Save changes</Button>
                    <Button variant="ghost" onClick={() => setEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <dl className="mt-4 grid gap-3 text-sm">
                  <div className="flex items-center justify-between rounded-xl bg-cream px-4 py-3">
                    <dt className="text-muted">Name</dt>
                    <dd className="font-bold text-ink">{me.name}</dd>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-cream px-4 py-3">
                    <dt className="text-muted">Contact</dt>
                    <dd className="flex items-center gap-1.5 font-bold text-ink">
                      <Phone className="h-3.5 w-3.5 text-muted" />
                      {me.phone ?? "Not added"}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-cream px-4 py-3">
                    <dt className="text-muted">Pickup city</dt>
                    <dd className="font-bold text-ink">
                      {me.address?.city ?? "Bengaluru"}
                    </dd>
                  </div>
                </dl>
              )}

              {saved && (
                <p className="anim-slide-up mt-4 rounded-xl bg-mint px-4 py-3 text-sm font-bold text-forest">
                  Profile updated.
                </p>
              )}
            </Card>
          </div>

          <div className="grid gap-6">
            <Card className="p-7">
              <p className="flex items-center gap-2 text-sm font-extrabold text-ink">
                <Sparkles className="h-4 w-4 text-gold" />
                Badges earned
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {BADGES.map((b) => {
                  const earned = me.badges.includes(b.id);
                  return (
                    <div
                      key={b.id}
                      className={`rounded-2xl border p-4 ${
                        earned
                          ? "border-[#f3e0ab] bg-gold-soft"
                          : "border-line bg-cream opacity-70"
                      }`}
                    >
                      <p className="text-xs font-extrabold text-ink">{b.name}</p>
                      <p className="mt-1 text-[0.7rem] leading-relaxed text-muted">
                        {earned ? b.description : b.requirement}
                      </p>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="p-7">
              <p className="text-sm font-extrabold text-ink">Recent activity</p>
              {myDonations.slice(0, 3).map((d) => (
                <Link
                  key={d.id}
                  href={`/my-donations/${d.code}`}
                  className="mt-3 flex items-center justify-between rounded-xl border border-line px-4 py-3 transition-colors hover:border-forest"
                >
                  <span className="text-sm font-bold text-ink">{d.code}</span>
                  <StatusPill
                    label={d.status.replace("_", " ").toLowerCase()}
                    tone={
                      ["VERIFIED", "DISTRIBUTED", "COMPLETED"].includes(d.status)
                        ? "success"
                        : d.status === "REJECTED"
                          ? "danger"
                          : "active"
                    }
                  />
                </Link>
              ))}
              {myDonations.length === 0 && (
                <p className="mt-3 text-sm text-muted">No donations yet.</p>
              )}
            </Card>

            <Card className="p-7">
              <p className="text-sm font-extrabold text-ink">Data & account</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button variant="secondary" size="sm" onClick={exportData}>
                  <Download className="h-4 w-4" />
                  Export my data
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    signOut();
                    router.push("/");
                  }}
                >
                  Sign out
                </Button>
                {!confirmDelete ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-clay"
                    onClick={() => setConfirmDelete(true)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete account
                  </Button>
                ) : (
                  <div className="flex items-center gap-2 rounded-xl border border-[#f2c9b8] bg-clay-soft px-3 py-2">
                    <span className="text-xs font-bold text-[#b14f31]">
                      This clears the demo data on this device.
                    </span>
                    <button
                      onClick={() => {
                        try {
                          window.localStorage.removeItem("rekindle:v1");
                        } catch {
                          /* ignore */
                        }
                        signOut();
                        router.push("/");
                      }}
                      className="text-xs font-extrabold text-clay underline underline-offset-4"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="text-xs font-bold text-muted"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
              <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted">
                <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                ReKindle stores your email, profile and donation history. Photos are attached only
                to the donation you upload them with.
              </p>
            </Card>
          </div>
        </div>
      </Shell>
    </>
  );
}

export default function ProfilePage() {
  return (
    <AuthGate
      title="Sign in to see your profile"
      message="Your profile holds your Impact Stars, badges, donation history and data controls."
    >
      <ProfileContent />
    </AuthGate>
  );
}
