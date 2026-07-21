"use client";

import { useMemo, useState } from "react";
import type { IdiomGroup, IdiomItem } from "@/lib/idioms";
import { countLearnedInList } from "@/lib/learned-words-storage";
import { useLearnedWords } from "@/hooks/useLearnedWords";
import { LearnedStarButton } from "@/components/vocabulary/LearnedStarButton";

type IdiomTableViewProps = {
  classificationLabel: string;
  groups: IdiomGroup[];
  items: IdiomItem[];
};

export function IdiomTableView({ classificationLabel, groups, items }: IdiomTableViewProps) {
  const { learned } = useLearnedWords();

  const itemsByGroup = useMemo(() => {
    const map = new Map<string, IdiomItem[]>();
    for (const group of groups) {
      map.set(
        group.id,
        items.filter((i) => i.groupId === group.id),
      );
    }
    return map;
  }, [groups, items]);

  const firstGroupWithItems =
    groups.find((g) => (itemsByGroup.get(g.id)?.length ?? 0) > 0)?.id ?? groups[0]?.id ?? "";

  const [activeGroupId, setActiveGroupId] = useState(firstGroupWithItems);

  const activeItems = itemsByGroup.get(activeGroupId) ?? [];
  const activeGroup = groups.find((g) => g.id === activeGroupId);
  const learnedCount = countLearnedInList(
    learned,
    activeItems.map((i) => i.id),
  );

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {classificationLabel} · ☆タップで「覚えた」を付け外し
      </p>

      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {groups.map((group) => {
          const count = itemsByGroup.get(group.id)?.length ?? 0;
          return (
            <button
              key={group.id}
              type="button"
              disabled={count === 0}
              onClick={() => setActiveGroupId(group.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition disabled:opacity-35 ${
                activeGroupId === group.id
                  ? "bg-indigo-600 text-white"
                  : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              }`}
            >
              {group.labelJa}
            </button>
          );
        })}
      </div>

      {activeGroup && (
        <p className="rounded-xl border border-amber-200/70 bg-amber-50/90 px-3 py-2 text-sm leading-relaxed text-amber-950 dark:border-amber-800/50 dark:bg-amber-950/35 dark:text-amber-100">
          <span className="font-semibold text-amber-800 dark:text-amber-200">
            {activeGroup.headWord}
          </span>
          <span className="text-amber-700/80 dark:text-amber-300/80"> = </span>
          <span>「{activeGroup.coreImage}」</span>
        </p>
      )}

      <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
        覚えた {learnedCount} / {activeItems.length} 件
      </p>

      {activeItems.length === 0 ? (
        <p className="py-12 text-center text-sm text-zinc-500">この編の熟語はまだありません</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <div className="grid grid-cols-[2rem_1fr_1fr_2.75rem] gap-x-2 border-b border-zinc-200 bg-zinc-50 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-400">
            <span>#</span>
            <span>English</span>
            <span>日本語</span>
            <span className="text-center">覚</span>
          </div>
          <ul className="max-h-[min(60vh,520px)] divide-y divide-zinc-100 overflow-y-auto dark:divide-zinc-800">
            {activeItems.map((item, i) => (
              <li key={item.id} className="px-3 py-2.5">
                <div className="grid grid-cols-[2rem_1fr_1fr_2.75rem] items-center gap-x-2 text-sm">
                  <span className="tabular-nums text-zinc-400">{i + 1}</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">{item.en}</span>
                  <span className="text-zinc-600 dark:text-zinc-300">{item.ja}</span>
                  <div className="flex justify-center">
                    <LearnedStarButton wordId={item.id} size="sm" />
                  </div>
                </div>
                {(item.exampleEn || item.exampleJa) && (
                  <div className="mt-1.5 ml-8 border-l-2 border-zinc-200 pl-3 dark:border-zinc-700">
                    {item.exampleEn && (
                      <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                        {item.exampleEn}
                      </p>
                    )}
                    {item.exampleJa && (
                      <p className="text-xs leading-relaxed text-zinc-400 dark:text-zinc-500">
                        {item.exampleJa}
                      </p>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
