import { useEffect, useState } from 'react';

// Floating "scroll to top" arrow - appears once the visitor has scrolled down a bit,
// so it doesn't clutter the page while they're already near the top.
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (!visible) return null;

  return (
    <button
      type="button"
      className="back-to-top"
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
    >
      &#8593;
    </button>
  );
}
