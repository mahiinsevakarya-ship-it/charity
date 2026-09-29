"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ImagePlus,
  MapPin,
  PackageOpen,
  Phone,
  Store,
  Trash2,
  Truck,
} from "lucide-react";
import { CATEGORIES, CATEGORY_MAP, CONDITIONS, estimateStars } from "@/lib/catalog";
import type { Category, Condition, FulfillmentMethod } from "@/lib/types";
import { useApp } from "@/lib/store";
import { Button, Card, Chip, Field, Input, Textarea } from "@/components/ui/primitives";

const STEPS = [
  { id: "items", label: "What" },
  { id: "quantity", label: "How much" },
  { id: "condition", label: "Condition" },
  { id: "photos", label: "Photos" },
  { id: "logistics", label: "Pickup" },
  { id: "review", label: "Review" },
];

const SLOTS = [
  "08:00 AM – 10:00 AM",
  "10:00 AM – 12:00 PM",
  "12:00 PM – 02:00 PM",
  "04:00 PM – 06:00 PM",
  "06:00 PM – 08:00 PM",
];

const DROP_POINTS = [
  {
    id: "dp1",
    name: "ReKindle Hub — Indiranagar",
    address: "12, 100 Feet Road, Indiranagar, Bengaluru 560038",
    hours: "Mon–Sat · 10:00 AM – 6:00 PM",
  },
  {
    id: "dp2",
    name: "Vidya Setu collection point — Koramangala",
    address: "5th Block, Koramangala, Bengaluru 560095",
    hours: "Tue, Thu, Sat · 11:00 AM – 5:00 PM",
  },
  {
    id: "dp3",
    name: "GreenLoop repair café — Jayanagar",
    address: "11th Main, Jayanagar 4th Block, Bengaluru 560011",
    hours: "Sun · 9:00 AM – 1:00 PM",
  },
];

interface DraftImage {
  id: string;
  name: string;
  sizeKb: number;
  preview: string;
  uploadedAt: string;
}

