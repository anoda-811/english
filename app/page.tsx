import { AppHeader } from "@/components/AppHeader";
import { NavCard, PageShell, SectionTitle } from "@/components/NavCard";
import { getApps } from "@/lib/apps";

export default function HomePage() {
  const apps = getApps();

  return (
    <>
      <AppHeader title="English Lab" />
      <PageShell className="px-4 py-6">
        <p className="mb-6 text-center text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          英語学習ミニアプリを選んでください
        </p>
        <SectionTitle>アプリ一覧</SectionTitle>
        <ul className="flex flex-col gap-3">
          {apps.map((app) => (
            <li key={app.id}>
              {app.available ? (
                <NavCard
                  href={app.href}
                  title={app.title}
                  description={app.description}
                  icon={app.emoji}
                />
              ) : (
                <NavCard
                  href="#"
                  title={app.title}
                  description={app.description}
                  icon={app.emoji}
                  disabled
                  meta="準備中"
                />
              )}
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center text-xs text-zinc-400">
          単語データは{" "}
          <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">data/vocabulary/words.json</code>{" "}
          を編集して追加できます
        </p>
      </PageShell>
    </>
  );
}
