import { getMonthlyTransactionSummaryService } from "@/lib/services/transactionsService";
import IncomeExpenseChart from "./income-expense-chart";
import { getCurrentUser } from "@/lib/session";

type SummaryCardsProps = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
};

export default async function SummaryCards({
  totalIncome,
  totalExpense,
  balance,
}: SummaryCardsProps) {
  const balanceColor = balance >= 0 ? "" : "text-[#FF6063]";
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
  return (
    <section>
      <div className="flex flex-col bg-[#18252E] rounded-[36px] p-6 gap-6 justify-between">
        <div className="flex justify-between">
          <div>
            <h3 className="text-[14px]">Income</h3>
            <p className="text-[28px]">
              <span className="text-[14px]">PKR</span> {totalIncome}
            </p>
          </div>

          <div>
            <h3 className="text-[14px]">Expense</h3>
            <p className="text-[28px]">
              <span className="text-[14px]">PKR</span> {totalExpense}
            </p>
          </div>

          <div>
            <h3 className="text-[14px]">Remaining Balance</h3>
            <p className={`text-[28px] ${balanceColor}`}>
              <span className="text-[14px]">PKR</span> {balance}
            </p>
          </div>
        </div>

        <IncomeExpenseChart data={chartData} />
      </div>
    </section>
  );
}
