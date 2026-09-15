"use client";
import Link from "next/link";
import { registerUser } from "./actions";
import { useActionState } from "react";
import { redirect } from "next/navigation";
import AuthLayout from "@/app/components/auth-layout";
import GoogleAuthButton from "@/app/components/google-auth-button";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerUser, null);

  if (state?.success) {
    redirect("/login?registered=1");
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start tracking your income and expenses in minutes."
    >
      <GoogleAuthButton />

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs text-white/30">or continue with email</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <form action={formAction} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="username" className="block text-sm text-white/80">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="e.g John Doe"
            required
            className="w-full rounded-full bg-[#0b1620] px-5 py-3.5 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/20"
          />
        </div>

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
          {isPending ? "Creating account..." : "Create account"}
        </button>

        {state?.message && !state.success && (
          <p className="text-center text-sm text-red-400">{state.message}</p>
        )}
      </form>

      <p className="mt-8 text-center text-sm text-white/40">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-[#8CFF00] hover:underline"
        >
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
