import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand">Vedik Farm</Link>
        <nav className="main-nav">
          <Link to="/shop">Shop</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          {isAdmin && <Link to="/admin/products">Admin</Link>}
        </nav>
        <div className="header-actions">
          <Link to="/cart" className="cart-link">Cart{itemCount > 0 ? ` (${itemCount})` : ''}</Link>
          {user ? (
            <>
              <Link to="/orders">My Orders</Link>
              <button className="link-button" onClick={logout}>Logout</button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
}
