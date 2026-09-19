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
  const [galleryImages, setGalleryImages] = useState([]);
  const [newGalleryFiles, setNewGalleryFiles] = useState([]);
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
    loadGallery(id);
  }, [id, isEdit]);

  function loadGallery(productId) {
    client.get(`/api/admin/products/${productId}/images`).then((res) => setGalleryImages(res.data)).catch(() => {});
  }

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

      for (const file of newGalleryFiles) {
        const formData = new FormData();
        formData.append('file', file);
        // eslint-disable-next-line no-await-in-loop
        await client.post(`/api/admin/products/${productId}/images`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      if (!isEdit && newGalleryFiles.length > 0) {
        // Stay on the form after creating so the admin can see/manage the gallery they just uploaded.
        navigate(`/admin/products/${productId}/edit`);
      } else {
        navigate('/admin/products');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteGalleryImage(imageId) {
    if (!isEdit) return;
    try {
      const res = await client.delete(`/api/admin/products/${id}/images/${imageId}`);
      setGalleryImages(res.data);
    } catch (err) {
      setError(err.message);
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
        <label>Main / Cover Image<input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} /></label>

        <label>
          Additional Gallery Images (you can select more than one)
          <input type="file" accept="image/*" multiple onChange={(e) => setNewGalleryFiles(Array.from(e.target.files))} />
        </label>
        <p className="hint-text">
          {isEdit
            ? 'New files are uploaded when you click Save Product below.'
            : 'Save the product first, then more gallery images can be uploaded here too - files picked now will upload right after this product is created.'}
        </p>

        {galleryImages.length > 0 && (
          <div className="admin-gallery">
            {galleryImages.map((img) => (
              <div className="admin-gallery-thumb" key={img.id}>
                <img src={img.imageUrl} alt="" />
                <button type="button" className="link-button" onClick={() => handleDeleteGalleryImage(img.id)}>Remove</button>
              </div>
            ))}
          </div>
        )}

        <label className="checkbox-label"><input type="checkbox" checked={form.active} onChange={(e) => update('active', e.target.checked)} /> Active (visible on storefront)</label>
        {error && <p className="error-text">{error}</p>}
        <button className="btn btn-primary" type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Save Product'}</button>
      </form>
    </div>
  );
}
