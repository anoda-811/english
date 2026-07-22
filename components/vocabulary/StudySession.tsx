"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { StudyCardItem } from "@/lib/study-types";
import { speakEnglish, stopSpeaking } from "@/lib/speak-english";
import { LearnedStarButton } from "@/components/vocabulary/LearnedStarButton";
import { WordSceneAnimation, hasWordScene } from "@/components/vocabulary/WordSceneAnimation";
import { useLearnedWords } from "@/hooks/useLearnedWords";

export type HideSide = "en" | "ja" | "none";
export type OrderMode = "sequential" | "random";
export type StarFilter = "all" | "learned" | "unlearned";

const HIDE_SIDE_KEY = "vocabulary-hide-side";
const ORDER_MODE_KEY = "vocabulary-order-mode";
const STAR_FILTER_KEY = "vocabulary-star-filter";

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function filterByStar(
  items: StudyCardItem[],
  filter: StarFilter,
  learned: Set<string>,
): StudyCardItem[] {
  if (filter === "learned") return items.filter((w) => learned.has(w.id));
  if (filter === "unlearned") return items.filter((w) => !learned.has(w.id));
  return items;
}

function buildDeck(items: StudyCardItem[], mode: OrderMode): StudyCardItem[] {
  return mode === "random" ? shuffle(items) : [...items];
}

const HOLD_DELAY_MS = 350;
const HOLD_INTERVAL_MS = 90;
const SWIPE_AXIS_LOCK_PX = 12;
const SWIPE_COMMIT_PX = 96;
const SWIPE_EXIT_MS = 220;

type StudySessionProps = {
  words: StudyCardItem[];
  posLabel: string;
  levelLabel: string;
  /** すべてまとめて学習など、最初からランダムにしたいとき */
  preferRandom?: boolean;
};

