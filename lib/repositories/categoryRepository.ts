// lib/repositories/categoryRepository.ts

import pool from "@/lib/db";

export async function getCategoriesByUserId(userId: string) {
  const result = await pool.query(
    `
      SELECT id, name
      FROM categories
      WHERE user_id = $1
      ORDER BY name ASC
    `,
    [userId],
  );

  return result.rows;
}
