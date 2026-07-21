import { notFound } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { PageShell } from "@/components/NavCard";
import { StudySession } from "@/components/vocabulary/StudySession";
import {
  getIdiomClassification,
  getIdiomGroup,
  getIdiomItems,
  type IdiomClassificationId,
} from "@/lib/idioms";

type PageProps = {
  params: Promise<{ classification: string; group: string }>;
};

export default async function IdiomStudyPage({ params }: PageProps) {
  const { classification: classId, group: groupId } = await params;
  const classification = getIdiomClassification(classId);
  const group = getIdiomGroup(groupId);
  if (!classification || !group || group.classificationId !== classification.id) {
    notFound();
  }

  const items = getIdiomItems(group.id);
  if (items.length === 0) notFound();

  return (
    <>
      <AppHeader
        title="熟語"
        backHref={`/vocabulary/idioms/${classification.id as IdiomClassificationId}`}
        backLabel={classification.labelJa}
      />
      <PageShell>
        <div className="mx-4 mt-3 rounded-xl border border-amber-200/70 bg-amber-50/90 px-3 py-2.5 text-sm leading-relaxed text-amber-950 dark:border-amber-800/50 dark:bg-amber-950/35 dark:text-amber-100">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-700/80 dark:text-amber-300/80">
            Core image
          </span>
          <p className="mt-0.5">
            <span className="font-semibold text-amber-800 dark:text-amber-200">
              {group.headWord}
            </span>
            <span className="text-amber-700/80 dark:text-amber-300/80"> = </span>
            <span>「{group.coreImage}」</span>
          </p>
        </div>
        <StudySession
          words={items}
          posLabel={classification.labelJa}
          levelLabel={group.labelJa}
        />
      </PageShell>
    </>
  );
}
