"use client";

import { useLearnedWords } from "@/hooks/useLearnedWords";

type LearnedStarButtonProps = {
  wordId: string;
  size?: "sm" | "md";
  className?: string;
};

export function LearnedStarButton({ wordId, size = "md", className = "" }: LearnedStarButtonProps) {
  const { isLearned, toggle } = useLearnedWords();
  const active = isLearned(wordId);

  const dim = size === "sm" ? "h-9 w-9 text-xl" : "h-11 w-11 text-2xl";

  return (
    <button
      type="button"
      onClick={() => toggle(wordId)}
      className={`inline-flex shrink-0 items-center justify-center rounded-full transition active:scale-95 ${dim} ${
        active
          ? "text-amber-400"
          : "text-zinc-300 hover:text-amber-200 dark:text-zinc-600 dark:hover:text-amber-300"
      } ${className}`}
      aria-label={active ? "覚えたを解除" : "覚えたにする"}
      aria-pressed={active}
    >
      <span aria-hidden>{active ? "★" : "☆"}</span>
    </button>
  );
}
