'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import emailjs from '@emailjs/browser';
import Header from '@/components/Header/header';
import Footer from '@/components/Footer/footer';
import CompanyMarquee from '@/components/CompanyMarquee/CompanyMarquee';
import HeroPage from '@/components/HeroPage/HeroPage';
import SplashScreen from '@/components/SplashScreen/SplashScreen';
import videosData from '@/store/videos.json';
import './page.scss';


const natijalarCertificateImages = [
  '/images/results/oquvchilar-natijalari.png'
];

const natijalarVisaImages = [
  '/images/results/oquvchilar-vizalari.png'
];

const ABOUT_GALLERY_IMAGES = [
  '/images/about_photos/1.jpg',
  '/images/about_photos/3.jpg',
  '/images/about_photos/4.jpg',
  '/images/about_photos/5.jpg',
  '/images/about_photos/123.jpg',
  '/images/about_photos/7.jpg',
];

const FOUNDERS_IMAGES = [
  '/images/founders/ASOSCHILAR _OTABEK.webp',
  '/images/founders/ASOSCHILAR_TIMUR.webp',
];

const TEACHERS_IMAGES = [
  '/images/teachers/OTABEK.webp',
  "/images/teachers/O'G'ILOY.webp",
  '/images/teachers/FERUZA.webp',
  '/images/teachers/SHOXRUH.webp',
];

function getImageUrl(path) {
  return path.split('/').map(part => encodeURIComponent(part)).join('/');
}

