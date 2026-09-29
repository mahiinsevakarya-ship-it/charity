import { NextResponse } from "next/server";
import { verifyMagicToken } from "@/lib/auth-token";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    if (!token || typeof token !== "string") {
      return NextResponse.json({ valid: false, error: "Missing token" }, { status: 400 });
    }

    const payload = verifyMagicToken(token);
    if (!payload) {
      return NextResponse.json(
        { valid: false, error: "The sign-in link is invalid or has expired." },
        { status: 401 },
      );
    }

    return NextResponse.json({
      valid: true,
      payload,
    });
  } catch {
    return NextResponse.json(
      { valid: false, error: "Could not verify sign-in link." },
      { status: 500 },
    );
  }
}
