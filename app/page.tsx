import Link from "next/link";

function MiniStat({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor: string;
}) {
  return (
    <div>
      <p className="text-[11px] text-white/40">{label}</p>
      <p className={`text-lg font-medium ${valueColor}`}>{value}</p>
    </div>
  );
}

export default function Home() {
  return (
    <main
      className="flex min-h-screen flex-col overflow-hidden"
      style={{
        backgroundColor: "#141617",
        backgroundImage:
          "radial-gradient(1000px circle at 10% -10%, rgba(140, 255, 0, 0.14), transparent 55%), " +
          "radial-gradient(900px circle at 95% 5%, rgba(150, 255, 4, 0.10), transparent 55%)",
      }}
    >
      <header className="mx-auto flex w-full max-w-6xl items-center px-6 py-8 sm:px-8">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#8CFF00] text-[15px] font-bold text-[#0b1620]">
            M
          </div>
          <span className="text-[16px] font-medium text-white">MyKhata</span>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-1 items-center px-6 sm:px-8">
        <div className="grid w-full items-center gap-14 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center rounded-full bg-[#8CFF00]/10 px-3.5 py-1.5 text-xs font-medium text-[#96FF04]">
              Personal finance, simplified
            </span>

            <h1 className="mt-5 text-[34px] font-light leading-tight text-white sm:text-[48px]">
              Know exactly where
              <br />
              your money goes.
            </h1>

            <p className="mt-4 max-w-md text-[15px] text-white/40 sm:text-base">
              Track income and expenses, see your spending at a glance, and
              get a clear monthly picture of your finances — all in one
              simple dashboard.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/register"
                className="rounded-full bg-[#8CFF00] px-7 py-3.5 text-sm font-semibold text-[#0b1620] transition-opacity hover:opacity-90"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                Login
              </Link>
            </div>
          </div>

          <div className="hidden justify-self-end lg:block">
            <div className="w-80 rounded-[32px] bg-[#18252E] p-6 shadow-2xl shadow-black/40 ring-1 ring-white/5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-white/50">This month</p>
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#8CFF00]/10 text-[#8CFF00]">
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 8V4H8" />
                    <rect x="4" y="8" width="16" height="12" rx="2" />
                    <path d="M2 14h2" />
                    <path d="M20 14h2" />
                  </svg>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3 rounded-2xl bg-[#101d27] p-4">
                <MiniStat label="Income" value="45,000" valueColor="text-[#96FF04]" />
                <MiniStat label="Expense" value="28,400" valueColor="text-[#FF6063]" />
                <MiniStat label="Balance" value="16,600" valueColor="text-white" />
              </div>

              <div className="mt-4 flex h-20 items-end gap-1.5 rounded-2xl bg-[#101d27] p-4">
                {[40, 65, 35, 80, 50, 90, 60, 45, 75, 55, 85, 70].map(
                  (h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-full bg-[#8CFF00]/70"
                      style={{ height: `${h}%` }}
                    />
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
