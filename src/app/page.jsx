'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Script from 'next/script';
import emailjs from '@emailjs/browser';
import Header from '@/components/Header/header';
import Footer from '@/components/Footer/footer';
import CompanyMarquee from '@/components/CompanyMarquee/CompanyMarquee';
import videosData from '@/store/videos.json';
import './page.scss';

function getYoutubeVideoId(url) {
  if (!url || typeof url !== 'string') return null;
  const match = url.match(/(?:v=|\/shorts\/|youtu\.be\/|\/embed\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const slides = useMemo(() => [
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
    setTimeout(() => setIsTransitioning(false), 1200);
  }, [slides.length, isTransitioning]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsTransitioning(false), 1200);
  }, [slides.length, isTransitioning]);

  const goToSlide = useCallback((index) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 1200);
  }, [currentSlide, isTransitioning]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length, isTransitioning]);

  // Скрываем элемент "build with Spline"
  useEffect(() => {
    const hideSplineBranding = () => {
      const splineViewer = document.querySelector('spline-viewer');
      if (splineViewer) {
        // Пытаемся найти элемент через shadow DOM
        const shadowRoot = splineViewer.shadowRoot;
        if (shadowRoot) {
          const brandingLinks = shadowRoot.querySelectorAll('a[href*="spline"], a[href*="splinetool"]');
          brandingLinks.forEach(link => {
            link.style.display = 'none';
            link.style.visibility = 'hidden';
            link.style.opacity = '0';
            link.style.pointerEvents = 'none';
          });
        }
        
        // Также скрываем элементы вне shadow DOM
        const allLinks = document.querySelectorAll('spline-viewer a[href*="spline"], spline-viewer a[href*="splinetool"]');
        allLinks.forEach(link => {
          link.style.display = 'none';
          link.style.visibility = 'hidden';
          link.style.opacity = '0';
          link.style.pointerEvents = 'none';
        });
      }
    };

    // Выполняем сразу и через интервалы для надежности
    hideSplineBranding();
    const interval = setInterval(hideSplineBranding, 500);
    
    // Также слушаем события загрузки
    window.addEventListener('load', hideSplineBranding);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('load', hideSplineBranding);
    };
  }, []);

  const currentSlideData = useMemo(() => slides[currentSlide], [slides, currentSlide]);

  const faqData = useMemo(() => [
    {
      question: "Yapon tilini bilmayman?",
      answer: "Bu muammo emas! Bizning maktabimizda yapon tilini noldan o'rganish imkoniyati mavjud. Tajribali o'qituvchilarimiz sizga yapon tilini tez va samarali o'rganishda yordam beradi. Kurslar boshlang'ichdan boshlab, bosqichma-bosqich tuzilgan."
    },
    {
      question: "Bo'lib to'lashga imkon bormi?",
      answer: "Ha, albatta! Biz turli xil to'lov shakllarini taklif qilamiz, jumladan bo'lib to'lash imkoniyati ham mavjud. To'lov shartlari va muddatlari har bir talaba bilan individual ravishda muhokama qilinadi va moslashtiriladi."
    },
    {
      question: "Yaponiyaga borgandan keyin ishlay olamanmi?",
      answer: "Ha, o'qish davomida siz haftasiga 28 soatgacha ishlash huquqiga egasiz. Biz sizga ish topishda ham yordam ko'rsatamiz. Yaponiyada o'qish va ishlash imkoniyatlari keng, va bizning mutaxassislarimiz sizga bu jarayonda to'liq yordam ko'rsatadi."
    },
    {
      question: "Sizlarga ishonsa bo'ladimi?",
      answer: "Albatta! Biz 10 yillik tajribaga egamiz va 3000+ talabamiz muvaffaqiyatli Yaponiyada o'qish va ishlash imkoniyatiga ega bo'ldi. Bizning maktabimiz litsenziyalangan va Yaponiyaning rasmiy ta'lim muassasalari bilan hamkorlik qiladi. Barcha hujjatlar yapon mutaxassislari tomonidan tekshiriladi."
    }
  ], []);

  const toggleFaq = useCallback((index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  }, [openFaqIndex]);

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    region: '',
    phone: '',
    email: '',
    comment: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });
  const [showThankYouModal, setShowThankYouModal] = useState(false);

  // Блокировка скролла при открытом модальном окне
  useEffect(() => {
    if (showThankYouModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showThankYouModal]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Очищаем сообщение при изменении формы
    if (submitMessage.text) {
      setSubmitMessage({ type: '', text: '' });
    }
  }, [submitMessage.text]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage({ type: '', text: '' });

    try {
      const templateParams = {
        name: formData.name,
        age: formData.age,
        region: formData.region,
        phone: `+998${formData.phone}`,
        email: formData.email,
        comment: formData.comment || 'Izoh yo\'q',
        date: new Date().toLocaleString('uz-UZ', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
      };

      // Отправка письма владельцу (вам)
      const ownerResult = await emailjs.send(
        'service_wi37gc6',      // Service ID
        'template_rsg5f38',     // Template ID для владельца
        templateParams,
        'jOeGKzCMlJk2YekDb' // Public Key
      );

      console.log('Owner email sent successfully:', ownerResult);

      // Отправка автоматического ответа пользователю
      if (formData.email && formData.email.trim()) {
        try {
          const userResult = await emailjs.send(
            'service_wi37gc6',      // Service ID
            'template_mft8fy2',      // Template ID для автоматического ответа пользователю
            {
              user_name: formData.name,
              email: formData.email.trim(), // Используем 'email' вместо 'user_email' для соответствия шаблону
            },
            'jOeGKzCMlJk2YekDb' // Public Key
          );
          console.log('User reply email sent successfully:', userResult);
        } catch (userError) {
          console.error('Failed to send user reply email:', userError);
          console.error('Error details:', {
            text: userError?.text,
            status: userError?.status,
            message: userError?.message,
            fullError: userError
          });
          // Не показываем ошибку пользователю, если не удалось отправить ответ
          // Письмо владельцу уже отправлено успешно
        }
      }
      
      // Очищаем форму
      setFormData({
        name: '',
        age: '',
        region: '',
        phone: '',
        email: '',
        comment: ''
      });
      
      // Показываем модальное окно с благодарностью
      setShowThankYouModal(true);

    } catch (error) {
      console.error('Email sending failed:', error);
      console.error('Error details:', {
        text: error?.text,
        status: error?.status,
        message: error?.message,
        fullError: error
      });
      
      // Более детальное сообщение об ошибке
      let errorMessage = 'Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring yoki telefon orqali bog\'laning.';
      
      if (error?.text) {
        errorMessage = `Xatolik: ${error.text}`;
      } else if (error?.message) {
        errorMessage = `Xatolik: ${error.message}`;
      }
      
      setSubmitMessage({ 
        type: 'error', 
        text: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  const videosCarouselRef = useRef(null);
  const isScrolling = useRef(false);
  const scrollTimeoutRef = useRef(null);

  // Refs для секций для анимации при скролле
  const whyJapanRef = useRef(null);
  const whyStudytokyoRef = useRef(null);
  const ctaSectionRef = useRef(null);
  const videosSectionRef = useRef(null);
  const faqSectionRef = useRef(null);
  const registrationSectionRef = useRef(null);

  // Состояния для отслеживания видимости секций
  const [visibleSections, setVisibleSections] = useState({
    whyJapan: false,
    whyStudytokyo: false,
    ctaSection: false,
    videosSection: false,
    faqSection: false,
    registrationSection: false
  });

  // Хук для отслеживания видимости элементов при скролле
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.1
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionName = entry.target.dataset.section;
          if (sectionName) {
            setVisibleSections(prev => ({
              ...prev,
              [sectionName]: true
            }));
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Наблюдаем за всеми секциями
    const sections = [
      { ref: whyJapanRef, name: 'whyJapan' },
      { ref: whyStudytokyoRef, name: 'whyStudytokyo' },
      { ref: ctaSectionRef, name: 'ctaSection' },
      { ref: videosSectionRef, name: 'videosSection' },
      { ref: faqSectionRef, name: 'faqSection' },
      { ref: registrationSectionRef, name: 'registrationSection' }
    ];

    sections.forEach(({ ref, name }) => {
      if (ref.current) {
        ref.current.dataset.section = name;
        observer.observe(ref.current);
      }
    });

    return () => {
      sections.forEach(({ ref }) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);

  // Создаем бесконечный массив видео (дублируем в начале и конце)
  const infiniteVideos = useMemo(() => {
    if (!videosData || videosData.length === 0) return [];
    // Дублируем массив 3 раза для бесконечности
    return [...videosData, ...videosData, ...videosData];
  }, []);

  // Получаем ширину одного набора видео
  const getSingleSetWidth = useCallback(() => {
    const el = videosCarouselRef.current;
    if (!el) return 0;
    const cardWidth = el.querySelector('.videos-card')?.offsetWidth ?? 280;
    const gap = 24;
    return (cardWidth + gap) * videosData.length;
  }, []);

  // Инициализация позиции прокрутки
  useEffect(() => {
    const el = videosCarouselRef.current;
    if (!el || infiniteVideos.length === 0) return;
    
    // Ждем, пока элементы отрендерятся
    const initScroll = () => {
      const singleSetWidth = getSingleSetWidth();
      if (singleSetWidth > 0) {
        // Устанавливаем начальную позицию на второй набор видео (середина)
        el.scrollLeft = singleSetWidth;
      }
    };

    const timer = setTimeout(initScroll, 200);
    // Также пробуем после полной загрузки
    window.addEventListener('load', initScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', initScroll);
    };
  }, [infiniteVideos.length, getSingleSetWidth]);

  // Обработка бесконечной прокрутки
  useEffect(() => {
    const el = videosCarouselRef.current;
    if (!el || infiniteVideos.length === 0) return;

    const handleScroll = () => {
      if (isScrolling.current) return;
      
      // Очищаем предыдущий таймаут
      if (scrollTimeoutRef.current) {
        cancelAnimationFrame(scrollTimeoutRef.current);
      }

      // Используем requestAnimationFrame для более точной проверки
      scrollTimeoutRef.current = requestAnimationFrame(() => {
        const singleSetWidth = getSingleSetWidth();
        if (singleSetWidth === 0) return;

        const scrollLeft = el.scrollLeft;
        const thresholdStart = singleSetWidth * 0.15;
        const thresholdEnd = singleSetWidth * 2.0; // Скачок в начале третьего набора — контент тот же, без ощущения «конца»

        // Влево: вышли в первый набор — переносим в конец (третий набор)
        if (scrollLeft < singleSetWidth - thresholdStart) {
          if (isScrolling.current) return;
          isScrolling.current = true;
          const offset = scrollLeft;
          el.style.scrollSnapType = 'none';
          el.style.scrollBehavior = 'auto';
          requestAnimationFrame(() => {
            el.scrollLeft = singleSetWidth * 2 + offset;
            requestAnimationFrame(() => {
              el.style.scrollSnapType = '';
              el.style.scrollBehavior = '';
              setTimeout(() => { isScrolling.current = false; }, 80);
            });
          });
        }
        // Вправо: вошли в третий набор — переносим в первый (бесшовная петля)
        else if (scrollLeft >= thresholdEnd) {
          if (isScrolling.current) return;
          isScrolling.current = true;
          const offset = scrollLeft - singleSetWidth * 2;
          el.style.scrollSnapType = 'none';
          el.style.scrollBehavior = 'auto';
          requestAnimationFrame(() => {
            el.scrollLeft = singleSetWidth + offset;
            requestAnimationFrame(() => {
              el.style.scrollSnapType = '';
              el.style.scrollBehavior = '';
              setTimeout(() => { isScrolling.current = false; }, 80);
            });
          });
        }
      });
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        cancelAnimationFrame(scrollTimeoutRef.current);
      }
    };
  }, [infiniteVideos.length, getSingleSetWidth]);

  const scrollVideos = useCallback((direction) => {
    const el = videosCarouselRef.current;
    if (!el || infiniteVideos.length === 0) return;
    
    const cardWidth = el.querySelector('.videos-card')?.offsetWidth ?? 280;
    const gap = 24;
    const singleCardWidth = cardWidth + gap;
    const scrollAmount = singleCardWidth * (direction === 'next' ? 1 : -1);
    
    // Прокручиваем ровно на одно видео
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    
    // Проверяем границы после прокрутки для бесконечности
    setTimeout(() => {
      const singleSetWidth = getSingleSetWidth();
      if (singleSetWidth === 0) return;
      
      const scrollLeft = el.scrollLeft;
      const threshold = singleSetWidth * 0.15; // 15% от ширины одного набора
      
      // Если прокрутили близко к началу, переключаемся на последний набор
      if (scrollLeft < singleSetWidth - threshold) {
        isScrolling.current = true;
        const offset = scrollLeft;
        el.style.scrollBehavior = 'auto';
        el.classList.add('videos-carousel-jump');
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            el.scrollLeft = singleSetWidth * 2 + offset;
            setTimeout(() => {
              el.classList.remove('videos-carousel-jump');
              el.style.scrollBehavior = 'smooth';
              isScrolling.current = false;
            }, 70);
          });
        });
      }
      // Если прокрутили близко к концу (третий набор), переключаемся на первый набор
      else if (scrollLeft >= singleSetWidth * 2.3) {
        isScrolling.current = true;
        const offset = scrollLeft - singleSetWidth * 2;
        el.style.scrollBehavior = 'auto';
        el.classList.add('videos-carousel-jump');
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            el.scrollLeft = singleSetWidth + offset;
            setTimeout(() => {
              el.classList.remove('videos-carousel-jump');
              el.style.scrollBehavior = 'smooth';
              isScrolling.current = false;
            }, 70);
          });
        });
      }
    }, 400); // Даем время для завершения плавной прокрутки
  }, [infiniteVideos.length, getSingleSetWidth]);

  const regions = [
    'Toshkent',
    'Samarqand',
    'Namangan',
    'Farg\'ona',
    'Andijon',
    'Qashqadaryo',
    'Surxondaryo',
    'Buxoro',
    'Navoiy',
    'Jizzax',
    'Sirdaryo',
    'Xorazm',
    'Qoraqalpog\'iston'
  ];

  return (
    <div className="page">
      <Header />
      
      <main className="main">
        <section className="hero">
          {/* Фоновые изображения для плавного перехода */}
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`hero-background ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.background})` }}
            />
          ))}
          
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

        <section ref={whyJapanRef} className="why-japan">
          <Script
            type="module"
            src="https://unpkg.com/@splinetool/viewer@1.12.41/build/spline-viewer.js"
            strategy="afterInteractive"
          />
          <div className="why-japan-container">
            <div className="why-japan-intro">
              <div className="spline-section">
                <spline-viewer url="https://prod.spline.design/J7TB5fEbHjp-xrUn/scene.splinecode" />
              </div>
              <div className="why-japan-heading">
                <h2 className="why-japan-title">
                  <span className="why-japan-title-black">Nega</span>{' '}
                  <span className="why-japan-title-red">Yaponiya?</span>
                </h2>
                <p className="why-japan-subtitle">
                  Kelajagingiz uchun eng to'g'ri tanlov
                </p>
              </div>
            </div>
            
            <div className="why-japan-grid">
              <div className={`why-japan-card why-japan-card-image ${visibleSections.whyJapan ? 'card-fade-in' : 'card-fade-out'}`} style={{ transitionDelay: '0.1s' }}>
                <div className="card-image-wrapper">
                  <div className="card-image-overlay"></div>
                  <div className="card-content-overlay">
                    <h3 className="card-title-white">Qonuniy Ishlash</h3>
                    <p className="card-description-white">
                      O'qish payti 28 soat/hafta ishlash huquqi
                    </p>
                  </div>
                </div>
              </div>

              <div className={`why-japan-card ${visibleSections.whyJapan ? 'card-fade-in' : 'card-fade-out'}`} style={{ transitionDelay: '0.2s' }}>
                <div className="card-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3V21H21" stroke="#171717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 16L12 11L16 15L21 10" stroke="#171717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="card-title">Top 3 Iqtisodiyot</h3>
                <p className="card-description">
                  Dunyoning eng rivojlangan davlatlaridan biri
                </p>
              </div>

              <div className={`why-japan-card ${visibleSections.whyJapan ? 'card-fade-in' : 'card-fade-out'}`} style={{ transitionDelay: '0.3s' }}>
                <div className="card-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#171717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="card-title">Xavfsiz & Toza</h3>
                <p className="card-description">
                  Jinoyatchilik deyarli yo'q, mukammal infratuzilma
                </p>
              </div>

              <div className={`why-japan-card why-japan-card-image ${visibleSections.whyJapan ? 'card-fade-in' : 'card-fade-out'}`} style={{ transitionDelay: '0.4s' }}>
                <div className="card-image-wrapper">
                  <div className="card-image-overlay"></div>
                  <div className="card-content-overlay">
                    <h3 className="card-title-white">Boy Madaniyat</h3>
                    <p className="card-description-white">
                      Futuristik Tokio va qadimiy Kioto
                    </p>
                  </div>
                </div>
              </div>

              <div className={`why-japan-card why-japan-card-empty ${visibleSections.whyJapan ? 'card-fade-in' : 'card-fade-out'}`} style={{ transitionDelay: '0.5s' }}>
              </div>
            </div>
          </div>
        </section>

        <section ref={whyStudytokyoRef} className="why-studytokyo">
          <div className="why-studytokyo-container">
            <h2 className="why-studytokyo-title">
              <span className="why-studytokyo-title-black">Nega</span>{' '}
              <span className="why-studytokyo-title-red">StudyTokyo?</span>
            </h2>
            
            <div className="why-studytokyo-grid">
              <div className={`studytokyo-card studytokyo-card-red ${visibleSections.whyStudytokyo ? 'card-fade-in' : 'card-fade-out'}`} style={{ transitionDelay: '0.1s' }}>
                <div className="studytokyo-card-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 2V8H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 13H8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 17H8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 9H9H8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="studytokyo-card-title-white">Kafolatlangan Viza</h3>
                <p className="studytokyo-card-description-white">
                  Viza chiqmasa, pulingiz 100% qaytariladi. Tavakkal yo'q.
                </p>
                <div className="studytokyo-stat">
                  <span className="studytokyo-stat-number">95%</span>
                  <span className="studytokyo-stat-label">Muvaffaqiyat</span>
                </div>
              </div>

              <div className={`studytokyo-card studytokyo-card-white ${visibleSections.whyStudytokyo ? 'card-fade-in' : 'card-fade-out'}`} style={{ transitionDelay: '0.2s' }}>
                <div className="studytokyo-card-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="studytokyo-card-title">10 Yillik Tajriba</h3>
                <p className="studytokyo-card-description">
                  Bozor liderlari
                </p>
              </div>

              <div className={`studytokyo-card studytokyo-card-white ${visibleSections.whyStudytokyo ? 'card-fade-in' : 'card-fade-out'}`} style={{ transitionDelay: '0.3s' }}>
                <div className="studytokyo-card-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 2V8H20" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 13H8" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 17H8" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="studytokyo-card-title">Professional Hujjat</h3>
                <p className="studytokyo-card-description">
                  Yapon mutaxassislari
                </p>
              </div>

              <div className={`studytokyo-card studytokyo-card-white ${visibleSections.whyStudytokyo ? 'card-fade-in' : 'card-fade-out'}`} style={{ transitionDelay: '0.4s' }}>
                <div className="studytokyo-card-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 9V5C18 4.46957 17.7893 3.96086 17.4142 3.58579C17.0391 3.21071 16.5304 3 16 3H8C7.46957 3 6.96086 3.21071 6.58579 3.58579C6.21071 3.96086 6 4.46957 6 5V9" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18 9H6" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18 9V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H8C7.46957 21 6.96086 20.7893 6.58579 20.4142C6.21071 20.0391 6 19.5304 6 19V9" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 15V12" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="studytokyo-card-title">Doimiy Qo'llab-quvvatlash</h3>
                <p className="studytokyo-card-description">
                  Yaponiyada ishga joylashish va moslashishda yordam
                </p>
              </div>

              <div className={`studytokyo-card studytokyo-card-white ${visibleSections.whyStudytokyo ? 'card-fade-in' : 'card-fade-out'}`} style={{ transitionDelay: '0.5s' }}>
                <div className="studytokyo-card-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 11C10.6569 11 12 9.65685 12 8C12 6.34315 10.6569 5 9 5C7.34315 5 6 6.34315 6 8C6 9.65685 7.34315 11 9 11Z" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="studytokyo-card-title">JSS Hamkorligi</h3>
                <p className="studytokyo-card-description">
                  Hujjatlar Yapon mutaxassislari tomonidan tekshiriladi
                </p>
              </div>

              <div className={`studytokyo-card studytokyo-card-blue ${visibleSections.whyStudytokyo ? 'card-fade-in' : 'card-fade-out'}`} style={{ transitionDelay: '0.6s' }}>
                <h3 className="studytokyo-card-title-white">6 ta Filial</h3>
                <p className="studytokyo-card-description-white studytokyo-card-cities">
                  Toshkent • Samarqand • Namangan • Farg'ona • Andijon • Qashqadaryo
                </p>
              </div>
            </div>
          </div>
        </section>

        <section ref={ctaSectionRef} className="cta-section">
          <div className="cta-container">
            <div className={`cta-card ${visibleSections.ctaSection ? 'card-fade-in' : 'card-fade-out'}`}>
              <h2 className="cta-title">
                Siz ham sifatni tanlamoqchimisiz?
              </h2>
              <p className="cta-subtitle">
                Unda harakatni bugundan boshlang.
              </p>
              <button className="cta-button">
                Bepul konsultatsiya olish
              </button>
            </div>
          </div>
        </section>

        <section ref={videosSectionRef} className="videos-section">
          <div className="videos-container">
            <h2 className={`videos-title ${visibleSections.videosSection ? 'card-fade-in' : 'card-fade-out'}`}>
              <span className="videos-title-black">MIRAI</span>{' '}
              <span className="videos-title-red">VIDEOS</span>
            </h2>
            <div className={`videos-carousel-wrapper ${visibleSections.videosSection ? 'card-fade-in' : 'card-fade-out'}`} style={{ transitionDelay: '0.2s' }}>
              <button
                type="button"
                className="videos-carousel-btn videos-carousel-btn-prev"
                onClick={() => scrollVideos('prev')}
                aria-label="Oldingi videolar"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <div
                className="videos-carousel"
                ref={videosCarouselRef}
                role="region"
                aria-label="YouTube Shorts karuseli"
              >
                <div className="videos-track">
                  {infiniteVideos.map((video, index) => {
                    const videoId = getYoutubeVideoId(video.url);
                    if (!videoId) return null;
                    return (
                      <a
                        key={`${video.url}-${index}`}
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="videos-card"
                      >
                        <div className="videos-card-iframe-wrapper">
                          <iframe
                            src={`https://www.youtube.com/embed/${videoId}?modestbranding=1`}
                            title={video.title || `Video ${index + 1}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
              <button
                type="button"
                className="videos-carousel-btn videos-carousel-btn-next"
                onClick={() => scrollVideos('next')}
                aria-label="Keyingi videolar"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </section>

        <section ref={faqSectionRef} className="faq-section">
          <div className="faq-container">
            <h2 className={`faq-title ${visibleSections.faqSection ? 'card-fade-in' : 'card-fade-out'}`}>
              Ko'p So'raladigan Savollar
            </h2>
            
            <div className="faq-list">
              {faqData.map((faq, index) => (
                <div 
                  key={index} 
                  className={`faq-item ${openFaqIndex === index ? 'faq-item-open' : ''} ${visibleSections.faqSection ? 'card-fade-in' : 'card-fade-out'}`}
                  style={{ transitionDelay: `${(index + 1) * 0.1}s` }}
                >
                  <button 
                    className="faq-question"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={openFaqIndex === index}
                  >
                    <span className="faq-question-text">{faq.question}</span>
                    <span className="faq-icon">
                      {openFaqIndex === index ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 12H19" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 5V19" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M5 12H19" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </span>
                  </button>
                  <div className={`faq-answer ${openFaqIndex === index ? 'faq-answer-open' : ''}`}>
                    <p className="faq-answer-text">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="registration-form" ref={registrationSectionRef} className="registration-section">
          <div className="registration-container">
            <div className="registration-content">
              <div className={`registration-offer ${visibleSections.registrationSection ? 'card-fade-in' : 'card-fade-out'}`} style={{ transitionDelay: '0.1s' }}>
                <div className="offer-badge">
                  <span className="offer-badge-icon">🔥</span>
                  <span className="offer-badge-text">Cheklangan vaqt</span>
                </div>
                <h2 className="offer-title">
                  Hoziroq Ro'yxatdan O'ting va Joylar soni chegaralangan
                </h2>
                <p className="offer-description">
                  Bu taklif 5 kun ichida dars boshlaydiganlar uchun amal qiladi. Joylar soni cheklangan.
                </p>
                <ul className="offer-benefits">
                  <li className="offer-benefit-item">
                    <span className="benefit-icon">✓</span>
                    <span className="benefit-text">Bepul konsultatsiya</span>
                  </li>
                  <li className="offer-benefit-item">
                    <span className="benefit-icon">✓</span>
                    <span className="benefit-text">Viza kafolati</span>
                  </li>
                  <li className="offer-benefit-item">
                    <span className="benefit-icon">✓</span>
                    <span className="benefit-text">Bonus materiallar</span>
                  </li>
                </ul>
              </div>

              <div className={`registration-form-card ${visibleSections.registrationSection ? 'card-fade-in' : 'card-fade-out'}`} style={{ transitionDelay: '0.2s' }}>
                <h3 className="form-title">Arizani To'ldiring</h3>
                <form className="registration-form" onSubmit={handleSubmit}>
                  {submitMessage.text && (
                    <div className={`form-message form-message-${submitMessage.type}`}>
                      {submitMessage.text}
                    </div>
                  )}
                  <input
                    type="text"
                    name="name"
                    placeholder="Ismingiz"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    disabled={isSubmitting}
                  />
                  <input
                    type="number"
                    name="age"
                    placeholder="Yoshingiz"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    disabled={isSubmitting}
                  />
                 
                  <div className="phone-input-wrapper">
                    <span className="phone-prefix">+998</span>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Tel:"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="form-input form-input-phone"
                      disabled={isSubmitting}
                    />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email manzilingiz"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    disabled={isSubmitting}
                  />
                  <textarea
                    name="comment"
                    placeholder="Izoh yoki savolingiz (ixtiyoriy)"
                    value={formData.comment}
                    onChange={handleInputChange}
                    className="form-input form-textarea"
                    rows="4"
                    disabled={isSubmitting}
                  />
                  <button 
                    type="submit" 
                    className="form-submit-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="form-spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeDasharray="31.416" strokeDashoffset="31.416">
                            <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416;0 31.416" repeatCount="indefinite"/>
                            <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416;-31.416" repeatCount="indefinite"/>
                          </circle>
                        </svg>
                        Yuborilmoqda...
                      </>
                    ) : (
                      <>
                        Chegirmani Olish
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 5L19 12L12 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <CompanyMarquee />
      <Footer />

      {/* Модальное окно с благодарностью */}
      {showThankYouModal && (
        <div className="thank-you-modal-overlay" onClick={() => setShowThankYouModal(false)}>
          <div className="thank-you-modal" onClick={(e) => e.stopPropagation()}>
            <button 
              className="thank-you-modal-close"
              onClick={() => setShowThankYouModal(false)}
              aria-label="Yopish"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="thank-you-modal-content">
              <div className="thank-you-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="#10b981" strokeWidth="2" fill="#d1fae5"/>
                  <path d="M8 12L11 15L16 9" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="thank-you-title">Rahmat!</h2>
              <p className="thank-you-message">
                Arizangiz muvaffaqiyatli qabul qilindi!
              </p>
              <p className="thank-you-description">
                Tez orada mutaxassislarimiz siz bilan bog'lanib, barcha savollaringizga javob beradi.
              </p>
              <button 
                className="thank-you-button"
                onClick={() => setShowThankYouModal(false)}
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
