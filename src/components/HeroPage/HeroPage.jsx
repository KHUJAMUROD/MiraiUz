'use client';

import Image from 'next/image';
import './HeroPage.scss';
import { useI18n } from '@/i18n/I18nProvider';

export default function HeroPage() {
  const { t } = useI18n();

  return (
    <section id="hero" className="hero-main">
      <div className="hero-main__background" />

      <div className="hero-main__container">
        <div className="hero-main__media">
          <Image
            src="/images/main_pics/main.webp"
            alt={t('hero.imageAlt')}
            width={1200}
            height={630}
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
        </div>

        <div className="hero-main__content">
          <span className="hero-main__eyebrow">{t('hero.eyebrow')}</span>
          <h1 className="hero-main__title">{t('hero.title')}</h1>
          <p className="hero-main__subtitle">{t('hero.subtitle')}</p>
          <p className="hero-main__description">{t('hero.description')}</p>
        </div>
      </div>
    </section>
  );
}
