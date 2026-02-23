const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mirai-jpn.uz";
const NORMALIZED_SITE_URL = SITE_URL.startsWith("http") ? SITE_URL : `https://${SITE_URL}`;
const LOCALES = ["uz", "ru", "en", "ja"];

export default function sitemap() {
  return LOCALES.map((locale, index) => ({
    url: `${NORMALIZED_SITE_URL}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: index === 0 ? 1 : 0.9,
  }));
}
