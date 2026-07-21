"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import {
  bindLearnedStorageSync,
  getLearnedServerSnapshot,
  getLearnedSnapshot,
  subscribeLearned,
  toggleLearnedId,
} from "@/lib/learned-words-storage";

export function useLearnedWords() {
  const learned = useSyncExternalStore(
    subscribeLearned,
    getLearnedSnapshot,
    getLearnedServerSnapshot,
  );

  useEffect(() => bindLearnedStorageSync(), []);

  const toggle = useCallback((wordId: string) => {
    toggleLearnedId(wordId);
  }, []);

  const isLearned = useCallback((wordId: string) => learned.has(wordId), [learned]);

  return { learned, toggle, isLearned };
}
