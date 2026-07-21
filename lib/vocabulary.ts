import raw from "@/data/vocabulary/words.json";

export type PartOfSpeechId = "noun" | "verb" | "adjective" | "adverb" | "other";
export type LevelId = "1" | "2" | "3";

export type PartOfSpeech = {
  id: PartOfSpeechId;
  labelJa: string;
  labelEn: string;
  emoji: string;
};

export type Level = {
  id: LevelId;
  labelJa: string;
  descriptionJa: string;
};

export type VocabularyWord = {
  id: string;
  en: string;
  ja: string;
  pos: PartOfSpeechId;
  level: LevelId;
  exampleEn?: string;
  exampleJa?: string;
};

const data = raw as {
  partsOfSpeech: PartOfSpeech[];
  levels: Level[];
  words: VocabularyWord[];
};

export function getPartsOfSpeech(): PartOfSpeech[] {
  return data.partsOfSpeech;
}

export function getPartOfSpeech(id: string): PartOfSpeech | undefined {
  return data.partsOfSpeech.find((p) => p.id === id);
}

export function getLevels(): Level[] {
  return data.levels;
}

export function getLevel(id: string): Level | undefined {
  return data.levels.find((l) => l.id === id);
}

export function getWords(pos: PartOfSpeechId, level: LevelId): VocabularyWord[] {
  return data.words.filter((w) => w.pos === pos && w.level === level);
}

export function getWordsByPos(pos: PartOfSpeechId): VocabularyWord[] {
  return data.words.filter((w) => w.pos === pos);
}

export function countWordsByPos(pos: PartOfSpeechId): number {
  return data.words.filter((w) => w.pos === pos).length;
}

export function countWordsByPosAndLevel(pos: PartOfSpeechId, level: LevelId): number {
  return getWords(pos, level).length;
}

export function getLevelsWithWordCount(pos: PartOfSpeechId): (Level & { wordCount: number })[] {
  return data.levels.map((level) => ({
    ...level,
    wordCount: countWordsByPosAndLevel(pos, level.id),
  }));
}
