import type { Category } from "./types";

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatLongDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days <= 0) {
    const hours = Math.floor(diff / 3_600_000);
    if (hours <= 0) return "just now";
    return `${hours}h ago`;
  }
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return formatDate(iso);
}

export function compact(n: number): string {
  return new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

export function num(n: number): string {
  return new Intl.NumberFormat("en-IN").format(n);
}

const SINGULAR: Record<Category, string> = {
  CLOTHES: "clothing item",
  BOOKS: "book",
  SHOES: "shoe",
  BAGS: "bag",
  TOYS: "toy",
  OTHER: "item",
};

const PLURAL: Record<Category, string> = {
  CLOTHES: "clothes",
  BOOKS: "books",
  SHOES: "shoes",
  BAGS: "bags",
  TOYS: "toys",
  OTHER: "items",
};

export function itemWords(qty: number, category: Category): string {
  return `${qty} ${qty === 1 ? SINGULAR[category] : PLURAL[category]}`;
}
