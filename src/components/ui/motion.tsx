"use client";

import confetti from "canvas-confetti";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import { num } from "@/lib/format";

/* ------------------------------- Reveal -------------------------------- */

export function Reveal({
  children,
  delay = 0,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("is-visible");
            io.unobserve(el);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const El = as as ElementType;
  return (
    <El
      ref={ref}
      className={`reveal ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </El>
  );
}

/* ------------------------------- Counter -------------------------------- */

function useInView<T extends HTMLElement>(threshold = 0.35) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
}

export function Counter({
  value,
  duration = 1600,
  prefix = "",
  suffix = "",
  className = "",
}: {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      /* eslint-disable-next-line react-hooks/set-state-in-effect -- reduced-motion users get the final value immediately */
      setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {num(display)}
      {suffix}
    </span>
  );
}

/* ------------------------------ Confetti -------------------------------- */

export function fireConfetti() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;
  const colors = ["#0e5c43", "#f0b01c", "#df7a58", "#e6f2ec", "#16825f"];
  confetti({ particleCount: 90, spread: 78, origin: { y: 0.6 }, colors });
  setTimeout(
    () => confetti({ particleCount: 60, angle: 60, spread: 60, origin: { x: 0 }, colors }),
    220,
  );
  setTimeout(
    () => confetti({ particleCount: 60, angle: 120, spread: 60, origin: { x: 1 }, colors }),
    340,
  );
}

export function useConfettiOnMount(active: boolean) {
  const fired = useRef(false);
  useEffect(() => {
    if (active && !fired.current) {
      fired.current = true;
      const t = setTimeout(fireConfetti, 350);
      return () => clearTimeout(t);
    }
  }, [active]);
}

/* ------------------------------- Avatar --------------------------------- */

export function Avatar({
  initials,
  color,
  size = "md",
  ring = false,
}: {
  initials: string;
  color: string;
  size?: "sm" | "md" | "lg" | "xl";
  ring?: boolean;
}) {
  const sizes = {
    sm: "h-8 w-8 text-[0.7rem]",
    md: "h-10 w-10 text-xs",
    lg: "h-14 w-14 text-base",
    xl: "h-20 w-20 text-xl",
  };
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white ${sizes[size]} ${
        ring ? "ring-2 ring-white shadow-soft" : ""
      }`}
      style={{ backgroundColor: color }}
    >
      {initials}
    </span>
  );
}

/* -------------------------------- Stars --------------------------------- */

export function StarRow({ count, size = "md" }: { count: number; size?: "sm" | "md" | "lg" }) {
  const cls =
    size === "lg" ? "h-7 w-7" : size === "sm" ? "h-4 w-4" : "h-5 w-5";
  return (
    <span className="inline-flex items-center gap-1" aria-label={`${count} Impact Stars`}>
      <svg viewBox="0 0 24 24" className={`${cls} text-gold`} fill="currentColor" aria-hidden="true">
        <path d="M12 2.5l2.7 5.7 6.3.9-4.5 4.4 1 6.2L12 16.7 6.5 19.7l1-6.2L3 9.1l6.3-.9L12 2.5z" />
      </svg>
      <span className="font-extrabold tabular-nums">{num(count)}</span>
    </span>
  );
}
