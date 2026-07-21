"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { countLearnedInList } from "@/lib/learned-words-storage";
import { useLearnedWords } from "@/hooks/useLearnedWords";

type NavCardProps = {
  href: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  meta?: string;
  disabled?: boolean;
  /** ★進捗を出す対象の単語 / 熟語 ID */
  itemIds?: string[];
};

export function NavCard({
  href,
  title,
  description,
  icon,
  meta,
  disabled,
  itemIds,
}: NavCardProps) {
  const { learned } = useLearnedWords();
  const total = itemIds?.length ?? 0;
  const learnedCount = total > 0 ? countLearnedInList(learned, itemIds!) : 0;
  const progress = total > 0 ? learnedCount / total : 0;
  const showProgress = total > 0 && !disabled;
  const complete = showProgress && learnedCount === total;

  const progressLabel = showProgress ? `${learnedCount}/${total}` : meta;

  if (disabled) {
    return (
      <div className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 opacity-60 dark:border-zinc-800 dark:bg-zinc-900/50">
        {icon && (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-200 text-2xl dark:bg-zinc-800">
            {icon}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-zinc-700 dark:text-zinc-300">{title}</p>
          {description && (
            <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
          )}
        </div>
        {meta && <span className="text-xs text-zinc-400">{meta}</span>}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={`relative flex items-center gap-4 overflow-hidden rounded-2xl border p-4 shadow-sm transition active:scale-[0.98] ${
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
      <div className="relative z-10 flex min-w-0 flex-1 items-center gap-4">
        {icon && (
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${
              complete
                ? "bg-emerald-50 dark:bg-emerald-950/70"
                : "bg-indigo-50 dark:bg-indigo-950/60"
            }`}
          >
            {icon}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-zinc-900 dark:text-zinc-50">{title}</p>
          {description && (
            <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
          )}
        </div>
        {progressLabel ? (
          <span
            className={`shrink-0 text-xs tabular-nums ${
              complete
                ? "font-medium text-emerald-700 dark:text-emerald-300"
                : "text-zinc-400 dark:text-zinc-500"
            }`}
          >
            {progressLabel}
          </span>
        ) : (
          <span className="shrink-0 text-zinc-300 dark:text-zinc-600" aria-hidden>
            ›
          </span>
        )}
      </div>
    </Link>
  );
}

export function PageShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto min-h-full w-full max-w-lg flex-1 ${className}`}>{children}</div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
      {children}
    </h2>
  );
}
