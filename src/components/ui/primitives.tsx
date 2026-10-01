import Link from "next/link";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { clsx } from "./clsx";

/* ------------------------------- Logo ---------------------------------- */

export function Logo({ className = "h-9", dark = false }: { className?: string; dark?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 40 40" className="h-full w-auto" aria-hidden="true">
        <rect width="40" height="40" rx="13" fill={dark ? "#fbf6ec" : "#0e5c43"} />
        <path
          d="M20 8c6.2 3.4 10 8.2 10 13.6 0 5.6-4.4 10.4-10 10.4S10 27.2 10 21.6C10 16.2 13.8 11.4 20 8Z"
          fill={dark ? "#0e5c43" : "#fbf6ec"}
          opacity="0.16"
        />
        <path
          d="M20 11c4.4 2.6 7 6.2 7 10.4 0 4.1-3.1 7.6-7 7.6s-7-3.5-7-7.6C13 17.2 15.6 13.6 20 11Z"
          fill={dark ? "#0e5c43" : "#e6f2ec"}
        />
        <path
          d="M20 14.5v13"
          stroke={dark ? "#0e5c43" : "#0e5c43"}
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.55"
        />
        <path
          d="M20 19.5c1.9-.4 3.3-1.7 3.8-3.6M20 23.4c-1.7-.4-3-1.6-3.5-3.3"
          stroke={dark ? "#0e5c43" : "#0e5c43"}
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
          opacity="0.55"
        />
        <circle cx="28.5" cy="12.5" r="3.2" fill="#f0b01c" />
      </svg>
      <span
        className={`text-[1.35rem] font-extrabold tracking-[-0.03em] ${dark ? "text-cream" : "text-ink"}`}
      >
        SevaKarya
      </span>
    </span>
  );
}

/* ------------------------------ Button --------------------------------- */

type Variant =
  | "primary"
  | "secondary"
  | "gold"
  | "ghost"
  | "dark"
  | "danger"
  | "onDark"
  | "outlineLight";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-forest text-cream hover:bg-forest-dark shadow-[0_10px_30px_-14px_rgba(14,92,67,0.9)] hover:shadow-[0_16px_36px_-14px_rgba(14,92,67,0.95)]",
  secondary: "bg-white text-ink border border-line-strong hover:border-forest hover:text-forest",
  gold: "bg-gold text-ink hover:bg-gold-deep",
  ghost: "text-ink-soft hover:text-forest hover:bg-mint",
  dark: "bg-ink text-cream hover:bg-ink-soft",
  danger: "bg-clay text-white hover:brightness-95",
  onDark: "bg-white/10 text-cream hover:bg-white/20",
  outlineLight: "border border-cream/30 bg-transparent text-cream hover:bg-cream hover:text-forest",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-4 text-sm rounded-xl gap-1.5",
  md: "h-11 px-5 text-[0.95rem] rounded-xl gap-2",
  lg: "h-14 px-7 text-base rounded-2xl gap-2.5",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  href?: string;
  loading?: boolean;
  children: ReactNode;
}

export function buttonClass(variant: Variant = "primary", size: Size = "md", className = "") {
  return clsx(
    "inline-flex items-center justify-center font-semibold transition-all duration-200 select-none",
    "active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
    "focus-visible:outline-2 focus-visible:outline-forest focus-visible:outline-offset-3",
    VARIANTS[variant],
    SIZES[size],
    className,
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", href, loading, className, children, disabled, ...rest },
  ref,
) {
  const cls = buttonClass(variant, size, className);
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button ref={ref} className={cls} disabled={disabled || loading} {...rest}>
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
});

/* -------------------------------- Card --------------------------------- */

