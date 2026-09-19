// Renders a real average rating (0 reviews shows "No ratings yet" rather than fake stars).
export default function StarRating({ avg = 0, count = 0, size }) {
  if (!count) {
    return <p className="rating-line rating-empty">No ratings yet</p>;
  }
  const numericAvg = Number(avg) || 0;
  const pct = Math.max(0, Math.min(5, numericAvg)) / 5 * 100;

  return (
    <p className={`rating-line${size === 'lg' ? ' rating-line-lg' : ''}`}>
      <span className="star-display" aria-label={`Rated ${numericAvg.toFixed(1)} out of 5`}>
        <span className="stars-empty">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
        <span className="stars-filled" style={{ width: `${pct}%` }}>&#9733;&#9733;&#9733;&#9733;&#9733;</span>
      </span>
      <span className="rating-count">{numericAvg.toFixed(1)} ({count})</span>
    </p>
  );
}
