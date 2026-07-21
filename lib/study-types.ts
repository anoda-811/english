export type StudyCardItem = {
  id: string;
  en: string;
  ja: string;
  /** 英語の例文（任意・1文） */
  exampleEn?: string;
  /** 日本語訳の例文（任意） */
  exampleJa?: string;
};
