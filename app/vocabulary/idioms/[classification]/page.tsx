import { IdiomGroupCard } from "@/components/idioms/IdiomGroupCard";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { NavCard, PageShell, SectionTitle } from "@/components/NavCard";
import {
  getIdiomClassification,
  getIdiomGroupsWithCount,
  type IdiomClassificationId,
} from "@/lib/idioms";

type PageProps = {
  params: Promise<{ classification: string }>;
};

export default async function IdiomGroupsPage({ params }: PageProps) {
  const { classification: classId } = await params;
  const classification = getIdiomClassification(classId);
  if (!classification) notFound();

  const groups = getIdiomGroupsWithCount(classification.id as IdiomClassificationId);

  return (
    <>
      <AppHeader title={classification.labelJa} backHref="/vocabulary/idioms" />
      <PageShell className="px-4 py-6">
        <p className="mb-5 text-sm text-zinc-600 dark:text-zinc-400">
          編を選んでフラッシュカード学習 · 枠内のイメージがコアの意味
        </p>
        <SectionTitle>{classification.labelJa}</SectionTitle>
        <ul className="flex flex-col gap-3">
          {groups.map((group) => (
            <li key={group.id}>
              <IdiomGroupCard
                href={`/vocabulary/idioms/${classification.id}/${group.id}`}
                group={group}
                disabled={group.itemCount === 0}
              />
            </li>
          ))}
        </ul>

        <div className="mt-8 border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <SectionTitle>一覧</SectionTitle>
          <NavCard
            href={`/vocabulary/idioms/${classification.id}/table`}
            title="表モード"
            description="編別タブ · 覚えた熟語に★"
            icon="📋"
          />
        </div>
      </PageShell>
    </>
  );
}
