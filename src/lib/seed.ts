import type {
  Badge,
  Donation,
  DonationStatus,
  Partner,
  StarTransaction,
  User,
} from "./types";

export const CURRENT_USER_ID = "u_mahesh";

const iso = (d: string) => new Date(d).toISOString();

export const SEED_USERS: User[] = [
  {
    id: CURRENT_USER_ID,
    name: "Mahesh Rao",
    email: "mahesh.rao@example.com",
    avatarColor: "#0e5c43",
    initials: "MR",
    role: "USER",
    phone: "+91 98450 11223",
    joinedAt: iso("2026-02-11"),
    bio: "Reading, cycling and clearing out one cupboard at a time.",
    badges: ["first_donation", "book_hero", "reuse_champion", "hundred_items", "community_builder"],
    address: {
      id: "ad_1",
      label: "Home",
      line1: "402, Palm Grove Residency",
      area: "Indiranagar",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560038",
    },
  },
  {
    id: "u_ananya",
    name: "Ananya Shetty",
    email: "ananya.s@example.com",
    avatarColor: "#df7a58",
    initials: "AS",
    role: "USER",
    joinedAt: iso("2026-04-02"),
    badges: ["first_donation"],
  },
  {
    id: "u_farhan",
    name: "Farhan Qureshi",
    email: "farhan.q@example.com",
    avatarColor: "#16825f",
    initials: "FQ",
    role: "VOLUNTEER",
    joinedAt: iso("2026-01-19"),
    badges: ["first_donation", "reuse_champion"],
  },
  {
    id: "u_vidya",
    name: "Vidya Setu Trust",
    email: "ops@vidyasetu.org",
    avatarColor: "#d99512",
    initials: "VS",
    role: "NGO",
    joinedAt: iso("2025-11-04"),
    badges: ["community_builder"],
  },
  {
    id: "u_admin",
    name: "ReKindle Ops",
    email: "ops@rekindle.org",
    avatarColor: "#1a1a17",
    initials: "RO",
    role: "ADMIN",
    joinedAt: iso("2025-10-01"),
    badges: ["community_builder"],
  },
];

interface DraftDonation {
  code: string;
  status: DonationStatus;
  items: [keyof typeof ITEM_UNIT, number, string][];
  created: string;
  partner?: string;
  method?: "PICKUP" | "DROP_OFF";
  city?: string;
  slot?: string;
  flags?: number;
  note?: string;
}

const ITEM_UNIT = { CLOTHES: "items", BOOKS: "items", SHOES: "pairs", BAGS: "items", TOYS: "items", OTHER: "items" } as const;

