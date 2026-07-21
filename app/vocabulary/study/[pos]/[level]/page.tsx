import { notFound } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { PageShell } from "@/components/NavCard";
import { StudySession } from "@/components/vocabulary/StudySession";
import {
  getLevel,
  getPartOfSpeech,
  getWords,
  type LevelId,
  type PartOfSpeechId,
} from "@/lib/vocabulary";

type PageProps = {
  params: Promise<{ pos: string; level: string }>;
};

export default async function StudyPlayPage({ params }: PageProps) {
  const { pos: posId, level: levelId } = await params;
  const pos = getPartOfSpeech(posId);
  const level = getLevel(levelId);
  if (!pos || !level) notFound();

  const words = getWords(pos.id as PartOfSpeechId, level.id as LevelId);
  if (words.length === 0) notFound();

  return (
    <>
      <AppHeader
        title="学習"
        backHref={`/vocabulary/study/${pos.id}`}
        backLabel={pos.labelJa}
      />
      <PageShell>
        <StudySession
          words={words}
          posLabel={pos.labelJa}
          levelLabel={level.labelJa}
        />
      </PageShell>
    </>
  );
}
