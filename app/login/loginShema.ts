import { z } from "zod";

//userSchema
export const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address."),

  password: z.string().min(1, "Password is required."),
});
