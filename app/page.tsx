import Image from "next/image";
import Link from "next/link";
import HomeDashboardPreview from "./home-dashboard-preview";
import HomeChatPreview from "./home-chat-preview";
import { SmoothScrollProvider } from "./smooth-scroll";

function FeatureBadge({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-[#8CFF00]/10 py-1.5 pl-2 pr-3.5">
      <div className="flex h-5 w-5 items-center justify-center text-[#96FF04]">
        {icon}
      </div>
      <span className="text-xs font-medium text-[#96FF04]">{label}</span>
    </div>
  );
}

function ReportSnippet() {
  return (
    <div className="w-full max-w-sm overflow-hidden rounded-[28px] bg-[#18252E] shadow-2xl shadow-black/40 ring-1 ring-white/5">
      <div className="flex items-center justify-between bg-[#101d27] px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#8CFF00] text-[11px] font-bold text-[#0b1620]">
            M
          </div>
          <span className="text-xs font-semibold text-white">MyKhata</span>
        </div>
        <span className="text-[11px] text-white/40">Monthly Report</span>
      </div>

      <div className="p-5">
        <p className="text-sm text-white">
          Hey Hamza, here&apos;s your September 2026 summary
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-[#96FF04]/10 px-3 py-2.5">
            <p className="text-[10px] text-white/50">Income</p>
            <p className="text-sm font-semibold text-[#96FF04]">PKR 107,000</p>
          </div>
          <div className="rounded-xl bg-[#FF6063]/10 px-3 py-2.5">
            <p className="text-[10px] text-white/50">Expense</p>
            <p className="text-sm font-semibold text-[#FF6063]">PKR 11,400</p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2.5 rounded-xl bg-white/5 px-3 py-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#8CFF00]/10 text-[#8CFF00]">
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
              <path d="M14 2v6h6" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs text-white">
              MyKhata-September-2026.pdf
            </p>
            <p className="text-[10px] text-white/40">142 KB · Attached</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <SmoothScrollProvider>
      <main
        className="flex min-h-screen flex-col"
        style={{
          backgroundColor: "#141617",
          backgroundImage:
            "radial-gradient(1000px circle at 10% -10%, rgba(140, 255, 0, 0.14), transparent 55%), " +
            "radial-gradient(900px circle at 95% 5%, rgba(150, 255, 4, 0.10), transparent 55%)",
        }}
      >
        <header className="sticky top-0 z-40 border-b border-white/5 bg-[#141617]/80 backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 sm:px-8">
            <Image
              src="/mykhata-logo.svg"
              alt="MyKhata"
              width={140}
              height={23}
              priority
            />

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/login"
                className="rounded-full px-4 py-2.5 text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-[#8CFF00] px-5 py-2.5 text-sm font-semibold text-[#0b1620] transition-opacity hover:opacity-90"
              >
                Get Started
              </Link>
            </div>
          </div>
        </header>

        <section className="mx-auto flex w-full max-w-3xl flex-col items-center px-6 pb-10 pt-16 text-center sm:px-8 sm:pt-24">
          <span className="inline-flex items-center rounded-full bg-[#8CFF00]/10 px-3.5 py-1.5 text-xs font-medium text-[#96FF04]">
            Personal finance, simplified
          </span>

          <h1 className="mt-5 text-[34px] font-light leading-tight text-white sm:text-[52px]">
            Know exactly where
            <br />
            your money goes.
          </h1>

          <p className="mt-4 max-w-lg text-[15px] text-white/40 sm:text-base">
            Track income and expenses, ask an AI assistant about your spending,
            and get a branded PDF summary emailed to you every month — all in
            one simple dashboard.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
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
        </section>

        <section className="mx-auto w-full max-w-4xl px-6 pb-20 sm:px-8">
          <HomeDashboardPreview />
        </section>

        <section
          id="features"
          className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-8"
        >
          <div className="mx-auto mb-16 max-w-xl text-center">
            <h2 className="text-[28px] font-light text-white sm:text-[36px]">
              Built to make managing money effortless
            </h2>
            <p className="mt-3 text-[15px] text-white/40">
              Beyond just logging transactions — MyKhata understands your
              spending and keeps you in the loop automatically.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="grid items-center gap-10 rounded-[32px] border border-white/5 bg-white/[0.02] p-6 transition-colors duration-300 hover:border-white/10 sm:p-10 lg:grid-cols-2 lg:gap-16">
              <div className="flex justify-center lg:order-1 lg:justify-start">
                <HomeChatPreview />
              </div>
              <div className="lg:order-2">
                <FeatureBadge
                  label="AI Assistant"
                  icon={
                    <svg
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
                  }
                />
                <h3 className="mt-4 text-2xl font-light text-white sm:text-[28px]">
                  Ask Chotta anything about your spending
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-white/40">
                  No digging through transaction lists. Just ask how much you
                  spent on food, rent, or any category, for any time period —
                  Chotta computes the real answer straight from your own data,
                  in plain English.
                </p>
              </div>
            </div>

            <div className="grid items-center gap-10 rounded-[32px] border border-white/5 bg-white/[0.02] p-6 transition-colors duration-300 hover:border-white/10 sm:p-10 lg:grid-cols-2 lg:gap-16">
              <div className="lg:order-2 flex justify-center lg:justify-end">
                <ReportSnippet />
              </div>
              <div className="lg:order-1">
                <FeatureBadge
                  label="Monthly Reports"
                  icon={
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                      <path d="M14 2v6h6" />
                    </svg>
                  }
                />
                <h3 className="mt-4 text-2xl font-light text-white sm:text-[28px]">
                  A branded PDF, emailed every month
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-white/40">
                  Turn on monthly reports and get a full breakdown — income,
                  expenses, category-by-category spending, and every transaction
                  — delivered straight to your inbox on the 1st of each month.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-4xl px-6 pb-24 sm:px-8">
          <div className="rounded-[32px] bg-[#18252E] px-8 py-14 text-center shadow-2xl shadow-black/30 ring-1 ring-white/5">
            <h2 className="text-[26px] font-light text-white sm:text-[32px]">
              Ready to take control of your finances?
            </h2>
            <p className="mt-3 text-[15px] text-white/40">
              Create a free account and start tracking in under a minute.
            </p>
            <Link
              href="/register"
              className="mt-7 inline-flex rounded-full bg-[#8CFF00] px-8 py-3.5 text-sm font-semibold text-[#0b1620] transition-opacity hover:opacity-90"
            >
              Get Started — it&apos;s free
            </Link>
          </div>
        </section>

        <footer className="border-t border-white/5 px-6 py-8 sm:px-8">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
            <Image
              src="/mykhata-logo.svg"
              alt="MyKhata"
              width={110}
              height={18}
            />
            <p className="text-xs text-white/30">
              © 2026 MyKhata. Built for tracking your money, simply.
            </p>
          </div>
        </footer>
      </main>
    </SmoothScrollProvider>
  );
}
