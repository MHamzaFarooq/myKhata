import { getTransactions } from "./actions";
import TransactionFilters from "./transaction-filter";
import TransactionTable from "./transaction-table";

export default async function TransactionsSection({
  userId,
  transactionType,
  page,
  pageSize,
  monthFilter,
}: {
  userId: string;
  transactionType?: "income" | "expense";
  page: number;
  pageSize: number;
  monthFilter?: string;
}) {
  const result = await getTransactions(
    userId,
    transactionType,
    page,
    pageSize,
    monthFilter,
  );

  return (
    <>
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
    </>
  );
}
