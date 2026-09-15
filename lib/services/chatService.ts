import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { getExpenseSummaryForCategory } from "../repositories/transactionRepository";
import { getCategoriesByUserId } from "../repositories/categoryRepository";

// Constructed lazily, not at module load - Next.js executes this module
// during build-time page data collection, before Vercel env vars are
// necessarily available, and the SDK throws immediately if no API key is
// resolvable at construction time.
let anthropic: Anthropic | null = null;

function getAnthropicClient() {
  if (!anthropic) {
    anthropic = new Anthropic();
  }
  return anthropic;
}

const ExpenseQuerySchema = z.object({
  is_expense_question: z
    .boolean()
    .describe(
      "True only if the user is asking how much they have spent, optionally filtered by one category and/or a time range. False for anything else, including greetings, small talk, questions about income or balance, requests to list or edit transactions, account/app questions, or anything unrelated to the user's own expense totals.",
    ),
  category: z
    .string()
    .nullable()
    .describe(
      "The exact category name (from the provided list) the user asked about, or null if they mean all categories combined.",
    ),
  start_date: z
    .string()
    .nullable()
    .describe(
      "ISO date (YYYY-MM-DD) for the start of the time range, computed relative to today's date if the user used a relative phrase such as 'past 16 days'. Null if no time range was implied.",
    ),
  end_date: z
    .string()
    .nullable()
    .describe(
      "ISO date (YYYY-MM-DD) for the end of the time range. Null to mean today, unless the user specified a different end date.",
    ),
});

export type ChatMessage = { role: "user" | "assistant"; content: string };

const REFUSAL_MESSAGE =
  "I can't help you with this request. I can only tell you how much you've spent, by category and time period.";

function isValidDate(value: string | null | undefined): value is string {
  return !!value && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function formatPeriod(startDate: string | null, endDate: string | null) {
  if (!startDate && !endDate) return "";
  if (startDate && endDate) return ` between ${startDate} and ${endDate}`;
  if (startDate) return ` since ${startDate}`;
  return ` up to ${endDate}`;
}

export async function answerExpenseChat(
  userId: string,
  message: string,
  history: ChatMessage[],
): Promise<string> {
  const trimmedMessage = message.trim();

  if (!trimmedMessage) {
    return REFUSAL_MESSAGE;
  }

  if (trimmedMessage.length > 500) {
    return "That message is a bit long - try asking a shorter question about your expenses.";
  }

  const categories = await getCategoriesByUserId(userId);
  const categoryNames = categories.map((category) => category.name);
  const today = new Date().toISOString().split("T")[0];

  const systemPrompt = `You are a strictly scoped assistant embedded in a personal finance app. Today's date is ${today}.

The signed-in user's expense categories are: ${categoryNames.join(", ") || "(none yet)"}.

Your ONLY job is to decide whether the user's message is asking how much they have spent (optionally filtered by one of the categories above and/or a time range), and if so, extract that category and date range. You never see or report the actual amounts yourself - a separate system computes them directly from the database.

Set is_expense_question to false for anything that is not exactly this kind of spending-total question. When in doubt, set it to false.`;

  let parsed: z.infer<typeof ExpenseQuerySchema> | null;

  try {
    const response = await getAnthropicClient().messages.parse({
      model: "claude-opus-5",
      max_tokens: 1024,
      system: systemPrompt,
      output_config: {
        effort: "low",
        format: zodOutputFormat(ExpenseQuerySchema),
      },
      messages: [
        ...history
          .slice(-6)
          .map((entry) => ({ role: entry.role, content: entry.content })),
        { role: "user" as const, content: trimmedMessage },
      ],
    });
    parsed = response.parsed_output;
  } catch (error) {
    console.error("CHAT LLM ERROR:", error);
    return "Sorry, something went wrong. Please try again in a moment.";
  }

  if (!parsed || !parsed.is_expense_question) {
    return REFUSAL_MESSAGE;
  }

  const matchedCategory = parsed.category
    ? categories.find(
        (category) =>
          category.name.toLowerCase() === parsed!.category!.toLowerCase().trim(),
      )
    : null;

  if (parsed.category && !matchedCategory) {
    return `I couldn't find a category called "${parsed.category}". Your categories are: ${categoryNames.join(", ")}.`;
  }

  const startDate = isValidDate(parsed.start_date) ? parsed.start_date : null;
  const endDate = isValidDate(parsed.end_date) ? parsed.end_date : null;

  const { total, count } = await getExpenseSummaryForCategory(
    userId,
    matchedCategory?.id ?? null,
    startDate,
    endDate,
  );

  const categoryLabel = matchedCategory ? matchedCategory.name : "all categories";
  const periodLabel = formatPeriod(startDate, endDate);

  if (count === 0) {
    return `You haven't spent anything on ${categoryLabel}${periodLabel}.`;
  }

  return `You spent PKR ${total.toLocaleString()} on ${categoryLabel}${periodLabel} (${count} transaction${count === 1 ? "" : "s"}).`;
}
