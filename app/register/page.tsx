"use client";
import { registerUser } from "./actions";
import { useActionState } from "react";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerUser, null);

  return (
    <main>
      <div className="bg-zinc-900 max-w-3xl">
        <h1>Create Account</h1>
        <form action={formAction}>
          <div>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" required />
          </div>
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
            {isPending ? "Creating Account..." : "Create Account"}
          </button>
          {state?.message && <p>{state.message}</p>}
        </form>
      </div>
    </main>
  );
}
