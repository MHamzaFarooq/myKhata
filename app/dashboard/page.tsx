import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getTransactions, getTransactionSummary } from "./actions";
import TransactionForm from "./transaction-form";
import { getCategoriesByUserId } from "@/lib/repositories/categoryRepository";
import TransactionTable from "./transaction-table";
import SummaryCards from "./summary-cards";
import TransactionFilters from "./transaction-filter";
import Navbar from "./navbar";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{
    type?: string;
    page?: string;
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

  const categories = await getCategoriesByUserId(user.id);
  const result = await getTransactions(
    user.id,
    transactionType,
    page,
    pageSize,
  );
  const summaryResult = await getTransactionSummary(user.id);

  return (
    <main className="bg-[#141617]">
      <div className="flex flex-col gap-12 max-w-280 mx-auto py-8">
        <div className="flex flex-col gap-12">
          <Navbar />
          <h1 className="text-[38px] font-light">
            Welcome back, {user.username}! 👋
          </h1>
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
        <div className="min-h-screen">
          <div className="mx-auto max-w-6xl rounded-[40px] bg-white p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <TransactionForm categories={categories} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-3xl text-[#0b1620]">Transactions</h1>
                  <TransactionFilters currentType={transactionType} />
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
      </div>
    </main>
  );
}
