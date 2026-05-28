import { getCollection } from "astro:content";
import { NON_DEFAULT_LOCALES } from "@/i18n/locales";
import { getPostSlug } from "@/utils/getPostPaths";
import { getPostsByLocale } from "@/utils/getPostsByLocale";
import config from "@/config";

export { GET } from "../../../posts/[...slug]/index.png";

export async function getStaticPaths() {
  if (!config.features.dynamicOgImage) {
    return [];
  }

  const posts = await getCollection("posts");

  return NON_DEFAULT_LOCALES.flatMap(locale =>
    getPostsByLocale(posts, locale)
      .filter(({ data }) => !data.draft && !data.ogImage)
      .map(post => ({
        params: { locale, slug: getPostSlug(post.id, post.filePath) },
        props: post,
      }))
  );
}
