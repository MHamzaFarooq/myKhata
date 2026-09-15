import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import pool from "@/lib/db";
import { createSession } from "@/lib/session";
import { createDefaultCategories } from "@/lib/repositories/categoryRepository";

interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
}

interface GoogleUserInfo {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const cookieStore = await cookies();
  const storedState = cookieStore.get("google_oauth_state")?.value;
  cookieStore.delete("google_oauth_state");

  if (error || !code || !state || !storedState || state !== storedState) {
    return NextResponse.redirect(new URL("/login?error=oauth", request.url));
  }

  try {
    // Must be byte-for-byte identical to the redirect_uri used to build the
    // authorization URL - derive it the same way, from the request itself,
    // rather than a fixed env var.
    const redirectUri = new URL(
      "/api/auth/google/callback",
      request.url,
    ).toString();

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange code for tokens");
    }

    const tokens: GoogleTokenResponse = await tokenResponse.json();

    const userInfoResponse = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      },
    );

    if (!userInfoResponse.ok) {
      throw new Error("Failed to fetch Google user info");
    }

    const googleUser: GoogleUserInfo = await userInfoResponse.json();

    if (!googleUser.email) {
      throw new Error("Google account has no email");
    }

    const email = googleUser.email.toLowerCase();

    const client = await pool.connect();
    let userId: string;

    try {
      await client.query("BEGIN");

      const linkedAccount = await client.query(
        `SELECT user_id FROM accounts WHERE provider = 'google' AND provider_account_id = $1`,
        [googleUser.sub],
      );

      if (linkedAccount.rows.length > 0) {
        userId = linkedAccount.rows[0].user_id;
      } else {
        const existingUser = await client.query(
          `SELECT id FROM users WHERE email = $1`,
          [email],
        );

        if (existingUser.rows.length > 0) {
          userId = existingUser.rows[0].id;
        } else {
          const username = googleUser.name?.trim() || email.split("@")[0];

          const newUser = await client.query(
            `INSERT INTO users (username, email, password) VALUES ($1, $2, NULL) RETURNING id`,
            [username, email],
          );

          userId = newUser.rows[0].id;

          await createDefaultCategories(client, userId);
        }

        await client.query(
          `INSERT INTO accounts (user_id, provider, provider_account_id) VALUES ($1, 'google', $2)`,
          [userId, googleUser.sub],
        );
      }

      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }

    const session = await createSession(userId);
    cookieStore.set("session_id", session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: session.expires_at,
      path: "/",
    });

    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (err) {
    console.error("Google OAuth callback error:", err);
    return NextResponse.redirect(new URL("/login?error=oauth", request.url));
  }
}
