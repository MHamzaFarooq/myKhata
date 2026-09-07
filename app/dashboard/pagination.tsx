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
    router.push(`/dashboard?${params.toString()}`);
  }

  return (
    <div className="flex items-center justify-between">
      <button
        aria-label="Previous page"
        disabled={currentPage <= 1}
        onClick={() => goToPage(currentPage - 1)}
        className="flex items-center justify-center h-10 w-10 rounded-full bg-[#F4F6F8] text-[#0b1620] transition-colors hover:bg-[#E8ECEF] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#F4F6F8]"
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

      <button
        aria-label="Next page"
        disabled={currentPage >= totalPages}
        onClick={() => goToPage(currentPage + 1)}
        className="flex items-center justify-center h-10 w-10 rounded-full bg-[#F4F6F8] text-[#0b1620] transition-colors hover:bg-[#E8ECEF] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#F4F6F8]"
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
