'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import emailjs from '@emailjs/browser';
import Header from '@/components/Header/header';
import HeroPage from '@/components/HeroPage/HeroPage';
import SplashScreen from '@/components/SplashScreen/SplashScreen';
import { I18nProvider, useI18n } from '@/i18n/I18nProvider';
import { DEFAULT_LOCALE, normalizeLocale } from '@/i18n/config';
import { getMessages } from '@/i18n/dictionaries';
import videosData from '@/store/videos.json';
import './page.scss';

const CompanyMarquee = dynamic(
  () => import('@/components/CompanyMarquee/CompanyMarquee'),
  { ssr: true, loading: () => <div className="company-marquee-placeholder" aria-hidden="true" style={{ minHeight: 1 }} /> }
);

const Footer = dynamic(
  () => import('@/components/Footer/footer'),
  { ssr: true }
);


// Сертификаты CFR (O'quvchilarimiz natijalari) — бесконечная карусель
const natijalarCertificateImages = [
  '/certificates/cfr/DUSILAYEVA_SABINA.webp',
  '/certificates/cfr/GULCHIRA_SENSEI.webp',
  '/certificates/cfr/img476.webp',
  '/certificates/cfr/IMG_0001.webp',
  '/certificates/cfr/JLPT_N2.webp',
  '/certificates/cfr/MALIKA.webp',
  '/certificates/cfr/SEVINCHN4.webp',
  '/certificates/cfr/SAFAROVA_BAKHORA.webp',
];

// Визы (O'quvchilarimiz vizalari) — бесконечная карусель
const natijalarVisaImages = [
  '/certificates/viza/1.webp',
  '/certificates/viza/2.webp',
  '/certificates/viza/3.webp',
  '/certificates/viza/4.webp',
  '/certificates/viza/5.webp',
  '/certificates/viza/6.webp',
  '/certificates/viza/7.webp',
  '/certificates/viza/8.webp',
  '/certificates/viza/9.webp',
  '/certificates/viza/10.webp',
];

const ABOUT_GALLERY_IMAGES = [
  '/images/about_photos/3.jpg',
  '/images/about_photos/1.jpg',
  '/images/about_photos/5.jpg',
  '/images/about_photos/4.jpg',
  '/images/about_photos/123.jpg',
  '/images/about_photos/7.jpg',
];

const FOUNDERS_IMAGES = [
  '/images/founders/ASOSCHILAR _OTABEK.webp',
  '/images/founders/ASOSCHILAR_TIMUR.webp',
];

const TEACHERS_IMAGES = [
  "/images/teachers/O'G'ILOY.webp",
  '/images/teachers/OTABEK.webp',
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

function highlightCertificateTerms(text) {
  const CERT_PATTERN = /(JLPT(?:\s*N[1-5])?|NAT-TEST(?:\s*N[1-5])?|CEFR\s*C[12])/g;
  const CERT_SINGLE = /^(JLPT(?:\s*N[1-5])?|NAT-TEST(?:\s*N[1-5])?|CEFR\s*C[12])$/;
  return text.split(CERT_PATTERN).map((part, index) => (
    CERT_SINGLE.test(part)
      ? <span key={`${part}-${index}`} className="teacher-cert">{part}</span>
      : part
  ));
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mirai-jpn.uz';
const NORMALIZED_SITE_URL = SITE_URL.startsWith('http') ? SITE_URL : `https://${SITE_URL}`;

function getStructuredData(locale, seoDescription) {
  const localizedUrl = `${NORMALIZED_SITE_URL}/${locale}`;

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Mirai JPN',
      alternateName: ['Mirai', 'MiraiJpn', 'Mirai Uzbekistan'],
      url: localizedUrl,
      logo: `${NORMALIZED_SITE_URL}/images/companyLogos/mirai_logo_sq.png`,
      email: 'languagecentermirai.uz@gmail.com',
      telephone: '+998888930888',
      sameAs: [
        'https://www.instagram.com/mirai_uz',
        'https://t.me/mirai_uzyapontilicenter',
        'https://wa.me/998888930888'
      ],
      foundingDate: '2023'
    },
    {
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      name: 'Mirai Japan Language Centre',
      url: localizedUrl,
      description: seoDescription,
      areaServed: 'UZ',
      knowsAbout: ['Japanese language', 'JLPT', 'NAT-TEST', 'Student visa', 'Japan study'],
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          telephone: '+998888930888',
          areaServed: 'UZ',
          availableLanguage: ['uz', 'ru', 'en', 'ja']
        }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Mirai JPN',
      alternateName: 'MiraiJpn',
      url: localizedUrl,
      inLanguage: locale
    }
  ];
}

