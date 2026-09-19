import { useEffect, useState } from 'react';
import client from '../../api/client';

const STATUSES = ['PENDING_PAYMENT', 'PAID', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  function load() {
    client.get('/api/admin/orders').then((res) => setOrders(res.data.content));
  }

  useEffect(load, []);

  async function updateStatus(orderNumber, status) {
    await client.patch(`/api/admin/orders/${orderNumber}/status`, { status });
    load();
  }

  return (
    <div>
      <h1>Orders</h1>
      <table className="admin-table">
        <thead>
          <tr><th>Order #</th><th>Total</th><th>Status</th><th>Ship To</th></tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.orderNumber}</td>
              <td>Rs.{o.total}</td>
              <td>
                <select value={o.status} onChange={(e) => updateStatus(o.orderNumber, e.target.value)}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
              <td>{o.shipName}, {o.shipCity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