const DRAFTS: DraftDonation[] = [
  {
    code: "RK-1024",
    status: "VERIFIED",
    items: [["BOOKS", 12, "LIKE_NEW"], ["CLOTHES", 5, "GOOD"]],
    created: "2026-09-24",
    partner: "p_vidyasetu",
    slot: "Saturday, 10:00 AM – 12:00 PM",
    note: "Two boxes of storybooks and school shirts.",
  },
  {
    code: "RK-1023",
    status: "PICKUP_SCHEDULED",
    items: [["SHOES", 2, "GOOD"]],
    created: "2026-09-27",
    partner: "p_sahaara",
    slot: "Tuesday, 5:00 PM – 7:00 PM",
  },
  {
    code: "RK-1022",
    status: "SUBMITTED",
    items: [["BAGS", 4, "GOOD"], ["TOYS", 3, "LIKE_NEW"]],
    created: "2026-09-26",
    method: "DROP_OFF",
    city: "Bengaluru",
  },
  {
    code: "RK-1021",
    status: "COMPLETED",
    items: [["BOOKS", 18, "GOOD"], ["CLOTHES", 8, "GOOD"]],
    created: "2026-09-08",
    partner: "p_balavikas",
    slot: "Wednesday, 4:00 PM – 6:00 PM",
  },
  {
    code: "RK-1020",
    status: "UNDER_REVIEW",
    items: [["CLOTHES", 6, "USABLE"]],
    created: "2026-09-25",
    method: "DROP_OFF",
    city: "Bengaluru",
    flags: 1,
    note: "Reviewer asked for one clearer photo of the winter jackets.",
  },
  {
    code: "RK-1019",
    status: "DISTRIBUTED",
    items: [["CLOTHES", 12, "GOOD"], ["SHOES", 6, "GOOD"]],
    created: "2026-08-21",
    partner: "p_umeed",
    slot: "Monday, 11:00 AM – 1:00 PM",
  },
  {
    code: "RK-1018",
    status: "COMPLETED",
    items: [["BOOKS", 20, "LIKE_NEW"], ["CLOTHES", 10, "LIKE_NEW"]],
    created: "2026-08-06",
    partner: "p_vidyasetu",
    slot: "Thursday, 9:00 AM – 11:00 AM",
  },
  {
    code: "RK-1017",
    status: "REJECTED",
    items: [["BOOKS", 9, "NEEDS_REPAIR"]],
    created: "2026-09-18",
    method: "DROP_OFF",
    city: "Bengaluru",
    note: "Water-damaged set — redirected to the recycling drive instead.",
  },
  {
    code: "RK-1016",
    status: "VERIFIED",
    items: [["SHOES", 8, "USABLE"]],
    created: "2026-07-15",
    partner: "p_greenloop",
    slot: "Saturday, 10:00 AM – 12:00 PM",
  },
  {
    code: "RK-1015",
    status: "COMPLETED",
    items: [["BOOKS", 14, "GOOD"], ["CLOTHES", 7, "GOOD"]],
    created: "2026-06-27",
    partner: "p_balavikas",
    slot: "Wednesday, 4:00 PM – 6:00 PM",
  },
  {
    code: "RK-1014",
    status: "COLLECTED",
    items: [["TOYS", 6, "GOOD"], ["BAGS", 2, "USABLE"]],
    created: "2026-09-22",
    partner: "p_sahaara",
    slot: "Monday, 6:00 PM – 8:00 PM",
  },
  {
    code: "RK-1013",
    status: "COMPLETED",
    items: [["SHOES", 12, "GOOD"]],
    created: "2026-05-30",
    partner: "p_umeed",
    slot: "Saturday, 10:00 AM – 12:00 PM",
  },
  {
    code: "RK-1012",
    status: "RECEIVED",
    items: [["BOOKS", 5, "LIKE_NEW"], ["CLOTHES", 3, "LIKE_NEW"]],
    created: "2026-09-21",
    partner: "p_vidyasetu",
    slot: "Friday, 3:00 PM – 5:00 PM",
  },
  {
    code: "RK-1011",
    status: "PICKUP_SCHEDULED",
    items: [["BAGS", 3, "GOOD"]],
    created: "2026-09-28",
    partner: "p_balavikas",
    slot: "Wednesday, 4:00 PM – 6:00 PM",
  },
  {
    code: "RK-1010",
    status: "VERIFIED",
    items: [["BOOKS", 8, "GOOD"], ["CLOTHES", 6, "GOOD"]],
    created: "2026-05-09",
    partner: "p_greenloop",
    slot: "Tuesday, 5:00 PM – 7:00 PM",
  },
  {
    code: "RK-1009",
    status: "SUBMITTED",
    items: [["SHOES", 4, "USABLE"]],
    created: "2026-09-28",
    method: "DROP_OFF",
    city: "Bengaluru",
  },
  {
    code: "RK-1008",
    status: "UNDER_REVIEW",
    items: [["BOOKS", 11, "GOOD"], ["CLOTHES", 2, "GOOD"]],
    created: "2026-09-25",
    method: "DROP_OFF",
    city: "Bengaluru",
    flags: 2,
    note: "Looks similar to RK-1009 submission — checking for a duplicate entry.",
  },
  {
    code: "RK-1007",
    status: "PICKUP_SCHEDULED",
    items: [["OTHER", 5, "GOOD"]],
    created: "2026-09-20",
    partner: "p_sahaara",
    slot: "Sunday, 11:00 AM – 1:00 PM",
  },
];

const STATUS_NOTES: Partial<Record<DonationStatus, string>> = {
  VERIFIED: "Counted, photographed and logged at the partner hub.",
  COMPLETED: "Distributed to families and reported back with photos.",
  DISTRIBUTED: "Handed over to the partner's distribution drive.",
  RECEIVED: "Arrived at the partner sorting hub, awaiting verification.",
  COLLECTED: "Picked up from your address by the ReKindle volunteer.",
  PICKUP_SCHEDULED: "Volunteer assigned — you will get a call before arrival.",
  UNDER_REVIEW: "Our team is reviewing the photos and details you shared.",
  SUBMITTED: "We have your submission and are assigning a partner.",
  REJECTED: "Could not be accepted for reuse.",
};

