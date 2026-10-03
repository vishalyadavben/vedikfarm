import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import client from '../../api/client';
import AdminNav from '../../components/AdminNav';

const emptyForm = { name: '', sortOrder: 0, active: true };

export default function AdminHealthConcernForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isEdit) return;
    client.get('/api/admin/health-concerns').then((res) => {
      const concern = res.data.find((c) => String(c.id) === id);
      if (concern) {
        setForm({ name: concern.name, sortOrder: concern.sortOrder, active: concern.active });
        setCurrentImageUrl(concern.imageUrl || '');
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
      const payload = { ...form, sortOrder: Number(form.sortOrder) };
      let concernId = id;
      if (isEdit) {
        await client.put(`/api/admin/health-concerns/${id}`, payload);
      } else {
        const res = await client.post('/api/admin/health-concerns', payload);
        concernId = res.data.id;
      }

      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        await client.post(`/api/admin/health-concerns/${concernId}/image`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      navigate('/admin/health-concerns');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <AdminNav />
      <h1>{isEdit ? 'Edit Health Concern' : 'Add Health Concern'}</h1>
      <form onSubmit={handleSubmit} className="admin-form">
        <label>Name<input value={form.name} onChange={(e) => update('name', e.target.value)} required /></label>
        <label>
          Sort Order (lower shows first in the Home page filter row)
          <input type="number" value={form.sortOrder} onChange={(e) => update('sortOrder', e.target.value)} required />
        </label>

        {currentImageUrl && (
          <div className="admin-gallery">
            <div className="admin-gallery-thumb">
              <img src={currentImageUrl} alt="" />
            </div>
          </div>
        )}
        <label>
          {currentImageUrl ? 'Replace Icon Image' : 'Icon Image'} (shown as a small circle in the filter row)
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
        </label>
        {!currentImageUrl && !imageFile && (
          <p className="hint-text">
            {isEdit
              ? 'No icon uploaded yet - a plain placeholder circle shows on the storefront until one is added.'
              : 'Save first, then come back to upload an icon - or save without one and add it later.'}
          </p>
        )}

        <label className="checkbox-label">
          <input type="checkbox" checked={form.active} onChange={(e) => update('active', e.target.checked)} />
          {' '}Active (visible on storefront)
        </label>
        {error && <p className="error-text">{error}</p>}
        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save Health Concern'}
        </button>
      </form>
    </div>
  );
}
