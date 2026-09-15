import pool from "@/lib/db";

export async function updateUsernameById(userId: string, username: string) {
  const result = await pool.query(
    `
      UPDATE users
      SET username = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, username, email
    `,
    [username, userId],
  );

  return result.rows[0] ?? null;
}

export async function updateMonthlyReportEnabledById(
  userId: string,
  enabled: boolean,
) {
  const result = await pool.query(
    `
      UPDATE users
      SET monthly_report_enabled = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, username, email, monthly_report_enabled
    `,
    [enabled, userId],
  );

  return result.rows[0] ?? null;
}

export async function getUsersWithMonthlyReportEnabled() {
  const result = await pool.query(
    `
      SELECT id, username, email
      FROM users
      WHERE monthly_report_enabled = true
    `,
  );

  return result.rows;
}
