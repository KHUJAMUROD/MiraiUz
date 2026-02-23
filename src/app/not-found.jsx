'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header/header';
import { getMessages } from '@/i18n/dictionaries';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/i18n/config';
import { I18nProvider } from '@/i18n/I18nProvider';
import './not-found.scss';

export default function NotFound() {
  const pathname = usePathname();
  const localeSegment = pathname.split('/').filter(Boolean)[0];
  const locale = SUPPORTED_LOCALES.includes(localeSegment) ? localeSegment : DEFAULT_LOCALE;
  const messages = getMessages(locale);
  const t = messages.notFound;

  return (
    <I18nProvider locale={locale} messages={messages}>
      <div className="not-found-page">
        <Header />
        <main className="not-found-main">
        <div className="not-found-bg">
          <div className="not-found-sakura not-found-sakura--1">桜</div>
          <div className="not-found-sakura not-found-sakura--2">花</div>
          <div className="not-found-sakura not-found-sakura--3">夢</div>
          <div className="not-found-sakura not-found-sakura--4">道</div>
          <div className="not-found-sakura not-found-sakura--5">明</div>
        </div>

        <div className="not-found-content">
          <div className="not-found-torii" aria-hidden="true">
            <div className="not-found-torii-top" />
            <div className="not-found-torii-pillar not-found-torii-pillar--left" />
            <div className="not-found-torii-pillar not-found-torii-pillar--right" />
          </div>

          <div className="not-found-code">404</div>
          <p className="not-found-kanji">迷い道 — mayoi michi</p>
          <p className="not-found-subtitle">{t.subtitle}</p>
          <p className="not-found-desc">
            {t.description}
          </p>

          <div className="not-found-logo">
            <Image
              src="/images/companyLogos/mirai_logo_sq.png"
              alt="Mirai"
              width={140}
              height={66}
            />
          </div>

          <Link href={`/${locale}`} className="not-found-link">
            <span className="not-found-link-text">{t.backHome}</span>
            <span className="not-found-link-arrow">→</span>
          </Link>
        </div>
        </main>
      </div>
    </I18nProvider>
  );
}
