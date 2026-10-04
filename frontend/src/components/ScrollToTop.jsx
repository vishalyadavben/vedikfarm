import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// React Router swaps pages without a real page load, so the browser keeps the old scroll position
// (e.g. clicking a footer link from the bottom of a page opens the new page at the bottom too).
// Jump back to the top whenever the page itself changes. Only the path is watched, so changing a
// Shop filter or search (which only changes the ?query) does not yank the visitor to the top.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
