"use server";
import pool from "@/lib/db";
import { loginSchema } from "./loginShema";
import bcrypt from "bcrypt";
import { createSession } from "@/lib/session";
import { cookies } from "next/headers";

export async function loginUser(previousData: unknown, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validationResult = loginSchema.safeParse({
    email,
    password,
  });

  if (!validationResult.success) {
    return {
      success: false,
      message: "Please enter valid information for all fields.",
    };
  }
  //validated data
  const validEmail = validationResult.data.email.toLowerCase();
  const validPassword = validationResult.data.password;
  try {
    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [validEmail],
    );

    if (userResult.rows.length === 0) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }
    const user = userResult.rows[0];

    const isPasswordValid = await bcrypt.compare(validPassword, user.password);

    if (!isPasswordValid) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    // setting the session cookie
    const session = await createSession(user.id);

    const cookieStore = await cookies();
    cookieStore.set("session_id", session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: session.expires_at,
      path: "/",
    });

    return {
      success: true,
      message: "Login successful.",
    };
  } catch (error) {
    console.error("Error occurred while logging in user:", error);
    return {
      success: false,
      message: "An error occurred while logging in.",
    };
  }
}