function buildTimeline(status: DonationStatus, created: string): Donation["timeline"] {
  const base = new Date(created).getTime();
  const submit = {
    status: "SUBMITTED" as const,
    at: iso(new Date(base).toISOString()),
    note: "Donation submitted",
  };
  if (status === "REJECTED" || status === "UNDER_REVIEW") {
    return [
      submit,
      {
        status,
        at: iso(new Date(base + 86_400_000).toISOString()),
        note: STATUS_NOTES[status],
      },
    ];
  }
  const order: DonationStatus[] = [
    "SUBMITTED",
    "PICKUP_SCHEDULED",
    "COLLECTED",
    "RECEIVED",
    "VERIFIED",
    "DISTRIBUTED",
    "COMPLETED",
  ];
  const rank = order.indexOf(status);
  const start = status === "PICKUP_SCHEDULED" ? 1 : 0;
  const steps = order.slice(start, Math.max(rank, start) + 1);
  return [
    submit,
    ...steps.slice(1).map((s, i) => ({
      status: s,
      at: iso(new Date(base + (i + 1) * 86_400_000).toISOString()),
      note: STATUS_NOTES[s],
    })),
  ];
}

function buildDonation(d: DraftDonation, index: number): Donation {
  const created = d.created;
  const items = d.items.map(([category, quantity, condition], i) => ({
    id: `${d.code}-${i}`,
    category: category as Donation["items"][number]["category"],
    quantity,
    unit: ITEM_UNIT[category],
    condition: condition as Donation["items"][number]["condition"],
  }));
  const expected = items.reduce(
    (sum, it) =>
      sum +
      it.quantity *
        (it.category === "CLOTHES" ? 10 : it.category === "BOOKS" ? 8 : it.category === "SHOES" ? 20 : it.category === "BAGS" ? 15 : it.category === "TOYS" ? 12 : 0),
    0,
  );
  const awardedSet: DonationStatus[] = ["VERIFIED", "DISTRIBUTED", "COMPLETED"];
  return {
    id: `d_${index}`,
    code: d.code,
    userId: CURRENT_USER_ID,
    items,
    images: Array.from({ length: d.items.length > 1 ? 2 : 1 }).map((_, i) => ({
      id: `${d.code}-img${i}`,
      name: `${d.code.toLowerCase()}-${i + 1}.jpg`,
      sizeKb: 480 + i * 120,
      preview: "",
      uploadedAt: iso(created),
    })),
    pickup: {
      id: `pk_${index}`,
      method: d.method ?? "PICKUP",
      city: d.city ?? "Bengaluru",
      address: d.city ? undefined : "402, Palm Grove Residency, Indiranagar",
      date: created,
      slot: d.slot ?? "Drop-off window 10:00 AM – 6:00 PM",
      phone: "+91 98450 11223",
      partnerName: d.partner,
    },
    status: d.status,
    partnerId: d.partner,
    expectedStars: expected,
    awardedStars: awardedSet.includes(d.status) ? expected : undefined,
    createdAt: iso(created),
    updatedAt: iso(created),
    timeline: buildTimeline(d.status, created),
    flags: d.flags ?? 0,
    verificationNote: d.note,
  };
}

export const SEED_DONATIONS: Donation[] = DRAFTS.map(buildDonation);

const grossAwarded = SEED_DONATIONS.reduce((s, d) => s + (d.awardedStars ?? 0), 0); // 1576

const awardedTransactions: StarTransaction[] = SEED_DONATIONS.filter(
  (d) => d.awardedStars,
)
  .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  .map((d, i) => ({
    id: `st_${i}`,
    userId: CURRENT_USER_ID,
    donationId: d.id,
    donationCode: d.code,
    stars: d.awardedStars!,
    reason: "Verified donation reward",
    status: "AWARDED",
    createdAt: d.createdAt,
    breakdown: d.items.map((it) => ({
      category: it.category,
      quantity: it.quantity,
      stars:
        it.quantity *
        (it.category === "CLOTHES" ? 10 : it.category === "BOOKS" ? 8 : it.category === "SHOES" ? 20 : it.category === "BAGS" ? 15 : it.category === "TOYS" ? 12 : 0),
    })),
  }));

