'use client';

import { useState, useEffect, useRef } from 'react';
import './Header.scss';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import LanguageSwitcher from '@/components/LanguageSwitcher/LanguageSwitcher';
import { useI18n } from '@/i18n/I18nProvider';
import { DEFAULT_LOCALE, LOCALE_COOKIE_KEY, LOCALE_STORAGE_KEY, SUPPORTED_LOCALES } from '@/i18n/config';

const MOBILE_BREAKPOINT = 992;
const SCROLL_DOWN_THRESHOLD = 60;
const SCROLL_UP_MIN_DELTA = 8;

export default function Header() {
  const { locale, t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [activeLang, setActiveLang] = useState(locale || DEFAULT_LOCALE);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const lastScrollY = useRef(0);
  const isMobile = useRef(false);

  useEffect(() => {
    setActiveLang(locale || DEFAULT_LOCALE);
  }, [locale]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (!storedLocale || !SUPPORTED_LOCALES.includes(storedLocale)) return;
    if (storedLocale === locale) return;
    setPersistedLocale(storedLocale);
    const hash = window.location.hash || '';
    router.replace(`${buildLocalizedPath(storedLocale)}${hash}`);
  }, [locale, router, pathname]);

  const setPersistedLocale = (nextLocale) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
    }
    document.cookie = `${LOCALE_COOKIE_KEY}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
  };

  const buildLocalizedPath = (nextLocale) => {
    const segments = pathname.split('/').filter(Boolean);
    const hasLocaleSegment = segments.length > 0 && SUPPORTED_LOCALES.includes(segments[0]);
    if (hasLocaleSegment) {
      segments[0] = nextLocale;
    } else {
      segments.unshift(nextLocale);
    }
    return `/${segments.join('/')}`;
  };

  const handleLanguageChange = (nextLocale) => {
    if (!SUPPORTED_LOCALES.includes(nextLocale)) return;
    setActiveLang(nextLocale);
    setPersistedLocale(nextLocale);
    setLangDropdownOpen(false);
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    router.push(`${buildLocalizedPath(nextLocale)}${hash}`);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setLangDropdownOpen(false);
  };

  const scrollToHero = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeMenu();
  };

  const scrollToRegistration = (e) => {
    e.preventDefault();
    const registrationSection = document.getElementById('registration-form');
    if (registrationSection) {
      registrationSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    closeMenu();
  };

  const scrollToSection = (sectionId) => (e) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      const header = document.getElementById('header');
      const headerOffset = header?.offsetHeight ?? 0;
      const targetY = section.getBoundingClientRect().top + window.pageYOffset - headerOffset - 12;
      window.scrollTo({ top: Math.max(targetY, 0), behavior: 'smooth' });
      window.dispatchEvent(new CustomEvent('section:navigate', { detail: { sectionId } }));
    }
    closeMenu();
  };

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleResize = () => {
      isMobile.current = window.innerWidth <= MOBILE_BREAKPOINT;
      if (window.innerWidth > MOBILE_BREAKPOINT) {
        closeMenu();
        setHeaderHidden(false);
      }
    };
    isMobile.current = window.innerWidth <= MOBILE_BREAKPOINT;
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          ticking = false;
          if (!isMobile.current) return;
          const y = window.scrollY;
          if (y <= SCROLL_DOWN_THRESHOLD) {
            setHeaderHidden(false);
          } else if (y > lastScrollY.current) {
            setHeaderHidden(true);
            setMenuOpen(false);
          } else if (lastScrollY.current - y >= SCROLL_UP_MIN_DELTA) {
            setHeaderHidden(false);
          }
          lastScrollY.current = y;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      id="header"
      className={`header ${headerHidden ? 'header--hidden' : ''}`}
    >
      <div className="header__container">
        <a href="#hero" className="header__logo" onClick={scrollToHero} aria-label={t('header.logoAria')}>
          <div className="header__logo-icon">
            <Image src="/images/companyLogos/mirai_logo_sq.png" alt="logo" width={280} height={135} />
          </div>
        </a>

        <div className="header__right">
          <nav className="header__nav">
            <a href="#about" className="header__nav-link" onClick={scrollToSection('about')}>
              {t('header.menu.about')}
            </a>
            <a href="#asoschilar-va-ustozlar" className="header__nav-link" onClick={scrollToSection('asoschilar-va-ustozlar')}>
              {t('header.menu.foundersTeachers')}
            </a>
            <a href="#konsalting-courses-section" className="header__nav-link" onClick={scrollToSection('konsalting-courses-section')}>
              {t('header.menu.consultingCourses')}
            </a>
            <a href="#natijalar-section" className="header__nav-link" onClick={scrollToSection('natijalar-section')}>
              {t('header.menu.results')}
            </a>
          </nav>

          <button className="header__cta" type="button" onClick={scrollToRegistration}>
            {t('header.cta')}
          </button>

          <LanguageSwitcher
            value={activeLang}
            onChange={handleLanguageChange}
            open={langDropdownOpen}
            onOpenChange={setLangDropdownOpen}
            variant="desktop"
            ariaLabel={t('languageSwitcher.ariaLabel')}
          />

          <button
            type="button"
            className={`header__burger ${menuOpen ? 'header__burger--open' : ''}`}
            aria-label={menuOpen ? t('header.burgerClose') : t('header.burgerOpen')}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="header__burger-line" />
            <span className="header__burger-line" />
            <span className="header__burger-line" />
          </button>
        </div>
      </div>

      <div
        className={`header__overlay ${menuOpen ? 'header__overlay--visible' : ''}`}
        aria-hidden={!menuOpen}
        onClick={closeMenu}
      />
      <div className={`header__mobile ${menuOpen ? 'header__mobile--open' : ''}`}>
        <nav className="header__mobile-nav">
          <a href="#about" className="header__mobile-link" onClick={scrollToSection('about')}>
            {t('header.menu.about')}
          </a>
          <a href="#asoschilar-va-ustozlar" className="header__mobile-link" onClick={scrollToSection('asoschilar-va-ustozlar')}>
            {t('header.menu.foundersTeachers')}
          </a>
          <a href="#konsalting-courses-section" className="header__mobile-link" onClick={scrollToSection('konsalting-courses-section')}>
            {t('header.menu.consultingCourses')}
          </a>
          <a href="#natijalar-section" className="header__mobile-link" onClick={scrollToSection('natijalar-section')}>
            {t('header.menu.results')}
          </a>
        </nav>
        <button className="header__mobile-cta" type="button" onClick={scrollToRegistration}>
          {t('header.cta')}
        </button>
        <LanguageSwitcher
          value={activeLang}
          onChange={handleLanguageChange}
          open={langDropdownOpen}
          onOpenChange={setLangDropdownOpen}
          variant="mobile"
          ariaLabel={t('languageSwitcher.ariaLabel')}
        />
      </div>
    </header>
  );
}
