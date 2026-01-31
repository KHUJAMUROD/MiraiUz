'use client';

import { useState, useEffect } from 'react';
import './Header.scss';
import Image from 'next/image';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

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
      if (window.innerWidth > 992) closeMenu();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header id="header" className="header">
      <div className="header__container">
        <a href="#hero" className="header__logo" onClick={scrollToHero} aria-label="Bosh sahifaga">
          <div className="header__logo-icon">
            <Image src="/images/logos/mirai_logo_sq.png" alt="logo" width={150} height={70} />
          </div>
        </a>

        <nav className="header__nav">
          <a href="#yaponiya" className="header__nav-link" onClick={closeMenu}>
            Yaponiya
          </a>
          <a href="#afzalliklar" className="header__nav-link" onClick={closeMenu}>
            Afzalliklar
          </a>
          <a href="#natijalar" className="header__nav-link" onClick={closeMenu}>
            Natijalar
          </a>
        </nav>

        <button className="header__cta" type="button" onClick={scrollToRegistration}>
          Ariza qoldirish
        </button>

        <button
          type="button"
          className={`header__burger ${menuOpen ? 'header__burger--open' : ''}`}
          aria-label={menuOpen ? 'Yopish' : 'Menyuni ochish'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className="header__burger-line" />
          <span className="header__burger-line" />
          <span className="header__burger-line" />
        </button>
      </div>

      <div
        className={`header__overlay ${menuOpen ? 'header__overlay--visible' : ''}`}
        aria-hidden={!menuOpen}
        onClick={closeMenu}
      />
      <div className={`header__mobile ${menuOpen ? 'header__mobile--open' : ''}`}>
        <nav className="header__mobile-nav">
          <a href="#yaponiya" className="header__mobile-link" onClick={closeMenu}>
            Yaponiya
          </a>
          <a href="#afzalliklar" className="header__mobile-link" onClick={closeMenu}>
            Afzalliklar
          </a>
          <a href="#natijalar" className="header__mobile-link" onClick={closeMenu}>
            Natijalar
          </a>
        </nav>
        <button className="header__mobile-cta" type="button" onClick={scrollToRegistration}>
          Ariza qoldirish
        </button>
      </div>
    </header>
  );
}
