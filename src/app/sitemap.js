const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mirai-jpn.uz";
const NORMALIZED_SITE_URL = SITE_URL.startsWith("http") ? SITE_URL : `https://${SITE_URL}`;

export default function sitemap() {
  return [
    {
      url: NORMALIZED_SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}
