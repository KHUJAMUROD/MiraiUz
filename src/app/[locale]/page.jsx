import { notFound } from 'next/navigation';
import Home from '@/app/page';
import { isValidLocale } from '@/i18n/config';

export default async function LocalizedHomePage({ params }) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  return <Home locale={locale} />;
}
