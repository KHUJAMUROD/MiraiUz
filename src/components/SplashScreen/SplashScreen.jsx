'use client';

import { useState, useEffect } from 'react';
import './SplashScreen.scss';

// Все изображения для предзагрузки
const IMAGES_TO_PRELOAD = [
  '/images/backgrounds/school_background.jpg',
  '/images/backgrounds/abot.jpg',
  '/images/about_photos/1.jpg',
  '/images/about_photos/2.jpg',
  '/images/about_photos/3.jpg',
  '/images/about_photos/4.jpg',
  '/images/about_photos/5.jpg',
  '/images/about_photos/6.jpg',
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
        <div className="splash-screen__title">Mirai</div>
        <div className="splash-screen__subtitle">Japan Language Centre</div>
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
