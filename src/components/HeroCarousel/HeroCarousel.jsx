'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import './HeroCarousel.scss';

const DEFAULT_SLIDES = [
  {
    background: '/images/backgrounds/1.jpg',
    badge: "JP 95% Viza ko'rsatkichi",
    title: {
      line1: "Kafolatli Viza",
      line2: { white: "Yoki", red: "Pulingiz" },
      line3: { red: "Qaytariladi" }
    },
    description: "3000+ o'quvchi allaqachon Yaponiyada. Orzuingizdagi o'qish va ishga biz bilan erishing."
  },
  {
    background: '/images/backgrounds/2.jpg',
    badge: "Yaponiyada Ta'lim",
    title: {
      line1: "Sifatli Ta'lim",
      line2: { white: "Va", red: "Karyera" },
      line3: { red: "Imkoniyatlari" }
    },
    description: "Yaponiyaning eng yaxshi universitetlarida ta'lim oling va kelajagingizni quring."
  },
  {
    background: '/images/backgrounds/3.jpg',
    badge: "Professional Yordam",
    title: {
      line1: "Bizning Jamoa",
      line2: { white: "Sizga", red: "Yordam" },
      line3: { red: "Beradi" }
    },
    description: "Tajribali mutaxassislarimiz sizga viza va ta'lim jarayonida to'liq yordam ko'rsatadi."
  }
];

const AUTO_ADVANCE_INTERVAL_MS = 5000;
const BACKGROUND_TRANSITION_MS = 1200;
const AUTO_FADEOUT_DURATION_MS = BACKGROUND_TRANSITION_MS;

export default function HeroCarousel({ slides = DEFAULT_SLIDES, onConsultationClick }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(false);
  const autoAdvanceTimeoutRef = useRef(null);
  const isTransitioningRef = useRef(false);
  const isAutoAdvancingRef = useRef(false);

  isTransitioningRef.current = isTransitioning;
  isAutoAdvancingRef.current = isAutoAdvancing;

  const currentSlideData = useMemo(() => slides[currentSlide], [slides, currentSlide]);

  useEffect(() => {
    const imageUrls = slides.map((slide) => slide.background);
    imageUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, [slides]);

  const TRANSITION_LOCK_MS = 350;

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), TRANSITION_LOCK_MS);
  }, [slides.length, isTransitioning]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), TRANSITION_LOCK_MS);
  }, [slides.length, isTransitioning]);

  const goToSlide = useCallback((index) => {
    if (isTransitioning || index === currentSlide) return;
    setCurrentSlide(index);
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), TRANSITION_LOCK_MS);
  }, [currentSlide, isTransitioning]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isTransitioningRef.current || isAutoAdvancingRef.current) return;
      setIsAutoAdvancing(true);
      autoAdvanceTimeoutRef.current = setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsAutoAdvancing(false);
      }, AUTO_FADEOUT_DURATION_MS);
    }, AUTO_ADVANCE_INTERVAL_MS);
    return () => {
      clearInterval(interval);
      if (autoAdvanceTimeoutRef.current) {
        clearTimeout(autoAdvanceTimeoutRef.current);
      }
    };
  }, [slides.length]);

  return (
    <section id="hero" className="hero-carousel">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`hero-carousel__background ${index === currentSlide ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide.background})` }}
        />
      ))}

      <div className="hero-carousel__overlay" />
      <div
        key={currentSlide}
        className={`hero-carousel__content ${isAutoAdvancing ? 'fade-out' : 'fade-in'}`}
      >
        <div className="hero-carousel__badge">
          {currentSlideData.badge}
        </div>

        <h1 className="hero-carousel__title">
          <span className="hero-carousel__title-line-1">{currentSlideData.title.line1}</span>
          <span className="hero-carousel__title-line-2">
            <span className="hero-carousel__title-white">{currentSlideData.title.line2.white}</span>{' '}
            <span className="hero-carousel__title-red">{currentSlideData.title.line2.red}</span>
          </span>
          <span className="hero-carousel__title-line-3">
            <span className="hero-carousel__title-red">{currentSlideData.title.line3.red}</span>
          </span>
        </h1>

        <p className="hero-carousel__description">
          {currentSlideData.description}
        </p>

        <button
          type="button"
          className="hero-carousel__button"
          onClick={onConsultationClick}
        >
          Bepul Konsultatsiya
        </button>
      </div>

      <div className="hero-carousel__controls">
        <button
          type="button"
          className="hero-carousel__nav-button"
          onClick={prevSlide}
          disabled={isTransitioning || isAutoAdvancing}
          aria-label="Previous slide"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="hero-carousel__indicators">
          {slides.map((_, index) => (
            <span
              key={index}
              role="button"
              tabIndex={0}
              className={`hero-carousel__indicator ${index === currentSlide ? 'hero-carousel__indicator--active' : ''} ${(isTransitioning || isAutoAdvancing) ? 'disabled' : ''}`}
              onClick={() => goToSlide(index)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        <button
          type="button"
          className="hero-carousel__nav-button"
          onClick={nextSlide}
          disabled={isTransitioning || isAutoAdvancing}
          aria-label="Next slide"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </section>
  );
}
