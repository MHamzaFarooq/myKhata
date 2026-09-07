"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type IncomeExpenseChartProps = {
  data: { day: number; income: number; expense: number }[];
};

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
    <div className="rounded-2xl bg-[#0b1620] px-4 py-3 shadow-lg shadow-black/40 border border-white/5">
      <p className="text-xs text-white/40 mb-1">Day {label}</p>
      {payload.map((entry) => (
        <p
          key={entry.name}
          className="text-sm font-medium"
          style={{ color: entry.color }}
        >
          {entry.name === "income" ? "Income" : "Expense"}: PKR{" "}
          {entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

export default function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
  return (
    <div className="h-75 w-full rounded-3xl bg-[#101d27] p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
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
            tick={{ fill: "#ffffff66", fontSize: 12 }}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#ffffff66", fontSize: 12 }}
          />

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
            dot={{ fill: "#96FF04", r: 0, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />

          <Line
            type="monotone"
            dataKey="expense"
            name="expense"
            stroke="#FF6063"
            strokeWidth={2}
            dot={{ fill: "#FF6063", r: 0, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
