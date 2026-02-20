'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

/**
 * Анимация появления текста по буквам/словам.
 * Для SplashScreen: useScrollTrigger={false} — анимация при монтировании.
 * Для страницы: useScrollTrigger={true} (по умолчанию) — при появлении в viewport.
 */
const SplitText = ({
  text,
  className = '',
  delay = 50,
  duration = 1.25,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  useScrollTrigger = false,
  textAlign = 'center',
  tag: Tag = 'p',
  onLetterAnimationComplete,
}) => {
  const ref = useRef(null);
  const completedRef = useRef(false);
  const [fontsLoaded, setFontsLoaded] = useState(!!useScrollTrigger ? false : true);

  useEffect(() => {
    if (useScrollTrigger && typeof document !== 'undefined' && document.fonts) {
      if (document.fonts.status === 'loaded') {
        setFontsLoaded(true);
      } else {
        document.fonts.ready.then(() => setFontsLoaded(true)).catch(() => setFontsLoaded(true));
      }
    }
  }, [useScrollTrigger]);

  useGSAP(
    () => {
      if (!ref.current || !text || !fontsLoaded || completedRef.current) return;
      const el = ref.current;
      const targets = el.querySelectorAll('.split-char, .split-word');
      if (!targets.length) return;

      if (!useScrollTrigger) {
        gsap.set(targets, from);
      }

      const vars = {
        ...to,
        duration,
        ease,
        stagger: delay / 1000,
        onComplete: () => {
          completedRef.current = true;
          onLetterAnimationComplete?.();
        },
        willChange: 'transform, opacity',
        force3D: true,
      };

      if (useScrollTrigger) {
        vars.scrollTrigger = {
          trigger: el,
          start: 'top 90%',
          once: true,
          fastScrollEnd: true,
        };
      }

      const tween = gsap.fromTo(targets, { ...from }, vars);

      return () => {
        tween.kill();
        if (useScrollTrigger) {
          ScrollTrigger.getAll().forEach((st) => st.trigger === el && st.kill());
        }
      };
    },
    {
      dependencies: [text, delay, duration, ease, splitType, fontsLoaded, useScrollTrigger],
      scope: ref,
    }
  );

  const chunks = splitType === 'words' ? text.split(/\s+/) : text.split('');
  const wrapperStyle = {
    textAlign,
    overflow: 'hidden',
    display: 'inline-block',
    whiteSpace: splitType === 'words' ? 'normal' : 'nowrap',
    willChange: 'transform, opacity',
  };

  return (
    <Tag ref={ref} className={`split-parent ${className}`.trim()} style={wrapperStyle}>
      {splitType === 'words'
        ? chunks.map((word, i) => (
            <span key={i} className="split-word" style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
              {word}
              {i < chunks.length - 1 ? '\u00A0' : ''}
            </span>
          ))
        : chunks.map((char, i) => (
            <span key={i} className="split-char" style={{ display: 'inline-block' }}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
    </Tag>
  );
};

export default SplitText;
