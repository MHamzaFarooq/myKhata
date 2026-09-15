import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

export async function GET(request: Request) {
  // Vercel serves this project from many domains (a stable production
  // alias, git-branch aliases, and a brand new one-off URL on every single
  // deployment). Google only allows exact, pre-registered redirect URIs -
  // no wildcards - so registering every ephemeral deployment URL isn't
  // sustainable. Instead, if a canonical APP_URL is configured and the
  // request came in on a different domain, bounce to the canonical domain
  // first and restart the flow there. That way only APP_URL (plus
  // localhost for dev) ever needs to be registered in Google Cloud
  // Console, regardless of which URL someone actually opened the app from.
  const canonicalOrigin = process.env.APP_URL?.replace(/\/$/, "");
  const currentOrigin = new URL(request.url).origin;

  if (canonicalOrigin && currentOrigin !== canonicalOrigin) {
    return NextResponse.redirect(`${canonicalOrigin}/api/auth/google`);
  }

  const state = crypto.randomBytes(16).toString("hex");

  const cookieStore = await cookies();
  cookieStore.set("google_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10,
    path: "/",
  });

  // Derived from the request rather than a fixed env var, so it always
  // matches whichever domain the user is actually browsing (Vercel serves
  // a project from several domains - the primary alias, git-branch
  // aliases, a custom domain - and a mismatch here means the state cookie
  // set on one origin never reaches the callback on another).
  const redirectUri = new URL("/api/auth/google/callback", request.url).toString();

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
    state,
  });

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
  );
}
