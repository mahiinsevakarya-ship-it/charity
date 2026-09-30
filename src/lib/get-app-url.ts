import type { NextRequest } from "next/server";

export function getAppUrl(req?: NextRequest): string {
  // 1. Explicit environment variable override
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL.replace(/\/$/, "");
  }

  // 2. Request headers (dynamic on Vercel)
  if (req) {
    const host =
      req.headers.get("x-forwarded-host") ||
      req.headers.get("host") ||
      "localhost:3000";

    const isLocal = host.includes("localhost") || host.includes("127.0.0.1");
    const finalProto = isLocal ? "http" : "https";

    return `${finalProto}://${host}`;
  }

  // 3. Vercel system variable
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }

  return "http://localhost:3000";
}
