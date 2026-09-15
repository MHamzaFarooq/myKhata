import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";

export type ReportTransaction = {
  id: string;
  amount: number;
  transaction_type: "income" | "expense";
  description: string | null;
  transaction_date: string;
  category_name: string | null;
};

export type ReportCategoryBreakdown = {
  category_name: string;
  transaction_type: "income" | "expense";
  total: number;
  count: number;
};

export type MonthlyReportData = {
  username: string;
  monthLabel: string;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactions: ReportTransaction[];
  categoryBreakdown: ReportCategoryBreakdown[];
  generatedOn: string;
};

const BRAND_GREEN = "#5B9B00";
const BRAND_RED = "#D1454A";
const BRAND_DARK = "#101d27";
const BORDER = "#E4E7EB";
const MUTED = "#6B7280";

const styles = StyleSheet.create({
  page: {
    paddingTop: 0,
    paddingBottom: 48,
    paddingHorizontal: 0,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#111827",
  },
  header: {
    backgroundColor: BRAND_DARK,
    paddingHorizontal: 36,
    paddingVertical: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoBadge: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: "#8CFF00",
    alignItems: "center",
    justifyContent: "center",
  },
  logoLetter: {
    fontFamily: "Helvetica-Bold",
    fontSize: 13,
    color: BRAND_DARK,
  },
  brandName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 15,
    color: "#ffffff",
  },
  headerRight: {
    alignItems: "flex-end",
  },
  headerLabel: {
    fontSize: 9,
    color: "rgba(255,255,255,0.5)",
    marginBottom: 2,
  },
  headerMonth: {
    fontFamily: "Helvetica-Bold",
    fontSize: 13,
    color: "#ffffff",
  },
  body: {
    paddingHorizontal: 36,
  },
  greeting: {
    fontSize: 15,
    marginTop: 24,
    marginBottom: 4,
    color: "#111827",
  },
  subGreeting: {
    fontSize: 10,
    color: MUTED,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  statLabel: {
    fontSize: 9,
    color: MUTED,
    marginBottom: 6,
  },
  statValue: {
    fontFamily: "Helvetica-Bold",
    fontSize: 15,
  },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    marginBottom: 10,
    color: "#111827",
  },
  section: {
    marginBottom: 26,
  },
  table: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 8,
    overflow: "hidden",
  },
  tableHeadRow: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  tableHeadCell: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8.5,
    color: MUTED,
    textTransform: "uppercase",
  },
  tableCell: {
    fontSize: 9.5,
    color: "#111827",
  },
  colDate: { width: "16%" },
  colDesc: { width: "34%" },
  colCategory: { width: "24%" },
  colType: { width: "12%" },
  colAmount: { width: "14%", textAlign: "right" },
  breakdownCategory: { width: "40%" },
  breakdownCount: { width: "20%", textAlign: "right" },
  breakdownTotal: { width: "20%", textAlign: "right" },
  breakdownShare: { width: "20%", textAlign: "right" },
  emptyState: {
    padding: 16,
    fontSize: 9.5,
    color: MUTED,
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 36,
    right: 36,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: MUTED,
  },
});

function formatAmount(value: number) {
  return `PKR ${value.toLocaleString()}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}

export default function MonthlyReportPdf({
  username,
  monthLabel,
  totalIncome,
  totalExpense,
  balance,
  transactions,
  categoryBreakdown,
  generatedOn,
}: MonthlyReportData) {
  const expenseBreakdown = categoryBreakdown.filter(
    (row) => row.transaction_type === "expense",
  );

  return (
    <Document
      title={`MyKhata - ${monthLabel} Report`}
      author="MyKhata"
    >
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.header} fixed>
          <View style={styles.brandRow}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoLetter}>M</Text>
            </View>
            <Text style={styles.brandName}>MyKhata</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerLabel}>Monthly Report</Text>
            <Text style={styles.headerMonth}>{monthLabel}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.greeting}>Hey {username},</Text>
          <Text style={styles.subGreeting}>
            Here&apos;s a complete breakdown of your finances for{" "}
            {monthLabel}.
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Income</Text>
              <Text style={[styles.statValue, { color: BRAND_GREEN }]}>
                {formatAmount(totalIncome)}
              </Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Expense</Text>
              <Text style={[styles.statValue, { color: BRAND_RED }]}>
                {formatAmount(totalExpense)}
              </Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Balance</Text>
              <Text
                style={[
                  styles.statValue,
                  { color: balance >= 0 ? "#111827" : BRAND_RED },
                ]}
              >
                {formatAmount(balance)}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Spending by category</Text>
            <View style={styles.table}>
              <View style={styles.tableHeadRow}>
                <Text style={[styles.tableHeadCell, styles.breakdownCategory]}>
                  Category
                </Text>
                <Text style={[styles.tableHeadCell, styles.breakdownCount]}>
                  Transactions
                </Text>
                <Text style={[styles.tableHeadCell, styles.breakdownTotal]}>
                  Total
                </Text>
                <Text style={[styles.tableHeadCell, styles.breakdownShare]}>
                  Share
                </Text>
              </View>

              {expenseBreakdown.length === 0 && (
                <Text style={styles.emptyState}>
                  No expenses recorded this month.
                </Text>
              )}

              {expenseBreakdown.map((row, i) => (
                <View key={i} style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.breakdownCategory]}>
                    {row.category_name}
                  </Text>
                  <Text style={[styles.tableCell, styles.breakdownCount]}>
                    {row.count}
                  </Text>
                  <Text style={[styles.tableCell, styles.breakdownTotal]}>
                    {formatAmount(row.total)}
                  </Text>
                  <Text style={[styles.tableCell, styles.breakdownShare]}>
                    {totalExpense > 0
                      ? `${Math.round((row.total / totalExpense) * 100)}%`
                      : "0%"}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              All transactions ({transactions.length})
            </Text>
            <View style={styles.table}>
              <View style={styles.tableHeadRow}>
                <Text style={[styles.tableHeadCell, styles.colDate]}>Date</Text>
                <Text style={[styles.tableHeadCell, styles.colDesc]}>
                  Description
                </Text>
                <Text style={[styles.tableHeadCell, styles.colCategory]}>
                  Category
                </Text>
                <Text style={[styles.tableHeadCell, styles.colType]}>Type</Text>
                <Text style={[styles.tableHeadCell, styles.colAmount]}>
                  Amount
                </Text>
              </View>

              {transactions.length === 0 && (
                <Text style={styles.emptyState}>
                  No transactions recorded this month.
                </Text>
              )}

              {transactions.map((tx) => (
                <View key={tx.id} style={styles.tableRow} wrap={false}>
                  <Text style={[styles.tableCell, styles.colDate]}>
                    {formatDate(tx.transaction_date)}
                  </Text>
                  <Text style={[styles.tableCell, styles.colDesc]}>
                    {tx.description || "-"}
                  </Text>
                  <Text style={[styles.tableCell, styles.colCategory]}>
                    {tx.category_name || "-"}
                  </Text>
                  <Text style={[styles.tableCell, styles.colType]}>
                    {tx.transaction_type === "income" ? "Income" : "Expense"}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.colAmount,
                      {
                        color:
                          tx.transaction_type === "income"
                            ? BRAND_GREEN
                            : BRAND_RED,
                      },
                    ]}
                  >
                    {tx.transaction_type === "income" ? "+" : "-"}
                    {tx.amount.toLocaleString()}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text>Generated by MyKhata on {generatedOn}</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}
