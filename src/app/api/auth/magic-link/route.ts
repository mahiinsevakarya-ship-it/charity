import { NextResponse } from "next/server";
import { createMagicToken } from "@/lib/auth-token";
import type { Role } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, phone, role, whatsappOptIn, orgName, darpanId } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 },
      );
    }

    const token = createMagicToken({
      email: email.trim().toLowerCase(),
      name: name?.trim(),
      phone: phone?.trim(),
      role: (role as Role) || "USER",
      whatsappOptIn: Boolean(whatsappOptIn),
      orgName: orgName?.trim(),
      darpanId: darpanId?.trim(),
    });

    const origin = req.headers.get("origin") || "http://localhost:3000";
    const verifyUrl = `${origin}/auth/verify?token=${token}`;

    let emailSent = false;
    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey) {
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "ReKindle <auth@rekindle.org>",
            to: email,
            subject: "Your ReKindle Sign-in Link ✨",
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 20px; color: #1a1918; background-color: #fdfcfa; border: 1px solid #e8e4dc; border-radius: 16px;">
                <div style="margin-bottom: 24px;">
                  <span style="display: inline-block; padding: 6px 12px; background-color: #d1fae5; color: #0e5c43; font-weight: 700; font-size: 12px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.05em;">ReKindle Auth</span>
                </div>
                <h1 style="font-size: 24px; font-weight: 700; color: #0e5c43; margin: 0 0 12px 0;">Sign in to ReKindle</h1>
                <p style="font-size: 15px; line-height: 1.6; color: #4a4843; margin: 0 0 24px 0;">
                  Click the button below to securely sign in to your account. This magic link is valid for 15 minutes.
                </p>
                <div style="margin: 28px 0;">
                  <a href="${verifyUrl}" style="display: inline-block; background-color: #0e5c43; color: #fdfcfa; font-weight: 700; font-size: 15px; text-decoration: none; padding: 14px 28px; border-radius: 12px; box-shadow: 0 4px 14px rgba(14, 92, 67, 0.3);">
                    Sign in to ReKindle →
                  </a>
                </div>
                <p style="font-size: 13px; line-height: 1.5; color: #7a766e; margin: 24px 0 0 0; border-top: 1px solid #e8e4dc; padding-top: 16px;">
                  If you didn't request this link, you can safely disregard this email.
                </p>
              </div>
            `,
          }),
        });

        if (res.ok) {
          emailSent = true;
        }
      } catch {
        emailSent = false;
      }
    }

    return NextResponse.json({
      success: true,
      emailSent,
      verifyUrl,
      email: email.trim().toLowerCase(),
      expiresIn: "15 minutes",
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate authentication link." },
      { status: 500 },
    );
  }
}
