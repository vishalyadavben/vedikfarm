import { useEffect, useState } from 'react';
import client from '../api/client';

const emptyForm = { label: '', recipientName: '', line1: '', line2: '', city: '', state: '', pincode: '', phone: '', isDefault: false };

export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  function load() {
    client.get('/api/addresses').then((res) => setAddresses(res.data));
  }

  useEffect(load, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await client.post('/api/addresses', form);
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(id) {
    await client.delete(`/api/addresses/${id}`);
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
            <button className="link-button" onClick={() => remove(a.id)}>Remove</button>
          </li>
        ))}
        {addresses.length === 0 && <p>No saved addresses yet.</p>}
      </ul>

      <h2>Add Address</h2>
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
        <button className="btn btn-primary" type="submit">Save Address</button>
      </form>
    </div>
  );
}
