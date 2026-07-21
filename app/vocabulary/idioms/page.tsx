import { AppHeader } from "@/components/AppHeader";
import { NavCard, PageShell, SectionTitle } from "@/components/NavCard";
import { getIdiomClassifications } from "@/lib/idioms";

export default function IdiomsClassificationsPage() {
  const classifications = getIdiomClassifications();

  return (
    <>
      <AppHeader title="熟語学習" backHref="/vocabulary" />
      <PageShell className="px-4 py-6">
        <p className="mb-5 text-sm text-zinc-600 dark:text-zinc-400">
          分類を選んでください
        </p>
        <SectionTitle>分類</SectionTitle>
        <ul className="flex flex-col gap-3">
          {classifications.map((c) => (
            <li key={c.id}>
              <NavCard
                href={`/vocabulary/idioms/${c.id}`}
                title={c.labelJa}
                description={c.descriptionJa}
                icon={c.emoji}
              />
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center text-xs text-zinc-400">
          熟語データは{" "}
          <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">data/idioms/idioms.json</code>{" "}
          を編集して追加できます
        </p>
      </PageShell>
    </>
  );
}
