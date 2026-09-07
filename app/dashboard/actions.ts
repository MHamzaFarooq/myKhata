"use server";
import { redirect } from "next/navigation";
import { deleteSession, getCurrentUser } from "@/lib/session";
import { transactionSchema } from "@/lib/validations/transactionSchema";
import {
  addTransaction as addTransactionService,
  deleteTransactionService,
  getMonthlyTransactionSummaryService,
  getTransactionsService,
  getTransactionSummaryService,
} from "@/lib/services/transactionsService";

export async function logoutUser() {
  await deleteSession();

  redirect("/login");
}

export async function addTransaction(
  previousData: unknown,
  formData: FormData,
) {
  const amount = Number(formData.get("amount"));
  const transactionType = formData.get("transactionType");
  const categoryId = formData.get("category");
  const description = formData.get("description");
  const transactionDate = formData.get("date");

  const result = transactionSchema.safeParse({
    amount,
    transactionType,
    categoryId,
    description,
    transactionDate,
  });

  if (!result.success) {
    return {
      success: false,
      message: result.error.issues[0].message,
    };
  }
  try {
    await addTransactionService(result.data);
    return {
      success: true,
      message: "Transaction added successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while adding the transaction.",
    };
  }
}

export async function getTransactions(
  userId: string,
  transactionType?: "income" | "expense",
  page: number = 1,
  pageSize: number = 6,
) {
  try {
    const { transactions, totalCount } = await getTransactionsService(
      userId,
      transactionType,
      page,
      pageSize,
    );

    return {
      success: true,
      transactions,
      totalCount,
    };
  } catch (error) {
    console.error("GET TRANSACTIONS ERROR:", error);

    return {
      success: false,
      message: "An error occurred while fetching transactions.",
    };
  }
}

export async function deleteTransaction(transactionId: string) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        message: "Unauthorized.",
      };
    }
    await deleteTransactionService(transactionId, user.id);

    return {
      success: true,
      message: "Transaction deleted successfully.",
    };
  } catch (error) {
    console.error("DELETE TRANSACTION ERROR:", error);

    return {
      success: false,
      message: "An error occurred while deleting the transaction.",
    };
  }
}

export async function getTransactionSummary(userId: string) {
  try {
    const summary = await getTransactionSummaryService(userId);

    return {
      success: true,
      summary,
    };
  } catch (error) {
    console.error("GET TRANSACTION SUMMARY ERROR:", error);

    return {
      success: false,
      message: "An error occurred while fetching the transaction summary.",
    };
  }
}

export async function getMonthlyTransactionSummary(
  userId: string,
  year: number,
  month: number,
) {
  try {
    const summary = await getMonthlyTransactionSummaryService(
      userId,
      year,
      month,
    );

    return {
      success: true,
      summary,
    };
  } catch (error) {
    console.error("GET MONTHLY TRANSACTION SUMMARY ERROR:", error);

    return {
      success: false,
      message:
        "An error occurred while fetching the monthly transaction summary.",
    };
  }
}
