// lib/repositories/categoryRepository.ts

import pool from "@/lib/db";
import type { PoolClient } from "pg";

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

export async function createDefaultCategories(
  client: PoolClient,
  userId: string,
) {
  await client.query(
    `
      INSERT INTO categories (user_id, name)
      VALUES
        ($1, 'Food & Dining'),
        ($1, 'Groceries'),
        ($1, 'Transportation'),
        ($1, 'Shopping'),
        ($1, 'Bills & Utilities'),
        ($1, 'Entertainment'),
        ($1, 'Healthcare'),
        ($1, 'Education'),
        ($1, 'Rent'),
        ($1, 'Other')
    `,
    [userId],
  );
}
