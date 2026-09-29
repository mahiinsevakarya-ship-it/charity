"use client";

import Link from "next/link";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { CheckCircle2, ChevronDown, Send } from "lucide-react";
import { fireConfetti } from "@/components/ui/motion";
import { Button, Field, Input, Select, Textarea } from "@/components/ui/primitives";

type Values = { name: string; email: string; topic: string; message: string };
type Errors = Partial<Record<keyof Values, string>>;

const TOPICS = [
  "Help with a donation or pickup",
  "Impact Stars & rewards",
  "Account or sign-in problem",
  "NGO / partnership enquiry",
  "Something else",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(values: Values): Errors {
  const errors: Errors = {};
  if (values.name.trim().length < 2) errors.name = "Please tell us your name.";
  if (!EMAIL_RE.test(values.email.trim()))
    errors.email = "That email does not look right — we need it to reply.";
  if (!values.topic) errors.topic = "Pick a topic so this reaches the right person.";
  if (values.message.trim().length < 20)
    errors.message = "Add a little more detail — at least 20 characters.";
  return errors;
}

export function ContactForm() {
  const [values, setValues] = useState<Values>({ name: "", email: "", topic: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  function update<K extends keyof Values>(key: K, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    update(event.target.name as keyof Values, event.target.value);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus("sending");
    window.setTimeout(() => {
      setStatus("sent");
      fireConfetti();
    }, 900);
  }

  if (status === "sent") {
    const firstName = values.name.trim().split(" ")[0];
    return (
      <div className="surface-card anim-slide-up p-7 sm:p-9">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mint text-forest">
          <CheckCircle2 className="h-6 w-6" strokeWidth={1.9} />
        </span>
        <h2 className="font-display mt-5 text-2xl font-semibold text-ink">
          Got it{firstName ? `, ${firstName}` : ""} — your message is with us.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          We reply to every message within one working day, Monday to Saturday, at{" "}
          <span className="font-bold text-ink-soft">{values.email.trim()}</span>. If it is about a
          pickup that is already scheduled, calling is faster:{" "}
          <a
            href="tel:+918047112200"
            className="font-bold text-forest underline underline-offset-4"
          >
            +91 80 4711 2200
          </a>
          .
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-line-strong bg-cream px-3 py-1.5 text-xs font-bold text-ink-soft">
            Topic: {values.topic}
          </span>
          <span className="rounded-full border border-mint-deep bg-mint px-3 py-1.5 text-xs font-bold text-forest">
            Reply within 1 working day
          </span>
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <Button
            variant="secondary"
            onClick={() => {
              setValues({ name: "", email: "", topic: "", message: "" });
              setStatus("idle");
            }}
          >
            Send another message
          </Button>
          <Button href="/faq" variant="ghost">
            Browse the FAQ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="surface-card p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-forest-soft">
            Write to us
          </p>
          <h2 className="font-display mt-2 text-2xl font-semibold text-ink">Send a message</h2>
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-mint text-forest">
          <Send className="h-5 w-5" strokeWidth={1.9} />
        </span>
      </div>

      <div className="mt-6 grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Your name" error={errors.name}>
            <Input
              name="name"
              value={values.name}
              onChange={handleChange}
              placeholder="Ananya Rao"
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
            />
          </Field>

          <Field label="Email" hint="we reply here" error={errors.email}>
            <Input
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
            />
          </Field>
        </div>

        <Field label="What is this about?" error={errors.topic}>
          <div className="relative">
            <Select
              name="topic"
              value={values.topic}
              onChange={handleChange}
              aria-invalid={Boolean(errors.topic)}
            >
              <option value="">Choose a topic…</option>
              {TOPICS.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </Select>
            <ChevronDown
              className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-muted"
              aria-hidden
            />
          </div>
        </Field>

        <Field
          label="Message"
          hint={`${values.message.trim().length} characters`}
          error={errors.message}
        >
          <Textarea
            name="message"
            rows={6}
            value={values.message}
            onChange={handleChange}
            placeholder="Tell us what happened. If you have a donation code (like RK-2481), it helps us find you in seconds."
            aria-invalid={Boolean(errors.message)}
          />
        </Field>
      </div>

      <div className="mt-6 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-sm text-xs leading-relaxed text-muted">
          We use these details only to reply to you — never for marketing lists. Read the{" "}
          <Link
            href="/privacy"
            className="font-bold text-forest underline decoration-mint-deep underline-offset-4"
          >
            Privacy Policy
          </Link>
          .
        </p>
        <Button type="submit" size="lg" loading={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send message"}
        </Button>
      </div>
    </form>
  );
}
