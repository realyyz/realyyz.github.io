import rss from "@astrojs/rss";
import type { CollectionEntry } from "astro:content";
import { getRelativeLocaleUrl } from "astro:i18n";
import { getHomeDescription } from "@/i18n/homeCopy";
import { getPostUrl } from "@/utils/getPostPaths";
import config from "@/config";

type Post = CollectionEntry<"posts">;

function getAbsoluteUrl(path: string): string {
  return new URL(path, config.site.url).href;
}

export function getLocaleSiteUrl(locale: string): string {
  return getAbsoluteUrl(getRelativeLocaleUrl(locale, ""));
}

export function buildRssFeed(locale: string, posts: Post[]) {
  return rss({
    title: config.site.title,
    description: getHomeDescription(locale) || config.site.description,
    site: getLocaleSiteUrl(locale),
    items: posts.map(({ data, id, filePath }) => ({
      link: getAbsoluteUrl(getPostUrl(id, filePath, locale)),
      title: data.title,
      description: data.description,
      pubDate: new Date(data.modDatetime ?? data.pubDatetime),
    })),
  });
}
