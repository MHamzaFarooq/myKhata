import {
  createTransaction,
  deleteTransactionById,
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
) {
  if (!userId) {
    throw new Error("Unauthorized");
  }

  return await getTransactionsByUserId(userId, transactionType, page, pageSize);
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

    return summary;
  } catch (error) {
    console.error("Error fetching monthly transaction summary:", error);
  }
}
