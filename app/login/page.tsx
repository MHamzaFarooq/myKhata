"use client";
import { loginUser } from "./actions";
import { useActionState } from "react";
import { redirect } from "next/navigation";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginUser, null);
  if (state?.success) {
    redirect("/dashboard");
  }

  return (
    <main>
      <form action={formAction}>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {isPending ? "Logging in..." : "Login"}
        </button>
        {state?.message && <p>{state.message}</p>}
      </form>
    </main>
  );
}
