"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { StudyCardItem } from "@/lib/study-types";
import { speakEnglish, stopSpeaking } from "@/lib/speak-english";
import { LearnedStarButton } from "@/components/vocabulary/LearnedStarButton";

export type HideSide = "en" | "ja" | "none";
export type OrderMode = "sequential" | "random";

const HIDE_SIDE_KEY = "vocabulary-hide-side";
const ORDER_MODE_KEY = "vocabulary-order-mode";

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildDeck(items: StudyCardItem[], mode: OrderMode): StudyCardItem[] {
  return mode === "random" ? shuffle(items) : [...items];
}

const HOLD_DELAY_MS = 350;
const HOLD_INTERVAL_MS = 90;

type StudySessionProps = {
  words: StudyCardItem[];
  posLabel: string;
  levelLabel: string;
};

export function StudySession({ words, posLabel, levelLabel }: StudySessionProps) {
  const [orderMode, setOrderMode] = useState<OrderMode>("sequential");
  const [deck, setDeck] = useState<StudyCardItem[]>(() => [...words]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [exampleRevealed, setExampleRevealed] = useState(false);
  const [hideSide, setHideSide] = useState<HideSide>("ja");
  const [speaking, setSpeaking] = useState<"word" | "example" | null>(null);
  const [speakError, setSpeakError] = useState(false);

  const deckRef = useRef(deck);
  const indexRef = useRef(index);
  const orderModeRef = useRef(orderMode);
  const hideSideRef = useRef(hideSide);
  const holdDelayRef = useRef<number | null>(null);
  const holdIntervalRef = useRef<number | null>(null);
  const didHoldRepeatRef = useRef(false);
  const speakTokenRef = useRef(0);

  useEffect(() => {
    deckRef.current = deck;
    indexRef.current = index;
    orderModeRef.current = orderMode;
    hideSideRef.current = hideSide;
  }, [deck, index, orderMode, hideSide]);

  const resetRevealForHideMode = useCallback(() => {
    const showBoth = hideSideRef.current === "none";
    setRevealed(showBoth);
    setExampleRevealed(showBoth);
  }, []);

  const clearNextHold = useCallback(() => {
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
    return () => clearNextHold();
  }, [clearNextHold]);

  useEffect(() => {
    let mode: OrderMode = "random";
    let hide: HideSide = "ja";
    try {
      const storedHide = localStorage.getItem(HIDE_SIDE_KEY);
      if (storedHide === "en" || storedHide === "ja" || storedHide === "none") {
        hide = storedHide;
      }
      const storedOrder = localStorage.getItem(ORDER_MODE_KEY);
      if (storedOrder === "sequential" || storedOrder === "random") {
        mode = storedOrder;
      }
    } catch {
      /* ignore */
    }
    setHideSide(hide);
    hideSideRef.current = hide;
    setOrderMode(mode);
    setDeck(buildDeck(words, mode));
    setIndex(0);
    const showBoth = hide === "none";
    setRevealed(showBoth);
    setExampleRevealed(showBoth);
  }, [words]);

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

  const applyOrderMode = useCallback(
    (mode: OrderMode) => {
      speakTokenRef.current += 1;
      stopSpeaking();
      setSpeaking(null);
      setSpeakError(false);
      setOrderMode(mode);
      setDeck(buildDeck(words, mode));
      setIndex(0);
      resetRevealForHideMode();
      try {
        localStorage.setItem(ORDER_MODE_KEY, mode);
      } catch {
        /* ignore */
      }
    },
    [words, resetRevealForHideMode],
  );

  const reshuffle = () => {
    speakTokenRef.current += 1;
    stopSpeaking();
    setSpeaking(null);
    setSpeakError(false);
    setDeck(buildDeck(words, "random"));
    setIndex(0);
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
    if (i >= d.length - 1) {
      const newDeck = buildDeck(words, orderModeRef.current);
      deckRef.current = newDeck;
      indexRef.current = 0;
      setDeck(newDeck);
      setIndex(0);
    } else {
      indexRef.current = i + 1;
      setIndex(i + 1);
    }
  }, [words, resetRevealForHideMode]);

  const goPrev = () => {
    stopSpeech();
    if (index > 0) {
      setIndex((i) => i - 1);
      resetRevealForHideMode();
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

  const onNextPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return;
    didHoldRepeatRef.current = false;
    clearNextHold();
    e.currentTarget.setPointerCapture(e.pointerId);

    holdDelayRef.current = window.setTimeout(() => {
      didHoldRepeatRef.current = true;
      advanceNext();
      holdIntervalRef.current = window.setInterval(advanceNext, HOLD_INTERVAL_MS);
    }, HOLD_DELAY_MS);
  };

  const onNextPointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    clearNextHold();
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    if (!didHoldRepeatRef.current) {
      advanceNext();
    }
  };

  const onNextPointerCancel = () => {
    clearNextHold();
  };

  if (!current) {
    return (
      <p className="px-4 py-12 text-center text-zinc-500">この条件の単語がありません。</p>
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

      <div className="grid h-[min(34vh,260px)] grid-rows-2 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
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

      <div className="flex items-center justify-center gap-2">
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
      </div>

      {speakError && (
        <p className="text-center text-[10px] text-red-500">
          音声を取得できませんでした
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={goPrev}
          disabled={index === 0}
          className="flex-1 rounded-xl border border-zinc-200 py-2.5 text-sm font-semibold text-zinc-700 disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-200"
        >
          前へ
        </button>
        <button
          type="button"
          onPointerDown={onNextPointerDown}
          onPointerUp={onNextPointerUp}
          onPointerCancel={onNextPointerCancel}
          onPointerLeave={onNextPointerCancel}
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
