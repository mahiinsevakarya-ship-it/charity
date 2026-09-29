"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  Category,
  Condition,
  Donation,
  DonationImage,
  DonationStatus,
  FulfillmentMethod,
  Role,
  StarTransaction,
  User,
} from "./types";
import {
  CURRENT_USER_ID,
  SEED_DONATIONS,
  SEED_PARTNERS,
  SEED_STAR_TRANSACTIONS,
  SEED_USERS,
} from "./seed";
import { CATEGORY_MAP, estimateStars, levelForStars } from "./catalog";

const STORAGE_KEY = "rekindle:v1";

interface PersistedState {
  sessionId: string | null;
  users: User[];
  donations: Donation[];
  transactions: StarTransaction[];
}

export interface DonationDraft {
  items: { category: Category; quantity: number; condition: Condition; note?: string }[];
  images: DonationImage[];
  method: FulfillmentMethod;
  address?: string;
  city?: string;
  date?: string;
  slot?: string;
  phone?: string;
}

interface AppValue {
  ready: boolean;
  justVerifiedId: string | null;
  clearJustVerified: () => void;
  session: string | null;
  me: User | null;
  users: User[];
  donations: Donation[];
  myDonations: Donation[];
  transactions: StarTransaction[];
  partners: typeof SEED_PARTNERS;
  balance: number;
  grossEarned: number;
  pendingCount: number;
  signInMagic: (
    email: string,
    name?: string,
    phone?: string,
    role?: Role,
    whatsappOptIn?: boolean,
    orgName?: string,
    darpanId?: string,
  ) => void;
  signInGoogle: (profile?: { email: string; name: string; avatarUrl?: string }) => void;
  signInPhone: (phone: string, name?: string, whatsappOptIn?: boolean) => void;
  signInNgo: (orgName: string, email: string, phone: string, darpanId?: string) => void;
  signOut: () => void;
  createDonation: (draft: DonationDraft) => Donation;
  verifyDonation: (id: string) => void;
  setStatus: (id: string, status: DonationStatus, note?: string) => void;
  adjustStars: (userId: string, stars: number, reason: string) => void;
  redeemPerk: (stars: number, label: string) => void;
  updateMe: (patch: Partial<User>) => void;
}

const AppContext = createContext<AppValue | null>(null);

function loadState(): PersistedState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PersistedState) : null;
  } catch {
    return null;
  }
}

function persist(state: PersistedState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable — demo still works in memory */
  }
}

