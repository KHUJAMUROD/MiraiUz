import { notFound } from 'next/navigation';
import { DEFAULT_LOCALE, isValidLocale, SUPPORTED_LOCALES } from '@/i18n/config';
import { getLocalizedSeo } from '@/i18n/dictionaries';
import LangSync from '@/components/LangSync/LangSync';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mirai-jpn.uz';
const NORMALIZED_SITE_URL = SITE_URL.startsWith('http') ? SITE_URL : `https://${SITE_URL}`;

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const currentLocale = isValidLocale(locale) ? locale : DEFAULT_LOCALE;

  return {
    ...getLocalizedSeo(currentLocale, NORMALIZED_SITE_URL),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    category: 'education',
  };
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  return (
    <>
      <LangSync locale={locale} />
      {children}
    </>
  );
}
