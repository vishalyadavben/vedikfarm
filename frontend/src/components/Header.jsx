import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import logoHeader from '../assets/logo-header.png';

function CartIcon() {
  return (
    <svg className="header-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className="header-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export default function Header() {
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand">
          <img src={logoHeader} alt="Vedik Farms - Milk Beyond Nutrition" className="brand-logo" />
        </Link>
        <nav className="main-nav">
          <Link to="/shop">Shop</Link>
          <Link to="/shop?category=healthy-combos">Combos</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          {isAdmin && <Link to="/admin/products">Admin</Link>}
        </nav>
        <div className="header-actions">
          <Link to="/cart" className="cart-link" aria-label="Cart">
            <CartIcon />
            <span className="header-action-label">Cart</span>
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>
          {user ? (
            <>
              <Link to="/orders" aria-label="My Orders">
                <UserIcon />
                <span className="header-action-label">My Orders</span>
              </Link>
              <button className="link-button" onClick={logout}>Logout</button>
            </>
          ) : (
            <Link to="/login" aria-label="Login">
              <UserIcon />
              <span className="header-action-label">Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
