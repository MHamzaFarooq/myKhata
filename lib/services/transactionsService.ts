import {
  createTransaction,
  deleteTransactionById,
  getDailyActivityCounts,
  getMonthlyTransactionSummaryByUserId,
  getTransactionsByUserId,
  getTransactionSummaryByUserId,
} from "../repositories/transactionRepository";
import { getCurrentUser } from "../session";

export async function addTransaction(data: {
  categoryId: string | null;
  amount: number;
  transactionType: "income" | "expense";
  description: string | null;
  transactionDate: string;
}) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  return createTransaction({
    userId: user.id,
    categoryId: data.categoryId,
    amount: data.amount,
    transactionType: data.transactionType,
    description: data.description,
    transactionDate: data.transactionDate,
  });
}

export async function getTransactionsService(
  userId: string,
  transactionType?: "income" | "expense",
  page: number = 1,
  pageSize: number = 6,
  month?: string,
) {
  if (!userId) {
    throw new Error("Unauthorized");
  }

  return await getTransactionsByUserId(
    userId,
    transactionType,
    page,
    pageSize,
    month,
  );
}

export async function deleteTransactionService(
  transactionId: string,
  userId: string,
) {
  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!transactionId) {
    throw new Error("Transaction ID is required.");
  }

  const deletedTransaction = await deleteTransactionById(transactionId, userId);

  if (!deletedTransaction) {
    throw new Error("Transaction not found.");
  }

  return deletedTransaction;
}

export async function getTransactionSummaryService(userId: string) {
  try {
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const summary = await getTransactionSummaryByUserId(userId);

    return {
      totalIncome: Number(summary.total_income),
      totalExpense: Number(summary.total_expense),
      balance: Number(summary.total_income) - Number(summary.total_expense),
    };
  } catch (error) {
    console.error("Error fetching transaction summary:", error);
  }
}

export async function getDailyActivityService(
  userId: string,
  year: number,
  month: number,
) {
  try {
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const pad = (n: number) => String(n).padStart(2, "0");
    const daysInMonth = new Date(year, month, 0).getDate();
    const startDate = `${year}-${pad(month)}-01`;
    const endDate = `${year}-${pad(month)}-${pad(daysInMonth)}`;

    return await getDailyActivityCounts(userId, startDate, endDate);
  } catch (error) {
    console.error("Error fetching daily activity:", error);
  }
}

export async function getMonthlyTransactionSummaryService(
  userId: string,
  year: number,
  month: number,
) {
  try {
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const summary = await getMonthlyTransactionSummaryByUserId(
      userId,
      year,
      month,
    );

    // Running totals: each point is the cumulative income/expense up to
    // that day, so the lines only ever climb instead of jumping back down
    // on days with no activity.
    let runningIncome = 0;
    let runningExpense = 0;

    return summary.map((row) => {
      runningIncome += Number(row.income);
      runningExpense += Number(row.expense);

      return {
        day: row.day,
        income: runningIncome,
        expense: runningExpense,
      };
    });
  } catch (error) {
    console.error("Error fetching monthly transaction summary:", error);
  }
}
