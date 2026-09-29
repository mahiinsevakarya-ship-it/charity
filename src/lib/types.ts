export type Role = "USER" | "NGO" | "VOLUNTEER" | "ADMIN";

export type DonationStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "PICKUP_SCHEDULED"
  | "COLLECTED"
  | "RECEIVED"
  | "VERIFIED"
  | "DISTRIBUTED"
  | "COMPLETED"
  | "REJECTED";

export type Category = "CLOTHES" | "BOOKS" | "SHOES" | "BAGS" | "TOYS" | "OTHER";

export type Condition = "LIKE_NEW" | "GOOD" | "USABLE" | "NEEDS_REPAIR";

export type FulfillmentMethod = "PICKUP" | "DROP_OFF";

export type StarTransactionStatus =
  | "PENDING"
  | "AWARDED"
  | "REVERSED"
  | "VOID";

export interface Address {
  id: string;
  label: string;
  line1: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarColor: string;
  initials: string;
  role: Role;
  phone?: string;
  joinedAt: string;
  bio?: string;
  address?: Address;
  badges: string[];
}

export interface DonationItem {
  id: string;
  category: Category;
  quantity: number;
  unit: "items" | "pairs";
  condition: Condition;
  note?: string;
}

export interface DonationImage {
  id: string;
  name: string;
  sizeKb: number;
  preview: string;
  uploadedAt: string;
}

export interface Pickup {
  id: string;
  method: FulfillmentMethod;
  partnerName?: string;
  address?: string;
  city?: string;
  date?: string;
  slot?: string;
  phone?: string;
  collectedAt?: string;
}

export interface Donation {
  id: string;
  code: string;
  userId: string;
  items: DonationItem[];
  images: DonationImage[];
  pickup: Pickup;
  status: DonationStatus;
  partnerId?: string;
  expectedStars: number;
  awardedStars?: number;
  createdAt: string;
  updatedAt: string;
  timeline: { status: DonationStatus; at: string; note?: string }[];
  flags: number;
  duplicateOf?: string;
  verificationNote?: string;
}

export interface Partner {
  id: string;
  name: string;
  kind: "NGO" | "SHELTER" | "SCHOOL" | "COMMUNITY";
  city: string;
  states: string[];
  focus: string[];
  needs: Category[];
  verified: boolean;
  since: string;
  itemsDistributed: number;
  peopleReached: number;
  blurb: string;
  logoBg: string;
  initials: string;
}

export interface StarTransaction {
  id: string;
  userId: string;
  donationId: string;
  donationCode: string;
  stars: number;
  reason: string;
  status: StarTransactionStatus;
  createdAt: string;
  breakdown: { category: Category; quantity: number; stars: number }[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
}

export interface ImpactMetric {
  key: string;
  label: string;
  value: number;
  suffix?: string;
}

export interface CategoryMeta {
  key: Category;
  label: string;
  singular: string;
  emoji: string;
  blurb: string;
  unit: "items" | "pairs";
  starsPerUnit: number;
  starLabel: string;
}
