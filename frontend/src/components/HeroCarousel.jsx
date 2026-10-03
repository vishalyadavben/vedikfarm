import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import heroMilk from '../assets/hero-milk.jpg';
import heroGhee from '../assets/hero-ghee.jpg';

const SLIDES = [
  { id: 'milk', image: heroMilk, alt: 'Vedik Farm A2 Desi Cow Milk', link: '/shop?category=milk-products' },
  { id: 'ghee', image: heroGhee, alt: 'Vedik Farm Desi Cow Ghee', link: '/shop?category=milk-products' },
];

const AUTO_ADVANCE_MS = 5000;

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  const goTo = useCallback((i) => {
    setIndex(((i % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }, []);

  const next = useCallback(() => goTo(index + 1), [index, goTo]);
  const prev = useCallback(() => goTo(index - 1), [index, goTo]);

  const restartTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, AUTO_ADVANCE_MS);
  }, []);

  useEffect(() => {
    restartTimer();
    return () => clearInterval(timerRef.current);
  }, [restartTimer]);

  const handleArrowClick = (fn) => {
    fn();
    restartTimer();
  };

  return (
    <section className="hero-carousel" aria-label="Featured products">
      <div className="hero-carousel-track">
        {SLIDES.map((slide, i) => (
          <Link
            to={slide.link}
            className={`hero-slide${i === index ? ' is-active' : ''}`}
            key={slide.id}
            aria-hidden={i !== index}
            tabIndex={i === index ? 0 : -1}
          >
            <img src={slide.image} alt={slide.alt} />
          </Link>
        ))}
      </div>

      <button
        type="button"
        className="hero-carousel-arrow hero-carousel-arrow-prev"
        onClick={() => handleArrowClick(prev)}
        aria-label="Previous slide"
      >
        &#8249;
      </button>
      <button
        type="button"
        className="hero-carousel-arrow hero-carousel-arrow-next"
        onClick={() => handleArrowClick(next)}
        aria-label="Next slide"
      >
        &#8250;
      </button>

      <div className="hero-carousel-dots">
        {SLIDES.map((slide, i) => (
          <button
            type="button"
            key={slide.id}
            className={`hero-carousel-dot${i === index ? ' is-active' : ''}`}
            onClick={() => handleArrowClick(() => goTo(i))}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
