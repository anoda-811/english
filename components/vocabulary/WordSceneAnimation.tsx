"use client";

import type { ReactNode } from "react";

type SceneDef = {
  label: string;
  /** 背景用の追加クラス */
  panelClass: string;
  render: () => ReactNode;
};

const SCENES: Record<string, SceneDef> = {
  apple: {
    label: "store",
    panelClass:
      "border-rose-200/70 from-rose-50 to-amber-50 dark:border-rose-900/40 dark:from-rose-950/40 dark:to-amber-950/30",
    render: () => (
      <>
        <div className="absolute inset-x-4 top-2 h-2 rounded-sm bg-amber-800/70 dark:bg-amber-700/60" />
        <div className="absolute left-5 top-4 h-6 w-5 rounded-sm bg-red-300/50 dark:bg-red-800/40" />
        <div className="absolute left-12 top-4 h-6 w-5 rounded-sm bg-lime-300/50 dark:bg-lime-800/40" />
        <div className="absolute right-10 top-4 h-6 w-5 rounded-sm bg-orange-300/50 dark:bg-orange-800/40" />
        <div className="absolute bottom-2 right-8 h-8 w-14">
          <div className="absolute inset-x-0 bottom-0 h-6 rounded-b-md border-2 border-amber-700/80 bg-amber-100/80 dark:border-amber-500/70 dark:bg-amber-900/50" />
          <div className="absolute -top-1 left-1 right-1 h-3 rounded-t-md border-2 border-b-0 border-amber-700/80 dark:border-amber-500/70" />
        </div>
        <div className="scene-apple absolute left-[42%] top-3 text-[22px] leading-none">🍎</div>
      </>
    ),
  },
  banana: {
    label: "peel",
    panelClass:
      "border-yellow-200/80 from-yellow-50 to-lime-50 dark:border-yellow-900/40 dark:from-yellow-950/40 dark:to-lime-950/30",
    render: () => (
      <>
        <div className="absolute bottom-3 left-1/2 h-2 w-16 -translate-x-1/2 rounded-full bg-amber-200/80 dark:bg-amber-800/50" />
        <div className="scene-banana absolute left-1/2 top-4 -translate-x-1/2 text-[28px] leading-none">
          🍌
        </div>
        <div className="scene-banana-peel absolute left-[58%] top-3 text-[16px] leading-none opacity-0">
          ✨
        </div>
      </>
    ),
  },
  coffee: {
    label: "cup",
    panelClass:
      "border-amber-200/80 from-amber-50 to-stone-100 dark:border-amber-900/40 dark:from-amber-950/40 dark:to-stone-950/40",
    render: () => (
      <>
        <div className="absolute bottom-3 left-1/2 h-10 w-12 -translate-x-1/2 rounded-b-xl border-2 border-stone-500/70 bg-stone-200/90 dark:border-stone-400/50 dark:bg-stone-800/70" />
        <div className="absolute bottom-10 left-[calc(50%+22px)] h-4 w-5 rounded-r-full border-2 border-l-0 border-stone-500/70 dark:border-stone-400/50" />
        <div className="scene-steam-1 absolute left-[44%] top-2 text-sm">💨</div>
        <div className="scene-steam-2 absolute left-[52%] top-1 text-sm">💨</div>
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-lg">☕</div>
      </>
    ),
  },
  tea: {
    label: "cup",
    panelClass:
      "border-emerald-200/80 from-emerald-50 to-lime-50 dark:border-emerald-900/40 dark:from-emerald-950/40 dark:to-lime-950/30",
    render: () => (
      <>
        <div className="absolute bottom-3 left-1/2 h-9 w-11 -translate-x-1/2 rounded-b-lg border-2 border-emerald-700/60 bg-emerald-100/90 dark:border-emerald-500/50 dark:bg-emerald-900/50" />
        <div className="scene-steam-1 absolute left-[45%] top-2 text-sm">💨</div>
        <div className="scene-steam-2 absolute left-[53%] top-1 text-sm">💨</div>
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-lg">🍵</div>
      </>
    ),
  },
  egg: {
    label: "boil",
    panelClass:
      "border-sky-200/80 from-sky-50 to-blue-50 dark:border-sky-900/40 dark:from-sky-950/40 dark:to-blue-950/30",
    render: () => (
      <>
        <div className="absolute bottom-2 left-1/2 h-8 w-20 -translate-x-1/2 rounded-full border-2 border-sky-500/50 bg-sky-200/70 dark:border-sky-400/40 dark:bg-sky-900/50" />
        <div className="scene-bubble-1 absolute bottom-8 left-[40%] text-[10px]">💧</div>
        <div className="scene-bubble-2 absolute bottom-10 left-[55%] text-[10px]">💧</div>
        <div className="scene-egg absolute bottom-6 left-1/2 -translate-x-1/2 text-[22px]">🥚</div>
      </>
    ),
  },
  milk: {
    label: "pour",
    panelClass:
      "border-slate-200/80 from-slate-50 to-blue-50 dark:border-slate-700/50 dark:from-slate-950/40 dark:to-blue-950/30",
    render: () => (
      <>
        <div className="absolute bottom-3 left-[55%] h-7 w-14 rounded-md border-2 border-slate-400/70 bg-white dark:border-slate-500 dark:bg-slate-800" />
        <div className="scene-cereal absolute bottom-4 left-[58%] text-sm">🥣</div>
        <div className="scene-milk absolute left-[28%] top-2 text-[26px]">🥛</div>
        <div className="scene-milk-drop absolute left-[48%] top-10 text-xs opacity-0">💧</div>
      </>
    ),
  },
  pizza: {
    label: "slice",
    panelClass:
      "border-orange-200/80 from-orange-50 to-amber-50 dark:border-orange-900/40 dark:from-orange-950/40 dark:to-amber-950/30",
    render: () => (
      <>
        <div className="absolute bottom-3 left-1/2 h-2 w-24 -translate-x-1/2 rounded-full bg-amber-800/30" />
        <div className="scene-pizza absolute bottom-4 left-[38%] text-[28px]">🍕</div>
        <div className="scene-pizza-lift absolute bottom-4 left-[52%] text-[22px] opacity-0">🍕</div>
      </>
    ),
  },
  bread: {
    label: "bakery",
    panelClass:
      "border-amber-200/80 from-amber-50 to-orange-50 dark:border-amber-900/40 dark:from-amber-950/40 dark:to-orange-950/30",
    render: () => (
      <>
        <div className="absolute inset-x-6 top-3 h-1.5 rounded bg-amber-800/50" />
        <div className="scene-bread absolute bottom-4 left-1/2 -translate-x-1/2 text-[30px]">🍞</div>
        <div className="scene-sparkle absolute left-[62%] top-5 text-sm opacity-0">✨</div>
      </>
    ),
  },
  cake: {
    label: "party",
    panelClass:
      "border-pink-200/80 from-pink-50 to-rose-50 dark:border-pink-900/40 dark:from-pink-950/40 dark:to-rose-950/30",
    render: () => (
      <>
        <div className="scene-cake absolute bottom-3 left-1/2 -translate-x-1/2 text-[30px]">🎂</div>
        <div className="scene-confetti-1 absolute left-[30%] top-3 text-sm">🎉</div>
        <div className="scene-confetti-2 absolute right-[28%] top-4 text-sm">✨</div>
      </>
    ),
  },
  soup: {
    label: "hot",
    panelClass:
      "border-orange-200/80 from-orange-50 to-yellow-50 dark:border-orange-900/40 dark:from-orange-950/40 dark:to-yellow-950/30",
    render: () => (
      <>
        <div className="absolute bottom-3 left-1/2 h-9 w-16 -translate-x-1/2 rounded-full border-2 border-orange-700/50 bg-orange-200/80 dark:border-orange-500/40 dark:bg-orange-900/40" />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xl">🍲</div>
        <div className="scene-steam-1 absolute left-[44%] top-2 text-sm">💨</div>
        <div className="scene-steam-2 absolute left-[54%] top-1 text-sm">💨</div>
      </>
    ),
  },
  popcorn: {
    label: "pop",
    panelClass:
      "border-yellow-200/80 from-yellow-50 to-amber-50 dark:border-yellow-900/40 dark:from-yellow-950/40 dark:to-amber-950/30",
    render: () => (
      <>
        <div className="absolute bottom-2 left-1/2 h-8 w-12 -translate-x-1/2 rounded-md border-2 border-red-500/60 bg-red-100 dark:bg-red-950/50" />
        <div className="scene-pop-1 absolute bottom-10 left-[40%] text-sm opacity-0">🍿</div>
        <div className="scene-pop-2 absolute bottom-12 left-[50%] text-sm opacity-0">🍿</div>
        <div className="scene-pop-3 absolute bottom-10 left-[58%] text-sm opacity-0">🍿</div>
      </>
    ),
  },
  sushi: {
    label: "counter",
    panelClass:
      "border-cyan-200/80 from-cyan-50 to-slate-50 dark:border-cyan-900/40 dark:from-cyan-950/40 dark:to-slate-950/40",
    render: () => (
      <>
        <div className="absolute bottom-3 left-1/2 h-2 w-28 -translate-x-1/2 rounded bg-stone-400/50" />
        <div className="scene-sushi-1 absolute bottom-5 left-[32%] text-xl">🍣</div>
        <div className="scene-sushi-2 absolute bottom-5 left-[48%] text-xl">🍣</div>
        <div className="scene-sushi-3 absolute bottom-5 left-[64%] text-xl">🍣</div>
      </>
    ),
  },
  ice: {
    label: "glass",
    panelClass:
      "border-sky-200/80 from-sky-50 to-cyan-50 dark:border-sky-900/40 dark:from-sky-950/40 dark:to-cyan-950/30",
    render: () => (
      <>
        <div className="absolute bottom-2 left-1/2 h-12 w-10 -translate-x-1/2 rounded-b-lg border-2 border-sky-400/60 bg-sky-100/50 dark:bg-sky-900/30" />
        <div className="scene-ice-1 absolute bottom-8 left-[44%] text-sm">🧊</div>
        <div className="scene-ice-2 absolute bottom-6 left-[52%] text-sm">🧊</div>
        <div className="scene-ice-drop absolute left-[48%] top-2 text-xs opacity-0">💧</div>
      </>
    ),
  },
  lemon: {
    label: "squeeze",
    panelClass:
      "border-yellow-200/80 from-yellow-50 to-lime-50 dark:border-yellow-900/40 dark:from-yellow-950/40 dark:to-lime-950/30",
    render: () => (
      <>
        <div className="absolute bottom-3 left-[55%] h-8 w-14 rounded-full border border-orange-300/60 bg-orange-100/70 dark:bg-orange-950/40" />
        <div className="absolute bottom-4 left-[62%] text-sm">🍲</div>
        <div className="scene-lemon absolute left-[28%] top-3 text-[26px]">🍋</div>
        <div className="scene-lemon-drop absolute left-[48%] top-10 text-xs opacity-0">💧</div>
      </>
    ),
  },
  sandwich: {
    label: "pack",
    panelClass:
      "border-lime-200/80 from-lime-50 to-green-50 dark:border-lime-900/40 dark:from-lime-950/40 dark:to-green-950/30",
    render: () => (
      <>
        <div className="absolute bottom-2 left-1/2 h-10 w-16 -translate-x-1/2 rounded border-2 border-dashed border-amber-600/50 bg-amber-50/80 dark:bg-amber-950/30" />
        <div className="scene-sandwich absolute bottom-4 left-1/2 -translate-x-1/2 text-[28px]">🥪</div>
      </>
    ),
  },
  donut: {
    label: "bakery",
    panelClass:
      "border-pink-200/80 from-pink-50 to-amber-50 dark:border-pink-900/40 dark:from-pink-950/40 dark:to-amber-950/30",
    render: () => (
      <>
        <div className="absolute inset-x-8 top-3 h-1.5 rounded bg-amber-800/40" />
        <div className="scene-donut absolute bottom-4 left-1/2 -translate-x-1/2 text-[30px]">🍩</div>
        <div className="scene-sparkle absolute left-[60%] top-6 text-sm opacity-0">✨</div>
      </>
    ),
  },
  ramen: {
    label: "steaming",
    panelClass:
      "border-red-200/80 from-red-50 to-orange-50 dark:border-red-900/40 dark:from-red-950/40 dark:to-orange-950/30",
    render: () => (
      <>
        <div className="absolute bottom-3 left-1/2 h-8 w-16 -translate-x-1/2 rounded-full border-2 border-red-700/40 bg-red-100/80 dark:bg-red-950/40" />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xl">🍜</div>
        <div className="scene-steam-1 absolute left-[44%] top-2 text-sm">💨</div>
        <div className="scene-steam-2 absolute left-[54%] top-1 text-sm">💨</div>
      </>
    ),
  },
  watermelon: {
    label: "picnic",
    panelClass:
      "border-green-200/80 from-green-50 to-lime-50 dark:border-green-900/40 dark:from-green-950/40 dark:to-lime-950/30",
    render: () => (
      <>
        <div className="absolute bottom-2 left-1/2 h-3 w-28 -translate-x-1/2 rounded bg-lime-200/70 dark:bg-lime-900/40" />
        <div className="scene-melon-1 absolute bottom-5 left-[34%] text-xl">🍉</div>
        <div className="scene-melon-2 absolute bottom-5 left-[52%] text-xl">🍉</div>
      </>
    ),
  },
  toast: {
    label: "butter",
    panelClass:
      "border-amber-200/80 from-amber-50 to-yellow-50 dark:border-amber-900/40 dark:from-amber-950/40 dark:to-yellow-950/30",
    render: () => (
      <>
        <div className="scene-toast absolute bottom-4 left-1/2 -translate-x-1/2 text-[28px]">🍞</div>
        <div className="scene-butter absolute left-[48%] top-3 text-lg opacity-0">🧈</div>
      </>
    ),
  },
  strawberry: {
    label: "market",
    panelClass:
      "border-rose-200/80 from-rose-50 to-red-50 dark:border-rose-900/40 dark:from-rose-950/40 dark:to-red-950/30",
    render: () => (
      <>
        <div className="absolute bottom-2 left-1/2 h-6 w-20 -translate-x-1/2 rounded border-2 border-amber-700/50 bg-amber-100/80 dark:bg-amber-950/40" />
        <div className="scene-berry-1 absolute bottom-6 left-[38%] text-lg">🍓</div>
        <div className="scene-berry-2 absolute bottom-7 left-[50%] text-lg">🍓</div>
        <div className="scene-berry-3 absolute bottom-6 left-[60%] text-lg">🍓</div>
      </>
    ),
  },
  pancake: {
    label: "stack",
    panelClass:
      "border-amber-200/80 from-amber-50 to-orange-50 dark:border-amber-900/40 dark:from-amber-950/40 dark:to-orange-950/30",
    render: () => (
      <>
        <div className="scene-pancake absolute bottom-4 left-1/2 -translate-x-1/2 text-[28px]">🥞</div>
        <div className="scene-syrup absolute left-[52%] top-4 text-sm opacity-0">🍯</div>
      </>
    ),
  },
  cookie: {
    label: "snack",
    panelClass:
      "border-amber-200/80 from-amber-50 to-stone-50 dark:border-amber-900/40 dark:from-amber-950/40 dark:to-stone-950/40",
    render: () => (
      <>
        <div className="scene-cookie-1 absolute bottom-5 left-[36%] text-xl">🍪</div>
        <div className="scene-cookie-2 absolute bottom-5 left-[52%] text-xl opacity-40">🍪</div>
        <div className="scene-cookie-hand absolute bottom-8 left-[30%] text-sm opacity-0">✋</div>
      </>
    ),
  },
  juice: {
    label: "pour",
    panelClass:
      "border-orange-200/80 from-orange-50 to-amber-50 dark:border-orange-900/40 dark:from-orange-950/40 dark:to-amber-950/30",
    render: () => (
      <>
        <div className="absolute bottom-2 left-[55%] h-11 w-8 rounded-b-md border-2 border-orange-400/60 bg-orange-100/40 dark:bg-orange-950/30" />
        <div className="scene-juice absolute left-[30%] top-2 text-[26px]">🧃</div>
        <div className="scene-juice-stream absolute left-[48%] top-10 text-xs opacity-0">🟠</div>
      </>
    ),
  },
};

type WordSceneAnimationProps = {
  wordEn: string;
  playKey: number;
};

export function hasWordScene(wordEn: string): boolean {
  return Object.prototype.hasOwnProperty.call(SCENES, wordEn.toLowerCase());
}

export function WordSceneAnimation({ wordEn, playKey }: WordSceneAnimationProps) {
  const scene = SCENES[wordEn.toLowerCase()];
  if (!scene) return null;

  return (
    <div
      key={playKey}
      className={`relative mx-auto h-20 w-full max-w-[280px] overflow-hidden rounded-xl border bg-gradient-to-b ${scene.panelClass}`}
      aria-hidden
    >
      {scene.render()}
      <p className="absolute bottom-1 left-3 text-[9px] font-medium tracking-wide text-zinc-500/80 dark:text-zinc-400/80">
        trial · {scene.label}
      </p>
    </div>
  );
}
