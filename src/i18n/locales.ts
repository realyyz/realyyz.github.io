export const DEFAULT_LOCALE = "en";

export const SUPPORTED_LOCALES = [
  "en",
  "zh",
  "ja",
  "ko",
  "fr",
  "es",
  "de",
  "pt",
] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const NON_DEFAULT_LOCALES = SUPPORTED_LOCALES.filter(
  locale => locale !== DEFAULT_LOCALE
);

export const LOCALE_LABELS: Record<SupportedLocale, string> = {
  en: "English",
  zh: "中文",
  ja: "日本語",
  ko: "한국어",
  fr: "Français",
  es: "Español",
  de: "Deutsch",
  pt: "Português",
};

export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}
