// Default icon for each health concern, used when the admin hasn't uploaded a photo for it.
// Keyed by the concern's slug; anything unknown (e.g. a concern the admin adds later) gets a leaf.
const ICONS = {
  'sugar-management': <path d="M12 2.7l5.66 5.65a8 8 0 1 1-11.32 0z" />,
  'gym-fitness': <path d="M6.5 6.5v11M17.5 6.5v11M3 9.5v5M21 9.5v5M6.5 12h11" />,
  energy: <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />,
  'heart-health': <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />,
  'liver-health': <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4" />,
  'kids-nutrition': (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
    </>
  ),
  'daily-ayurveda-grocery': (
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10zM2 21c0-3 1.85-5.4 5.1-6 2.4-.5 4.9-2 5.9-3" />
  ),
  'skin-hair': (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </>
  ),
  'womens-health': (
    <>
      <circle cx="12" cy="9" r="5" />
      <path d="M12 14v7M9 18h6" />
    </>
  ),
};

const FALLBACK = ICONS['daily-ayurveda-grocery'];

export default function ConcernIcon({ slug }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true" className="concern-icon">
      {ICONS[slug] || FALLBACK}
    </svg>
  );
}
