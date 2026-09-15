import { z } from "zod";

export const updateUsernameSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters.")
    .max(50, "Username must be at most 50 characters."),
});