function HomeContent({ locale }) {
  const { t, messages } = useI18n();
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
  const [natijalarLightbox, setNatijalarLightbox] = useState(null); // URL открытого сертификата/визы
  const natijalarLastOpenRef = useRef(0);

  const openNatijalarLightbox = useCallback((event, imageSrc) => {
    if (!imageSrc) return;
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // На мобильных предотвращаем двойной триггер pointer/click в очень коротком интервале.
    const now = Date.now();
    if (now - natijalarLastOpenRef.current < 280) return;
    natijalarLastOpenRef.current = now;
    setNatijalarLightbox(imageSrc);
  }, []);

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
      if (natijalarLightbox) {
        if (e.key === 'Escape') setNatijalarLightbox(null);
        return;
      }
      if (e.key === 'Escape') setLightboxImage(null);
      if (e.key === 'ArrowLeft') lightboxPrev();
      if (e.key === 'ArrowRight') lightboxNext();
    };
    if (lightboxImage || natijalarLightbox) {
      document.addEventListener('keydown', handleKey);
    }
    return () => document.removeEventListener('keydown', handleKey);
  }, [lightboxImage, lightboxPrev, lightboxNext, natijalarLightbox]);

  // Блокировка скролла при открытом модальном окне
  useEffect(() => {
    if (showThankYouModal || lightboxImage || natijalarLightbox) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showThankYouModal, lightboxImage, natijalarLightbox]);

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
        comment: formData.comment || '-',
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

      let errorMessage = t('page.messages.errorFallback');
      if (text) {
        errorMessage = `${t('page.messages.errorPrefix')} ${text}`;
      } else if (status) {
        errorMessage = `${t('page.messages.errorWithCode')} (${status}).`;
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

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const pageT = messages.page;
  const seoStructuredData = useMemo(
    () => getStructuredData(locale, messages.seo.description),
    [locale, messages.seo.description]
  );
  const founders = pageT.foundersTeachers.founders;
  const teachers = pageT.foundersTeachers.teachers;
  const courses = pageT.consultingCourses.courses;


  return (
    <div className={`page ${isSplashVisible ? 'splash-active' : ''}`}>
      {seoStructuredData.map((schema, index) => (
        <script
          key={`seo-schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {isSplashVisible && <SplashScreen onLoaded={handleSplashLoaded} />}
      <Header />

      <main className="main">
        <HeroPage />

        <section id="about" ref={whyJapanRef} className="about">
          <div className="why-japan-container">
            <div className={`about-mirai-main ${visibleSections.whyJapan ? 'card-fade-in' : 'card-fade-out'}`}>
              <div className="about-mirai-hero-photo" role="img" aria-label={pageT.about.teamPhotoAria} />
              <div className="about-mirai-content">
                <h2 className="about-mirai-title">{pageT.about.title}</h2>
                {pageT.about.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="about-mirai-text">
                    {paragraph}
                  </p>
                ))}
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
                  aria-label={pageT.about.zoomAria}
                >
                  <span className="about-mirai-gallery-zoom" aria-hidden="true">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                      <path d="M21 21L16.5 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M11 8V14M8 11H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
              {pageT.foundersTeachers.title}
            </h2>

            <div className="founders-list">


              <article className={`founder-card founder-card-second founder-motion-right ${visibleSections.whyStudytokyo ? 'is-visible' : 'is-hidden'}`} style={{ transitionDelay: '0.4s' }}>
                <div className="founder-avatar founder-avatar-two" style={{ backgroundImage: `url("${getImageUrl(FOUNDERS_IMAGES[1])}")` }} role="img" aria-label={`${pageT.foundersTeachers.founderPhotoAria}: ${founders[0].name}`} />
                <div className="founder-content">
                  <p className="founder-label">{pageT.foundersTeachers.founderLabel}</p>
                  <h3 className="founder-name">{founders[0].name}</h3>
                  <p className="founder-role">{founders[0].role}</p>
                  <blockquote className="founder-quote">
                    {founders[0].quote}
                  </blockquote>
                  <p className="founder-bio">
                    {founders[0].bio}
                  </p>
                </div>
              </article>
              <article className={`founder-card founder-motion-left ${visibleSections.whyStudytokyo ? 'is-visible' : 'is-hidden'}`} style={{ transitionDelay: '0.1s' }}>
                <div className="founder-avatar founder-avatar-one" style={{ backgroundImage: `url("${getImageUrl(FOUNDERS_IMAGES[0])}")` }} role="img" aria-label={`${pageT.foundersTeachers.founderPhotoAria}: ${founders[1].name}`} />
                <div className="founder-content">
                  <p className="founder-label">{pageT.foundersTeachers.founderLabel}</p>
                  <h3 className="founder-name">{founders[1].name}</h3>
                  <p className="founder-role">{founders[1].role}</p>
                  <blockquote className="founder-quote">
                    {founders[1].quote}
                  </blockquote>
                  <p className="founder-bio">
                    {founders[1].bio}
                  </p>
                </div>
              </article>
            </div>

            <div ref={teachersSectionRef} className="teachers-section">
              <h3 className={`teachers-title ${visibleSections.teachersSection ? 'card-fade-in' : 'card-fade-out'}`} style={{ transitionDelay: '0.05s' }}>
                {pageT.foundersTeachers.teachersTitle}
              </h3>
              <div className="teachers-grid">
                <article className={`teacher-card teacher-motion ${visibleSections.teachersSection ? 'is-visible' : 'is-hidden'}`} style={{ transitionDelay: '0.12s' }}>
                  <div className="teacher-card-photo" style={{ backgroundImage: `url("${getImageUrl(TEACHERS_IMAGES[0])}")` }} role="img" aria-label={`${pageT.foundersTeachers.teacherPhotoAria}: ${teachers[0].name}`} />
                  <div className="teacher-card-info">
                    <h4 className="teacher-name">{teachers[0].name}</h4>
                    <p className="teacher-role">{teachers[0].role}</p>
                    <p className="teacher-text">{highlightCertificateTerms(teachers[0].text)}</p>
                    <div className="teacher-edu">
                      <span className="teacher-edu-label">{teachers[0].educationLabel}</span>
                      <ul>
                        {teachers[0].educationItems.map((item) => <li key={item}>{highlightCertificateTerms(item)}</li>)}
                      </ul>
                    </div>
                  </div>
                </article>

                <article className={`teacher-card teacher-motion ${visibleSections.teachersSection ? 'is-visible' : 'is-hidden'}`} style={{ transitionDelay: '0.24s' }}>
                  <div className="teacher-card-photo" style={{ backgroundImage: `url("${getImageUrl(TEACHERS_IMAGES[1])}")` }} role="img" aria-label={`${pageT.foundersTeachers.teacherPhotoAria}: ${teachers[1].name}`} />
                  <div className="teacher-card-info">
                    <h4 className="teacher-name">{teachers[1].name}</h4>
                    <p className="teacher-role">{teachers[1].role}</p>
                    <p className="teacher-text">{highlightCertificateTerms(teachers[1].text)}</p>
                    <div className="teacher-edu">
                      <span className="teacher-edu-label">{teachers[1].educationLabel}</span>
                      <ul>
                        {teachers[1].educationItems.map((item) => <li key={item}>{highlightCertificateTerms(item)}</li>)}
                      </ul>
                    </div>
                  </div>
                </article>

                <article className={`teacher-card teacher-motion ${visibleSections.teachersSection ? 'is-visible' : 'is-hidden'}`} style={{ transitionDelay: '0.36s' }}>
                  <div className="teacher-card-photo" style={{ backgroundImage: `url("${getImageUrl(TEACHERS_IMAGES[2])}")` }} role="img" aria-label={`${pageT.foundersTeachers.teacherPhotoAria}: ${teachers[2].name}`} />
                  <div className="teacher-card-info">
                    <h4 className="teacher-name">{teachers[2].name}</h4>
                    <p className="teacher-role">{teachers[2].role}</p>
                    <p className="teacher-text">{highlightCertificateTerms(teachers[2].text)}</p>
                    <div className="teacher-edu">
                      <span className="teacher-edu-label">{teachers[2].educationLabel}</span>
                      <ul>
                        {teachers[2].educationItems.map((item) => <li key={item}>{highlightCertificateTerms(item)}</li>)}
                      </ul>
                    </div>
                  </div>
                </article>

                <article className={`teacher-card teacher-motion ${visibleSections.teachersSection ? 'is-visible' : 'is-hidden'}`} style={{ transitionDelay: '0.48s' }}>
                  <div className="teacher-card-photo" style={{ backgroundImage: `url("${getImageUrl(TEACHERS_IMAGES[3])}")` }} role="img" aria-label={`${pageT.foundersTeachers.teacherPhotoAria}: ${teachers[3].name}`} />
                  <div className="teacher-card-info">
                    <h4 className="teacher-name">{teachers[3].name}</h4>
                    <p className="teacher-role">{teachers[3].role}</p>
                    <p className="teacher-text">{highlightCertificateTerms(teachers[3].text)}</p>
                    <div className="teacher-edu">
                      <span className="teacher-edu-label">{teachers[3].educationLabel}</span>
                      <ul>
                        {teachers[3].educationItems.map((item) => <li key={item}>{highlightCertificateTerms(item)}</li>)}
                      </ul>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>



        <section id="konsalting-courses-section" ref={konsaltingCoursesSectionRef} className="konsalting-courses-section">
          <div className="konsalting-courses-container">
            <h2 className={`konsalting-courses-title ${visibleSections.konsaltingCoursesSection ? 'card-fade-in' : 'card-fade-out'}`}>
              {pageT.consultingCourses.title}
            </h2>

            <div className={`konsalting-block ${visibleSections.konsaltingCoursesSection ? 'card-fade-in' : 'card-fade-out'}`} style={{ transitionDelay: '0.1s' }}>
              <h3 className="konsalting-block-title">{pageT.consultingCourses.consultingTitle}</h3>
              <p className="konsalting-intro">
                {pageT.consultingCourses.consultingIntro}
              </p>
              <p className="konsalting-services-title">{pageT.consultingCourses.consultingServicesTitle}</p>
              <ol className="konsalting-list">
                {pageT.consultingCourses.consultingList.map((item) => (
                  <li key={item} className="konsalting-list-item">{item}</li>
                ))}
              </ol>
              <div className="konsalting-result">
                <span className="konsalting-result-label">{pageT.consultingCourses.resultLabel}</span>{' '}
                {pageT.consultingCourses.resultText}
              </div>
            </div>

            <div
              id="courses-block"
              ref={coursesBlockRef}
              className={`courses-block courses-block--cursor-glow ${visibleSections.konsaltingCoursesSection ? 'card-fade-in' : 'card-fade-out'}`}
              style={{ transitionDelay: '0.2s' }}
            >
              <h3 className="courses-block-title">{pageT.consultingCourses.coursesTitle}</h3>
              <div className="courses-grid">
                {courses.map((course) => (
                  <article key={course.title} className="course-card">
                    <h4 className="course-card-title">{course.title}</h4>
                    <div className="course-card-time">{course.time}</div>
                    <ul className="course-card-list">
                      {pageT.consultingCourses.courseCommonBullets.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                    <p className="course-card-price">{pageT.consultingCourses.coursePlanOne}</p>
                    <p className="course-card-price">{pageT.consultingCourses.coursePlanTwo}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section ref={ctaSectionRef} className="cta-section">
          <div className="cta-container">
            <div className={`cta-card ${visibleSections.ctaSection ? 'card-fade-in' : 'card-fade-out'}`}>
              <h2 className="cta-title">
                {pageT.cta.title}
              </h2>
              <button
                type="button"
                className="cta-button"
                onClick={() => {
                  const el = document.getElementById('registration-form');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                {pageT.cta.button}
              </button>
            </div>
          </div>
        </section>
        <section
          id="natijalar-section"
          ref={natijalarSectionRef}
          className={`natijalar-section ${natijalarLightbox ? 'natijalar-section--modal-open' : ''}`}
        >
          <div className="natijalar-container">
            <h2 className={`natijalar-title ${visibleSections.natijalarSection ? 'card-fade-in' : 'card-fade-out'}`}>
              {pageT.results.title}
            </h2>

            <div className={`natijalar-marquee-block ${visibleSections.natijalarSection ? 'card-fade-in' : 'card-fade-out'}`} style={{ transitionDelay: '0.1s' }}>
              <h3 className="natijalar-marquee-title">{pageT.results.certificatesTitle}</h3>
              <div className="natijalar-marquee natijalar-marquee-left" aria-label={pageT.results.certificatesTitle}>
                <div className="natijalar-marquee-track">
                  {[...natijalarCertificateImages, ...natijalarCertificateImages, ...natijalarCertificateImages].map((imageSrc, index) => (
                    <button
                      type="button"
                      className="natijalar-marquee-item"
                      key={`cert-${imageSrc}-${index}`}
                      onPointerDown={(e) => e.preventDefault()}
                      onPointerUp={(e) => {
                        if (e.pointerType === 'mouse' && e.button !== 0) return;
                        openNatijalarLightbox(e, imageSrc);
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        openNatijalarLightbox(e, imageSrc);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          openNatijalarLightbox(e, imageSrc);
                        }
                      }}
                      aria-label={pageT.results.certificateZoomAria}
                    >
                      <img src={imageSrc} alt={`${pageT.results.certificateAlt} ${(index % natijalarCertificateImages.length) + 1}`} loading="lazy" draggable="false" />
                      <span className="natijalar-marquee-item-zoom" aria-hidden="true">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                          <path d="M16 16L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={`natijalar-marquee-block ${visibleSections.natijalarSection ? 'card-fade-in' : 'card-fade-out'}`} style={{ transitionDelay: '0.2s' }}>
              <h3 className="natijalar-marquee-title">{pageT.results.visasTitle}</h3>
              <div className="natijalar-marquee natijalar-marquee-right" aria-label={pageT.results.visasTitle}>
                <div className="natijalar-marquee-track">
                  {[...natijalarVisaImages, ...natijalarVisaImages, ...natijalarVisaImages].map((imageSrc, index) => (
                    <button
                      type="button"
                      className="natijalar-marquee-item"
                      key={`viza-${imageSrc}-${index}`}
                      onPointerDown={(e) => e.preventDefault()}
                      onPointerUp={(e) => {
                        if (e.pointerType === 'mouse' && e.button !== 0) return;
                        openNatijalarLightbox(e, imageSrc);
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        openNatijalarLightbox(e, imageSrc);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          openNatijalarLightbox(e, imageSrc);
                        }
                      }}
                      aria-label={pageT.results.visaZoomAria}
                    >
                      <img src={imageSrc} alt={`${pageT.results.visaAlt} ${(index % natijalarVisaImages.length) + 1}`} loading="lazy" draggable="false" />
                      <span className="natijalar-marquee-item-zoom" aria-hidden="true">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                          <path d="M16 16L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section ref={videosSectionRef} className="videos-section">
          <div className="videos-container">
            <h2 className={`videos-title ${visibleSections.videosSection ? 'card-fade-in' : 'card-fade-out'}`}>
              <span className="videos-title-black">{pageT.videos.titleBlack}</span>{' '}
              <span className="videos-title-red">{pageT.videos.titleRed}</span>
            </h2>
            <div className={`videos-carousel-wrapper ${visibleSections.videosSection ? 'card-fade-in' : 'card-fade-out'}`} style={{ transitionDelay: '0.2s' }}>
              <button
                type="button"
                className="videos-carousel-btn videos-carousel-btn-prev"
                onClick={() => scrollVideos('prev')}
                aria-label={pageT.videos.prevAria}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div
                className="videos-carousel"
                ref={videosCarouselRef}
                role="region"
                aria-label={pageT.videos.regionAria}
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
                            title={video.title || `${pageT.videos.reelTitle} ${index + 1}`}
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
                aria-label={pageT.videos.nextAria}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        <section id="registration-form" ref={registrationSectionRef} className="registration-section">
          <div className="registration-container">
            <div className="registration-content">
              <div className={`registration-offer ${visibleSections.registrationSection ? 'card-fade-in' : 'card-fade-out'}`} style={{ transitionDelay: '0.1s' }}>
                <h2 className="offer-title">
                  {pageT.registration.offerTitle}
                </h2>
                <p className="offer-description">
                  {pageT.registration.offerDescription}
                </p>
                <ul className="offer-benefits">
                  {pageT.registration.benefits.map((benefit) => (
                    <li key={benefit} className="offer-benefit-item">
                      <span className="benefit-icon">•</span>
                      <span className="benefit-text">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <p className="offer-footer">
                  {pageT.registration.offerFooter}
                </p>
              </div>

              <div className={`registration-form-card ${visibleSections.registrationSection ? 'card-fade-in' : 'card-fade-out'}`} style={{ transitionDelay: '0.2s' }}>
                <h3 className="form-title">{pageT.registration.formTitle}</h3>
                <form className="registration-form" onSubmit={handleSubmit}>
                  {submitMessage.text && (
                    <div className={`form-message form-message-${submitMessage.type}`}>
                      {submitMessage.text}
                    </div>
                  )}
                  <input
                    type="text"
                    name="name"
                    placeholder={pageT.registration.inputs.name}
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    disabled={isSubmitting}
                  />
                  <input
                    type="number"
                    name="age"
                    placeholder={pageT.registration.inputs.age}
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
                      placeholder={pageT.registration.inputs.phone}
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="form-input form-input-phone"
                      disabled={isSubmitting}
                    />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder={pageT.registration.inputs.email}
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    disabled={isSubmitting}
                  />
                  <textarea
                    name="comment"
                    placeholder={pageT.registration.inputs.comment}
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
                            <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416;0 31.416" repeatCount="indefinite" />
                            <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416;-31.416" repeatCount="indefinite" />
                          </circle>
                        </svg>
                        {pageT.registration.submitting}
                      </>
                    ) : (
                      <>
                        {pageT.registration.submit}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M12 5L19 12L12 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
          aria-label={pageT.lightbox.imageDialogAria}
        >
          <button
            type="button"
            className="about-gallery-lightbox-close"
            onClick={() => setLightboxImage(null)}
            aria-label={pageT.lightbox.closeAria}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {lightboxIndex > 0 && (
            <button
              type="button"
              className="about-gallery-lightbox-prev"
              onClick={(e) => { e.stopPropagation(); lightboxPrev(); }}
              aria-label={pageT.lightbox.prevAria}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
          {lightboxIndex >= 0 && lightboxIndex < ABOUT_GALLERY_IMAGES.length - 1 && (
            <button
              type="button"
              className="about-gallery-lightbox-next"
              onClick={(e) => { e.stopPropagation(); lightboxNext(); }}
              aria-label={pageT.lightbox.nextAria}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
          <div className="about-gallery-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={lightboxImage} alt={pageT.lightbox.imageAlt} className="about-gallery-lightbox-img" />
          </div>
        </div>
      )}

      {/* Лайтбокс для сертификатов и виз (Natijalar) — только просмотр, без переключения */}
      {natijalarLightbox && (
        <div
          className="about-gallery-lightbox"
          onClick={() => setNatijalarLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label={pageT.lightbox.docDialogAria}
        >
          <button
            type="button"
            className="about-gallery-lightbox-close"
            onClick={() => setNatijalarLightbox(null)}
            aria-label={pageT.lightbox.closeAria}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="about-gallery-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={natijalarLightbox} alt={pageT.lightbox.docAlt} className="about-gallery-lightbox-img" />
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
              aria-label={pageT.lightbox.closeAria}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="thank-you-modal-content">
              <div className="thank-you-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="#10b981" strokeWidth="2" fill="#d1fae5" />
                  <path d="M8 12L11 15L16 9" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="thank-you-title">{pageT.thankYou.title}</h2>
              <p className="thank-you-message">
                {pageT.thankYou.message}
              </p>
              <p className="thank-you-description">
                {pageT.thankYou.description}
              </p>
              <button
                className="thank-you-button"
                onClick={() => setShowThankYouModal(false)}
              >
                {pageT.thankYou.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home({ locale = DEFAULT_LOCALE }) {
  const normalizedLocale = normalizeLocale(locale);
  const messages = getMessages(normalizedLocale);

  return (
    <I18nProvider locale={normalizedLocale} messages={messages}>
      <HomeContent locale={normalizedLocale} />
    </I18nProvider>
  );
}
