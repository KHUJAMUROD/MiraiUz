'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header/header';
import './page.scss';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      background: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=1920&q=80',
      badge: "JP 95% Viza ko'rsatkichi",
      title: {
        line1: "Kafolatli Viza",
        line2: { white: "Yoki", red: "Pulingiz" },
        line3: { red: "Qaytariladi" }
      },
      description: "3000+ o'quvchi allaqachon Yaponiyada. Orzuingizdagi o'qish va ishga biz bilan erishing."
    },
    {
      background: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1920&q=80',
      badge: "Yaponiyada Ta'lim",
      title: {
        line1: "Sifatli Ta'lim",
        line2: { white: "Va", red: "Karyera" },
        line3: { red: "Imkoniyatlari" }
      },
      description: "Yaponiyaning eng yaxshi universitetlarida ta'lim oling va kelajagingizni quring."
    },
    {
      background: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1920&q=80',
      badge: "Professional Yordam",
      title: {
        line1: "Bizning Jamoa",
        line2: { white: "Sizga", red: "Yordam" },
        line3: { red: "Beradi" }
      },
      description: "Tajribali mutaxassislarimiz sizga viza va ta'lim jarayonida to'liq yordam ko'rsatadi."
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const currentSlideData = slides[currentSlide];

  return (
    <div className="page">
      <Header />
      
      <main className="main">
        <section className="hero" style={{ backgroundImage: `url(${currentSlideData.background})` }}>
          <div className="hero-overlay"></div>
          <div className="hero-content">
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
            <button className="slider-button" onClick={prevSlide} aria-label="Previous slide">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="slider-indicators">
              {slides.map((_, index) => (
                <span
                  key={index}
                  className={`indicator ${index === currentSlide ? 'indicator-active' : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            <button className="slider-button" onClick={nextSlide} aria-label="Next slide">
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
