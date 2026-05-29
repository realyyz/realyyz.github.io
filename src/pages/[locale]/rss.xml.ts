import { getCollection } from "astro:content";
import { NON_DEFAULT_LOCALES } from "@/i18n/locales";
import { buildRssFeed } from "@/utils/rss";
import { getPostsByLocale } from "@/utils/getPostsByLocale";
import { getSortedPosts } from "@/utils/getSortedPosts";

export function getStaticPaths() {
  return NON_DEFAULT_LOCALES.map(locale => ({ params: { locale } }));
}

export async function GET({ params }: { params: { locale: string } }) {
  const posts = await getCollection("posts");
  const sortedPosts = getSortedPosts(getPostsByLocale(posts, params.locale));

  return buildRssFeed(params.locale, sortedPosts);
}
