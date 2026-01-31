'use client';

import React, { memo, useMemo, useRef, useEffect, useState, useCallback } from 'react';
import './CompanyMarquee.scss';

// Логотип Mirai для бегущей строки
import MiraiLogo from '../../../public/images/companyLogos/mirai_logo_sq.png';

const COMPANIES = Array.from({ length: 10 }, () => ({
  name: 'Mirai',
  Logo: MiraiLogo,
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

  // Tab visibility detection - pause animation when tab is not active
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (contentRef.current) {
        if (document.hidden) {
          contentRef.current.style.animationPlayState = 'paused';
        } else if (isVisible) {
          contentRef.current.style.animationPlayState = 'running';
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isVisible]);

  // Optimized Intersection Observer with disconnect after first visibility
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animationStartedRef.current) {
          // Add delay before starting animation to reduce initial load impact
          setTimeout(() => {
            setIsVisible(true);
            animationStartedRef.current = true;
            // Disconnect observer after first visibility to reduce ongoing cost
            if (observerRef.current) {
              observerRef.current.disconnect();
            }
          }, 300);
        }
      },
      {
        threshold: 0.3, // Start animation later for better performance
        rootMargin: '0px' // Remove preloading margin
      }
    );

    if (marqueeRef.current) {
      observerRef.current.observe(marqueeRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
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