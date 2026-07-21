import Link from "next/link";

type AppHeaderProps = {
  title: string;
  backHref?: string;
  backLabel?: string;
};

export function AppHeader({ title, backHref, backLabel = "戻る" }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex h-14 max-w-lg items-center gap-3 px-4">
        {backHref ? (
          <Link
            href={backHref}
            className="flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-medium text-indigo-600 active:bg-indigo-50 dark:text-indigo-400 dark:active:bg-indigo-950/50"
          >
            <span aria-hidden className="text-lg leading-none">
              ←
            </span>
            {backLabel}
          </Link>
        ) : (
          <div className="w-14 shrink-0" />
        )}
        <h1 className="min-w-0 flex-1 truncate text-center text-base font-semibold text-zinc-900 dark:text-zinc-50">
          {title}
        </h1>
        <div className="w-14 shrink-0" aria-hidden />
      </div>
    </header>
  );
}
