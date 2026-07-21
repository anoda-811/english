"use client";

import { useCallback, useEffect, useState } from "react";
import { LEARNED_CHANGED_EVENT, readLearnedIds, writeLearnedIds } from "@/lib/learned-words-storage";

export function useLearnedWords() {
  const [learned, setLearned] = useState<Set<string>>(() => new Set());

  const sync = useCallback(() => setLearned(readLearnedIds()), []);

  useEffect(() => {
    sync();
    window.addEventListener(LEARNED_CHANGED_EVENT, sync);
    const onStorage = (e: StorageEvent) => {
      if (e.key === "vocabulary-learned-ids") sync();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(LEARNED_CHANGED_EVENT, sync);
      window.removeEventListener("storage", onStorage);
    };
  }, [sync]);

  const toggle = useCallback((wordId: string) => {
    setLearned((prev) => {
      const next = new Set(prev);
      if (next.has(wordId)) next.delete(wordId);
      else next.add(wordId);
      writeLearnedIds(next);
      window.dispatchEvent(new Event(LEARNED_CHANGED_EVENT));
      return next;
    });
  }, []);

  const isLearned = useCallback((wordId: string) => learned.has(wordId), [learned]);

  return { learned, toggle, isLearned };
}
