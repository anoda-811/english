import { notFound } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { PageShell } from "@/components/NavCard";
import { StudySession } from "@/components/vocabulary/StudySession";
import {
  getNounGenre,
  getNounsByGenre,
  type NounGenreId,
} from "@/lib/vocabulary";

type PageProps = {
  params: Promise<{ pos: string; genre: string }>;
};

export default async function StudyGenrePage({ params }: PageProps) {
  const { pos: posId, genre: genreId } = await params;
  if (posId !== "noun") notFound();

  const genre = getNounGenre(genreId);
  if (!genre) notFound();

  const words = getNounsByGenre(genre.id as NounGenreId);
  if (words.length === 0) notFound();

  return (
    <>
      <AppHeader
        title="学習"
        backHref="/vocabulary/study/noun"
        backLabel="名詞"
      />
      <PageShell>
        <StudySession
          words={words}
          posLabel="名詞"
          levelLabel={`${genre.labelJa} · ${words.length}語`}
        />
      </PageShell>
    </>
  );
}
