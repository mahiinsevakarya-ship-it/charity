import type { Badge, Category, CategoryMeta, Condition, DonationStatus } from "./types";

export const CATEGORIES: CategoryMeta[] = [
  {
    key: "CLOTHES",
    label: "Clothes",
    singular: "Clothes",
    emoji: "👕",
    blurb: "Trousers, shirts, kurtas, jackets — clean and wearable.",
    unit: "items",
    starsPerUnit: 10,
    starLabel: "10 ⭐ / item",
  },
  {
    key: "BOOKS",
    label: "Books",
    singular: "Books",
    emoji: "📚",
    blurb: "School books, novels, workbooks, story collections.",
    unit: "items",
    starsPerUnit: 8,
    starLabel: "8 ⭐ / book",
  },
  {
    key: "SHOES",
    label: "Shoes",
    singular: "Shoes",
    emoji: "👟",
    blurb: "Walkable shoes, school shoes, sandals in usable condition.",
    unit: "pairs",
    starsPerUnit: 20,
    starLabel: "20 ⭐ / pair",
  },
  {
    key: "BAGS",
    label: "Bags",
    singular: "Bags",
    emoji: "🎒",
    blurb: "School bags, backpacks, travel and hand bags.",
    unit: "items",
    starsPerUnit: 15,
    starLabel: "15 ⭐ / item",
  },
  {
    key: "TOYS",
    label: "Toys",
    singular: "Toys",
    emoji: "🧸",
    blurb: "Clean, safe toys with all their parts intact.",
    unit: "items",
    starsPerUnit: 12,
    starLabel: "12 ⭐ / item",
  },
  {
    key: "OTHER",
    label: "Other",
    singular: "Other items",
    emoji: "🏠",
    blurb: "Bedding, kitchenware, stationery, other reusable goods.",
    unit: "items",
    starsPerUnit: 0,
    starLabel: "Reviewed manually",
  },
];

export const CATEGORY_MAP: Record<Category, CategoryMeta> = CATEGORIES.reduce(
  (acc, c) => ({ ...acc, [c.key]: c }),
  {} as Record<Category, CategoryMeta>,
);

export const CONDITIONS: { key: Condition; label: string; hint: string }[] = [
  { key: "LIKE_NEW", label: "Like New", hint: "Barely used, no visible wear" },
  { key: "GOOD", label: "Good", hint: "Light wear, fully usable" },
  { key: "USABLE", label: "Usable", hint: "Clear wear, works as intended" },
  { key: "NEEDS_REPAIR", label: "Needs Repair", hint: "A button, sole or stitch away" },
];

export const STATUS_META: Record<
  DonationStatus,
  { label: string; tone: "pending" | "active" | "success" | "muted" | "danger"; step: number }
> = {
  SUBMITTED: { label: "Submitted", tone: "pending", step: 1 },
  UNDER_REVIEW: { label: "Under review", tone: "pending", step: 1 },
  PICKUP_SCHEDULED: { label: "Pickup scheduled", tone: "active", step: 2 },
  COLLECTED: { label: "Collected", tone: "active", step: 3 },
  RECEIVED: { label: "Received at hub", tone: "active", step: 3 },
  VERIFIED: { label: "Verified", tone: "success", step: 4 },
  DISTRIBUTED: { label: "Distributed", tone: "success", step: 5 },
  COMPLETED: { label: "Completed", tone: "success", step: 5 },
  REJECTED: { label: "Not accepted", tone: "danger", step: 0 },
};

export const STATUS_FLOW: DonationStatus[] = [
  "SUBMITTED",
  "PICKUP_SCHEDULED",
  "COLLECTED",
  "VERIFIED",
  "DISTRIBUTED",
  "COMPLETED",
];

export interface Level {
  id: string;
  name: string;
  min: number;
  max: number;
  emoji: string;
  perk: string;
}

export const LEVELS: Level[] = [
  { id: "starter", name: "Starter", min: 0, max: 499, emoji: "🌱", perk: "Digital impact card" },
  {
    id: "contributor",
    name: "Contributor",
    min: 500,
    max: 1999,
    emoji: "🌿",
    perk: "Early access to local drop-off drives",
  },
  {
    id: "builder",
    name: "Community Builder",
    min: 2000,
    max: 4999,
    emoji: "🌳",
    perk: "Quarterly impact report + partner shout-outs",
  },
  {
    id: "champion",
    name: "Impact Champion",
    min: 5000,
    max: Number.MAX_SAFE_INTEGER,
    emoji: "💚",
    perk: "Reward partner offers & community ambassador invite",
  },
];

export function levelForStars(stars: number): Level {
  return LEVELS.find((l) => stars >= l.min && stars <= l.max) ?? LEVELS[0];
}

export function nextLevel(stars: number): Level | null {
  const idx = LEVELS.findIndex((l) => stars >= l.min && stars <= l.max);
  return idx >= 0 && idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
}

export const BADGES: Badge[] = [
  {
    id: "first_donation",
    name: "First Donation",
    description: "Your items found a second life for the first time.",
    icon: "sparkle",
    requirement: "1 verified donation",
  },
  {
    id: "book_hero",
    name: "Book Hero",
    description: "Put 25 books into the hands of a reader.",
    icon: "book",
    requirement: "25 books donated",
  },
  {
    id: "reuse_champion",
    name: "Reuse Champion",
    description: "Kept 100 items out of the waste stream.",
    icon: "recycle",
    requirement: "100 items donated",
  },
  {
    id: "community_builder",
    name: "Community Builder",
    description: "Supported 3+ partner organisations.",
    icon: "users",
    requirement: "Donations to 3 partners",
  },
  {
    id: "hundred_items",
    name: "100 Items Donated",
    description: "A century of objects given a new home.",
    icon: "package",
    requirement: "100 items across all categories",
  },
  {
    id: "impact_champion",
    name: "Impact Champion",
    description: "Reached the highest recognition tier on SevaKarya.",
    icon: "trophy",
    requirement: "5,000+ Impact Stars",
  },
];

export const BADGE_MAP: Record<string, Badge> = BADGES.reduce(
  (a, b) => ({ ...a, [b.id]: b }),
  {},
);

export function estimateStars(
  items: { category: Category; quantity: number }[],
): number {
  return items.reduce(
    (sum, item) => sum + CATEGORY_MAP[item.category].starsPerUnit * item.quantity,
    0,
  );
}
