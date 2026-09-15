import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getTransactions, getTransactionSummary } from "./actions";
import TransactionForm from "./transaction-form";
import { getCategoriesByUserId } from "@/lib/repositories/categoryRepository";
import TransactionTable from "./transaction-table";
import SummaryCards from "./summary-cards";
import TransactionFilters from "./transaction-filter";
import Navbar from "./navbar";
import AppToaster from "./app-toaster";
import ChatWidget from "./chat-widget";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{
    type?: string;
    page?: string;
    month?: string;
  }>;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const params = await searchParams;
  const page = Number(params.page) || 1;
  const pageSize = 6;

  const transactionType =
    params.type === "income" || params.type === "expense"
      ? params.type
      : undefined;

  const monthFilter =
    params.month && /^\d{4}-\d{2}$/.test(params.month)
      ? params.month
      : undefined;

  const categories = await getCategoriesByUserId(user.id);
  const result = await getTransactions(
    user.id,
    transactionType,
    page,
    pageSize,
    monthFilter,
  );
  const summaryResult = await getTransactionSummary(user.id);

  return (
    <>
      <AppToaster />
      <ChatWidget />
      <main
        className="min-h-screen"
        style={{
          backgroundColor: "#141617",
          backgroundImage:
            "radial-gradient(1000px circle at 10% -10%, rgba(140, 255, 0, 0.14), transparent 55%), " +
            "radial-gradient(900px circle at 95% 5%, rgba(150, 255, 4, 0.10), transparent 55%)",
        }}
      >
        <div className="flex flex-col gap-10 max-w-280 mx-auto px-4 py-8 sm:px-6 sm:py-10 lg:px-8 pb-16">
          <div className="flex flex-col gap-10">
            <Navbar
              username={user.username}
              monthlyReportEnabled={user.monthly_report_enabled}
            />
            <div>
              <h1 className="text-[26px] sm:text-[38px] font-light">
                Welcome back, {user.username}! 👋
              </h1>
              <p className="mt-1 text-sm text-white/40">
                Here&apos;s an overview of your finances.
              </p>
            </div>
          </div>
          <div>
            {summaryResult.success && summaryResult.summary && (
              <SummaryCards
                totalIncome={summaryResult.summary.totalIncome}
                totalExpense={summaryResult.summary.totalExpense}
                balance={summaryResult.summary.balance}
              />
            )}
          </div>
          <div className="mx-auto w-full max-w-6xl rounded-[28px] sm:rounded-[40px] bg-[#18252E] p-5 sm:p-8 shadow-2xl shadow-black/30">
            <div className="flex flex-col md:flex-row gap-8">
              <TransactionForm categories={categories} />

              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl text-white mb-4">
                  Transactions
                </h1>

                <div className="mb-6">
                  <TransactionFilters
                    currentType={transactionType}
                    currentMonth={monthFilter}
                  />
                </div>

                <TransactionTable
                  transactions={result.transactions ?? []}
                  totalCount={result.totalCount ?? 0}
                  currentPage={page}
                  pageSize={pageSize}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
