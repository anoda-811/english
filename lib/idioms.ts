import raw from "@/data/idioms/idioms.json";

export type IdiomClassificationId = "verb" | "preposition" | "other";

export type IdiomClassification = {
  id: IdiomClassificationId;
  labelJa: string;
  labelEn: string;
  emoji: string;
  descriptionJa: string;
};

export type IdiomGroup = {
  id: string;
  classificationId: IdiomClassificationId;
  labelJa: string;
  headWord: string;
  emoji: string;
  /** コアのイメージ（例: ある状態になる・何かを得る） */
  coreImage: string;
};

export type IdiomItem = {
  id: string;
  groupId: string;
  en: string;
  ja: string;
  /** 英語の例文（1文） */
  exampleEn?: string;
  /** 日本語訳の例文 */
  exampleJa?: string;
};

const data = raw as {
  classifications: IdiomClassification[];
  groups: IdiomGroup[];
  items: IdiomItem[];
};

export function getIdiomClassifications(): IdiomClassification[] {
  return data.classifications;
}

export function getIdiomClassification(id: string): IdiomClassification | undefined {
  return data.classifications.find((c) => c.id === id);
}

export function getIdiomGroups(classificationId: IdiomClassificationId): IdiomGroup[] {
  return data.groups.filter((g) => g.classificationId === classificationId);
}

export function getIdiomGroup(id: string): IdiomGroup | undefined {
  return data.groups.find((g) => g.id === id);
}

export function getIdiomItems(groupId: string): IdiomItem[] {
  return data.items.filter((i) => i.groupId === groupId);
}

export function countIdiomItemsByGroup(groupId: string): number {
  return getIdiomItems(groupId).length;
}

export function getIdiomGroupsWithCount(
  classificationId: IdiomClassificationId,
): (IdiomGroup & { itemCount: number })[] {
  return getIdiomGroups(classificationId).map((group) => ({
    ...group,
    itemCount: countIdiomItemsByGroup(group.id),
  }));
}

export function getIdiomItemsByClassification(
  classificationId: IdiomClassificationId,
): IdiomItem[] {
  const groupIds = new Set(getIdiomGroups(classificationId).map((g) => g.id));
  return data.items.filter((i) => groupIds.has(i.groupId));
}
