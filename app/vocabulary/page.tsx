import { AppHeader } from "@/components/AppHeader";
import { NavCard, PageShell, SectionTitle } from "@/components/NavCard";
import { VocabularyHero } from "@/components/vocabulary/VocabularyHero";
import { getIdiomItemsByClassification, getIdiomClassifications, type IdiomClassificationId } from "@/lib/idioms";
import { getPartsOfSpeech, getWordsByPos } from "@/lib/vocabulary";

const allWordIds = getPartsOfSpeech().flatMap((pos) =>
  getWordsByPos(pos.id).map((w) => w.id),
);
const allIdiomIds = getIdiomClassifications().flatMap((c) =>
  getIdiomItemsByClassification(c.id as IdiomClassificationId).map((i) => i.id),
);

const MODES = [
  {
    id: "study",
    title: "単語学習",
    description: "品詞 → レベル → フラッシュカード",
    href: "/vocabulary/study",
    emoji: "🃏",
    available: true,
    itemIds: allWordIds,
  },
  {
    id: "idioms",
    title: "熟語学習",
    description: "動詞別・前置詞別 → get編・take編…",
    href: "/vocabulary/idioms",
    emoji: "🔗",
    available: true,
    itemIds: allIdiomIds,
  },
  {
    id: "quiz",
    title: "四択クイズ",
    description: "近日公開",
    href: "#",
    emoji: "❓",
    available: false,
    itemIds: undefined as string[] | undefined,
  },
] as const;

export default function VocabularyHomePage() {
  return (
    <>
      <AppHeader title="英単語" backHref="/" backLabel="一覧" />
      <PageShell className="px-4 py-6">
        <VocabularyHero />
        <SectionTitle>モード</SectionTitle>
        <ul className="flex flex-col gap-3">
          {MODES.map((mode) => (
            <li key={mode.id}>
              <NavCard
                href={mode.href}
                title={mode.title}
                description={mode.description}
                icon={mode.emoji}
                disabled={!mode.available}
                itemIds={mode.available ? [...mode.itemIds] : undefined}
              />
            </li>
          ))}
        </ul>
      </PageShell>
    </>
  );
}
