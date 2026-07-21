import { notFound } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { PageShell } from "@/components/NavCard";
import { IdiomTableView } from "@/components/idioms/IdiomTableView";
import {
  getIdiomClassification,
  getIdiomGroups,
  getIdiomItemsByClassification,
  type IdiomClassificationId,
} from "@/lib/idioms";

type PageProps = {
  params: Promise<{ classification: string }>;
};

export default async function IdiomTablePage({ params }: PageProps) {
  const { classification: classId } = await params;
  const classification = getIdiomClassification(classId);
  if (!classification) notFound();

  const cid = classification.id as IdiomClassificationId;
  const groups = getIdiomGroups(cid);
  const items = getIdiomItemsByClassification(cid);

  return (
    <>
      <AppHeader
        title="表モード"
        backHref={`/vocabulary/idioms/${classification.id}`}
        backLabel={classification.labelJa}
      />
      <PageShell className="px-4 py-6">
        <IdiomTableView
          classificationLabel={classification.labelJa}
          groups={groups}
          items={items}
        />
      </PageShell>
    </>
  );
}
