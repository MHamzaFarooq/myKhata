import { Resend } from "resend";
import { renderToBuffer } from "@react-pdf/renderer";
import {
  getAllTransactionsForMonth,
  getCategoryBreakdownForMonth,
} from "../repositories/transactionRepository";
import {
  getUsersWithMonthlyReportEnabled,
  updateMonthlyReportEnabledById,
} from "../repositories/userRepository";
import { getCurrentUser } from "../session";
import MonthlyReportPdf from "../pdf/monthly-report-pdf";
import MonthlyReportEmail from "../../emails/monthly-report";

// Constructed lazily, not at module load - Next.js executes this module
// during build-time page data collection, before Vercel env vars are
// necessarily available, and the Resend SDK throws immediately if the key
// is missing at construction time.
let resend: Resend | null = null;

function getResendClient() {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

type ReportUser = { id: string; username: string; email: string };

function monthLabelFor(year: number, month: number) {
  return new Date(year, month - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

async function buildReportPayload(userId: string, year: number, month: number) {
  const [transactions, categoryBreakdown] = await Promise.all([
    getAllTransactionsForMonth(userId, year, month),
    getCategoryBreakdownForMonth(userId, year, month),
  ]);

  const totalIncome = transactions
    .filter((tx) => tx.transaction_type === "income")
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const totalExpense = transactions
    .filter((tx) => tx.transaction_type === "expense")
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  return {
    transactions: transactions.map((tx) => ({
      ...tx,
      amount: Number(tx.amount),
    })),
    categoryBreakdown: categoryBreakdown.map((row) => ({
      ...row,
      total: Number(row.total),
    })),
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
  };
}

export async function sendMonthlyReportEmail(
  user: ReportUser,
  year: number,
  month: number,
) {
  const monthLabel = monthLabelFor(year, month);
  const payload = await buildReportPayload(user.id, year, month);

  const generatedOn = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const pdfBuffer = await renderToBuffer(
    MonthlyReportPdf({
      username: user.username,
      monthLabel,
      generatedOn,
      ...payload,
    }),
  );

  const { error } = await getResendClient().emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "MyKhata Reports <onboarding@resend.dev>",
    to: user.email,
    replyTo: process.env.RESEND_REPLY_TO_EMAIL,
    subject: `Your ${monthLabel} MyKhata report`,
    react: MonthlyReportEmail({
      username: user.username,
      monthLabel,
      totalIncome: payload.totalIncome,
      totalExpense: payload.totalExpense,
      balance: payload.balance,
    }),
    attachments: [
      {
        filename: `MyKhata-${monthLabel.replace(" ", "-")}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function updateMonthlyReportPreferenceService(enabled: boolean) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const updated = await updateMonthlyReportEnabledById(user.id, enabled);
  if (!updated) {
    throw new Error("User not found");
  }

  return updated;
}

export async function sendTestMonthlyReportService() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const now = new Date();
  await sendMonthlyReportEmail(
    { id: user.id, username: user.username, email: user.email },
    now.getFullYear(),
    now.getMonth() + 1,
  );
}

export async function sendMonthlyReportsToAllOptedInUsers(
  year: number,
  month: number,
) {
  const users = await getUsersWithMonthlyReportEnabled();

  const results = await Promise.allSettled(
    users.map((user) => sendMonthlyReportEmail(user, year, month)),
  );

  const failures = results
    .map((result, i) =>
      result.status === "rejected"
        ? { userId: users[i].id, error: result.reason }
        : null,
    )
    .filter((entry): entry is { userId: string; error: unknown } => entry !== null);

  failures.forEach(({ userId, error }) =>
    console.error(`MONTHLY REPORT FAILED for user ${userId}:`, error),
  );

  return {
    total: users.length,
    sent: users.length - failures.length,
    failed: failures.length,
  };
}
