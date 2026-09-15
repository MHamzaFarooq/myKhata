import {
  getDailyActivityService,
  getMonthlyTransactionSummaryService,
} from "@/lib/services/transactionsService";
import IncomeExpenseChart from "./income-expense-chart";
import ActivityHeatmap from "./activity-heatmap";
import { getCurrentUser } from "@/lib/session";

type SummaryCardsProps = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
};

function StatItem({
  label,
  value,
  valueColor,
  iconBg,
  iconColor,
  icon,
}: {
  label: string;
  value: number;
  valueColor: string;
  iconBg: string;
  iconColor: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${iconBg} ${iconColor}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <h3 className="text-[13px] text-white/50">{label}</h3>
        <p className={`truncate text-[24px] font-medium sm:text-[28px] ${valueColor}`}>
          <span className="mr-1 text-[13px] font-normal text-white/40">
            PKR
          </span>
          {value.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default async function SummaryCards({
  totalIncome,
  totalExpense,
  balance,
}: SummaryCardsProps) {
  const balanceColor = balance >= 0 ? "text-white" : "text-[#FF6063]";
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not found");
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const chartData = await getMonthlyTransactionSummaryService(
    user.id,
    year,
    month,
  );

  const activityData = await getDailyActivityService(user.id, year, month);

  return (
    <section>
      <div className="flex flex-col gap-8 rounded-[36px] bg-[#18252E] p-6 md:p-8">
        <div className="grid grid-cols-1 gap-6 divide-y divide-white/5 sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
          <div className="sm:pr-6">
            <StatItem
              label="Income"
              value={totalIncome}
              valueColor="text-white"
              iconBg="bg-[#96FF04]/10"
              iconColor="text-[#96FF04]"
              icon={
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 7L7 17" />
                  <path d="M16 17H7V8" />
                </svg>
              }
            />
          </div>

          <div className="pt-6 sm:pt-0 sm:px-6">
            <StatItem
              label="Expense"
              value={totalExpense}
              valueColor="text-white"
              iconBg="bg-[#FF6063]/10"
              iconColor="text-[#FF6063]"
              icon={
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17L17 7" />
                  <path d="M8 7h9v9" />
                </svg>
              }
            />
          </div>

          <div className="pt-6 sm:pt-0 sm:pl-6">
            <StatItem
              label="Remaining Balance"
              value={balance}
              valueColor={balanceColor}
              iconBg="bg-white/10"
              iconColor="text-white"
              icon={
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5" />
                  <path d="M21 12a1.5 1.5 0 0 1-1.5 1.5H17a1.5 1.5 0 0 1 0-3h2.5A1.5 1.5 0 0 1 21 12z" />
                </svg>
              }
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="min-w-0 flex-1">
            <IncomeExpenseChart data={chartData ?? []} />
          </div>
          <ActivityHeatmap data={activityData ?? []} />
        </div>
      </div>
    </section>
  );
}
