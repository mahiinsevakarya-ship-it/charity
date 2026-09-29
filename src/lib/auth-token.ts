import { createHmac, timingSafeEqual } from "node:crypto";
import type { Role } from "./types";

const SECRET = process.env.AUTH_SECRET || "rekindle-auth-secret-key-charity-platform-2026";

export interface MagicTokenPayload {
  email: string;
  name?: string;
  phone?: string;
  role?: Role;
  whatsappOptIn?: boolean;
  orgName?: string;
  darpanId?: string;
  exp: number; // Unix timestamp in seconds
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return Buffer.from(base64, "base64").toString("utf-8");
}

export function createMagicToken(
  payload: Omit<MagicTokenPayload, "exp">,
  expiresInSeconds = 15 * 60, // 15 minutes
): string {
  const fullPayload: MagicTokenPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  };

  const payloadString = JSON.stringify(fullPayload);
  const encodedPayload = base64UrlEncode(payloadString);

  const hmac = createHmac("sha256", SECRET);
  hmac.update(encodedPayload);
  const signature = base64UrlEncode(hmac.digest("base64"));

  return `${encodedPayload}.${signature}`;
}

export function verifyMagicToken(token: string): MagicTokenPayload | null {
  try {
    const [encodedPayload, signature] = token.split(".");
    if (!encodedPayload || !signature) return null;

    const hmac = createHmac("sha256", SECRET);
    hmac.update(encodedPayload);
    const expectedSig = base64UrlEncode(hmac.digest("base64"));

    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expectedSig);

    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }

    const payload: MagicTokenPayload = JSON.parse(base64UrlDecode(encodedPayload));
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp < now) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}
