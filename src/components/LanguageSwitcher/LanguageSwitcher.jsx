'use client';

import { useEffect, useRef } from 'react';
import './LanguageSwitcher.scss';

const LANGUAGES = [
  { code: 'ru', label: 'Рус' },
  { code: 'uz', label: "O'zb" },
  { code: 'en', label: 'Eng' },
  { code: 'ja', label: '日本語' },
];

export default function LanguageSwitcher({ value, onChange, open, onOpenChange, variant = 'desktop' }) {
  const containerRef = useRef(null);

  const currentLabel = LANGUAGES.find((l) => l.code === value)?.label ?? "O'zb";
  const isDesktop = variant === 'desktop';

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        onOpenChange(false);
      }
    };
    if (open) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [open, onOpenChange]);

  const handleTriggerClick = (e) => {
    e.stopPropagation();
    onOpenChange(!open);
  };

  const handleOptionClick = (e, code) => {
    e.stopPropagation();
    onChange(code);
    onOpenChange(false);
  };

  const rootClass = isDesktop
    ? `language-switcher language-switcher--desktop ${open ? 'language-switcher--open' : ''}`
    : `language-switcher language-switcher--mobile ${open ? 'language-switcher--open' : ''}`;

  return (
    <div
      ref={containerRef}
      className={rootClass}
      role="group"
      aria-label="Tilni tanlash"
    >
      <button
        type="button"
        className="language-switcher__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={handleTriggerClick}
      >
        <span className="language-switcher__current">{currentLabel}</span>
        <span className="language-switcher__chevron" aria-hidden />
      </button>
      <div
        className="language-switcher__dropdown"
        role="listbox"
        aria-activedescendant={isDesktop ? `lang-${value}` : undefined}
      >
        {LANGUAGES.map(({ code, label }) => (
          <button
            key={code}
            type="button"
            id={isDesktop ? `lang-${code}` : undefined}
            role="option"
            aria-selected={value === code}
            className={`language-switcher__option ${value === code ? 'language-switcher__option--active' : ''}`}
            onClick={(e) => handleOptionClick(e, code)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
