import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../../api/client';
import AdminNav from '../../components/AdminNav';

export default function AdminTestimonials() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  function load() {
    client.get('/api/admin/testimonials').then((res) => setItems(res.data)).catch((err) => setError(err.message));
  }

  useEffect(load, []);

  async function move(id, direction) {
    try {
      const res = await client.post(`/api/admin/testimonials/${id}/move`, null, { params: { direction } });
      setItems(res.data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function toggleActive(t) {
    try {
      await client.put(`/api/admin/testimonials/${t.id}`, {
        quote: t.quote, customerName: t.customerName, city: t.city || '', rating: t.rating, sortOrder: t.sortOrder, active: !t.active,
      });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(t) {
    if (!confirm(`Delete the testimonial from ${t.customerName}?`)) return;
    await client.delete(`/api/admin/testimonials/${t.id}`);
    load();
  }

  return (
    <div>
      <AdminNav />
      <h1>Testimonials</h1>
      <p className="hint-text">
        Customer quotes (WhatsApp, calls, Google reviews...) shown under "What Our Customers Say" on the Home and About
        pages, in the order below. Hidden ones stay saved but aren't shown. Only add quotes customers have agreed to share.
      </p>
      <Link to="/admin/testimonials/new" className="btn btn-primary">Add Testimonial</Link>
      {error && <p className="error-text">{error}</p>}
      <table className="admin-table">
        <thead>
          <tr><th>Order</th><th>Photo</th><th>Quote</th><th>Customer</th><th>Rating</th><th>Visible</th><th></th></tr>
        </thead>
        <tbody>
          {items.map((t, i) => (
            <tr key={t.id}>
              <td className="testimonial-order">
                <button type="button" className="link-button" disabled={i === 0} onClick={() => move(t.id, 'up')} aria-label="Move up">&uarr;</button>
                <button type="button" className="link-button" disabled={i === items.length - 1} onClick={() => move(t.id, 'down')} aria-label="Move down">&darr;</button>
              </td>
              <td>
                {t.imageUrl ? <img src={t.imageUrl} alt="" className="admin-testimonial-thumb" /> : <span className="admin-concern-thumb admin-concern-thumb-fallback">{t.customerName.charAt(0)}</span>}
              </td>
              <td>{t.quote}</td>
              <td>{t.customerName}{t.city ? `, ${t.city}` : ''}</td>
              <td>{'★'.repeat(t.rating)}</td>
              <td>{t.active ? 'Yes' : 'Hidden'}</td>
              <td>
                <Link to={`/admin/testimonials/${t.id}/edit`}>Edit</Link>
                {' | '}
                <button className="link-button" onClick={() => toggleActive(t)}>{t.active ? 'Hide' : 'Show'}</button>
                {' | '}
                <button className="link-button" onClick={() => remove(t)}>Delete</button>
              </td>
            </tr>
          ))}
          {items.length === 0 && <tr><td colSpan={7}>No testimonials yet - add the first one above.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
