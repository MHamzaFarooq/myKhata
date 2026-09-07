import { z } from "zod";

export const transactionSchema = z.object({
  amount: z
    .number()
    .int("Amount must be a whole number.")
    .positive("Amount must be greater than 0."),

  transactionType: z.enum(["income", "expense"]),

  categoryId: z.string().uuid("Invalid category.").nullable(),

  description: z
    .string()
    .trim()
    .max(500, "Description is too long.")
    .nullable(),

  transactionDate: z.string().date("Invalid transaction date."),
});
