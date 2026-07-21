import { notFound } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { PageShell } from "@/components/NavCard";
import { StudySession } from "@/components/vocabulary/StudySession";
import {
  getIdiomClassification,
  getIdiomItemsByClassification,
  type IdiomClassificationId,
} from "@/lib/idioms";

type PageProps = {
  params: Promise<{ classification: string }>;
};

export default async function IdiomMixPage({ params }: PageProps) {
  const { classification: classId } = await params;
  const classification = getIdiomClassification(classId);
  if (!classification) notFound();

  const items = getIdiomItemsByClassification(
    classification.id as IdiomClassificationId,
  );
  if (items.length === 0) notFound();

  return (
    <>
      <AppHeader
        title="熟語"
        backHref={`/vocabulary/idioms/${classification.id as IdiomClassificationId}`}
        backLabel={classification.labelJa}
      />
      <PageShell>
        <StudySession
          words={items}
          posLabel={classification.labelJa}
          levelLabel={`すべてまとめて · ${items.length}語`}
          preferRandom
        />
      </PageShell>
    </>
  );
}
