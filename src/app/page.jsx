import Header from '@/components/Header/header';
import './page.scss';

export default function Home() {
  return (
    <div className="page">
      <Header />
      
      <main className="main">
        <section className="hero">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <div className="hero-badge">
              JP 95% Viza ko'rsatkichi
            </div>
            
            <h1 className="hero-title">
              <span className="title-line-1">Kafolatli Viza</span>
              <span className="title-line-2">
                <span className="title-white">Yoki</span>{' '}
                <span className="title-red">Pulingiz</span>
              </span>
              <span className="title-line-3">
                <span className="title-red">Qaytariladi</span>
              </span>
            </h1>
            
            <p className="hero-description">
              3000+ o'quvchi allaqachon Yaponiyada. Orzuingizdagi o'qish va ishga biz bilan erishing.
            </p>
            
            <button className="hero-button">
              Bepul Konsultatsiya
            </button>
          </div>
          
          <div className="slider-controls">
            <button className="slider-button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="slider-indicators">
              <span className="indicator"></span>
              <span className="indicator"></span>
              <span className="indicator indicator-active"></span>
            </div>
            <button className="slider-button">
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
