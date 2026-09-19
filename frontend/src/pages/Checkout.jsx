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
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [addressId, setAddressId] = useState('');
  const [buyerGstin, setBuyerGstin] = useState('');
  const [quote, setQuote] = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState('');
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    refreshCart();
    client.get('/api/addresses').then((res) => {
      setAddresses(res.data);
      const defaultAddr = res.data.find((a) => a.isDefault) || res.data[0];
      if (defaultAddr) setAddressId(defaultAddr.id);
    }).finally(() => setAddressesLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!addressId || cart.items.length === 0) {
      setQuote(null);
      return;
    }
    setQuoteLoading(true);
    setQuoteError('');
    client.get('/api/orders/quote', { params: { addressId } })
      .then((res) => setQuote(res.data))
      .catch((err) => {
        setQuote(null);
        setQuoteError(err.message);
      })
      .finally(() => setQuoteLoading(false));
  }, [addressId, cart.items]);

  async function handlePlaceOrder() {
    setError('');
    if (!addressId) {
      setError('Please select a shipping address first.');
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
        name: 'Vedik Farms',
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

      razorpay.on('payment.failed', () => {
        setError('Payment failed or was cancelled. You can try again.');
        setPlacing(false);
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

  const gstTotal = quote ? Number(quote.cgstAmount) + Number(quote.sgstAmount) + Number(quote.igstAmount) : 0;

  return (
    <div>
      <h1>Checkout</h1>

      <div className="checkout-layout">
        <div className="checkout-main">
          <section className="checkout-section">
            <h2>1. Shipping Address</h2>
            {addressesLoading ? (
              <p className="hint-text">Loading your addresses...</p>
            ) : addresses.length === 0 ? (
              <p>You have no saved addresses yet. <Link to="/addresses">Add one</Link> to continue.</p>
            ) : (
              <div className="address-choices">
                {addresses.map((a) => (
                  <label key={a.id} className={`address-card ${String(addressId) === String(a.id) ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="address"
                      checked={String(addressId) === String(a.id)}
                      onChange={() => setAddressId(a.id)}
                    />
                    <span>
                      <strong>{a.recipientName}</strong>{a.label ? ` (${a.label})` : ''}
                      {a.isDefault && <span className="address-default-badge">Default</span>}
                      <br />
                      {a.line1}{a.line2 ? `, ${a.line2}` : ''}, {a.city}, {a.state} {a.pincode}
                      <br />
                      Phone: {a.phone}
                    </span>
                  </label>
                ))}
              </div>
            )}
            <p><Link to="/addresses">Manage addresses</Link></p>
          </section>

          <section className="checkout-section">
            <h2>2. GST Invoice (Optional)</h2>
            <label>
              GSTIN
              <input value={buyerGstin} onChange={(e) => setBuyerGstin(e.target.value)} placeholder="e.g. 27ABCDE1234F1Z5" />
            </label>
            <p className="hint-text">Add your GSTIN here if you need it printed on the tax invoice.</p>
          </section>
        </div>

        <aside className="checkout-summary">
          <h2>Order Summary</h2>
          <ul className="checkout-summary-items">
            {cart.items.map((item) => (
              <li key={item.cartItemId}>
                <span>{item.name} <span className="hint-text">x{item.quantity}</span></span>
                <span>Rs.{item.lineTotal}</span>
              </li>
            ))}
          </ul>

          <div className="checkout-summary-totals">
            <div className="checkout-summary-row">
              <span>Subtotal</span>
              <span>Rs.{quote ? quote.subtotal : cart.subtotal}</span>
            </div>

            {!addressId && (
              <p className="hint-text">Select a shipping address above to see GST and shipping.</p>
            )}
            {quoteLoading && <p className="hint-text">Calculating GST and shipping...</p>}
            {quoteError && <p className="error-text">{quoteError}</p>}

            {quote && !quoteLoading && (
              <>
                <div className="checkout-summary-row">
                  <span>GST</span>
                  <span>Rs.{gstTotal.toFixed(2)}</span>
                </div>
                <div className="checkout-summary-row">
                  <span>Shipping</span>
                  <span>{Number(quote.shippingFee) === 0 ? 'Free' : `Rs.${quote.shippingFee}`}</span>
                </div>
                <div className="checkout-summary-row checkout-summary-total">
                  <span>Total</span>
                  <span>Rs.{quote.total}</span>
                </div>
              </>
            )}
          </div>

          {error && <p className="error-text">{error}</p>}
          <button
            className="btn btn-primary checkout-pay-btn"
            onClick={handlePlaceOrder}
            disabled={placing || addresses.length === 0 || !addressId}
          >
            {placing ? 'Processing...' : quote ? `Pay Rs.${quote.total}` : 'Pay Now'}
          </button>
          <p className="hint-text checkout-secure-note">Payments are processed securely via Razorpay.</p>
        </aside>
      </div>
    </div>
  );
}
