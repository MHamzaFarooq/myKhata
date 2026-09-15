"use client";
import Link from "next/link";
import { loginUser } from "./actions";
import { Suspense, useActionState } from "react";
import { redirect, useSearchParams } from "next/navigation";
import AuthLayout from "@/app/components/auth-layout";
import GoogleAuthButton from "@/app/components/google-auth-button";

function AuthStatusBanner() {
  const searchParams = useSearchParams();
  const oauthError = searchParams.get("error");
  const registered = searchParams.get("registered");

  if (oauthError) {
    return (
      <p className="mb-6 rounded-2xl bg-red-500/10 px-4 py-3 text-center text-sm text-red-400">
        Google sign-in failed. Please try again.
      </p>
    );
  }

  if (registered) {
    return (
      <p className="mb-6 rounded-2xl bg-[#8CFF00]/10 px-4 py-3 text-center text-sm text-[#8CFF00]">
        Account created. Log in to continue.
      </p>
    );
  }

  return null;
}

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginUser, null);

  if (state?.success) {
    redirect("/dashboard");
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to keep track of your finances."
    >
      <Suspense fallback={null}>
        <AuthStatusBanner />
      </Suspense>

      <GoogleAuthButton />

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs text-white/30">or continue with email</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <form action={formAction} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm text-white/80">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            className="w-full rounded-full bg-[#0b1620] px-5 py-3.5 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/20"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm text-white/80">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            className="w-full rounded-full bg-[#0b1620] px-5 py-3.5 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/20"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-full bg-[#8CFF00] py-3.5 text-base font-semibold text-[#0b1620] transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? "Logging in..." : "Login"}
        </button>

        {state?.message && !state.success && (
          <p className="text-center text-sm text-red-400">{state.message}</p>
        )}
      </form>

      <p className="mt-8 text-center text-sm text-white/40">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-[#8CFF00] hover:underline"
        >
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}
