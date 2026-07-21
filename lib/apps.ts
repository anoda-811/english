import raw from "@/data/apps.json";

export type AppEntry = {
  id: string;
  title: string;
  description: string;
  href: string;
  emoji: string;
  available: boolean;
};

export function getApps(): AppEntry[] {
  return (raw as { apps: AppEntry[] }).apps;
}
