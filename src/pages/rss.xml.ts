import { getCollection } from "astro:content";
import { DEFAULT_LOCALE } from "@/i18n/locales";
import { buildRssFeed } from "@/utils/rss";
import { getPostsByLocale } from "@/utils/getPostsByLocale";
import { getSortedPosts } from "@/utils/getSortedPosts";

export async function GET() {
  const posts = await getCollection("posts");
  const sortedPosts = getSortedPosts(getPostsByLocale(posts, DEFAULT_LOCALE));

  return buildRssFeed(DEFAULT_LOCALE, sortedPosts);
}