export function Card({
  children,
  className = "",
  hover = false,
  cream = false,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  cream?: boolean;
}) {
  return (
    <div
      className={clsx(
        cream ? "surface-cream" : "surface-card",
        hover &&
          "transition-all duration-300 hover:-translate-y-1 hover:shadow-card hover:border-mint-deep",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ------------------------------ Section -------------------------------- */

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "center",
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  body?: ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow && (
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-forest-soft">
          {eyebrow}
        </p>
      )}
      <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold leading-[1.08] text-ink text-balance">
        {title}
      </h2>
      {body && <p className="mt-4 text-lg leading-relaxed text-muted text-pretty">{body}</p>}
    </div>
  );
}

/* ------------------------------ StatusPill ----------------------------- */

const TONE: Record<string, string> = {
  pending: "bg-gold-soft text-gold-deep border-[#f3e0ab]",
  active: "bg-mint text-forest border-mint-deep",
  success: "bg-forest text-cream border-forest",
  muted: "bg-sand text-ink-soft border-line-strong",
  danger: "bg-clay-soft text-[#b14f31] border-[#f2c9b8]",
};

export function StatusPill({
  label,
  tone = "muted",
  className = "",
}: {
  label: string;
  tone?: string;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold whitespace-nowrap",
        TONE[tone] ?? TONE.muted,
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {label}
    </span>
  );
}

/* -------------------------------- Chip --------------------------------- */

export function Chip({
  children,
  active = false,
  onClick,
  className = "",
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={clsx(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200",
        active
          ? "border-forest bg-forest text-cream shadow-[0_8px_20px_-12px_rgba(14,92,67,0.9)]"
          : "border-line-strong bg-white text-ink-soft hover:border-forest hover:text-forest",
        className,
      )}
    >
      {children}
    </button>
  );
}

/* ------------------------------- Fields -------------------------------- */

export function Field({
  label,
  hint,
  children,
  error,
  className = "",
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  error?: string;
  className?: string;
}) {
  return (
    <label className={clsx("block", className)}>
      <span className="mb-2 flex items-baseline justify-between gap-3 text-sm font-bold text-ink">
        {label}
        {hint && <span className="text-xs font-medium text-muted">{hint}</span>}
      </span>
      {children}
      {error && <span className="mt-1.5 block text-xs font-semibold text-clay">{error}</span>}
    </label>
  );
}

const CONTROL =
  "w-full rounded-xl border border-line-strong bg-white px-4 py-3 text-[0.95rem] text-ink placeholder:text-muted/70 transition-colors focus:border-forest focus:outline-none focus:ring-4 focus:ring-mint";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props;
  return <input className={clsx(CONTROL, className)} {...rest} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className, ...rest } = props;
  return <textarea className={clsx(CONTROL, "min-h-28 resize-y", className)} {...rest} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const { className, ...rest } = props;
  return <select className={clsx(CONTROL, "appearance-none", className)} {...rest} />;
}

/* ------------------------------ Skeleton ------------------------------- */

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton rounded-xl ${className}`} />;
}

export function DonationSkeleton() {
  return (
    <div className="surface-card p-5">
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-6 w-28 rounded-full" />
      </div>
      <Skeleton className="mt-4 h-4 w-48" />
      <Skeleton className="mt-2 h-4 w-32" />
      <div className="mt-5 flex gap-2">
        <Skeleton className="h-7 w-24 rounded-full" />
        <Skeleton className="h-7 w-24 rounded-full" />
      </div>
    </div>
  );
}

/* ----------------------------- EmptyState ------------------------------ */

export function EmptyState({
  title,
  body,
  action,
  icon,
}: {
  title: string;
  body: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="surface-card flex flex-col items-center px-6 py-14 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-mint text-forest">
        {icon ?? (
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M3 7h18v13H3z" strokeLinejoin="round" />
            <path d="M3 7l3-4h12l3 4M12 7v13" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <h3 className="text-lg font-bold text-ink">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">{body}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

/* ------------------------------ ProgressBar ---------------------------- */

export function ProgressBar({
  value,
  className = "",
  tone = "forest",
}: {
  value: number;
  className?: string;
  tone?: "forest" | "gold";
}) {
  return (
    <div
      className={`h-2 w-full overflow-hidden rounded-full bg-sand ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full transition-[width] duration-700 ease-out ${
          tone === "gold" ? "bg-gold" : "bg-forest"
        }`}
        style={{ width: `${Math.max(2, Math.min(100, value))}%` }}
      />
    </div>
  );
}
