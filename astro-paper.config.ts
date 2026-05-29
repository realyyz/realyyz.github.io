import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://realyyz.github.io/",
    title: "realyyz's blog",
    description: "Your time is limited, so don't waste it living someone else's life.",
    author: "realyyz",
    profile: "https://realyyz.github.io/",
    ogImage: "default-og.jpg",
    lang: "en",
    timezone: "europe/paris",
    dir: "ltr",
  },
  posts: {
    perPage: 4,
    perIndex: 4,
    rssLocale: "zh",
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: true,
      url: "https://github.com/realyyz",
    },
    search: "pagefind",
  },
  socials: [
    { name: "github",   url: "https://github.com/realyyz" },
    { name: "x",        url: "https://mastodon.social/@you_zhou" },
    { name: "linkedin", url: "https://www.linkedin.com/in/you-zhou-793b14224/" },
    { name: "mail",     url: "mailto:1280049620zy@gmail.com" },
  ],
  shareLinks: [
    { name: "whatsapp", url: "https://wa.me/?text=" },
    { name: "facebook", url: "https://www.facebook.com/sharer.php?u=" },
    { name: "x",        url: "https://x.com/intent/post?url=" },
    { name: "telegram", url: "https://t.me/share/url?url=" },
    { name: "pinterest", url: "https://pinterest.com/pin/create/button/?url=" },
    { name: "mail",     url: "mailto:?subject=See%20this%20post&body=" },
  ],
});
