function Bar({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-full bg-white/10 ${className}`} />
  );
}

function Block({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-3xl bg-white/5 ${className}`} />
  );
}

function TransactionRowSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div className="flex min-w-0 items-center gap-3">
        <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-white/10" />
        <div className="flex min-w-0 flex-col gap-2">
          <Bar className="h-4 w-32" />
          <Bar className="h-3 w-24" />
        </div>
      </div>
      <Bar className="h-4 w-16 shrink-0" />
    </div>
  );
}

export default function DashboardLoading() {
  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor: "#141617",
        backgroundImage:
          "radial-gradient(1000px circle at 10% -10%, rgba(140, 255, 0, 0.14), transparent 55%), " +
          "radial-gradient(900px circle at 95% 5%, rgba(150, 255, 4, 0.10), transparent 55%)",
      }}
    >
      <div className="flex flex-col gap-10 max-w-280 mx-auto px-4 py-8 sm:px-6 sm:py-10 lg:px-8 pb-16">
        {/* Navbar + greeting */}
        <div className="flex flex-col gap-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 animate-pulse rounded-2xl bg-white/10" />
              <Bar className="h-4 w-20" />
            </div>
            <div className="h-9 w-9 animate-pulse rounded-full bg-white/10" />
          </div>

          <div className="flex flex-col gap-2">
            <Bar className="h-8 w-64 sm:h-10 sm:w-80" />
            <Bar className="h-4 w-48" />
          </div>
        </div>

        {/* Summary cards */}
        <div className="flex flex-col gap-8 rounded-[36px] bg-[#18252E] p-6 md:p-8">
          <div className="grid grid-cols-1 gap-6 divide-y divide-white/5 sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`flex items-center gap-4 pt-6 first:pt-0 sm:pt-0 ${
                  i === 0 ? "sm:pr-6" : i === 1 ? "sm:px-6" : "sm:pl-6"
                }`}
              >
                <div className="h-11 w-11 shrink-0 animate-pulse rounded-2xl bg-white/10" />
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <Bar className="h-3 w-16" />
                  <Bar className="h-6 w-24" />
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 lg:flex-row">
            <Block className="h-75 min-w-0 flex-1" />
            <Block className="h-75 w-full shrink-0 lg:w-56" />
          </div>
        </div>

        {/* Transactions panel */}
        <div className="mx-auto w-full max-w-6xl rounded-[28px] sm:rounded-[40px] bg-[#18252E] p-5 sm:p-8 shadow-2xl shadow-black/30">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Add Transaction form */}
            <div className="w-full max-w-md rounded-3xl bg-[#101d27] p-4 sm:p-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 shrink-0 animate-pulse rounded-xl bg-white/10" />
                <Bar className="h-6 w-40" />
              </div>

              <div className="space-y-2">
                <Bar className="h-3 w-24" />
                <Bar className="h-12 w-full" />
              </div>

              <div className="space-y-2">
                <Bar className="h-3 w-16" />
                <Bar className="h-12 w-full" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Bar className="h-3 w-20" />
                  <Bar className="h-12 w-full" />
                </div>
                <div className="space-y-2">
                  <Bar className="h-3 w-16" />
                  <Bar className="h-12 w-full" />
                </div>
              </div>

              <div className="space-y-2">
                <Bar className="h-3 w-12" />
                <Bar className="h-12 w-full" />
              </div>

              <Bar className="h-14 w-full" />
            </div>

            {/* Transactions list */}
            <div className="flex-1 min-w-0">
              <Bar className="h-8 w-40 mb-4" />

              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-2">
                  <Bar className="h-10 w-16" />
                  <Bar className="h-10 w-20" />
                  <Bar className="h-10 w-20" />
                </div>
                <Bar className="h-10 w-36" />
              </div>

              <div className="divide-y divide-white/10">
                {[0, 1, 2, 3, 4].map((i) => (
                  <TransactionRowSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
