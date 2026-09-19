import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import client from '../../api/client';

const emptyForm = { name: '', description: '', price: '', unitLabel: '', stockQty: 0, categoryId: '', gstRate: '0', active: true };

export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    client.get('/api/categories').then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    client.get('/api/admin/products').then((res) => {
      const product = res.data.content.find((p) => String(p.id) === id);
      if (product) {
        setForm({
          name: product.name,
          description: product.description || '',
          price: product.price,
          unitLabel: product.unitLabel || '',
          stockQty: product.stockQty,
          categoryId: product.categoryId || '',
          gstRate: product.gstRate,
          active: product.active,
        });
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
      const payload = { ...form, price: Number(form.price), stockQty: Number(form.stockQty), gstRate: Number(form.gstRate), categoryId: form.categoryId || null };
      let productId = id;
      if (isEdit) {
        await client.put(`/api/admin/products/${id}`, payload);
      } else {
        const res = await client.post('/api/admin/products', payload);
        productId = res.data.id;
      }

      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        await client.post(`/api/admin/products/${productId}/image`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      navigate('/admin/products');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1>{isEdit ? 'Edit Product' : 'Add Product'}</h1>
      <form onSubmit={handleSubmit} className="admin-form">
        <label>Name<input value={form.name} onChange={(e) => update('name', e.target.value)} required /></label>
        <label>Description<textarea value={form.description} onChange={(e) => update('description', e.target.value)} /></label>
        <label>Price (Rs.)<input type="number" step="0.01" min="0" value={form.price} onChange={(e) => update('price', e.target.value)} required /></label>
        <label>Unit (e.g. 500ml, 250g)<input value={form.unitLabel} onChange={(e) => update('unitLabel', e.target.value)} /></label>
        <label>Stock Quantity<input type="number" min="0" value={form.stockQty} onChange={(e) => update('stockQty', e.target.value)} required /></label>
        <label>
          Category
          <select value={form.categoryId} onChange={(e) => update('categoryId', e.target.value)}>
            <option value="">-- none --</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
        <label>
          GST Rate (%) - confirm the correct rate for this product with an accountant
          <input type="number" step="0.01" min="0" value={form.gstRate} onChange={(e) => update('gstRate', e.target.value)} required />
        </label>
        <label>Product Image<input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} /></label>
        <label className="checkbox-label"><input type="checkbox" checked={form.active} onChange={(e) => update('active', e.target.checked)} /> Active (visible on storefront)</label>
        {error && <p className="error-text">{error}</p>}
        <button className="btn btn-primary" type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Save Product'}</button>
      </form>
    </div>
  );
}
