"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import {
  bindLearnedStorageSync,
  getLearnedServerSnapshot,
  getLearnedSnapshot,
  markLearnedId,
  subscribeLearned,
  toggleLearnedId,
  unmarkLearnedId,
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

  const markLearned = useCallback((wordId: string) => markLearnedId(wordId), []);
  const unmarkLearned = useCallback((wordId: string) => unmarkLearnedId(wordId), []);

  const isLearned = useCallback((wordId: string) => learned.has(wordId), [learned]);

  return { learned, toggle, markLearned, unmarkLearned, isLearned };
}
