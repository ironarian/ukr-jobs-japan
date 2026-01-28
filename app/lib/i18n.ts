// app/lib/i18n.ts
export type Lang = "ua" | "jp" | "en";

export type Dict = Record<
  string,
  { ua: string; jp: string; en: string }
>;

export function t(lang: Lang, dict: Dict, key: keyof Dict): string {
  return dict[key]?.[lang] ?? dict[key]?.ua ?? String(key);
}