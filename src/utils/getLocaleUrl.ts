import { DEFAULT_LOCALE, getCanonicalLocale } from "@/i18n/locales";
import { getAssetPath } from "./withBase";

type LocaleUrlOptions = {
  trailingSlash?: boolean;
};

export function getLocaleUrl(
  locale: string,
  path = "",
  { trailingSlash = true }: LocaleUrlOptions = {}
): string {
  const canonicalLocale = getCanonicalLocale(locale);
  const cleanPath = path.replace(/^\/+|\/+$/g, "");
  const localePrefix =
    canonicalLocale === DEFAULT_LOCALE ? "" : canonicalLocale;
  const localizedPath = [localePrefix, cleanPath].filter(Boolean).join("/");
  const outputPath =
    localizedPath && trailingSlash ? `${localizedPath}/` : localizedPath;

  return getAssetPath(outputPath);
}
