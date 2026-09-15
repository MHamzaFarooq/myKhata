import { NextResponse } from "next/server";
import { sendMonthlyReportsToAllOptedInUsers } from "@/lib/services/reportService";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Runs on the 1st of the month, so the report covers the month that just ended.
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  try {
    const result = await sendMonthlyReportsToAllOptedInUsers(
      lastMonth.getFullYear(),
      lastMonth.getMonth() + 1,
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("MONTHLY REPORT CRON ERROR:", error);
    return NextResponse.json(
      { error: "Failed to send monthly reports." },
      { status: 500 },
    );
  }
}
