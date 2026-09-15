"use client";

import { useRouter, useSearchParams } from "next/navigation";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

export default function Pagination({
  currentPage,
  totalPages,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/dashboard?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex items-center justify-between">
      <button
        aria-label="Previous page"
        disabled={currentPage <= 1}
        onClick={() => goToPage(currentPage - 1)}
        className="flex items-center justify-center h-10 w-10 rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white/10"
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
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <span className="text-sm text-white/50">
        Page {currentPage} of {totalPages}
      </span>

      <button
        aria-label="Next page"
        disabled={currentPage >= totalPages}
        onClick={() => goToPage(currentPage + 1)}
        className="flex items-center justify-center h-10 w-10 rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white/10"
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
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}
