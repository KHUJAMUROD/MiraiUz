'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import './Footer.scss';
import Image from 'next/image';

const PdfModal = dynamic(
  () => import('@/components/PdfModal/PdfModal'),
  { ssr: false }
);

const MAP_URL = 'https://yandex.uz/maps/org/108643038759/';
const MAP_EMBED_URL = 'https://yandex.uz/map-widget/v1/?mode=search&oid=108643038759&ol=biz&z=16.5';

const PDF_LITSENZIYA = '/docs/MIRAI_LITSENZIYA.pdf';
const PDF_GUVOHNOMA = '/docs/MIRAI_GUVOHNOMA.pdf';

function preloadPdf(url) {
  fetch(url, { method: 'GET', mode: 'same-origin' }).catch(() => {});
}

export default function Footer() {
  const [pdfModal, setPdfModal] = useState(null);

  useEffect(() => {
    preloadPdf(PDF_LITSENZIYA);
    preloadPdf(PDF_GUVOHNOMA);
  }, []);
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="footer-brand-top">
              <div className="footer-brand-logo">
                <Image
                  src="/images/companyLogos/mirai_logo_sq.png"
                  alt="Mirai logo"
                  width={220}
                  height={104}
                  priority
                />
              </div>
              <div className="footer-brand-info">
                <h3 className="footer-brand-title">Mirai Japan Language Centre</h3>
              </div>
            </div>

            <div className="footer-docs">
              <button
                type="button"
                className="footer-doc-button"
                onClick={() => setPdfModal('litsenziya')}
              >
                Litsenziya
              </button>
              <button
                type="button"
                className="footer-doc-button"
                onClick={() => setPdfModal('guvohnoma')}
              >
                Guvohnoma
              </button>
            </div>
          </div>

          <div className="footer-contacts">
            <h4 className="footer-contacts-title">Kontaktlar</h4>
            <a href="tel:+998888930888" className="footer-contact-link">
              <span className="footer-contact-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 4H9L11 9L8.5 10.5C9.59 12.71 11.29 14.41 13.5 15.5L15 13L20 15V19C20 19.55 19.55 20 19 20C10.72 20 4 13.28 4 5C4 4.45 4.45 4 5 4Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              +998 (88) 893-08-88
            </a>
            <a href="tel:+998915470991" className="footer-contact-link">
              <span className="footer-contact-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 4H9L11 9L8.5 10.5C9.59 12.71 11.29 14.41 13.5 15.5L15 13L20 15V19C20 19.55 19.55 20 19 20C10.72 20 4 13.28 4 5C4 4.45 4.45 4 5 4Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              +998 (91) 547-09-91
            </a>  

            <div className="footer-links-row">
              <a href="https://t.me/mirai_uzyapontilicenter" className="footer-icon-link footer-icon-link--telegram" aria-label="Telegram" target="_blank" rel="noreferrer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 4L3 11L10 13.5M21 4L17 20L10 13.5M21 4L10 13.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/mirai_uz" className="footer-icon-link footer-icon-link--instagram" aria-label="Instagram" target="_blank" rel="noreferrer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="footer-instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f09433"/>
                      <stop offset="25%" stopColor="#e6683c"/>
                      <stop offset="50%" stopColor="#dc2743"/>
                      <stop offset="75%" stopColor="#cc2366"/>
                      <stop offset="100%" stopColor="#bc1888"/>
                    </linearGradient>
                  </defs>
                  <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#footer-instagram-gradient)" strokeWidth="1.7"/>
                  <circle cx="12" cy="12" r="4" stroke="url(#footer-instagram-gradient)" strokeWidth="1.7"/>
                  <circle cx="18" cy="6" r="1.2" fill="url(#footer-instagram-gradient)"/>
                </svg>
              </a>
              <a href="https://wa.me/998888930888" className="footer-icon-link footer-icon-link--whatsapp" aria-label="WhatsApp" target="_blank" rel="noreferrer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382C17.231 14.28 15.243 13.396 14.895 13.3C14.547 13.203 14.3 13.155 14.053 13.396C13.806 13.637 13.01 14.382 12.812 14.583C12.614 14.784 12.416 14.832 12.118 14.73C11.82 14.628 10.431 14.235 8.74 12.748C7.4 11.556 6.505 10.12 6.307 9.818C6.109 9.517 6.258 9.365 6.409 9.214C6.54 9.083 6.7 8.87 6.852 8.692C7.004 8.514 7.05 8.38 7.152 8.18C7.254 7.98 7.2 7.808 7.128 7.656C7.056 7.504 6.4 5.654 6.15 4.952C5.9 4.25 5.65 4.35 5.45 4.34C5.25 4.33 5.02 4.33 4.79 4.33C4.56 4.33 4.26 4.38 3.99 4.68C3.72 4.98 3 5.78 3 7.38C3 8.98 3.96 10.54 4.17 10.84C4.38 11.14 6.79 14.78 10.28 16.38C11.37 16.88 12.13 17.15 12.65 17.33C13.33 17.57 13.94 17.55 14.43 17.48C14.96 17.4 16.07 16.68 16.33 15.88C16.59 15.08 16.59 14.38 16.52 14.28C16.45 14.18 16.25 14.13 16.01 14.03L17.472 14.382Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 2C6.477 2 2 6.477 2 12C2 13.582 2.39 15.074 3.07 16.388L2 22L7.612 20.93C8.926 21.61 10.418 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href={MAP_URL} className="footer-location-link" target="_blank" rel="noreferrer">
                <span className="footer-contact-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21C12 21 19 15 19 10C19 6.13401 15.866 3 12 3C8.13401 3 5 6.13401 5 10C5 15 12 21 12 21Z" stroke="currentColor" strokeWidth="1.7"/>
                    <circle cx="12" cy="10" r="2.8" stroke="currentColor" strokeWidth="1.7"/>
                  </svg>
                </span>
                Location
              </a>
            </div>
            <a href="mailto:languagecentermirai.uz@gmail.com" className="footer-email-link">
              <span className="footer-contact-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              languagecentermirai.uz@gmail.com
            </a>
          </div>

          <div className="footer-map" aria-label="Mirai location map">
            <iframe
              className="footer-map-frame"
              src={MAP_EMBED_URL}
              title="Mirai on Yandex map"
              loading="lazy"
              allowFullScreen
            />
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            (c) 2025 Mirai. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </div>

      {pdfModal === 'litsenziya' && (
        <PdfModal
          isOpen={true}
          onClose={() => setPdfModal(null)}
          pdfSrc={PDF_LITSENZIYA}
          title="Litsenziya"
        />
      )}
      {pdfModal === 'guvohnoma' && (
        <PdfModal
          isOpen={true}
          onClose={() => setPdfModal(null)}
          pdfSrc={PDF_GUVOHNOMA}
          title="Guvohnoma"
        />
      )}
    </footer>
  );
}
