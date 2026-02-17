import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header/header';
import './not-found.scss';

export default function NotFound() {
  return (
    <div className="not-found-page">
      <Header />
      <main className="not-found-main">
        <div className="not-found-bg">
          <div className="not-found-sakura not-found-sakura--1">桜</div>
          <div className="not-found-sakura not-found-sakura--2">花</div>
          <div className="not-found-sakura not-found-sakura--3">夢</div>
          <div className="not-found-sakura not-found-sakura--4">道</div>
          <div className="not-found-sakura not-found-sakura--5">明</div>
        </div>

        <div className="not-found-content">
          <div className="not-found-torii" aria-hidden="true">
            <div className="not-found-torii-top" />
            <div className="not-found-torii-pillar not-found-torii-pillar--left" />
            <div className="not-found-torii-pillar not-found-torii-pillar--right" />
          </div>

          <div className="not-found-code">404</div>
          <p className="not-found-kanji">迷い道 — mayoi michi</p>
          <p className="not-found-subtitle">Sahifa topilmadi</p>
          <p className="not-found-desc">
            Bu yo&apos;ldan chiqib ketgansiz. Keling, yaponcha &quot;mirai&quot; — kelajak — ga qaytamiz.
          </p>

          <div className="not-found-logo">
            <Image
              src="/images/companyLogos/mirai_logo_sq.png"
              alt="Mirai"
              width={140}
              height={66}
            />
          </div>

          <Link href="/" className="not-found-link">
            <span className="not-found-link-text">Bosh sahifaga qaytish</span>
            <span className="not-found-link-arrow">→</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
