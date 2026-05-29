export const DEFAULT_LOCALE = "en";

export const SUPPORTED_LOCALES = [
  "en",
  "zh",
  "zh-TW",
  "ar",
  "id",
  "de",
  "el",
  "es",
  "fa",
  "fr",
  "hi",
  "it",
  "ja",
  "ko",
  "nl",
  "pl",
  "pt-BR",
  "ru",
  "th",
  "tr",
  "uk",
  "ur",
  "vi",
] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const NON_DEFAULT_LOCALES = SUPPORTED_LOCALES.filter(
  locale => locale !== DEFAULT_LOCALE
);

export const RTL_LOCALES: readonly SupportedLocale[] = ["ar", "fa", "ur"];

export const LOCALE_LABELS: Record<SupportedLocale, string> = {
  en: "English",
  zh: "简体中文",
  "zh-TW": "繁體中文",
  ar: "العربية",
  id: "Bahasa Indonesia",
  de: "Deutsch",
  el: "Ελληνικά",
  es: "Español",
  fa: "فارسی",
  fr: "Français",
  hi: "हिन्दी",
  it: "Italiano",
  ja: "日本語",
  ko: "한국어",
  nl: "Nederlands",
  pl: "Polski",
  "pt-BR": "Português",
  ru: "Русский",
  th: "ไทย",
  tr: "Türkçe",
  uk: "Українська",
  ur: "اردو",
  vi: "Tiếng Việt",
};

export const LOCALE_REDIRECT_ALIASES: Record<string, SupportedLocale> = {
  "zh-cn": "zh",
  "zh-hans": "zh",
  "zh-sg": "zh",
  "zh-tw": "zh-TW",
  "zh-hant": "zh-TW",
  "zh-hk": "zh-TW",
  "zh-mo": "zh-TW",
  pt: "pt-BR",
  "pt-br": "pt-BR",
};

export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}

export function isRtlLocale(locale: string): boolean {
  return RTL_LOCALES.includes(locale as SupportedLocale);
}
