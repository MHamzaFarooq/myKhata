import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username is required")
    .max(50, "Username must be at most 50 characters."),
  email: z.string().trim().email("Please enter a valid email address."),
  password: z
    .string()
    .trim()
    .min(3, "Password must be at least 3 characters.")
    .max(100, "Password must be at most 100 characters."),
});
