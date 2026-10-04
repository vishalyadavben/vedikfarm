import { useEffect, useState } from 'react';
import client from '../../api/client';
import AdminNav from '../../components/AdminNav';

const STATUSES = ['NEW', 'CONTACTED', 'COMPLETED'];

export default function AdminDieticianRequests() {
  const [requests, setRequests] = useState([]);

  function load() {
    client.get('/api/admin/dietician-requests').then((res) => setRequests(res.data));
  }

  useEffect(load, []);

  async function updateStatus(id, status) {
    await client.patch(`/api/admin/dietician-requests/${id}/status`, { status });
    load();
  }

  return (
    <div>
      <AdminNav />
      <h1>Dietician Requests</h1>
      <p className="hint-text">Customers who filled the "My Dietician Plan" form for the free consultation.</p>
      <table className="admin-table">
        <thead>
          <tr><th>Name</th><th>Contact</th><th>DOB / Age</th><th>Height</th><th>Disease</th><th>Status</th></tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>{r.email}{r.phone ? <><br />{r.phone}</> : null}</td>
              <td>{r.dateOfBirth} ({r.age})</td>
              <td>{r.heightCm} cm</td>
              <td>{r.disease || '-'}</td>
              <td>
                <select value={r.status} onChange={(e) => updateStatus(r.id, e.target.value)}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
          {requests.length === 0 && <tr><td colSpan={6}>No requests yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
