import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { NON_DEFAULT_LOCALES } from "@/i18n/locales";
import { getPostUrl } from "@/utils/getPostPaths";
import { getPostsByLocale } from "@/utils/getPostsByLocale";
import { getSortedPosts } from "@/utils/getSortedPosts";
import config from "@/config";

export function getStaticPaths() {
  return NON_DEFAULT_LOCALES.map(locale => ({ params: { locale } }));
}

export async function GET({ params }: { params: { locale: string } }) {
  const posts = await getCollection("posts");
  const sortedPosts = getSortedPosts(getPostsByLocale(posts, params.locale));

  return rss({
    title: config.site.title,
    description: config.site.description,
    site: config.site.url,
    items: sortedPosts.map(({ data, id, filePath }) => ({
      link: getPostUrl(id, filePath, params.locale),
      title: data.title,
      description: data.description,
      pubDate: new Date(data.modDatetime ?? data.pubDatetime),
    })),
  });
}
