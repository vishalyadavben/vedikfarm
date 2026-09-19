import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { cart, refreshCart, updateCartItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) refreshCart();
  }, [user, refreshCart]);

  if (!user) {
    return (
      <div>
        <h1>Cart</h1>
        <p>Please <Link to="/login">log in</Link> to see your cart.</p>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div>
        <h1>Cart</h1>
        <p>Your cart is empty. <Link to="/shop">Continue shopping</Link>.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Cart</h1>
      <table className="cart-table">
        <thead>
          <tr><th>Product</th><th>Price</th><th>Quantity</th><th>Total</th><th></th></tr>
        </thead>
        <tbody>
          {cart.items.map((item) => (
            <tr key={item.cartItemId}>
              <td>{item.name} <span className="unit-label">{item.unitLabel}</span></td>
              <td>Rs.{item.unitPrice}</td>
              <td>
                <input type="number" min="0" max={item.availableStock} value={item.quantity}
                       onChange={(e) => updateCartItem(item.cartItemId, Number(e.target.value))} />
              </td>
              <td>Rs.{item.lineTotal}</td>
              <td><button className="link-button" onClick={() => updateCartItem(item.cartItemId, 0)}>Remove</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="cart-subtotal">Subtotal: Rs.{cart.subtotal}</p>
      <button className="btn btn-primary" onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
    </div>
  );
}
