import { notFound } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { PageShell } from "@/components/NavCard";
import { WordTableView } from "@/components/vocabulary/WordTableView";
import {
  getLevels,
  getPartOfSpeech,
  getWordsByPos,
  type PartOfSpeechId,
} from "@/lib/vocabulary";

type PageProps = {
  params: Promise<{ pos: string }>;
};

export default async function StudyTablePage({ params }: PageProps) {
  const { pos: posId } = await params;
  const pos = getPartOfSpeech(posId);
  if (!pos) notFound();

  const words = getWordsByPos(pos.id as PartOfSpeechId);
  const levels = getLevels();

  return (
    <>
      <AppHeader title="表モード" backHref={`/vocabulary/study/${pos.id}`} backLabel={pos.labelJa} />
      <PageShell className="px-4 py-6">
        <WordTableView posLabel={pos.labelJa} levels={levels} words={words} />
      </PageShell>
    </>
  );
}
