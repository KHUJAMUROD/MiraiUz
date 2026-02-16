'use client';

import './HeroPage.scss';

const HERO_CONTENT = {
  title: 'Mirai sizning kelajagingiz',
  subtitle: 'Biz bilan kelajakni quring',
  description: "Ilhom, sifat va natija — Mirai bilan yangi bosqichni boshlang.",
  image: '/images/backgrounds/school_background.jpg',
  imageAlt: 'Mirai students learning'
};

export default function HeroPage() {
  return (
    <section id="hero" className="hero-main">
      <div className="hero-main__background">
        <span className="hero-main__shape hero-main__shape--pink" />
        <span className="hero-main__shape hero-main__shape--blue" />
        <span className="hero-main__shape hero-main__shape--green" />
      </div>

      <div className="hero-main__container">
        <div className="hero-main__media">
          <img src={HERO_CONTENT.image} alt={HERO_CONTENT.imageAlt} />
        </div>

        <div className="hero-main__content">
          <span className="hero-main__eyebrow">Mirai Academy</span>
          <h1 className="hero-main__title">{HERO_CONTENT.title}</h1>
          <p className="hero-main__subtitle">{HERO_CONTENT.subtitle}</p>
          <p className="hero-main__description">{HERO_CONTENT.description}</p>
        </div>
      </div>
    </section>
  );
}
