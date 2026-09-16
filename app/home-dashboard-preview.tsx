"use client";

import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type DummyTransaction = {
  id: number;
  date: string;
  description: string;
  category: string;
  type: "income" | "expense";
  amount: number;
};

const TRANSACTIONS: DummyTransaction[] = [
  { id: 1, date: "Sep 14", description: "Salary", category: "Income", type: "income", amount: 85000 },
  { id: 2, date: "Sep 12", description: "Grocery Store", category: "Groceries", type: "expense", amount: 4200 },
  { id: 3, date: "Sep 10", description: "Netflix", category: "Entertainment", type: "expense", amount: 1500 },
  { id: 4, date: "Sep 08", description: "Uber Rides", category: "Transportation", type: "expense", amount: 1850 },
  { id: 5, date: "Sep 05", description: "Freelance Project", category: "Income", type: "income", amount: 22000 },
  { id: 6, date: "Sep 03", description: "Electricity Bill", category: "Bills & Utilities", type: "expense", amount: 3200 },
  { id: 7, date: "Sep 01", description: "Coffee Shop", category: "Food & Dining", type: "expense", amount: 650 },
];

const CHART_DATA = [
  { day: 1, income: 0, expense: 650 },
  { day: 3, income: 0, expense: 3850 },
  { day: 5, income: 22000, expense: 3850 },
  { day: 8, income: 22000, expense: 5700 },
  { day: 10, income: 22000, expense: 7200 },
  { day: 12, income: 22000, expense: 11400 },
  { day: 14, income: 107000, expense: 11400 },
];

const TOTAL_INCOME = TRANSACTIONS.filter((t) => t.type === "income").reduce(
  (sum, t) => sum + t.amount,
  0,
);
const TOTAL_EXPENSE = TRANSACTIONS.filter((t) => t.type === "expense").reduce(
  (sum, t) => sum + t.amount,
  0,
);
const BALANCE = TOTAL_INCOME - TOTAL_EXPENSE;

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string | number;
}) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-xl bg-[#0b1620] px-3 py-2 shadow-lg shadow-black/40 border border-white/5">
      <p className="text-[10px] text-white/40 mb-0.5">Day {label}</p>
      {payload.map((entry) => (
        <p
          key={entry.name}
          className="text-xs font-medium"
          style={{ color: entry.color }}
        >
          {entry.name === "income" ? "Income" : "Expense"}: PKR{" "}
          {entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

const FILTERS = ["all", "income", "expense"] as const;
const FILTER_LABELS: Record<(typeof FILTERS)[number], string> = {
  all: "All",
  income: "Income",
  expense: "Expense",
};

export default function HomeDashboardPreview() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const activeIndex = FILTERS.indexOf(filter);

  return (
    <div className="w-full rounded-[28px] sm:rounded-[36px] bg-[#18252E] p-4 sm:p-7 shadow-2xl shadow-black/40 ring-1 ring-white/5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[13px] text-white/40">Overview</p>
          <p className="text-lg font-medium text-white">September 2026</p>
        </div>
        <span className="rounded-full bg-[#8CFF00]/10 px-3 py-1.5 text-xs font-medium text-[#96FF04]">
          Live preview
        </span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 sm:gap-4 rounded-2xl bg-[#101d27] p-4 sm:p-5">
        <div>
          <p className="text-[11px] sm:text-[13px] text-white/50">Income</p>
          <p className="mt-1 truncate text-base sm:text-xl font-medium text-[#96FF04]">
            <span className="mr-1 text-[10px] sm:text-[11px] font-normal text-white/30">
              PKR
            </span>
            {TOTAL_INCOME.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-[11px] sm:text-[13px] text-white/50">Expense</p>
          <p className="mt-1 truncate text-base sm:text-xl font-medium text-[#FF6063]">
            <span className="mr-1 text-[10px] sm:text-[11px] font-normal text-white/30">
              PKR
            </span>
            {TOTAL_EXPENSE.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-[11px] sm:text-[13px] text-white/50">Balance</p>
          <p className="mt-1 truncate text-base sm:text-xl font-medium text-white">
            <span className="mr-1 text-[10px] sm:text-[11px] font-normal text-white/30">
              PKR
            </span>
            {BALANCE.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-4 h-36 sm:h-44 w-full rounded-2xl bg-[#101d27] p-3 sm:p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={CHART_DATA}
            margin={{ top: 6, right: 6, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#ffffff1a"
            />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#ffffff66", fontSize: 10 }}
            />
            <YAxis hide />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#ffffff1a" }}
            />
            <Line
              type="monotone"
              dataKey="income"
              name="income"
              stroke="#96FF04"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="expense"
              name="expense"
              stroke="#FF6063"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="relative mt-5 flex rounded-full bg-white/5 p-1">
        <div
          className="absolute inset-y-1 w-1/3 rounded-full bg-[#8CFF00] transition-transform duration-300 ease-out"
          style={{ transform: `translateX(${activeIndex * 100}%)` }}
        />
        {FILTERS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setFilter(option)}
            className={`relative z-10 flex-1 rounded-full py-2 text-xs font-medium transition-colors duration-200 ${
              filter === option ? "text-[#0b1620]" : "text-white/60"
            }`}
          >
            {FILTER_LABELS[option]}
          </button>
        ))}
      </div>

      <div className="mt-3">
        {TRANSACTIONS.map((t) => {
          const visible = filter === "all" || t.type === filter;
          return (
            <div
              key={t.id}
              className={`grid overflow-hidden transition-all duration-300 ease-out ${
                visible
                  ? "mb-2 grid-rows-[1fr] opacity-100"
                  : "mb-0 grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="min-h-0">
                <div className="flex items-center justify-between gap-3 rounded-xl bg-[#101d27] px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-white">
                      {t.description}
                    </p>
                    <p className="text-xs text-white/40">
                      {t.category} · {t.date}
                    </p>
                  </div>
                  <p
                    className={`shrink-0 text-sm font-medium ${
                      t.type === "income" ? "text-[#96FF04]" : "text-[#FF6063]"
                    }`}
                  >
                    {t.type === "income" ? "+" : "-"}
                    {t.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
