import { BLOG_PATH } from "@/content.config";
import { DEFAULT_LOCALE, isSupportedLocale } from "@/i18n/locales";
import { getLocaleUrl } from "@/utils/getLocaleUrl";
import { slugifyStr } from "./slugify";
import config from "@/config";

function getPostRelativePath(filePath: string | undefined): string {
  if (!filePath) return "";

  const normalizedFilePath = filePath.replaceAll("\\", "/");
  const normalizedBlogPath = BLOG_PATH.replaceAll("\\", "/").replace(
    /\/+$/,
    ""
  );
  const blogPathMarker = `${normalizedBlogPath}/`;
  const markerIndex = normalizedFilePath.lastIndexOf(blogPathMarker);

  if (markerIndex >= 0) {
    return normalizedFilePath.slice(markerIndex + blogPathMarker.length);
  }

  return normalizedFilePath.replace(/^\/+/, "");
}

function getPostLocaleFromSegments(segments: string[]): string | undefined {
  const [firstSegment] = segments;
  return firstSegment && isSupportedLocale(firstSegment)
    ? firstSegment
    : undefined;
}

function stripLocaleSegment(segments: string[]): string[] {
  const [firstSegment, ...restSegments] = segments;
  return firstSegment && isSupportedLocale(firstSegment) ? restSegments : segments;
}

function getPostPathSegments(filePath: string | undefined): string[] {
  const segments = getPostRelativePath(filePath)
    .split("/")
    .filter(path => path !== "")
    .filter(path => !path.startsWith("_"))
    .slice(0, -1)
    .map(segment => slugifyStr(segment));

  return stripLocaleSegment(segments);
}

function getIdSlug(id: string): string {
  const postId = stripLocaleSegment(id.split("/"));
  return postId.length > 0 ? String(postId[postId.length - 1]) : id;
}

function getPostSlugPath(id: string, filePath: string | undefined): string {
  const pathSegments = getPostPathSegments(filePath);
  const slug = getIdSlug(id);
  return pathSegments.length > 0
    ? [...pathSegments, slug].join("/")
    : String(slug);
}

/**
 * Returns the slug-only path for use as a route param in `getStaticPaths`.
 * No base prefix, no locale — Astro handles those at a higher level.
 * e.g. `/examples/my-post`
 */
export function getPostSlug(id: string, filePath: string | undefined): string {
  return `/${getPostSlugPath(id, filePath)}`;
}

/**
 * Returns a fully navigable URL for use in `<a href>` and RSS links.
 * Applies both locale routing and the configured Astro base via
 * `getLocaleUrl`.
 * e.g. `/posts/my-post` or `/en/posts/my-post`
 */
export function getPostUrl(
  id: string,
  filePath: string | undefined,
  locale: string | undefined = config.site.lang
): string {
  return getLocaleUrl(locale, `posts/${getPostSlugPath(id, filePath)}`);
}

export function getPostLocale(
  id: string,
  filePath: string | undefined
): string {
  return (
    getPostLocaleFromSegments(id.split("/")) ??
    getPostLocaleFromSegments(
      getPostRelativePath(filePath)
        .split("/")
        .filter(segment => segment !== "")
    ) ??
    DEFAULT_LOCALE
  );
}
