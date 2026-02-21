'use client';

import './HeroPage.scss';

const HERO_CONTENT = {
  title: 'Mirai sizning kelajagingiz',
  subtitle: 'Biz bilan kelajakni quring',
  description: "Ilhom, sifat va natija — Mirai bilan yangi bosqichni boshlang.",
  image: '/images/main_pics/main.webp',
  imageAlt: 'Mirai students learning'
};

export default function HeroPage() {
  return (
    <section id="hero" className="hero-main">
      <div className="hero-main__background" />

      <div className="hero-main__container">
        <div className="hero-main__media">
          <img src={HERO_CONTENT.image} alt={HERO_CONTENT.imageAlt} />
        </div>

        <div className="hero-main__content">
          <span className="hero-main__eyebrow">"Mirai JPN"</span>
          <h1 className="hero-main__title">{HERO_CONTENT.title}</h1>
          <p className="hero-main__subtitle">{HERO_CONTENT.subtitle}</p>
          <p className="hero-main__description">{HERO_CONTENT.description}</p>
        </div>
      </div>
    </section>
  );
}
