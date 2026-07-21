import { AppHeader } from "@/components/AppHeader";
import { NavCard, PageShell, SectionTitle } from "@/components/NavCard";
import { countWordsByPos, getPartsOfSpeech } from "@/lib/vocabulary";

export default function StudyPosPage() {
  const parts = getPartsOfSpeech();

  return (
    <>
      <AppHeader title="品詞を選ぶ" backHref="/vocabulary" />
      <PageShell className="px-4 py-6">
        <p className="mb-5 text-sm text-zinc-600 dark:text-zinc-400">
          学習したい品詞を選んでください
        </p>
        <SectionTitle>品詞</SectionTitle>
        <ul className="flex flex-col gap-3">
          {parts.map((pos) => {
            const count = countWordsByPos(pos.id);
            return (
              <li key={pos.id}>
                <NavCard
                  href={`/vocabulary/study/${pos.id}`}
                  title={pos.labelJa}
                  description={`${pos.labelEn} · ${count} 語`}
                  icon={pos.emoji}
                />
              </li>
            );
          })}
        </ul>
      </PageShell>
    </>
  );
}
