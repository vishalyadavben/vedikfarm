import { useCallback, useEffect, useRef, useState } from 'react';
import Sprig from './Sprig';
import client from '../api/client';

function Stars({ rating }) {
  return (
    <span className="testimonial-stars" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= rating ? 'is-filled' : ''} aria-hidden="true">&#9733;</span>
      ))}
    </span>
  );
}

/**
 * "What Do Our Customers Say" - a swipeable row of testimonial cards with arrows and dots.
 * Quotes, photos and ratings are managed by the admin (Admin > Testimonials); hidden when there are none.
 */
export default function Testimonials({ className = '' }) {
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(0);
  const [canScroll, setCanScroll] = useState(false);
  const trackRef = useRef(null);

  useEffect(() => {
    client.get('/api/testimonials').then((res) => setItems(res.data)).catch(() => {});
  }, []);

  // Distance between the start of one card and the next (card width + gap).
  const stepSize = useCallback(() => {
    const track = trackRef.current;
    const first = track?.children[0];
    const second = track?.children[1];
    if (!first) return 0;
    return second ? second.offsetLeft - first.offsetLeft : first.offsetWidth;
  }, []);

  const update = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setCanScroll(track.scrollWidth > track.clientWidth + 4);
    const step = stepSize();
    if (step > 0) setActive(Math.min(items.length - 1, Math.round(track.scrollLeft / step)));
  }, [items.length, stepSize]);

  useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [update]);

  function scrollToIndex(i) {
    const track = trackRef.current;
    if (track) track.scrollTo({ left: i * stepSize(), behavior: 'smooth' });
  }

  function scrollByCard(direction) {
    const track = trackRef.current;
    if (!track) return;
    // Wrap around at either end so the arrows never feel dead.
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    if (direction > 0 && atEnd) scrollToIndex(0);
    else if (direction < 0 && track.scrollLeft <= 4) track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
    else track.scrollBy({ left: direction * stepSize(), behavior: 'smooth' });
  }

  if (items.length === 0) return null;

  return (
    <section className={`testimonials-section sprig-host ${className}`}>
      <Sprig name="rice" side="left" />
      <Sprig name="grass" side="right" />
      <h2 className="testimonials-heading">What Do Our Customers Say</h2>

      <div className="testimonial-track" ref={trackRef} onScroll={update}>
        {items.map((t) => (
          <figure className="testimonial-card" key={t.id}>
            <blockquote>{t.quote}</blockquote>
            <figcaption className="testimonial-author">
              {t.imageUrl ? (
                <img src={t.imageUrl} alt={t.customerName} className="testimonial-avatar" />
              ) : (
                <span className="testimonial-avatar testimonial-avatar-fallback" aria-hidden="true">
                  {t.customerName.charAt(0)}
                </span>
              )}
              <span className="testimonial-author-text">
                <span className="testimonial-name">{t.customerName}</span>
                {t.city && <span className="testimonial-city">{t.city}</span>}
                <Stars rating={t.rating} />
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      {canScroll && (
        <div className="testimonial-controls">
          <button type="button" className="testimonial-arrow" onClick={() => scrollByCard(-1)} aria-label="Previous testimonial">&#8249;</button>
          <div className="testimonial-dots">
            {items.map((t, i) => (
              <button
                type="button"
                key={t.id}
                className={`testimonial-dot${i === active ? ' is-active' : ''}`}
                onClick={() => scrollToIndex(i)}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
          <button type="button" className="testimonial-arrow" onClick={() => scrollByCard(1)} aria-label="Next testimonial">&#8250;</button>
        </div>
      )}
    </section>
  );
}
