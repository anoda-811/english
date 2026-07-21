export function VocabularyHero() {
  return (
    <div className="relative mb-6 overflow-hidden rounded-3xl border border-white/[0.08] bg-zinc-950 px-5 py-7 shadow-[0_24px_80px_-12px_rgba(79,70,229,0.45)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 20% -10%, rgba(99,102,241,0.55), transparent 55%), radial-gradient(ellipse 60% 50% at 100% 100%, rgba(139,92,246,0.35), transparent 50%), radial-gradient(ellipse 40% 40% at 85% 15%, rgba(34,211,238,0.15), transparent 45%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[22px_22px] mask-[linear-gradient(to_bottom,black_40%,transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-zinc-950 via-transparent to-transparent" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 pt-0.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
            </span>
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-indigo-100/80">
              Vocabulary
            </span>
          </div>

          <h2 className="mt-4 text-[1.75rem] font-bold leading-[1.15] tracking-tight text-white">
            英単語
            <span className="block bg-linear-to-r from-indigo-200 via-white to-violet-200 bg-clip-text text-transparent">
              トレーニング
            </span>
          </h2>

          <p className="mt-3 max-w-[16rem] text-sm leading-relaxed text-zinc-400">
            品詞とレベルで絞り込んで、上下カード形式で暗記できます。
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-zinc-300 backdrop-blur-sm">
              品詞別
            </span>
            <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-zinc-300 backdrop-blur-sm">
              レベル別
            </span>
            <span className="rounded-lg border border-indigo-400/25 bg-indigo-500/15 px-2.5 py-1 text-[11px] font-medium text-indigo-100">
              フラッシュカード
            </span>
          </div>
        </div>

        <div className="relative h-[7.5rem] w-[4.75rem] shrink-0" aria-hidden>
          <div className="vocab-hero-card vocab-hero-card-back absolute left-0 top-3 w-full rounded-xl border border-white/10 bg-zinc-900/80 p-2 shadow-lg backdrop-blur-sm">
            <div className="h-5 rounded bg-white/5" />
            <div className="mt-2 h-2 w-2/3 rounded bg-white/5" />
          </div>
          <div className="vocab-hero-card vocab-hero-card-mid absolute left-1 top-1.5 w-full rounded-xl border border-white/15 bg-zinc-900/90 p-2.5 shadow-xl backdrop-blur-md">
            <p className="font-mono text-[9px] uppercase tracking-wider text-indigo-300/70">EN</p>
            <p className="mt-1 truncate text-[11px] font-semibold text-white">focus</p>
            <div className="my-2 h-px bg-white/10" />
            <p className="font-mono text-[9px] uppercase tracking-wider text-zinc-500">JA</p>
            <p className="mt-0.5 text-[10px] text-zinc-400 blur-[3px]">••••</p>
          </div>
          <div className="vocab-hero-card vocab-hero-card-front absolute left-2 top-0 w-full rounded-xl border border-indigo-300/30 bg-linear-to-br from-indigo-500/90 to-violet-600/90 p-2.5 shadow-[0_8px_32px_rgba(99,102,241,0.5)]">
            <p className="font-mono text-[9px] uppercase tracking-wider text-indigo-100/80">Card</p>
            <p className="mt-1 text-lg font-bold leading-none text-white">Aa</p>
            <p className="mt-2 text-[8px] leading-tight text-indigo-100/70">tap to reveal</p>
          </div>
        </div>
      </div>
    </div>
  );
}
