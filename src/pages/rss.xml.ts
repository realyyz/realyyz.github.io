import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { getPostsByLocale } from "@/utils/getPostsByLocale";
import { getSortedPosts } from "@/utils/getSortedPosts";
import { getPostUrl } from "@/utils/getPostPaths";
import config from "@/config";

export async function GET() {
  const posts = await getCollection("posts");
  const rssLocale = config.posts.rssLocale;
  const sortedPosts = getSortedPosts(getPostsByLocale(posts, rssLocale));

  return rss({
    title: config.site.title,
    description: config.site.description,
    site: config.site.url,
    items: sortedPosts.map(({ data, id, filePath }) => ({
      link: getPostUrl(id, filePath, rssLocale),
      title: data.title,
      description: data.description,
      pubDate: new Date(data.modDatetime ?? data.pubDatetime),
    })),
  });
}
