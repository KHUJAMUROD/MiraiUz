import en from "@/i18n/en/common.json";
import ja from "@/i18n/ja/common.json";
import ru from "@/i18n/ru/common.json";
import uz from "@/i18n/uz/common.json";
import { DEFAULT_LOCALE, normalizeLocale } from "@/i18n/config";

const DICTIONARIES = {
  en,
  ja,
  ru,
  uz,
};

export function getMessages(locale) {
  const normalized = normalizeLocale(locale);
  return DICTIONARIES[normalized] || DICTIONARIES[DEFAULT_LOCALE];
}

export function getLocalizedSeo(locale, siteUrl) {
  const messages = getMessages(locale);
  const currentLocale = normalizeLocale(locale);
  const url = `${siteUrl}/${currentLocale}`;
  const alternates = {
    uz: `${siteUrl}/uz`,
    ru: `${siteUrl}/ru`,
    en: `${siteUrl}/en`,
    ja: `${siteUrl}/ja`,
    "x-default": `${siteUrl}/uz`,
  };

  return {
    title: messages.seo.title,
    description: messages.seo.description,
    keywords: messages.seo.keywords,
    alternates: {
      canonical: url,
      languages: alternates,
    },
    openGraph: {
      title: messages.seo.ogTitle,
      description: messages.seo.ogDescription,
      url,
      siteName: "Mirai JPN",
      locale: messages.seo.ogLocale,
      type: "website",
      images: [
        {
          url: "/images/main_pics/main.webp",
          width: 1200,
          height: 630,
          alt: messages.seo.ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: messages.seo.ogTitle,
      description: messages.seo.ogDescription,
      images: ["/images/main_pics/main.webp"],
    },
  };
}
