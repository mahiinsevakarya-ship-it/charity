"use client";

import { useState, type FormEvent } from "react";
import { BadgeCheck, Send } from "lucide-react";
import { CATEGORIES } from "@/lib/catalog";
import type { Category } from "@/lib/types";
import { Button, Card, Chip, Field, Input } from "@/components/ui/primitives";

interface FormState {
  org: string;
  person: string;
  email: string;
  phone: string;
  area: string;
  reg: string;
  cats: Category[];
  confirm: boolean;
}

type FormKey = keyof FormState;
type Errors = Partial<Record<FormKey, string>>;

const EMPTY: FormState = {
  org: "",
  person: "",
  email: "",
  phone: "",
  area: "",
  reg: "",
  cats: [],
  confirm: false,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function PartnerApplyForm() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [appId, setAppId] = useState<string | null>(null);

  function set<K extends FormKey>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  }

  function toggleCat(key: Category) {
    setForm((f) => ({
      ...f,
      cats: f.cats.includes(key) ? f.cats.filter((c) => c !== key) : [...f.cats, key],
    }));
    setErrors((e) => (e.cats ? { ...e, cats: undefined } : e));
  }

  function validate(): Errors {
    const e: Errors = {};
    if (form.org.trim().length < 3) e.org = "Give us the organisation's full registered name.";
    if (form.person.trim().length < 2) e.person = "Who should we speak to? Add a contact person.";
    if (!EMAIL_RE.test(form.email.trim()))
      e.email = "We need a working email to send your application copy.";
    if (form.phone.replace(/\D/g, "").length < 10)
      e.phone = "Add a 10-digit number our team can call.";
    if (form.area.trim().length < 3)
      e.area = "Tell us the city and states you serve.";
    if (form.reg.trim().length < 4)
      e.reg = "Registration or Udyam/12A number, as printed on your certificate.";
    if (form.cats.length === 0) e.cats = "Pick at least one category you need right now.";
    if (!form.confirm) e.confirm = "Please confirm the documents are genuine before submitting.";
    return e;
  }

  function submit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      setAppId(`PT-${Math.floor(1000 + Math.random() * 9000)}`);
    }, 900);
  }

  if (appId) {
    return (
      <Card className="anim-slide-up p-7 text-center sm:p-9">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-mint text-forest">
          <BadgeCheck className="h-7 w-7" />
        </span>
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.22em] text-forest-soft">
          Application received
        </p>
        <h3 className="font-display mt-2 text-3xl font-semibold text-ink">
          Your reference: <span className="tabular-nums">{appId}</span>
        </h3>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted">
          Thanks {form.person.trim().split(" ")[0]} — a copy is on its way to{" "}
          <span className="font-bold text-ink">{form.email.trim()}</span>. Quote {appId} in any
          email to us. Here is what happens next.
        </p>

        <ol className="mx-auto mt-7 grid max-w-3xl gap-3 text-left sm:grid-cols-3">
          {[
            {
              t: "Document check",
              b: "Our partner team reads all five documents and flags anything unclear. 2–4 working days.",
            },
            {
              t: "One call",
              b: `We ring ${form.person.trim().split(" ")[0]} to confirm the signatory and talk through your item needs.`,
            },
            {
              t: "You go live",
              b: "Your card gets the verified badge, donors see your needs list, donations start routing to you.",
            },
          ].map((s, i) => (
            <li key={s.t} className="rounded-2xl border border-line bg-cream px-5 py-5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-forest text-xs font-extrabold text-cream">
                {i + 1}
              </span>
              <p className="mt-3 text-sm font-extrabold text-ink">{s.t}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">{s.b}</p>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/transparency" variant="secondary">
            See where donations land
          </Button>
          <Button variant="ghost" onClick={() => setAppId(null)}>
            Submit another application
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 sm:p-8">
      <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
        <Field label="Organisation name" error={errors.org} className="sm:col-span-2">
          <Input
            value={form.org}
            onChange={(e) => set("org", e.target.value)}
            placeholder="Vidya Setu Trust"
            autoComplete="organization"
          />
        </Field>

        <Field label="Contact person" error={errors.person}>
          <Input
            value={form.person}
            onChange={(e) => set("person", e.target.value)}
            placeholder="Full name of the person we should call"
            autoComplete="name"
          />
        </Field>

        <Field label="Email" error={errors.email}>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="you@organisation.org"
            autoComplete="email"
          />
        </Field>

        <Field label="Phone" hint="10-digit mobile" error={errors.phone}>
          <Input
            type="tel"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="+91 98450 11223"
            autoComplete="tel"
          />
        </Field>

        <Field label="City & states served" error={errors.area}>
          <Input
            value={form.area}
            onChange={(e) => set("area", e.target.value)}
            placeholder="Bengaluru + Karnataka, Tamil Nadu"
          />
        </Field>

        <Field
          label="Registration number"
          hint="12A/80G, Udyam or NGO Darpan"
          error={errors.reg}
          className="sm:col-span-2"
        >
          <Input
            value={form.reg}
            onChange={(e) => set("reg", e.target.value)}
            placeholder="Trust reg. / Udyam / 12A number"
          />
        </Field>

        <div className="sm:col-span-2">
          <p className="mb-2 text-sm font-bold text-ink">
            Item categories needed
            <span className="ml-2 text-xs font-medium text-muted">pick all that apply</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <Chip
                key={c.key}
                active={form.cats.includes(c.key)}
                onClick={() => toggleCat(c.key)}
              >
                <span aria-hidden>{c.emoji}</span>
                {c.label}
              </Chip>
            ))}
          </div>
          {errors.cats && (
            <span className="mt-2 block text-xs font-semibold text-clay">{errors.cats}</span>
          )}
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-line bg-cream px-4 py-4 sm:col-span-2">
          <input
            type="checkbox"
            checked={form.confirm}
            onChange={(e) => set("confirm", e.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 accent-[#0e5c43]"
          />
          <span className="text-sm leading-relaxed text-ink-soft">
            <span className="font-extrabold text-ink">
              I confirm the documents are genuine.
            </span>{" "}
            We verify certificates with the issuing authority before your profile goes live.
          </span>
        </label>
        {errors.confirm && (
          <span className="-mt-2 text-xs font-semibold text-clay sm:col-span-2">
            {errors.confirm}
          </span>
        )}

        <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center">
          <Button type="submit" size="lg" loading={busy}>
            {!busy && <Send className="h-4 w-4" />}
            {busy ? "Sending application…" : "Submit application"}
          </Button>
          <p className="text-xs leading-relaxed text-muted">
            About five minutes. No fees, no commission, no catch — ever.
          </p>
        </div>
      </form>
    </Card>
  );
}
