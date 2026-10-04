import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

const emptyForm = { name: '', phone: '', dateOfBirth: '', heightCm: '', disease: '' };

function ageFromDob(dob) {
  if (!dob) return '';
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return '';
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const beforeBirthday = now.getMonth() < d.getMonth() || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate());
  if (beforeBirthday) age -= 1;
  return age >= 0 ? age : '';
}

export default function DieticianPlan() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [form, setForm] = useState(emptyForm);
  const [saved, setSaved] = useState(null);
  const [editing, setEditing] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm((f) => ({ ...f, name: f.name || user.name || '', phone: f.phone || user.phone || '' }));
    client.get('/api/dietician-plan').then((res) => {
      if (res.data) {
        setSaved(res.data);
        setEditing(false);
        setForm({
          name: res.data.name,
          phone: res.data.phone || user.phone || '',
          dateOfBirth: res.data.dateOfBirth,
          heightCm: res.data.heightCm,
          disease: res.data.disease || '',
        });
      }
    }).catch(() => {});
  }, [user]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await client.put('/api/dietician-plan', {
        name: form.name,
        phone: form.phone,
        dateOfBirth: form.dateOfBirth,
        heightCm: Number(form.heightCm),
        disease: form.disease,
      });
      setSaved(res.data);
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return null;

  return (
    <div className="dietician-page">
      <div className="dietician-offer">
        <span className="dietician-offer-tag">FREE</span>
        <p>Get your free dietician consultation worth Rs.1500</p>
      </div>
      <h1>My Dietician Plan</h1>
      <p className="dietician-intro">
        Tell us a little about yourself and our dietician will prepare a plan around your health needs.
      </p>

      {!user ? (
        <div className="dietician-login-prompt">
          <p>Please log in to claim your free consultation.</p>
          <Link to="/login" state={{ from: location }} className="btn btn-green">Log in to continue</Link>
          <p className="hint-text">New here? <Link to="/register">Create an account</Link></p>
        </div>
      ) : !editing && saved ? (
        <div className="dietician-summary">
          <p className="dietician-success">
            Thanks, {saved.name}! Your request is in - our dietician will get in touch with you soon.
          </p>
          <dl>
            <dt>Contact number</dt><dd>{saved.phone || '-'}</dd>
            <dt>Date of birth</dt><dd>{saved.dateOfBirth} (age {saved.age})</dd>
            <dt>Height</dt><dd>{saved.heightCm} cm</dd>
            <dt>Any disease</dt><dd>{saved.disease || 'None'}</dd>
          </dl>
          <button type="button" className="btn btn-secondary" onClick={() => setEditing(true)}>Update my details</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="dietician-form">
          <label>Name<input value={form.name} onChange={(e) => update('name', e.target.value)} required /></label>
          <label>
            Contact Number
            <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="e.g. 98765 43210" required />
          </label>
          <label>
            Date of Birth
            <input
              type="date"
              value={form.dateOfBirth}
              max={new Date().toISOString().slice(0, 10)}
              onChange={(e) => update('dateOfBirth', e.target.value)}
              required
            />
          </label>
          <label>
            Age
            <input value={ageFromDob(form.dateOfBirth)} readOnly placeholder="Calculated from your date of birth" />
          </label>
          <label>
            Height (cm)
            <input type="number" min="50" max="260" step="0.1" value={form.heightCm} onChange={(e) => update('heightCm', e.target.value)} required />
          </label>
          <label>
            Any Disease
            <textarea
              rows={3}
              value={form.disease}
              onChange={(e) => update('disease', e.target.value)}
              placeholder="e.g. diabetes, thyroid, high blood pressure - or leave blank if none"
            />
          </label>
          {error && <p className="error-text">{error}</p>}
          <button className="btn btn-green" type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Get My Free Consultation'}
          </button>
        </form>
      )}
    </div>
  );
}