const STATUS_NOTES: Record<DonationStatus, string> = {
  SUBMITTED: "We have your submission and are assigning a partner.",
  UNDER_REVIEW: "Our team is reviewing the photos and details you shared.",
  PICKUP_SCHEDULED: "Volunteer assigned — you will get a call before arrival.",
  COLLECTED: "Picked up from your address by the ReKindle volunteer.",
  RECEIVED: "Arrived at the partner sorting hub, awaiting verification.",
  VERIFIED: "Counted, photographed and logged at the partner hub.",
  DISTRIBUTED: "Handed over to the partner's distribution drive.",
  COMPLETED: "Distributed — the partner has reported back with photos.",
  REJECTED: "Could not be accepted for reuse.",
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<string | null>(CURRENT_USER_ID);
  const [users, setUsers] = useState<User[]>(SEED_USERS);
  const [donations, setDonations] = useState<Donation[]>(SEED_DONATIONS);
  const [transactions, setTransactions] = useState<StarTransaction[]>(SEED_STAR_TRANSACTIONS);
  const [justVerifiedId, setJustVerifiedId] = useState<string | null>(null);

  useEffect(() => {
    const saved = loadState();
    if (saved) {
      /* eslint-disable-next-line react-hooks/set-state-in-effect -- syncing persisted localStorage on mount */
      setSession(saved.sessionId);
      setUsers(saved.users.length ? saved.users : SEED_USERS);
      setDonations(saved.donations.length ? saved.donations : SEED_DONATIONS);
      setTransactions(saved.transactions.length ? saved.transactions : SEED_STAR_TRANSACTIONS);
    }
    setReady(true);
  }, []);

  const save = useCallback(
    (next: Partial<PersistedState>) => {
      const state: PersistedState = {
        sessionId: next.sessionId !== undefined ? next.sessionId : session,
        users: next.users ?? users,
        donations: next.donations ?? donations,
        transactions: next.transactions ?? transactions,
      };
      setSession(state.sessionId);
      setUsers(state.users);
      setDonations(state.donations);
      setTransactions(state.transactions);
      persist(state);
    },
    [session, users, donations, transactions],
  );

  const me = useMemo(() => users.find((u) => u.id === session) ?? null, [users, session]);

  const myDonations = useMemo(
    () =>
      donations
        .filter((d) => d.userId === session)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [donations, session],
  );

  const balance = useMemo(
    () => transactions.filter((t) => t.userId === session).reduce((s, t) => s + t.stars, 0),
    [transactions, session],
  );

  const grossEarned = useMemo(
    () =>
      transactions
        .filter((t) => t.userId === session && t.stars > 0)
        .reduce((s, t) => s + t.stars, 0),
    [transactions, session],
  );

  const pendingCount = useMemo(
    () =>
      myDonations.filter((d) => !["VERIFIED", "DISTRIBUTED", "COMPLETED", "REJECTED"].includes(d.status))
        .length,
    [myDonations],
  );

  const signInMagic = useCallback(
    (
      email: string,
      name?: string,
      phone?: string,
      role?: Role,
      whatsappOptIn?: boolean,
      orgName?: string,
      darpanId?: string,
    ) => {
      const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        if (phone || name || whatsappOptIn !== undefined || orgName || darpanId) {
          const updated = users.map((u) =>
            u.id === existing.id
              ? {
                  ...u,
                  name: name?.trim() || u.name,
                  phone: phone?.trim() || u.phone,
                  whatsappOptIn: whatsappOptIn ?? u.whatsappOptIn,
                  orgName: orgName?.trim() || u.orgName,
                  darpanId: darpanId?.trim() || u.darpanId,
                  role: role || u.role,
                }
              : u,
          );
          save({ users: updated, sessionId: existing.id });
          return;
        }
        save({ sessionId: existing.id });
        return;
      }
      const clean = name?.trim() || email.split("@")[0].replace(/[._-]+/g, " ");
      const displayName = clean
        .split(" ")
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join(" ");
      const initials = displayName
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
      const user: User = {
        id: `u_${Date.now()}`,
        name: displayName,
        email,
        phone: phone?.trim(),
        whatsappOptIn: whatsappOptIn ?? true,
        orgName: orgName?.trim(),
        darpanId: darpanId?.trim(),
        avatarColor: role === "NGO" ? "#0e5c43" : "#16825f",
        initials,
        role: role || "USER",
        joinedAt: new Date().toISOString(),
        badges: [],
      };
      save({ users: [...users, user], sessionId: user.id });
    },
    [users, save],
  );

  const signInGoogle = useCallback(
    (profile?: { email: string; name: string; avatarUrl?: string }) => {
      if (profile) {
        const existing = users.find((u) => u.email.toLowerCase() === profile.email.toLowerCase());
        if (existing) {
          save({ sessionId: existing.id });
          return;
        }
        const initials = profile.name
          .split(" ")
          .map((p) => p[0])
          .slice(0, 2)
          .join("")
          .toUpperCase();
        const user: User = {
          id: `u_${Date.now()}`,
          name: profile.name,
          email: profile.email,
          avatarColor: "#4285F4",
          initials,
          role: "USER",
          joinedAt: new Date().toISOString(),
          badges: [],
        };
        save({ users: [...users, user], sessionId: user.id });
        return;
      }
      const existing = users.find((u) => u.email === "mahesh.rao@example.com");
      save({ sessionId: existing ? existing.id : SEED_USERS[0].id });
    },
    [users, save],
  );

  const signInPhone = useCallback(
    (phone: string, name?: string, whatsappOptIn = true) => {
      const cleanPhone = phone.trim();
      const existing = users.find((u) => u.phone === cleanPhone);
      if (existing) {
        save({ sessionId: existing.id });
        return;
      }
      const displayName = name?.trim() || `Donor ${cleanPhone.slice(-4)}`;
      const initials = displayName
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
      const user: User = {
        id: `u_${Date.now()}`,
        name: displayName,
        email: `${cleanPhone.replace(/\D/g, "")}@mobile.rekindle.org`,
        phone: cleanPhone,
        whatsappOptIn,
        avatarColor: "#16825f",
        initials,
        role: "USER",
        joinedAt: new Date().toISOString(),
        badges: [],
      };
      save({ users: [...users, user], sessionId: user.id });
    },
    [users, save],
  );

  const signInNgo = useCallback(
    (orgName: string, email: string, phone: string, darpanId?: string) => {
      const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        save({ sessionId: existing.id });
        return;
      }
      const initials = orgName
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
      const user: User = {
        id: `u_${Date.now()}`,
        name: orgName,
        email,
        phone,
        orgName,
        darpanId,
        whatsappOptIn: true,
        avatarColor: "#0e5c43",
        initials,
        role: "NGO",
        joinedAt: new Date().toISOString(),
        badges: ["VERIFIED_PARTNER"],
      };
      save({ users: [...users, user], sessionId: user.id });
    },
    [users, save],
  );

  const signOut = useCallback(() => save({ sessionId: null }), [save]);

  const createDonation = useCallback(
    (draft: DonationDraft): Donation => {
      const maxSerial = donations.reduce((max, d) => {
        const n = Number(d.code.replace(/\D/g, ""));
        return Number.isFinite(n) && n > max ? n : max;
      }, 1024);
      const code = `RK-${maxSerial + 1}`;
      const items = draft.items.map((it, i) => ({
        id: `${code}-${i}`,
        category: it.category,
        quantity: it.quantity,
        unit: CATEGORY_MAP[it.category].unit,
        condition: it.condition,
        note: it.note,
      }));
      const now = new Date().toISOString();
      const status: DonationStatus = draft.method === "PICKUP" ? "PICKUP_SCHEDULED" : "UNDER_REVIEW";
      const donation: Donation = {
        id: `d_${Date.now()}`,
        code,
        userId: session ?? CURRENT_USER_ID,
        items,
        images: draft.images,
        pickup: {
          id: `pk_${Date.now()}`,
          method: draft.method,
          city: draft.city ?? "Bengaluru",
          address: draft.address,
          date: draft.date ?? now,
          slot: draft.slot,
          phone: draft.phone,
        },
        status,
        expectedStars: estimateStars(items),
        createdAt: now,
        updatedAt: now,
        timeline: [{ status: "SUBMITTED", at: now, note: "Donation submitted" }],
        flags: 0,
        verificationNote: STATUS_NOTES[status],
      };
      save({ donations: [donation, ...donations] });
      return donation;
    },
    [donations, session, save],
  );

  const pushTransaction = useCallback(
    (list: StarTransaction[], tx: StarTransaction, nextDonations: Donation[]) => {
      save({ transactions: [...list, tx], donations: nextDonations });
    },
    [save],
  );

  const verifyDonation = useCallback(
    (id: string) => {
      const target = donations.find((d) => d.id === id);
      if (!target || target.awardedStars) return;
      const now = new Date().toISOString();
      const nextDonations = donations.map((d) =>
        d.id === id
          ? {
              ...d,
              status: "VERIFIED" as DonationStatus,
              awardedStars: d.expectedStars,
              updatedAt: now,
              timeline: [
                ...d.timeline,
                { status: "VERIFIED" as const, at: now, note: STATUS_NOTES.VERIFIED },
              ],
            }
          : d,
      );
      const tx: StarTransaction = {
        id: `st_${Date.now()}`,
        userId: target.userId,
        donationId: target.id,
        donationCode: target.code,
        stars: target.expectedStars,
        reason: "Verified donation reward",
        status: "AWARDED",
        createdAt: now,
        breakdown: target.items.map((it) => ({
          category: it.category,
          quantity: it.quantity,
          stars: it.quantity * CATEGORY_MAP[it.category].starsPerUnit,
        })),
      };
      pushTransaction(transactions, tx, nextDonations);
      setJustVerifiedId(id);
    },
    [donations, transactions, pushTransaction],
  );

  const setStatus = useCallback(
    (id: string, status: DonationStatus, note?: string) => {
      const now = new Date().toISOString();
      const next = donations.map((d) =>
        d.id === id
          ? {
              ...d,
              status,
              updatedAt: now,
              timeline: [...d.timeline, { status, at: now, note: note ?? STATUS_NOTES[status] }],
            }
          : d,
      );
      save({ donations: next });
    },
    [donations, save],
  );

  const adjustStars = useCallback(
    (userId: string, stars: number, reason: string) => {
      const tx: StarTransaction = {
        id: `st_${Date.now()}`,
        userId,
        donationId: "manual",
        donationCode: "ADMIN-ADJ",
        stars,
        reason,
        status: "AWARDED",
        createdAt: new Date().toISOString(),
        breakdown: [],
      };
      save({ transactions: [...transactions, tx] });
    },
    [transactions, save],
  );

  const redeemPerk = useCallback(
    (stars: number, label: string) => {
      if (!session || balance < stars) return;
      const tx: StarTransaction = {
        id: `st_${Date.now()}`,
        userId: session,
        donationId: `perk_${Date.now()}`,
        donationCode: `PERK-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        stars: -stars,
        reason: `Redeemed: ${label}`,
        status: "AWARDED",
        createdAt: new Date().toISOString(),
        breakdown: [],
      };
      save({ transactions: [...transactions, tx] });
    },
    [transactions, session, balance, save],
  );

  const updateMe = useCallback(
    (patch: Partial<User>) => {
      if (!session) return;
      save({ users: users.map((u) => (u.id === session ? { ...u, ...patch } : u)) });
    },
    [users, session, save],
  );

  const value: AppValue = {
    ready,
    justVerifiedId,
    clearJustVerified: () => setJustVerifiedId(null),
    session,
    me,
    users,
    donations,
    myDonations,
    transactions,
    partners: SEED_PARTNERS,
    balance,
    grossEarned,
    pendingCount,
    signInMagic,
    signInGoogle,
    signInPhone,
    signInNgo,
    signOut,
    createDonation,
    verifyDonation,
    setStatus,
    adjustStars,
    redeemPerk,
    updateMe,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}

export interface UserStats {
  totalDonations: number;
  itemsReused: number;
  books: number;
  clothes: number;
  shoes: number;
  bags: number;
  toys: number;
  other: number;
  pending: number;
  starsEarned: number;
  balance: number;
  level: ReturnType<typeof levelForStars>;
  verifiedCount: number;
}

const COUNTED: DonationStatus[] = ["VERIFIED", "DISTRIBUTED", "COMPLETED"];

export function computeStats(donations: Donation[], transactions: StarTransaction[]): UserStats {
  const counted = donations.filter((d) => COUNTED.includes(d.status));
  const tally = (cat: Category) =>
    counted.reduce(
      (sum, d) => sum + d.items.filter((i) => i.category === cat).reduce((s, i) => s + i.quantity, 0),
      0,
    );
  const itemsReused = counted.reduce(
    (sum, d) => sum + d.items.reduce((s, i) => s + i.quantity, 0),
    0,
  );
  const balance = transactions.reduce((s, t) => s + t.stars, 0);
  return {
    totalDonations: donations.length,
    verifiedCount: counted.length,
    itemsReused,
    books: tally("BOOKS"),
    clothes: tally("CLOTHES"),
    shoes: tally("SHOES"),
    bags: tally("BAGS"),
    toys: tally("TOYS"),
    other: tally("OTHER"),
    pending: donations.filter(
      (d) => !["VERIFIED", "DISTRIBUTED", "COMPLETED", "REJECTED"].includes(d.status),
    ).length,
    starsEarned: transactions.filter((t) => t.stars > 0).reduce((s, t) => s + t.stars, 0),
    balance,
    level: levelForStars(balance),
  };
}

export function useMyStats(): UserStats {
  const { myDonations, transactions, session } = useApp();
  return useMemo(
    () => computeStats(myDonations, transactions.filter((t) => t.userId === session)),
    [myDonations, transactions, session],
  );
}
