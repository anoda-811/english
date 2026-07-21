import Link from "next/link";
import type { IdiomGroup } from "@/lib/idioms";

type IdiomGroupCardProps = {
  href: string;
  group: IdiomGroup & { itemCount: number };
  disabled?: boolean;
};

export function IdiomGroupCard({ href, group, disabled }: IdiomGroupCardProps) {
  const body = (
    <>
      <div className="flex items-start gap-3">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${
            disabled
              ? "bg-zinc-200 dark:bg-zinc-800"
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
            <span className="shrink-0 text-xs text-zinc-400">
              {disabled ? "準備中" : `${group.itemCount} 件`}
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
        {!disabled && (
          <span className="mt-1 shrink-0 text-zinc-300 dark:text-zinc-600" aria-hidden>
            ›
          </span>
        )}
      </div>
    </>
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
      className="block rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition active:scale-[0.98] active:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:active:bg-zinc-800/80"
    >
      {body}
    </Link>
  );
}
