"use client";

type WordSceneAnimationProps = {
  wordEn: string;
  /** 押すたびに増やして再生し直す */
  playKey: number;
};

const SCENE_WORDS = new Set(["apple"]);

export function hasWordScene(wordEn: string): boolean {
  return SCENE_WORDS.has(wordEn.toLowerCase());
}

/**
 * 例文イメージの試験的アニメ。まずは apple のみ。
 * "I bought an apple at the store." → 店でりんごをカゴに入れる
 */
export function WordSceneAnimation({ wordEn, playKey }: WordSceneAnimationProps) {
  if (!hasWordScene(wordEn)) return null;

  return (
    <div
      key={playKey}
      className="relative mx-auto h-20 w-full max-w-[280px] overflow-hidden rounded-xl border border-rose-200/70 bg-gradient-to-b from-rose-50 to-amber-50 dark:border-rose-900/40 dark:from-rose-950/40 dark:to-amber-950/30"
      aria-hidden
    >
      <div className="absolute inset-x-4 top-2 h-2 rounded-sm bg-amber-800/70 dark:bg-amber-700/60" />
      <div className="absolute left-5 top-4 h-6 w-5 rounded-sm bg-red-300/50 dark:bg-red-800/40" />
      <div className="absolute left-12 top-4 h-6 w-5 rounded-sm bg-lime-300/50 dark:bg-lime-800/40" />
      <div className="absolute right-10 top-4 h-6 w-5 rounded-sm bg-orange-300/50 dark:bg-orange-800/40" />

      <div className="absolute bottom-2 right-8 h-8 w-14">
        <div className="absolute inset-x-0 bottom-0 h-6 rounded-b-md border-2 border-amber-700/80 bg-amber-100/80 dark:border-amber-500/70 dark:bg-amber-900/50" />
        <div className="absolute -top-1 left-1 right-1 h-3 rounded-t-md border-2 border-b-0 border-amber-700/80 dark:border-amber-500/70" />
      </div>

      <div className="apple-scene-fruit absolute left-[42%] top-3 text-[22px] leading-none">
        🍎
      </div>

      <p className="absolute bottom-1 left-3 text-[9px] font-medium tracking-wide text-rose-700/70 dark:text-rose-300/70">
        trial · store
      </p>
    </div>
  );
}
