import { useEffect, useState } from 'react';
import client from '../../api/client';
import AdminNav from '../../components/AdminNav';

const empty = { label: '', linkUrl: '', startAt: '', endAt: '', enabled: false };

// The backend sends "2026-10-10T18:00:00"; <input type="datetime-local"> wants "2026-10-10T18:00".
const toInput = (v) => (v ? v.slice(0, 16) : '');
// ...and the backend wants seconds back.
const toApi = (v) => (v ? `${v}:00` : null);

export default function AdminSaleBanner() {
  const [form, setForm] = useState(empty);
  const [liveNow, setLiveNow] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function apply(data) {
    setForm({
      label: data.label || '',
      linkUrl: data.linkUrl || '',
      startAt: toInput(data.startAt),
      endAt: toInput(data.endAt),
      enabled: data.enabled,
    });
    setLiveNow(data.liveNow);
  }

  useEffect(() => {
    client.get('/api/admin/sale-banner').then((res) => apply(res.data)).catch((err) => setError(err.message));
  }, []);

  function update(field, value) {
    setSaved(false);
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaved(false);
    setSubmitting(true);
    try {
      const res = await client.put('/api/admin/sale-banner', {
        label: form.label,
        linkUrl: form.linkUrl,
        startAt: toApi(form.startAt),
        endAt: toApi(form.endAt),
        enabled: form.enabled,
      });
      apply(res.data);
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  let status = 'Off - the strip is not shown.';
  if (form.enabled && liveNow) status = 'Live now - visitors can see the countdown strip.';
  else if (form.enabled && form.startAt && new Date(form.startAt) > new Date()) status = 'Scheduled - it will appear automatically at the start time.';
  else if (form.enabled) status = 'On, but not showing - the end time has passed or is not set.';

  return (
    <div>
      <AdminNav />
      <h1>Sale Strip</h1>
      <p className="hint-text">
        A countdown strip shown at the very top of the site while a sale is on. It appears by itself at the start time and
        disappears when the countdown ends, or any time you switch it off. All times are Indian Standard Time (IST).
      </p>
      <p className={`sale-status ${form.enabled && liveNow ? 'sale-status-live' : ''}`}><strong>Status:</strong> {status}</p>

      <form className="admin-form" onSubmit={handleSubmit}>
        <label className="checkbox-label">
          <input type="checkbox" checked={form.enabled} onChange={(e) => update('enabled', e.target.checked)} />
          Sale is on (show the strip during the dates below)
        </label>
        <label>
          Text before the countdown
          <input required maxLength={150} value={form.label} onChange={(e) => update('label', e.target.value)} placeholder="Diwali Sale Ends in" />
        </label>
        <label>
          Starts (optional - leave empty to start right away)
          <input type="datetime-local" value={form.startAt} onChange={(e) => update('startAt', e.target.value)} />
        </label>
        <label>
          Ends (required)
          <input type="datetime-local" value={form.endAt} onChange={(e) => update('endAt', e.target.value)} />
        </label>
        <label>
          Link when clicked (optional)
          <input maxLength={300} value={form.linkUrl} onChange={(e) => update('linkUrl', e.target.value)} placeholder="/shop?category=healthy-combos" />
        </label>
        {error && <p className="error-text">{error}</p>}
        {saved && <p className="success-text">Saved.</p>}
        <button className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</button>
      </form>
    </div>
  );
}
