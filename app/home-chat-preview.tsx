"use client";

import { useState } from "react";

const SUGGESTIONS = [
  {
    question: "How much did I spend on food this month?",
    answer:
      "You spent PKR 8,450 on Food & Dining this month (14 transactions).",
  },
  {
    question: "What's my balance right now?",
    answer: "Your remaining balance is PKR 95,600 this month.",
  },
  {
    question: "How much did I spend on rent?",
    answer: "You spent PKR 35,000 on Rent this month (1 transaction).",
  },
];

export default function HomeChatPreview() {
  const [displayed, setDisplayed] = useState(0);
  const [visible, setVisible] = useState(true);

  function handleSelect(index: number) {
    if (index === displayed) return;
    setVisible(false);
    window.setTimeout(() => {
      setDisplayed(index);
      setVisible(true);
    }, 180);
  }

  return (
    <div className="w-full max-w-sm rounded-[28px] bg-[#18252E] shadow-2xl shadow-black/40 ring-1 ring-white/5 overflow-hidden">
      <div className="flex items-center gap-2.5 bg-[#101d27] px-4 py-3.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-[#8CFF00]/10 text-[#8CFF00]">
          <svg
            className="h-4 w-4"
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
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-white">Chotta</p>
          <p className="text-[11px] text-white/40">Your expense assistant</p>
        </div>
      </div>

      <div
        className={`space-y-3 px-4 py-5 transition-opacity duration-200 ease-out ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex justify-end">
          <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-[#8CFF00] px-4 py-2.5 text-sm text-[#0b1620]">
            {SUGGESTIONS[displayed].question}
          </div>
        </div>
        <div className="flex justify-start">
          <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-[#101d27] px-4 py-2.5 text-sm text-white/90">
            {SUGGESTIONS[displayed].answer}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 px-4 pb-4">
        {SUGGESTIONS.map((s, i) => (
          <button
            key={s.question}
            type="button"
            onClick={() => handleSelect(i)}
            className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors duration-200 ${
              displayed === i
                ? "bg-[#8CFF00] text-[#0b1620]"
                : "bg-white/5 text-white/50 hover:bg-white/10"
            }`}
          >
            {i === 0 ? "Food" : i === 1 ? "Balance" : "Rent"}
          </button>
        ))}
      </div>
    </div>
  );
}
