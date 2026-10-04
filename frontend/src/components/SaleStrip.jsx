import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';

const pad = (n) => String(n).padStart(2, '0');

/**
 * Countdown strip shown above everything while a sale is live (configured in Admin -> Sale Strip).
 * The backend decides whether it is live; the browser only runs the ticking clock and hides the strip
 * the moment the countdown reaches zero.
 */
export default function SaleStrip() {
  const [banner, setBanner] = useState(null);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    let cancelled = false;
    client.get('/api/sale-banner')
      .then((res) => {
        if (cancelled || !res.data?.live) return;
        // Correct for a wrong clock on the visitor's device by using the server's notion of "now".
        const offset = res.data.serverNowMillis - Date.now();
        setBanner({ ...res.data, offset });
      })
      .catch(() => { /* no strip is better than a broken one */ });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!banner) return undefined;
    const tick = () => setRemaining(banner.endsAtMillis - (Date.now() + banner.offset));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [banner]);

  if (!banner || remaining <= 0) return null;

  const total = Math.floor(remaining / 1000);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;

  const units = [
    ...(days > 0 ? [{ value: days, label: 'DD' }] : []),
    { value: hours, label: 'HH' },
    { value: minutes, label: 'MM' },
    { value: seconds, label: 'SS' },
  ];

  const content = (
    <>
      <span className="sale-strip-label">{banner.label}</span>
      <span className="sale-strip-timer" role="timer" aria-live="off">
        {units.map((u) => (
          <span className="sale-strip-unit" key={u.label}>
            <span className="sale-strip-num">{pad(u.value)}</span>
            <span className="sale-strip-unit-label">{u.label}</span>
          </span>
        ))}
      </span>
    </>
  );

  if (!banner.linkUrl) return <div className="sale-strip">{content}</div>;
  if (banner.linkUrl.startsWith('/')) return <Link to={banner.linkUrl} className="sale-strip">{content}</Link>;
  return <a href={banner.linkUrl} className="sale-strip">{content}</a>;
}
