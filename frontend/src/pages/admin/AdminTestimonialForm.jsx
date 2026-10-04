import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import client from '../../api/client';
import AdminNav from '../../components/AdminNav';

const emptyForm = { quote: '', customerName: '', city: '', rating: 5, active: true };

export default function AdminTestimonialForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(emptyForm);
  const [sortOrder, setSortOrder] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isEdit) return;
    client.get('/api/admin/testimonials').then((res) => {
      const t = res.data.find((x) => String(x.id) === id);
      if (t) {
        setForm({ quote: t.quote, customerName: t.customerName, city: t.city || '', rating: t.rating, active: t.active });
        setSortOrder(t.sortOrder);
        setCurrentImageUrl(t.imageUrl || '');
      }
    });
  }, [id, isEdit]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload = { ...form, rating: Number(form.rating) };
      let testimonialId = id;
      if (isEdit) {
        await client.put(`/api/admin/testimonials/${id}`, { ...payload, sortOrder: sortOrder ?? 0 });
      } else {
        // New quotes go to the end of the list; reorder with the arrows afterwards.
        const list = await client.get('/api/admin/testimonials');
        const next = list.data.reduce((max, t) => Math.max(max, t.sortOrder), -1) + 1;
        const created = await client.post('/api/admin/testimonials', { ...payload, sortOrder: next });
        testimonialId = created.data.id;
      }

      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        await client.post(`/api/admin/testimonials/${testimonialId}/image`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      navigate('/admin/testimonials');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <AdminNav />
      <h1>{isEdit ? 'Edit Testimonial' : 'Add Testimonial'}</h1>
      <form onSubmit={handleSubmit} className="admin-form">
        <label>
          Customer's words
          <textarea rows={4} maxLength={1000} value={form.quote} onChange={(e) => update('quote', e.target.value)} required
            placeholder="Paste or type exactly what the customer said" />
        </label>
        <label>Customer name<input value={form.customerName} onChange={(e) => update('customerName', e.target.value)} required /></label>
        <label>City (optional)<input value={form.city} onChange={(e) => update('city', e.target.value)} placeholder="e.g. Mumbai" /></label>
        <label>
          Star rating
          <select value={form.rating} onChange={(e) => update('rating', e.target.value)}>
            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{'★'.repeat(n)} ({n})</option>)}
          </select>
        </label>

        {currentImageUrl && (
          <div className="admin-gallery">
            <div className="admin-gallery-thumb"><img src={currentImageUrl} alt="" /></div>
          </div>
        )}
        <label>
          {currentImageUrl ? 'Replace customer photo' : 'Customer photo (optional)'}
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
        </label>
        <p className="hint-text">Shown as a round picture on the card - use one the customer has agreed to share. Without a photo, their initial is shown.</p>

        <label className="checkbox-label">
          <input type="checkbox" checked={form.active} onChange={(e) => update('active', e.target.checked)} />
          {' '}Visible on the website
        </label>
        {error && <p className="error-text">{error}</p>}
        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save Testimonial'}
        </button>
      </form>
    </div>
  );
}
