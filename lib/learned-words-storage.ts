const STORAGE_KEY = "vocabulary-learned-ids";

export const LEARNED_CHANGED_EVENT = "vocabulary-learned-changed";

export function readLearnedIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((id): id is string => typeof id === "string"));
  } catch {
    return new Set();
  }
}

export function writeLearnedIds(ids: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    /* ignore */
  }
}

export function countLearnedInList(ids: Set<string>, wordIds: string[]): number {
  return wordIds.filter((id) => ids.has(id)).length;
}
