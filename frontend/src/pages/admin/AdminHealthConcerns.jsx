import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../../api/client';
import AdminNav from '../../components/AdminNav';

export default function AdminHealthConcerns() {
  const [concerns, setConcerns] = useState([]);

  function load() {
    client.get('/api/admin/health-concerns').then((res) => setConcerns(res.data));
  }

  useEffect(load, []);

  async function remove(id, name) {
    if (!confirm(`Delete "${name}"? It will also stop showing on any products tagged with it.`)) return;
    await client.delete(`/api/admin/health-concerns/${id}`);
    load();
  }

  return (
    <div>
      <AdminNav />
      <h1>Health Concerns</h1>
      <p className="hint-text">
        These show as the "Select Health Concern" filter on the Home page. Tag products under one or
        more of them from each product's edit page.
      </p>
      <Link to="/admin/health-concerns/new" className="btn btn-primary">Add Health Concern</Link>
      <table className="admin-table">
        <thead>
          <tr><th>Icon</th><th>Name</th><th>Sort Order</th><th>Active</th><th></th></tr>
        </thead>
        <tbody>
          {concerns.map((c) => (
            <tr key={c.id}>
              <td>
                {c.imageUrl ? (
                  <img src={c.imageUrl} alt="" className="admin-concern-thumb" />
                ) : (
                  <span className="admin-concern-thumb admin-concern-thumb-fallback">{c.name.charAt(0)}</span>
                )}
              </td>
              <td>{c.name}</td>
              <td>{c.sortOrder}</td>
              <td>{c.active ? 'Yes' : 'No'}</td>
              <td>
                <Link to={`/admin/health-concerns/${c.id}/edit`}>Edit</Link>
                {' | '}
                <button className="link-button" onClick={() => remove(c.id, c.name)}>Delete</button>
              </td>
            </tr>
          ))}
          {concerns.length === 0 && (
            <tr><td colSpan={5}>No health concerns yet - add the first one above.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
