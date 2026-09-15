"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addTransaction } from "./actions";

export default function TransactionForm({
  categories,
}: {
  categories: { id: string; name: string }[];
}) {
  const [state, formAction, isPending] = useActionState(addTransaction, null);
  const [type, setType] = useState<"expense" | "income">("expense");
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      setType("expense");
      router.refresh();
    }
  }, [state, router]);

  useEffect(() => {
    if (state?.message) {
      if (state.success) {
        toast.success(state.message);
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="w-full max-w-md rounded-3xl bg-[#101d27] p-4 sm:p-6 space-y-6 shadow-xl shadow-black/10"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#8CFF00]/10 text-[#8CFF00]">
          <svg
            className="h-4.5 w-4.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
        </div>
        <h2 className="text-[24px] sm:text-[28px] text-white">
          Add Transaction
        </h2>
      </div>

      {/* Transaction Type */}
      <div className="space-y-2">
        <label className="block text-sm text-white/80">Transaction Type</label>

        {/* hidden input carries the actual form value */}
        <input type="hidden" name="transactionType" value={type} />

        <div className="relative flex rounded-full bg-[#0b1620] p-1">
          <div
            className="absolute inset-y-1 w-1/2 rounded-full bg-white transition-transform duration-200 ease-out"
            style={{
              transform:
                type === "income" ? "translateX(100%)" : "translateX(0%)",
            }}
          />
          <button
            type="button"
            onClick={() => setType("expense")}
            className={`relative z-10 flex-1 rounded-full py-3 text-sm font-medium transition-colors ${
              type === "expense" ? "text-[#0b1620]" : "text-white/70"
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setType("income")}
            className={`relative z-10 flex-1 rounded-full py-3 text-sm font-medium transition-colors ${
              type === "income" ? "text-[#0b1620]" : "text-white/70"
            }`}
          >
            Income
          </button>
        </div>
      </div>

      {/* Amount */}
      <div className="space-y-2">
        <label htmlFor="amount" className="block text-sm text-white/80">
          Amount
        </label>
        <input
          id="amount"
          name="amount"
          type="number"
          min="1"
          step="0.01"
          placeholder="e.g 5000"
          required
          className="w-full rounded-full bg-[#0b1620] px-5 py-3.5 text-white placeholder:text-white/30 outline-none ring-0 focus:ring-2 focus:ring-white/20"
        />
      </div>

      {/* Description + Category */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm text-white/80">
            Description
          </label>
          <input
            id="description"
            name="description"
            type="text"
            placeholder="e.g Salary"
            className="w-full rounded-full bg-[#0b1620] px-5 py-3.5 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/20"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="category" className="block text-sm text-white/80">
            Category
          </label>
          <div className="relative">
            <select
              id="category"
              name="category"
              defaultValue=""
              required={type !== "income"}
              disabled={type === "income"}
              className="w-full appearance-none rounded-full bg-[#0b1620] px-5 py-3.5 pr-11 text-white outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-40 disabled:cursor-not-allowed [&:has(option[value='']:checked)]:text-white/30"
            >
              <option value="" disabled>
                e.g Dining
              </option>
              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                  className="text-white bg-[#0b1620]"
                >
                  {category.name}
                </option>
              ))}
            </select>

            <svg
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Date */}
      <div className="space-y-2">
        <label htmlFor="date" className="block text-sm text-white/80">
          Date
        </label>
        <input
          id="date"
          name="date"
          defaultValue={new Date().toISOString().split("T")[0]}
          type="date"
          required
          className="w-full rounded-full bg-[#0b1620] px-5 py-3.5 text-white outline-none focus:ring-2 focus:ring-white/20 [color-scheme:dark]"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-[#8CFF00] py-4 text-base font-semibold text-[#0b1620] transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isPending ? "Adding..." : "Add"}
      </button>
    </form>
  );
}
