import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { answerExpenseChat } from "@/lib/services/chatService";
import type { ChatMessage } from "@/lib/services/chatService";

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    (candidate.role === "user" || candidate.role === "assistant") &&
    typeof candidate.content === "string"
  );
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const message = typeof body?.message === "string" ? body.message : "";
  const history: ChatMessage[] = Array.isArray(body?.history)
    ? body.history.filter(isChatMessage)
    : [];

  if (!message.trim()) {
    return NextResponse.json(
      { error: "Message is required." },
      { status: 400 },
    );
  }

  try {
    const reply = await answerExpenseChat(user.id, message, history);
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("CHAT ROUTE ERROR:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
