"use client";

import Link from "next/link";
import type { IdiomGroup } from "@/lib/idioms";
import { countLearnedInList } from "@/lib/learned-words-storage";
import { useLearnedWords } from "@/hooks/useLearnedWords";

type IdiomGroupCardProps = {
  href: string;
  group: IdiomGroup & { itemCount: number };
  disabled?: boolean;
  itemIds?: string[];
};

export function IdiomGroupCard({ href, group, disabled, itemIds }: IdiomGroupCardProps) {
  const { learned } = useLearnedWords();
  const total = itemIds?.length ?? group.itemCount;
  const learnedCount = itemIds && itemIds.length > 0 ? countLearnedInList(learned, itemIds) : 0;
  const progress = total > 0 && itemIds && itemIds.length > 0 ? learnedCount / total : 0;
  const showProgress = Boolean(itemIds && itemIds.length > 0 && !disabled);
  const complete = showProgress && learnedCount === total;

  const countLabel = disabled
    ? "準備中"
    : showProgress
      ? `${learnedCount}/${total}`
      : `${group.itemCount} 件`;

  const body = (
    <div className="relative z-10 flex items-start gap-3">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${
          disabled
            ? "bg-zinc-200 dark:bg-zinc-800"
            : complete
              ? "bg-emerald-50 dark:bg-emerald-950/70"
              : "bg-indigo-50 dark:bg-indigo-950/60"
        }`}
      >
        {group.emoji}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p
            className={`font-semibold ${
              disabled
                ? "text-zinc-700 dark:text-zinc-300"
                : "text-zinc-900 dark:text-zinc-50"
            }`}
          >
            {group.labelJa}
          </p>
          <span
            className={`shrink-0 text-xs tabular-nums ${
              complete
                ? "font-medium text-emerald-700 dark:text-emerald-300"
                : "text-zinc-400"
            }`}
          >
            {countLabel}
          </span>
        </div>
        <p className="mt-2 rounded-xl border border-amber-200/70 bg-amber-50/90 px-3 py-2 text-sm leading-relaxed text-amber-950 dark:border-amber-800/50 dark:bg-amber-950/35 dark:text-amber-100">
          <span className="font-semibold text-amber-800 dark:text-amber-200">
            {group.headWord}
          </span>
          <span className="text-amber-700/80 dark:text-amber-300/80"> = </span>
          <span>「{group.coreImage}」</span>
        </p>
      </div>
      {!disabled && !showProgress && (
        <span className="mt-1 shrink-0 text-zinc-300 dark:text-zinc-600" aria-hidden>
          ›
        </span>
      )}
    </div>
  );

  if (disabled) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 opacity-60 dark:border-zinc-800 dark:bg-zinc-900/50">
        {body}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={`relative block overflow-hidden rounded-2xl border p-4 shadow-sm transition active:scale-[0.98] ${
        complete
          ? "border-emerald-300 dark:border-emerald-700"
          : "border-zinc-200 dark:border-zinc-800"
      } bg-white dark:bg-zinc-900`}
    >
      {showProgress && progress > 0 && (
        <div
          className={`pointer-events-none absolute inset-y-0 left-0 transition-[width] duration-300 ease-out ${
            complete
              ? "bg-emerald-200/90 dark:bg-emerald-800/55"
              : "bg-emerald-100/95 dark:bg-emerald-900/45"
          }`}
          style={{ width: `${Math.min(100, progress * 100)}%` }}
          aria-hidden
        />
      )}
      {body}
    </Link>
  );
}
