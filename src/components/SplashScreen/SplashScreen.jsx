'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import SplitText from '@/components/SplitText/SplitText';
import { useI18n } from '@/i18n/I18nProvider';
import { useLowEndDevice } from '@/hooks/useLowEndDevice';
import './SplashScreen.scss';

// Критичные для LCP (hero, фон about, логотип) — для слабых устройств грузим только их
const IMAGES_CRITICAL = [
  '/images/main_pics/main.webp',
  '/images/backgrounds/abot.webp',
  '/images/companyLogos/mirai_logo_sq.png',
];

// Все изображения для предзагрузки (обычный режим)
const IMAGES_TO_PRELOAD = [
  '/images/backgrounds/school_background.webp',
  '/images/backgrounds/abot.webp',
  '/images/backgrounds/3.webp',
  '/images/main_pics/main.webp',
  '/images/about_photos/1.jpg',
  '/images/about_photos/2.jpg',
  '/images/about_photos/3.jpg',
  '/images/about_photos/4.jpg',
  '/images/about_photos/5.jpg',
  '/images/about_photos/123.jpg',
  '/images/about_photos/7.jpg',
  '/images/founders/ASOSCHILAR _OTABEK.jpg',
  '/images/founders/ASOSCHILAR_TIMUR.JPG',
  "/images/teachers/O'G'ILOY.JPG",
  '/images/teachers/OTABEK.jpg',
  '/images/teachers/FERUZA.jpg',
  '/images/teachers/SHOXRUH.jpg',
  '/images/results/oquvchilar-natijalari.png',
  '/images/results/oquvchilar-vizalari.png',
  '/images/companyLogos/mirai_logo_sq.png',
  '/certificates/cfr/DUSILAYEVA_SABINA.webp',
  '/certificates/cfr/GULCHIRA_SENSEI.webp',
  '/certificates/cfr/img476.webp',
  '/certificates/cfr/IMG_0001.webp',
  '/certificates/cfr/JLPT_N2.webp',
  '/certificates/cfr/MALIKA.webp',
  '/certificates/cfr/SAFAROVA_BAKHORA.webp',
  '/certificates/viza/1.webp',
  '/certificates/viza/2.webp',
  '/certificates/viza/3.webp',
  '/certificates/viza/4.webp',
  '/certificates/viza/5.webp',
  '/certificates/viza/6.webp',
  '/certificates/viza/7.webp',
  '/certificates/viza/8.webp',
  '/certificates/viza/9.webp',
  '/certificates/viza/10.webp',
];

const MAX_SPLASH_MS = 5000;
const MIN_SPLASH_MS = 500;

function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => reject(src);
    img.src = src;
  });
}

export default function SplashScreen({ onLoaded }) {
  const { t } = useI18n();
  const { isLowEnd, isLowEndKnown } = useLowEndDevice();
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLowEndKnown) return;
    let isMounted = true;

    async function loadAllResources() {
      const imagesToLoad = isLowEnd ? IMAGES_CRITICAL : IMAGES_TO_PRELOAD;
      const totalImages = imagesToLoad.length;
      let loadedCount = 0;

      const updateProgress = () => {
        if (isMounted) {
          loadedCount++;
          setProgress(Math.round((loadedCount / totalImages) * 100));
        }
      };

      try {
        const loadPromises = imagesToLoad.map((src) =>
          preloadImage(src)
            .then(updateProgress)
            .catch(updateProgress)
        );

        const timeoutPromise = new Promise((resolve) => {
          setTimeout(resolve, MAX_SPLASH_MS);
        });

        await Promise.race([Promise.all(loadPromises), timeoutPromise]);

        await new Promise((resolve) => setTimeout(resolve, MIN_SPLASH_MS));

        if (isMounted) {
          setIsLoading(false);
          setTimeout(() => {
            if (isMounted && onLoaded) onLoaded();
          }, 300);
        }
      } catch (error) {
        if (isMounted) {
          setIsLoading(false);
          setTimeout(() => {
            if (isMounted && onLoaded) onLoaded();
          }, 300);
        }
      }
    }

    loadAllResources();

    return () => {
      isMounted = false;
    };
  }, [onLoaded, isLowEnd, isLowEndKnown]);

  if (!isLoading) {
    return null;
  }

  return (
    <div className={`splash-screen ${!isLoading ? 'splash-screen--hidden' : ''}`}>
      <div className="splash-screen__content">
        <div className="splash-screen__logo">
          <Image
            src="/images/companyLogos/mirai_logo_sq.png"
            alt={t('splash.logoAlt')}
            width={280}
            height={135}
            className="splash-screen__logo-img"
            priority
          />
        </div>
        <SplitText
          text={t('companyMarquee.companyName')}
          className="splash-screen__title"
          tag="div"
          splitType="chars"
          delay={60}
          duration={1}
          from={{ opacity: 0, y: 30 }}
          to={{ opacity: 1, y: 0 }}
          useScrollTrigger={false}
          textAlign="center"
        />
        <SplitText
          text={t('splash.subtitle')}
          className="splash-screen__subtitle"
          tag="div"
          splitType="words"
          delay={40}
          duration={0.9}
          from={{ opacity: 0, y: 24 }}
          to={{ opacity: 1, y: 0 }}
          useScrollTrigger={false}
          textAlign="center"
        />
        <div className="splash-screen__progress">
          <div className="splash-screen__progress-bar">
            <div 
              className="splash-screen__progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="splash-screen__progress-text">{progress}%</span>
        </div>
      </div>
    </div>
  );
}