export function StudySession({
  words,
  posLabel,
  levelLabel,
  preferRandom = false,
}: StudySessionProps) {
  const { learned, markLearned, unmarkLearned } = useLearnedWords();
  const [orderMode, setOrderMode] = useState<OrderMode>(preferRandom ? "random" : "sequential");
  const [starFilter, setStarFilter] = useState<StarFilter>("all");
  const [deck, setDeck] = useState<StudyCardItem[]>(() =>
    preferRandom ? buildDeck(words, "random") : [...words],
  );
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [exampleRevealed, setExampleRevealed] = useState(false);
  const [hideSide, setHideSide] = useState<HideSide>("ja");
  const [speaking, setSpeaking] = useState<"word" | "example" | null>(null);
  const [speakError, setSpeakError] = useState(false);
  const [swipeX, setSwipeX] = useState(0);
  const [swipeActive, setSwipeActive] = useState(false);
  const [swipeExit, setSwipeExit] = useState(false);
  const [scenePlayKey, setScenePlayKey] = useState(0);
  const [sceneVisible, setSceneVisible] = useState(false);

  const deckRef = useRef(deck);
  const indexRef = useRef(index);
  const orderModeRef = useRef(orderMode);
  const starFilterRef = useRef(starFilter);
  const learnedRef = useRef(learned);
  const wordsRef = useRef(words);
  const hideSideRef = useRef(hideSide);
  const holdDelayRef = useRef<number | null>(null);
  const holdIntervalRef = useRef<number | null>(null);
  const didHoldRepeatRef = useRef(false);
  const speakTokenRef = useRef(0);
  const swipePointerIdRef = useRef<number | null>(null);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const swipeAxisRef = useRef<"none" | "h" | "v">("none");
  const swipeXRef = useRef(0);
  const swipeMovedRef = useRef(false);
  const swipeBusyRef = useRef(false);

  useEffect(() => {
    deckRef.current = deck;
    indexRef.current = index;
    orderModeRef.current = orderMode;
    starFilterRef.current = starFilter;
    learnedRef.current = learned;
    wordsRef.current = words;
    hideSideRef.current = hideSide;
  }, [deck, index, orderMode, starFilter, learned, words, hideSide]);

  const resetRevealForHideMode = useCallback(() => {
    const showBoth = hideSideRef.current === "none";
    setRevealed(showBoth);
    setExampleRevealed(showBoth);
  }, []);

  const poolFrom = useCallback(
    (source: StudyCardItem[], filter: StarFilter, learnedSet: Set<string>) =>
      filterByStar(source, filter, learnedSet),
    [],
  );

  const rebuildDeck = useCallback(
    (
      mode: OrderMode,
      filter: StarFilter,
      learnedSet: Set<string>,
      source: StudyCardItem[] = wordsRef.current,
    ) => {
      const pool = poolFrom(source, filter, learnedSet);
      const next = buildDeck(pool, mode);
      deckRef.current = next;
      indexRef.current = 0;
      setDeck(next);
      setIndex(0);
      return next;
    },
    [poolFrom],
  );

  const clearHold = useCallback(() => {
    if (holdDelayRef.current !== null) {
      window.clearTimeout(holdDelayRef.current);
      holdDelayRef.current = null;
    }
    if (holdIntervalRef.current !== null) {
      window.clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearHold();
  }, [clearHold]);

  useEffect(() => {
    let mode: OrderMode = "random";
    let hide: HideSide = "ja";
    let star: StarFilter = "all";
    try {
      const storedHide = localStorage.getItem(HIDE_SIDE_KEY);
      if (storedHide === "en" || storedHide === "ja" || storedHide === "none") {
        hide = storedHide;
      }
      const storedStar = localStorage.getItem(STAR_FILTER_KEY);
      if (storedStar === "all" || storedStar === "learned" || storedStar === "unlearned") {
        star = storedStar;
      }
      if (!preferRandom) {
        const storedOrder = localStorage.getItem(ORDER_MODE_KEY);
        if (storedOrder === "sequential" || storedOrder === "random") {
          mode = storedOrder;
        }
      }
    } catch {
      /* ignore */
    }
    setHideSide(hide);
    hideSideRef.current = hide;
    setStarFilter(star);
    starFilterRef.current = star;
    setOrderMode(mode);
    rebuildDeck(mode, star, learnedRef.current, words);
    const showBoth = hide === "none";
    setRevealed(showBoth);
    setExampleRevealed(showBoth);
  }, [words, preferRandom, rebuildDeck]);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const persistHideSide = useCallback((side: HideSide) => {
    setHideSide(side);
    try {
      localStorage.setItem(HIDE_SIDE_KEY, side);
    } catch {
      /* ignore */
    }
  }, []);

  const persistStarFilter = useCallback(
    (filter: StarFilter) => {
      speakTokenRef.current += 1;
      stopSpeaking();
      setSpeaking(null);
      setSpeakError(false);
      setStarFilter(filter);
      starFilterRef.current = filter;
      rebuildDeck(orderModeRef.current, filter, learnedRef.current);
      resetRevealForHideMode();
      try {
        localStorage.setItem(STAR_FILTER_KEY, filter);
      } catch {
        /* ignore */
      }
    },
    [rebuildDeck, resetRevealForHideMode],
  );

  const applyOrderMode = useCallback(
    (mode: OrderMode) => {
      speakTokenRef.current += 1;
      stopSpeaking();
      setSpeaking(null);
      setSpeakError(false);
      setOrderMode(mode);
      rebuildDeck(mode, starFilterRef.current, learnedRef.current);
      resetRevealForHideMode();
      try {
        localStorage.setItem(ORDER_MODE_KEY, mode);
      } catch {
        /* ignore */
      }
    },
    [rebuildDeck, resetRevealForHideMode],
  );

  const reshuffle = () => {
    speakTokenRef.current += 1;
    stopSpeaking();
    setSpeaking(null);
    setSpeakError(false);
    rebuildDeck("random", starFilterRef.current, learnedRef.current);
    resetRevealForHideMode();
  };

  const current = deck[index];
  const total = deck.length;
  const progress = total > 0 ? index + 1 : 0;

  const stopSpeech = () => {
    speakTokenRef.current += 1;
    stopSpeaking();
    setSpeaking(null);
    setSpeakError(false);
  };

  const advanceNext = useCallback(() => {
    stopSpeech();
    resetRevealForHideMode();

    const i = indexRef.current;
    const d = deckRef.current;
    if (d.length === 0) return;
    if (i >= d.length - 1) {
      const pool = poolFrom(wordsRef.current, starFilterRef.current, learnedRef.current);
      const newDeck = buildDeck(pool, orderModeRef.current);
      deckRef.current = newDeck;
      indexRef.current = 0;
      setDeck(newDeck);
      setIndex(0);
    } else {
      indexRef.current = i + 1;
      setIndex(i + 1);
    }
  }, [poolFrom, resetRevealForHideMode]);

  const advancePrev = useCallback(() => {
    stopSpeech();
    resetRevealForHideMode();

    const i = indexRef.current;
    const d = deckRef.current;
    if (d.length === 0) return;
    if (i <= 0) {
      const pool = poolFrom(wordsRef.current, starFilterRef.current, learnedRef.current);
      const newDeck = buildDeck(pool, orderModeRef.current);
      const last = Math.max(0, newDeck.length - 1);
      deckRef.current = newDeck;
      indexRef.current = last;
      setDeck(newDeck);
      setIndex(last);
    } else {
      indexRef.current = i - 1;
      setIndex(i - 1);
    }
  }, [poolFrom, resetRevealForHideMode]);

  const resetSwipeVisual = useCallback(() => {
    swipeXRef.current = 0;
    setSwipeX(0);
    setSwipeActive(false);
    setSwipeExit(false);
    swipeAxisRef.current = "none";
    swipeStartRef.current = null;
    swipePointerIdRef.current = null;
    swipeMovedRef.current = false;
  }, []);

  useEffect(() => {
    resetSwipeVisual();
    swipeBusyRef.current = false;
    setSceneVisible(false);
  }, [index, current?.id, resetSwipeVisual]);

  const commitSwipe = useCallback(
    (direction: "left" | "right") => {
      if (swipeBusyRef.current) return;
      const card = deckRef.current[indexRef.current];
      if (!card) return;
      swipeBusyRef.current = true;
      setSwipeExit(true);
      const exitX = direction === "right" ? window.innerWidth : -window.innerWidth;
      swipeXRef.current = exitX;
      setSwipeX(exitX);

      window.setTimeout(() => {
        // 左 = ★つけて次へ / 右 = ★外して次へ
        if (direction === "left") {
          learnedRef.current = markLearned(card.id);
        } else {
          learnedRef.current = unmarkLearned(card.id);
        }
        advanceNext();
        resetSwipeVisual();
        swipeBusyRef.current = false;
      }, SWIPE_EXIT_MS);
    },
    [advanceNext, markLearned, unmarkLearned, resetSwipeVisual],
  );

  const onCardPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || swipeBusyRef.current) return;
    swipePointerIdRef.current = e.pointerId;
    swipeStartRef.current = { x: e.clientX, y: e.clientY };
    swipeAxisRef.current = "none";
    swipeMovedRef.current = false;
    swipeXRef.current = 0;
    setSwipeX(0);
    setSwipeActive(true);
    setSwipeExit(false);
  };

  const onCardPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (swipePointerIdRef.current !== e.pointerId || !swipeStartRef.current) return;
    const dx = e.clientX - swipeStartRef.current.x;
    const dy = e.clientY - swipeStartRef.current.y;

    if (swipeAxisRef.current === "none") {
      if (Math.abs(dx) < SWIPE_AXIS_LOCK_PX && Math.abs(dy) < SWIPE_AXIS_LOCK_PX) return;
      swipeAxisRef.current = Math.abs(dx) >= Math.abs(dy) ? "h" : "v";
      if (swipeAxisRef.current === "h") {
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
      }
    }

    if (swipeAxisRef.current !== "h") return;
    e.preventDefault();
    if (Math.abs(dx) > 6) swipeMovedRef.current = true;
    swipeXRef.current = dx;
    setSwipeX(dx);
  };

  const onCardPointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (swipePointerIdRef.current !== e.pointerId) return;
    const dx = swipeXRef.current;
    const wasHorizontal = swipeAxisRef.current === "h";
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      /* ignore */
    }
    swipePointerIdRef.current = null;
    swipeStartRef.current = null;
    swipeAxisRef.current = "none";
    setSwipeActive(false);

    if (wasHorizontal && Math.abs(dx) >= SWIPE_COMMIT_PX) {
      commitSwipe(dx > 0 ? "right" : "left");
      return;
    }
    swipeXRef.current = 0;
    setSwipeX(0);
    setSwipeExit(false);
  };

  const onCardClickCapture = (e: React.MouseEvent) => {
    if (swipeMovedRef.current || swipeBusyRef.current) {
      e.preventDefault();
      e.stopPropagation();
      swipeMovedRef.current = false;
    }
  };

  const onSpeak = async () => {
    if (!current) return;
    const token = ++speakTokenRef.current;
    setSpeakError(false);
    setSpeaking("word");
    try {
      const result = await speakEnglish(current.en);
      if (speakTokenRef.current !== token) return;
      if (result === "failed") setSpeakError(true);
    } finally {
      if (speakTokenRef.current === token) {
        setSpeaking(null);
      }
    }
  };

  const onSpeakExample = async () => {
    if (!current?.exampleEn) return;
    const token = ++speakTokenRef.current;
    setSpeakError(false);
    setSpeaking("example");
    try {
      const result = await speakEnglish(current.exampleEn);
      if (speakTokenRef.current !== token) return;
      if (result === "failed") setSpeakError(true);
    } finally {
      if (speakTokenRef.current === token) {
        setSpeaking(null);
      }
    }
  };

  const makeHoldHandlers = (advance: () => void) => ({
    onPointerDown: (e: React.PointerEvent<HTMLButtonElement>) => {
      if (e.button !== 0) return;
      didHoldRepeatRef.current = false;
      clearHold();
      e.currentTarget.setPointerCapture(e.pointerId);

      holdDelayRef.current = window.setTimeout(() => {
        didHoldRepeatRef.current = true;
        advance();
        holdIntervalRef.current = window.setInterval(advance, HOLD_INTERVAL_MS);
      }, HOLD_DELAY_MS);
    },
    onPointerUp: (e: React.PointerEvent<HTMLButtonElement>) => {
      clearHold();
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
      if (!didHoldRepeatRef.current) {
        advance();
      }
    },
    onPointerCancel: () => {
      clearHold();
    },
    onPointerLeave: () => {
      clearHold();
    },
  });

  const prevHold = makeHoldHandlers(advancePrev);
  const nextHold = makeHoldHandlers(advanceNext);
  if (!current) {
    const emptyMessage =
      starFilter === "learned"
        ? "★をつけた単語がありません。"
        : starFilter === "unlearned"
          ? "★をつけていない単語がありません。"
          : "この条件の単語がありません。";
    return (
      <div className="flex flex-col gap-2.5 px-4 pb-5 pt-1">
        <div className="flex flex-col gap-2">
          <div className="flex rounded-lg bg-zinc-100 p-0.5 dark:bg-zinc-800/80">
            <button
              type="button"
              onClick={() => persistStarFilter("all")}
              className={`flex-1 rounded-md py-1.5 text-[11px] font-medium transition ${
                starFilter === "all"
                  ? "bg-white text-indigo-700 shadow-sm dark:bg-zinc-900 dark:text-indigo-300"
                  : "text-zinc-600 dark:text-zinc-400"
              }`}
            >
              全部
            </button>
            <button
              type="button"
              onClick={() => persistStarFilter("learned")}
              className={`flex-1 rounded-md py-1.5 text-[11px] font-medium transition ${
                starFilter === "learned"
                  ? "bg-white text-indigo-700 shadow-sm dark:bg-zinc-900 dark:text-indigo-300"
                  : "text-zinc-600 dark:text-zinc-400"
              }`}
            >
              ★のみ
            </button>
            <button
              type="button"
              onClick={() => persistStarFilter("unlearned")}
              className={`flex-1 rounded-md py-1.5 text-[11px] font-medium transition ${
                starFilter === "unlearned"
                  ? "bg-white text-indigo-700 shadow-sm dark:bg-zinc-900 dark:text-indigo-300"
                  : "text-zinc-600 dark:text-zinc-400"
              }`}
            >
              ★なし
            </button>
          </div>
        </div>
        <p className="px-4 py-12 text-center text-zinc-500">{emptyMessage}</p>
      </div>
    );
  }

  const enHidden = hideSide === "en" && !revealed;
  const jaHidden = hideSide === "ja" && !revealed;
  const exampleEnHidden = hideSide === "en" && !exampleRevealed;
  const exampleJaHidden = hideSide === "ja" && !exampleRevealed;
  const hasExample = Boolean(current.exampleEn || current.exampleJa);

  return (
    <div className="flex flex-col gap-2.5 px-4 pb-5 pt-1">
      <div className="flex items-center justify-center gap-1.5">
        <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
          {posLabel} · {levelLabel} · {progress}/{total}
        </p>
        <LearnedStarButton wordId={current.id} size="sm" />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex rounded-lg bg-zinc-100 p-0.5 dark:bg-zinc-800/80">
          <button
            type="button"
            onClick={() => applyOrderMode("sequential")}
            className={`flex-1 rounded-md py-1.5 text-[11px] font-medium transition ${
              orderMode === "sequential"
                ? "bg-white text-indigo-700 shadow-sm dark:bg-zinc-900 dark:text-indigo-300"
                : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            順番
          </button>
          <button
            type="button"
            onClick={() => applyOrderMode("random")}
            className={`flex-1 rounded-md py-1.5 text-[11px] font-medium transition ${
              orderMode === "random"
                ? "bg-white text-indigo-700 shadow-sm dark:bg-zinc-900 dark:text-indigo-300"
                : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            ランダム
          </button>
        </div>
        <div className="flex rounded-lg bg-zinc-100 p-0.5 dark:bg-zinc-800/80">
          <button
            type="button"
            onClick={() => {
              persistHideSide("ja");
              setRevealed(false);
              setExampleRevealed(false);
            }}
            className={`flex-1 rounded-md py-1.5 text-[11px] font-medium transition ${
              hideSide === "ja"
                ? "bg-white text-indigo-700 shadow-sm dark:bg-zinc-900 dark:text-indigo-300"
                : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            日を隠す
          </button>
          <button
            type="button"
            onClick={() => {
              persistHideSide("en");
              setRevealed(false);
              setExampleRevealed(false);
            }}
            className={`flex-1 rounded-md py-1.5 text-[11px] font-medium transition ${
              hideSide === "en"
                ? "bg-white text-indigo-700 shadow-sm dark:bg-zinc-900 dark:text-indigo-300"
                : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            英を隠す
          </button>
          <button
            type="button"
            onClick={() => {
              persistHideSide("none");
              setRevealed(true);
              setExampleRevealed(true);
            }}
            className={`flex-1 rounded-md py-1.5 text-[11px] font-medium transition ${
              hideSide === "none"
                ? "bg-white text-indigo-700 shadow-sm dark:bg-zinc-900 dark:text-indigo-300"
                : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            隠さない
          </button>
        </div>
        <div className="flex rounded-lg bg-zinc-100 p-0.5 dark:bg-zinc-800/80">
          <button
            type="button"
            onClick={() => persistStarFilter("all")}
            className={`flex-1 rounded-md py-1.5 text-[11px] font-medium transition ${
              starFilter === "all"
                ? "bg-white text-indigo-700 shadow-sm dark:bg-zinc-900 dark:text-indigo-300"
                : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            全部
          </button>
          <button
            type="button"
            onClick={() => persistStarFilter("learned")}
            className={`flex-1 rounded-md py-1.5 text-[11px] font-medium transition ${
              starFilter === "learned"
                ? "bg-white text-indigo-700 shadow-sm dark:bg-zinc-900 dark:text-indigo-300"
                : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            ★のみ
          </button>
          <button
            type="button"
            onClick={() => persistStarFilter("unlearned")}
            className={`flex-1 rounded-md py-1.5 text-[11px] font-medium transition ${
              starFilter === "unlearned"
                ? "bg-white text-indigo-700 shadow-sm dark:bg-zinc-900 dark:text-indigo-300"
                : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            ★なし
          </button>
        </div>
      </div>

      {orderMode === "random" && (
        <button
          type="button"
          onClick={reshuffle}
          className="-mt-1 self-center px-2 py-0.5 text-[10px] font-medium text-indigo-600 dark:text-indigo-400"
        >
          シャッフル
        </button>
      )}

      <p className="text-center text-[10px] text-zinc-400">
        左スワイプで★覚えた → 次へ · 右スワイプで覚えていない → 次へ
      </p>

      <div
        className="relative touch-none select-none"
        onPointerDown={onCardPointerDown}
        onPointerMove={onCardPointerMove}
        onPointerUp={onCardPointerEnd}
        onPointerCancel={onCardPointerEnd}
        onClickCapture={onCardClickCapture}
      >
        <div
          className={`pointer-events-none absolute inset-y-4 left-3 z-20 flex items-center text-sm font-semibold transition-opacity ${
            swipeX > 24 ? "opacity-100" : "opacity-0"
          } text-zinc-400`}
          aria-hidden
        >
          覚えていない
        </div>
        <div
          className={`pointer-events-none absolute inset-y-4 right-3 z-20 flex items-center text-sm font-bold transition-opacity ${
            swipeX < -24 ? "opacity-100" : "opacity-0"
          } text-amber-400`}
          aria-hidden
        >
          ★覚えた
        </div>
        <div
          className={`grid h-[min(34vh,260px)] grid-rows-2 overflow-hidden rounded-2xl border bg-white shadow-sm will-change-transform dark:bg-zinc-900 ${
            swipeExit ? "" : "transition-transform duration-150 ease-out"
          } ${
            swipeX < -40
              ? "border-amber-300 dark:border-amber-600"
              : swipeX > 40
                ? "border-zinc-300 dark:border-zinc-600"
                : "border-zinc-200 dark:border-zinc-700"
          }`}
          style={{
            transform: `translateX(${swipeX}px) rotate(${swipeX / 28}deg)`,
            opacity: swipeExit ? 0.35 : 1 - Math.min(0.35, Math.abs(swipeX) / 420),
            transition: swipeExit
              ? `transform ${SWIPE_EXIT_MS}ms ease-in, opacity ${SWIPE_EXIT_MS}ms ease-in`
              : swipeActive
                ? "none"
                : undefined,
          }}
        >
          <button
            type="button"
            onClick={() => setRevealed((r) => !r)}
            className="flex min-h-0 flex-col items-center justify-center border-b border-zinc-100 bg-gradient-to-b from-indigo-50/80 to-white px-4 py-2 transition active:bg-indigo-50/50 dark:border-zinc-800 dark:from-indigo-950/30 dark:to-zinc-900 dark:active:bg-indigo-950/20"
          >
            <span className="mb-1 shrink-0 text-[10px] font-medium uppercase tracking-widest text-indigo-500/80">
              English
            </span>
            <p
              className={`line-clamp-2 max-w-full px-1 text-center text-2xl font-bold leading-tight tracking-tight text-zinc-900 transition dark:text-zinc-50 ${
                enHidden ? "select-none blur-md opacity-40" : ""
              }`}
            >
              {current.en}
            </p>
            <span
              className={`mt-1 h-4 shrink-0 text-[10px] text-zinc-400 ${enHidden ? "" : "invisible"}`}
              aria-hidden={!enHidden}
            >
              タップで表示
            </span>
          </button>
          <button
            type="button"
            onClick={() => setRevealed((r) => !r)}
            className="flex min-h-0 flex-col items-center justify-center px-4 py-2 transition active:bg-zinc-50 dark:active:bg-zinc-800/50"
          >
            <span className="mb-1 shrink-0 text-[10px] font-medium uppercase tracking-widest text-zinc-400">
              日本語
            </span>
            <p
              className={`line-clamp-2 max-w-full px-1 text-center text-xl font-semibold leading-tight text-zinc-800 transition dark:text-zinc-100 ${
                jaHidden ? "select-none blur-md opacity-40" : ""
              }`}
            >
              {current.ja}
            </p>
            <span
              className={`mt-1 h-4 shrink-0 text-[10px] text-zinc-400 ${jaHidden ? "" : "invisible"}`}
              aria-hidden={!jaHidden}
            >
              タップで表示
            </span>
          </button>
        </div>
      </div>

      {hasExample && (
        <button
          type="button"
          onClick={() => setExampleRevealed((r) => !r)}
          className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-left transition active:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900/70 dark:active:bg-zinc-800/70"
        >
          <p className="text-[9px] font-semibold uppercase tracking-wider text-zinc-400">
            Example
          </p>
          {current.exampleEn && (
            <p
              className={`mt-0.5 line-clamp-2 text-xs leading-snug text-zinc-900 dark:text-zinc-50 ${
                exampleEnHidden ? "select-none blur-sm opacity-40" : ""
              }`}
            >
              {current.exampleEn}
            </p>
          )}
          {current.exampleJa && (
            <p
              className={`mt-0.5 line-clamp-2 text-xs leading-snug text-zinc-600 dark:text-zinc-300 ${
                exampleJaHidden ? "select-none blur-sm opacity-40" : ""
              }`}
            >
              {current.exampleJa}
            </p>
          )}
          {(exampleEnHidden || exampleJaHidden) && (
            <p className="mt-1 text-[10px] text-zinc-400">タップで例文</p>
          )}
        </button>
      )}

      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={onSpeak}
          disabled={speaking !== null}
          className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-semibold text-indigo-700 active:scale-95 disabled:opacity-60 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300"
          aria-label={`${current.en} を読み上げる`}
        >
          <SpeakerIcon />
          {speaking === "word" ? "再生中…" : "単語"}
        </button>
        {current.exampleEn && (
          <button
            type="button"
            onClick={onSpeakExample}
            disabled={speaking !== null}
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-xs font-semibold text-zinc-700 active:scale-95 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
            aria-label="例文を読み上げる"
          >
            <SpeakerIcon />
            {speaking === "example" ? "再生中…" : "例文"}
          </button>
        )}
        {hasWordScene(current.en) && (
          <button
            type="button"
            onClick={() => {
              setSceneVisible(true);
              setScenePlayKey((k) => k + 1);
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-4 py-1.5 text-xs font-semibold text-rose-700 active:scale-95 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300"
            aria-label="例文イメージを再生"
          >
            イメージ
          </button>
        )}
      </div>

      {sceneVisible && hasWordScene(current.en) && (
        <WordSceneAnimation wordEn={current.en} playKey={scenePlayKey} />
      )}

      {speakError && (
        <p className="text-center text-[10px] text-red-500">
          音声を取得できませんでした
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onPointerDown={prevHold.onPointerDown}
          onPointerUp={prevHold.onPointerUp}
          onPointerCancel={prevHold.onPointerCancel}
          onPointerLeave={prevHold.onPointerLeave}
          className="flex-1 touch-none select-none rounded-xl border border-zinc-200 py-2.5 text-sm font-semibold text-zinc-700 active:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:active:bg-zinc-800"
        >
          前へ
        </button>
        <button
          type="button"
          onPointerDown={nextHold.onPointerDown}
          onPointerUp={nextHold.onPointerUp}
          onPointerCancel={nextHold.onPointerCancel}
          onPointerLeave={nextHold.onPointerLeave}
          className="flex-1 touch-none select-none rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white active:bg-indigo-700"
        >
          次へ
        </button>
      </div>
    </div>
  );
}

function SpeakerIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}
