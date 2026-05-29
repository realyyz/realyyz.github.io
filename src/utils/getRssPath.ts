import { DEFAULT_LOCALE } from "@/i18n/locales";
import { getLocaleUrl } from "@/utils/getLocaleUrl";

export function getRssPath(locale: string = DEFAULT_LOCALE): string {
  return getLocaleUrl(locale, "rss.xml", { trailingSlash: false });
}
