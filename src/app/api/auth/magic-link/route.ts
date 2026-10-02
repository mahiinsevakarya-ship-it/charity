import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_EMAILS, createMagicToken } from "@/lib/auth-token";
import { getAppUrl } from "@/lib/get-app-url";
import type { Role } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, phone, role, whatsappOptIn, orgName, darpanId } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 },
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const isAdmin = ADMIN_EMAILS.includes(cleanEmail);
    const effectiveRole: Role = isAdmin ? "ADMIN" : (role as Role) || "USER";

    const token = createMagicToken({
      email: cleanEmail,
      name: name?.trim(),
      phone: phone?.trim(),
      role: effectiveRole,
      whatsappOptIn: Boolean(whatsappOptIn),
      orgName: orgName?.trim(),
      darpanId: darpanId?.trim(),
    });

    const origin = getAppUrl(req);
    const verifyUrl = `${origin}/auth/verify?token=${token}`;

    let emailSent = false;
    let resendError = null;
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromAddress = process.env.EMAIL_FROM || "SevaKarya <onboarding@resend.dev>";

    if (resendApiKey) {
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: fromAddress,
            to: email,
            subject: "Your SevaKarya Sign-in Link ✨",
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 20px; color: #1a1918; background-color: #fdfcfa; border: 1px solid #e8e4dc; border-radius: 16px;">
                <div style="margin-bottom: 24px;">
                  <span style="display: inline-block; padding: 6px 12px; background-color: #d1fae5; color: #0e5c43; font-weight: 700; font-size: 12px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.05em;">SevaKarya Security</span>
                </div>
                <h1 style="font-size: 24px; font-weight: 700; color: #0e5c43; margin: 0 0 12px 0;">Sign in to SevaKarya</h1>
                <p style="font-size: 15px; line-height: 1.6; color: #4a4843; margin: 0 0 24px 0;">
                  Click the button below to securely sign in to your account. This magic link is valid for 15 minutes.
                </p>
                <div style="margin: 28px 0;">
                  <a href="${verifyUrl}" style="display: inline-block; background-color: #0e5c43; color: #fdfcfa; font-weight: 700; font-size: 15px; text-decoration: none; padding: 14px 28px; border-radius: 12px; box-shadow: 0 4px 14px rgba(14, 92, 67, 0.3);">
                    Sign in to SevaKarya →
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
        } else {
          const errData = await res.json();
          resendError = errData?.message || "Failed to deliver email via Resend.";
        }
      } catch (err: unknown) {
        emailSent = false;
        resendError = err instanceof Error ? err.message : "Network error contacting email provider.";
      }
    }

    return NextResponse.json({
      success: true,
      emailSent,
      resendConfigured: Boolean(resendApiKey),
      resendError,
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
