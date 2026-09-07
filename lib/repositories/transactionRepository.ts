import pool from "@/lib/db";

type CreateTransactionInput = {
  userId: string;
  categoryId: string | null;
  amount: number;
  transactionType: "income" | "expense";
  description: string | null;
  transactionDate: string;
};

export async function createTransaction(data: CreateTransactionInput) {
  const result = await pool.query(
    `
      INSERT INTO transactions (
        user_id,
        category_id,
        amount,
        transaction_type,
        description,
        transaction_date
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING
        id,
        user_id,
        category_id,
        amount,
        transaction_type,
        description,
        transaction_date,
        created_at
    `,
    [
      data.userId,
      data.categoryId,
      data.amount,
      data.transactionType,
      data.description,
      data.transactionDate,
    ],
  );

  return result.rows[0];
}

export async function getTransactionsByUserId(
  userId: string,
  transactionType?: "income" | "expense",
  page: number = 1,
  pageSize: number = 6,
) {
  const offset = (page - 1) * pageSize;

  const [rowsResult, countResult] = await Promise.all([
    pool.query(
      `
        SELECT
          transactions.id,
          transactions.amount,
          transactions.transaction_type,
          transactions.category_id,
          transactions.description,
          transactions.transaction_date,
          transactions.created_at,
          categories.name AS category_name
        FROM transactions
        LEFT JOIN categories
          ON transactions.category_id = categories.id
        WHERE transactions.user_id = $1
          AND ($2::VARCHAR IS NULL OR transactions.transaction_type = $2)
        ORDER BY transaction_date DESC, created_at DESC
        LIMIT $3 OFFSET $4
      `,
      [userId, transactionType ?? null, pageSize, offset],
    ),
    pool.query(
      `
        SELECT COUNT(*)::int AS total
        FROM transactions
        WHERE user_id = $1
          AND ($2::VARCHAR IS NULL OR transaction_type = $2)
      `,
      [userId, transactionType ?? null],
    ),
  ]);

  return {
    transactions: rowsResult.rows,
    totalCount: countResult.rows[0].total,
  };
}

export async function deleteTransactionById(
  transactionId: string,
  userId: string,
) {
  const result = await pool.query(
    `
      DELETE FROM transactions
      WHERE id = $1
        AND user_id = $2
      RETURNING id
    `,
    [transactionId, userId],
  );
  return result.rows[0] ?? null;
}

export async function getTransactionSummaryByUserId(userId: string) {
  const result = await pool.query(
    `
      SELECT
        COALESCE(
          SUM(
            CASE
              WHEN transaction_type = 'income' THEN amount
              ELSE 0
            END
          ),
          0
        ) AS total_income,

        COALESCE(
          SUM(
            CASE
              WHEN transaction_type = 'expense' THEN amount
              ELSE 0
            END
          ),
          0
        ) AS total_expense

      FROM transactions
      WHERE user_id = $1
    `,
    [userId],
  );

  return result.rows[0];
}

export async function getMonthlyTransactionSummaryByUserId(
  userId: string,
  year: number,
  month: number,
) {
  const result = await pool.query(
    `
      SELECT
        days.day::int AS day,

        COALESCE(SUM(
          CASE WHEN transactions.transaction_type = 'income'
          THEN transactions.amount ELSE 0 END
        ), 0) AS income,

        COALESCE(SUM(
          CASE WHEN transactions.transaction_type = 'expense'
          THEN transactions.amount ELSE 0 END
        ), 0) AS expense

      FROM generate_series(
        1,
        EXTRACT(DAY FROM (DATE_TRUNC('month', MAKE_DATE($2, $3, 1)) + INTERVAL '1 month - 1 day'))::int
      ) AS days(day)

      LEFT JOIN transactions
        ON EXTRACT(DAY FROM transactions.transaction_date) = days.day
        AND EXTRACT(YEAR FROM transactions.transaction_date) = $2
        AND EXTRACT(MONTH FROM transactions.transaction_date) = $3
        AND transactions.user_id = $1

      GROUP BY days.day
      ORDER BY days.day ASC
    `,
    [userId, year, month],
  );

  return result.rows;
}
