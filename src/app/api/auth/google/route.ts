import { NextResponse, type NextRequest } from "next/server";
import { createMagicToken } from "@/lib/auth-token";
import { getAppUrl } from "@/lib/get-app-url";

export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;

  // Determine canonical origin URL
  const origin = getAppUrl(req);
  const redirectUri = `${origin}/api/auth/callback/google`;

  if (!clientId) {
    // If not configured yet in environment, return a helpful notice page
    return new NextResponse(
      `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>Google OAuth Setup Required - SevaKarya</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #fdfcfa; color: #1a1918; padding: 40px 20px; display: flex; justify-content: center; }
          .card { max-width: 540px; background: white; border: 1px solid #e8e4dc; border-radius: 20px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.06); }
          h1 { font-size: 22px; color: #0e5c43; margin-top: 0; }
          p { font-size: 14px; line-height: 1.6; color: #555; }
          code { background: #f5f2ea; padding: 3px 6px; border-radius: 6px; font-size: 13px; color: #0e5c43; }
          ol { font-size: 14px; line-height: 1.8; color: #333; padding-left: 20px; }
          .btn { display: inline-block; background: #0e5c43; color: white; padding: 12px 20px; border-radius: 10px; text-decoration: none; font-weight: bold; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Google OAuth Setup Required</h1>
          <p>To connect real Google authentication to your domain (<strong>${origin}</strong>):</p>
          <ol>
            <li>Go to <strong>Google Cloud Console &rarr; Credentials</strong>.</li>
            <li>Create an <strong>OAuth 2.0 Client ID</strong> (Web Application).</li>
            <li>Add Authorized redirect URI: <br/><code>${redirectUri}</code></li>
            <li>In your <strong>Vercel Project Settings &rarr; Environment Variables</strong>, add:<br/>
              <code>GOOGLE_CLIENT_ID</code><br/>
              <code>GOOGLE_CLIENT_SECRET</code>
            </li>
          </ol>
          <a href="/login" class="btn">&larr; Back to Login</a>
        </div>
      </body>
      </html>`,
      { headers: { "Content-Type": "text/html" } },
    );
  }

  // Embed the originating domain in the state token so the callback always returns to the right domain
  const state = createMagicToken({ email: "oauth_state", orgName: origin, role: "USER" }, 15 * 60);

  const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  googleAuthUrl.searchParams.set("client_id", clientId);
  googleAuthUrl.searchParams.set("redirect_uri", redirectUri);
  googleAuthUrl.searchParams.set("response_type", "code");
  googleAuthUrl.searchParams.set("scope", "openid email profile");
  googleAuthUrl.searchParams.set("state", state);
  googleAuthUrl.searchParams.set("prompt", "select_account");

  return NextResponse.redirect(googleAuthUrl.toString());
}
