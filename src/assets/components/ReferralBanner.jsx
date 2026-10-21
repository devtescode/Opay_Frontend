import { useEffect, useState } from 'react';
import './UserDbpage/UserDb.css';

const slides = [
  {
    emoji: 'ðŸ’°',
    title: 'Cash up for grabs!',
    text: 'Invite friends and earn up to â‚¦5,600 Bonus',
  },
  {
    emoji: 'ðŸ”¥',
    title: 'Hot Deals Just for You!',
    text: 'Deposit â‚¦600, Get â‚¦40 Off Instantly!',
  },
];

const ReferralBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const slide = slides[currentSlide];

  return (
    <section className="opay-section" aria-live="polite">
      <div className="opay-promo opay-promo--accent">
        <span className="opay-promo__icon" aria-hidden="true">
          {slide.emoji}
        </span>
        <div>
          <p className="opay-promo__title">{slide.title}</p>
          <p className="opay-promo__text">{slide.text}</p>
        </div>
      </div>
    </section>
  );
};

export default ReferralBanner;
