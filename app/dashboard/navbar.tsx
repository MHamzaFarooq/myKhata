"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  logoutUser,
  sendTestMonthlyReport,
  updateMonthlyReportPreference,
  updateUsername,
} from "./actions";

export default function Navbar({
  username,
  monthlyReportEnabled,
}: {
  username: string;
  monthlyReportEnabled: boolean;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportEnabled, setReportEnabled] = useState(monthlyReportEnabled);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(
    updateUsername,
    null,
  );

  const [isTogglePending, startToggleTransition] = useTransition();
  const [isTestPending, startTestTransition] = useTransition();

  const initial = username.trim().charAt(0).toUpperCase() || "?";

  function handleToggleReport() {
    const next = !reportEnabled;
    setReportEnabled(next);

    startToggleTransition(async () => {
      const result = await updateMonthlyReportPreference(next);
      if (result.success) {
        toast.success(result.message);
      } else {
        setReportEnabled(!next);
        toast.error(result.message);
      }
    });
  }

  function handleSendTest() {
    startTestTransition(async () => {
      const result = await sendTestMonthlyReport();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  useEffect(() => {
    if (!isMenuOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isEditOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsEditOpen(false);
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isEditOpen]);

  useEffect(() => {
    if (!isReportOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsReportOpen(false);
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isReportOpen]);

  useEffect(() => {
    if (state?.success) {
      setIsEditOpen(false);
      router.refresh();
    }
  }, [state, router]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#8CFF00] text-[15px] font-bold text-[#0b1620]">
          M
        </div>
        <span className="text-[16px] font-medium">MyKhata</span>
      </div>

      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
          title={username}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#20313D] text-[13px] font-medium text-white/80 transition-colors hover:bg-[#2a3d4a]"
        >
          {initial}
        </button>

        {isMenuOpen && (
          <div
            role="menu"
            className="absolute right-0 top-12 z-20 w-56 overflow-hidden rounded-2xl bg-[#18252E] shadow-2xl shadow-black/40 ring-1 ring-white/10"
          >
            <div className="border-b border-white/5 px-4 py-3">
              <p className="truncate text-sm font-medium text-white">
                {username}
              </p>
            </div>

            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setIsEditOpen(true);
                setIsMenuOpen(false);
              }}
              className="flex w-full items-center gap-2.5 px-4 py-3 text-left text-sm text-white/80 transition-colors hover:bg-white/5"
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
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
              Edit username
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setIsReportOpen(true);
                setIsMenuOpen(false);
              }}
              className="flex w-full items-center gap-2.5 px-4 py-3 text-left text-sm text-white/80 transition-colors hover:bg-white/5"
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
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
              Monthly report
            </button>

            <form action={logoutUser}>
              <button
                type="submit"
                role="menuitem"
                className="flex w-full items-center gap-2.5 px-4 py-3 text-left text-sm text-red-400 transition-colors hover:bg-red-500/10"
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
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <path d="M16 17l5-5-5-5" />
                  <path d="M21 12H9" />
                </svg>
                Logout
              </button>
            </form>
          </div>
        )}
      </div>

      {isEditOpen && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 px-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) setIsEditOpen(false);
          }}
        >
          <div className="w-full max-w-sm rounded-3xl bg-[#101d27] p-6 shadow-2xl">
            <h2 className="text-lg font-medium text-white">Edit username</h2>
            <p className="mt-1 text-sm text-white/40">
              Update the name shown across your account.
            </p>

            <form action={formAction} className="mt-5 space-y-4">
              <input
                name="username"
                type="text"
                defaultValue={username}
                required
                autoFocus
                className="w-full rounded-full bg-[#0b1620] px-5 py-3.5 text-white outline-none focus:ring-2 focus:ring-white/20"
              />

              {state?.message && !state.success && (
                <p className="text-sm text-red-400">{state.message}</p>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1 rounded-full bg-white/5 py-3 text-sm font-medium text-white/70 transition-colors hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 rounded-full bg-[#8CFF00] py-3 text-sm font-semibold text-[#0b1620] transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {isPending ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isReportOpen && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 px-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) setIsReportOpen(false);
          }}
        >
          <div className="w-full max-w-sm rounded-3xl bg-[#101d27] p-6 shadow-2xl">
            <h2 className="text-lg font-medium text-white">Monthly report</h2>
            <p className="mt-1 text-sm text-white/40">
              Get a branded PDF summary of your income, expenses, and
              category breakdown emailed to you on the 1st of every month.
            </p>

            <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl bg-[#0b1620] px-5 py-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-white">
                  Email me monthly
                </p>
                <p className="text-xs text-white/40">
                  {reportEnabled ? "Reports are on" : "Reports are off"}
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={reportEnabled}
                aria-label="Toggle monthly report emails"
                onClick={handleToggleReport}
                disabled={isTogglePending}
                className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 disabled:opacity-60 ${
                  reportEnabled ? "bg-[#8CFF00]" : "bg-white/15"
                }`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ease-out ${
                    reportEnabled ? "translate-x-5.5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <button
              type="button"
              onClick={handleSendTest}
              disabled={isTestPending}
              className="mt-4 w-full rounded-full bg-white/5 py-3 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 disabled:opacity-50"
            >
              {isTestPending ? "Sending..." : "Send test report now"}
            </button>

            <button
              type="button"
              onClick={() => setIsReportOpen(false)}
              className="mt-3 w-full rounded-full bg-[#8CFF00] py-3 text-sm font-semibold text-[#0b1620] transition-opacity hover:opacity-90"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
