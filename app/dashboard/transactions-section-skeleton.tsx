function Bar({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-full bg-white/10 ${className}`} />
  );
}

export default function TransactionsSectionSkeleton() {
  return (
    <div>
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
          <div key={i} className="flex items-center justify-between gap-4 py-3.5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-white/10" />
              <div className="flex min-w-0 flex-col gap-2">
                <Bar className="h-4 w-32" />
                <Bar className="h-3 w-24" />
              </div>
            </div>
            <Bar className="h-4 w-16 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
