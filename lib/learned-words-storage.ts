const STORAGE_KEY = "vocabulary-learned-ids";

export const LEARNED_CHANGED_EVENT = "vocabulary-learned-changed";

const EMPTY = new Set<string>();

let cached: Set<string> = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(LEARNED_CHANGED_EVENT));
  }
}

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

/** Ensure cache matches localStorage (idempotent). */
export function hydrateLearnedIds(): Set<string> {
  if (typeof window === "undefined") return EMPTY;
  cached = readLearnedIds();
  hydrated = true;
  return cached;
}

export function getLearnedSnapshot(): Set<string> {
  return cached;
}

export function getLearnedServerSnapshot(): Set<string> {
  return EMPTY;
}

export function subscribeLearned(listener: () => void): () => void {
  if (typeof window !== "undefined" && !hydrated) {
    hydrateLearnedIds();
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function toggleLearnedId(wordId: string): Set<string> {
  if (typeof window !== "undefined" && !hydrated) {
    hydrateLearnedIds();
  }
  const next = new Set(cached);
  if (next.has(wordId)) next.delete(wordId);
  else next.add(wordId);
  cached = next;
  writeLearnedIds(next);
  emit();
  return next;
}

export function countLearnedInList(ids: Set<string>, wordIds: string[]): number {
  return wordIds.filter((id) => ids.has(id)).length;
}

/** Other tabs / windows */
export function bindLearnedStorageSync() {
  if (typeof window === "undefined") return () => {};
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    hydrateLearnedIds();
    listeners.forEach((listener) => listener());
  };
  window.addEventListener("storage", onStorage);
  return () => window.removeEventListener("storage", onStorage);
}
