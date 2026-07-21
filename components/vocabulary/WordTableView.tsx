"use client";

import { useMemo, useState } from "react";
import type { Level, LevelId, VocabularyWord } from "@/lib/vocabulary";
import { countLearnedInList } from "@/lib/learned-words-storage";
import { useLearnedWords } from "@/hooks/useLearnedWords";
import { LearnedStarButton } from "@/components/vocabulary/LearnedStarButton";

type WordTableViewProps = {
  posLabel: string;
  levels: Level[];
  words: VocabularyWord[];
};

export function WordTableView({ posLabel, levels, words }: WordTableViewProps) {
  const { learned } = useLearnedWords();

  const wordsByLevel = useMemo(() => {
    const map = new Map<LevelId, VocabularyWord[]>();
    for (const level of levels) {
      map.set(
        level.id,
        words.filter((w) => w.level === level.id),
      );
    }
    return map;
  }, [levels, words]);

  const firstLevelWithWords =
    levels.find((l) => (wordsByLevel.get(l.id)?.length ?? 0) > 0)?.id ?? levels[0]?.id ?? "1";

  const [activeLevel, setActiveLevel] = useState<LevelId>(firstLevelWithWords as LevelId);

  const activeWords = wordsByLevel.get(activeLevel) ?? [];
  const learnedInLevel = countLearnedInList(
    learned,
    activeWords.map((w) => w.id),
  );

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {posLabel} · ☆タップで「覚えた」を付け外しできます
      </p>

      <div className="flex rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800/80">
        {levels.map((level) => {
          const count = wordsByLevel.get(level.id)?.length ?? 0;
          return (
            <button
              key={level.id}
              type="button"
              disabled={count === 0}
              onClick={() => setActiveLevel(level.id)}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition disabled:opacity-35 ${
                activeLevel === level.id
                  ? "bg-white text-indigo-700 shadow-sm dark:bg-zinc-900 dark:text-indigo-300"
                  : "text-zinc-600 dark:text-zinc-400"
              }`}
            >
              {level.labelJa.replace(" ", "")}
            </button>
          );
        })}
      </div>

      <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
        覚えた {learnedInLevel} / {activeWords.length} 語
      </p>

      {activeWords.length === 0 ? (
        <p className="py-12 text-center text-sm text-zinc-500">このレベルの単語はまだありません</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <div className="grid grid-cols-[2rem_1fr_1fr_2.75rem] gap-x-2 border-b border-zinc-200 bg-zinc-50 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-400">
            <span>#</span>
            <span>English</span>
            <span>日本語</span>
            <span className="text-center">覚</span>
          </div>
          <ul className="max-h-[min(60vh,520px)] divide-y divide-zinc-100 overflow-y-auto dark:divide-zinc-800">
            {activeWords.map((word, i) => (
              <li key={word.id} className="px-3 py-2.5">
                <div className="grid grid-cols-[2rem_1fr_1fr_2.75rem] items-center gap-x-2 text-sm">
                  <span className="tabular-nums text-zinc-400">{i + 1}</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">{word.en}</span>
                  <span className="text-zinc-600 dark:text-zinc-300">{word.ja}</span>
                  <div className="flex justify-center">
                    <LearnedStarButton wordId={word.id} size="sm" />
                  </div>
                </div>
                {(word.exampleEn || word.exampleJa) && (
                  <div className="mt-1.5 ml-8 border-l-2 border-zinc-200 pl-3 dark:border-zinc-700">
                    {word.exampleEn && (
                      <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                        {word.exampleEn}
                      </p>
                    )}
                    {word.exampleJa && (
                      <p className="text-xs leading-relaxed text-zinc-400 dark:text-zinc-500">
                        {word.exampleJa}
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
