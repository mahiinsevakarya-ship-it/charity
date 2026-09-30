import { NextResponse, type NextRequest } from "next/server";
import { createMagicToken, verifyMagicToken } from "@/lib/auth-token";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const proto = req.headers.get("x-forwarded-proto") || "http";
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
  const origin = `${proto}://${host}`;
  const redirectUri = `${origin}/api/auth/callback/google`;

  if (error || !code) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error || "cancelled")}`, origin));
  }

  // Validate state
  if (!state || !verifyMagicToken(state)) {
    return NextResponse.redirect(new URL("/login?error=invalid_state", origin));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/login?error=google_credentials_missing", origin));
  }

  try {
    // 1. Exchange code for access token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      return NextResponse.redirect(new URL("/login?error=token_exchange_failed", origin));
    }

    // 2. Fetch user profile from Google
    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const userData = await userRes.json();
    if (!userRes.ok || !userData.email) {
      return NextResponse.redirect(new URL("/login?error=profile_fetch_failed", origin));
    }

    // 3. Create authentication token and redirect to /auth/verify
    const authToken = createMagicToken({
      email: userData.email,
      name: userData.name || userData.email.split("@")[0],
      role: "USER",
    });

    return NextResponse.redirect(new URL(`/auth/verify?token=${authToken}`, origin));
  } catch {
    return NextResponse.redirect(new URL("/login?error=oauth_error", origin));
  }
}
