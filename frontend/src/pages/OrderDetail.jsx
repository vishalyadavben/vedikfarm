import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import client from '../api/client';

export default function OrderDetail() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    client.get(`/api/orders/${orderNumber}`).then((res) => setOrder(res.data));
  }, [orderNumber]);

  if (!order) return <p>Loading...</p>;

  return (
    <div>
      <h1>Order {order.orderNumber}</h1>
      <p>Status: <strong>{order.status}</strong></p>

      <table className="cart-table">
        <thead><tr><th>Product</th><th>Qty</th><th>Total</th></tr></thead>
        <tbody>
          {order.items.map((item, idx) => (
            <tr key={idx}>
              <td>{item.productName} <span className="unit-label">{item.unitLabel}</span></td>
              <td>{item.quantity}</td>
              <td>Rs.{item.lineTotal}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>Subtotal: Rs.{order.subtotal}</p>
      <p>CGST: Rs.{order.cgstAmount} &middot; SGST: Rs.{order.sgstAmount} &middot; IGST: Rs.{order.igstAmount}</p>
      <p>Shipping: Rs.{order.shippingFee}</p>
      <p><strong>Total: Rs.{order.total}</strong></p>

      <h2>Shipping To</h2>
      <p>{order.shipName}<br />
        {order.shipLine1}{order.shipLine2 ? `, ${order.shipLine2}` : ''}<br />
        {order.shipCity}, {order.shipState} {order.shipPincode}<br />
        Phone: {order.shipPhone}</p>
    </div>
  );
}
