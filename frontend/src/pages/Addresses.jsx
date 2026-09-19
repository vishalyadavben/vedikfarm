import { useEffect, useState } from 'react';
import client from '../api/client';

const emptyForm = { label: '', recipientName: '', line1: '', line2: '', city: '', state: '', pincode: '', phone: '', isDefault: false };

export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);

  function load() {
    client.get('/api/addresses').then((res) => setAddresses(res.data));
  }

  useEffect(load, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function startEdit(a) {
    setEditingId(a.id);
    setError('');
    setForm({
      label: a.label || '',
      recipientName: a.recipientName || '',
      line1: a.line1 || '',
      line2: a.line2 || '',
      city: a.city || '',
      state: a.state || '',
      pincode: a.pincode || '',
      phone: a.phone || '',
      isDefault: !!a.isDefault,
    });
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await client.put(`/api/addresses/${editingId}`, form);
      } else {
        await client.post('/api/addresses', form);
      }
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(id) {
    await client.delete(`/api/addresses/${id}`);
    if (editingId === id) cancelEdit();
    load();
  }

  return (
    <div>
      <h1>Your Addresses</h1>
      <ul className="address-list">
        {addresses.map((a) => (
          <li key={a.id}>
            <strong>{a.recipientName}</strong>{a.isDefault ? ' (default)' : ''}<br />
            {a.line1}{a.line2 ? `, ${a.line2}` : ''}, {a.city}, {a.state} {a.pincode}<br />
            Phone: {a.phone}
            <div className="address-actions">
              <button className="link-button" onClick={() => startEdit(a)}>Edit</button>
              <button className="link-button" onClick={() => remove(a.id)}>Remove</button>
            </div>
          </li>
        ))}
        {addresses.length === 0 && <p>No saved addresses yet.</p>}
      </ul>

      <h2>{editingId ? 'Edit Address' : 'Add Address'}</h2>
      <form onSubmit={handleSubmit} className="address-form">
        <label>Label (e.g. Home)<input value={form.label} onChange={(e) => update('label', e.target.value)} /></label>
        <label>Recipient Name<input value={form.recipientName} onChange={(e) => update('recipientName', e.target.value)} required /></label>
        <label>Address Line 1<input value={form.line1} onChange={(e) => update('line1', e.target.value)} required /></label>
        <label>Address Line 2<input value={form.line2} onChange={(e) => update('line2', e.target.value)} /></label>
        <label>City<input value={form.city} onChange={(e) => update('city', e.target.value)} required /></label>
        <label>State<input value={form.state} onChange={(e) => update('state', e.target.value)} required /></label>
        <label>Pincode<input value={form.pincode} onChange={(e) => update('pincode', e.target.value)} required /></label>
        <label>Phone<input value={form.phone} onChange={(e) => update('phone', e.target.value)} required /></label>
        <label className="checkbox-label"><input type="checkbox" checked={form.isDefault} onChange={(e) => update('isDefault', e.target.checked)} /> Set as default</label>
        {error && <p className="error-text">{error}</p>}
        <div className="address-form-actions">
          <button className="btn btn-primary" type="submit">{editingId ? 'Save Changes' : 'Save Address'}</button>
          {editingId && <button type="button" className="btn btn-secondary" onClick={cancelEdit}>Cancel</button>}
        </div>
      </form>
    </div>
  );
}
