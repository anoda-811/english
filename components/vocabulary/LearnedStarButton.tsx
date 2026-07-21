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

  const dim = size === "sm" ? "h-9 w-9" : "h-11 w-11";
  const icon = size === "sm" ? 20 : 24;

  return (
    <button
      type="button"
      onClick={() => toggle(wordId)}
      className={`inline-flex shrink-0 items-center justify-center rounded-full transition active:scale-95 ${dim} ${
        active
          ? "text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.45)]"
          : "text-zinc-300 hover:text-amber-300 dark:text-zinc-600 dark:hover:text-amber-400"
      } ${className}`}
      aria-label={active ? "覚えたを解除" : "覚えたにする"}
      aria-pressed={active}
    >
      <SoftStarIcon size={icon} filled={active} />
    </button>
  );
}

/** 角を丸めた柔らかい星 */
function SoftStarIcon({ size, filled }: { size: number; filled: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 3.4 14.05 9.1a1 1 0 0 0 .87.63l5.9.55-4.5 3.9a1 1 0 0 0-.33 1.02l1.4 5.76-5.08-3.05a1 1 0 0 0-1.02 0L6.21 20.96l1.4-5.76a1 1 0 0 0-.33-1.02l-4.5-3.9 5.9-.55a1 1 0 0 0 .87-.63L12 3.4Z" />
    </svg>
  );
}
