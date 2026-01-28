import './Header.scss';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <div className="logo-icon">
            <Image src="/images/logos/mirai_logo_sq.png" alt="logo" width={150} height={70} />
          </div>
          
        </div>
        
        <nav className="nav">
          <a href="#yaponiya" className="nav-link">Yaponiya</a>
          <a href="#afzalliklar" className="nav-link">Afzalliklar</a>
          <a href="#natijalar" className="nav-link">Natijalar</a>
        </nav>
        
        <button className="cta-button">Ariza qoldirish</button>
      </div>
    </header>
  );
}
