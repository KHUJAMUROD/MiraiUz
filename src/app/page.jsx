'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Header from '@/components/Header/header';
import './page.scss';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const slides = useMemo(() => [
    {
      background: '/images/backgrounds/school background.jpg',
      badge: "JP 95% Viza ko'rsatkichi",
      title: {
        line1: "Kafolatli Viza",
        line2: { white: "Yoki", red: "Pulingiz" },
        line3: { red: "Qaytariladi" }
      },
      description: "3000+ o'quvchi allaqachon Yaponiyada. Orzuingizdagi o'qish va ishga biz bilan erishing."
    },
    {
      background: '/images/backgrounds/school background.jpg',
      badge: "Yaponiyada Ta'lim",
      title: {
        line1: "Sifatli Ta'lim",
        line2: { white: "Va", red: "Karyera" },
        line3: { red: "Imkoniyatlari" }
      },
      description: "Yaponiyaning eng yaxshi universitetlarida ta'lim oling va kelajagingizni quring."
    },
    {
      background: '/images/backgrounds/school background.jpg',
      badge: "Professional Yordam",
      title: {
        line1: "Bizning Jamoa",
        line2: { white: "Sizga", red: "Yordam" },
        line3: { red: "Beradi" }
      },
      description: "Tajribali mutaxassislarimiz sizga viza va ta'lim jarayonida to'liq yordam ko'rsatadi."
    }
  ], []);

  // Предзагрузка изображений
  useEffect(() => {
    const imageUrls = slides.map(slide => slide.background);
    imageUrls.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  }, [slides]);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [slides.length, isTransitioning]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [slides.length, isTransitioning]);

  const goToSlide = useCallback((index) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [currentSlide, isTransitioning]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length, isTransitioning]);

  const currentSlideData = useMemo(() => slides[currentSlide], [slides, currentSlide]);

  return (
    <div className="page">
      <Header />
      
      <main className="main">
        <section className={`hero ${isTransitioning ? 'transitioning' : ''}`} style={{ backgroundImage: `url(${currentSlideData.background})` }}>
          <div className="hero-overlay"></div>
          <div className={`hero-content ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
            <div className="hero-badge">
              {currentSlideData.badge}
            </div>
            
            <h1 className="hero-title">
              <span className="title-line-1">{currentSlideData.title.line1}</span>
              <span className="title-line-2">
                <span className="title-white">{currentSlideData.title.line2.white}</span>{' '}
                <span className="title-red">{currentSlideData.title.line2.red}</span>
              </span>
              <span className="title-line-3">
                <span className="title-red">{currentSlideData.title.line3.red}</span>
              </span>
            </h1>
            
            <p className="hero-description">
              {currentSlideData.description}
            </p>
            
            <button className="hero-button">
              Bepul Konsultatsiya
            </button>
          </div>
          
          <div className="slider-controls">
            <button 
              className="slider-button" 
              onClick={prevSlide} 
              disabled={isTransitioning}
              aria-label="Previous slide"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="slider-indicators">
              {slides.map((_, index) => (
                <span
                  key={index}
                  className={`indicator ${index === currentSlide ? 'indicator-active' : ''} ${isTransitioning ? 'disabled' : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            <button 
              className="slider-button" 
              onClick={nextSlide} 
              disabled={isTransitioning}
              aria-label="Next slide"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
