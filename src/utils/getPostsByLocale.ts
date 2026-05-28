import type { CollectionEntry } from "astro:content";
import { DEFAULT_LOCALE } from "@/i18n/locales";
import { getPostLocale } from "./getPostPaths";

export function getPostsByLocale(
  posts: CollectionEntry<"posts">[],
  locale: string | undefined = DEFAULT_LOCALE
) {
  return posts.filter(post => getPostLocale(post.id) === locale);
}