export const SEED_STAR_TRANSACTIONS: StarTransaction[] = awardedTransactions.concat([
    {
      id: "st_redeem",
      userId: CURRENT_USER_ID,
      donationId: "r_1",
      donationCode: "PERK-0031",
      stars: -336,
      reason: "Redeemed: 3 saplings planted with GreenLoop Collective",
      status: "AWARDED" as const,
      createdAt: iso("2026-07-02"),
      breakdown: [],
    },
  ]);

export const SEED_BALANCE = SEED_STAR_TRANSACTIONS.reduce((s, t) => s + t.stars, 0); // 1240
export const SEED_GROSS_EARNED = grossAwarded;

export const SEED_PARTNERS: Partner[] = [
  {
    id: "p_vidyasetu",
    name: "Vidya Setu Trust",
    kind: "SCHOOL",
    city: "Bengaluru",
    states: ["Karnataka"],
    focus: ["Literacy", "School support"],
    needs: ["BOOKS", "BAGS", "CLOTHES"],
    verified: true,
    since: "2025-11-04",
    itemsDistributed: 4120,
    peopleReached: 1680,
    blurb: "Runs after-school libraries in 22 government schools across Bengaluru rural.",
    logoBg: "#e6f2ec",
    initials: "VS",
  },
  {
    id: "p_sahaara",
    name: "Sahaara Shelter Collective",
    kind: "SHELTER",
    city: "Mumbai",
    states: ["Maharashtra", "Gujarat"],
    focus: ["Housing", "Winter relief"],
    needs: ["CLOTHES", "SHOES", "OTHER"],
    verified: true,
    since: "2025-12-16",
    itemsDistributed: 3260,
    peopleReached: 940,
    blurb: "Three night shelters plus a winter relief drive for migrant worker families.",
    logoBg: "#fbe9e1",
    initials: "SC",
  },
  {
    id: "p_balavikas",
    name: "Bala Vikas School",
    kind: "SCHOOL",
    city: "Hyderabad",
    states: ["Telangana"],
    focus: ["Education", "Uniforms"],
    needs: ["BOOKS", "CLOTHES", "SHOES"],
    verified: true,
    since: "2026-01-22",
    itemsDistributed: 2470,
    peopleReached: 1120,
    blurb: "A low-cost school serving 600 first-generation learners from Kondapur.",
    logoBg: "#fdf3d8",
    initials: "BV",
  },
  {
    id: "p_greenloop",
    name: "GreenLoop Collective",
    kind: "COMMUNITY",
    city: "Bengaluru",
    states: ["Karnataka", "Tamil Nadu"],
    focus: ["Reuse", "Repair cafés"],
    needs: ["SHOES", "BAGS", "TOYS"],
    verified: true,
    since: "2026-02-09",
    itemsDistributed: 1890,
    peopleReached: 520,
    blurb: "Neighbourhood repair cafés that fix shoes and bags before they are redistributed.",
    logoBg: "#e6f2ec",
    initials: "GL",
  },
  {
    id: "p_umeed",
    name: "Umeed Women's Home",
    kind: "NGO",
    city: "Delhi",
    states: ["Delhi", "Haryana"],
    focus: ["Dignity kits", "Skills training"],
    needs: ["CLOTHES", "SHOES", "BAGS"],
    verified: true,
    since: "2025-10-30",
    itemsDistributed: 2180,
    peopleReached: 610,
    blurb: "Supports women rebuilding independent lives with dignity kits and training.",
    logoBg: "#f4ecdd",
    initials: "UH",
  },
  {
    id: "p_sanvedana",
    name: "Sanvedana Community Centre",
    kind: "COMMUNITY",
    city: "Pune",
    states: ["Maharashtra"],
    focus: ["Community wardrobe"],
    needs: ["CLOTHES", "TOYS", "OTHER"],
    verified: false,
    since: "2026-09-12",
    itemsDistributed: 0,
    peopleReached: 0,
    blurb: "A free community wardrobe opening in Kothrud this winter — verification in progress.",
    logoBg: "#f4ecdd",
    initials: "SC",
  },
];

export const PLATFORM_STATS = {
  itemsReused: 12482,
  booksShared: 4281,
  clothesDonated: 5930,
  shoesReused: 1820,
  peopleReached: 3240,
  partners: 46,
  cities: 19,
  verifiedRate: 0.94,
};

export const SEED_BADGES: Badge[] = [];
