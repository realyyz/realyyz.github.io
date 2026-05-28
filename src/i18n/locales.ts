export const DEFAULT_LOCALE = "en";

export const SUPPORTED_LOCALES = [
  "en",
  "zh",
  "fr",
  "es",
  "de",
  "tr",
  "ar",
  "vi",
  "ja",
  "ko",
] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const NON_DEFAULT_LOCALES = SUPPORTED_LOCALES.filter(
  locale => locale !== DEFAULT_LOCALE
);

export const RTL_LOCALES: string[] = ["ar"];

export const LOCALE_LABELS: Record<SupportedLocale, string> = {
  en: "English",
  zh: "Chinese",
  fr: "French",
  es: "Spanish",
  de: "German",
  tr: "Turkish",
  ar: "Arabic",
  vi: "Vietnamese",
  ja: "Japanese",
  ko: "Korean",
};

export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}
