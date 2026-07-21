import { notFound } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { NavCard, PageShell, SectionTitle } from "@/components/NavCard";
import { getPartOfSpeech, getLevelsWithWordCount, type PartOfSpeechId } from "@/lib/vocabulary";

type PageProps = {
  params: Promise<{ pos: string }>;
};

export default async function StudyLevelPage({ params }: PageProps) {
  const { pos: posId } = await params;
  const pos = getPartOfSpeech(posId);
  if (!pos) notFound();

  const levels = getLevelsWithWordCount(pos.id as PartOfSpeechId);

  return (
    <>
      <AppHeader title={pos.labelJa} backHref="/vocabulary/study" />
      <PageShell className="px-4 py-6">
        <p className="mb-5 text-sm text-zinc-600 dark:text-zinc-400">
          レベルを選んでください
        </p>
        <SectionTitle>レベル</SectionTitle>
        <ul className="flex flex-col gap-3">
          {levels.map((level) => (
            <li key={level.id}>
              {level.wordCount > 0 ? (
                <NavCard
                  href={`/vocabulary/study/${pos.id}/${level.id}`}
                  title={level.labelJa}
                  description={`${level.descriptionJa} · ${level.wordCount} 語`}
                  icon={
                    ({
                      "1": "🌱",
                      "2": "🌿",
                      "3": "🌳",
                      "4": "🌲",
                      "5": "🍃",
                      "6": "🪴",
                      "7": "🌵",
                      "8": "🎄",
                    } as Record<string, string>)[level.id] ?? "📘"
                  }
                />
              ) : (
                <NavCard
                  href="#"
                  title={level.labelJa}
                  description={level.descriptionJa}
                  icon="—"
                  disabled
                  meta="単語なし"
                />
              )}
            </li>
          ))}
        </ul>

        <div className="mt-8 border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <SectionTitle>一覧</SectionTitle>
          <NavCard
            href={`/vocabulary/study/${pos.id}/table`}
            title="表モード"
            description="レベル別タブ · 覚えた単語に★"
            icon="📋"
          />
        </div>
      </PageShell>
    </>
  );
}
