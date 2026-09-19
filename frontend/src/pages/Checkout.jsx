import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import client from '../api/client';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Checkout() {
  const { cart, refreshCart } = useCart();
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [addressId, setAddressId] = useState('');
  const [buyerGstin, setBuyerGstin] = useState('');
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    refreshCart();
    client.get('/api/addresses').then((res) => {
      setAddresses(res.data);
      const defaultAddr = res.data.find((a) => a.isDefault) || res.data[0];
      if (defaultAddr) setAddressId(defaultAddr.id);
    });
  }, [refreshCart]);

  async function handlePlaceOrder() {
    setError('');
    if (!addressId) {
      setError('Please add a shipping address first.');
      return;
    }

    setPlacing(true);
    try {
      const orderRes = await client.post('/api/orders', { addressId, buyerGstin: buyerGstin || null });
      const order = orderRes.data;

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError('Could not load the payment gateway. Please check your connection and try again.');
        setPlacing(false);
        return;
      }

      const razorpay = new window.Razorpay({
        key: order.razorpayKeyId,
        order_id: order.razorpayOrderId,
        amount: Math.round(order.total * 100),
        currency: 'INR',
        name: 'Vedik Farm',
        description: `Order ${order.orderNumber}`,
        prefill: { name: user?.name, email: user?.email },
        handler: async (response) => {
          try {
            await client.post('/api/payments/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
          } catch {
            // Even if this client-side verify call fails (dropped connection, tab closed),
            // the Razorpay webhook independently confirms the payment server-side - so we
            // still send the customer to their order, which will show PAID once it lands.
          }
          navigate(`/orders/${order.orderNumber}`);
        },
        modal: {
          ondismiss: () => setPlacing(false),
        },
      });

      razorpay.open();
    } catch (err) {
      setError(err.message);
      setPlacing(false);
    }
  }

  if (cart.items.length === 0) {
    return <p>Your cart is empty. <Link to="/shop">Continue shopping</Link>.</p>;
  }

  return (
    <div>
      <h1>Checkout</h1>

      <h2>Shipping Address</h2>
      {addresses.length === 0 ? (
        <p>You have no saved addresses. <Link to="/addresses">Add one</Link> before checking out.</p>
      ) : (
        <div className="address-choices">
          {addresses.map((a) => (
            <label key={a.id} className="address-choice">
              <input type="radio" name="address" checked={String(addressId) === String(a.id)}
                     onChange={() => setAddressId(a.id)} />
              {a.recipientName}, {a.line1}, {a.city}, {a.state} {a.pincode}
            </label>
          ))}
        </div>
      )}
      <p><Link to="/addresses">Manage addresses</Link></p>

      <label>
        GSTIN (optional, for a tax invoice)
        <input value={buyerGstin} onChange={(e) => setBuyerGstin(e.target.value)} placeholder="e.g. 27ABCDE1234F1Z5" />
      </label>

      <h2>Order Summary</h2>
      <ul>
        {cart.items.map((item) => (
          <li key={item.cartItemId}>{item.quantity} x {item.name} - Rs.{item.lineTotal}</li>
        ))}
      </ul>
      <p>Subtotal: Rs.{cart.subtotal}</p>
      <p className="hint-text">GST and shipping are calculated on the next step based on your address.</p>

      {error && <p className="error-text">{error}</p>}
      <button className="btn btn-primary" onClick={handlePlaceOrder} disabled={placing || addresses.length === 0}>
        {placing ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  );
}
