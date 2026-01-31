import './Footer.scss';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-left">
            <div className="footer-logo">
              <div className="footer-logo-icon">
                <Image 
                  src="/images/companyLogos/mirai_logo_sq.png" 
                  alt="Mirai Logo" 
                  width={60} 
                  height={60}
                  priority
                />
              </div>
            </div>
            <a href="#" className="footer-license">
              Litsenziya №02432
            </a>
          </div>

          <div className="footer-right">
            <div className="footer-social">
              <a href="#" className="social-link" aria-label="Telegram">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="#171717" strokeWidth="2" fill="none"/>
                  <path d="M8 12L16 8L12 16L10 12L8 12Z" fill="#171717"/>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="5" stroke="#171717" strokeWidth="2" fill="none"/>
                  <circle cx="12" cy="12" r="4" stroke="#171717" strokeWidth="2" fill="none"/>
                  <circle cx="17.5" cy="6.5" r="1.5" fill="#171717"/>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="YouTube">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.593 7.203C21.543 6.966 21.41 6.754 21.228 6.6C21.046 6.446 20.822 6.36 20.59 6.35C18.88 6.2 15.09 6 12 6C8.91 6 5.12 6.2 3.41 6.35C3.178 6.36 2.954 6.446 2.772 6.6C2.59 6.754 2.457 6.966 2.407 7.203C2.145 8.94 2 10.97 2 12C2 13.03 2.145 15.06 2.407 16.797C2.457 17.034 2.59 17.246 2.772 17.4C2.954 17.554 3.178 17.64 3.41 17.65C5.12 17.8 8.91 18 12 18C15.09 18 18.88 17.8 20.59 17.65C20.822 17.64 21.046 17.554 21.228 17.4C21.41 17.246 21.543 17.034 21.593 16.797C21.855 15.06 22 13.03 22 12C22 10.97 21.855 8.94 21.593 7.203Z" stroke="#171717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <path d="M10 15L15 12L10 9V15Z" fill="#171717"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2025 Mirai. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </div>
    </footer>
  );
}
