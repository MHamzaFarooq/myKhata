"use server";
import bcrypt from "bcrypt";
import pool from "@/lib/db";
import { registerSchema } from "./registerSchema";
import { createDefaultCategories } from "@/lib/repositories/categoryRepository";

export async function registerUser(previousData: unknown, formData: FormData) {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Validate the form data using the Zod schema
  const validationResult = registerSchema.safeParse({
    username,
    email,
    password,
  });

  if (!validationResult.success) {
    return {
      success: false,
      message: "Please enter valid information for all fields.",
    };
  }

  //extracting the validated data
  const {
    username: validUsername,
    email: validEmail,
    password: validPassword,
  } = validationResult.data;

  //email normalizing to lowercase to avoid duplicates due to case sensitivity
  const correctEmail = validEmail.toLowerCase();

  const hashedPassword = await bcrypt.hash(validPassword, 12);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    //creating user
    const userResult = await client.query(
      `
      INSERT INTO users (username, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, username, email
    `,
      [validUsername, correctEmail, hashedPassword],
    );

    const user = userResult.rows[0];

    // Now creating the default expense categories for the new user
    await createDefaultCategories(client, user.id);

    // 3. Save everything
    await client.query("COMMIT");

    return {
      success: true,
      message: "Account created successfully",
    };
  } catch (error) {
    // Undo everything if something fails
    await client.query("ROLLBACK");

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "23505"
    ) {
      return {
        success: false,
        message: "Username or email already exists",
      };
    }

    console.log(error);

    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  } finally {
    // Give the connection back to the pool
    client.release();
  }
}
