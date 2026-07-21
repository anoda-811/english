import { notFound } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { PageShell } from "@/components/NavCard";
import { StudySession } from "@/components/vocabulary/StudySession";
import {
  countWordsByPos,
  getPartOfSpeech,
  getWordsByPos,
  type PartOfSpeechId,
} from "@/lib/vocabulary";

type PageProps = {
  params: Promise<{ pos: string }>;
};

export default async function StudyMixPage({ params }: PageProps) {
  const { pos: posId } = await params;
  const pos = getPartOfSpeech(posId);
  if (!pos) notFound();

  const words = getWordsByPos(pos.id as PartOfSpeechId);
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
          levelLabel={`すべてまとめて · ${countWordsByPos(pos.id as PartOfSpeechId)}語`}
          preferRandom
        />
      </PageShell>
    </>
  );
}
