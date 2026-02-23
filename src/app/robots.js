const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mirai-jpn.uz";
const NORMALIZED_SITE_URL = SITE_URL.startsWith("http") ? SITE_URL : `https://${SITE_URL}`;

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${NORMALIZED_SITE_URL}/sitemap.xml`,
    host: NORMALIZED_SITE_URL,
  };
}
