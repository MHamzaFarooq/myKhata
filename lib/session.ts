import pool from "./db";
import { cookies } from "next/headers";

export async function createSession(userId: string) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const result = await pool.query(
    `
      INSERT INTO sessions (user_id, expires_at)
      VALUES ($1, $2)
      RETURNING id, user_id, expires_at
    `,
    [userId, expiresAt],
  );
  return result.rows[0];
}

export async function getCurrentUser() {
  const cookieStore = await cookies();

  const sessionId = cookieStore.get("session_id")?.value;

  if (!sessionId) {
    return null;
  }

  const result = await pool.query(
    `
      SELECT
        users.id,
        users.username,
        users.email,
        users.monthly_report_enabled
      FROM sessions
      JOIN users ON sessions.user_id = users.id
      WHERE sessions.id = $1
        AND sessions.expires_at > NOW()
    `,
    [sessionId],
  );

  if (result.rows.length === 0) {
    cookieStore.delete("session_id");
    return null;
  }

  return result.rows[0];
}

export async function deleteSession() {
  const cookieStore = await cookies();

  const sessionId = cookieStore.get("session_id")?.value;

  if (!sessionId) {
    return;
  }

  await pool.query(
    `
      DELETE FROM sessions
      WHERE id = $1
    `,
    [sessionId],
  );

  cookieStore.delete("session_id");
}
