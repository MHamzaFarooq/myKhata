"use client";

import { useRouter, useSearchParams } from "next/navigation";

type TransactionFiltersProps = {
  currentType?: "income" | "expense";
  currentMonth?: string;
};

export default function TransactionFilters({
  currentType,
  currentMonth,
}: TransactionFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParams(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    params.delete("page");
    router.push(`/dashboard?${params.toString()}`, { scroll: false });
  }

  function handleFilter(type?: "income" | "expense") {
    updateParams((params) => {
      if (type) {
        params.set("type", type);
      } else {
        params.delete("type");
      }
    });
  }

  function handleMonthChange(month: string) {
    updateParams((params) => {
      if (month) {
        params.set("month", month);
      } else {
        params.delete("month");
      }
    });
  }

  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - i);

    return {
      value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
      label: date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
    };
  });

  const currentMonthLabel = monthOptions[0]?.label ?? "";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => handleFilter()}
          className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
            !currentType
              ? "bg-[#8CFF00] text-[#0b1620]"
              : "bg-[#20313D] text-white hover:bg-[#2a3d4a]"
          }`}
        >
          All
        </button>

        <button
          type="button"
          onClick={() => handleFilter("income")}
          className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
            currentType === "income"
              ? "bg-[#8CFF00] text-[#0b1620]"
              : "bg-[#20313D] text-white hover:bg-[#2a3d4a]"
          }`}
        >
          Income
        </button>

        <button
          type="button"
          onClick={() => handleFilter("expense")}
          className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
            currentType === "expense"
              ? "bg-[#8CFF00] text-[#0b1620]"
              : "bg-[#20313D] text-white hover:bg-[#2a3d4a]"
          }`}
        >
          Expense
        </button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <select
            aria-label="Filter by month"
            value={currentMonth ?? ""}
            onChange={(event) => handleMonthChange(event.target.value)}
            className="shrink-0 appearance-none rounded-full bg-[#0b1620] py-2.5 pl-4 pr-10 text-sm text-white outline-none focus:ring-2 focus:ring-white/20 [&:has(option[value='']:checked)]:text-white/40"
          >
            <option value="" disabled>
              {currentMonthLabel}
            </option>
            {monthOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="text-white bg-[#0b1620]"
              >
                {option.label}
              </option>
            ))}
          </select>

          <svg
            className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50"
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

        {currentMonth && (
          <button
            type="button"
            aria-label="Clear month filter"
            onClick={() => handleMonthChange("")}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/60 transition-colors hover:bg-white/20 hover:text-white"
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
              <path d="M18 6 6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
