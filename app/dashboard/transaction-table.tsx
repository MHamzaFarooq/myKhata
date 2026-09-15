"use client";

import { useRouter } from "next/navigation";
import { deleteTransaction } from "./actions";
import { useEffect, useState } from "react";
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

function TransactionIcon({ type }: { type: "income" | "expense" }) {
  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
        type === "income"
          ? "bg-emerald-400/15 text-emerald-400"
          : "bg-rose-400/15 text-rose-400"
      }`}
    >
      <svg
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {type === "income" ? (
          <>
            <path d="M17 7L7 17" />
            <path d="M16 17H7V8" />
          </>
        ) : (
          <>
            <path d="M7 17L17 7" />
            <path d="M8 7h9v9" />
          </>
        )}
      </svg>
    </div>
  );
}

export default function TransactionTable({
  transactions,
  totalCount,
  currentPage,
  pageSize,
}: TransactionTableProps) {
  const router = useRouter();
  const [pendingDelete, setPendingDelete] = useState<Transaction | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pendingDelete) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") closeModal();
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [pendingDelete]);

  function closeModal() {
    setPendingDelete(null);
    setError(null);
  }

  async function confirmDelete() {
    if (!pendingDelete) return;

    setIsDeleting(true);
    setError(null);

    const result = await deleteTransaction(pendingDelete.id);

    setIsDeleting(false);

    if (!result.success) {
      setError(result.message ?? "Something went wrong. Please try again.");
      return;
    }

    setPendingDelete(null);
    router.refresh();
  }

  if (transactions.length === 0) {
    return (
      <div className="flex min-h-96 flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-white/15 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-white/30">
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 14l2 2 4-4" />
            <rect x="3" y="4" width="18" height="16" rx="3" />
          </svg>
        </div>
        <p className="text-sm text-white/40">
          No transactions yet. Add your first one to get started.
        </p>
      </div>
    );
  }

  const totalPages = Math.ceil(totalCount / pageSize);
  const showPagination = totalPages > 1;

  return (
    <div className="flex flex-col min-h-122">
      <div className="flex-1 divide-y divide-white/10">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="group flex items-center justify-between gap-4 py-3.5"
          >
            <div className="flex min-w-0 items-center gap-3">
              <TransactionIcon type={transaction.transaction_type} />

              <div className="min-w-0">
                <p className="truncate text-white font-medium">
                  {transaction.description ?? "No description"}
                </p>
                <p className="truncate text-sm text-white/40">
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
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <p
                className={`font-medium ${
                  transaction.transaction_type === "income"
                    ? "text-emerald-400"
                    : "text-white"
                }`}
              >
                {transaction.transaction_type === "expense" ? "- " : "+ "}
                PKR {transaction.amount.toLocaleString()}
              </p>

              <button
                aria-label="Delete transaction"
                onClick={() => setPendingDelete(transaction)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/30 opacity-0 transition-colors hover:bg-rose-500/15 hover:text-rose-400 group-hover:opacity-100"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18" />
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {showPagination && (
        <div className="mt-auto pt-4">
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
      )}

      {pendingDelete && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 px-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <div className="w-full max-w-sm rounded-3xl bg-[#101d27] p-6 shadow-2xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-400/15 text-rose-400">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18" />
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
              </svg>
            </div>

            <h2 className="mt-4 text-lg font-medium text-white">
              Delete transaction?
            </h2>
            <p className="mt-1 text-sm text-white/40">
              This will permanently delete{" "}
              <span className="text-white/70">
                &ldquo;{pendingDelete.description ?? "this transaction"}
                &rdquo;
              </span>
              . This action cannot be undone.
            </p>

            {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={closeModal}
                disabled={isDeleting}
                className="flex-1 rounded-full bg-white/5 py-3 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 rounded-full bg-rose-500 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
