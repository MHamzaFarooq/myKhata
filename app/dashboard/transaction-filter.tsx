"use client";

import { useRouter, useSearchParams } from "next/navigation";

type TransactionFiltersProps = {
  currentType?: "income" | "expense";
};

export default function TransactionFilters({
  currentType,
}: TransactionFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleFilter(type?: "income" | "expense") {
    const params = new URLSearchParams(searchParams.toString());

    if (type) {
      params.set("type", type);
    } else {
      params.delete("type");
    }

    router.push(`/dashboard?${params.toString()}`);
  }

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => handleFilter()}
        className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
          !currentType
            ? "bg-[#8CFF00] text-[#20313D]"
            : "bg-[#20313D] text-white hover:bg-[#20313D]"
        }`}
      >
        All
      </button>

      <button
        type="button"
        onClick={() => handleFilter("income")}
        className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
          currentType === "income"
            ? "bg-[#8CFF00] text-[#20313D]"
            : "bg-[#20313D] text-white hover:bg-[#20313D]"
        }`}
      >
        Income
      </button>

      <button
        type="button"
        onClick={() => handleFilter("expense")}
        className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
          currentType === "expense"
            ? "bg-[#8CFF00] text-[#20313D]"
            : "bg-[#20313D] text-white hover:bg-[#20313D]"
        }`}
      >
        Expense
      </button>
    </div>
  );
}
