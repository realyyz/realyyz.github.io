import { getRelativeLocaleUrl } from "astro:i18n";
import { DEFAULT_LOCALE } from "@/i18n/locales";

export function getRssPath(locale: string = DEFAULT_LOCALE): string {
  const localeRoot = getRelativeLocaleUrl(locale, "");
  const rootWithSlash = localeRoot.endsWith("/") ? localeRoot : `${localeRoot}/`;

  return `${rootWithSlash}rss.xml`;
}
