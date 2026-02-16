'use client';

import React, { memo, useMemo, useRef, useEffect, useLayoutEffect, useState } from 'react';
import './CompanyMarquee.scss';

// Логотип Mirai для бегущей строки (путь из public — избегаем импорт для корректной работы на хостинге)
const MIRAI_LOGO_SRC = '/images/companyLogos/mirai_logo_sq.png';

const COMPANIES = Array.from({ length: 10 }, () => ({
  name: 'Mirai',
  Logo: MIRAI_LOGO_SRC,
  category: 'Education',
  isUnitSchool: false,
}));

// Optimized logo rendering component
const LogoItem = memo(({ company, keyPrefix }) => {
  const { Logo, name, category, isUnitSchool } = company;
  
  // Determine logo type once and memoize
  const logoProps = useMemo(() => {
    const isReactComponent = typeof Logo === 'function';
    const isImageObject = typeof Logo === 'object' && Logo?.src;
    const imageSrc = isImageObject ? Logo.src : Logo;
    
    return {
      isReactComponent,
      imageSrc,
      className: `company-marquee__logo ${isUnitSchool ? 'company-marquee__logo--unit-school' : ''}`,
      ariaLabel: `${name} logo`
    };
  }, [Logo, name, isUnitSchool]);

  return (
    <div 
      key={keyPrefix}
      className="company-marquee__item"
      aria-label={`${name} - ${category}`}
    >
      {logoProps.isReactComponent ? (
        <Logo 
          className={logoProps.className}
          aria-label={logoProps.ariaLabel}
        />
      ) : (
        <img 
          src={logoProps.imageSrc}
          alt={logoProps.ariaLabel}
          className={logoProps.className}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
        />
      )}
    </div>
  );
});

LogoItem.displayName = 'LogoItem';

const CompanyMarquee = memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const marqueeRef = useRef(null);
  const contentRef = useRef(null);
  const observerRef = useRef(null);
  const animationStartedRef = useRef(false);
  const isVisibleRef = useRef(false);
  const startTimeoutRef = useRef(null);
  const fallbackStartRef = useRef(null);

  isVisibleRef.current = isVisible;

  // Tab visibility: pause when tab hidden, resume when tab visible (always use ref to avoid stale closure)
  useEffect(() => {
    const handleVisibilityChange = () => {
      const content = contentRef.current;
      if (!content) return;
      if (document.hidden) {
        content.style.animationPlayState = 'paused';
      } else {
        if (isVisibleRef.current) {
          content.style.animationPlayState = 'running';
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Intersection Observer: use useLayoutEffect so ref is set and we observe immediately after mount
  useLayoutEffect(() => {
    const el = marqueeRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || animationStartedRef.current) return;
        animationStartedRef.current = true;
        startTimeoutRef.current = setTimeout(() => {
          setIsVisible(true);
          observer.disconnect();
        }, 300);
      },
      { threshold: 0.01, rootMargin: '220px 0px' }
    );

    observer.observe(el);
    observerRef.current = observer;

    // Fallback: если observer по какой-то причине не сработал, запускаем анимацию принудительно
    fallbackStartRef.current = setTimeout(() => {
      if (!animationStartedRef.current) {
        animationStartedRef.current = true;
        setIsVisible(true);
        observer.disconnect();
      }
    }, 1200);

    return () => {
      if (startTimeoutRef.current) clearTimeout(startTimeoutRef.current);
      if (fallbackStartRef.current) clearTimeout(fallbackStartRef.current);
      observer.disconnect();
      observerRef.current = null;
    };
  }, []);

  // Memoize the rendered logo items to prevent recreation
  // Reduced from 3 sets to 2 sets (33% DOM reduction = 16 vs 24 elements)
  const logoItems = useMemo(() => {
    const items = [];
    
    // Generate two sets efficiently (reduced from 3)
    for (let set = 0; set < 2; set++) {
      COMPANIES.forEach((company, index) => {
        items.push(
          <LogoItem 
            key={`${set}-${index}`}
            company={company}
            keyPrefix={`${set}-${index}`}
          />
        );
      });
    }
    
    return items;
  }, []);

  return (
    <section 
      ref={marqueeRef}
      className="company-marquee" 
      aria-label="Trusted educational partners"
    >
      <div className="company-marquee__container">
        <div className="company-marquee__track">
          <div 
            ref={contentRef}
            className={`company-marquee__content ${isVisible ? 'company-marquee__content--animate' : ''}`}
          >
            {logoItems}
          </div>
        </div>
      </div>
    </section>
  );
});

CompanyMarquee.displayName = 'CompanyMarquee';

export default CompanyMarquee; 