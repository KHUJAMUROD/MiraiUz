'use client';

import { useState, useEffect } from 'react';
import SplitText from '@/components/SplitText/SplitText';
import './SplashScreen.scss';

// Все изображения для предзагрузки (включая сертификаты и визы)
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
  // Сертификаты CFR (O'quvchilarimiz natijalari)
  '/certificates/cfr/DUSILAYEVA_SABINA.webp',
  '/certificates/cfr/GULCHIRA_SENSEI.webp',
  '/certificates/cfr/img476.webp',
  '/certificates/cfr/IMG_0001.webp',
  '/certificates/cfr/JLPT_N2.webp',
  '/certificates/cfr/MALIKA.webp',
  '/certificates/cfr/SAFAROVA_BAKHORA.webp',
  // Визы (O'quvchilarimiz vizalari)
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

function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => reject(src);
    img.src = src;
  });
}

export default function SplashScreen({ onLoaded }) {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadAllResources() {
      try {
        const totalImages = IMAGES_TO_PRELOAD.length;
        let loadedCount = 0;

        // Предзагрузка всех изображений
        const loadPromises = IMAGES_TO_PRELOAD.map((src) =>
          preloadImage(src)
            .then(() => {
              if (isMounted) {
                loadedCount++;
                setProgress(Math.round((loadedCount / totalImages) * 100));
              }
            })
            .catch(() => {
              // Игнорируем ошибки загрузки отдельных изображений
              if (isMounted) {
                loadedCount++;
                setProgress(Math.round((loadedCount / totalImages) * 100));
              }
            })
        );

        await Promise.all(loadPromises);

        // Минимальное время показа splash screen (для плавности)
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (isMounted) {
          setIsLoading(false);
          setTimeout(() => {
            if (isMounted && onLoaded) {
              onLoaded();
            }
          }, 300); // Небольшая задержка для плавного исчезновения
        }
      } catch (error) {
        console.error('Error preloading images:', error);
        if (isMounted) {
          setIsLoading(false);
          setTimeout(() => {
            if (isMounted && onLoaded) {
              onLoaded();
            }
          }, 300);
        }
      }
    }

    loadAllResources();

    return () => {
      isMounted = false;
    };
  }, [onLoaded]);

  if (!isLoading) {
    return null;
  }

  return (
    <div className={`splash-screen ${!isLoading ? 'splash-screen--hidden' : ''}`}>
      <div className="splash-screen__content">
        <div className="splash-screen__logo">
          <img 
            src="/images/companyLogos/mirai_logo_sq.png" 
            alt="Mirai Logo" 
            className="splash-screen__logo-img"
          />
        </div>
        <SplitText
          text="Mirai"
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
          text="Japanese language center"
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
