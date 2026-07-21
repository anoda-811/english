import Link from "next/link";
import type { ReactNode } from "react";

type NavCardProps = {
  href: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  meta?: string;
  disabled?: boolean;
};

export function NavCard({ href, title, description, icon, meta, disabled }: NavCardProps) {
  if (disabled) {
    return (
      <div className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 opacity-60 dark:border-zinc-800 dark:bg-zinc-900/50">
        {icon && (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-200 text-2xl dark:bg-zinc-800">
            {icon}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-zinc-700 dark:text-zinc-300">{title}</p>
          {description && (
            <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
          )}
        </div>
        {meta && <span className="text-xs text-zinc-400">{meta}</span>}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition active:scale-[0.98] active:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:active:bg-zinc-800/80"
    >
      {icon && (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-2xl dark:bg-indigo-950/60">
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-zinc-900 dark:text-zinc-50">{title}</p>
        {description && (
          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
        )}
      </div>
      <span className="shrink-0 text-zinc-300 dark:text-zinc-600" aria-hidden>
        ›
      </span>
    </Link>
  );
}

export function PageShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto min-h-full w-full max-w-lg flex-1 ${className}`}>{children}</div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
      {children}
    </h2>
  );
}
