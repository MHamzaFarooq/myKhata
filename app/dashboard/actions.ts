"use server";
import { redirect } from "next/navigation";
import { deleteSession, getCurrentUser } from "@/lib/session";
import { transactionSchema } from "@/lib/validations/transactionSchema";
import { updateUsernameSchema } from "@/lib/validations/userSchema";
import {
  addTransaction as addTransactionService,
  deleteTransactionService,
  getMonthlyTransactionSummaryService,
  getTransactionsService,
  getTransactionSummaryService,
} from "@/lib/services/transactionsService";
import { updateUsernameService } from "@/lib/services/userService";
import {
  sendTestMonthlyReportService,
  updateMonthlyReportPreferenceService,
} from "@/lib/services/reportService";

export async function logoutUser() {
  await deleteSession();

  redirect("/login");
}

export async function updateUsername(
  previousData: unknown,
  formData: FormData,
) {
  const result = updateUsernameSchema.safeParse({
    username: formData.get("username"),
  });

  if (!result.success) {
    return {
      success: false,
      message: result.error.issues[0].message,
    };
  }

  try {
    const updated = await updateUsernameService(result.data.username);
    return {
      success: true,
      message: "Username updated successfully.",
      username: updated.username,
    };
  } catch (error) {
    console.error("UPDATE USERNAME ERROR:", error);
    return {
      success: false,
      message: "An error occurred while updating your username.",
    };
  }
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
  month?: string,
) {
  try {
    const { transactions, totalCount } = await getTransactionsService(
      userId,
      transactionType,
      page,
      pageSize,
      month,
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

export async function updateMonthlyReportPreference(enabled: boolean) {
  try {
    const updated = await updateMonthlyReportPreferenceService(enabled);
    return {
      success: true,
      monthlyReportEnabled: updated.monthly_report_enabled as boolean,
      message: enabled
        ? "Monthly reports turned on."
        : "Monthly reports turned off.",
    };
  } catch (error) {
    console.error("UPDATE MONTHLY REPORT PREFERENCE ERROR:", error);
    return {
      success: false,
      message: "An error occurred while updating your preference.",
    };
  }
}

export async function sendTestMonthlyReport() {
  try {
    await sendTestMonthlyReportService();
    return {
      success: true,
      message: "Test report sent - check your inbox.",
    };
  } catch (error) {
    console.error("SEND TEST MONTHLY REPORT ERROR:", error);
    return {
      success: false,
      message: "Something went wrong while sending the test report.",
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
