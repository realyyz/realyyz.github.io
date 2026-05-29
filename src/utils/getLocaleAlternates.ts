import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from "@/i18n/locales";
import { getLocaleUrl } from "@/utils/getLocaleUrl";
import { stripBase, stripLocale } from "@/utils/withBase";

function getPathForLocaleUrl(pathname: string, currentLocale: string): string {
  const relativePath = stripBase(pathname);
  const pathWithoutTrailingSlash =
    relativePath.endsWith("/") && relativePath !== "/"
      ? relativePath.slice(0, -1)
      : relativePath;
  const currentPath = stripLocale(pathWithoutTrailingSlash, currentLocale);

  return currentPath === "/" ? "" : currentPath.replace(/^\/+/, "");
}

export function getLocaleAlternates(
  pathname: string,
  currentLocale: string,
  locales: readonly SupportedLocale[] = SUPPORTED_LOCALES
) {
  const pathForLocaleUrl = getPathForLocaleUrl(pathname, currentLocale);

  return locales.map(locale => ({
    locale,
    href: getLocaleUrl(locale, pathForLocaleUrl),
  }));
}

export function getXDefaultAlternate(
  pathname: string,
  currentLocale: string
): string {
  return getLocaleUrl(
    DEFAULT_LOCALE,
    getPathForLocaleUrl(pathname, currentLocale)
  );
}
