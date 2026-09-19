import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    client.get('/api/orders').then((res) => setOrders(res.data.content));
  }, []);

  return (
    <div>
      <h1>My Orders</h1>
      {orders.length === 0 && <p>You haven't placed any orders yet.</p>}
      <ul className="order-list">
        {orders.map((o) => (
          <li key={o.id}>
            <Link to={`/orders/${o.orderNumber}`}>{o.orderNumber}</Link> - {o.status} - Rs.{o.total}
          </li>
        ))}
      </ul>
    </div>
  );
}
