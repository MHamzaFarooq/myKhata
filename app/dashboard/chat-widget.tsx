"use client";

import { useEffect, useRef, useState } from "react";

type ChatMessage = { role: "user" | "assistant"; content: string };

const GREETING: ChatMessage = {
  role: "assistant",
  content:
    "Hi! I'm chotta, your personal expense assistant. I can only answer questions related to your expenses. How can I help you today?",
};

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-[#101d27] px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/40"
          style={{ animationDelay: `${i * 120}ms` }}
        />
      ))}
    </div>
  );
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const shouldRenderPanel = isOpen || isClosing;
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function openChat() {
    setIsClosing(false);
    setIsOpen(true);
  }

  function closeChat() {
    setIsOpen(false);
    setIsClosing(true);
  }

  function handlePanelAnimationEnd() {
    if (!isOpen) setIsClosing(false);
  }

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, isSending]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") closeChat();
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  async function handleSend(event: React.FormEvent) {
    event.preventDefault();
    const text = input.trim();
    if (!text || isSending) return;

    const nextHistory = [...messages, { role: "user" as const, content: text }];
    setMessages(nextHistory);
    setInput("");
    setIsSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: nextHistory.slice(-6),
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.reply) {
        throw new Error(data?.error ?? "Request failed");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <>
      {shouldRenderPanel && (
        <div
          onAnimationEnd={handlePanelAnimationEnd}
          className={`fixed bottom-24 right-4 z-40 flex h-[520px] w-[360px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-8rem)] origin-bottom-right flex-col overflow-hidden rounded-3xl bg-[#18252E] shadow-2xl shadow-black/40 ring-1 ring-white/10 ${
            isOpen
              ? "animate-[chat-panel-in_0.22s_cubic-bezier(0.16,1,0.3,1)_both]"
              : "animate-[chat-panel-out_0.16s_ease-in_both]"
          }`}
        >
          <div className="flex items-center justify-between gap-3 bg-[#101d27] px-4 py-3.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#8CFF00]/10 text-[#8CFF00]">
                <svg
                  className="h-4.5 w-4.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 8V4H8" />
                  <rect x="4" y="8" width="16" height="12" rx="2" />
                  <path d="M2 14h2" />
                  <path d="M20 14h2" />
                  <path d="M9 13v2" />
                  <path d="M15 13v2" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Chotta</p>
                <p className="text-xs text-white/40">
                  Ask me about your expenses
                </p>
              </div>
            </div>

            <button
              type="button"
              aria-label="Close chat"
              onClick={closeChat}
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/50 transition-colors duration-200 hover:bg-white/10 hover:text-white active:scale-90"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex animate-[chat-message-in_0.2s_ease-out_both] ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm ${
                    msg.role === "user"
                      ? "rounded-br-sm bg-[#8CFF00] text-[#0b1620]"
                      : "rounded-bl-sm bg-[#101d27] text-white/90"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isSending && (
              <div className="flex animate-[chat-message-in_0.2s_ease-out_both] justify-start">
                <TypingIndicator />
              </div>
            )}
          </div>

          <form
            onSubmit={handleSend}
            className="flex items-center gap-2 border-t border-white/10 p-3"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="e.g How much did I spend on rent?"
              className="min-w-0 flex-1 rounded-full bg-[#0b1620] px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/20"
            />
            <button
              type="submit"
              aria-label="Send message"
              disabled={isSending || !input.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#8CFF00] text-[#0b1620] transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 19V5" />
                <path d="M5 12l7-7 7 7" />
              </svg>
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        aria-label={isOpen ? "Close chat" : "Open chat"}
        onClick={() => (isOpen ? closeChat() : openChat())}
        className="fixed bottom-4 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#8CFF00] text-[#0b1620] shadow-2xl shadow-black/40 transition-transform duration-200 hover:scale-105 active:scale-90"
      >
        <svg
          className={`absolute h-6 w-6 transition-all duration-200 ease-out ${
            isOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-45 scale-50 opacity-0"
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 6 6 18" />
          <path d="M6 6l12 12" />
        </svg>
        <svg
          className={`absolute h-6 w-6 transition-all duration-200 ease-out ${
            isOpen ? "rotate-45 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100"
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      </button>
    </>
  );
}
