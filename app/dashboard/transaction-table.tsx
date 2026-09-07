"use client";

import { useRouter } from "next/navigation";
import { deleteTransaction } from "./actions";
import { useState } from "react";
import Pagination from "./pagination";

type Transaction = {
  id: string;
  amount: number;
  transaction_type: "income" | "expense";
  category_id: string | null;
  category_name: string | null;
  description: string | null;
  transaction_date: string;
  created_at: string;
};

type TransactionTableProps = {
  transactions: Transaction[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
};

export default function TransactionTable({
  transactions,
  totalCount,
  currentPage,
  pageSize,
}: TransactionTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(transactionId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?",
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(transactionId);
    const result = await deleteTransaction(transactionId);

    setDeletingId(null);

    if (!result.success) {
      alert(result.message);
      return;
    }

    router.refresh();
  }

  if (transactions.length === 0) {
    return <p className="text-[#0b1620]/40 text-sm">No transactions found.</p>;
  }

  const totalPages = Math.ceil(totalCount / pageSize);
  const showPagination = totalPages > 1;

  return (
    <div className="flex flex-col min-h-122">
      <div className="flex-1 divide-y divide-[#0b1620]/10">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="group flex items-center justify-between py-3"
          >
            <div>
              <p className="text-[#0b1620] font-medium">
                {transaction.description ?? "No description"}
              </p>
              <p className="text-sm text-[#0b1620]/40">
                {transaction.category_name && (
                  <>
                    {transaction.category_name}
                    <span className="mx-1.5">&bull;</span>
                  </>
                )}
                {new Date(transaction.transaction_date)
                  .toISOString()
                  .split("T")[0]
                  .split("-")
                  .reverse()
                  .join("/")}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <p
                className={`font-medium ${
                  transaction.transaction_type === "expense"
                    ? "text-[#0b1620]"
                    : "text-[#0b1620]/60"
                }`}
              >
                {transaction.transaction_type === "expense" ? "- " : ""}
                PKR {transaction.amount.toLocaleString()}
              </p>

              <button
                disabled={deletingId === transaction.id}
                onClick={() => handleDelete(transaction.id)}
                className="opacity-0 group-hover:opacity-100 text-sm text-red-500 hover:text-red-600 transition-opacity disabled:opacity-50"
              >
                {deletingId === transaction.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showPagination && (
        <div className="mt-auto">
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
      )}
    </div>
  );
}
