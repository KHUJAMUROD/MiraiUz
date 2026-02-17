'use client';

import { useState } from 'react';
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

export default function Footer() {
  const [pdfModal, setPdfModal] = useState(null);
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
                Lisenziya
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
            <a href="tel:+998990000000" className="footer-contact-link">
              <span className="footer-contact-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 4H9L11 9L8.5 10.5C9.59 12.71 11.29 14.41 13.5 15.5L15 13L20 15V19C20 19.55 19.55 20 19 20C10.72 20 4 13.28 4 5C4 4.45 4.45 4 5 4Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              99-XXX-XX-XX
            </a>
            <a href="tel:+998880000000" className="footer-contact-link">
              <span className="footer-contact-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 4H9L11 9L8.5 10.5C9.59 12.71 11.29 14.41 13.5 15.5L15 13L20 15V19C20 19.55 19.55 20 19 20C10.72 20 4 13.28 4 5C4 4.45 4.45 4 5 4Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              88-XXX-XX-XX
            </a>

            <div className="footer-links-row">
              <a href="https://t.me" className="footer-icon-link" aria-label="Telegram" target="_blank" rel="noreferrer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 4L3 11L10 13.5M21 4L17 20L10 13.5M21 4L10 13.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
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
          title="Lisenziya"
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