async function readImage(file: File): Promise<DraftImage> {
  const dataUrl: string = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });

  const resized = await new Promise<string>((resolve) => {
    const img = new Image();
    img.onload = () => {
      const max = 720;
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(dataUrl);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.72));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });

  return {
    id: `img_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: file.name,
    sizeKb: Math.round(file.size / 1024),
    preview: resized,
    uploadedAt: new Date().toISOString(),
  };
}

function nextDays(count: number) {
  const days: { value: string; label: string }[] = [];
  const start = new Date();
  start.setDate(start.getDate() + 1);
  for (let i = 0; i < count; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push({
      value: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
    });
  }
  return days;
}

export function DonateWizard() {
  const router = useRouter();
  const { createDonation, me } = useApp();
  const fileRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [condition, setCondition] = useState<Condition | null>(null);
  const [note, setNote] = useState("");
  const [images, setImages] = useState<DraftImage[]>([]);
  const [method, setMethod] = useState<FulfillmentMethod>("PICKUP");
  const [dropPoint, setDropPoint] = useState<string | null>(null);
  const [address, setAddress] = useState(me?.address?.line1 ?? "");
  const [city, setCity] = useState(me?.address?.city ?? "Bengaluru");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [phone, setPhone] = useState(me?.phone ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const days = useMemo(() => nextDays(8), []);

  const items = useMemo(
    () =>
      categories.map((category) => ({
        category,
        quantity: quantities[category] ?? 1,
        condition: condition ?? "GOOD",
        note: note || undefined,
      })),
    [categories, quantities, condition, note],
  );

  const expectedStars = estimateStars(items);
  const totalUnits = items.reduce((s, i) => s + i.quantity, 0);

  function toggleCategory(key: Category) {
    setCategories((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key],
    );
    setQuantities((prev) => ({ ...prev, [key]: prev[key] ?? 1 }));
    setErrors((e) => ({ ...e, categories: "" }));
  }

  function setQty(key: Category, value: number) {
    setQuantities((prev) => ({ ...prev, [key]: Math.max(1, Math.min(999, value)) }));
    setErrors((e) => ({ ...e, quantities: "" }));
  }

  function validate(current: number): boolean {
    const next: Record<string, string> = {};
    if (current === 0 && categories.length === 0)
      next.categories = "Pick at least one category of items to donate.";
    if (current === 1 && categories.some((c) => !(quantities[c] > 0)))
      next.quantities = "Every selected category needs a quantity of at least 1.";
    if (current === 2 && !condition) next.condition = "Choose the condition that fits best.";
    if (current === 3 && images.length > 5) next.images = "You can upload up to 5 photos.";
    if (current === 4) {
      if (method === "PICKUP") {
        if (!address.trim()) next.address = "We need an address for pickup.";
        if (!date) next.date = "Pick a preferred date.";
        if (!slot) next.slot = "Pick a time slot.";
        if (!phone.trim() || phone.trim().length < 8)
          next.phone = "A contact number helps the volunteer reach you.";
      } else if (!dropPoint) {
        next.dropPoint = "Choose a drop-off point.";
      }
    }
    setErrors(next);
    return Object.values(next).every((v) => !v);
  }

  function goNext() {
    if (!validate(step)) return;
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    setStep((s) => Math.max(0, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setErrors((e) => ({ ...e, images: "" }));
    const room = 5 - images.length;
    const accepted = Array.from(files).slice(0, room);
    const tooBig = Array.from(files).find((f) => f.size > 5 * 1024 * 1024);
    if (tooBig) setErrors((e) => ({ ...e, images: `"${tooBig.name}" is over the 5 MB limit.` }));
    const invalid = Array.from(files).find((f) => !f.type.startsWith("image/"));
    if (invalid)
      setErrors((e) => ({ ...e, images: `"${invalid.name}" is not an image file.` }));

    try {
      const loaded = await Promise.all(
        accepted.filter((f) => f.type.startsWith("image/") && f.size <= 5 * 1024 * 1024).map(readImage),
      );
      setImages((prev) => [...prev, ...loaded].slice(0, 5));
    } catch {
      setErrors((e) => ({ ...e, images: "One of the photos could not be read. Try another." }));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function submit() {
    if (!validate(4) || submitting) return;
    setSubmitting(true);
    window.setTimeout(() => {
      const donation = createDonation({
        items,
        images,
        method,
        address: method === "PICKUP" ? address : undefined,
        city: method === "PICKUP" ? city : "Bengaluru",
        date,
        slot: method === "PICKUP" ? slot : "Drop-off window 10:00 AM – 6:00 PM",
        phone,
      });
      router.push(`/donation/success?code=${donation.code}`);
    }, 900);
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_340px] lg:gap-10 lg:px-8 lg:py-12">
      <div>
        {/* progress */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between lg:hidden">
            <span className="text-xs font-bold tracking-wide text-forest-soft uppercase">
              Step {step + 1} of {STEPS.length}
            </span>
            <span className="text-xs font-bold text-muted">{STEPS[step].label}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-sand lg:hidden">
            <div
              className="h-full rounded-full bg-forest transition-[width] duration-500"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>

          <ol className="hidden items-center gap-1 lg:flex">
            {STEPS.map((s, i) => (
              <li key={s.id} className="flex flex-1 items-center gap-2">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-extrabold transition-colors ${
                    i < step
                      ? "bg-forest text-cream"
                      : i === step
                        ? "bg-ink text-cream"
                        : "border border-line-strong bg-white text-muted"
                  }`}
                >
                  {i < step ? <Check className="h-4 w-4" /> : i + 1}
                </span>
                <span
                  className={`text-xs font-bold ${i === step ? "text-ink" : "text-muted"}`}
                >
                  {s.label}
                </span>
                {i < STEPS.length - 1 && <span className="h-px flex-1 bg-line" />}
              </li>
            ))}
          </ol>
        </div>

        {/* step body */}
        <Card className="p-6 sm:p-8">
          {step === 0 && (
            <div className="anim-slide-up">
              <StepHeading
                title="What are you donating?"
                body="Select every category that applies. You can mix clothes, books and shoes in one donation."
              />
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {CATEGORIES.map((cat) => {
                  const active = categories.includes(cat.key);
                  return (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => toggleCategory(cat.key)}
                      aria-pressed={active}
                      className={`group relative rounded-2xl border p-5 text-left transition-all duration-200 ${
                        active
                          ? "border-forest bg-mint shadow-[0_12px_30px_-18px_rgba(14,92,67,0.9)]"
                          : "border-line-strong bg-white hover:-translate-y-0.5 hover:border-forest"
                      }`}
                    >
                      <span className="flex items-start justify-between">
                        <span className="text-3xl transition-transform group-hover:-rotate-6">
                          {cat.emoji}
                        </span>
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-full border transition-colors ${
                            active ? "border-forest bg-forest text-cream" : "border-line-strong"
                          }`}
                        >
                          {active && <Check className="h-3.5 w-3.5" />}
                        </span>
                      </span>
                      <span className="mt-4 block text-base font-extrabold text-ink">
                        {cat.label}
                      </span>
                      <span className="mt-1 block text-xs leading-relaxed text-muted">
                        {cat.blurb}
                      </span>
                    </button>
                  );
                })}
              </div>
              {errors.categories && <ErrorText>{errors.categories}</ErrorText>}
            </div>
          )}

          {step === 1 && (
            <div className="anim-slide-up">
              <StepHeading
                title="How much are you giving?"
                body="Approximate counts are fine — the partner confirms the final number at pickup."
              />
              <div className="mt-6 grid gap-3">
                {categories.map((cat) => {
                  const meta = CATEGORY_MAP[cat];
                  const value = quantities[cat] ?? 1;
                  return (
                    <div
                      key={cat}
                      className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-white px-5 py-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{meta.emoji}</span>
                        <div>
                          <p className="text-sm font-extrabold text-ink">
                            {meta.label}{" "}
                            <span className="ml-1 text-xs font-semibold text-muted">
                              ({meta.starLabel})
                            </span>
                          </p>
                          <p className="text-xs text-muted">
                            {value} {meta.unit} · +{value * meta.starsPerUnit} ⭐ expected
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Stepper
                          value={value}
                          onChange={(v) => setQty(cat, v)}
                          label={meta.label}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              {errors.quantities && <ErrorText>{errors.quantities}</ErrorText>}
            </div>
          )}

          {step === 2 && (
            <div className="anim-slide-up">
              <StepHeading
                title="What condition are they in?"
                body="Honest answers keep the system trustworthy. Items are re-checked at the partner hub."
              />
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {CONDITIONS.map((c) => {
                  const active = condition === c.key;
                  return (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => {
                        setCondition(c.key);
                        setErrors((e) => ({ ...e, condition: "" }));
                      }}
                      className={`rounded-2xl border p-5 text-left transition-all ${
                        active
                          ? "border-forest bg-mint"
                          : "border-line-strong bg-white hover:border-forest"
                      }`}
                    >
                      <span className="flex items-center justify-between">
                        <span className="text-base font-extrabold text-ink">{c.label}</span>
                        <span
                          className={`h-5 w-5 rounded-full border-2 ${
                            active ? "border-forest bg-forest" : "border-line-strong"
                          }`}
                        />
                      </span>
                      <span className="mt-1 block text-sm text-muted">{c.hint}</span>
                    </button>
                  );
                })}
              </div>
              {errors.condition && <ErrorText>{errors.condition}</ErrorText>}

              <div className="mt-6 rounded-2xl border border-[#f3e0ab] bg-gold-soft px-5 py-4 text-sm font-semibold text-ink-soft">
                Please donate items that are clean, safe and usable.
              </div>

              <div className="mt-5">
                <Field label="Anything the partner should know?" hint="optional">
                  <Textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. Winter jackets are in a blue bag, books are wrapped separately."
                  />
                </Field>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="anim-slide-up">
              <StepHeading
                title="Add up to 5 photos"
                body="Photos speed up verification. JPEG, PNG or WebP, up to 5 MB each."
              />

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => onFiles(e.target.files)}
              />

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {images.map((img) => (
                  <div
                    key={img.id}
                    className="group relative aspect-4/3 overflow-hidden rounded-2xl border border-line bg-sand anim-pop"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.preview}
                      alt={img.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-linear-to-t from-black/70 to-transparent px-2.5 py-2">
                      <span className="truncate text-[0.65rem] font-semibold text-white/90">
                        {img.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => setImages((prev) => prev.filter((i) => i.id !== img.id))}
                        className="rounded-full bg-white/90 p-1 text-ink transition-transform hover:scale-110"
                        aria-label={`Remove ${img.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {images.length < 5 && (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="flex aspect-4/3 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line-strong bg-cream text-muted transition-colors hover:border-forest hover:text-forest disabled:opacity-60"
                  >
                    {uploading ? (
                      <span className="h-6 w-6 animate-spin rounded-full border-2 border-forest border-t-transparent" />
                    ) : (
                      <ImagePlus className="h-6 w-6" />
                    )}
                    <span className="text-xs font-bold">
                      {uploading ? "Uploading…" : "Add photo"}
                    </span>
                  </button>
                )}
              </div>

              {errors.images && <ErrorText>{errors.images}</ErrorText>}
              <p className="mt-4 text-xs text-muted">
                {images.length}/5 photos added · Photos stay attached to this donation only and are
                visible to our verification team and your partner.
              </p>
            </div>
          )}

          {step === 4 && (
            <div className="anim-slide-up">
              <StepHeading
                title="Pickup or drop-off?"
                body="Doorstep pickup is free in supported pincodes. Drop-off takes about five minutes."
              />

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => {
                    setMethod("PICKUP");
                    setErrors({});
                  }}
                  className={`rounded-2xl border p-5 text-left transition-all ${
                    method === "PICKUP" ? "border-forest bg-mint" : "border-line-strong bg-white"
                  }`}
                >
                  <Truck className="h-6 w-6 text-forest" />
                  <p className="mt-3 text-base font-extrabold text-ink">Schedule Pickup</p>
                  <p className="mt-1 text-sm text-muted">
                    A volunteer collects it from your address in your chosen slot.
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMethod("DROP_OFF");
                    setErrors({});
                  }}
                  className={`rounded-2xl border p-5 text-left transition-all ${
                    method === "DROP_OFF" ? "border-forest bg-mint" : "border-line-strong bg-white"
                  }`}
                >
                  <Store className="h-6 w-6 text-forest" />
                  <p className="mt-3 text-base font-extrabold text-ink">Drop Off</p>
                  <p className="mt-1 text-sm text-muted">
                    Bring it to a partner point or ReKindle hub near you.
                  </p>
                </button>
              </div>

              {method === "PICKUP" ? (
                <div className="mt-6 grid gap-4">
                  <Field label="Pickup address" error={errors.address}>
                    <Textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Flat / house number, street, area"
                      className="min-h-20"
                    />
                  </Field>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="City">
                      <Input value={city} onChange={(e) => setCity(e.target.value)} />
                    </Field>
                    <Field label="Contact number" error={errors.phone}>
                      <Input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98450 11223"
                        inputMode="tel"
                      />
                    </Field>
                  </div>

                  <Field label="Preferred date" error={errors.date}>
                    <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
                      {days.map((d) => (
                        <Chip
                          key={d.value}
                          active={date === d.value}
                          onClick={() => setDate(d.value)}
                          className="shrink-0"
                        >
                          <CalendarDays className="h-4 w-4" />
                          {d.label}
                        </Chip>
                      ))}
                    </div>
                  </Field>

                  <Field label="Preferred time slot" error={errors.slot}>
                    <div className="flex flex-wrap gap-2">
                      {SLOTS.map((s) => (
                        <Chip key={s} active={slot === s} onClick={() => setSlot(s)}>
                          {s}
                        </Chip>
                      ))}
                    </div>
                  </Field>
                </div>
              ) : (
                <div className="mt-6 grid gap-3">
                  {DROP_POINTS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setDropPoint(p.id);
                        setErrors((e) => ({ ...e, dropPoint: "" }));
                      }}
                      className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                        dropPoint === p.id ? "border-forest bg-mint" : "border-line-strong bg-white"
                      }`}
                    >
                      <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-forest" />
                      <span>
                        <span className="block text-sm font-extrabold text-ink">{p.name}</span>
                        <span className="mt-0.5 block text-xs text-muted">{p.address}</span>
                        <span className="mt-1 block text-xs font-semibold text-forest-soft">
                          {p.hours}
                        </span>
                      </span>
                    </button>
                  ))}
                  {errors.dropPoint && <ErrorText>{errors.dropPoint}</ErrorText>}
                </div>
              )}
            </div>
          )}

          {step === 5 && (
            <div className="anim-slide-up">
              <StepHeading
                title="Review your donation"
                body="Nothing is final until you press submit — go back and change anything you like."
              />

              <div className="mt-6 grid gap-5">
                <div className="rounded-2xl border border-line bg-white p-5">
                  <p className="text-xs font-bold tracking-[0.16em] text-forest-soft uppercase">
                    Donation
                  </p>
                  <ul className="mt-3 grid gap-2">
                    {items.map((it) => (
                      <li
                        key={it.category}
                        className="flex items-center justify-between text-sm font-semibold text-ink-soft"
                      >
                        <span>
                          {CATEGORY_MAP[it.category].emoji} {it.quantity}{" "}
                          {CATEGORY_MAP[it.category].label}
                        </span>
                        <span className="text-xs text-muted">{CONDITIONS.find((c) => c.key === it.condition)?.label}</span>
                      </li>
                    ))}
                  </ul>
                  {images.length > 0 && (
                    <p className="mt-3 border-t border-line pt-3 text-xs font-semibold text-muted">
                      {images.length} photo{images.length > 1 ? "s" : ""} attached
                    </p>
                  )}
                </div>

                <div className="rounded-2xl border border-line bg-white p-5">
                  <p className="text-xs font-bold tracking-[0.16em] text-forest-soft uppercase">
                    {method === "PICKUP" ? "Pickup" : "Drop-off"}
                  </p>
                  {method === "PICKUP" ? (
                    <div className="mt-3 grid gap-1.5 text-sm text-ink-soft">
                      <p className="font-semibold text-ink">{city}</p>
                      <p className="text-muted">{address}</p>
                      <p>
                        {days.find((d) => d.value === date)?.label ?? "Date not set"} ·{" "}
                        <span className="font-semibold text-ink">{slot || "Slot not set"}</span>
                      </p>
                      <p className="flex items-center gap-1.5 text-xs text-muted">
                        <Phone className="h-3.5 w-3.5" />
                        {phone || "No contact number"}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-3 grid gap-1.5 text-sm text-ink-soft">
                      <p className="font-semibold text-ink">
                        {DROP_POINTS.find((p) => p.id === dropPoint)?.name ?? "Drop-off point"}
                      </p>
                      <p className="text-muted">
                        {DROP_POINTS.find((p) => p.id === dropPoint)?.address}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-[#f3e0ab] bg-gold-soft p-5">
                  <div>
                    <p className="text-xs font-bold tracking-[0.16em] text-gold-deep uppercase">
                      Expected Impact Stars
                    </p>
                    <p className="mt-1 text-xs text-ink-soft">
                      Credited only after a partner verifies the donation.
                    </p>
                  </div>
                  <p className="font-display text-3xl font-semibold text-gold-deep">
                    +{expectedStars} ⭐
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* nav */}
          <div className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-6">
            <Button
              variant="ghost"
              onClick={goBack}
              disabled={step === 0 || submitting}
              className={step === 0 ? "invisible" : ""}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            {step < STEPS.length - 1 ? (
              <Button onClick={goNext}>
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={submit} loading={submitting} size="lg">
                {submitting ? "Submitting…" : "Submit Donation"}
                {!submitting && <ArrowRight className="h-5 w-5" />}
              </Button>
            )}
          </div>
        </Card>
      </div>

      {/* summary rail */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <Card className="overflow-hidden">
          <div className="border-b border-line bg-cream px-5 py-4">
            <p className="flex items-center gap-2 text-sm font-extrabold text-ink">
              <PackageOpen className="h-4 w-4 text-forest" />
              Your donation so far
            </p>
          </div>
          <div className="px-5 py-4">
            {items.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted">
                Nothing selected yet. Pick a category to begin.
              </p>
            ) : (
              <ul className="grid gap-2.5">
                {items.map((it) => (
                  <li
                    key={it.category}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="font-semibold text-ink-soft">
                      {CATEGORY_MAP[it.category].emoji} {it.quantity}{" "}
                      {CATEGORY_MAP[it.category].label}
                    </span>
                    <span className="font-bold text-gold-deep tabular-nums">
                      +{it.quantity * CATEGORY_MAP[it.category].starsPerUnit} ⭐
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
              <span className="text-xs font-bold text-muted">
                {totalUnits} unit{totalUnits === 1 ? "" : "s"} · {images.length} photo
                {images.length === 1 ? "" : "s"}
              </span>
              <span className="text-sm font-extrabold text-forest tabular-nums">
                ≈ {expectedStars} ⭐
              </span>
            </div>
          </div>

          <div className="border-t border-line bg-mint/60 px-5 py-4 text-xs leading-relaxed text-forest-dark">
            Stars are credited after verification. Submitting low-quality or duplicate items will
            not earn stars.
          </div>
        </Card>
      </aside>
    </div>
  );
}

function StepHeading({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{title}</h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted sm:text-base">{body}</p>
    </div>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 rounded-xl border border-[#f2c9b8] bg-clay-soft px-4 py-3 text-sm font-semibold text-[#b14f31] anim-slide-up">
      {children}
    </p>
  );
}

function Stepper({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-line-strong bg-white p-1">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        className="flex h-8 w-8 items-center justify-center rounded-full text-lg font-bold text-ink-soft transition-colors hover:bg-cream"
        aria-label={`Decrease ${label}`}
      >
        −
      </button>
      <input
        type="number"
        value={value}
        min={1}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={`Quantity of ${label}`}
        className="w-12 bg-transparent text-center text-sm font-extrabold text-ink outline-none [appearance:textfield] [&::-inner-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="flex h-8 w-8 items-center justify-center rounded-full text-lg font-bold text-ink-soft transition-colors hover:bg-cream"
        aria-label={`Increase ${label}`}
      >
        +
      </button>
    </div>
  );
}