function getInstagramReelId(url) {
  if (!url || typeof url !== 'string') return null;
  // Поддерживаем форматы: /reel/VIDEO_ID/, /p/VIDEO_ID/, /reels/VIDEO_ID/
  const match = url.match(/(?:\/reel\/|\/p\/|\/reels\/)([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

export default function Home() {
  const emailjsConfig = {
    serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
    templateOwner: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_OWNER,
    templateReply: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_REPLY,
    publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
  };

  // Состояние для splash screen
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  // Инициализация EmailJS
  useEffect(() => {
    if (emailjsConfig.publicKey) {
      emailjs.init({ publicKey: emailjsConfig.publicKey });
    }
  }, [emailjsConfig.publicKey]);

  const handleSplashLoaded = useCallback(() => {
    setIsSplashVisible(false);
    document.body.style.overflow = '';
  }, []);

  // Блокировка скролла пока показывается splash screen
  useEffect(() => {
    if (isSplashVisible) {
      document.body.style.overflow = 'hidden';
    }
  }, [isSplashVisible]);

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
  const [lightboxImage, setLightboxImage] = useState(null);

  const lightboxIndex = lightboxImage ? ABOUT_GALLERY_IMAGES.indexOf(lightboxImage) : -1;
  const lightboxPrev = useCallback(() => {
    if (lightboxIndex <= 0) return;
    setLightboxImage(ABOUT_GALLERY_IMAGES[lightboxIndex - 1]);
  }, [lightboxIndex]);
  const lightboxNext = useCallback(() => {
    if (lightboxIndex < 0 || lightboxIndex >= ABOUT_GALLERY_IMAGES.length - 1) return;
    setLightboxImage(ABOUT_GALLERY_IMAGES[lightboxIndex + 1]);
  }, [lightboxIndex]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setLightboxImage(null);
      if (e.key === 'ArrowLeft') lightboxPrev();
      if (e.key === 'ArrowRight') lightboxNext();
    };
    if (lightboxImage) {
      document.addEventListener('keydown', handleKey);
    }
    return () => document.removeEventListener('keydown', handleKey);
  }, [lightboxImage, lightboxPrev, lightboxNext]);

  // Блокировка скролла при открытом модальном окне
  useEffect(() => {
    if (showThankYouModal || lightboxImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showThankYouModal, lightboxImage]);

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

      if (!emailjsConfig.serviceId || !emailjsConfig.templateOwner || !emailjsConfig.publicKey) {
        throw new Error('EmailJS not configured. Create .env.local with NEXT_PUBLIC_EMAILJS_* variables.');
      }

      // Отправка письма владельцу (вам)
      const ownerResult = await emailjs.send(
        emailjsConfig.serviceId,
        emailjsConfig.templateOwner,
        templateParams,
        { publicKey: emailjsConfig.publicKey }
      );

      console.log('Owner email sent successfully:', ownerResult);

      // Отправка автоматического ответа пользователю
      if (formData.email && formData.email.trim() && emailjsConfig.templateReply) {
        try {
          const userResult = await emailjs.send(
            emailjsConfig.serviceId,
            emailjsConfig.templateReply,
            {
              user_name: formData.name,
              email: formData.email.trim(),
            },
            { publicKey: emailjsConfig.publicKey }
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
      // EmailJSResponseStatus: status, text — иногда console не показывает их
      const status = error?.status ?? error?.statusCode;
      const text = error?.text ?? error?.message ?? (typeof error === 'string' ? error : null);
      const errObj = { status, text, constructor: error?.constructor?.name };
      console.error('Email sending failed. Status:', status, 'Text:', text, 'Full:', errObj);
      
      let errorMessage = 'Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring yoki telefon orqali bog\'laning.';
      if (text) {
        errorMessage = `Xatolik: ${text}`;
      } else if (status) {
        errorMessage = `Xatolik (${status}). Iltimos, qayta urinib ko\'ring.`;
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
  const teachersSectionRef = useRef(null);
  const ctaSectionRef = useRef(null);
  const konsaltingCoursesSectionRef = useRef(null);
  const coursesBlockRef = useRef(null);
  const natijalarSectionRef = useRef(null);
  const videosSectionRef = useRef(null);
  const registrationSectionRef = useRef(null);

  // Состояния для отслеживания видимости секций
  const [visibleSections, setVisibleSections] = useState({
    whyJapan: false,
    whyStudytokyo: false,
    teachersSection: false,
    ctaSection: false,
    konsaltingCoursesSection: false,
    natijalarSection: false,
    videosSection: false,
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
      { ref: teachersSectionRef, name: 'teachersSection' },
      { ref: ctaSectionRef, name: 'ctaSection' },
      { ref: konsaltingCoursesSectionRef, name: 'konsaltingCoursesSection' },
      { ref: natijalarSectionRef, name: 'natijalarSection' },
      { ref: videosSectionRef, name: 'videosSection' },
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

  // Эффект свечения за курсором на карточках курсов (Yapon tili kurslari)
  useEffect(() => {
    const block = coursesBlockRef.current;
    if (!block) return;

    const handleMouseMove = (e) => {
      const cards = block.querySelectorAll('.course-card');
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const inside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;
        if (inside) {
          const percentX = (x / rect.width) * 100;
          const percentY = (y / rect.height) * 100;
          card.style.setProperty('--glow-x', `${percentX}%`);
          card.style.setProperty('--glow-y', `${percentY}%`);
          card.style.setProperty('--glow-intensity', '1');
        } else {
          card.style.setProperty('--glow-intensity', '0');
        }
      });
    };

    const handleMouseLeave = () => {
      const cards = block.querySelectorAll('.course-card');
      cards.forEach((card) => {
        card.style.setProperty('--glow-intensity', '0');
      });
    };

    block.addEventListener('mousemove', handleMouseMove);
    block.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      block.removeEventListener('mousemove', handleMouseMove);
      block.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Принудительно перезапускаем анимацию при переходе из хедера
  useEffect(() => {
    const timeouts = [];

    const handleSectionNavigate = (event) => {
      const sectionId = event?.detail?.sectionId;
      if (!sectionId) return;

      if (sectionId === 'about') {
        setVisibleSections(prev => ({ ...prev, whyJapan: false }));
        const t = window.setTimeout(() => {
          setVisibleSections(prev => ({ ...prev, whyJapan: true }));
        }, 120);
        timeouts.push(t);
      }

      if (sectionId === 'asoschilar-va-ustozlar') {
        setVisibleSections(prev => ({ ...prev, whyStudytokyo: false, teachersSection: false }));
        const t = window.setTimeout(() => {
          setVisibleSections(prev => ({ ...prev, whyStudytokyo: true }));
        }, 120);
        timeouts.push(t);
      }
    };

    window.addEventListener('section:navigate', handleSectionNavigate);

    return () => {
      window.removeEventListener('section:navigate', handleSectionNavigate);
      timeouts.forEach(timeoutId => window.clearTimeout(timeoutId));
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


  return (
    <div className={`page ${isSplashVisible ? 'splash-active' : ''}`}>
      {isSplashVisible && <SplashScreen onLoaded={handleSplashLoaded} />}
      <Header />
      
      <main className="main">
        <HeroPage />

        <section id="about" ref={whyJapanRef} className="about">
          <div className="why-japan-container">
            <div className={`about-mirai-main ${visibleSections.whyJapan ? 'card-fade-in' : 'card-fade-out'}`}>
              <div className="about-mirai-hero-photo" role="img" aria-label="Mirai jamoasi rasmi" />
              <div className="about-mirai-content">
                <h2 className="about-mirai-title">Biz haqimizda</h2>
                <p className="about-mirai-text">
                  Mirai yoshlar uchun xalqaro ta'lim va rivojlanish imkoniyatlarini ochish maqsadida tashkil etilgan.
                  Bizning asosiy maqsadimiz - talabalarni to'g'ri yo'naltirish, ularning maqsadiga aniq reja bilan
                  olib borish va xorijda muvaffaqiyatli start berishdir.
                </p>
                <p className="about-mirai-text">
                  Ushbu bo'limdagi matnni keyinchalik o'zingizga mos tarzda to'liq yangilashingiz mumkin.
                </p>
              </div>
            </div>

            <div className="about-mirai-gallery">
              {ABOUT_GALLERY_IMAGES.map((src, index) => (
                <button
                  key={src}
                  type="button"
                  className={`about-mirai-gallery-item ${visibleSections.whyJapan ? 'card-fade-in' : 'card-fade-out'}`}
                  style={{ backgroundImage: `url(${src})`, transitionDelay: `${0.1 + index * 0.1}s` }}
                  onClick={() => setLightboxImage(src)}
                  aria-label="Rasmni kattalashtirish"
                >
                  <span className="about-mirai-gallery-zoom" aria-hidden="true">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
                      <path d="M21 21L16.5 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M11 8V14M8 11H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="asoschilar-va-ustozlar" ref={whyStudytokyoRef} className="why-studytokyo">
          <div className="why-studytokyo-container">
            <h2 className={`founders-section-title ${visibleSections.whyStudytokyo ? 'card-fade-in' : 'card-fade-out'}`}>
              Asoschilar va Ustozlar
            </h2>

            <div className="founders-list">
              <article className={`founder-card founder-motion-left ${visibleSections.whyStudytokyo ? 'is-visible' : 'is-hidden'}`} style={{ transitionDelay: '0.1s' }}>
                <div className="founder-avatar founder-avatar-one" style={{ backgroundImage: `url("${getImageUrl(FOUNDERS_IMAGES[0])}")` }} role="img" aria-label="Asoschi 1 fotosurati" />
                <div className="founder-content">
                  <p className="founder-label">Asoschilar</p>
                  <h3 className="founder-name">SAFTAROV OTABEK</h3>
                  <p className="founder-role">Co-Founder & CEO</p>
                  <p className="founder-bio">
                    Azizbek ta'lim loyihalari ustida ko'p yillik tajribaga ega bo'lgan mutaxassis sifatida Mirai'ni
                    yoshlarning global salohiyatini ochish uchun yo'lga qo'ygan. Uning maqsadi - har bir talabaga
                    aniq reja, ishonchli yo'nalish va kuchli natija beradigan tizim yaratish.
                  </p>
                </div>
              </article>

              <article className={`founder-card founder-card-second founder-motion-right ${visibleSections.whyStudytokyo ? 'is-visible' : 'is-hidden'}`} style={{ transitionDelay: '0.4s' }}>
                <div className="founder-avatar founder-avatar-two" style={{ backgroundImage: `url("${getImageUrl(FOUNDERS_IMAGES[1])}")` }} role="img" aria-label="Asoschi 2 fotosurati" />
                <div className="founder-content">
                  <p className="founder-label">Asoschilar</p>
                  <h3 className="founder-name">TIMURKHON KHUSENZADE</h3>
                  <p className="founder-role">Co-Founder & Director</p>
                  <p className="founder-bio">
                    Madina xalqaro ta'lim dasturlarini boshqarish tajribasi bilan Mirai ichida akademik sifat va
                    metodik yo'nalishni nazorat qiladi. U talabalarning moslashuvi, til rivoji va shaxsiy
                    o'sishiga xizmat qiladigan amaliy o'quv konsepsiyalarini ishlab chiqadi.
                  </p>
                </div>
              </article>
            </div>

            <div ref={teachersSectionRef} className="teachers-section">
              <h3 className={`teachers-title ${visibleSections.teachersSection ? 'card-fade-in' : 'card-fade-out'}`} style={{ transitionDelay: '0.05s' }}>
                O'qituvchilar
              </h3>
              <div className="teachers-grid">
                <article className={`teacher-card teacher-motion ${visibleSections.teachersSection ? 'is-visible' : 'is-hidden'}`} style={{ transitionDelay: '0.12s' }}>
                  <div className="teacher-card-photo" style={{ backgroundImage: `url("${getImageUrl(TEACHERS_IMAGES[0])}")` }} role="img" aria-label="Ustoz 1 fotosurati" />
                  <div className="teacher-card-info">
                    <h4 className="teacher-name">Saftarov Otabek</h4>
                    <p className="teacher-role">Akademik maslahatchi</p>
                    <p className="teacher-text">Talabalarga hujjat va o'quv yo'nalish tanlovida doimiy yordam beradi.</p>
                  </div>
                </article>

                <article className={`teacher-card teacher-motion ${visibleSections.teachersSection ? 'is-visible' : 'is-hidden'}`} style={{ transitionDelay: '0.24s' }}>
                  <div className="teacher-card-photo" style={{ backgroundImage: `url("${getImageUrl(TEACHERS_IMAGES[1])}")` }} role="img" aria-label="Ustoz 2 fotosurati" />
                  <div className="teacher-card-info">
                    <h4 className="teacher-name">Oblaqulova O’g’iloy</h4>
                    <p className="teacher-role">Karyera mentori</p>
                    <p className="teacher-text">Yaponiyada ishga moslashish va intervyu tayyorgarligini olib boradi.</p>
                  </div>
                </article>

                <article className={`teacher-card teacher-motion ${visibleSections.teachersSection ? 'is-visible' : 'is-hidden'}`} style={{ transitionDelay: '0.36s' }}>
                  <div className="teacher-card-photo" style={{ backgroundImage: `url("${getImageUrl(TEACHERS_IMAGES[2])}")` }} role="img" aria-label="Ustoz 3 fotosurati" />
                  <div className="teacher-card-info">
                    <h4 className="teacher-name">Bobojanova Feruza</h4>
                    <p className="teacher-role">Yapon tili ustoz</p>
                    <p className="teacher-text">JLPT tayyorgarligi va amaliy gaplashuv bo'yicha darslar olib boradi.</p>
                  </div>
                </article>

                <article className={`teacher-card teacher-motion ${visibleSections.teachersSection ? 'is-visible' : 'is-hidden'}`} style={{ transitionDelay: '0.48s' }}>
                  <div className="teacher-card-photo" style={{ backgroundImage: `url("${getImageUrl(TEACHERS_IMAGES[3])}")` }} role="img" aria-label="Ustoz 4 fotosurati" />
                  <div className="teacher-card-info">
                    <h4 className="teacher-name">Mahkamov Shohrux</h4>
                    <p className="teacher-role">Til amaliyoti murabbiyi</p>
                    <p className="teacher-text">Kunlik nutq va yozuv ko'nikmalarini kuchaytirishga e'tibor qaratadi.</p>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>



        <section id="konsalting-courses-section" ref={konsaltingCoursesSectionRef} className="konsalting-courses-section">
          <div className="konsalting-courses-container">
            <h2 className={`konsalting-courses-title ${visibleSections.konsaltingCoursesSection ? 'card-fade-in' : 'card-fade-out'}`}>
              Konsalting va kurslar
            </h2>

            <div className={`konsalting-block ${visibleSections.konsaltingCoursesSection ? 'card-fade-in' : 'card-fade-out'}`} style={{ transitionDelay: '0.1s' }}>
              <h3 className="konsalting-block-title">Konsalting</h3>
              <p className="konsalting-block-placeholder">
                Bu joy konsalting xizmati haqida batafsil ma'lumot uchun ajratilgan.
              </p>
            </div>

            <div
              id="courses-block"
              ref={coursesBlockRef}
              className={`courses-block courses-block--cursor-glow ${visibleSections.konsaltingCoursesSection ? 'card-fade-in' : 'card-fade-out'}`}
              style={{ transitionDelay: '0.2s' }}
            >
              <h3 className="courses-block-title">Yapon tili kurslari</h3>
              <div className="courses-grid">
                <article className="course-card">
                  <h4 className="course-card-title">Ertalabgi guruh</h4>
                  <div className="course-card-time">9:00 - 11:00</div>
                  <ul className="course-card-list">
                    <li>Haftada 3 kun dars</li>
                    <li>Haftada 5 kun dars</li>
                    <li>Talabalarga shaxsiy akount ochib beriladi</li>
                  </ul>
                  <p className="course-card-price">Haftada 3 kunlik, 1 oyda 13 dars - oylik to'lov 500 000 so'm</p>
                  <p className="course-card-price">Haftada 5 kunlik, 1 oyda 23 dars - oylik to'lov 600 000 so'm</p>
                </article>

                <article className="course-card">
                  <h4 className="course-card-title">Kunduzgi guruh</h4>
                  <div className="course-card-time">14:00 - 16:00</div>
                  <ul className="course-card-list">
                    <li>Haftada 3 kun dars</li>
                    <li>Haftada 5 kun dars</li>
                    <li>Talabalarga shaxsiy akount ochib beriladi</li>
                  </ul>
                  <p className="course-card-price">Haftada 3 kunlik, 1 oyda 13 dars - oylik to'lov 500 000 so'm</p>
                  <p className="course-card-price">Haftada 5 kunlik, 1 oyda 23 dars - oylik to'lov 600 000 so'm</p>
                </article>

                <article className="course-card">
                  <h4 className="course-card-title">Kechgi guruh</h4>
                  <div className="course-card-time">17:00 - 19:00</div>
                  <ul className="course-card-list">
                    <li>Haftada 3 kun dars</li>
                    <li>Haftada 5 kun dars</li>
                    <li>Talabalarga shaxsiy akount ochib beriladi</li>
                  </ul>
                  <p className="course-card-price">Haftada 3 kunlik, 1 oyda 13 dars - oylik to'lov 500 000 so'm</p>
                  <p className="course-card-price">Haftada 5 kunlik, 1 oyda 23 dars - oylik to'lov 600 000 so'm</p>
                </article>
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
              <button
                type="button"
                className="cta-button"
                onClick={() => {
                  const el = document.getElementById('registration-form');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                Bepul konsultatsiya olish
              </button>
            </div>
          </div>
        </section>
        <section id="natijalar-section" ref={natijalarSectionRef} className="natijalar-section">
          <div className="natijalar-container">
            <h2 className={`natijalar-title ${visibleSections.natijalarSection ? 'card-fade-in' : 'card-fade-out'}`}>
              NATIJALAR
            </h2>

            <div className={`natijalar-marquee-block ${visibleSections.natijalarSection ? 'card-fade-in' : 'card-fade-out'}`} style={{ transitionDelay: '0.1s' }}>
              <h3 className="natijalar-marquee-title">O'quvchilarimiz natijalari</h3>
              <div className="natijalar-marquee natijalar-marquee-left" aria-label="O'quvchilarimiz sertifikatlari karuseli">
                <div className="natijalar-marquee-track">
                  {[...natijalarCertificateImages, ...natijalarCertificateImages].map((imageSrc, index) => (
                    <div className="natijalar-marquee-item" key={`${imageSrc}-${index}`}>
                      <img src={imageSrc} alt={`O'quvchi sertifikati ${index + 1}`} loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={`natijalar-marquee-block ${visibleSections.natijalarSection ? 'card-fade-in' : 'card-fade-out'}`} style={{ transitionDelay: '0.2s' }}>
              <h3 className="natijalar-marquee-title">O'quvchilarimiz vizalari</h3>
              <div className="natijalar-marquee natijalar-marquee-right" aria-label="O'quvchilarimiz vizalari karuseli">
                <div className="natijalar-marquee-track">
                  {[...natijalarVisaImages, ...natijalarVisaImages].map((imageSrc, index) => (
                    <div className="natijalar-marquee-item" key={`${imageSrc}-${index}`}>
                      <img src={imageSrc} alt={`O'quvchi vizasi ${index + 1}`} loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>
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
                aria-label="Instagram Reels karuseli"
              >
                <div className="videos-track">
                  {infiniteVideos.map((video, index) => {
                    const reelId = getInstagramReelId(video.url);
                    if (!reelId) return null;
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
                            src={`https://www.instagram.com/reel/${reelId}/embed/?autoplay=1`}
                            title={video.title || `Reel ${index + 1}`}
                            allow="encrypted-media; autoplay; fullscreen"
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
                    placeholder="I.F.O"
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

      {/* Лайтбокс для фотографий галереи */}
      {lightboxImage && (
        <div
          className="about-gallery-lightbox"
          onClick={() => setLightboxImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Rasmni kattalashtirish"
        >
          <button
            type="button"
            className="about-gallery-lightbox-close"
            onClick={() => setLightboxImage(null)}
            aria-label="Yopish"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {lightboxIndex > 0 && (
            <button
              type="button"
              className="about-gallery-lightbox-prev"
              onClick={(e) => { e.stopPropagation(); lightboxPrev(); }}
              aria-label="Oldingi rasm"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
          {lightboxIndex >= 0 && lightboxIndex < ABOUT_GALLERY_IMAGES.length - 1 && (
            <button
              type="button"
              className="about-gallery-lightbox-next"
              onClick={(e) => { e.stopPropagation(); lightboxNext(); }}
              aria-label="Keyingi rasm"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
          <div className="about-gallery-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={lightboxImage} alt="Mirai rasmi" className="about-gallery-lightbox-img" />
          </div>
        </div>
      )}

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
