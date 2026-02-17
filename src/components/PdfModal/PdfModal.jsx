'use client';

import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import './PdfModal.scss';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 2.5;
const ZOOM_STEP = 0.25;

export default function PdfModal({ isOpen, onClose, pdfSrc, title }) {
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setPageNumber(1);
      setNumPages(null);
      setLoading(true);
      setScale(1);
    }
  }, [isOpen, pdfSrc]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      const scrollY = window.scrollY;
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.touchAction = 'none';
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      const scrollY = document.body.style.top ? parseInt(document.body.style.top, 10) * -1 : 0;
      document.documentElement.style.overflow = '';
      document.documentElement.style.touchAction = '';
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      window.scrollTo(0, scrollY);
    };
  }, [isOpen, onClose]);

  const zoomIn = () => setScale((s) => Math.min(ZOOM_MAX, s + ZOOM_STEP));
  const zoomOut = () => setScale((s) => Math.max(ZOOM_MIN, s - ZOOM_STEP));

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  const prevPage = () => setPageNumber((p) => Math.max(1, p - 1));
  const nextPage = () => setPageNumber((p) => Math.min(numPages || 1, p + 1));

  if (!isOpen) return null;

  return (
    <div
      className="pdf-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="pdf-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pdf-modal-header">
          <h2 className="pdf-modal-title">{title}</h2>
          <button
            className="pdf-modal-close"
            onClick={onClose}
            aria-label="Yopish"
            type="button"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="pdf-modal-body">
          {loading && (
            <div className="pdf-modal-loading">
              <div className="pdf-modal-spinner" />
              <span>Yuklanmoqda...</span>
            </div>
          )}
          <div
            className="pdf-modal-pan"
            onCopy={(e) => e.preventDefault()}
            onCut={(e) => e.preventDefault()}
            onContextMenu={(e) => e.preventDefault()}
          >
            <div className="pdf-modal-pan-content">
              <Document
                file={pdfSrc}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={() => setLoading(false)}
                loading={null}
                className="pdf-modal-document"
              >
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  renderTextLayer={false}
                  renderAnnotationLayer={true}
                  className="pdf-modal-page"
                />
              </Document>
            </div>
          </div>
        </div>

        <div className="pdf-modal-nav">
          <div className="pdf-modal-zoom">
            <button
              type="button"
              className="pdf-modal-zoom-btn"
              onClick={zoomOut}
              disabled={scale <= ZOOM_MIN}
              aria-label="Kichiklashtirish"
            >
              −
            </button>
            <span className="pdf-modal-zoom-value">{Math.round(scale * 100)}%</span>
            <button
              type="button"
              className="pdf-modal-zoom-btn"
              onClick={zoomIn}
              disabled={scale >= ZOOM_MAX}
              aria-label="Kattalashtirish"
            >
              +
            </button>
          </div>
          {numPages !== null && numPages > 1 && (
            <div className="pdf-modal-page-nav">
            <button
              type="button"
              className="pdf-modal-nav-btn"
              onClick={prevPage}
              disabled={pageNumber <= 1}
              aria-label="Oldingi sahifa"
            >
              ← Oldingi
            </button>
            <span className="pdf-modal-page-info">
              Sahifa {pageNumber} / {numPages}
            </span>
            <button
              type="button"
              className="pdf-modal-nav-btn"
              onClick={nextPage}
              disabled={pageNumber >= numPages}
              aria-label="Keyingi sahifa"
            >
              Keyingi →
            </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
